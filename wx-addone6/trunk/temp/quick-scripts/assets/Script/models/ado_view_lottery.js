(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/ado_view_lottery.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd99f6Z58iVEV503SAG7Lh48', 'ado_view_lottery', __filename);
// Script/models/ado_view_lottery.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        nodeLabelRoot: cc.Node,
        nodeIconRoot: cc.Node,
        nodeDisk: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},


    // update (dt) {},
    btnStartLottery: function btnStartLottery() {
        if (this.isLottering) return;
        this.lottery();
    },
    lottery: function lottery() {
        var aims = [0, 1, 2, 3, 4, 5];
        var aim_id = aims[parseInt(Math.random() * aims.length)];
        var self = this;
        var current_rotate = this.nodeDisk.rotation % 360;
        //let last_aim_id = parseInt(current_rotate / 60);
        tywx.ado.logWithColor("LOTTERY===>" + aim_id);
        this.isLottering = true;
        this.nodeDisk.runAction(cc.sequence(cc.rotateBy(1, 360 * 2 - current_rotate).easing(cc.easeIn(2.0)), cc.rotateBy(2, 360 * 5), cc.rotateBy(1, 360 * 2 - aim_id * 60).easing(cc.easeOut(1.0)), cc.callFunc(function () {
            self.isLottering = false;
        })));
    },
    init: function init() {
        this.aim_id = 0;
        for (var i = 0; i < 6; ++i) {
            var lable_name = "label_" + i;
            var label_node = this.nodeLabelRoot.getChildByName(lable_name);
            if (label_node) {
                label_node.getComponent(cc.Label).string = "\u793C\u7269" + i;
            }
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
        //# sourceMappingURL=ado_view_lottery.js.map
        