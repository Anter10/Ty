"use strict";
cc._RF.push(module, 'e79ebq3RxBPwI4zqKL0WRP4', 'TY_Receiver');
// script/CommonFrame/TY_Receiver.js

"use strict";

var ELSEvent = require("../core/ElsEvents.js");
var els = require("../core/els.js");
var ElsUtils = require("../core/ElsUtils.js");

tywx.Receiver = {

    _map: {}, // 保存注册的协议回调

    init: function init() {
        /**
         * tcp消息，不要再注册。
         */
        tywx.NotificationCenter.listen(tywx.EventType.TCP_OPENED, this._onMsgTcpOpen, this);
        tywx.NotificationCenter.listen(tywx.EventType.TCP_ERROR, this._onMsgTCPErr, this);
        tywx.NotificationCenter.listen(tywx.EventType.TCP_CLOSE, this._onMsgTCPErr, this);
        tywx.NotificationCenter.listen(tywx.EventType.CMD_UPDATE_NOTIFY, this._onMsgUpdateNotify, this);
        tywx.NotificationCenter.listen(tywx.EventType.TCP_RECEIVE, this._onMsgServerMessage, this);

        this.register(tywx.EventType.CMD_USER_INFO, this._onMsgUserInfo, this);
        this.register(tywx.EventType.CMD_GAME_DATA, this._onMsgGameData, this);
        this.register(tywx.EventType.CMD_USER_INFO, this._onMsgUserInfo, this);
        this.register(tywx.EventType.CMD_ITEM, this._onMsgItem, this);
        this.register(tywx.EventType.CMD_ELSWX, this._onMsgElsWx, this);
        this.register(tywx.EventType.CMD_STORE, this._onMsgStore, this);
    },

    onDestroy: function onDestroy() {
        tywx.NotificationCenter.ignoreScope(this);
    },


    // 注册cmd回调
    register: function register(eventName, func) {
        this._map[eventName] = func;
    },

    _onMsgTcpOpen: function _onMsgTcpOpen() {
        tywx.MSG.bindUser();
    },
    _onMsgTCPErr: function _onMsgTCPErr() {
        console.log("链接断开了....");
    },
    _onMsgServerMessage: function _onMsgServerMessage(params) {
        params = params || {};
        var cmd = params.cmd;
        if (cmd) {
            var func = this._map[cmd];
            if (typeof func === 'function') {
                func.call(this, params);
                console.log("_onMsgServerMessage::", JSON.stringify(params));
            }
            tywx.NotificationCenter.trigger(cmd, params);
        }
    },


    // ===============>>>>>
    _onMsgUserInfo: function _onMsgUserInfo(params) {
        console.log("_onMsgUserInfo", JSON.stringify(params));
        tywx.MSG.bindGame(tywx.SystemInfo.gameId);
    },
    _onMsgGameData: function _onMsgGameData(params) {
        console.log("_onMsgGameData", JSON.stringify(params));
        if (!tywx.StoreList) {
            tywx.MSG.getStoreList();
        }
        tywx.MSG.hallInfo();
        tywx.MSG.getBagInfo();
        tywx.MSG.enterGame(tywx.UserInfo.invite_id);
        if (tywx.UserInfo.user_add_item > 0) {
            tywx.MSG.addItems(6, 0, tywx.UserInfo.user_add_item);
            tywx.UserInfo.user_add_item = -1;
        }
        if (tywx.UserInfo.select_gift_item) {
            var _item = tywx.UserInfo.select_gift_item ? tywx.UserInfo.select_gift_item.content.items[0].itemId.substr(-4) : "";
            var _amount = 1;
            var _uuid = tywx.UserInfo.select_gift_item.uuid;
            tywx.MSG.whisperStart(_uuid, _item, _amount);
            tywx.UserInfo.select_gift_item = undefined;
        }
        if (tywx.UserInfo.showQuery) {
            tywx.NotificationCenter.trigger(tywx.EventType.SECRET_LANGUAGE_TO_GAME, tywx.UserInfo.showQuery);
        }
    },
    _onMsgHallInfo: function _onMsgHallInfo(params) {
        console.log("_onMsgHallInfo", JSON.stringify(params));
    },
    _onMsgItem: function _onMsgItem(params) {
        console.log("_onMsgItem", JSON.stringify(params));
        if (params.result.action === "_feiqi") {
            // 背包信息
            var _bag = [];
            params.result.items.forEach(function (_item, index) {
                var _kindID = _item[1];
                var _count = _item[2];
                // TODO: 遍历道具信息 组合成布局需要的数据
                if (_kindID === 1014) {
                    // 钻石数
                    tywx.UserInfo.diamond = _count;
                }
                _bag.push({
                    kindID: _kindID,
                    itemId: _kindID,
                    count: _count
                });
            });

            tywx.UserInfo.bag = _bag; //ELS_EVENTS
            tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_UPDATE_BAG, _bag);
        }

        if (params.result.action === 'product') {
            // 兑换道具成功后 重新拉起背包
            if (params.error && params.error.info) {
                tywx.Util.wechatShowModal(params.error.info, false, "\u786E\u8BA4");
                return;
            }
            tywx.MSG.getBagInfo();
            tywx.Util.wechatShowModal("道具兑换成功啦!", false, "确认");
        }
    },


    /**
     * 通知更新数据：用户信息
     * @private
     */
    _onMsgUpdateNotify: function _onMsgUpdateNotify(params) {
        var result = params.result;
        var changes = result['changes'] || [];
        for (var i = 0; i < changes.length; i++) {
            if (changes[i] === "udata") {
                tywx.MSG.getUserInfo();
            } else if (changes[i] === "item") {
                tywx.MSG.getBagInfo();
            } else if (changes[i] === "redpoint5") {
                tywx.MSG.getUserInfo();
                tywx.MSG.getBagInfo();
            }
        }
    },
    _onMsgStore: function _onMsgStore(params) {
        if (params.result.action === "sc_list") {
            // 道具消耗
            tywx.StoreList = undefined;
            var ps = [];
            var ds = [];
            var gs = [];
            // 道具配置

            var _data = params.result;

            var _ps = _data["shelves"]["shelves"]["coin:01"]["products"] || [];
            var _ds = _data["shelves"]["shelves"]["diamond:00"]["products"] || [];
            var _gs = _data["shelves"]["shelves"]["gift:01"]["products"] || [];

            var _products = _data.products.products;

            _ps.forEach(function (item) {
                ps.push(_products[item]);
            });

            _ds.forEach(function (item) {
                ds.push(_products[item]);
            });

            _gs.forEach(function (item) {
                gs.push(_products[item]);
            });

            tywx.StoreList = {
                ps: ps,
                gs: gs,
                ds: ds,
                items: _data.items.items
            };
        }
    },
    _onMsgElsWx: function _onMsgElsWx(params) {
        if (params.result.action === "consume_items") {
            // 道具消耗
            if (parseInt(params.result.status) === 1) {
                // 道具消耗成功
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_CUNSOME_ITEM_SUCCESS, params);
            }
        }

        if (params.result.action === "add_items") {
            // 道具添加
            if (parseInt(params.result.status) === 1 && parseInt(params.result.reason) === 6) {
                // 水瓶满 道具添加成功
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_ADD_ITEM_SUCCESS, params);
            }
        }
        if (params.result.action === "add_diamond") {
            // 道具添加
            // if (parseInt(params.result.count) === 1) { // 看广告 道具添加成功
            tywx.Util.wechatShowModal("恭喜获得钻石x" + params.result.count, false, "确认");
            // }
        }

        if (params.result.action === "enter_game") {
            // 悄悄话通关奖励
            tywx.UserInfo.whisperResult = params.result.whisperResult;
            // 每日登陆奖励
            tywx.UserInfo.loginReward = params.result.loginReward;
            // openId
            tywx.UserInfo.openId = params.result.openId.substr(6);
        }

        if (params.result.action === 'daily_login') {
            //! 更新背包信息
            tywx.MSG.getBagInfo();
            //! 通知获取奖励成功
            tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_DAILY_LOGIN_GIFT_SUCCESS, params);
        }

        if (params.result.action === 'get_bag') {
            //! 更新背包信息
            // 背包信息
            var _bag = [];
            params.result.normalItems.forEach(function (_item, index) {
                var _kindID = _item[1];
                var _count = _item[2];
                // TODO: 遍历道具信息 组合成布局需要的数据
                if (_kindID === 1014) {
                    // 钻石数
                    tywx.UserInfo.diamond = _count;
                }
                _bag.push({
                    kindID: _kindID,
                    itemId: _kindID,
                    count: _count
                });
            });

            for (var i in params.result.recvCount) {
                var _kindID = parseInt(i);
                var _count = params.result.recvCount[i];
                _bag.push({
                    kindID: _kindID,
                    itemId: _kindID,
                    count: _count
                });
            }

            _bag.sort(function (lhr, rhr) {
                var lvalue = parseInt(lhr.kindID);
                if (isNaN(lvalue)) lvalue = 0;
                var rvalue = parseInt(rhr.kindID);
                if (isNaN(rvalue)) rvalue = 0;
                return rvalue - lvalue;
            });
            tywx.UserInfo.bag = _bag; //ELS_EVENTS
            tywx.UserInfo.elsBag = params.result; //ELS_EVENTS
            tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_UPDATE_BAG, _bag);
            // TODO : 更新排行榜
            if (params.result.recvPrice !== tywx.UserInfo.recvPrice) {
                tywx.UserInfo.recvPrice = params.result.recvPrice;
                ElsUtils.saveItem("ELS_RECV_PRIVE", params.result.recvPrice); // 接受
            }
            if (params.result.sendPrice !== tywx.UserInfo.sendPrice) {
                tywx.UserInfo.sendPrice = params.result.sendPrice;
                ElsUtils.saveItem("ELS_SEND_PRIVE", params.result.sendPrice); // 发送
            }
        }
    }
};

tywx.Receiver.init();

cc._RF.pop();