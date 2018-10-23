"use strict";
cc._RF.push(module, '651edgqzv1FS6bk8Qdi0+Ok', 'symbol');
// scripts/game/libs/symbol.js

'use strict';

/**
 * 对于ES6中Symbol的极简兼容
 * 方便模拟私有变量
 */

var _Symbol = window.Symbol;
var idCounter = 0;

if (!_Symbol) {
  _Symbol = function _Symbol2(key) {
    return '__' + key + '_' + Math.floor(Math.random() * 1e9) + '_' + ++idCounter + '__';
  };

  _Symbol.iterator = _Symbol('Symbol.iterator');
}

window.Symbol = _Symbol;

cc._RF.pop();