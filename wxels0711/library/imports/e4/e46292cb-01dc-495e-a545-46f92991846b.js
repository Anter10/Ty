"use strict";
cc._RF.push(module, 'e4629LLAdxJXqVFRvkpkYRr', 'Util');
// script/CommonFrame/Util.js

"use strict";

/**
 * Created by xiaochuntian on 2018/5/2.
 */

tywx.Util = {

    isSceneQrCode: function isSceneQrCode(scene) {
        var qrCodeList = [1047, 1048, 1049]; //扫描小程序码,选取小程序码,识别小程序码
        return qrCodeList.indexOf(scene) > -1;
    },

    createUUID: function createUUID() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "";

        var uuid = s.join("");
        return uuid;
    },

    checkLocalUUID: function checkLocalUUID() {
        var local_uuid = tywx.Util.getItemFromLocalStorage("LOCAL_UUID_KEY", "");
        return local_uuid != "";
    },

    getLocalUUID: function getLocalUUID() {
        if (tywx.Util.UUID) {
            return tywx.Util.UUID;
        }
        var local_uuid = tywx.Util.getItemFromLocalStorage("LOCAL_UUID_KEY", "");
        if (!local_uuid) {
            local_uuid = tywx.Util.createUUID();
            tywx.Util.setItemToLocalStorage("LOCAL_UUID_KEY", local_uuid);
        }
        tywx.Util.UUID = local_uuid;
        return tywx.Util.UUID;
    },

    getItemFromLocalStorage: function getItemFromLocalStorage(keyStr, defaultValue) {
        try {
            if (wx && wx.getStorageSync) {
                var value = wx.getStorageSync(keyStr);
                if (value) {
                    return value;
                }
            } else {
                var tmp = cc.sys.localStorage.getItem(keyStr);
                if (tmp) {
                    return tmp;
                }
            }
            return defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    setItemToLocalStorage: function setItemToLocalStorage(keyStr, ValueStr) {
        try {
            if (wx && wx.getStorageSync) {
                wx.setStorage({
                    key: keyStr,
                    data: ValueStr + ''
                });
            } else {
                cc.sys.localStorage.setItem(keyStr, ValueStr + "");
            }
        } catch (e) {
            tywx.LOGE("tywx.Util", "setItemToLocalStorage fail");
        }
    },
    wechatShowModal: function wechatShowModal(content, showCancel, confirmText, successCallbackFun, failCallBackFun) {
        confirmText = !confirmText ? '' : confirmText;

        wx.showModal({
            content: content,
            showCancel: showCancel,
            confirmText: confirmText,
            success: function success(params) {
                if (successCallbackFun) {
                    successCallbackFun(params);
                }
            },
            fail: function fail() {
                if (failCallBackFun) {
                    failCallBackFun();
                }
            },
            complete: function complete() {}

        });
    }
};

cc._RF.pop();