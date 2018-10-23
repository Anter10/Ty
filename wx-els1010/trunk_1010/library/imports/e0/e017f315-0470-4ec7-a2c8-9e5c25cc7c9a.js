"use strict";
cc._RF.push(module, 'e017fMVBHBOx6LInlwlzHya', 'ads_blink');
// scripts/game/cross_ad/ads_blink.js

"use strict";

/** 
 * @description 
 * created by gyc on 20181012
 */

var TAG = "[game/cross_ad/ads_blink.js]";
var node_path = "prefabs/ads_blink";

var ads_blink = cc.Class({
    extends: cc.Component,
    properties: {
        adnode: cc.Prefab
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
        this.alladnode = [];
        for (var t = 0; t < this.data.ads_data.length; t++) {
            var data = this.data.ads_data[t];
            var adnode = cc.instantiate(this.adnode);
            var ads_script = adnode.getComponent('ad_node');
            ads_script.setData(data);
            var vpos = cc.v2(this.node.width / 2, this.node.height / 2);
            adnode.position = vpos;
            adnode.active = false;
            this.node.addChild(adnode);
            this.alladnode.push(adnode);
        }
        this.blinkindex = this.getBlinkIndex();
        this.alladnode[this.blinkindex].active = true;
        this.effectAni(this.alladnode[this.blinkindex]);
        this.blink_display = this.data.blink_display;
        this.blink();
    },

    blink: function blink() {
        var delay = cc.delayTime(this.blink_display);
        var self = this;
        var call = function call() {
            self.alladnode[self.blinkindex].active = false;
            self.blinkindex = self.getBlinkIndex();
            self.alladnode[self.blinkindex].active = true;
            self.effectAni(self.alladnode[self.blinkindex]);
        };
        var callFunc = cc.callFunc(call);
        var seq = cc.sequence(delay, callFunc);
        var repeatef = cc.repeatForever(seq);
        this.node.runAction(repeatef);
    },

    /**
     * @description 节点动画
     */
    effectAni: function effectAni(node) {
        if (this.preblinkindex == this.blinkindex) {
            return;
        }
        if (node) {
            var angle = 20;
            node.stopAllActions();
            //    node.rotation = -angle;
            //    node.anchorX = 0.5;
            //    node.anchorY = 0.7;
            //    const delay1 = cc.delayTime(0.1);
            //    const delay2 = cc.delayTime(0.1);
            //    const delay3 = cc.delayTime(0.3);
            //    const left = cc.rotateBy(0.6, angle);
            //    const right = cc.rotateBy(0.6, -angle);
            //    const seq = cc.sequence(delay3,left, delay1, right, delay2);
            //    const rep = cc.repeatForever(seq);

            var scale1 = cc.scaleTo(0.7, 1.1);
            var scale2 = cc.scaleTo(0.5, 1);
            var seq = cc.sequence(scale1, scale2);
            var rep = cc.repeatForever(seq);
            node.runAction(rep);
            this.preblinkindex = this.blinkindex;
        }
    },

    getBlinkIndex: function getBlinkIndex() {
        var random = Math.random() * 100;
        var trand = 0;
        for (var qzindex = 0; qzindex < this.data.ads_qz.length; qzindex++) {
            if (qzindex <= this.data.ads_qz.length - 2) {
                trand = trand + this.data.ads_qz[qzindex];
                if (random < trand) {
                    return qzindex;
                }
            } else {
                return qzindex;
            }
        }
    },

    onLoad: function onLoad() {}

});

cc._RF.pop();