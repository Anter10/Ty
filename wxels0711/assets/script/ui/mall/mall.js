// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var ELSEvent = require("../../core/ElsEvents.js");

cc.Class({
    extends: cc.Component,

    properties: {
        mall_btn_nodes: [cc.Node], // 0:select 1:nomal
        my_btn_nodes: [cc.Node], // 0:select 1:nomal
        diamond_btn_nodes: [cc.Node], // 0:select 1:nomal

        mall_content: cc.Node,

        page_view: cc.PageView, // 商城
        my_page_view: cc.PageView, // 我的
        diamond_page_view: cc.PageView, // 钻石

        diamond_label: cc.Label, // 钻石数

        mall_cell: cc.Prefab,
        item_cell: cc.Prefab,
        diamond_cell: cc.Prefab,

        page_prefab: cc.Prefab,

        x_node: cc.Node

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.diamond_label.active = false;
        this.page_views = [];
        for (let i = 0; i < 3; i++) {
            let c = cc.instantiate(this.page_prefab);
            c.position = this.x_node.position;
            console.log(c.position);
            c.parent = this.mall_content;
            this.page_views.push(c);
        }

        this.curIndex = 0; // 当前界面标识  0: 商城 1: 我的背包 2: 钻石

        this.btn_nodes = [this.mall_btn_nodes, this.my_btn_nodes, this.diamond_btn_nodes];

        this.select_page_view(this.curIndex);

        this.page_view = this.page_views[0].getComponent("cc.PageView");
        this.my_page_view = this.page_views[1].getComponent("cc.PageView");
        this.diamond_page_view = this.page_views[2].getComponent("cc.PageView");

        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_UPDATE_BAG, this._onMsgItem, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_UPDATE_ITEMS, this._onMsgUpdateBag, this);
        tywx.MSG.getBagInfo();
    },

    start() {
        
        if (this.curIndex === 2) {
            this.diamond_btn_click();
        } else {
            this.mall_btn_click();
        }
        this.load_product_config();
    },

    _onMsgItem(params) {
        this.update_Bag();
    },

    load_product_config() {

        if (!tywx.StoreList) {
            tywx.MSG.getStoreList();
            // TODO: 获取到实际配置后显示
            tywx.Timer.setTimer(this, this.load_product_config, 1);
        } else {
            this.update_UI();
        }

        if (tywx.UserInfo.bag) {
            this.update_Bag();
        } else {
            tywx.MSG.getBagInfo();
        }
    },

    update_Bag() {
        this.diamond_label.active = true;
        this.diamond_label.string = tywx.UserInfo.diamond;

        let _items = [];
        tywx.UserInfo.bag.forEach(function(_item) {

            let tag = false;
            tywx.StoreList.items.forEach(function(_i) {
                if (_i["kindId"] === _item["kindID"]) {
                    tag = true;
                }
            });
            if (_item['kindID'] !== 1014 && tag) {
                _items.push(_item);
            }
        });
        this.item_cells = [];
        for (let i = 0; i < _items.length; i++) {
            let _pageIndex = parseInt(i / 4); // 每页4个
            let _page = undefined;
            if (this.my_page_view.getPages().length > _pageIndex) {
                _page = this.my_page_view.getPages()[_pageIndex];
            } else {
                _page = new cc.Node();
                _page.width = 540;
                _page.height = 699;
                this.my_page_view.addPage(_page);
            }
            let _x = i % 2 === 0 ? -124.5 : 124.5;
            let _y = i % 4 < 2 ? 173.5 : -154.5;
            let _cell = cc.instantiate(this.item_cell);
            let _data = _items[i];
            tywx.StoreList.items.forEach(function(_i) {
                if (_i["kindId"] === _data["kindID"]) {
                    _data["item"] = _i;
                }
            });
            if (!_data["item"]) return;
            _cell.getComponent("item_cell").init(_data);
            _cell.position = cc.v2(_x, _y);
            this.item_cells.push(_cell);
            _cell.parent = _page;
        }
    },

    _onMsgUpdateBag() {
        this.item_cells.forEach(function(_item_cell) {
            _item_cell.getComponent("item_cell").update_select();
        });
    },

    update_UI() {
        for (let i = 0; i < tywx.StoreList.ps.length; i++) {
            let _pageIndex = parseInt(i / 4); // 每页4个
            let _page;
            if (this.page_view.getPages().length > _pageIndex) {
                _page = this.page_view.getPages()[_pageIndex];
            } else {
                _page = new cc.Node();
                _page.width = 540;
                _page.height = 699;
                this.page_view.addPage(_page);
            }
            let _x = i % 2 === 0 ? -124.5 : 124.5;
            let _y = i % 4 < 2 ? 173.5 : -154.5;
            let _cell = cc.instantiate(this.mall_cell);
            _cell.getComponent("product_cell").init(tywx.StoreList.ps[i]);
            _cell.position = cc.v2(_x, _y);
            tywx.UserInfo.bag.forEach(function(_item) {
                let _itemid = tywx.StoreList.ps[i]["content"]["items"][0]["itemId"] || "";
                if (_item.kindID === _itemid.split(':')[1]) {
                    _cell.getComponent("product_cell").product_tag.node.active = true;
                }
            });
            _cell.parent = _page;
        }

        let _length = tywx.StoreList.ds.length + 2;
        if (cc.sys.os === cc.sys.OS_IOS) {
            _length = 2;
        }

        for (let i = 0; i < _length; i++) {
            let _pageIndex = parseInt(i / 4); // 每页4个
            let _page;
            if (this.diamond_page_view.getPages().length > _pageIndex) {
                _page = this.diamond_page_view.getPages()[_pageIndex];
            } else {
                _page = new cc.Node();
                _page.width = 540;
                _page.height = 699;
                this.diamond_page_view.addPage(_page);
            }
            let _x = i % 2 === 0 ? -124.5 : 124.5;
            let _y = i % 4 < 2 ? 173.5 : -154.5;
            let _cell = cc.instantiate(this.diamond_cell);
            if (i - 2 >= 0) {
                _cell.getComponent("diamond_cell").init(tywx.StoreList.ds[i - 2], i);
            } else {
                _cell.getComponent("diamond_cell").init(undefined, i);
            }
            _cell.position = cc.v2(_x, _y);
            _cell.parent = _page;
        }
    },

    // button event
    mall_btn_click() {
        this.curIndex = 0;
        this.select_page_view();
    },

    my_btn_click() {
        this.curIndex = 1;
        this.select_page_view();
    },

    diamond_btn_click() {
        this.curIndex = 2;
        this.select_page_view();
    },

    select_page_view() {

        let _index = this.curIndex;
        let self = this;
        this.page_views.forEach(function(page_view, i) {
            page_view.active = false;
            if (i === _index) {
                page_view.active = true;
            }
        });

        this.btn_nodes.forEach(function(_list, i) {
            self.selectBtn(_list, false);
            if (i === _index) {
                self.selectBtn(_list, true);
            }
        })

    },

    dismiss_UI() {
        this.node.active = false;
        this.node.removeFromParent();
        this.node.destroyAllChildren();
        this.node.destroy();
        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_CLEARN_MALL);
    },

    selectBtn(_list, _type) {
        _list[0].active = _type;
        _list[1].active = !_type;
    },

    onDestroy() {
        tywx.NotificationCenter.ignoreScope(this);
    },

    // update (dt) {},
});