"use strict";
cc._RF.push(module, '4b141PsZGNDl7J69qP8aCh3', 'Utils');
// Script/models/Utils.js

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var crypto = require('crypto');
var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'delItem',

        /**
         * * 删除存储在本地的指定数据
         *
         * @static
         * @param {String} key 标识
         * @returns
         */
        value: function delItem(key) {
            cc.sys.localStorage.removeItem(key);
            if (!tywx.isInWXChat) return;
            wx.removeUserCloudStorage({
                keyList: [key],
                success: function success(msg) {
                    console.log('removeObjectCloud  ' + key + ' succeeds', msg);
                },
                fail: function fail(msg) {
                    console.log('removeObjectCloud  ' + key + ' fails', msg);
                }
            });
        }

        /**
         * * 保存数据到本地
         *
         * @static
         * @param {String} key 标识
         * @param {any} value
         * @param {boolean} only_local 是否只保存在本地,false的情况，上传到腾讯云
         * @returns
         */

    }, {
        key: 'saveItem',
        value: function saveItem(key, value, only_local) {
            value = value + '';
            cc.sys.localStorage.setItem(key, value);
            if (!tywx.isInWXChat) return;
            if (!only_local) {
                //FIXED: 做版本检测，版本低的会有黑屏
                if (wx.setUserCloudStorage) {
                    wx.setUserCloudStorage({
                        KVDataList: [{ key: key, value: value }],
                        success: function success(msg) {
                            console.log('saveObjectToCloud  ' + key + ' succeeds', msg);
                        },
                        fail: function fail(msg) {
                            console.log('saveObjectToCloud  ' + key + ' fails', msg);
                        }
                    });
                }
            }
        }
        /**
         * * 加载保存在本地的数据
         *
         * @static
         * @param {String} key 标识
         * @param {any} default_value 默认值
         * @returns
         */

    }, {
        key: 'loadItem',
        value: function loadItem(key, default_value) {
            var v = cc.sys.localStorage.getItem(key);
            // console.log(key, 'v'+v);
            if (!v) {
                cc.sys.localStorage.setItem(key, default_value);
                return default_value;
            }
            return v;
        }
        /**
         * @description 分享到不同群限制
         * @author lu ning
         * @date 2018-08-22
         * @static
         * @param {String} tag 分享tag
         * @param {Object} result 分享返回值
         * @param {Function} success_cb 成功回调
         * @param {Function} fail_cb 失败回调
         * @returns
         */

    }, {
        key: 'share2GroupByTicket',
        value: function share2GroupByTicket(tag, result, success_cb, fail_cb) {
            if (!result.shareTickets || !result.shareTickets[0]) return false;
            var call_succ = function call_succ() {
                if (success_cb) success_cb();
            };
            var call_fail = function call_fail() {
                if (fail_cb) fail_cb();
            };
            var ff = Utils;

            wx.getShareInfo({
                shareTicket: result.shareTickets[0],
                success: function success(res) {
                    console.log('isCanShare2GroupByTicket==>', res);
                    try {
                        var iv = res.iv;
                        var encryptedData = res.encryptedData;
                        var resultStr = ff.decrypt(tywx.UserInfo.wxgame_session_key, iv, encryptedData);
                        console.log('resultStr==>', resultStr);
                        if (resultStr && resultStr !== 0) {
                            var resultObj = JSON.parse(resultStr);
                            var id = tag + '_' + resultObj.openGId;
                            var t0 = parseInt(ff.loadItem(id, 0));
                            var tc = new Date().getTime();
                            console.log('isCanShare2GroupByTicket==>openGId', id, typeof id === 'undefined' ? 'undefined' : _typeof(id));
                            if (tc - t0 >= 24 * 60 * 60 * 1000) {
                                ff.saveItem(id, tc, true);
                                call_succ();
                            } else {
                                call_fail();
                            }
                        } else {
                            call_fail();
                        }
                    } catch (e) {
                        console.log("share::", e);
                        call_fail();
                    }
                },
                fail: function fail() {
                    call_fail();
                }
            });
        }

        /**
         * @description 获取随机分享数据
         * @author lu ning
         * @date 2018-08-23
         * @static
         * @param {String} share_tag
         */

    }, {
        key: 'getRandomShareConfigByShareTag',
        value: function getRandomShareConfigByShareTag(share_tag) {
            var config = null;
            var tmp_arr = [];
            if (tywx.PropagateInterface.ShareConfig.hasOwnProperty(share_tag)) {
                tmp_arr = tywx.PropagateInterface.ShareConfig[share_tag];
                var rand_idx = parseInt(Math.random() * tmp_arr.length);
                config = tmp_arr[rand_idx];
            }
            return config;
        }
    }, {
        key: 'decrypt',
        value: function decrypt(key, iv, crypted) {
            var decoded = 0;
            try {
                crypted = new Buffer(crypted, 'base64');
                iv = new Buffer(iv, 'base64');
                key = new Buffer(key, 'base64');

                var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
                decipher.setAutoPadding(true);

                decoded = decipher.update(crypted, 'binary', 'utf8');
                decoded += decipher.final('utf8');
            } catch (err) {
                console.log("decrypt", " catch error: " + err);
            }
            return decoded;
        }

        /**
         * @description 
         * @author lu ning
         * @date 2018-08-24
         * @static
         * @param {String} msg
         * @param {number} [duration=1000]
         */

    }, {
        key: 'showWXToast',
        value: function showWXToast(msg) {
            var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

            if (wx.showToast) {
                wx.showToast({
                    title: msg,
                    icon: '',
                    duration: duration
                });
            } else {
                cc.error('showWXToast error can not find function wx.showToast');
            }
        }
        /**
         * @description 显示模态窗
         * @author lu ning
         * @date 2018-08-24
         * @static
         * @param {String} content 显示内容
         * @param {String} [title='提示'] title
         * @param {boolean} [show_cancle=false]  是否显示取消
         * @param {Function} [sure_cb=null] 确定按钮回调
         * @param {Function} [cancle_cb=null] 取消按钮回调
         */

    }, {
        key: 'showWXModal',
        value: function showWXModal(content) {
            var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '提示';
            var show_cancel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var sure_cb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
            var cancle_cb = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

            wx.showModal({
                title: title,
                content: content,
                showCancel: show_cancel,
                success: function success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定');
                        sure_cb && sure_cb();
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                        cancle_cb && cancle_cb();
                    }
                }
            });
        }
    }]);

    return Utils;
}();

module.exports = Utils;

cc._RF.pop();