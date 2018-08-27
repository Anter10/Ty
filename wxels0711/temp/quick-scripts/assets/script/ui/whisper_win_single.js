(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/whisper_win_single.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd5153oaFAhBdrtbAuQLqfHg', 'whisper_win_single', __filename);
// script/ui/whisper_win_single.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var ElsUtils = require("../core/ElsUtils.js");
var els = require("../core/els.js");
var ELSEvent = require("../core/ElsEvents.js");
cc.Class({
    extends: cc.Component,

    properties: {
        win_content: cc.Node,
        win_content_icon: cc.Sprite,
        user_win_content_icon: cc.Sprite,
        win_whisper_image: cc.Sprite,
        title: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {

        if (!this.isListen) {
            tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_CLEARN_GIFT, this.clearn_gift, this);
            tywx.NotificationCenter.listen(tywx.EventType.CMD_ELSWX, this._onMsgElsWx, this);
            this.isListen = true;
        }

        this.node.getChildByName('sShareBtn').on(cc.Node.EventType.TOUCH_END, this.onwinShareHandler, this);
        this.node.getChildByName('sSaveBtn').on(cc.Node.EventType.TOUCH_END, this.onwinSaveHandler, this);
        this.node.getChildByName('backBtn').on(cc.Node.EventType.TOUCH_END, this.dismiss_btn_click, this);

        this.win_content = this.node.getChildByName('whisper_win_content');
        this.win_content_icon = this.node.getChildByName('whisper_win_content_icon');
    },
    start: function start() {
        this.game = tywx.UIManager.game;
        this.model = this.game.model;
        var that = this;
        cc.loader.load('share_img/wisper_share.jpg', function (err, tex) {
            cc.log('Result should be a texture: ' + (tex instanceof cc.Texture2D));
            var spriteFrame = new cc.SpriteFrame(tex);
            that.win_whisper_image.getComponent('cc.Sprite').spriteFrame = spriteFrame;
        });
    },
    dismiss_btn_click: function dismiss_btn_click() {
        this.node.active = false;
        this.model.mconf.isWhisper = false;
        var _game = tywx.UIManager.getUI(els.ELS_GAME_LAYER.GAME_SINGLE).node.getComponent("gameSinglemode");
        _game.node.getChildByName("win_tips").active = false;
        tywx.UIManager.hideAllUI();
        tywx.UIManager.showUI(els.ELS_GAME_LAYER.HOMEPAGE);
        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_CLEARN_GIFT_PROP_ANIMATION);
        // this.node.destroyAllChildren();
        // this.node.removeAllChildren();
        // this.node.destroy();
    },


    // onDestroy() {
    //     tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_CLEARN_GIFT_PROP_ANIMATION);
    //     tywx.NotificationCenter.ignoreScope(this);
    // },

    clearn_gift: function clearn_gift() {
        this.showGif = false;
        this.showWithData2(this.win_content_data);
    },
    _onMsgElsWx: function _onMsgElsWx(params) {

        if (params.result.action === "whisperPass") {
            if (!tywx.UserInfo.showQuery) {
                return;
            }
            tywx.UserInfo.showQuery = undefined;
            if (params.result.status === 1) {
                var itemId = params.result.itemKindId;
                this.updateLocQuery(tywx.SECRETLANGUAGEDATA.randomKey, itemId);
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_SHOW_GIFT_PROP_ANIMATION, {
                    type: 2,
                    prop_id: itemId
                });

                this.showGif = true;
            } else {
                if (tywx.SECRETLANGUAGEDATA.randomKey) {
                    var ret = this.getLocQueryData(tywx.SECRETLANGUAGEDATA.randomKey);
                    if (ret && ret !== "") {
                        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_SHOW_GIFT_PROP_ANIMATION, {
                            type: 2,
                            prop_id: ret
                        });

                        this.showGif = true;
                    } else {
                        this.showWithData2(this.win_content_data);
                    }
                } else {
                    this.showWithData2(this.win_content_data);
                }
            }
            console.log("_onMsgElsWx::whisper_pass", JSON.stringify(params));
        }
    },


    updateLocQuery: function updateLocQuery(randomKey, itemId) {
        var _query_key = "SECRETLANGUAGEDATA";
        var querys = JSON.parse(ElsUtils.loadItem(_query_key, ''));
        var new_querys = []; //new Array();
        for (var i = 0; i < querys.length; i++) {
            var _tq = querys[i];
            if (_tq["randomKey"] === randomKey) {
                _tq["itemId"] = itemId;
            }
            new_querys.push(_tq);
        }
        ElsUtils.saveItem(_query_key, JSON.stringify(new_querys), true);
    },

    getLocQueryData: function getLocQueryData(randomKey) {
        var ret = "";
        var _query_key = "SECRETLANGUAGEDATA";
        var querys = JSON.parse(ElsUtils.loadItem(_query_key, ''));
        for (var i = 0; i < querys.length; i++) {
            var _tq = querys[i];
            if (_tq["randomKey"] === randomKey) {
                ret = _tq["itemId"] || "";
                break;
            }
        }
        return ret;
    },
    showGift: function showGift(itemId) {
        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_SHOW_GIFT_PROP_ANIMATION, {
            type: 0,
            prop_id: itemId
        });
    },
    showWithData: function showWithData(data) {
        if (!this.isListen) {
            tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_CLEARN_GIFT, this.clearn_gift, this);
            tywx.NotificationCenter.listen(tywx.EventType.CMD_ELSWX, this._onMsgElsWx, this);
            this.isListen = true;
        }
        this.win_content_data = data;
        if (tywx.SECRETLANGUAGEDATA) {
            var _sendUser = tywx.SECRETLANGUAGEDATA.inviteCode;
            var _uuid = tywx.SECRETLANGUAGEDATA.randomKey;
            tywx.MSG.whisperPass(_sendUser, _uuid);
        }

        var self = this;
        setTimeout(function () {
            self.showWithData2(data);
        }, 300);

        return;
    },
    showWithData2: function showWithData2(data) {

        if (this.showGif) {
            return;
        }
        this.showGif = true;

        tywx.UIManager.game.model.canelScheduleAd();
        tywx.AdManager.destroyBannerAd();

        // let title = this.win_content_data.title ? this.win_content_data.title: "恭喜通关";
        var title = "恭喜通关";
        this.title.getComponent("cc.Label").string = title;

        this.win_content_data = data;
        this.node.active = true;
        var _win_single = this.node;
        this.win_content.active = true;
        this.win_content.getComponent("cc.Label").string = this.win_content_data.data;
        var self = this;
        var openId = data.openId;
        if (this.openData) {
            this.openData.getComponent("OpenData").showQQHWin(openId);
        } else {
            var _self = this;
            cc.loader.loadRes('prefab/OpenData', function (err, prefab) {
                var preFabNode = cc.instantiate(prefab);
                _self.openData = preFabNode;
                preFabNode.parent = _self.node;
                preFabNode.getComponent("OpenData").showQQHWin(openId);
            });
        }

        //新的成功动画  个人
        var succ = _win_single.getChildByName("FangKuai_shengli");
        succ.getComponent(cc.Animation).play("FangKuai_shengli");
        //播放粒子
        var pcs = succ.getChildByName("particlesystem01").getComponent(cc.ParticleSystem);
        pcs.resetSystem();
    },
    onwinShareHandler: function onwinShareHandler(eve) {
        this.stopAllParticleSys();
        // 悄悄话通关 分享
        tywx.ShareInterface.shareMsg({
            type: els.ELS_SHRAE_TYPE.GAME_QQH_WIN
        });
    },
    stopAllParticleSys: function stopAllParticleSys() {
        //新的成功动画
        var succ = this.node.getChildByName("FangKuai_shengli");
        succ.getComponent(cc.Animation).play("FangKuai_shengli");
        //播放粒子
        var pcs2 = succ.getChildByName("particlesystem01").getComponent(cc.ParticleSystem);
        pcs2.stopSystem();
    },


    save: function save(params) {
        var canvas = cc.game.canvas;
        var _width = canvas.width;
        var _height = canvas.height;
        var self = this;
        self.title.node.active = false;
        var _y = _height < 1280 ? (_height - (1024 + 30) / 1280 * _height) / 2 : (_height - 1024) / 2 - 30;
        var _h = _height < 1280 ? (1024 - 30) / 1280 * _height : 1024;
        canvas.toTempFilePath({
            x: 72 * _width / 720,
            y: _y,
            width: 576 * _width / 720,
            height: _h,
            destWidth: 720,
            destHeight: 1280,
            success: function success(res) {
                console.log(res);
                ElsUtils.saveImage2PhoneByUrl(res.tempFilePath, params.success, params.fail);
                self.title.node.active = true;
            },
            fail: function fail(res) {
                self.title.active = true;
                params.fail && params.fail();
            }
        });
    },

    onwinSaveHandler: function onwinSaveHandler() {
        console.log("onwinSaveHandler");
        this.save({
            success: function success() {
                wx.hideLoading();
                wx.showToast({
                    title: '保存成功',
                    duration: 2000,
                    icon: null
                });
            },
            fail: function fail() {
                wx.hideLoading();
                wx.showToast({
                    title: '保存失败',
                    duration: 2000,
                    icon: null
                });
            }
        });
    }

    // update (dt) {},
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
        //# sourceMappingURL=whisper_win_single.js.map
        