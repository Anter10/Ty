"use strict";
cc._RF.push(module, '68b47bUNBZKFo2vkf9uElWn', 'tt_scene_menu');
// scripts/game/view/tt_scene_menu.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        gqnumberLabel: cc.Label,
        zpbtnNode: cc.Node,
        bannerNode: cc.Node,
        btnGetMoney: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        tywx.tt.Utils.sendWXMsg({
            method: "load_data",
            MAIN_MENU_NUM: tywx.tt.constants.TT_SCORE
        });
        tywx.tt.boot();
        tywx.tt.lottery.addZPIcon("home", this.zpbtnNode, cc.v2(0, 0));
        tywx.tt.ads.addAdsNode("banner_menu", this.bannerNode, cc.v2(0, 0));
        // 当前最大分数
        this.gqnumberLabel.string = parseInt(tywx.tt.Utils.loadItem(tywx.tt.constants.TT_SCORE, 0)) + "";
        tywx.NotificationCenter.listen(tywx.tt.events.TT_EVENT_RED_PACKET_CHANGE, this.onRedPacktChange, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_EVENT_GET_IP_SUCCESS, this.getIPSuccess, this);
        tywx.Timer.setTimer(this, function () {
            tywx.tt.isMinGanIP = tywx.tt.Utils.isMinGanIp(tywx.AdManager.ipLocInfo);
            // console.log("是否为敏感IP = " + JSON.stringify(tywx.tt.configManager.share_control));
            this.loginSuccess();
        }, 1, 1, 1);
    },


    /**
     * @param {Object} res 得到IP的回调
     */
    getIPSuccess: function getIPSuccess(res) {
        console.log("IP信息 = " + JSON.stringify(res));
    },

    /**
     * @description 红包更改的时候回调
     */
    onRedPacktChange: function onRedPacktChange(res) {
        if (res.data && res.data.totalAmount) {
            var data = {};
            data.max = tywx.tt.Utils.formatCashFen2Yuan(res.data.totalAmount);
            this.btnGetMoney.getComponent('GetMoneyButton').init(data);
        } else {
            console.log("通知事件中的红包数据 = " + JSON.stringify(res));
        }
    },

    /**
     * @description 延迟加载初始化某些数据
     */
    loginSuccess: function loginSuccess() {
        // ! 显示红包
        var self = this;
        console.log("tywx.UserInfo.userId = " + tywx.UserInfo.userId);
        // if (tywx.UserInfo.userId === 0 || tywx.config.auditing === true) return;
        tywx.tt.Utils.requestRedPacket({
            success: function success(res) {
                self.btnGetMoney.active = true;
                console.log("huuu = " + JSON.stringify(res));
                self.btnGetMoney.getComponent('GetMoneyButton').init(res);
            },
            fail: function fail(res) {
                self.btnGetMoney.active = false;
            }
        });
        // ! 登陆游戏后第一次进入菜单特殊处理
        if (tywx.tt.isFirstLogin) {}
    },
    onDestroy: function onDestroy() {
        tywx.tt.Utils.hideGameClub();
        tywx.tt.Utils.destroyWXBanner();
        tywx.NotificationCenter.ignoreScope(this);
    },


    /**
     * @description 点击开始游戏的时候调用
     * @param {Object} e 回调的对象
     */
    startGame: function startGame(e) {
        cc.director.loadScene("scene_play");
    },

    /**
     * @description 显示排行榜
     */
    showPhb: function showPhb() {
        tywx.tt.rank_manager.showRank();
    },

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();