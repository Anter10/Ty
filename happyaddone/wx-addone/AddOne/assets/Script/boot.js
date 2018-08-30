cc.log('AddOne boot start');
tywx.ado = tywx.ado || {};

tywx.ado.Configs = require('./models/AddOneConfig.js'); // * 配置文件
tywx.ado.Utils = require('./models/Utils.js'); // * 工具类
tywx.ado.AudioManager = require('./models/AudioManager.js'); // * 声音管理器
tywx.ado.Constants = require('./models/Constants.js');

tywx.ado.boot = ()=>{
    cc.log('tywx.ado.boot');
};
tywx.ado.shut = ()=>{
    cc.log('tywx.ado.shut');
};

// ! 输出带色日志
tywx.ado.logWithColor = (info, color = 'color:#FF00FF')=>{
    console.log('%c' + info,color);
};

//! 插件onShow, 与插件相关的处理尽量放在这里
tywx.ado.onShow = result=>{
    tywx.ado.AudioManager.loadAudioRes();
    console.log("播放背景音乐配置 " + JSON.stringify(tywx.ado.Configs));
    tywx.ado.AudioManager.playMusic(tywx.ado.Configs.default.MUSICS.BG_MUSIC);
    tywx.ado.logWithColor('tywx.ado.onShow');
};
//! 插件onHide, 与插件相关的处理尽量放在这里
tywx.ado.onHide = ()=>{

};

cc.log('AddOne boot end');