"use strict";
cc._RF.push(module, '10657U4/GlIA5rmnaDISOeC', 'lottery_item');
// scripts/game/lottery/lottery_item.js

'use strict';

/** 
 * @description 
 * created by gyc on 20181015
 */
var TAG = '[game/lottery/lottery_item.js]]';

cc.Class({
    extends: cc.Component,
    properties: {
        nameLabel: {
            default: null,
            type: cc.Label
        },
        icon: {
            default: null,
            type: cc.Sprite
        }

    },

    /**
     * @description 设置倒流的数据
     */
    setData: function setData(data) {
        this.data = data;
        this.flushIcon();
        this.flushName();
    },

    /** 
     * @description 刷新倒流图标 
     */
    flushIcon: function flushIcon() {
        var self = this;
        cc.loader.load('https://elsfkws.nalrer.cn/teris/lottery/' + this.data.icon, function (err, texture) {
            if (!err) {
                var new_sprite_frame = new cc.SpriteFrame(texture);
                self.icon.spriteFrame = new_sprite_frame;
                self.icon.node.setContentSize(cc.size(90, 90));
            } else {}
        });
    },

    /** 
     * @description 刷新倒流名称
     */
    flushName: function flushName() {
        this.nameLabel.string = this.data.name;
    }

});

cc._RF.pop();