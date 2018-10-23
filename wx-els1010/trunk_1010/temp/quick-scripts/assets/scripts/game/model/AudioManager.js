(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/model/AudioManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8e540bKJjFApIGkijLiNpLd', 'AudioManager', __filename);
// scripts/game/model/AudioManager.js

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @file: AudioManager.getInstance().js
 * @description: 声音管理器
 * @author: lu ning
 * @email: luning@tuyoogame.com
 * @date: 2018-08-22
 */

var _instance = null; //! 单例，私有
var LOCAL_MUTE_KEY = 'ado_mute';
var AudioManager = function () {
    function AudioManager() {
        _classCallCheck(this, AudioManager);
    }

    _createClass(AudioManager, [{
        key: "init",
        value: function init() {
            this.bgMusicContext = null;
            this.isMute = false; //* 是否静音
            this.bgMusicCache = new Map();
            this.soundsCache = new Map();
            var tisMute = tywx.tt.Utils.loadItem(LOCAL_MUTE_KEY, false);
            if (tisMute == "false") {
                this.isMute = false;
            } else {
                this.isMute = true;
            }
        }
        /**
         * @description 资源预加载
         * @author lu ning
         * @date 2018-08-23
         */

    }, {
        key: "loadAudioRes",
        value: function loadAudioRes() {
            // let sounds_config = tywx.tt.Constants.GameCenterConfig.SOUNDS;
            var music_config = tywx.tt.Configs.MUSICS;
            // let sound_keys = Reflect.ownKeys(sounds_config);
            var music_keys = Reflect.ownKeys(music_config);
            var self = this;
            // sound_keys.forEach(sound_key => {
            //     if (!self.soundsCache.has(sounds_config[sound_key])) {
            //         self.addSound2CacheByUrl(sounds_config[sound_key]);
            //     }
            // });
            music_keys.forEach(function (music_key) {
                if (!self.bgMusicCache.has(music_config[music_key])) {
                    self.addMusic2CacheByUrl(music_config[music_key]);
                }
            });
        }
        /**
         * @description 根据url添加声音资源到缓存池
         * @author lu ning
         * @date 2018-08-23
         * @param {String} url 路径
         * @param {boolean} [is_play=false] 是否播放
         */

    }, {
        key: "addSound2CacheByUrl",
        value: function addSound2CacheByUrl(url) {
            var is_play = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            try {
                var tmp_sound_context = wx.createInnerAudioContext();
                tmp_sound_context.src = url;
                tmp_sound_context.autoPlay = false;
                tmp_sound_context.loop = false;
                tmp_sound_context.volume = 1.0;
                this.soundsCache.set(url, tmp_sound_context);
                is_play && tmp_sound_context.play();
            } catch (e) {
                cc.error("addSound2CacheByUrl error " + url);
            }
        }
        /**
         * @description 添加背景音乐到缓存池
         * @author lu ning
         * @date 2018-08-23
         * @param {String} url 路径
         * @param {boolean} [is_play=false] 是否播放
         */

    }, {
        key: "addMusic2CacheByUrl",
        value: function addMusic2CacheByUrl(url) {
            var is_play = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            try {
                var tmp_music_context = wx.createInnerAudioContext();
                tmp_music_context.src = url;
                tmp_music_context.autoPlay = false;
                tmp_music_context.loop = true; //* 所有的背景音乐都默认循环
                tmp_music_context.volume = 1.0;
                this.bgMusicCache.set(url, tmp_music_context);
                if (is_play) {
                    tmp_music_context.play();
                    this.bgMusicContext = tmp_music_context;
                }
            } catch (e) {
                cc.error("addMusic2CacheByUrl error " + url);
            }
        }
        /**
         * * 播放背景音乐 
         *
         * @param {String} url 背景音乐url
         * @param {boolean} [loop=true] 是否循环 废弃
         * @param {number} [valume=1.0] 音量 废弃
         */

    }, {
        key: "playMusic",
        value: function playMusic(url) {
            var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var volume = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.0;

            tywx.tt.log("播放音乐22  = " + this.isMute);
            this.stopMusic();

            if (this.isMute) return; //! 静音
            if (this.bgMusicCache.has(url)) {
                this.bgMusicContext = this.bgMusicCache.get(url);
                this.bgMusicContext.play();
                tywx.tt.log("播放音乐22  = " + this.isMute);
            } else {
                this.addMusic2CacheByUrl(url, true);
            }
        }
        /**
         * @description 播放声效
         * @author lu ning
         * @date 2018-08-23
         * @param {String} url
         */

    }, {
        key: "playSound",
        value: function playSound(url) {
            if (this.isMute) return; //! 静音
            if (this.soundsCache.has(url)) {
                var tmp_context = this.soundsCache.get(url);
                tmp_context.play();
            } else {
                this.addSound2CacheByUrl(url, true);
            }
        }
        /**
         * * 停止播放背景音乐
         *
         */

    }, {
        key: "stopMusic",
        value: function stopMusic() {
            if (this.bgMusicContext) {
                this.bgMusicContext.stop();
            }
            this.bgMusicContext = null;
        }
    }, {
        key: "setIsMute",
        value: function setIsMute(is_mute) {
            this.isMute = is_mute;
            tywx.tt.Utils.saveItem(LOCAL_MUTE_KEY, this.isMute, false);
        }
    }, {
        key: "getIsMute",
        value: function getIsMute() {
            return this.isMute;
        }
    }], [{
        key: "getInstance",


        /**
         * @description
         * @author lu ning
         * @date 2018-08-22
         * @static
         * @returns
         */
        value: function getInstance() {
            if (!_instance) {
                _instance = new AudioManager();
                _instance.init();
            }
            tywx.tt.log("getInstance ddd");
            return _instance;
        }
    }]);

    return AudioManager;
}();

module.exports = AudioManager;

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
        //# sourceMappingURL=AudioManager.js.map
        