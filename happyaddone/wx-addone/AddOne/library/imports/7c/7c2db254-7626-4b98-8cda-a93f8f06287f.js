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
    "auditing": true,
    "MUSICS": {
        "BG_MUSIC": "https://marketqn.nalrer.cn/teris/m/3.mp3"
    },
    "box_rate": {
        "sub1": 0.5,
        "add2": 0.2,
        "heart": 0.2,
        "chui": 0.1
    },
    "luck_block": {
        "score": [0, 10000, 20000, 25000, 30000, 35000, 100000000],
        "rate": [0.8, 0.7, 0.6, 0.3, 0.2, 0.1]
    },
    "combo_level": {
        "good": [4, 0.3],
        "cool": [5, 0.4],
        "awesome": [6, 0.9],
        "unbelive": [7, 1.0]
    }
};

module.exports = config;

cc._RF.pop();