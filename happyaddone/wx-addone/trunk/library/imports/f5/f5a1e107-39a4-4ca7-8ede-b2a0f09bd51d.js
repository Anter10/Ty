"use strict";
cc._RF.push(module, 'f5a1eEHOaRMp47esqDwm9Ud', 'PingBiView');
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