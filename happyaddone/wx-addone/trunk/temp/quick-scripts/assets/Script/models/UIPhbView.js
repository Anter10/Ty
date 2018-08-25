(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/UIPhbView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a97d4Ia8aJOc6TjRFQN1+5q', 'UIPhbView', __filename);
// Script/models/UIPhbView.js

"use strict";

var _cc$Class;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
   游戏开始界面
   created by gyc on 2018-08-02.
   final changed time by gyc on  2018-08-03
*/
var config = require("AddOneConfig");
tywx.publicwx = true;

var curscene = null;
var UIPhbView = cc.Class((_cc$Class = {
    extends: cc.Component,
    properties: {

        backButton: {
            default: null,
            type: cc.Button
        },

        phbView: {
            default: null,
            type: cc.Node
        },

        shareButton: {
            default: null,
            type: cc.Node
        },

        phbSprite: cc.Sprite

    },
    _updateSubDomainCanvas: function _updateSubDomainCanvas() {
        // let self = this;
        // if (!self.tex) {
        //     return;
        // }
        // openDataContext.postMessage({
        //     method:1,

        // });

    },
    start: function start() {}
}, _defineProperty(_cc$Class, "_updateSubDomainCanvas", function _updateSubDomainCanvas() {
    if (!this.tex) {
        return;
    }
    var openDataContext = wx.getOpenDataContext();
    var sharedCanvas = openDataContext.canvas;
    this.tex.initWithElement(sharedCanvas);
    this.tex.handleLoadedTexture();
    this.phbSprite.spriteFrame = new cc.SpriteFrame(this.tex);
}), _defineProperty(_cc$Class, "ctor", function ctor() {
    config = tywx.config != null ? tywx.config : config;
}), _defineProperty(_cc$Class, "update", function update(delayTime) {
    if (tywx.publicwx) {
        this._updateSubDomainCanvas();
    }
}), _defineProperty(_cc$Class, "onLoad", function onLoad() {
    if (tywx.curgotophbtype == 1) {
        if (tywx.publicwx) {
            wx.postMessage({
                method: 1,
                MAIN_MENU_NUM: "x1"
            });
        }
    } else {
        window.wx.postMessage({
            method: 2,
            MAIN_MENU_NUM: "x1",
            shareTicket: tywx.groupdata.shareTickets[0]
        });
    }
}), _defineProperty(_cc$Class, "hidePhbView", function hidePhbView() {
    cc.director.loadScene("phbview", this.loadFinishCallBack);
}), _defineProperty(_cc$Class, "loadFinishCallBack", function loadFinishCallBack() {
    if (this.node) {
        this.node.destroy();
    }
}), _cc$Class));

module.exports = UIPhbView;

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
        //# sourceMappingURL=UIPhbView.js.map
        