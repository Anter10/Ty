(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/els_view_daliy_login.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ba2ecPFnolAHoEiHGSKckP5', 'els_view_daliy_login', __filename);
// script/ui/els_view_daliy_login.js

'use strict';

var ElsUtils = require('../core/ElsUtils.js');
var ElsEvents = require('../core/ElsEvents.js');
var PropConfig = cc.Class({
    name: 'PropConfig',
    properties: {
        id: 1014,
        count: 5
    }
});
var GiftConfig = cc.Class({
    name: 'GiftConfig',
    properties: {
        day: '第一天',
        props: [PropConfig]
    }
});

var ElsViewDailyLogin = cc.Class({
    extends: cc.Component,

    properties: {
        prefabItem: cc.Prefab,
        nodeContent: cc.Node,
        giftConfigs: [GiftConfig]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        tywx.NotificationCenter.listen(ElsEvents.ELS_EVENT_DAILY_LOGIN_GIFT_SUCCESS, this.onGiftSuccess, this);
    },
    start: function start() {},


    // update (dt) {},

    onDestroy: function onDestroy() {
        tywx.NotificationCenter.ignoreScope(this);
    },
    init: function init() {
        var _this = this;

        var getting_idx = tywx.UserInfo.loginReward.day;
        var canGet = tywx.UserInfo.loginReward.get;
        var configs = tywx.UserInfo.loginReward.conf;
        this.getting_idx = getting_idx;
        this.giftConfigs = [];
        this.isGettedGift = !canGet;
        this.waitingGetItem = null;
        configs.forEach(function (e) {
            var tmp_config = new GiftConfig();
            tmp_config.day = ElsUtils.loginServerId2String(e.nday);
            var tmp_rewards = e.rewards;
            tmp_config.props = [];
            tmp_rewards.forEach(function (e) {
                var tmp_prop = new PropConfig();
                tmp_prop.id = e.itemId;
                tmp_prop.count = e.count;
                tmp_config.props.push(tmp_prop);
            });
            _this.giftConfigs.push(tmp_config);
        });

        this.giftConfigs.forEach(function (element, idx) {
            console.log('els_view_daliy_login/element', element, idx);
            var tmp_item = cc.instantiate(_this.prefabItem);
            tmp_item.parent = _this.nodeContent;
            tmp_item.getComponent('els_view_daily_login_item').init(element, idx < getting_idx);
            if (idx === getting_idx) {
                if (canGet) {
                    tmp_item.getComponent('els_view_daily_login_item').showWaitingGet();
                    _this.waitingGetItem = tmp_item;
                } else {
                    tmp_item.getComponent('els_view_daily_login_item').showGetted();
                }
            }
        });
    },

    /**
     * 模态层回调
     */
    motaiCallback: function motaiCallback() {},

    /**
     * 领取奖励
     */
    btnGetClickCallback: function btnGetClickCallback() {
        if (this.isGettedGift) {
            tywx.Util.wechatShowModal("今天的奖励已经领取，请明天再来领取！", false, "确认");
            return;
        }

        var tmp_config = this.giftConfigs[this.getting_idx];
        if (tmp_config) {
            tywx.MSG.requestDailyLogin();
        }
    },

    /**
     * 关闭界面
     */
    btnCloseClickCallback: function btnCloseClickCallback() {
        this.node.destroy();
    },
    onGiftSuccess: function onGiftSuccess(params) {
        console.log('els_view_daliy_login/onGiftSuccess', params);

        if (params.error) {
            tywx.Util.wechatShowModal("今天的奖励已经领取，请明天再来领取！", false, "确认");
            return;
        }

        tywx.UserInfo.loginReward.get = 0;
        this.isGettedGift = true;
        if (this.waitingGetItem) {
            this.waitingGetItem.getComponent('els_view_daily_login_item').showGetted();
        }
        var map = new Map([[1014, '钻石'], [1017, '导弹'], [1018, '锤子'], [1019, '魔法棒']]);
        var items = params.result.items;
        if (items) {
            var content = '恭喜获得\r\n'; // \r\n 换行在真机上可以，模拟器中不行
            items.forEach(function (e) {
                if (map.has(e.itemId)) {
                    content += map.get(e.itemId) + 'x' + e.count + ' ';
                }
            });
            tywx.Util.wechatShowModal(content, false, "确认");
        }
    }
});
module.exports = ElsViewDailyLogin;

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
        //# sourceMappingURL=els_view_daliy_login.js.map
        