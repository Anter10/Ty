/**
 * @file: AudioManager.js
 * @description: 声音管理器
 * @author: lu ning
 * @email: luning@tuyoogame.com
 * @date: 2018-08-22
*/
let _instance = null;  //! 单例，私有
let LOCAL_MUTE_KEY = 'ado_mute';
class AudioManager{

    /**
     * @description
     * @author lu ning
     * @date 2018-08-22
     * @static
     * @returns
     */
    static getInstance(){
        if(!_instance) _instance = new AudioManager();
        return _instance;
    }
    constructor(){
        this.bgMusicContext = null;
        this.isMute = false; //* 是否静音
        this.bgMusicCache = new Map();
        this.soundsCache = new Map();

        this.isMute = ty.ado.Utils.loadItem(LOCAL_MUTE_KEY,false);
        if(typeof this.isMute === 'string'){
            this.isMute = this.isMute === 'false' ? false : true;
        }
    }
    /**
     * @description 资源预加载
     * @author lu ning
     * @date 2018-08-23
     */
    loadAudioRes(){
        let sounds_config = ty.ado.Constants.GameCenterConfig.SOUNDS;
        let music_config = ty.ado.Configs.MUSICS;
        let sound_keys = Reflect.ownKeys(sounds_config);
        let music_keys = Reflect.ownKeys(music_config);
        let self = this;
        sound_keys.forEach(sound_key=>{
            if(!self.soundsCache.has(sounds_config[sound_key])){
                self.addSound2CacheByUrl(sounds_config[sound_key]);
            }
        });
        music_keys.forEach(music_key=>{
            if(!self.bgMusicCache.has(music_config[music_key])){
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
    addSound2CacheByUrl(url, is_play = false){
        try{
            let self = this;
            if(!this.soundsCache.has(url)){
                cc.loader.loadRes(url.split('.')[0],(err,res)=>{
                    console.log('addSound2CacheByUrl',url, err, res);
                    self.soundsCache.set(url,res);
                    is_play && self.playSound(url);
                });
            }
            else{
                is_play && this.playSound(url);
            }
        }catch(e){
            cc.error(`addSound2CacheByUrl error ${url}`);
        }
    }
    /**
     * @description 添加背景音乐到缓存池
     * @author lu ning
     * @date 2018-08-23
     * @param {String} url 路径
     * @param {boolean} [is_play=false] 是否播放
     */
    addMusic2CacheByUrl(url, is_play = false){
        try{
            let self = this;
            if(!this.bgMusicCache.has(url)){
                cc.loader.load(ty.ado.Configs.MUSICS.BG_MUSIC,(err, data)=>{
                    console.log(err, data);
                    if(!err){
                        self.bgMusicCache.set(url, data);
                        is_play && self.playMusic(url);
                    }
                });
            }
            else{
                is_play && self.playMusic(url);
            }
        }
        catch(e){
            cc.error(`addMusic2CacheByUrl error ${url}`);
        }
    }
    /**
     * * 播放背景音乐 
     *
     * @param {String} url 背景音乐url
     * @param {boolean} [loop=true] 是否循环 废弃
     * @param {number} [valume=1.0] 音量 废弃
     */
    playMusic(url, loop = true, volume = 1.0){
        this.stopMusic();
        if(this.isMute) return; //! 静音
        if(this.bgMusicCache.has(url)){
            this.bgMusicContext = cc.audioEngine.play(this.bgMusicCache.get(url), loop, volume);
        }
        else{
            this.addMusic2CacheByUrl(url, true);
        }
    }
    /**
     * @description 播放声效
     * @author lu ning
     * @date 2018-08-23
     * @param {String} url
     */
    playSound(url){
        if (this.isMute) return; //! 静音
        if(this.soundsCache.has(url)){
            cc.audioEngine.play(this.soundsCache.get(url), false, 1);
        }
        else{
            this.addSound2CacheByUrl(url, true);
        }
    }
    /**
     * * 停止播放背景音乐
     *
     */
    stopMusic(){
        //cc.audioEngine.stop(this.bgMusicContext);
        // if(this.bgMusicContext){
        //     this.bgMusicContext.stop();
        // }
        // this.bgMusicContext = null;
        cc.audioEngine.stopAll();
    }
    setIsMute(is_mute){
        this.isMute = is_mute;
        ty.ado.Utils.saveItem(LOCAL_MUTE_KEY,this.isMute,false);
    }
    getIsMute(){ return this.isMute;}

};

module.exports = AudioManager.getInstance();
