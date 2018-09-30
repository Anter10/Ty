cc.log('AddOne boot start');
tywx.ado = tywx.ado || {};

tywx.ado.Configs      = require('./models/AddOneConfig.js');  // * 配置文件
tywx.ado.Utils        = require('./models/Utils.js');         // * 工具类
tywx.ado.AudioManager = require('./models/AudioManager.js');  // * 声音管理器
tywx.ado.Constants    = require('./models/Constants.js');     // * 常量
tywx.ado.Events       = require('./models/Events.js');        // * 事件

tywx.ado.isFirstLogin = true; // * 是否是第一次进入菜单

// 玩家当前的最大血量
tywx.ado.hpvalue = 5;

tywx.ado.boot = ()=>{
    cc.log('tywx.ado.boot');
};
tywx.ado.shut = ()=>{
    cc.log('tywx.ado.shut');
};

tywx.ado.inGame = game=>{
    tywx.ado.game = game;
};

tywx.ado.outGame = ()=>{
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
    amounts: [0,0,0,0,0,0,0],
    rewad: false
};
// * 邀请请好友信息
tywx.ado.InviteInfo = {
    code:0,
    reward: false,
    invite_users:[]
};
// * 保存进度
tywx.ado.saveProgress = ()=>{
    if(tywx.ado.game && tywx.ado.game.gamestate !== tywx.ado.Constants.GameCenterConfig.gameState.gameover){
        let mask     = [];
        let cur_mask = tywx.ado.game.getAllmask();
        let cur_gz   = tywx.ado.game.getAllgz();
        cur_mask.forEach(element => {
            let idx = element.x + element.y * 5;
            mask[idx] = cur_gz[idx].num;
        });
        let data = {
            life : tywx.ado.game.point || 0,
            score: tywx.ado.game.score || 0,
            recovernumber: tywx.ado.game.recoverNumber || 0,
            useitemnumber: tywx.ado.game.useItemNumber || 0,
            mask : mask,
            curmaxNumber:tywx.ado.game.curmaxNumber || 5,
        };
        tywx.ado.Utils.saveItem('ADO_PROGRESS',JSON.stringify(data));
        tywx.ado.game.storeScore();
        tywx.ado.logWithColor(JSON.stringify(data));
    }
};
// * 读取进度
tywx.ado.loadProgress = ()=>{
    let progress = tywx.ado.Utils.loadItem('ADO_PROGRESS',-1);
    tywx.ado.logWithColor(JSON.parse(progress));
    if(progress !== -1) {
        progress = JSON.parse(progress);
        // * 数据有0，JJ了
        if(progress.mask.some(e=>e === 0)){
            progress = -1;
        }
    }
    return progress;
};
// * 重置进度
tywx.ado.resetProgerss = ()=>{
    tywx.ado.Utils.delItem('ADO_PROGRESS');
};

// ! 输出带色日志
tywx.ado.logWithColor = (info, color = 'color:#FF00FF')=>{
    console.log('%c' + info,color);
};

//! 插件onShow, 与插件相关的处理尽量放在这里
tywx.ado.onShow = result=>{
    tywx.ado.AudioManager.loadAudioRes();
    console.log("播放背景音乐配置 " + JSON.stringify(tywx.ado.Configs));
    tywx.ado.AudioManager.playMusic(tywx.ado.Configs.MUSICS.BG_MUSIC);
    tywx.ado.logWithColor('tywx.ado.onShow');
    tywx.AdManager.init();
};
//! 插件onHide, 与插件相关的处理尽量放在这里
tywx.ado.onHide = ()=>{
    tywx.ado.saveProgress();
};

cc.log('AddOne boot end');
