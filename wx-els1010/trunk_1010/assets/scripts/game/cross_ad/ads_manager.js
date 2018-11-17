let TAG = "[game/cross_ad/ads_manager.js]";
let node_path = "prefabs/ads_node";
let list_path = "prefabs/ads_list";
let blink_path = "prefabs/ads_blink";
const ads_manager = cc.Class({
 

    statics: {
        ads_data: null,
        allevents:[],
        /**
         * @description 得到某种类型的交叉倒流数据
         * @param {String} ads_type  交叉倒流的类型
         */
        getTypeData: function (ads_type) {
            if (ads_manager.ads_data) {
                if (ads_manager.ads_data[ads_type]) {
                    const ad_ids = ads_manager.ads_data[ads_type].ads;
                    const ttype = ads_manager.ads_data[ads_type].type;
                    var alliddata = [];
                    var allqzdata = [];
                    var ads = ads_manager.ads_data.ads;
                    for (var idIndex = 0; idIndex < ad_ids.length; idIndex++) {
                        var finddata = null;
                        for (var tadIndex = 0; tadIndex < ads.length; tadIndex++) {
                            if (ttype == "blink") {
                                if (ads[tadIndex].id == ad_ids[idIndex][0]) {
                                    finddata = ads[tadIndex];
                                    allqzdata.push(ad_ids[idIndex][1]);
                                    break;
                                }
                            } else {
                                if (ads[tadIndex].id == ad_ids[idIndex]) {
                                    finddata = ads[tadIndex];
                                    break;
                                }
                            }
                        }
                        if (finddata) {
                            alliddata.push(finddata);
                        } else {
                            tywx.tt.error(TAG, "没有ID " + ad_ids[idIndex] + "的倒流数据");
                        }
                    }
                    var typedata = {};
                    typedata.type = ads_type;
                    typedata.blink_display = ads_manager.ads_data.blink_display;
                    typedata.ads_data = alliddata;
                    typedata.ads_qz = allqzdata;
                    typedata.ads_subtype = ttype;
                    tywx.tt.error(TAG, "节点数据s " + JSON.stringify(typedata));
                    return typedata;
                } else {
                    tywx.tt.error(TAG, "没有" + ads_type + "这种类型的交叉倒流数据");
                }
            } else {
                tywx.tt.error(TAG, "没有设置交叉倒流数据");
            }
            return null;
        },

        addAdsNode: function (ads_type, paraent, pos) {
            if (!ads_manager.ads_data) {
                var tdata = {}
                tdata.paraent = paraent;
                tdata.pos = pos;
                tdata.ads_type = ads_type;
                ads_manager.allevents.push(tdata);
                ads_manager.waitadd = true;
                tywx.tt.error(TAG, "没有设置交叉倒流数据1");
            } else {
                ads_manager.paraent = paraent;
                ads_manager.ads_type = ads_type;
                ads_manager.pos = pos;
                ads_manager.dataCall();
            }
        },
        listenCDNData: function () {
            tywx.NotificationCenter.listen(tywx.tt.events.TT_GET_CONFIG_SUCCESS, ads_manager.setData, ads_manager);
        },

        listenADManagerData: function () {
            tywx.tt.log("开始监听Admanager倒流数据回调");
            tywx.NotificationCenter.listen(tywx.EventType.GET_ADMANAGER_ICON_INFO_SUCCESS, ads_manager.AdmanagerCall, ads_manager);
        },

        // 
        AdmanagerCall: function () {

        },
        /** 
         * @description 设置小程序的数据
         * @param {Object} data CDN 上的网络配置数据
         */
        setData: function (data) {
            ads_manager.ads_data = data.default.cross_ad;
            tywx.tt.log(TAG, "交叉倒流的数据  = " + JSON.stringify(ads_manager.ads_data));
            if (this.waitadd == true) {
                this.waitadd = false;
                for (var tindex = 0; tindex < ads_manager.allevents.length;  tindex++){
                     let tdata = ads_manager.allevents[tindex];
                     this.addAdsNode(tdata.ads_type, tdata.paraent, tdata.pos);
                }
                ads_manager.allevents = [];
            }else{
                ads_manager.allevents = [];
            }
        },

        dataCall: function () {
            if (ads_manager.ads_data && tywx.tt.configManager.getInstance().auditing == false) {
                const parent = ads_manager.paraent;
                const pos = ads_manager.pos;
                const data = ads_manager.getTypeData(ads_manager.ads_type);
                if (data.ads_subtype == "banner") {
                    cc.loader.loadRes(node_path, (err, prefab) => {
                        if (!err) {
                            let adsnode = cc.instantiate(prefab);
                            let ads_script = adsnode.getComponent('ads_node');
                            ads_script.setData(data);
                            adsnode.position = pos;
                            tywx.tt.log("banner ads_manager.pos =" + JSON.stringify(pos))
                            parent.addChild(adsnode);
                        }
                    });
                }else if(data.ads_subtype == "list"){
                    cc.loader.loadRes(list_path, (err, prefab) => {
                        if (!err) {
                            let adsnode = cc.instantiate(prefab);
                            let ads_script = adsnode.getComponent('ads_list');
                            ads_script.setData(data);
                            adsnode.position = cc.v2(0,0);
                            parent.addChild(adsnode);
                        }
                    });
                } else if (data.ads_subtype == "blink") {
                    cc.loader.loadRes(blink_path, (err, prefab) => {
                        if (!err) {
                            let adsnode = cc.instantiate(prefab);
                            let ads_script = adsnode.getComponent('ads_blink');
                            ads_script.setData(data);
                            tywx.tt.log("blink ads_manager.pos =" + JSON.stringify(pos))
                            adsnode.position = pos;
                            parent.addChild(adsnode);
                        }
                    });
                }
            } else {
                tywx.tt.error(TAG, "没有交叉倒流的数据2");
            }
        }
    },
 
});


module.exports = ads_manager;