let crypto = require('crypto');
let GameClubBtn = null; // * 游戏圈按钮
let WXBannerAD = null; // * 微信banner广告
let IsHideBanner = false; // * 是否显示Banner
let WXVedioAD = null; // * 微信Vedio广告
let WXVedioCallback = {
    success: null,
    fail: null,
    err_cb: null,
}; // * 微信vedio回调
let Utils = class {
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
    static createAndSaveImg2WXAlbum(params) {
        canvas.toTempFilePath({
            x: params.x,
            y: params.y,
            width: params.w,
            height: params.h,
            destWidth: params.w,
            destHeight: params.h,
            success: function success(res) {
                console.log(res);

                Utils.saveImage2PhoneByUrl(res.tempFilePath, params.success, params.fail);
            },
            fail: function fail(res) {
                // self.title.active = true;
                params.fail && params.fail();
            }
        });
    }

    static saveImage2PhoneByUrl(url, cb_success, cb_fail) {
        let saveImg2Phone = () => {
            if (!wx.saveImageToPhotosAlbum) {
                cb_fail();
                return;
            }

            wx.saveImageToPhotosAlbum({
                filePath: url,
                success: (res) => {
                    cb_success();
                },
                fail: (res) => {
                    cb_fail();
                }
            });
        };
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: "scope.writePhotosAlbum",
                        success: function () {
                            saveImg2Phone();
                        },
                        fail: function () {
                            if (wx.openSetting) {
                                wx.openSetting({
                                    success: (res) => {
                                        console.log('success', res);
                                        if (res.authSetting['scope.writePhotosAlbum']) {
                                            saveImg2Phone();
                                        } else {
                                            cb_fail();
                                        }
                                    },
                                    fail: (res) => {
                                        console.log('fail', res);
                                        cb_fail();
                                    }
                                });
                            } else {
                                cb_fail();
                            }
                        },
                        complete: function () {}
                    });
                } else {
                    saveImg2Phone();
                }
            },
            fail: (res) => {
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
    static delItem(key) {
        cc.sys.localStorage.removeItem(key);
        //localValues.delete(key);
        if (!ty.isInWXChat)
            return;
        wx.removeUserCloudStorage({
            keyList: [key],
            success: (msg) => {
                console.log('removeObjectCloud  ' + key + ' succeeds', msg);
            },
            fail: (msg) => {
                console.log('removeObjectCloud  ' + key + ' fails', msg);
            },
        });
    }

    static uploadErrorMsg(msg) {
        let time = new Date();
        let err_obj = {
            "cloud_id": ty.SystemInfo.cloudId,
            "time": time.toDateString(),
            "client_id": ty.SystemInfo.clientId,
            "user_id": ty.UserInfo.userId,
            "sys_version": ty.UserInfo.system,
            "mobile_models": ty.UserInfo.model,
            "baseVersion": "0",
            "wxVersion": ty.UserInfo.wechatType,
            "clientVersion": ty.SystemInfo.version,
            "Nettype": ty.StateInfo.networkType,
            "ip": ty.UserInfo.ip,
            "errMsg": msg
        };
        //let err_str = String(err_obj);
        if (err_obj) {
            var header = {
                'Content-Type': 'text/plain'
            };
            var configObj = {
                'url': ty.SystemInfo.errorTxtServer,
                'header': header,
                'postData': err_obj,
                'callback': (params) => {
                    console.log('uploadErrorMsg===>', params);
                }
            };
            ty.HttpUtil.httpPost(configObj, 'POST');
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
    static saveItem(key, value, only_local) {
        value = value + '';
        cc.sys.localStorage.setItem(key, value);
        //localValues.set(key, value);
        if (!ty.isInWXChat)
            return;
        if (!only_local) {
            //FIXED: 做版本检测，版本低的会有黑屏
            if (wx.setUserCloudStorage) {
                wx.setUserCloudStorage({
                    KVDataList: [{
                        key: key,
                        value: value
                    }],
                    success: (msg) => {
                        console.log('saveObjectToCloud  ' + key + ' succeeds', msg);
                    },
                    fail: (msg) => {
                        console.log('saveObjectToCloud  ' + key + ' fails', msg);
                    },
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
    static loadItem(key, default_value) {
        //if(localValues.has(key)) return localValues.get(key);
        var v = cc.sys.localStorage.getItem(key);
        if (!v) {
            v = default_value;
            for (let i = 0; i < 3; i++) {
                let tmp_v = cc.sys.localStorage.getItem(key);
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
    static share2GroupByTicket(tag, result, success_cb, fail_cb) {
        if (!result.shareTickets || !result.shareTickets[0]) return false;
        let call_succ = () => {
            if (success_cb) success_cb();
        };
        let call_fail = () => {
            if (fail_cb) fail_cb();
        };
        let ff = Utils;

        wx.getShareInfo({
            shareTicket: result.shareTickets[0],
            success: (res) => {
                console.log('isCanShare2GroupByTicket==>', res);
                try {
                    let iv = res.iv;
                    let encryptedData = res.encryptedData;
                    let resultStr = ff.decrypt(ty.UserInfo.wxgame_session_key, iv, encryptedData);
                    console.log('resultStr==>', resultStr);
                    if (resultStr && resultStr !== 0) {
                        let resultObj = JSON.parse(resultStr);
                        let id = `${tag}_${resultObj.openGId}`;
                        let t0 = parseInt(ff.loadItem(id, 0));
                        let tc = new Date().getTime();
                        console.log('isCanShare2GroupByTicket==>openGId', id, typeof id);
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
                    console.log("share::", e);
                    call_fail();
                }
            },
            fail: () => {
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
    static getRandomShareConfigByShareTag(share_tag) {
        let config = null;
        let tmp_arr = [];
        if (ty.PropagateInterface.ShareConfig.hasOwnProperty(share_tag)) {
            tmp_arr = ty.PropagateInterface.ShareConfig[share_tag];
            let rand_idx = parseInt(Math.random() * tmp_arr.length);
            config = tmp_arr[rand_idx];
        }
        return config;
    }

    static decrypt(key, iv, crypted) {
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
    static showWXToast(msg, duration = 1000) {
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
    static showWXModal(content, title = '提示', show_cancel = false, sure_cb = null, cancle_cb = null, confirm_txt = '确定', cancle_txt = '取消') {
        wx.showModal({
            title: title,
            content: content,
            showCancel: show_cancel,
            confirmText: confirm_txt,
            cancelText: cancle_txt,
            success: function (res) {
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
    /**
     * @description 显示游戏圈
     * @author lu ning
     * @date 2018-09-05
     * @static 
     */
    static showGameClub() {
        // if (!GameClubBtn && wx.createGameClubButton) {
        //     let top = ty.ado.Utils.isIpx() ? .4 * canvas.height : .39 * canvas.height;
        //     GameClubBtn = wx.createGameClubButton({
        //         icon: 'green',
        //         style: {
        //             left: 20,
        //             top: top,
        //             width: 40,
        //             height: 40
        //         }
        //     });
        // }
        // GameClubBtn.show();
    }
    /**
     * @description 隐藏游戏圈
     * @author lu ning
     * @date 2018-09-05
     * @static
     */
    static hideGameClub() {
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
    static createAndcreateAndShowWXBanner() {
        if (!window.wx) return; //! 防止浏览器中报错
        if (!wx.createBannerAd) return; //! 玩家基础库不支持
        ty.ado.Utils.destroyWXBanner();
        let sys_info = wx.getSystemInfoSync();
        let s_w = sys_info.screenWidth;
        let s_h = sys_info.screenHeight; // 220
        // ! 强制适配,主要是ipx有问题
        let is_ipx = ty.ado.Utils.isIpx();
        // ! 强制适配 pad(宽屏设备)
        let is_pad = ty.ado.Utils.isPad();
        WXBannerAD = wx.createBannerAd({
            adUnitId: ty.ado.Constants.WXAdConfig.bannerId,
            style: {
                left: 0,
                top: 0,
                width: is_ipx ? s_w * 0.88 : (is_pad ? s_w * 0.6 : s_w * 0.95)
            }
        });

        try {
            WXBannerAD.onResize(function (res) {
                console.log('showBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
                if (WXBannerAD) {
                    let top = s_h - res.height - 5; //is_ipx ? s_h - res.height + 50 : s_h - res.height - 5;
                    WXBannerAD.style.left = (s_w - res.width) / 2;
                    WXBannerAD.style.top = top;
                    //res.width             = is_ipx ? s_w * 0.8 : s_w * 0.9;
                    //res.height            = s_h * 0.13;
                }
            });
        } catch (e) {
            console.log(e);
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
    static hideWXBanner() {
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
    static showWXBanner() {
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
    static destroyWXBanner() {
        if (WXBannerAD) {
            WXBannerAD.hide();
            WXBannerAD.destroy();
            WXBannerAD = null;
        }
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
    static showWXVideo(params) {
        if (!window.wx) return; //! 防止浏览器中报错
        if (!wx.createRewardedVideoAd) return; //! 玩家基础库不支持
        if (!WXVedioAD) {
            WXVedioAD = wx.createRewardedVideoAd({
                adUnitId: ty.ado.Constants.WXAdConfig.vedioId
            });
            WXVedioAD.onClose(res => {
                let toast_str = '';
                if (res && res.isEnded || res === undefined) {
                    toast_str = '视频观看成功';
                    WXVedioCallback.success && WXVedioCallback.success();
                } else {
                    toast_str = '视频观看失败';
                    WXVedioCallback.fail && WXVedioCallback.fail();
                }
                // ty.ado.Utils.showWXModal(`${toast_str}`);
                ty.ado.Utils.showWXBanner();
            });
        }
        // * 成功和失败回调是变化的
        WXVedioCallback.success = params.success;
        WXVedioCallback.fail = params.fail;
        WXVedioCallback.err_cb = params.error_callback || null;


        WXVedioAD.load().then(() => WXVedioAD.show()).catch(e => {
            console.log(e);
            let lucky_rate = ty.ado.Configs.LuckyUserRate || 50;
            if(Math.random() * 100 <= lucky_rate){
                WXVedioCallback.err_cb && WXVedioCallback.err_cb();
            }
            else{
                ty.ado.Utils.showWXModal("获取视频失败");
            }
        });
        ty.ado.Utils.hideWXBanner();
    }
    /**
     * @description 通用缩放动画
     * @author lu ning
     * @date 2018-09-06
     * @static
     * @param {cc.Node} node
     */
    static commonScaleIn(node) {
        if (!node) return;
        node.runAction(
            cc.sequence(
                cc.scaleTo(0.08, 0.95).easing(cc.easeIn(3.0)),
                cc.scaleTo(0.12, 1.1).easing(cc.easeIn(3.0)),
                cc.scaleTo(0.08, 1).easing(cc.easeIn(3.0))
            )
        );
    }
    /**
     * @description 是否是iphoneX
     * @author lu ning
     * @date 2018-09-07
     * @static
     * @returns
     */
    static isIpx() {
        let ret = false;
        // let sys_info = wx.getSystemInfoSync();
        // if (sys_info.model.indexOf('iPhone X') >= 0 || (sys_info.system.indexOf('iOS') >= 0 && sys_info.windowHeight / sys_info.windowWidth > 1.9)) {
        //     return true;
        // }
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
    static refreshSpriteByUrl(sprite, url, size) {
        cc.loader.load(url, (err, texture) => {
            if (!err) {
                let new_sprite_frame = new cc.SpriteFrame(texture);
                sprite.spriteFrame = new_sprite_frame;
                if (size) {
                    sprite.node.setContentSize(size);
                }
                console.log("刷新CDN图片成功");
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
    static showErrorGfitPop(btn_sure_cb, content) {
        cc.loader.loadRes('prefabs/ado_view_error_gift', function (err, prefab) {
            if (!err) {
                let size = cc.winSize;
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
    static requestRedPacket(params) {
        console.log('redpacket', 'requestRedPacket start');
        try {
            wx.request({
                url: `${ty.SystemInfo.loginUrl}api/huanlejiayi/redenvelop/getinfo`,
                data: {
                    userId: ty.UserInfo.userId,
                    clientId: ty.SystemInfo.clientId,
                    authorCode: ty.UserInfo.authorCode,
                    deviceInfo: ty.SystemInfo.deviceId,
                    name: ty.UserInfo.userName,
                    rand: Math.random() * 1000000
                },
                //method:"POST",
                success: (res) => {
                    console.log('redpacket', 'requestRedPacket==success', JSON.stringify(res));
                    if (res.data && res.data.nextAmount > 0) {
                        let red_packet = {
                            current: ty.ado.Utils.formatCashFen2Yuan(res.data.nextAmount), // 本次获取的金额
                            max: ty.ado.Utils.formatCashFen2Yuan(res.data.totalAmount), // 总共金额
                            times: res.data.needShare ? 3 : 1, // 1,2 ==> 确定，直接领取，>= 3分享或看视频领取
                            is_share: res.data.needShare,
                        };
                        ty.ado.RedPacketInfo = res.data;
                        params.success && params.success(red_packet);
                        ty.ado.Utils.uploadErrorMsg('redpacket;requestRedPacket==success;' + JSON.stringify(res));
                    } else {
                        if (res.data && res.data.nextAmount === 0) {
                            ty.ado.RedPacketInfo = res.data;
                        }
                        params.fail && params.fail(-1);
                        ty.ado.Utils.uploadErrorMsg('redpacket;requestRedPacket==success---fail;' + JSON.stringify(res));
                    }
                },
                fail: (res) => {
                    params.fail && params.fail(-1);
                    console.log('redpacket', 'requestRedPacket==fail', JSON.stringify(res));
                    ty.ado.Utils.uploadErrorMsg('redpacket;requestRedPacket==fail;' + JSON.stringify(res));
                }
            });
        } catch (e) {
            params.fail && params.fail(-1);
            console.log('redpacket', 'requestRedPacket==error', JSON.stringify(e));
            ty.ado.Utils.uploadErrorMsg('redpacket;requestRedPacket==error;' + e.message);

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
    static requestAddRedPacket(params) {
        console.log('redpacket', 'requestAddRedPacket start');

        try {
            wx.request({
                url: `${ty.SystemInfo.loginUrl}api/huanlejiayi/redenvelop/add`,
                data: {
                    userId: ty.UserInfo.userId, // ty.UserInfo.userId
                    clientId: ty.SystemInfo.clientId,
                    authorCode: ty.UserInfo.authorCode,
                    deviceInfo: ty.SystemInfo.deviceId,
                    name: ty.UserInfo.userName,
                    rand: Math.random() * 1000000
                },
                //method:"POST",
                success: (res) => {
                    // * 加红包成功
                    console.log('redpacket', 'requestAddRedPacket==success', JSON.stringify(res));
                    if (res.data && res.data.addAmount > 0) {
                        let addAmount = ty.ado.Utils.formatCashFen2Yuan(res.data.addAmount);
                        ty.ado.RedPacketInfo.totalAmount += res.data.addAmount;
                        params.success && params.success(addAmount);
                    } else {
                        ty.ado.Utils.showWXModal(
                            '加红包失败',
                            '提示',
                            false);
                        params.fail && params.fail();
                        ty.ado.Utils.uploadErrorMsg('redpacket;requestAddRedPacket==success---fail;' + JSON.stringify(res));

                    }

                },
                fail: (res) => {
                    // * 加红包失败
                    console.log('redpacket', 'requestAddRedPacket==fail', JSON.stringify(res));
                    ty.ado.Utils.showWXModal(
                        '加红包失败',
                        '提示',
                        false);
                    params.fail && params.fail();
                    ty.ado.Utils.uploadErrorMsg('redpacket;requestAddRedPacket==fail;' + JSON.stringify(res));

                }
            });
        } catch (e) {
            // * 加红包报错
            console.log('redpacket', 'requestAddRedPacket==error', JSON.stringify(e));
            ty.ado.Utils.showWXModal(
                '加红包失败',
                '提示',
                false);
            ty.ado.Utils.uploadErrorMsg('redpacket;requestAddRedPacket==error;' + e.message);

        }
    }
    /**
     * @description 请求提现
     * @author lu ning
     * @date 2018-09-18
     * @static
     */
    static requestRedPacket2Cash() {
        console.log('redpacket', 'requestRedPacket2Cash start');
        try {
            wx.request({
                url: `${ty.SystemInfo.loginUrl}api/huanlejiayi/redenvelop/transfer`,
                data: {
                    userId: ty.UserInfo.userId,
                    clientId: ty.SystemInfo.clientId,
                    authorCode: ty.UserInfo.authorCode,
                    deviceInfo: ty.SystemInfo.deviceId,
                    name: ty.UserInfo.userName,
                    rand: Math.random() * 1000000
                },
                // method:"POST",
                success: (res) => {
                    // * 提现成功
                    console.log('redpacket', 'requestRedPacket2Cash==success', JSON.stringify(res));
                    if (res.data) {
                        ty.ado.Utils.showWXModal(
                            ty.ado.Constants.WXTransferRedPacketError[res.data.code],
                            '提示',
                            false);
                        if (res.data.code !== 0) {
                            ty.ado.Utils.uploadErrorMsg('redpacket;requestRedPacket2Cash==success--error-0;' + JSON.stringify(res));
                        } else {
                            ty.ado.RedPacketInfo.totalAmount = 0;
                            ty.NotificationCenter.trigger(ty.ado.Events.ADO_EVENT_RED_PACKET_CHANGE, null);
                        }
                    } else {
                        // * 未知错误
                        ty.ado.Utils.uploadErrorMsg('redpacket;requestRedPacket2Cash==success--error-1;' + JSON.stringify(res));
                    }
                },
                fail: (res) => {
                    // * 提现失败
                    //params.fail && params.fail(0);
                    ty.ado.Utils.showWXModal(
                        '提现请求失败，请稍后再试',
                        '提示',
                        false);
                    console.log('redpacket', 'requestRedPacket2Cash==fail', JSON.stringify(res));
                    ty.ado.Utils.uploadErrorMsg('redpacket;requestRedPacket2Cash==fail;' + JSON.stringify(res));

                }
            });
        } catch (e) {
            // * 提现失败
            //params.fail && params.fail(0);
            ty.ado.Utils.showWXModal(
                '提现请求失败，请稍后再试',
                '提示',
                false);
            console.log('redpacket', 'requestRedPacket2Cash==fail', JSON.stringify(e));
            ty.ado.Utils.uploadErrorMsg('redpacket;requestRedPacket2Cash==error;' + e.message);
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
    static requestEveryLoginInfo(params) {
        try {
            wx.request({
                url: `${ty.SystemInfo.loginUrl}api/huanlejiayi/everydaylogin/getinfo`,
                data: {
                    userId: ty.UserInfo.userId,
                    clientId: ty.SystemInfo.clientId,
                    authorCode: ty.UserInfo.authorCode,
                    deviceInfo: ty.SystemInfo.deviceId,
                    name: ty.UserInfo.userName,
                    rand: Math.random() * 1000000
                },
                // method:"POST",
                success: (res) => {
                    // * 获取每日登陆信息成功
                    console.log('redpacket', 'requestEveryLoginInfo==success', JSON.stringify(res));
                    if (res.data) {
                        if (res.data.code !== 0) {
                            ty.ado.Utils.showWXModal(
                                ty.ado.Constants.WXTransferRedPacketError[res.data.code],
                                '提示',
                                false);
                            ty.ado.Utils.uploadErrorMsg('redpacket;requestEveryLoginInfo==success--error-0;' + JSON.stringify(res));
                        } else {
                            ty.ado.EveryDataLoginInfo = res.data;
                            params.success && params.success();
                        }
                    } else {
                        // * 未知错误
                        ty.ado.Utils.uploadErrorMsg('redpacket;requestEveryLoginInfo==success--error-1;' + JSON.stringify(res));
                    }
                },
                fail: (res) => {
                    // * 获取每日登陆信息失败
                    params.fail && params.fail();
                    console.log('redpacket', 'requestEveryLoginInfo==fail', JSON.stringify(res));
                    ty.ado.Utils.uploadErrorMsg('redpacket;requestEveryLoginInfo==fail;' + JSON.stringify(res));

                }
            });
        } catch (e) {
            // * 提现失败
            console.log('redpacket', 'requestEveryLoginInfo==error', JSON.stringify(e));
            ty.ado.Utils.uploadErrorMsg('redpacket;requestEveryLoginInfo==error;' + e.message);
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
    static requestEveryLoginReward(params) {
        try {
            wx.request({
                url: `${ty.SystemInfo.loginUrl}api/huanlejiayi/everydaylogin/reward`,
                data: {
                    userId: ty.UserInfo.userId,
                    clientId: ty.SystemInfo.clientId,
                    authorCode: ty.UserInfo.authorCode,
                    deviceInfo: ty.SystemInfo.deviceId,
                    name: ty.UserInfo.userName,
                    double: params.double ? 1 : 0,
                    rand: Math.random() * 1000000
                },
                // method:"POST",
                success: (res) => {
                    // * 请求每日登陆奖励成功
                    console.log('redpacket', 'requestEveryLoginReward==success', JSON.stringify(res));
                    if (res.data) {
                        if (res.data.code !== 0) {
                            ty.ado.Utils.showWXModal(
                                ty.ado.Constants.WXTransferRedPacketError[res.data.code],
                                '提示',
                                false);
                            ty.ado.Utils.uploadErrorMsg('redpacket;requestEveryLoginReward==success--error-0;' + JSON.stringify(res));
                        } else {
                            //ty.ado.EveryDataLoginInfo = res.data;
                            let addAmount = ty.ado.EveryDataLoginInfo.amounts[ty.ado.EveryDataLoginInfo.count - 1];
                            addAmount = params.double ? addAmount * 2 : addAmount;
                            ty.ado.RedPacketInfo.totalAmount += addAmount;
                            ty.NotificationCenter.trigger(ty.ado.Events.ADO_EVENT_RED_PACKET_CHANGE, null);
                            params.success && params.success(addAmount);
                        }
                    } else {
                        // * 未知错误
                        ty.ado.Utils.uploadErrorMsg('redpacket;requestEveryLoginReward==success--error-1;' + JSON.stringify(res));
                    }
                },
                fail: (res) => {
                    // * 请求每日登陆奖励失败
                    params.fail && params.fail();
                    console.log('redpacket', 'requestEveryLoginReward==fail', JSON.stringify(res));
                    ty.ado.Utils.uploadErrorMsg('redpacket;requestEveryLoginReward==fail;' + JSON.stringify(res));

                }
            });
        } catch (e) {
            // * 请求每日登陆奖励失败
            console.log('redpacket', 'requestEveryLoginInfo==error', JSON.stringify(e));
            ty.ado.Utils.uploadErrorMsg('redpacket;requestEveryLoginInfo==error;' + e.message);
        }
    }
    /**
     * @description 上报邀请信息
     * @author lu ning
     * @date 2018-09-26
     * @param {Number} inviteId
     * @static
     */
    static requestInviteLogin(inviteId) {
        try {
            wx.request({
                url: `${ty.SystemInfo.loginUrl}api/huanlejiayi/invite/login`,
                data: {
                    userId: ty.UserInfo.userId,
                    clientId: ty.SystemInfo.clientId,
                    authorCode: ty.UserInfo.authorCode,
                    deviceInfo: ty.SystemInfo.deviceId,
                    name: ty.UserInfo.userName,
                    rand: Math.random() * 1000000,
                    inviteId: inviteId
                },
                // method:"POST",
                success: (res) => {
                    // * 上报邀请信息
                    console.log('invite', 'requestInviteLogin==success', JSON.stringify(res));
                    if (res.data) {
                        if (res.data.code !== 0) {
                            // ty.ado.Utils.showWXModal(
                            //     ty.ado.Constants.WXTransferRedPacketError[res.data.code],
                            //     '提示',
                            //     false);
                            ty.ado.Utils.uploadErrorMsg('invite;requestInviteLogin==success--error-0;' + JSON.stringify(res));
                        } else {
                            console.log('invite requestInviteLogin success');
                        }
                    } else {
                        // * 未知错误
                        ty.ado.Utils.uploadErrorMsg('invite;requestInviteLogin==success--error-1;' + JSON.stringify(res));
                    }
                },
                fail: (res) => {
                    // * 请求每日登陆奖励失败
                    console.log('invite', 'requestInviteLogin==fail', JSON.stringify(res));
                    ty.ado.Utils.uploadErrorMsg('invite;requestInviteLogin==fail;' + JSON.stringify(res));

                }
            });
        } catch (e) {
            // * 请求每日登陆奖励失败
            console.log('invite', 'requestInviteLogin==error', JSON.stringify(e));
            ty.ado.Utils.uploadErrorMsg('invite;requestInviteLogin==error;' + e.message);
        }
    }
    /**
     * @description 请求邀请信息
     * @author lu ning
     * @date 2018-09-26
     * @static
     */
    static requestInviteGetInfo(params) {
        try {
            wx.request({
                url: `${ty.SystemInfo.loginUrl}api/huanlejiayi/invite/getinfo`,
                data: {
                    userId: ty.UserInfo.userId,
                    clientId: ty.SystemInfo.clientId,
                    authorCode: ty.UserInfo.authorCode,
                    deviceInfo: ty.SystemInfo.deviceId,
                    name: ty.UserInfo.userName,
                    rand: Math.random() * 1000000,
                },
                // method:"POST",
                success: (res) => {
                    // * 上报邀请信息
                    console.log('invite', 'requestInviteGetInfo==success', JSON.stringify(res));
                    if (res.data) {
                        if (res.data.code !== 0) {
                            ty.ado.Utils.showWXModal(
                                ty.ado.Constants.WXTransferRedPacketError[res.data.code],
                                '提示',
                                false);
                            ty.ado.Utils.uploadErrorMsg('invite;requestInviteGetInfo==success--error-0;' + JSON.stringify(res));
                            params.fail && params.fail();
                        } else {
                            console.log('invite requestInviteGetInfo success');
                            ty.ado.InviteInfo = res.data;
                            params.success && params.success();
                            if(ty.ado.InviteInfo.reward) ty.ado.hpvalue = 6;
                        }
                    } else {
                        // * 未知错误
                        ty.ado.Utils.uploadErrorMsg('invite;requestInviteGetInfo==success--error-1;' + JSON.stringify(res));
                        params.fail && params.fail();
                    }
                },
                fail: (res) => {
                    // * 请求每日登陆奖励失败
                    console.log('invite', 'requestInviteGetInfo==fail', JSON.stringify(res));
                    ty.ado.Utils.uploadErrorMsg('invite;requestInviteGetInfo==fail;' + JSON.stringify(res));
                    params.fail && params.fail();
                }
            });
        } catch (e) {
            // * 请求每日登陆奖励失败
            console.log('invite', 'requestInviteGetInfo==error', JSON.stringify(e));
            ty.ado.Utils.uploadErrorMsg('invite;requestInviteGetInfo==error;' + e.message);
            params.fail && params.fail();
        }
    }
    /**
     * @description 请求邀请奖励
     * @author lu ning
     * @date 2018-09-26
     * @static
     */
    static requestInviteReward() {
        try {
            wx.request({
                url: `${ty.SystemInfo.loginUrl}api/huanlejiayi/invite/reward`,
                data: {
                    userId: ty.UserInfo.userId,
                    clientId: ty.SystemInfo.clientId,
                    authorCode: ty.UserInfo.authorCode,
                    deviceInfo: ty.SystemInfo.deviceId,
                    name: ty.UserInfo.userName,
                    rand: Math.random() * 1000000,
                },
                // method:"POST",
                success: (res) => {
                    // * 上报邀请信息
                    console.log('invite', 'requestInviteReward==success', JSON.stringify(res));
                    if (res.data) {
                        if (res.data.code !== 0) {
                            ty.ado.Utils.showWXModal(
                                ty.ado.Constants.WXTransferRedPacketError[res.data.code],
                                '提示',
                                false);
                            ty.ado.Utils.uploadErrorMsg('invite;requestInviteReward==success--error-0;' + JSON.stringify(res));
                        } else {
                            console.log('invite requestInviteReward success');
                            ty.ado.InviteInfo.reward = true;
                            ty.ado.hpvalue = 6;
                            ty.ado.Utils.showWXModal(
                                "领取成功",
                                '提示',
                                false);
                        }
                    } else {
                        // * 未知错误
                        ty.ado.Utils.uploadErrorMsg('invite;requestInviteReward==success--error-1;' + JSON.stringify(res));
                    }
                },
                fail: (res) => {
                    // * 请求每日登陆奖励失败
                    console.log('invite', 'requestInviteReward==fail', JSON.stringify(res));
                    ty.ado.Utils.uploadErrorMsg('invite;requestInviteReward==fail;' + JSON.stringify(res));

                }
            });
        } catch (e) {
            // * 请求每日登陆奖励失败
            console.log('invite', 'requestInviteReward==error', JSON.stringify(e));
            ty.ado.Utils.uploadErrorMsg('invite;requestInviteReward==error;' + e.message);
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
    static formatCashFen2Yuan(cash) {
        let ret = 0;
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
    static showRedPacketTransferPop(current_cash = null) {
        cc.loader.loadRes('prefabs/red_packet_tansfer', (err, prefab) => {
            if (!err) {
                let parent = ty.ado.Utils.getPopRoot();
                let pop = cc.instantiate(prefab);
                pop.parent = parent;
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
    static getPopRoot() {
        let scene = cc.director.getScene();
        let pop_root = scene.getChildByName('Canvas').getChildByName('pop');
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
    static simpleBezierAction(node, end, end_callback) {
        //let sp        = node.position;
        //let ep        = end;
        // let dist      = Math.sqrt((sp.x - ep.x) * (sp.x - ep.x) + (sp.y - ep.y) * (sp.y - ep.y));//cc.pDistance(sp,ep);
        // //cc.pSub();
        // let normalPos = eq.sub(sp).normalizeSelf();//cc.pSub(ep,sp).normalizeSelf();
        // let cfg = [cc.v2(sp.x + 30, sp.y + normalPos.y * dist / 2),
        //            cc.v2(sp.x + normalPos.x * dist / 4 * 3, sp.y + normalPos.y * dist / 4 * 3),
        //            ep];
        if (node) {
            node.runAction(
                cc.sequence(
                    cc.moveTo(0.8, end).easing(cc.easeSineIn()),
                    cc.callFunc(() => {
                        end_callback && end_callback();
                    })
                )
            );
        }
    }
    /**
     * @description 是否是平板
     * @author lu ning
     * @date 2018-09-20
     * @static
     */
    static isPad() {
        let ret = false;
        // let sys_info = wx.getSystemInfoSync();
        // if (sys_info.windowHeight / sys_info.windowWidth < 1.777) {
        //     return true;
        // }
        return ret;
    }
    /**
     * @description 通过appid获取游戏交叉导流信息
     * @author lu ning
     * @date 2018-09-29
     * @static
     * @param {String} wx_app_id
     */
    static getCrossAdConfigByAppId(wx_app_id) {
        let ret = null;
        let list = ty.AdManager.rawAdInfoList;
        for (let i = 0; i < list.length; ++i) {
            let tmp_c = list[i];
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
    static jump2MiniProgramByConfig(config) {
        try {

            // this.genRandomSecondAdInfo();

            //先尝试直接跳转
            var skip_type = config.icon_skip_type;
            var toappid = config.toappid;
            var togame = config.togame;
            var topath = config.path;
            var second_toappid = config.second_toappid;

            console.log('topath ====>' + topath);

            var that = this;

            var icon_id = config.icon_id;
            var config_id = '0';
            var webpage_url = '';
            var webpage_id = '0';

            var bi_paramlist = [icon_id, config_id, webpage_url, toappid, togame, webpage_id, that.adType];

            console.log('bi_paramlist ====> ' + JSON.stringify(bi_paramlist));

            ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeClickAdBtn, bi_paramlist);

            //! 先尝试直接跳转
            if (wx && wx.navigateToMiniProgram) {

                if (1 === skip_type) {

                    wx.navigateToMiniProgram({
                        appId: toappid,
                        path: topath ? topath : '?from=adcross',
                        envVersion: 'release',
                        extraData: {
                            from: topath ? topath : '?from=adcross',
                        },
                        success: function (res) {

                            ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);

                            console.log('wx.navigateToMiniProgram success');
                            console.log(res);
                        },
                        fail: function (res) {
                            ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                            console.log('wx.navigateToMiniProgram fail');
                            console.log(res);
                        },
                        complete: function (res) {
                            console.log('navigateToMiniProgram ==== complete');
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
                            from: topath ? topath : '?from=adcross',
                        },
                        success: function (res) {
                            ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);
                            console.log('wx.navigateToMiniProgram success');
                            console.log(res);
                        },
                        fail: function (res) {
                            ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                            console.log('wx.navigateToMiniProgram fail');
                            console.log(res);
                        },
                        complete: function (res) {
                            //that.resetBtnIcon();
                            console.log('navigateToMiniProgram ==== complete');
                        }
                    });

                } else {
                    console.error('Unsupported skip type! Please Check!');
                }

                return;
            }
        } catch (err) {
            console.log("error:", "ty.AdManager.onClickAdIconBtn——" + JSON.stringify(err));
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
    static isMinGanIp(ip_info){
        let ret = false;
        let MinGanIpInfo = ty.ado.Configs.MinGanIp || ty.ado.Constants.MinGanIp;
        if(ip_info.loc && ip_info.loc.length > 0){
            for(let i = 0; i < MinGanIpInfo.length; ++i){
                let info = MinGanIpInfo[i];
                if(ip_info.loc[1] === info[0]){
                    if(info[1].length === 0){
                        // * 没有指定城市，只指定了省份，那么就是屏蔽整个省
                        ret = true;
                    }
                    else{
                        let lock_city = info[1];
                        if(lock_city.indexOf(ip_info.loc[2]) >= 0){
                            ret = true;
                            break;
                        }
                    }
                    
                }
            }
        }
        console.log('MINGAN_IP...'+ret);
        return ret;
    }
};

module.exports = Utils;