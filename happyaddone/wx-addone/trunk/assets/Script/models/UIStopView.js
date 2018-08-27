 /**
  * 功能: 点击游戏暂停的时候弹出的界面
  * created by gyc on 2018-8-25
  */
 var pibview = require("PingBiView");
 cc.Class({
     extends: pibview,

     properties: {

     },


     /**
      * 功能: 初始化界面
      * 调用: 点击继续的时候调用
      * 参数: param:{goc: function 继续游戏回调, rsg: function 重新开始游戏回调, ghc function 点击返回首页的回调 }
      * 思路: 逻辑需要
      */
     init: function (param) {
         this.param = param;
         console.log("paramHeloc  " + this.param.Heloc);
     },

     /**
      * 功能: 继续游戏回调
      * 调用: 点击继续的时候调用
      * 参数: 无
      * 思路: 逻辑需要
      */
     goOnCallBack: function () {
         this.param.goc !== undefined ? this.param.goc() : tywx.ado.logWithColor("没有设置继续游戏回调");
         this.node.destroy();
     },

     /**
      * 重新开始游戏回调
      * 调用: 点击返回首页的时候调用
      * 参数: 无
      * 思路: 逻辑需要
      */
     repeatStartGame: function () {
         this.param.rsg !== undefined ? this.param.rsg() : tywx.ado.logWithColor("没有设置重新开始游戏回调");
         this.node.destroy();
     },

     /**
      * 功能: 返回主页回调
      * 调用: 点击返回首页的时候调用
      * 参数: 无
      * 思路: 逻辑需要
      */
     goBackHome: function () {
         this.param.ghc !== undefined ? this.param.ghc() : tywx.ado.logWithColor("没有设置返回首页回调");
     },

     /**
      * 功能: 点击暂停按钮出来的帮助按钮 弹出帮助界面
      * 调用: 点击帮助按钮的时候调用
      * 参数: 无
      * 思路: 逻辑需要
      */
     goHelpView: function () {
         this.param.ghv ? this.param.ghv() : tywx.ado.logWithColor("没有设置帮助回调");
     },




     /**
      * 功能: 游戏加载完的逻辑处理
      * 调用: 界面加载完成
      * 参数: 无
      * 思路: 系统自带
      */
     onLoad: function () {

     },



 });