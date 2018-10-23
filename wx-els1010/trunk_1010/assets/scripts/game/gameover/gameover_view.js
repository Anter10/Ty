 const gameover_view_path = "prefabs/gameover_view";
 let gameover_rank = require('../gameover/gameover_rank.js');
 const gameover_view = cc.Class({
     extends: cc.Component,
     properties: {
         scoreLabel: cc.Label,
         restartBtn: cc.Node,
         jcdlNode: cc.Node,
         maxScoreLabel: cc.Label,
         phbnode: cc.Node,
     },


     restartGame: function () {
         this.closeCall();
     },

     closeCall: function () {
         tywx.tt.Utils.sendWXMsg({
             method: 9,
         });
         tywx.tt.friend.setStop(false);
         tywx.tt.Utils.showWXBanner();
         gameover_view.curnode.removeFromParent(true);
         gameover_view.curnode = null;
     },

     onLoad() {
         // 存储分数
         tywx.tt.curgamescene.storeScore();
         // 初始化复活按钮的相关设置
         this.fuhuoScript = this.restartBtn.getComponent("ShareButton")
         this.fuhuoScript.setButtonCallType(1);
         let share = false;
         let calltype = share ? 1 : 2;
         const config = calltype == 1 ? tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_SHARE : tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_VIDEO;
         this.fuhuoScript.setShareConfig(config);
         this.fuhuoScript.setSuccessCall(function () {
             self.fuHuoCall();
         });
         // 添加交叉倒流节点
         var canadd = true;
         canadd && tywx.tt.ads.addAdsNode("blink_play", this.jcdlNode, cc.v2(0, 0));
         // 开始倒计时
         // 添加好友排行的界面
         gameover_rank.addIcon(this.phbnode);
         this.maxScoreLabel.string = parseInt(tywx.tt.Utils.loadItem(tywx.tt.constants.TT_SCORE, 0)) + "";
     },



     fuHuoCall: function () {

         this.closeCall();
     },

     setData(data) {
         this.data = data;
         this.scoreLabel.string = data.score;
     },

     start() {

     },

     statics: {
         curnode: null,
         /**
          * @description 显示gameOver的视图
          * @param {Object} data gameover的显示数据
          */
         show: function (data) {
             cc.loader.loadRes(gameover_view_path, (err, prefab) => {
                 if (!err) {
                     let gameovernode = cc.instantiate(prefab);
                     let ads_script = gameovernode.getComponent('gameover_view');
                     ads_script.setData(data);
                     gameover_view.curnode = gameovernode;
                     cc.director.getScene().addChild(gameovernode);
                 }
             });
         }
     },
 });


 module.exports = gameover_view;