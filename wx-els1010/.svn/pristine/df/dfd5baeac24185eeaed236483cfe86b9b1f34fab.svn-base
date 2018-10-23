
cc.Class({
    extends: cc.Component,

    properties: {
        labelMax: cc.Label,
        labelRules: cc.Label,
        labelTips: cc.Label,
        labelCurrent: cc.Label,
        nodeCurrent: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(cc.director.getScene()._name === 'gamestart'){
            tywx.tt.Utils.hideGameClub();
            let an = tywx.AdManager.getAdNodeByTag('GAME_START');
            if(an) an.hideAdNode();
        } else if (cc.director.getScene()._name === 'gamemain') {
            tywx.tt.Utils.hideWXBanner();
        }
        tywx.tt.Utils.commonScaleIn(this.node.getChildByName('root'));
    },

    start () {

    },

    onDestroy(){
        if(cc.director.getScene()._name === 'gamestart'){
            tywx.tt.Utils.showGameClub();
            let an = tywx.AdManager.getAdNodeByTag('GAME_START');
            if(an) an.showAdNode();
        } else if (cc.director.getScene()._name === 'gamemain') {
            tywx.tt.Utils.showWXBanner();
        }
    },

    // update (dt) {},

    motaiCallback(){
        this.node.destroy();
    },
    btnTransferClickCallback(){
        if (this.currentcash >= 20) {
            tywx.tt.Utils.requestRedPacket2Cash();
        }
        else{
            tywx.tt.Utils.showWXModal('攒够20元再提现吧,加油!','提示',false);
        }
    },
    init(current_cash){
        this.currentcash = current_cash;
        this.labelMax.string = `余额:¥${this.currentcash}`;
        this.labelCurrent.node.active = false;
    }
});
