(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/mall/product_cell.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '52ce73V2wtG279XIPraMg8q', 'product_cell', __filename);
// script/ui/mall/product_cell.js

"use strict";

var ElsUtils = require("../../core/ElsUtils.js");

cc.Class({
    extends: cc.Component,

    properties: {
        product_name: cc.Label,
        product_icon: cc.Sprite,
        product_count: cc.Label,
        product_price: cc.Label,
        product_tag: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
    //
    // },

    init: function init(_data) {
        if (!_data) {
            return;
        }
        this.canPay = true;
        this.product_tag.node.active = false;
        this._product_info = _data;
        this.updateCell();
    },
    updateCell: function updateCell() {
        this.product_name.getComponent("cc.Label").string = this._product_info["displayName"];
        if (ElsUtils.checkPF(this._product_info.productId)) {
            this.product_count.getComponent("cc.Label").string = "";
            if (this.hasPF(this._product_info["content"]["items"][0]["itemId"])) {
                this.product_tag.node.active = true;
                this.canPay = false;
            }
        } else {
            this.product_count.getComponent("cc.Label").string = "";
        }

        this.product_price.getComponent("cc.Label").string = this._product_info["priceDiamond"];
        var pic = this._product_info["pic"];
        this.setImage(this.product_icon, this._product_info.productId);
    },
    hasPF: function hasPF(_itemId) {
        var ret = false;
        for (var i = 0; i < tywx.UserInfo.bag.length; i++) {
            var _i = tywx.UserInfo.bag[i];
            if (_itemId.indexOf(_i["kindID"] + "") !== -1) {
                ret = true;
                break;
            }
        }
        return ret;
    },
    setImage: function setImage(_node, _productId) {
        var ELS_PRODUCT_CONFIG = {
            // TODO:res/raw-assets/resources/
            TY20016D0000003: { // 玫瑰
                url: "image/prop_icons/daoju03",
                scale: 0.4,
                rotation: 0
            },
            TY20082D0000101: { // 道具大礼包
                url: "image/prop_icons/item_box",
                scale: 1,
                rotation: 0
            },
            TY20016D0000004: { // 导弹
                url: "image/prop_icons/FangKuai_daodan",
                scale: 1,
                rotation: 0
            },
            TY20016D0000005: { // 锤子
                url: "image/prop_icons/FangKuai_chueizi",
                scale: 0.9,
                rotation: 0
            },
            1019: { // 魔法棒
                url: "image/prop_icons/FangKuai_mobang",
                scale: 0.6,
                rotation: -25
            },
            TY20082D0000201: { // 乐高积木皮肤
                url: "image/prop_icons/pifu00",
                scale: 1,
                rotation: 0
            },
            TY20082D0000202: { // 七彩水晶皮肤
                url: "image/prop_icons/pifu02",
                scale: 1,
                rotation: 0
            },
            TY20082D0000203: { // 瑰丽宝石皮肤
                url: "image/prop_icons/pifu03",
                scale: 1,
                rotation: 0
            },
            TY20082D0000204: { // 瑰丽宝石皮肤
                url: "image/prop_icons/pifu04",
                scale: 1,
                rotation: 0
            }
        };
        var _item = ELS_PRODUCT_CONFIG[_productId + ''];
        if (!_item) {
            console.log("local config not exist!!");
            return;
        }

        var purl = _item["url"];
        _node.node.rotation = _item["rotation"];
        _node.node.scale = _item["scale"];
        cc.loader.loadRes(purl, cc.SpriteFrame, function (err, spriteFrame) {
            if (!err) {
                _node.getComponent('cc.Sprite').spriteFrame = spriteFrame;
            } else {
                console.log('loadResError', err);
            }
        });
    },
    showAward: function showAward() {
        var self = this;
        cc.loader.loadRes('prefab/diamond_award/award', function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            preFabNode.parent = tywx.UIManager.getCurrentUI();
        });
    },
    buy_btn_click: function buy_btn_click() {
        // TODO: 购买商品
        console.log("buy_btn_click");
        if (!this.canPay) {
            wx.showToast({
                title: '已经拥有了',
                duration: 1000
            });
            return;
        }
        var self = this;
        if (parseInt(tywx.UserInfo.diamond) - parseInt(this._product_info.priceDiamond) < 0) {
            tywx.Util.wechatShowModal("钻石不够啦,邀请好友可获得钻石哦,去邀请?", true, "邀请", function (params) {
                // 
                if (params.confirm) {
                    console.log("to invalid");
                    self.showAward();
                } else {
                    console.log("to cancel");
                }
            });
            return;
        }
        tywx.MSG.transformProduct("TY20082D0000000", this._product_info.productId, 1);
    }
}

// update (dt) {},
);

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
        //# sourceMappingURL=product_cell.js.map
        