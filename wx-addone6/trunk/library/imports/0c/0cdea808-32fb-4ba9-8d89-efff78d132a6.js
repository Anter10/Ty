"use strict";
cc._RF.push(module, '0cdeagIMvtLqY2J7/940TKm', 'GeZi');
// Script/models/GeZi.js

"use strict";

/*
    游戏的基本单元：格子（真实的格子）
    定义他的数字和颜色，色块的所有者
    created by gyc on 2018-08-01.
*/

var config = require("AddOneConfig");
var block = require("GeZiData");

/**
 * @description 格子对象
 * @param {Number } id  当前的标签ID
 * @param {*} parent 
 * @param {*} label_id 
 */
module.exports = function (id, parent, label_id) {
    // console.log("当前的格子初始化信息 = " + label_id);
    // 格子的ID
    this.id = id;
    this.label_id = label_id;
    // 格子的颜色
    this.color = cc.color(0, 0, 0, 0);
    // 格子现实的的数字
    this.num = 0;
    // 格子的容器

    var tmp_pitchw = tywx.ado.Constants.GameCenterConfig.gezi_h_s + tywx.ado.Constants.GameCenterConfig.gezi_gap / 2;
    var tmp_pitchh = tywx.ado.Constants.GameCenterConfig.gezi_size * 3 / 2 + tywx.ado.Constants.GameCenterConfig.gezi_gap;

    this.parent = parent;
    // 格子的x坐标
    this.posx = tywx.ado.Constants.GameCenterConfig.gezi_offx + id % tywx.ado.Constants.GameCenterConfig.rowcellNumber * tmp_pitchw + tywx.ado.Constants.GameCenterConfig.gezi_h_s;
    // 格子的Y坐标
    this.posy = tywx.ado.Constants.GameCenterConfig.gezi_offy + parseInt(id / tywx.ado.Constants.GameCenterConfig.rowcellNumber) * tmp_pitchh;
    // console.log(id + "当前格子的位置 = " + "x = " + this.posx + " y = " + this.posy)

    // 格子的数据层
    if (this.label_id >= 0) this.block = new block(this);else this.block = null;

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
    this.setnum = function (num, click) {
        if (num) {
            if (!click && num % 2 == 0 && num > tywx.ado.Constants.GameCenterConfig.moreThanTenNumber - 1 && !this.hasout) {
                if (this.block) {
                    this.block.printMSG();
                    //   console.log(this.id + " cell gz num  = " + num + " " + tywx.gamecenter.hasShowxhgNum(num));
                    if (this.block.id_keep == -1 && this.block.id_dest == -1) {
                        if (tywx.gamecenter.hasShowxhgNum(num) == false) {
                            tywx.gamecenter.allpngs[this.id] && tywx.gamecenter.allpngs[this.id].getComponent("celltile").showThanTenIcon();
                            tywx.gamecenter.addxhgNumber(num, this.id);
                        } else {
                            if (tywx.gamecenter.allpngs[this.id] && tywx.gamecenter.allpngs[this.id].getComponent("celltile").xhgIcon.active == true) {
                                console.log("移除皇冠4");
                                tywx.gamecenter.addMoreThanNumberEffect(this.id);
                            }
                            tywx.gamecenter.allpngs[this.id] && tywx.gamecenter.allpngs[this.id].getComponent("celltile").hideThanTenIcon();
                            //  tywx.gamecenter.removexhgNumber(num);
                        }
                    } else if (this.block.id_keep != -1 && this.block.id_dest != -1) {
                        // console.log(JSON.stringify(tywx.gamecenter.curshowxhgs) + "keep ahd = " + tywx.gamecenter.hasShowxhgId(this.block.id_keep));
                        if (tywx.gamecenter.hasShowxhgId(this.block.id_keep) == true && tywx.gamecenter.allpngs[this.block.id_keep].getComponent("celltile").xhgIcon.active == true) {
                            tywx.gamecenter.allpngs[this.block.id_dest] && tywx.gamecenter.allpngs[this.block.id_dest].getComponent("celltile").showThanTenIcon();
                            tywx.gamecenter.addxhgNumber(num, this.block.id_dest);
                        }
                        tywx.gamecenter.removexhgId(this.block.id_keep);
                        tywx.gamecenter.allpngs[this.block.id_keep] && tywx.gamecenter.allpngs[this.block.id_keep].getComponent("celltile").hideThanTenIcon();
                    } else if (this.block.id_keep != -1 && this.block.id_dest == -1) {
                        if (tywx.gamecenter.hasShowxhgNum(num) == false) {
                            tywx.gamecenter.addxhgNumber(num, this.block.id_keep);
                            tywx.gamecenter.allpngs[this.block.id_keep] && tywx.gamecenter.allpngs[this.block.id_keep].getComponent("celltile").showThanTenIcon();
                        }
                    }
                }
            } else {
                if (this.block) {
                    if (num > tywx.ado.Constants.GameCenterConfig.moreThanTenNumber) {
                        if (tywx.gamecenter.hasShowxhgId(this.block.id_keep) == true) {
                            if (tywx.gamecenter.allpngs[this.block.id_keep] && tywx.gamecenter.allpngs[this.block.id_keep].getComponent("celltile").xhgIcon.active == true) {
                                console.log("移除皇冠2");
                                tywx.gamecenter.addMoreThanNumberEffect(this.block.id_keep);
                            }
                            tywx.gamecenter.removexhgId(this.block.id_keep);
                            tywx.gamecenter.allpngs[this.block.id_keep] && tywx.gamecenter.allpngs[this.block.id_keep].getComponent("celltile").hideThanTenIcon();
                        }
                    }
                    if (tywx.gamecenter.allpngs[this.id] && tywx.gamecenter.allpngs[this.id].getComponent("celltile").xhgIcon.active == true) {
                        console.log("移除皇冠1");
                        tywx.gamecenter.addMoreThanNumberEffect(this.id);
                    }
                    tywx.gamecenter.allpngs[this.id] && tywx.gamecenter.allpngs[this.id].getComponent("celltile").hideThanTenIcon();
                }
            }
            config = tywx.config != null ? tywx.config : config;
            this.num = num;
            var colorindex = num - 1;
            // if (this.num > tywx.ado.Constants.GameCenterConfig.color_list.length) {
            colorindex = colorindex % tywx.ado.Constants.GameCenterConfig.color_list.length;
            // }
            var colors = tywx.ado.Constants.GameCenterConfig.color_list[colorindex];
            if (!colors) {
                console.log("当前什么情况 = " + colorindex + " " + num);
            }
            var color = cc.color(colors[0], colors[1], colors[2]);
            this.setColor(color);
        }
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
        this.block && this.block.setinfo(this.color, this.num);
        this.block && this.block.setpos(this.posx, this.posy);
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
        if (this.block && this.block.posx != this.posx && this.block.posy != this.block.posy) {
            this.block.setinfo(this.color, num);
        }

        this.block && this.block.setpos(this.posx, this.posy);
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
        this.block && this.block.setinfo(this.color, this.num);
    },

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
        if (this.label_id == -1 || !this.block) return;
        config = tywx.config != null ? tywx.config : config;
        // ctx.fillColor = this.block.color;
        // ctx.roundRect(this.block.posx,this.block.posy,tywx.ado.Constants.GameCenterConfig.gezi_size,tywx.ado.Constants.GameCenterConfig.gezi_size,8);
        // ctx.fill();
        // lable.string = this.block.num;
        // lable.node.x = this.block.posx-360+tywx.ado.Constants.GameCenterConfig.gezi_size/2;
        // lable.node.y = this.block.posy-640+tywx.ado.Constants.GameCenterConfig.gezi_size/2;

        var tilescript = cell.getComponent("celltile");
        var pngnum = this.block.num % tywx.ado.Constants.GameCenterConfig.celltilenumColors.length;
        tilescript.visByNum(pngnum, this.block.num);
        var cindex = pngnum - 1;
        if (cindex < 0) {
            cindex = 0;
        }
        tilescript.setCurNum(this.getAllmask()[this.id].num);
        var color = tywx.ado.Constants.GameCenterConfig.celltilenumColors[cindex];
        tilescript.setColor(cc.Color.BLACK.fromHEX(color));
        cell.getComponent(cc.Sprite).node.x = this.block.posx - 360;
        cell.getComponent(cc.Sprite).node.y = this.block.posy - 640;
    };
};

cc._RF.pop();