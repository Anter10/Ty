var ELSEvent = require("../core/ElsEvents.js");
var els = require("../core/els.js");

cc.Class({
    extends: cc.Component,

    properties: {
        no_gift_tips: cc.Sprite,
        gift_item: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.showWithData(tywx.StoreList.gs);
        this.no_gift_tips.node.active = true;
        // 监听点击事件 刷新
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_SELECT_GIFT, this.updateUI, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_CLEARN_MALL, this.updateUI, this);
    },

    init(showData) {
        this.showData = showData;
    },

    showWithData(data) {
        this.data = data;
        let self = this;
        this.items = [];
        for (let index = 0; index < 9; index++) {
            let item = self.data.length > index ? self.data[index] : undefined;
            let c = cc.instantiate(self.gift_item);
            let x = (index % 3 - 1) * 177;
            let y = parseInt(index / 3) < 1 ? 413.5 : 65.5;
            if (parseInt(index / 3) === 1) {
                y = 239.5;
            }
            c.position = cc.v2(x, y);
            c.getComponent("select_gift_item").init(item, index);
            self.items.push(c);
            c.parent = self.node;
        };
    },

    updateUI(para) {
        // 刷新界面 
        let self = this;
        let showMall = true;

        if (!para && this.select_para) {
            let price = parseInt(this.select_para.item.priceDiamond);
            if (price > tywx.UserInfo.diamond) {
                return;
            }
            para = this.select_para;
        }
        if (!this.items) return;
        this.select_para = para;
        this.items.forEach((item, index) => {
            if (index === para.index) {
                if (para.select) { // 反选
                    // 取消播放动画 
                    tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_CLEARN_GIFT_PROP_ANIMATION);
                    // 展示tips
                    self.no_gift_tips.node.active = true;
                    // 移除选中礼物
                    tywx.UserInfo.select_gift_item = undefined;
                } else { // 选择礼物
                    tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_CLEARN_GIFT_PROP_ANIMATION);
                    let price = parseInt(para.item.priceDiamond);
                    if (price > tywx.UserInfo.diamond) {
                        tywx.Util.wechatShowModal("钻石不够啦,去购买?", false, "确定",
                            function(params) { // 
                                if (params.confirm) {
                                    console.log("to invalid");
                                    self.showMall();
                                    // self.no_gift_tips.node.active = true;
                                } else {
                                    console.log("to cancel");
                                }
                            }
                        );
                        // this.showMall();
                        self.no_gift_tips.node.active = true;
                        return;
                    } else { // 拥有的钻石够
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

    showMall() {
        let self = this;
        cc.loader.loadRes('prefab/mall/mall', function(err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            preFabNode.parent = tywx.UIManager.getCurrentUI();
            preFabNode.getComponent("mall").curIndex = 2;
        });
    },

    hidden_tips() {
        this.no_gift_tips.node.active = false;
    },

    back_btn_click() {
        this.node.active = false;
        this.node.destroyAllChildren();
        this.node.removeAllChildren();
        this.node.destroy();
    },

    onDestroy() {
        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_CLEARN_GIFT_PROP_ANIMATION);
        tywx.NotificationCenter.ignoreScope(this);
    },

    share_btn_click() {
        //TODO: 分享
        console.log("chenxi::", "share_btn_click", this.showData);
        var home_node = tywx.UIManager.getUI(els.ELS_GAME_LAYER.HOMEPAGE);
        home_node.node.getComponent("homePage").make_share.active = true;
        this.back_btn_click();
        return;

        let _imageUrl = this.showData['imgUrl'];
        let inviteName = tywx.UserInfo.userName;
        let avatarUrl = tywx.UserInfo.userPic;
        let openId = tywx.UserInfo.openId;
        if (!openId) {
            wx.showToast({
                title: '请先登录~',
                duration: 1000,
            });
            tywx.TuyooSDK.login();
            return;
        }
        let plaintext = this.showData["plainText"];
        let ciphertext = this.showData["cipherText"];
        let _uuid = tywx.Util.createUUID();
        let _query = "inviteCode=" + tywx.UserInfo.userId + "&openId=" + openId + "&sourceCode=" + els.ELS_SHRAE_TYPE.GAME_QQH_MAKE + "&plaintext=" + plaintext + "&ciphertext=" + ciphertext + "&inviteName=" + inviteName + "&avatarUrl=" + avatarUrl + "&randomKey=" + _uuid;
        console.log("share::uuid::", _uuid);
        if (tywx.UserInfo.select_gift_item) {
            tywx.UserInfo.select_gift_item.uuid = _uuid;
        }
        let _item = tywx.UserInfo.select_gift_item ? tywx.UserInfo.select_gift_item.content.items[0].itemId.substr(-4) : "";
        let _amount = 1;

        let self = this;
        tywx.ShareInterface.shareMsg({
            type: els.ELS_SHRAE_TYPE.GAME_QQH_MAKE,
            imageUrl: _imageUrl,
            query: _query,
            successCallback: function(_) {
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
            failCallback: function() {
                console.log("分享失败");
                wx.showToast({
                    title: '分享失败啦',
                    duration: 1000,
                });
            }
        });
    },


    // update (dt) {},
});