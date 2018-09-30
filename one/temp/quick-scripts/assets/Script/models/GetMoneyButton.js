(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/GetMoneyButton.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '41198PQCWdHkJ2FEBJMemNa', 'GetMoneyButton', __filename);
// Script/models/GetMoneyButton.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        labelMaxCash: cc.Label
    },

    onLoad: function onLoad() {},


    /** 
     * @description 提现的时候调用
    */
    getMoneyCall: function getMoneyCall() {
        tywx.ado.Utils.showRedPacketTransferPop();
    },
    init: function init(cash) {
        this.labelMaxCash.string = "\xA5" + cash.max;
    }
});

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
        //# sourceMappingURL=GetMoneyButton.js.map
        