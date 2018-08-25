(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/UIStopView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '830b6gVQ9dAzrTy7ndBYUHj', 'UIStopView', __filename);
// Script/models/UIStopView.js

"use strict";

/**
 * 功能: 点击游戏暂停的时候弹出的界面
 * created by gyc on 2018-8-25
 */

cc.Class({
  extends: cc.Component,

  properties: {},

  /**
   * 功能: 初始化界面
   * 调用: 点击继续的时候调用
   * 参数: param:{goc: function 继续游戏回调, rsg: function 重新开始游戏回调, ghc function 点击返回首页的回调 }
   * 思路: 逻辑需要
   */
  init: function init(param) {
    this.param = param;
  },

  /**
   * 功能: 继续游戏回调
   * 调用: 点击继续的时候调用
   * 参数: 无
   * 思路: 逻辑需要
   */
  goOnCallBack: function goOnCallBack() {
    this.param.goc ? this.param.goc() : tywx.ado.logWithColor("没有设置继续游戏回调");
  },

  /**
   * 重新开始游戏回调
   * 调用: 点击返回首页的时候调用
   * 参数: 无
   * 思路: 逻辑需要
   */
  repeatStartGame: function repeatStartGame() {
    this.param.rsg ? this.param.rsg() : tywx.ado.logWithColor("没有设置重新开始游戏回调");
  },

  /**
   * 功能: 返回主页回调
   * 调用: 点击返回首页的时候调用
   * 参数: 无
   * 思路: 逻辑需要
   */
  goBackHome: function goBackHome() {
    this.param.goHomeCall ? this.param.ghc() : tywx.ado.logWithColor("没有设置返回首页回调");
  },

  /**
   * 功能: 点击暂停按钮出来的帮助按钮 弹出帮助界面
   * 调用: 点击帮助按钮的时候调用
   * 参数: 无
   * 思路: 逻辑需要
   */
  goHelpView: function goHelpView() {
    this.param.ghv ? this.param.ghv() : tywx.ado.logWithColor("没有设置帮助回调");
  },

  /**
   * 功能: 游戏加载完的逻辑处理
   * 调用: 界面加载完成
   * 参数: 无
   * 思路: 系统自带
   */
  onLoad: function onLoad() {}

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
        //# sourceMappingURL=UIStopView.js.map
        