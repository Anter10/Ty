"use strict";
cc._RF.push(module, 'e41e2qjmcVB5ZhRacloli8a', 'els_view_magic_bottle');
// script/ui/els_view_magic_bottle.js

'use strict';

var ELSEvent = require('../core/ElsEvents.js');
var els = require('../core/els.js');
cc.Class({
    extends: cc.Component,

    properties: {
        nodeProgressBar: cc.Node,
        nodeGiftBox: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.currentProgress = 0;
        this.maxProgress = 100;
        this.posStart = -72;
        this.posEnd = 42;
        this.dis = this.posEnd - this.posStart;
        this.nodeProgressBar.position.y = this.posStart;
        this.progressTo(0);
    },
    start: function start() {},


    // update (dt) {},
    setProgress: function setProgress(value) {
        console.log('els_view_magic_bottle/setProgress', value);
        this.currentProgress = value > 100 ? 100 : value;
        this.nodeGiftBox.opacity = parseInt(this.currentProgress / 100 * 255);
    },
    progressTo: function progressTo(value) {
        console.log('els_view_magic_bottle/progressTo', value);
        this.setProgress(value);
        var cur_pos_y = this.nodeProgressBar.position.y;
        var aim_pos_y = this.posStart + value / this.maxProgress * this.dis;
        var dis = aim_pos_y - cur_pos_y;
        if (dis > 0) {
            var self = this;
            this.nodeProgressBar.stopAllActions();
            this.nodeProgressBar.runAction(cc.sequence(cc.moveTo(0.2, cc.p(0, aim_pos_y)), cc.callFunc(function () {
                if (self.isCallFull()) {
                    //! 满了
                    tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_FULL, self.currentProgress);
                    self.progressTo(0);
                }
            })));
        } else {
            console.log('els_view_magic_bottle/els_view_magic_bottle', 'bottle animation failed, force to progress.');
            this.nodeProgressBar.position = cc.p(0, parseInt(aim_pos_y));
            // 动画结束可能不执行，所以，在这里添加一个判断
            if (this.isCallFull()) {
                //! 满了
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_FULL, this.currentProgress);
                this.progressTo(0);
            }
        }
    },
    isCallFull: function isCallFull() {
        var ret = false;
        var is_full = this.currentProgress === this.maxProgress; // 能量是否满了
        var main = tywx.UIManager.game.gameNode.getComponent('main');
        var is_over = main.yanhua.active; // 当前关卡是否已经结束
        var is_endless_over = tywx.UIManager.game.model.mconf.isEndless && tywx.UIManager.game.isShowingEndlessLevelEnd;
        var is_show_hp = tywx.UIManager.game.model.currentStatus === els.ELS_GAME_STATE.HOMEPAGE; // 是否在homePage界面
        ret = is_full && !is_over && !is_show_hp && !is_endless_over;
        console.log('els_view_magic_bottle/isCallFull', 'is_full:' + is_full + ',is_over:' + is_over + ', is_show_hp:' + is_show_hp);
        return ret;
    }
});

cc._RF.pop();