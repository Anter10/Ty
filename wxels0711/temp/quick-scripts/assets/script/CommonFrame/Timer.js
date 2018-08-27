(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/CommonFrame/Timer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '00d27uEn/ZNg5Q3yQsXjmXb', 'Timer', __filename);
// script/CommonFrame/Timer.js

'use strict';

/**
 * 对scheduler进行封装
 */

tywx.Timer = {
    /**
     * 开始定时器
     * 参数的含义依次是：回调的obj、回调函数、tick的间隔、不算这次还要重复的次数，开始tick的delay时间
     * @param {[type]}   obj       [description]
     * @param {Function} callback  [description]
     * @param {[type]}   interval  [description]
     * @param {[type]}   repeatNum [description]
     * @param {[type]}   delay     [description]
     */
    setTimer: function setTimer(obj, callback, interval, repeatNum, delay) {
        if (obj && obj._TAG) {
            tywx.LOGD('tywx.Timer', '----------in setTimer----------' + (obj._TAG ? obj._TAG : ''));
        }
        var scheduler = cc.director.getScheduler();
        // 直接屏蔽paused
        var paused = false;
        var times = null != repeatNum ? repeatNum : cc.macro.REPEAT_FOREVER;
        scheduler.schedule(callback, obj, interval, repeatNum, delay, paused);
    },

    /**
     * 取消定时器
     * @param  {[type]}   obj      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    cancelTimer: function cancelTimer(obj, callback) {
        // 这个类在jsb_cocos2dx_auto_api.js中可以找到
        if (obj && obj._TAG) {
            tywx.LOGD('tywx.Timer', '----------in cancelTimer ---------' + (obj._TAG ? obj._TAG : ''));
        }
        var scheduler = cc.director.getScheduler();
        scheduler.unschedule(callback, obj);
    },
    /**
     * 判断定时器
     * @param  {[type]}   obj      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    isScheduledTimer: function isScheduledTimer(obj, callback) {
        // 这个类在jsb_cocos2dx_auto_api.js中可以找到
        if (obj && obj._TAG) {
            tywx.LOGD('tywx.Timer', '----------in isScheduledTimer ---------' + (obj._TAG ? obj._TAG : ''));
        }
        var scheduler = cc.director.getScheduler();
        return scheduler.isScheduled(callback, obj);
    }
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
        //# sourceMappingURL=Timer.js.map
        