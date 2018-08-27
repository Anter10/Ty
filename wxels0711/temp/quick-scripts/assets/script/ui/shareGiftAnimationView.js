(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/shareGiftAnimationView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e0534ExQmhCR4IR94fQvehg', 'shareGiftAnimationView', __filename);
// script/ui/shareGiftAnimationView.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {

        spineAnimation: {
            default: null,
            type: sp.Skeleton
        },
        lableGiftContent: cc.Label,
        nodeContent: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.nodeContent.active = false;
        this.local = this.node.position;
    },
    start: function start() {
        var _this = this;

        this.spineAnimation.setStartListener(function (trackEntry) {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] start.", trackEntry.trackIndex, animationName);
        });
        this.spineAnimation.setInterruptListener(function (trackEntry) {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] interrupt.", trackEntry.trackIndex, animationName);
        });
        this.spineAnimation.setEndListener(function (trackEntry) {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] end.", trackEntry.trackIndex, animationName);
        });
        this.spineAnimation.setDisposeListener(function (trackEntry) {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] will be disposed.", trackEntry.trackIndex, animationName);
        });
        this.spineAnimation.setCompleteListener(function (trackEntry, loopCount) {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            _this.showContent();
        });
        this.spineAnimation.setEventListener(function (trackEntry, event) {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] event: %s, %s, %s, %s", trackEntry.trackIndex, animationName, event.data.name, event.intValue, event.floatValue, event.stringValue);
        });

        //this.showContent();
    },


    // update (dt) {},

    showContent: function showContent() {
        this.nodeContent.active = true;
    },
    init: function init(str_content) {
        this.lableGiftContent.string = str_content;
    },
    show: function show() {
        if (this.node.active) return;
        this.node.active = true;
        this.nodeContent.active = true;

        this.node.position = cc.pSub(this.local, cc.p(0, 300));
        var self = this;
        this.node.runAction(cc.moveBy(2, cc.p(0, 300)));
    },
    hide: function hide() {
        this.node.active = false;
        this.nodeContent.active = false;
        this.local ? this.node.position = this.local : this.local = this.node.position;
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
        //# sourceMappingURL=shareGiftAnimationView.js.map
        