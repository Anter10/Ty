"use strict";
cc._RF.push(module, '5ac62QVqmtLEaM3z/RAOb1S', 'Effect');
// Script/models/Effect.js

"use strict";

/*
    游戏的相关特效
    游戏的操作的主要逻辑在这个module里面编写
    created by gyc on 2018-08-01.
*/

// 倒入游戏涉及到的module
var config = require("AddOneConfig");

var Effect = cc.Class({
    name: "effect",
    extends: cc.Component,
    properties: {
        effectNode: {
            default: null,
            type: cc.Node
        },

        // 管理的所有特效
        efts: {
            default: [],
            type: cc.Prefab
        },
        // 管理的动画名称列表
        // anims:[
        //    "encourage", // good动画名称
        // ],
        anims: []
        //nodePool:null,

    },

    // 播放给定的动画
    palyAni: function palyAni(index, aniName, node, pos, repeatCount, model) {
        if (index >= 0 && index < this.efts.length) {
            var effectNode = cc.instantiate(this.efts[index]);
            var animation = effectNode.getComponent(cc.Animation);
            var animationState = animation.play(name);
            animationState.wrapModel = model != null ? cc.WrapMode.Normal : cc.WrapMode.Loop;
            animationState.repeatCount = repeatCount != null ? repeatCount : 1;
            this.nodePools.put(effectNode);
        } else {
            tywx.LOGE("当前播放的下标动画不存在，请稍后再试");
        }
    },


    /*
        调用: 节点加载完成后的回调
        功能: 节点加载完成后的一些UI逻辑处理
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 系统自带
    */
    onLoad: function onLoad() {
        this.nodePools = new cc.NodePool();
    },

    /*
        调用: 不需要控件的时候调用
        功能: 从内存中删除node
        参数: [
           无
        ]
        返回值:[
           无
        ]
        思路: 游戏逻辑需要
    */
    remove: function remove() {
        this.node.destroy();
    },

    /*
        调用: 系统new 的时候调用。
        功能: 该类的构造函数 可用于自身变量的初始化
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 系统自带
    */
    ctor: function ctor(num) {
        config = tywx.config != null ? tywx.config : config;
    },

    /*
        调用: 每一帧都调用的逻辑。
        功能: 渲染当前的场景树
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 系统自带
    */
    update: function update(dt) {}

});

module.exports = Effect;

cc._RF.pop();