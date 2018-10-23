"use strict";
cc._RF.push(module, '9b5345xpA9NYbIFgQ1+60mM', 'lottery_button');
// scripts/game/lottery/lottery_button.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        showLotteryButton: cc.Node
    },

    onLoad: function onLoad() {
        this.type = "home";
    },

    setType: function setType(ttype) {
        this.type = ttype;
    },

    showLottery: function showLottery() {
        tywx.tt.lottery.showLottery(this.type);
    },

    start: function start() {}

    // update (dt) {},
});

cc._RF.pop();