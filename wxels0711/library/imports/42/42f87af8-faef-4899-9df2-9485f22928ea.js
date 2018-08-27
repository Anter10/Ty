"use strict";
cc._RF.push(module, '42f87r4+u9ImZ3ylIXyKSjq', 'ComboAnimation');
// script/ui/ComboAnimation.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        nodeGood: cc.Node,
        nodeCombo: cc.Node,
        nodeAwesome: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.comboNum = 0;
        this.playAnimationCount = 0;
        this.is_combo = false;
        this.nodeGood.active = false;
        this.nodeCombo.active = false;
        this.nodeAwesome.active = false;
    },
    start: function start() {
        this.play();
    },


    // update (dt) {},

    init: function init(is_combo, combo) {
        console.log('combo animation init', is_combo, combo);
        this.comboNum = combo;
        this.is_combo = is_combo;
        if (is_combo) {
            var tmp_node = this.nodeCombo.getChildByName('heji');
            var combo_label = tmp_node.getChildByName('label').getComponent(cc.Label);
            if (combo_label) {
                combo_label.string = combo + '';
            }
        }
    },
    play: function play() {
        console.log('combo animation play');
        this.playAnimationCount = 0;
        if (this.is_combo) {
            if (this.comboNum >= 3) {
                //! show combo
                this.showCombo();
            }
        } else {
            if (this.comboNum === 3) {
                //! show good
                this.showGood();
            } else if (this.comboNum >= 4) {
                //! show awesome
                this.showAwesome();
            } else {
                this.node.removeFromParent();
            }
        }
    },
    showGood: function showGood() {
        console.log('play good');
        this.nodeGood.active = true;
        var ani = this.nodeGood.getComponent(cc.Animation);
        ani.play();
        this.playAnimationCount++;

        var self = this;
        ani.on('finished', function (num, string) {
            console.log('good finished', num, string);
            self.animationEnd();
        }, this);
    },
    showAwesome: function showAwesome() {
        console.log('play awesome');
        this.nodeAwesome.active = true;
        var ani = this.nodeAwesome.getComponent(cc.Animation);
        ani.play();
        this.playAnimationCount++;

        var self = this;
        ani.on('finished', function (num, string) {
            console.log('awesome finished', num, string);
            self.animationEnd();
        }, this);
    },
    showCombo: function showCombo() {
        console.log('play combo');
        this.nodeCombo.active = true;
        var ani = this.nodeCombo.getComponent(cc.Animation);
        ani.play();
        this.playAnimationCount++;

        var self = this;
        ani.on('finished', function (num, string) {
            console.log('combo finished', num, string);
            self.animationEnd();
        }, this);
    },
    animationEnd: function animationEnd() {
        this.playAnimationCount--;
        if (this.playAnimationCount <= 0) {
            this.node.removeFromParent();
        }
    }
});

cc._RF.pop();