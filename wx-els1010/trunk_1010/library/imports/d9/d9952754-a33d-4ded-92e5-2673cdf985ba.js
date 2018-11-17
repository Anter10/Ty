"use strict";
cc._RF.push(module, 'd9952dUoz1N7ZLlJnPN+YW6', 'rank_view');
// scripts/game/rank/rank_view.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        phbSprite: cc.Sprite,
        selfPmSprite: cc.Sprite,
        rankShareButton: cc.Node,
        background: cc.Node,
        touchNode: cc.Node
    },

    onLoad: function onLoad() {
        tywx.tt.friend.setStop(true);
        tywx.tt.Utils.sendWXMsg({
            method: 9
        });

        var self = this;
        this.tex = new cc.Texture2D();
        this.tex1 = new cc.Texture2D();
        window.sharedCanvas.width = 635;
        window.sharedCanvas.height = 120;
        tywx.tt.Utils.sendWXMsg({
            method: 20
        });

        var rankBtnScript = this.rankShareButton.getComponent("ShareButton");
        rankBtnScript.setButtonCallType(1);
        rankBtnScript.setShareConfig(tywx.tt.constants.ShareConfig.HOME_RANK_SHARE);
        rankBtnScript.setSuccessCall(function () {
            self.shareSuc();
        });
        //  this.touchNode.on('touchstart', function (event) {
        //     //  return true;
        //  });
        //  this.touchNode.on('touchend', function (event) {
        //     //  self.closeRankView();
        //  });
        this.background.getComponent("background").setTouchEndCall(function () {
            self.closeRankView();
        });

        var delay = cc.delayTime(0.7);
        var delay1 = cc.delayTime(0.5);
        var dscall = cc.callFunc(function () {
            self._updateSelfPM();
        });
        var call = cc.callFunc(function () {
            self.drawrank();
        });

        var seq = cc.sequence(delay1, dscall, delay, call);
        this.node.stopAllActions();
        this.node.runAction(seq);
    },


    drawrank: function drawrank() {
        this.isdrawranking = true;
        window.sharedCanvas.width = 635;
        window.sharedCanvas.height = 20 * 100;
        tywx.tt.Utils.sendWXMsg({
            method: 9
        });

        tywx.tt.Utils.sendWXMsg({
            method: 1,
            MAIN_MENU_NUM: tywx.tt.constants.TT_SCORE
        });
        var self = this;
        tywx.Timer.setTimer(this, function () {
            self._updateSubDomainCanvas();
        }, 0.5, 11, 0);
    },

    // 分享成功
    shareSuc: function shareSuc() {},

    closeRankView: function closeRankView() {
        if (this.closeing) {
            return;
        }
        tywx.tt.Utils.sendWXMsg({
            method: 9
        });
        this.closeing = true;
        tywx.tt.friend.setStop(false);
        window.sharedCanvas.width = 211;
        window.sharedCanvas.height = 98;

        var call = function call() {
            tywx.tt.rank_manager.friendsRankView.removeFromParent(true);
            tywx.tt.rank_manager.friendsRankView = null;
        };
        var ani = tywx.tt.rank_manager.friendsRankView.getComponent(cc.Animation);
        ani.on("finished", call, this);
        ani.play("hide_ui");
    },

    start: function start() {},


    /**
     * 刷新子域的canvas
     */
    _updateSubDomainCanvas: function _updateSubDomainCanvas() {
        if (!this.tex || !window.wx) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.phbSprite.spriteFrame = new cc.SpriteFrame(this.tex);
    },

    /**
     * 刷新子域的canvas
     */

    _updateSelfPM: function _updateSelfPM() {
        if (!this.tex1 || !window.wx || this.isdrawranking) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex1.initWithElement(sharedCanvas);
        this.tex1.handleLoadedTexture();
        this.selfPmSprite.spriteFrame = new cc.SpriteFrame(this.tex1);
    }

    // update (dt) {},
});

cc._RF.pop();