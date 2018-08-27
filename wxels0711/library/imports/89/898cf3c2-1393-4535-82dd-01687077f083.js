"use strict";
cc._RF.push(module, '898cfPCE5NFNYLdAWhwd/CD', 'select_gift_item');
// script/ui/select_gift_item.js

"use strict";

var ELSEvent = require("../core/ElsEvents.js");

cc.Class({
    extends: cc.Component,

    properties: {
        product_icon: cc.Sprite,
        product_price: cc.Label,
        product_name_node: cc.Sprite,
        product_name: cc.Label,
        product_select_tag: cc.Sprite
    },

    onLoad: function onLoad() {

        this.product_select_tag.node.active = false;
    },
    init: function init(data, index) {
        this.product_price.string = "";
        this._data = data;
        this._index = index;
        this._select = false;
        this.product_name_node.node.active = false;
        this.product_price.node.active = false;
        if (!data) {
            return;
        }

        if (this._data["showName"]) {
            this.product_name_node.node.active = true;
            this.product_name.string = this._data.displayName;
        }

        var name = data.priceDiamond + "";
        this.itemId = data.content.items[0].itemId;
        this.setImage(this.product_icon, this.itemId);
        this.product_price.string = name;
        this.product_price.node.active = true;
    },
    updateSelect: function updateSelect(isS) {
        this._select = isS;
        this.product_select_tag.node.active = isS;
    },


    setImage: function setImage(_node, _itemId) {
        var ELS_PRODUCT_CONFIG = {
            "item:1301": {
                url: "image/prop_icons/daoju01",
                scale: .35,
                y: 5.65
            },
            "item:1302": {
                url: "image/prop_icons/daoju04",
                scale: .39,
                y: 5.65
            },
            "item:1303": {
                url: "image/prop_icons/daoju03",
                scale: .3,
                y: 14.2
            },
            "item:1304": {
                url: "image/prop_icons/daoju02",
                scale: .39,
                y: 7
            },
            "item:1305": {
                url: "image/prop_icons/daoju05",
                scale: .4,
                y: 2.3
            },
            "item:1306": {
                url: "image/prop_icons/daoju06",
                scale: .34,
                y: 1.95
            },
            "item:1307": {
                url: "image/prop_icons/daoju001",
                scale: 1,
                y: 5.9
            }
        };
        var _item = ELS_PRODUCT_CONFIG[_itemId + ""];
        if (!_item) {
            console.log("local config not exist!!");
            return;
        }
        var purl = _item["url"];
        _node.node.rotation = _item["rotation"];
        _node.node.scale = _item["scale"];
        _node.node.y = _item["y"];
        cc.loader.loadRes(purl, cc.SpriteFrame, function (err, spriteFrame) {
            if (!err) {
                _node.getComponent('cc.Sprite').spriteFrame = spriteFrame;
            } else {
                console.log('loadResError', err);
            }
        });
    },

    select_item: function select_item() {
        console.log("select_item");
        if (!this._data) {
            return;
        }
        // TODO: 发送礼物选中事件 播放动画
        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_SELECT_GIFT, { item: this._data, index: this._index, select: this._select });
    }
}

// update (dt) {},
);

cc._RF.pop();