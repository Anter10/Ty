(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/lottery/lottery_button.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9b5345xpA9NYbIFgQ1+60mM', 'lottery_button', __filename);
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
        //# sourceMappingURL=lottery_button.js.map
        