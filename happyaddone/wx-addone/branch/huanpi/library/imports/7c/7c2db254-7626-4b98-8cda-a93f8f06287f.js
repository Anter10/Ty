"use strict";
cc._RF.push(module, '7c2dbJUdiZLmIzaqT+PBih/', 'AddOneConfig');
// Script/models/AddOneConfig.js

"use strict";

/*
   游戏配置文件:
   主要配置游戏逻辑和界面上的一些常量。
   created by gyc on 2018-08-01.
*/
var config = {
    "auditing": false,
    "ruyiScore": 2000,
    "MUSICS": {
        "BG_MUSIC": "https://marketqn.nalrer.cn/teris/m/3.mp3"
    },
    "share_control": {
        "dailydouble": "video",
        "comboitem": "video",
        "ruyibox": "share",
        "bigdouble": "share",
        "redpack": "share",
        "fuhuo": "video"
    },
    "box_rate": {
        "sub1": 0.1,
        "add2": 0.2,
        "heart": 0.4,
        "chui": 0.3,
        "red_packet": 0.85
    },
    "luck_block": {
        "score": [0, 100000, 120000, 150000, 180000, 200000, 100000000],
        "rate": [0.7, 0.65, 0.6, 0.55, 0.5, 0.3],
        "range": [3, 3.5, 3.5, 3.5, 4, 6]
    },
    "combo_level_new": {
        "good": 3,
        "cool": 4,
        "awesome": 5,
        "unbelive": 6
    },
    "show_box_rate": {
        "maxnum": [0, 8, 11, 14, 17, 20, 10000],
        "comboz": 1.38,
        "rate": [0.055, 0.06, 0.065, 0.07, 0.08, 0.1]
    },
    // * 能够CDN刷新的资源
    "PYQImg": {
        "GameOverPhotos": ["g1.png", "g2.png", "g3.png", "g4.png", "g5.png", "g6.png", "g7.png", "g8.png"],
        "MergeBigNumPhotos": ["g1.png", "g2.png", "g3.png", "g4.png", "g5.png", "g6.png", "g7.png", "g8.png"]
    },
    // 每局使用道具数量
    "mjUseItemNumber": 10,
    "cross_ad_more_game": [{
        "appid": "wx1668490543c6bae9",
        "name": "更多游戏",
        "icon_url": "daoliu01.png"
    }, {
        "appid": "wxb92d4d650d51eda8",
        "name": "2048",
        "icon_url": "daoliu05.png"
    }, {
        "appid": "wx7e3b12072efbfc27",
        "name": "俄罗斯方块",
        "icon_url": "daoliu04.png"
    }, {
        "appid": "wxa9b801abd43333d9",
        "name": "四川麻将",
        "icon_url": "daoliu03.png"
    }, {
        "appid": "wx785e80cff6120de5",
        "name": "途游斗地主",
        "icon_url": "daoliu02.png"
    }],
    "MinGanIp": [['北京', ['北京']], ['上海', ['上海']], ['广东', ['广州', '深圳']], ['湖南', ['长沙']], ['天津', ['天津']], ['浙江', ['杭州']], ['四川', ['成都']]]
};

module.exports = config;

cc._RF.pop();