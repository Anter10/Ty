"use strict";
cc._RF.push(module, 'df1208Zx/JC3oUD9r9e3z/G', 'Constants');
// Script/models/Constants.js

'use strict';

/**
 * @file: Constants.js
 * @description: 游戏中的常量定义
 * @author: lu ning
 * @email: luning@tuyoogame.com
 * @date: 2018-08-23
 */
// * 分享标识
var ShareConfig = {
    FIRST_PAGE_SHARE: ['firstpageshare', false], // 首页分享
    RECOVER_GAME_SHARE_VIDEO: ['recoversharegameshare', true], // 看视频复活
    RECOVER_SHARE_GAME_SHARE: ['recovergameshare', true], // 分享到群复活
    MAIN_BTN_SHARE: ['mainbtnshare', false], // 主界三点下面的分享
    POJILU_SHARE: ['pojilushare', false], // 得分破纪录分享
    RANK_SHARE: ['phbshare', true], // 排行榜界面分享
    FREE_GIFT_SHARE: ['freegiftshare', true], // 免费领取--连击
    FREE_GIFT_SHARE_VIDEO: ['freegiftsharevideo', true], // 看视频免费领取道具
    GROUP_RANK_SHARE: ['group_rank_share', true], // 群排行
    GIFT_GIFT_BOX_SHARE_VIDEO: ['free_gift_box_share', true], // 如意宝箱看视频领取
    GIFT_GIFT_SHARE_BOX_SHARE: ['free_gift_share_box_share', true], // 如意宝箱直接分享
    OPEN_RED_PACKET_SHARE: ['open_red_packet_share', true], // 打开红包分享
    OPEN_RED_PACKET_SHARE_VIDEO: ['open_red_packet_share_video', true], // 打开红包看视频领取
    EVERY_DAY_GIFT_DOUBLE_SHARE: ['every_day_gift_double_share', true], // 每日登陆奖励
    INVITE_FIREND_SHARE: ['invite_friend_share', false], // 邀请好友分享
    FREE_DOUBLE_SCORE_SHARE: ['freeaddscorebigdouble', true], // 分享到群大数得分加倍
    FREE_DOUBLE_SCORE_SHARE_VIDEO: ['freedoublescorevideo', true] // 看视频大数得分加倍
};
// * 分享缺省配置
var DefaultShareConfig = {
    shareContent: "你知道 +1 吗？",
    sharePicUrl: "https://marketqn.nalrer.cn/teris/share_image/jiayi/jy03.jpg",
    sharePointId: "766",
    shareSchemeId: "1155"
};
// * 微信广告参数
var WXAdConfig = {
    bannerId: 'adunit-652297ac130ea5be',
    vedioId: 'adunit-72772b75d8b17d65',
    bannerRefreshTime: 200 // * Banner刷新时间
};
// * 敏感ip
var MinGanIp = [['北京', ['北京']], ['上海', ['上海']], ['广东', ['广州', '深圳']], ['湖南', ['长沙']], ['天津', ['天津']], ['浙江', ['杭州']], ['四川', ['成都']]];
// * 交叉导流默认配置
var CrossAdDefaultConfig = {
    "icon_interval": 10,
    "icon_id": "214",
    "icon_url": ["https://elsfkws.nalrer.cn/teris/share_image/jiayi/daoliu01.png"],
    "icon_weight": 10,
    "icon_type": 1,
    "icon_skip_type": 1,
    "time_interval": 0,
    "second_toappid": "",
    "toappid": "wx1668490543c6bae9",
    "togame": "ttylc",
    "path": "pages/recommend/index?from=hljy&toappid=wx1668490543c6bae9&togame=ttylc",
    "province": [],
    "push_users": [],
    "push_uids": [],
    "webpages": [{
        "webpage_url": "http://xiaoyouxi.qiniu.andla.cn/pkgame/popstar/sharepng/moregame.jpg",
        "webpage_name": "天天游乐场",
        "webpage_weight": "10",
        "webpage_id": "132",
        "config_id": "214132"
    }]
};
// * 交叉导流AppId==>游戏名字对应
var CrossAdAppId2Name = {
    "wx1668490543c6bae9": "天天游乐场"
};

// * 微信红包提现报错
var WXTransferRedPacketError = {
    0: '提现成功',
    1: '本日红包添加次数已用光，明日才能再次添加',
    2: '用户数据，登陆信息校验失败',
    3: 'clientId校验失败',
    4: '用户红包不足，不能提现',
    5: 'SDK网络请求错误',
    6: 'SDK网络请求成功，业务处理失败',
    10: '系统未捕获异常',
    11: '参数错误',
    12: '必须先调用 info接口先获取信息后才可调用reward接口进行领取',
    13: '今日奖励已经领取',
    14: 'inviteId用户信息检查失败',
    15: '已经发奖了，不再进行邀请记录了',
    16: '已经记录了邀请关系',
    17: 'SDK请求用户昵称，头像获取失败',
    18: '用户对昵称，头像为空',
    19: '已经发过奖励了',
    20: '自己不能邀请自己',
    21: '邀请对人数不够，还不能领奖'
};

// 游戏的基础配置
var GameCenterConfig = {
    // 点击开始的时候判断玩家的分数是否大于 此值 不大于的话 则直接进入游戏
    prePlayGetScore: 10000,
    //游戏开始的时候方块下落的时间
    mergeMaxNumberBaseScore: 700,
    //游戏开始的时候方块下落的时间
    startGameDropTime: 0.3,
    // 当格子显示的数字超过此值时 显示皇冠
    moreThanTenNumber: 8,
    // 当格子显示的数字超过此值时 显示动画
    moreThanEightNumber: 8,
    // 分数大于这个值的时候 突破记录才显示 否则不限时
    showPjlScore: 8000,
    // 每个格子的大小（宽 高）
    gezi_size: 132,
    // 每个格子+间隙的大小 
    gezi_pitch: 140,
    // 格子移动一个的时间
    drop_time: 0.15,
    // 合并间歇时间
    merge_delay_time: 0.08,
    // 移动合并时间
    merge_time: 0.25,
    // 宽
    swidth: 720,
    //高
    sheight: 1280,
    // 玩家最大体力
    maxphy_value: 5,
    // 公共格子数量 5 * 5
    geziNumber: 25,
    // 最少连接多少个可以消除
    minCanRemoveNumber: 3,
    //玩家得分基数
    baseScore: 10,
    // 最大复活次数
    maxrnum: 2,
    //格子距离底部多远
    marginbottom: 358,
    // 即将超越对手多少分显示相应图标
    thanfriendScore: 300,
    // 提示用户点击轮播时间
    letUserClickTime: 3,
    // 初始化给玩家的道具数量
    initGivePlayerItemNumber: 1,
    // 初始化格子的最大数限制
    initGameMaxNum: 5,
    // 游戏中用到的道具数据
    allitem: [{
        id: 1,
        name: "-1",
        png: "",
        num: 0,
        value: -1
    }, {
        id: 2,
        name: "+2",
        png: "",
        num: 0,
        value: 2
    }, {
        id: 5,
        name: "+1血",
        png: "",
        num: 0,
        value: 0
    }, {
        id: 6,
        name: "锤子",
        png: "",
        num: 0,
        value: 0
    }],
    //! 音效
    SOUNDS: {
        AWESOME: 'sounds/awesome.mp3',
        COOL: 'sounds/cool.mp3',
        GOOD: 'sounds/good.mp3',
        MUSIC_LOGO: 'sounds/music_logo.mp3',
        POPUPCLOSE: 'sounds/PopupClose.mp3',
        UNBLIEVEABLE: 'sounds/unblieveable.mp3',
        // 加钱的时候音效
        ADDMONEY: 'sounds/coin.mp3',
        // 飞红包时的音效
        FLY_REDPACKET: 'sounds/redpack.mp3',
        COMBO: ['sounds/combo3.mp3', 'sounds/combo4.mp3', 'sounds/combo5.mp3', 'sounds/combo6.mp3', 'sounds/combo7.mp3', 'sounds/combo8.mp3', 'sounds/combo9.mp3', 'sounds/combo10.mp3', 'sounds/combo11.mp3', 'sounds/combo12.mp3', 'sounds/combo13.mp3', 'sounds/combo14.mp3']
    },
    // 格子中数字的颜色值
    celltilenumColors: [[126, 84, 15], // 砖红色
    [94, 120, 23], // 浅砖红色
    [167, 82, 26], // 蓝色
    [167, 46, 46], // 草绿色
    [161, 31, 71], // 青色
    [28, 118, 85], // 深绿色
    [14, 110, 147], // 深蓝色
    [29, 94, 155], // 深红色
    [151, 53, 111], // 咖啡色
    [111, 49, 126]],
    // 当前的游戏状态
    gameState: {
        checkclick: 1, // 玩家点击格子的状态
        domove: 2, // 格子移动状态
        dodrop: 3, // 各自处于掉落状态
        waitclick: 4, // 等待点击状态
        gameover: 5, // 游戏结束状态
        usingitem: 6
    },
    // 格子颜色值(RGB) 现在没用
    color_list: [[126, 84, 15], // 砖红色
    [94, 120, 23], // 浅砖红色
    [167, 82, 26], // 蓝色
    [167, 46, 46], // 草绿色
    [28, 118, 85], // 深绿色
    [161, 31, 71], // 青色
    [14, 110, 147], // 深蓝色
    [29, 94, 155], // 深红色
    [151, 53, 111], // 咖啡色
    [111, 49, 126], // 紫色
    [126, 84, 15] // 深黑色
    ],

    // 体力显示的属性
    showphy_pros: {
        width: 130,
        height: 40,
        radius: 6,
        phy_num: 5,
        // 赤橙黄绿青蓝紫
        colors: [[255, 0, 0], [255, 165, 0], [255, 255, 0], [0, 255, 0], [0, 127, 255], [0, 0, 255], [139, 0, 255]]
    }

};

module.exports = {
    ShareConfig: ShareConfig,
    GameCenterConfig: GameCenterConfig,
    WXAdConfig: WXAdConfig,
    WXTransferRedPacketError: WXTransferRedPacketError,
    DefaultShareConfig: DefaultShareConfig,
    CrossAdDefaultConfig: CrossAdDefaultConfig,
    CrossAdAppId2Name: CrossAdAppId2Name,
    MinGanIp: MinGanIp
};

cc._RF.pop();