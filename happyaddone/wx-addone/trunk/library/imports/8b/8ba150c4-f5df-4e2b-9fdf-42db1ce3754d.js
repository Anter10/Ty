"use strict";
cc._RF.push(module, '8ba15DE9d9OK5/fQtsc43VN', 'gamestart');
// Script/gamestart.js

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
var gamestart = cc.Class((_cc$Class = {
    extends: cc.Component,
    properties: {
        startButton: {
            default: null,
            type: cc.Button
        },
        backButton: {
            default: null,
            type: cc.Button
        },
        audioCtr: {
            default: null,
            type: cc.Prefab
        },
        userItem: {
            default: null,
            type: cc.Prefab
        },
        gameScore: {
            default: null,
            type: cc.Label
        },
        historyLabel: {
            default: null,
            type: cc.Label
        },
        phb: {
            default: null,
            type: cc.Button
        },
        phbback: {
            default: null,
            type: cc.Sprite
        },
        helpback: {
            default: null,
            type: cc.Sprite
        },
        giftback: {
            default: null,
            type: cc.Node
        },
        method: {
            default: null,
            type: cc.Button
        },
        phbSprite: {
            default: null,
            type: cc.Sprite
        },
        shareBtn: {
            default: null,
            type: cc.Node
        },
        groupBtn: {
            default: null,
            type: cc.Node
        },
        phbView: {
            default: null,
            type: cc.Node
        },

        helpview: {
            default: null,
            type: cc.Node
        },

        giftview: {
            default: null,
            type: cc.Node
        },

        helpViewPre: {
            default: null,
            type: cc.Prefab
        },

        icon: cc.Sprite,
        //! 请求次数上线
        requestTimes: 3
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
    start: function start() {
        //是否发布微信版本
        if (tywx.publicwx) {
            this.tex = new cc.Texture2D();
            // window.sharedCanvas.width = 635;
            // window.sharedCanvas.height = 796;
        }
        this.showPhb = false;
    }
}, _defineProperty(_cc$Class, "_updateSubDomainCanvas", function _updateSubDomainCanvas() {
    if (!this.tex) {
        return;
    }
    var openDataContext = wx.getOpenDataContext();
    var sharedCanvas = openDataContext.canvas;
    this.tex.initWithElement(sharedCanvas);
    this.tex.handleLoadedTexture();
    this.phbSprite.spriteFrame = new cc.SpriteFrame(this.tex);
}), _defineProperty(_cc$Class, "ctor", function ctor() {}), _defineProperty(_cc$Class, "update", function update(delayTime) {
    if (tywx.publicwx) {
        this._updateSubDomainCanvas();
    }
}), _defineProperty(_cc$Class, "onLoad", function onLoad() {

    console.log("当前屏幕尺寸  " + JSON.stringify(cc.view.getDevicePixelRatio()) + JSON.stringify(cc.view.getVisibleSize()));
    tywx.PropagateInterface.getShareConfigInfo(); //! 获取所有分享点信息
    if (tywx.publicwx) {
        var msg = tywx.ShareInterface.getRandomOnShareAppMessageInfo();
        if (msg) {
            tywx.ShareInterface.setOnShareAppMessageInfo(msg.title, msg.imageUrl, msg.sharePointId, msg.shareSchemeId);
            console.log("当前获得的分享信息 = " + JSON.stringify(msg));
        }
        // 设置分享组件的回调和数据
        var shareComponent = this.shareBtn.getComponent("ShareButton");

        if (shareComponent) {
            shareComponent.setErrorCall(function (data) {
                console.log("分享失败后处理的回调函数 ", data);
            });

            shareComponent.setSuccessCall(function (data) {
                console.log("分享成功后处理的回调函数 ", data);
            });

            shareComponent.setShareConfig(tywx.ado.Constants.ShareConfig.FIRST_PAGE_SHARE);
        }

        // 设置群组排行榜组件的回调和数据
        var groupBtnComponent = this.groupBtn.getComponent("ShareButton");
        var self = this;

        if (groupBtnComponent) {
            groupBtnComponent.setShareConfig(tywx.ado.Constants.ShareConfig.RANK_SHARE);
            groupBtnComponent.setShareGroupCall(function (data) {
                console.log("群分享当前的文档");
                if (self.showPhb) {
                    self.phbView.active = false;
                    self.showPhb = false;
                } else {
                    self.phbView.active = true;
                    self.showPhb = true;
                }
                window.wx.postMessage({
                    method: 2,
                    MAIN_MENU_NUM: "x1",
                    shareTicket: data.shareTickets[0]
                });
            });

            groupBtnComponent.setErrorCall(function (data) {
                console.log("分享失败后处理的回调函数 ", data);
            });
        }
    }
    var score = tywx.Util.getItemFromLocalStorage("maxscore", 0);
    if (score != null) {
        this.gameScore.string = score;
        var length = (score + "").length;
        // 根据当前的分数来调整显示
        if (length < 2) {
            this.historyLabel.node.x = this.historyLabel.node.x + 50;
            this.gameScore.node.x = this.gameScore.node.x + 50;
        } else if (length > 5) {
            var tx = 25 + (length - 6) * 25;
            this.historyLabel.node.x = this.historyLabel.node.x - tx;
            this.gameScore.node.x = this.gameScore.node.x - tx;
        }
    } else {
        console.log("当前分数不存在");
    }

    // cc.loader.downloader.loadSubpackage("subone",function(error){
    //     if(error){
    //         console.log("下载分包失败");
    //         return;
    //     }
    //     console.log("下载分包成功");
    // });


    //  游戏的点击逻辑
    this.phbback.node.on('touchstart', function (event) {
        return true;
    }, this);

    var self = this;

    curscene = this;

    curscene.hideBack();
    this.givePlayerItems();
    this.firstShowHelpView();
    // this.backButton.node.on("click",this.returnView, this);
    console.log("当前的项目配置 = " + JSON.stringify(config));
    this.requestConfigInfo();

    //tywx.playMusic();
    tywx.ado.AudioManager.playMusic(tywx.ado.Configs.MUSICS.BG_MUSIC);
}), _defineProperty(_cc$Class, "showPlayMethod", function showPlayMethod() {
    tywx.ado.UIManager.showUIByConfig(tywx.ado.ResConfig.PrefabConfig.PREFAB_UIHelpView, {
        Heloc: "ccc"
    });
}), _defineProperty(_cc$Class, "showGiftView", function showGiftView() {
    tywx.ado.UIManager.showUIByConfig(tywx.ado.ResConfig.PrefabConfig.PREFAB_UIHelpView, {
        Heloc: "ccc"
    });
}), _defineProperty(_cc$Class, "showFriendPhbView", function showFriendPhbView() {
    tywx.ado.UIManager.showUIByConfig(tywx.ado.ResConfig.PrefabConfig.PREFAB_UIPhbView, {
        Heloc: "ccc"
    });
    // console.log("Hellocd")
    // if (this.showPhb) {
    //     this.phbView.active = false;
    //     curscene.hideBack()
    //     this.showPhb = false;
    // } else {
    //     curscene.showBack()
    //     this.phbView.active = true;
    //     this.showPhb = true;
    // }
    // if (tywx.publicwx) {
    //     console.log("Hellocd")
    //     wx.postMessage({
    //         method: 1,
    //         MAIN_MENU_NUM: "x1",
    //     });
    // }
}), _defineProperty(_cc$Class, "hidePhbView", function hidePhbView() {
    // console.log("çç.showPhb = " + typeof (curscene.phbView))
    // if (curscene.showPhb) {
    //     curscene.phbView.active = false;
    //     curscene.showPhb = false;
    //     curscene.hideBack()
    // } else {
    //     curscene.phbView.active = true;
    //     curscene.showBack()
    //     curscene.showPhb = true;
    // }

}), _defineProperty(_cc$Class, "loadFinishCallBack", function loadFinishCallBack() {
    if (this.node) {
        // this.node.destroy();
    }
}), _defineProperty(_cc$Class, "setScore", function setScore(score) {
    if (score != null) {
        this.gameScore.string = Math.abs(score);
    }
}), _defineProperty(_cc$Class, "startGame", function startGame() {
    console.log("Hellocd");
    cc.director.loadScene("gamemain"); //, this.loadFinishCallBack
}), _defineProperty(_cc$Class, "shareApp", function shareApp() {
    if (tywx.IsWechatPlatform()) {
        wx.shareAppMessage({
            title: "赶紧加入我们，一起愉快的玩耍吧...",
            imageUrl: "https://gss0.bdstatic.com/7Ls0a8Sm1A5BphGlnYG/sys/portrait/item/d68bced2b5c4b7dcb6b73838383d02.jpg?20180808115403"
        });
    }
}), _defineProperty(_cc$Class, "requestConfigInfo", function requestConfigInfo() {
    this.requestTimes--;
    var _configUrl = tywx.SystemInfo.cdnPath + 'config/addone.json';
    var that = this;
    console.log('请求的CDN地址 = ' + _configUrl);
    var successcb = function successcb(ret) {
        that.requestTimes = 3;
        var v = tywx.SystemInfo.version;
        var uid = parseInt(tywx.UserInfo.userId);
        var c, cb, d;
        c = ret['v' + v];
        cb = ret['' + v + '_ABTEST'];
        d = ret;
        var tconfig = config;
        if (!d) {
            //没找到缺省服务器配置...
            console.log('No default server config, use local config...');
            d = config;
        }
        if (!c) {
            //没找到版本对应配置，使用缺省配置...
            config = d;
        } else {
            //AB测试...
            if (cb) {
                if (uid % 2 == 0) {
                    config = c;
                } else {
                    config.CONFIG = cb;
                }
            } else {
                config = c;
            }
            //把缺省配置中的配置项复制到当前配置...
        }
        // for(var k in d) {
        //     if(config[k] === undefined){
        //        config[k] = d[k];
        //     }
        // }

        for (var k in tconfig) {
            if (config[k] === undefined) {
                config[k] = tconfig[k];
            }
        }

        tywx.ado.Configs = config;
        tywx.config = tywx.ado.Configs;
        console.log('请求后的数据 ' + JSON.stringify(tywx.config));
    };

    var failcb = function failcb(ret) {
        if (that.requestTimes > 0) {
            that.requestConfigInfo();
        } else {
            config = config;
        }
    };

    tywx.HttpUtil.httpGet({
        'url': _configUrl
    }, successcb, failcb);
}), _defineProperty(_cc$Class, "showBack", function showBack() {
    this.phbback.node.active = true;
    this.phbback.node.opacity = 165;
}), _defineProperty(_cc$Class, "hideBack", function hideBack() {
    this.phbback.node.active = false;
    this.phbback.node.opacity = 0;
}), _defineProperty(_cc$Class, "givePlayerItems", function givePlayerItems() {
    console.log("当前玩家的1 = " + parseInt(tywx.Util.getItemFromLocalStorage("hadgiveitem", 0)));
    if (parseInt(tywx.Util.getItemFromLocalStorage("hadgiveitem", 0)) === 0) {
        console.log("当前玩家的2 = " + parseInt(tywx.Util.getItemFromLocalStorage("hadgiveitem", 0)));
        tywx.Util.setItemToLocalStorage("hadgiveitem", 1);
        var giveitems = [];
        for (var djIndex = 0; djIndex < config.allitem.length; djIndex++) {
            var titem = {};
            titem.id = config.allitem[djIndex].id;
            titem.num = config.initGivePlayerItemNumber;
            giveitems.push(titem);
        }
        tywx.Util.setItemToLocalStorage("allitems", JSON.stringify(giveitems));
    }
}), _defineProperty(_cc$Class, "firstShowHelpView", function firstShowHelpView() {
    // if(parseInt(tywx.Util.getItemFromLocalStorage("hadshowhelpview",0)) === 0){
    //    tywx.Util.setItemToLocalStorage("hadshowhelpview",1); 
    //    this.showPlayMethod();
    // }
}), _cc$Class));

cc._RF.pop();