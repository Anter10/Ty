"use strict";
cc._RF.push(module, '82641E60Z5JXbfqL/zOuK9E', 'LifeStar');
// Script/models/LifeStar.js

"use strict";

/*
    游戏中的帮助界面:
    created by gyc on 2018-08-20.
    final changed by gyc on 2018-08-20.
*/
cc.Class({
    extends: cc.Component,

    properties: {
        showNode: {
            type: cc.Node,
            default: null
        },
        hideNode: {
            type: cc.Node,
            default: null
        },
        state: 1
    },

    /*
        调用: 生命值增加的时候调用
        功能: 添加现形心
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    show: function show() {
        // if(this.state == 0){
        //     return;
        // }
        // this.state = 0;
        // var self = this;
        this.showNode.active = true;
        this.hideNode.active = false;
        // var anim = this.showNode.getComponent(cc.Animation);
        // var finishCallback = function(){
        //     //  self.hideNode.active = true;
        //     //  self.showNode.active = false;
        //     anim.stop("jiaxing");
        // }
        // anim.on('finished',  finishCallback,    self);

        // var animState = anim.play("jiaxing");
        // animState.wrapMode = cc.WrapMode.Normal;
        // animState.repeatCount = 1;
    },

    /*
         调用: 生命值减少的时候调用
         功能: 显示隐形心
         参数: [
             无
         ]
         返回值:[
             无
         ]
         思路: 逻辑需要
     */
    hide: function hide() {
        // if(this.state == 1){
        //     return;
        // }
        // this.state = 1;
        // var self = this;
        this.hideNode.active = true;
        this.showNode.active = false;
        // var anim = this.hideNode.getComponent(cc.Animation);
        // var finishCallback = function(){
        //     // self.hideNode.active = false;
        //     // self.showNode.active = true;
        //     anim.stop("xiaoshi");
        //     tywx.LOGE("隐藏完成");
        // }
        // anim.on('finished',  finishCallback,    self);

        // var animState = anim.play("xiaoshi");
        // animState.wrapMode = cc.WrapMode.Normal;
        // animState.repeatCount = 1;
    },

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();