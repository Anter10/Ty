(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/PingBiView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f5a1eEHOaRMp47esqDwm9Ud', 'PingBiView', __filename);
// Script/models/PingBiView.js

'use strict';

var PingBiView = cc.Class({
    extends: cc.Component,

    properties: {
        backGround: {
            default: null,
            type: cc.Node
        }
    },

    onLoad: function onLoad() {
        this.backGround.on('touchstart', function (event) {
            return true;
        });
    },
    start: function start() {}
}

// update (dt) {},
);

module.exports = PingBiView;

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
        //# sourceMappingURL=PingBiView.js.map
        