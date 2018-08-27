(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/UIPoJiLuView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bb9f5+1rt5HCYVUlj+ZRV7/', 'UIPoJiLuView', __filename);
// Script/models/UIPoJiLuView.js

"use strict";

/**
 * 功能: 玩家破纪录的时候调用的弹窗
 * created by gyc on 2018-08-25.
 */

cc.Class({
    extends: cc.Component,

    properties: {
        pjlScore: {
            default: null,
            type: cc.Label
        },
        shareButton: {
            default: null,
            type: cc.Node
        }
    },

    /**
     * 功能: 初始化界面
     * 调用: 点击继续的时候调用
     * 参数: param: 格式{score:100, sc: function, ec: function, cc: function}
     * 思路: 逻辑需要
     */
    init: function init(param) {
        this.param = param;
    },

    /**
     * 功能: 关闭当前的界面
     * 调用: 点击破纪录关闭按钮的时候调用的时候调用
     * 参数: 无
     * 思路: 逻辑需要
     */
    closeCall: function closeCall() {
        this.param.closeCall ? this.param.closeCall() : tywx.ado.logWithColor("没有设置破纪录的回调函数");
        this.node.destroy();
    },

    /**
     * 功能: 游戏加载完的逻辑处理
     * 调用: 界面加载完成
     * 参数: 无
     * 思路: 系统自带
     */
    onLoad: function onLoad() {
        this.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.1), cc.scaleTo(0.2, 1)));
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
        //# sourceMappingURL=UIPoJiLuView.js.map
        