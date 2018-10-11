(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/UserItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cc3acBdhIdH26KlcZPJvpBS', 'UserItem', __filename);
// Script/models/UserItem.js

"use strict";

/*
   游戏邀请领取界面的单个格子
   created by gyc on 2018-08-08.
   final changed by gyc on 2018-08-16.
*/
cc.Class({
    extends: cc.Component,

    properties: {
        icon: {
            default: null,
            type: cc.Sprite
        },
        numberLabel: {
            default: null,
            type: cc.Label
        },
        itemIcon: {
            default: null,
            type: cc.Sprite
        },
        yqBtn: {
            default: null,
            type: cc.Node
        },
        ylqBtn: {
            default: null,
            type: cc.Sprite
        }

    },

    /*
        调用: 节点渲染完成后调用
        功能: 完成部分逻辑的初始化
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    onLoad: function onLoad() {
        // 设置邀请好友的回调
        var shareScript = this.yqBtn.getComponent("ShareButton");
        if (shareScript) {
            var curitem = this;
            var fhcall = function fhcall() {
                // curitem.recoverGame();
            };
            var hycall = function hycall() {
                // curitem.fhsbCallBack();
            };

            var errorcall = function errorcall() {}
            // curitem.fhsbCallBack();

            // 设置分享到组的成功回调
            ;shareScript.setShareGroupCall(fhcall);
            // 设置分享到好友的回调
            shareScript.setSuccessCall(hycall);
            // 设置分享失败后的回调
            shareScript.setErrorCall(hycall);
        }
    },


    /*
        调用: 节点渲染完成后调用
        功能: 设置用户的数据并且刷新显示视图
        参数: [
            data: 节点显示数据 type: table
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    setData: function setData(data) {
        this.data = data;
        this.flushView();
    },

    /*
        调用: 设置数据的时候
        功能: 刷新当前显示的视图
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    flushView: function flushView() {}

});

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
        //# sourceMappingURL=UserItem.js.map
        