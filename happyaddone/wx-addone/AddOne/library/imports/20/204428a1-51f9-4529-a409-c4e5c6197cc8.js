"use strict";
cc._RF.push(module, '20442ihUflFKaQJxOXGGXzI', 'Audio');
// Script/models/Audio.js

"use strict";

/*
   声音播放控件控制按钮
   声音文件在不同的预设里面设置
   created by gyc on 2018-08-02.
*/
var curAudioState = 1; // 1: 默认状态可以播放音乐

cc.Class({
    extends: cc.Component,
    properties: {
        audioSource: {
            type: cc.AudioSource,
            default: null
        },
        audioRes: {
            default: [],
            type: cc.Sprite
        }
    },

    /*
        调用: 节点加载完成后的回调
        功能: 节点加载完成后的一些UI逻辑处理
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 系统自带
    */
    onLoad: function onLoad() {
        cc.audioEngine.setMaxWebAudioSize(1024 * 10);
        this.changeTexture();
    },

    changeTexture: function changeTexture() {
        if (tywx.ado.AudioManager.getIsMute()) {
            curAudioState = 0;
        } else {
            curAudioState = 1;
        }

        this.changeButtonTexture();
    },

    /*
         调用: 点击按钮的时候调用
         功能: 控制声音的开关和显示
         参数: [
             无
         ]
         返回值:[
             无
         ]
         思路: 逻辑需要
     */
    controlAudio: function controlAudio() {

        if (curAudioState == 1) {
            this.pause();
            //tywx.stopMusic();
            tywx.ado.AudioManager.stopMusic();
            curAudioState = 0;
            tywx.ado.AudioManager.setIsMute(true);
        } else if (curAudioState == 0) {
            this.play();
            //tywx.playMusic();
            tywx.ado.AudioManager.setIsMute(false);
            tywx.ado.AudioManager.playMusic(tywx.ado.Configs.default.MUSICS.BG_MUSIC);
            curAudioState = 1;
        }
        // 控制显示
        this.changeButtonTexture();
    },

    /*
        调用: 由控制方法调用
        功能: 播放声音
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    play: function play() {
        this.audioSource.play();
    },

    /*
        调用: 由控制方法调用
        功能: 暂停声音
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    pause: function pause() {
        this.audioSource.pause();
    },

    /*
        调用: 由控制方法调用
        功能: 停止当前播放声音
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    stop: function stop() {
        this.audioSource.stop();
    },

    /*
        调用: 由控制方法调用
        功能: 恢复声音
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    resume: function resume() {
        this.audioSource.resume();
    },

    /*
        调用: 点击按钮的时候调用
        功能: 更换Button的显示纹理
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    changeButtonTexture: function changeButtonTexture() {
        tywx.LOGE(this.audioRes[0]);
        if (curAudioState == 0) {
            this.audioRes[0].node.active = false;
            this.audioRes[1].node.active = true;
        } else if (curAudioState == 1) {
            this.audioRes[0].node.active = true;
            this.audioRes[1].node.active = false;
        } else {
            tywx.LOGE("状态不对");
        }
    }

});

cc._RF.pop();