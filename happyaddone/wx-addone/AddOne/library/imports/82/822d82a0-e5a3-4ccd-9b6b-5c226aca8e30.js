"use strict";
cc._RF.push(module, '822d8Kg5aNMzZtrXCJqyo4w', 'GeZiMask');
// Script/models/GeZiMask.js

"use strict";

/*
   用于路径搜索的地图mask
   created by gyc on 2018-08-01.
*/
module.exports = function (id, parent) {
    // maskID
    this.id = id;
    // mask的父容器
    this.parent = parent;
    // 某个指定的格子
    var g = this.parent.getAllgz()[id];
    // 显示的number
    this.num = g.num;
    // 格子的行
    this.x = this.id % 5;
    // 格子的列
    this.y = parseInt(this.id / 5);
    // 从那个格子找到自己
    this.from = -1;
    // 第几步找到自己
    this.step = 9999999;

    /*
        调用: 每次连接结束的时候调用
        功能: 重制mask的初始数据
        参数: [
           无
        ]
        返回值:[
           无
        ]
        思路: 游戏逻辑需要
    */
    this.reset = function () {
        var g = this.parent.getAllgz()[this.id];
        this.num = g.num;
        this.x = this.id % 5;
        this.y = parseInt(this.id / 5);
        this.from = -1;
        this.step = 9999999;
    };
    this.showMSG = function () {
        console.log("当前的格子ID = " + this.id + " num = " + this.num + " 格子显示 " + this.num + "格子的x = " + this.x + "格子的y " + this.y);
    };
};

cc._RF.pop();