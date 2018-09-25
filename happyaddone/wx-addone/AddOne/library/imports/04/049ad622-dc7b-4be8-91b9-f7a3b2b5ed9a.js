"use strict";
cc._RF.push(module, '049adYi3HtL6JG596Oyte2a', 'luckitem');
// Script/models/luckitem.js

"use strict";

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
        mask: {
            default: null,
            type: cc.Node
        },
        itemIcon: {
            default: null,
            type: cc.Sprite
        },
        itemName: {
            default: null,
            type: cc.Label
        },
        unselectMask: cc.Node

    },

    selected: function selected() {
        //    this.mask.active = true;
        if (this.parent && this.parent.hideOtherSelected) {
            this.parent.hideOtherSelected(this);
        }
    },

    select: function select() {
        this.unselectMask.active = false;
        this.mask.active = true;
    },

    isSelected: function isSelected() {
        return this.mask.active;
    },

    unselected: function unselected() {
        this.unselectMask.active = true;
        this.mask.active = false;
    },

    setParent: function setParent(parent) {
        this.parent = parent;
    },

    setItem: function setItem(data, frame) {
        this.data = data;
        this.itemName.string = data.name;
        this.itemIcon.spriteFrame = frame;
    },

    getData: function getData() {
        return this.data;
    },

    onLoad: function onLoad() {},
    start: function start() {}
});

cc._RF.pop();