
cc.Class({
    extends: cc.Component,

    properties: {
        labelTitle: cc.Label,
        richTxtContent: cc.RichText,
        root: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ty.ado.Utils.commonScaleIn(this.root);
    },

    start () {

    },
    init(call_back,content){
        this.call_back = call_back;
        this.richTxtContent.string = content;
    },

    // update (dt) {},

    btnSureClickCallback(){
        this.call_back && this.call_back();
        this.node.destroy();
    },
    motai(){}
});
