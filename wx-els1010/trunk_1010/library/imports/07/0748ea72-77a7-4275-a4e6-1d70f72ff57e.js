"use strict";
cc._RF.push(module, '0748epyd6dCdaTmHXD3L/V+', 'loadingscene');
// scripts/game/view/loadingscene.js

"use strict";

var TAG = "[view/tt_scene_menu]";

cc.Class({
    extends: cc.Component,

    properties: {
        loadingProgress: cc.ProgressBar,
        loadingLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        tywx.tt.Utils.sendWXMsg({
            method: "load_data",
            MAIN_MENU_NUM: tywx.tt.constants.TT_SCORE
        });
        tywx.tt.boot();
        tywx.PropagateInterface.getShareConfigInfo(); //! 获取所有分享点信息
        // 当前最大分数
        var self = this;
        this.progressNumber = 0;
        this.caninto = false;
        tywx.NotificationCenter.listen(tywx.tt.events.LOGIN_SUCCESS, this.loginSuccess, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_GET_CONFIG_FAIL, this.dealConfig, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_GET_CONFIG_SUCCESS, this.dealFailConfig, this);
    },


    dealConfig: function dealConfig() {
        this.caninto = true;
        console.log("得到配置 开始游戏 ");
        tywx.tt.isMinGanIP = tywx.tt.Utils.isMinGanIp(tywx.AdManager.ipLocInfo);
        // this.startGame();
    },

    dealFailConfig: function dealFailConfig() {
        this.caninto = true;
        console.log("没有得到配置 开始游戏 ");
        // this.startGame();
    },

    /**
     * @param {Object} res 得到IP的回调
     */
    getIPSuccess: function getIPSuccess(res) {
        tywx.tt.log(TAG, "IP信息 = " + JSON.stringify(res));
    },

    /**
     * @description 延迟加载初始化某些数据
     */
    loginSuccess: function loginSuccess() {
        // ! 显示红包
        var self = this;
        if (tywx.tt.configManager.getInstance().auditing) return;
        // ! 登陆游戏后第一次进入菜单特殊处理
        tywx.tt.Utils.requestRedPacket({
            success: function success(res) {
                tywx.tt.log(TAG, "审核状态 = " + tywx.tt.configManager.getInstance().auditing + "玩家红包数据= " + JSON.stringify(res));
            },
            fail: function fail(res) {}
        });
    },


    /**
     * @description 点击开始游戏的时候调用
     * @param {Object} e 回调的对象
     */
    startGame: function startGame(e) {
        console.log("开始游戏了");
        cc.director.loadScene("scene_play");
    },
    update: function update(dt) {
        if (this.progressNumber < 1) {
            this.progressNumber = this.progressNumber + dt / 1.6;
            this.loadingProgress.progress = this.progressNumber;
            if (this.progressNumber >= 1) {
                this.loadingLabel.string = "稍等...";
            }
        } else if (!this.hadinto && this.caninto) {
            this.hadinto = true;
            this.startGame();
        }
    }
});

cc._RF.pop();