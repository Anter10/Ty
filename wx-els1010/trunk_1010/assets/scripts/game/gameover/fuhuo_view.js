 const fuhuo_view_path = "prefabs/fuhuo_view"


 const fuhuo_view = cc.Class({
     extends: cc.Component,
     djsLabel: cc.Label,
     properties: {
         scoreLabel: cc.Label,
         fhBtn: cc.Node,
         djsTimeLabel: cc.Label,
         jcdlNode: cc.Node,
         background: cc.Node,
         root: cc.Node,
         progress: cc.ProgressBar,
     },


     restartGame: function () {
         this.closeCall();
     },

     closeCall: function () {
         //  this.node.getComponent(cc.Animation).play("fuhuo_view_hide");
         fuhuo_view.curnode.removeFromParent(true);
         fuhuo_view.curnode = null;
         tywx.tt.gameover.show(this.data);
     },

     onLoad() {
         // 初始化复活按钮的相关设置
         this.fuhuoScript = this.fhBtn.getComponent("ShareButton")
         var self = this;
         const share_control = tywx.tt.configManager.getInstance().share_control ? tywx.tt.configManager.getInstance().share_control.recovergame : ["share", 50];
         const calltype = tywx.tt.Utils.shareVideoCtr(share_control);
         const config = calltype == 1 ? tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_SHARE : tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_VIDEO;
         this.fuhuoScript.setShareConfig(config);
         this.fuhuoScript.setButtonCallType(calltype);
         this.fuhuoScript.setSuccessCall(function () {
             self.fuHuoCall();
         });
         tywx.tt.Utils.hideWXBanner();
         this.background.getComponent("background").setTouchEndCall(function () {
             self.restartGame();
         });
         if (tywx.tt.configManager.getInstance().auditing == true) {
             this.fuhuoScript.setReactCall(true);
         }
         // 添加交叉倒流节点
         var canadd = true;
         canadd && tywx.tt.ads.addAdsNode("blink_play", this.jcdlNode, cc.v2(0, 0));
         // 开始倒计时
         this.startDjs();
         // 圈开始转
         this.startZhuan();
     },
     startZhuan:function(){
        let alltime = 4 * 1.5;
        let speed = 400;
        let repeate = 1 / speed;
        let self = this;
        let total = 0;
        let actions = cc.callFunc(function(){
            total = total + repeate;
            let per = 1 - total;
            self.progress.progress = per;
        })
        let delay = cc.delayTime(repeate);
        let repeatea = cc.repeat(actions, delay, speed / alltime);
        this.node.runAction(repeatea);
     },

     startDjs: function () {
         this.djstime = 5;
         var self = this;
         var tdjs = 5;
         self.djsTimeLabel.string = tdjs;
         var totalPassTime = 0;
         var totalrepeate = 5;

         var djsCall = cc.callFunc(
             function () {
                 self.djsTimeLabel.node.scale = 1;
                 totalPassTime++;
                 tdjs = tdjs - 1;
                 if (tdjs == 0) {
                     tdjs = 5;
                     if (totalPassTime < totalrepeate) {
                         self.djsTimeLabel.string = "" + tdjs;
                     }
                    //  self.progress.progress = 0;
                     self.restartGame();
                 } else {
                     tywx.tt.AudioManager.getInstance().playSound(tywx.tt.constants.SOUNDS.COMBO[4]);
                     let ttdjs = 1 - (5 - tdjs) / 5;
                      
                    //  self.progress.progress = ttdjs;
                     self.djsTimeLabel.string = tdjs;
                     
                 }
                 if (totalPassTime == totalrepeate) {
                     // 显示UI
                     self.djsTimeLabel.string = "";

                 }
                 let scale = cc.scaleTo(0.3, 0);
                 let delay = cc.delayTime(1);
                 let call = cc.callFunc(function () {
                     if (totalPassTime == totalrepeate - 1) {
                         self.djsTimeLabel.string = "";
                         tywx.tt.AudioManager.getInstance().playSound(tywx.tt.constants.SOUNDS.COMBO[4]);
                     } else {
                         if (totalPassTime != totalrepeate - 1) {
                             self.djsTimeLabel.string = tdjs - 1;
                             let ttdjs = 1 - (5 - tdjs) / 5;
                             console.log("ttdjsttdjsttdjs  =", ttdjs);
                            //  self.progress.progress = ttdjs;
                         }
                     }
                     self.djsTimeLabel.node.scale = 1;
                 });
                 let tseq = cc.sequence(delay, scale, call);
                 self.djsTimeLabel.node.runAction(tseq);
             }
         );

         let scale = cc.scaleTo(0.3, 0);
         let delay1 = cc.delayTime(1);
         tywx.tt.AudioManager.getInstance().playSound(tywx.tt.constants.SOUNDS.COMBO[4]);

         let call = cc.callFunc(function () {
             self.djsTimeLabel.string = 4;
             self.djsTimeLabel.node.scale = 1;
         });
         let tseq = cc.sequence(delay1, scale, call);
         this.djsTimeLabel.node.runAction(tseq);

         let delay = cc.delayTime(1.5);
         let seq = cc.sequence(delay, djsCall);
         let repeate = cc.repeat(seq, this.djstime);
         this.node.stopAllActions();
         this.node.runAction(repeate);
     },

     fuHuoCall: function () {
         tywx.tt.BoardView.recoverGame();
         fuhuo_view.curnode.removeFromParent(true);
         fuhuo_view.curnode = null;
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
             if (!fuhuo_view.curnode) {
                 cc.loader.loadRes(fuhuo_view_path, (err, prefab) => {
                     if (!err) {
                         let fuhuonode = cc.instantiate(prefab);
                         let ani = fuhuonode.getComponent(cc.Animation);
                         ani.play("show_hide");
                         let ads_script = fuhuonode.getComponent('fuhuo_view');
                         ads_script.setData(data);
                         fuhuo_view.curnode = fuhuonode;
                         tywx.tt.Utils.commonScaleIn(ads_script.root);
                         cc.director.getScene().addChild(fuhuonode);
                     }
                 });
             }
         }
     },
 });


 module.exports = fuhuo_view;