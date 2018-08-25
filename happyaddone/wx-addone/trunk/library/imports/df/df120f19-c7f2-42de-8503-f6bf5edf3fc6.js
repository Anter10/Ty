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
    RECOVER_GAME_SHARE: ['recovergameshare', true], // 分享复活
    MAIN_BTN_SHARE: ['mainbtnshare', false], // 主界三点下面的分享
    POJILU_SHARE: ['pojilushare', false], // 得分破纪录分享
    RANK_SHARE: ['phbshare', true], // 排行榜界面分享
    FREE_GIFT_SHARE: ['freegiftshare', true] // 免费领取
};

module.exports = {
    ShareConfig: ShareConfig
};

cc._RF.pop();