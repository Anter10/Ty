(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/gameover/gameover_view.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ffd4dzoTMVCRYWRV0oqX/ml', 'gameover_view', __filename);
// scripts/game/gameover/gameover_view.js

"use strict";

var gameover_view_path = "prefabs/gameover_view";
var gameover_rank = require('../gameover/gameover_rank.js');
var gameover_view = cc.Class({
    extends: cc.Component,
    properties: {
        scoreLabel: cc.Label,
        restartBtn: cc.Node,
        jcdlNode: cc.Node,
        maxScoreLabel: cc.Label,
        phbnode: cc.Node
    },

    restartGame: function restartGame() {
        this.closeCall();
    },

    closeCall: function closeCall() {
        tywx.tt.Utils.sendWXMsg({
            method: 9
        });
        tywx.tt.friend.setStop(false);
        tywx.tt.Utils.showWXBanner();
        gameover_view.curnode.removeFromParent(true);
        gameover_view.curnode = null;
    },

    onLoad: function onLoad() {
        // 存储分数
        tywx.tt.curgamescene.storeScore();
        // 初始化复活按钮的相关设置
        this.fuhuoScript = this.restartBtn.getComponent("ShareButton");
        this.fuhuoScript.setButtonCallType(1);
        var share = false;
        var calltype = share ? 1 : 2;
        var config = calltype == 1 ? tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_SHARE : tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_VIDEO;
        this.fuhuoScript.setShareConfig(config);
        this.fuhuoScript.setSuccessCall(function () {
            self.fuHuoCall();
        });
        // 添加交叉倒流节点
        var canadd = true;
        canadd && tywx.tt.ads.addAdsNode("blink_play", this.jcdlNode, cc.v2(0, 0));
        // 开始倒计时
        // 添加好友排行的界面
        gameover_rank.addIcon(this.phbnode);
        this.maxScoreLabel.string = parseInt(tywx.tt.Utils.loadItem(tywx.tt.constants.TT_SCORE, 0)) + "";
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
            cc.loader.loadRes(gameover_view_path, function (err, prefab) {
                if (!err) {
                    var gameovernode = cc.instantiate(prefab);
                    var ads_script = gameovernode.getComponent('gameover_view');
                    ads_script.setData(data);
                    gameover_view.curnode = gameovernode;
                    cc.director.getScene().addChild(gameovernode);
                }
            });
        }
    }
});

module.exports = gameover_view;

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
        //# sourceMappingURL=gameover_view.js.map
        