// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        count_label: cc.Label,
        price_label: cc.Label,

        free_tag: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onDestroy() {
        tywx.NotificationCenter.ignoreScope(this);
    },

    init(_data, _index) {

        this.data = undefined;
        this.free_tag.active = false;
        this.price_label.node.position = cc.v2(0, 14);
        this._index = _index;
        if (!_data) {
            // TODO: 免费广告获取钻石 每次一个
            this.data = _data;
            if (this._index === 1) {
                this.price_label.string = "邀请";
                this.count_label.string = "钻石x10";
                return;
            }
            this.free_tag.active = true;
            this.price_label.string = "免费";
            this.count_label.string = "钻石x1";
            this.price_label.node.position = cc.v2(20, 14);
            if (!tywx.UserInfo.rewardInfo) {
                tywx.NotificationCenter.listen(tywx.EventType.CMD_ELSWX, this._MsgRewardInfo, this);
                tywx.MSG.getRewardInfo();
            } else {
                this.count_label.string = "钻石x" + tywx.UserInfo.rewardInfo["oneRewardDiamond"];
            }
        } else { // 其他购买
            this.data = _data;
            let _price = "¥" + _data["price"];
            this.price_label.string = _price;

            let _count = _data["displayName"];
            this.count_label.string = _count;
        }
    },

    _MsgRewardInfo(params) {
        if (params.result.action === tywx.EventType.CMD_ACTION_REWARD_INFO) {
            tywx.UserInfo.rewardInfo = params.result;
            if (this.count_label) this.count_label.string = params.result["oneRewardDiamond"];
        }
    },

    diamond_cell_btn_click() {
        if (this.data) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                wx.showToast({
                    title: 'iOS无法支付',
                    duration: 1000,
                });
                return;
            }
            // tywx.TYPay.purchase(this.data["productId"], this.data["price"], this.data["displayName"], "1");
            // params prodId:商品ID, prodName:商品名称, prodCount:购买数量
            // prodPrice:价格  单位元,
            // chargeType:支付方式 wxapp.iap,
            // gameId:子游戏id,
            // appInfo:透传参数,
            // mustcharge:是否支付 默认填 1
            // 
            let self = this;
            tywx.TuyooSDK.rechargeOrder({
                "prodId": self.data["productId"],
                "prodName": self.data["displayName"],
                "prodCount": 1,
                "prodPrice": self.data["price"],
                "gameId": tywx.SystemInfo.gameId,
                "chargeType": "wxapp.iap",
                "appInfo": "",
                "mustcharge": 1
            });
        } else { // 广告 免费获取一个
            if (this._index === 0) {
                tywx.AdManager.showVidelAd();
            } else {
                this.showAward();
            }

        }
    },



    showAward() {
        let self = this;
        cc.loader.loadRes('prefab/diamond_award/award', function(err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            preFabNode.parent = tywx.UIManager.getCurrentUI();
        });
    },
    // update (dt) {},
});