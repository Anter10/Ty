(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/GeZi.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0cdeagIMvtLqY2J7/940TKm', 'GeZi', __filename);
// Script/models/GeZi.js

"use strict";

/*
    游戏的基本单元：格子（真实的格子）
    定义他的数字和颜色，色块的所有者
    created by gyc on 2018-08-01.
*/

var config = require("AddOneConfig");
var block = require("GeZiData");

module.exports = function (id, parent) {
    // 格子的ID
    this.id = id;
    // 格子的颜色
    this.color = cc.color(0, 0, 0, 0);
    // 格子现实的的数字
    this.num = 0;
    // 格子的容器
    this.parent = parent;
    // 格子的x坐标
    this.posx = 25 + (tywx.ado.Constants.GameCenterConfig.swidth - 5 * tywx.ado.Constants.GameCenterConfig.gezi_pitch) / 2 + id % 5 * tywx.ado.Constants.GameCenterConfig.gezi_pitch + 2;
    // 格子的Y坐标
    this.posy = 304 + parseInt(id / 5) * tywx.ado.Constants.GameCenterConfig.gezi_pitch;
    // 格子的数据层
    this.block = new block(this);

    /*
        调用: 更新Num的时候调用
        功能: 更新当前的num 并根据num来更新显示的颜色
        参数: [
            num: 格子显示的数字
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    this.setnum = function (num) {
        config = tywx.config != null ? tywx.config : config;
        this.num = num;
        var colorindex = num - 1;
        if (this.num > tywx.ado.Constants.GameCenterConfig.color_list.length) {
            colorindex = colorindex % tywx.ado.Constants.GameCenterConfig.color_list.length;
        }
        var colors = tywx.ado.Constants.GameCenterConfig.color_list[colorindex];
        var color = cc.color(colors[0], colors[1], colors[2]);
        this.setColor(color);
    };

    /*
        调用: 更新颜色的时候调用
        功能: 更新当前的颜色值
        参数: [
            color:格子需要显示的颜色
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    this.setColor = function (color) {
        this.color = color;
    };

    /*
        调用: GeZiData,GeZi中都有调用
        功能: 得到游戏的格子容器
        参数: [
            无
        ]
        返回值:[
            array:存储格子的数组
        ]
        思路: 逻辑需要
    */
    this.getAllgz = function () {
        return this.parent.getAllgz();
    };

    /*
        调用: GeZiData,GeZi中都有调用
        功能: 得到游戏的mask容器
        参数: [
            无
        ]
        返回值:[
            array:存储mask的数组
        ]
        思路: 逻辑需要
    */
    this.getAllmask = function () {
        return this.parent.getAllmask();
    };

    /*
         调用: gamemain中调用
         功能: 更新自身block的数据
         参数: [
             无
         ]
         返回值:[
             无
         ]
         思路: 逻辑需要
     */
    this.settoblock = function () {
        this.block.setinfo(this.color, this.num);
        this.block.setpos(this.posx, this.posy);
    };

    /*
           调用: gamemain中调用
           功能: 更新自身block的数据
           参数: [
               无
           ]
           返回值:[
               无
           ]
           思路: 逻辑需要
    */
    this.settoblockAndNumber = function (num) {
        if (this.block.posx != this.posx && this.block.posy != this.block.posy) {
            this.block.setinfo(this.color, num);
        }
        this.block.setpos(this.posx, this.posy);
    };

    /*
         调用: gamemain中调用
         功能: 更新自身block的数据
         参数: [
             无
         ]
         返回值:[
             无
         ]
         思路: 逻辑需要
     */
    this.settoblockvalue = function () {
        this.block.setinfo(this.color, this.num);
    };

    /*
         调用: gamemain中调用
         功能: 绘制当前的节点
         参数: [
             ctx: 绘制节点的句柄
             label:显示的label
         ]
         返回值:[
             无
         ]
         思路: 逻辑需要
     */
    this.draw = function (cell) {
        config = tywx.config != null ? tywx.config : config;
        // ctx.fillColor = this.block.color;
        // ctx.roundRect(this.block.posx,this.block.posy,tywx.ado.Constants.GameCenterConfig.gezi_size,tywx.ado.Constants.GameCenterConfig.gezi_size,8);
        // ctx.fill();
        // lable.string = this.block.num;
        // lable.node.x = this.block.posx-360+tywx.ado.Constants.GameCenterConfig.gezi_size/2;
        // lable.node.y = this.block.posy-640+tywx.ado.Constants.GameCenterConfig.gezi_size/2;

        var tilescript = cell.getComponent("celltile");
        var pngnum = this.block.num;
        if (pngnum > tywx.ado.Constants.GameCenterConfig.celltilenumColors.length) {
            pngnum = pngnum % tywx.ado.Constants.GameCenterConfig.celltilenumColors.length;
        }

        tilescript.visByNum(pngnum, this.block.num);
        var cindex = pngnum - 1;
        if (cindex < 0) {
            cindex = 0;
        }
        var colors = tywx.ado.Constants.GameCenterConfig.celltilenumColors[cindex];
        tilescript.setColor(new cc.color(colors[0], colors[1], colors[2], 255));
        cell.getComponent(cc.Sprite).node.x = this.block.posx - 360 + tywx.ado.Constants.GameCenterConfig.gezi_size / 2;
        cell.getComponent(cc.Sprite).node.y = this.block.posy - 640 + tywx.ado.Constants.GameCenterConfig.gezi_size / 2;
    };
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GeZi.js.map
        