(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/tt_boot.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e5652AF0hZHo7lT5GGnNFzh', 'tt_boot', __filename);
// scripts/game/tt_boot.js

'use strict';

tywx.tt = tywx.tt || {};
tywx.tt.isDebug = true;
tywx.tt.Utils = require('./model/Utils.js'); // * 工具类
tywx.tt.AudioManager = require('./model/AudioManager.js'); // * 工具类
tywx.tt.rank_manager = require('./rank/rank_manager.js'); // * 工具类
tywx.tt.stop_view = require('./stopview/stop_view.js'); // * 工具类
tywx.tt.constants = require('./common/tt_constants'); // * 常量
tywx.tt.events = require('./common/tt_events'); // * 事件
tywx.tt.Configs = require('./common/tt_configs'); // * 配置文件
tywx.tt.tipview = require('./common/tip_view'); //* 提示框管理
tywx.tt.ads = require('./cross_ad/ads_manager'); //* 交叉倒流管理
tywx.tt.lottery = require('./lottery/lottery_manager'); //* 大转盘管理
tywx.tt.help = require('./help/help_view'); //* 大转盘管理
tywx.tt.gameover = require('./gameover/gameover_view'); //* 大转盘管理
tywx.tt.fuhuo = require('./gameover/fuhuo_view'); //* 大转盘管理

tywx.tt.configManager = require('./model/tt_model_config_manager');
tywx.tt.isCanWatchVideo = false;
// 缺省为敏感ip
tywx.tt.isMinGanIP = true;

tywx.tt.log = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    if (!tywx.tt.isDebug) return;
    var log_info = 'tywx.tt.log ====> ';
    args.forEach(function (e) {
        log_info += e.toString() + ' ';
    });
    console.log(log_info);
};
tywx.tt.warn = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    var log_info = '%ctywx.tt.warn ====> %c';
    args.forEach(function (e) {
        log_info += e.toString() + ' ';
    });
    tywx.tt.log(log_info, 'color:#FF00FF', 'color:#00FF00');
};
tywx.tt.error = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
    }

    var log_info = '%ctywx.tt.error ====> %c';
    args.forEach(function (e) {
        log_info += e.toString() + ' ';
    });
    tywx.tt.log(log_info, 'color:#FF0000', 'color:#0000FF');
};

tywx.tt.boot = function () {
    tywx.tt.configManager.getInstance().requestConfig();
};
tywx.tt.shut = function () {};

tywx.tt.onHide = function () {
    tywx.tt.log('[boot]', 'tywx.tt.onHide');
};

//! 插件onShow, 与插件相关的处理尽量放在这里
tywx.tt.onShow = function (result) {
    tywx.tt.log('[boot]', 'tywx.tt.onShow');
    tywx.tt.AudioManager.getInstance().loadAudioRes();
    tywx.tt.log("播放背景音乐配置 " + JSON.stringify(tywx.tt.Configs));
    tywx.tt.AudioManager.getInstance().playMusic(tywx.tt.AudioManager.getInstance().getBGMusic());
    // tywx.tt.logWithColor('tywx.tt.onShow');
    tywx.AdManager.init();
    if (tywx.ShareInterface.IsWaitingCallback) {
        tywx.ShareInterface.shareBack();
    }
};

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
        //# sourceMappingURL=tt_boot.js.map
        