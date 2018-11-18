(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/lottery/lottery_view.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b1757nF2hRKgaarm3Q/pzJ2', 'lottery_view', __filename);
// scripts/game/lottery/lottery_view.js

'use strict';

var TAG = '[game/lottery/lottery_view.js]]';

var lotterygetview = require('./lottery_get_view'); //* 大转盘管理
var LOCAL_STOREITEM_KEY = "tt-items";
cc.Class({
    extends: cc.Component,
    properties: {
        nodeDisk: cc.Node,
        lottery_item: cc.Prefab,
        background: cc.Node,
        alltnode: {
            type: cc.Node,
            default: []
        },
        allbtnnode: {
            type: cc.Node,
            default: []
        },
        videoBtn: cc.Node,
        shareBtn: cc.Node,
        freeBtn: cc.Node,
        centerNode: cc.Node,
        videoLabel: cc.Label
    },

    chouJiangCall: function chouJiangCall() {
        if (this.isLottering) return;
        this.lottery();
    },

    onLoad: function onLoad() {
        var self = this;

        // 初始化按钮的事件
        // 视频抽奖
        var videoBtnScript = this.videoBtn.getComponent("ShareButton");
        videoBtnScript.setButtonCallType(2);
        videoBtnScript.setShareConfig(tywx.tt.constants.ShareConfig.HOME_ZP_GET_VIDEO);
        videoBtnScript.setSuccessCall(function () {
            self.chouJiangCall();
        });
        if (!tywx.tt.isCanWatchVideo) {
            videoBtnScript.setButtonCallType(1);
            videoBtnScript.setShareConfig(tywx.tt.constants.ShareConfig.HOME_ZP_GET_SHARE);
            this.videoLabel.string = "免费领取";
        }
        if (tywx.tt.configManager.getInstance().auditing == true) {
            videoBtnScript.setReactCall(true);
            this.videoLabel.string = "免费领取";
        }
        // 分享抽奖
        var shareBtnScript = this.shareBtn.getComponent("ShareButton");
        shareBtnScript.setButtonCallType(1);
        shareBtnScript.setShareConfig(tywx.tt.constants.ShareConfig.HOME_ZP_GET_SHARE);
        shareBtnScript.setSuccessCall(function () {
            self.chouJiangCall();
        });

        if (tywx.tt.isMinGanIP && tywx.tt.isCanWatchVideo) {
            shareBtnScript.setButtonCallType(2);
            shareBtnScript.setShareConfig(tywx.tt.constants.ShareConfig.HOME_ZP_GET_VIDEO);
        }
        if (tywx.tt.configManager.getInstance().auditing == true) {
            shareBtnScript.setReactCall(true);
        }
        // 免费抽奖
        var freeBtnScript = this.freeBtn.getComponent("ShareButton");
        freeBtnScript.setButtonCallType(1);
        freeBtnScript.setReactCall(true);
        freeBtnScript.setShareConfig(tywx.tt.constants.ShareConfig.HOME_ZP_FREE_SHARE);
        freeBtnScript.setSuccessCall(function () {
            self.chouJiangCall();
        });
        //   this.freeBtn.active = true;

        var _ref = [cc.game.canvas.width, cc.game.canvas.height],
            cw = _ref[0],
            ch = _ref[1];

        var top_y = 80 / 1280 * ch;
        this.centerNode.position.y = top_y;

        this.background.getComponent("background").setTouchEndCall(function () {
            self.closeView();
        });
    },
    start: function start() {},


    setData: function setData(data) {
        if (data) {
            this.data = data;
            this.initUI();
        } else {
            tywx.tt.error(TAG, "没有抽奖数据");
        }
    },

    closeView: function closeView() {
        if (this.closeing) {
            return;
        }
        this.closeing = true;
        tywx.tt.lottery.removeLotteryView();
    },

    initUI: function initUI() {
        // 初始化道具UI
        var pre = 0;
        for (var ti = 0; ti < 6; ti++) {
            var lotteryItem = cc.instantiate(this.lottery_item);
            pre = ti * 60;
            lotteryItem.rotation = pre;
            var item_script = lotteryItem.getComponent('lottery_item');
            var data = this.data.items[ti];
            item_script.setData(data);
            this.alltnode[ti].addChild(lotteryItem);
        }
        // 初始化按钮UI
        this.initUiButton();
    },

    /**
     * @description 控制按钮的显示
     */
    initUiButton: function initUiButton() {
        var buttypes = this.data.button_types;
        var buttonindex = buttypes[0];
        var buttontype = buttypes[1][buttonindex];
        var buttons = buttontype.split("_");

        tywx.tt.log("当前显示的buttons = " + JSON.stringify(buttons));
        var typebtn = [];
        var btntype = buttons[0];

        for (var tin = 0; tin < buttons.length; tin++) {
            if (buttons[tin] == "share") {
                typebtn[tin] = this.shareBtn;
                this.shareBtn.active = true;
            } else if (buttons[tin] == "video") {
                typebtn[tin] = this.videoBtn;
                this.videoBtn.active = true;
            } else if (buttons[tin] == "free") {
                typebtn[tin] = this.freeBtn;
                this.freeBtn.active = true;
            }
        }
        if (typebtn.length == 1) {
            typebtn[0].position = this.allbtnnode[1];
        }
        if (typebtn.length == 2) {
            typebtn[0].position = this.allbtnnode[0];
            typebtn[1].position = this.allbtnnode[2];
        }
    },

    // update (dt) {},
    btnStartLottery: function btnStartLottery() {
        if (this.isLottering) return;
        this.lottery();
    },


    // 确定当前抽到的是红包还是道具
    getCjType: function getCjType() {},

    lottery: function lottery() {
        var _this = this;

        tywx.tt.log(TAG, "当前的红包数据 = " + JSON.stringify(tywx.tt.RedPacketInfo));
        var aims = [0, 1, 2, 3, 4, 5];
        var czaim = [1, 3];
        var hbaim = [0, 2, 4];
        var hyhaim = [5];
        var aim_id = Math.random() > 0.5 ? 5 : czaim[parseInt(Math.random() * czaim.length)];
        var random = Math.random();
        if (tywx.tt.RedPacketInfo && tywx.tt.RedPacketInfo.nextAmount > 0 && random > 1 - random) {
            aim_id = hbaim[parseInt(Math.random() * hbaim.length)];
        }

        this.item = this.data.items[aim_id];
        var self = this;
        var current_rotate = this.nodeDisk.rotation % 360;
        //let last_aim_id = parseInt(current_rotate / 60);
        this.isLottering = true;
        this.nodeDisk.runAction(cc.sequence(cc.rotateBy(1, 360 * 2 - current_rotate).easing(cc.easeIn(2.0)), cc.rotateBy(2, 360 * 3), cc.rotateBy(1, 360 * 2 - aim_id * 60).easing(cc.easeOut(1.0)), cc.delayTime(0.5), cc.callFunc(function () {
            self.storeCurrentItem();
            self.isLottering = false;
            _this.finishcall && _this.finishcall();
        })));
    },
    init: function init() {
        //  this.aim_id = 0;
        //  for (let i = 0; i < 6; ++i) {
        //      let lable_name = `label_${i}`;
        //      let label_node = this.nodeLabelRoot.getChildByName(lable_name);
        //      if (label_node) {
        //          label_node.getComponent(cc.Label).string = `礼物${i}`;
        //      }
        //  }
    },


    /**
     * @description 存储当前的转到的道具
     */
    storeCurrentItem: function storeCurrentItem() {
        var items = JSON.parse(tywx.tt.Utils.loadItem(LOCAL_STOREITEM_KEY, "[]"));
        var allitems = [];
        if (items.length > 0) {
            var findit = false;
            for (var itIndex = 0; itIndex < items.length; itIndex++) {
                var item = items[itIndex];
                if (item.id == this.item.gift_id) {
                    findit = true;
                    item.num = item.num + 1;
                }
                allitems.push(item);
            }
            if (!findit) {
                var _titem = this.getAddItem();
                allitems[allitems.length] = _titem;
            }
        } else {
            var titem = this.getAddItem();
            allitems[0] = titem;
        }
        tywx.tt.Utils.saveItem(LOCAL_STOREITEM_KEY, JSON.stringify(allitems), false);

        var self = this;
        if (this.item.gift_id == 2 || this.item.gift_id == 4 || this.item.gift_id == 6) {
            lotterygetview.show(this.item);
        } else {
            tywx.tt.Utils.requestAddRedPacket({
                success: function success(res) {
                    //  console.log("qing求数据 = " + JSON.stringify(res));
                    self.item.name = res + "元";
                    lotterygetview.show(self.item);
                },
                fail: function fail() {
                    tywx.tt.Utils.showWXToast("请求失败");
                }
            });
        }

        tywx.tt.log("当前所转到的道具数据  = " + JSON.stringify(allitems));
    },

    getAddItem: function getAddItem() {
        var titem = {};
        titem.id = this.item.gift_id;
        titem.num = this.item.number || 1;
        titem.name = this.item.name;
        titem.icon = this.item.icon;
        return titem;
    },

    setFinishCall: function setFinishCall(call) {
        this.finishcall = call;
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
        //# sourceMappingURL=lottery_view.js.map
        