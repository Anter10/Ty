/*
   游戏开始界面
   created by gyc on 2018-08-02.
   final changed time by gyc on  2018-08-03
*/
var config = require("AddOneConfig")
tywx.publicwx = true;
// 记录下当前的场景 用于异步调用
var curscene = null;
var gamestart = cc.Class({
    extends: cc.Component,
    properties: {
        startButton: {
            default: null,
            type: cc.Button,
        },
        backButton: {
            default: null,
            type: cc.Button,
        },
        audioCtr: {
            default: null,
            type: cc.Prefab,
        },
        userItem: {
            default: null,
            type: cc.Prefab,
        },
        gameScore: {
            default: null,
            type: cc.Label,
        },
        historyLabel: {
            default: null,
            type: cc.Label,
        },

        phbNameLabel: {
            default: null,
            type: cc.Label,
        },
        phb: {
            default: null,
            type: cc.Button,
        },
        phbback: {
            default: null,
            type: cc.Sprite,
        },
        helpback: {
            default: null,
            type: cc.Sprite,
        },
        giftback: {
            default: null,
            type: cc.Node,
        },
        method: {
            default: null,
            type: cc.Button,
        },
        phbSprite: {
            default: null,
            type: cc.Sprite,
        },
        phbShareBtn: {
            default: null,
            type: cc.Node,
        },
        shareBtn: {
            default: null,
            type: cc.Node,
        },
        groupBtn: {
            default: null,
            type: cc.Node,
        },
        phbView: {
            default: null,
            type: cc.Node,
        },

        helpview: {
            default: null,
            type: cc.Node,
        },

        giftview: {
            default: null,
            type: cc.Node,
        },

        helpViewPre: {
            default: null,
            type: cc.Prefab,
        },
        contentView: {
            default: null,
            type: cc.Node,
        },

        icon: cc.Sprite,
        //! 请求次数上线
        requestTimes: 3,
    },
    

    start() {
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
    _updateSubDomainCanvas: function () {
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
    ctor: function () {

    },

    update: function (delayTime) {
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
    onLoad: function () {
        wx.postMessage({
            method: "load_data",
            MAIN_MENU_NUM: "ADDONE_SCORE",
        });
        // this.contentView.height = 60 * 30; 
        this.phbShareBtn.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.RANK_SHARE);
        console.log("当前屏幕尺寸  " + JSON.stringify(cc.view.getDevicePixelRatio()) + JSON.stringify(cc.view.getVisibleSize()));
        tywx.PropagateInterface.getShareConfigInfo(); //! 获取所有分享点信息
        if (tywx.publicwx) {
            var msg = tywx.ShareInterface.getRandomOnShareAppMessageInfo();
            if (msg) {
                tywx.ShareInterface.setOnShareAppMessageInfo(msg.title, msg.imageUrl, msg.sharePointId, msg.shareSchemeId);
                console.log("当前获得的分享信息 = " + JSON.stringify(msg))
            }
            // 设置分享组件的回调和数据
            var shareComponent = this.shareBtn.getComponent("ShareButton");

            if (shareComponent) {
                shareComponent.setErrorCall(function (data) {
                    console.log("分享失败后处理的回调函数 ", data);
                })

                shareComponent.setSuccessCall(function (data) {
                    console.log("分享成功后处理的回调函数 ", data);
                })

                shareComponent.setShareConfig(tywx.ado.Constants.ShareConfig.FIRST_PAGE_SHARE);
            }

            // 设置群组排行榜组件的回调和数据
            var groupBtnComponent = this.groupBtn.getComponent("ShareButton");
            var self = this;

            if (groupBtnComponent) {
                groupBtnComponent.setShareConfig(tywx.ado.Constants.ShareConfig.RANK_SHARE);
                groupBtnComponent.setShareGroupCall(function (data) {
                    console.log("群分享当前的文档")
                    if (self.showPhb) {
                        self.phbView.active = false;
                        self.showPhb = false;
                    } else {
                        self.phbView.active = true;
                        self.showPhb = true;
                        window.wx.postMessage({
                            method: 2,
                            MAIN_MENU_NUM: "ADDONE_SCORE",
                            shareTicket: data.shareTickets[0]
                        });
                        // 开一个线程监听次时间段用户是否有点击
                        self.phbNameLabel.string = "群排行榜";
                        tywx.Timer.setTimer(self, function () {
                            self._updateSubDomainCanvas();
                        }, 1, 2, 0);
                    }


                })

                groupBtnComponent.setErrorCall(function (data) {
                    console.log("分享失败后处理的回调函数 ", data);
                })

            }

        }
        var score = tywx.ado.Utils.loadItem("ADDONE_SCORE", 0);
        if (score != null) {
            this.gameScore.string = score;
            let length = (score + "").length;
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
            console.log("当前分数不存在")
        }
        //  游戏的点击逻辑
        this.phbback.node.on('touchstart', function (event) {
            return true;
        }, this);

        var self = this;

        curscene = this;

        curscene.hideBack()
        this.givePlayerItems();
        console.log("本地的项目配置 = " + JSON.stringify(config))
        this.requestConfigInfo();
        // 开一个线程监听次时间段用户是否有点击

        tywx.Timer.setTimer(self, function () {
            self._updateSubDomainCanvas();
        }, 1, 2, 0);
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
    showPlayMethod: function () {
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
            console.log("this.helpviewscript.setCloseCall" + this.helpviewscript.setCloseCall);
            this.helpviewscript.setCloseCall(function () {
                curscene.showPlayMethod();
            });
            curscene.showBack()
        } else {
            curscene.hideBack()
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

    showGiftView: function () {
        this.giftview.active = !this.giftview.active ? true : false;
        if (this.giftview.active == true) {
            curscene.showBack()
        } else {
            curscene.hideBack()
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
    showFriendPhbView: function () {
        console.log("Hellocd")
        var self = this;
        if (this.showPhb) {
            this.phbView.active = false;
            curscene.hideBack()
            this.showPhb = false;
        } else {
            curscene.showBack()
            this.phbView.active = true;
            this.showPhb = true;
            if (tywx.publicwx) {
                console.log("Hellocd")
                wx.postMessage({
                    method: 1,
                    MAIN_MENU_NUM: "ADDONE_SCORE",
                });
            }
            // 开一个线程监听次时间段用户是否有点击
            self.phbNameLabel.string = "好友排行榜";
            tywx.Timer.setTimer(self, function () {
                self._updateSubDomainCanvas();
            }, 1, 2, 0);
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
    hidePhbView: function () {
        console.log("çç.showPhb = " + typeof (curscene.phbView))
        if (curscene.showPhb) {
            curscene.phbView.active = false;
            curscene.showPhb = false;
            curscene.hideBack()
        } else {
            curscene.phbView.active = true;
            curscene.showBack()
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
    loadFinishCallBack: function () {
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
    setScore: function (score) {
        if (score != null) {
            this.gameScore.string = Math.abs(score);
        }
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
    startGame: function () {
        cc.director.loadScene("gamemain");
    },
    
    /**
     * 请求获取配置信息
     */
    requestConfigInfo: function () {

        this.requestTimes--;
        var _configUrl = tywx.SystemInfo.cdnPath + 'config/addone2.json';
        var that = this;

        console.log('请求的CDN地址 = ' + _configUrl);

        var successcb = function (ret) {
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
                    if (config[k] === undefined)
                        config[k] = d[k];
                }
            }
            tywx.ado.Configs = config;
            tywx.config = config;
            console.log('CONFIG ' + JSON.stringify(config));
        };

        var failcb = function (ret) {
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
    showBack: function () {
        this.phbback.node.active = true;
        this.phbback.node.opacity = 165;
    },


    /**
     * 隐藏排行榜黑色背景
     */
    hideBack: function () {
        this.phbback.node.active = false;
        this.phbback.node.opacity = 0;
    },

    /**
     * 初始化的时候给玩家三个道具
     * 参数: 无
     */
    givePlayerItems: function () {
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

});