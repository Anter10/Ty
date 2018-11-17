 
cc.Class({
    extends: cc.Component,

    properties: {
        lianjiLabel: cc.Label,
        hideLabel: cc.Label,
    },

    setNumber:function(number){
       this.lianjiLabel.string = ""+number;
       this.hideLabel.string = ""+number;
    },

    setLianjiNode:function(ljnode){
        this.ljnode = ljnode;
    },

    onFinished:function(){
       this.node.active = false;
       tywx.gamecenter.putLianJiNode(this.ljnode);
    },

    play:function(){
       if(!this.nodeAni){
           this.nodeAni = this.node.getComponent(cc.Animation);
           this.nodeAni.play("lianji");
           this.nodeAni.on('finished', this.onFinished, this);
       }else{
           this.nodeAni.stop("lianji");
           this.node.scale = 0.8;
           this.node.active = true;
           this.nodeAni.play("lianji");
       }
      
    },

    start () {

    },

    // update (dt) {},
});
