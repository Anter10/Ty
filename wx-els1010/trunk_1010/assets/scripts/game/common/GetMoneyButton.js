 cc.Class({
     extends: cc.Component,

     properties: {
         labelMaxCash: cc.Label
     },

     onLoad() {

     },

     /** 
      * @description 提现的时候调用
      */
     getMoneyCall: function () {
         console.log("money node scale = "+this.node.scale);
         this.showCall && this.showCall();
         tywx.tt.Utils.showRedPacketTransferPop(this.cash);
     },

     init(cash) {
         this.cash = cash.max;
         this.labelMaxCash.string = `¥${cash.max}`;
     },

     setShowCall(sc) {
         this.showCall = sc;
     },

     statics: {
         addBtn: function (node) {

         }
     }
 });