"use strict";
cc._RF.push(module, 'e49feEQuX1O5aCx0pZogEOE', 'els_gift_prop_view');
// script/ui/els_gift_prop_view.js

'use strict';

var ELSEvent = require('../core/ElsEvents.js');
var els = require('../core/els.js');
var ElsUtils = require('../core/ElsUtils.js');
cc.Class({
    extends: cc.Component,

    properties: {
        nodeGiftBox: cc.Node,
        nodeGiftProp: cc.Node,
        animGiftBox: cc.Animation,
        animGiftBoxRotate: cc.Animation,
        animGiftProp: cc.Animation,
        animGiftPropRotate: cc.Animation,
        nodePropDisplays: [cc.Node],
        nodeBtnClose: cc.Node,
        particlesInGiftBox: [cc.ParticleSystem],
        particlesInGiftProp: [cc.ParticleSystem]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.nodeGiftBox.active = false;
        this.nodeGiftProp.active = false;
        this.nodeBtnClose.active = false;
        this.isTouchEnable = true;

        var self = this;
        this.animGiftBox.on('finished', function (num, string) {
            console.log('show gift box finished', num, string);
            self.animGiftBoxRotate.play();
        }, this);
        this.animGiftProp.on('finished', function (num, string) {
            console.log('show gift box finished', num, string);
            self.animGiftPropRotate.play();
        }, this);
        // tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_ADD_ITEM_SUCCESS, this._MsgAddItem, this);
    },
    start: function start() {},
    showParticlesInGiftBox: function showParticlesInGiftBox() {
        this.particlesInGiftBox.forEach(function (particle) {
            particle.resetSystem();
        });
    },
    hideParticlesInGiftBox: function hideParticlesInGiftBox() {
        this.particlesInGiftBox.forEach(function (particle) {
            particle.stopSystem();
        });
    },
    showParticlesInGiftProp: function showParticlesInGiftProp() {
        this.particlesInGiftProp.forEach(function (particle) {
            particle.resetSystem();
        });
    },
    hideParticlesInGiftProp: function hideParticlesInGiftProp() {
        this.particlesInGiftProp.forEach(function (particle) {
            particle.stopSystem();
        });
    },
    _MsgAddItem: function _MsgAddItem(params) {
        // tywx.UserInfo.user_add_item = -1;
        // this.hideGiftBox();
        // this.showGiftProp();
        // let self = this;
        // let _sid = params.result.itemId;
        // this.nodePropDisplays.forEach(function (_node, _i) {
        //     let _s = tywx.UserInfo.local2Server(_i);
        //     _node.active = false;
        //     if (_sid.indexOf(_s) !== -1) { // 包含 item:1017 1017
        //         _node.active = true;
        //     }
        // });
        //! 添加道具
        // tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_ADD_PROP,params);
    },
    _locAddItem: function _locAddItem(_itemId) {
        this.hideGiftBox();
        this.showGiftProp();
        var self = this;
        // let _itemId = params.result.itemId;
        this.nodePropDisplays.forEach(function (_node, _i) {
            var _s = tywx.UserInfo.local2Server(_i);
            _node.active = false;
            if (parseInt(_s) === parseInt(_itemId)) {
                // 包含 item:1017 1017
                _node.active = true;
            }
        });
    },
    onDestroy: function onDestroy() {
        console.log('els_gift_prop_view   on destroy');
        // tywx.NotificationCenter.ignore(ELSEvent.ELS_EVENT_GIFT_PROP, this.onGiftProp, this);
        tywx.NotificationCenter.ignoreScope(this);
    },
    init: function init(game) {
        this.game = game;
        console.log('init els gift prop view ===>', this.game.config);
    },
    showGiftBox: function showGiftBox() {
        this.isTouchEnable = true;
        this.nodeGiftBox.active = true;
        this.nodeBtnClose.active = true;
        this.nodeGiftProp.active = false;
        this.animGiftBox.play();
        this.game.pauseGame();
        this.game.model.playMusic(els.ELS_VOICE.BOX_MUSIC, false);
        this.showParticlesInGiftBox();
    },
    hideGiftBox: function hideGiftBox() {
        this.isTouchEnable = false;
        this.nodeGiftBox.active = false;
        this.animGiftBox.stop();
        this.animGiftBoxRotate.stop();
        this.hideParticlesInGiftBox();
    },
    showGiftProp: function showGiftProp() {
        this.nodeGiftProp.active = true;
        this.animGiftProp.play();
        this.showParticlesInGiftProp();
    },
    hideGiftProp: function hideGiftProp() {
        this.nodeGiftProp.active = false;
        this.animGiftProp.stop();
        this.animGiftPropRotate.stop();
        this.hideParticlesInGiftProp();
    },

    // //! {type:0,num:1}
    // onGiftProp(param){
    //     this.hideGiftBox();
    //     this.showGiftProp();
    //     for(let prop of this.nodePropDisplays){
    //         prop.active = false;
    //     }
    //     this.nodePropDisplays[param.type].active = true;
    //     //! 添加道具
    //     tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_ADD_PROP,param);
    //
    // },
    onBtnShareBox: function onBtnShareBox() {
        console.log('onBtnShareBox===>', this.game.config);
        if (!this.isTouchEnable) return;
        this.isTouchEnable = false;
        if (els.CONFIG.openEmergency) {
            var self = this;
            tywx.ShareInterface.shareMsg({
                type: els.ELS_SHRAE_TYPE.SHARE_GIFT_PROP,
                successCallback: function successCallback(result) {
                    console.log('onBtnTestShare', result);
                    ElsUtils.isCanShare2GroupByTicket(els.SHARE_LOCK_TAG.TAG_REVIVE_AND_GIFT_PROP, result, function () {
                        console.log('onBtnShareBox===>分享成功');
                        var game = tywx.UIManager.game;
                        var is_endless = game.model.mconf.isEndless;
                        var _itemId = tywx.MSG.addItems(6, null, null, is_endless ? new Map([[1017, [0, 50]], [1018, [51, 60]], [1020, [61, 100]]]) : null);
                        if (tywx.TCPClient.connectStatus !== tywx.TCPClient.CONNECT_STATUS_OK) {
                            tywx.UserInfo.user_add_item = _itemId;
                        }
                        self._locAddItem(_itemId);
                    }, function () {
                        console.log('onBtnShareBox===>分享失败===.分享到不同的群');
                        tywx.Util.wechatShowModal("获得失败，请分享到不同群", false, "确认");
                        //self.onShareFailed();
                        self.isTouchEnable = true;
                    });
                },
                failCallback: function failCallback(result) {
                    self.isTouchEnable = true;
                    if (result.errMsg === "shareAppMessage:cancel") {
                        console.log("分享取消");
                        return;
                    }
                    console.log('分享失败');
                    self.onShareFailed();
                }
            });
        } else {
            //let _itemId = tywx.MSG.addItems(6);
            var game = tywx.UIManager.game;
            var is_endless = game.model.mconf.isEndless;
            var _itemId = tywx.MSG.addItems(6, null, null, is_endless ? new Map([[1017, [0, 50]], [1018, [51, 60]], [1020, [61, 100]]]) : null);

            this._locAddItem(_itemId);
        }
    },
    onShareFailed: function onShareFailed() {
        //! 显示关闭按钮
        this.nodeBtnClose.active = true;
    },
    onBtnShareProp: function onBtnShareProp() {
        //this.node.destroy();
        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_HIDE_GIFT_PROP, {});
        this.node.active = false;
        this.nodeBtnClose.active = false;
        // tywx.NotificationCenter.ignore(ELSEvent.ELS_EVENT_GIFT_PROP, this.onGiftProp, this);
    },


    // update (dt) {},
    motaiCallback: function motaiCallback() {}
});

cc._RF.pop();