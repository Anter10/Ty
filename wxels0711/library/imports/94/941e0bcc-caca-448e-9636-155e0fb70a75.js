"use strict";
cc._RF.push(module, '941e0vMyspEjpY2FV4Ptwp1', 'select_gift');
// script/ui/select_gift.js

"use strict";

var ELSEvent = require("../core/ElsEvents.js");
var els = require("../core/els.js");

cc.Class({
    extends: cc.Component,

    properties: {
        no_gift_tips: cc.Sprite,
        gift_item: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.showWithData(tywx.StoreList.gs);
        this.no_gift_tips.node.active = true;
        // 监听点击事件 刷新
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_SELECT_GIFT, this.updateUI, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_CLEARN_MALL, this.updateUI, this);
    },
    init: function init(showData) {
        this.showData = showData;
    },
    showWithData: function showWithData(data) {
        this.data = data;
        var self = this;
        this.items = [];
        for (var index = 0; index < 9; index++) {
            var item = self.data.length > index ? self.data[index] : undefined;
            var c = cc.instantiate(self.gift_item);
            var x = (index % 3 - 1) * 177;
            var y = parseInt(index / 3) < 1 ? 413.5 : 65.5;
            if (parseInt(index / 3) === 1) {
                y = 239.5;
            }
            c.position = cc.v2(x, y);
            c.getComponent("select_gift_item").init(item, index);
            self.items.push(c);
            c.parent = self.node;
        };
    },
    updateUI: function updateUI(para) {
        // 刷新界面 
        var self = this;
        var showMall = true;

        if (!para && this.select_para) {
            var price = parseInt(this.select_para.item.priceDiamond);
            if (price > tywx.UserInfo.diamond) {
                return;
            }
            para = this.select_para;
        }
        if (!this.items) return;
        this.select_para = para;
        this.items.forEach(function (item, index) {
            if (index === para.index) {
                if (para.select) {
                    // 反选
                    // 取消播放动画 
                    tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_CLEARN_GIFT_PROP_ANIMATION);
                    // 展示tips
                    self.no_gift_tips.node.active = true;
                    // 移除选中礼物
                    tywx.UserInfo.select_gift_item = undefined;
                } else {
                    // 选择礼物
                    tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_CLEARN_GIFT_PROP_ANIMATION);
                    var _price = parseInt(para.item.priceDiamond);
                    if (_price > tywx.UserInfo.diamond) {
                        tywx.Util.wechatShowModal("钻石不够啦,去购买?", false, "确定", function (params) {
                            // 
                            if (params.confirm) {
                                console.log("to invalid");
                                self.showMall();
                                // self.no_gift_tips.node.active = true;
                            } else {
                                console.log("to cancel");
                            }
                        });
                        // this.showMall();
                        self.no_gift_tips.node.active = true;
                        return;
                    } else {
                        // 拥有的钻石够
                        // 隐藏tips
                        self.no_gift_tips.node.active = false;
                        // 切换动画
                        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_SHOW_GIFT_PROP_ANIMATION, {
                            type: 1,
                            prop_id: 1000 + parseInt(para.item.productId.substr(-3))
                        });
                        // 添加选中礼物
                        tywx.UserInfo.select_gift_item = para.item;
                    }
                }
                item.getComponent("select_gift_item").updateSelect(!para.select);
            } else {
                item.getComponent("select_gift_item").updateSelect(false);
            }
        });
    },
    showMall: function showMall() {
        var self = this;
        cc.loader.loadRes('prefab/mall/mall', function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            preFabNode.parent = tywx.UIManager.getCurrentUI();
            preFabNode.getComponent("mall").curIndex = 2;
        });
    },
    hidden_tips: function hidden_tips() {
        this.no_gift_tips.node.active = false;
    },
    back_btn_click: function back_btn_click() {
        this.node.active = false;
        this.node.destroyAllChildren();
        this.node.removeAllChildren();
        this.node.destroy();
    },
    onDestroy: function onDestroy() {
        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_CLEARN_GIFT_PROP_ANIMATION);
        tywx.NotificationCenter.ignoreScope(this);
    },
    share_btn_click: function share_btn_click() {
        //TODO: 分享
        console.log("chenxi::", "share_btn_click", this.showData);
        var home_node = tywx.UIManager.getUI(els.ELS_GAME_LAYER.HOMEPAGE);
        home_node.node.getComponent("homePage").make_share.active = true;
        this.back_btn_click();
        return;

        var _imageUrl = this.showData['imgUrl'];
        var inviteName = tywx.UserInfo.userName;
        var avatarUrl = tywx.UserInfo.userPic;
        var openId = tywx.UserInfo.openId;
        if (!openId) {
            wx.showToast({
                title: '请先登录~',
                duration: 1000
            });
            tywx.TuyooSDK.login();
            return;
        }
        var plaintext = this.showData["plainText"];
        var ciphertext = this.showData["cipherText"];
        var _uuid = tywx.Util.createUUID();
        var _query = "inviteCode=" + tywx.UserInfo.userId + "&openId=" + openId + "&sourceCode=" + els.ELS_SHRAE_TYPE.GAME_QQH_MAKE + "&plaintext=" + plaintext + "&ciphertext=" + ciphertext + "&inviteName=" + inviteName + "&avatarUrl=" + avatarUrl + "&randomKey=" + _uuid;
        console.log("share::uuid::", _uuid);
        if (tywx.UserInfo.select_gift_item) {
            tywx.UserInfo.select_gift_item.uuid = _uuid;
        }
        var _item = tywx.UserInfo.select_gift_item ? tywx.UserInfo.select_gift_item.content.items[0].itemId.substr(-4) : "";
        var _amount = 1;

        var self = this;
        tywx.ShareInterface.shareMsg({
            type: els.ELS_SHRAE_TYPE.GAME_QQH_MAKE,
            imageUrl: _imageUrl,
            query: _query,
            successCallback: function successCallback(_) {
                // TODO: 分享成功 
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeSendQQH);

                if (!tywx.UserInfo.select_gift_item || tywx.TCPClient.connectStatus != tywx.TCPClient.CONNECT_STATUS_OK) {
                    self.back_btn_click();
                    return;
                }
                tywx.MSG.whisperStart(_uuid, _item, _amount);
                tywx.UserInfo.select_gift_item = undefined;
                self.back_btn_click();
            },
            failCallback: function failCallback() {
                console.log("分享失败");
                wx.showToast({
                    title: '分享失败啦',
                    duration: 1000
                });
            }
        });
    }
}

// update (dt) {},
);

cc._RF.pop();