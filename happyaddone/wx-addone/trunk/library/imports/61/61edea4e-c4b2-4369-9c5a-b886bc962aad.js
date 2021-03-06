"use strict";
cc._RF.push(module, '61edepOxLJDaZxauIa8liqt', 'helpview');
// Script/models/helpview.js

"use strict";

/*
    游戏中的帮助界面:
    created by gyc on 2018-08-014.
    final changed by gyc on 2018-08-15.
*/
var config = require("AddOneConfig");
cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn: {
            default: null,
            type: cc.Sprite
        },
        startBtn: {
            default: null,
            type: cc.Sprite
        },
        cellBottom: {
            default: null,
            type: cc.Sprite
        },
        cellTile: {
            default: null,
            type: cc.Prefab
        },
        newGuideLabel: {
            default: null,
            type: cc.Label
        },
        allhelpCells: [],
        // 是否是在游戏里面弹出来的帮助 1是 0不是 
        isgame: 0,
        // 当前的引导步数
        curHelpNumber: 0,
        //当前点击的脚本插件
        curClickScript: null,
        // 格子的原始坐标
        curgzPos: [],
        // 当前步数的引导是否完成
        curGuidefinish: false

    },

    /*
        调用: 节点加载完成后回调
        功能: 初始化部分逻辑
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 系统自带
    */
    onLoad: function onLoad() {
        // 设置成屏蔽层
        this.node.on('touchstart', function (event) {
            return true;
        });

        this.newGuideLabel.string = "点击1，加1变2";
        this.allhelpdata = [3, 4, 5, 2, 1, 2];
        // 初始化道具
        for (var hindex = 0; hindex < this.allhelpdata.length; hindex++) {
            var item = cc.instantiate(this.cellTile);
            if (hindex < 3) {
                item.y = 80;
                item.x = hindex * 150 + 90;
            } else {
                item.y = 220;
                item.x = (hindex - 3) * 150 + 90;
            }
            this.curgzPos.push({
                x: item.x,
                y: item.y
            });
            var tilescript = item.getComponent("celltile");
            var pngnum = this.allhelpdata[hindex];
            if (pngnum > 10) {
                pngnum = pngnum % 10;
            }
            tilescript.visByNum(pngnum, this.allhelpdata[hindex]);
            var colors = tywx.ado.Constants.GameCenterConfig.celltilenumColors[pngnum - 1];
            tilescript.setColor(new cc.color(colors[0], colors[1], colors[2], 255));
            if (hindex == 4) {
                var self = this;
                tilescript.playNewPlayerEff();
                this.curClickScript = tilescript;
                tilescript.setClickCall(function () {
                    self.newPlayerGuideCall();
                });
                this.cellBottom.node.addChild(item, 5000);
            } else {
                this.cellBottom.node.addChild(item, 120);
            }
            this.allhelpCells.push(item);
        }
    },


    /*
        调用: 更新格子数字的时候调用
        功能: 更新格子
        参数: [
            script:格子节点的脚本文件 type: JavaScript
            addnum:格子数字的附加数值 type: Number
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    updateAddGz: function updateAddGz(script, addnum) {
        var curnumber = script.getReNumber();
        curnumber = curnumber + 1 + addnum;
        tywx.LOGE("当前的格子数值 = " + curnumber);
        script.visByNum(curnumber, curnumber);
        var colors = tywx.ado.Constants.GameCenterConfig.celltilenumColors[curnumber - 1];
        script.setColor(new cc.color(colors[0], colors[1], colors[2], 255));
    },

    /*
        调用: 点击引导的时候调用
        功能: 设置点击产生的新手引导
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    newPlayerGuideCall: function newPlayerGuideCall() {
        tywx.LOGE("当前的引导步数 = " + this.curHelpNumber);
        var self = this;
        if (this.curHelpNumber == 0) {
            this.curHelpNumber = 1;
            this.updateAddGz(this.curClickScript, 0);
            var delay1 = cc.delayTime(1.5);
            var delay2 = cc.delayTime(1.4);
            this.newGuideLabel.string = "三个相同即可合成";
            var call1 = cc.callFunc(function () {
                var mv1 = cc.moveTo(0.2, cc.p(self.allhelpCells[4].x, self.allhelpCells[4].y));
                var mv2 = cc.moveTo(0.2, cc.p(self.allhelpCells[4].x, self.allhelpCells[4].y));
                self.allhelpCells[3].getComponent("celltile").node.runAction(mv1);
                self.allhelpCells[5].getComponent("celltile").node.runAction(mv2);
            }, this);

            var call2 = cc.callFunc(function () {
                self.updateAddGz(self.curClickScript, 0);
                self.allhelpCells[4].getComponent("celltile").playZhEff();
                self.allhelpCells[3].getComponent("celltile").node.x = self.curgzPos[3].x;
                self.allhelpCells[3].getComponent("celltile").node.y = self.curgzPos[3].y + 65;

                self.updateAddGz(self.allhelpCells[5].getComponent("celltile"), 1);
                this.newGuideLabel.string = "点击3，加1变4";
                self.allhelpCells[5].getComponent("celltile").node.x = self.curgzPos[5].x;
                self.allhelpCells[5].getComponent("celltile").node.y = self.curgzPos[5].y + 65;
                var mv1 = cc.moveBy(0.2, cc.p(0, -65));
                var mv2 = cc.moveBy(0.2, cc.p(0, -65));
                self.allhelpCells[3].getComponent("celltile").node.runAction(mv1);
                self.allhelpCells[5].getComponent("celltile").node.runAction(mv2);
                this.curGuidefinish = true;
            }, this);
            var seq = cc.sequence(delay1, call1, delay2, call2);
            this.node.runAction(seq);
        } else if (this.curHelpNumber == 1 && this.curGuidefinish == true) {
            this.curGuidefinish = false;

            this.curHelpNumber = 2;
            this.updateAddGz(this.curClickScript, 0);
            var delay1 = cc.delayTime(1.5);
            var delay2 = cc.delayTime(1.4);
            this.newGuideLabel.string = "三个相同即可合成";
            var call1 = cc.callFunc(function () {
                var mv1 = cc.moveTo(0.2, cc.p(self.allhelpCells[4].x, self.allhelpCells[4].y));
                var mv2 = cc.moveTo(0.2, cc.p(self.allhelpCells[4].x, self.allhelpCells[4].y));
                self.allhelpCells[1].getComponent("celltile").node.runAction(mv1);
                self.allhelpCells[5].getComponent("celltile").node.runAction(mv2);
            }, this);

            var call2 = cc.callFunc(function () {
                self.updateAddGz(self.curClickScript, 0);
                self.updateAddGz(self.allhelpCells[2].getComponent("celltile"), -3);
                self.updateAddGz(self.allhelpCells[1].getComponent("celltile"), 2);
                self.curClickScript.playZhEff();
                var mv2 = cc.moveTo(0.15, cc.p(self.curgzPos[1].x, self.curgzPos[1].y));
                self.allhelpCells[4].getComponent("celltile").node.runAction(mv2);
                self.allhelpCells[4].getComponent("celltile").stopZhEff();
                this.newGuideLabel.string = "快开始吧";
                self.allhelpCells[1].getComponent("celltile").node.x = self.curgzPos[4].x;
                self.allhelpCells[1].getComponent("celltile").node.y = self.curgzPos[4].y + 65;
                var mv3 = cc.moveTo(0.15, cc.p(self.curgzPos[4].x, self.curgzPos[4].y));
                self.allhelpCells[1].getComponent("celltile").node.runAction(mv3);

                self.allhelpCells[5].getComponent("celltile").node.x = self.curgzPos[5].x;
                self.allhelpCells[5].getComponent("celltile").node.y = self.curgzPos[5].y + 65;
                var mv3 = cc.moveTo(0.15, cc.p(self.curgzPos[5].x, self.curgzPos[5].y));
                self.allhelpCells[5].getComponent("celltile").node.runAction(mv3);
                this.curGuidefinish = true;
                this.startBtn.node.active = true;
                // this.closeBtn.node.active = false;
            }, this);
            var seq = cc.sequence(delay1, call1, delay2, call2);
            this.node.runAction(seq);
        } else if (this.curHelpNumber == 2 && this.curGuidefinish == true) {
            cc.director.loadScene("gamemain");
        }
    },

    /*
        调用: 点击关闭按钮的时候调用
        功能: 关闭当前的界面
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    close: function close() {
        if (this.closeCall) {
            this.closeCall();
        }
        if (this.isgame == 1) {
            this.node.active = false;
        }
    },

    /*
        调用: 格子数字变化的时候调用
        功能: 设置关闭的回调函数
        参数: [
            cc: 回调函数 type: Function
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    setCloseCall: function setCloseCall(cc) {
        this.closeCall = cc;
    },

    /*
            调用: 格子数字变化的时候调用
            功能: 设置关闭的回调函数
            参数: [
                cc: 回调函数 type: Function
            ]
            返回值:[
                无
            ]
            思路: 逻辑需要
        */
    setStartGameCall: function setStartGameCall(cc) {
        this.startGameCall = cc;
    },

    /*
        调用: 逻辑调用
        功能: 设置是否是在游戏内展示引导
        参数: [
            isgame: 是否在游戏内 type: Number
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    setIsGame: function setIsGame(isgame) {
        this.isgame = isgame;
    },

    ctor: function ctor() {
        config = tywx.config != null ? tywx.config : config;
    },
    /*
        调用: 点击开始游戏按钮的时候调用
        功能: 开始游戏
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    startGame: function startGame() {
        tywx.ado.Utils.showWXBanner();
        if (this.isgame == 1) {
            this.node.active = false;
        } else {
            cc.director.loadScene("gamemain");
        }
        if (this.startGameCall) {
            this.startGameCall();
        }
    }

});

cc._RF.pop();