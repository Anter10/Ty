"use strict";
cc._RF.push(module, '73db6yU0OxE050gyEPj3/gf', 'gameAward');
// script/ui/gameAward.js

"use strict";

var ElsProfile = require("../core/ELSProfile.js");

cc.Class({
    extends: cc.Component,

    properties: {
        page_view_prefab: cc.Prefab,
        page_view_node: cc.Node,
        page_view: cc.PageView,

        daily_reward_label: cc.Label,
        am_info_label: cc.Label,
        pm_info_label: cc.Label,
        reward_info_label: cc.Label,

        ad_content: cc.Node, // 广告UI
        ad_info_label: cc.Label, // 广告倒计时描述

        btn_content_nodes: [cc.Node],
        cell: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.ad_content.active = true;
        this.ad_info_label.string = "";
        this.button_state = 0;
        this.node.getChildByName("back_btn").on("click", this.back_btn_click, this);
        tywx.NotificationCenter.listen(tywx.EventType.CMD_ELSWX, this._MsgRewardInfo, this);
        tywx.MSG.getRewardInfo();
        tywx.MSG.getNextAdreward();
    },
    onDestroy: function onDestroy() {
        tywx.NotificationCenter.ignoreScope(this);
    },
    showWithData: function showWithData(_data) {
        this.node.active = true;
        this.update_page_view_data(_data['shareUsers']);
        var _dc = 0;
        var self = this;
        _data.dailyReward.forEach(function (_item, _index) {
            _dc = _dc + parseInt(_item.getDiamond);
            if (_index === 0) {
                self.am_info_label.string = _item.desc;
            } else if (_index === 1) {
                self.pm_info_label.string = _item.desc;
            }
        });
        this.daily_reward_label.string = "每日领奖（" + _dc + "/2）";
        this.reward_info_label.string = "奖励：     + " + _data["oneRewardDiamond"];
        this.button_state = _data["getReward"];
        this.update_button_state();
    },
    update_button_state: function update_button_state() {
        for (var i = 0; i < this.btn_content_nodes.length; i++) {
            if (i === this.button_state) {
                this.btn_content_nodes[i].active = true;
            } else {
                this.btn_content_nodes[i].active = false;
            }
        }
    },
    update_page_view_data: function update_page_view_data(_list) {
        for (var i = 0; i < 30; i++) {
            var page_index = parseInt(i / 6);
            var _state = _list.length > i ? 2 : 1;
            var _data = undefined;
            if (_state === 2) {
                _data = _list[i];
                if (parseInt(_data["getDianmond"]) === 1) {
                    _state = 0;
                }
            }
            var c = cc.instantiate(this.cell);
            c.getComponent("diamond_award_cell").init({ "state": _state, "data": _data });
            var _y = i % 6 >= 3 ? -110 : 180;
            var _x = 0;
            if (i % 6 % 3 === 2) {
                _x = 200;
            } else if (i % 6 % 3 === 0) {
                _x = -200;
            }
            c.position = cc.v2(_x, _y);
            c.parent = this.page_view.getPages()[page_index];
        }
    },
    right_btn_click: function right_btn_click() {
        if (this.page_view.getCurrentPageIndex() == 0) {
            return;
        }
        this.page_view.setCurrentPageIndex(this.page_view.getCurrentPageIndex() - 1);
    },
    left_btn_click: function left_btn_click() {
        if (this.page_view.getCurrentPageIndex() == 4) {
            return;
        }
        this.page_view.setCurrentPageIndex(this.page_view.getCurrentPageIndex() + 1);
    },
    award_btn_click: function award_btn_click() {
        if (this.button_state === 1) {
            // 领取
            tywx.MSG.addRewardDiamond();
        }
    },


    // button click
    back_btn_click: function back_btn_click() {
        this.node.active = false;
        this.node.removeFromParent();
        this.node.destroyAllChildren();
        this.node.destroy();
    },
    ad_btn_click: function ad_btn_click() {
        this.showDaliy();
    },
    showDaliy: function showDaliy() {
        var self = this;
        cc.loader.loadRes('prefab/els_view_daliy_login', cc.Prefab, function (err, prefab) {
            if (err) cc.error(err.message || err);else {
                var daily_login = cc.instantiate(prefab);
                daily_login.getComponent('els_view_daliy_login').init();
                daily_login.parent = tywx.UIManager.getCurrentUI();
            }
        });
    },
    _MsgRewardInfo: function _MsgRewardInfo(params) {
        if (params.result.action === tywx.EventType.CMD_ACTION_REWARD_INFO) {
            tywx.UserInfo.rewardInfo = params.result;
            this.showWithData(params.result);
        }
        if (params.result.action === tywx.EventType.CMD_ACTION_ADD_DIAMOND) {
            if (params.result.status === 1 && params.result.reason === 3) {
                // 每日领取成功
                this.button_state = 0;
                this.update_button_state();
                tywx.Util.wechatShowModal("每日奖励领取成功", false, "确定");
            }
        }
    }
}

// update (dt) {},
);

cc._RF.pop();