(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/LianjiEffect.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fb82bav+VJES60BLAw68Zu/', 'LianjiEffect', __filename);
// Script/models/LianjiEffect.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        lianjiLabel: cc.Label,
        hideLabel: cc.Label
    },

    setNumber: function setNumber(number) {
        this.lianjiLabel.string = "" + number;
        this.hideLabel.string = "" + number;
    },

    setLianjiNode: function setLianjiNode(ljnode) {
        this.ljnode = ljnode;
    },

    onFinished: function onFinished() {
        this.node.active = false;
        tywx.gamecenter.putLianJiNode(this.ljnode);
    },

    play: function play() {
        if (!this.nodeAni) {
            this.nodeAni = this.node.getComponent(cc.Animation);
            this.nodeAni.play("lianji");
            this.nodeAni.on('finished', this.onFinished, this);
        } else {
            this.nodeAni.stop("lianji");
            this.node.scale = 0.8;
            this.node.active = true;
            this.nodeAni.play("lianji");
        }
    },

    start: function start() {}
}

// update (dt) {},
);

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
        //# sourceMappingURL=LianjiEffect.js.map
        