 
cc.Class({
    extends: cc.Component,

    properties: {
        showLotteryButton:cc.Node, 
    },
    
    onLoad:function(){
        this.type = "home";
    },
    
    setType:function(ttype){
        this.type = ttype;
    },
    
    showLottery:function(){
        tywx.tt.lottery.showLottery(this.type);
    },

    start:function() {

    },

    // update (dt) {},
});
