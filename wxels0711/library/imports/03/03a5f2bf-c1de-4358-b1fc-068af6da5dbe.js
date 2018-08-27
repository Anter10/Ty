"use strict";
cc._RF.push(module, '03a5fK/wd5DWLH8Bor22l2+', 'star');
// script/ui/star.js

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
        small_get: cc.Sprite,
        small_not: cc.Sprite,
        large_get: cc.Sprite,
        large_not: cc.Sprite,
        ani_add_node: cc.Node,
        ani_del_node: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this._addAnimation = this.ani_add_node.getComponent(cc.Animation);
        this._delAnimation = this.ani_del_node.getComponent(cc.Animation);
    },
    init: function init(type, state) {
        console.log('star init start', type, state);
        this._resetState();
        this._type = type;
        this._state = state;
        if (type === 0) {
            //小
            if (state === 0) {
                this.small_not.node.active = true;
            } else {
                this.small_get.node.active = true;
            }
            this.size_w = 10;
        } else {
            //大
            if (state === 0) {
                this.large_not.node.active = true;
            } else {
                this.large_get.node.active = true;
            }
            this.size_w = 46;
        }
        console.log('star int end');
    },


    playAniAdd: function playAniAdd() {
        if (this._type == 0) return;
        this.ani_add_node.active = true;
        this._addAnimation.play();
    },

    playAnidel: function playAnidel() {
        if (this._type == 0) return;
        this.ani_del_node.active = true;
        this._delAnimation.play();
    },

    _resetState: function _resetState() {
        this.small_get.node.active = false;
        this.small_not.node.active = false;
        this.large_get.node.active = false;
        this.large_not.node.active = false;
        this.ani_add_node.active = false;
        this.ani_del_node.active = false;
    },

    start: function start() {
        var self = this;
        this._addAnimation.on('finished', function () {
            self._state = 1;
            self.large_not.node.active = false;
            self.large_get.node.active = true;
        }, this);
        this._delAnimation.on('finished', function () {
            self._state = 0;
            self.large_not.node.active = true;
            self.large_get.node.active = false;
        }, this);
    }
}

// update (dt) {},
);

cc._RF.pop();