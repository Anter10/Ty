(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/common/GetMoneyButton.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e95a5WUPxlOa5CbObpvg7U0', 'GetMoneyButton', __filename);
// scripts/game/common/GetMoneyButton.js

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
        console.log("money node scale = " + this.node.scale);
        this.showCall && this.showCall();
        tywx.tt.Utils.showRedPacketTransferPop(this.cash);
    },

    init: function init(cash) {
        this.cash = cash.max;
        this.labelMaxCash.string = "\xA5" + cash.max;
    },
    setShowCall: function setShowCall(sc) {
        this.showCall = sc;
    },


    statics: {
        addBtn: function addBtn(node) {}
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
        