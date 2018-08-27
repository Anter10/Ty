(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/unlock/unlock.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7bddfxR5wJANJxP1a79H/Lo', 'unlock', __filename);
// script/ui/unlock/unlock.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        unlock_content: cc.Node,
        item_prefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // this.node.active = false;
        this.addNodes();
        var self = this;
        wx.showToast({
            title: '加载中..',
            icon: 'loading',
            duration: 2000
        });
        // 添加监听
        tywx.NotificationCenter.listen(tywx.EventType.CMD_ELSWX, this._MsgELSWX, this);
        // 获取数据
        tywx.MSG.getRewardItems();
    },
    addNodes: function addNodes() {
        this.items = [];
        for (var i = 0; i < 4; i++) {
            // 创建 4 个
            var c = cc.instantiate(this.item_prefab);
            var _x = i % 2 === 0 ? -130 : 130;
            var _y = i >= 2 ? -178 : 190;
            c.position = cc.v2(_x, _y);
            c.getComponent("unlock_item").init(undefined, i);
            c.parent = this.unlock_content;
            this.items.push(c);
        }
    },
    _MsgELSWX: function _MsgELSWX(params) {
        if (params.result.action === tywx.EventType.CMD_ACTION_REWARD_ITEMS) {
            var _data = params.result.rewardItems;
            this.show_with_data(_data);
        }
        if (params.result.action === tywx.EventType.CMD_ACTION_ADD_ITEMS) {
            tywx.MSG.getRewardItems();
        }
    },
    show_with_data: function show_with_data(_data) {
        // 获取数据
        wx.hideToast();
        // this.node.active = true;
        for (var i = 0; i < 4; i++) {
            // 创建 4 个
            this.items[i].getComponent("unlock_item").init(_data[i], i);
        }
    },
    dismiss_unlock_node: function dismiss_unlock_node() {
        tywx.AdManager.destroyBannerAd();
        this.node.active = false;
        this.node.removeFromParent();
        this.node.destroyAllChildren();
        this.node.destroy();
        if (!this.fromHome) {
            this.fromHome = false;
            tywx.UIManager.game.continueGame();
        }
    },
    onDestroy: function onDestroy() {
        tywx.NotificationCenter.ignoreScope(this);
    }

    // update (dt) {},

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
        //# sourceMappingURL=unlock.js.map
        