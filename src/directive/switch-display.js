let parentCtx = {}
const childType = {
  display: 'display',
  occultation: 'occultation'
}
const eventType = {
  displayClick: `${childType.display}click`,
  occultationFocus: `${childType.occultation}focus`,
  childInserted: 'childinserted'
}
const keyCodes = {
  tab: 9,
  enter: 13
}

const displayClickMap = new Map()
const occultationFocusMap = new Map()
const childInsertedMap = new Map()

const rowCellList = []
let focusChild = {}

const getInput = (el) => {
  if (el.tagName === 'INPUT') {
    return el
  } else {
    for (let childNode of el.childNodes) {
      if (childNode.tagName === 'INPUT') {
        return childNode
      }
    }
  }
}

const controler = {
  inserted (el, bingding) {
    const hiddenOccultationCallback = bingding.value
    const switchRowCellShow = ({ row, type, isShow }) => {
      if (row === undefined || row >= rowCellList.length) {
        console.log('row invalid', row)
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
      if (isShow) {
        hiddenOccultationCallback(row)
      }
    }
    const focuesRowCell = (row, column) => {
      if (row >= rowCellList.length) {
        console.log('row invalid', row)
        return
      }
      const cell = rowCellList[row][column]
      const { input } = cell[childType.occultation]
      if (input) input.focus()
    }
    const focusRowFirstCell = (row) => {
      focuesRowCell(row, 0)
    }
    el.addEventListener(eventType.childInserted, ev => {
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
    })
    el.addEventListener(eventType.displayClick, ev => {
      const { child: { row, column } } = ev.detail
      if (focusChild.row !== undefined) {
        switchRowDisplayShow(focusChild.row, true)
      }
      switchRowDisplayShow(row, false)
      focuesRowCell(row, column)
    })
    el.addEventListener('keydown', ev => {
      const { keyCode } = ev
      const { el, isLastColumn, row, isShow } = focusChild
      if (((keyCode === keyCodes.tab && isLastColumn) || keyCode === keyCodes.enter) && el && isShow) {
        switchRowDisplayShow(row, true)
        switchRowDisplayShow(row + 1, false)
        if (keyCode === keyCodes.enter) {
          focusRowFirstCell(row + 1)
        }
      }
    }, true)
    el.addEventListener(eventType.occultationFocus, ev => {
      const { child } = ev.detail
      focusChild = child
    })
    document.addEventListener('click', ev => {
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
    }, true)
  },
  unbind (el) {
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
      input: getInput(el)
    }
    if (child.isDefaultHidden) {
      el.style.display = 'none'
    }

    if (child.isDefaultShow) {
      const displayClick = new CustomEvent(eventType.displayClick, {
        detail: {
          child
        }
      })
      displayClickMap.set(el, displayClick)
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
      occultationFocusMap.set(el, occultationFocus)
      child.input.addEventListener('focus', ev => {
        parentCtx.$el.dispatchEvent(occultationFocus)
      })
    }
    const childInserted = new CustomEvent(eventType.childInserted, {
      detail: {
        child
      }
    })
    childInsertedMap.set(el, childInserted)
    parentCtx.$el.dispatchEvent(childInserted)
  },
  unbind: function (el) {
  }
}

export {
  controler,
  child
}
