(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/els_view_add_magic.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5540eRp3N1DCYGS7gtBoM1F', 'els_view_add_magic', __filename);
// script/ui/els_view_add_magic.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        labAddValue: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        var dt = 0.8;
        var self = this;
        this.node.runAction(cc.sequence(cc.spawn(cc.moveBy(dt, cc.p(0, 100)), cc.scaleBy(dt, 1.5), cc.fadeOut(dt)), cc.callFunc(function () {
            console.log('add magic animation end callback');
            self.ani_cb && self.ani_cb();
        }), cc.removeSelf()));
    },


    // update (dt) {},
    init: function init(add_value, cb) {
        this.labAddValue.string = '+' + add_value;
        this.ani_cb = cb;
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
        //# sourceMappingURL=els_view_add_magic.js.map
        