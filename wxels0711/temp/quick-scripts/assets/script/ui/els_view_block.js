(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/els_view_block.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2d49e5iUGhIF5y1YApOWuL7', 'els_view_block', __filename);
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
        //# sourceMappingURL=els_view_block.js.map
        