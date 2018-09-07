(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/gamestart.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8ba15DE9d9OK5/fQtsc43VN', 'gamestart', __filename);
// Script/gamestart.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
   游戏开始界面
   created by gyc on 2018-08-02.
   final changed time by gyc on  2018-08-03
*/
var config = require("AddOneConfig");
tywx.publicwx = true;
// 记录下当前的场景 用于异步调用
var curscene = null;
var gamestart = cc.Class({
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

        phbNameLabel: {
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
        phbShareBtn: {
            default: null,
            type: cc.Node
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
        contentView: {
            default: null,
            type: cc.Node
        },

        addInMyMini: {
            default: null,
            type: cc.Node
        },

        shouZHiNode: {
            default: null,
            type: cc.Node
        },

        icon: cc.Sprite,
        //! 请求次数上线
        requestTimes: 3,
        // 当前是否有保存的游戏数据
        haveStoreGameData: -1

    },

    start: function start() {
        //是否发布微信版本
        if (tywx.publicwx) {
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 635;
            window.sharedCanvas.height = 60 * 30;
        }
        this.showPhb = false;
    },


    /**
     * 刷新子域的canvas
     */
    _updateSubDomainCanvas: function _updateSubDomainCanvas() {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        // tywx.ado.Utils.createAndSaveImg2WXAlbum({});
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
    ctor: function ctor() {},

    update: function update(delayTime) {
        if (tywx.publicwx) {
            //    this._updateSubDomainCanvas();   
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
    onLoad: function onLoad() {
        wx.postMessage({
            method: "load_data",
            MAIN_MENU_NUM: "ADDONE_SCORE2"
        });
        this.haveStoreGameData = tywx.ado.loadProgress();
        tywx.ado.Utils.showGameClub();
        var _ref = [cc.game.canvas.width, cc.game.canvas.height],
            cw = _ref[0],
            ch = _ref[1];

        var is_ipx = ch / cw >= 1.9;
        if (is_ipx) {
            console.log("iphone x start game");
            this.addInMyMini.y = this.addInMyMini.y - 45;
        }
        this.playSZAni(this.shouZHiNode, 1, 1.2);
        // ! Modify by luning [06-09-18] 交叉导流icon,这个版本隐藏
        //tywx.AdManager.showAd(cc.v2(100, 100),'GAME_START');

        // this.contentView.height = 60 * 30; 
        this.phbShareBtn.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.RANK_SHARE);
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
                        tywx.ado.Utils.showGameClub();
                    } else {
                        self.phbView.active = true;
                        self.showPhb = true;
                        tywx.ado.Utils.hideGameClub();
                        window.wx.postMessage({
                            method: 2,
                            MAIN_MENU_NUM: "ADDONE_SCORE2",
                            shareTicket: data.shareTickets[0]
                        });
                        // 开一个线程监听次时间段用户是否有点击
                        self.phbNameLabel.string = "群排行榜";
                        tywx.Timer.setTimer(self, function () {
                            self._updateSubDomainCanvas();
                        }, 1, 11, 0);
                    }
                });

                groupBtnComponent.setErrorCall(function (data) {
                    console.log("分享失败后处理的回调函数 ", data);
                });
            }
        }
        var score = tywx.ado.Utils.loadItem("ADDONE_SCORE2", 0);
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
        //  游戏的点击逻辑
        this.phbback.node.on('touchstart', function (event) {
            return true;
        }, this);

        var self = this;

        curscene = this;

        curscene.hideBack();
        this.givePlayerItems();
        console.log("本地的项目配置 = " + JSON.stringify(config));
        this.requestConfigInfo();
        // 开一个线程监听次时间段用户是否有点击

        tywx.Timer.setTimer(self, function () {
            self._updateSubDomainCanvas();
        }, 1, 11, 0);

        // ! 菜单不显示banner
        //this.showBanner();
    },

    /**
     * @description: 第一个星星产生一个放大缩小的动画 并且产生提示动画
     */
    playSZAni: function playSZAni(node, stime, scale) {
        node.stopAllActions();
        var scaletime = !stime ? 0.2 : stime;
        var tscale = !scale ? 1.2 : scale;
        var scaleBoom = cc.scaleTo(scaletime, tscale);
        var scaleSmaller = cc.scaleTo(scaletime, 1);
        var delay = cc.delayTime(scaletime);
        var seq = cc.sequence(scaleBoom, scaleSmaller, delay);
        var rep = cc.repeatForever(seq);
        node.runAction(rep);
    },

    onDestroy: function onDestroy() {
        tywx.ado.Utils.hideGameClub();
        tywx.ado.Utils.destroyWXBanner();
    },


    /*
        调用: 点击游戏帮助的时候调用
        功能: 展示游戏玩法
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 游戏需要
    */
    showPlayMethod: function showPlayMethod() {
        if (this.helpviewpre != null) {
            this.helpviewpre.destroy();
            this.helpviewpre = null;
        }
        // 添加帮助
        this.helpviewpre = cc.instantiate(this.helpViewPre);

        this.helpview.active = !this.helpview.active ? true : false;
        if (this.helpview.active == true) {
            this.helpviewpre.parent = this.helpview;
            this.helpviewpre.x = -360;
            this.helpviewpre.y = 0;
            this.helpviewscript = this.helpviewpre.getComponent("helpview");
            // console.log("this.helpviewscript.setCloseCall" + this.helpviewscript.setCloseCall);
            this.helpviewscript.setCloseCall(function () {
                curscene.showPlayMethod();
            });
            tywx.ado.Utils.hideGameClub();
            curscene.showBack();
        } else {
            curscene.hideBack();
            tywx.ado.Utils.showGameClub();
        }
    },

    /*
        调用: 点击游戏帮助的时候调用
        功能: 展示游戏玩法
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 游戏需要
    */

    showGiftView: function showGiftView() {
        this.giftview.active = !this.giftview.active ? true : false;
        if (this.giftview.active == true) {
            curscene.showBack();
        } else {
            curscene.hideBack();
        }
    },

    /*
        调用: 点击排行榜的时候调用
        功能: 展示玩家微信好友在游戏中的排名
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 游戏需要
    */
    showFriendPhbView: function showFriendPhbView() {
        console.log("Hellocd");
        var self = this;
        if (this.showPhb) {
            this.phbView.active = false;
            curscene.hideBack();
            tywx.ado.Utils.showGameClub();
            this.showPhb = false;
        } else {
            curscene.showBack();
            tywx.ado.Utils.hideGameClub();
            this.phbView.active = true;
            this.showPhb = true;
            if (tywx.publicwx) {
                console.log("Hellocd");
                wx.postMessage({
                    method: 1,
                    MAIN_MENU_NUM: "ADDONE_SCORE2"
                });
            }
            // 开一个线程监听次时间段用户是否有点击
            self.phbNameLabel.string = "好友排行榜";
            tywx.Timer.setTimer(self, function () {
                self._updateSubDomainCanvas();
            }, 1, 11, 0);
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
    hidePhbView: function hidePhbView() {
        console.log("çç.showPhb = " + _typeof(curscene.phbView));
        if (curscene.showPhb) {
            curscene.phbView.active = false;
            curscene.showPhb = false;
            tywx.ado.Utils.showGameClub();
            curscene.hideBack();
        } else {
            curscene.phbView.active = true;
            curscene.showBack();
            tywx.ado.Utils.hideGameClub();
            curscene.showPhb = true;
        }
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
    loadFinishCallBack: function loadFinishCallBack() {
        if (this.node) {
            // this.node.destroy();
        }
    },

    /*
        调用: 进入小游戏的时候开始调用
        功能: 显示玩家的最高得分
        参数: [
            score: 玩家当前的最高得分
        ]
        返回值:[
            无
        ]
        思路: 游戏需要
    */
    setScore: function setScore(score) {
        if (score != null) {
            this.gameScore.string = Math.abs(score);
        }
    },

    /**
     * 请求获取配置信息
     */
    requestConfigInfo: function requestConfigInfo() {

        this.requestTimes--;
        var _configUrl = tywx.SystemInfo.cdnPath + 'config/addone2.json';
        var that = this;

        console.log('请求的CDN地址 = ' + _configUrl);

        var successcb = function successcb(ret) {
            console.log("服务器读到的配置:" + JSON.stringify(ret));
            that.requestTimes = 3;
            var v = tywx.SystemInfo.version;
            var uid = parseInt(tywx.UserInfo.userId);
            var c, cb, d;
            c = ret['' + v];
            cb = ret['' + v + '_ABTEST'];
            d = ret['default'];
            if (!d) {
                //没找到缺省服务器配置...
                console.log('No default server config, use local config...');
                d = config;
            }
            if (!c) {
                //没找到版本对应配置，使用缺省配置...
                config = d;
                console.log(_configUrl + 'use default config...');
            } else {
                //AB测试...
                if (cb) {
                    if (uid % 2 == 0) {
                        config = c;
                        console.log(_configUrl + 'use ' + v + '_A server config...');
                    } else {
                        config = cb;
                        console.log(_configUrl + 'use ' + v + '_B server config...');
                    }
                } else {
                    config = c;
                    console.log(_configUrl + 'use ' + v + ' server config...');
                }
                //把缺省配置中的配置项复制到当前配置...
                for (var k in d) {
                    if (config[k] === undefined) config[k] = d[k];
                }
            }
            tywx.ado.Configs = config;
            tywx.config = config;
            console.log('CONFIG ' + JSON.stringify(config));
        };

        var failcb = function failcb(ret) {
            if (that.requestTimes > 0) {
                that.requestConfigInfo();
            } else {
                tywx.ado.Configs = config;
                tywx.config = config;
            }
        };

        tywx.HttpUtil.httpGet({
            'url': _configUrl
        }, successcb, failcb);
    },

    /**
     * 显示排行榜黑色排行榜
     */
    showBack: function showBack() {
        this.phbback.node.active = true;
        this.phbback.node.opacity = 165;
    },

    /**
     * 隐藏排行榜黑色背景
     */
    hideBack: function hideBack() {
        this.phbback.node.active = false;
        this.phbback.node.opacity = 0;
    },

    /**
     * 初始化的时候给玩家三个道具
     * 参数: 无
     */
    givePlayerItems: function givePlayerItems() {
        if (parseInt(tywx.Util.getItemFromLocalStorage("hadgiveitem", 0)) === 0) {
            tywx.Util.setItemToLocalStorage("hadgiveitem", 1);
            var giveitems = [];
            for (var djIndex = 0; djIndex < tywx.ado.Constants.GameCenterConfig.allitem.length; djIndex++) {
                var titem = {};
                titem.id = tywx.ado.Constants.GameCenterConfig.allitem[djIndex].id;
                titem.num = tywx.ado.Constants.GameCenterConfig.initGivePlayerItemNumber;
                giveitems.push(titem);
            }
            tywx.Util.setItemToLocalStorage("allitems", JSON.stringify(giveitems));
        }
    },
    showBanner: function showBanner() {
        tywx.ado.Utils.createAndShowWXBanner();
        this.schedule(this.bannerRefresh, tywx.ado.Constants.WXAdConfig.bannerRefreshTime);
    },
    bannerRefresh: function bannerRefresh() {
        tywx.ado.Utils.createAndShowWXBanner();
    },


    /*
            调用: 点击开始游戏的时候调用
            功能: 进入游戏界面
            参数: [
                无
            ]
            返回值:[
                无
            ]
            思路: 游戏需要
        */
    startGame: function startGame() {
        if (this.haveStoreGameData != -1) {
            this.showGoonProgress();
        } else {
            cc.director.loadScene("gamemain");
        }
    },

    /**
     * @description 继续游戏进度的分享回调
     */
    goonProgressGame: function goonProgressGame(reset) {
        if (reset) {
            tywx.ado.resetProgerss();
        }

        cc.director.loadScene("gamemain");
    },

    /**
     * @description 弹出游戏的选择是否继续进度的对话框
     */
    showGoonProgress: function showGoonProgress() {
        if (tywx.config.auditing == true) {
            cc.director.loadScene("gamemain");
            return;
        }
        var self = this;
        self.hasgononstate = false;
        tywx.ado.Utils.showWXModal("分享继续之前的进度", '继续游戏', true,
        // 确定
        function () {
            var config = tywx.ado.Constants.ShareConfig.RECOVER_GAME_SHARE;
            var groupSucCall = function groupSucCall() {
                self.goonProgressGame();
            };
            var succall = function succall() {
                self.hasgononstate = true;
            };

            var failcall = function failcall() {
                self.hasgononstate = true;
            };

            self.shareMiniApp(config, groupSucCall, succall, failcall);
        },
        // 取消
        function () {
            self.goonProgressGame(true);
        });
    },

    /**
     * @description 非分享按钮的分享 （手动分享）
     * @param {Object} shareconfig 分享配置信息
     * @param {Function} shareGroupCallBack 分享到群成功的回调
     * @param {Function} successCallBack 分享成功的回调
     * @param {Function} errorCallBack 分享失败的回调
     */
    shareMiniApp: function shareMiniApp(shareconfig, shareGroupCallBack, successCallBack, errorCallBack) {
        console.log("当前的分享配置  = " + JSON.stringify(shareconfig));
        var self = this;
        if (tywx.IsWechatPlatform()) {
            window.wx.showShareMenu({
                withShareTicket: true
            });
            var msg = tywx.ado.Utils.getRandomShareConfigByShareTag(shareconfig[0]);
            if (!msg) {
                msg = {};
                msg.shareContent = "你知道" + "1 吗？";
                msg.sharePicUrl = "https://marketqn.nalrer.cn/teris/share_image/jiayi/jy03.jpg";
                msg.sharePointId = "766";
                msg.shareSchemeId = "1155";
            }
            if (msg) {
                tywx.ShareInterface.share(msg.shareContent, msg.sharePicUrl, msg.sharePointId, msg.shareSchemeId, function (res) {
                    tywx.LOGE("分享成功后的数据" + JSON.stringify(res));
                    // * is share to group
                    if (shareconfig && shareconfig[1]) {
                        // * froce share to group
                        if (res.shareTickets !== undefined && res.shareTickets.length > 0) {
                            if (shareconfig[0] === tywx.ado.Constants.ShareConfig.RANK_SHARE[0]) {
                                shareGroupCallBack && shareGroupCallBack(res);
                            } else {
                                tywx.ado.Utils.share2GroupByTicket(shareconfig[0], res, function () {
                                    // * success callback
                                    shareGroupCallBack && shareGroupCallBack(res);
                                }, function () {
                                    // * failed callback
                                    // tywx.ado.Utils.showWXModal('请分享到不同群', "", false, function () {
                                    // if (self.hasgononstate) {
                                    self.goonProgressGame();
                                    // self.showGoonProgress()
                                    // self.hasgononstate = false;
                                    // }
                                    // });
                                    // errorCallBack && errorCallBack(null);
                                });
                            }
                        } else {
                            // * failed
                            tywx.ado.Utils.showWXModal('请分享到群', "", false, function () {
                                if (self.hasgononstate) {
                                    self.showGoonProgress();
                                    self.hasgononstate = false;
                                }
                            });
                            errorCallBack && errorCallBack(null);
                        }
                    } else {
                        // * success
                        successCallBack && successCallBack(res);
                    }
                }, function (data) {
                    tywx.LOGE("分享成功后的数2据" + JSON.stringify(data));
                    errorCallBack && errorCallBack(data);
                });
            }
        }
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
        //# sourceMappingURL=gamestart.js.map
        