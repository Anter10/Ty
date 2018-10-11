"use strict";
cc._RF.push(module, '4be88L4cYROyLEHoiJhnKF4', 'boot');
// Script/boot.js

'use strict';

cc.log('AddOne boot start');
tywx.ado = tywx.ado || {};

tywx.ado.Configs = require('./models/AddOneConfig.js'); // * 配置文件
tywx.ado.Utils = require('./models/Utils.js'); // * 工具类
tywx.ado.AudioManager = require('./models/AudioManager.js'); // * 声音管理器
tywx.ado.Constants = require('./models/Constants.js'); // * 常量
tywx.ado.Events = require('./models/Events.js'); // * 事件

tywx.ado.isFirstLogin = true; // * 是否是第一次进入菜单

// 玩家当前的最大血量
tywx.ado.hpvalue = 5;
tywx.ado.isRequestedConfig = false; // ! 是否已经完成confgi请求

tywx.ado.boot = function () {
    cc.log('tywx.ado.boot');
};
tywx.ado.shut = function () {
    cc.log('tywx.ado.shut');
};

tywx.ado.inGame = function (game) {
    tywx.ado.game = game;
};

tywx.ado.outGame = function () {
    tywx.ado.game = null;
};

// * 红包信息初始化
tywx.ado.RedPacketInfo = {
    nextAmount: 0,
    totalAmount: 0,
    needShare: false
};
// * 每日登陆信息
tywx.ado.EveryDataLoginInfo = {
    totalAmount: 0,
    count: 0,
    amounts: [0, 0, 0, 0, 0, 0, 0],
    rewad: false
};
// * 邀请请好友信息
tywx.ado.InviteInfo = {
    code: 0,
    reward: false,
    invite_users: []
};
// * 敏感ip
tywx.ado.isMinGanIP = true; // 缺省为敏感ip
// * 保存进度
tywx.ado.saveProgress = function () {
    if (tywx.ado.game && tywx.ado.game.gamestate !== tywx.ado.Constants.GameCenterConfig.gameState.gameover) {
        var mask = [];
        var cur_mask = tywx.ado.game.getAllmask();
        var cur_gz = tywx.ado.game.getAllgz();
        cur_mask.forEach(function (element) {
            var idx = element.x + element.y * 5;
            mask[idx] = cur_gz[idx].num;
        });
        var data = {
            life: tywx.ado.game.point || 0,
            score: tywx.ado.game.score || 0,
            recovernumber: tywx.ado.game.recoverNumber || 0,
            useitemnumber: tywx.ado.game.useItemNumber || 0,
            mask: mask,
            curmaxNumber: tywx.ado.game.curmaxNumber || 5
        };
        tywx.ado.Utils.saveItem('ADO_PROGRESS', JSON.stringify(data));
        tywx.ado.game.storeScore();
        tywx.ado.logWithColor(JSON.stringify(data));
    }
};
// * 读取进度
tywx.ado.loadProgress = function () {
    var progress = tywx.ado.Utils.loadItem('ADO_PROGRESS', -1);
    tywx.ado.logWithColor(JSON.parse(progress));
    if (progress !== -1) {
        progress = JSON.parse(progress);
        // * 数据有0，JJ了
        if (progress.mask.some(function (e) {
            return e === 0;
        })) {
            progress = -1;
        }
    }
    return progress;
};
// * 重置进度
tywx.ado.resetProgerss = function () {
    tywx.ado.Utils.delItem('ADO_PROGRESS');
};

// ! 输出带色日志
tywx.ado.logWithColor = function (info) {
    var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'color:#FF00FF';

    console.log('%c' + info, color);
};

//! 插件onShow, 与插件相关的处理尽量放在这里
tywx.ado.onShow = function (result) {
    tywx.ado.AudioManager.loadAudioRes();
    console.log("播放背景音乐配置 " + JSON.stringify(tywx.ado.Configs));
    tywx.ado.AudioManager.playMusic(tywx.ado.Configs.MUSICS.BG_MUSIC);
    tywx.ado.logWithColor('tywx.ado.onShow');
    tywx.AdManager.init();
};
//! 插件onHide, 与插件相关的处理尽量放在这里
tywx.ado.onHide = function () {
    tywx.ado.saveProgress();
};

cc.log('AddOne boot end');

cc._RF.pop();