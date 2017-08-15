'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var parentCtx = {};
var childType = {
  display: 'display',
  occultation: 'occultation'
};
var eventType = {
  displayClicked: childType.display + 'clicked',
  occultationFocus: childType.occultation + 'focus',
  childInserted: 'childinserted'
};
var keyCodes = {
  tab: 9,
  enter: 13
};

var rowCellList = [];
var focusChild = {};

var hiddenOccultation = null;

var getInput = function getInput(el) {
  if (el.tagName === 'INPUT') {
    return el;
  } else {
    var input = null;
    var _getInput = function _getInput(node) {
      if (input) return;
      var tagName = node.tagName,
          children = node.children;

      if (tagName === 'INPUT') {
        input = node;
        return;
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _child = _step.value;

          _getInput(_child);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    };
    _getInput(el);
    return input;
  }
};

var switchRowCellShow = function switchRowCellShow(_ref) {
  var row = _ref.row,
      type = _ref.type,
      isShow = _ref.isShow;

  if (row === undefined || row >= rowCellList.length) {
    console.log('row invalid', row);
    focusChild = {};
    return;
  }
  rowCellList[row].forEach(function (cell) {
    var element = cell[type];
    if (isShow) {
      element.el.style = {};
      element.isShow = true;
    } else {
      element.el.style.display = 'none';
      element.isShow = false;
    }
  });
};
var switchRowDisplayShow = function switchRowDisplayShow(row) {
  var isShow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var result = null;
  if (isShow) {
    var _result = hiddenOccultation(row);
    if (_result === false) return;
  }
  if (result instanceof Promise) {
    result.then(function () {
      switchRowCellShow({
        row: row,
        type: childType.display,
        isShow: isShow
      });
      switchRowCellShow({
        row: row,
        type: childType.occultation,
        isShow: !isShow
      });
    });
  } else {
    switchRowCellShow({
      row: row,
      type: childType.display,
      isShow: isShow
    });
    switchRowCellShow({
      row: row,
      type: childType.occultation,
      isShow: !isShow
    });
  }
};

var displayClicked = function displayClicked(ev) {
  var _ev$detail$child = ev.detail.child,
      row = _ev$detail$child.row,
      column = _ev$detail$child.column;

  if (focusChild.row !== undefined) {
    switchRowDisplayShow(focusChild.row, true);
  }
  switchRowDisplayShow(row, false);
  focuesRowCell(row, column);
};

var occultationFocus = function occultationFocus(ev) {
  var child = ev.detail.child;

  focusChild = child;
};

var childInserted = function childInserted(ev) {
  var _ev$detail = ev.detail,
      child = _ev$detail.child,
      _ev$detail$child2 = _ev$detail.child,
      row = _ev$detail$child2.row,
      column = _ev$detail$child2.column,
      isDefaultShow = _ev$detail$child2.isDefaultShow,
      isDefaultHidden = _ev$detail$child2.isDefaultHidden;

  var cellList = rowCellList[row] ? rowCellList[row] : [];
  var cell = cellList[column] ? cellList[column] : {};
  child.isLastRow = row === length - 1;
  child.isLastCell = child.isLastColumn && child.isLastRow;
  if (isDefaultShow) {
    cell[childType.display] = child;
  }
  if (isDefaultHidden) {
    cell[childType.occultation] = child;
  }
  cellList[column] = cell;
  rowCellList[row] = cellList;
};

var documentClick = function documentClick(ev) {
  var hidden = false;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = rowCellList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var cellList = _step2.value;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = cellList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var cell = _step3.value;

          if (cell[childType.display].el === ev.target) {
            return;
          }
          if (cell[childType.occultation].input !== ev.target) {
            hidden = true;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  if (hidden && focusChild.row !== undefined) {
    switchRowDisplayShow(focusChild.row, true);
    focusChild = {};
  }
};
var focuesRowCell = function focuesRowCell(row, column) {
  if (row >= rowCellList.length) {
    console.log('row invalid', row);
    focusChild = {};
    return;
  }
  var cell = rowCellList[row][column];
  var input = cell[childType.occultation].input;

  if (input) input.focus();
};
var focusRowFirstCell = function focusRowFirstCell(row) {
  focuesRowCell(row, 0);
};

var keydown = function keydown(ev) {
  var keyCode = ev.keyCode;
  var _focusChild = focusChild,
      el = _focusChild.el,
      isLastColumn = _focusChild.isLastColumn,
      row = _focusChild.row,
      isShow = _focusChild.isShow;

  if ((keyCode === keyCodes.tab && isLastColumn || keyCode === keyCodes.enter) && el && isShow) {
    switchRowDisplayShow(row, true);
    switchRowDisplayShow(row + 1, false);
    if (keyCode === keyCodes.enter) {
      focusRowFirstCell(row + 1);
    }
  }
};

var controler = {
  inserted: function inserted(el, bingding) {
    hiddenOccultation = bingding.value.hiddenOccultation;
    el.addEventListener(eventType.childInserted, childInserted);
    el.addEventListener(eventType.displayClicked, displayClicked);
    el.addEventListener('keydown', keydown, true);
    el.addEventListener(eventType.occultationFocus, occultationFocus);
    document.addEventListener('click', documentClick, true);
  },
  unbind: function unbind(el) {
    parentCtx = undefined;
    rowCellList = undefined;
    focusChild = undefined;
    hiddenOccultation = undefined;
    el.removeEventListener(eventType.childInserted, childInserted);
    el.removeEventListener(eventType.displayClicked, displayClicked);
    el.removeEventListener(eventType.occultationFocus, occultationFocus);
  }
};

var child = {
  inserted: function inserted(el, bingding) {
    var arg = bingding.arg,
        _bingding$value = bingding.value,
        scope = _bingding$value.scope,
        order = _bingding$value.order,
        _bingding$modifiers$l = bingding.modifiers.last,
        last = _bingding$modifiers$l === undefined ? false : _bingding$modifiers$l;

    parentCtx = scope.store.table;
    var child = {
      el: el,
      row: scope.$index,
      column: order,
      type: arg,
      isDefaultShow: arg === childType.display,
      isDefaultHidden: arg === childType.occultation,
      isShow: arg === childType.display,
      isLastColumn: last,
      input: arg === childType.occultation ? getInput(el) : ''
    };
    if (child.isDefaultHidden) {
      el.style.display = 'none';
    }

    if (child.isDefaultShow) {
      var displayClick = new CustomEvent(eventType.displayClicked, {
        detail: {
          child: child
        }
      });
      el.addEventListener('click', function (ev) {
        parentCtx.$el.dispatchEvent(displayClick);
      });
    }

    if (child.isDefaultHidden && child.input) {
      var _occultationFocus = new CustomEvent(eventType.occultationFocus, {
        detail: {
          child: child
        }
      });
      child.input.addEventListener('focus', function (ev) {
        parentCtx.$el.dispatchEvent(_occultationFocus);
      });
    }
    var childInserted = new CustomEvent(eventType.childInserted, {
      detail: {
        child: child
      }
    });
    parentCtx.$el.dispatchEvent(childInserted);
  },
  unbind: function unbind(el) {}
};

exports.controler = controler;
exports.child = child;