(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/common/red_packet_transfer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '29e57pwKshPcpoalpAKS2sM', 'red_packet_transfer', __filename);
// scripts/game/common/red_packet_transfer.js

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
            tywx.tt.Utils.hideGameClub();
            var an = tywx.AdManager.getAdNodeByTag('GAME_START');
            if (an) an.hideAdNode();
        } else if (cc.director.getScene()._name === 'gamemain') {
            tywx.tt.Utils.hideWXBanner();
        }
        tywx.tt.Utils.commonScaleIn(this.node.getChildByName('root'));
    },
    start: function start() {},
    onDestroy: function onDestroy() {
        if (cc.director.getScene()._name === 'gamestart') {
            tywx.tt.Utils.showGameClub();
            var an = tywx.AdManager.getAdNodeByTag('GAME_START');
            if (an) an.showAdNode();
        } else if (cc.director.getScene()._name === 'gamemain') {
            tywx.tt.Utils.showWXBanner();
        }
    },


    // update (dt) {},

    motaiCallback: function motaiCallback() {
        this.node.destroy();
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
        this.labelMax.string = '\u4F59\u989D:\xA5' + this.currentcash;
        this.labelCurrent.node.active = false;
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
        