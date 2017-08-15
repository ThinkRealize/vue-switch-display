let parentCtx = {}
const childType = {
  display: 'display',
  occultation: 'occultation'
}
const eventType = {
  displayClicked: `${childType.display}clicked`,
  occultationFocus: `${childType.occultation}focus`,
  childInserted: 'childinserted'
}
const keyCodes = {
  tab: 9,
  enter: 13
}

let rowCellList = []
let focusChild = {}

let hiddenOccultation = null

const getInput = (el) => {
  if (el.tagName === 'INPUT') {
    return el
  } else {
    let input = null
    const getInput = (node) => {
      if (input) return
      let { tagName, children } = node
      if (tagName === 'INPUT') {
        input = node
        return
      }
      for (let child of children) {
        getInput(child)
      }
    }
    getInput(el)
    return input
  }
}

const switchRowCellShow = ({ row, type, isShow }) => {
  if (row === undefined || row >= rowCellList.length) {
    console.log('row invalid', row)
    focusChild = {}
    return
  }
  rowCellList[row].forEach((cell) => {
    const element = cell[type]
    if (isShow) {
      element.el.style = {}
      element.isShow = true
    } else {
      element.el.style.display = 'none'
      element.isShow = false
    }
  })
}
const switchRowDisplayShow = (row, isShow = false) => {
  let result = null
  if (isShow) {
    let result = hiddenOccultation(row)
    if (result === false) return
  }
  if (result instanceof Promise) {
    result.then(() => {
      switchRowCellShow({
        row,
        type: childType.display,
        isShow: isShow
      })
      switchRowCellShow({
        row,
        type: childType.occultation,
        isShow: !isShow
      })
    })
  } else {
    switchRowCellShow({
      row,
      type: childType.display,
      isShow: isShow
    })
    switchRowCellShow({
      row,
      type: childType.occultation,
      isShow: !isShow
    })
  }
}

const displayClicked = (ev) => {
  const { child: { row, column } } = ev.detail
  if (focusChild.row !== undefined) {
    switchRowDisplayShow(focusChild.row, true)
  }
  switchRowDisplayShow(row, false)
  focuesRowCell(row, column)
}

const occultationFocus = (ev) => {
  const { child } = ev.detail
  focusChild = child
}

const childInserted = (ev) => {
  const { child, child: { row, column, isDefaultShow, isDefaultHidden } } = ev.detail
  const cellList = rowCellList[row] ? rowCellList[row] : []
  const cell = cellList[column] ? cellList[column] : {}
  child.isLastRow = row === length - 1
  child.isLastCell = child.isLastColumn && child.isLastRow
  if (isDefaultShow) {
    cell[childType.display] = child
  }
  if (isDefaultHidden) {
    cell[childType.occultation] = child
  }
  cellList[column] = cell
  rowCellList[row] = cellList
}

const documentClick = (ev) => {
  let hidden = false
  for (let cellList of rowCellList) {
    for (let cell of cellList) {
      if (cell[childType.display].el === ev.target) {
        return
      }
      if (cell[childType.occultation].input !== ev.target) {
        hidden = true
      }
    }
  }
  if (hidden && focusChild.row !== undefined) {
    switchRowDisplayShow(focusChild.row, true)
    focusChild = {}
  }
}
const focuesRowCell = (row, column) => {
  if (row >= rowCellList.length) {
    console.log('row invalid', row)
    focusChild = {}
    return
  }
  const cell = rowCellList[row][column]
  const { input } = cell[childType.occultation]
  if (input) input.focus()
}
const focusRowFirstCell = (row) => {
  focuesRowCell(row, 0)
}

const keydown = (ev) => {
  const { keyCode } = ev
  const { el, isLastColumn, row, isShow } = focusChild
  if (((keyCode === keyCodes.tab && isLastColumn) || keyCode === keyCodes.enter) && el && isShow) {
    switchRowDisplayShow(row, true)
    switchRowDisplayShow(row + 1, false)
    if (keyCode === keyCodes.enter) {
      focusRowFirstCell(row + 1)
    }
  }
}

const controler = {
  inserted (el, bingding) {
    hiddenOccultation = bingding.value.hiddenOccultation
    el.addEventListener(eventType.childInserted, childInserted)
    el.addEventListener(eventType.displayClicked, displayClicked)
    el.addEventListener('keydown', keydown, true)
    el.addEventListener(eventType.occultationFocus, occultationFocus)
    document.addEventListener('click', documentClick, true)
  },
  unbind (el) {
    parentCtx = undefined
    rowCellList = undefined
    focusChild = undefined
    hiddenOccultation = undefined
    el.removeEventListener(eventType.childInserted, childInserted)
    el.removeEventListener(eventType.displayClicked, displayClicked)
    el.removeEventListener(eventType.occultationFocus, occultationFocus)
  }
}

const child = {
  inserted (el, bingding) {
    const { arg, value: { scope, order }, modifiers: { last = false } } = bingding
    parentCtx = scope.store.table
    let child = {
      el,
      row: scope.$index,
      column: order,
      type: arg,
      isDefaultShow: arg === childType.display,
      isDefaultHidden: arg === childType.occultation,
      isShow: arg === childType.display,
      isLastColumn: last,
      input: arg === childType.occultation ? getInput(el) : ''
    }
    if (child.isDefaultHidden) {
      el.style.display = 'none'
    }

    if (child.isDefaultShow) {
      const displayClick = new CustomEvent(eventType.displayClicked, {
        detail: {
          child
        }
      })
      el.addEventListener('click', ev => {
        parentCtx.$el.dispatchEvent(displayClick)
      })
    }

    if (child.isDefaultHidden && child.input) {
      const occultationFocus = new CustomEvent(eventType.occultationFocus, {
        detail: {
          child
        }
      })
      child.input.addEventListener('focus', ev => {
        parentCtx.$el.dispatchEvent(occultationFocus)
      })
    }
    const childInserted = new CustomEvent(eventType.childInserted, {
      detail: {
        child
      }
    })
    parentCtx.$el.dispatchEvent(childInserted)
  },
  unbind (el) {
  }
}

export {
  controler,
  child
}
