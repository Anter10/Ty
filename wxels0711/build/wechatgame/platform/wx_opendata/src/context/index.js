var cachedChallengeData = undefined;
var cachedClassicData = undefined;
var myUserData = undefined;

var PLAYER_TITLE2 = [
    [1, '青铜初级'],
    [2, '青铜中级'],
    [3, '青铜高级'],
    [3, '白银初级'],
    [3, '白银中级'],
    [3, '白银高级'],
    [4, '黄金初级'],
    [4, '黄金中级'],
    [4, '黄金高级'],
    [5, '铂金初级'],
    [5, '铂金中级'],
    [5, '铂金高级'],
    [6, '钻石初级'],
    [6, '钻石中级'],
    [6, '钻石高级'],
    [7, '星耀初级'],
    [7, '星耀中级'],
    [7, '星耀高级'],
    [10000000, '方块传奇']
];

wx.onMessage(function (data) {

    if (data.method === "drawQQHIn") {
        _drawQQHIn(data.data);
        return;
    }

    if (data.method === "cleanOpenData") {
        _cleanOpenData();
        return;
    }

    if (data.method === "showQQHWin") {
        _drawQQHWin(data.data);
        return;
    }

    if (data.method === "showBeyond") {
        _showBeyond(data.data);
        return;
    }

    if (data.method === "getFriendCloudStorage") {
        var keys = data.types;
        wx.getFriendCloudStorage({
            keyList: keys,
            success: function (result) {
                //console.log('OpenRegion | getFriendCloudStorage | success | ' + JSON.stringify(result));
                console.log('OpenRegion | getFriendCloudStorage | success | ');
                var sharedCanvas = wx.getSharedCanvas();
                var context = sharedCanvas.getContext("2d");
                context[data.data.method_id] = {
                    data: result.data,
                    status: true
                }
            },
            fail: function (params) {
                var sharedCanvas = wx.getSharedCanvas();
                var context = sharedCanvas.getContext("2d");
                context[data.data.method_id] = {
                    data: params,
                    status: false
                }
            },
            complete: function () {
            }
        });
        return;
    }

    if (data.method == "getUserInfo") {
        console.log("getUserInfo 111");
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            lang: 'zh_CN',
            success: function (params) {
                console.log('OpenRegion | getUserInfo | success | ' + JSON.stringify(params));
                myUserData = params.data[0];
                var sharedCanvas = wx.getSharedCanvas();
                var context = sharedCanvas.getContext("2d");
                context[data.data.method_id] = {
                    data: params.data,
                    status: true
                }
            },
            fail: function (params) {
                console.log('OpenRegion | getUserInfo | fail | ' + JSON.stringify(arguments));
                var sharedCanvas = wx.getSharedCanvas();
                var context = sharedCanvas.getContext("2d");
                context[data.data.method_id] = {
                    data: params,
                    status: false
                }
            }
        });
        return;
    }
    _drawWaitting();
    var command = data.method;
    if (myUserData == undefined) {
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: function (result) {
                myUserData = result.data[0];
                myUserData.nickname = myUserData.nickName;
                _handleDrawCommand(command);
            },
            fail: function () {
                _drawError();
            }
        })
    }
    else {
        setTimeout(function () {
            _handleDrawCommand(command);
        }, 1000);
    }
});

var _handleDrawCommand = function (command) {
    if (command == 'drawRankChallenge') {
        //_collectRankData('ELS_CURRENT_STAGE', function (succ, data) {
        _collectRankData('ELS_PKSTAR', function (succ, data) {
            if (succ) {
                cachedChallengeData = data;
                _drawWithData(command, data, true, false);
            }
            else {
                if (cachedChallengeData === undefined) {
                    _drawError();
                }
                else {
                    _drawWithData(command, cachedChallengeData, true, false);
                }
            }
        });
    }
    else if (command == 'drawRankClassic') {
        //_collectRankData('ELS_CURRENT_CLASSIC_SCORE', function (succ, data) {
        _collectRankData('ELS_CURRENT_STAGE2', function (succ, data) {
            if (succ) {
                cachedClassicData = data;
                _drawWithData(command, data, false, false);
            }
            else {
                if (cachedClassicData === undefined) {
                    _drawError();
                }
                else {
                    _drawWithData(command, cachedClassicData, false, false);
                }
            }
        });
    } else if (command === 'ELS_RECV_PRIVE') { // 魅力榜
        _collectRankData('ELS_RECV_PRIVE', function (succ, data) {
            if (succ) {
                cachedClassicData = data;
                _drawWithData(command, data, false, true);
            }
            else {
                if (cachedClassicData === undefined) {
                    _drawError();
                }
                else {
                    _drawWithData(command, cachedClassicData, false, true);
                }
            }
        });
    } else if (command === 'ELS_SEND_PRIVE') { // 富豪榜
        _collectRankData('ELS_SEND_PRIVE', function (succ, data) {
            if (succ) {
                cachedClassicData = data;
                _drawWithData(command, data, false, true);
            }
            else {
                if (cachedClassicData === undefined) {
                    _drawError();
                }
                else {
                    _drawWithData(command, cachedClassicData, false, true);
                }
            }
        });
    } else if (command === "drawRankEndless") { // 无尽排行
        _collectRankData('ELS_CURRENT_STAGE_ENDLESS', function (succ, data) {
            if (succ) {
                cachedClassicData = data;
                _drawWithData(command, data, false, true);
            }
            else {
                if (cachedClassicData === undefined) {
                    _drawError();
                }
                else {
                    _drawWithData(command, cachedClassicData, false, true);
                }
            }
        });

    }
};

var _getPKStarLevel = function (star) {
    if (!star) return [0, 0];
    var len = PLAYER_TITLE2.length;
    var startotal = 0, star_level = 0, cur_star = 0;
    for (var i = 0; i < len; i++) {
        var starnum = PLAYER_TITLE2[i][0];
        startotal += starnum;
        if (startotal >= star) {
            star_level = i;
            break;
        }
    }
    cur_star = PLAYER_TITLE2[star_level][0] - (startotal - star);
    return [star_level, cur_star];
};

var _cleanOpenData = function () {
    var shareCanvas = wx.getSharedCanvas();
    var context = shareCanvas.getContext("2d");
    context.canvas.width = 720;
    context.canvas.height = 1280;
    context.clearRect(0, 0, 720, 2000);
};

var _drawQQHIn = function (data) {
    var openId = data.openId || 'selfOpenId';
    wx.getUserInfo({
        openIdList: [openId],
        lang: 'zh_CN',
        success: function (params) {
            var UserData = params.data[0];
            var shareCanvas = wx.getSharedCanvas();
            var context = shareCanvas.getContext("2d");
            context.clearRect(0, 0, 720, 1280);
            context.fillStyle = data.fillStyle || "#FFFFFF";
            // context.fillRect(10,10,100,1000);
            context.font = data.font + "px Arial";
            //头像
            var headImage = wx.createImage();
            headImage.src = UserData.avatarUrl;
            headImage.onload = function (event) {
                // context.save(); // 保存当前ctx的状态
                var img = event.target;
                context.drawImage(img, 720 / 2 + data.position.x - data.size.width / 2, 1280 / 2 - data.position.y - data.size.height / 2, data.size.width, data.size.height);
                // context.restore(); // 还原状态
            };
            //昵称
            context.textAlign = "left";
            context.fillText(UserData.nickName + "的悄悄话", 720 / 2 + data.position.x + data.size.width / 2 + 8, 1280 / 2 - data.position.y + data.size.height / 2 - 23);
        },
    });
};

var _drawQQHWin = function (data) {
    var openId = data.openId || 'selfOpenId';
    wx.getUserInfo({
        openIdList: [openId, 'selfOpenId'],
        lang: 'zh_CN',
        success: function (params) {
            var shareCanvas = wx.getSharedCanvas();
            var context = shareCanvas.getContext("2d");
            context.clearRect(0, 0, 720, 1280);

            var headImage = wx.createImage();
            headImage.src = params.data[0].avatarUrl;
            headImage.onload = function (event) {
                // context.save(); // 保存当前ctx的状态
                var img = event.target;
                context.drawImage(img, 720 / 2 - 150 - 72 / 2, 1280 / 2 - 340 - 72 / 2, 72, 72);
                // context.restore(); // 还原状态
            };

            var headImage1 = wx.createImage();
            headImage1.src = params.data[1].avatarUrl;
            headImage1.onload = function (event) {
                context.save(); // 保存当前ctx的状态
                context.rotate(13 * Math.PI / 180);
                var img = event.target;
                context.drawImage(img, 326, 221, 72, 72);
                context.restore(); // 还原状态
            };

        },
    });
};

var _showBeyond = function (data) {
    _cleanOpenData();
    let key = undefined;
    if (data && data.type) {
        key = data.type;
    } else {
        return;
    }
    wx.getFriendCloudStorage({
        keyList: [key],
        success: function (result) {
            var data = result.data;
            var nextUser = _getNextUser(data);
            if (nextUser) _drawBeyond(nextUser, key);
        }
    });
};

var _drawBeyond = function (user, key) {
    console.log("beyond ::", JSON.stringify(user));
    var shareCanvas = wx.getSharedCanvas();
    var context = shareCanvas.getContext("2d");
    context.clearRect(0, 0, 720, 1280);
    context.clearRect(0, 0, 510, 1890);
    context.fillStyle = "#4C3878";
    context.globalAlpha=0.8;
    context.fillRect(216, 74, 114, 158);

    context.textAlign = "center";
    context.fillStyle = "#FFFFFF";
    context.font = "20px Arial";
    context.fillText("即将超越", 138*2, 48*2);

    context.font = "22px Arial";
    context.fillText(stringSlice(user.nickname, 10), 138*2, 98*2, 114);

    context.fillStyle = "#CA96FF";
    var _titile = "";
    if (key === "ELS_CURRENT_STAGE2") {
        _titile = "第" + (parseInt(user.value) + 1 )+ "关";
    } else if (key === "ELS_PKSTAR") {
        var _vl = _getPKStarLevel(user.value);
        _titile = PLAYER_TITLE2[_vl[0]][1];
    } else {
        _titile = user.value;
    }
    context.fillText(_titile, 138*2, 110*2);


    var purl = user.avatarUrl;
    var headImage = wx.createImage();
    headImage.src = purl;
    headImage.onload = function (event) {
        var img = event.target;
        context.drawImage(img, 241, 106, 66, 66);
    };
};

var _getNextUser = function (data) {
    data = data.filter(function (x) {
        return x.KVDataList.length == 1;
    });
    data.sort(function (lhr, rhr) {
        var lvalue = parseInt(lhr.KVDataList[0].value);
        if (isNaN(lvalue)) lvalue = 0;
        var rvalue = parseInt(rhr.KVDataList[0].value);
        if (isNaN(rvalue)) rvalue = 0;
        return rvalue - lvalue;
    });
    data.forEach(function (x, idx) {
        x.rank = idx + 1;
        x.value = parseInt(x.KVDataList[0].value);
        if (isNaN(x.value)) {
            x.value = 0;
        }
    });
    var nextUser = undefined;
    for (var i = 0; i < data.length; i++) {
        if (i > 0 && data[i].nickname === myUserData.nickName && data[i].avatarUrl === myUserData.avatarUrl) {
            nextUser = data[i - 1];
        }
    }
    return nextUser;
};

var _drawWithData = function (command, data, isChallenge, clearNone) {

    var _isChallenge = isChallenge;
    data = data.filter(function (x) {
        return x.KVDataList.length == 1;
    });
    
    if (clearNone) {
        data = data.filter(function (x) {
            return parseInt(x.KVDataList[0].value) > 0;
        });
    }

    data.sort(function (lhr, rhr) {
        var lvalue = parseInt(lhr.KVDataList[0].value);
        if (isNaN(lvalue)) lvalue = 0;
        var rvalue = parseInt(rhr.KVDataList[0].value);
        if (isNaN(rvalue)) rvalue = 0;
        return rvalue - lvalue;
    });
    data.forEach(function (x, idx) {
        x.rank = idx + 1;
        x.value = parseInt(x.KVDataList[0].value);
        if (isNaN(x.value)) {
            x.value = 0;
        }
    });
    // 先画自己
    var me = undefined;
    for (var i = 0; i < data.length; i++) {
        if (_isMySelf(data[i], myUserData)) {
            me = data.splice(i, 1)[0];
        }
    }
    if (me == undefined) {
        me = {
            openid: myUserData.openId,
            nickname: myUserData.nickName,
            avatarUrl: myUserData.avatarUrl,
            KVDataList: [{
                key: command,
                value: '0'
            }],
            rank: '999+',
            value: 0
        };
    }
    data.unshift(me);

    var shareCanvas = wx.getSharedCanvas();
    var context = shareCanvas.getContext("2d");
    context.clearRect(0, 0, 530, 1890);

    var values = data.map(function (x) {
        return x.value;
    });
    console.log('_drawWithData => ' + command + ' => ' + JSON.stringify(values));

    //530*600
    context.font = "28px Arial";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.globalAlpha = 0.9;

    if (data && data.length > 0) {
        for (var idx = 0; idx < 21; idx++) {
            var baseHeight = idx * 90 + 45;
            if (idx % 2 == 0) {
                if (idx == 0) {
                    context.fillStyle = "#BEE8F5";
                } else {
                    context.fillStyle = "#BEE8F5";
                }
            } else {
                context.fillStyle = "#CEF6FD";
            }
            context.fillRect(0, baseHeight - 45, 530, 90);
            context.fillStyle = "#0083B9";
            if (idx < data.length) {
                //排行
                context.textAlign = "center";
                if (idx < 4) {
                    var image = wx.createImage();
                    image.toY = baseHeight - 28;
                    if (data[idx].rank === 1) {
                        image.src = "share_img/ddz_rank_1.png";
                    }
                    else if (data[idx].rank === 2) {
                        image.src = "share_img/ddz_rank_2.png";
                    }
                    else if (data[idx].rank === 3) {
                        image.src = "share_img/ddz_rank_3.png";
                    }
                    else {
                        context.fillText(data[idx].rank, 71, baseHeight + 6);
                    }
                    image.onload = function (event) {
                        var img = event.target;
                        context.drawImage(img, 41, img.toY, 48, 55);
                    };
                } else {
                    context.fillText(data[idx].rank, 71, baseHeight + 6);
                }

                //头像
                var headImage = wx.createImage();
                headImage.toY = idx;
                if (data[idx].avatarUrl != "") {
                    headImage.src = data[idx].avatarUrl;
                } else {
                    headImage.src = "share_img/ddz_avatar_bg.png";
                }
                headImage.onload = function (event) {

                    context.save(); // 保存当前ctx的状态

                    var img = event.target;
                    var r = 33;
                    var lineTop = img.toY * 90 + 45 - r;

                    //context.arc(73 + r, lineTop + r,r,  0, 360); //画出圆
                    //context.clip(); //裁剪上面的圆形

                    context.drawImage(img, 103, lineTop, r * 2, r * 2);  // 在刚刚裁剪的园上画图
                    context.restore(); // 还原状态

                    var beforeImage = wx.createImage();
                    beforeImage.lineTop = lineTop;
                    if (img.toY === 0) {
                        beforeImage.src = "share_img/ddz_avatar_03.png";
                    } else if (img.toY % 2 === 0) {
                        beforeImage.src = "share_img/ddz_avatar_02.png";
                    } else {
                        beforeImage.src = "share_img/ddz_avatar_01.png";
                    }
                    // beforeImage.onload = function (event) {
                    //     var image = event.target;
                    //     context.drawImage(image, 73, image.lineTop, r * 2, r * 2);
                    // }
                };

                //昵称
                context.textAlign = "left";
                context.fillText(stringSlice(data[idx].nickname, 10), 216, baseHeight + 6);

                //总奖金
                context.textAlign = "right";

                var _titile = '';
                var _s = data[idx].value.toString();
                if (_isChallenge) {
                    var l = _getPKStarLevel(parseInt(_s));
                    _titile = PLAYER_TITLE2[l[0]][1];

                    if (parseInt(_s) < 10) {
                        _s = '0' + _s;
                    }
                    _s = _titile;

                }

                context.fillText('' + _s, 480, baseHeight + 6);
            } else {
                context.textAlign = "center";
                context.fillText(idx + 1, 71, baseHeight + 6);
                context.textAlign = "left";
                context.fillText("虚位以待", 186, baseHeight + 6);
            }
        }
    }
    context.globalAlpha = 1;
};

var _drawError = function () {

};

var _drawWaitting = function () {
    var shareCanvas = wx.getSharedCanvas();
    var context = shareCanvas.getContext("2d");
    context.clearRect(0, 0, 530, 1890);
    context.fillStyle = "#CEF6FD";
    context.fillRect(0, 0, 530, 1890);
    context.font = "28px Arial";
    context.fillStyle = "#0083B9";
    context.textAlign = "center";
    context.fillText("加载中...", 265, 350);
};

var _collectRankData = function (key, onDataCallback) {
    wx.getFriendCloudStorage({
        keyList: [key],
        success: function (result) {
            var data = result.data;
            onDataCallback(true, data);
        },
        fail: function () {
            onDataCallback(false, data);
        },
        complete: function () {
        }
    });
};

var _isMySelf = function (lhr, rhr) {
    return lhr.nickname == rhr.nickName && lhr.avatarUrl == rhr.avatarUrl;
};


//先算出整个字符串的长度，并获得第length - 2个字符串的位置，给".."留2个位置
var stringSlice = function (str, length) {
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
};
