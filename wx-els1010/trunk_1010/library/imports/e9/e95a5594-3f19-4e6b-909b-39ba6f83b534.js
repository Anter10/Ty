"use strict";
cc._RF.push(module, 'e95a5WUPxlOa5CbObpvg7U0', 'GetMoneyButton');
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