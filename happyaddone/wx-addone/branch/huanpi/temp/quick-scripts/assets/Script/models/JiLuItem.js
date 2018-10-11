(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/JiLuItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9860a+lNFlJtL+y9tiwuxbn', 'JiLuItem', __filename);
// Script/models/JiLuItem.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        timeLabel: {
            default: null,
            type: cc.Label
        },
        nameLabel: {
            default: null,
            type: cc.Label
        }
    },

    // onLoad () {},
    setData: function setData(data) {
        this.data = data;
        this.timeLabel.string = this.data.time;
        this.nameLabel.string = this.data.item.name;
    },

    start: function start() {}
}

// update (dt) {},
);

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
        //# sourceMappingURL=JiLuItem.js.map
        