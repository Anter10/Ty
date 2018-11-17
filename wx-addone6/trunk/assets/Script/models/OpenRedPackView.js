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
         nodeWarn: cc.Node,
         labelWarn: cc.Label
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
         this.nodeWarn.active = false;
         //this.nodeWarn.active = tywx.ado.Configs.red_pack_share_warn.is_show;
         //this.labelWarn.string = tywx.ado.Configs.red_pack_share_warn.content;
     },

     /** 
      * @description 界面弹出的时候调用
      */
     showUI: function () {
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

     /**
      * @description 点击开红包的时候调用
      */
     open: function () {
         if (!tywx.StateInfo.networkConnected) {
             return;
         }
         var self = this;
         let param = {
             success: function () {
                 if (tywx.gamecenter && tywx.gamecenter.flushMoneyNumber) {
                     tywx.gamecenter.flushMoneyNumber();
                     tywx.gamecenter.flushRedPacketBtns(0);
                 }
                 //tywx.ado.Utils.showWXToast("领取红包成功");
                 self.close();
                 tywx.ado.Utils.showRedPacketTransferPop(tywx.ado.Utils.formatCashFen2Yuan(tywx.ado.RedPacketInfo.nextAmount));
             },
             fail: function () {
                 //  self.close();
             }
         }
         tywx.ado.Utils.requestAddRedPacket(param);
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
         const share_control = tywx.config.share_control_2.redpack;
         var random = parseInt(Math.random() * 100);
         // 处理配置控制信息
         if ((share_control[0] == "video" || tywx.ado.isMinGanIP) && tywx.ado.isCanWatchVideo) {
             this.openRedPackBtn.setShareConfig(tywx.ado.Constants.ShareConfig.OPEN_RED_PACKET_SHARE_VIDEO);
             if (random <= share_control[1] || tywx.ado.isMinGanIP) {
                 this.openRedPackBtn.setButtonCallType(2);
             } else {
                 this.openRedPackBtn.setShareConfig(tywx.ado.Constants.ShareConfig.OPEN_RED_PACKET_SHARE);
                 this.openRedPackBtn.setButtonCallType(1);
             }
         } else if (share_control[0] == "share" || !tywx.ado.isCanWatchVideo) {
             this.openRedPackBtn.setShareConfig(tywx.ado.Constants.ShareConfig.OPEN_RED_PACKET_SHARE);
             if (random <= share_control[1]) {
                 this.openRedPackBtn.setButtonCallType(1);
             } else {
                 this.openRedPackBtn.setShareConfig(tywx.ado.Constants.ShareConfig.OPEN_RED_PACKET_SHARE_VIDEO);
                 this.openRedPackBtn.setButtonCallType(2);
             }
         }

         if (this.data.needShare == false) {
             this.openRedPackBtn.setReactCall(true);
         } else {
             //  if (tywx.config.auditing == true) {
             //     this.openRedPackBtn.setReactCall(true);
             //  } else {
             //     this.openRedPackBtn.setReactCall(false);
             //  }
             this.openRedPackBtn.setShareGroupCall(function () {
                 self.playRotate();
             });
             this.openRedPackBtn.setShareConfig(tywx.ado.Constants.ShareConfig.OPEN_RED_PACKET_SHARE);
         }
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
         let scale1 = cc.scaleTo(0.25, 0, 1);
         let scale2 = cc.scaleTo(0.25, 1, 1);
         var open = cc.callFunc(function () {
             self.kaibottomNode.active = false;
             //  self.redPackNumberLabel.node.active = true;
             //  let scale3 = cc.scaleTo(0.2, 0.8);
             //  let scale4 = cc.scaleTo(0.2, 1);
             //  self.redPackNumberLabel.node.runAction(cc.sequence(scale3, scale4));
             self.isOpening = false;
         })
         var tcall = cc.callFunc(function () {
             self.open();
         });
         var seq = cc.sequence(scale1, scale2, open, tcall);
         this.kaibottomNode.runAction(seq);
     },
 });