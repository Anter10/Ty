
cc.Class({
    extends: cc.Component,

    properties: {
        nodeLabelRoot: cc.Node,
        nodeIconRoot: cc.Node,
        nodeDisk: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    btnStartLottery(){
        if(this.isLottering) return;
        this.lottery();
    },
    lottery(){
        let aims = [0,1,2,3,4,5];
        let aim_id = aims[parseInt(Math.random()*aims.length)];
        let self = this;
        let current_rotate = this.nodeDisk.rotation % 360;
        //let last_aim_id = parseInt(current_rotate / 60);
        tywx.ado.logWithColor(`LOTTERY===>${aim_id}`);
        this.isLottering = true;
        this.nodeDisk.runAction(
            cc.sequence(
                cc.rotateBy(1, 360 * 2 - current_rotate).easing(cc.easeIn(2.0)),
                cc.rotateBy(2, 360 * 5),
                cc.rotateBy(1, 360 * 2 - aim_id * 60).easing(cc.easeOut(1.0)),
                cc.callFunc(()=>{
                    self.isLottering = false;
                })
            )
        );
    },
    init(){
        this.aim_id = 0;
        for(let i = 0; i < 6; ++i){
            let lable_name = `label_${i}`;
            let label_node = this.nodeLabelRoot.getChildByName(lable_name);
            if(label_node){
                label_node.getComponent(cc.Label).string = `礼物${i}`;
            }
        }
    }

});
