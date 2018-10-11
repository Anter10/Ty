/*
   游戏开始界面
   created by gyc on 2018-08-02.
   final changed time by gyc on  2018-08-03
*/
var config = require("AddOneConfig")
tywx.publicwx = true;

var curscene = null;
let UIPhbView = cc.Class({
    extends: cc.Component,
    properties:{
         
        backButton:{
            default:null,
            type: cc.Button,
        },
        
        phbView:{
            default: null,
            type:cc.Node,
        },

        shareButton:{
            default: null,
            type:cc.Node,
        },

        phbSprite:cc.Sprite,
       
    },
    _updateSubDomainCanvas () {
        // let self = this;
        // if (!self.tex) {
        //     return;
        // }
        // openDataContext.postMessage({
        //     method:1,

        // });
         
    },
    start () {
 
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas: function() {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.phbSprite.spriteFrame = new cc.SpriteFrame(this.tex);
    },

    /*
        调用: 系统new 的时候调用。
        功能: 该类的构造函数 可用于自身变量的初始化
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 系统自带
    */
    ctor: function(){
        config = tywx.config != null?tywx.config : config;
    },

    update: function(delayTime){
        if(tywx.publicwx){
           this._updateSubDomainCanvas();   
        }
    },

    /*
        调用: 界面加载完成后的回调。
        功能: 该类的构造函数 可用于自身变量的初始化
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 系统自带
    */
    onLoad:function(){
        if(tywx.curgotophbtype == 1){
            if(tywx.publicwx){
                wx.postMessage({
                    method: 1,
                    MAIN_MENU_NUM: "x1",
                });
            }
        }else{
            window.wx.postMessage({
                method: 2,
                MAIN_MENU_NUM: "x1",
                shareTicket:  tywx.groupdata.shareTickets[0]
          });
        }
       
        
       
    },

  

    /*
        调用: 点击返回按钮
        功能: 隐藏排行榜
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 游戏需要
    */
   hidePhbView: function(){
       cc.director.loadScene("phbview", this.loadFinishCallBack);
        
   },

    /*
        调用: 进入游戏的时候调用
        功能: 清除当前界面占用的内存
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 游戏需要
    */
    loadFinishCallBack:function(){
         if(this.node){
            this.node.destroy();
         }
    },
   
  

});

module.exports = UIPhbView;