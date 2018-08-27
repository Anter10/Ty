"use strict";
cc._RF.push(module, 'e0b351yv/1HzquLbIhj7MnW', 'ELSProfile');
// script/core/ELSProfile.js

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 管理俄罗斯方块本地存储数据
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * create by luning.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _els = require('./els.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ELSProfile = function () {
    function ELSProfile() {
        _classCallCheck(this, ELSProfile);

        this.keyvalues = {};

        this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE] = false;
        this.keyvalues[ELSProfile.KEYS.BLOCK_IDX] = 0;
        this.keyvalues[ELSProfile.KEYS.SHARE_TIME_STAMP] = 0;
        this.initProps();
    }

    _createClass(ELSProfile, [{
        key: 'load',
        value: function load() {
            if (!tywx.IsWechatPlatform()) return;
            console.log('Profile load start');
            this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE] = wx.getStorageSync(ELSProfile.KEYS.MUSIC_MUTE);
            if (this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE] === '') {
                this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE] = false;
            }

            this.keyvalues[ELSProfile.KEYS.SHARE_TIME_STAMP] = wx.getStorageSync(ELSProfile.KEYS.SHARE_TIME_STAMP);
            if (this.keyvalues[ELSProfile.KEYS.SHARE_TIME_STAMP] === '') {
                this.keyvalues[ELSProfile.KEYS.SHARE_TIME_STAMP] = this.currentTimeMillis();
            }

            this.keyvalues[ELSProfile.KEYS.PROPS_COUNT] = wx.getStorageSync(ELSProfile.KEYS.PROPS_COUNT);
            console.log('prop count', this.keyvalues[ELSProfile.KEYS.PROPS_COUNT]);
            if (this.keyvalues[ELSProfile.KEYS.PROPS_COUNT] === '') {
                this.initProps();
            }

            console.log('Profile load end');
            this.save();
        }
    }, {
        key: 'save',
        value: function save() {
            for (var key in this.keyvalues) {
                // wx.setStorage({
                //     key: key,
                //     data: this.keyvalues[key]
                // });
                cc.sys.localStorage.setItem(key, this.keyvalues[key]);
            }
        }
    }, {
        key: 'getValueByKey',
        value: function getValueByKey(key) {
            return this.keyvalues[key];
        }
    }, {
        key: 'setValueByKey',
        value: function setValueByKey(key, value) {
            this.keyvalues[key] = value;
            this.save();
        }
    }, {
        key: 'getIsMusicMute',
        value: function getIsMusicMute() {
            return this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE];
        }
    }, {
        key: 'setIsMusicMute',
        value: function setIsMusicMute(is_mute) {
            this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE] = is_mute;

            this.save();
        }
    }, {
        key: 'switchMusicMute',
        value: function switchMusicMute() {
            this.setIsMusicMute(!this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE]);
        }
    }, {
        key: 'setShareTimeStamp',
        value: function setShareTimeStamp() {
            this.keyvalues[ELSProfile.KEYS.SHARE_TIME_STAMP] = this.currentTimeMillis();
            this.save();
        }
    }, {
        key: 'getLastShareTimeStamp',
        value: function getLastShareTimeStamp() {
            return this.keyvalues[ELSProfile.KEYS.SHARE_TIME_STAMP];
        }
    }, {
        key: 'isShowRank',
        value: function isShowRank() {
            var min_wait = 28800000; // 8 * 60 * 60 * 1000
            if (this.currentTimeMillis() - this.getValueByKey(ELSProfile.KEYS.SHARE_TIME_STAMP) >= min_wait) {
                return true;
            }
            return false;
        }
    }, {
        key: 'currentTimeMillis',
        value: function currentTimeMillis() {
            var ret = 0;
            var date = new Date();
            ret = date.getTime();
            return ret;
        }

        //! 道具相关接口

    }, {
        key: 'initProps',
        value: function initProps() {
            this.keyvalues[ELSProfile.KEYS.PROPS_COUNT] = [];
            for (var key in ELSProfile.PROP_TYPES) {
                this.keyvalues[ELSProfile.KEYS.PROPS_COUNT].push(0);
            }
        }
        //! 增加道具

    }, {
        key: 'addPropByKey',
        value: function addPropByKey(key) {
            var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] += count;
            this.save();
        }
        //! 获取道具数量

    }, {
        key: 'getPropByKey',
        value: function getPropByKey(key) {
            var ret = this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key];
            return ret;
        }
        //! 使用道具

    }, {
        key: 'usePropByKey',
        value: function usePropByKey(key) {
            var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            var ret = false;
            if (this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] > 0) {
                this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] -= count;
                if (this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] < 0) this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] = 0;
                ret = true;
            } else {
                if (this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] < 0) this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] = 0;
                ret = false;
            }
            this.save();
            return ret;
        }
    }], [{
        key: 'getInstance',
        value: function getInstance() {
            if (ELSProfile._instance === null) {
                ELSProfile._instance = new ELSProfile();
                ELSProfile._instance.load();
            }
            return ELSProfile._instance;
        }
    }]);

    return ELSProfile;
}();
//! 保存在本地的属性定义


ELSProfile.KEYS = {
    MUSIC_MUTE: 'music_mute', //! 是否静音
    BLOCK_IDX: 'block_idx', //! 皮肤id
    SHARE_TIME_STAMP: 'share_time_stamp', //! 群分享时间戳
    PROPS_COUNT: 'props_count' //! 道具数量
};
ELSProfile.PROP_TYPES = {
    PROP_0: 0, //! 塌陷 锤子
    PROP_1: 1 //! 填充 火箭
};
ELSProfile._instance = null;
module.exports = ELSProfile;

cc._RF.pop();