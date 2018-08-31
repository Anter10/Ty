let events = require('./open_data_config.js').events;
let CloudKeys = require('./open_data_config.js').CloudDataKey;
const _shareCanvas = wx.getSharedCanvas().getContext('2d');
var canvas = wx.getSharedCanvas();
let orwidth = canvas.width;
let orheight = canvas.height;
let _friendCloudDatas = null;
let _groupfriendCloudDatas = null;
let _selfCloudDatas = null;
let _selfUserInfo = null;
//  玩家发送给子域的数据类型
var prePersonIconUrl = null;

// 预先加载本地的图片
let bottom = wx.createImage()
bottom.src = 'image/yjjx.png'
 

/**
 * 根据给定的好友数据 判断当前数据属性是否是自己
 * @param {*} lhr  
 * @param {*} rhr 
 */
function isMySelf(lhr, rhr) {
    return lhr.nickname === rhr.nickName && lhr.avatarUrl === rhr.avatarUrl;
}


/**
 * 先算出整个字符串的长度， 并获得第length - 2 个字符串的位置， 给 ".."
 留2个位置
 * @param {String} str 被截取的字符串
 * @param {*} length 截取的长度
 */
function stringSlice(str, length) {
    if (!str) {
        return str;
    }
    var len = 0;
    var tmp = 0;
    var s;
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            tmp += 1;
        } else { // 如果是中文则长度加2
            tmp += 2;
        }
        if (tmp <= length - 2) {
            len++;
        }
    }
    if (tmp <= length) {
        s = str.slice(0);
    } else {
        s = str.slice(0, len);
        s += "..";
    }
    return s;
}

/**
 * 请求好友数据和自己的数据
 * 参数: 无
 */
function loadData() {
    //* 好友数据
    console.log("开始请求好友数据");
    wx.getFriendCloudStorage({
        keyList: [CloudKeys.x1],
        success: result => {
            _friendCloudDatas = result.data;
            console.log("当前请求下来的数据" + JSON.stringify(_friendCloudDatas));
            _friendCloudDatas.sort((a, b) => {
                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                    return 0;
                }
                if (a.KVDataList.length == 0) {
                    return 1;
                }
                if (b.KVDataList.length == 0) {
                    return -1;
                }
                return b.KVDataList[0].value - a.KVDataList[0].value;
            });
        },
        fail: err => {
            console.log("当前请求下来的数据21212" + JSON.stringify(err));
        }
    });
    //* 自己的数据
    wx.getUserCloudStorage({
        keyList: [CloudKeys.x1],
        success: result => {
            console.log('获取自己的数据', result);
            _selfCloudDatas = result;
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                lang: 'zh_CN',
                success: function (params) {
                    console.log('OpenRegion | getUserInfo | success | ' + JSON.stringify(params));
                    _selfUserInfo = params.data[0];
                },
                fail: function (params) {
                    console.log('OpenRegion | getUserInfo | fail | ' + JSON.stringify(params));
                }
            });
        }
    });
}
/**
 * @description 获取群数据
 * @author lu ning
 * @date 2018-08-24
 * @param {String} share_ticket 群标识
 * @param {Function} success_cb 成功回调
 */
function loadGroupCloudDataByShareTicket(share_ticket, success_cb) {
    wx.getGroupCloudStorage({
        shareTicket: share_ticket,
        keyList: CloudKeys.keys(),
        success: result => {
            success_cb(result);
        }
    });
}
/**
 * @description 绘制图片
 * @author lu ning
 * @date 2018-08-24
 * @param {String} url
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @param {Function} [callback=null] 回调函数
 */
function drawImage(url, x, y, w, h, callback = null) {
    let img = wx.createImage();

    console.log("刷图url= " + url);
    img.onload = event => {
        let t_img = event.target;
        _shareCanvas.drawImage(t_img, x, y, w, h);
        console.log("创建成功");
        callback && callback();
    };
    img.src = url;
}

/**
 * @description 绘制文本
 * @author lu ning
 * @date 2018-08-24
 * @param {String} str
 * @param {Number} x
 * @param {Number} y
 */
function drawText(str, x, y) {
    _shareCanvas.fillText(str, x, y);
};


/**
 * @description 绘制超越好友
 * @author lu ning
 * @date 2018-08-29
 * @param {*} score
 * @param {*} x
 * @param {*} y
 * @param {*} width
 */
function drawThanFriend(score, x, y, width) {
    // canvas.width = 311;
    // canvas.height = 111;

    _shareCanvas.clearRect(0, 0, 32222, 3222)
    var frdata = null;
    //console.log("canvaswid" + canvas.width + "canvasheight" + canvas.height +
    //    "好友数据 = " + JSON.stringify(_friendCloudDatas));
    for (let i = _friendCloudDatas.length - 1; i >= 0; i--) {
        var tdata = _friendCloudDatas[i];
        var fscore = tdata.KVDataList[0] == null ? 0 : tdata.KVDataList[0].value;
        var chazhi = fscore - score;

        if (chazhi > 0 && !isMySelf(tdata, _selfUserInfo)) {
            frdata = tdata;
            frdata.score = fscore;
            // prePersonIconUrl = tdata.avatarUrl;
            break;
        }
    }

    console.log("x =" + x + "y= " + y + "当前是否存储2 " + JSON.stringify(frdata)); // prePersonIconUrl != tdata.avatarUrl &&
    // 如果有玩家的分数大于自己的 则显示
    if (frdata) {
        y = 0;
        x = 0;

        let [w, h] = [canvas.width, canvas.height];

        // let bg_img = 'image/yjjx.png';
        // drawImage(bg_img, 0, 0, w, h);
        _shareCanvas.drawImage(bottom, 0, 0, w, h);
        let padding_x = 10;
        let padding_y = 17;

        x += padding_x;
        y = padding_y;
        drawImage(frdata.avatarUrl, x + 125, y, 65, 65);

        _shareCanvas.fillStyle = "#ffffff";
        _shareCanvas.font = "25px Arial";
        _shareCanvas.textAlign = 'left';
        x = 8;
        _shareCanvas.fillText('即将超越', x, 32);
        y += 32 / 2 + 28 / 2 + 7;
        drawText(stringSlice(frdata.nickname, 11), x, 32 + 30);
        _shareCanvas.fillStyle = "#FFD700";
        _shareCanvas.font = "28px Arial";
        y += 28 + 5;
        drawText(stringSlice(frdata.score, 11), x, 32 + 30 + 30);

    }
}


/**
 * 根据玩家数据 绘制排行榜
 * @param {Array}} drawdata 
 */
function drawFriendRank(drawdata) {
    if (!drawdata) {
        return;
    }

    _shareCanvas.clearRect(0, 0, 32222, 3222);
    var curbzcount = 3;

    function drawItem(data, index, posi) {
        console.log('drawItem', index, data);
        let [x, y, w, h] = [60, 100 * posi, 635, 100];
        console.log('drawItem', x, y);
        let padding_x = 5;
        let label_y = y + h * 0.6 - 10;
        let avatar_y = y;
        let bottom_y = y + h - 10;

        //y += h / 2;
        // * rank label
        console.log("当前的绘制数据 = " + JSON.stringify(data));
        if (index < curbzcount) {
            if (index == 0) {
                if (data.pm < 3) {
                    drawImage("image/phb" + (data.pm + 1) + ".png", x - 26, avatar_y - 1, 58, 78);
                } else {
                    _shareCanvas.fillStyle = "#6495ED";
                    _shareCanvas.font = "28px Arial";
                    _shareCanvas.textAlign = 'left';
                    _shareCanvas.fillText(`` + data.pm, x, label_y);
                }
            } else {
                drawImage("image/phb" + (index) + ".png", x - 26, avatar_y - 1, 58, 78);
            }
        } else {
            _shareCanvas.fillStyle = "#6495ED";
            _shareCanvas.font = "28px Arial";
            _shareCanvas.textAlign = 'left';
            _shareCanvas.fillText(`` + index, x, label_y);
        }
        // * avatar
        x += 60;
        setTimeout(() => {
            console.log("惺惺相惜 = " + x);
            drawImage(data.avatarUrl, 130, avatar_y + 5, 65, 65);
        }, index * 400);
        // * name label
        x += 120;
        _shareCanvas.fillStyle = "#6495ED";
        _shareCanvas.font = "28px Arial";
        _shareCanvas.textAlign = 'left';
        _shareCanvas.fillText(`` + data.nickname, x, label_y);
        // * score label
        x += 240;
        _shareCanvas.fillStyle = "#FF8C00";
        _shareCanvas.font = "28px Arial";
        _shareCanvas.textAlign = 'left';
        data.KVDataList.forEach(e => {
            console.log('kvdatalist', e);
            if (e.key === CloudKeys.x1) {
                _shareCanvas.fillText(e.value + '分', x, label_y);
            }
        });
        // * bottom line 
        x = 0;
        drawImage('image/line.png', x + 30, bottom_y - 4, 580, 4);
    }

    function isHaveDataByKey(data_list, key) {
        let ret = false;
        data_list.forEach(data => {
            if (data.key === key) {
                ret = true;
                return ret;
            }
        });
        return ret;
    }
    let self_data = {
        nickname: _selfUserInfo.nickName,
        avatarUrl: _selfUserInfo.avatarUrl,
        KVDataList: _selfCloudDatas.KVDataList
    };

    var hasfindself = false;
    var findindex = -1;
    for (var tindex = 0; tindex < drawdata.length; tindex++) {
        if (hasfindself == false && drawdata[tindex].avatarUrl == _selfUserInfo.avatarUrl) {
            self_data.pm = tindex;
            if (tindex < 3) {
                curbzcount = 4;
            }
            break;
        }
    }
    let render_idx = 0;
    if (isHaveDataByKey(self_data.KVDataList, CloudKeys.x1)) {
        drawItem(self_data, 0, 0);

        render_idx++;
    }
    var findself = false;
    drawdata.forEach((data, index) => {
        if (index + 1 > 21) return;
        if (isHaveDataByKey(data.KVDataList, CloudKeys.x1)) {

            if (render_idx == 0) {
                drawItem(data, index + 1, index);
            } else {
                if (index == self_data.pm) {
                    //    drawItem(data, index, index + 1);
                } else if (index > self_data.pm) {
                    drawItem(data, index + 1, index);
                } else if (index < self_data.pm) {
                    drawItem(data, index + 1, index + 1);
                }
            }
        }
    });


}


/**
 * 得到群组的的好友数据 用于显示群组排行榜使用
 * tshareTicket: String 群组的shareticketID
 */
getGroupFriendData = function (tshareTicket) {
    var shareTicket = tshareTicket;
    wx.getUserInfo({
        openIdList: ['selfOpenId'],
        success: (userRes) => {
            //  Log('success', userRes.data)
            let userData = userRes.data[0];
            //取出所有好友数据
            wx.getGroupCloudStorage({
                shareTicket: shareTicket,
                keyList: [CloudKeys.x1],
                success: res => {
                    let data = res.data;
                    data.sort((a, b) => {
                        if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                            return 0;
                        }
                        if (a.KVDataList.length == 0) {
                            return 1;
                        }
                        if (b.KVDataList.length == 0) {
                            return -1;
                        }
                        return b.KVDataList[0].value - a.KVDataList[0].value;
                    });
                    _groupfriendCloudDatas = data;
                    // 绘制群排行的玩家数据
                    drawFriendRank(_groupfriendCloudDatas);
                },
                fail: res => {
                    //  Log("得到群组数据失败", res);
                    // this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                },
            });
        },
        fail: (res) => {
            // this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
        }
    });
}


/**
 * 处理主域给子域发送的消息
 * data: type: Object 主域给子域发送的数据
 */
wx.onMessage(data => {
    console.log("当前传进来的消息数据 = " + JSON.stringify(data));
    if (data.method === events.LOAD_DATA) {
        loadData();
    } else if (data.method == events.friends) {
        drawFriendRank(_friendCloudDatas);
    } else if (data.method == events.group) {
        getGroupFriendData(data.shareTicket);
    } else if (data.method == events.storefris) {
        drawThanFriend(data.score, data.x, data.y, data.width)
    }
});


