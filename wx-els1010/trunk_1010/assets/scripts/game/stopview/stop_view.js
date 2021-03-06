const stopview_path = "prefabs/stop_view";

const stop_view = cc.Class({
    extends: cc.Component,

    properties: {
        audioNormal: cc.Sprite,
        audioEnable: cc.Sprite,
    },

    /**
     * @description 继续游戏的时候调用
     */
    goOnGameCall: function () {
        tywx.tt.friend.setStop(false);
        tywx.tt.Utils.showWXBanner();
        this.closeCall();
    },

    /**
     * @description 返回首页的时候的调用
     */
    returnHomeCall: function () {
        tywx.tt.curgamescene.storeScore();
        tywx.tt.Utils.showWXBanner();
        cc.director.loadScene("scene_menu");
    },

    /**
     * @description 更换音乐显示的图片
     */
    changeButtonTexture: function () {
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
    repeateGameCall: function () {
        tywx.tt.friend.setStop(false);
        tywx.tt.BoardView.reset();
        tywx.tt.BoardView.blocksAni();
        tywx.tt.Utils.showWXBanner();
        this.closeCall();
    },

    showRankCall: function () {
        tywx.tt.rank_manager.showRank();
    },

    helpCall: function () {
        tywx.tt.help.show();
    },

    /**
     * @description 点击音乐开关的时候调用
     */
    audioCall: function () {
        tywx.tt.log("curAudioState1 = " + tywx.tt.AudioManager.getInstance().getIsMute());
        if (tywx.tt.AudioManager.getInstance().getIsMute() == false) {
            tywx.tt.AudioManager.getInstance().stopMusic();
            tywx.tt.AudioManager.getInstance().setIsMute(true);
            tywx.tt.log("curAudioState2 = " + tywx.tt.AudioManager.getInstance().getIsMute());
        } else if (tywx.tt.AudioManager.getInstance().getIsMute() == true) {
            tywx.tt.AudioManager.getInstance().setIsMute(false);
            tywx.tt.log("curAudioState3 = " + tywx.tt.AudioManager.getInstance().getIsMute());
            tywx.tt.AudioManager.getInstance().playMusic(tywx.tt.AudioManager.getInstance().getBGMusic());
            // tywx.tt.AudioManager.getInstance().playMusic(tywx.tt.configManager.getInstance().MUSICS.BG_MUSIC);
        }
        this.changeTexture();
        tywx.tt.log(typeof (tywx.tt.AudioManager.getInstance().getIsMute()) +
            "curAudioState4 = " + tywx.tt.AudioManager.getInstance().getIsMute());
    },

    changeTexture: function () {
        this.changeButtonTexture();
    },



    onLoad() {
        this.changeTexture();
    },


    /**
     * @description 点击关闭按钮的时候调用
     */
    closeBtnCall: function () {
        tywx.tt.Utils.showWXBanner();
        this.closeCall();
    },

    /**
     * @description 关闭界面调用
     */
    closeCall: function () {
        // stop_view.stopview.removeFromParent(true);
        // stop_view.stopview = null;
    },

    statics: {
        stopview: null,
        /**
         * @description 显示暂停界面
         */
        showStopView: function () {
            cc.loader.loadRes(stopview_path, (err, prefab) => {
                if (!err) {
                    let stopview = cc.instantiate(prefab);
                    let ads_script = stopview.getComponent('stop_view');
                    stopview.x = 360;
                    stopview.y = 640;
                    stop_view.stopview = stopview;
                    cc.director.getScene().addChild(stopview);
                    tywx.tt.Utils.hideWXBanner();
                }
            });
        }
    }
    // update (dt) {},
});

module.exports = stop_view;