(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/boot.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4be88L4cYROyLEHoiJhnKF4', 'boot', __filename);
// Script/boot.js

'use strict';

cc.log('AddOne boot start');
tywx.ado = tywx.ado || {};

tywx.ado.Configs = require('./models/AddOneConfig.js'); // * 配置文件
tywx.ado.ResConfig = require('./models/ResConfig.js'); // * 资源配置文件
tywx.ado.OpenDataConfig = require('./models/open_data_config.js'); // * 开放域配置,与子域的配置一致
tywx.ado.Constants = require('./models/Constants.js'); // * 游戏中用到的常量
tywx.ado.Utils = require('./models/Utils.js'); // * 工具类
tywx.ado.AudioManager = require('./models/AudioManager.js'); // * 声音管理器
tywx.ado.UIManager = require('./models/UIManager.js'); // * UI管理器

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
    tywx.ado.AudioManager.playMusic(tywx.ado.Configs.MUSICS.BG_MUSIC);
    tywx.ado.logWithColor('tywx.ado.onShow');
};
//! 插件onHide, 与插件相关的处理尽量放在这里
tywx.ado.onHide = function () {};

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
        