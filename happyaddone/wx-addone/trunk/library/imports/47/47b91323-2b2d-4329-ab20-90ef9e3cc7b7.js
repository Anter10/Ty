"use strict";
cc._RF.push(module, '47b91MjKy1DKasgkO+ePMe3', 'UIOpenBoxView');
// Script/models/UIOpenBoxView.js

"use strict";

/**
* 功能: 玩家破纪录的时候调用的弹窗
* created by gyc on 2018-08-25.
*/
var UIOpenBoxView = cc.Class({
    extends: cc.Component,

    properties: {
        mflqButton: {
            default: null,
            type: cc.Node
        }

    },

    /**
     * 功能: 初始化界面
     * 调用: 点击继续的时候调用
     * 参数: param: 格式{sc: function 分享成功时候的回调, ec: function 分享失败后的回调, cc:function 关闭按钮的回调} 
     * 思路: 逻辑需要
     */
    init: function init(param) {},

    /**
     * 功能: 关闭当前的界面
     * 调用: 点击破纪录关闭按钮的时候调用的时候调用
     * 参数: param: 格式{closeCall:100, sucCall: function, errCall: function}
     * 思路: 逻辑需要
     */
    closeCall: function closeCall() {
        this.param.cc ? this.param.cc() : tywx.ado.logWithColor("没有设置打开宝箱的关闭按钮");
        this.node.destroy();
    }

});

module.exports = UIOpenBoxView;

cc._RF.pop();