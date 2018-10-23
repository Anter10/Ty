"use strict";
cc._RF.push(module, 'cd404u50m1O/rafYWnOqEfD', 'background');
// scripts/game/common/background.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        var self = this;
        this.background.width = cc.game.canvas.width;
        this.background.height = cc.game.canvas.height;

        this.background.on('touchstart', function (event) {
            return true;
        });
        this.background.on('touchend', function (event) {
            self.state = 0;
        });
    },

    close: function close() {
        this.node.removeFromParent(true);
        this.destroy();
    },

    start: function start() {}

    // update (dt) {},
});

cc._RF.pop();