/**
 * @file: open_data_config.js
 * @description: 主域，子域通信事件，主域，子域公用
 * @author: lu ning
 * @email: luning@tuyoogame.com
 * @date: 2018-08-24
 */
let events = {
    LOAD_DATA: 'load_data',
    // 得到微信好友的信息
    friends: 1,
    // 得到某个群的信息
    group: 2,
    // 得到玩家的基础信息
    userinfo: 3,
    // 提交当前的得分
    submitscore: 4,
    // 存储好友数据
    storefris: 5,
    // 隐藏UI
    hideUi: 6,
    // 游戏结束后的排行榜显示
    overphb:7,
};

let CloudDataKey = {
    x1: "TT_SCORE",
};

module.exports = {
    events,
    CloudDataKey
};
