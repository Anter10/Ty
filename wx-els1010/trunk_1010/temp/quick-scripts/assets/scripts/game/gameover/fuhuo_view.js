(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/gameover/fuhuo_view.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'af215r1rMlOK7eJ/vGnmS1m', 'fuhuo_view', __filename);
// scripts/game/gameover/fuhuo_view.js

"use strict";

var fuhuo_view_path = "prefabs/fuhuo_view";

var fuhuo_view = cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        fhBtn: cc.Node,
        djsTime: cc.Node,
        jcdlNode: cc.Node
    },

    restartGame: function restartGame() {
        this.closeCall();
    },

    closeCall: function closeCall() {
        fuhuo_view.curnode.removeFromParent(true);
        fuhuo_view.curnode = null;
        tywx.tt.gameover.show(this.data);
    },

    onLoad: function onLoad() {
        // 初始化复活按钮的相关设置
        this.fuhuoScript = this.fhBtn.getComponent("ShareButton");

        var share_control = tywx.tt.configManager.share_control.recovergame;
        var calltype = tywx.tt.Utils.shareVideoCtr(share_control);
        var config = calltype == 1 ? tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_SHARE : tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_VIDEO;
        this.fuhuoScript.setShareConfig(config);
        this.fuhuoScript.setButtonCallType(calltype);
        this.fuhuoScript.setSuccessCall(function () {
            self.fuHuoCall();
        });
        tywx.tt.Utils.hideWXBanner();
        // 添加交叉倒流节点
        var canadd = true;
        canadd && tywx.tt.ads.addAdsNode("blink_play", this.jcdlNode, cc.v2(0, 0));
        // 开始倒计时
    },


    fuHuoCall: function fuHuoCall() {

        this.closeCall();
    },

    setData: function setData(data) {
        this.data = data;
        this.scoreLabel.string = data.score;
    },
    start: function start() {},


    statics: {
        curnode: null,
        /**
         * @description 显示gameOver的视图
         * @param {Object} data gameover的显示数据
         */
        show: function show(data) {
            cc.loader.loadRes(fuhuo_view_path, function (err, prefab) {
                if (!err) {
                    var fuhuonode = cc.instantiate(prefab);
                    var ads_script = fuhuonode.getComponent('fuhuo_view');
                    ads_script.setData(data);
                    fuhuo_view.curnode = fuhuonode;
                    cc.director.getScene().addChild(fuhuonode);
                }
            });
        }
    }
});

module.exports = fuhuo_view;

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
        //# sourceMappingURL=fuhuo_view.js.map
        