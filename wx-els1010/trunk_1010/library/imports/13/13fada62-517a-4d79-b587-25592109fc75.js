"use strict";
cc._RF.push(module, '13fadpiUXpNebWHJVkhCfx1', 'Utils');
// scripts/game/model/Utils.js

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var crypto = require('crypto');
var GameClubBtn = null; // * 游戏圈按钮
var WXBannerAD = null; // * 微信banner广告
var IsHideBanner = false; // * 是否显示Banner
var WXVedioAD = null; // * 微信Vedio广告
var WXVedioCallback = {
    success: null,
    fail: null,
    err_cb: null
}; // * 微信vedio回调
var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'createAndSaveImg2WXAlbum',

        /**
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
        value: function createAndSaveImg2WXAlbum(params) {
            canvas.toTempFilePath({
                x: params.x,
                y: params.y,
                width: params.w,
                height: params.h,
                destWidth: params.w,
                destHeight: params.h,
                success: function success(res) {
                    tywx.tt.log(res);

                    Utils.saveImage2PhoneByUrl(res.tempFilePath, params.success, params.fail);
                },
                fail: function fail(res) {
                    // self.title.active = true;
                    params.fail && params.fail();
                }
            });
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
                                if (wx.openSetting) {
                                    wx.openSetting({
                                        success: function success(res) {
                                            tywx.tt.log('success', res);
                                            if (res.authSetting['scope.writePhotosAlbum']) {
                                                saveImg2Phone();
                                            } else {
                                                cb_fail();
                                            }
                                        },
                                        fail: function fail(res) {
                                            tywx.tt.log('fail', res);
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
        /**
         * * 删除存储在本地的指定数据
         *
         * @static
         * @param {String} key 标识
         * @returns
         */

    }, {
        key: 'delItem',
        value: function delItem(key) {
            cc.sys.localStorage.removeItem(key);
            //localValues.delete(key);
            if (!tywx.isInWXChat) return;
            wx.removeUserCloudStorage({
                keyList: [key],
                success: function success(msg) {
                    tywx.tt.log('removeObjectCloud  ' + key + ' succeeds', msg);
                },
                fail: function fail(msg) {
                    tywx.tt.log('removeObjectCloud  ' + key + ' fails', msg);
                }
            });
        }
    }, {
        key: 'uploadErrorMsg',
        value: function uploadErrorMsg(msg) {
            var time = new Date();
            var err_obj = {
                "cloud_id": tywx.SystemInfo.cloudId,
                "time": time.toDateString(),
                "client_id": tywx.SystemInfo.clientId,
                "user_id": tywx.UserInfo.userId,
                "sys_version": tywx.UserInfo.system,
                "mobile_models": tywx.UserInfo.model,
                "baseVersion": "0",
                "wxVersion": tywx.UserInfo.wechatType,
                "clientVersion": tywx.SystemInfo.version,
                "Nettype": tywx.StateInfo.networkType,
                "ip": tywx.UserInfo.ip,
                "errMsg": msg
            };
            //let err_str = String(err_obj);
            if (err_obj) {
                var header = {
                    'Content-Type': 'text/plain'
                };
                var configObj = {
                    'url': tywx.SystemInfo.errorTxtServer,
                    'header': header,
                    'postData': err_obj,
                    'callback': function callback(params) {
                        tywx.tt.log('uploadErrorMsg===>', params);
                    }
                };
                tywx.HttpUtil.httpPost(configObj, 'POST');
            }
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
            //localValues.set(key, value);
            if (!tywx.isInWXChat) return;
            if (!only_local) {
                //FIXED: 做版本检测，版本低的会有黑屏
                if (wx.setUserCloudStorage) {
                    wx.setUserCloudStorage({
                        KVDataList: [{
                            key: key,
                            value: value
                        }],
                        success: function success(msg) {
                            tywx.tt.log('saveObjectToCloud  ' + key + ' succeeds', msg);
                        },
                        fail: function fail(msg) {
                            tywx.tt.log('saveObjectToCloud  ' + key + ' fails', msg);
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
            //if(localValues.has(key)) return localValues.get(key);
            var v = cc.sys.localStorage.getItem(key);
            if (!v) {
                v = default_value;
                for (var i = 0; i < 3; i++) {
                    var tmp_v = cc.sys.localStorage.getItem(key);
                    if (!tmp_v) continue;
                    v = tmp_v;
                    break;
                }
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
                    tywx.tt.log('isCanShare2GroupByTicket==>', res);
                    try {
                        var iv = res.iv;
                        var encryptedData = res.encryptedData;
                        var resultStr = ff.decrypt(tywx.UserInfo.wxgame_session_key, iv, encryptedData);
                        tywx.tt.log('resultStr==>', resultStr);
                        if (resultStr && resultStr !== 0) {
                            var resultObj = JSON.parse(resultStr);
                            var id = tag + '_' + resultObj.openGId;
                            var t0 = parseInt(ff.loadItem(id, 0));
                            var tc = new Date().getTime();
                            tywx.tt.log('isCanShare2GroupByTicket==>openGId', id, typeof id === 'undefined' ? 'undefined' : _typeof(id));
                            if (tc - t0 >= 8 * 60 * 60 * 1000) {
                                ff.saveItem(id, tc, true);
                                call_succ();
                            } else {
                                call_fail();
                            }
                        } else {
                            call_fail();
                        }
                    } catch (e) {
                        tywx.tt.log("share::", e);
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
                tywx.tt.log("decrypt", " catch error: " + err);
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
         * @param {string} [confirm_txt='确定']
         * @param {string} [cancle_txt='取消']
         */

    }, {
        key: 'showWXModal',
        value: function showWXModal(content) {
            var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '提示';
            var show_cancel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var sure_cb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
            var cancle_cb = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
            var confirm_txt = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '确定';
            var cancle_txt = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '取消';

            wx.showModal({
                title: title,
                content: content,
                showCancel: show_cancel,
                confirmText: confirm_txt,
                cancelText: cancle_txt,
                success: function success(res) {
                    if (res.confirm) {
                        tywx.tt.log('用户点击确定');
                        sure_cb && sure_cb();
                    } else if (res.cancel) {
                        tywx.tt.log('用户点击取消');
                        cancle_cb && cancle_cb();
                    }
                }
            });
        }
        /**
         * @description 显示游戏圈
         * @author lu ning
         * @date 2018-09-05
         * @static
         */

    }, {
        key: 'showGameClub',
        value: function showGameClub() {
            if (!GameClubBtn && wx.createGameClubButton) {
                GameClubBtn = wx.createGameClubButton({
                    icon: 'green',
                    style: {
                        left: 10,
                        top: 30,
                        width: 40,
                        height: 40
                    }
                });
            }
            GameClubBtn.show();
        }
        /**
         * @description 隐藏游戏圈
         * @author lu ning
         * @date 2018-09-05
         * @static
         */

    }, {
        key: 'hideGameClub',
        value: function hideGameClub() {
            if (GameClubBtn) {
                GameClubBtn.hide();
            }
        }

        /**
         * @description 创建并显示微信Banner广告, IsHideBanner=false到时候创建成功也不会显示
         * @author lu ning
         * @date 2018-09-06
         * @static
         * @returns
         */

    }, {
        key: 'createAndcreateAndShowWXBanner',
        value: function createAndcreateAndShowWXBanner() {
            if (!window.wx) return; //! 防止浏览器中报错
            if (!wx.createBannerAd) return; //! 玩家基础库不支持
            tywx.tt.Utils.destroyWXBanner();
            var sys_info = wx.getSystemInfoSync();
            var s_w = sys_info.screenWidth;
            var s_h = sys_info.screenHeight; // 220
            // ! 强制适配,主要是ipx有问题
            var is_ipx = tywx.tt.Utils.isIpx();
            // ! 强制适配 pad(宽屏设备)
            var is_pad = tywx.tt.Utils.isPad();
            WXBannerAD = wx.createBannerAd({
                adUnitId: tywx.tt.constants.WXAdConfig.bannerId,
                style: {
                    left: 0,
                    top: 0,
                    width: is_ipx ? s_w * 0.88 : is_pad ? s_w * 0.6 : s_w * 0.95
                }
            });

            try {
                WXBannerAD.onResize(function (res) {
                    tywx.tt.log(IsHideBanner + !IsHideBanner + 'showBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
                    if (WXBannerAD) {
                        var top = s_h - res.height - 5; //is_ipx ? s_h - res.height + 50 : s_h - res.height - 5;
                        WXBannerAD.style.left = (s_w - res.width) / 2;
                        WXBannerAD.style.top = top;
                        //res.width             = is_ipx ? s_w * 0.8 : s_w * 0.9;
                        //res.height            = s_h * 0.13;
                    }
                });
            } catch (e) {
                tywx.tt.log(e);
            }
            // * 隐藏状态不显示banner
            if (WXBannerAD && !IsHideBanner) WXBannerAD.show();
        }
        /**
         * @description 隐藏Banner广告,隐藏后，若需要显示，必须调用showWXBanner()
         * @author lu ning
         * @date 2018-09-06
         * @static
         */

    }, {
        key: 'hideWXBanner',
        value: function hideWXBanner() {
            if (WXBannerAD) {
                WXBannerAD.hide();
            }
            IsHideBanner = true;
        }
        /**
         * @description 显示Banner广告
         * @author lu ning
         * @date 2018-09-06
         * @static
         */

    }, {
        key: 'showWXBanner',
        value: function showWXBanner() {
            if (WXBannerAD) {
                WXBannerAD.show();
            }
            IsHideBanner = false;
        }
        /**
         * @description 销毁Banner
         * @author lu ning
         * @date 2018-09-06
         * @static
         */

    }, {
        key: 'destroyWXBanner',
        value: function destroyWXBanner() {
            if (WXBannerAD) {
                WXBannerAD.hide();
                WXBannerAD.destroy();
                WXBannerAD = null;
            }
            tywx.tt.log("主页退出2 " + WXBannerAD);
        }
        /**
         * @description 显示视频广告
         * @author lu ning
         * @date 2018-09-06
         * @static
         * @param {Object} params
         * @param {Function} params.success
         * @param {Function} params.fail
         * @param {Function} params.error_callback
         */

    }, {
        key: 'showWXVideo',
        value: function showWXVideo(params) {
            if (!window.wx) return; //! 防止浏览器中报错
            if (!wx.createRewardedVideoAd) return; //! 玩家基础库不支持
            if (!WXVedioAD) {
                WXVedioAD = wx.createRewardedVideoAd({
                    adUnitId: tywx.tt.constants.WXAdConfig.vedioId
                });
                WXVedioAD.onClose(function (res) {
                    var toast_str = '';
                    if (res && res.isEnded || res === undefined) {
                        toast_str = '视频观看成功';
                        WXVedioCallback.success && WXVedioCallback.success();
                    } else {
                        toast_str = '视频观看失败';
                        WXVedioCallback.fail && WXVedioCallback.fail();
                    }
                    // tywx.tt.Utils.showWXModal(`${toast_str}`);
                    tywx.tt.Utils.showWXBanner();
                });
            }
            // * 成功和失败回调是变化的
            WXVedioCallback.success = params.success;
            WXVedioCallback.fail = params.fail;
            WXVedioCallback.err_cb = params.error_callback || null;

            WXVedioAD.load().then(function () {
                return WXVedioAD.show();
            }).catch(function (e) {
                tywx.tt.log(e);
                var lucky_rate = tywx.tt.Configs.LuckyUserRate || 50;
                if (Math.random() * 100 <= lucky_rate) {
                    WXVedioCallback.err_cb && WXVedioCallback.err_cb();
                } else {
                    tywx.tt.Utils.showWXModal("获取视频失败");
                }
            });
            tywx.tt.Utils.hideWXBanner();
        }
        /**
         * @description 通用缩放动画
         * @author lu ning
         * @date 2018-09-06
         * @static
         * @param {cc.Node} node
         */

    }, {
        key: 'commonScaleIn',
        value: function commonScaleIn(node) {
            if (!node) return;
            node.runAction(cc.sequence(cc.scaleTo(0.08, 0.95).easing(cc.easeIn(3.0)), cc.scaleTo(0.12, 1.1).easing(cc.easeIn(3.0)), cc.scaleTo(0.08, 1).easing(cc.easeIn(3.0))));
        }
        /**
         * @description 是否是iphoneX
         * @author lu ning
         * @date 2018-09-07
         * @static
         * @returns
         */

    }, {
        key: 'isIpx',
        value: function isIpx() {
            var ret = false;
            var sys_info = wx.getSystemInfoSync();
            if (sys_info.model.indexOf('iPhone X') >= 0 || sys_info.system.indexOf('iOS') >= 0 && sys_info.windowHeight / sys_info.windowWidth > 1.9) {
                return true;
            }
            return ret;
        }
        /**
         * @description 根据url刷新sprite
         * @author lu ning
         * @date 2018-09-08
         * @static
         * @param {cc.Sprite} sprite
         * @param {String} url
         */

    }, {
        key: 'refreshSpriteByUrl',
        value: function refreshSpriteByUrl(sprite, url, size) {
            cc.loader.load(url, function (err, texture) {
                if (!err) {
                    var new_sprite_frame = new cc.SpriteFrame(texture);
                    sprite.spriteFrame = new_sprite_frame;
                    if (size) {
                        sprite.node.setContentSize(size);
                    }
                    tywx.tt.log("刷新CDN图片成功");
                }
            });
        }
        /**
         * @description
         * @author lu ning
         * @date 2018-09-17
         * @static
         * @param {Function} btn_sure_cb
         * @param {string} content
         */

    }, {
        key: 'showErrorGfitPop',
        value: function showErrorGfitPop(btn_sure_cb, content) {
            cc.loader.loadRes('prefabs/ado_view_error_gift', function (err, prefab) {
                if (!err) {
                    var size = cc.winSize;
                    var prefabNode = cc.instantiate(prefab);
                    cc.game.addPersistRootNode(prefabNode);
                    prefabNode.position = cc.v2(size.width / 2, size.height / 2);
                    prefabNode.getComponent('ado_view_error_gift').init(btn_sure_cb, content);
                }
            });
        }
        /**
         * @description 获取红包,获取本次加红包的信息，
         *     调用requestAddRedPacket接口后才能真正的加上
         * @author lu ning
         * @date 2018-09-18
         * @static
         * @param {Object} params
         * @param {Function} params.success
         * @param {Function} params.fail
         */

    }, {
        key: 'requestRedPacket',
        value: function requestRedPacket(params) {
            tywx.tt.log('redpacket', 'requestRedPacket start');
            try {
                wx.request({
                    url: tywx.SystemInfo.loginUrl + 'api/huanlejiayi/redenvelop/getinfo',
                    data: {
                        userId: tywx.UserInfo.userId,
                        clientId: tywx.SystemInfo.clientId,
                        authorCode: tywx.UserInfo.authorCode,
                        deviceInfo: tywx.SystemInfo.deviceId,
                        name: tywx.UserInfo.userName,
                        rand: Math.random() * 1000000
                    },
                    //method:"POST",
                    success: function success(res) {
                        tywx.tt.log('redpacket', 'requestRedPacket==success', JSON.stringify(res));
                        if (res.data) {
                            var red_packet = {
                                current: tywx.tt.Utils.formatCashFen2Yuan(res.data.nextAmount), // 本次获取的金额
                                max: tywx.tt.Utils.formatCashFen2Yuan(res.data.totalAmount), // 总共金额
                                times: res.data.needShare ? 3 : 1, // 1,2 ==> 确定，直接领取，>= 3分享或看视频领取
                                is_share: res.data.needShare
                            };
                            tywx.tt.RedPacketInfo = res.data;
                            params.success && params.success(red_packet);
                            tywx.tt.Utils.uploadErrorMsg('redpacket;requestRedPacket==success;' + JSON.stringify(res));
                        } else {
                            if (res.data && res.data.nextAmount === 0) {
                                tywx.tt.RedPacketInfo = res.data;
                            }
                            params.fail && params.fail(-1);
                            tywx.tt.Utils.uploadErrorMsg('redpacket;requestRedPacket==success---fail;' + JSON.stringify(res));
                        }
                    },
                    fail: function fail(res) {
                        params.fail && params.fail(-1);
                        tywx.tt.log('redpacket', 'requestRedPacket==fail', JSON.stringify(res));
                        tywx.tt.Utils.uploadErrorMsg('redpacket;requestRedPacket==fail;' + JSON.stringify(res));
                    }
                });
            } catch (e) {
                params.fail && params.fail(-1);
                tywx.tt.log('redpacket', 'requestRedPacket==error', JSON.stringify(e));
                tywx.tt.Utils.uploadErrorMsg('redpacket;requestRedPacket==error;' + e.message);
            }
        }
        /**
         * @description 请求加红包
         * @param {Object} params
         * @param {Function} params.success
         * @param {Function} params.fail
         * @author lu ning
         * @date 2018-09-18
         * @static
         */

    }, {
        key: 'requestAddRedPacket',
        value: function requestAddRedPacket(params) {
            tywx.tt.log('redpacket', 'requestAddRedPacket start');

            try {
                wx.request({
                    url: tywx.SystemInfo.loginUrl + 'api/huanlejiayi/redenvelop/add',
                    data: {
                        userId: tywx.UserInfo.userId, // tywx.UserInfo.userId
                        clientId: tywx.SystemInfo.clientId,
                        authorCode: tywx.UserInfo.authorCode,
                        deviceInfo: tywx.SystemInfo.deviceId,
                        name: tywx.UserInfo.userName,
                        rand: Math.random() * 1000000
                    },
                    //method:"POST",
                    success: function success(res) {
                        // * 加红包成功
                        tywx.tt.log('redpacket', 'requestAddRedPacket==success', JSON.stringify(res));
                        if (res.data && res.data.addAmount > 0) {
                            var addAmount = tywx.tt.Utils.formatCashFen2Yuan(res.data.addAmount);
                            tywx.tt.RedPacketInfo.totalAmount += res.data.addAmount;
                            params.success && params.success(addAmount);
                            tywx.NotificationCenter.trigger(tywx.tt.events.TT_EVENT_RED_PACKET_CHANGE, res);
                        } else {
                            tywx.tt.Utils.showWXModal('加红包失败', '提示', false);
                            params.fail && params.fail();
                            tywx.tt.Utils.uploadErrorMsg('redpacket;requestAddRedPacket==success---fail;' + JSON.stringify(res));
                        }
                    },
                    fail: function fail(res) {
                        // * 加红包失败
                        tywx.tt.log('redpacket', 'requestAddRedPacket==fail', JSON.stringify(res));
                        tywx.tt.Utils.showWXModal('加红包失败', '提示', false);
                        params.fail && params.fail();
                        tywx.tt.Utils.uploadErrorMsg('redpacket;requestAddRedPacket==fail;' + JSON.stringify(res));
                    }
                });
            } catch (e) {
                // * 加红包报错
                tywx.tt.log('redpacket', 'requestAddRedPacket==error', JSON.stringify(e));
                tywx.tt.Utils.showWXModal('加红包失败', '提示', false);
                tywx.tt.Utils.uploadErrorMsg('redpacket;requestAddRedPacket==error;' + e.message);
            }
        }
        /**
         * @description 请求提现
         * @author lu ning
         * @date 2018-09-18
         * @static
         */

    }, {
        key: 'requestRedPacket2Cash',
        value: function requestRedPacket2Cash() {
            tywx.tt.log('redpacket', 'requestRedPacket2Cash start');
            try {
                wx.request({
                    url: tywx.SystemInfo.loginUrl + 'api/huanlejiayi/redenvelop/transfer',
                    data: {
                        userId: tywx.UserInfo.userId,
                        clientId: tywx.SystemInfo.clientId,
                        authorCode: tywx.UserInfo.authorCode,
                        deviceInfo: tywx.SystemInfo.deviceId,
                        name: tywx.UserInfo.userName,
                        rand: Math.random() * 1000000
                    },
                    // method:"POST",
                    success: function success(res) {
                        // * 提现成功
                        tywx.tt.log('redpacket', 'requestRedPacket2Cash==success', JSON.stringify(res));
                        if (res.data) {
                            tywx.tt.Utils.showWXModal(tywx.tt.constants.WXTransferRedPacketError[res.data.code], '提示', false);
                            if (res.data.code !== 0) {
                                tywx.tt.Utils.uploadErrorMsg('redpacket;requestRedPacket2Cash==success--error-0;' + JSON.stringify(res));
                            } else {
                                tywx.tt.RedPacketInfo.totalAmount = 0;
                                tywx.NotificationCenter.trigger(tywx.tt.events.TT_EVENT_RED_PACKET_CHANGE, res);
                            }
                        } else {
                            // * 未知错误
                            tywx.tt.Utils.uploadErrorMsg('redpacket;requestRedPacket2Cash==success--error-1;' + JSON.stringify(res));
                        }
                    },
                    fail: function fail(res) {
                        // * 提现失败
                        //params.fail && params.fail(0);
                        tywx.tt.Utils.showWXModal('提现请求失败，请稍后再试', '提示', false);
                        tywx.tt.log('redpacket', 'requestRedPacket2Cash==fail', JSON.stringify(res));
                        tywx.tt.Utils.uploadErrorMsg('redpacket;requestRedPacket2Cash==fail;' + JSON.stringify(res));
                    }
                });
            } catch (e) {
                // * 提现失败
                //params.fail && params.fail(0);
                tywx.tt.Utils.showWXModal('提现请求失败，请稍后再试', '提示', false);
                tywx.tt.log('redpacket', 'requestRedPacket2Cash==fail', JSON.stringify(e));
                tywx.tt.Utils.uploadErrorMsg('redpacket;requestRedPacket2Cash==error;' + e.message);
            }
        }
        /**
         * @description 请求每日登陆信息
         * @author lu ning
         * @date 2018-09-24
         * @param {Object} params
         * @param {Function} params.success
         * @param {Function} params.fail
         * @param {Function} params.error
         * @static
         */

    }, {
        key: 'requestEveryLoginInfo',
        value: function requestEveryLoginInfo(params) {
            try {
                wx.request({
                    url: tywx.SystemInfo.loginUrl + 'api/huanlejiayi/everydaylogin/getinfo',
                    data: {
                        userId: tywx.UserInfo.userId,
                        clientId: tywx.SystemInfo.clientId,
                        authorCode: tywx.UserInfo.authorCode,
                        deviceInfo: tywx.SystemInfo.deviceId,
                        name: tywx.UserInfo.userName,
                        rand: Math.random() * 1000000
                    },
                    // method:"POST",
                    success: function success(res) {
                        // * 获取每日登陆信息成功
                        tywx.tt.log('redpacket', 'requestEveryLoginInfo==success', JSON.stringify(res));
                        if (res.data) {
                            if (res.data.code !== 0) {
                                tywx.tt.Utils.showWXModal(tywx.tt.constants.WXTransferRedPacketError[res.data.code], '提示', false);
                                tywx.tt.Utils.uploadErrorMsg('redpacket;requestEveryLoginInfo==success--error-0;' + JSON.stringify(res));
                            } else {
                                tywx.tt.EveryDataLoginInfo = res.data;
                                params.success && params.success();
                            }
                        } else {
                            // * 未知错误
                            tywx.tt.Utils.uploadErrorMsg('redpacket;requestEveryLoginInfo==success--error-1;' + JSON.stringify(res));
                        }
                    },
                    fail: function fail(res) {
                        // * 获取每日登陆信息失败
                        params.fail && params.fail();
                        tywx.tt.log('redpacket', 'requestEveryLoginInfo==fail', JSON.stringify(res));
                        tywx.tt.Utils.uploadErrorMsg('redpacket;requestEveryLoginInfo==fail;' + JSON.stringify(res));
                    }
                });
            } catch (e) {
                // * 提现失败
                tywx.tt.log('redpacket', 'requestEveryLoginInfo==error', JSON.stringify(e));
                tywx.tt.Utils.uploadErrorMsg('redpacket;requestEveryLoginInfo==error;' + e.message);
            }
        }
        /**
         * @description 请求获得每日登陆奖励
         * @author lu ning
         * @date 2018-09-24
         * @static
         * @param {Object} params
         * @param {Function} params.success
         * @param {Function} params.fail
         * @param {boolean} params.double
         */

    }, {
        key: 'requestEveryLoginReward',
        value: function requestEveryLoginReward(params) {
            try {
                wx.request({
                    url: tywx.SystemInfo.loginUrl + 'api/huanlejiayi/everydaylogin/reward',
                    data: {
                        userId: tywx.UserInfo.userId,
                        clientId: tywx.SystemInfo.clientId,
                        authorCode: tywx.UserInfo.authorCode,
                        deviceInfo: tywx.SystemInfo.deviceId,
                        name: tywx.UserInfo.userName,
                        double: params.double ? 1 : 0,
                        rand: Math.random() * 1000000
                    },
                    // method:"POST",
                    success: function success(res) {
                        // * 请求每日登陆奖励成功
                        tywx.tt.log('redpacket', 'requestEveryLoginReward==success', JSON.stringify(res));
                        if (res.data) {
                            if (res.data.code !== 0) {
                                tywx.tt.Utils.showWXModal(tywx.tt.constants.WXTransferRedPacketError[res.data.code], '提示', false);
                                tywx.tt.Utils.uploadErrorMsg('redpacket;requestEveryLoginReward==success--error-0;' + JSON.stringify(res));
                            } else {
                                //tywx.tt.EveryDataLoginInfo = res.data;
                                var addAmount = tywx.tt.EveryDataLoginInfo.amounts[tywx.tt.EveryDataLoginInfo.count - 1];
                                addAmount = params.double ? addAmount * 2 : addAmount;
                                tywx.tt.RedPacketInfo.totalAmount += addAmount;
                                tywx.NotificationCenter.trigger(tywx.tt.Events.ADO_EVENT_RED_PACKET_CHANGE, null);
                                params.success && params.success(addAmount);
                            }
                        } else {
                            // * 未知错误
                            tywx.tt.Utils.uploadErrorMsg('redpacket;requestEveryLoginReward==success--error-1;' + JSON.stringify(res));
                        }
                    },
                    fail: function fail(res) {
                        // * 请求每日登陆奖励失败
                        params.fail && params.fail();
                        tywx.tt.log('redpacket', 'requestEveryLoginReward==fail', JSON.stringify(res));
                        tywx.tt.Utils.uploadErrorMsg('redpacket;requestEveryLoginReward==fail;' + JSON.stringify(res));
                    }
                });
            } catch (e) {
                // * 请求每日登陆奖励失败
                tywx.tt.log('redpacket', 'requestEveryLoginInfo==error', JSON.stringify(e));
                tywx.tt.Utils.uploadErrorMsg('redpacket;requestEveryLoginInfo==error;' + e.message);
            }
        }
        /**
         * @description 上报邀请信息
         * @author lu ning
         * @date 2018-09-26
         * @param {Number} inviteId
         * @static
         */

    }, {
        key: 'requestInviteLogin',
        value: function requestInviteLogin(inviteId) {
            try {
                wx.request({
                    url: tywx.SystemInfo.loginUrl + 'api/huanlejiayi/invite/login',
                    data: {
                        userId: tywx.UserInfo.userId,
                        clientId: tywx.SystemInfo.clientId,
                        authorCode: tywx.UserInfo.authorCode,
                        deviceInfo: tywx.SystemInfo.deviceId,
                        name: tywx.UserInfo.userName,
                        rand: Math.random() * 1000000,
                        inviteId: inviteId
                    },
                    // method:"POST",
                    success: function success(res) {
                        // * 上报邀请信息
                        tywx.tt.log('invite', 'requestInviteLogin==success', JSON.stringify(res));
                        if (res.data) {
                            if (res.data.code !== 0) {
                                // tywx.tt.Utils.showWXModal(
                                //     tywx.tt.constants.WXTransferRedPacketError[res.data.code],
                                //     '提示',
                                //     false);
                                tywx.tt.Utils.uploadErrorMsg('invite;requestInviteLogin==success--error-0;' + JSON.stringify(res));
                            } else {
                                tywx.tt.log('invite requestInviteLogin success');
                            }
                        } else {
                            // * 未知错误
                            tywx.tt.Utils.uploadErrorMsg('invite;requestInviteLogin==success--error-1;' + JSON.stringify(res));
                        }
                    },
                    fail: function fail(res) {
                        // * 请求每日登陆奖励失败
                        tywx.tt.log('invite', 'requestInviteLogin==fail', JSON.stringify(res));
                        tywx.tt.Utils.uploadErrorMsg('invite;requestInviteLogin==fail;' + JSON.stringify(res));
                    }
                });
            } catch (e) {
                // * 请求每日登陆奖励失败
                tywx.tt.log('invite', 'requestInviteLogin==error', JSON.stringify(e));
                tywx.tt.Utils.uploadErrorMsg('invite;requestInviteLogin==error;' + e.message);
            }
        }
        /**
         * @description 请求邀请信息
         * @author lu ning
         * @date 2018-09-26
         * @static
         */

    }, {
        key: 'requestInviteGetInfo',
        value: function requestInviteGetInfo(params) {
            try {
                wx.request({
                    url: tywx.SystemInfo.loginUrl + 'api/huanlejiayi/invite/getinfo',
                    data: {
                        userId: tywx.UserInfo.userId,
                        clientId: tywx.SystemInfo.clientId,
                        authorCode: tywx.UserInfo.authorCode,
                        deviceInfo: tywx.SystemInfo.deviceId,
                        name: tywx.UserInfo.userName,
                        rand: Math.random() * 1000000
                    },
                    // method:"POST",
                    success: function success(res) {
                        // * 上报邀请信息
                        tywx.tt.log('invite', 'requestInviteGetInfo==success', JSON.stringify(res));
                        if (res.data) {
                            if (res.data.code !== 0) {
                                tywx.tt.Utils.showWXModal(tywx.tt.constants.WXTransferRedPacketError[res.data.code], '提示', false);
                                tywx.tt.Utils.uploadErrorMsg('invite;requestInviteGetInfo==success--error-0;' + JSON.stringify(res));
                                params.fail && params.fail();
                            } else {
                                tywx.tt.log('invite requestInviteGetInfo success');
                                tywx.tt.InviteInfo = res.data;
                                params.success && params.success();
                                if (tywx.tt.InviteInfo.reward) tywx.tt.hpvalue = 6;
                            }
                        } else {
                            // * 未知错误
                            tywx.tt.Utils.uploadErrorMsg('invite;requestInviteGetInfo==success--error-1;' + JSON.stringify(res));
                            params.fail && params.fail();
                        }
                    },
                    fail: function fail(res) {
                        // * 请求每日登陆奖励失败
                        tywx.tt.log('invite', 'requestInviteGetInfo==fail', JSON.stringify(res));
                        tywx.tt.Utils.uploadErrorMsg('invite;requestInviteGetInfo==fail;' + JSON.stringify(res));
                        params.fail && params.fail();
                    }
                });
            } catch (e) {
                // * 请求每日登陆奖励失败
                tywx.tt.log('invite', 'requestInviteGetInfo==error', JSON.stringify(e));
                tywx.tt.Utils.uploadErrorMsg('invite;requestInviteGetInfo==error;' + e.message);
                params.fail && params.fail();
            }
        }
        /**
         * @description 请求邀请奖励
         * @author lu ning
         * @date 2018-09-26
         * @static
         */

    }, {
        key: 'requestInviteReward',
        value: function requestInviteReward() {
            try {
                wx.request({
                    url: tywx.SystemInfo.loginUrl + 'api/huanlejiayi/invite/reward',
                    data: {
                        userId: tywx.UserInfo.userId,
                        clientId: tywx.SystemInfo.clientId,
                        authorCode: tywx.UserInfo.authorCode,
                        deviceInfo: tywx.SystemInfo.deviceId,
                        name: tywx.UserInfo.userName,
                        rand: Math.random() * 1000000
                    },
                    // method:"POST",
                    success: function success(res) {
                        // * 上报邀请信息
                        tywx.tt.log('invite', 'requestInviteReward==success', JSON.stringify(res));
                        if (res.data) {
                            if (res.data.code !== 0) {
                                tywx.tt.Utils.showWXModal(tywx.tt.constants.WXTransferRedPacketError[res.data.code], '提示', false);
                                tywx.tt.Utils.uploadErrorMsg('invite;requestInviteReward==success--error-0;' + JSON.stringify(res));
                            } else {
                                tywx.tt.log('invite requestInviteReward success');
                                tywx.tt.InviteInfo.reward = true;
                                tywx.tt.hpvalue = 6;
                                tywx.tt.Utils.showWXModal("领取成功", '提示', false);
                            }
                        } else {
                            // * 未知错误
                            tywx.tt.Utils.uploadErrorMsg('invite;requestInviteReward==success--error-1;' + JSON.stringify(res));
                        }
                    },
                    fail: function fail(res) {
                        // * 请求每日登陆奖励失败
                        tywx.tt.log('invite', 'requestInviteReward==fail', JSON.stringify(res));
                        tywx.tt.Utils.uploadErrorMsg('invite;requestInviteReward==fail;' + JSON.stringify(res));
                    }
                });
            } catch (e) {
                // * 请求每日登陆奖励失败
                tywx.tt.log('invite', 'requestInviteReward==error', JSON.stringify(e));
                tywx.tt.Utils.uploadErrorMsg('invite;requestInviteReward==error;' + e.message);
            }
        }

        /**
         * @description 现金转换==>分 to 元
         * @author lu ning
         * @date 2018-09-18
         * @static
         * @param {Number} cash 分为单位
         * @returns {Number}
         */

    }, {
        key: 'formatCashFen2Yuan',
        value: function formatCashFen2Yuan(cash) {
            var ret = 0;
            ret = cash / 100;
            return ret;
        }
        /**
         * @description 显示提现弹窗
         * @author lu ning
         * @date 2018-09-19
         * @static
         * @param {string} [current_cash=null]
         */

    }, {
        key: 'showRedPacketTransferPop',
        value: function showRedPacketTransferPop() {
            var current_cash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            cc.loader.loadRes('prefabs/red_packet_tansfer', function (err, prefab) {
                if (!err) {
                    var pop = cc.instantiate(prefab);
                    pop.parent = cc.director.getScene();
                    pop.getComponent('red_packet_transfer').init(current_cash);
                }
            });
        }
        /**
         * @description 获取弹窗根节点
         * @author lu ning
         * @date 2018-09-19
         * @static
         * @returns
         */

    }, {
        key: 'getPopRoot',
        value: function getPopRoot() {
            var scene = cc.director.getScene();
            var pop_root = scene.getChildByName('Canvas').getChildByName('pop');
            return pop_root;
        }
        /**
         * @description 简单的贝塞尔曲线
         * @author lu ning
         * @date 2018-09-19
         * @static
         * @param {cc.Node} node
         * @param {cc.Vec2} end
         * @param {Function} end_callback
         */

    }, {
        key: 'simpleBezierAction',
        value: function simpleBezierAction(node, end, end_callback) {
            //let sp        = node.position;
            //let ep        = end;
            // let dist      = Math.sqrt((sp.x - ep.x) * (sp.x - ep.x) + (sp.y - ep.y) * (sp.y - ep.y));//cc.pDistance(sp,ep);
            // //cc.pSub();
            // let normalPos = eq.sub(sp).normalizeSelf();//cc.pSub(ep,sp).normalizeSelf();
            // let cfg = [cc.v2(sp.x + 30, sp.y + normalPos.y * dist / 2),
            //            cc.v2(sp.x + normalPos.x * dist / 4 * 3, sp.y + normalPos.y * dist / 4 * 3),
            //            ep];
            if (node) {
                node.runAction(cc.sequence(cc.moveTo(0.8, end).easing(cc.easeSineIn()), cc.callFunc(function () {
                    end_callback && end_callback();
                })));
            }
        }
        /**
         * @description 是否是平板
         * @author lu ning
         * @date 2018-09-20
         * @static
         */

    }, {
        key: 'isPad',
        value: function isPad() {
            var ret = false;
            var sys_info = wx.getSystemInfoSync();
            if (sys_info.windowHeight / sys_info.windowWidth < 1.777) {
                return true;
            }
            return ret;
        }
        /**
         * @description 通过appid获取游戏交叉导流信息
         * @author lu ning
         * @date 2018-09-29
         * @static
         * @param {String} wx_app_id
         */

    }, {
        key: 'getCrossAdConfigByAppId',
        value: function getCrossAdConfigByAppId(wx_app_id) {
            var ret = null;
            var list = tywx.AdManager.rawAdInfoList;
            for (var i = 0; i < list.length; ++i) {
                var tmp_c = list[i];
                if (tmp_c.toappid === wx_app_id) {
                    ret = tmp_c;
                    break;
                }
            }
            return ret;
        }
        /**
         * @description 游戏跳转
         * @author lu ning
         * @date 2018-09-29
         * @static
         * @param {*} config
         * @returns
         */

    }, {
        key: 'jump2MiniProgramByConfig',
        value: function jump2MiniProgramByConfig(config) {
            try {

                // this.genRandomSecondAdInfo();

                //先尝试直接跳转
                var skip_type = config.icon_skip_type;
                var toappid = config.toappid;
                var togame = config.togame;
                var topath = config.path;
                var second_toappid = config.second_toappid;

                tywx.tt.log('topath ====>' + topath);

                var that = this;

                var icon_id = config.icon_id;
                var config_id = '0';
                var webpage_url = '';
                var webpage_id = '0';

                var bi_paramlist = [icon_id, config_id, webpage_url, toappid, togame, webpage_id, that.adType];

                tywx.tt.log('bi_paramlist ====> ' + JSON.stringify(bi_paramlist));

                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickAdBtn, bi_paramlist);

                //! 先尝试直接跳转
                if (wx && wx.navigateToMiniProgram) {

                    if (1 === skip_type) {

                        wx.navigateToMiniProgram({
                            appId: toappid,
                            path: topath ? topath : '?from=adcross',
                            envVersion: 'release',
                            extraData: {
                                from: topath ? topath : '?from=adcross'
                            },
                            success: function success(res) {

                                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);

                                tywx.tt.log('wx.navigateToMiniProgram success');
                                tywx.tt.log(res);
                            },
                            fail: function fail(res) {
                                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                                tywx.tt.log('wx.navigateToMiniProgram fail');
                                tywx.tt.log(res);
                            },
                            complete: function complete(res) {
                                tywx.tt.log('navigateToMiniProgram ==== complete');
                                //that.resetBtnIcon();
                            }
                        });

                        return;
                    } else if (2 === skip_type) {
                        wx.navigateToMiniProgram({
                            appId: second_toappid,
                            path: topath ? topath : '?from=adcross',
                            envVersion: 'release',
                            extraData: {
                                from: topath ? topath : '?from=adcross'
                            },
                            success: function success(res) {
                                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);
                                tywx.tt.log('wx.navigateToMiniProgram success');
                                tywx.tt.log(res);
                            },
                            fail: function fail(res) {
                                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                                tywx.tt.log('wx.navigateToMiniProgram fail');
                                tywx.tt.log(res);
                            },
                            complete: function complete(res) {
                                //that.resetBtnIcon();
                                tywx.tt.log('navigateToMiniProgram ==== complete');
                            }
                        });
                    } else {
                        console.error('Unsupported skip type! Please Check!');
                    }

                    return;
                }
            } catch (err) {
                tywx.tt.log("error:", "tywx.AdManager.onClickAdIconBtn——" + JSON.stringify(err));
            }
        }
        /**
         * @description 是否是敏感ip
         * @author lu ning
         * @date 2018-09-30
         * @static
         * @param {Object} ip_info
         * @returns
         */

    }, {
        key: 'isMinGanIp',
        value: function isMinGanIp(ip_info) {
            var ret = false;
            console.log(ip_info.loc.length + "敏感IP信息 = " + JSON.stringify(ip_info));
            var MinGanIpInfo = tywx.tt.Configs.MinGanIp || tywx.tt.constants.MinGanIp;
            if (ip_info.loc && ip_info.loc.length > 0) {
                for (var i = 0; i < MinGanIpInfo.length; ++i) {
                    var info = MinGanIpInfo[i];
                    if (ip_info.loc[1] === info[0]) {
                        if (info[1].length === 0) {
                            // * 没有指定城市，只指定了省份，那么就是屏蔽整个省
                            ret = true;
                        } else {
                            var lock_city = info[1];
                            if (lock_city.indexOf(ip_info.loc[2]) >= 0) {
                                ret = true;
                                break;
                            }
                        }
                    }
                }
            }
            tywx.tt.log('MINGAN_IP...' + ret);
            return ret;
        }
    }, {
        key: 'sendWXMsg',
        value: function sendWXMsg(msg) {
            if (!window.wx) {
                return;
            }
            wx.postMessage(msg);
        }
    }, {
        key: 'shareVideoCtr',
        value: function shareVideoCtr(share_control) {
            var random = parseInt(Math.random() * 100);
            // 看视频的情况 默认是视频或者敏感IP 并且能看视频
            var calltype = 1;
            if ((share_control[0] === "video" || tywx.tt.isMinGanIP) && tywx.tt.isCanWatchVideo) {
                calltype = 2;
                if (random > share_control[1]) {
                    calltype = 1;
                }
            } else if (share_control[0] === "share") {
                calltype = 1;
                if (random > share_control[1] && tywx.tt.isCanWatchVideo) {
                    calltype = 2;
                }
            }
            return calltype;
        }
    }]);

    return Utils;
}();

module.exports = Utils;

cc._RF.pop();