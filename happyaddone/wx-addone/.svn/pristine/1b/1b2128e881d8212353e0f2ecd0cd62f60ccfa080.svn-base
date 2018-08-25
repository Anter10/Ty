let events = require('./open_data_config.js').events;
let CloundKeys = require('./open_data_config.js').CloudDataKey;
const _shareCanvas = wx.getSharedCanvas();
let _friendCloudDatas = null;
let _selfCloudDatas = null;

wx.onMessage(data=>{
    if(data.method === events.LOAD_DATA){
        // * 加载数据
        loadData();
    }
});

function loadData(){
    //* 好友数据
    wx.getFriendCloudStorage({
        keyList: CloundKeys.keys(),
        success:result=>{
            _friendCloudDatas = result.data;
        }
    });
    //* 自己的数据
    wx.getUserCloudStorage({
        keyList: CloundKeys.keys(),
        success:result=>{
            _selfCloudDatas = result.data;
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
function loadGroupCloudDataByShareTicket(share_ticket, success_cb){
    wx.getGroupCloudStorage({
        shareTicket: share_ticket,
        keyList: CloundKeys.keys(),
        success:result=>{
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
function drawImage(url, x, y, w, h, callback = null){
    let img = wx.createImage();
    img = url;
    img.onload = event=>{
        let t_img = event.target;
        _shareCanvas.drawImage(t_img, x, y, w, h);
        callback && callback();
    };
}
/**
 * @description 绘制文本
 * @author lu ning
 * @date 2018-08-24
 * @param {String} str
 * @param {Number} x
 * @param {Number} y
 */
function drawText(str, x, y){
    _shareCanvas.fillText(str, x,y);
}