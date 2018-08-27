"use strict";
cc._RF.push(module, '8762eUjz01FQ6MvmfgguWKl', 'model');
// script/core/model.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var nge = require("./engine.js");
var els = require("./els.js");
var ElsAi = require("./ai.js");
var ElsProfile = require("./ELSProfile.js");
var Class = nge.Class;

var ElsModel = nge.Model.extend({
    ctor: function ctor(ElsGrid) {
        this.winlinedir = 1;
        this.ebdir = 1;
        this.begin_help1st = -1;
        this.mgrid = [];
        this.stage = 0;
        this.emergency = false;
        this.keepstar = false;
        this.pause = false;
        this.currentStage = 0;
        this.currentStatus = els.ELS_GAME_STATE.HOMEPAGE;
        this.endless_line = 0;
        this.endless_clear = false;
        this.endless_level = 1;
        this.ElsGrid = ElsGrid;
        this.allowDoPopAction = true;
        this.adSlot = -1; //广告槽
        this.adSlotConf = {
            "1": "adunit-b61c5f52e2942279",
            "2": "adunit-6bd777cddfba016a",
            "3": "adunit-cb6c0c6de7f272f1"
        };
        for (var i = 0; i < 2; i++) {
            this.mgrid[i] = new ElsGrid(this, i);
        }
        this.mBlockQueue = new Array(els.MAXBLKQUEUE);
        this.bgAudioContext = null;
        this.randomBgMusic = null;

        tywx.NotificationCenter.listen(tywx.EventType.GAME_SHOW, this.onForGround, this);
        tywx.NotificationCenter.listen('changeAd', this.onChangeAd, this);
    },

    //生成随机块序列
    genRandomBlockQueue: function genRandomBlockQueue(seed) {
        nge.srand(seed);
        if (els.ELS_CLASSIC) this.mconf.block_type = 1;else this.mconf.block_type = 0;
        if (this.mconf.block_type == 1) {
            var tmptype;
            var block_tmp = -1;
            //生成500个块的序列
            for (var i = 0; i < els.MAXBLKQUEUE; i++) {
                while (true) {
                    tmptype = nge.rand() % 9;
                    if (block_tmp != tmptype) break;
                }
                var tmpreplace = nge.rand();
                var tmprate = 2;
                if (this.mconf.mode == els.ELS_MODE_AI) tmprate = 2;else tmprate = 2;
                if (tmpreplace % tmprate == 0) {
                    if (this.mconf.mode == els.ELS_MODE_AI) {
                        if (tmptype == 5 || tmptype == 6) tmptype = 0;
                        if (tmptype == 3 || tmptype == 4) tmptype = 8;
                        if (tmptype == 1 || tmptype == 2) tmptype = 7;
                    }
                    if (this.mconf.mode == els.ELS_MODE_SINGLE) {
                        if (tmptype == 5) tmptype = 8;
                        if (tmptype == 3 || tmptype == 4) tmptype = 8;
                        if (tmptype == 1 || tmptype == 2 || tmptype == 6) tmptype = 7;
                    }
                }
                this.mBlockQueue[i] = tmptype;
                block_tmp = tmptype;
            }
        }
        if (this.mconf.block_type == 0) {
            for (var i = 0; i < els.MAXBLKQUEUE; i++) {
                var tmpreplace = nge.rand();
                var tmptype = nge.rand() % 9;
                if (tmpreplace % 3 == 0) if (tmptype == 3 || tmptype == 4) tmptype = 2;
                this.mBlockQueue[i] = tmptype;
            }
        }
    },
    // 获取珠宝配置
    getRandomZhuBaoConfig: function getRandomZhuBaoConfig() {
        //return {'deep':10, 'd1':1, 'd2':2, 'd3':5};
        var zhubao_config = els.CONFIG.zhubao_endless;
        var level = zhubao_config.level;
        var zhubao = zhubao_config.zhubao;
        for (var i = 0; i < level.length; i++) {
            var e = level[i];
            if (i > 0 && this.endless_level < e && this.endless_level >= level[i - 1]) {
                return zhubao[i - 1];
            }
        }
        return -1;
    },

    init: function init(bmpindex, seed) {
        var bmp = [[0, 0, 1, 1, 1, 1, 1, 1, 0, 0], [0, 1, 1, 1, 1, 1, 1, 1, 1, 0], [2, 2, 2, 2, 2, 0, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 0, 2, 2, 2], [3, 3, 3, 0, 0, 3, 3, 3, 3, 3], [3, 3, 0, 0, 0, 0, 3, 3, 3, 3], [4, 4, 0, 0, 0, 0, 4, 4, 4, 4], [4, 4, 4, 0, 0, 4, 4, 4, 4, 4], [0, 5, 5, 5, 5, 5, 5, 5, 5, 0], [0, 0, 5, 5, 5, 5, 5, 5, 0, 0]];

        //记录上一关卡的mode
        if (this.mconf && this.mconf.mode != undefined) {
            var _mode = this.mconf.mode;
            var _isWhisper = this.mconf.isWhisper;
            var _isEndless = this.mconf.isEndless;
            var _next_attack = this.mconf.next_attack;
            this.mconf = new ElsConfig();
            this.mconf.mode = _mode;
            this.mconf.isWhisper = _isWhisper;
            this.mconf.isEndless = _isEndless;
            this.mconf.next_attack = _next_attack;
        } else {
            this.mconf = new ElsConfig();
        }

        this.mrep = new ElsReplay();
        this.mai = new ElsAi();
        this.genRandomBlockQueue(seed);
        this.mrender = [];
        this.keepstar = false;
        for (var i = 0; i < 2; i++) {
            this.mgrid[i] = new this.ElsGrid(this, i);
            this.mgrid[i].mconf = this.mconf;
            if (els.ELS_CLASSIC) {
                this.mgrid[i].setBlkDat(els.BLKDAT_C);
            } else {
                this.mgrid[i].setBlkDat(els.BLKDAT_NC);
            }
            this.mgrid[i].setQueue(this.mBlockQueue);
            this.mgrid[i].reset();
            if (!this.mconf.isEndless) {
                this.currentStage = bmpindex;
                var bn = els.ELSBMP_NANDU;
                if (bmpindex >= 0) {
                    var bi = bn[bmpindex % bn.length][0];
                    this.mgrid[i].setBmp(els.ELSBMP(bi));
                    this.add_step = 0;
                }
            } else {
                //@ENDLESS 初次设置第一个图,从i3开始
                this.currentStage = 0;
                this.mgrid[i].setBmp(els.ELSBMP(3 + this.endless_level - 1));
                this.add_step = 0;
            }
        }
    },

    setGameStatus: function setGameStatus(_status) {
        this.currentStatus = _status;
        tywx.NotificationCenter.trigger("STATUS_CHANGE", this.currentStatus);
        this.displayAd();
    },

    getGameStatus: function getGameStatus() {
        return this.currentStatus;
    },

    getAutoAttackStep: function getAutoAttackStep() {
        var auto_attack_step;
        if (this.mconf.isEndless) {
            //@ENDLESS 从auto_attack_endless里取涨行速度配置
            var cs = parseInt(this.endless_level);
            for (var n = 0; n < els.CONFIG.auto_attack_endless.stage.length - 1; n++) {
                var ss = els.CONFIG.auto_attack_endless.stage[n];
                var se = els.CONFIG.auto_attack_endless.stage[n + 1];
                var st = els.CONFIG.auto_attack_endless.step[n];
                if (cs < se && cs >= ss) {
                    auto_attack_step = st;
                    break;
                }
            }
        } else {
            var cs = this.currentStage % els.ELSBMP_NANDU.length;
            for (var n = 0; n < els.CONFIG.auto_attack.stage.length - 1; n++) {
                var ss = els.CONFIG.auto_attack.stage[n];
                var se = els.CONFIG.auto_attack.stage[n + 1];
                var st = els.CONFIG.auto_attack.step[n];
                if (cs < se && cs >= ss) {
                    auto_attack_step = st;
                    break;
                }
            }
        }
        return auto_attack_step;
    },

    getMainTips: function getMainTips() {
        var tips = ['快速上滑换掉当前块', '点击屏幕旋转方块', '左右滑拖动方块', '快速下滑扔下方块', '道具可以帮你过关'];

        return tips[parseInt(this.stage / 300) % tips.length];
    },

    getWinStep: function getWinStep() {
        this.isNanGuan = false;
        if (this.mconf.isWhisper) return 50;
        if (this.mconf.isEndless) return 5000000;
        var cs = this.currentStage % els.ELSBMP_NANDU.length;
        var mstep = els.ELSBMP_NANDU[cs][1];
        if (els.CONFIG.winstep_nanguan) {
            for (var n = 0; n < els.CONFIG.winstep_nanguan.stage.length; n++) {
                var ns = els.CONFIG.winstep_nanguan.stage[n][0];
                var ds = els.CONFIG.winstep_nanguan.stage[n][1];
                if (cs == ns - 1) {
                    this.isNanGuan = true;
                    mstep -= ds;
                }
            }
        }
        if (this.currentStage >= els.ELSBMP_NANDU.length) return parseInt(mstep * 2.0 / 3.0);
        if (els.CONFIG.winstep_new) {
            for (var n = 0; n < els.CONFIG.winstep_new.stage.length - 1; n++) {
                var ss = els.CONFIG.winstep_new.stage[n];
                var se = els.CONFIG.winstep_new.stage[n + 1];
                var st = els.CONFIG.winstep_new.step[n];
                if (cs < se && cs >= ss) {
                    mstep += st;
                    break;
                }
            }
        }
        return mstep;
    },

    getWinLine: function getWinLine() {
        var ltl,
            cs = this.currentStage % els.ELSBMP_NANDU.length;
        for (var n = 0; n < els.CONFIG.winline.stage.length - 1; n++) {
            var ss = els.CONFIG.winline.stage[n];
            var se = els.CONFIG.winline.stage[n + 1];
            var st = els.CONFIG.winline.line[n];
            if (cs < se && cs >= ss) {
                ltl = st;
                break;
            }
        }
        return ltl;
    },

    //显示广告
    displayAd: function displayAd() {
        //tywx.AdManager.showAd({x:0,y:0});
        var self = this;
        function innerSV(v) {
            if (self.adSlot != v) {
                self.adSlot = v;
                tywx.AdManager.showBannerAd(self.adSlotConf[self.adSlot + ""]);
                self.setScheduleAd();
            }
        }
        //if(  this.getGameStatus() == els.ELS_GAME_STATE.HOMEPAGE  ||  (this.getGameStatus() != els.ELS_GAME_STATE.HOMEPAGE&&this.needhelp1st==false) ){
        if (this.getGameStatus() != els.ELS_GAME_STATE.HOMEPAGE && this.needhelp1st == false) {

            if (this.getGameStatus() == els.ELS_GAME_STATE.HOMEPAGE) {
                //首页槽1
                innerSV(1);
            } else {
                //非首页并且不播放帮助时候显示
                if (this.mconf.mode == els.ELS_MODE_AI) {
                    //AI槽2
                    innerSV(2);
                } else {
                    //单人槽3
                    innerSV(3);
                }
            }
        } else {
            tywx.AdManager.destroyBannerAd();
            this.canelScheduleAd();
        }
    },

    //取消广告计时器
    canelScheduleAd: function canelScheduleAd() {
        if (tywx.Timer.isScheduledTimer(cc.director, this.scheduleAd)) {
            tywx.Timer.cancelTimer(cc.director, this.scheduleAd);
        }
    },
    //开启广告计时器
    setScheduleAd: function setScheduleAd() {
        this.canelScheduleAd();
        tywx.Timer.setTimer(cc.director, this.scheduleAd, 20);
    },
    //广告计时器
    scheduleAd: function scheduleAd() {
        tywx.NotificationCenter.trigger('changeAd', {});
    },
    //改变广告事件
    onChangeAd: function onChangeAd() {
        tywx.AdManager.showBannerAd(this.adSlotConf[this.adSlot + ""]);
    },

    checkPlayMusic: function checkPlayMusic() {
        var ret = true;
        //console.log('checkPlayMusic',ElsProfile.getInstance().getIsMusicMute());
        if (ElsProfile.getInstance().getIsMusicMute()) {
            ret = false;
            this.stopBgMusic();
        }
        return ret;
    },

    onForGround: function onForGround() {
        if (!this.checkPlayMusic()) {
            return;
        }

        if (this.bgAudioContext) {
            this.playBgMusic();
        } else {
            if (this.randomBgMusic) {
                this.playRandomBgMusic();
            }
        }
    },

    playMusic: function playMusic(_audioName, _loop, volume) {
        //console.log('playMusic 1===>  ' + _audioName + this.stage);
        if (!tywx.isInWXChat || !this.checkPlayMusic()) return;
        //! 使用微信API播放音效,使用cocos的方式效率有点低
        var _audioContext = wx.createInnerAudioContext();
        _audioContext.src = _audioName;
        _audioContext.autoPlay = true;
        _audioContext.loop = _loop;
        _audioContext.volume = volume === undefined ? 1.0 : volume;
        _audioContext.play();
        //! 播放背景音乐
        if (_audioName === els.ELS_VOICE.BG_MUSIC) {
            //this.playBgMusic();
            this.stopBgMusic();
            if (this.bgAudioContext) {
                this.bgAudioContext[0].destroy();
            }
            this.bgAudioContext = [_audioContext, els.ELS_VOICE.BG_MUSIC];
        }
    },
    playBgMusic: function playBgMusic() {
        var _audioContext = wx.createInnerAudioContext();
        _audioContext.src = els.ELS_VOICE.BG_MUSIC;
        _audioContext.autoPlay = true;
        _audioContext.loop = true;
        _audioContext.volume = 1.0;
        _audioContext.play();
        //! 播放背景音乐
        this.stopBgMusic();
        if (this.bgAudioContext) {
            this.bgAudioContext[0].destroy();
        }
        this.bgAudioContext = [_audioContext, els.ELS_VOICE.BG_MUSIC];
    },
    stopRandomBgMusic: function stopRandomBgMusic() {
        if (this.randomBgMusic) {
            this.randomBgMusic[0].destroy();
        }
        this.randomBgMusic = null;
        console.log('bgMusigState stopRandomBgMusic==>', this.randomBgMusic, this.bgAudioContext);
    },
    stopBgMusic: function stopBgMusic() {
        if (this.bgAudioContext) {
            this.bgAudioContext[0].destroy();
        }
        this.bgAudioContext = null;
        this.stopRandomBgMusic();
    },
    playRandomBgMusic: function playRandomBgMusic() {
        if (!this.checkPlayMusic()) return;
        this.stopBgMusic();
        console.log('bgMusigState playRandomMusic', this.randomBgMusic);
        var ran = parseInt(Math.random() * els.CONFIG.bgm + 1);
        var url = tywx.SystemInfo.cdnPath + "m/" + ran + ".mp3";
        var _audioContext = wx.createInnerAudioContext();
        _audioContext.src = url;
        _audioContext.autoPlay = true;
        _audioContext.loop = true;
        _audioContext.volume = 1;
        _audioContext.play();
        if (this.randomBgMusic) {
            this.randomBgMusic[0].destroy();
        }
        this.randomBgMusic = [_audioContext, url];
    }

});

//数据结构
var ElsCore = Class.extend({
    ctor: function ctor() {
        this.grid = new Uint8Array(els.GRIDSIZE);
        this.col_top = new Array(els.HENG);
        this.col_hole = new Array(els.HENG);
        this.combo = 0;
        this.cur_x = this.cur_y = this.cur_z = 0;
        this.cur_block = 0; //当前块
        this.next_block = 0; //下一块
        this.save_block = 0; //保存块
        this.top_line = 0;
        this.tdx = this.tdy = 0; //记录将要落下虚影的坐标
        this.fullrows = [];
        this.cling_blocks = [];
        this.block_index = 0;
        this.attack = new Array(2); //攻击行数和生成空洞随机种子 ０:行数,１:seed
        this.ai_mode = "";
        this.save_lock = false;
        this.game_over = false;
        this.game_result = 0; //0未得出结果, 1普通结束(经典模式), 2胜利, 3失败
        this.zhubao_count = new Map([[112, 0], [113, 0], [114, 0]]); // 统计当前还需要消除的珠宝数量
        this.zhubao_max = new Map([[112, 0], [113, 0], [114, 0]]); // 需要消除的珠宝总数量
    },

    _pool: [],
    clone: function clone() {
        var cloned = undefined;
        if (this._pool.length > 0) {
            cloned = this._pool.pop();
        } else {
            cloned = new ElsCore();
        }
        this._assign(this, cloned);
        return cloned;
    },

    recycle: function recycle() {
        this._pool.push(this);
    },

    _assign: function _assign(src, dst) {
        dst.combo = src.combo;
        dst.cur_x = src.cur_x;
        dst.cur_y = src.cur_y;
        dst.cur_z = src.cur_z;
        dst.cur_block = src.cur_block;
        dst.next_block = src.next_block;
        dst.save_block = src.save_block;
        dst.top_line = src.top_line;
        dst.tdx = src.tdx;
        dst.tdy = src.tdy;
        dst.block_index = src.block_index;
        dst.ai_mode = src.ai_mode;
        dst.save_lock = src.save_lock;
        dst.game_over = src.game_over;
        dst.game_result = src.game_result;
        var d = dst.col_top;
        var s = src.col_top;
        d[0] = s[0];
        d[1] = s[1];
        d[2] = s[2];
        d[3] = s[3];
        d[4] = s[4];
        d[5] = s[5];
        d[6] = s[6];
        d[7] = s[7];
        d[8] = s[8];
        d[9] = s[9];
        d = dst.col_hole;
        s = src.col_hole;
        d[0] = s[0];
        d[1] = s[1];
        d[2] = s[2];
        d[3] = s[3];
        d[4] = s[4];
        d[5] = s[5];
        d[6] = s[6];
        d[7] = s[7];
        d[8] = s[8];
        d[9] = s[9];
        dst.attack[0] = src.attack[0];
        dst.attack[1] = src.attack[1];
        dst.fullrows = src.fullrows.slice();
        //dst.cling_blocks = src.cling_blocks.slice();
        dst.grid.set(src.grid);
        dst.zhubao_count.set(112, src.zhubao_count.get(112));
        dst.zhubao_count.set(113, src.zhubao_count.get(113));
        dst.zhubao_count.set(114, src.zhubao_count.get(114));
        dst.zhubao_max.set(112, src.zhubao_max.get(112));
        dst.zhubao_max.set(113, src.zhubao_max.get(113));
        dst.zhubao_max.set(114, src.zhubao_max.get(114));
    }
});

var ElsTimer = nge.Timer.extend({
    ctor: function ctor() {
        this._super();
        this.ready_wending = 0;
    }
});

var ElsStat = Class.extend({
    ctor: function ctor() {
        this.combo_total = 0;
        this.combo_max = 0;
        this.combo_current = 0;
        this.level = 0;
        this.score = 0;
        this.clear_lines = 0;
        this.isKO = false;
    },

    addScore: function addScore(s) {
        this.score += s;
        for (var i = 0; i < els.UPGRADE_STANTARD.length; i++) {
            if (this.score <= els.UPGRADE_STANTARD[i + 1] && this.score >= els.UPGRADE_STANTARD[i]) {
                this.level = i;
                break;
            }
        }
    }
});

var ElsReplay = Class.extend({
    ctor: function ctor() {
        this.areaId = 0;
        this.stage = 0;
        this.blkindex = 0;
        this.act = '';
    }
});

var ElsConfig = Class.extend({
    ctor: function ctor() {
        this.isreplay = false;
        this.isWhisper = false;
        this.isEndless = false;
        this.canRun = true;
        this.mode = els.ELS_MODE_SINGLE;
        //this.mode=els.ELS_MODE_AI;
    }
});

(function (window, factory) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.nge = factory();
    }
})(undefined, function () {
    return {
        "ElsModel": ElsModel,
        "ElsCore": ElsCore,
        "ElsTimer": ElsTimer,
        "ElsStat": ElsStat,
        "ElsReplay": ElsReplay,
        "ElsConfig": ElsConfig
    };
});

cc._RF.pop();