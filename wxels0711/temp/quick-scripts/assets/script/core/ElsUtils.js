(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/core/ElsUtils.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ee2d96NofNGXqRPcmaarvLV', 'ElsUtils', __filename);
// script/core/ElsUtils.js

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _els = require('../core/els.js');

var _els2 = _interopRequireDefault(_els);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var crypto = require('crypto');
var ZhubaoMap = new Map([[112, 0], [113, 1], [114, 2]]);

var ElsUtils = function () {
    function ElsUtils() {
        _classCallCheck(this, ElsUtils);
    }

    /**
     * * 洗牌算法
     * @param {Array} array 需要洗的数组
     * @param {int} times 洗牌次数，默认洗牌2次 
     * @author lu ning
     * @date 11:31 2018/7/5
     * @return {Array} 返回值描述
     */


    _createClass(ElsUtils, null, [{
        key: 'shuffle',
        value: function shuffle(array) {
            var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

            var ret = array;
            for (var t = 0; t < times; t++) {
                for (var i = 0; i < ret.length - 1; i++) {
                    var ran_idx = parseInt(Math.random() * (ret.length - 1));
                    var _ref = [ret[ran_idx], ret[i]];
                    ret[i] = _ref[0];
                    ret[ran_idx] = _ref[1];
                }
            }
            return ret;
        }

        /**
         * * 函数描述
         * @param params Object
         *        params.wisper_ming string 悄悄话 明文
         *        params.wisper_an string 悄悄话 暗文
         *        params.heard_url string 玩家头像
         *        params.size cc.size 尺寸
         *        params.bg string 背景图片
         *        params.success function 成功回调
         *        params.fail function 失败回调
         * 流程:
         * 1. 创建离屏canvas
         * 2. 绘制背景
         * 3. 绘制头像
         * 4. 绘制文本
         * 5. 截屏保存到本地
         * 6. 将本地图片保存到相册
         * @author lu ning
         * @date 11:31 2018/7/5
         * @return {Object} 返回值描述
         */

    }, {
        key: 'createAndSaveImg2WXAlbum',
        value: function createAndSaveImg2WXAlbum(params) {
            var tmp_canvas = wx.createCanvas();
            tmp_canvas.height = params.size.height;
            tmp_canvas.width = params.size.width;
            var self = this;

            var tmp_context = tmp_canvas.getContext('2d');
            //! 绘制背景
            var bg_img = wx.createImage();
            var bg_x = 0;
            var bg_y = 0;
            var bg_w = params.size.width;
            var bg_h = params.size.height;

            bg_img.src = params.bg;
            bg_img.onload = function () {
                tmp_context.drawImage(bg_img, bg_x, bg_y, bg_w, bg_h);
                //! 绘制head
                var h_w = 90;
                var h_h = 90;
                var user_head_img = wx.createImage();
                user_head_img.src = params.user_heard_url;
                user_head_img.onload = function () {
                    var h_x = 240;
                    var h_y = 260;
                    tmp_context.save();
                    tmp_context.translate(70, -50);
                    tmp_context.rotate(13 * Math.PI / 180);
                    tmp_context.drawImage(user_head_img, h_x, h_y, h_w, h_h);
                    tmp_context.restore();
                    var head_img = wx.createImage();
                    head_img.src = params.heard_url;
                    head_img.onload = function () {
                        var h_x = 129;
                        var h_y = 229;
                        tmp_context.drawImage(head_img, h_x, h_y, h_w, h_h);

                        //! 绘制悄悄话
                        var str_content = params.wisper_ming;
                        var f_x = 190;
                        var f_y = 542;
                        // tmp_context.save();
                        // tmp_context.rotate(7 * Math.PI / 180);

                        tmp_context.fillStyle = "#461500";
                        tmp_context.font = "50px Arial";
                        tmp_context.fillText(str_content, f_x + 15, f_y);
                        str_content = params.wisper_an;
                        f_y = 680;
                        tmp_context.font = "50px Arial";
                        tmp_context.fillText(str_content, f_x + 70, f_y);
                        // tmp_context.restore();
                        //! 截屏,保存到本地
                        tmp_canvas.toTempFilePath({
                            x: 0,
                            y: 0,
                            width: params.size.width,
                            height: params.size.height,
                            destWidth: params.size.width,
                            destHeight: params.size.height,
                            fileType: 'png',
                            quality: 1.0,
                            success: function success(res) {
                                self.saveImage2PhoneByUrl(res.tempFilePath, params.success, params.fail);
                            },
                            fail: function fail(res) {
                                console.log('createWisperShareImgWithContent failed ' + res + ' .');
                                if (params.fail) {
                                    params.fail();
                                }
                            }
                        });
                    };
                };
            };
        }
    }, {
        key: 'saveImage2PhoneByUrl',
        value: function saveImage2PhoneByUrl(url, cb_success, cb_fail) {
            var saveImg2Phone = function saveImg2Phone() {
                if (!wx.saveImageToPhotosAlbum) {
                    cb_fail();
                    return;
                }

                wx.saveImageToPhotosAlbum({
                    filePath: url,
                    success: function success(res) {
                        cb_success();
                    },
                    fail: function fail(res) {
                        cb_fail();
                    }
                });
            };
            wx.getSetting({
                success: function success(res) {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                        wx.authorize({
                            scope: "scope.writePhotosAlbum",
                            success: function success() {
                                saveImg2Phone();
                            },
                            fail: function fail() {
                                // wx.showModal({
                                //     title: '提示',
                                //     content: '这是一个模态弹窗',
                                //     success: function(res) {
                                //       if (res.confirm) {
                                //         console.log('用户点击确定');
                                //       } else if (res.cancel) {
                                //         console.log('用户点击取消');
                                //       }
                                //     }
                                //   });
                                // let button = wx.createOpenSettingButton({
                                //     type: 'text',
                                //     text: '打开设置页面',
                                //     style: {
                                //         left: 10,
                                //         top: 76,
                                //         width: 200,
                                //         height: 40,
                                //         lineHeight: 40,
                                //         backgroundColor: '#ff0000',
                                //         color: '#ffffff',
                                //         textAlign: 'center',
                                //         fontSize: 16,
                                //         borderRadius: 4
                                //     }
                                // });
                                // button.onTap((res)=>{
                                //     button.destroy();
                                //     console.log('button click callback ',res);
                                // });

                                if (wx.openSetting) {
                                    wx.openSetting({
                                        success: function success(res) {
                                            console.log('success', res);
                                            if (res.authSetting['scope.writePhotosAlbum']) {
                                                saveImg2Phone();
                                            } else {
                                                cb_fail();
                                            }
                                        },
                                        fail: function fail(res) {
                                            console.log('fail', res);
                                            cb_fail();
                                        }
                                    });
                                } else {
                                    cb_fail();
                                }
                            },
                            complete: function complete() {}
                        });
                    } else {
                        saveImg2Phone();
                    }
                },
                fail: function fail(res) {
                    cb_fail();
                }
            });
        }
    }, {
        key: 'delItem',
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
    }, {
        key: 'isCanShare2GroupByTicket',
        value: function isCanShare2GroupByTicket(tag, result, success_cb, fail_cb) {
            if (!result.shareTickets || !result.shareTickets[0]) return false;
            var ret = false;
            var call_succ = function call_succ() {
                if (success_cb) success_cb();
            };
            var call_fail = function call_fail() {
                if (fail_cb) fail_cb();
            };
            var ff = ElsUtils;

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
                                ret = true;
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

            return ret;
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
                console.log("fengbing", " catch error: " + err);
            }
            return decoded;
        }

        /**
         * 检查此道具是否是虚拟礼物
         * @param  {[type]} _itemId [道具ID或商品ID]
         * @return {[type]}         [YES or NO]
         */

    }, {
        key: 'checkGift',
        value: function checkGift(_itemId) {
            var ret = false;
            var _i = _itemId + "";
            if (300 < parseInt(_i.substr(_i.length - 3, 3))) {
                ret = true;
            }
            return ret;
        }
    }, {
        key: 'checkPF',
        value: function checkPF(_itemId) {
            // 检查是否是皮肤
            var ret = false;
            var _i = _itemId + "";
            if (300 > parseInt(_i.substr(_i.length - 3, 3)) && parseInt(_i.substr(_i.length - 3, 3)) > 200) {
                ret = true;
            }
            return ret;
        }
    }, {
        key: 'selectPF',
        value: function selectPF(_itemId) {
            // 检查是否选中此皮肤
            var ret = false;
            var _i = _itemId + "";
            var pf_tag = parseInt(_i.substr(_i.length - 3, 3));
            var _pf = parseInt(ElsUtils.loadItem("els_select_pifu", 201));
            if (_pf === pf_tag) {
                ret = true;
            }
            return ret;
        }
    }, {
        key: 'savePF',
        value: function savePF(_itemId) {
            // 保存皮肤
            var _i = _itemId + "";
            var pf_tag = parseInt(_i.substr(_i.length - 3, 3));
            ElsUtils.saveItem("els_select_pifu", pf_tag, true);
        }
    }, {
        key: 'formatPropServerId2LocalId',
        value: function formatPropServerId2LocalId(id) {
            var map = new Map([[1018, 0], [1017, 1], [1019, 2], [1014, 3]]);
            return map.has(id) ? map.get(id) : -1;
        }
    }, {
        key: 'formatPropLocalId2ServerId',
        value: function formatPropLocalId2ServerId(id) {
            id += 1;
            var map = new Map([[0, 1018], [1, 1017], [2, 1019], [3, 1014]]);
            return map.has(id) ? map.get(id) : -1;
        }
    }, {
        key: 'loginServerId2String',
        value: function loginServerId2String(id) {
            var map = new Map([[7, '第七天'], [1, '第一天'], [2, '第二天'], [3, '第三天'], [4, '第四天'], [5, '第五天'], [6, '第六天']]);
            id += 1;
            return map.has(id) ? map.get(id) : '\u9519\u8BEF\u7684id' + id;
        }
        /**
         * 
         * @param {Number} fill_value 
         */

    }, {
        key: 'isZhubao',
        value: function isZhubao(fill_value) {
            return ZhubaoMap.has(fill_value);
        }
    }]);

    return ElsUtils;
}();

module.exports = ElsUtils;

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
        //# sourceMappingURL=ElsUtils.js.map
        