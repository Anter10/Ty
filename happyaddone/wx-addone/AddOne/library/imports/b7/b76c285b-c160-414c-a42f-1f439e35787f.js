"use strict";
cc._RF.push(module, 'b76c2hbwWBBTKQvH0OeNXh/', 'ado_view_invite_gift');
// Script/models/ado_view_invite_gift.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.initRoot();
        if (cc.director.getScene()._name === 'gamestart') {
            tywx.ado.Utils.hideGameClub();
            var an = tywx.AdManager.getAdNodeByTag('GAME_START');
            if (an) an.hideAdNode();
        } else if (cc.director.getScene()._name === 'gamemain') {
            tywx.ado.Utils.hideWXBanner();
        }
    },
    onDestroy: function onDestroy() {
        if (cc.director.getScene()._name === 'gamestart') {
            tywx.ado.Utils.showGameClub();
            var an = tywx.AdManager.getAdNodeByTag('GAME_START');
            if (an) an.showAdNode();
            tywx.ado.Utils.hideWXBanner();
        } else if (cc.director.getScene()._name === 'gamemain') {
            tywx.ado.Utils.showWXBanner();
        }
    },
    start: function start() {
        if (this.root) {
            tywx.ado.Utils.commonScaleIn(this.root);
        }
    },


    //update (dt) {},
    btnInviteClick: function btnInviteClick() {
        console.log('btnInviteClick');
        var shareConfig = tywx.ado.Constants.ShareConfig.INVITE_FIREND_SHARE;
        var msg = tywx.ado.Utils.getRandomShareConfigByShareTag(shareConfig[0]);
        if (!msg) {
            msg = tywx.ado.Constants.DefaultShareConfig;
        }
        if (msg) {
            tywx.ShareInterface.share(msg.shareContent, msg.sharePicUrl, msg.sharePointId, msg.shareSchemeId, function (res) {
                console.log("分享成功后的数据" + JSON.stringify(res));
            }, function (data) {
                console.log("分享成功后的数2据" + JSON.stringify(data));
            });
        }
    },
    motai: function motai() {
        this.node.destroy();
    },
    btnCloseClick: function btnCloseClick() {
        this.node.destroy();
    },
    btnGetRewardClick: function btnGetRewardClick() {
        console.log('btnGetRewardClick');
        if (this.info.reward) {
            tywx.ado.Utils.showWXModal('已经领取过奖励', '提示', false);
        } else {
            tywx.ado.Utils.requestInviteReward();
        }
    },
    init: function init() {
        this.initRoot();
        var info = tywx.ado.InviteInfo;
        this.info = info;
        for (var i = 0; i < 5; ++i) {
            var tmp_item_name = 'node_invite_' + i;
            var tmp_item = this.root.getChildByName(tmp_item_name);
            var is_invited = info.invite_users[i] ? true : false;
            //is_invited = true;
            if (tmp_item) {
                var node_head = tmp_item.getChildByName('head_icon');
                var btn_invite = tmp_item.getChildByName('btn_invite');
                var btn_invite2 = tmp_item.getChildByName('head_bg');
                var node_nick_name = tmp_item.getChildByName('nick_name');
                //let label_nick_name = node_nick_name.getComponent(cc.Label);
                if (!is_invited) {
                    node_nick_name.active = false;
                } else {
                    (function () {
                        var usr_info = info.invite_users[i];
                        var sp_head = node_head.getComponent(cc.Sprite);
                        var tmp_texture = new cc.Texture2D();
                        btn_invite.active = false;
                        btn_invite2.active = false;
                        setTimeout(function () {
                            window.sharedCanvas.width = 160;
                            window.sharedCanvas.height = 200;
                            wx.postMessage({
                                method: 'render_invite_usr_info',
                                openId: usr_info.wxOpenId
                            });
                        }, i * 500);
                        setTimeout(function () {
                            var openDataContext = wx.getOpenDataContext();
                            var sharedCanvas = openDataContext.canvas;
                            tmp_texture.initWithElement(sharedCanvas);
                            tmp_texture.handleLoadedTexture();
                            sp_head.spriteFrame = new cc.SpriteFrame(tmp_texture);
                            console.log();
                        }, i * 500 + 400);
                    })();
                }
            }
        }
    },
    initRoot: function initRoot() {
        if (!this.root) this.root = this.node.getChildByName('root');
    }
});

cc._RF.pop();