cc.Class({
    extends: cc.Component,

    properties: {
        labelMax: cc.Label,
        labelRules: cc.Label,
        labelTips: cc.Label,
        labelCurrent: cc.Label,
        nodeCurrent: cc.Node,
        background: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        tywx.tt.Utils.hideWXBanner();
        this.background.getComponent("background").setTouchEndCall(function () {
            self.motaiCallback();
        });
        let ani = this.node.getComponent(cc.Animation);
        ani.play("show_hide");
        tywx.tt.Utils.commonScaleIn(this.node.getChildByName('root'));
    },

    start() {

    },

    onDestroy() {
        tywx.tt.Utils.showWXBanner();
    },

    // update (dt) {},

    motaiCallback() {
        if (this.closeing) {
            return;
        }
        this.closeing = true;
        var self = this;
        let call = function () {
            self.node.destroy();
        };
        let ani = this.node.getComponent(cc.Animation);
        ani.on("finished", call, this);
        ani.play("hide_ui");
    },
    btnTransferClickCallback() {
        if (this.currentcash >= 20) {
            tywx.tt.Utils.requestRedPacket2Cash();
        } else {
            tywx.tt.Utils.showWXModal('攒够20元再提现吧,加油!', '提示', false);
        }
    },
    init(current_cash) {
        this.currentcash = current_cash;
        this.labelMax.string = `余额:¥${this.currentcash}`;
        this.labelCurrent.node.active = false;
    }
});