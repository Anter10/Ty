"use strict";
cc._RF.push(module, '47d99LJhqBOKIttpAiKlRg+', 'stop_view');
// scripts/game/stopview/stop_view.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var stopview_path = "prefabs/stop_view";

var stop_view = cc.Class({
    extends: cc.Component,

    properties: {
        audioNormal: cc.Sprite,
        audioEnable: cc.Sprite
    },

    /**
     * @description 继续游戏的时候调用
     */
    goOnGameCall: function goOnGameCall() {
        tywx.tt.friend.setStop(false);
        tywx.tt.Utils.showWXBanner();
        this.closeCall();
    },

    /**
     * @description 返回首页的时候的调用
     */
    returnHomeCall: function returnHomeCall() {
        tywx.tt.curgamescene.storeScore();
        tywx.tt.Utils.showWXBanner();
        cc.director.loadScene("scene_menu");
    },

    /**
     * @description 更换音乐显示的图片
     */
    changeButtonTexture: function changeButtonTexture() {
        if (tywx.tt.AudioManager.getInstance().getIsMute()) {
            this.audioNormal.node.active = false;
            this.audioEnable.node.active = true;
        } else if (!tywx.tt.AudioManager.getInstance().getIsMute()) {
            this.audioNormal.node.active = true;
            this.audioEnable.node.active = false;
        } else {
            // tywx.LOGE("状态不对");
        }
    },

    /**
     * @description 重新开始游戏的时候调用
     */
    repeateGameCall: function repeateGameCall() {
        tywx.tt.friend.setStop(false);
        tywx.tt.Board.reset();
        tywx.tt.BoardView.initBoardView();
        tywx.tt.BoardView.initPreviewBlocks();
        tywx.tt.Utils.showWXBanner();
        this.closeCall();
    },

    helpCall: function helpCall() {
        tywx.tt.help.show();
    },

    /**
     * @description 点击音乐开关的时候调用
     */
    audioCall: function audioCall() {
        tywx.tt.log("curAudioState1 = " + tywx.tt.AudioManager.getInstance().getIsMute());
        if (tywx.tt.AudioManager.getInstance().getIsMute() == false) {
            tywx.tt.AudioManager.getInstance().stopMusic();
            tywx.tt.AudioManager.getInstance().setIsMute(true);
            tywx.tt.log("curAudioState2 = " + tywx.tt.AudioManager.getInstance().getIsMute());
        } else if (tywx.tt.AudioManager.getInstance().getIsMute() == true) {
            tywx.tt.AudioManager.getInstance().setIsMute(false);
            tywx.tt.log("curAudioState3 = " + tywx.tt.AudioManager.getInstance().getIsMute());
            tywx.tt.AudioManager.getInstance().playMusic(tywx.tt.Configs.MUSICS.BG_MUSIC);
        }
        this.changeTexture();
        tywx.tt.log(_typeof(tywx.tt.AudioManager.getInstance().getIsMute()) + "curAudioState4 = " + tywx.tt.AudioManager.getInstance().getIsMute());
    },

    changeTexture: function changeTexture() {
        this.changeButtonTexture();
    },

    onLoad: function onLoad() {
        this.changeTexture();
    },


    /**
     * @description 点击关闭按钮的时候调用
     */
    closeBtnCall: function closeBtnCall() {
        tywx.tt.Utils.showWXBanner();
        this.closeCall();
    },

    /**
     * @description 关闭界面调用
     */
    closeCall: function closeCall() {
        stop_view.stopview.removeFromParent(true);
        stop_view.stopview = null;
    },

    statics: {
        stopview: null,
        /**
         * @description 显示暂停界面
         */
        showStopView: function showStopView() {
            cc.loader.loadRes(stopview_path, function (err, prefab) {
                if (!err) {
                    var stopview = cc.instantiate(prefab);
                    var ads_script = stopview.getComponent('stop_view');
                    stopview.x = 360;
                    stopview.y = 640;
                    stop_view.stopview = stopview;
                    cc.director.getScene().addChild(stopview);
                    tywx.tt.Utils.hideWXBanner();
                }
            });
        }
        // update (dt) {},
    } });

module.exports = stop_view;

cc._RF.pop();