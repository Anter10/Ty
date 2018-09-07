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
        }

    },

    close: function close() {
        this.luckitems[0].getComponent("luckitem").selected();
        tywx.ado.Utils.showWXBanner();
        this.node.active = false;
    },

    lqCall: function lqCall() {},

    onLoad: function onLoad() {
        // 显示当前的所有道具
        var allitem = tywx.ado.Constants.GameCenterConfig.allitem;
        var row = 0,
            column = 0,
            bottom = 120,
            padingleft = 60,
            margin = 80,
            width = 162;
        // console.log("道具数据 = "+JSON.stringify(allitem));

        for (var itemindex = 0; itemindex < allitem.length; itemindex++) {
            var item = this.luckitems[itemindex];
            var itemsceipt = item.getComponent("luckitem");
            itemsceipt.setParent(this);
            itemsceipt.setItem(allitem[itemindex], this.allframe[itemindex]);
            if (itemindex == 0) {
                this.selectitem = itemsceipt;
            }
        }
        this.selectitem.selected();

        var self = this;
        // 设置免费领取的回调
        var mflq = this.mflqBtn.getComponent("ShareButton");
        if (tywx.config.auditing == true) {
            mflq.setReactCall(true);
        } else {
            mflq.setReactCall(false);
        }
        mflq.setSuccessCall(function () {
            tywx.gamecenter.lingQuItem(false, self.produceItem());
            self.close();
        });
        mflq.setShareGroupCall(function () {
            tywx.gamecenter.lingQuItem(false, self.produceItem());
            self.close();
        });
        mflq.setShareConfig(tywx.ado.Constants.ShareConfig.FREE_GIFT_SHARE);
    },


    hideOtherSelected: function hideOtherSelected(selectItem) {
        for (var itemindex = 0; itemindex < this.luckitems.length; itemindex++) {
            var item = this.luckitems[itemindex];
            var itemsceipt = item.getComponent("luckitem");
            var tdata = itemsceipt.getData();
            // console.log("tdata = "+JSON.stringify(tdata));
            if (tdata != "undefined" && tdata.id != selectItem.getData().id) {
                itemsceipt.unselected();
            }
        }
        this.selectitem = selectItem;
    },
    produceItem: function produceItem() {
        var data = this.selectitem.getData();
        var produceitem = {};
        produceitem.id = data.id;
        produceitem.name = data.name;
        produceitem.num = 1;
        return produceitem;
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
        