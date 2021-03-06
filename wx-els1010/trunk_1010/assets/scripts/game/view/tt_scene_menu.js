let TAG = "[view/tt_scene_menu]";

cc.Class({
    extends: cc.Component,

    properties: {
        gqnumberLabel: cc.Label,
        zpbtnNode: cc.Node,
        bannerNode: cc.Node,
        btnGetMoney: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        tywx.tt.Utils.sendWXMsg({
            method: "load_data",
            MAIN_MENU_NUM: tywx.tt.constants.TT_SCORE,
        })
        tywx.tt.boot();
        tywx.PropagateInterface.getShareConfigInfo(); //! 获取所有分享点信息
        // 当前最大分数
        this.gqnumberLabel.string = parseInt(tywx.tt.Utils.loadItem(tywx.tt.constants.TT_SCORE, 0)) + "";
        tywx.NotificationCenter.listen(tywx.tt.events.TT_EVENT_RED_PACKET_CHANGE, this.onRedPacktChange, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_EVENT_GET_IP_SUCCESS, this.getIPSuccess, this);
        var self = this;
        tywx.Timer.setTimer(this, function () {
            tywx.tt.lottery.addZPIcon("home", self.zpbtnNode, cc.v2(0, 0));
            tywx.tt.ads.addAdsNode("banner_menu", self.bannerNode, cc.v2(0, 0));
            tywx.tt.isMinGanIP = tywx.tt.Utils.isMinGanIp(tywx.AdManager.ipLocInfo);
            // console.log("是否为敏感IP = " + JSON.stringify(tywx.tt.configManager.getInstance().share_control));
            self.loginSuccess();
        }, 1, 0, 1);

        tywx.NotificationCenter.listen(tywx.tt.events.TT_GET_CONFIG_SUCCESS, this.dealConfig, this);

    },

    dealConfig:function(){
          
    },

    /**
     * @param {Object} res 得到IP的回调
     */
    getIPSuccess: function (res) {
        tywx.tt.log(TAG ,"IP信息 = " + JSON.stringify(res));
    },

    /**
     * @description 红包更改的时候回调
     */
    onRedPacktChange: function (res) {
        if (res.data && res.data.totalAmount) {
            let data = {}
            data.max = tywx.tt.Utils.formatCashFen2Yuan(res.data.totalAmount);
            this.btnGetMoney.getComponent('GetMoneyButton').init(data);
        } else {
            tywx.tt.log(TAG, "通知事件中的红包数据 = " + JSON.stringify(res));
        }
    },

    /**
     * @description 延迟加载初始化某些数据
     */
    loginSuccess() {
        // ! 显示红包
        let self = this;
       tywx.tt.log(TAG, "tywx.UserInfo.userId = " + tywx.UserInfo.userId);
        // if (tywx.UserInfo.userId === 0 || tywx.config.auditing === true) return;
        tywx.tt.Utils.requestRedPacket({
            success: (res) => {
                tywx.tt.log(TAG, "审核状态 = "+tywx.tt.configManager.getInstance().auditing  + "玩家红包数据= " + JSON.stringify(res));
                if (res.current && tywx.tt.configManager.getInstance().auditing == false) {
                    self.btnGetMoney.active = true;
                    self.btnGetMoney.getComponent('GetMoneyButton').init(res);
                } else {
                    self.btnGetMoney.active = false;
                }
            },
            fail: (res) => {
                self.btnGetMoney.active = false;
            }
        });
        // ! 登陆游戏后第一次进入菜单特殊处理
        if (tywx.tt.isFirstLogin) {

        }
    },


    onDestroy() {
        tywx.tt.Utils.hideGameClub();
        tywx.tt.Utils.destroyWXBanner();
        tywx.NotificationCenter.ignoreScope(this);
    },

    /**
     * @description 点击开始游戏的时候调用
     * @param {Object} e 回调的对象
     */
    startGame: function (e) {
        cc.director.loadScene("scene_play");
    },

    /**
     * @description 显示排行榜
     */
    showPhb: function () {
        tywx.tt.rank_manager.showRank();
    },

    start() {

    },

    // update (dt) {},
});