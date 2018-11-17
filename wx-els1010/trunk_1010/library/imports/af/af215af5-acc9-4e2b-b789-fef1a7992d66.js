"use strict";
cc._RF.push(module, 'af215r1rMlOK7eJ/vGnmS1m', 'fuhuo_view');
// scripts/game/gameover/fuhuo_view.js

"use strict";

var fuhuo_view_path = "prefabs/fuhuo_view";

var fuhuo_view = cc.Class({
    extends: cc.Component,
    djsLabel: cc.Label,
    properties: {
        scoreLabel: cc.Label,
        fhBtn: cc.Node,
        djsTimeLabel: cc.Label,
        jcdlNode: cc.Node,
        background: cc.Node,
        root: cc.Node,
        progress: cc.ProgressBar
    },

    restartGame: function restartGame() {
        this.closeCall();
    },

    closeCall: function closeCall() {
        //  this.node.getComponent(cc.Animation).play("fuhuo_view_hide");
        fuhuo_view.curnode.removeFromParent(true);
        fuhuo_view.curnode = null;
        tywx.tt.gameover.show(this.data);
    },

    onLoad: function onLoad() {
        // 初始化复活按钮的相关设置
        this.fuhuoScript = this.fhBtn.getComponent("ShareButton");
        var self = this;
        var share_control = tywx.tt.configManager.getInstance().share_control ? tywx.tt.configManager.getInstance().share_control.recovergame : ["share", 50];
        var calltype = tywx.tt.Utils.shareVideoCtr(share_control);
        var config = calltype == 1 ? tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_SHARE : tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_VIDEO;
        this.fuhuoScript.setShareConfig(config);
        this.fuhuoScript.setButtonCallType(calltype);
        this.fuhuoScript.setSuccessCall(function () {
            self.fuHuoCall();
        });
        tywx.tt.Utils.hideWXBanner();
        this.background.getComponent("background").setTouchEndCall(function () {
            self.restartGame();
        });
        if (tywx.tt.configManager.getInstance().auditing == true) {
            this.fuhuoScript.setReactCall(true);
        }
        // 添加交叉倒流节点
        var canadd = true;
        canadd && tywx.tt.ads.addAdsNode("blink_play", this.jcdlNode, cc.v2(0, 0));
        // 开始倒计时
        this.startDjs();
        // 圈开始转
        this.startZhuan();
    },

    startZhuan: function startZhuan() {
        var alltime = 4 * 1.5;
        var speed = 400;
        var repeate = 1 / speed;
        var self = this;
        var total = 0;
        var actions = cc.callFunc(function () {
            total = total + repeate;
            var per = 1 - total;
            self.progress.progress = per;
        });
        var delay = cc.delayTime(repeate);
        var repeatea = cc.repeat(actions, delay, speed / alltime);
        this.node.runAction(repeatea);
    },

    startDjs: function startDjs() {
        this.djstime = 5;
        var self = this;
        var tdjs = 5;
        self.djsTimeLabel.string = tdjs;
        var totalPassTime = 0;
        var totalrepeate = 5;

        var djsCall = cc.callFunc(function () {
            self.djsTimeLabel.node.scale = 1;
            totalPassTime++;
            tdjs = tdjs - 1;
            if (tdjs == 0) {
                tdjs = 5;
                if (totalPassTime < totalrepeate) {
                    self.djsTimeLabel.string = "" + tdjs;
                }
                //  self.progress.progress = 0;
                self.restartGame();
            } else {
                tywx.tt.AudioManager.getInstance().playSound(tywx.tt.constants.SOUNDS.COMBO[4]);
                var ttdjs = 1 - (5 - tdjs) / 5;

                //  self.progress.progress = ttdjs;
                self.djsTimeLabel.string = tdjs;
            }
            if (totalPassTime == totalrepeate) {
                // 显示UI
                self.djsTimeLabel.string = "";
            }
            var scale = cc.scaleTo(0.3, 0);
            var delay = cc.delayTime(1);
            var call = cc.callFunc(function () {
                if (totalPassTime == totalrepeate - 1) {
                    self.djsTimeLabel.string = "";
                    tywx.tt.AudioManager.getInstance().playSound(tywx.tt.constants.SOUNDS.COMBO[4]);
                } else {
                    if (totalPassTime != totalrepeate - 1) {
                        self.djsTimeLabel.string = tdjs - 1;
                        var _ttdjs = 1 - (5 - tdjs) / 5;
                        console.log("ttdjsttdjsttdjs  =", _ttdjs);
                        //  self.progress.progress = ttdjs;
                    }
                }
                self.djsTimeLabel.node.scale = 1;
            });
            var tseq = cc.sequence(delay, scale, call);
            self.djsTimeLabel.node.runAction(tseq);
        });

        var scale = cc.scaleTo(0.3, 0);
        var delay1 = cc.delayTime(1);
        tywx.tt.AudioManager.getInstance().playSound(tywx.tt.constants.SOUNDS.COMBO[4]);

        var call = cc.callFunc(function () {
            self.djsTimeLabel.string = 4;
            self.djsTimeLabel.node.scale = 1;
        });
        var tseq = cc.sequence(delay1, scale, call);
        this.djsTimeLabel.node.runAction(tseq);

        var delay = cc.delayTime(1.5);
        var seq = cc.sequence(delay, djsCall);
        var repeate = cc.repeat(seq, this.djstime);
        this.node.stopAllActions();
        this.node.runAction(repeate);
    },

    fuHuoCall: function fuHuoCall() {
        tywx.tt.BoardView.recoverGame();
        fuhuo_view.curnode.removeFromParent(true);
        fuhuo_view.curnode = null;
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
            if (!fuhuo_view.curnode) {
                cc.loader.loadRes(fuhuo_view_path, function (err, prefab) {
                    if (!err) {
                        var fuhuonode = cc.instantiate(prefab);
                        var ani = fuhuonode.getComponent(cc.Animation);
                        ani.play("show_hide");
                        var ads_script = fuhuonode.getComponent('fuhuo_view');
                        ads_script.setData(data);
                        fuhuo_view.curnode = fuhuonode;
                        tywx.tt.Utils.commonScaleIn(ads_script.root);
                        cc.director.getScene().addChild(fuhuonode);
                    }
                });
            }
        }
    }
});

module.exports = fuhuo_view;

cc._RF.pop();