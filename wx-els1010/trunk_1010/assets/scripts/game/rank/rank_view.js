 cc.Class({
     extends: cc.Component,

     properties: {
         phbSprite: cc.Sprite,
         selfPmSprite: cc.Sprite,
         rankShareButton: cc.Node,
         background: cc.Node,
         touchNode: cc.Node,
     },


     onLoad() {
         tywx.tt.friend.setStop(true);
         tywx.tt.Utils.sendWXMsg({
             method: 9,
         });

         var self = this;
         this.tex = new cc.Texture2D();
         this.tex1 = new cc.Texture2D();
         window.sharedCanvas.width = 635;
         window.sharedCanvas.height = 120;
         tywx.tt.Utils.sendWXMsg({
             method: 20,
         });

         const rankBtnScript = this.rankShareButton.getComponent("ShareButton")
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

         let delay = cc.delayTime(0.7);
         let delay1 = cc.delayTime(0.5);
         let dscall = cc.callFunc(function () {
             self._updateSelfPM();
         });
         let call = cc.callFunc(function () {
             self.drawrank();
         });


         let seq = cc.sequence(delay1, dscall, delay, call);
         this.node.stopAllActions();
         this.node.runAction(seq);
     },

     drawrank: function () {
         this.isdrawranking = true;
         window.sharedCanvas.width = 635;
         window.sharedCanvas.height = 20 * 100;
         tywx.tt.Utils.sendWXMsg({
             method: 9,
         });

         tywx.tt.Utils.sendWXMsg({
             method: 1,
             MAIN_MENU_NUM: tywx.tt.constants.TT_SCORE,
         });
         let self = this;
         tywx.Timer.setTimer(this, function () {
             self._updateSubDomainCanvas();
         }, 0.5, 11, 0);
     },

     // 分享成功
     shareSuc: function () {

     },

     closeRankView: function () {
         if (this.closeing) {
             return;
         }
         tywx.tt.Utils.sendWXMsg({
             method: 9,
         });
         this.closeing = true;
         tywx.tt.friend.setStop(false);
         window.sharedCanvas.width = 211;
         window.sharedCanvas.height = 98;
        
         let call = function () {
             tywx.tt.rank_manager.friendsRankView.removeFromParent(true);
             tywx.tt.rank_manager.friendsRankView = null;
         };
         let ani = tywx.tt.rank_manager.friendsRankView.getComponent(cc.Animation);
         ani.on("finished", call, this);
         ani.play("hide_ui");
     },

     start() {

     },

     /**
      * 刷新子域的canvas
      */
     _updateSubDomainCanvas: function () {
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

     _updateSelfPM: function () {
         if (!this.tex1 || !window.wx || this.isdrawranking) {
             return;
         }
         var openDataContext = wx.getOpenDataContext();
         var sharedCanvas = openDataContext.canvas;
         this.tex1.initWithElement(sharedCanvas);
         this.tex1.handleLoadedTexture();
         this.selfPmSprite.spriteFrame = new cc.SpriteFrame(this.tex1);
     },


     // update (dt) {},
 });