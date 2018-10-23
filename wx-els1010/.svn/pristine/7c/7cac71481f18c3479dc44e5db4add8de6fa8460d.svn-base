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

tywx.tt.log = (...args) => {
    if (!tywx.tt.isDebug) return;
    let log_info = 'tywx.tt.log ====> ';
    args.forEach(e => {
        log_info += e.toString() + ' ';
    });
    console.log(log_info);
};
tywx.tt.warn = (...args) => {
    let log_info = '%ctywx.tt.warn ====> %c';
    args.forEach(e => {
        log_info += e.toString() + ' ';
    });
    tywx.tt.log(log_info, 'color:#FF00FF', 'color:#00FF00');
};
tywx.tt.error = (...args) => {
    let log_info = '%ctywx.tt.error ====> %c';
    args.forEach(e => {
        log_info += e.toString() + ' ';
    });
    tywx.tt.log(log_info, 'color:#FF0000', 'color:#0000FF');
};

tywx.tt.boot = () => {
    tywx.tt.configManager.requestConfig();
};
tywx.tt.shut = () => {

};
 
tywx.tt.onHide = () => {
    tywx.tt.log('[boot]', 'tywx.tt.onHide');
};

//! 插件onShow, 与插件相关的处理尽量放在这里
tywx.tt.onShow = result => {
    tywx.tt.log('[boot]', 'tywx.tt.onShow');
    tywx.tt.AudioManager.getInstance().loadAudioRes();
    tywx.tt.log("播放背景音乐配置 " + JSON.stringify(tywx.tt.Configs));
    tywx.tt.AudioManager.getInstance().playMusic(tywx.tt.Configs.MUSICS.BG_MUSIC);
    // tywx.tt.logWithColor('tywx.tt.onShow');
    tywx.AdManager.init();
};