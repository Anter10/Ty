"use strict";
cc._RF.push(module, '37443SttzFNHp6EmKprmUhU', 'float_ani');
// script/ui/float_ani.js

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
        default_clip: cc.AnimationClip
    },

    onLoad: function onLoad() {
        var animation = this.node.addComponent(cc.Animation);
        this.default_clip.name = "float_ani";
        animation.addClip(this.default_clip);
        //        let animationComponent = this.node.getComponent(cc.Animation);
        setTimeout(function () {
            animation.play("float_ani");
        }, Math.random() * 1000);
    }
});

cc._RF.pop();