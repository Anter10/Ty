var ElsUtils = require("../core/ElsUtils.js");
var ELSEvent = require("../core/ElsEvents.js");

tywx.MSG = {

    _sendCmd: function (jsonData) {
        jsonData.params = jsonData.params || {};
        jsonData.params.userId = jsonData.params.userId || tywx.UserInfo.userId;//ty.UserInfo.userId;
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
    bindUser: function() {
        let params = {
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
    bindGame: function(gameId) {
        let params = {
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
    getUserInfo: function() {
        let params = {
            'cmd': tywx.EventType.CMD_USER_INFO,
            'params' : {
                'gameId': tywx.SystemInfo.appId
            }
        };
        this._sendCmd(params);
    },

    hallInfo: function() {
        let params = {
            'cmd': tywx.EventType.CMD_HALL_INFO,
            'params' : {
                'gameId': tywx.SystemInfo.appId
            }
        };
        this._sendCmd(params);
    },

//    {"cmd":"item5","apiVersion":5.0,"namespace":"hall5","params":{"action":"transform","userId":10018,"intClientId":23834,"gameId":9999,"sourceItemKindId":1014,"targetItemKindId":1015,"amount":3}}

    // 消耗钻石兑换商品
    hallItem5: function (_sourceItem, _targetItem, _amount) {
        let params = {
            'cmd' : tywx.EventType.CMD_ITEM,
            'params' : {
                'action' : 'transform',
                "sourceItemKindId" : _sourceItem || 1014,
                "targetItemKindId" : _targetItem,
                "amount" : _amount,
                'gameId': tywx.SystemInfo.appId
            }
        };
        this._sendCmd(params);
    },

    // 消耗钻石兑换商品
    transformProduct: function (_sourceProductId, _targetProductId, _amount) {
        let params = {
            'cmd' : tywx.EventType.CMD_ITEM,
            'params' : {
                'action' : 'product',
                "sourceProductId" : _sourceProductId || "TY20016D0000001",
                "targetProductId" : _targetProductId,
                "amount" : _amount,
                'gameId': tywx.SystemInfo.appId
            }
        };
        this._sendCmd(params);
    },

    // 获取背包
    getBagInfo: function () {
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

    getRewardInfo: function () {
        let params = {
            "apiVersion": 5.2,
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_REWARD_INFO,
            }
        };
        this._sendCmd(params);
    },

    addRewardDiamond:function (_reason, _friendUserId) {
        let params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_ADD_DIAMOND,
                "reason": _reason || 3,
                "friendUserId": _friendUserId || 0
            }
        };
        this._sendCmd(params);
    },
    
    enterGame: function (_shareUserId) {
        let params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_ENTER_GAME,
                "shareUserId": _shareUserId
            }
        };
        this._sendCmd(params);
    },

    getNextAdreward: function () {
        let params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_NEXT_ADREWARD,
            }
        };
        this._sendCmd(params);
    },

    // 同步道具
    syncItems: function (_items) {
        let params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_SYNC_ITEMS,
                "items":_items || []
            }
        };
        this._sendCmd(params);
    },

    // 消耗道具
    consumeItem: function (_kindId, _count) {
        let _kc = _count !== undefined ? -1 * _count : -1;
        if (!tywx.UserInfo.setItemCount(_kindId, _kc)) {
            return false;
        }
        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_UPDATE_BAG, tywx.UserInfo.bag);
        let _items = [{
            "itemId":_kindId,
            "count":_count || 1
        }];
        let params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_CONSUME_ITEMS,
                "items":_items
            }
        };
        this._sendCmd(params);
        return true;
    },

    // 获取每日解锁道具信息
    getRewardItems: function () {
        let params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_REWARD_ITEMS,
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
    getItemId: function(map = null){
        let ret = -1;
        // 根据概率随机道具 [道具_id,[min,max]] 范围[0,100),计算的时候[min,max)
        //new Map([[1017,[0,50]],[1018,[51,60]],[1019,[61,100]]])
        let mp = map || new Map([[1017,[0,50]],[1018,[51,60]],[1019,[61,100]]]);
        let rand = parseInt(Math.random() * 100); // 随机范围 [0,100)
        for( let [k,v] of mp){
            //[min,max)
            if(rand >= v[0] && rand < v[1]){
                ret = k;
                break;
            }
        }
        return ret;
    },

    // 添加道具 6:过关瓶子满 7 每日解锁道具
    addItems:function (_reason, _index, _itemId, _map = null) {
        if (_reason === 6 && !_itemId) {
            _itemId = this.getItemId(_map);
            tywx.UserInfo.setItemCount(_itemId, 1);
            tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_UPDATE_BAG, tywx.UserInfo.bag);
        }
        let params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_ADD_ITEMS,
                "reason": _reason || 7,
                "itemId": _itemId || 0,
                "itemIndex":_index || 0
            }
        };
        this._sendCmd(params);
        return _itemId;
    },

    // 获取道具配置
    getStoreList:function (_reason, _index, _itemId) {
        let params = {
            "cmd": tywx.EventType.CMD_STORE,
            "params": {
                'gameId': tywx.SystemInfo.appId,
                "action": tywx.EventType.CMD_STORE_LIST,
            }
        };
        this._sendCmd(params);
    },

    // elswx#whisper_start， userId,whisperId,itemId,amount
    whisperStart:function (_uuid, _itemId, _amount) {
        let params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_WHISPER_START,
                "whisperId": _uuid || "",
                "itemId": _itemId || [],
                "amount": _amount || 1,
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
    whisperPass:function (_sendUser, _uuid) {
        let params = {
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
    whisperPassInfo:function () {
        let params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_WHISPER_INFO,
            }
        };
        this._sendCmd(params);
    },

    requestDailyLogin:function(){
        let params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_DAILY_LOGIN
            }
        };
        this._sendCmd(params);
    },

    getELSBag:function(){
        let params = {
            "cmd": tywx.EventType.CMD_ELSWX,
            "params": {
                "action": tywx.EventType.CMD_ACTION_ELS_BAG
            }
        };
        this._sendCmd(params);
    },

};