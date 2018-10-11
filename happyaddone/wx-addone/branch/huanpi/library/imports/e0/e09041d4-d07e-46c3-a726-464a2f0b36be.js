"use strict";
cc._RF.push(module, 'e0904HU0H5Gw6cmRkovCza+', 'celltile');
// Script/models/celltile.js

"use strict";

/*
   游戏中的显示的单个小方块格子
   created by gyc on 2018-08-12.
   final changed by gyc on 2018-08-15.
*/
var config = require("AddOneConfig");
cc.Class({
    extends: cc.Component,

    properties: {
        // 格子显示的图片数组
        cells: {
            default: [],
            type: cc.Sprite
        },
        // 格子上显示的数字
        number: {
            default: null,
            type: cc.Label
        },
        // 格子上显示的数字阴影
        shadow: {
            default: null,
            type: cc.Label
        },
        // 点击开始的按钮
        touchEft: {
            default: null,
            type: cc.Sprite
        },
        // 点击开始的按钮
        xhgIcon: {
            default: null,
            type: cc.Node
        },
        // 点击结束的动画
        touchEndEft: {
            default: null,
            type: cc.Node
        },
        // 合成的动画
        hcEft: {
            default: null,
            type: cc.Node
        },
        // 新手引导的动画
        newPlayerEf: {
            default: null,
            type: cc.Node
        },
        thantenIcon: {
            type: cc.Sprite,
            default: null
        },
        // 当前显示的数字
        renumber: 0,
        // 点击回调函数
        clickcall: null,
        prenum: 0,
        // 前面的位置
        prex: 0,
        prey: 0

    },

    /*
        调用: 格子数字变化的时候调用
        功能: 刷新格子的显示
        参数: [
            num: 颜色值下标
            renum: 真正显示的数字
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    visByNum: function visByNum(num, renum) {
        this.hasvis = false;
        var tnum = (renum - 1) % 10;
        for (var i = 0; i < this.cells.length; i++) {
            // if(num == 0){
            //    num = 1;
            // }
            if (i == tnum) {
                this.hasvis = true;
                this.cells[i].node.active = true;
            } else {
                this.cells[i].node.active = false;
            }
        }

        if (!this.hasvis) {
            this.hasvis = true;
            this.cells[0].node.active = true;
        }

        this.number.string = renum;
        if (this.shadow == null) {
            console.log("shadow is NULL!!!!");
        } else {
            this.shadow.string = renum;
        }
        //console.log("SHADOW:", typeof(this.shadow));
        this.renumber = renum;
        // this.showHG();
    },

    showHG: function showHG() {
        var renum = this.scn;

        if (renum && renum != 0) {
            //
            if (renum < tywx.ado.Constants.GameCenterConfig.moreThanTenNumber || renum % 2 != 0) {
                this.hideThanTenIcon();
                if (this.prenum != 0) {
                    console.log("前一个值 = " + this.prenum);
                    if (this.prenum >= tywx.ado.Constants.GameCenterConfig.moreThanTenNumber && this.prenum % 2 == 0) {
                        tywx.gamecenter.removexhgNumber(this.prenum);
                    }
                    this.prenum = 0;
                }
            } else {
                if (tywx.gamecenter.hasShowxhgNum(renum, this.id) == false && tywx.gamecenter.hadXHGId(renum) == false) {
                    this.showThanTenIcon();
                    this.prenum = renum;
                    tywx.gamecenter.addxhgNumber(renum, this.id);
                    tywx.gamecenter.showmsm1();
                    // tywx.gamecenter.addXHGCell(this);
                    //  tywx.gamecenter.setWaitNum(renum);
                } else if (tywx.gamecenter.hadXHGId(renum) == true) {
                    this.hideThanTenIcon();
                }
            }
        }
    },

    setCurNum: function setCurNum(scn) {
        this.scn = scn;
    },

    /*
        调用: 格子数字变化的时候调用
        功能: 刷新格子显示的数字颜色
        参数: [
            color: 当前显示数字的颜色
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    setColor: function setColor(color) {
        if (this.shadow == null) {
            console.log("SETCOLOR", this.shadow);
        } else {
            this.shadow.node.color = color;
        }
        //   this.hide.node.color = color;
    },

    changeShow: function changeShow(num) {
        var colors = tywx.ado.Constants.GameCenterConfig.celltilenumColors[num - 1];
        this.setColor(new cc.color(colors[0], colors[1], colors[2], 255));
        this.visByNum(num, num);
    },
    /*
         调用: 设置格子点击的回调函数
         功能: 设置格子点击的回调函数
         参数: [
             clickcall: 回调函数 type: Function
         ]
         返回值:[
             无
         ]
         思路: 逻辑需要
     */
    setClickCall: function setClickCall(clickcall) {
        this.clickcall = clickcall;
    },

    /*
        调用: 逻辑调用
        功能: 得到当前格子显示的数字
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    getReNumber: function getReNumber() {
        return this.renumber;
    },

    setId: function setId(id) {
        this.id = id;
    },

    setCantClick: function setCantClick(cantclick) {
        this.cantclick = cantclick;
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
        思路: 逻辑需要
    */
    onLoad: function onLoad() {
        this.prex = parseInt(this.node.x);
        this.prey = parseInt(this.node.y);
        this.hasvis = false;
        this.node.opacity = 230;
        // 设置成屏蔽层
        var self = this;
        // this.hide.node.active = false;
        this.node.on('touchstart', function (event) {
            if (self.cantclick == true) {
                self.touchEft.node.active = false;
            } else {
                self.touchEft.node.active = true;
            }

            return false;
        });

        this.node.on('touchend', function (event) {
            if (self.prenum != 0) {
                tywx.gamecenter.addXHGId(self.prenum);
            }
            self.touchEft.node.active = false;
            self.playTouchEndEff();
            if (self.clickcall != null) {
                self.clickcall(self.id, self);
            }
        });

        this.node.on('touchcancel', function (event) {
            self.touchEft.node.active = false;
        });
    },


    setSSId: function setSSId(id) {
        this.ssid = id;
    },

    /*
        调用: 点击格子结束
        功能: 播放点击时候的动画
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    playTouchEndEff: function playTouchEndEff() {
        //    var anim = this.touchEndEft.getComponent(cc.Animation);
        //    anim.play("yuan_dh");
    },

    /*
        调用: 数字加一组合后
        功能: 播放组合的动画
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    playZhEff: function playZhEff() {
        //    tywx.LOGE("播放合成动画了吗")
        //    var anim = this.hcEft.getComponent(cc.Animation);
        //    anim.play("yindao_hebing");
    },

    /*
        调用: 新手引导的时候的调用
        功能: 播放新手引导的圆圈动画
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    playDaijiEff: function playDaijiEff() {
        this.node.active = true;
        var anim = this.node.getComponent(cc.Animation);
        var states = anim.getAnimationState('daiji');
        if (states.isPlaying == false) {
            var animationState = anim.play("daiji");
            animationState.wrapMode = cc.WrapMode.Loop;
        }
    },

    /*
          调用: 新手引导的时候的调用
          功能: 播放新手引导的圆圈动画
          参数: [
              无
          ]
          返回值:[
              无
          ]
          思路: 逻辑需要
      */
    stopDaijiEff: function stopDaijiEff() {
        var anim = this.node.getComponent(cc.Animation);
        anim.stop("daiji");
        this.node.scaleX = 1;
        this.node.scaleY = 1;
    },

    /*
        调用: 新手引导的时候的调用
        功能: 播放新手引导的圆圈动画
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    playNewPlayerEff: function playNewPlayerEff() {
        // this.newPlayerEf.active = true;
        // var anim = this.newPlayerEf.getComponent(cc.Animation);
        // anim.play("yindao_suofang");
    },

    /*
        调用: 数字加一组合后
        功能: 播放组合的动画
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    stopZhEff: function stopZhEff() {
        // var anim = this.newPlayerEf.getComponent(cc.Animation);
        // this.newPlayerEf.active = false;
        // anim.stop("yindao_suofang");
    },

    /**
     * 显示 大于10的小皇冠
     */
    showThanTenIcon: function showThanTenIcon() {
        if (this.xhgIcon && this.xhgIcon.active == false) {
            this.xhgIcon.active = true;
        }
    },

    /**
     * 隐藏 大于10的小皇冠
     */
    hideThanTenIcon: function hideThanTenIcon() {
        if (this.xhgIcon && this.xhgIcon.active == true) {
            console.log("当前我的数是多少 " + this.renumber);
            this.xhgIcon.active = false;
        }
    }

});

cc._RF.pop();