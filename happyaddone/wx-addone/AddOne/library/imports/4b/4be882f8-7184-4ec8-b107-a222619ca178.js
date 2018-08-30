"use strict";
cc._RF.push(module, '4be88L4cYROyLEHoiJhnKF4', 'boot');
// Script/boot.js

'use strict';

cc.log('AddOne boot start');
tywx.ado = tywx.ado || {};

tywx.ado.Configs = require('./models/AddOneConfig.js'); // * 配置文件
tywx.ado.Utils = require('./models/Utils.js'); // * 工具类
tywx.ado.AudioManager = require('./models/AudioManager.js'); // * 声音管理器
tywx.ado.Constants = require('./models/Constants.js');

tywx.ado.boot = function () {
    cc.log('tywx.ado.boot');
};
tywx.ado.shut = function () {
    cc.log('tywx.ado.shut');
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
};
//! 插件onHide, 与插件相关的处理尽量放在这里
tywx.ado.onHide = function () {};

cc.log('AddOne boot end');

cc._RF.pop();