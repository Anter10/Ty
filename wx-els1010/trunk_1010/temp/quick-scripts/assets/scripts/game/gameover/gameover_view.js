(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/gameover/gameover_view.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ffd4dzoTMVCRYWRV0oqX/ml', 'gameover_view', __filename);
// scripts/game/gameover/gameover_view.js

"use strict";

var gameover_view_path = "prefabs/gameover_view";
var gameover_rank = require('../gameover/gameover_rank.js');
var gameover_view = cc.Class({
    extends: cc.Component,
    properties: {
        scoreLabel: cc.Label,
        restartBtn: cc.Node,
        jcdlNode: cc.Node,
        maxScoreLabel: cc.Label,
        phbnode: cc.Node,
        shareNode: cc.Node,
        background: cc.Node,
        root: cc.Node,
        btnGetMoney: cc.Node
    },

    restartGame: function restartGame() {
        this.closeCall();
    },

    rankBtnCall: function rankBtnCall() {
        tywx.tt.rank_manager.showRank();
    },

    shareCall: function shareCall() {},

    closeCall: function closeCall() {
        if (this.closeing) {
            return;
        }
        this.closeing = true;
        tywx.tt.Utils.sendWXMsg({
            method: 9
        });
        this.hideChilds();
    },

    onLoad: function onLoad() {
        var self = this;
        // 存储分数
        tywx.tt.curgamescene.storeScore();
        tywx.NotificationCenter.listen(tywx.tt.events.TT_EVENT_RED_PACKET_CHANGE, this.onRedPacktChange, this);
        this.btnGetMoney.active = false;
        console.log("红包数据 = " + JSON.stringify(tywx.tt.RedPacketInfo));
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
        //  this.background.getComponent("background").setTouchEndCall(function () {
        //      self.restartGame();
        //  });
        // 初始化复活按钮的相关设置
        //  this.fuhuoScript = this.restartBtn.getComponent("ShareButton")
        //  this.fuhuoScript.setButtonCallType(1);
        //  let share = false;
        //  let calltype = share ? 1 : 2;
        //  const config = calltype == 1 ? tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_SHARE : tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_VIDEO;
        //  this.fuhuoScript.setShareConfig(config);
        //  this.fuhuoScript.setSuccessCall(function () {
        //      self.fuHuoCall();
        //  });

        this.sharescript = this.shareNode.getComponent("ShareButton");
        var self = this;
        //  const share_control = tywx.tt.configManager.getInstance().share_control ? tywx.tt.configManager.getInstance().share_control.recovergame : ["share", 100];
        var calltype = 1; //tywx.tt.Utils.shareVideoCtr(share_control);
        var config = calltype == 1 ? tywx.tt.constants.ShareConfig.GAMEOVER_SHARE : tywx.tt.constants.ShareConfig.GAMEOVER_VIDEO;
        this.sharescript.setShareConfig(config);
        this.sharescript.setButtonCallType(calltype);
        this.sharescript.setSuccessCall(function () {
            //  self.fuHuoCall();
            tywx.tt.log(TAG, "分享成功");
        });

        // 添加交叉倒流节点
        var canadd = true;
        canadd && tywx.tt.ads.addAdsNode("blink_play", this.jcdlNode, cc.v2(0, 0));
        // 开始倒计时
        // 添加好友排行的界面
        gameover_rank.addIcon(this.phbnode);
        this.maxScoreLabel.string = parseInt(tywx.tt.Utils.loadItem(tywx.tt.constants.TT_SCORE, 0)) + "";
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

    fuHuoCall: function fuHuoCall() {
        this.closeCall();
    },

    hideChilds: function hideChilds() {
        var childs = this.root.children;

        var self = this;
        var tindex = 0;

        var call = cc.callFunc(function () {
            var node = childs[tindex];
            var seq = cc.sequence(cc.scaleTo(0.12, 1.2), cc.scaleTo(0.12, 0));
            node.runAction(seq);
            tindex = tindex + 1;
            if (tindex == childs.length) {
                var _call = cc.callFunc(function () {
                    gameover_view.curnode.removeFromParent(true);
                    gameover_view.curnode = null;
                    tywx.tt.friend.setStop(false);
                    tywx.tt.Utils.showWXBanner();
                    tywx.tt.BoardView.reset();
                    tywx.tt.BoardView.blocksAni();
                });
                var seq1 = cc.sequence(cc.delayTime(0.3), _call);
                gameover_view.curnode.runAction(seq1);
            }
        });
        var delay = cc.delayTime(0.12);
        var seq = cc.sequence(call, delay);
        var rep = cc.repeat(seq, childs.length);
        this.node.runAction(rep);
    },

    setData: function setData(data) {
        this.data = data;
        var self = this;
        var scorecz = data.score;
        if (scorecz > 0) {
            var tscore = 0;
            var call = cc.callFunc(function () {
                tscore = tscore + 2;
                self.scoreLabel.string = tscore;
            });
            var time = 2 / scorecz;
            var delay = cc.delayTime(time);
            var seq = cc.sequence(delay, call);
            var rep = cc.repeat(seq, scorecz / 2);
            this.scoreLabel.node.stopAllActions();
            this.scoreLabel.node.runAction(rep);
        } else {
            this.scoreLabel.string = "0";
        }
    },
    start: function start() {},


    statics: {
        curnode: null,
        /**
         * @description 显示gameOver的视图
         * @param {Object} data gameover的显示数据
         */
        show: function show(data) {
            cc.loader.loadRes(gameover_view_path, function (err, prefab) {
                if (!err) {
                    var gameovernode = cc.instantiate(prefab);
                    var ani = gameovernode.getComponent(cc.Animation);
                    ani.play("show_hide");
                    var ads_script = gameovernode.getComponent('gameover_view');
                    ads_script.setData(data);
                    gameover_view.curnode = gameovernode;
                    tywx.tt.Utils.commonScaleIn(ads_script.root);
                    cc.director.getScene().addChild(gameovernode);
                }
            });
        }
    }
});

module.exports = gameover_view;

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
        //# sourceMappingURL=gameover_view.js.map
        