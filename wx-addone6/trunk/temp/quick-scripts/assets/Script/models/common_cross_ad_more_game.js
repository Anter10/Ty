(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/common_cross_ad_more_game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4106cZC1FBAOb/YQI17aDbP', 'common_cross_ad_more_game', __filename);
// Script/models/common_cross_ad_more_game.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.node.active = false;
        tywx.NotificationCenter.listen(tywx.EventType.GET_ADMANAGER_ICON_INFO_SUCCESS, this.onGetCrossAdInfoSuccess, this);
        if (tywx.AdManager.rawAdInfoList.length > 0) {
            this.onGetCrossAdInfoSuccess();
        }
    },
    onDestroy: function onDestroy() {
        tywx.NotificationCenter.ignoreScope(this);
    },
    start: function start() {},


    // update (dt) {},

    onGetCrossAdInfoSuccess: function onGetCrossAdInfoSuccess() {
        // ! 审核状态不显示
        if (tywx.ado.Configs.auditing || !tywx.ado.Configs.cross_ad_more_game) {
            this.node.active = false;
            return;
        }

        var ad_list = tywx.ado.Configs.cross_ad_more_game;
        var root = this.node.getChildByName('root');
        this.node.active = true;

        var _loop = function _loop(i) {
            var adNode = root.getChildByName('adNode_' + i);
            var adConfig = ad_list[i];
            if (adConfig && adNode) {
                adButton = adNode.getChildByName('adButton');

                adButton.on('click', function () {
                    tywx.ado.Utils.jump2MiniProgramByConfig(tywx.ado.Utils.getCrossAdConfigByAppId(adConfig.appid));
                });
                var spriteIco = adNode.getChildByName('adIcon').getComponent(cc.Sprite);
                cc.loader.load(tywx.SystemInfo.cdnPath + 'share_image/jiayi/daoliu/' + adConfig.icon_url, function (err, texture) {
                    if (!err) {
                        var new_sprite_frame = new cc.SpriteFrame(texture);
                        spriteIco.spriteFrame = new_sprite_frame;
                        spriteIco.node.setContentSize(cc.size(120, 120));
                        console.log("刷新CDN图片成功");
                    }
                });
                var nodeName = adNode.getChildByName('label_name');
                var label_name = nodeName.getComponent(cc.Label);
                if (label_name) {
                    label_name.string = adConfig.name;
                }
            }
        };

        for (var i = 0; i < 5; i++) {
            var adButton;

            _loop(i);
        }
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
        //# sourceMappingURL=common_cross_ad_more_game.js.map
        