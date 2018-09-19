(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/red_packet_transfer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8c511yXhOtNRYAkBbuTi5Ge', 'red_packet_transfer', __filename);
// Script/models/red_packet_transfer.js

'use strict';

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

    onLoad: function onLoad() {
        if (cc.director.getScene()._name === 'gamestart') {
            tywx.ado.Utils.hideGameClub();
            var an = tywx.AdManager.getAdNodeByTag('GAME_START');
            if (an) an.hideAdNode();
        } else if (cc.director.getScene()._name === 'gamemain') {
            tywx.ado.Utils.hideWXBanner();
        }
        tywx.ado.Utils.commonScaleIn(this.node.getChildByName('root'));
    },
    start: function start() {},
    onDestroy: function onDestroy() {
        if (cc.director.getScene()._name === 'gamestart') {
            tywx.ado.Utils.showGameClub();
            var an = tywx.AdManager.getAdNodeByTag('GAME_START');
            if (an) an.showAdNode();
        } else if (cc.director.getScene()._name === 'gamemain') {
            tywx.ado.Utils.showWXBanner();
        }
    },


    // update (dt) {},

    motaiCallback: function motaiCallback() {

        this.node.destroy();
    },
    btnTransferClickCallback: function btnTransferClickCallback() {
        if (this.info.totalAmount >= 2000) {
            tywx.ado.Utils.requestRedPacket2Cash();
        } else {
            tywx.ado.Utils.showWXModal('低于20元不能提现', '提示', false);
        }
    },
    init: function init(current_cash) {
        this.info = tywx.ado.RedPacketInfo;
        this.labelMax.string = '\u4F59\u989D:\xA5' + tywx.ado.Utils.formatCashFen2Yuan(this.info.totalAmount);
        if (current_cash) {
            this.nodeCurrent.active = true;
            this.labelCurrent.string = '\u672C\u6B21:\xA5' + current_cash;
        } else {
            this.nodeCurrent.active = false;
            this.labelCurrent.string = '\u672C\u6B21:\xA50.0';
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=red_packet_transfer.js.map
        