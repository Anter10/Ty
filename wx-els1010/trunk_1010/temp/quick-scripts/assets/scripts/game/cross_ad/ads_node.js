(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/cross_ad/ads_node.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1778b7wXxBKdJW6PnI+9bY3', 'ads_node', __filename);
// scripts/game/cross_ad/ads_node.js

"use strict";

/** 
 * @description 
 * created by gyc on 20181012
 */

var TAG = "[game/cross_ad/ads_node.js]";
var node_path = "prefabs/ads_node";

var ads_node = cc.Class({
    extends: cc.Component,
    properties: {
        rootnode: cc.Node,
        adnode: cc.Prefab,
        listBackbtn: cc.Button,
        adContent: cc.Node
    },

    /**
     * @description 设置交叉倒流的数据
     * @param {Object} data 交叉倒流的数据
     */
    setData: function setData(data) {
        this.data = data;
        tywx.tt.log(TAG, "广告设置了数据 " + JSON.stringify(data));
        this.initUI();
    },

    /**
     * 
     * @param {*} ads_type 
     */
    initUI: function initUI() {
        for (var t = 0; t < this.data.ads_data.length; t++) {
            var data = this.data.ads_data[t];
            var adnode = cc.instantiate(this.adnode);
            var ads_script = adnode.getComponent('ad_node');
            ads_script.setData(data);
            var vpos = cc.v2(90 + t * 150 - 360, -70);
            tywx.tt.error(TAG, "vpos = " + JSON.stringify(vpos));
            adnode.position = vpos;
            this.adContent.addChild(adnode);
        }
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

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
        //# sourceMappingURL=ads_node.js.map
        