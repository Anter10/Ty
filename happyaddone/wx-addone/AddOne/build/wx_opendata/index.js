let events = require('./open_data_config.js').events;
let CloundKeys = require('./open_data_config.js').CloudDataKey;
const _shareCanvas = wx.getSharedCanvas().getContext('2d');
var canvas = wx.getSharedCanvas();
let orwidth = canvas.width;
let orheight = canvas.height;
let _friendCloudDatas = null;
let _selfCloudDatas = null;
let _selfUserInfo = null;
//  玩家发送给子域的数据类型
var prePersonIconUrl = null;
let bottom = wx.createImage()
bottom.src = 'image/yjjx.png'

function getShareCanvas() {
    return wx.getSharedCanvas();
}

function loadData() {
    //* 好友数据
    console.log("开始请求好友数据");
    wx.getFriendCloudStorage({
        keyList: ["x1"],
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
        keyList: ["x1"],
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
        keyList: CloundKeys.keys(),
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
 * @description 超越好友
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
    var frdata = null;
    console.log("canvaswid" + canvas.width + "canvasheight" + canvas.height +
        "好友数据 = " + JSON.stringify(_friendCloudDatas));
    for (let i = _friendCloudDatas.length - 1; i >= 0; i--) {
        var tdata = _friendCloudDatas[i];
        var fscore = tdata.KVDataList[0] == null ? 0 : tdata.KVDataList[0].value;
        var chazhi = fscore - score;

        if (chazhi > 0) {
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
        drawText(stringSlice(frdata.nickname, 11), x, y);
        _shareCanvas.fillStyle = "#FFD700";
        _shareCanvas.font = "28px Arial";
        y += 28 + 5;
        drawText(stringSlice(frdata.score, 11), x, y);

    }
}

function drawFriendRank() {
    function drawItem(data, index) {
        console.log('drawItem', index, data);
        let [x, y, w, h] = [40, 100 * index, 635, 100];
        console.log('drawItem', x, y);
        let padding_x = 5;
        let label_y = y + h * 0.6 - 10;
        let avatar_y = y;
        let bottom_y = y + h - 10;

        //y += h / 2;
        // * rank label
        if (index < 3) {
            drawImage("image/phb" + (index + 1) + ".png", x - 26, avatar_y - 1, 58, 78);
        } else {
            _shareCanvas.fillStyle = "#6495ED";
            _shareCanvas.font = "25px Arial";
            _shareCanvas.textAlign = 'left';
            _shareCanvas.fillText(`` + index, x, label_y);
        }
        // * avatar
        x += 60;
        drawImage(data.avatarUrl, x, avatar_y, 65, 65);
        // * name label
        x += 150;
        _shareCanvas.fillStyle = "#6495ED";
        _shareCanvas.font = "25px Arial";
        _shareCanvas.textAlign = 'left';
        _shareCanvas.fillText(`` + data.nickname, x, label_y);
        // * score label
        x += 240;
        _shareCanvas.fillStyle = "#FF8C00";
        _shareCanvas.font = "25px Arial";
        _shareCanvas.textAlign = 'left';
        data.KVDataList.forEach(e => {
            console.log('kvdatalist', e);
            if (e.key === 'x1') {
                _shareCanvas.fillText(e.value + '分', x, label_y);
            }
        });
        // * bottom line 
        x = 0;
        drawImage('image/line.png', x + 30, bottom_y - 4, 580, 4);
    }
    let self_data = {
        nickname: _selfUserInfo.nickName,
        avatarUrl: _selfUserInfo.avatarUrl,
        KVDataList: _selfCloudDatas.KVDataList
    };
    drawItem(self_data, 0);
    _friendCloudDatas.forEach((data, index) => {
        if (index + 1 > 21) return;
        drawItem(data, index + 1);

    });


}


wx.onMessage(data => {
    console.log("当前传进来的消息数据 = " + JSON.stringify(data));
    if (data.method === events.LOAD_DATA) {
        // * 加载数据
        loadData();
    } else if (data.method == events.friends) {
        // self.titleLabel.string = "  好友排行榜";
        // self.getFriendData();
        drawFriendRank();
    } else if (data.method == events.group) {
        // self.titleLabel.string = "群组排行榜";
        // self.getGroupFriendData(data.shareTicket);
    } else if (data.method == events.userinfo) {
        // self.getUserInfoData();
    } else if (data.method == events.submitscore) {
        // self.submitScore(data.score);
    } else if (data.method == events.storefris) {
        // self.storeFriends(data.score, data.isrestart);
        drawThanFriend(data.score, data.x, data.y, data.width)
    } else if (data.method == events.hideUi) {
        // self.hideUi(data.rank, data.friendicon);
    }
});

//先算出整个字符串的长度，并获得第length - 2个字符串的位置，给".."留2个位置
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

function isMySelf(lhr, rhr) {
    return lhr.nickname === rhr.nickName && lhr.avatarUrl === rhr.avatarUrl;
};