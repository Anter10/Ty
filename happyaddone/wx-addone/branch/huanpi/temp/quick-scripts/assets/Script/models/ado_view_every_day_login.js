(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/ado_view_every_day_login.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1f1e6hP+KxBCLX2tnia3m53', 'ado_view_every_day_login', __filename);
// Script/models/ado_view_every_day_login.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        nodeWatchVideoToggle: cc.Node,
        nodeShareToggle: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.isWatchVideo = true;
        this.isShare = true;
        if (cc.director.getScene()._name === 'gamestart') {
            tywx.ado.Utils.hideGameClub();
            var an = tywx.AdManager.getAdNodeByTag('GAME_START');
            if (an) an.hideAdNode();
        } else if (cc.director.getScene()._name === 'gamemain') {
            //tywx.ado.Utils.hideWXBanner();
        }

        if (tywx.config.share_control.dailydouble === "video" || tywx.ado.isMinGanIP) {
            //this.isShare = false;
            if (!this.root) this.root = this.node.getChildByName('root');
            var toggle_share = this.root.getChildByName('toggle_share').getComponent(cc.Toggle);
            if (toggle_share) {
                toggle_share.isChecked = false;
                this.changeShareStat();
            }
            if (tywx.ado.isMinGanIP) {
                this.root.getChildByName('toggle_share').active = false;
            }
        }
    },
    start: function start() {
        tywx.ado.Utils.showWXBanner();
        tywx.ado.Utils.commonScaleIn(this.root);
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
        tywx.NotificationCenter.trigger(tywx.ado.Events.ADO_EVENT_DESTROY_EVERY_DAY_LOGIN, null);
    },


    // update (dt) {},
    btnClose: function btnClose() {
        this.node.destroy();
    },
    motai: function motai() {
        if (this.info.rewad) this.node.destroy();
    },
    itemTouched: function itemTouched(idx) {
        console.log('itemTouched', idx);
    },
    changeWatchVideoStat: function changeWatchVideoStat() {
        this.isWatchVideo = !this.isWatchVideo;
        if (!this.isWatchVideo) {
            this.nodeShareToggle.active = true;
            this.nodeWatchVideoToggle.active = false;
            this.isShare = true;
            var btn_get_label = this.root.getChildByName('btn_reward_double').getChildByName('label_reward').getComponent(cc.Label);
            if (btn_get_label) {
                btn_get_label.string = '加倍领取';
            }
        }
    },
    changeShareStat: function changeShareStat() {
        this.isShare = !this.isShare;
        var btn_get_label = this.root.getChildByName('btn_reward_double').getChildByName('label_reward').getComponent(cc.Label);
        var btn_get_label_shadow = this.root.getChildByName('btn_reward_double').getChildByName('label_reward_shadow').getComponent(cc.Label);
        if (!this.isShare) {
            if (btn_get_label) {
                btn_get_label.string = '视频加倍';
                btn_get_label_shadow.string = '视频加倍';
            }
        } else {
            if (btn_get_label) {
                btn_get_label.string = '加倍领取';
                btn_get_label_shadow.string = '加倍领取';
            }
        }
    },
    getReward: function getReward() {
        var self = this;
        if (this.info.rewad) {
            console.log('已经领取奖励');
            tywx.ado.Utils.showWXModal('已经领取奖励', '提示', false);
        } else {
            if (this.isShare) {
                window.wx.showShareMenu({ withShareTicket: true });
                var shareConfig = tywx.ado.Constants.ShareConfig.EVERY_DAY_GIFT_DOUBLE_SHARE;
                var msg = tywx.ado.Utils.getRandomShareConfigByShareTag(shareConfig[0]);
                if (!msg) {
                    msg = {};
                    msg.shareContent = "你知道 +1 吗？";
                    msg.sharePicUrl = "https://marketqn.nalrer.cn/teris/share_image/jiayi/jy03.jpg";
                    msg.sharePointId = "766";
                    msg.shareSchemeId = "1155";
                }
                if (msg) {
                    tywx.ShareInterface.share(msg.shareContent, msg.sharePicUrl, msg.sharePointId, msg.shareSchemeId, function (res) {
                        console.log("分享成功后的数据" + JSON.stringify(res));
                        // * is share to group
                        if (shareConfig && shareConfig[1]) {
                            // * froce share to group
                            if (res.shareTickets !== undefined && res.shareTickets.length > 0) {
                                tywx.ado.Utils.share2GroupByTicket(shareConfig[0], res, function () {
                                    // * success callback
                                    self.showOpenRedPacket(true);
                                }, function () {
                                    // * failed callback
                                    tywx.ado.Utils.showWXModal('请分享到不同群');
                                });
                            } else {
                                // * failed
                                tywx.ado.Utils.showWXModal('请分享到群');
                            }
                        } else {
                            // * success
                            self.showOpenRedPacket(true);
                        }
                    }, function (data) {
                        console.log("分享成功后的数2据" + JSON.stringify(data));
                    });
                }
            } else {
                tywx.ado.Utils.showWXVideo({
                    success: function success() {
                        self.showOpenRedPacket(true);
                    },
                    fail: function fail() {},
                    error_callback: function error_callback() {
                        self.showOpenRedPacket(true);
                    }
                });
            }
        }
    },
    btnGetRewardWithoutShareAndVideo: function btnGetRewardWithoutShareAndVideo() {
        this.showOpenRedPacket();
    },
    showOpenRedPacket: function showOpenRedPacket() {
        var is_double = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        this.node.destroy();
        cc.loader.loadRes('prefabs/OpenRedPackView_2', function (err, prefab) {
            if (!err) {
                var prefabNode = cc.instantiate(prefab);
                cc.game.addPersistRootNode(prefabNode);
                prefabNode.x = 360;
                prefabNode.y = 720;
                tywx.ado.Utils.hideWXBanner();
                prefabNode.getComponent('OpenRedPackView_2').showUI();
                prefabNode.getComponent('OpenRedPackView_2').init(is_double);
            }
        });
    },
    init: function init() {
        var info = tywx.ado.EveryDataLoginInfo;
        this.root = this.node.getChildByName('root');
        this.info = info;
        var btn_get_label = this.root.getChildByName('btn_reward_double').getChildByName('label_reward').getComponent(cc.Label);
        var btn_get_label_shadow = this.root.getChildByName('btn_reward_double').getChildByName('label_reward_shadow').getComponent(cc.Label);
        if (btn_get_label) {
            btn_get_label.string = info.rewad ? '已领取' : this.isShare ? '加倍领取' : '视频加倍';
            btn_get_label_shadow.string = info.rewad ? '已领取' : this.isShare ? '加倍领取' : '视频加倍';
            this.root.getChildByName('toggle_share').active = !info.rewad;
            this.root.getChildByName('btn_reward').active = !info.rewad;
            if (tywx.ado.isMinGanIP) {
                this.root.getChildByName('toggle_share').active = false;
            }
        }
        for (var i = 0; i < 7; i++) {
            var child_name = 'node_icon_' + i;
            var node_icon = this.root.getChildByName(child_name);
            if (node_icon) {
                var mask = node_icon.getChildByName('mask');
                var node_count = node_icon.getChildByName('label_count');
                var label_count = node_count.getComponent(cc.Label);
                var bg = node_icon.getChildByName('sprite_icon');
                var amount = info.amounts[i] >= 0 ? info.amounts[i] : -info.amounts[i];
                label_count.string = '\xA5' + tywx.ado.Utils.formatCashFen2Yuan(amount);
                if (i === info.count - 1) {
                    mask.active = false;
                    node_count.active = info.rewad;
                } else {
                    mask.active = true;
                    bg.active = false;
                    if (i > info.count - 1) {
                        node_count.active = false;
                    } else {
                        node_count.active = true;
                    }
                }
            }
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
        //# sourceMappingURL=ado_view_every_day_login.js.map
        