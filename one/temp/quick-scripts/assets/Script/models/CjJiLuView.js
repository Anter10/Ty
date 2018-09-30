(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/CjJiLuView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c07c0vnJ/tPYqFN42ZOSdmn', 'CjJiLuView', __filename);
// Script/models/CjJiLuView.js

"use strict";

/**
 * @description 抽奖界面
 * @description created by gyc on 2018-09-17
 */
cc.Class({
    extends: cc.Component,

    properties: {
        cjItem: {
            default: null,
            type: cc.Prefab
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        // 当前的抽奖状态 0 免费抽奖 1 观看视频抽奖
        jlData: []
    },

    close: function close() {
        this.node.destroy();
    },

    /**
     * @description 组件加载完成
     */
    onLoad: function onLoad() {
        this.content = this.scrollView.content;
        this.jlData = [{ time: "2018-09-17", item: { name: "1元" } }, { time: "2018-09-17", item: { name: "锤子" } }];
        this.setData(this.jlData);
    },
    /**
     * @description 设置并刷新数据
     * @param {Object} data 请求到的记录数据
     */
    setData: function setData(data) {
        this.jlData = data;
        for (var i = 0; i < this.jlData.length; ++i) {
            // spawn items, we only need to do this once
            var item = cc.instantiate(this.cjItem);
            this.content.addChild(item);
            item.setPosition(0, -item.height * (0.5 + i) - 10 * (i + 1));
            item.getComponent('JiLuItem').setData(this.jlData[i]);
        }
    },
    /** 
     * @description 刷新视图
    */
    flushView: function flushView() {}

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
        //# sourceMappingURL=CjJiLuView.js.map
        