(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/cross_ad/ad_node.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3b10czgt4RLwIvO+4T/hbMh', 'ad_node', __filename);
// scripts/game/cross_ad/ad_node.js

'use strict';

/** 
 * @description 
 * created by gyc on 20181012
 */
var TAG = '[game/cross_ad/ad_node.js]]';

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

    onLoad: function onLoad() {},


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
        cc.loader.load("https://elsfkws.nalrer.cn/teris/" + 'share_image/jiayi/daoliu/' + this.data.icon_url, function (err, texture) {
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
    },

    /** 
     * @description  跳转到对应的游戏
     */
    intoMiniPrograme: function intoMiniPrograme() {
        tywx.tt.Utils.jump2MiniProgramByConfig(tywx.tt.Utils.getCrossAdConfigByAppId(this.data.appid));
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
        //# sourceMappingURL=ad_node.js.map
        