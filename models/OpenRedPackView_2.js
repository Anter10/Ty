 cc.Class({
     extends: cc.Component,

     properties: {
       
         kaibottomNode: {
             default: null,
             type: cc.Node,
         },
         bottomNode: {
             default: null,
             type: cc.Node,
         },
         background: {
              default: null,
              type: cc.Sprite,
         },
         shareButtonNode: {
             default: null,
             type: cc.Node,
         },
         isOpening: false,
     },

     /** 
      * @description 
      */
     close: function (notneedshow) {
        tywx.ado.Utils.showWXBanner();
        this.node.destroy();
     },

     /**
      * @description 加载完成后调用
      */
     onLoad() {
            this.background.node.on('touchstart', function (event) {
                return true;
            });
     },

     /** 
      * @description 界面弹出的时候调用
     */
     showUI:function(){
          tywx.ado.Utils.commonScaleIn(this.bottomNode);
     },

     /**
      * @description 加载完成后调用
      * @param {Number} moneyNum 红包金额
      */
     setData(data) {
         this.data = data;
         console.log("当前的设置数据 = " + JSON.stringify(this.data));
        //  this.redPackNumberLabel.string = tywx.ado.Utils.formatCashFen2Yuan(this.data.nextAmount) + " 元"
         this.initOpenLogic();
     },
     init(is_double){
         //this.initOpenLogic();
         this.is_double = is_double;
     },
     
     /**
      * @description 点击开红包的时候调用
      */
     open:function(){
         if(!tywx.StateInfo.networkConnected){
            return;
         }
         var self = this;
         let param = {
            success:function(add_amount){
                 self.close();
                 tywx.ado.Utils.showRedPacketTransferPop(tywx.ado.Utils.formatCashFen2Yuan(add_amount));
             },
             fail:function(){
                //  self.close();
             },
             double: this.is_double | false,
         };
         tywx.ado.Utils.requestEveryLoginReward(param);
     },

     /** 
      * @description 初始化开红包逻辑
      */
     initOpenLogic: function () {
         var self = this;
         this.openRedPackBtn = this.shareButtonNode.getComponent("ShareButton");
         this.openRedPackBtn.setSuccessCall(function () {
               self.playRotate();
         });
         this.openRedPackBtn.setReactCall(true);
     },


     /** 
      * @description 播放旋转动画
      */
     playRotate: function () {
         if (this.isOpening) {
             return;
         }
         this.isOpening = true;
         var self = this;
         let scale1 = cc.scaleTo(0.5, 0, 1);
         let scale2 = cc.scaleTo(0.5, 1, 1);
         var open = cc.callFunc(function () {
             self.kaibottomNode.active = false;
             self.isOpening = false;
         });
         var tcall = cc.callFunc(function(){
              self.open();
         }) ;
         var seq = cc.sequence(scale1, scale2, open, tcall);
         this.kaibottomNode.runAction(seq);
     },
 });