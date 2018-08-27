"use strict";
cc._RF.push(module, '2d49e5iUGhIF5y1YApOWuL7', 'els_view_block');
// script/ui/els_view_block.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        zhuBaoBlocks: [cc.Node],
        zhuBaoAnimations: [cc.Animation]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        //this.hideAllZhuBaoAnimation();
    },
    start: function start() {},


    // update (dt) {},
    showZhuBaoAnimationByIdx: function showZhuBaoAnimationByIdx(idx) {
        this.hideAllZhuBaoAnimation();
        this.zhuBaoBlocks[idx].active = true;
    },
    hideAllZhuBaoAnimation: function hideAllZhuBaoAnimation() {
        this.zhuBaoBlocks.forEach(function (n) {
            n.active = false;
        });
    }
});

cc._RF.pop();