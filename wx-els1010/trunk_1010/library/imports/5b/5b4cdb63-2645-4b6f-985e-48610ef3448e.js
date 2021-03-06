"use strict";
cc._RF.push(module, '5b4cdtjJkVLb5heSGEO80SO', 'tt_configs');
// scripts/game/common/tt_configs.js

"use strict";

var _configs$default;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var configs = {};

// 游戏的默认相关的CDN配置
configs.default = (_configs$default = {
    "auditing": false,
    "MUSICS": {
        "BG_MUSIC": ["ocean1.mp3", "ocean2.mp3", "ocean3.mp3", "eris/m/pintu/ocean4.mp3"]
    },
    "share_control": {
        "getchuizi": ["share", 80],
        "gethuanyihuan": ["share", 80],
        "recovergame": ["share", 80],
        "zpdouble": ["share", 80]
    },
    "MinGanIp": [["北京", ["北京"]], ["上海", ["上海"]], ["广东", ["广州", "深圳"]], ["湖南", ["长沙"]], ["天津", ["天津"]], ["浙江", ["杭州"]], ["四川", ["成都"]]],
    "WXAd": {
        "video": "",
        "banner": ""
    },
    "LuckyUserRate": 50,
    "ShareLimit": [1000, 10000],
    "cross_ad": {
        "ads": [{
            "id": 1,
            "appid": "wx1668490543c6bae9",
            "name": "更多游戏",
            "icon_url": "daoliu01.png"
        }, {
            "id": 2,
            "appid": "wxb92d4d650d51eda8",
            "name": "2048",
            "icon_url": "daoliu05.png"
        }, {
            "id": 3,
            "appid": "wx7e3b12072efbfc27",
            "name": "俄罗斯方块",
            "icon_url": "daoliu04.png"
        }, {
            "id": 4,
            "appid": "wxa9b801abd43333d9",
            "name": "四川麻将",
            "icon_url": "daoliu03.png"
        }, {
            "id": 5,
            "appid": "wx785e80cff6120de5",
            "name": "途游斗地主",
            "icon_url": "daoliu02.png"
        }],
        "blink_display": 5,
        "banner_menu": {
            "type": "banner",
            "ads": [1, 2, 3, 4]
        },
        "banner_gameover": {
            "type": "banner",
            "ads": [1, 2, 3, 4]
        },
        "blink_menu": {
            "type": "blink",
            "ads": [[1, 50], [2, 20], [3, 30]]
        },
        "blink_play": {
            "type": "blink",
            "ads": [[1, 50], [2, 20], [3, 30]]
        },
        "list_menu": {
            "type": "list",
            "ads": [1, 2, 3, 4]
        },
        "list_play": {
            "type": "list",
            "ads": [1, 2, 3, 4]
        }
    },
    "turning_disc": {
        "home": {
            "items": [{
                "name": "0.01元",
                "gift_id": 1,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "锤子x1",
                "gift_id": 2,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "0.03元",
                "gift_id": 3,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "锤子x2",
                "gift_id": 4,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "0.05元",
                "gift_id": 5,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "锤子x3",
                "gift_id": 6,
                "icon": "lottery_icon_0.png"
            }],
            "button_types": [0, ["video", "video_share", "share", "free"]]
        },
        "home_day_1st": {
            "items": [{
                "name": "0.01元",
                "gift_id": 1,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "锤子x1",
                "gift_id": 2,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "0.03元",
                "gift_id": 3,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "锤子x2",
                "gift_id": 4,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "0.05元",
                "gift_id": 5,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "锤子x3",
                "gift_id": 6,
                "icon": "lottery_icon_0.png"
            }],
            "button_types": [0, ["video", "video_share", "share", "free"]]
        },
        "game": {
            "items": [{
                "name": "0.01元",
                "gift_id": 1,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "锤子x1",
                "gift_id": 2,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "0.03元",
                "gift_id": 3,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "锤子x2",
                "gift_id": 4,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "0.05元",
                "gift_id": 5,
                "icon": "lottery_icon_0.png"
            }, {
                "name": "锤子x3",
                "gift_id": 6,
                "icon": "lottery_icon_0.png"
            }],
            "button_types": [0, ["video", "video_share", "share", "free"]]
        }
    },
    "lottery": {
        "score": [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000],
        "rate": [0.8, 0.7, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6],
        "max": [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    }
}, _defineProperty(_configs$default, "ShareLimit", [3000, 10000000]), _defineProperty(_configs$default, "ShareToast", {
    "show": true,
    "content": "分享失败，请分享到群"
}), _configs$default);

module.exports = configs;

cc._RF.pop();