cc.log('AddOne boot start');
ty.ado = ty.ado || {};

ty.ado.Configs = require('./models/AddOneConfig.js'); // * 配置文件
ty.ado.Utils = require('./models/Utils.js'); // * 工具类
ty.ado.AudioManager = require('./models/AudioManager.js'); // * 声音管理器
ty.ado.Constants = require('./models/Constants.js'); // * 常量
ty.ado.Events = require('./models/Events.js'); // * 事件

ty.ado.isFirstLogin = true; // * 是否是第一次进入菜单

// 玩家当前的最大血量
ty.ado.hpvalue = 5;
ty.ado.isRequestedConfig = false; // ! 是否已经完成config请求
ty.ado.isCanWatchVideo = false; // ! 是否可以观看视频
//ty.TuyooSDK.login();

ty.ado.boot = () => {
    cc.log('ty.ado.boot');
};
ty.ado.shut = () => {
    cc.log('ty.ado.shut');
};

ty.ado.inGame = game => {
    ty.ado.game = game;
};

ty.ado.outGame = () => {
    ty.ado.game = null;
};

// * 红包信息初始化
ty.ado.RedPacketInfo = {
    nextAmount: 0,
    totalAmount: 0,
    needShare: false
};
// * 每日登陆信息
ty.ado.EveryDataLoginInfo = {
    totalAmount: 0,
    count: 0,
    amounts: [0, 0, 0, 0, 0, 0, 0],
    rewad: false
};
// * 邀请请好友信息
ty.ado.InviteInfo = {
    code: 0,
    reward: false,
    invite_users: []
};
// * 敏感ip
ty.ado.isMinGanIP = true; // 缺省为敏感ip
// * 保存进度
ty.ado.saveProgress = () => {
    if (ty.ado.game && ty.ado.game.gamestate !== ty.ado.Constants.GameCenterConfig.gameState.gameover) {
        let mask = [];
        let cur_mask = ty.ado.game.getAllmask();
        let cur_gz = ty.ado.game.getAllgz();
        cur_mask.forEach(element => {
            let idx = element.x + element.y * 14;
            mask[idx] = cur_gz[idx].num;
        });
        let data = {
            life: ty.ado.game.point || 0,
            score: ty.ado.game.score || 0,
            recovernumber: ty.ado.game.recoverNumber || 0,
            useitemnumber: ty.ado.game.useItemNumber || 0,
            mask: mask,
            curmaxNumber: ty.ado.game.curmaxNumber || 5,
        };
        ty.ado.Utils.saveItem('ADO_PROGRESS', JSON.stringify(data));
        ty.ado.game.storeScore();
        ty.ado.logWithColor(JSON.stringify(data));
    }
};
// * 读取进度
ty.ado.loadProgress = () => {
    let progress = ty.ado.Utils.loadItem('ADO_PROGRESS', -1);
    ty.ado.logWithColor(JSON.parse(progress));
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
ty.ado.resetProgerss = () => {
    ty.ado.Utils.delItem('ADO_PROGRESS');
};

// ! 输出带色日志
ty.ado.logWithColor = (info, color = 'color:#FF00FF') => {
    console.log('%c' + info, color);
};

//! 插件onShow, 与插件相关的处理尽量放在这里
ty.ado.onShow = result => {
    //ty.ado.AudioManager.loadAudioRes();
    //console.log("播放背景音乐配置 " + JSON.stringify(ty.ado.Configs));
    //ty.ado.AudioManager.playMusic(ty.ado.Configs.MUSICS.BG_MUSIC);
    ty.ado.logWithColor('ty.ado.onShow',ty.ShareInterface.IsWaitingCallback);
    ty.AdManager.init();
    if(ty.ShareInterface.IsWaitingCallback){
        ty.ShareInterface.shareBack();
    }
};
//! 插件onHide, 与插件相关的处理尽量放在这里
ty.ado.onHide = () => {
    ty.ado.saveProgress();
};

cc.log('AddOne boot end');
