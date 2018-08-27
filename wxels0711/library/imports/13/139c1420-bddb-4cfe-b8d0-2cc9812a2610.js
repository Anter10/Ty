"use strict";
cc._RF.push(module, '139c1QgvdtM/rjQLMmBKiYQ', 'item_cell');
// script/ui/mall/item_cell.js

"use strict";

var ElsUtils = require("../../core/ElsUtils.js");
var ELSEvent = require("../../core/ElsEvents.js");

cc.Class({
    extends: cc.Component,

    properties: {
        bgs: [cc.Node],
        count_label: cc.Label,
        name_label: cc.Label,
        select_tag: cc.Node,
        icon: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.select_tag.active = false;
        this.count_label.active = false;
        this.bgs[0].active = false;
        this.bgs[1].active = true;
        var _itemId = this.item_data["kindID"] || "";
        if (ElsUtils.checkPF(_itemId)) {
            // 当前是选中皮肤
            this.count_label.active = false;
            this.count_label.string = "";
            if (ElsUtils.selectPF(_itemId)) {
                this.bgs[0].active = true;
                this.bgs[1].active = false;
            }
        }
    },
    init: function init(_data) {
        if (!_data || !_data["item"]) return;
        this.item_data = _data;
        var _itemId = _data["kindID"];
        var _count = _data["count"] ? _data["count"] : 0;
        if (_count > 0 && !ElsUtils.checkPF(_itemId)) {
            this.count_label.active = true;
            this.count_label.string = _count;
        }
        var _name = _data["item"]["displayName"];
        this.name_label.string = _name;
        this.setImage(this.icon, _itemId);
    },
    setImage: function setImage(_node, _itemId) {
        var ELS_PRODUCT_CONFIG = {
            // TODO:
            //res/raw-assets/resources/
            1301: {
                url: "image/prop_icons/daoju01",
                scale: .35,
                y: 5.65
            },
            1302: {
                url: "image/prop_icons/daoju04",
                scale: .39,
                y: 5.65
            },
            1303: {
                url: "image/prop_icons/daoju03",
                scale: .3,
                y: 14.2
            },
            1304: {
                url: "image/prop_icons/daoju02",
                scale: .39,
                y: 7
            },
            1305: {
                url: "image/prop_icons/daoju05",
                scale: .4,
                y: 2.3
            },
            1306: {
                url: "image/prop_icons/daoju06",
                scale: .34,
                y: 1.95
            },
            1307: {
                url: "image/prop_icons/daoju001",
                scale: 1,
                y: 5.9
            },
            1017: { // 导弹
                url: "image/prop_icons/FangKuai_daodan",
                scale: 1,
                rotation: 0
            },
            1018: { // 锤子
                url: "image/prop_icons/FangKuai_chueizi",
                scale: 0.9,
                rotation: 0
            },
            1019: { // 魔法棒
                url: "image/prop_icons/FangKuai_mobang",
                scale: 0.6,
                rotation: -25
            },
            1020: { // 冰弹
                url: "image/prop_icons/FangKuai_bingdan",
                scale: 0.9,
                rotation: 0
            },
            1201: { // 乐高积木皮肤
                url: "image/prop_icons/pifu00",
                scale: 1,
                rotation: 0
            },
            1202: { // 七彩水晶皮肤
                url: "image/prop_icons/pifu02",
                scale: 1,
                rotation: 0
            },
            1203: { // 瑰丽宝石皮肤
                url: "image/prop_icons/pifu03",
                scale: 1,
                rotation: 0
            },
            1204: { // 心心相印
                url: "image/prop_icons/pifu04",
                scale: 1,
                rotation: 0
            }

        };

        var _item = ELS_PRODUCT_CONFIG[_itemId + ''];
        if (!_item) {
            console.log("local config not exist!!");
            return;
        }

        var purl = _item["url"];
        _node.node.rotation = _item["rotation"] || 0;
        _node.node.scale = _item["scale"];
        cc.loader.loadRes(purl, cc.SpriteFrame, function (err, spriteFrame) {
            if (!err) {
                _node.getComponent('cc.Sprite').spriteFrame = spriteFrame;
            }
        });
    },
    update_select: function update_select() {
        var _itemId = this.item_data["kindID"] || "";
        if (ElsUtils.checkPF(_itemId)) {
            // 当前是皮肤
            this.count_label.active = false;
            this.count_label.string = "";
            if (ElsUtils.selectPF(_itemId)) {
                this.bgs[0].active = true;
                this.bgs[1].active = false;
            } else {
                this.bgs[0].active = false;
                this.bgs[1].active = true;
            }
        }
    },
    item_cell_click: function item_cell_click() {
        if (ElsUtils.checkPF(this.item_data["kindID"])) {
            // 当前是皮肤
            if (!ElsUtils.selectPF(this.item_data["kindID"])) {
                // 当前非选中皮肤
                ElsUtils.savePF(this.item_data["kindID"]);
                // TODO: 刷新界面
                var _i = this.item_data["kindID"] + "";
                var pf_tag = parseInt(_i.substr(_i.length - 1, 1));
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_REFRESH_LOCAL_SKIN, {
                    "idx": pf_tag - 1
                });
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_UPDATE_ITEMS);
            }
        }
        if (ElsUtils.checkGift(this.item_data["kindID"])) {
            // 虚拟礼物
            tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_SHOW_GIFT_PROP_ANIMATION, {
                type: 0,
                prop_id: parseInt(this.item_data["kindID"])
            });
        }
    }
}

// update (dt) {},
);

cc._RF.pop();