"use strict";
cc._RF.push(module, '74e4bmbWUhJLq/Dqfpq4ob8', 'MoreTanNumber');
// Script/models/MoreTanNumber.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        showNumber: {
            type: cc.Label,
            default: null
        },
        shareNode: {
            type: cc.Node,
            default: null
        },
        showdbSprite: {
            type: cc.Sprite,
            default: null
        },
        backSprite: {
            type: cc.Sprite,
            default: null
        },

        spriteFrames: {
            default: [],
            type: cc.SpriteFrame
        }

    },

    setShowNumber: function setShowNumber(shownum) {
        this.showNumber.string = shownum;
        this.setDbByIndex(shownum);
    },
    playAni: function playAni() {
        this.node.getComponent(cc.Animation).play("huode1");
    },

    close: function close() {
        this.node.active = false;
        if (this.clossc) {
            this.clossc();
        }
    },

    setCloseCall: function setCloseCall(clossc) {
        this.clossc = clossc;
    },

    onLoad: function onLoad() {
        // 设置分享点
        this.shareNode.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.FREE_GIFT_SHARE);
        this.backSprite.node.on('touchstart', function (event) {
            return true;
        });
    },


    getShareComponent: function getShareComponent() {
        return this.shareNode.getComponent("ShareButton");
    },

    setDbByIndex: function setDbByIndex(num) {
        if (num == 8) {
            this.showdbSprite.spriteFrame = this.spriteFrames[0];
        } else if (num == 9) {
            this.showdbSprite.spriteFrame = this.spriteFrames[1];
        } else {
            this.showdbSprite.spriteFrame = this.spriteFrames[2];
        }
    }

});

cc._RF.pop();