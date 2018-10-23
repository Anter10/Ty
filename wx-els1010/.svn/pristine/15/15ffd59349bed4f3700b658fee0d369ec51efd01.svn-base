 let friend_path = "prefabs/gameover_rank";
 var self = null;

 const gameover_rank = cc.Class({
     extends: cc.Component,

     properties: {
         phbSprite: cc.Sprite,
     },

     // LIFE-CYCLE CALLBACKS:

     onLoad() {
         this.tex = new cc.Texture2D();
         window.sharedCanvas.width = 640;
         window.sharedCanvas.height = 200;
         this.updatetime = 5;
         this.score = 0;
         self = this;
         tywx.tt.Utils.sendWXMsg({
             method: 7,
         });
         tywx.tt.Utils.sendWXMsg({
             method: 9,
         });
         tywx.Timer.setTimer(self, function () {
                 wx.postMessage({
                     method: 8,
                 });
          }, 1, 1, 1);
     },

     /**
      * @description: 刷新子域即将超越的玩家Canvas
      */
     updateFriendCanvas: function () {
         //return;
         if (!this.tex || !wx) {
             return;
         }

         var openDataContext = wx.getOpenDataContext();
         var sharedCanvas = openDataContext.canvas;
         this.tex.initWithElement(sharedCanvas);
         this.tex.handleLoadedTexture();
         this.phbSprite.spriteFrame = new cc.SpriteFrame(this.tex);
         this.phbSprite.node.active = true;
     },

     /**
      * 设置当前玩家的分数 
      * @param {Number} score 设置当前玩家的分数刷新当前显示的好友分数
      */
     setScoreFlush: function (score) {
         this.score = score || 0;
         this.updateFriendCanvas();
     },


     start() {

     },

     update(dt) {
         this.updatetime = this.updatetime - dt;
         if (this.updatetime > 0) {
             this.updateFriendCanvas();
         }
     },

     statics: {
         gamoverranknode: null,
         gameover_rank_script: null,
         addIcon: function (node) {
             cc.loader.loadRes(friend_path, (err, prefab) => {
                 if (!err) {
                     let gamoverranknode = cc.instantiate(prefab);
                     let gameover_rank_script = gamoverranknode.getComponent('gameover_rank');
                     gameover_rank.gameover_rank_script = gameover_rank_script;
                     gameover_rank.gamoverranknode = gamoverranknode;
                     node.addChild(gamoverranknode);
                 }
             });
         }
     }
 });

 module.exports = gameover_rank;