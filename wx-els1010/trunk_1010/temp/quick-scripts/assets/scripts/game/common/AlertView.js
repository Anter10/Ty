(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/common/AlertView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cf4bbvTYuVCQIyPEw6OE38K', 'AlertView', __filename);
// scripts/game/common/AlertView.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        alertLabel: cc.Label
    },

    onLoad: function onLoad() {
        this.setText("");
    },

    /**
     * 
     * @param {String} alert 
     */
    setText: function setText(alert) {
        this.alertLabel.string = alert;
    },

    /**
     * @description 向上运动显示消失
     */
    popView: function popView() {
        this.node.position = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
        this.node.stopAllActions();
        var mby = cc.moveBy(1.5, cc.v2(0, 220));
        var self = this;
        var call = cc.callFunc(function () {
            self.node.stopAllActions();
            self.node.destroy();
            console.log("hellog");
        });
        var seq = cc.sequence(mby, call);
        this.node.runAction(seq);
    },

    start: function start() {}
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
        //# sourceMappingURL=AlertView.js.map
        