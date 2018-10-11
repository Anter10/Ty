(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/LuckBox.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ac2b1mamDlPUIjGCACM0Wwk', 'LuckBox', __filename);
// Script/models/LuckBox.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        luckboard: {
            default: null,
            type: cc.Node
        },
        luckitem: {
            default: null,
            type: cc.Prefab
        },
        luckitems: {
            default: [],
            type: cc.Node
        },
        allframe: {
            default: [],
            type: cc.SpriteFrame
        },
        mflqBtn: {
            default: null,
            type: cc.Node
        },
        hideLabel: {
            default: null,
            type: cc.Label
        },
        showLabel: {
            default: null,
            type: cc.Label
        }

    },

    close: function close() {
        // this.luckitems[0].getComponent("luckitem").selected();
        tywx.ado.Utils.showWXBanner();
        this.node.active = false;
    },

    lqCall: function lqCall() {},

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

    onLoad: function onLoad() {
        // 显示当前的所有道具
        var allitem = tywx.ado.Constants.GameCenterConfig.allitem;
        var items = [];
        for (var ti = 0; ti < allitem.length; ti++) {
            var item = cc.instantiate(this.luckitem);
            var itemsceipt = item.getComponent("luckitem");
            itemsceipt.setParent(this);
            itemsceipt.setItem(allitem[ti], this.allframe[ti]);
            if (ti == 0) {
                this.selectitem = itemsceipt;
            }
            item.parent = this.luckitems[ti];
            // if (ti < allitem.length - 1){
            //     itemsceipt.select();
            // }
            items.push(item);
        }

        this.allluckitems = items;

        var row = 0,
            column = 0,
            bottom = 120,
            padingleft = 60,
            margin = 80,
            width = 162;

        // this.selectitem.select();

        var self = this;
        // 设置免费领取的回调
        var mflq = this.mflqBtn.getComponent("ShareButton");
        if (tywx.config.auditing == true) {
            mflq.setReactCall(true);
        } else {
            mflq.setReactCall(false);
        }
        mflq.setSuccessCall(function () {
            tywx.gamecenter.giveItems(false, self.produceItem());
            self.close();
        });
        mflq.setShareGroupCall(function () {
            tywx.gamecenter.giveItems(false, self.produceItem());
            self.close();
        });
        this.init();
    },


    /** 
     * @description 初始化
     */
    init: function init() {
        for (var ti = 0; ti < this.allluckitems.length; ti++) {
            var itemsceipt = this.allluckitems[ti].getComponent("luckitem");
            if (ti < this.allluckitems.length - 1) {
                itemsceipt.select();
            } else {
                itemsceipt.unselected();
            }
        }

        this.hideLabel.string = "视频领取";
        this.showLabel.string = "视频领取";
        this.node.getChildByName("luckboxroot").getChildByName("checkbox").getComponent("cc.Toggle").uncheck();
        this.mflqBtn.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.GIFT_GIFT_SHARE_BOX_SHARE);
        this.mflqBtn.getComponent("ShareButton").setButtonCallType(2);
    },

    /**
     * @description 点击道具回调
     */
    hideOtherSelected: function hideOtherSelected(selectItem) {
        for (var itemindex = 0; itemindex < this.allluckitems.length; itemindex++) {
            var item = this.allluckitems[itemindex];
            var itemsceipt = item.getComponent("luckitem");
            var tdata = itemsceipt.getData();
            // console.log("tdata = "+JSON.stringify(tdata));
            if (tdata != "undefined" && tdata.id != selectItem.getData().id) {
                itemsceipt.select();
            }
        }
        selectItem.unselected();
        this.selectitem = selectItem;
    },

    /** 
     * @description 成功后所给道具逻辑
     */
    produceItem: function produceItem() {
        var allitem = [];
        for (var itemIndex = 0; itemIndex < this.allluckitems.length; itemIndex++) {
            var item = this.allluckitems[itemIndex];
            var itemsceipt = item.getComponent("luckitem");
            var data = itemsceipt.getData();
            if (itemsceipt.isSelected()) {
                var produceitem = {};
                produceitem.id = data.id;
                produceitem.name = data.name;
                produceitem.num = 1;
                allitem.push(produceitem);
            }
        }
        return allitem;
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
        //# sourceMappingURL=LuckBox.js.map
        