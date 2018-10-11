"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'gamemain');
// Script/gamemain.js

"use strict";

var _cc$Class;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
    游戏的逻辑UI
    游戏的操作的主要逻辑在这个module里面编写
    created by gyc on 2018-08-01.
*/

// 倒入游戏涉及到的module
var config = require("AddOneConfig");
var gezi = require("GeZi");
var mask = require("GeZiMask");
var maxzorder = 999;

var gezi_map = [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, // 4
0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, // 5
0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, // 6
1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, // 7
0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, // 6
0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, // 5
0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0 // 4
];
var gamemain = cc.Class((_cc$Class = {
    extends: cc.Component,
    properties: {
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        showalertmsg: {
            default: null,
            type: cc.Label
        },
        num: {
            default: [],
            type: cc.Label
        },
        allpngs: {
            default: [],
            type: cc.Prefab
        },
        showNumberPrefab: {
            default: null,
            type: cc.Prefab
        },
        celltile: {
            default: null,
            type: cc.Prefab
        },
        stars: {
            default: [],
            type: cc.Node
        },
        stopView: {
            default: null,
            type: cc.Node
        },
        tupojilu: {
            default: null,
            type: cc.Node
        },

        fuHuo: {
            default: null,
            type: cc.Node
        },
        fuHuoBtn: {
            default: null,
            type: cc.Node
        },
        stopV: {
            default: null,
            type: cc.Node
        },
        stopButton: {
            default: null,
            type: cc.Node
        },
        pjlView: {
            default: null,
            type: cc.Node
        },
        openboxview: {
            default: null,
            type: cc.Node
        },
        itemview: {
            default: null,
            type: cc.Node
        },

        yyview: {
            default: null,
            type: cc.Node
        },

        goodEft: {
            default: null,
            type: cc.Node
        },

        coolEft: {
            default: null,
            type: cc.Node
        },

        awesEft: {
            default: null,
            type: cc.Node
        },

        unbeliveEft: {
            default: null,
            type: cc.Node
        },

        chuiziEft: {
            default: null,
            type: cc.Node
        },

        giveYouItemLabel: {
            default: null,
            type: cc.Label
        },
        giveYouRedPackLabel: {
            default: null,
            type: cc.Label
        },
        loseScoreLabel: {
            default: null,
            type: cc.Label
        },
        maxScoreLabel: {
            default: null,
            type: cc.Label
        },
        sgfldjLabel: {
            default: null,
            type: cc.Label
        },
        sharelqScoreLabel1: {
            default: null,
            type: cc.Label
        },
        sharelqScoreLabel2: {
            default: null,
            type: cc.Label
        },

        GameOver: {
            default: null,
            type: cc.Label
        },
        loseShareButtton: {
            default: null,
            type: cc.Node
        },
        pjlShareButtton: {
            default: null,
            type: cc.Node
        },
        topRootView: {
            default: null,
            type: cc.Node
        },
        musicBtn: {
            default: null,
            type: cc.Node
        },

        itemhelpview: {
            default: null,
            type: cc.Node
        },

        loseRestartGameBtn: {
            default: null,
            type: cc.Node
        },

        friendsNode: {
            default: null,
            type: cc.Node
        },
        mergeAniNode: {
            default: null,
            type: cc.Prefab
        },

        helpview: {
            default: null,
            type: cc.Node
        },
        pjlScoreLabel: {
            default: null,
            type: cc.Label
        },

        ljnumberLabel: {
            default: null,
            type: cc.Label
        },

        itemframes: {
            default: [],
            type: cc.SpriteFrame
        },

        maxscoreLabel: {
            default: null,
            type: cc.Label
        },

        recoverNumberLabel: {
            default: null,
            type: cc.Label
        },

        // 本局最大数的label
        curmaxnumberLabel: {
            default: null,
            type: cc.Label
        },
        // 本局最大数的label
        fh1Label: {
            default: null,
            type: cc.Label
        },
        // 本局最大数的label
        fh2Label: {
            default: null,
            type: cc.Label
        },
        // 玩家红包数量的Label
        moneyLabel: {
            default: null,
            type: cc.Label
        },
        openBoxIconSprite: {
            default: null,
            type: cc.Sprite
        },

        // 排名的Sprite
        paimingSprite: {
            default: null,
            type: cc.Sprite
        },

        effect: {
            default: null,
            type: cc.Prefab
        },
        djitem: {
            default: null,
            type: cc.Prefab
        },
        lifeStarPrefab: {
            default: null,
            type: cc.Prefab
        },
        gameOut: {
            default: null,
            type: cc.Sprite
        },

        friendIcon: {
            default: null,
            type: cc.Sprite
        },
        stopViewBack: {
            default: null,
            type: cc.Sprite
        },
        tupoJIluAni: {
            default: null,
            type: cc.Prefab
        },
        helpViewPre: {
            default: null,
            type: cc.Prefab
        },
        mflqBtn: {
            default: null,
            type: cc.Node
        },
        // 血量提示tip
        hpHelpTips: {
            default: null,
            type: cc.Node
        },

        gameOutRoot: {
            default: null,
            type: cc.Node
        },

        luckboxroot: {
            default: null,
            type: cc.Node
        },

        cellUpView: {
            default: null,
            type: cc.Node
        },

        btRootView: {
            default: null,
            type: cc.Node
        },
        addScoreLabelPools: {
            default: null,
            type: cc.NodePool
        },

        addScoreNode: {
            default: null,
            type: cc.Prefab
        },
        getMoneyBtn: {
            default: null,
            type: cc.Node
        },
        gameOverMaxRoot: {
            default: null,
            type: cc.Node
        },

        // 游戏的背景
        bg: cc.Node,
        // 重新开始的按钮
        restart: cc.Button,
        // 当前玩家得分
        score: 0,
        // 玩家当前体力 默认为最大值
        point: tywx.ado.hpvalue,
        // 当前点击的块ID
        g_mask_samecnt: 0,
        //点击的格子ID
        g_clickid: -1,
        //游戏状态-无，等待点击，移动，下落等
        gamestate: 'null',
        //游戏状态的计时
        gamestatetime: 0,
        //当前最大值
        maxnum: 5,
        //此次点击产生的连击数
        lianjiNumber: 1,
        // 存放每个格子的数组
        g_gezi: [],
        // 存放每个mask的数组
        g_mask: [],
        // 玩家当前道具
        allitems: [],
        // 此时距离上次点击屏幕有多长时间
        curtimeawaypre: 10,
        // 控制隐藏好友
        isShowFIcon: false,
        // 此局复活次数
        recoverNumber: 0,
        // 此局是否展示过破纪录
        hadShowPjl: false,
        // 此局是否展示过破纪录
        allOpenItems: [],
        // 此次连接产生的道具
        produceItem: null,
        // 此局是否是进入游戏后的重新开始的局
        isRestartGame: false,
        // 显示宝箱的数量
        showboxNumber: 0,
        // 上一次的生命值
        prepoint: 0,
        // 时间段内玩家是否有点击过屏幕 true: 有点击 false: 没有点击 
        hadClickScreen: false,
        // 当前处于使用状态的道具ID
        curUsingItemData: null,
        // 是哦用道具不消耗生命
        isUsingItem: false,
        // 当前是否在刷新mask
        refreshingMask: false,
        // 此次点击是否有分数产生
        hasProduceNewScore: false,
        // 此次是否已经加过num
        hadAddNum: false,
        // 当前需要合并的所有块的ID
        allmergecellIds: [],
        // 显示加分时间
        showAddTime: 0.1,
        // 此次点击是否产生过大于10的分享
        hadProducetantenNUmber: false,
        // 开始动画时间
        startDropTime: 0,
        // 当前奖励分数
        curGiveScore: 0,
        // 是否已经弹出过领取界面
        hadshowlqbox: false,
        // 记录当前数字显示过小皇冠
        curshowxhgs: [],
        // 记录已经标示有小皇冠的格子
        allxhggz: [],
        // 所有禁用小皇冠ID
        alljzxhgid: [],
        // 所有展示过分享领奖的数字
        allshowshareids: [],
        // 交换道具的使用
        twocellexchange: [],
        // 打开宝箱之前禁止操作盘面
        playjjaniing: false,
        // 本局合出来的最大数
        curmaxNumber: 5,
        // 之前存储的进度数据
        curPreStorePData: null,
        // 领取如意box的按钮
        ryBox: cc.Node,
        ryBoxBack: cc.Sprite,
        // 如意宝箱的按钮
        ryBoxBtn: cc.Node,
        // 控制帮助显示广告
        isitemhelphide: false,
        // 当前的免费领取道具是否是领取红包
        curmflqIsRedPacket: false,
        // 每局限制使用的道具数量
        useItemNumber: 0,
        // 当前红包的状态
        curRedPacketStatue: 0,
        // 红包飞行图标
        redpacketicon: {
            default: null,
            type: cc.Node
        },
        getRedPacketBtn: {
            default: null,
            type: cc.Node
        },
        fhShowLabel: cc.Label,
        fhHideLabel: cc.Label,
        fhDjsLabel: cc.Label,
        adNode: cc.Node,
        quanSprite: cc.Node,
        mflqhideLabel: cc.Label,
        mflqshowLabel: cc.Label,
        mflqshareNode: cc.Node,
        returnBtnNode: cc.Node,
        closeBtnNode: cc.Node
    },

    /**
     * @description 设置当前合出的最大数
     * @param {Number} maxnum 设置的最大数
     */
    setCurMaxNumber: function setCurMaxNumber(maxnum) {
        if (maxnum > this.curmaxNumber) {
            this.curmaxNumber = maxnum;
        }
    },

    /**
     * @description 添加交换对象
     * @param {celltile} cell 格子对象
     */
    addJHCell: function addJHCell(cell) {
        if (this.twocellexchange.length < 2) {
            this.twocellexchange[this.twocellexchange.length] = cell;
        } else {
            console.log("交换格子数不对");
        }
    },

    /**
     * @description 清空交换对象
     */
    clearJHCell: function clearJHCell() {
        this.twocellexchange = [];
    },

    /**
     * @description 使用交换道具的时候调用
     */
    exchangeTWOCell: function exchangeTWOCell() {
        if (this.twocellexchange.length == 2) {

            // 交换完成后检查是否有合并
        } else {
            console.log("请选择交换对象");
        }
    },

    /**
     * @description 添加展示过小皇冠的number
     * @param {Number} id 对应的数字
     */
    addXHGId: function addXHGId(id) {
        this.alljzxhgid[this.alljzxhgid.length] = id;
    },

    // 处理当前保存的最大值以下的小皇冠ID
    dealAddStoreMaxNum: function dealAddStoreMaxNum() {
        console.log("游戏初始化的时候的最大值= " + starNum);
        for (var starNum = 7; starNum <= this.curmaxNumber; starNum++) {
            if (starNum % 2 == 0) {
                this.addXHGId(starNum);
                this.allshowshareids[this.allshowshareids.length] = starNum;
            }
        }
    },

    /**
     * @description 判断给定给的数字是否显示过皇冠
     * @param {Number } id 数字
     */
    hadXHGId: function hadXHGId(id) {
        for (var ti = 0; ti < this.alljzxhgid.length; ti++) {
            if (this.alljzxhgid[ti] == id) {
                return true;
            }
        }
        return false;
    },

    /**
     * @description 添加小皇冠的cell
     * @param {celltile} cell 格子对象
     */
    addXHGCell: function addXHGCell(cell) {
        this.allxhggz[this.allxhggz.length] = cell;
    },

    /**
     * @description 处理小皇冠的显示
     */
    dealXhgCells: function dealXhgCells() {
        for (var mai = 0; mai < this.getAllmask().length; mai++) {
            if (this.allpngs[mai]) {
                this.allpngs[mai].getComponent("celltile").setCurNum(this.getAllmask()[mai].num);
                this.allpngs[mai].getComponent("celltile").showHG();
            }
        }
    },

    /**
     * @description 得到对应格子的数据
     * @param {Number} id 对应格子的ID
     */
    getIDData: function getIDData(id) {
        return this.getAllmask()[id];
    },

    /**
     * @description: 场景加载完成后的一些UI逻辑处理 
     */
    onLoad: function onLoad() {
        var an = tywx.AdManager.getAdNodeByTag('GAME_START');
        console.log("IIIIIIIIIIAD....", an, tywx.AdManager.adNodeList.length);
        if (an) an.hideAdNode();
        this.maxpoint = tywx.ado.hpvalue;
        this.pos = this.gameOutRoot.convertToWorldSpace(this.gameOutRoot.position);
        console.log(JSON.stringify(this.pos1) + " v= " + JSON.stringify(cc.view.getVisibleSize()) + "尺寸= " + this.gameOutRoot.width + " z = " + this.gameOutRoot.height + " 坐标 = " + JSON.stringify(this.pos));
        tywx.gamecenter = this;
        tywx.ado.inGame(this);
        this.addScoreLabelPools = new cc.NodePool();
        var curcount = 15;
        for (var _i = 0; _i < curcount; ++_i) {
            var scoreNodeLabel = cc.instantiate(this.addScoreNode); // 创建节点
            this.addScoreLabelPools.put(scoreNodeLabel); // 通过 putInPool 接口放入对象池
        }
        this.pjlShareButtton.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.POJILU_SHARE);
        // 初始分数显示为0
        this.scoreLabel.string = this.score;
        var self = this;

        var tmp_lbid = -1;
        this.tnum = [];
        // 循环生成初始游戏
        for (var i = 0; i < gezi_map.length; i++) {
            tmp_lbid = -1;
            if (gezi_map[i] == 1) {
                var node = new cc.Node("node");
                var cellt = cc.instantiate(this.celltile);
                var script = cellt.getComponent("celltile");

                script.setClickCall(function (data, celltile) {
                    self.palyAudioByIndex(tywx.ado.Constants.GameCenterConfig.SOUNDS.POPUPCLOSE);
                    if (!self.playjjaniing) {
                        self.touchEndCallback(data, celltile);
                    }
                });
                this.allpngs.push(cellt);
                cellt.parent = this.yyview;
                cellt.position = cc.v2(0, 0);
                node.position = cc.v2(0, 0);
                node.parent = this.node;

                this.tnum.push(1);
                tmp_lbid = this.tnum.length - 1;
                script.setId(i);
                // console.log("当前的格子changdu  " + this.tnum.length);
                // cellt.active = false;
            } else {
                this.allpngs.push(null);
            }

            var tmp_g = new gezi(i, this, tmp_lbid);
            this.getAllgz().push(tmp_g);
            var tmp_m = new mask(i, this);
            this.getAllmask().push(tmp_m);
        }

        console.log("格子图片总数 = " + this.allpngs.length);
        if (tywx.publicwx) {
            this.tex = new cc.Texture2D();
        }
        var self = this;
        // 游戏的点击逻辑
        // this.node.on('touchend', function ( event ) {
        //     if(self.stopView.active == false){
        //         var mpos = event.touch.getLocation();
        //         self.touchEndCallback(mpos.x,mpos.y);
        //     }
        // });
        // 前一个产生的随机数
        this.prerandomnumber = 0;
        // 初始游戏
        this.initgame();

        this.isRestartGame = false;
        //   // 游戏的点击逻辑
        this.stopViewBack.node.on('touchstart', function (event) {
            return true;
        });

        this.gameOut.node.on('touchstart', function (event) {
            return true;
        });

        this.ryBoxBack.node.on('touchstart', function (event) {
            return true;
        });

        // var effect = cc.instantiate(this.effect);
        // this.node.parent.addChild(effect);
        // effect.x = 140;
        // effect.y = 90;
        this.showItem();
        // 设置复活按钮的点击回调
        tywx.LOGE("dddds" + JSON.stringify(config));
        this.fhBtnShow();
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
            fhbut.setShareConfig(tywx.ado.Constants.ShareConfig.RECOVER_GAME_SHARE_VIDEO);
        }
        // 开启一个进程循环显示即将超逾的玩家
        tywx.Timer.setTimer(self, function () {
            self.showMinFriend();
        }, 10, cc.macro.REPEAT_FOREVER, 0);

        // // 开启一个进程循环隐藏即将超逾的玩家
        tywx.Timer.setTimer(self, function () {
            self.hideMinFriend();
        }, 15, cc.macro.REPEAT_FOREVER, 5);

        // 开一个线程监听次时间段用户是否有点击
        tywx.Timer.setTimer(self, function () {
            if (this.gamestate == tywx.ado.Constants.GameCenterConfig.gameState.waitclick) {
                this.hadClickScreen = false;
                self.dealPlayerNoClickScreen();
            }
        }, 15, 0, 15);

        this.node.on('touchend', function (event) {
            self.itemhelpview.getComponent("ItemHelp").hideView();
            self.curUsingItemData = null;
            if (self.isitemhelphide == true) {
                tywx.ado.Utils.showWXBanner();
                self.isitemhelphide = false;
            }
            self.itemhelpview.active = false;
            self.dealPlayerClickScreen();
            self.hadClickScreen = true;
        });

        // 设置免费领取的回调
        this.mflq = this.mflqBtn.getComponent("ShareButton");
        this.produceHPAni(this.mflqBtn, 0.6, 1.1);
        console.log("当前红包是否可以直接领取 " + tywx.config.auditing);
        if (tywx.config.auditing == true) {
            this.mflq.setReactCall(true);
        } else {
            this.mflq.setReactCall(false);
        }
        this.mflq.setSuccessCall(function () {
            self.lingQuBox();
        });
        this.mflq.setShareGroupCall(function () {
            self.lingQuBox();
        });
        this.mflq.setShareConfig(tywx.ado.Constants.ShareConfig.FREE_GIFT_SHARE);

        this.showNumberNode = cc.instantiate(this.showNumberPrefab);
        this.showNumberNode.active = false;
        this.showNumberNode.parent = this.node;

        this.showNumberNode.getComponent("MoreTanNumber").setCloseCall(function () {
            self.hadshowlqbox = false;
        });

        var showmflqBtn = this.showNumberNode.getComponent("MoreTanNumber").getShareComponent();
        this.produceHPAni(this.showNumberNode.getChildByName("rootnode").getChildByName("xin2048_baoxiang_03").getChildByName("sharebuttton").getChildByName("button"), 0.6, 1.1);
        showmflqBtn.setShareConfig(tywx.ado.Constants.ShareConfig.FREE_GIFT_SHARE);
        if (tywx.config.auditing == true) {
            showmflqBtn.setReactCall(true);
        } else {
            showmflqBtn.setReactCall(false);
        }
        showmflqBtn.setSuccessCall(function () {
            // console.log("Helloc");
            // self.lingQuBox();
            self.showNumberNode.active = false;
            self.stopView.active = false;
            self.hadshowlqbox = false;
            self.showNumberNode.getComponent("MoreTanNumber").doubleScore();
        });
        showmflqBtn.setShareGroupCall(function () {
            // self.lingQuBox();
            self.showNumberNode.active = false;
            self.stopView.active = false;
            self.hadshowlqbox = false;
            self.showNumberNode.getComponent("MoreTanNumber").doubleScore();
        });
        // 设置保存照片成功后的回调
        this.showNumberNode.getComponent("MoreTanNumber").setStoreSucCallBack(function () {
            self.lingQuItem(true);
            // console.log("当前已经领取成功");
        });
        // this.showAnimationWhenScoreBiggerThanTen(14);
        this.firstShowHelpView();
        self.friendIcon.node.active = true;
        this.musicBtn.getComponent("Audio").changeTexture();
        var _ref = [cc.game.canvas.width, cc.game.canvas.height],
            cw = _ref[0],
            ch = _ref[1];

        var is_ipx = tywx.ado.Utils.isIpx();
        var is_ot = ch / cw > 1.9;
        if (is_ipx) {
            //    this.friendIcon.node.y = this.friendIcon.node.y + 40;
            this.topRootView.y = this.topRootView.y - 110;
            this.itemview.y = this.itemview.y - 90;
            this.btRootView.y = this.btRootView.y + 86;
        } else if (is_ot) {
            this.btRootView.y = this.btRootView.y + 94;
        }
        this.showBanner();
        // ! Modify by luning [07-09-2018] 矫正道具位置
        if (tywx.ado.Utils.isIpx()) {
            console.log('// ! Modify by luning [07-09-2018] ipxipxipxipx');
            //this.itemview.parent.position.y += 500;
        }
        this.btnRefreshGameOverPhotoCallback();
        this.flushRedPacketBtns(0);
        this.initShowBoxButton();
        // 设置当前红包的显示金额
        console.log("RedPacketInfo = " + JSON.stringify(tywx.ado.RedPacketInfo));
        this.moneyLabel.string = "\xA5" + (tywx.ado.Utils.formatCashFen2Yuan(tywx.ado.RedPacketInfo.totalAmount) || 0.0);
        //! 适配pad 
        if (tywx.ado.Utils.isPad()) {
            var tmp_view_screen = this.node.getChildByName('screen'); // 0.765
            var tmp_view_top_screen = this.node.getChildByName('topscreen'); // 0.156
            var s1 = tmp_view_screen.getContentSize();
            var s2 = tmp_view_top_screen.getContentSize();
            var s1_aim_h = this.node.getContentSize().height * 0.765;
            var s2_aim_h = this.node.getContentSize().height * 0.156;
            var s1_scale = s1_aim_h / s1.height;
            var s2_scale = s2_aim_h / s2.height;
            tmp_view_screen.scale = s1_scale;
            tmp_view_top_screen.scale = s2_scale;
        }

        // ! 显示交叉导流广告
        this.showCrossAd();
        // 监听红包事件
        tywx.NotificationCenter.listen(tywx.ado.Events.ADO_EVENT_RED_PACKET_CHANGE, this.onRedPacktChange, this);
    },

    /**
     * @description 复选框点击回调
     * @param {Object} toggle 复选框本身
     */
    toggleChecked: function toggleChecked(toggle) {
        if (!toggle.isChecked) {
            this.hideLabel.string = "视频领取";
            this.showLabel.string = "视频领取";
            this.mflqBtn.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.GIFT_GIFT_BOX_SHARE);
            this.mflqBtn.getComponent("ShareButton").setButtonCallType(2);
        } else {
            this.hideLabel.string = "分享领取";
            this.showLabel.string = "分享领取";
            this.mflqBtn.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.GIFT_GIFT_SHARE_BOX_SHARE);
            this.mflqBtn.getComponent("ShareButton").setButtonCallType(1);
        }
    },

    /** 
     * @description 红包数量变化
     */
    onRedPacktChange: function onRedPacktChange() {
        this.flushMoneyNumber();
    },

    /**
     * @description 退出游戏
     */
    onDestroy: function onDestroy() {
        // this.printMaskMsg();
        tywx.ado.outGame();

        tywx.ado.Utils.destroyWXBanner();
    },


    /**
     * @description 复活按钮的显示控制
     */
    fhBtnShow: function fhBtnShow() {
        // console.log("当前的版本信息 =" + tywx.SystemInfo.version + JSON.stringify(config));
        if (tywx.config.auditing == true) {
            this.fuHuo.active = false;
            this.loseRestartGameBtn.active = true;
        } else {
            this.fuHuo.active = true;
            // this.loseRestartGameBtn.active = false;
        }
    },

    /**
     * @description 添加小皇冠显示过的格子数据
     * @param {Number} num 格子显示的数字
     * @param {Number} id 格子的ID
     */
    addxhgNumber: function addxhgNumber(num, id) {
        // if (tywx.gamecenter.hasShowxhgNum(num) == false && tywx.gamecenter.hasShowxhgNum(id) == false) {
        this.curshowxhgs[this.curshowxhgs.length] = {
            id: id,
            num: num
        };
        // }
    },

    /**
     * @description 根据数字移除格子的数据
     * @param {Number} num 移除显示的格子数字
     */
    removexhgNumber: function removexhgNumber(num) {
        // console.log("当前的ID是1 = " + JSON.stringify(this.curshowxhgs));
        for (var thn = 0; thn < this.curshowxhgs.length; thn++) {
            if (this.curshowxhgs[thn].num == num) {
                // this.curshowxhgs.splice(thn, 1);
                this.curshowxhgs[thn].num = -1;
            }
        }
        // console.log("当前的ID是2 = " + JSON.stringify(this.curshowxhgs));
    },

    /**
     * @description 根据数字移除格子的数据
     * @param {Number} num 移除显示的格子数字
     */
    removexhgId: function removexhgId(id) {
        // console.log("当前的ID是1 = " + JSON.stringify(this.curshowxhgs));
        for (var thn = 0; thn < this.curshowxhgs.length; thn++) {
            if (this.curshowxhgs[thn].id == id) {
                // this.curshowxhgs.splice(thn, 1);
                this.curshowxhgs[thn].id = -1;
            }
        }
        // console.log("当前的ID是2 = " + JSON.stringify(this.curshowxhgs));
    },

    /**
     * @description 初始化领取的
     */
    initShowBoxButton: function initShowBoxButton() {
        if (tywx.config.share_control.comboitem == "video" && tywx.ado.isCanWatchVideo) {
            this.mflqshareNode.active = true;
            this.mflqhideLabel.string = "视频领取";
            this.mflqshowLabel.string = "视频领取";
            if (tywx.ado.isMinGanIP) {
                this.mflqshareNode.active = false;
            }
            this.mflqshareNode.getComponent("cc.Toggle").uncheck();
            this.mflq.setShareConfig(tywx.ado.Constants.ShareConfig.FREE_GIFT_SHARE_VIDEO);
            this.mflq.setButtonCallType(2);
        } else if (tywx.config.share_control.comboitem == "share" || !tywx.ado.isCanWatchVideo) {
            this.mflqshareNode.active = true;
            this.mflqhideLabel.string = "免费领取";
            this.mflqshowLabel.string = "免费领取";
            this.mflqshareNode.getComponent("cc.Toggle").check();
            this.mflq.setShareConfig(tywx.ado.Constants.ShareConfig.FREE_GIFT_SHARE);
            this.mflq.setButtonCallType(1);
        }

        if (!tywx.ado.isCanWatchVideo) {
            this.mflqshareNode.active = false;
        }
    }

}, _defineProperty(_cc$Class, "toggleChecked", function toggleChecked(toggle) {
    if (!toggle.isChecked) {
        this.mflqhideLabel.string = "视频领取";
        this.mflqshowLabel.string = "视频领取";
        this.mflq.setShareConfig(tywx.ado.Constants.ShareConfig.FREE_GIFT_SHARE_VIDEO);
        this.mflq.setButtonCallType(2);
    } else {
        this.mflqhideLabel.string = "免费领取";
        this.mflqshowLabel.string = "免费领取";
        this.mflq.setShareConfig(tywx.ado.Constants.ShareConfig.FREE_GIFT_SHARE);
        this.mflq.setButtonCallType(1);
    }
}), _defineProperty(_cc$Class, "showCrossAd", function showCrossAd() {
    // 审核状态不显示
    if (tywx.config.auditing === true) return;

    var adInfos = tywx.AdManager.rawAdInfoList;
    if (!adInfos || adInfos.length <= 0) return;
    var tmpAdInfo = adInfos[0];
    var adButton = this.adNode.getChildByName('adButton');
    adButton.on('click', function () {
        tywx.ado.Utils.jump2MiniProgramByConfig(tmpAdInfo);
    });
    var spriteIco = this.adNode.getChildByName('adIcon').getComponent(cc.Sprite);
    var self = this;
    cc.loader.load(tmpAdInfo.icon_url[0], function (err, texture) {
        if (!err) {
            var new_sprite_frame = new cc.SpriteFrame(texture);
            spriteIco.spriteFrame = new_sprite_frame;
            spriteIco.node.setContentSize(cc.size(100, 100));
            self.adNode.active = true;
            console.log("刷新CDN图片成功");
        }
    });
    //tywx.ado.Utils.refreshSpriteByUrl(spriteIco,tmpAdInfo.icon_url[0],cc.size(100,100));
}), _defineProperty(_cc$Class, "showmsm2", function showmsm2() {
    //  console.log("showmsm2 = " + JSON.stringify(this.curshowxhgs));
}), _defineProperty(_cc$Class, "showmsm1", function showmsm1() {
    // console.log("showmsm1 = " + JSON.stringify(this.curshowxhgs));
}), _defineProperty(_cc$Class, "hasShowxhgNum", function hasShowxhgNum(num, id) {
    if (this.curshowxhgs.length == 0) {
        return false;
    }
    for (var ti = 0; ti < this.curshowxhgs.length; ti++) {
        if (num == this.curshowxhgs[ti].num) {
            return true;
        }
    }
    return false;
}), _defineProperty(_cc$Class, "hasShowxhgId", function hasShowxhgId(id) {
    if (this.curshowxhgs.length == 0) {
        return false;
    }
    for (var ti = 0; ti < this.curshowxhgs.length; ti++) {
        if (id == this.curshowxhgs[ti].id) {
            return true;
        }
    }
    return false;
}), _defineProperty(_cc$Class, "setWaitClickState", function setWaitClickState() {

    // this.curshowxhgs = [];
    if (this.gamestate == tywx.ado.Constants.GameCenterConfig.gameState.gameover) {
        return;
    }
    if (this.point <= 0) {
        return;
    }
    // 判断连接数的大小 如果连接数大于不同的值则产生不同的效果
    if (this.gamestate != tywx.ado.Constants.GameCenterConfig.gameState.waitclick) {

        if (this.lianjiNumber >= tywx.config.combo_level_new.good && this.point > 0) {
            if (!this.hadshowlqbox) {
                this.dealLianJiNumber();
            } else {
                this.playjjaniing = false;
                if (this.hadshowlqbox) {
                    if (tywx.config.auditing == false) {
                        tywx.ado.Utils.hideWXBanner();
                        this.showNumberNode.active = true;
                        this.showCDAni();
                        this.showNumberNode.getComponent("MoreTanNumber").playAni();
                    }
                    this.hadshowlqbox = false;
                }
            }
        } else {
            if (this.hadshowlqbox) {
                if (tywx.config.auditing == false) {
                    tywx.ado.Utils.hideWXBanner();
                    this.showNumberNode.active = true;
                    this.showCDAni();
                    this.showNumberNode.getComponent("MoreTanNumber").playAni();
                }
                this.hadshowlqbox = false;
            } else if (this.hadShowPjl == false && this.point > 0 && this.hasProduceNewScore == true) {
                this.hasProduceNewScore = false;
                // this.pjlCallBack();
            }
        }
        this.showRYBoxButton();
        this.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.waitclick;
    }
}), _defineProperty(_cc$Class, "showRYBoxButton", function showRYBoxButton() {
    if (this.score >= tywx.config.ruyiScore && this.ryBoxBtn.active == false) {
        if (tywx.config.auditing == true) {
            this.ryBoxBtn.active = false;
        } else {
            this.ryBoxBtn.active = true;
            var animation = this.ryBoxBtn.getComponent(cc.Animation);
            animation.play("daiji");
        }
    } else if (this.score < tywx.config.ruyiScore) {
        this.ryBoxBtn.active = false;
    }
}), _defineProperty(_cc$Class, "setWaitNum", function setWaitNum(waitnum) {
    this.waitnum = waitnum;
}), _defineProperty(_cc$Class, "dealPlayerNoClickScreen", function dealPlayerNoClickScreen() {
    if (this.hadClickScreen == false) {
        var self = this;
        this.hadClickScreen = true;
        // 得到当前点击可以消除的格子
        var allcellids = [];
        for (var i = 0; i < gezi_map.length; i++) {
            this.resetAllMask();
            this.getAllmask()[i].num = this.getAllmask()[i].num + 1;
            this.checkmaskbyid(i, 0);
            if (this.g_mask_samecnt >= tywx.ado.Constants.GameCenterConfig.minCanRemoveNumber) {
                allcellids[allcellids.length] = i;
            }
        }

        // for(var ci = 0; ci < allcellids.length; ci ++){
        //     if(this.allpngs[allcellids[ci]] != null){
        //        this.allpngs[allcellids[ci]].getComponent("celltile").playDaijiEff();
        //     }
        // }

        if (allcellids.length > 0) {
            // console.log(" 所有可连接的ID = " + JSON.stringify(allcellids));
            self.node.stopAllActions();
            var delay = cc.delayTime(tywx.ado.Constants.GameCenterConfig.letUserClickTime);
            var idindex = 0;
            var call = cc.callFunc(function () {
                var cellid = allcellids[idindex];
                // console.log(idindex + " = 当前的ID信息 = " + cellid);
                if (idindex > 0) {
                    var precellid = allcellids[idindex - 1];
                    self.allpngs[precellid] && self.allpngs[precellid].getComponent("celltile").stopDaijiEff();
                }

                if (idindex - 1 >= 0) {
                    var precellid = allcellids[idindex - 1];
                    self.allpngs[precellid] && self.allpngs[precellid].getComponent("celltile").stopDaijiEff();
                } else {
                    var precellid = allcellids[allcellids.length - 1];
                    self.allpngs[precellid] && self.allpngs[precellid].getComponent("celltile").stopDaijiEff();
                }
                self.allpngs[cellid] && self.allpngs[cellid].getComponent("celltile").playDaijiEff();
                if (idindex == allcellids.length - 1) {
                    idindex = 0;
                } else {
                    idindex = idindex + 1;
                }
            });
            var seq = cc.sequence(call, delay);
            var rep = cc.repeatForever(seq);
            self.node.runAction(rep);
        }
    }
}), _defineProperty(_cc$Class, "dealPlayerClickScreen", function dealPlayerClickScreen() {
    // if(this.hadClickScreen == false){
    var self = this;
    this.node.stopAllActions();
    for (var ci = 0; ci < gezi_map.length; ci++) {
        if (this.allpngs[ci] != null) {
            this.allpngs[ci].getComponent("celltile").stopDaijiEff();
        }
    }
    this.hadClickScreen = true;
    // 开一个线程监听次时间段用户是否有点击
    tywx.Timer.setTimer(self, function () {
        if (self.gamestate == tywx.ado.Constants.GameCenterConfig.gameState.waitclick) {
            self.hadClickScreen = false;
            self.dealPlayerNoClickScreen();
        }
    }, 5, 0, 15);
    // }
}), _defineProperty(_cc$Class, "showPlayMethod", function showPlayMethod() {
    if (this.helpviewpre != null) {
        this.helpviewpre.destroy();
        this.helpviewpre = null;
    }
    // 添加帮助界面
    this.helpviewpre = cc.instantiate(this.helpViewPre);
    this.helpviewpre.x = 360;
    this.helpviewpre.y = 0;
    this.helpviewscript = this.helpviewpre.getComponent("helpview");
    var self = this;
    this.helpviewscript.setIsGame(1);
    this.helpviewscript.setCloseCall(function () {
        //  self.showSubStopView();
        self.helpview.active = !self.helpview.active ? true : false;
        self.showUseHpHelp(true);
        // console.log("当前的新手帮助")
    });

    this.helpviewscript.setStartGameCall(function () {
        self.helpview.active = !self.helpview.active ? true : false;
        self.showUseHpHelp(true);
    });
    this.helpviewpre.parent = this.helpview;
    self.helpview.active = !self.helpview.active ? true : false;
}), _defineProperty(_cc$Class, "fhsbCallBack", function fhsbCallBack() {
    // this.showAlert("请分享到不同的群");
    // this.visibleControllButton(false);
    // this.initgame();
}), _defineProperty(_cc$Class, "showItem", function showItem() {
    tywx.LOGE("当局 = ");
    var _ref2 = [cc.game.canvas.width, cc.game.canvas.height],
        cw = _ref2[0],
        ch = _ref2[1];

    var is_ipx = tywx.ado.Utils.isIpx();
    var is_ot = ch / cw > 1.9;
    if (is_ipx) {
        this.itemview.y = this.scoreLabel.node.y - 30;
    } else if (is_ot) {
        // this.itemview.y = this.scoreLabel.node.y - 15;
    }

    for (var itemIndex = 0; itemIndex < tywx.ado.Constants.GameCenterConfig.allitem.length; itemIndex++) {
        var item = cc.instantiate(this.djitem);
        var itemsceipt = item.getComponent("DjItem");
        itemsceipt.setData(tywx.ado.Constants.GameCenterConfig.allitem[itemIndex]);
        item.parent = this.itemview;
        var self = this;
        itemsceipt.setClickCall(function (data, item) {
            // 判断当前游戏是否是等待点击状态 不是则不能使用道具
            if (self.gamestate == tywx.ado.Constants.GameCenterConfig.gameState.waitclick) {
                // 判断道具数量足不足
                // 如果使用道具数量大于 则提示道具使用限制已达最大值
                if (self.useItemNumber > (tywx.config.mjUseItemNumber || 10)) {
                    self.showAlertMSG("道具使用次数已达" + (tywx.config.mjUseItemNumber || 10) + "次");
                    return;
                }

                if (data.num > 0) {
                    var canupdate = true;
                    if (data.id == 4) {
                        if (self.point == self.maxpoint) {
                            self.showAlert("当前生命值已满。");
                            canupdate = false;
                        } else {
                            self.recoverGame();
                        }
                    } else if (data.id == 5) {
                        // 加1血
                        tywx.LOGE("当前徐良= " + self.point + "," + self.maxpoint);
                        if (self.point < self.maxpoint) {
                            // self.showOneHpEf(item);
                            self.prepoint = self.point;
                            self.point = self.point + 1;
                            self.useItemNumber++;
                            self.drawPhyPoint();
                            canupdate = true;
                        } else {
                            canupdate = false;
                            self.showAlert("血量充足");
                        }
                    } else {
                        // canupdate = self.getAllPathByitemValue(data);
                        self.itemhelpview.active = true;
                        tywx.ado.Utils.hideWXBanner();
                        self.isitemhelphide = true;
                        var itemhelpscript = self.itemhelpview.getComponent("ItemHelp");
                        if (data.id == 2 || data.id == 1) {
                            self.curUsingItemData = data;
                            itemhelpscript.showNum(data.value);
                        } else if (data.id == 6) {
                            self.curUsingItemData = data;
                            itemhelpscript.showChuiZi();
                        }
                        canupdate = false;
                    }
                    // 显示
                    if (canupdate == true) {
                        data.num = data.num - 1;
                        if (data.num < 0) {
                            data.num = 0;
                        }
                        self.updateItemByData(data);
                    }
                } else {
                    self.showAlert("道具数量不足！");
                }
            }
        });

        item.x = 328 + itemIndex * 108;
        if (is_ipx) {
            item.y = item.y - 75;
        } else {
            item.y = item.y - 70;
        }
        this.allOpenItems.push(item);
    }
    // 刷新道具显示
    this.dealAllItems();
}), _defineProperty(_cc$Class, "showOneHpEf", function showOneHpEf(item) {
    if ((this.point != this.maxpoint || this.point != 1) && item.xx1Icon.node.getNumberOfRunningActions() == 0) {
        var node = this.stars[this.point];
        var newVec2 = node.convertToWorldSpace(cc.v2(node.x, node.y));
        var new1Vec2 = item.xx1Icon.node.convertToWorldSpace(cc.v2(item.xx1Icon.node.x, item.xx1Icon.node.y));
        var tmove = cc.moveTo(0.6, cc.v2(newVec2.x - new1Vec2.x - node.x - 30, newVec2.y - Math.abs(new1Vec2.y) - node.y));
        var seq = cc.sequence(tmove, cc.callFunc(function () {
            item.xx1Icon.node.x = 0;
            item.xx1Icon.node.y = 0;
        }));
        item.xx1Icon.node.runAction(seq);
    }
}), _defineProperty(_cc$Class, "updateItemByData", function updateItemByData(data) {
    if (data != null) {
        tywx.LOGE("当前更新的数据 = " + JSON.stringify(data));
        for (var itmindex = 0; itmindex < this.allitems.length; itmindex++) {
            var tdata = this.allitems[itmindex];
            if (tdata.id == data.id) {
                tdata.num = data.num;
                this.allitems[itmindex] = tdata;
                this.storeAllItem();
                this.dealAllItems(this.allitems);
                break;
            }
        }
    }
}), _defineProperty(_cc$Class, "addRecoverNumber", function addRecoverNumber() {
    this.recoverNumber = this.recoverNumber + 1;
    // 如果恢复的次数等于2的话 隐藏恢复按钮
    if (this.recoverNumber == tywx.ado.Constants.GameCenterConfig.maxrnum) {
        this.fuHuo.active = false;
    } else {
        this.fhBtnShow();
    }
}), _defineProperty(_cc$Class, "showAlert", function showAlert(msg) {
    wx.showToast({
        title: msg,
        icon: 'success',
        duration: 1500
    });
}), _defineProperty(_cc$Class, "showAlertMSG", function showAlertMSG(msg) {
    if (msg !== null && this.showalertmsg.node.getNumberOfRunningActions() === 0) {
        this.showalertmsg.node.stopAllActions();
        var self = this;
        this.showalertmsg.node.active = true;
        this.showalertmsg.string = msg;
        var ty = self.showalertmsg.node.y;
        var pri_pos = this.showalertmsg.node.position;
        var rc = function rc() {
            self.showalertmsg.node.active = false;
            self.showalertmsg.node.y = ty - 160;
            // 通过 tag 停止一个动作
            self.showalertmsg.node.stopAllActions();
            self.showalertmsg.node.position = pri_pos;
        };
        var move = cc.moveBy(2.5, cc.v2(0, 260));

        var call = cc.callFunc(rc);
        var seq = cc.sequence(move, call);
        this.showalertmsg.node.runAction(seq);
    }
    //tywx.ado.Utils.showWXToast(msg);
}), _defineProperty(_cc$Class, "showTouchEffect", function showTouchEffect(touchpos) {}), _defineProperty(_cc$Class, "showCDAni", function showCDAni() {
    if (!this.caiDaiAni) {
        this.caiDaiAni = cc.instantiate(this.tupoJIluAni);
        this.caiDaiAni.parent = this.node;
        this.caiDaiAni.zIndex = 100000000;
    } else {
        this.caiDaiAni.active = true;
    }
    var self = this;
    var removeCall = function removeCall() {
        self.caiDaiAni.active = false;
    };

    var ani = this.caiDaiAni.getComponent(cc.Animation);
    ani.on('finished', removeCall, self);
    //  console.log(ani + "当前的彩带动画 = " + this.caiDaiAni);
    ani.play("tupojilu");
}), _defineProperty(_cc$Class, "showStopView", function showStopView() {
    this.stopView.active = !this.stopView.active ? true : false;
    if (this.stopView.active == false) {
        this.stopV.active = false;
        this.pjlView.active = false;
        this.openboxview.active = false;
        if (this.itemhelpview.active == true) {
            tywx.ado.Utils.hideWXBanner();
        } else {
            tywx.ado.Utils.showWXBanner();
        }
    } else {
        tywx.ado.Utils.hideWXBanner();
    }
}), _defineProperty(_cc$Class, "showSubStopView", function showSubStopView() {
    this.stopView.active = !this.stopView.active ? true : false;
    this.stopV.active = !this.stopV.active ? true : false;
}), _defineProperty(_cc$Class, "stopCall", function stopCall() {
    if (this.gamestate == tywx.ado.Constants.GameCenterConfig.gameState.waitclick && !this.playjjaniing) {
        tywx.ado.Utils.hideWXBanner();
        this.openboxview.active = false;
        this.pjlView.active = false;
        this.stopView.active = !this.stopView.active ? true : false;
        this.stopV.active = !this.stopV.active ? true : false;
    }
}), _defineProperty(_cc$Class, "dealAllItems", function dealAllItems(allitem) {
    // tywx.Util.setItemToLocalStorage("allitems",JSON.stringify([{id:1, num:2}])); 
    var items = tywx.Util.getItemFromLocalStorage("allitems", []);
    tywx.LOGE("处理的道具数据 = " + items);
    // 刷新道具显示
    if (items != null && items != undefined && items != []) {
        try {
            if (allitem) {
                this.allitems = allitem;
            } else {
                this.allitems = JSON.parse(items);
            }
        } catch (e) {
            this.allitems = this.allitems;
        }
        for (var titemIndex = 0; titemIndex < this.allitems.length; titemIndex++) {
            var storitem = this.allitems[titemIndex];
            tywx.LOGE(titemIndex + "道具数据 = " + JSON.stringify(items));
            for (var openitemIndex = 0; openitemIndex < this.allOpenItems.length; openitemIndex++) {
                var topenitem = this.allOpenItems[openitemIndex].getComponent("DjItem");
                var tdata = topenitem.getData();
                if (tdata.id == storitem.id) {
                    tdata.num = storitem.num;
                    topenitem.setData(tdata);
                    break;
                }
            }
        }
    }
}), _defineProperty(_cc$Class, "produceItems", function produceItems(maxnum) {
    // 随机道具的ID
    var tindex = this.randomFrom(0, tywx.ado.Constants.GameCenterConfig.allitem.length - 1);
    var itemid = tywx.ado.Constants.GameCenterConfig.allitem[tindex].id;
    // 随机道具的数量

    var itemnum = 1;
    var itemname = "-1";
    var randomNum = Math.random();
    if (randomNum >= 1 - config.box_rate.sub1) {
        itemid = tywx.ado.Constants.GameCenterConfig.allitem[0].id;
        itemname = tywx.ado.Constants.GameCenterConfig.allitem[0].name;
    } else if (randomNum < 1 - config.box_rate.sub1 && randomNum >= 1 - config.box_rate.sub1 - config.box_rate.add2) {
        itemid = tywx.ado.Constants.GameCenterConfig.allitem[1].id;
        itemname = tywx.ado.Constants.GameCenterConfig.allitem[1].name;
    } else if (randomNum < 1 - config.box_rate.sub1 - config.box_rate.add2 && randomNum > config.box_rate.chui) {
        itemid = tywx.ado.Constants.GameCenterConfig.allitem[2].id;
        itemname = tywx.ado.Constants.GameCenterConfig.allitem[2].name;
    } else if (randomNum <= config.box_rate.chui) {
        itemid = tywx.ado.Constants.GameCenterConfig.allitem[3].id;
        itemname = tywx.ado.Constants.GameCenterConfig.allitem[3].name;
    }

    this.produceItem = {
        id: itemid,
        num: itemnum,
        name: itemname
    };
    tywx.LOGE("当前产生的道具 " + JSON.stringify(this.produceItem));
}), _defineProperty(_cc$Class, "randomFrom", function randomFrom(lowerValue, upperValue) {
    return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}), _defineProperty(_cc$Class, "ctor", function ctor() {
    tywx.LOGE("helloc g");
    config = tywx.config != null ? tywx.config : config;
}), _defineProperty(_cc$Class, "getAllgz", function getAllgz() {
    return this.g_gezi;
}), _defineProperty(_cc$Class, "getAllmask", function getAllmask() {
    return this.g_mask;
}), _defineProperty(_cc$Class, "getAllPathByitemValue", function getAllPathByitemValue(data) {

    if (this.gamestate == tywx.ado.Constants.GameCenterConfig.gameState.waitclick) {
        this.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.usingitem;
        // 得出当前可连的所有路径
        var allcellids = [];
        for (var i = 0; i < gezi_map.length; i++) {
            this.resetAllMask();
            this.getAllmask()[i].num = this.getAllmask()[i].num + data.value;
            this.checkmaskbyid(i, 0);
            if (this.g_mask_samecnt >= tywx.ado.Constants.GameCenterConfig.minCanRemoveNumber) {
                allcellids[allcellids.length] = i;
                break;
            }
        }
        this.resetAllMask();
        //  tywx.LOGE("当前值可消除的mask"+JSON.stringify(allcellids));
        if (allcellids.length > 0) {
            var _i2 = allcellids[0];
            var num = this.getAllgz()[_i2].num + data.value;
            this.getAllgz()[_i2].setnum(num);
            this.getAllgz()[_i2].settoblock();
            this.getAllgz()[_i2].block.effectid = 0;
            this.getAllgz()[_i2].block.effecttime = 0.5;
            if (num > this.maxnum) {
                this.setMaxNumber(num);
            }
            this.g_clickid = allcellids[0];
            this.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.checkclick;
            return true;
        } else {
            this.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.checkclick;
            tywx.ado.Utils.showWXToast("此块不能使用道具");
            return false;
        }
    }
    return false;
}), _defineProperty(_cc$Class, "touchEndCallback", function touchEndCallback(i, celltile) {
    if (this.getAllgz()[i] && this.getAllgz()[i].block && this.gamestate == tywx.ado.Constants.GameCenterConfig.gameState.waitclick) {
        var curaddnum = 1;
        var tdata = this.curUsingItemData;
        this.curUsingItemData = null;
        if (tdata != null && tdata.id != 6 || tdata == null) {
            if (tdata != null) {
                curaddnum = tdata.value;
            }
            // 判断当前的游戏状态是否为等待点击状态
            // 根据点击的点 来判断当前点击在那个格子上面
            var num = this.getAllgz()[i].num + curaddnum;
            this.setCurMaxNumber(num);
            this.showAnimationWhenScoreBiggerThanTen(num);
            if (num < 1) {
                this.showAlert("不能使用此道具");
            } else {

                if (tdata != null) {
                    tdata.num = tdata.num - 1;
                    if (tdata.num < 0) {
                        tdata.num = 0;
                    }
                    this.isUsingItem = true;
                    this.useItemNumber++;
                    this.updateItemByData(tdata);
                } else {
                    this.isUsingItem = false;
                }
                this.getAllgz()[i].setnum(num);
                this.getAllgz()[i].settoblock();
                this.getAllgz()[i].block.effectid = 0;
                this.getAllgz()[i].block.effecttime = 0.5;
                if (num > this.maxnum) {
                    this.setMaxNumber(num);
                }
                // 记录下当前点击的格子 和切换当前的游戏状态为检查点击状态
                this.g_clickid = i;
                this.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.checkclick;
                // 在方块上产生点击特效
                var mpos = {};
                this.showTouchEffect(mpos);
                // 终止此次点击的循环处理
            }
        } else {
            if (tdata != null) {
                tdata.num = tdata.num - 1;
                if (tdata.num < 0) {
                    tdata.num = 0;
                }
                this.isUsingItem = true;
                this.useItemNumber++;
                this.updateItemByData(tdata);
            } else {
                this.isUsingItem = false;
            }
            this.useCZClick(i, celltile);
        }
    }
}), _defineProperty(_cc$Class, "setMaxNumber", function setMaxNumber(num) {
    this.maxnum = num;
    this.maxScoreShow();
}), _defineProperty(_cc$Class, "useCZClick", function useCZClick(id, celltile) {
    var self = this;

    self.chuiziEft.active = true;
    self.chuiziEft.scale = 1.4;
    self.chuiziEft.parent = celltile.node;
    self.chuiziEft.x = 25;
    self.chuiziEft.y = -30;
    // self.chuiziEft.node.setLocalZOrder(1999);
    var anim = this.chuiziEft.getComponent(cc.Animation);
    var self = this;
    var finishCallback = function finishCallback() {
        self.chuiziEft.active = false;
        self.chuiziEft.parent = self.node;
        anim.stop("chuiziza");
    };
    var tid = id;
    var call = cc.callFunc(function () {
        self.getAllmask()[tid].step = 1;
        self.refreshbymask();
        self.lianjiNumber = 1;
        self.gamestatetime = tywx.ado.Constants.GameCenterConfig.drop_time;
        tywx.Timer.setTimer(self, function () {
            self.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.dodrop;
            self.hadAddNum = false;
            //pπ 开启一个进程循环显示即将超逾的玩家
        }, 0, 0, tywx.ado.Constants.GameCenterConfig.merge_delay_time);
    });

    var delay = cc.delayTime(0.5);
    var seq = cc.sequence(delay, call);
    celltile.node.runAction(seq);
    // self.getAllmask(tid).step = 0;

    // self.refreshbymask();
    // this.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.checkclick;


    var animateState = anim.play("chuiziza");
    animateState.wrapMode = cc.WrapMode.Normal;
    anim.on('finished', finishCallback, self);
}), _defineProperty(_cc$Class, "update", function update(dt) {
    // this.showAddTime = this.showAddTime - dt;
    if (this.startDropTime <= 0) {
        if (this.getAllgz().length == gezi_map.length) {
            for (var i = 0; i < this.getAllgz().length; i++) {
                if (this.getAllgz()[i].block) {
                    this.getAllgz()[i].block.tickmove(dt);
                    this.getAllgz()[i].block.tickeffect(dt, this.star, this.star1);
                    if (this.allpngs[i]) {
                        this.getAllgz()[i].draw(this.allpngs[i]);
                    }
                }
            }
        }
    }

    // this.dealXhgCells();


    if (this.isShowFIcon) {
        this._updateSubDomainCanvas();
    }
    switch (this.gamestate) {
        /*case tywx.ado.Constants.GameCenterConfig.gameState.waitclick:{
            if (this.hadShowPjl == false && this.point > 0) {
                this.pjlCallBack();
            }
            break;
        }*/
        case tywx.ado.Constants.GameCenterConfig.gameState.checkclick:
            {
                this.resetAllMask();
                var sc = this.getAllgz()[this.g_clickid].num;
                this.lianjiNumber = 1;

                this.allmergecellIds = [];
                this.allmergecellIds[this.allmergecellIds.length] = this.g_clickid;
                this.checkmaskbyid(this.g_clickid, 0);

                if (this.g_mask_samecnt >= tywx.ado.Constants.GameCenterConfig.minCanRemoveNumber) {
                    this.gamestatetime = this.getMergeTime() + tywx.ado.Constants.GameCenterConfig.merge_delay_time;
                    this.score += tywx.ado.Constants.GameCenterConfig.baseScore * this.g_mask_samecnt * 1;
                    this.hasProduceNewScore = true;
                    this.scoreLabel.string = this.score;
                    for (var i = 0; i < gezi_map.length; i++) {
                        // 判断是否已经标记 
                        if (this.getAllgz()[i].label_id >= 0 && this.getAllmask()[i].step != 9999999 && this.getAllmask()[i].step != 0) {
                            this.getAllgz()[i].block.speed_keep = tywx.ado.Constants.GameCenterConfig.gezi_h_s * 2 * this.getAllmask()[i].step / this.getMergeTime();
                            this.getAllgz()[i].block.actiontime_keep = this.getMergeTime() / this.getAllmask()[i].step;
                            this.getAllgz()[i].block.id_keep = i;
                            this.getAllgz()[i].block.id_dest = this.getAllmask()[i].from;
                            this.getAllgz()[i].block.adjustmove();
                        }
                    }
                    this.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.domove;
                    // console.log("当前可以连接的格子数ID是 = " + this.allmergecellIds)
                    this.showAddTime = 0.1;
                    this.addGetScoreLabelOnTile(this.allmergecellIds, tywx.ado.Constants.GameCenterConfig.baseScore);
                    // console.log("this.hadAddNum2 " + this.hadAddNum);
                    this.hadAddNum = false;
                } else {
                    this.hasProduceNewScore = false;
                    if (this.isUsingItem == true) {
                        this.isUsingItem = false;
                    } else {
                        this.point--;
                        this.drawPhyPoint();
                    }
                    // 判断游戏是否结束
                    if (this.point <= 0) {
                        this.gameOverCallBack();
                    } else {
                        // this.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.waitclick;
                        this.setWaitClickState();
                        this.finalDealMask();
                    }
                    // if (this.hadShowPjl == false) {
                    //     this.pjlCallBack();
                    // }
                }
                break;
            }
        //格子组合移动，进入掉落状态
        case tywx.ado.Constants.GameCenterConfig.gameState.domove:
            {
                this.gamestatetime -= dt;
                if (this.gamestatetime <= 0) {
                    this.dealDoMove();
                }
                if (this.gamestatetime <= tywx.ado.Constants.GameCenterConfig.merge_delay_time) {
                    if (this.hadAddNum == false) {
                        this.playMergeAnimation();
                        this.hadAddNum = true;
                        this.allpngs[this.g_clickid] && (this.allpngs[this.g_clickid].zIndex = maxzorder++);
                        var num = this.getAllgz()[this.g_clickid].num + 1;
                        this.getAllgz()[this.g_clickid].setnum(num);
                        this.setCurMaxNumber(num);
                        this.getAllgz()[this.g_clickid].block.num = num;
                        // this.allpngs[this.g_clickid].getComponent("celltile").showHG(num);
                        if (this.hadshowlqbox) {}
                        this.showAnimationWhenScoreBiggerThanTen(num);
                    }
                }

                break;
            }
        //格子掉落完，进入再次检查合并状态，或者等待点击状态
        case tywx.ado.Constants.GameCenterConfig.gameState.dodrop:
            {
                this.gamestatetime -= dt;
                if (this.gamestatetime <= 0) {
                    //console.log("dealLianJiLogic1")
                    this.dealLianJiLogic();
                }
                break;
            }

    }
}), _defineProperty(_cc$Class, "dealDoMove", function dealDoMove() {
    //  this.star.node.active = false;
    var self = this;
    // console.log("dealDoMovedealDoMovedealDoMove 1");
    this.gamestatetime = this.getMergeTime() + tywx.ado.Constants.GameCenterConfig.merge_delay_time;
    var num = this.getAllgz()[this.g_clickid].num;
    this.getAllgz()[this.g_clickid].settoblock();
    this.getAllgz()[this.g_clickid].block.effectid = 1;
    this.getAllgz()[this.g_clickid].block.effecttime = 0.5;
    if (num > this.maxnum) {
        this.setMaxNumber(num);
    }
    if (this.allpngs[this.g_clickid]) {
        var audioIndex = this.lianjiNumber % tywx.ado.Constants.GameCenterConfig.SOUNDS.COMBO.length - 1;
        // console.log(this.lianjiNumber + "当前播放的音效下标 = " + audioIndex);
        if (audioIndex < 0) {
            audioIndex = 0;
        }
        if (audioIndex > tywx.ado.Constants.GameCenterConfig.SOUNDS.COMBO.length - 1) {
            audioIndex = tywx.ado.Constants.GameCenterConfig.SOUNDS.COMBO.length - 1;
        }
        this.palyAudioByIndex(tywx.ado.Constants.GameCenterConfig.SOUNDS.COMBO[audioIndex]);
        this.allpngs[this.g_clickid] && this.allpngs[this.g_clickid].getComponent("celltile").playZhEff();
    }
    //  tywx.LOGE("Hellocd");
    this.refreshbymask();
    tywx.Timer.setTimer(self, function () {
        self.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.dodrop;
        // 开启一个进程循环显示即将超逾的玩家
    }, 0, 0, tywx.ado.Constants.GameCenterConfig.merge_delay_time);
}), _defineProperty(_cc$Class, "maxScoreShow", function maxScoreShow() {
    tywx.LOGD("产生最大数字", this.maxnum);
}), _defineProperty(_cc$Class, "getMergeTime", function getMergeTime() {
    var sc = this.g_mask_samecnt;
    var mt = tywx.ado.Constants.GameCenterConfig.merge_time;
    var ret = mt;
    if (sc > 4) ret = mt + mt * (sc - 4) * 0.2;
    //console.log("SC=", sc, "RET=", ret);
    return ret;
}), _defineProperty(_cc$Class, "dealLianJiLogic", function dealLianJiLogic() {
    var bfound = false;
    //console.log("dealLianJiLogic abc")
    for (var j = 0; j < gezi_map.length; j++) {
        if (this.getAllgz()[j].label_id == -1) continue;
        this.resetAllMask();
        var sc = this.getAllgz()[j].num;
        this.allmergecellIds = [];
        this.allmergecellIds[0] = 0;
        this.checkmaskbyid(j, 0);
        if (this.g_mask_samecnt >= tywx.ado.Constants.GameCenterConfig.minCanRemoveNumber) {
            this.gamestatetime = this.getMergeTime() + tywx.ado.Constants.GameCenterConfig.merge_delay_time;
            this.lianjiNumber++;
            this.score += tywx.ado.Constants.GameCenterConfig.baseScore * this.g_mask_samecnt * this.lianjiNumber;
            this.scoreLabel.string = this.score;
            for (var i = 0; i < gezi_map.length; i++) {
                if (this.getAllgz()[i].label_id >= 0 && this.getAllmask()[i].step != 9999999 && this.getAllmask()[i].step != 0) {
                    this.getAllgz()[i].block.speed_keep = tywx.ado.Constants.GameCenterConfig.gezi_h_s * 2 * this.getAllmask()[i].step / this.getMergeTime();
                    this.getAllgz()[i].block.actiontime_keep = this.getMergeTime() / this.getAllmask()[i].step;
                    this.getAllgz()[i].block.id_keep = i;
                    this.getAllgz()[i].block.id_dest = this.getAllmask()[i].from;
                    this.getAllgz()[i].block.adjustmove();
                }
            }
            bfound = true;
            this.g_clickid = j;
            this.allmergecellIds[0] = this.g_clickid;
            if (this.point < this.maxpoint) {
                this.point++;
            }
            this.drawPhyPoint();
            var self = this;
            // var num = this.getAllgz()[this.g_clickid].num + 1;
            // this.getAllgz()[this.g_clickid].setnum(num);
            // this.showAddTime = 0.1;
            this.addGetScoreLabelOnTile(this.allmergecellIds, tywx.ado.Constants.GameCenterConfig.baseScore * this.lianjiNumber);
            // console.log("当前可以连接的格子数ID是 = " + this.allmergecellIds)

            tywx.Timer.setTimer(self, function () {

                self.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.domove;
                // console.log("this.hadAddNum1 " + this.hadAddNum);
                self.hadAddNum = false;
                //pπ 开启一个进程循环显示即将超逾的玩家
            }, 0, 0, tywx.ado.Constants.GameCenterConfig.merge_delay_time);
            break;
        }
    }

    if (bfound == false) {
        // this.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.waitclick;
        this.setWaitClickState();
        this.finalDealMask();
    }
}), _defineProperty(_cc$Class, "dealLianJiNumber", function dealLianJiNumber() {
    this.playjjaniing = true;
    if (this.lianjiNumber == tywx.config.combo_level_new.good) {
        this.playGood();
        this.palyAudioByIndex(tywx.ado.Constants.GameCenterConfig.SOUNDS.GOOD);
        this.showboxNumber = this.lianjiNumber;
    } else if (this.lianjiNumber == tywx.config.combo_level_new.cool) {
        this.playCool();
        this.palyAudioByIndex(tywx.ado.Constants.GameCenterConfig.SOUNDS.COOL);
        this.showboxNumber = this.lianjiNumber;
    } else if (this.lianjiNumber == tywx.config.combo_level_new.awesome) {
        this.playAwesome();
        this.palyAudioByIndex(tywx.ado.Constants.GameCenterConfig.SOUNDS.AWESOME);
        this.showboxNumber = this.lianjiNumber;
    } else if (this.lianjiNumber >= tywx.config.combo_level_new.unbelive) {
        this.playUnbelive();
        this.palyAudioByIndex(tywx.ado.Constants.GameCenterConfig.SOUNDS.UNBLIEVEABLE);
        this.showboxNumber = this.lianjiNumber;
    } else {
        this.showboxNumber = 0;
        this.playjjaniing = false;
    }
    this.ljnumberLabel.string = this.lianjiNumber;
    //    else if(this.lianjiNumber > 1) {
    //       this.showBox(1);  
    //    }
}), _defineProperty(_cc$Class, "palyAudioByIndex", function palyAudioByIndex(fileName) {
    tywx.ado.AudioManager.playSound(fileName);
}), _defineProperty(_cc$Class, "playGood", function playGood() {
    var self = this;
    var animation = this.goodEft.getComponent(cc.Animation);

    var finishCallback = function finishCallback() {
        if (self.showboxNumber > 0) {
            self.showBox(this.showboxNumber);
            self.showboxNumber = 0;
        } else {
            this.playjjaniing = false;
        }
    };
    animation.on('finished', finishCallback, self);
    var animationState = animation.play("encourage");
}), _defineProperty(_cc$Class, "playCool", function playCool() {
    var self = this;
    var animation = this.coolEft.getComponent(cc.Animation);

    var finishCallback = function finishCallback() {
        if (self.showboxNumber > 0) {
            self.showBox(this.showboxNumber);
            self.showboxNumber = 0;
        } else {
            this.playjjaniing = false;
        }
    };
    animation.on('finished', finishCallback, self);
    var animationState = animation.play("encourage");
}), _defineProperty(_cc$Class, "playAwesome", function playAwesome() {
    var self = this;
    this.awesEft.active = true;
    var animation = this.awesEft.getComponent(cc.Animation);
    var finishCallback = function finishCallback() {
        if (self.showboxNumber > 0) {
            self.showBox(this.showboxNumber);
            self.showboxNumber = 0;
            this.awesEft.active = false;
        } else {
            this.playjjaniing = false;
        }
    };
    animation.on('finished', finishCallback, self);
    var animationState = animation.play("awesome");
    animationState.wrapMode = cc.WrapMode.Normal;
}), _defineProperty(_cc$Class, "playUnbelive", function playUnbelive() {
    var self = this;
    this.unbeliveEft.active = true;
    var animation = this.unbeliveEft.getComponent(cc.Animation);
    var finishCallback = function finishCallback() {
        if (self.showboxNumber > 0) {
            self.showBox(this.showboxNumber);
            self.showboxNumber = 0;
            self.unbeliveEft.active = false;
        } else {
            this.playjjaniing = false;
        }
    };
    animation.on('finished', finishCallback, self);
    var animationState = animation.play("unbli");
    animationState.wrapMode = cc.WrapMode.Normal;
}), _defineProperty(_cc$Class, "storeAllItem", function storeAllItem() {
    // console.log("当前存储的数据 = "+JSON.stringify(this.allitems))
    if (this.allitems) {
        tywx.Util.setItemToLocalStorage("allitems", JSON.stringify(this.allitems));
    }
}), _defineProperty(_cc$Class, "initStars", function initStars() {
    if (!this.allstars) {
        this.allstars = [];
        for (var starIndex = 0; starIndex < this.maxpoint; starIndex++) {
            var item = cc.instantiate(this.lifeStarPrefab);
            item.parent = this.stars[starIndex];
            if (this.maxpoint == 6) {
                if (starIndex > 0) {
                    this.stars[starIndex].x = this.stars[starIndex].x - starIndex * 28;
                }
                this.stars[starIndex].scaleX = 0.8;
            }
            this.allstars.push(item);
        }
    }
}), _defineProperty(_cc$Class, "drawPhyPoint", function drawPhyPoint() {
    this.initStars();
    if (this.point > 1) {
        this.allstars[0].scaleX = 1;
        this.allstars[0].scaleY = 1;
        this.allstars[0].stopAllActions();
    }
    if (this.prepoint == this.point) {
        return;
    }
    // 咋这里判断当前的血量是否为1 如果为1的话产生 动画提示和tips
    if (this.point == 1) {
        this.produceHPAni(this.allstars[0]);
        this.showAlertMSG("血量要耗光啦~");
    }
    this.prepoint = this.point;
    for (var starIndex = 0; starIndex < this.maxpoint; starIndex++) {
        if (this.point >= starIndex + 1) {
            this.allstars[starIndex].getComponent("LifeStar").show();
        } else {
            this.allstars[starIndex].getComponent("LifeStar").hide();
        }
    }
}), _defineProperty(_cc$Class, "produceHPAni", function produceHPAni(node, stime, scale) {

    node.stopAllActions();
    var scaletime = !stime ? 0.2 : stime;
    var tscale = !scale ? 1.2 : scale;
    var scaleBoom = cc.scaleTo(scaletime, tscale);
    var scaleSmaller = cc.scaleTo(scaletime, 1);
    var delay = cc.delayTime(scaletime);
    var seq = cc.sequence(scaleBoom, scaleSmaller, delay);
    var rep = cc.repeatForever(seq);
    node.runAction(rep);
}), _defineProperty(_cc$Class, "visibleControllButton", function visibleControllButton(vis) {
    this.gameOut.node.active = vis;
    if (this.gameOut.node.active == true) {
        tywx.ado.Utils.hideWXBanner();
        tywx.ado.Utils.commonScaleIn(this.gameOutRoot);
    } else {
        tywx.ado.Utils.showWXBanner();
    }
}), _defineProperty(_cc$Class, "returnBtnCall", function returnBtnCall() {
    this.fhDjsLabel.node.active = false;
    this.quanSprite.active = false;
    this.gameOverMaxRoot.active = true;
    this.closeBtnNode.active = true;
    this.returnBtnNode.active = false;
    this.fuHuo.active = false;
    this.fhDjsLabel.node.stopAllActions();
    this.gameOutRoot.stopAllActions();
    tywx.ado.Utils.commonScaleIn(this.gameOverMaxRoot);
}), _defineProperty(_cc$Class, "gameOverCallBack", function gameOverCallBack() {
    this.storeScore();
    tywx.ado.resetProgerss();
    this.hadshowlqbox = false;
    this.produceHPAni(this.fuHuoBtn, 0.6, 1.1);
    this.isShowFIcon = false;
    this.friendIcon.node.active = false;
    // 判断此次得分是否创纪录
    this.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.gameover;
    this.visibleControllButton(true);
    // 刷新当前的显示得分
    this.loseScoreLabel.string = this.score;
    // 刷新最大得分显示
    var maxscore = parseInt(tywx.ado.Utils.loadItem("ADDONE_SCORE2", 0));
    this.maxscoreLabel.string = "最好成绩 " + maxscore + "";
    if (this.recoverNumber < tywx.ado.Constants.GameCenterConfig.maxrnum) {
        this.recoverNumberLabel.string = tywx.ado.Constants.GameCenterConfig.maxrnum - this.recoverNumber;
    } else {
        this.recoverNumberLabel.string = 0;
    }
    console.log("当dd前的最大数" + this.curmaxNumber);
    this.curmaxnumberLabel.string = this.curmaxNumber + "";
    // 刷新显示的排行榜
    this.showOverFriendsPH();
    this.showCDAni();
    var self = this;
    var tdjs = 5;
    self.fhDjsLabel.string = tdjs;
    var totalPassTime = 0;
    var totalrepeate = 5;
    this.fhBtnShow();
    self.closeBtnNode.active = false;
    self.returnBtnNode.active = true;
    this.fhDjsLabel.node.scale = 1;
    this.fhDjsLabel.node.stopAllActions();
    this.gameOutRoot.stopAllActions();
    var djsCall = cc.callFunc(function () {
        self.fhDjsLabel.node.scale = 1;
        totalPassTime++;
        tdjs = tdjs - 1;
        if (tdjs == 0) {
            tdjs = 5;
            if (totalPassTime < totalrepeate) {
                self.fhDjsLabel.string = "" + tdjs;
            }
            self.setFHBtnCallBack(2);
        } else {
            self.fhDjsLabel.string = tdjs;
        }

        if (totalPassTime == totalrepeate) {
            // 显示UI
            self.fhDjsLabel.string = "";
            self.quanSprite.active = false;
            self.gameOverMaxRoot.active = true;
            tywx.ado.Utils.commonScaleIn(self.gameOverMaxRoot);
            self.fuHuo.active = false;
            self.closeBtnNode.active = true;
            self.returnBtnNode.active = false;
            self.fhDjsLabel.node.active = false;
        }
        var scale = cc.scaleTo(0.3, 0);
        var delay = cc.delayTime(1);
        var call = cc.callFunc(function () {

            if (totalPassTime == totalrepeate - 1) {
                self.fhDjsLabel.string = "";
                self.quanSprite.active = false;
                self.closeBtnNode.active = true;
                self.returnBtnNode.active = false;
            } else {
                if (totalPassTime != totalrepeate - 1) {
                    self.fhDjsLabel.string = tdjs - 1;
                }
            }

            self.fhDjsLabel.node.scale = 1;
        });
        var tseq = cc.sequence(delay, scale, call);
        self.fhDjsLabel.node.runAction(tseq);
    });

    // 如果是提审状态 直接显示 不走倒计时
    if (tywx.config.auditing || this.recoverNumber == tywx.ado.Constants.GameCenterConfig.maxrnum) {
        this.fhDjsLabel.node.active = false;
        this.quanSprite.active = false;
        this.gameOverMaxRoot.active = true;
        self.closeBtnNode.active = true;
        self.returnBtnNode.active = false;
        tywx.ado.Utils.commonScaleIn(this.gameOverMaxRoot);
    } else {
        this.gameOverMaxRoot.active = false;
        this.fhDjsLabel.node.active = true;
        this.quanSprite.active = true;
        this.fhDjsLabel.string = 5;
        // 倒计时动画
        var scale = cc.scaleTo(0.3, 0);
        var delay = cc.delayTime(1);
        var call = cc.callFunc(function () {
            self.fhDjsLabel.string = 4;
            self.fhDjsLabel.node.scale = 1;
        });
        var tseq = cc.sequence(delay, scale, call);
        this.fhDjsLabel.node.runAction(tseq);

        // 倒计时逻辑
        self.setFHBtnCallBack(2);
        var seq = cc.sequence(cc.delayTime(1.5), djsCall);
        var fiverepeat = cc.repeat(seq, totalrepeate);
        this.gameOutRoot.runAction(fiverepeat);
    }
}), _defineProperty(_cc$Class, "setFHBtnCallBack", function setFHBtnCallBack(calltype) {
    if (tywx.config.share_control.fuhuo == "video" && tywx.ado.isCanWatchVideo) {
        this.fhShowLabel.string = "视频复活";
        this.fhHideLabel.string = "视频复活";
        this.fuHuo.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.RECOVER_GAME_SHARE_VIDEO);
        this.fuHuo.getComponent("ShareButton").setButtonCallType(2);
    } else if (tywx.config.share_control.fuhuo == "share" || !tywx.ado.isCanWatchVideo) {
        this.fhShowLabel.string = "免费复活";
        this.fhHideLabel.string = "免费复活";
        this.fuHuo.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.RECOVER_SHARE_GAME_SHARE);
        this.fuHuo.getComponent("ShareButton").setButtonCallType(1);
    }
}), _defineProperty(_cc$Class, "showOverFriendsPH", function showOverFriendsPH() {
    this.isShowFIcon = false;
    wx.postMessage({
        method: 7
    });
    // this.tex.releaseTexture();
    window.sharedCanvas.width = 460;
    window.sharedCanvas.height = 180;
    var self = this;
    // 开启一个进程循环隐藏即将超逾的玩家
    var tindex = 0;
    wx.postMessage({
        method: 9
    });
    this.paimingSprite.node.active = false;
    tywx.Timer.setTimer(self, function () {
        if (tindex == 0) {
            wx.postMessage({
                method: 8
            });
        }
        tindex += 1;
        console.log("当前刷新次数 " + tindex);
        self.flushPHBView();
    }, 1, 5, 0);
}), _defineProperty(_cc$Class, "pjlCallBack", function pjlCallBack() {
    // 判断当前的得分是否超过了可显示的分数
    if (this.score < tywx.ado.Constants.GameCenterConfig.showPjlScore) {
        return;
    }
    // 判断此次得分是否创纪录
    if (this.score > parseInt(tywx.ado.Utils.loadItem("ADDONE_SCORE2", 0))) {
        this.hadShowPjl = true;
        this.visibleControllButton(false);
        var delay = cc.delayTime(0.1);
        var self = this;
        var call = cc.callFunc(function () {
            self.stopView.active = true;
            tywx.ado.Utils.hideWXBanner();
            self.pjlView.active = true;
            self.openboxview.active = false;
            self.stopV.active = false;
            self.pjlView.runAction(cc.sequence(cc.scaleTo(0.1, 1.1), cc.scaleTo(0.2, 1)));
        });
        var seq = cc.sequence(delay, call);
        tywx.LOGD("是否破纪录21212");
        this.node.runAction(seq);
        // var animation = this.tupojilu.getComponent(cc.Animation);
        // this.newPlayerEf.active = false;
        // animation.stop("tupojilu");
        // 刷新破纪录的显示
        this.pjlScoreLabel.string = this.score;
    }
}), _defineProperty(_cc$Class, "closePjlView", function closePjlView() {
    // 判断此次得分是否创纪录
    tywx.ado.Utils.showWXBanner();
    this.showStopView();
    this.pjlView.active = false;
}), _defineProperty(_cc$Class, "finalDealMask", function finalDealMask() {
    for (var i = 0; i < gezi_map.length; i++) {
        this.getAllgz()[i].settoblock();
    }
}), _defineProperty(_cc$Class, "initgame", function initgame(restart) {
    this.storeScore();

    this.hadstorephotonumber = false;
    // ! 读取进度
    var tmp_progress = restart ? -1 : tywx.ado.loadProgress();

    this.curmaxNumber = tmp_progress === -1 ? 5 : tmp_progress.curmaxNumber;
    this.score = tmp_progress === -1 ? 0 : tmp_progress.score;

    this.useItemNumber = tmp_progress === -1 ? 0 : tmp_progress.useitemnumber;
    this.playjjaniing = false;
    this.allshowshareids = [];
    this.alljzxhgid = [];
    this.allxhggz = [];
    this.curshowxhgs = [];
    this.hasProduceNewScore = false;
    this.hadProducetantenNUmber = false;
    this.startDropTime = 0;
    this.curGiveScore = 0;
    this.hadshowlqbox = false;
    wx.postMessage({
        method: 9
    });
    this.scoreLabel.string = this.score;
    this.point = tmp_progress === -1 ? this.maxpoint : tmp_progress.life;
    this.drawPhyPoint();
    this.maxnum = 5;
    this.recoverNumber = tmp_progress === -1 ? 0 : tmp_progress.recovernumber;
    this.fhBtnShow();
    this.isRestartGame = true;
    this.hadShowPjl = false;

    for (var i = 0; i < gezi_map.length; i++) {
        if (this.getAllgz()[i] && this.getAllgz()[i].label_id >= 0) {
            var num = tmp_progress === -1 ? this.getrandomnum() : tmp_progress.mask[i];
            this.getAllgz()[i].setnum(num);
            this.getAllgz()[i].settoblock();
            // this.allpngs[i].getComponent("celltile").setCurNum(this.getAllmask()[i].num);
            this.allpngs[i].getComponent("celltile").showHG();
        }
    }

    var needcheck = tmp_progress === -1;

    while (needcheck) {
        needcheck = false;
        for (i = 0; i < gezi_map.length; i++) {
            if (this.getAllgz()[i] && this.getAllgz()[i].label_id >= 0) {
                this.resetAllMask();
                this.checkmaskbyid(i, 0);
                if (this.g_mask_samecnt >= tywx.ado.Constants.GameCenterConfig.minCanRemoveNumber) {
                    this.changenumbymask();
                    needcheck = true;
                }
            }
        }
    }

    this.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.waitclick;
    this.visibleControllButton(false);

    if (parseInt(tywx.Util.getItemFromLocalStorage("hadshowhelpview", 0)) == 1) {
        this.showUseHpHelp(true);
    }
    if (restart) {
        this.startDropAnimation();
    }
    this.dealPlayerClickScreen();
    this.dealAddStoreMaxNum();
    this.showRYBoxButton();
    // 刷新当前的最高分
    this.storescorevalue = tywx.ado.Utils.loadItem("ADDONE_SCORE2", 0);
    this.setMaxScore();
}), _defineProperty(_cc$Class, "setMaxScore", function setMaxScore() {
    if (parseInt(this.storescorevalue) < this.score) {
        this.maxScoreLabel.string = this.score;
    } else {
        this.maxScoreLabel.string = this.storescorevalue;
    }
}), _defineProperty(_cc$Class, "startDropAnimation", function startDropAnimation() {
    var self = this;
    var allpos = [];
    for (var i = 0; i < gezi_map.length; i++) {
        this.allpngs[i] && (this.allpngs[i].active = false);
    }
    // 开启一个进程循环显示即将超逾的玩家
    tywx.Timer.setTimer(self, function () {
        for (var i = 0; i < gezi_map.length; i++) {
            self.allpngs[i] && (self.allpngs[i].active = true);
            var ty = this.randomFrom(300, 660);
            allpos[allpos.length] = ty;
            self.allpngs[i] && (self.allpngs[i].y = self.allpngs[i].y + ty);
        }
        self.startDropTime = 0.2;
        tywx.Timer.setTimer(self, function () {
            self.startDropTime = 0;
        }, 0, 0, tywx.ado.Constants.GameCenterConfig.startGameDropTime + 0.05);
        for (var ti = 0; ti < gezi_map.length; ti++) {
            var move = cc.moveBy(tywx.ado.Constants.GameCenterConfig.startGameDropTime, cc.v2(0, -allpos[ti]));
            self.allpngs[ti] && self.allpngs[ti].runAction(move);
        }
    }, 0, 0, 0.2);
}), _defineProperty(_cc$Class, "resetAllMask", function resetAllMask() {
    if (this.refreshingMask == false) {
        this.refreshingMask = true;
        for (var i = 0; i < gezi_map.length; i++) {
            if (this.getAllgz()[i].label_id >= 0) {
                this.getAllmask()[i].reset();
            }
        }
        this.g_mask_samecnt = 1;
        this.refreshingMask = false;
    }
}), _defineProperty(_cc$Class, "findtopinmask", function findtopinmask(id) {
    var tmpid1 = id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1);
    var tmpid2 = id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1);

    if (tmpid1 >= gezi_map.length || tmpid2 >= gezi_map.length) return -1;

    if (this.getAllgz()[tmpid1].label_id >= 0 && (this.getAllmask()[tmpid1].step == 9999999 || this.getAllmask()[tmpid1].step == 0)) {
        return tmpid1;
    }

    if (this.getAllgz()[tmpid2].label_id >= 0 && (this.getAllmask()[tmpid2].step == 9999999 || this.getAllmask()[tmpid2].step == 0)) {
        return tmpid2;
    }

    if (this.getAllgz()[tmpid1].label_id >= 0) return this.findtopinmask(tmpid1);
    if (this.getAllgz()[tmpid2].label_id >= 0) return this.findtopinmask(tmpid2);
}), _defineProperty(_cc$Class, "checkmaskbyid", function checkmaskbyid(id, step) {
    this.getAllmask()[id].step = step;
    // 从左找
    if (this.checkmaskleft(id, step) == true) {
        this.checkmaskbyid(id - 2, step + 1);
    }
    if (this.checkmaskdownleft(id, step) == true) {
        this.checkmaskbyid(id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1), step + 1);
    }
    if (this.checkmaskdownright(id, step) == true) {
        this.checkmaskbyid(id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1), step + 1);
    }
    if (this.checkmaskright(id, step) == true) {
        this.checkmaskbyid(id + 2, step + 1);
    }
    if (this.checkmaskupleft(id, step) == true) {
        this.checkmaskbyid(id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1), step + 1);
    }
    if (this.checkmaskupright(id, step) == true) {
        this.checkmaskbyid(id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1), step + 1);
    }
}), _defineProperty(_cc$Class, "checkmaskleft", function checkmaskleft(id, step) {
    if (!this.getAllmask()[id - 2]) {
        return false;
    }
    if (this.getAllmask()[id].x < 2) return false;

    if (gezi_map[id - 2] == 0) return false;

    if (this.getAllmask()[id - 2].num != this.getAllmask()[id].num) return false;

    if (this.getAllmask()[id - 2].step <= step) return false;

    if (this.getAllmask()[id - 2].step == 9999999) this.g_mask_samecnt++;

    this.getAllmask()[id - 2].step = step;
    this.getAllmask()[id - 2].from = id;
    this.allmergecellIds[this.allmergecellIds.length] = id - 2;
    return true;
}), _defineProperty(_cc$Class, "checkmaskright", function checkmaskright(id, step) {
    if (!this.getAllmask()[id + 2]) {
        return false;
    }
    if (this.getAllmask()[id].x >= 12) return false;

    if (gezi_map[id + 2] && gezi_map[id + 2] == 0) return false;

    if (this.getAllmask()[id + 2] && this.getAllmask()[id + 2].num != this.getAllmask()[id].num) return false;

    if (this.getAllmask()[id + 2] && this.getAllmask()[id + 2].step <= step) return false;

    if (this.getAllmask()[id + 2] && this.getAllmask()[id + 2].step == 9999999) this.g_mask_samecnt++;

    this.getAllmask()[id + 2].step = step;
    this.getAllmask()[id + 2].from = id;
    this.allmergecellIds[this.allmergecellIds.length] = id + 2;
    return true;
}), _defineProperty(_cc$Class, "checkmaskdownleft", function checkmaskdownleft(id, step) {
    if (this.getAllmask()[id].y == 0) return false;
    if (!this.getAllmask()[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)]) {
        return false;
    }
    if (gezi_map[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)] == 0) return false;

    if (this.getAllmask()[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)].num != this.getAllmask()[id].num) return false;

    if (this.getAllmask()[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)].step <= step) return false;

    if (this.getAllmask()[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)].step == 9999999) this.g_mask_samecnt++;

    this.getAllmask()[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)].step = step;
    this.getAllmask()[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)].from = id;
    this.allmergecellIds[this.allmergecellIds.length] = id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1);
    return true;
}), _defineProperty(_cc$Class, "checkmaskdownright", function checkmaskdownright(id, step) {
    if (this.getAllmask()[id].y == 0) return false;
    if (!this.getAllmask()[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)]) {
        return false;
    }
    if (gezi_map[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)] == 0) return false;

    if (this.getAllmask()[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)].num != this.getAllmask()[id].num) return false;

    if (this.getAllmask()[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)].step <= step) return false;

    if (this.getAllmask()[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)].step == 9999999) this.g_mask_samecnt++;

    this.getAllmask()[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)].step = step;
    this.getAllmask()[id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)].from = id;
    this.allmergecellIds[this.allmergecellIds.length] = id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1);
    return true;
}), _defineProperty(_cc$Class, "checkmaskupleft", function checkmaskupleft(id, step) {
    if (this.getAllmask()[id].y == 6) return false;
    if (!this.getAllmask()[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)]) {
        return false;
    }
    if (gezi_map[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)] == 0) return false;

    if (this.getAllmask()[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)].num != this.getAllmask()[id].num) return false;

    if (this.getAllmask()[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)].step <= step) return false;

    if (this.getAllmask()[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)].step == 9999999) this.g_mask_samecnt++;

    this.getAllmask()[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)].step = step;
    this.getAllmask()[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)].from = id;
    this.allmergecellIds[this.allmergecellIds.length] = id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1);
    return true;
}), _defineProperty(_cc$Class, "checkmaskupright", function checkmaskupright(id, step) {
    if (this.getAllmask()[id].y == 6) return false;
    if (!this.getAllmask()[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)]) {
        return false;
    }
    if (gezi_map[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)] == 0) return false;

    if (this.getAllmask()[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)].num != this.getAllmask()[id].num) return false;

    if (this.getAllmask()[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)].step <= step) return false;

    if (this.getAllmask()[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)].step == 9999999) this.g_mask_samecnt++;

    this.getAllmask()[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)].step = step;
    this.getAllmask()[id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1)].from = id;

    return true;
}), _defineProperty(_cc$Class, "checkDirPaths", function checkDirPaths(id, step, bj, add) {
    if (Math.abs(add) == 4 && this.getAllmask()[id] != null && this.getAllmask()[id].y == bj) {
        return false;
    } else if (Math.abs(add) == 1 && this.getAllmask()[id] != null && this.getAllmask()[id].x == bj) {
        return false;
    }
    if (this.getAllmask()[id] == null || this.getAllmask()[id + add] == null) {
        return false;
    }
    if (this.getAllmask()[id + add].num != this.getAllmask()[id].num || this.getAllmask()[id + add].step <= step) {
        return false;
    }

    if (this.getAllmask()[id + add].step == 9999999) {
        this.g_mask_samecnt++;
    }

    this.getAllmask()[id + add].step = step;
    this.getAllmask()[id + add].from = id;
    this.allmergecellIds[this.allmergecellIds.length] = id + add;
    this.checkmaskbyid(id + add, step + 1, bj, add);
}), _defineProperty(_cc$Class, "changenumbymask", function changenumbymask() {
    for (var i = 0; i < gezi_map.length; i++) {
        if (this.getAllgz()[i].label_id >= 0 && this.getAllmask()[i].step != 9999999 && this.getAllmask()[i].step != 0) {
            var num = this.getrandomnum();
            this.getAllgz()[i].setnum(num);
            this.getAllgz()[i].settoblock();
        }
    }
}), _defineProperty(_cc$Class, "getrandomnum", function getrandomnum() {
    var tnum = this.maxnum - 1;
    if (tnum < tywx.ado.Constants.GameCenterConfig.initGameMaxNum) tnum = tywx.ado.Constants.GameCenterConfig.initGameMaxNum;
    var num = parseInt(Math.random() * 10000) % tnum + 1;
    return num;
}), _defineProperty(_cc$Class, "recoverGame", function recoverGame() {
    if (this.recoverNumber < tywx.ado.Constants.GameCenterConfig.maxrnum) {
        this.point = this.maxpoint;
        this.drawPhyPoint();
        this.gamestate = tywx.ado.Constants.GameCenterConfig.gameState.waitclick;
        this.addRecoverNumber();
        this.visibleControllButton(false);
    } else {
        this.showAlert("复活次数已达" + tywx.ado.Constants.GameCenterConfig.maxrnum + "次，不能继续复活。");
        this.initgame(true);
    }
}), _defineProperty(_cc$Class, "refreshbymask", function refreshbymask() {
    for (var i = 0; i < gezi_map.length; i++) {
        if (this.getAllgz()[i].label_id >= 0 && this.getAllmask()[i].step != 9999999 && this.getAllmask()[i].step != 0) {
            this.getAllmask()[i].from = -1;
            var topid = this.findtopinmask(i);

            if (topid != -1) {
                //
                var disy = this.getAllmask()[i].y - this.getAllmask()[topid].y;
                var disx = this.getAllmask()[i].x - this.getAllmask()[topid].x;
                var dis = this.getAllmask()[topid].y - this.getAllmask()[i].y;
                this.getAllgz()[i].block.posx = this.getAllgz()[topid].posx;
                this.getAllgz()[i].block.posy = this.getAllgz()[topid].posy;
                this.getAllgz()[i].block.id_keep = topid;
                this.getAllgz()[i].block.id_dest = i;
                // this.getAllgz()[i].block.speed_keep = (dis * tywx.ado.Constants.GameCenterConfig.gezi_pitch) / tywx.ado.Constants.GameCenterConfig.drop_time;
                var spx = disx * tywx.ado.Constants.GameCenterConfig.gezi_h_s / tywx.ado.Constants.GameCenterConfig.drop_time;
                var spy = disy * tywx.ado.Constants.GameCenterConfig.gezi_size * 3 / 2 / tywx.ado.Constants.GameCenterConfig.drop_time;
                this.getAllgz()[i].block.adjustdrop(spx, spy);
                this.getAllmask()[topid].step = 8888;
                var num = this.getAllgz()[topid].num;

                this.getAllgz()[i].setnum(num);
                this.getAllgz()[i].settoblockvalue();
                this.getAllgz()[i].block.effectid = this.getAllgz()[topid].block.effectid;
                this.getAllgz()[i].block.effecttime = this.getAllgz()[topid].block.effecttime;
                this.getAllgz()[topid].block.effectid = -1;
                this.getAllgz()[topid].block.effecttime = 0;
            } else {
                var dis = 7 - this.getAllmask()[i].y;
                this.getAllgz()[i].block.posx = this.getAllgz()[i].posx;
                this.getAllgz()[i].block.posy = this.getAllgz()[i].posy + dis * (tywx.ado.Constants.GameCenterConfig.gezi_size * 3 / 2);
                this.getAllgz()[i].block.id_keep = -1;
                this.getAllgz()[i].block.id_dest = i;
                // this.getAllgz()[i].block.speed_keep = (dis * tywx.ado.Constants.GameCenterConfig.gezi_pitch) / tywx.ado.Constants.GameCenterConfig.drop_time;
                var spy = -(dis * tywx.ado.Constants.GameCenterConfig.gezi_size * 3 / 2) / tywx.ado.Constants.GameCenterConfig.drop_time;
                this.getAllgz()[i].block.adjustdrop(0, spy);
                var num = this.getrandomnum();
                this.getAllgz()[i].setnum(num);
                this.getAllgz()[i].settoblockvalue();
            }
        }
    }
}), _defineProperty(_cc$Class, "getPjNumberName", function getPjNumberName(id) {
    var luck = false;
    var sjs = Math.random();
    var ttindex = 0;
    for (var sindex = tywx.config.luck_block.score.length - 1; sindex > 0; sindex--) {
        if (this.score >= tywx.config.luck_block.score[sindex]) {
            ttindex = sindex;
            break;
        }
    }
    var tgl = tywx.config.luck_block.rate[ttindex];
    if (sjs <= tgl) {
        luck = true;
    }

    var allids = [id - 2, id + 2, id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1), id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber + 1), id + (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1), id - (tywx.ado.Constants.GameCenterConfig.rowcellNumber - 1)];
    var total = 0;
    var gzindex = 1;
    for (var tcellIndex = 0; tcellIndex < allids.length; tcellIndex++) {
        if (this.getAllmask()[tcellIndex] && this.getAllgz()[tcellIndex].block) {
            total = total + this.getAllgz()[tcellIndex].block.num;
            gzindex = gzindex + 1;
        }
    }
    var pjNumber = parseInt(total / gzindex);
    var fudu = luck ? 1.0 : 3.5;
    var num = parseInt(pjNumber + fudu - 2 * fudu * Math.random());
    if (num <= 0) num = 1;
    //console.log("score=", this.score, "ttindex=", ttindex, "sjs=", sjs, "tgl=", tgl, "luck=", luck, "pjNumber=", pjNumber, "fudu=", fudu, "num=", num);
    return num;
}), _defineProperty(_cc$Class, "backFirstPage", function backFirstPage() {
    tywx.ado.saveProgress();
    this.storeScore();
    cc.director.loadScene("gamestart", this.destroyFinish);
}), _defineProperty(_cc$Class, "storeScore", function storeScore() {
    if (parseInt(tywx.ado.Utils.loadItem("ADDONE_SCORE2", 0)) < this.score) {
        tywx.ado.Utils.saveItem('ADDONE_SCORE2', this.score, false);
    }
}), _defineProperty(_cc$Class, "backCall", function backCall() {
    this.showAlert("测试提示信息");
}), _defineProperty(_cc$Class, "showMinFriend", function showMinFriend() {
    if (this.gamestate == tywx.ado.Constants.GameCenterConfig.gameState.gameover) {
        return;
    }
    window.sharedCanvas.width = 211;
    window.sharedCanvas.height = 98;
    tywx.ado.logWithColor('showMinFriend=====');
    var self = this;
    var bpos = cc.v2(this.stopButton.x, this.stopButton.y);
    this.isShowFIcon = true;
    var rest = self.isRestartGame;
    // var pos = this.friendsNode.convertToWorldSpace(cc.v2(this.friendsNode.x, this.friendsNode.y))
    var screen = cc.view.getVisibleSizeInPixel();
    // console.log("y = " + pos.y + "x = " + pos.x + "screen = " + JSON.stringify(screen));
    wx.postMessage({
        method: 5,
        isrestart: rest,
        score: self.score,
        width: screen.width
        // x: pos.x,
        // y: screen.height - pos.y - 90,
    });
    self.isRestartGame = false;
}), _defineProperty(_cc$Class, "hideMinFriend", function hideMinFriend() {
    var self = this;
    this.isShowFIcon = false;
    return;
}), _defineProperty(_cc$Class, "printMaskMsg", function printMaskMsg() {
    for (var gzIndex = 0; gzIndex < gezi_map.length; gzIndex++) {
        this.getAllmask()[gzIndex].showMSG();
    }
}), _defineProperty(_cc$Class, "firstShowHelpView", function firstShowHelpView() {
    if (parseInt(tywx.Util.getItemFromLocalStorage("hadshowhelpview", 0)) === 0) {
        tywx.Util.setItemToLocalStorage("hadshowhelpview", 1);
        tywx.ado.Utils.hideWXBanner();
        this.showPlayMethod();
    }
}), _defineProperty(_cc$Class, "_updateSubDomainCanvas", function _updateSubDomainCanvas() {
    //return;
    if (!this.tex || !tywx.publicwx) {
        return;
    }
    if (this.isShowFIcon == true) {
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.friendIcon.spriteFrame = new cc.SpriteFrame(this.tex);
        this.friendIcon.node.active = true;
    }
}), _defineProperty(_cc$Class, "flushPHBView", function flushPHBView() {
    var openDataContext = wx.getOpenDataContext();
    var sharedCanvas = openDataContext.canvas;
    this.tex.initWithElement(sharedCanvas);
    this.tex.handleLoadedTexture();
    this.paimingSprite.spriteFrame = new cc.SpriteFrame(this.tex);
    this.paimingSprite.node.active = true;
}), _defineProperty(_cc$Class, "giveItems", function giveItems(dontsetnull, giveitems) {
    // var name = "";
    if (giveitems && giveitems.length > 0) {
        for (var itemIndex = 0; itemIndex < giveitems.length; itemIndex++) {
            var giveitem = giveitems[itemIndex];
            // if (itemIndex < (giveitems.length - 1)){
            //     name = name + giveitem.name;
            // }else{
            //     name = name + giveitem.name + " ";
            // }
            this.lingQuItem(dontsetnull, giveitem, true);
        }
        this.showAlertMSG("成功领取 " + giveitems.length + " 个道具");
    }
}), _defineProperty(_cc$Class, "destroyFinish", function destroyFinish() {
    // if(this.node){
    //    this.node.destroy();
    // }
}), _defineProperty(_cc$Class, "lingQuItem", function lingQuItem(dontsetnull, giveitem, notneedshow) {
    if (giveitem) {
        this.produceItem = giveitem;
    }
    // 查看当前ID的道具玩家是否存在
    if (this.produceItem != null) {
        if (this.allitems.length == 0) {
            this.allitems[0] = this.produceItem;
        } else {
            // tywx.LOGE("领取时玩家的道具数据 = "+JSON.stringify(this.allitems))
            var findata = false;
            for (var itemIndex = 0; itemIndex < this.allitems.length; itemIndex++) {
                var itemdata = this.allitems[itemIndex];
                // tywx.LOGE("领取时玩家的道具数据 = "+JSON.stringify(this.allitems))
                if (itemdata.id == this.produceItem.id) {
                    itemdata.num = itemdata.num + this.produceItem.num;
                    findata = true;
                    this.allitems[itemIndex] = itemdata;
                    break;
                }
            }
            if (findata == false) {
                this.allitems[this.allitems.length] = this.produceItem;
            }
        }
        // 组织显示得到的信息

        var item = null;
        for (var djIndex = 0; djIndex < tywx.ado.Constants.GameCenterConfig.allitem.length; djIndex++) {
            var dj = tywx.ado.Constants.GameCenterConfig.allitem[djIndex];
            // tywx.LOGE(JSON.stringify(dj)+"当前得到的宝箱数据  = "+JSON.stringify(this.produceItem));
            if (this.produceItem.id == dj.id) {
                item = dj;
                break;
            }
        }

        if (item != null && !notneedshow) {
            this.showAlertMSG("领取成功 " + item.name + " 道具");
        }
        if (!dontsetnull) {
            this.produceItem = null;
        }
        this.storeAllItem();
        this.dealAllItems(this.allitems);
    }
}), _defineProperty(_cc$Class, "lingQuBox", function lingQuBox() {
    if (this.curmflqIsRedPacket) {
        // this.curmflqIsRedPacket = false;
        // tywx.ado.Utils.requestAddRedPacket();
    } else {
        this.lingQuItem();
    }
    this.showStopView();
    this.stopView.active = false;
    this.openboxview.active = false;
}), _defineProperty(_cc$Class, "showBox", function showBox(maxnum) {
    var rvalue = 0;
    var cn = this.curmaxNumber;
    var sbr = tywx.config.show_box_rate;
    for (var i = 1; i < sbr.maxnum.length; i++) {
        if (cn >= sbr.maxnum[i - 1] && cn < sbr.maxnum[i]) {
            rvalue = sbr.rate[i - 1] * Math.pow(maxnum, sbr.comboz);
            break;
        }
    }
    var ran = Math.random();
    var is_show = ran <= rvalue;

    tywx.ado.logWithColor("combonum:" + maxnum + ",maxnum:" + this.curmaxNumber + ",rvalue:" + rvalue + ",ran:" + ran + ",is_show:" + is_show);
    var self = this;
    if (is_show) {
        // 产生道具
        self.curmflqIsRedPacket = false;
        var dealData = function dealData(result, qzrequest) {
            // 判断是否需要分享领取红包
            if (tywx.ado.RedPacketInfo.nextAmount > 0 && tywx.ado.RedPacketInfo.needShare == false) {
                if (tywx.config.auditing == false && qzrequest) {
                    if (tywx.StateInfo.networkConnected) {
                        // 传递参数
                        var param = {
                            success: dealData,
                            fail: dealData
                        };
                        tywx.ado.Utils.requestRedPacket(param);
                    } else {}
                    return;
                }
            }
            // 如果是审核状态  则只能弹领取道具
            if (tywx.config.auditing == true) {
                result = -1;
            }
            console.log("result " + result);
            // 更新获得道具的item
            if (result) {
                if (result == -1) {
                    self.produceItems(maxnum);
                    var frameindex = 0;
                    if (self.produceItem.id == 2) {
                        frameindex = 1;
                    } else if (self.produceItem.id == 5) {
                        frameindex = 2;
                    } else if (self.produceItem.id == 6) {
                        frameindex = 3;
                    }
                    self.showStopView();
                    var itemLabel = self.openboxview.getChildByName("sgfldjLabel");
                    var zsdjLabel = self.openboxview.getChildByName("zsdjLabel");
                    var redmsgLabel = self.openboxview.getChildByName("redpacketmsg");
                    itemLabel.active = true;
                    redmsgLabel.active = false;
                    self.giveYouItemLabel.string = "赠送道具";
                    self.openBoxIconSprite.spriteFrame = self.itemframes[frameindex];
                    self.pjlView.active = false;
                    self.stopV.active = false;
                    self.openboxview.active = true;
                    self.showCDAni();
                    self.initShowBoxButton();
                    tywx.ado.Utils.commonScaleIn(self.openboxview);
                } else {
                    // 设置当前红包的显示金额
                    self.moneyLabel.string = "\xA5" + (tywx.ado.Utils.formatCashFen2Yuan(tywx.ado.RedPacketInfo.totalAmount) || 0.0);
                    if (self.curRedPacketStatue == 1) {
                        // 红包飞的动画
                        if (tywx.ado.RedPacketInfo.nextAmount > 0) {
                            self.redpacketicon.active = true;
                            var pri_pos = self.redpacketicon.position;
                            // 红包飞行的结束位置
                            var endpos = self.getRedPacketBtn.position;
                            // 红包飞行结束后回调函数
                            var finishCall = function finishCall() {
                                self.redpacketicon.active = false;
                                self.redpacketicon.position = pri_pos;
                            };
                            self.palyAudioByIndex(tywx.ado.Constants.GameCenterConfig.SOUNDS.FLY_REDPACKET);
                            tywx.ado.Utils.simpleBezierAction(self.redpacketicon, endpos, finishCall);
                        }
                        // 刷新当前
                    } else {
                        self.curRedPacketStatue = 1;
                        self.getRedPacket(result);
                    }
                    if (tywx.ado.RedPacketInfo.nextAmount == 0) {
                        self.curRedPacketStatue = 0;
                    }
                    self.flushRedPacketBtns(self.curRedPacketStatue);
                }
            }
        };
        // 如果满足概率 请求红包数据
        var ranRate = Math.random();

        if (ranRate > (tywx.config.box_rate.red_packet || 0.5)) {
            dealData(-1, true);
        } else {
            if (tywx.config.auditing == true) {
                dealData(-1);
            } else {
                if (tywx.StateInfo.networkConnected) {
                    // 传递参数
                    var param = {
                        success: dealData,
                        fail: dealData
                    };
                    tywx.ado.Utils.requestRedPacket(param);
                } else {}
            }
        }
    }
    this.playjjaniing = false;
}), _defineProperty(_cc$Class, "restartGame", function restartGame() {
    this.initgame(true);
    this.showSubStopView();
}), _defineProperty(_cc$Class, "loseRestartGame", function loseRestartGame() {
    this.initgame(true);
    this.visibleControllButton(false);
}), _defineProperty(_cc$Class, "startNewGame", function startNewGame() {
    this.visibleControllButton(false);
    this.initgame(true);
}), _defineProperty(_cc$Class, "playMergeAnimation", function playMergeAnimation() {
    //return;
    if (this.g_clickid) {
        var self = this;
        if (!this.cmergeAniNode) {
            this.cmergeAniNode = cc.instantiate(this.mergeAniNode);
            var mergeAni = this.cmergeAniNode.getComponent(cc.Animation);

            var removeCall = function removeCall() {
                self.cmergeAniNode.active = false;
            };
            this.cmergeAniNode.scale = 0.85;
            this.cmergeAniNode.parent = this.cellUpView;
            mergeAni.on('finished', removeCall, self);
        }

        if (this.isIPHX()) {
            if (this.allpngs[this.g_clickid]) {
                this.cmergeAniNode.x = this.allpngs[this.g_clickid].x;
                this.cmergeAniNode.y = this.allpngs[this.g_clickid].y;
            }
        } else {
            if (this.allpngs[this.g_clickid]) {
                this.cmergeAniNode.position = this.allpngs[this.g_clickid].position;
                this.cmergeAniNode.y = this.allpngs[this.g_clickid].y + 2;
            }
        }
        this.cmergeAniNode.active = true;
        this.cmergeAniNode.getComponent(cc.Animation).stop();
        var animState = this.cmergeAniNode.getComponent(cc.Animation).play("mergani");
        // 使动画播放速度加速
        animState.speed = 1.3;
    }
}), _defineProperty(_cc$Class, "getLabel", function getLabel(num) {
    var label = null;
    if (this.addScoreLabelPools.size() > 0) {
        // 通过 size 接口判断对象池中是否有空闲的对象
        label = this.addScoreLabelPools.get();
    } else {
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        label = cc.instantiate(this.addScoreNode);
    }
    var labelScrpt = label.getComponent("AddScoreLabel");
    labelScrpt.setNumber("+" + num);
    return label;
}), _defineProperty(_cc$Class, "addGetScoreLabelOnTile", function addGetScoreLabelOnTile(tiles, shownum) {
    var _this = this;

    var _loop = function _loop() {
        id = tiles[tileIndex];

        _this.dealAddNumber(id);
        // var num = 10;
        // if (id == this.g_clickid) {
        //     num = tywx.ado.Constants.GameCenterConfig.baseScore * (this.getAllgz()[this.g_clickid].num);
        //     console.log(id  + "当前的下标 first " + tileIndex + " 分数 = " + num);
        // }else{
        //     num = tywx.ado.Constants.GameCenterConfig.baseScore * tileIndex;
        //     console.log(id  + "当前的下标 second " + tileIndex + " 分数 = " + num);
        // }
        var label = _this.getLabel(shownum);
        label.getComponent("addNode");
        scaleBoom = cc.scaleTo(0.2, 1.3);
        scalesm = cc.scaleTo(0.2, 1);
        mtop = cc.moveBy(0.2, cc.v2(0, 10));
        spawn = cc.spawn([scaleBoom, mtop]);
        self = _this;
        call = cc.callFunc(function () {
            label.scalex = 1;
            label.scaley = 1;
            self.addScoreLabelPools.put(label);
            //console.log("移除没有4")
        });
        // var pos = this.getPos(id);

        label.parent = _this.cellUpView;
        if (_this.allpngs[id]) {
            label.x = _this.allpngs[id].x;
            label.y = _this.allpngs[id].y - 10;
        }
        seq = cc.sequence(spawn, scalesm, call);

        label.runAction(seq);
    };

    for (var tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
        var id;
        var scaleBoom;
        var scalesm;
        var mtop;
        var spawn;
        var self;
        var call;
        var seq;

        _loop();
    }
}), _defineProperty(_cc$Class, "dealAddNumber", function dealAddNumber(id) {
    if (this.allpngs[id] && this.allpngs[id].getComponent("celltile").prenum != 0) {
        this.addXHGId(this.allpngs[id].getComponent("celltile").prenum);
        // console.log("当前的小皇冠禁用ID = " + JSON.stringify(this.alljzxhgid));
    }
}), _defineProperty(_cc$Class, "showUseHpHelp", function showUseHpHelp(needaddstore) {
    this.hpHelpTips.active = false;
    // if (parseInt(tywx.Util.getItemFromLocalStorage("hadshowhpnum", 0)) < 2) {
    //     if (needaddstore) {
    //         tywx.Util.setItemToLocalStorage("hadshowhpnum", parseInt(tywx.Util.getItemFromLocalStorage("hadshowhpnum", 0)) + 1);
    //     }
    //     this.hpHelpTips.active = true;
    //     var delay = cc.delayTime(5);
    //     var self = this;
    //     var call = cc.callFunc(function () {
    //         self.hpHelpTips.active = false;
    //     });
    //     var seq = cc.sequence(delay, call);
    //     this.hpHelpTips.runAction(seq);
    // } else {
    //     this.hpHelpTips.active = false;
    // }
}), _defineProperty(_cc$Class, "showAnimationWhenScoreBiggerThanTen", function showAnimationWhenScoreBiggerThanTen(num) {
    // 产生大于10的效果
    if (num % 2 == 0 && this.hadShowShareLJ(num) == false && num >= tywx.ado.Constants.GameCenterConfig.moreThanEightNumber && this.hadshowlqbox == false) {
        this.produceItems(1);
        this.allshowshareids[this.allshowshareids.length] = num;
        // 去掉和数奖励 2018-09-19
        var tcur = num * tywx.ado.Constants.GameCenterConfig.mergeMaxNumberBaseScore;
        if (num * tywx.ado.Constants.GameCenterConfig.mergeMaxNumberBaseScore > this.curGiveScore) {
            this.curGiveScore = num;
            // this.scoreLabel.string = this.score;
        }
        this.hadshowlqbox = true;
        var showScript = this.showNumberNode.getComponent("MoreTanNumber");
        showScript.init();
        showScript.setShowNumber(num, tcur, this.produceItem.name);
    }
}), _defineProperty(_cc$Class, "shareDoubleScore", function shareDoubleScore(score) {
    this.score = this.score + score;
    this.showAlertMSG("合出数字" + this.curGiveScore + "奖励:" + score + "分");
    this.scoreLabel.string = this.score;
}), _defineProperty(_cc$Class, "isIPHX", function isIPHX() {
    var _ref3 = [cc.game.canvas.width, cc.game.canvas.height],
        cw = _ref3[0],
        ch = _ref3[1];

    var is_ipx = tywx.ado.Utils.isIpx();
    return is_ipx;
}), _defineProperty(_cc$Class, "storePhoto", function storePhoto() {
    var contentsize = {
        width: this.gameOutRoot.width,
        height: this.gameOutRoot.height
    };
    var _ref4 = [cc.game.canvas.width, cc.game.canvas.height],
        cw = _ref4[0],
        ch = _ref4[1];

    var is_ipx = ch / cw >= 1.9; // * 是否是2:1屏幕
    var ds = cc.size(720, 1280);
    var dcs = cc.size(contentsize.width, contentsize.height);
    var rate_width = dcs.width / ds.width,
        rate_height = dcs.height / ds.height;
    var d_x = (ds.width - dcs.width) / 2,
        d_y = (ds.height - dcs.height) / 2 - 30;
    var rate_x = d_x / ds.width,
        rate_y = d_y / ds.height;


    var w = cw * rate_width;
    var h = is_ipx ? w * (dcs.height / dcs.width) : ch * rate_height;
    var x = cw * rate_x;
    var y = is_ipx ? (ch - h) / 2 - this.gameOutRoot.position.y : ch * rate_y;
    var self = this;
    canvas.toTempFilePath({
        x: x,
        y: y,
        width: w,
        height: h,
        destWidth: contentsize.width,
        destHeight: contentsize.height,
        quality: 1,
        fileType: "jpg",
        success: function success(res) {
            //console.log(res);
            tywx.ado.Utils.saveImage2PhoneByUrl(res.tempFilePath, function () {
                tywx.ado.Utils.showWXToast("保存图片成功");
                // self.lingQuItem();
                // self.hadstorephotonumber = false;
            }, function () {
                tywx.ado.Utils.showWXToast("保存图片失败");
            });
        },
        fail: function fail(res) {
            tywx.ado.Utils.showWXToast("保存图片失败");
        }
    });
}), _defineProperty(_cc$Class, "hadShowShareLJ", function hadShowShareLJ(num) {
    for (var t = 0; t < this.allshowshareids.length; t++) {
        if (num == this.allshowshareids[t]) {
            return true;
        }
    }
    return false;
}), _defineProperty(_cc$Class, "showBanner", function showBanner() {
    tywx.ado.Utils.createAndcreateAndShowWXBanner();
    this.schedule(this.bannerRefresh, tywx.ado.Constants.WXAdConfig.bannerRefreshTime);
}), _defineProperty(_cc$Class, "bannerRefresh", function bannerRefresh() {
    tywx.ado.Utils.createAndcreateAndShowWXBanner();
}), _defineProperty(_cc$Class, "showRyBox", function showRyBox() {
    if (this.gamestate == tywx.ado.Constants.GameCenterConfig.gameState.waitclick) {
        this.ryBox.active = true;
        tywx.ado.Utils.hideWXBanner();
        this.ryBox.getComponent("LuckBox").init();
        tywx.ado.Utils.commonScaleIn(this.luckboxroot);
    }
}), _defineProperty(_cc$Class, "getCommenItemNode", function getCommenItemNode() {
    var parent = this.itemview.parent;
    var ret = parent.getChildByName('commbottom');
    return ret;
}), _defineProperty(_cc$Class, "btnRefreshGameOverPhotoCallback", function btnRefreshGameOverPhotoCallback() {
    var photo_urls = tywx.config.PYQImg.GameOverPhotos;
    if (!this.showPicIndex || this.showPicIndex > photo_urls.length - 1) {
        this.showPicIndex = 0;
    }
    var pngurl = tywx.SystemInfo.cdnPath + 'share_pyq/addone/' + photo_urls[this.showPicIndex];
    console.log("cdnpngurl = " + pngurl);
    tywx.ado.Utils.refreshSpriteByUrl(this.gameOutRoot.getChildByName("maxroot").getComponent(cc.Sprite), pngurl);
    this.showPicIndex = this.showPicIndex + 1;
}), _defineProperty(_cc$Class, "kzHpNumber", function kzHpNumber() {}), _defineProperty(_cc$Class, "getRedPacketCall", function getRedPacketCall() {
    if (this.gamestate == tywx.ado.Constants.GameCenterConfig.gameState.waitclick) {
        this.getRedPacket();
    }
}), _defineProperty(_cc$Class, "getRedPacketMoneyCall", function getRedPacketMoneyCall() {
    if (this.gamestate == tywx.ado.Constants.GameCenterConfig.gameState.waitclick) {
        this.getRedPacketMoney();
    }
}), _defineProperty(_cc$Class, "flushMoneyNumber", function flushMoneyNumber() {
    console.log("刷新红的数据 = " + JSON.stringify(tywx.ado.RedPacketInfo));
    this.moneyLabel.string = "\xA5" + (tywx.ado.Utils.formatCashFen2Yuan(tywx.ado.RedPacketInfo.totalAmount) || 0.0);
    this.palyAudioByIndex(tywx.ado.Constants.GameCenterConfig.SOUNDS.ADDMONEY);
}), _defineProperty(_cc$Class, "flushRedPacketBtns", function flushRedPacketBtns(state) {
    this.curRedPacketStatue = state;
    if (tywx.config.auditing == true) {
        this.getRedPacketBtn.active = false;
        this.getMoneyBtn.active = false;
    } else {
        if (this.curRedPacketStatue == 1 && tywx.ado.RedPacketInfo.nextAmount > 0) {
            this.getRedPacketBtn.active = true;
            this.getMoneyBtn.active = false;
        } else {
            this.getRedPacketBtn.active = false;
            this.getMoneyBtn.active = true;
        }
    }
}), _defineProperty(_cc$Class, "getRedPacket", function getRedPacket() {
    var result = tywx.ado.RedPacketInfo;
    if (!tywx.ado.RedPacketInfo || tywx.ado.RedPacketInfo.nextAmount == 0) {
        this.flushRedPacketBtns(0);
    } else {
        cc.loader.loadRes('prefabs/OpenRedPackView', function (err, prefab) {
            if (!err) {
                var prefabNode = cc.instantiate(prefab);
                cc.game.addPersistRootNode(prefabNode);
                prefabNode.x = 360;
                prefabNode.y = 720;
                tywx.ado.Utils.hideWXBanner();
                prefabNode.getComponent('OpenRedPackView').showUI();
                prefabNode.getComponent('OpenRedPackView').setData(result);
            }
        });
    }
}), _defineProperty(_cc$Class, "getRedPacketMoney", function getRedPacketMoney() {
    tywx.ado.Utils.hideWXBanner();
    tywx.ado.Utils.showRedPacketTransferPop(tywx.ado.Utils.formatCashFen2Yuan());
}), _cc$Class));

cc._RF.pop();