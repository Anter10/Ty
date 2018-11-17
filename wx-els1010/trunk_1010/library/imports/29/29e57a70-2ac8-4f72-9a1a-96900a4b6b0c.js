"use strict";
cc._RF.push(module, '29e57pwKshPcpoalpAKS2sM', 'red_packet_transfer');
// scripts/game/common/red_packet_transfer.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        labelMax: cc.Label,
        labelRules: cc.Label,
        labelTips: cc.Label,
        labelCurrent: cc.Label,
        nodeCurrent: cc.Node,
        background: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        var self = this;
        tywx.tt.Utils.hideWXBanner();
        this.background.getComponent("background").setTouchEndCall(function () {
            self.motaiCallback();
        });
        var ani = this.node.getComponent(cc.Animation);
        ani.play("show_hide");
        tywx.tt.Utils.commonScaleIn(this.node.getChildByName('root'));
    },
    start: function start() {},
    onDestroy: function onDestroy() {
        tywx.tt.Utils.showWXBanner();
    },


    // update (dt) {},

    motaiCallback: function motaiCallback() {
        if (this.closeing) {
            return;
        }
        this.closeing = true;
        var self = this;
        var call = function call() {
            self.node.destroy();
        };
        var ani = this.node.getComponent(cc.Animation);
        ani.on("finished", call, this);
        ani.play("hide_ui");
    },
    btnTransferClickCallback: function btnTransferClickCallback() {
        if (this.currentcash >= 20) {
            tywx.tt.Utils.requestRedPacket2Cash();
        } else {
            tywx.tt.Utils.showWXModal('攒够20元再提现吧,加油!', '提示', false);
        }
    },
    init: function init(current_cash) {
        this.currentcash = current_cash;
        this.labelMax.string = "\u4F59\u989D:\xA5" + this.currentcash;
        this.labelCurrent.node.active = false;
    }
});

cc._RF.pop();