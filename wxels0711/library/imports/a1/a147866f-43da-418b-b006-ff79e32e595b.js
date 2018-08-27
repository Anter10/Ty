"use strict";
cc._RF.push(module, 'a1478ZvQ9pBi7AG/3njLllb', 'TY_MSG');
// script/CommonFrame/TY_MSG.js

"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var ElsUtils = require("../core/ElsUtils.js");
var ELSEvent = require("../core/ElsEvents.js");

tywx.MSG = {

    _sendCmd: function _sendCmd(jsonData) {
        jsonData.params = jsonData.params || {};
        jsonData.params.userId = jsonData.params.userId || tywx.UserInfo.userId; //ty.UserInfo.userId;
        jsonData.params.gameId = jsonData.params.gameId || tywx.SystemInfo.gameId;
        jsonData.params.version = jsonData.params.version || tywx.SystemInfo.version;
        jsonData.params.clientId = tywx.SystemInfo.clientId;
        jsonData.params.intClientId = tywx.SystemInfo.intClientId;
        jsonData.apiVersion = jsonData.apiVersion || 5;
        jsonData.namespace = "hall5";
        tywx.TCPClient.sendMsg(jsonData);
    },

    /**
     * 用户绑定
     */
    bindUser: function bindUser() {
        var params = {
            'cmd': tywx.EventType.CMD_BIND_USER,
            'params': {
                'gameId': tywx.SystemInfo.appId,
                'authorCode': tywx.UserInfo.authorCode
            }
        };
        this._sendCmd(params);
    },

    /**
     * 插件绑定
     */
    bindGame: function bindGame(gameId) {
        var params = {
            'cmd': tywx.EventType.CMD_BIND_GAME,
            'params': {
                'gameId': gameId || tywx.SystemInfo.gameId,
                'authorCode': tywx.UserInfo.authorCode
            }
        };
        this._sendCmd(params);
    },

    /**
     * 获取UserInfo，大厅获取9999的UserInfo，单版获取6的
     */
    getUserInfo: function getUserInfo() {
        var params = {
            'cmd': tywx.EventType.CMD_USER_INFO,
            'params': {
                'gameId': tywx.SystemInfo.appId
            }
        };
        this._sendCmd(params);
    },

    hallInfo: function hallInfo() {
        var params = {
            'cmd': tywx.EventType.CMD_HALL_INFO,
            'params': {
                'gameId': tywx.SystemInfo.appId
            }
        };
        this._sendCmd(params);
    },

    //    {"cmd":"item5","apiVersion":5.0,"namespace":"hall5","params":{"action":"transform","userId":10018,"intClientId":23834,"gameId":9999,"sourceItemKindId":1014,"targetItemKindId":1015,"amount":3}}

    // 消耗钻石兑换商品
    hallItem5: function hallItem5(_sourceItem, _targetItem, _amount) {
        var params = {
            'cmd': tywx.EventType.CMD_ITEM,
            'params': {
                'action': 'transform',
                "sourceItemKindId": _sourceItem || 1014,
                "targetItemKindId": _targetItem,
                "amount": _amount,
                'gameId': tywx.SystemInfo.appId
            }
        };
        this._sendCmd(params);
    },

    // 消耗钻石兑换商品
    transformProduct: function transformProduct(_sourceProductId, _targetProductId, _amount) {
        var params = {
            'cmd': tywx.EventType.CMD_ITEM,
            'params': {
                'action': 'product',
                "sourceProductId": _sourceProductId || "TY20016D0000001",
                "targetProductId": _targetProductId,
                "amount": _amount,
                'gameId': tywx.SystemInfo.appId
            }
        };
        this._sendCmd(params);
    },

    // 获取背包
    getBagInfo: function getBagInfo() {
        this.getELSBag();
        // let params = {
        //     "apiVersion": 5.2,
        //     "cmd": tywx.EventType.CMD_ITEM,
        //     "params": {
        //         "action": "list",
        //         'gameId': tywx.SystemInfo.appId
        //     }
        // };
        // this._sendCmd(params);
    },

    getRewardInfo: function getRewardInfo() {
        var params = {
            "apiVersion": 5.2,
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_REWARD_INFO
            }
        };
        this._sendCmd(params);
    },

    addRewardDiamond: function addRewardDiamond(_reason, _friendUserId) {
        var params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_ADD_DIAMOND,
                "reason": _reason || 3,
                "friendUserId": _friendUserId || 0
            }
        };
        this._sendCmd(params);
    },

    enterGame: function enterGame(_shareUserId) {
        var params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_ENTER_GAME,
                "shareUserId": _shareUserId
            }
        };
        this._sendCmd(params);
    },

    getNextAdreward: function getNextAdreward() {
        var params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_NEXT_ADREWARD
            }
        };
        this._sendCmd(params);
    },

    // 同步道具
    syncItems: function syncItems(_items) {
        var params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_SYNC_ITEMS,
                "items": _items || []
            }
        };
        this._sendCmd(params);
    },

    // 消耗道具
    consumeItem: function consumeItem(_kindId, _count) {
        var _kc = _count !== undefined ? -1 * _count : -1;
        if (!tywx.UserInfo.setItemCount(_kindId, _kc)) {
            return false;
        }
        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_UPDATE_BAG, tywx.UserInfo.bag);
        var _items = [{
            "itemId": _kindId,
            "count": _count || 1
        }];
        var params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_CONSUME_ITEMS,
                "items": _items
            }
        };
        this._sendCmd(params);
        return true;
    },

    // 获取每日解锁道具信息
    getRewardItems: function getRewardItems() {
        var params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_REWARD_ITEMS
            }
        };
        this._sendCmd(params);
    },
    /**
     * * 随机获取道具
     * @param {Map} map 道具概率， 默认为空
     * 
     * @return {Number} 获得的道具ID
     */
    getItemId: function getItemId() {
        var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        var ret = -1;
        // 根据概率随机道具 [道具_id,[min,max]] 范围[0,100),计算的时候[min,max)
        //new Map([[1017,[0,50]],[1018,[51,60]],[1019,[61,100]]])
        var mp = map || new Map([[1017, [0, 50]], [1018, [51, 60]], [1019, [61, 100]]]);
        var rand = parseInt(Math.random() * 100); // 随机范围 [0,100)
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = mp[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ref = _step.value;

                var _ref2 = _slicedToArray(_ref, 2);

                var k = _ref2[0];
                var v = _ref2[1];

                //[min,max)
                if (rand >= v[0] && rand < v[1]) {
                    ret = k;
                    break;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return ret;
    },

    // 添加道具 6:过关瓶子满 7 每日解锁道具
    addItems: function addItems(_reason, _index, _itemId) {
        var _map = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

        if (_reason === 6 && !_itemId) {
            _itemId = this.getItemId(_map);
            tywx.UserInfo.setItemCount(_itemId, 1);
            tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_UPDATE_BAG, tywx.UserInfo.bag);
        }
        var params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_ADD_ITEMS,
                "reason": _reason || 7,
                "itemId": _itemId || 0,
                "itemIndex": _index || 0
            }
        };
        this._sendCmd(params);
        return _itemId;
    },

    // 获取道具配置
    getStoreList: function getStoreList(_reason, _index, _itemId) {
        var params = {
            "cmd": tywx.EventType.CMD_STORE,
            "params": {
                'gameId': tywx.SystemInfo.appId,
                "action": tywx.EventType.CMD_STORE_LIST
            }
        };
        this._sendCmd(params);
    },

    // elswx#whisper_start， userId,whisperId,itemId,amount
    whisperStart: function whisperStart(_uuid, _itemId, _amount) {
        var params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_WHISPER_START,
                "whisperId": _uuid || "",
                "itemId": _itemId || [],
                "amount": _amount || 1
            }
        };
        this._sendCmd(params);
    },

    // 悄悄话通关
    /**
     * @param  {[type]} _sendUser [发送者]
     * @param  {[type]} _uuid     [悄悄话唯一标示]
     */
    // elswx#whisper_pass,   userId,shareUserId,whisperId
    whisperPass: function whisperPass(_sendUser, _uuid) {
        var params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_WHISPER_PASS,
                "shareUserId": _sendUser || 0,
                "whisperId": _uuid || ""
            }
        };
        this._sendCmd(params);
    },

    // 悄悄话被通关信息
    whisperPassInfo: function whisperPassInfo() {
        var params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_WHISPER_INFO
            }
        };
        this._sendCmd(params);
    },

    requestDailyLogin: function requestDailyLogin() {
        var params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_DAILY_LOGIN
            }
        };
        this._sendCmd(params);
    },

    getELSBag: function getELSBag() {
        var params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_ELS_BAG
            }
        };
        this._sendCmd(params);
    }

};

cc._RF.pop();