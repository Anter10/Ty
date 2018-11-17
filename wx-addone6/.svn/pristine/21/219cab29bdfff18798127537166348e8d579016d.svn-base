/**
 * 微信小程序下TCP长连接使用websocket实现
 */

ty.TCPClient = {
    TAG : "TCP client",
    CONNECT_STATUS_OK : 1,
    CONNECT_STATUS_OPENING : 2,
    CONNECT_STATUS_CLOSING : 3,
    CONNECT_STATUS_FAIL : 0,
    connectStatus : 0,
    isTimerInited : false,
    tickCount : 0,
    filterCmds : ['heart_beat'],

    /**
     * 该方法包含了心跳和tcp状态检查两项功能,结合connect中的逻辑,是一个无限重试的机制
     */
    timerSchedule : function() {
        ty.TCPClient.tickCount = (ty.TCPClient.tickCount + 1) % 3;
        if (ty.TCPClient.tickCount == 2 && ty.TCPClient.connectStatus == ty.TCPClient.CONNECT_STATUS_OK) {
            //每3秒发送心跳
            //hall.MsgFactory.sendHeartBeat();
            //监听者进行具体的协议实现
            ty.NotificationCenter.trigger(ty.EventType.SEND_HEART_BEAT);
        }

        // 每1秒检查一下长连接，如果不通，则重连。
        ty.TCPClient.reconnet();
    },

    startCheckTimer: function() {
        ty.TCPClient.isTimerInited = true;
        ty.Timer.setTimer(cc.director, this.timerSchedule, 1);
    },

    stopCheckTimer: function() {
        ty.TCPClient.isTimerInited = false;
        ty.Timer.cancelTimer(cc.director, this.timerSchedule);
    },

    //以下为websocket连接相关方法
    connect: function(url){
        ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeTCPStart, [url]);
        if (ty.TCPClient.connectStatus == ty.TCPClient.CONNECT_STATUS_OPENING
            || ty.TCPClient.connectStatus == ty.TCPClient.CONNECT_STATUS_OK) {
            return;
        }

        ty.TCPClient.connectStatus = ty.TCPClient.CONNECT_STATUS_OPENING;
        if(ty.IsWechatPlatform()) {
            this.doWechatConnect(url);
        }
    },

    doWechatConnect: function(url) {
        try{
            if(!ty.IsWechatPlatform()) {
                return;
            }
            wx.connectSocket({
                url: url
            });

            wx.onSocketOpen(function(res) {
                ty.LOGD(ty.TCPClient.TAG, 'TCP webSocket opened...');
                ty.TCPClient.connectStatus = ty.TCPClient.CONNECT_STATUS_OK;

                ty.NotificationCenter.trigger(ty.EventType.TCP_OPENED);
                ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeTCPSuccess, [url]);
                if (!ty.TCPClient.isTimerInited) {
                    //启动TCP的定时检查机制,成功连接1次后将永久进行检查
                    ty.TCPClient.startCheckTimer();
                }
            });

            wx.onSocketError(function(res) {
                ty.LOGD(ty.TCPClient.TAG, 'TCP webSocket error...');
                ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeTCPFailed, [url]);

                ty.TCPClient.connectStatus = ty.TCPClient.CONNECT_STATUS_FAIL;
                ty.NotificationCenter.trigger(ty.EventType.TCP_ERROR);
            });


            wx.onSocketClose(function(res) {
                ty.LOGD(ty.TCPClient.TAG, 'WebSocket 已关闭！');
                ty.TCPClient.connectStatus = ty.TCPClient.CONNECT_STATUS_FAIL;
                ty.NotificationCenter.trigger(ty.EventType.TCP_CLOSE);
            });

            wx.onSocketMessage(function(res) {
                if (!ty.StateInfo.isOnForeground){
                    //在后台不处理消息
                    return;
                }
                // 处理长连接的消息
                var content = ty.TCPClient.decodeMessage(res["data"]);
                if (content == null || content == '0000') {
                    return;
                }

                var msgStr = "[Receive TCP Msg]: " + unescape(content.replace(/\\u/gi,'%u'));
                var strJson = content.substr(0, content.length - 0);
                if (strJson != null && strJson.length > 0) {
                    var _json = JSON.parse(strJson);
                    if (ty.TCPClient.filterCmds.indexOf(_json.cmd) == -1){
                        ty.LOGD(ty.TCPClient.TAG, msgStr);
                    }

                    ty.NotificationCenter.trigger(ty.EventType.TCP_RECEIVE, _json);
                }

            });
        }
        catch(err) {
            ty.LOGE("error:", "ty.TCPClient.doWechatConnect——" + JSON.stringify(err));
        }
    },

    decodeMessage: function(data) {
        if (typeof ArrayBuffer != 'undefined' && data instanceof ArrayBuffer) {
            var databytes = new Uint8Array(data);
            var content = ''
            for (var i = 0, len = databytes.length; i < len; i++) {
                var tmpc = String.fromCharCode(databytes[i]);
                content += tmpc;
            }
            return content;
        }
        var data = ty.EncodeDecode.base64Decode(data);
        var mask = data.slice(0, 4);
        data = data.slice(4);
        for (var i = 0, len = data.length; i < len; i++) {
            var charcode = data[i];
            charcode ^= mask[i % 4];
            data[i] = charcode;
        }
        var result = ty.EncodeDecode.utf8Decode(data);
        return result;
    },

    reconnet:function () {
        if (!ty.StateInfo.isOnForeground){
            //在后台不重连(IOS会出问题)
            return;
        }
        if (ty.TCPClient.connectStatus == ty.TCPClient.CONNECT_STATUS_FAIL) {
            ty.NotificationCenter.trigger(ty.EventType.TCP_RECONNECT);
            ty.TCPClient.connect(ty.SystemInfo.webSocketUrl);
        }
    },

    sendMsg: function(data) {
        try {
            if (ty.TCPClient.connectStatus != ty.TCPClient.CONNECT_STATUS_OK) {
                return;
            }

            var msgStr = JSON.stringify(data);
            if (ty.TCPClient.filterCmds.indexOf(data.cmd) == -1){
                ty.LOGD(ty.TCPClient.TAG, 'TCP sendMsg:' + msgStr);
            }

            if(ty.IsWechatPlatform()) {
                wx.sendSocketMessage({
                    data:msgStr,
                    success: function(params){
                        ty.LOGD(ty.TCPClient.TAG, 'TCP sendMsg success:' + JSON.stringify(params));
                    },

                    fail: function(params) {
                        var errMsg = params[0];
                        if (errMsg && errMsg['errMsg'] === 'sendSocketMessage:fail taskID not exist'){
                            wx.closeSocket();
                            ty.TCPClient.connectStatus = ty.TCPClient.CONNECT_STATUS_FAIL;
                        }
                        ty.LOGD(ty.TCPClient.TAG, 'TCP sendMsg fail:' + JSON.stringify(arguments));
                    },

                    complete: function(params) {
                    }
                });
            }
        }
        catch(err) {
            ty.LOGE("error:", "ty.TCPClient.sendMsg——" + JSON.stringify(err));
        }
    },

    close: function(){
        try {
            ty.TCPClient.connectStatus = ty.TCPClient.CONNECT_STATUS_CLOSING;
            if(ty.IsWechatPlatform()) {
                wx.closeSocket();
            }
            ty.TCPClient.stopCheckTimer();
            ty.LOGD(ty.TCPClient.TAG, 'TCP close..............');
        }
        catch(err) {
            ty.LOGE("error:", "ty.TCPClient.close——" + JSON.stringify(err));
        }
    }
};
