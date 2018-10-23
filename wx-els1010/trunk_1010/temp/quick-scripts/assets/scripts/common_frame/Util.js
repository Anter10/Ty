(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/common_frame/Util.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1c6277D4JxPtJgfcMicI4xu', 'Util', __filename);
// scripts/common_frame/Util.js

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
        var local_uuid = tywx.Util.getItemFromLocalStorage("LOCAL_UUID_KEY", "");
        if (!local_uuid) {
            local_uuid = tywx.Util.createUUID();
            tywx.Util.setItemToLocalStorage("LOCAL_UUID_KEY", local_uuid);
        }
        return local_uuid;
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
        //# sourceMappingURL=Util.js.map
        