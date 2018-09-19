"use strict";
cc._RF.push(module, '41198PQCWdHkJ2FEBJMemNa', 'GetMoneyButton');
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