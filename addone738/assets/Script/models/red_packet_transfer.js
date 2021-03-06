
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
            tywx.ado.Utils.hideGameClub();
            let an = tywx.AdManager.getAdNodeByTag('GAME_START');
            if(an) an.hideAdNode();
        } else if (cc.director.getScene()._name === 'gamemain') {
            tywx.ado.Utils.hideWXBanner();
        }
        tywx.ado.Utils.commonScaleIn(this.node.getChildByName('root'));
    },

    start () {

    },

    onDestroy(){
        if(cc.director.getScene()._name === 'gamestart'){
            tywx.ado.Utils.showGameClub();
            let an = tywx.AdManager.getAdNodeByTag('GAME_START');
            if(an) an.showAdNode();
        } else if (cc.director.getScene()._name === 'gamemain') {
            tywx.ado.Utils.showWXBanner();
        }
    },

    // update (dt) {},

    motaiCallback(){

        this.node.destroy();
    },
    btnTransferClickCallback(){
        if(this.info.totalAmount >= 2000){
            tywx.ado.Utils.requestRedPacket2Cash();
        }
        else{
            tywx.ado.Utils.showWXModal('攒够20元再提现吧,加油!','提示',false);
        }
    },
    init(current_cash){
        this.info = tywx.ado.RedPacketInfo;
        this.labelMax.string = `余额:¥${tywx.ado.Utils.formatCashFen2Yuan(this.info.totalAmount)}`;
        if(current_cash){
            this.nodeCurrent.active = true;
            this.labelCurrent.string = `本次:¥${current_cash}`;
        }
        else{
            this.nodeCurrent.active = false;
            this.labelCurrent.string = `本次:¥0.0`;
        }
    }
});
