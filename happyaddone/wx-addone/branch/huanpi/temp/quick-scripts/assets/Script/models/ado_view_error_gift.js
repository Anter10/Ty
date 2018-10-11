(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/ado_view_error_gift.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '93648KGIaJEcIoad24GHoSc', 'ado_view_error_gift', __filename);
// Script/models/ado_view_error_gift.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        labelTitle: cc.Label,
        richTxtContent: cc.RichText,
        root: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        tywx.ado.Utils.commonScaleIn(this.root);
    },
    start: function start() {},
    init: function init(call_back, content) {
        this.call_back = call_back;
        this.richTxtContent.string = content;
    },


    // update (dt) {},

    btnSureClickCallback: function btnSureClickCallback() {
        this.call_back && this.call_back();
        this.node.destroy();
    },
    motai: function motai() {}
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
        //# sourceMappingURL=ado_view_error_gift.js.map
        