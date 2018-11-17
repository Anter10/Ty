(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/view/tt_scene_play.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4805cLfUy9BEZvckQ7E+WBJ', 'tt_scene_play', __filename);
// scripts/game/view/tt_scene_play.js

'use strict';

var TAG = '[tt_scene_play]';
var friend = require('../rank/friend.js');

cc.Class({
    extends: cc.Component,

    properties: {
        stopbottom: cc.Node,
        initshow: cc.Node,
        friendnode: cc.Node,
        historyscoreLabel: cc.Label,
        scoreLabel: cc.Label,
        stopScoreLabel: cc.Label,
        btnGetMoney: cc.Node,
        topElementNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        var self = this;
        this.score = 0;
        this.showstop = false;
        this.stopbottom.active = true;
        this.initshow.active = true;
        this.qzshowinitshow = true;
        friend.addIcon(this.friendnode);
        tywx.tt.friend = friend;
        this.stopbottom.scaleX = 0;
        this.root = this.node.getChildByName('root');
        this.pop = this.node.getChildByName('pop');
        this.loadPlayView();
        this.showBanner();
        tywx.tt.curgamescene = this;
        var canshowads = true;
        tywx.NotificationCenter.listen(tywx.tt.events.LOGIN_SUCCESS, this.loginSuccess, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_EVENT_RED_PACKET_CHANGE, this.onRedPacktChange, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_EVENT_GET_IP_SUCCESS, this.getIPSuccess, this);
        if (canshowads) {
            tywx.tt.ads.addAdsNode("list_menu", this.node, cc.v2(220, 222));
        }
        this.btnGetMoney.active = false;
        console.log("红包数据 = " + JSON.stringify(tywx.tt.RedPacketInfo));
        this.initMoneyBtn();

        //

        if (tywx.tt.Utils.isIpx()) {
            this.topElementNode.y = this.topElementNode.y - 35;
        } else if (tywx.tt.Utils.is2To1()) {
            // this.topElementNode.y = this.topElementNode.y - 30;
        }
    },


    initMoneyBtn: function initMoneyBtn() {
        var self = this;
        if (tywx.tt.configManager.getInstance().auditing == false && tywx.tt.RedPacketInfo) {
            self.btnGetMoney.active = true;
            var data = {};
            data.max = tywx.tt.Utils.formatCashFen2Yuan(tywx.tt.RedPacketInfo.totalAmount);
            self.btnGetMoney.getComponent('GetMoneyButton').init(data);
            self.btnGetMoney.getComponent('GetMoneyButton').setShowCall(function () {
                console.log("主界面的红包");
            });
        } else {
            self.btnGetMoney.active = false;
        }
    },

    /**
     * @description 红包数据变化的时候调用
     * @param {Object} res 红包变化的数据
     */
    onRedPacktChange: function onRedPacktChange(res) {
        console.log("红包数据 = " + JSON.stringify(res));
        if (res.data && res.data.totalAmount) {
            var data = {};
            data.max = tywx.tt.Utils.formatCashFen2Yuan(res.data.totalAmount);
            this.btnGetMoney.getComponent('GetMoneyButton').init(data);
        } else {
            tywx.tt.log(TAG, "通知事件中的红包数据 = " + JSON.stringify(res));
        }
    },

    // 点击暂停回调
    stopCall: function stopCall() {
        var self = this;
        // tywx.tt.stop_view.showStopView();
        if (!this.showstop) {
            this.showstop = true;
            this.stopbottom.active = true;
            var animation = this.stopbottom.getComponent("cc.Animation");
            var animState = animation.play("showstop");
            animState.wrapMode = cc.WrapMode.Reverse;
            this.qzshowinitshow = false;
            var animation1 = this.initshow.getComponent("cc.Animation");
            var animState1 = animation1.play("initshow");
            animState1.wrapMode = cc.WrapMode.Normal;
        } else {
            this.showstop = false;
            this.stopbottom.active = true;
            var _animation = this.stopbottom.getComponent("cc.Animation");
            var _animState = _animation.play("showstop");
            _animState.wrapMode = cc.WrapMode.Normal;

            this.qzshowinitshow = true;
            var _animation2 = this.initshow.getComponent("cc.Animation");

            var _animState2 = _animation2.play("initshow");
            _animState2.wrapMode = cc.WrapMode.Reverse;
            // tywx.Timer.setTimer(this, function(){
            //     self.stopbottom.active = false;
            // },0.5, 0,0);
        }
    },

    qzShowBase: function qzShowBase() {
        if (!this.qzshowinitshow) {
            var self = this;
            this.stopbottom.active = true;
            var animation = this.stopbottom.getComponent("cc.Animation");
            var animState = animation.play("showstop");
            // tywx.Timer.setTimer(this, function () {
            //      self.stopbottom.active = false;
            // }, 0.5, 0, 0);
            animState.wrapMode = cc.WrapMode.Normal;
            this.qzshowinitshow = true;
            this.showstop = false;

            var animation1 = this.initshow.getComponent("cc.Animation");
            var animState1 = animation1.play("initshow");
            animState1.wrapMode = cc.WrapMode.Reverse;
        }
    },

    start: function start() {},


    /**
     * @description: 存储当前的分数
     */
    storeScore: function storeScore() {
        if (parseInt(tywx.tt.Utils.loadItem(tywx.tt.constants.TT_SCORE, 0)) < this.score) {
            tywx.tt.Utils.saveItem(tywx.tt.constants.TT_SCORE, this.score, false);
        }
    },

    onDestroy: function onDestroy() {
        this.storeScord();
        tywx.tt.log(TAG, "主页退出 ");
        tywx.tt.Utils.destroyWXBanner();
    },


    /**
     * @description 存储玩家的数据记录
     */
    storeScord: function storeScord() {
        var playdata = {};
        playdata.bord = tywx.tt.Board.board;
        playdata.score = tywx.tt.Board.score;
        playdata.huanyihuan = tywx.tt.BoardView.repeatNumber;
        var previews = tywx.tt.Board.previewConfigs;
        var previewIndex = tywx.tt.Board.previewIndex;

        tywx.tt.log(TAG, "previews = " + previews.length);
        var congifdata = [];
        for (var preIndex = 0; preIndex < previews.length; preIndex++) {
            var config = previews[preIndex];
            congifdata.push(config);
        }
        playdata.previewIndex = previewIndex;
        playdata.previewsdata = congifdata;
        tywx.tt.Utils.saveItem(tywx.tt.constants.PlayDataKeys.ttplaydata, JSON.stringify(playdata), true);
    },

    /**
     * @description 展示广告
     */
    showBanner: function showBanner() {
        tywx.tt.Utils.createAndcreateAndShowWXBanner();
        this.schedule(this.bannerRefresh, tywx.tt.constants.WXAdConfig.bannerRefreshTime);
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
                self.initMoneyBtn();
            },
            fail: function fail(res) {
                self.initMoneyBtn();
            }
        });
    },


    /**
     * @description 刷新广告的显示
     */
    bannerRefresh: function bannerRefresh() {
        tywx.tt.Utils.createAndcreateAndShowWXBanner();
    },

    /**
     * @description 刷新最高分
     */
    flushMaxScore: function flushMaxScore(score) {
        this.historyscoreLabel.string = "" + score;
    },

    setScore: function setScore(score) {
        var tscore = this.score;
        var scorecz = score - this.score;
        var self = this;
        if (scorecz > 0) {
            this.score = score;
            var call = cc.callFunc(function () {
                tscore = tscore + 2;
                self.scoreLabel.string = tscore;
                self.stopScoreLabel.string = tscore;
            });
            var time = 2 / scorecz;
            var delay = cc.delayTime(time);
            var seq = cc.sequence(delay, call);
            var rep = cc.repeat(seq, scorecz / 2);
            this.scoreLabel.node.stopAllActions();
            this.scoreLabel.node.runAction(rep);
            tywx.tt.friend.setScore(score);
            tywx.tt.curgamescene.storeScore();
        } else {
            self.stopScoreLabel.string = 0 + "";
            self.scoreLabel.string = 0 + "";
        }

        this.score = score;
    },
    // update (dt) {},
    loadPlayView: function loadPlayView() {
        var self = this;
        cc.loader.loadRes('prefabs/tt_view_play_board', function (err, prefab) {
            if (!err) {
                self.playView = cc.instantiate(prefab);
                self.playView.parent = self.root;
                self.playviewscript = self.playView.getComponent("tt_view_play_board");
                tywx.tt.log(TAG, 'load play view success');
                //self.playView.getComponent('tt_view_play_board').init();
            } else {
                tywx.tt.error(TAG, 'load play view failed', JSON.stringify(err));
            }
        });
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
        //# sourceMappingURL=tt_scene_play.js.map
        