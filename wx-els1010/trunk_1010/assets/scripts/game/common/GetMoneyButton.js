 
cc.Class({
    extends: cc.Component,

    properties: {
        labelMaxCash: cc.Label
    },
 
    onLoad () {

    },
    
    /** 
     * @description 提现的时候调用
    */
    getMoneyCall:function(){
         tywx.tt.Utils.showRedPacketTransferPop(this.cash);
    },

    init(cash){
        this.cash = cash.max;
        this.labelMaxCash.string = `¥${cash.max}`;
    },

    statics:{
        addBtn:function(node){
               
        }
    }
});
