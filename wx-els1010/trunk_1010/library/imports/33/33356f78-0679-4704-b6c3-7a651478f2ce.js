"use strict";
cc._RF.push(module, '3335694BnlHBLbDemUUePLO', 'AddScoreLabel');
// scripts/game/common/AddScoreLabel.js

"use strict";

var score_path = "prefabs/AddScoreLabel";

var AddScoreLabel = cc.Class({
    extends: cc.Component,

    properties: {
        addscoreLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},


    /**
     * @description 设置需要显示的添加的分数
     * @param {Number} score 添加的分数
     */
    setScore: function setScore() {
        var score = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        this.addscoreLabel.string = "+" + score;
    },

    /**
     * @description 显示当前添加的分数
     */
    show: function show() {
        var self = this;
        this.addscoreLabel.node.scale = 1;
        var scale = cc.scaleTo(0.3, 1.5);
        var delay = cc.delayTime(0.2);
        var hide = cc.scaleTo(0.2, 0);
        var call = cc.callFunc(function () {
            self.addscoreLabel.node.stopAllActions();
        });
        var seq = cc.sequence(scale, delay, hide, call);
        this.addscoreLabel.node.runAction(seq);
    },

    start: function start() {}
}

// update (dt) {},
);

module.exports = AddScoreLabel;

cc._RF.pop();