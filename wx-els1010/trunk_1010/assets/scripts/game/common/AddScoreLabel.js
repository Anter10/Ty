let score_path = "prefabs/AddScoreLabel";

let AddScoreLabel = cc.Class({
    extends: cc.Component,

    properties: {
        addscoreLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    
    /**
     * @description 设置需要显示的添加的分数
     * @param {Number} score 添加的分数
     */
    setScore: function (score = 0) {
        this.addscoreLabel.string = "+"+score;
    },

    /**
     * @description 显示当前添加的分数
     */
    show: function () {
        let self = this;
        this.addscoreLabel.node.scale = 1;
        let scale = cc.scaleTo(0.3, 1.5);
        let delay = cc.delayTime(0.2);
        let hide = cc.scaleTo(0.2, 0);
        let call = cc.callFunc(function () {
            self.addscoreLabel.node.stopAllActions();
        })
        let seq = cc.sequence(scale, delay, hide, call);
        this.addscoreLabel.node.runAction(seq);
    },

    start() {

    },


    // update (dt) {},
});


module.exports = AddScoreLabel;