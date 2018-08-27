"use strict";
cc._RF.push(module, 'f56932odplA6bdwSsHGjunV', 'UIGameOverView');
// Script/models/UIGameOverView.js

"use strict";

/**
 * 功能: 游戏结束的时候弹出的界面
 * created by gyc on 2018-8-25
 */

var UIGameOverView = cc.Class({
    extends: cc.Component,

    properties: {
        // 玩家最后的得分标签
        finalScore: {
            default: null,
            type: cc.Label
        },
        // 复活btn
        fuhuoNode: {
            default: null,
            type: cc.Node
        },
        repeateButton: {
            default: null,
            type: cc.Node
        }
    },

    /**
     * 功能: 节点加载完成后的回调
     * 调用: 处理节点初始化逻辑的回调
     * 参数: 无
     * 思路: 逻辑需要
     */
    onLoad: function onLoad() {

        console.log("当前的");
        var fhbut = this.fuHuo.getComponent("ShareButton");
        if (fhbut) {
            var fhcall = function fhcall() {
                self.recoverGame();
            };
            var hycall = function hycall() {
                self.fhsbCallBack();
            };

            var errorcall = function errorcall() {
                self.fhsbCallBack();
            };
            // 设置分享到组的成功回调
            fhbut.setShareGroupCall(fhcall);
            // 设置分享到好友的回调
            fhbut.setSuccessCall(hycall);
            // 设置分享失败后的回调
            fhbut.setErrorCall(hycall);
            fhbut.setShareConfig(tywx.ado.Constants.ShareConfig.RECOVER_GAME_SHARE);
        }
    },


    /**
     * 功能: 初始化界面
     * 调用: 点击继续的时候调用
     * 参数: param: 格式{rcb: function, ec: function, cc:function}
     * 思路: 逻辑需要
     */
    init: function init(param) {
        this.param = param;
    },

    // 
    /**
     * 功能: 重新开始回调
     * 调用: 重新开始的时候调用
     * 参数: param: 格式{sucCall: function, errCall: function, closeCall:function}
     * 思路: 逻辑需要
     */
    repeateCall: function repeateCall() {
        this.param.rcb ? this.param.rcb() : tywx.ado.logWithColor("游戏结束后点击重新开始按钮 没有设置重新开始按钮回调函数");
        this.node.destroy();
    }

});

module.exports = UIGameOverView;

cc._RF.pop();