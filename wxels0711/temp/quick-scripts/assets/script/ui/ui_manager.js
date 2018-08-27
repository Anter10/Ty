(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/ui_manager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0e932JITjZPLp2pDJbQi0kc', 'ui_manager', __filename);
// script/ui/ui_manager.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * 简易UI管理
 * @type {{}}
 */
tywx.UIManager = {
    //ui 容器
    _container: {},
    //ui 当前显示堆栈
    uistack: [],

    init: function init(game) {
        this.game = game;
    },

    registerUI: function registerUI(uikey, uinode, jsname) {
        this._container[uikey] = this._container[uikey] || [];
        this._container[uikey] = {
            node: uinode,
            jsname: jsname
        };
    },

    getUI: function getUI(uikey) {
        var layer = this._container[uikey];
        return layer;
    },

    showUI: function showUI(uikey, params, withaction, closepre) {
        if (closepre === true) {
            this.popCurrentUI();
        }

        var layer = this._container[uikey];
        if (layer && layer.node) {
            this._curLayer = layer.node;
            var node = layer.node;
            node.active = true;
            if (layer.jsname) {
                var js = node.getComponent(layer.jsname);
                if (js && js.showMe) js.showMe(params);
            }
            //是否是bool。并且为true
            console.log("-----withaction 类型:----" + (typeof withaction === "undefined" ? "undefined" : _typeof(withaction)));
            if (typeof withaction === "boolean" && withaction !== false) this._doAction(node);
            this.pushCurrentUI(node);
        } else {
            console.log("fengbing", "error:  " + uikey + '  not in ui manager');
        }
    },

    _doAction: function _doAction(node) {
        if (!node) return;

        node.setScale(0);
        node.runAction(cc.sequence(cc.scaleTo(0.2, 1.1, 1.1), cc.scaleTo(0.1, 1, 1)));
    },

    hideUI: function hideUI(uikey) {
        var layer = this._container[uikey];
        if (layer && layer.node) {
            var node = layer.node;
            node.active = false;
            var js = node.getComponent(layer.jsname);
            if (js && js.hideMe) {
                js.hideMe();
            }
            this.popCurrentUI();
        }
    },

    getCurrentUI: function getCurrentUI() {
        if (this.uistack.length > 0) {
            return this.uistack[this.uistack.length - 1];
        }
        return undefined;
    },

    pushCurrentUI: function pushCurrentUI(layer) {
        if (layer) {
            this.uistack.push(layer);
        }
    },

    popCurrentUI: function popCurrentUI() {
        if (this.uistack.length > 0) {
            this.uistack.pop();
        }
    },

    hideAllUI: function hideAllUI() {
        while (this.uistack.length > 0) {
            var node = this.uistack.pop();
            if (node) node.active = false;
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
        //# sourceMappingURL=ui_manager.js.map
        