(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/core/render.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5d842dnLtlO8bEZA5+IjILf', 'render', __filename);
// script/core/render.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var nge = require("./engine.js");
var els = require("./els.js");
var ELSEvent = require("./ElsEvents.js");
var ElsUtils = require('./ElsUtils.js');
var ElsRender = nge.Render.extend({
    ctor: function ctor(idx, grid, gnode) {
        this.index = idx;
        this.grid = grid;
        this.gnode = gnode;
        this.fullrow = {};
        this.clear_vr = [];
        this.addMagic = 0;
    },

    drawGrid: function drawGrid() {
        var _this = this;

        var mt = this.grid.mtimer;
        var am = els.CONFIG.add_magic.clear;
        if (mt.getFirstRenderFlag("clear-row")) {
            this.fullrow = {};
            var fr = this.grid.mtimer.getexdata("clear-row");
            var add_magic = 0; // 消除整行添加的magic值
            for (var i = 0; i < fr.length; i++) {
                this.fullrow[fr[i]] = 1;
            }
            var g = this.gnode.getComponent('main');
            g.showAddMagicEffect();
            add_magic = am[fr.length >= 4 ? 4 : fr.length];
            this.addMagic += add_magic;
            var zhubao_map = g.zhubaoAnimationMap;
            if (zhubao_map) {
                zhubao_map.forEach(function (v, k) {
                    var t_r = els.ZONG - 1 - parseInt(k.split('_')[0]);
                    if (_this.fullrow[t_r]) {
                        v.active = false;
                    }
                });
            }
            //tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_ADD_MAGIC,add_magic);
            mt.resetFirstRenderFlag("clear-row");
            for (var i = 0; i < els.HENG; i++) {
                this.clear_vr.push([(15 + Math.random() * 15) * -3.0, (80 + Math.random() * 20) / 180.0 * 3.1415926]);
            }
        }
        var crs = this.grid.mtimer.getstat("clear-row");
        if (crs == 0) {
            if (this.grid.needdraw) this.grid.needdraw = false;else {
                //console.log('skip draw grid.....');
                return;
            }
        }
        //Render grid...
        var g = this.gnode.getComponent('main');
        var dat = this.grid.mcore.grid;
        var blk = g.blocks[this.index];
        for (var i = 0; i < els.ZONG; i++) {
            for (var j = 0; j < els.HENG; j++) {
                var gv = dat[i * els.GRIDW + j + 2];
                var c = blk[els.ZONG - i - 1][j];
                var opt = 0,
                    ro = 0,
                    r,
                    v,
                    sc = 0,
                    x = 0,
                    y = 0;

                if (crs != 0 && this.fullrow[i]) {
                    r = this.clear_vr[j][1];
                    v = this.clear_vr[j][0];
                    //满行消除前闪烁
                    var t = 10 - crs;
                    opt = gv == 0 ? 0 : crs / 2 % 2 == 0 ? 0 : 250;
                    sc = -0.01;
                    x = t * v * Math.cos(r) / 8.0;
                    y = (t * v * Math.sin(r) - 0.5 * 9.8 * t * t) / 5.0;
                    ro = t * 36;
                    //if(j==0) console.log("PPPP....."+t+'-'+x+'-'+y);
                    // if(ElsUtils.isZhubao(gv)) {
                    //     g.setBlkColor(c, 0, gv%100, 1, 0);
                    //     continue; 
                    // }
                } else {
                    opt = gv == 0 ? 0 : 180;
                }
                g.setBlkColor(c, opt, gv % 100, 1, ro);
                if (c.rawscale) c.scale = c.rawscale * (1 - (10 - crs) * sc) * 10 / els.HENG;
                c.position = cc.v2(c.position.x + x, c.position.y + y);
            }
        }
        //Render shadow...
        if (this.index == 0) {
            var cb = this.grid.mcore.cur_block;
            var cx = this.grid.mcore.tdx;
            var cy = this.grid.mcore.tdy;
            var cz = this.grid.mcore.cur_z;
            var bs = 72 * 6.6 / els.HENG + 2;
            g.shadow.opacity = 60;
            g.shadow.scale = 9.6 / els.HENG;
            g.shadow.setRotation(90 * cz);
            var ax = bs * els.BLK_C_OFFSET[cb][cz][0];
            var ay = bs * els.BLK_C_OFFSET[cb][cz][1];
            g.shadow.position = cc.v2(216 + bs * cx + ax, 213 + bs * (els.ZONG - cy) + ay - 980 / els.HENG); //修改shadow坐标zfw
            g.shadow.getComponent('cc.Sprite').spriteFrame = g.blockimgs[cb + 11];
        }
    },
    drawHoldNext: function drawHoldNext() {
        //Render hold next...
        if (this.index != 0) return;
        var g = this.gnode.getComponent('main');
        var gr = this.grid;
        var blk = g.holdnext;
        var h = gr.mcore.save_block;
        var n1 = gr.mQueue[(gr.mcore.block_index + 1) % els.MAXBLKQUEUE];
        var n2 = gr.mQueue[(gr.mcore.block_index + 2) % els.MAXBLKQUEUE];
        var hnv = [h, n1, n2];
        for (var n = 0; n < 3; n++) {
            if (hnv[n] >= 0) {
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        var gv = els.BLKDAT_C[hnv[n]][0][i * 4 + j];
                        g.setBlkColor(blk[n][i][j], gv == 0 ? 50 : 200, gv % 100);
                    }
                }
            } else {
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        g.setBlkColor(blk[n][i][j], 50, 0);
                    }
                }
            }
        }
    },
    drawAttackLine: function drawAttackLine(group, ptfrom, ptto, delay, t) {
        var dis = Math.abs(cc.pDistance(ptfrom, ptto));
        var speed = dis / t;
        var g = this.gnode.getComponent('main');
        var attAni = g.attani[this.index];

        for (var j = 0; j < 6; j++) {
            attAni[group][j].stopAllActions();
            attAni[group][j].setPosition(ptfrom);

            if (j == 0) {
                attAni[group][j].runAction(cc.sequence(cc.delayTime(delay), cc.show(), cc.spawn(cc.rotateBy(t, 1800), cc.moveTo(t, ptto)), cc.callFunc(function hide() {
                    this.getComponent(cc.Sprite).setVisible(false);
                }, attAni[group][j])));
            } else {
                var dd = 20.0 / speed;
                attAni[group][j].runAction(cc.sequence(cc.delayTime(delay + dd * j), cc.show(), cc.moveTo(t, ptto), cc.callFunc(function hide() {
                    this.getComponent(cc.Sprite).setVisible(false);
                }, attAni[group][j])));
            }
        }
    },
    drawAttack: function drawAttack() {
        if (this.grid.mtimer.getFirstRenderFlag("attack")) {
            var g = this.gnode.getComponent('main');
            var attack_count = this.grid.mtimer.getexdata("attack");

            g.game.model.playMusic(els.ELS_VOICE.ATTACK_MUSIC, false);

            var linecnt = [2, 3, 5];
            var pt1 = this.index == 0 ? cc.v2(470, 630) : cc.v2(100, 880);
            // 播放攻击动画
            for (var i = 0; i < linecnt[attack_count - 1]; i++) {
                var pt2 = this.index == 0 ? cc.v2(100 + i * 20, 900 + i * 30) : cc.v2(470 + i * 20, 700 + i * 60);
                var delay = Math.random() * 0.1;
                this.drawAttackLine(i, pt1, pt2, delay, 0.3);
            }

            //TODO: 这里直接将第二个grid判断为AI,以后可能需要修改，虽然在game中AI也是这样判断的
            //! 攻击两个意味着消除了3行
            if (this.grid.index !== 1 && attack_count >= 2) {
                g.showClearAnimation(attack_count + 1);
            }

            this.grid.mtimer.resetFirstRenderFlag("attack");
        }
    },
    drawCombo: function drawCombo() {
        if (this.grid.mtimer.getFirstRenderFlag("combo")) {
            var g = this.gnode.getComponent('main');
            var c = this.grid.mtimer.getexdata("combo");
            var pt1 = this.index === 0 ? cc.v2(450, 830) : cc.v2(80, 980);
            var ca = els.CONFIG.add_magic.combo;
            var add_magic = c >= 3 ? c * ca : 0; // 连击添加的magic值
            if (c >= 3) {
                var mi = c;
                if (c > 14) mi = 14;
                g.game.model.playMusic(els.ELS_VOICE.COMBO_MUSIC[mi - 3], false);
            }
            if (this.grid.index !== 1) {
                console.log('show combo');
                g.showCombo(c);
            }
            this.addMagic += add_magic;
            //tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_ADD_MAGIC,add_magic);

            this.grid.mtimer.resetFirstRenderFlag("combo");
        }
    },
    draw: function draw() {
        this.drawGrid();
        this.drawHoldNext();
        this.drawAttack();
        this.drawCombo();
        if (this.addMagic > 0) {
            //! 断网或者SDK登陆失败，不添加能量
            if (tywx.TCPClient.connectStatus === tywx.TCPClient.CONNECT_STATUS_OK && tywx.UserInfo.userId !== 0) {
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_ADD_MAGIC, this.addMagic);
                //tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_ADD_MAGIC,40);
            }
            this.addMagic = 0;
        }
        var g = this.gnode.getComponent('main');
        g.maintips.getComponent('cc.Label').string = g.game.model.getMainTips();
    }
});

(function (window, factory) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.ElsRender = factory();
    }
})(undefined, function () {
    return ElsRender;
});

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
        //# sourceMappingURL=render.js.map
        