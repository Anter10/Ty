 
cc.Class({
    extends: cc.Component,

    properties: {
        alertLabel: cc.Label,
    },
 
    onLoad () {
        this.setText("");
    },
    /**
     * 
     * @param {String} alert 
     */
    setText:function(alert){
       this.alertLabel.string = alert;
    },
    
    /**
     * @description 向上运动显示消失
     */
    popView:function(){
        this.node.position = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
        this.node.stopAllActions();
        let mby = cc.moveBy(1.5, cc.v2(0, 220));
        var self = this;
        let call = cc.callFunc(function(){
            self.node.stopAllActions();
            self.node.destroy();
            console.log("hellog");
        });
        let seq = cc.sequence(mby, call);
        this.node.runAction(seq);
    },


    start () {

    },

     
});
