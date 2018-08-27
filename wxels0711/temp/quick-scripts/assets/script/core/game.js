(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/core/game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1d88eA6lQ1FCK5pjGoCzIyj', 'game', __filename);
// script/core/game.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//从game.js分离
var nge = require("./engine.js");
var els = require("./els.js");
var model = require("./model.js");
var ElsGrid = require("./grid.js");
var ElsModel = model.ElsModel;
var ElsRender = require("./render.js");
var ElsTouch = require("./touch.js");
var ELSEvent = require("./ElsEvents.js");
var ElsGame = nge.Game.extend({

    ctor: function ctor(model, render) {
        this._super(model, render);
        this.shareInfo = {};
        tywx.NotificationCenter.listen(tywx.EventType.GET_SHARE_CONFIG_SUCCESS, this.onGetShareMsg, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_SET_MAGIC_BUSY, this.onMagicBusy, this);
        tywx.PropagateInterface.getShareConfigInfo(); //! 获取所有分享点信息
        this.config = null;
        this.requestTimes = 3; //! 请求次数上线
        this.requestConfigInfo(); //! 请求配置信息
        this.model.playMusic(els.ELS_VOICE.BG_MUSIC, true, 0.4);
        this.magicBusy = false;
        this.isWaitingRevive = false; //* 是否在等待复活
        this.isShowingEndlessLevelEnd = false;
        this.currentReviveTimes = 0; //* 当前复活次数
    },

    onGetShareMsg: function onGetShareMsg(msg) {

        if (!msg || !msg.retmsg) return;

        var _deliveryList = msg.retmsg.delivery;
        var _randomIndex = Math.floor(Math.random() * 10000) % _deliveryList.length;
        var _deliveryInfo = _deliveryList[_randomIndex];

        if (!_deliveryInfo || !_deliveryInfo.shareContent || !_deliveryInfo.sharePicUrl || !_deliveryInfo.sharePointId || !_deliveryInfo.shareSchemeId) {
            return;
        }

        tywx.ShareInterface.setOnShareAppMessageInfo(_deliveryInfo.shareContent, _deliveryInfo.sharePicUrl, _deliveryInfo.sharePointId, _deliveryInfo.shareSchemeId);
    },
    onMagicBusy: function onMagicBusy(is_busy) {
        this.magicBusy = is_busy;
    },

    initGame: function initGame(gameNode, bmp, seed) {
        this.model.stage = 0;
        this.gameNode = gameNode;
        try {
            this.model.init(bmp, seed);
            //! 无尽模式限制复活次数
            if (this.model.mconf.isEndless && this.model.endless_level === 0) {
                this.currentReviveTimes = 0;
            }
        } catch (e) {
            console.log(e);
        }

        this.mrender = [];
        for (var i = 0; i < 2; i++) {
            this.mrender[i] = new ElsRender(i, this.model.mgrid[i], this.gameNode);
        }

        this.useract = [];
        if (this.model.mconf.mode == els.ELS_MODE_AI) {
            this.startTimerCountdown(els.ELS_TIMER_COUNT);
        } else if (this.model.mconf.mode == els.ELS_MODE_SINGLE) {
            var gameCtrl = this.gameNode.getComponent('main');
            if (gameCtrl.magicBottle) {
                //gameCtrl.magicBottle.reset();
            }
        }
        this.playActionBase(0, 'S');
        this.model.mgrid[0].mcore.save_lock = false;
        this.playActionBase(0, 'D');
        this.model.mgrid[0].updateColHoleTop(2, 11);
        this.isWaitingRevive = false;

        //重置关卡用于测试
        //this.delItem('ELS_HELP1ST');
        //this.delItem('ELS_PKCOUNT');
        //this.delItem('ELS_PKLOG');
        //this.delItem('ELS_PKLEVEL');
        //this.delItem('ELS_PKSTAR');
        //this.delItem('ELS_CURRENT_STAGE2');
        //this.saveItem('ELS_PKCOUNT', 0);
        //this.saveItem('ELS_PKLOG', '[]');
        //this.saveItem('ELS_PKLEVEL', 1);
        //this.saveItem('ELS_CURRENT_STAGE2', 174);
        //this.saveItem('ELS_PKSTAR', 20);
    },

    /**
     * 请求获取配置信息
     */
    requestConfigInfo: function requestConfigInfo() {

        this.requestTimes--;
        var _configUrl = tywx.SystemInfo.cdnPath + 'config/tetris.json';
        var that = this;

        var successcb = function successcb(ret) {
            that.requestTimes = 3;
            var v = tywx.SystemInfo.version;
            var uid = parseInt(tywx.UserInfo.userId);
            var c, cb, d;
            c = ret['' + v];
            cb = ret['' + v + '_ABTEST'];
            d = ret['default'];
            if (!d) {
                //没找到缺省服务器配置...
                console.log('No default server config, use local config...');
                d = els.CONFIG_LOCAL;
            }
            if (!c) {
                //没找到版本对应配置，使用缺省配置...
                els.CONFIG = d;
                console.log(_configUrl + 'use default config...');
            } else {
                //AB测试...
                if (cb) {
                    if (uid % 2 == 0) {
                        els.CONFIG = c;
                        console.log(_configUrl + 'use ' + v + '_A server config...');
                    } else {
                        els.CONFIG = cb;
                        console.log(_configUrl + 'use ' + v + '_B server config...');
                    }
                } else {
                    els.CONFIG = c;
                    console.log(_configUrl + 'use ' + v + ' server config...');
                }
                //把缺省配置中的配置项复制到当前配置...
                for (var k in d) {
                    if (els.CONFIG[k] === undefined) els.CONFIG[k] = d[k];
                }
            }
            console.log('CONFIG ' + JSON.stringify(ret));
            console.log(_configUrl + 'ret ======> ' + JSON.stringify(els.CONFIG));

            //TEST openEmergency FLAG...
            //els.CONFIG.openEmergency = false;
        };

        var failcb = function failcb(ret) {
            if (that.requestTimes > 0) {
                that.requestConfigInfo();
                console.log(_configUrl + 'retry...');
            } else {
                els.CONFIG = els.CONFIG_LOCAL;
                console.log(_configUrl + ' fail! use local ======> ' + JSON.stringify(els.CONFIG));
            }
        };
        tywx.HttpUtil.httpGet({ 'url': _configUrl }, successcb, failcb);
    },

    //现在自己调用 防治不停的调用
    scheduleUpdate_Manual: function scheduleUpdate_Manual(dt) {

        return;
        this.model.stage++;
        var self = this;

        var _gameCtrl = this.gameNode.getComponent('main');
        var _ui_list = [_gameCtrl.menu, _gameCtrl.share5line, _gameCtrl.lose, //保星失败
        _gameCtrl.win, //AI对战成功
        _gameCtrl.pause, _gameCtrl.searchai, _gameCtrl.help, _gameCtrl.rank, _gameCtrl.share5step, _gameCtrl.keepstar, //失败保护
        _gameCtrl.keepstarOK, //保星成功
        _gameCtrl.lose_single, //单机失败
        _gameCtrl.win_single, //单机成功
        _gameCtrl.backmask, //半透底板

        _gameCtrl.helpbg //帮助的背景z

        ];
        for (var i in _ui_list) {
            if (_ui_list[i]) {
                _ui_list[i].active = false;
                _ui_list[i].opacity = 0;
            }
        }

        var _status = this.model.getGameStatus();
        if (_status != els.ELS_GAME_STATE.RESULT_WIN) {
            _gameCtrl.yanhua.active = false;
        }
        switch (_status) {

            case els.ELS_GAME_STATE.SHOW_MASK:
                _ui_list[13].active = false;
                _ui_list[4].active = false;
                _gameCtrl.logo.opacity = 0;
                _gameCtrl.lbl_next.opacity = 255;
                _gameCtrl.lbl_hold.opacity = 255;
                break;
        }
    },

    //每秒FRAME_HZ(缺省60)次调用此方法 ,只更新游戏中，其他状态手动更新
    scheduleUpdate: function scheduleUpdate(dt) {

        //if(this.magicBusy) return;


        this.model.stage++;
        var _status = this.model.getGameStatus();
        var _gameCtrl = this.gameNode.getComponent('main');

        var _ui_list = [_gameCtrl.menu, //0
        _gameCtrl.share5line, //1
        _gameCtrl.lose, //保星失败      //2
        _gameCtrl.win, //AI对战成功    //3
        _gameCtrl.pause, //4
        _gameCtrl.searchai, //5
        _gameCtrl.help, //6
        _gameCtrl.rank, //7
        _gameCtrl.share5step, //8
        _gameCtrl.keepstar, //失败保护    //9
        _gameCtrl.keepstarOK, //保星成功    //10
        _gameCtrl.lose_single, //单机失败    //11
        _gameCtrl.win_single, //单机成功   //12
        _gameCtrl.backmask];

        switch (_status) {
            case els.ELS_GAME_STATE.PLAYING:

                this.updatePlayingView(dt);
                if (this.model.needhelp1st) {
                    //轮播help图片...
                    _gameCtrl.mask.opacity = 200;
                    if (this.model.stage % 150 == 0) {
                        if (_gameCtrl.maskidx == null) {
                            //检测值
                            _gameCtrl.maskidx = 0;
                        }
                        // 去掉轮播
                        /*
                        _gameCtrl.maskidx = ((_gameCtrl.maskidx + 1) % 5);
                        _gameCtrl.mask.getComponent("cc.Sprite").spriteFrame = _gameCtrl.blockimgs[20 + _gameCtrl.maskidx];
                        if (_gameCtrl.maskidx != 0)
                            this.model.playMusic(els.ELS_VOICE.HELP_MUSIC[_gameCtrl.maskidx - 1], false);
                        if (_gameCtrl.maskidx >= 4) {
                            this.model.needhelp1st = false;
                            this.saveItem('ELS_HELP1ST', 1);
                             this.model.displayAd();
                        }*/
                    }
                }

                if (this.model.emergency) {
                    var eb = null;
                    if (this.model.mconf.mode === els.ELS_MODE_AI) {
                        eb = _ui_list[1];
                    } else {
                        eb = _ui_list[8];
                    }
                    eb.active = true;
                    //eb.opacity = 205;
                    var t = this.model.stage % 6;
                    if (t === 0) this.model.ebdir = this.model.ebdir * -1;
                    //eb.rotation = 3 - this.model.ebdir * this.model.stage % 6;
                    _gameCtrl.animShare5Line.getComponent('shareGiftAnimationView').show();
                    _gameCtrl.animShare5Step.getComponent('shareGiftAnimationView').show();
                } else {
                    _ui_list[1].active = false;
                    _ui_list[8].active = false;
                    _gameCtrl.animShare5Line.getComponent('shareGiftAnimationView').hide();
                    _gameCtrl.animShare5Step.getComponent('shareGiftAnimationView').hide();
                }

                this.updateScoreTitle();

                if (!this.model.mconf.canRun) {
                    this.show_mask();
                    console.log("show_mask");
                }
                break;
            default:
                break;
        }
    },

    updatePlayingView: function updatePlayingView(dt) {
        var _this = this;

        if (!this.isShowingEndlessLevelEnd) // 无尽展示下一关的时候不渲染
            this.mrender[0].draw();
        if (this.model.mconf.mode !== els.ELS_MODE_SINGLE) this.mrender[1].draw();

        //this.model.mgrid[0].mcore.game_over = true;  //每局开始就胜利

        if (this.model.mconf.isreplay) {
            if (this.model.pause) return;
        } else {
            switch (this.model.mconf.mode) {
                case els.ELS_MODE_SINGLE:
                    if (this.model.pause) return;
                    var whisper_win = this.model.mconf.isWhisper && this.model.mgrid[0].mstat.clear_lines >= 1;
                    if (whisper_win) {
                        console.log("whisper single mode success!!!");
                        //粒子 烟花
                        var _gameCtrl = this.gameNode.getComponent('main');
                        var particleSystem = _gameCtrl.yanhua.getChildByName("particlesystem").getComponent(cc.ParticleSystem);
                        // _gameCtrl.yanhua.active = true;
                        if (particleSystem && this.model.begin_win_partical == -1) {
                            this.model.begin_win_partical = 0;
                            _gameCtrl.yanhua.active = true;
                            particleSystem.resetSystem();

                            var self = this;
                            setTimeout(function () {
                                _gameCtrl.yanhua.active = false;
                                self.updateLocQuery();
                                self.model.begin_win_partical = -1;
                                // self.model.playMusic(els.ELS_VOICE.WIN_MUSIC, false);
                                //self.model.currentStage += 1;
                                //self.updateStage(self.model.currentStage);
                                if (self.cipherIndex >= self.cipherData.length) {
                                    self.model.setGameStatus(els.ELS_GAME_STATE.RESULT_WIN); //此局胜利
                                    //self.scheduleUpdate_Manual();
                                    tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypePassAllQQHStage, [self.model.currentStage]);
                                } else {
                                    self.nextStage();
                                    tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypePassQQHStage, [self.model.currentStage]);
                                }
                            }, 1200);
                        }
                        return;
                    }
                    //TODO: 无尽模式===>小关卡结束
                    if (!this.isShowingEndlessLevelEnd && this.model.mconf.isEndless && this.model.mgrid[0].isEndlessLevelEnd() && this.model.getGameStatus() === els.ELS_GAME_STATE.PLAYING) {
                        console.log('game/updatePlayingView', 'endless mode success');
                        this.isShowingEndlessLevelEnd = true;
                        this.updateEndlessScore(this.model.mgrid[0].mstat.score);
                        var _self = this;
                        var cb = function cb() {
                            console.log('endless call next stage');
                            _self.model.endless_level++;
                            _this.saveItem('ELS_CURRENT_ENDLESS_LEVEL', _self.model.endless_level + '-' + _self.model.mgrid[0].mstat.score);
                            _self.showNextStageWhenEndless();
                        };
                        this.model.mgrid[0].clearnAllRows(cb, this.mrender[0]);
                        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_ON_SHOW_ENDLESS_LEVEL_UP, null);
                    }

                    var ltl = this.model.getWinLine();
                    if (!this.model.mconf.isEndless && this.model.mgrid[0].mcore.top_line <= ltl && this.model.getGameStatus() === els.ELS_GAME_STATE.PLAYING) {
                        console.log("single mode success!!!");
                        //粒子 烟花
                        var _gameCtrl = this.gameNode.getComponent('main');
                        var particleSystem = _gameCtrl.yanhua.getChildByName("particlesystem").getComponent(cc.ParticleSystem);
                        _gameCtrl.yanhua.active = true;
                        if (particleSystem && this.model.begin_win_partical == -1) {
                            this.model.begin_win_partical = 0;
                            _gameCtrl.yanhua.active = true;
                            particleSystem.resetSystem();

                            var self = this;
                            setTimeout(function () {
                                self.model.begin_win_partical = -1;
                                self.model.playMusic(els.ELS_VOICE.WIN_MUSIC, false);
                                self.model.currentStage += 1;
                                self.updateStage(self.model.currentStage);
                                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeEndSingleWin, [self.model.currentStage]);
                                self.model.setGameStatus(els.ELS_GAME_STATE.RESULT_WIN); //此局胜利

                                self.scheduleUpdate_Manual();
                            }, 1200);
                        }
                        return;
                    }
                    var mstep = this.model.getWinStep();
                    if (!this.isWaitingRevive) {
                        if (this.model.mgrid[0].mcore.block_index >= mstep + this.model.add_step) {
                            if (this.model.mgrid[0].mcore.fullrows.length == 0) {
                                this.model.playMusic(els.ELS_VOICE.LOSE_MUSIC, false);
                                //this.model.setGameStatus(els.ELS_GAME_STATE.RESULT_LOSE);   //此局失败
                                this.model.setGameStatus(els.ELS_GAME_STATE.SHOW_REVIVE); //展示复活
                                this.isWaitingRevive = true; // 设置等待复活
                                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeEndSingleLose, [this.model.currentStage, this.model.add_step]);
                                this.scheduleUpdate_Manual();
                                return;
                            }
                        }
                        if (this.model.mgrid[0].mcore.game_over) {
                            this.model.playMusic(els.ELS_VOICE.LOSE_MUSIC, false);
                            this.model.setGameStatus(els.ELS_GAME_STATE.SHOW_REVIVE); //展示复活
                            this.isWaitingRevive = true; // 设置等待复活
                            //this.model.setGameStatus(els.ELS_GAME_STATE.RESULT_LOSE);   //此局失败
                            // this.scheduleUpdate_Manual();
                            return;
                        };
                    }
                    this.playAutoDownAction(dt);
                    this.playUserAction(dt);
                    break;

                case els.ELS_MODE_AI:
                    if (this.model.pause) return;
                    if (this.model.mgrid[0].mcore.game_over) {
                        this.model.playMusic(els.ELS_VOICE.LOSE_MUSIC, false);
                        if (els.CONFIG.openEmergency) this.model.setGameStatus(els.ELS_GAME_STATE.KEEPSTAR); //此局失败    
                        else {
                                this.updatePKStar(-1);
                                this.model.setGameStatus(els.ELS_GAME_STATE.RESULT_LOSE);
                                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeEndVSLoseNE, [this.model.pkstar, this.model.pklevel, this.model.ailevel]);
                            }
                        //this.updatePKLevel();

                        // this.scheduleUpdate_Manual();
                        return;
                    };
                    if (this.model.mgrid[1].mcore.game_over) {
                        //粒子 烟花
                        var _gameCtrl = this.gameNode.getComponent('main');
                        var particleSystem = _gameCtrl.yanhua.getChildByName("particlesystem").getComponent(cc.ParticleSystem);
                        _gameCtrl.yanhua.active = true;
                        if (particleSystem && this.model.begin_win_partical == -1) {
                            particleSystem.resetSystem();
                            this.model.begin_win_partical = 0;

                            var self = this;
                            setTimeout(function () {
                                self.model.begin_win_partical = -1;
                                self.model.playMusic(els.ELS_VOICE.WIN_MUSIC, false);
                                var ostar = self.model.pkstar;
                                var opkl = self.model.pklevel;
                                self.updatePKLevel();
                                self.updatePKStar(1);
                                self.model.setGameStatus(els.ELS_GAME_STATE.RESULT_WIN); //此局胜利
                                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeEndVSWin, [ostar, opkl, self.model.pkstar, self.model.pklevel, self.model.ailevel]);
                                self.scheduleUpdate_Manual();
                            }, 1200);
                        }
                        // this.model.setGameStatus(els.ELS_GAME_STATE.RESULT_WIN);   //此局胜利

                        return;
                    };
                    this.playAutoDownAction(dt);
                    this.playUserAction(dt);
                    this.playAIAction(dt);
                    break;
            }
        }
        //倒计时不累计所用的时间 
        //if(!mstate->countDown) mTimeUsed+=dt;
        for (var i = 0; i < 2; i++) {
            this.updateELS(i, dt);
        }this.checkEmergency();
    },

    //自然下落...
    playAutoDownAction: function playAutoDownAction(dt) {
        //倒计时还没有结束 
        //if(mstate->countDown) return;
        //自然下落...
        var tdtime, tlevel;
        if (this.model.mconf.mode == els.ELS_MODE_AI) tlevel = 0;else tlevel = this.model.mgrid[0].mstat.level;
        //tdtime = els.DOWN_TIME[tlevel] * 1000;
        tdtime = els.DOWN_TIME[0] * 1000;
        if (this.timeoauto > tdtime) {
            this.timeoauto = 0;
            //如果正在直落，不进行以下处理
            if (this.model.mgrid[0].mtimer.getstat("fall")) return;
            this.playActionBase(0, 'D');
        } else {
            this.timeoauto += dt;
        }
    },

    //AI动作
    playAIAction: function playAIAction(dt) {
        //if (mstate->countDown) return;
        //if(this.timeoai>AI_SPEED[this.model.mgrid[1].mstat.level]) {

        //把计算任务分到多帧...
        if (this.model.mai.work2idx >= 0) this.model.mai.getAIAct(this.model.mgrid[1]);

        //var ais = els.AI_SPEED[this.model.currentStage] || els.AI_SPEED[els.AI_SPEED.length - 1];
        var ais = els.AI_SPEED[this.model.ailevel];
        //ais = 80; //test...
        if (this.timeoai > ais) {
            var aiact = this.model.mai.getAIAct(this.model.mgrid[1]);
            this.playActionBase(1, aiact);
            // if(aiact=='W')
            //     console.log("play ai action.....");
            this.timeoai = 0;
        } else {
            this.timeoai += dt;
        }
    },

    //用户键盘输入
    playUserAction: function playUserAction(dt) {
        for (var i = 0; i < this.useract.length; i++) {
            if (!this.model.mconf.isreplay) this.playActionBase(0, this.useract[i]);
        }this.useract = [];
    },

    //检测攻击
    updateELS: function updateELS(id, dt) {
        //if (mCountDown>0) return;
        var pcore = this.model.mgrid[id].mcore;
        if (pcore.game_over) return;
        //检测执行攻击
        if (pcore.attack[0]) {
            for (var m = 0; m < 2; m++) {
                if (m != id && !pcore.game_over) {
                    console.log("ATTACK!!!!!!!" + pcore.attack[0]);
                    this.model.mgrid[id].attack(this.model.mgrid[m], pcore.attack[0], pcore.attack[1]);
                    this.model.mgrid[m].testDDown();
                    this.model.mgrid[id].mtimer.trigger("attack", pcore.attack[0]);
                }
            }
            pcore.attack[0] = 0;
        }
        //更新内部定时器等操作
        this.model.mgrid[id].update(dt);
    },

    //检测是否开始紧急救助模式
    checkEmergency: function checkEmergency() {
        if (!els.CONFIG.openEmergency) return;
        if (this.model.getGameStatus() != els.ELS_GAME_STATE.PLAYING) return;
        if (this.model.mconf.mode == els.ELS_MODE_AI) {
            var gtop = this.model.mgrid[0].mcore.top_line;
            if (gtop >= 15) {
                this.model.emergency = true;
                return;
            }
        }
        if (this.model.mconf.mode == els.ELS_MODE_SINGLE) {
            var mstep = this.model.getWinStep();
            if (this.model.mgrid[0].mcore.block_index >= mstep + this.model.add_step - 4) {
                this.model.emergency = true;
                return;
            }
        }
        this.model.emergency = false;
    },

    updateScoreTitle: function updateScoreTitle() {
        var _status = this.model.getGameStatus();
        var lbl_antiscore = this.gameNode.getComponent('main').lbl_antiscore;
        var lbl_progress = this.gameNode.getComponent('main').lbl_progress;
        var lbl_title = this.gameNode.getComponent('main').lbl_title;
        var lbl_myscore = this.gameNode.getComponent('main').lbl_myscore;
        var lbl_endless_score = this.gameNode.getComponent('main').lbl_endless_score;

        if (_status == els.ELS_GAME_STATE.HOMEPAGE || _status == els.ELS_GAME_STATE.HELP || _status == els.ELS_GAME_STATE.RANK) {
            lbl_antiscore.active = false;
            lbl_progress.active = false;
            lbl_title.active = false;
            lbl_myscore.active = false;
        } else {
            if (this.model.mconf.mode == els.ELS_MODE_AI) {
                lbl_antiscore.active = true;
                lbl_progress.active = true;
                lbl_title.active = true;
                lbl_myscore.active = true;
                var _stage = this.model.ailevel + '';
                var _aiti_score = this.model.mgrid[1].mstat.score;
                var _my_score = this.model.mgrid[0].mstat.score;
                lbl_antiscore.getComponent(cc.Label).string = Math.floor(_aiti_score / 10000) + '攻' + _aiti_score % 10000 + '分';
                lbl_title.getComponent(cc.Label).string = els.ELS_PLAYER_TITLE2[this.model.pkstar_level][1];
                lbl_myscore.getComponent(cc.Label).string = Math.floor(_my_score / 10000) + '攻' + _my_score % 10000 + '分';
            } else {
                lbl_title.active = true;
                lbl_myscore.active = true;
                lbl_progress.active = false;
                lbl_antiscore.active = false;
                if (this.model.mconf.isEndless) lbl_title.getComponent(cc.Label).string = parseInt(this.model.endless_level) + '级';else lbl_title.getComponent(cc.Label).string = parseInt(this.model.currentStage) + 1 + '关';
                lbl_myscore.getComponent(cc.Label).string = this.model.mgrid[0].mstat.score + '分';

                lbl_myscore.active = !this.model.mconf.isEndless;
                lbl_endless_score.active = this.model.mconf.isEndless;
                lbl_endless_score.getComponent(cc.Label).string = this.model.mgrid[0].mstat.score;
                //console.log('game/lbl_endless_score',`score${this.model.mgrid[0].mstat.score}`);
            }
        }
        if (_status != els.ELS_GAME_STATE.PLAYING) {
            this.stopTimerCountdown();
            this.gameNode.getComponent('main').timestep.active = false;
            this.gameNode.getComponent('main').lbl_time.active = false;
        } else {
            this.gameNode.getComponent('main').timestep.active = true;
            if (this.model.mconf.mode == els.ELS_MODE_AI) {
                this.gameNode.getComponent('main').lbl_time.active = true;
                this.gameNode.getComponent('main').lbl_time.getComponent(cc.Label).string = this._time;
            }
            if (this.model.mconf.mode == els.ELS_MODE_SINGLE) {
                this.gameNode.getComponent('main').lbl_time.active = true;
                var mstep = this.model.getWinStep();
                var stepstr = '';
                if (mstep >= 100000) stepstr = '∞';else stepstr = mstep + this.model.add_step - this.model.mgrid[0].mcore.block_index + '';
                this.gameNode.getComponent('main').lbl_time.getComponent(cc.Label).string = stepstr;
            }
        }
    },

    _freshCountDown: function _freshCountDown(obj) {
        var that = obj;
        that._time--;
        //倒计时快结束时的提醒动画
        if (this._time == 3) {
            that.gameNode.getComponent('main').lbl_time.runAction(cc.blink(3, 12));
        }
        if (that._time <= 0) {
            that._time = 0;
            that.stopTimerCountdown();
            if (that.model.mconf.mode === els.ELS_MODE_AI) {
                if (that.model.mgrid[0].mstat.score > that.model.mgrid[1].mstat.score) {
                    that.model.mgrid[1].mcore.game_over = true;
                } else if (that.model.mgrid[0].mstat.score < that.model.mgrid[1].mstat.score) {
                    that.model.mgrid[0].mcore.game_over = true;
                } else {
                    that.model.mgrid[1].mcore.game_over = true;
                }
            }
        }
    },

    stopTimerCountdown: function stopTimerCountdown() {
        this.gameNode.getComponent('main').lbl_time.stopAllActions();
        this.countTimerObj && clearInterval(this.countTimerObj);
        this.countTimerObj = null;
    },

    //AI 模式下开启倒计时
    startTimerCountdown: function startTimerCountdown(_time) {
        var that = this;
        this._time = _time;
        if (this.countTimerObj != null) clearInterval(this.countTimerObj);
        this.countTimerObj = setInterval(function () {
            that._freshCountDown(that);
        }, 1000);
    },

    delItem: function delItem(key) {
        cc.sys.localStorage.removeItem(key);
        if (!tywx.isInWXChat) return;
        wx.removeUserCloudStorage({
            keyList: [key],
            success: function success(msg) {
                console.log('removeObjectCloud  ' + key + ' succeeds', msg);
            },
            fail: function fail(msg) {
                console.log('removeObjectCloud  ' + key + ' fails', msg);
            }
        });
    },

    saveItem: function saveItem(key, value, only_local) {
        value = value + '';
        cc.sys.localStorage.setItem(key, value);
        if (!tywx.isInWXChat) return;
        if (!only_local) {
            //FIXED: 做版本检测，版本低的会有黑屏
            if (wx.setUserCloudStorage) {
                wx.setUserCloudStorage({
                    KVDataList: [{ key: key, value: value }],
                    success: function success(msg) {
                        console.log('saveObjectToCloud  ' + key + ' succeeds', msg);
                    },
                    fail: function fail(msg) {
                        console.log('saveObjectToCloud  ' + key + ' fails', msg);
                    }
                });
            }
        }
    },

    loadItem: function loadItem(key, default_value) {
        var v = cc.sys.localStorage.getItem(key);
        // console.log(key, 'v'+v);
        if (!v) {
            cc.sys.localStorage.setItem(key, default_value);
            return default_value;
        }
        return v;
    },

    //闯关休闲模式过关时调用...
    updateStage: function updateStage(stage) {
        var ls = parseInt(this.loadItem('ELS_CURRENT_STAGE2', stage));
        if (stage > ls) this.saveItem('ELS_CURRENT_STAGE2', stage);
    },
    updateEndlessScore: function updateEndlessScore(score) {
        var ls = parseInt(this.loadItem('ELS_CURRENT_STAGE_ENDLESS', score));
        if (score > ls) this.saveItem('ELS_CURRENT_STAGE_ENDLESS', score);
    },

    updatePKStar: function updatePKStar(val) {
        var ps = this.model.pkstar;
        ps = Math.max(0, ps + val);
        this.saveItem('ELS_PKSTAR', ps);
        this.model.pkstar = ps;
        //TODO: 根据PKSTAR更新this.model.pkstar_level
        //参考 els.ELS_PLAYER_TITLE2
        console.log("fengbing", " -----------  update pk star ---------  " + ps);
        var level_state = this._getPKStarLevel(ps);
        this.model.pkstar_level = level_state[0];
        this.model.pkstar_level_get = level_state[1];

        console.log("fengbing", " update pkstar_level:  " + this.model.pkstar_level + "   this.model.pkstar_level_get: " + this.model.pkstar_level_get);
    },

    /**
     * 通过星星获取当前ELS_PLAYER_TITLE2级别
     * @param star
     * @private
     */
    _getPKStarLevel: function _getPKStarLevel(star) {
        if (!star) return [0, 0];
        var len = els.ELS_PLAYER_TITLE2.length;
        var startotal = 0,
            star_level = 0,
            cur_star = 0;
        for (var i = 0; i < len; i++) {
            var starnum = els.ELS_PLAYER_TITLE2[i][0];
            startotal += starnum;
            if (startotal >= star) {
                star_level = i;
                break;
            }
        }
        cur_star = els.ELS_PLAYER_TITLE2[star_level][0] - (startotal - star);
        return [star_level, cur_star];
    },

    /**
     * 获取当前star_level的名称
     * @param star
     * @returns {*}
     * @private
     */
    _getPKStarLevelName: function _getPKStarLevelName(star) {
        var level = this._getPKStarLevel(star)[0];
        return els.ELS_PLAYER_TITLE2[level][1];
    },

    //对战模式一局结束，不管胜利失败都要调用...
    //PL = PL + k*(P - E)
    updatePKLevel: function updatePKLevel() {
        var g0 = this.model.mgrid[0];
        var g1 = this.model.mgrid[1];

        if (g0.isUserGiveup()) {
            console.log("GIVEUP?..." + g0.isUserGiveup());
            return;
        }
        //update pkcount...
        var pkcount = parseInt(this.loadItem('ELS_PKCOUNT', 0)) + 1;
        this.saveItem('ELS_PKCOUNT', pkcount);

        //update pklevel
        //performance = score diff
        var performance = Math.abs(g0.mstat.score - g1.mstat.score) / 10000.0;
        var pl = this.model.pklevel;
        var al = this.model.ailevel;
        //expect = level diff
        var expect = pl - al;
        var k = els.LEVEL_K[parseInt(pl)];
        pl = pl + k * (performance - expect);
        if (pkcount <= 5 && performance < 1.0) {
            console.log("pkcount..." + pkcount + ' pl...' + pl);
            pl += 2;
        }
        if (pl < 0) pl = 0;if (pl > 18) pl = 18;

        console.log("PK...pklevel=" + this.model.pklevel + " ailevel=" + al + " performance=" + performance + " expect=" + expect + " k=" + k + " newpl=" + pl);

        this.model.pklevel = pl;
        this.saveItem('ELS_PKLEVEL', this.model.pklevel);

        //保存近十局的对战记录
        //var pklog = this.loadItem('ELS_PKLOG', '[]');
        //pklog = JSON.parse(pklog);
        //if(pklog.length==10) pklog.shift();
        //pklog[pklog.length] = {me:this.model.pklevel, ai:this.model.ailevel, p:performance};
        //this.saveItem('ELS_PKLOG', JSON.stringify(pklog));
    },

    //旋转动作的辅助函数
    _testTurn: function _testTurn(pg, dir, testcmd) {
        var tcore = pg.mcore.clone();
        var mret;

        for (var i = 0; i < testcmd.length; i++) {
            if (testcmd[i] === 'L') pg.moveBlk(els.LEFT, false);
            if (testcmd[i] === 'R') pg.moveBlk(els.RIGHT, false);
        }
        mret = pg.moveBlk(dir, false);
        if (mret === els.NORMAL) {
            pg.testDDown();
            return true;
        } else {
            pg.mcore.recycle();
            pg.mcore = tcore.clone();
            tcore.recycle();
        }
        return false;
    },

    //执行动作码的基础方法
    playActionBase: function playActionBase(index, act) {
        var dir;
        var pg = this.model.mgrid[index];

        if (pg.mtimer.getstat("fall")) pg.mtimer.cancel("fall");
        switch (act) {
            case 'T':
            case 'U':
                if (0 === index) this.model.playMusic(els.ELS_VOICE.TURN_MUSIC, false);
                //顺时针旋转。到边时，如果旋转遇到碰撞，就尝试自动左右移动，看看能否不碰撞了
                dir = act === 'T' ? els.TURN_CW : els.TURN_CCW;
                //this.mrep.recordAction(index, act);
                if (pg.moveBlk(dir, false) === els.NORMAL) {
                    pg.testDDown();
                    break;
                } else {
                    //开始尝试左右移动再转...
                    if (this._testTurn(pg, dir, "L")) break;
                    if (this._testTurn(pg, dir, "LL")) break;
                    if (this._testTurn(pg, dir, "R")) break;
                    if (this._testTurn(pg, dir, "RR")) break;
                }
                break;
            case 'W':
                //this.mrep.recordAction(index, act);
                if (0 === index) this.model.playMusic(els.ELS_VOICE.DROP_MUSIC, false);
                pg.mtimer.trigger("fall", 0.12);
                break;
            case 'D':
                //this.mrep.recordAction(index, act);
                if (0 === index) this.model.playMusic(els.ELS_VOICE.MOVE_MUSIC, false);
                if (pg.moveBlk(els.DOWN, false) === els.REACH_BOTTOM) pg.nextBlk(false);
                pg.testDDown();
                break;
            case 'L':
                if (0 === index) this.model.playMusic(els.ELS_VOICE.MOVE_MUSIC, false);
                pg.moveBlk(els.LEFT, false);
                pg.testDDown();
                //this.mrep.recordAction(index, act);
                break;
            case 'R':
                if (0 === index) this.model.playMusic(els.ELS_VOICE.MOVE_MUSIC, false);
                pg.moveBlk(els.RIGHT, false);
                pg.testDDown();
                //this.mrep.recordAction(index, act);
                break;
            case 'S':
                //this.mrep.recordAction(index, act);
                pg.saveBlk(false);
                pg.testDDown();
                break;
            case 'N':
                //this.mrep.recordAction(index, act);
                break;
        }
    },
    /**
     * @param index 指定玩家grid,现在只对玩家有效，所以传入0就好了
     */
    sinkAllCol: function sinkAllCol(index) {
        var pg = this.model.mgrid[index];
        pg.sinkAllCol();
    },
    /**
     * @param index 指定玩家到grid,现在只对玩家有效，所以传入0就好了
     * @param fill_num 填充的数量
     */
    fillRandomBlock: function fillRandomBlock(index, fill_num) {
        var pg = this.model.mgrid[index];
        return pg.randomFillGrid(fill_num);
    },
    fillGridByIndex: function fillGridByIndex(index, grid_idx) {
        var pg = this.model.mgrid[index];
        pg.fillGridByIndex(grid_idx);
        pg.needdraw = true;
    },
    /**
     * 
     * @param {int} index 
     */
    clearnRow: function clearnRow(index) {
        var pg = this.model.mgrid[index];
        pg.checkClearnRow(false);
    },
    /**
     * 使用魔法棒
     */
    usePopMagicWand: function usePopMagicWand(index) {
        var pg = this.model.mgrid[index];
        pg.clearnTopGirdByCount();
    },

    /**
     * 使用冰弹 封'5'步 不涨行 可累计
     * @param {[type]} step [description]
     */
    setFreezeStep: function setFreezeStep() {
        var pg = this.model.mgrid[0];
        pg.setFreezeStep(5);
    },

    updateBlock: function updateBlock() {
        //生成精灵

        var _main = this.gameNode.getComponent('main');

        // var setBlkColor = function(c, op, idx, scale, r) {
        //     var cmap = [0, 9, 1, 2, 3, 4, 5, 6, 7, 8, 0, 0];
        //     c.opacity = op;
        //     c.rotation = 0 || r;
        //     if (scale) c.scale = c.scale * scale;
        //     c.getComponent('cc.Sprite').spriteFrame = _main.blockimgs[cmap[idx]];
        // };

        for (var n = 0; n < 2; n++) {
            for (var i = 0, il = els.ZONG; i < il; i++) {
                for (var j = 0, jl = els.HENG; j < jl; j++) {
                    var c = _main.blocks[n][i][j];
                    var scale = n == 0 ? 6.6 / els.HENG : 2.4 / els.HENG;
                    var bsize = 72 * scale + 2;
                    c.scale = scale;
                    _main.setBlkColor(c, 0, 8);
                    if (n === 0) {
                        c.position = cc.v2(216 + (j + 0.5) * bsize, 215 + (i + 0.5) * bsize); //重置时候的方块位置
                        c.rawpos = c.position;
                    }
                    if (n === 1) {
                        c.position = cc.v2(14 + (j + 0.5) * bsize, 796 + (i + 0.5) * bsize);
                        c.rawpos = c.position;
                    }
                }
            }
        }

        if (els.HENG === 10) {
            for (var _n = 0; _n < 2; _n++) {
                for (var _i = 0; _i < els.ZONG; _i++) {
                    var _c = _main.blocks[_n][_i][10];
                    _main.setBlkColor(_c, 0, 0);
                }
            }
        }
    },

    _backToHomePage: function _backToHomePage() {
        this.model.mconf.isWhisper = false;
        this.model.mconf.isEndless = false;
        els.HENG = 10;
        var _game = tywx.UIManager.getUI(els.ELS_GAME_LAYER.GAME_SINGLE).node.getComponent("gameSinglemode");
        _game.node.getChildByName("win_tips").active = false;
        this.updateBlock();
        this.model.setGameStatus(els.ELS_GAME_STATE.HOMEPAGE);
        this.initGame(this.gameNode, 0, parseInt(Math.random() * 10000));
        this.model.playMusic(els.ELS_VOICE.BG_MUSIC, true, 0.4);
        tywx.UIManager.hideAllUI();
        tywx.UIManager.showUI(els.ELS_GAME_LAYER.HOMEPAGE);
        this.gameNode.getComponent('main').hidenBeyondNode();
    },

    matchAiLevel: function matchAiLevel() {
        this.model.pklevel = parseInt(this.loadItem('ELS_PKLEVEL', 0));
        if (isNaN(this.model.pklevel)) {
            console.log("PKLEVEL NaN....");
            this.model.pklevel = 6 + Math.random() * 6;
            this.saveItem('ELS_PKLEVEL', this.model.pklevel);
        }
        var ps = this.model.pkstar;
        var pl = this.model.pklevel;
        var al = 0;
        if (ps < 50) {
            var rd = Math.random();
            if (rd <= 0.88) al = pl - 2.8 - Math.random();else al = pl + 0.5 + Math.random();
        } else {
            al = pl - Math.random() * 3 + 1.5;
        }
        al = parseInt(al.toFixed(0));
        console.log("AL..." + al);
        if (al < 0) al = 0;
        if (al > 18) al = 18;
        this.model.ailevel = al;
    },

    //对战按钮
    fightAI_fun: function fightAI_fun() {
        els.HENG = 10;
        this.updateBlock();

        this.matchAiLevel();
        this.initGame(this.gameNode, -1, parseInt(Math.random() * 10000));
        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeStartVSHome, [this.model.pkstar, this.model.pklevel, this.model.ailevel]);
        this.model.mconf.mode = els.ELS_MODE_AI;
        this.model.allowDoPopAction = true;
        this.model.playMusic(els.ELS_VOICE.READYGO_MUSIC, false);
        //this.model.playMusic(els.ELS_VOICE.BG_MUSIC2, true, 0.4);
        this.model.playRandomBgMusic();
        this.model.setGameStatus(els.ELS_GAME_STATE.SEARCH_AI);
        tywx.StarControl.clearNodes();
        this.gameNode.getComponent('main').showBeyondNode("ELS_PKSTAR");
    },

    // 密语
    btn_secret_language: function btn_secret_language(cipherData, curIndex, randomKey) {
        console.log('btn_secret_language');
        this.cipherData = cipherData;
        this.cipherIndex = curIndex;
        this.randomKey = randomKey;
        els.HENG = 11;
        this.updateBlock();

        this.model.currentStage = parseInt(this.loadItem('ELS_CURRENT_STAGE2', 0));
        this.model.mconf.mode = els.ELS_MODE_SINGLE;
        this.initGame(this.gameNode, this.model.currentStage, parseInt(Math.random() * 10000));
        this.model.mconf.canRun = false;
        this.model.mconf.isWhisper = true;
        this.model.setGameStatus(els.ELS_GAME_STATE.PLAYING);
        this.model.allowDoPopAction = true;
        this.model.playMusic(els.ELS_VOICE.READYGO_MUSIC, false);
        //this.model.playMusic(els.ELS_VOICE.BG_MUSIC2, true, 0.4);
        this.model.playRandomBgMusic();
        tywx.StarControl.clearNodes();
        this.model.mgrid[0].setBmp(this.cipherData[this.cipherIndex]);

        tywx.UIManager.hideAllUI();
        tywx.UIManager.showUI(els.ELS_GAME_LAYER.GAME_SINGLE);

        var _game = tywx.UIManager.getUI(els.ELS_GAME_LAYER.GAME_SINGLE).node.getComponent("gameSinglemode");
        _game.node.getChildByName("win_tips").active = true;
        for (var i = 0; i < _game.masks.length; i++) {
            if (i >= curIndex && i < cipherData.length) {
                _game.masks[i].active = true;
            } else {
                _game.masks[i].active = false;
            }
        }
        _game.showWisperStart(this.cipherIndex);

        var gleNode = tywx.UIManager.getUI(els.ELS_GAME_LAYER.GAME_SINGLE);
        gleNode.node.getChildByName('sl_bg').active = true;
        this.gameNode.getComponent('main').hidenBeyondNode();
    },

    //初始化无尽模式
    setEndless: function setEndless() {
        this.model.mconf.isEndless = true;
        this.model.endless_line = 0;
        var tmp = this.loadItem('ELS_CURRENT_ENDLESS_LEVEL', '1-0');
        tmp = tmp.split('-');
        this.model.endless_level = parseInt(tmp[0]);
        this.model.endless_score_save = parseInt(tmp[1]);
        this.model.endless_clear = false;
        this.model.currentStage = 0;
    },

    //开始经典模式
    startClassicGame: function startClassicGame() {
        els.HENG = 10;
        this.updateBlock();
        this.model.currentStage = parseInt(this.loadItem('ELS_CURRENT_STAGE2', 0));
        this.model.mconf.mode = els.ELS_MODE_SINGLE;
        //this.setEndless(); //测试无尽模式
        this.initGame(this.gameNode, this.model.currentStage, parseInt(Math.random() * 10000));
        this.model.setGameStatus(els.ELS_GAME_STATE.PLAYING);
        this.model.allowDoPopAction = true;
        this.model.playMusic(els.ELS_VOICE.READYGO_MUSIC, false);
        //this.model.playMusic(els.ELS_VOICE.BG_MUSIC2, true, 0.4);
        this.model.playRandomBgMusic();
        tywx.StarControl.clearNodes();
        this.gameNode.getComponent('main').showBeyondNode("ELS_CURRENT_STAGE2");
    },
    // 开始无尽模式
    startEndlessGame: function startEndlessGame() {
        els.HENG = 10;
        this.updateBlock();
        this.model.currentStage = parseInt(this.loadItem('ELS_CURRENT_STAGE_ENDLESS', 0));
        this.model.mconf.mode = els.ELS_MODE_SINGLE;
        this.setEndless(); //设置为无尽模式
        this.initGame(this.gameNode, this.model.currentStage, parseInt(Math.random() * 10000));
        this.model.mgrid[0].mstat.score = this.model.endless_score_save;
        this.model.setGameStatus(els.ELS_GAME_STATE.PLAYING);
        this.model.allowDoPopAction = true;
        this.model.playMusic(els.ELS_VOICE.READYGO_MUSIC, false);
        //this.model.playMusic(els.ELS_VOICE.BG_MUSIC2, true, 0.4);
        this.model.playRandomBgMusic();
        tywx.StarControl.clearNodes();
        this.gameNode.getComponent('main').showBeyondNode("ELS_CURRENT_STAGE_ENDLESS");
    },

    //返回主页  失败
    loseBackToHome: function loseBackToHome() {
        var _gameCtrl = this.gameNode.getComponent('main');
        _gameCtrl.yanhua.active = false;
        this.model.allowDoPopAction = true;
        this.stopTimerCountdown();
        this._backToHomePage();
        tywx.StarControl.clearNodes();
        this.scheduleUpdate_Manual();
    },

    //重新挑战 失败
    reStartGame: function reStartGame() {
        if (this.model.mconf.mode === els.ELS_MODE_AI) {
            this.matchAiLevel();
            this.model.setGameStatus(els.ELS_GAME_STATE.SEARCH_AI);
            tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeStartVSRestart, [this.model.pkstar, this.model.pklevel, this.model.ailevel]);
            this.initGame(this.gameNode, -1, parseInt(Math.random() * 10000));
        } else {
            if (this.model.mconf.isEndless) this.setEndless();
            this.initGame(this.gameNode, this.model.currentStage, parseInt(Math.random() * 10000));
            this.model.setGameStatus(els.ELS_GAME_STATE.PLAYING);
            if (this.model.mconf.isWhisper) {
                this.model.mgrid[0].setBmp(this.cipherData[this.cipherIndex]);
                console.log("btn_reStart_fun cipherData");
            }
        }
        this.model.allowDoPopAction = true;
        this.scheduleUpdate_Manual();
    },

    updateLocQuery: function updateLocQuery() {
        this.cipherIndex = this.cipherIndex + 1;
        var _query_key = "SECRETLANGUAGEDATA";
        var querys = JSON.parse(this.loadItem(_query_key, ''));
        var inLoc = false;
        var new_querys = []; //new Array();
        for (var i = 0; i < querys.length; i++) {
            var _tq = querys[i];
            if (_tq["randomKey"] === this.randomKey) {
                _tq["curIndex"] = this.cipherIndex;
            }
            new_querys.push(_tq);
        }
        this.saveItem(_query_key, JSON.stringify(new_querys), true);
    },

    //下一关 成功
    nextStage: function nextStage() {
        var _type = undefined;
        if (this.model.mconf.mode === els.ELS_MODE_AI) {
            _type = "ELS_PKSTAR";
            this.matchAiLevel();
            this.model.setGameStatus(els.ELS_GAME_STATE.SEARCH_AI);
            tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeStartVSNext, [this.model.pkstar, this.model.pklevel, this.model.ailevel]);
            this.initGame(this.gameNode, -1, parseInt(Math.random() * 10000));
        } else {
            if (this.model.mconf.isWhisper) {
                if (this.cipherIndex >= this.cipherData.length) {
                    return;
                }
            } else if (this.model.mconf.isEndless) {
                // @ENDLESS 
                _type = 'ELS_CURRENT_STAGE_ENDLESS';
            } else {
                _type = "ELS_CURRENT_STAGE2";
            }
            this.initGame(this.gameNode, this.model.currentStage, parseInt(Math.random() * 10000));
            this.model.setGameStatus(els.ELS_GAME_STATE.PLAYING);
            if (this.model.mconf.isWhisper) {
                this.model.mgrid[0].setBmp(this.cipherData[this.cipherIndex]);
                this.show_mask();
                var _game = tywx.UIManager.getUI(els.ELS_GAME_LAYER.GAME_SINGLE).node.getComponent("gameSinglemode");
                _game.showWisperStart(this.cipherIndex);
            } else if (this.model.mconf.isEndless) {
                // @ENDLESS 设置关卡
                this.isShowingEndlessLevelEnd = false;
                this.add_step = 0;
                this.model.mgrid[0].setBmp(els.ELSBMP(this.model.endless_level + 2));
            }
        }
        this.gameNode.getComponent('main').showBeyondNode(_type);
        //去掉烟花效果
        var _gameCtrl = this.gameNode.getComponent('main');
        var particleSystem = _gameCtrl.yanhua.getChildByName("particlesystem").getComponent(cc.ParticleSystem);
        _gameCtrl.yanhua.active = false;
        tywx.StarControl.clearNodes();
        this.model.allowDoPopAction = true;
        this.scheduleUpdate_Manual();
    },
    /**
     * @ENDLESS
     * * 无尽模式开始下一关
     * 
     */
    showNextStageWhenEndless: function showNextStageWhenEndless() {
        var _this2 = this;

        if (this.model.mconf.isEndless && this.isShowingEndlessLevelEnd) {
            (function () {
                // @ENDLESS 设置关卡
                var main = _this2.gameNode.getComponent('main');
                _this2.add_step = 0;
                main.shadow.active = false; //! 需要在setBmp之前，不然，宝石动画会提前显示
                _this2.model.mgrid[0].setBmp(els.ELSBMP(_this2.model.endless_level + 2));
                _this2.mrender[0].draw(); // 立即绘制
                //this.pauseGame();
                var num = 0;
                for (var i = 0; i < els.ZONG; i++) {
                    for (var j = 0; j < els.HENG; j++) {
                        var tmp_grid_idx = i * els.GRIDW + 2 + j;
                        var blk_idx = els.ZONG - i - 1;
                        if (_this2.model.mgrid[0].mcore.grid[tmp_grid_idx] > 100) {
                            (function () {
                                num++;
                                var c = main.blocks[0][blk_idx][j];
                                main.setBlkColor(c, 0, _this2.model.mgrid[0].mcore.grid[tmp_grid_idx] % 100, 1, 0);
                                var offset_y = (els.ZONG + 3) * 72 + Math.floor(Math.random() * 10) * 72;
                                var t = offset_y / 900;
                                var self = _this2;
                                c.runAction(cc.sequence(cc.moveBy(0, cc.p(0, offset_y)), cc.callFunc(function () {
                                    c.opacity = 180;
                                }), cc.moveBy(t, cc.p(0, -offset_y)).easing(cc.easeIn(2.5)), cc.callFunc(function () {
                                    num--;
                                    if (num === 0) {
                                        self.isShowingEndlessLevelEnd = false;
                                        main.shadow.active = true;
                                        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_ENDLESS_SHOW_LEVEL_END, null);
                                        self.model.mgrid[0].updateColHoleTop(2, 11);
                                    }
                                })));
                            })();
                        }
                    }
                }
                console.log('showNextStageWhenEndless', num);
            })();
        }
    },

    // 展示蒙版
    show_mask: function show_mask() {
        if (this.model.getGameStatus() == els.ELS_GAME_STATE.PLAYING) {
            this.model.setGameStatus(els.ELS_GAME_STATE.SHOW_MASK);
            var _game = tywx.UIManager.getUI(els.ELS_GAME_LAYER.GAME_SINGLE).node.getComponent("gameSinglemode");
            _game.game_mask.active = true;
            this.stopTimerCountdown();
            this.model.allowDoPopAction = true;
            this.scheduleUpdate_Manual();
        }
    },

    hiden_mask: function hiden_mask() {
        if (this.model.getGameStatus() == els.ELS_GAME_STATE.SHOW_MASK) {
            this.model.mconf.canRun = true;
            var _game = tywx.UIManager.getUI(els.ELS_GAME_LAYER.GAME_SINGLE).node.getComponent("gameSinglemode");
            //_game.game_mask.active = false;
            this.continueGame();
        }
    },

    /**
     * 暂停游戏
     */
    pauseGame: function pauseGame() {
        if (this.model.getGameStatus() == els.ELS_GAME_STATE.PLAYING) {
            this.model.setGameStatus(els.ELS_GAME_STATE.PAUSE);
            this.stopTimerCountdown();
        }
    },

    /**
     * 继续游戏
     */
    continueGame: function continueGame() {
        console.log('继续游戏======>>>>>');
        this.model.setGameStatus(els.ELS_GAME_STATE.PLAYING);
        this.startTimerCountdown(this._time);
    },

    backToHomePage: function backToHomePage() {
        this.stopTimerCountdown();
        this._backToHomePage();
    },

    //放弃保星
    cancelKeepStar: function cancelKeepStar() {
        this.model.keepstar = false;
        this.updatePKStar(-1);
        tywx.StarControl.clearNodes();
        this.model.setGameStatus(els.ELS_GAME_STATE.RESULT_LOSE);
        this.model.begin_cd = -1;
        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeEndVSLoseNoKeep, [this.model.pkstar, this.model.pklevel, this.model.ailevel]);
    },

    //保星 分享到群
    keepStarShare: function keepStarShare() {
        var that = this;
        var _successCall = function _successCall() {
            console.log('keepstar _successCall');
            that.model.keepstar = true;
            that.model.setGameStatus(els.ELS_GAME_STATE.RESULT_LOSE);
            tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeEndVSLoseKeep, [that.model.pkstar, that.model.pklevel, that.model.ailevel]);
        };
        var _failCall = function _failCall() {
            console.log('_failCall');
            that.model.keepstar = false;
            that.updatePKStar(-1);
            that.model.setGameStatus(els.ELS_GAME_STATE.RESULT_LOSE);
        };
        tywx.ShareInterface.shareMsg({
            type: els.ELS_SHRAE_TYPE.GAME_KEEP_STAR,
            successCallback: _successCall,
            failCallback: _failCall
        });
        this.model.allowDoPopAction = true;
        tywx.StarControl.clearNodes();
        this.model.begin_cd = -1;
        this.scheduleUpdate_Manual();
    },

    //保星 分享成功    加五步。减5行
    emergencyShare: function emergencyShare() {
        if ((this.model.mconf.mode == els.ELS_MODE_AI || this.model.mconf.mode == els.ELS_MODE_SINGLE) && this.model.emergency) {
            var that = this;
            var _share_type = undefined;
            if (this.model.mconf.mode === els.ELS_MODE_AI) {
                _share_type = els.ELS_SHRAE_TYPE.GAME_SHARE_DEL5;
            }
            if (this.model.mconf.mode === els.ELS_MODE_SINGLE) {
                _share_type = els.ELS_SHRAE_TYPE.GAME_SHARE_ADD5;
            }
            var _successCall = function _successCall() {
                console.log('emergency _successCall');
                if (that.model.mconf.mode == els.ELS_MODE_AI) {
                    that.model.mgrid[0].clearThreeBottomLines();
                }
                if (that.model.mconf.mode == els.ELS_MODE_SINGLE) {
                    that.model.add_step += 5;
                    console.log("ADD5STEP!!!");
                    var a5 = that.gameNode.getComponent('main').add5step;
                    a5.opacity = 255;
                    a5.runAction(cc.sequence(cc.blink(1.5, 5), cc.callFunc(function () {
                        a5.opacity = 0;
                    })));
                }
            };
            var _failCall = function _failCall() {
                console.log('_failCall');
            };
            tywx.ShareInterface.shareMsg({
                type: _share_type,
                successCallback: _successCall,
                failCallback: _failCall
            });
            this.model.allowDoPopAction = true;
            tywx.StarControl.clearNodes();
            //-------------------------------
            this.scheduleUpdate_Manual();
        }
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
        "elsGame": ElsGame
    };
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
        //# sourceMappingURL=game.js.map
        