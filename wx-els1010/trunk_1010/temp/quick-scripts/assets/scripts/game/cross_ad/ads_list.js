(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/cross_ad/ads_list.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2cb37NFtGNDLYhNnlzI08qa', 'ads_list', __filename);
// scripts/game/cross_ad/ads_list.js

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
        adnode: cc.Prefab,
        listBackbtn: cc.Button,
        contentnode: cc.Node,
        background: cc.Node,
        scrollNode: cc.Node
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

    showOrHide: function showOrHide() {
        if (this.state == 0) {
            this.show();
        } else {
            this.hide();
        }
    },

    hide: function hide() {
        this.state = 0;
    },

    show: function show() {
        this.state = 1;
    },

    /**
     * @description 初始化UI
     */
    initUI: function initUI() {
        var tnode = new cc.Node();
        tnode.width = 560;
        tnode.height = 120;
        this.contentnode.addChild(tnode);
        var tindex = 0;
        var trow = 1;
        for (var t = 0; t < this.data.ads_data.length; t++) {
            if ((t + 1) % 3 == 1) {
                tnode = new cc.Node();
                tnode.width = 560;
                tnode.height = 120;
                tnode.anchorX = 0;
                tnode.anchorY = 0;
                tindex = 0;
                trow++;
                this.contentnode.addChild(tnode);
            }
            tnode.x = 0;
            tnode.y = (trow - 2) * -160;
            var data = this.data.ads_data[t];
            var adnode = cc.instantiate(this.adnode);
            var ads_script = adnode.getComponent('ad_node');
            ads_script.setData(data);
            var vpos = cc.v2(90 + tindex * 160 - 280, -70);
            tywx.tt.error(TAG, "vpos = " + JSON.stringify(vpos));
            adnode.position = vpos;
            tnode.addChild(adnode);
            tindex++;
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.node.width = cc.game.canvas.width;
        this.node.height = cc.game.canvas.height;
        this.scrollNode.position.x = -this.scrollNode.width;
        this.background.active = false;
        this.state = 0;
        this.scrollNode.x = -Math.abs(this.scrollNode.width + 360);
    },

    update: function update() {
        if (this.state == 0) {
            if (Math.abs(this.scrollNode.x - 30) < Math.abs(this.scrollNode.width + 360)) {
                this.scrollNode.x = this.scrollNode.x - 30;
            } else {
                this.background.active = false;
                this.listBackbtn.node.scaleX = 1;
                this.scrollNode.x = -Math.abs(this.scrollNode.width + 360);
            }
        } else if (this.state == 1) {
            if (this.scrollNode.x + 25 < -360) {
                this.scrollNode.x = this.scrollNode.x + 25;
            } else {
                this.background.active = true;
                this.listBackbtn.node.scaleX = -1;
                this.scrollNode.x = -360;
            }
        }
    }

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
        //# sourceMappingURL=ads_list.js.map
        