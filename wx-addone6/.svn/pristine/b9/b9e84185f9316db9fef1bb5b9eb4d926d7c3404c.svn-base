 
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
         ty.ado.Utils.showRedPacketTransferPop();
    },
    init(cash){
        this.labelMaxCash.string = `¥${cash.max}`;
    }
});
