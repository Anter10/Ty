(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/OpenData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fcce2+1aQlM46iLBQp5jUyT', 'OpenData', __filename);
// script/ui/OpenData.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        display: cc.Sprite
    },
    start: function start() {
        this.tex = new cc.Texture2D();
        var openDataContext = wx.getOpenDataContext();
        var openDataCanvas = openDataContext.canvas;
        openDataCanvas.width = 720;
        openDataCanvas.height = 1280;
        this.methodName = "";
        this.showTag = 0;
    },


    // 悄悄话进入
    showQQHIn: function showQQHIn(openId, position, size, rotation, font) {
        var methodName = "drawQQHIn";
        this.methodName = methodName;
        if (!window.wx) {
            //防止在浏览器中报错
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            method: methodName,
            data: {
                openId: openId,
                position: position,
                size: size,
                rotation: rotation,
                font: font
            }
        });
    },


    // 悄悄话胜利
    showQQHWin: function showQQHWin(openId) {
        var methodName = "showQQHWin";
        this.methodName = methodName;
        if (!window.wx) {
            //防止在浏览器中报错
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            method: methodName,
            data: {
                openId: openId
            }
        });
    },


    // 超越好友
    showBeyond: function showBeyond(type) {
        var methodName = "showBeyond";
        this.methodName = methodName;
        if (!window.wx) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            method: methodName,
            data: {
                type: type
            }
        });
    },
    cleanOpenData: function cleanOpenData() {
        var methodName = "cleanOpenData";
        this.methodName = methodName;
        if (!window.wx) {
            //防止在浏览器中报错
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            method: methodName
        });
    },


    // 刷新开放数据域的纹理
    _updateSubDomainCanvas: function _updateSubDomainCanvas() {
        if (!this.tex) {
            return;
        }
        if (!this.texF) {
            this.texF = new cc.SpriteFrame(this.tex);
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = this.texF;
    },
    update: function update() {
        this.showTag++;
        if (this.showTag % 30 === 0) {
            this._updateSubDomainCanvas();
        }
    },
    onDestroy: function onDestroy() {
        this.cleanOpenData();
    }
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
        //# sourceMappingURL=OpenData.js.map
        