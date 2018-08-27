"use strict";
cc._RF.push(module, 'dda65l3hgJOP4w6Cv5DWZtL', 'AnimationMagicProgressCtrl');
// script/ui/AnimationMagicProgressCtrl.js

'use strict';

var ELSEvent = require('../core/ElsEvents.js');
cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.pauseFrameIdx = 0;
    },
    start: function start() {},


    // update (dt) {},
    progressTo: function progressTo(num) {
        console.log('progressTo1', num, this.pauseFrameIdx);
        if (num === 9) {
            var main = this.game.gameNode.getComponent('main');
            if (!main.yanhua.active) {
                this.game.pauseGame();
                this.pauseFrameIdx = 0;
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_FULL, num);
            } else {
                var ani = this.node.getComponent(cc.Animation);
                ani.pause();
                //tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_MAGIC_RESET_BOTTLE,0);
            }
        } else if (num === this.pauseFrameIdx) {
            var _ani = this.node.getComponent(cc.Animation);
            _ani.pause();
            tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_ADD, num);
        } else if (num > this.pauseFrameIdx) {
            this.pauseFrameIdx = 0;
            var _ani2 = this.node.getComponent(cc.Animation);
            _ani2.pause();
            tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_MAGIC_RESET_BOTTLE, 0);
        }
    },
    setEndFrame: function setEndFrame(frame_idx) {
        console.log('sen end frame', frame_idx, this.pauseFrameIdx);
        if (frame_idx === this.pauseFrameIdx && this.pauseFrameIdx === 9) {
            this.pauseFrameIdx = 0;
            var main = this.game.gameNode.getComponent('main');
            if (!main.yanhua.active) {
                this.game.pauseGame();
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_FULL, frame_idx);
            }
            return;
        }
        if (frame_idx > this.pauseFrameIdx) {
            var ani = this.node.getComponent(cc.Animation);
            ani.resume();
        }
        this.pauseFrameIdx = frame_idx;
    },
    setGame: function setGame(game) {
        this.game = game;
    }
});

cc._RF.pop();