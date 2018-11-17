(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/boot.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4be88L4cYROyLEHoiJhnKF4', 'boot', __filename);
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
tywx.ado.isRequestedConfig = false; // ! 是否已经完成config请求
tywx.ado.isCanWatchVideo = false; // ! 是否可以观看视频

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
            var idx = element.x + element.y * 14;
            mask[idx] = cur_gz[idx].num;
        });
        var data = {
            life: tywx.ado.game.point || 0,
            score: tywx.ado.game.score || 0,
            curshowxhgs: tywx.ado.game.curshowxhgs || [],
            recovernumber: tywx.ado.game.recoverNumber || 0,
            useitemnumber: tywx.ado.game.useItemNumber || 0,
            mask: mask,
            useryboxnumber: tywx.ado.game.useryboxnumber || 0,
            mfids: tywx.ado.game.getMfData() || [],
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
        // if (progress.mask.some(e => e === 0)) {
        //     progress = -1;
        // }
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
    //console.log("播放背景音乐配置 " + JSON.stringify(tywx.ado.Configs));
    // tywx.ado.AudioManager.playMusic(tywx.ado.Configs.MUSICS.BG_MUSIC);
    tywx.ado.logWithColor('tywx.ado.onShow', tywx.ShareInterface.IsWaitingCallback);
    tywx.AdManager.init();
    if (tywx.ShareInterface.IsWaitingCallback) {
        tywx.ShareInterface.shareBack();
    }
};
//! 插件onHide, 与插件相关的处理尽量放在这里
tywx.ado.onHide = function () {
    tywx.ado.saveProgress();
};

cc.log('AddOne boot end');

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
        //# sourceMappingURL=boot.js.map
        