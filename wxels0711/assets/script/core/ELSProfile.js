/**
 * 管理俄罗斯方块本地存储数据
 * create by luning.
 */
import { els } from "./els.js";

class ELSProfile{
    constructor(){
        this.keyvalues = {};

        this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE] = false;
        this.keyvalues[ELSProfile.KEYS.BLOCK_IDX] = 0;
        this.keyvalues[ELSProfile.KEYS.SHARE_TIME_STAMP] = 0;
        this.initProps();
    }
    static getInstance(){
        if(ELSProfile._instance === null){
            ELSProfile._instance = new ELSProfile();
            ELSProfile._instance.load();
        }
        return ELSProfile._instance;
    }

    load(){
        if(!tywx.IsWechatPlatform()) return;
        console.log('Profile load start');
        this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE] = wx.getStorageSync(ELSProfile.KEYS.MUSIC_MUTE);
        if(this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE] === ''){
            this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE] = false;
        }  

        this.keyvalues[ELSProfile.KEYS.SHARE_TIME_STAMP] = wx.getStorageSync(ELSProfile.KEYS.SHARE_TIME_STAMP);
        if(this.keyvalues[ELSProfile.KEYS.SHARE_TIME_STAMP] === ''){
            this.keyvalues[ELSProfile.KEYS.SHARE_TIME_STAMP] = this.currentTimeMillis();
        }

        this.keyvalues[ELSProfile.KEYS.PROPS_COUNT] = wx.getStorageSync(ELSProfile.KEYS.PROPS_COUNT);
        console.log('prop count',this.keyvalues[ELSProfile.KEYS.PROPS_COUNT]);
        if(this.keyvalues[ELSProfile.KEYS.PROPS_COUNT] === ''){
            this.initProps();
        }
        
        console.log('Profile load end');
        this.save();
    }

    save(){
        for(var key in this.keyvalues){
            // wx.setStorage({
            //     key: key,
            //     data: this.keyvalues[key]
            // });
            cc.sys.localStorage.setItem(key, this.keyvalues[key]);
        }
    }

    getValueByKey(key){
        return this.keyvalues[key];
    }
    setValueByKey(key, value){
        this.keyvalues[key] = value;
        this.save();
    }

    getIsMusicMute(){
        return this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE];
    }
    setIsMusicMute(is_mute){
        this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE] = is_mute;

        this.save();
    }
    switchMusicMute(){
        this.setIsMusicMute(!this.keyvalues[ELSProfile.KEYS.MUSIC_MUTE]);
    }

    setShareTimeStamp(){
        this.keyvalues[ELSProfile.KEYS.SHARE_TIME_STAMP] = this.currentTimeMillis();
        this.save();
    }
    getLastShareTimeStamp(){
        return this.keyvalues[ELSProfile.KEYS.SHARE_TIME_STAMP];
    }

    isShowRank(){
        let min_wait = 28800000;// 8 * 60 * 60 * 1000
        if(this.currentTimeMillis() - this.getValueByKey(ELSProfile.KEYS.SHARE_TIME_STAMP) >= min_wait){
            return true;
        }
        return false;
    }

    currentTimeMillis(){
        let ret = 0;
        let date = new Date();
        ret = date.getTime();
        return ret;
    }

    //! 道具相关接口
    initProps(){
        this.keyvalues[ELSProfile.KEYS.PROPS_COUNT] = [];
        for(var key in ELSProfile.PROP_TYPES){
            this.keyvalues[ELSProfile.KEYS.PROPS_COUNT].push(0);
        }
    }
    //! 增加道具
    addPropByKey(key, count = 1){
        this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] += count;
        this.save();
    }
    //! 获取道具数量
    getPropByKey(key){
        let ret = this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key];
        return ret;
    }
    //! 使用道具
    usePropByKey(key, count = 1){
        let ret = false;
        if(this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] > 0){
            this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] -= count;
            if(this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] < 0) this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] = 0;
            ret = true;
        }
        else{
            if(this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] < 0) this.keyvalues[ELSProfile.KEYS.PROPS_COUNT][key] = 0;
            ret = false;
        }
        this.save();
        return ret;
    }
}
//! 保存在本地的属性定义
ELSProfile.KEYS = {
    MUSIC_MUTE: 'music_mute', //! 是否静音
    BLOCK_IDX: 'block_idx', //! 皮肤id
    SHARE_TIME_STAMP: 'share_time_stamp', //! 群分享时间戳
    PROPS_COUNT: 'props_count', //! 道具数量
};
ELSProfile.PROP_TYPES = {
    PROP_0: 0, //! 塌陷 锤子
    PROP_1: 1, //! 填充 火箭
};
ELSProfile._instance = null;
module.exports = ELSProfile;
