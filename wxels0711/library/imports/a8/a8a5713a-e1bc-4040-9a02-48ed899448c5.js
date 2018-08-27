"use strict";
cc._RF.push(module, 'a8a57E64bxAQJoCSO2JlEjF', 'TCPClient');
// script/CommonFrame/TCPClient.js

'use strict';

/**
 * 微信小程序下TCP长连接使用websocket实现
 */

tywx.TCPClient = {
    TAG: "TCP client",
    CONNECT_STATUS_OK: 1,
    CONNECT_STATUS_OPENING: 2,
    CONNECT_STATUS_CLOSING: 3,
    CONNECT_STATUS_FAIL: 0,
    connectStatus: 0,
    isTimerInited: false,
    tickCount: 0,
    filterCmds: ['heart_beat'],
    MaxErrCount: 5,

    /**
     * 该方法包含了心跳和tcp状态检查两项功能,结合connect中的逻辑,是一个无限重试的机制
     */
    timerSchedule: function timerSchedule() {
        tywx.TCPClient.tickCount = (tywx.TCPClient.tickCount + 1) % 3;
        if (tywx.TCPClient.tickCount == 2 && tywx.TCPClient.connectStatus == tywx.TCPClient.CONNECT_STATUS_OK) {
            //每3秒发送心跳
            tywx.TCPClient.updateHeartBeat();
            //监听者进行具体的协议实现
            tywx.NotificationCenter.trigger(tywx.EventType.SEND_HEART_BEAT);
        }

        // 每1秒检查一下长连接，如果不通，则重连。
        tywx.TCPClient.reconnet();
    },

    updateHeartBeat: function updateHeartBeat() {
        var cmd = {
            'cmd': 'heart_beat',
            'params': {
                'action': 'heartbeat',
                'deviceId': tywx.SystemInfo.uuid, //tywx.Util.getLocalUUID(),
                'userId': tywx.UserInfo.userId,
                'gameId': tywx.SystemInfo.appId,
                'clientId': tywx.SystemInfo.clientId
            }
        };
        console.log('updateHeartBeat .. ');
        tywx.MSG._sendCmd(cmd);
    },

    startCheckTimer: function startCheckTimer() {
        tywx.TCPClient.isTimerInited = true;
        tywx.Timer.setTimer(cc.director, this.timerSchedule, 1);
    },

    stopCheckTimer: function stopCheckTimer() {
        tywx.TCPClient.isTimerInited = false;
        tywx.Timer.cancelTimer(cc.director, this.timerSchedule);
    },

    //以下为websocket连接相关方法
    connect: function connect(url) {
        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeTCPStart, [url]);
        if (tywx.TCPClient.connectStatus == tywx.TCPClient.CONNECT_STATUS_OPENING || tywx.TCPClient.connectStatus == tywx.TCPClient.CONNECT_STATUS_OK) {
            return;
        }

        tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_OPENING;
        if (tywx.IsWechatPlatform()) {
            this.doWechatConnect(url);
        }
    },

    doWechatConnect: function doWechatConnect(url) {
        if (!tywx.IsWechatPlatform()) {
            return;
        }
        wx.connectSocket({
            url: url
        });

        wx.onSocketOpen(function (res) {
            console.log(tywx.TCPClient.TAG, 'TCP webSocket opened...');
            tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_OK;

            tywx.NotificationCenter.trigger(tywx.EventType.TCP_OPENED);
            tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeTCPSuccess, [url]);
            if (!tywx.TCPClient.isTimerInited) {
                //启动TCP的定时检查机制,成功连接1次后将永久进行检查
                tywx.TCPClient.startCheckTimer();
            }
        });

        wx.onSocketError(function (res) {
            console.log(tywx.TCPClient.TAG, 'TCP webSocket error...');
            tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeTCPFailed, [url]);

            tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_FAIL;
            tywx.NotificationCenter.trigger(tywx.EventType.TCP_ERROR);
            if (!tywx.TCPClient.isTimerInited) {
                //启动TCP的定时检查机制,成功连接1次后将永久进行检查
                tywx.TCPClient.startCheckTimer();
            }
        });

        wx.onSocketClose(function (res) {
            console.log(tywx.TCPClient.TAG, 'WebSocket 已关闭！');
            tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_FAIL;
            tywx.NotificationCenter.trigger(tywx.EventType.TCP_CLOSE);
            if (!tywx.TCPClient.isTimerInited) {
                //启动TCP的定时检查机制,成功连接1次后将永久进行检查
                tywx.TCPClient.startCheckTimer();
            }
        });

        wx.onSocketMessage(function (res) {
            if (!tywx.StateInfo.isOnForeground) {
                var content = tywx.TCPClient.decodeMessage(res["data"]);
                console.log("tcp ... ", content);
                //在后台不处理消息
                return;
            }
            // 处理长连接的消息
            var content = tywx.TCPClient.decodeMessage(res["data"]);
            if (content == null || content == '0000') {
                return;
            }

            var msgStr = "[Receive TCP Msg]: " + unescape(content.replace(/\\u/gi, '%u'));
            var strJson = content.substr(0, content.length - 0);
            if (strJson != null && strJson.length > 0) {
                var _json = JSON.parse(strJson);
                if (tywx.TCPClient.filterCmds.indexOf(_json.cmd) == -1) {
                    console.log(tywx.TCPClient.TAG, msgStr);
                }
                console.log("msgStr" + msgStr);
                tywx.NotificationCenter.trigger(tywx.EventType.TCP_RECEIVE, _json);
            }
        });
    },

    decodeMessage: function decodeMessage(data) {
        if (typeof ArrayBuffer != 'undefined' && data instanceof ArrayBuffer) {
            var databytes = new Uint8Array(data);
            var content = '';
            for (var i = 0, len = databytes.length; i < len; i++) {
                var tmpc = String.fromCharCode(databytes[i]);
                content += tmpc;
            }
            return content;
        }
        var data = tywx.EncodeDecode.base64Decode(data);
        var mask = data.slice(0, 4);
        data = data.slice(4);
        for (var i = 0, len = data.length; i < len; i++) {
            var charcode = data[i];
            charcode ^= mask[i % 4];
            data[i] = charcode;
        }
        var result = tywx.EncodeDecode.utf8Decode(data);
        return result;
    },

    reconnet: function reconnet() {
        if (!tywx.StateInfo.isOnForeground) {
            //在后台不重连(IOS会出问题)
            return;
        }
        if (tywx.TCPClient.connectStatus == tywx.TCPClient.CONNECT_STATUS_FAIL || tywx.TCPClient.connectStatus == tywx.TCPClient.CONNECT_STATUS_CLOSING) {
            tywx.NotificationCenter.trigger(tywx.EventType.TCP_RECONNECT);
            tywx.TCPClient.connect(tywx.SystemInfo.webSocketUrl);
        }
    },

    sendMsg: function sendMsg(data) {
        if (tywx.TCPClient.connectStatus != tywx.TCPClient.CONNECT_STATUS_OK) {
            return;
        }

        var msgStr = JSON.stringify(data);
        if (tywx.TCPClient.filterCmds.indexOf(data.cmd) == -1) {
            console.log(tywx.TCPClient.TAG, 'TCP sendMsg:' + msgStr);
        }

        if (tywx.IsWechatPlatform()) {
            wx.sendSocketMessage({
                data: msgStr,
                success: function success(params) {
                    if (tywx.TCPClient.filterCmds.indexOf(data.cmd) == -1) {
                        console.log(tywx.TCPClient.TAG, 'TCP sendMsg success:' + JSON.stringify(arguments));
                    }
                },

                fail: function fail(params) {
                    var errMsg = arguments[0];
                    if (errMsg && errMsg['errMsg'] === 'sendSocketMessage:fail taskID not exist') {
                        wx.closeSocket();
                        tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_FAIL;
                    }
                    console.log(tywx.TCPClient.TAG, 'TCP sendMsg fail:' + JSON.stringify(arguments));
                },

                complete: function complete(params) {}
            });
        }
    },

    close: function close() {
        tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_CLOSING;
        if (tywx.IsWechatPlatform()) {
            wx.closeSocket();
        }
        tywx.TCPClient.stopCheckTimer();
        console.log(tywx.TCPClient.TAG, 'TCP close..............');
    }
};

cc._RF.pop();