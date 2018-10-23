 const fuhuo_view_path = "prefabs/fuhuo_view"


 const fuhuo_view = cc.Class({
     extends: cc.Component,

     properties: {
         scoreLabel: cc.Label,
         fhBtn: cc.Node,
         djsTime: cc.Node,
         jcdlNode: cc.Node,
     },


     restartGame: function () {
         this.closeCall();
     },

     closeCall: function () {
         fuhuo_view.curnode.removeFromParent(true);
         fuhuo_view.curnode = null;
         tywx.tt.gameover.show(this.data);
     },

     onLoad() {
         // 初始化复活按钮的相关设置
         this.fuhuoScript = this.fhBtn.getComponent("ShareButton")
         
         const share_control = tywx.tt.configManager.share_control.recovergame;
         const calltype = tywx.tt.Utils.shareVideoCtr(share_control);
         const config = calltype == 1 ? tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_SHARE : tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_VIDEO;
         this.fuhuoScript.setShareConfig(config);
         this.fuhuoScript.setButtonCallType(calltype);
         this.fuhuoScript.setSuccessCall(function () {
             self.fuHuoCall();
         });
         tywx.tt.Utils.hideWXBanner();
         // 添加交叉倒流节点
         var canadd = true;
         canadd && tywx.tt.ads.addAdsNode("blink_play", this.jcdlNode, cc.v2(0, 0));
         // 开始倒计时

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
             cc.loader.loadRes(fuhuo_view_path, (err, prefab) => {
                 if (!err) {
                     let fuhuonode = cc.instantiate(prefab);
                     let ads_script = fuhuonode.getComponent('fuhuo_view');
                     ads_script.setData(data);
                     fuhuo_view.curnode = fuhuonode;
                     cc.director.getScene().addChild(fuhuonode);
                 }
             });
         }
     },
 });


 module.exports = fuhuo_view;