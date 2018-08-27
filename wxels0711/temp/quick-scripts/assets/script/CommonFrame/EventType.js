(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/CommonFrame/EventType.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ea893XIn0xBu5nw8iUg2nfK', 'EventType', __filename);
// script/CommonFrame/EventType.js

'use strict';

/**
 * Created by xiaochuntian on 2018/5/3.
 */

tywx.EventType = {
    // tcp状态的事件
    TCP_ERROR: 'tcp_error',
    TCP_CLOSE: 'tcp_close',
    TCP_OPENED: 'tcp_opened', // 连接建立好之后的回调
    TCP_RECONNECT: 'tcp_reconnect',
    TCP_RECEIVE: 'tcp_receive', //长连接接收任何消息的事件

    SDK_LOGIN_SUCCESS: 'sdk_login_success',
    SDK_LOGIN_FAIL: 'sdk_login_fail',
    WEIXIN_LOGIN_SUCCESS: 'weixin_login_success',
    WEIXIN_LOGIN_FAIL: 'weixin_login_fail',

    GET_USER_FEATURE_SUCCESS: 'GET_USER_FEATURE_SUCCESS',
    GET_USER_FEATURE_FAIL: 'GET_USER_FEATURE_FAIL',
    GET_SHARE_CONFIG_SUCCESS: 'GET_SHARE_CONFIG_SUCCESS',
    GET_SHARE_CONFIG_FAIL: 'GET_SHARE_CONFIG_FAIL',

    GET_OPEN_DATA_RESULT_SUCCESS: "GET_OPEN_DATA_RESULT_SUCCESS",
    GET_OPEN_DATA_RESULT_FAIL: "GET_OPEN_DATA_RESULT_FAIL",
    GET_OPEN_DATA_RESULT_TIMEOUT: "GET_OPEN_DATA_RESULT_TIMEOUT",

    SEND_HEART_BEAT: 'SEND_HEART_BEAT',
    GAME_SHOW: 'GAME_SHOW',
    GAME_HIDE: 'GAME_HIDE',
    START_AUTHORIZATION_SUCCESS: 'START_AUTHORIZATION_SUCCESS', //授权成功
    START_AUTHORIZATION_FAILED: 'START_AUTHORIZATION_FAILED', //授权失败

    GET_SECRET_LANGUAGE_IMAGE_SUCCESS: 'GET_SECRET_LANGUAGE_IMAGE_SUCCESS', // 获取密语信息成功
    GET_SECRET_LANGUAGE_IMAGE_FAIL: 'GET_SECRET_LANGUAGE_IMAGE_FAIL', // 获取密语信息失败

    SECRET_LANGUAGE_TO_GAME: 'SECRET_LANGUAGE_TO_GAME', // 从密语分享点入

    GET_STORE_LIST_SUCCESS: 'GET_STORE_LIST_SUCCESS', // 获取商品配置信息成功
    GET_STORE_LIST_FAIL: 'GET_STORE_LIST_FAIL', // 获取商品配置信息失败

    // ==================>>>>>>
    CMD_USER_INFO: 'user_info5',
    CMD_UPDATE_NOTIFY: 'update_notify5',
    CMD_BIND_USER: 'bind_user5',
    CMD_BIND_GAME: 'bind_game5',
    CMD_GAME_DATA: 'game_data5',
    CMD_HALL_INFO: 'hall_info5',
    CMD_STORE: 'store5',
    CMD_ITEM: 'item5',
    CMD_STORE_LIST: 'sc_list',

    // ==================>>>>>>
    MSG_SERVER_MESSAGE: 'server_message',

    // ==================>>>>>>

    CMD_ELSWX: "elswx",
    CMD_ACTION_REWARD_INFO: "reward_info", // 每日领奖信息
    CMD_ACTION_ADD_DIAMOND: "add_diamond", // 添加钻石
    CMD_ACTION_ADD_ITEMS: "add_items", // 添加道具
    CMD_ACTION_ENTER_GAME: "enter_game", // 从分享链接 进入游戏
    CMD_ACTION_NEXT_ADREWARD: "next_adreward", // 下次可以看广告获取奖励

    CMD_ACTION_SYNC_ITEMS: "sync_items", // 同步数据
    CMD_ACTION_CONSUME_ITEMS: "consume_items", // 消耗道具
    CMD_ACTION_REWARD_ITEMS: "reward_items", // 每日解锁
    CMD_ACTION_WHISPER_PASS: "whisper_pass", // 悄悄话通关
    CMD_ACTION_WHISPER_START: "whisper_start", // 悄悄话发布

    CMD_ACTION_WHISPER_INFO: "whisper_info", // 悄悄话通关
    CMD_ACTION_DAILY_LOGIN: "daily_login", // 每日登陆
    CMD_ACTION_ELS_BAG: "get_bag" // 重构背包数据
};

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
        //# sourceMappingURL=EventType.js.map
        