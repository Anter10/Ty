(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/core/grid.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '39870hbHo5H8oF3bO9kb/SJ', 'grid', __filename);
// script/core/grid.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var nge = require("./engine.js");
var els = require("./els.js");
var model = require("./model.js");
var Class = nge.Class;
var ElsUtils = require("./ElsUtils.js");
var ELSEvent = require("./ElsEvents.js");

//玩家区域网格,关键变量,以及核心处理逻辑
var ElsGrid = Class.extend({
    ctor: function ctor(mod, i) {
        this.mod = mod;
        this.mcore = new model.ElsCore();
        this.corecls = model.ElsCore;
        this.mtimer = new model.ElsTimer();
        this.mstat = new model.ElsStat();
        this.isActive = false;
        this.mQueue = null;
        this.mBlkDat = null;
        this.index = i;
        this.needdraw = true;
        this.pend_attack = false;
    },

    //用于冒险模式设置10x10地图
    setBmp: function setBmp(bmp) {
        var tmp_fill_idx = {}; // 临时存储填充打block_idx
        var tmp_fill_idx_hole = {}; // 临时存储填充打block_idx
        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_RESET_ZHUBAO_ANIMATION_POOL, null);

        for (var i = 0; i < els.ZONG; i++) {
            for (var j = 0; j < els.HENG; j++) {
                var tmp_grid_idx = i * els.GRIDW + 2 + j;
                this.mcore.grid[tmp_grid_idx] = i >= els.ZONG - els.HENG ? 100 + bmp[i - (els.ZONG - els.HENG)][j] : 0;
                if (this.mcore.grid[tmp_grid_idx] === 100) {
                    this.mcore.grid[tmp_grid_idx] = 0;
                }
                // 记录填充的节点
                if (this.mcore.grid[tmp_grid_idx] > 100) {
                    tmp_fill_idx[i] = tmp_fill_idx[i] || [];
                    tmp_fill_idx[i].push([i, j]);
                } else {
                    tmp_fill_idx_hole[i] = tmp_fill_idx_hole[i] || [];
                    tmp_fill_idx_hole[i].push([i, j]);
                }
            }
        }
        //@ENDLESS 给出来的图设置嵌入珠宝
        if (this.mod.mconf.isEndless && this.index === 0) {
            //无尽模式===>设置随机珠宝
            var zhubao_map = new Map([['d1', 112], ['d2', 113], ['d3', 114]]); // 配置文件宝石和本地宝石key的关系映射
            var zhubao_config = this.mod.getRandomZhuBaoConfig(); // 获取宝石配置，根据等级获取
            console.log('无尽模式===>', zhubao_config, this.index);
            var self = this;
            if (zhubao_config !== -1) {
                var deep = zhubao_config.deep; // 从顶部开始出现的行数
                var zhubao_keys = Object.keys(zhubao_config); // 配置文件中所有的属性名
                var max = 0; // 总共有多少个珠宝
                zhubao_keys.forEach(function (element) {
                    if (element !== 'deep') {
                        max += zhubao_config[element];
                    }
                });
                console.log(max);
                var row_keys = Object.keys(tmp_fill_idx); // 有填充的所有行,已经完成排序，默认从小到大
                var useable_fill_idx = []; // 存放可以被填充的元素idx
                var useable_fill_idx_hole = []; //空洞备用
                var max_key = Math.min(parseInt(row_keys[0]) + deep - 1, els.ZONG - 1);
                var min_key = max_key - 2;
                for (var r = min_key; r <= max_key; r++) {
                    var _useable_fill_idx, _useable_fill_idx_hol;

                    var ti = tmp_fill_idx[r];
                    var th = tmp_fill_idx_hole[r];
                    if (ti) (_useable_fill_idx = useable_fill_idx).push.apply(_useable_fill_idx, _toConsumableArray(ti));
                    if (th) (_useable_fill_idx_hol = useable_fill_idx_hole).push.apply(_useable_fill_idx_hol, _toConsumableArray(th));
                }
                console.log(useable_fill_idx, useable_fill_idx_hole);
                useable_fill_idx_hole = ElsUtils.shuffle(useable_fill_idx_hole);
                if (useable_fill_idx.length < max) {
                    console.log("\u586B\u5145\u73E0\u5B9D\u9519\u8BEF\uFF0C\u53EF\u586B\u5145\u6570\u91CF\u4E3A" + useable_fill_idx.length + ",\u9700\u8981\u586B\u5145" + max + "\u4E2A\u73E0\u5B9D\u3002");
                    var pcount = max - useable_fill_idx.length;
                    for (var i = 0; i < pcount; i++) {
                        useable_fill_idx.push(useable_fill_idx_hole[i]);
                    }
                }
                // 打乱顺序
                useable_fill_idx = ElsUtils.shuffle(useable_fill_idx);
                var current_fill_idx = 0;
                // 填充宝石
                zhubao_keys.forEach(function (element) {
                    if (zhubao_map.has(element)) {
                        var zhubao_key = zhubao_map.get(element);
                        var value = zhubao_config[element];
                        self.mcore.zhubao_count.set(zhubao_key, 0); // 统计当前消除的数量
                        self.mcore.zhubao_max.set(zhubao_key, value); // 记录每种道具产生的数量
                        console.log("init-zhubao====>zhubao_count:" + self.mcore.zhubao_count + ",zhubao_max:" + self.mcore.zhubao_max);
                        for (var _i = 0; _i < value; _i++) {
                            var t_i = useable_fill_idx[current_fill_idx][0];
                            var t_j = useable_fill_idx[current_fill_idx][1];
                            var tmp_idx = t_i * els.GRIDW + 2 + t_j;
                            self.mcore.grid[tmp_idx] = zhubao_key;
                            //* 添加珠宝动画
                            var t_row = els.ZONG - t_i - 1;
                            var t_col = t_j;
                            var t_type = zhubao_key;
                            var t_param = { row: t_row, col: t_col, type: t_type };
                            tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_ADD_ZHUBAO_ANIMATION, t_param);
                            current_fill_idx++;
                        }
                    }
                });
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_REFRESH_ZHUBAO_COUNT, null);
            } else {
                console.log('grid/zhubao', 'Get zhubao config error.');
            }
        }
        this.updateColHoleTop(2, 11, false);
    },

    //用于AI模式设置难度
    setLevel: function setLevel(nandu) {
        this.mstat.level = nandu;
    },

    //设置方块类别，目前支持经典和非经典两种，参考block.h
    setBlkDat: function setBlkDat(bd) {
        this.mBlkDat = bd;
    },

    //设置方块序列
    setQueue: function setQueue(queue) {
        this.mQueue = queue;
        console.log("mq in setqueue..." + queue);
    },

    //重置数据，每局开始调用
    reset: function reset() {
        var tgrid = this; //必须用局部变量保存起来供回调时使用，回调时不能用this
        this.mcore = new model.ElsCore();
        this.mtimer = new model.ElsTimer();
        this.mtimer.setup("next-block", 0.8);
        this.mtimer.setup("clear-row", 0.3, function () {
            if (0 == tgrid.index) {
                tgrid.mod.playMusic(els.ELS_VOICE.CLEAR_MUSIC, false);
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_SHOW_MAGIC_ADD_EFFECT, null);
            }
            tgrid.clearRow(false);
            console.log('clear-row-end');
        });
        this.mtimer.setup("game-over", 0.12, function () {
            console.log("OVER" + tgrid.index);
            tgrid.mcore.game_over = true;
            //if(tgrid.index==1) process.exit(1);
        });
        this.mtimer.setup("fall", 0.01, function () {
            tgrid.fall();
        });
        this.mtimer.setup("combo", 0.8);
        this.mtimer.setup("attack", 0.8);
        this.mtimer.setup("endless-clear", 1.5, function () {
            this.mod.endless_clear = false;
        });

        //设置初始grid.边框置为200，限制方块活动范围
        for (var i = 0; i < els.ZONG + 2; i++) {
            for (var j = 0; j < els.HENG + 4; j++) {
                this.mcore.grid[i * els.GRIDW + j] = 200;
            }
        }for (var i = 0; i < els.ZONG; i++) {
            for (var j = 0; j < els.HENG; j++) {
                this.mcore.grid[i * els.GRIDW + 2 + j] = 0;
            }
        } //初始化各种变量
        this.mcore.cur_block = this.mQueue[0];
        this.mcore.next_block = this.mQueue[1];
        this.mcore.save_block = -1;
        this.mcore.save_lock = false;
        this.mcore.cur_x = 5;
        this.mcore.cur_y = 0;
        this.mcore.cur_z = 0;
        this.mcore.game_over = false;
        this.mcore.block_index = 0;
        this.mcore.block_attack_index = 0; // 保存对加行操作的值
        this.mcore.game_result = 0;

        //计算初始col,hole,top
        //UpdateColHoleTop(2, 11);

        //用于判断用户是否主动放弃
        this.fangcha = [];
    },

    //下一块
    nextBlk: function nextBlk(ai, issave) {
        //console.log("NEXT>>>>>>>>");
        if (!ai) {
            if (this.index == 0) {
                this.mod.tou._maxDAct = 0;
                this.mod.tou._maxRLAct = 0;
            }
            this.mstat.addScore(10);
        }
        this.mcore.block_index++;
        this.mcore.cur_block = this.mcore.next_block;
        if (!issave) this.mtimer.trigger("next-block", 0.8);
        this.mcore.cur_x = 5;
        this.mcore.cur_y = 0;
        this.mcore.cur_z = 0;
        this.moveBlk(els.SET, ai);
        this.mcore.next_block = this.mQueue[(this.mcore.block_index + 1) % els.MAXBLKQUEUE];

        if (!ai && this.index == 0) {
            this.fangcha[this.mcore.block_index] = this.calcFangCha();
        }
        if (0 == this.index && this.mod.mconf.mode === els.ELS_MODE_SINGLE) {
            if (this.mcore.next_attack >= 1) {
                this.mcore.next_attack--;
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_SHOW_ICE_EFFECT, this.mcore.next_attack);
                console.log(this.mcore.next_attack, "step , reset add attack");
                return;
            }
            //控制难度
            var auto_attack_step = this.mod.getAutoAttackStep();
            if (this.mcore.block_attack_index !== 0 && this.mcore.block_attack_index % auto_attack_step == 0) {
                if (this.mcore.fullrows.length != 0) {
                    this.pend_attack = true;
                } else {
                    this.attack(this, 1, parseInt(Math.random() * 10000), true);
                    this.updateColHoleTop(2, 11);
                }
            } else {
                if (this.pend_attack) {
                    this.attack(this, 1, parseInt(Math.random() * 10000), true);
                    this.updateColHoleTop(2, 11);
                    this.pend_attack = false;
                }
            }
        }
        this.mcore.block_attack_index++;
    },

    calcFangCha: function calcFangCha() {
        //计算总空
        var top_total = 0;
        for (var i = 0; i < els.HENG; i++) {
            top_total += this.mcore.col_top[i] * 10;
        }

        //计算平均行高,计算行高方差
        var top_avg = top_total / els.HENG;
        var fangcha = 0;
        for (i = 0; i < els.HENG; i++) {
            var t = this.mcore.col_top[i] * 10 - top_avg;
            fangcha += t * t;
        }

        return fangcha;
    },

    isUserGiveup: function isUserGiveup() {
        // 先计算一下方差,看看是不是用户自己放弃了
        var giveup = false;

        // 当前方差
        var curfangcha = this.fangcha[this.fangcha.length - 1];
        // 5步之前的方差
        var step = 0;
        if (this.fangcha.length > 5) step = this.fangcha.length - 6;
        var prefangcha = this.fangcha[step];
        if (curfangcha > 13000 || Math.abs(curfangcha - prefangcha) > 7000) giveup = true;

        return giveup;
    },

    //暂存块,每次确认下落后才能再次存(save_lock)
    saveBlk: function saveBlk(ai) {
        //if (!this.mcore.save_lock) {
        if (true) {
            this.mcore.save_lock = true;
            this.moveBlk(els.CLEAR, ai);
            if (this.mcore.save_block >= 0) {
                var blktmp = this.mcore.cur_block;
                this.mcore.cur_block = this.mcore.save_block;
                this.mcore.save_block = blktmp;
                this.mcore.cur_x = 5;
                this.mcore.cur_y = 0;
                this.mcore.cur_z = 0;
                this.moveBlk(els.SET, ai);
            } else {
                this.mcore.save_block = this.mcore.cur_block;
                this.nextBlk(ai, false);
            }
            //触发保存块动画
            this.mtimer.save_block = 10;
        }
    },

    //消除最底下三行
    clearThreeBottomLines: function clearThreeBottomLines() {

        if (this.index != 0) return;

        for (var i = els.ZONG - 5; i < els.ZONG; i++) {
            for (var j = 2; j < els.HENG + 2; j++) {
                this.mcore.grid[i * els.GRIDW + j] = 101 + Math.floor(Math.random() * 1000) % 6;
            }
        }

        this.mcore.fullrows = [16, 17, 18, 19, 20];
        //this.clearRow(false);
        this.mtimer.trigger("clear-row", nge.clone(this.mcore.fullrows));
    },
    /**
     * 消除最下面一行
     * @param {int} count 需要消除的行数
     */
    clearnBottomLinesByCount: function clearnBottomLinesByCount(count) {
        console.log("clearnBottomLinesByCount===>" + count);
        if (this.index !== 0) return; // 机器人没有这个操作

        for (var i = els.ZONG - count; i < els.ZONG; i++) {
            for (var j = 2; j < els.HENG + 2; j++) {
                this.mcore.grid[i * els.GRIDW + j] = 101 + Math.floor(Math.random() * 1000) % 6;
            }
        }

        this.mcore.fullrows = [];
        for (var _i2 = 20; _i2 > 20 - count; _i2--) {
            this.mcore.fullrows.push(_i2);
        } //this.clearRow(false);
        this.mtimer.trigger("clear-row", nge.clone(this.mcore.fullrows));
    },
    clearnAllRows: function clearnAllRows(callback, render) {
        var _this = this;

        var self = this;
        var clearn_line_count = 0;
        var clearn_rows = [];

        var _loop = function _loop(i) {
            var clearn_idx = [];
            for (j = 0; j < els.HENG; j++) {
                var tmp_idx = i * els.GRIDW + 2 + j;
                if (_this.mcore.grid[tmp_idx] > 100 && _this.mcore.grid[tmp_idx] < 200) {
                    clearn_idx.push(tmp_idx);
                }
            }
            if (clearn_idx.length > 0) {
                clearn_rows.push(i);
            }
            if (clearn_idx.length > 0) {
                clearn_line_count++;
                tywx.Timer.setTimer(cc.director, function () {
                    tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_SHOW_CLEARN_ROW_EFFECT, {
                        row: els.ZONG - i - 1,
                        cb: function cb() {
                            console.log('clearnAllRows--cb', i, clearn_idx, clearn_line_count);
                            clearn_idx.forEach(function (idx) {
                                self.mcore.grid[idx] = 0;
                            });
                            clearn_line_count--;
                            if (clearn_line_count === 0) {
                                console.log('');
                                callback && callback();
                            }
                        }
                    });
                }, clearn_line_count * 0.1, 0, clearn_line_count * 0.1);
            }
        };

        for (var i = 0; i < els.ZONG; i++) {
            var j;

            _loop(i);
        }
        if (clearn_rows.length > 0) {
            this.clearnBottomLinesByCount(1);
        }
    },

    clearRow: function clearRow(ai) {
        if (!ai) {
            this.needdraw = true;
            //console.log("CLEAR ROW"+this.mcore.fullrows.length);
            if (this.mtimer.getstat("game-over")) {
                //console.log("cancel over...");
                this.mtimer.cancel("game-over");
                this.mcore.game_over = false;
            }
        }

        this.mstat.clear_lines += this.mcore.fullrows.length;
        if (this.mcore.fullrows.length % 100) {
            //@ENDLESS TODO: 无尽模式===> 判断消掉了珠宝
            var i, j, n;
            for (n = 0; n < this.mcore.fullrows.length % 100; n++) {
                for (i = this.mcore.fullrows[n]; i >= 0; i--) {
                    for (j = 0; j < els.HENG; j++) {
                        if (this.index === 0) {
                            //!非AI
                            if (i === this.mcore.fullrows[n]) {
                                //* 判断是否有消除珠宝,只有这种情况下是真正的消除
                                //* 其他情况下是塌陷
                                var tmp_idx = i * els.GRIDW + j + 2;
                                if (this.mod.mconf.isEndless && ElsUtils.isZhubao(this.mcore.grid[tmp_idx])) {
                                    //TODO: 珠宝被消除，更新珠宝数量
                                    var tmp_fill_value = this.mcore.grid[tmp_idx];
                                    var current_value = this.mcore.zhubao_count.get(tmp_fill_value);
                                    current_value++;
                                    this.mcore.zhubao_count.set(tmp_fill_value, current_value);
                                    var params = {
                                        x: els.ZONG - i - 1,
                                        y: j,
                                        type: tmp_fill_value
                                    };
                                    tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_REFRESH_ZHUBAO_COUNT, params);
                                    this.mstat.addScore(els.ENDLESS_VALUES.GetZhuBaoAddScore);
                                    var params2 = {
                                        row: els.ZONG - i - 1,
                                        col: j,
                                        type: tmp_fill_value
                                    };
                                    tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_DELETE_ZHUBAO_ANIMATION, params2);
                                }
                            } else {
                                // let tmp_idx = i * els.GRIDW + j + 2;
                                // if(this.mod.mconf.isEndless && ElsUtils.isZhubao(this.mcore.grid[tmp_idx])){
                                //     //TODO: 珠宝没有消除，位置发生变化
                                //     let tmp_fill_value = this.mcore.grid[tmp_idx];
                                //     // * 这里的位置是变化前的
                                //     let params = {
                                //         row: els.ZONG - i - 1, // * 
                                //         col: j,
                                //         type: tmp_fill_value,
                                //         is_down: true
                                //     };
                                //     tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_REFRESH_ZHUBAO_ANIMATION_POS,params);
                                // }
                            }
                        }

                        if (i) {
                            if (this.mcore.grid[(i - 1) * els.GRIDW + j + 2] > 100 || this.mcore.grid[(i - 1) * els.GRIDW + j + 2] == 0) {
                                if (!(this.mcore.grid[i * els.GRIDW + j + 2] < 10 && this.mcore.grid[i * els.GRIDW + j + 2] > 0)) {
                                    this.mcore.grid[i * els.GRIDW + j + 2] = this.mcore.grid[(i - 1) * els.GRIDW + j + 2];
                                }
                            } else if (!(this.mcore.grid[i * els.GRIDW + j + 2] < 10 && this.mcore.grid[i * els.GRIDW + j + 2] > 0)) {
                                this.mcore.grid[i * els.GRIDW + j + 2] = 0;
                            }
                        } else {
                            if (!(this.mcore.grid[i * els.GRIDW + j + 2] < 10 && this.mcore.grid[i * els.GRIDW + j + 2] > 0)) {
                                var _tmp_idx = i * els.GRIDW + j + 2;
                                this.mcore.grid[_tmp_idx] = 0;
                            }
                        }
                    }
                }
                this.mcore.fullrows[n] = 0;
            }
            this.updateColHoleTop(2, 11);
        }
        this.mcore.fullrows.length = 0;
        //this.refreshZhuBaoCount();
    },

    /**
     * 下沉指定列
     * @param index 指定下沉到列
     */
    sinkCol: function sinkCol(index) {
        var grids = this.mcore.grid;
        var col_list = [];
        for (var c = 0; c < els.ZONG; c++) {
            var idx = c * els.GRIDW + index + 2;
            col_list.push(idx);
        }
        var loop_time = 0;
        for (var i = 0; i < col_list.length; i++) {
            if (this.mcore.grid[col_list[i]] !== 0) {
                loop_time++;
            }
        }
        for (var t = 0; t < loop_time; t++) {
            for (var _i3 = 0; _i3 < col_list.length - 1; _i3++) {
                var idx0 = col_list[_i3];
                var idx1 = col_list[_i3 + 1];
                var current = grids[idx0];
                if (current > 10) {
                    var next = grids[idx1];
                    if (next === 0) {
                        // if(this.mod.mconf.isEndless && ElsUtils.isZhubao(current)){
                        //     // * 这里的位置是变化前的
                        //     // ! 珠宝下沉
                        //     let params = {
                        //         row: els.ZONG - (idx0 - index - 2 ) / els.GRIDW - 1, // * 
                        //         col: index,
                        //         type: current,
                        //         is_down: true
                        //     };
                        //     tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_REFRESH_ZHUBAO_ANIMATION_POS,params);
                        // }
                        var _ref = [this.mcore.grid[idx1], this.mcore.grid[idx0]];
                        this.mcore.grid[idx0] = _ref[0];
                        this.mcore.grid[idx1] = _ref[1];
                    }
                }
            }
        }
        //console.log(index,col_list);
    },
    /**
     * 清除每列的最高指定行数
     */
    clearnTopGirdByCount: function clearnTopGirdByCount() {
        var ct = this.mcore.col_top;
        for (var i = 0; i < ct.length; i++) {
            var r = els.ZONG - ct[i];
            var idx = r * els.GRIDW + i + 2;
            console.log('clearnTopGirdByCount', r, idx, this.mcore.grid[idx]);
            if (this.mcore.grid[idx] > 100 && this.mcore.grid[idx] !== 200) {
                //let tmp_idx = i * els.GRIDW + j + 2;
                if (this.mod.mconf.isEndless && ElsUtils.isZhubao(this.mcore.grid[idx])) {
                    //TODO: 珠宝被消除，更新珠宝数量
                    var tmp_fill_value = this.mcore.grid[idx];
                    var current_value = this.mcore.zhubao_count.get(tmp_fill_value);
                    current_value++;
                    this.mcore.zhubao_count.set(tmp_fill_value, current_value);
                    var params = {
                        x: els.ZONG - r - 1,
                        y: i,
                        type: tmp_fill_value
                    };
                    tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_REFRESH_ZHUBAO_COUNT, params);
                    this.mstat.addScore(els.ENDLESS_VALUES.GetZhuBaoAddScore);
                    var params2 = {
                        row: els.ZONG - r - 1,
                        col: i,
                        type: tmp_fill_value
                    };
                    tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_DELETE_ZHUBAO_ANIMATION, params2);
                }
                this.mcore.grid[idx] = 0;
            }
        }
        this.updateColHoleTop(2, 11);
    },


    /**
     * 下沉所有的列
     */
    sinkAllCol: function sinkAllCol() {
        for (var i = 0; i < els.ZONG; i++) {
            this.sinkCol(i);
        }

        this.updateColHoleTop(2, 11);
        //this.checkClearnRow(false);
    },

    checkClearnRow: function checkClearnRow(ai) {
        for (var i = 0; i < els.ZONG; i++) {
            if (this.isRowFull(i)) {
                this.mcore.fullrows[this.mcore.fullrows.length] = i;
            }
        }
        console.log('checkClearnRow', this.mcore.fullrows.length);
        //如果有满行，设置full_rows_count
        if (this.mcore.fullrows.length > 0) {
            if (!ai) {
                //console.log("fullrows......"+this.mcore.fullrows.length);
                if (this.mtimer.getstat("game-over")) {
                    this.mtimer.cancel("game-over");
                    this.mcore.game_over = false;
                }
            }
            this.mcore.combo++;
            if (!ai) {
                this.mcore.attack[0] = this.mcore.fullrows.length - 1;
                if (this.mcore.combo >= 3) {
                    this.mstat.combo_total += this.mcore.combo;
                    if (this.mcore.combo > this.mstat.combo_max) this.mstat.combo_max = this.mcore.combo;
                    this.mstat.combo_current = this.mcore.combo;
                    this.mcore.attack[0]++; // 如果连击数大于等于3   再给别人加一行
                    this.mtimer.trigger("combo", this.mcore.combo);
                    this.mstat.addScore(this.mcore.combo * 100);
                }
                this.mcore.attack[1] = this.mcore.block_index;
                //this.mstat.clear_lines+=this.mcore.fullrows.length;
                console.log("CurrentClearLines===>" + this.mstat.clear_lines);
                var fs = [50, 150, 300, 500];
                var fi = this.mcore.fullrows.length > 4 ? 3 : this.mcore.fullrows.length - 1;
                this.mstat.addScore(fs[fi]);
                this.mtimer.trigger("clear-row", nge.clone(this.mcore.fullrows));
                if (this.mconf.mode == els.ELS_MODE_AI) this.mstat.addScore(this.mcore.attack[0] * 10000);
            }
        } else {
            this.mcore.combo = 0;
            this.mstat.combo_current = 0;
        }

        this.updateColHoleTop(2, 11);
    },

    isRowFull: function isRowFull(row_idx) {
        var ret = true;
        for (var i = 0; i < els.HENG; i++) {
            var idx = row_idx * els.GRIDW + i + 2;
            if (this.mcore.grid[idx] < 100 || this.mcore.grid[idx] === 200) {
                ret = false;
                console.log('isRowFull==>', row_idx, i, idx, this.mcore.grid[idx]);
                break;
            }
        }
        return ret;
    },

    /**
     * @param fill_num 填充的数量
     */
    randomFillGrid: function randomFillGrid(fill_num) {
        var datas = this.findFillHolePos(fill_num);
        console.log('randomFillGrid ===> ', datas);
        return datas;
    },

    fillGridByIndex: function fillGridByIndex(index) {
        //TODO: 填充的block修改为随机的block
        this.mcore.grid[index] = 105;
    },

    getGridsPosByCol: function getGridsPosByCol(col) {
        var ret = [];
        for (var i = 0; i < els.ZONG; i++) {
            var idx = i * els.GRIDW + col + 2;
            ret.push(idx);
        }
        return ret;
    },

    getColHoles: function getColHoles() {
        var ret = [];
        var cols_hole = [];
        var cols_nohole = [];
        var g = this.mcore.grid;
        var is_have_hole = function is_have_hole(cols) {
            for (var i = 0; i < cols.length; i++) {
                var tmp = g[cols[i]];
                if (tmp > 100) {
                    for (var j = i; j < cols.length; j++) {
                        var tmp_j = g[cols[j]];
                        if (tmp_j === 0) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        for (var c = 0; c < els.HENG; c++) {
            var datas = this.getGridsPosByCol(c);
            if (is_have_hole(datas)) {
                cols_hole.push(c);
            } else {
                cols_nohole.push(c);
            }
        }

        ret.push(cols_hole);
        ret.push(cols_nohole);
        return ret;
    },

    findFillHolePos: function findFillHolePos(count) {
        //this.updateColHoleTop(2,11);
        var _ref2 = [this.mcore, this.mcore.grid],
            mc = _ref2[0],
            g = _ref2[1];
        var cols_hole = [],
            cols_nohole = [],
            holes = [],
            ret = [];

        var cols = mc.col_hole; //this.getColHoles();
        for (var _i4 = 0; _i4 < els.HENG; _i4++) {
            if (cols[_i4] === 0) {
                cols_nohole.push(_i4);
            } else {
                cols_hole.push(_i4);
            }
        }
        console.log('getColHoles', cols, cols_hole, cols_nohole);
        //找到所有空洞加入holes
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = cols_hole[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ch = _step.value;

                for (var _i7 = 0; _i7 < els.ZONG; _i7++) {
                    var idx_i = _i7 * els.GRIDW + _ch + 2;
                    if (g[idx_i] > 100 && g[idx_i] !== 200) {
                        for (var j = _i7; j < els.ZONG; j++) {
                            var idx_j = j * els.GRIDW + _ch + 2;
                            if (g[idx_j] === 0) {
                                holes[holes.length] = [_ch, idx_j];
                                console.log(_ch, _i7, j);
                            }
                        }
                        break;
                    }
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        console.log('Holes===>', holes);
        // 打乱顺序
        holes = ElsUtils.shuffle(holes);

        if (count <= holes.length) {
            //如果空洞足够
            for (var i = 0; i < count; i++) {
                holes[i][2] = true; //标志是需要填充的空洞
                ret[ret.length] = holes[i];
            }
            console.log('hole enough ==>', ret);
            return ret;
        } else {
            //如果空洞不够
            for (var _i5 = 0; _i5 < holes.length; _i5++) {
                holes[_i5][2] = true; //标志需要填充的空洞
                ret[ret.length] = holes[_i5];
            }
            //从没有空洞的列中挑选位置,从低往高找
            for (var _i6 = 0; _i6 < els.ZONG; _i6++) {
                var y = els.ZONG - _i6 - 1;
                //确保不在高于top_line的空间补块
                if (y < els.ZONG - mc.top_line) return ret;
                for (var ch in cols_nohole) {
                    var ich = cols_nohole[ch];
                    var idx = y * els.GRIDW + ich + 2;
                    if (g[idx] === 0) {
                        ret[ret.length] = [ch, idx, true]; //排除掉了最高列，可以实际补块
                        if (ret.length >= count) return ret;
                    }
                }
            }
            return ret;
        }
    },

    fall: function fall() {
        do {
            if (this.mcore.game_over) break;
        } while (this.moveBlk(els.DDOWN, false) != els.REACH_BOTTOM);
        this.nextBlk(false);
        this.testDDown();
    },

    updateColHoleTop: function updateColHoleTop(gxs, gxe) {
        var is_refresh_zhubao = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        var m, n;
        for (m = gxs; m <= gxe; m++) {
            this.mcore.col_top[m - 2] = 0;
            this.mcore.col_hole[m - 2] = 0;
            for (n = els.ZONG; n > 0; n--) {
                if (this.mcore.grid[(els.ZONG - n) * els.GRIDW + m] > 100) {
                    this.mcore.col_top[m - 2] = n;
                    break;
                }
            }
            for (; n > 0; n--) {
                if (this.mcore.grid[(els.ZONG - n) * els.GRIDW + m] == 0) this.mcore.col_hole[m - 2] += n;
            }
        }
        this.mcore.top_line = 0;
        for (m = 0; m < els.HENG; m++) {
            if (this.mcore.col_top[m] > this.mcore.top_line) this.mcore.top_line = this.mcore.col_top[m];
        } //检测紧急模式

        // this.mod.checkEmergency();

        if (is_refresh_zhubao) {
            //! 珠宝更新
            var zhubao_arr = [];
            if (this.mod.mconf.isEndless && this.index === 0) {
                for (var i = 0; i < els.ZONG; i++) {
                    for (var j = 0; j < els.HENG; j++) {
                        var tmp_grid_idx = i * els.GRIDW + 2 + j;
                        if (ElsUtils.isZhubao(this.mcore.grid[tmp_grid_idx])) {
                            var tmp_zhubao = {
                                type: this.mcore.grid[tmp_grid_idx],
                                row: els.ZONG - i - 1,
                                col: j
                            };
                            zhubao_arr.push(tmp_zhubao);
                        }
                    }
                }
            }
            if (zhubao_arr.length > 0) {
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_ENDLESS_ON_ZHUBAO_CHANGE, zhubao_arr);
            }
        }
    },

    //用于预先绘制下落到底部的虚影，用于更好的瞄准
    testDDown: function testDDown() {
        //return 0; //debug...
        var x, y;
        var tmp = this.mcore.clone();
        while (this.moveBlk(els.DDOWN, true) != els.REACH_BOTTOM) {}
        x = this.mcore.cur_x, y = this.mcore.cur_y;
        this.mcore.recycle();
        this.mcore = tmp.clone();
        tmp.recycle();
        this.mcore.tdx = x, this.mcore.tdy = y;
        return 0;
    },

    //操作方块,更新Grid
    moveBlk: function moveBlk(dir, ai) {
        var i, j, m, n, fflag;

        if (this.mcore.game_over) {
            if (dir == els.LEFT || dir == els.RIGHT) return els.REACH_BORDER;else return els.REACH_BOTTOM;
        }

        if (!ai) this.needdraw = true;

        var type = this.mcore.cur_block;
        var cx = this.mcore.cur_x;
        var cy = this.mcore.cur_y;
        var cz = this.mcore.cur_z;
        var x = 0,
            y = 0,
            z = 0;

        switch (dir) {
            case els.TURN_CW:
                x = cx;
                y = cy;
                z = (cz + 5) % 4;
                this.mtimer.ready_wending = els.WENDING;
                break;
            case els.TURN_CCW:
                x = cx;
                y = cy;
                z = (cz + 3) % 4;
                this.mtimer.ready_wending = els.WENDING;
                break;
            case els.DOWN:
            case els.DDOWN:
                x = cx, y = cy + 1, z = cz;
                break;
            case els.LEFT:
                x = cx - 1, y = cy, z = cz;
                this.mtimer.ready_wending = els.WENDING;
                break;
            case els.RIGHT:
                x = cx + 1, y = cy, z = cz;
                this.mtimer.ready_wending = els.WENDING;
                break;
            case els.SET:
                x = cx, y = cy, z = cz;
                break;
            case els.CLEAR:
                x = cx, y = cy, z = cz;
                break;
        }

        //不稳定块置0,100以上为已经下落稳定的块
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                if (this.isInGrid(cy + i, cx + j) && this.mcore.grid[(cy + i) * els.GRIDW + cx + j] < 100) this.mcore.grid[(cy + i) * els.GRIDW + cx + j] = 0;
            }
        }if (dir == els.CLEAR) return els.NORMAL; //清除漂浮的块

        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                //检测到了碰撞,可能是到底,到边,或者遇到了别的块,无法下落
                if (this.mcore.grid[(y + i) * els.GRIDW + x + j] && this.mBlkDat[type][z][i * 4 + j]) {
                    var gv = this.mcore.grid[(y + i) * els.GRIDW + x + j];
                    var mv = this.mBlkDat[type][z][i * 4 + j];
                    //if(!ai) console.log("CCC"+this.index+"..y+i="+(y+i)+" x+j="+(x+j)+" type="+type+" z="+z+" i="+i+" j="+j+" gv="+gv+" mv="+mv);
                    if (dir == els.DOWN || dir == els.DDOWN) {
                        if (dir == els.DOWN) {
                            //普通下落（非直落）还没粘住的情况
                            if (this.mtimer.ready_wending >= 0) {
                                //触发UpdateELS开始对ready_wending计数
                                if (this.mtimer.ready_wending == els.WENDING) this.mtimer.ready_wending--;
                                for (m = 0; m < 4; m++) {
                                    for (n = 0; n < 4; n++) {
                                        if (this.isInGrid(cy + m, cx + n) && this.mBlkDat[type][z][m * 4 + n]) this.mcore.grid[(cy + m) * els.GRIDW + cx + n] = this.mBlkDat[type][z][m * 4 + n];
                                    }
                                }
                                return els.READY_BOTTOM;
                            } else {
                                this.mtimer.ready_wending = els.WENDING;
                            }
                        }

                        //加100设置为稳定块，并统计需要显示粘住光晕的块位置
                        if (!ai) {
                            this.mcore.cling_blocks.length = 0;
                        }
                        for (m = 0; m < 4; m++) {
                            for (n = 0; n < 4; n++) {
                                if (this.isInGrid(cy + m, cx + n) && this.mBlkDat[type][z][m * 4 + n]) {
                                    this.mcore.grid[(cy + m) * els.GRIDW + cx + n] = 100 + this.mBlkDat[type][z][m * 4 + n]; //加100,置为稳定块
                                    if (!ai) {
                                        if (this.mcore.grid[(cy + m) * els.GRIDW + cx + n] != 100) {
                                            //纪录下需要显示“粘住光晕”的块坐标及个数
                                            this.mcore.cling_blocks[this.mcore.cling_blocks.length] = new nge.Point(cx + n - 2, cy + m);
                                            //this->GenItem(idx, gp, cy+m, cx+n); //随机产生道具
                                        }
                                    }
                                }
                            }
                        }
                        //触发粘住光晕动画...
                        //CALLUI cling block animation...
                        /*if (m_pElSModel->mcore[idx].cling_count>0 && idx==0) 
                          m_pPlayAreas[idx]->New_lighting();*/

                        this.updateColHoleTop(2, 11, false);

                        //标注满行，检测满行信息 标记到fullrow里 同时标记full_rows_count
                        //扫描判断满行,放入fullrows数组
                        for (m = 0; m < 4; m++) {
                            fflag = true;
                            for (n = 0; n < els.HENG; n++) {
                                if (this.isInGrid(cy + m, n + 2)) {
                                    if (this.mcore.grid[(cy + m) * els.GRIDW + n + 2] < 100 || this.mcore.grid[(cy + m) * els.GRIDW + n + 2] == 200) {
                                        fflag = false;
                                        break;
                                    }
                                }
                            }
                            if (fflag) {
                                this.mcore.fullrows[this.mcore.fullrows.length] = cy + m;
                            }
                        }
                        //如果有满行，设置full_rows_count
                        if (this.mcore.fullrows.length > 0) {
                            if (!ai) {
                                //console.log("fullrows......"+this.mcore.fullrows.length);
                                if (this.mtimer.getstat("game-over")) {
                                    this.mtimer.cancel("game-over");
                                    this.mcore.game_over = false;
                                }
                            }
                            this.mcore.combo++;
                            if (!ai) {
                                this.mcore.attack[0] = this.mcore.fullrows.length - 1;
                                if (this.mcore.combo >= 3) {
                                    this.mstat.combo_total += this.mcore.combo;
                                    if (this.mcore.combo > this.mstat.combo_max) this.mstat.combo_max = this.mcore.combo;
                                    this.mstat.combo_current = this.mcore.combo;
                                    this.mcore.attack[0]++; // 如果连击数大于等于3   再给别人加一行
                                    this.mtimer.trigger("combo", this.mcore.combo);
                                    this.mstat.addScore(this.mcore.combo * 100);
                                }
                                this.mcore.attack[1] = this.mcore.block_index;
                                //this.mstat.clear_lines+=this.mcore.fullrows.length;
                                console.log("CurrentClearLines===>" + this.mstat.clear_lines);
                                var fs = [50, 150, 300, 500];
                                var fi = this.mcore.fullrows.length > 4 ? 3 : this.mcore.fullrows.length - 1;
                                this.mstat.addScore(fs[fi]);
                                this.mtimer.trigger("clear-row", nge.clone(this.mcore.fullrows));
                                if (this.mconf.mode == els.ELS_MODE_AI) this.mstat.addScore(this.mcore.attack[0] * 10000);
                            }
                        } else {
                            this.mcore.combo = 0;
                            this.mstat.combo_current = 0;
                        }
                        //进入了下一块处理,可以保存块了
                        this.mcore.save_lock = false;
                        return els.REACH_BOTTOM;
                    } else if (dir == els.LEFT || dir == els.RIGHT) {
                        for (i = 0; i < 4; i++) {
                            for (j = 0; j < 4; j++) {
                                if (this.isInGrid(cy + i, cx + j) && this.mcore.grid[(cy + i) * els.GRIDW + cx + j] == 0) this.mcore.grid[(cy + i) * els.GRIDW + cx + j] += this.mBlkDat[type][z][i * 4 + j];
                            }
                        }
                        return els.REACH_BORDER;
                    } else {
                        if (dir == els.TURN_CW || dir == els.TURN_CCW) {
                            for (i = 0; i < 4; i++) {
                                for (j = 0; j < 4; j++) {
                                    if (this.isInGrid(y + i, x + j) && this.mcore.grid[(y + i) * els.GRIDW + x + j] == 0) this.mcore.grid[(y + i) * els.GRIDW + x + j] += this.mBlkDat[type][cz][i * 4 + j];
                                }
                            }return els.REACH_BORDER;
                        }
                        //调用NextBlk会调用MoveBlk(SET),
                        //此时方块刚出来就有碰撞表明Game Over了
                        /// Modify by lu ning. 14:44:47 2018/07/22
                        /// 这里要做特殊处理，如果正在消除，那么，不应该触发game-over,
                        /// 因为，消除完成后，可能游戏不会结束
                        if (dir == els.SET && !ai && this.mcore.fullrows.length === 0) {
                            //console.log("TRIGGER OVER");
                            this.mstat.isKO = true;
                            this.mtimer.trigger("game-over", 0.12);
                        }
                        return els.NORMAL;
                    }
                }
            }
        }
        //更新真正的Grid,置当前x,y,z,返回
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                if (this.isInGrid(y + i, x + j)) {
                    this.mcore.grid[(y + i) * els.GRIDW + x + j] += this.mBlkDat[type][z][i * 4 + j];
                }
            }
        }
        this.mcore.cur_x = x;
        this.mcore.cur_y = y;
        this.mcore.cur_z = z;
        if (!ai) this.testDDown();
        return els.NORMAL;
    },

    isInGrid: function isInGrid(x, y) {
        return x >= 0 && x < els.ZONG + 2 && y >= 0 && y < els.HENG + 4;
    },

    //攻击对方
    attack: function attack(target, line, spaceseed, forsingle) {
        var i,
            j,
            flowflag = 0;
        var tgrid = [];
        for (i = 0; i < els.ZONG + 2; i++) {
            tgrid[i] = new Array(els.HENG + 4);
        }if (target.mcore.game_over || line <= 0) return;
        if (!forsingle) {
            if (target.mtimer.getstat("clear-row")) target.mtimer.cancel("clear-row");
            if (target.mtimer.getstat("fall")) target.mtimer.cancel("fall");
        }

        nge.srand(spaceseed);
        tgrid = new Uint8Array(els.GRIDSIZE);
        tgrid.set(target.mcore.grid);
        var is_player = target.index === 0;
        for (i = 0; i < els.ZONG - line; i++) {
            for (j = 0; j < els.HENG; j++) {
                // if(is_player && ElsUtils.isZhubao(tgrid[i * els.GRIDW + 2 + j])){
                //     //! 珠宝特效向上移动
                //     //TODO: 珠宝没有消除，位置发生变化
                //     let tmp_fill_value = tgrid[i * els.GRIDW + 2 + j];
                //     // * 这里的位置是变化前的
                //     let params = {
                //         row: els.ZONG - i - 1, // * 
                //         col: j,
                //         type: tmp_fill_value,
                //         is_down: false
                //     };
                //     tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_REFRESH_ZHUBAO_ANIMATION_POS,params);

                // }
                tgrid[i * els.GRIDW + 2 + j] = target.mcore.grid[(i + line) * els.GRIDW + 2 + j];
                if (tgrid[i * els.GRIDW + 2 + j] < 10 && tgrid[i * els.GRIDW + 2 + j] > 0) {
                    flowflag = 1;
                    tgrid[i * els.GRIDW + 2 + j] = 0;
                }
            }
        }

        //if(!this.mod.mconf.isEndless) {
        if (true) {
            for (i = 0; i < line; i++) {
                var r = nge.rand() % els.HENG;
                for (j = 0; j < els.HENG; j++) {
                    if (r == j) {
                        tgrid[(els.ZONG - 1 - i) * els.GRIDW + 2 + j] = 0;
                    } else {
                        tgrid[(els.ZONG - 1 - i) * els.GRIDW + 2 + j] = 111;
                    }
                }
            }
        } else {
            /*for (i = 0; i < line; i++) {
                var el = this.mod.endless_line;
                //var bi = els.ELSBMP["i"+(parseInt(el/10)+4)];
                var bj = bi[parseInt(el%10)];
                for (j = 0; j < els.HENG; j++) {
                    tgrid[(els.ZONG - 1 - i) * els.GRIDW + 2 + j] = bj[j]==0?0:100+bj[j];
                }
                this.mod.endless_line+=1;
            }*/
        }

        target.mcore.grid = new Uint8Array(els.GRIDSIZE);
        target.mcore.grid.set(tgrid);

        if (flowflag) {
            var x = target.mcore.cur_x;
            var y = target.mcore.cur_y;
            var z = target.mcore.cur_z;
            var type = target.mcore.cur_block;
            var needUp = false;
            for (i = 0; i < 4; i++) {
                for (j = 0; j < 4; j++) {
                    if (this.isInGrid(y + i, x + j)) {
                        if (target.mcore.grid[(y + i) * els.GRIDW + x + j] && target.mBlkDat[type][z][i * 4 + j]) needUp = true;
                    }
                }
            }if (needUp) {
                //printf("ATTACK NEED UP CURRENT BLOCK!\n");
                target.mcore.cur_y -= line;
                y = target.mcore.cur_y;
            }
            for (i = 0; i < 4; i++) {
                for (j = 0; j < 4; j++) {
                    if (this.isInGrid(y + i, x + j)) target.mcore.grid[(y + i) * els.GRIDW + x + j] += target.mBlkDat[type][z][i * 4 + j];
                }
            }
        }

        for (i = 0; i < els.HENG; i++) {
            target.mcore.col_top[i] += line;
        }if (target.mcore.fullrows.length != 0) {
            for (var f = 0; f < target.mcore.fullrows.length; f++) {
                target.mcore.fullrows[f] -= line;
            } //DumpELS(idx, "ATTACK add fullrows!!!");
        }
        //TODO:攻击影响col_hole
    },

    update: function update() {
        if (this.mtimer.ready_wending != els.WENDING) {
            //if(this.index==0) console.log("UPDATE WENDING...."+this.mtimer.ready_wending);
            this.mtimer.ready_wending--;
        }
        this.mtimer.update();
    },
    /**
     * 无尽模式小关卡是否结束
     */
    isEndlessLevelEnd: function isEndlessLevelEnd() {
        if (!this.mod.mconf.isEndless) return false;
        var ret = true;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = this.mcore.zhubao_max.keys()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var key = _step2.value;

                if (this.mcore.zhubao_count.has(key) && this.mcore.zhubao_max.get(key) !== this.mcore.zhubao_count.get(key)) {
                    ret = false;
                    break;
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return ret;
    },

    /**
     * 冻结增加行 'step'步数后 重新计算
     * 
     * @param {[type]} step [步数]
     */
    setFreezeStep: function setFreezeStep(step) {
        this.mcore.next_attack = this.mcore.next_attack > 0 ? this.mcore.next_attack : 0;
        this.mcore.next_attack += step;
    }
});
(function (window, factory) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.ElsGrid = factory();
    }
})(undefined, function () {
    return ElsGrid;
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
        //# sourceMappingURL=grid.js.map
        