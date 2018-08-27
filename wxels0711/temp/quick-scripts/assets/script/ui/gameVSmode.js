(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/gameVSmode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '06b2eUYww5Ov5uxFtBBGYLa', 'gameVSmode', __filename);
// script/ui/gameVSmode.js

"use strict";

var els = require("../core/els.js");
cc.Class({
    extends: cc.Component,

    properties: {

        gameNode: {
            default: null,
            type: cc.Node,
            displayName: "对[game common]的引用"
        },
        keepstarOK: cc.Node,
        keepstar: cc.Node,
        lose: cc.Node,
        win: cc.Node,
        prefabMTAnima: cc.Prefab, //! 猫头鹰动画
        nodeAdapterBgHome: cc.Node,
        nodeAdapterGame: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.gameview = this.gameNode.getComponent("game");
        this.lose = this.node.getChildByName('lose');
        this.win = this.node.getChildByName('win');
    },
    start: function start() {
        // this.lose = this.node.getChildByName('lose');
        // this.win = this.node.getChildByName('win');
        //        this.keepstarOK.getChildByName('bx').on(cc.Node.EventType.TOUCH_END, this.btnKeepStarOk, this);
    },


    showMe: function showMe() {
        this.game = tywx.UIManager.game;
        this.model = this.game.model;

        this.lose.active = false;
        this.win.active = false;
        this.keepstarOK.active = false;
        this.keepstar.active = false;
        this.stopAllParticleSys();
        this.nodeAdapterBgHome.active = false;
        this.nodeAdapterGame.active = true;
        if (!this.openData) {
            var self = this;
            cc.loader.loadRes('prefab/OpenData', function (err, prefab) {
                var preFabNode = cc.instantiate(prefab);
                preFabNode.parent = self.node;
                self.openData = preFabNode;
                self.openData.getComponent("OpenData").showBeyond("ELS_PKSTAR");
            });
        }
    },

    showWin: function showWin() {
        this.lose.active = false;
        this.win.active = true;

        var node = this.win.getChildByName("starcontainer");
        console.log("fengbing", "--------- pkstar_level: " + this.model, node);

        tywx.StarControl.createStars(node, els.ELS_PLAYER_TITLE2[this.model.pkstar_level][0], this.model.pkstar_level_get, 1);
        var bc = this.win.getChildByName('starlevel');
        bc.getComponent('cc.Label').string = els.ELS_PLAYER_TITLE2[this.model.pkstar_level][1];

        setTimeout(function () {
            tywx.StarControl.playAddStarAni();
        }, 100);

        //新的成功动画
        var succ = this.win.getChildByName("FangKuai_shengli");
        succ.getComponent(cc.Animation).play("FangKuai_shengli");
        //播放粒子 
        var pcs = succ.getChildByName("particlesystem01").getComponent(cc.ParticleSystem);
        pcs.resetSystem();
        //this.model.playMusic(els.ELS_VOICE.WIN_MUSIC, false);
    },

    showLose: function showLose() {
        console.log('showLose===>01');
        this.lose.active = true;
        this.win.active = false;
        this.keepstar.active = false;
        this.keepstarOK.active = false;

        if (!this.model.keepstar) {

            console.log('showLose===>02', els.ELS_PLAYER_TITLE2[this.model.pkstar_level][0], els.ELS_PLAYER_TITLE2[this.model.pkstar_level][0]);
            this.lose.active = true;

            var node = this.lose.getChildByName("starcontainer");
            tywx.StarControl.createStars(node, els.ELS_PLAYER_TITLE2[this.model.pkstar_level][0], this.model.pkstar_level_get, 1);
            //tywx.StarControl.createStars(node, 3, 3, 0);
            var bc = this.lose.getChildByName('starlevel');
            bc.getComponent('cc.Label').string = els.ELS_PLAYER_TITLE2[this.model.pkstar_level][1];
            console.log('show===>03', bc, node, node.active);

            setTimeout(function () {
                tywx.StarControl.playDelStarAni();
            }, 100);

            //新的失败动画
            var shibai = this.lose.getChildByName("FangKuai_shibai");
            shibai.getComponent(cc.Animation).play("FangKuai_shibai");
            //播放粒子
            var pcs = shibai.getChildByName("particlesystem01").getComponent(cc.ParticleSystem);
            pcs.resetSystem();
        } else {
            console.log('showLose===>03');
            this.keepstarOK.active = true;
            this.lose.active = false;

            //新的失败动画  保星成功
            var shibai = this.keepstarOK.getChildByName("FangKuai_shibai");
            shibai.getComponent(cc.Animation).play("FangKuai_shibai");
            var node = this.keepstarOK.getChildByName("starcontainer");
            tywx.StarControl.createStars(node, els.ELS_PLAYER_TITLE2[this.model.pkstar_level][0], this.model.pkstar_level_get, 1);
            var bc = this.keepstarOK.getChildByName('starlevel');
            bc.getComponent('cc.Label').string = els.ELS_PLAYER_TITLE2[this.model.pkstar_level][1];
            setTimeout(function () {
                tywx.StarControl.playAddStarAni();
            }, 100);
            //播放粒子 
            var _pcs = shibai.getChildByName("particlesystem01").getComponent(cc.ParticleSystem);
            _pcs.resetSystem();
        }
        //this.model.playMusic(els.ELS_VOICE.LOSE_MUSIC, false);
    },

    stopAllParticleSys: function stopAllParticleSys() {
        var shibai = this.keepstarOK.getChildByName("FangKuai_shibai");
        shibai.getComponent(cc.Animation).play("FangKuai_shibai");
        var pcs1 = shibai.getChildByName("particlesystem01").getComponent(cc.ParticleSystem);
        pcs1.stopSystem();
        //新的成功动画
        var succ = this.win.getChildByName("FangKuai_shengli");
        succ.getComponent(cc.Animation).play("FangKuai_shengli");
        //播放粒子 
        var pcs2 = succ.getChildByName("particlesystem01").getComponent(cc.ParticleSystem);
        pcs2.stopSystem();
    },

    /**
     * 保星提示
     */
    showKeepStar: function showKeepStar() {
        this.lose.active = false;
        this.win.active = false;
        this.keepstarOK.active = false;
        this.keepstar.active = true;
        var btn = this.keepstar.getChildByName("btngiveup");
        var time = this.keepstar.getChildByName("timettf");
        btn.active = false;
        time.getComponent(cc.Label).string = 3;
        setTimeout(function () {
            btn.active = true;
        }, 3000);

        time.runAction(cc.repeat(cc.sequence(cc.scaleTo(0.2, 1.2, 1.2), cc.scaleTo(0.5, 1, 1), cc.delayTime(0.3), cc.callFunc(function () {
            var label = time.getComponent(cc.Label);
            label.string = parseInt(label.string) - 1;
        })), 3));

        //新的失败动画  保星
        var shibai = this.keepstar.getChildByName("FangKuai_shibai");
        shibai.getComponent(cc.Animation).play("FangKuai_shibai");
        //播放粒子 
        var pcs = shibai.getChildByName("particlesystem01").getComponent(cc.ParticleSystem);
        pcs.resetSystem();
    },

    //保星成功
    btnKeepStarOk: function btnKeepStarOk() {
        this.game.emergencyShare();
    },

    //失败返回主界面
    btnLoseBack: function btnLoseBack() {
        this.stopAllParticleSys();
        tywx.UIManager.game.loseBackToHome();
    },


    //重新开始
    btnRestarGame: function btnRestarGame() {
        this.stopAllParticleSys();
        this.lose.active = false;
        this.game.reStartGame();
    },


    //下一关
    btnNextStage: function btnNextStage() {
        this.lose.active = false;
        this.win.active = false;
        this.stopAllParticleSys();
        this.game.nextStage();
    },


    //保星取消
    btnKeepStarCancel: function btnKeepStarCancel() {
        this.game.cancelKeepStar();
    },

    //保星分享
    btnKeepStarShare: function btnKeepStarShare() {
        console.log('EEEEEEEEEE');
        if (this.game.model.keepstar == true) return;
        var time = this.keepstar.getChildByName("timettf");
        time.stopAllActions();
        this.game.keepStarShare();
        //this.keepstarOK();
        // this.game.emergencyShare();
    },

    //分享
    btnShare: function btnShare() {
        tywx.ShareInterface.shareMsg({
            type: els.ELS_SHRAE_TYPE.GAME_VS_WIN
        });
    }
}

// update (dt) {},
);

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
        //# sourceMappingURL=gameVSmode.js.map
        