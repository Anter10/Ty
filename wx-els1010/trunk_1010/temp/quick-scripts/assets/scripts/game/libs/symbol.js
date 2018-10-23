(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/libs/symbol.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '651edgqzv1FS6bk8Qdi0+Ok', 'symbol', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=symbol.js.map
        