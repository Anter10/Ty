(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/cross_ad/ads_manager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c8e3fZLHNRJjIaWIoKf3bvO', 'ads_manager', __filename);
// scripts/game/cross_ad/ads_manager.js

"use strict";

var TAG = "[game/cross_ad/ads_manager.js]";
var node_path = "prefabs/ads_node";
var list_path = "prefabs/ads_list";
var blink_path = "prefabs/ads_blink";
var ads_manager = cc.Class({

    statics: {
        ads_data: null,
        allevents: [],
        /**
         * @description 得到某种类型的交叉倒流数据
         * @param {String} ads_type  交叉倒流的类型
         */
        getTypeData: function getTypeData(ads_type) {
            if (ads_manager.ads_data) {
                if (ads_manager.ads_data[ads_type]) {
                    var ad_ids = ads_manager.ads_data[ads_type].ads;
                    var ttype = ads_manager.ads_data[ads_type].type;
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

        addAdsNode: function addAdsNode(ads_type, paraent, pos) {
            if (!ads_manager.ads_data) {
                var tdata = {};
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
        listenCDNData: function listenCDNData() {
            tywx.NotificationCenter.listen(tywx.tt.events.TT_GET_CONFIG_SUCCESS, ads_manager.setData, ads_manager);
        },

        listenADManagerData: function listenADManagerData() {
            tywx.tt.log("开始监听Admanager倒流数据回调");
            tywx.NotificationCenter.listen(tywx.EventType.GET_ADMANAGER_ICON_INFO_SUCCESS, ads_manager.AdmanagerCall, ads_manager);
        },

        // 
        AdmanagerCall: function AdmanagerCall() {},
        /** 
         * @description 设置小程序的数据
         * @param {Object} data CDN 上的网络配置数据
         */
        setData: function setData(data) {
            ads_manager.ads_data = data.default.cross_ad;
            tywx.tt.log(TAG, "交叉倒流的数据  = " + JSON.stringify(ads_manager.ads_data));
            if (this.waitadd == true) {
                this.waitadd = false;
                for (var tindex = 0; tindex < ads_manager.allevents.length; tindex++) {
                    var tdata = ads_manager.allevents[tindex];
                    this.addAdsNode(tdata.ads_type, tdata.paraent, tdata.pos);
                }
                ads_manager.allevents = [];
            } else {
                ads_manager.allevents = [];
            }
        },

        dataCall: function dataCall() {
            if (ads_manager.ads_data) {
                var parent = ads_manager.paraent;
                var pos = ads_manager.pos;
                var data = ads_manager.getTypeData(ads_manager.ads_type);
                if (data.ads_subtype == "banner") {
                    cc.loader.loadRes(node_path, function (err, prefab) {
                        if (!err) {
                            var adsnode = cc.instantiate(prefab);
                            var ads_script = adsnode.getComponent('ads_node');
                            ads_script.setData(data);
                            adsnode.position = pos;
                            tywx.tt.log("banner ads_manager.pos =" + JSON.stringify(pos));
                            parent.addChild(adsnode);
                        }
                    });
                } else if (data.ads_subtype == "list") {
                    cc.loader.loadRes(list_path, function (err, prefab) {
                        if (!err) {
                            var adsnode = cc.instantiate(prefab);
                            var ads_script = adsnode.getComponent('ads_list');
                            ads_script.setData(data);
                            adsnode.position = cc.v2(0, 0);
                            parent.addChild(adsnode);
                        }
                    });
                } else if (data.ads_subtype == "blink") {
                    cc.loader.loadRes(blink_path, function (err, prefab) {
                        if (!err) {
                            var adsnode = cc.instantiate(prefab);
                            var ads_script = adsnode.getComponent('ads_blink');
                            ads_script.setData(data);
                            tywx.tt.log("blink ads_manager.pos =" + JSON.stringify(pos));
                            adsnode.position = pos;
                            parent.addChild(adsnode);
                        }
                    });
                }
            } else {
                tywx.tt.error(TAG, "没有交叉倒流的数据2");
            }
        }
    }

});

module.exports = ads_manager;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=ads_manager.js.map
        