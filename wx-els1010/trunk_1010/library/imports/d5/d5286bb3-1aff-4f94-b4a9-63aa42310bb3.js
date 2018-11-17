"use strict";
cc._RF.push(module, 'd5286uzGv9PlLSpY6pCMQuz', 'tt_view_block');
// scripts/game/view/tt_view_block.js

'use strict';

var TAG = '[tt_view_block]';
cc.Class({
    extends: cc.Component,

    properties: {
        blink: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        //tywx.tt.log(TAG,'onLoad');
        this.mask = this.node.getChildByName('mask');
        // this.node.getChildByName('frame').opacity = 144;
        this.mask.active = false;
    },
    onEnable: function onEnable() {
        //tywx.tt.log(TAG,'onEnable');
    },
    start: function start() {
        //tywx.tt.log(TAG,'start');

    },


    blockBlink: function blockBlink() {
        this.blink.node.active = true;
        var scale1 = cc.scaleTo(0.5, 1.1);
        var scale2 = cc.scaleTo(0.5, 1);
        var seq = cc.sequence(scale1, scale2);
        var rep = cc.repeatForever(seq);
        this.blink.node.runAction(rep);
    },

    blockHide: function blockHide() {
        this.blink.node.active = false;
        this.blink.node.stopAllActions();
    },

    // update (dt) {},
    refresh: function refresh() {},
    setStat: function setStat(stat) {
        //tywx.tt.log(TAG,'setStat');        
        this.stat = stat;
        this.frameIdx = -1;
        this.init();
    },
    getStat: function getStat() {
        return this.stat;
    },
    hideBg: function hideBg() {
        this.node.getChildByName('bg').active = false;
    },
    setBgColor: function setBgColor(color) {
        // this.node.getChildByName('bg').color = color;
        // this.node.getChildByName('bg').opacity = 35;
        var self = this;
        if (color == 1) {
            cc.loader.loadRes('images/tt_blocks/greyblack', cc.SpriteFrame, function (err, sprite_frame) {
                if (!err) {
                    self.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = sprite_frame;
                } else {
                    tywx.tt.log(TAG, "ddda error");
                }
            });
        } else {
            cc.loader.loadRes('images/tt_blocks/hideblack', cc.SpriteFrame, function (err, sprite_frame) {
                if (!err) {
                    self.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = sprite_frame;
                } else {
                    tywx.tt.log(TAG, "ddda error");
                }
            });
        }
    },
    init: function init() {
        this.display = this.node.getChildByName('display');
        this.frame = this.node.getChildByName('frame');
        this.displaySprite = this.display.getComponent(cc.Sprite);
        this.frameSprite = this.frame.getComponent(cc.Sprite);

        if (this.stat === -1) {
            // * 显示选中框
            this.frame.active = true;
        } else if (this.stat === -2) {
            // * 隐藏选中框
            this.frame.active = false;
        } else if (this.stat === 0) {
            this.frame.active = false;
            this.display.active = false;
        } else {

            this.frame.active = false;
            this.display.active = true;
            this.frameIdx = this.stat;
            var self = this;
            cc.loader.loadRes('images/tt_blocks/b' + this.stat, cc.SpriteFrame, function (err, sprite_frame) {
                if (!err) {
                    self.displaySprite.spriteFrame = sprite_frame;
                } else {
                    tywx.tt.log(TAG, "ddda error");
                }
            });
            this.blinkDisplay();
        }
    },
    blinkDisplay: function blinkDisplay() {
        this.displaySprite.node.stopAllActions();
        if (this.stat == 12) {
            var scale1 = cc.scaleTo(0.6, 1.1);
            var scale2 = cc.scaleTo(0.6, 1);
            var seq = cc.sequence(scale1, scale2);
            var rep = cc.repeatForever(seq);
            this.displaySprite.node.runAction(rep);
        } else {
            this.displaySprite.node.scale = 1;
        }
    },
    showMask: function showMask() {
        this.mask.active = true;
    },
    hideMask: function hideMask() {
        this.mask.active = false;
    }
});

cc._RF.pop();