(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/main.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2c46fz8dppLeJnFfUxfHRah', 'main', __filename);
// script/main.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var nge = require("./core/engine.js");
var els = require("./core/els.js");
var model = require("./core/model.js");
var ElsGrid = require("./core/grid.js");
var ElsModel = model.ElsModel;
var ElsRender = require("./core/render.js");
var ElsTouch = require("./core/touch.js");
var ElsGame = require("./core/game.js").elsGame;
var ELSEvent = require("./core/ElsEvents.js");
var ELSProfile = require("./core/ELSProfile.js");
var ElsUtils = require("./core/ElsUtils.js");
// 皮肤数据类型
var SkinConfig = cc.Class({
    name: 'SkinConfig',
    properties: {
        skinName: '皮肤名字',
        localId: 0,
        serverId: 0,
        blocks: [cc.SpriteFrame]
    }
});

var MainGame = cc.Class({
    extends: cc.Component,

    properties: {

        gameCommon: cc.Node,
        hgNode: {
            default: null,
            type: cc.Node,
            displayName: "对[homepage]的引用"
        },

        saiNode: {
            default: null,
            type: cc.Node,
            displayName: "对[searchai]的引用"
        },

        gvsNode: {
            default: null,
            type: cc.Node,
            displayName: "对[game VS]的引用"
        },

        gleNode: {
            default: null,
            type: cc.Node,
            displayName: "对[game single]的引用"
        },

        helpNode: {
            default: null,
            type: cc.Node,
            displayName: "对[help]的引用"
        },

        rankNode: {
            default: null,
            type: cc.Node,
            displayName: "对[rank]的引用"
        },
        pause: cc.Node,
        prefabblock: cc.Prefab,
        prefabattack0: cc.Prefab,
        prefabattack1: cc.Prefab,
        blockConfigs: [SkinConfig],
        blockimgs: [cc.SpriteFrame],
        p_c: cc.Prefab,
        mask_label: cc.Prefab,
        prefabGiftAnimation: {
            default: null,
            type: cc.Prefab,
            displayName: "猫头鹰动画"
        },
        nodeYanHua: {
            default: null,
            type: cc.Node,
            displayName: '烟花粒子'
        },
        prefabCombo: {
            default: null,
            type: cc.Prefab,
            displayName: '连击动画预制件'
        },
        prefabRocketMoveParticle: {
            default: null,
            type: cc.Prefab,
            displayName: '火箭移动追随粒子'
        },
        prefabRocketMoveEndBoom: {
            default: null,
            type: cc.Prefab,
            displayName: "火箭爆炸"
        },
        prefabAimAtBlock: {
            default: null,
            type: cc.Prefab,
            displayName: '瞄准镜动画'
        },
        arrPropPlaceHolder: [cc.Node], //! 道具占位节点
        arrPropCount: [cc.Label], //! 道具数量
        nodeProp0: cc.Node,
        nodeProp1: cc.Node,
        nodeProp2: cc.Node, // 魔棒
        nodeProp3: cc.Node, // 冰弹
        nodeProp1Using: cc.Node,
        nodeProp2Effect: cc.Node,
        nodeProp0Effect: cc.Node,
        prefabProp0Effect: {
            default: null,
            type: cc.Prefab,
            displayName: "锤子特效预制件"
        },
        nodeMaticBottle: cc.Node,
        prefabGiftPropView: {
            default: null,
            type: cc.Prefab,
            displayName: "获取宝箱弹窗"
        },
        nodeMagicBottlePlaceHolder: cc.Node, //! 魔法瓶占位节点
        soundTag: cc.Node, // 音量标识
        nodePop: {
            default: null,
            type: cc.Node,
            displayName: '弹窗根结点'
        }, //! 弹窗根结点
        prefabZhuBaoAnimation: cc.Prefab //! 珠宝动画

    },

    onLoad: function onLoad() {
        this.allBlockSpriteFrames = [];
        this.loadRes();
        this.initZhuBaoAnimations();
        cc.director.setDisplayStats(true);
        els.CONFIG = els.CONFIG_LOCAL;

        tywx.NotificationCenter.listen("STATUS_CHANGE", this.onStatusChange, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.headAtlas = undefined;
        var self = this;
        cc.loader.loadRes("image/heads/heads", cc.SpriteAtlas, function (err, atlas) {
            self.headAtlas = atlas;
        });

        //注册UI
        tywx.UIManager.registerUI(els.ELS_GAME_LAYER.HOMEPAGE, this.hgNode, 'homePage');
        tywx.UIManager.registerUI(els.ELS_GAME_LAYER.GAME_COMMON, this.node, 'main');
        tywx.UIManager.registerUI(els.ELS_GAME_LAYER.GAME_SINGLE, this.gleNode, 'gameSinglemode');
        tywx.UIManager.registerUI(els.ELS_GAME_LAYER.GAME_VS, this.gvsNode, 'gameVSmode');
        tywx.UIManager.registerUI(els.ELS_GAME_LAYER.GAME_SEARCH_AI, this.saiNode, 'searchAIPage');
        tywx.UIManager.registerUI(els.ELS_GAME_LAYER.RANK, this.rankNode, 'rank');
        tywx.UIManager.registerUI(els.ELS_GAME_LAYER.HELP, this.helpNode);

        tywx.StarControl.init();
        //! 注册监听事件
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_FULL, this.showGiftProp, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_CUNSOME_ITEM_SUCCESS, this.onAddProp, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_ADD_ITEM_SUCCESS, this.onAddProp, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_UPDATE_BAG, this.onAddProp, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_HIDE_GIFT_PROP, this.hideGiftProp, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_ADD_MAGIC, this.addMagic, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_SHOW_MAGIC_ADD_EFFECT, this.showAddMagicEffect2, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_REFRESH_LOCAL_SKIN, this.onChangeBlocks, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_SHOW_GIFT_PROP_ANIMATION, this.onShowGiftPropAnimation, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_SHOW_CLEARN_ROW_EFFECT, this.onShowClearnRowEffect, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_REFRESH_ZHUBAO_COUNT, this.onShowAddZhuBaoEffect, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_SHOW_ICE_EFFECT, this.onUpdateIceBlock, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_ON_SHOW_ENDLESS_LEVEL_UP, this.onShowEndlessLevelUpEffect, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_ADD_ZHUBAO_ANIMATION, this.onAddZhuBaoAnimations, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_REFRESH_ZHUBAO_ANIMATION_POS, this.onRefreshZhuBaoAnimation, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_DELETE_ZHUBAO_ANIMATION, this.onDeleteZhuBaoAnimation, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_RESET_ZHUBAO_ANIMATION_POOL, this.resetZhuBaoAnimations, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_ENDLESS_SHOW_LEVEL_END, this.onEndelssShowLevelEnd, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_ENDLESS_ON_ZHUBAO_CHANGE, this.onEndlessZhuBaoChange, this);
        // tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_CUNSOME_ITEM_SUCCESS, this.consume_item_success,this);
    },
    onDestroy: function onDestroy() {
        //! 注销事件监听
        // tywx.NotificationCenter.ignore(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_FULL, this.showGiftProp,this);
        // tywx.NotificationCenter.ignore(ELSEvent.ELS_EVENT_ADD_PROP, this.onAddProp,this);
        // tywx.NotificationCenter.ignore(ELSEvent.ELS_EVENT_HIDE_GIFT_PROP, this.hideGiftProp,this);
        // tywx.NotificationCenter.ignore(ELSEvent.ELS_EVENT_ADD_MAGIC, this.addMagic,this);
        // tywx.NotificationCenter.ignore(ELSEvent.ELS_EVENT_SHOW_MAGIC_ADD_EFFECT, this.showAddMagicEffect2,this);
        tywx.NotificationCenter.ignoreScope(this);
    },
    loadRes: function loadRes() {
        this.allBlockSpriteFrames = new Map();
        this.allShadows = new Map();
        var self = this;
        cc.loader.loadResDir("image/blocks/", cc.SpriteFrame, function (err, assets, urls) {
            console.log('loadRes===>', err, assets, urls);
            console.log(_typeof(self.allBlockSpriteFrames[0]));
            assets.forEach(function (asset) {
                var name = asset.name;
                self.allBlockSpriteFrames.set(name, asset);
            });
            self.initBlockSkinConfig();
        });
    },
    initBlockSkinConfig: function initBlockSkinConfig() {
        var type = [0, 1, 2, 3]; ////[0,1,2,3,4];
        var idx = [0, 11];
        this.blockConfigs = [];
        for (var i = 0; i < type.length; i++) {
            var t = type[i];
            var tmp_skin_config = new SkinConfig();
            var block_frames = [];
            for (var j = 0; j <= 10; j++) {
                var str_format = "b_" + t + "_" + j;
                if (this.allBlockSpriteFrames.has(str_format)) {
                    block_frames.push(this.allBlockSpriteFrames.get(str_format));
                } else {
                    console.log('initBlockSkinConfigError===>', str_format);
                }
            }
            for (var k = 0; k <= 8; k++) {
                var _str_format = "shadow" + k;
                if (this.allBlockSpriteFrames.has(_str_format)) {
                    block_frames.push(this.allBlockSpriteFrames.get(_str_format));
                } else {
                    console.log('initBlocksSkinConfigError===>', _str_format);
                }
            }
            tmp_skin_config.blocks = block_frames;
            tmp_skin_config.localId = type;
            this.blockConfigs.push(tmp_skin_config);
        }
        this.blockimgs = this.blockConfigs[0].blocks;
        console.log('main/initBlockSkinConfig', this.blockConfigs);
        // TODO: 初始皮肤
        var _pf = parseInt(ElsUtils.loadItem("els_select_pifu", 201)) - 201;
        this.onChangeBlocks({ "idx": _pf });

        this.initZhuBaoFrames();
    },

    /**
     * 初始化珠宝Frames
     */
    initZhuBaoFrames: function initZhuBaoFrames() {
        this.zhuBaoFrames = [];
        for (var i = 0; i < 3; i++) {
            var frame_name = "zhubao_" + i;
            if (this.allBlockSpriteFrames.has(frame_name)) {
                this.zhuBaoFrames.push(this.allBlockSpriteFrames.get(frame_name));
            }
        }
    },

    /**
     * * 初始化珠宝动画
     * ! 初始化珠宝动画缓存池
     */
    initZhuBaoAnimations: function initZhuBaoAnimations() {
        if (this.zhubaoAnimations && this.zhubaoAnimations.length > 0) {
            this.zhubaoAnimations.forEach(function (e) {
                e.destroy();
            });
        }
        this.zhubaoAnimations = [];
        this.createNewZhuBaoAnimations();
    },

    /**
     * * 创建新的珠宝动画
     * ! 每次只创建3个
     */
    createNewZhuBaoAnimations: function createNewZhuBaoAnimations() {
        var self = this;
        // let loadCallback = (err,prefab)=>{
        //     if(err) cc.err(err);
        //     else{
        //         let ani = cc.instantiate(prefab);
        //         ani.parent = this.node.getChildByName('render_effect');
        //         ani.active = false;
        //         self.zhubaoAnimations.push(ani);
        //     }
        // };
        //! 每次创建只增加三个
        for (var i = 0; i < 3; i++) {
            //cc.loader.loadRes('prefab/els_view_zhubao',cc.Prefab,loadCallback);       
            var ani = cc.instantiate(this.prefabZhuBaoAnimation);
            ani.parent = this.node.getChildByName('render_effect');
            ani.active = false;
            self.zhubaoAnimations.push(ani);
        }
    },

    /**
     * * 从珠宝缓存池中获取没有被使用的珠宝
     *
     * @returns {Object} 珠宝动画实例
     */
    getZhuBaoAnimation: function getZhuBaoAnimation() {
        var ret = null;
        if (this.zhubaoAnimations.length > 0) {
            ret = this.zhubaoAnimations[0];
            this.zhubaoAnimations.splice(0, 1);
        }
        //! 提前创建，保持缓存池总能取到
        if (this.zhubaoAnimations.length <= 2) {
            this.createNewZhuBaoAnimations();
        }
        return ret;
    },

    /**
     * 
     * @param {Number} row 
     * @param {Number} col 
     * @return {Object}
     */
    getZhuBaoAnimationByRowAndCol: function getZhuBaoAnimationByRowAndCol(row, col) {
        var ret = null;
        var key = row + "_" + col;
        this.zhubaoAnimationMap = this.zhubaoAnimationMap || new Map();
        if (this.zhubaoAnimationMap.has(key)) {
            ret = this.zhubaoAnimationMap.get(key);
        } else {
            ret = this.getZhuBaoAnimation();
            this.zhubaoAnimationMap.set(key, ret);
        }
        ret.active = true;
        return ret;
    },

    /**
     * * 重置珠宝动画缓存池
     * ! 将使用中的珠宝动画全部添加到没有使用的数组中
     */
    resetZhuBaoAnimations: function resetZhuBaoAnimations() {
        var _this = this;

        //console.log(`resetZhuBaoAnimations==>${this.zhubaoAnimationMap.size()}===>${this.zhubaoAnimationMap}`);        
        this.zhubaoAnimationMap = this.zhubaoAnimationMap || new Map();
        this.zhubaoAnimationMap.forEach(function (v, k) {
            _this.zhubaoAnimations.push(v);
            v.active = false;
        });
        this.zhubaoAnimationMap.clear();
        //console.log(`resetZhuBaoAnimations==>${this.zhubaoAnimationMap.size()}===>${this.zhubaoAnimationMap}`);
    },

    /**
     * * 添加珠宝动画
     *
     * @param {Object} params
     * @param {Number} params.row
     * @param {Number} params.col
     * @param {Number} params.type
     */
    onAddZhuBaoAnimations: function onAddZhuBaoAnimations(params) {
        console.log("onAddZhuBaoAnimations===>" + params);
        var zhubao = this.getZhuBaoAnimationByRowAndCol(params.row, params.col);
        zhubao.getComponent('els_view_block').showZhuBaoAnimationByIdx(params.type - 112);
        zhubao.position = this.blocks[0][params.row][params.col].rawpos;
        var game = tywx.UIManager.game;
        zhubao.active = game.model.endless_level === 1;
        console.log("onAddZhuBaoAnimations===>" + params, zhubao, zhubao.position);
    },
    onEndelssShowLevelEnd: function onEndelssShowLevelEnd() {
        this.zhubaoAnimationMap = this.zhubaoAnimationMap || new Map();
        this.zhubaoAnimationMap.forEach(function (v, k) {
            //this.zhubaoAnimations.push(v);
            v.active = true;
        });
    },

    /**
     * * 刷新珠宝动画位置
     * ！即将废弃
     * @param {Object} params
     * @param {Number} params.row
     * @param {Number} params.col
     * @param {Number} params.type
     * @param {bool} params.is_down
     */
    onRefreshZhuBaoAnimation: function onRefreshZhuBaoAnimation(params) {
        var zhubao = this.getZhuBaoAnimationByRowAndCol(params.row, params.col);
        var n_row = params.is_down ? params.row - 1 : params.row + 1;
        var n_key = n_row + "_" + params.col;
        console.log("onRefreshZhuBaoAnimation==>" + n_row + "," + n_key);
        if (!this.zhubaoAnimationMap.has(n_key)) {
            this.zhubaoAnimationMap.set(n_key, zhubao);
            this.zhubaoAnimationMap.delete(params.row + "_" + params.col);
            zhubao.position = this.blocks[0][n_row][params.col].rawpos;
        } else {
            throw new Error('onRefreshZhuBaoAnimation');
        }
    },

    /**
     * * 删除珠宝动画
     *
     * @param {Object} params
     * @param {Number} params.row
     * @param {Number} params.col
     * @param {Number} params.type
     */
    onDeleteZhuBaoAnimation: function onDeleteZhuBaoAnimation(params) {
        var zhubao = this.getZhuBaoAnimationByRowAndCol(params.row, params.col);
        zhubao.active = false;
        this.zhubaoAnimationMap.delete(params.row + "_" + params.col);
        this.zhubaoAnimations.push(zhubao);
    },

    /**
     * * 珠宝发生变化回调
     *
     * @param {Array} zhubao_arr [{type:number,row:number,col:number}]
     */
    onEndlessZhuBaoChange: function onEndlessZhuBaoChange(zhubao_arr) {
        // ? shadow作为是否显示的标识，后面考虑是否加一个变量来控制
        if (!this.shadow.active) return;
        this.resetZhuBaoAnimations();
        var zhubao_datas = zhubao_arr;
        for (var i = 0; i < zhubao_datas.length; i++) {
            var tmp_data = zhubao_datas[i];
            var tmp_zhubao_ani = this.getZhuBaoAnimationByRowAndCol(tmp_data.row, tmp_data.col);
            tmp_zhubao_ani.position = this.blocks[0][tmp_data.row][tmp_data.col].rawpos;
            tmp_zhubao_ani.getComponent('els_view_block').showZhuBaoAnimationByIdx(tmp_data.type - 112);
        }
    },

    /**
     * 皮肤更新事件
     *
     * @param {Object} params  params.idx 本地皮肤id
     */
    onChangeBlocks: function onChangeBlocks(params) {
        var idx = params.idx || 0;
        var s2l = {
            0: 0,
            1: 2,
            2: 3,
            3: 1
        };
        idx = s2l[idx];
        if (idx >= this.blockimgs.length) idx = 0;
        this.blockimgs = this.blockConfigs[idx].blocks;
    },


    init: function init() {
        this.lbl_next = this.node.getChildByName('next');
        this.lbl_hold = this.node.getChildByName('hold');
        //this.yanhua = this.node.getChildByName("yanhua");
        this.yanhua = this.nodeYanHua;
        this.backmask = this.node.getChildByName('backmask');

        // this.game_mask = this.gleNode.getChildByName('game_mask');
        // this.mask_btn = this.game_mask.getChildByName('mask_btn');
        // this.mask_btn.on(cc.Node.EventType.TOUCH_END, this.mask_btn_click, this);

        this.add5step = this.gleNode.getChildByName('add5step');
        this.add5step.opacity = 0;
        this.share5line = this.gvsNode.getChildByName('share-5');
        //        this.share5line.opacity = 0;
        this.share5line.active = false;
        this.share5step = this.gleNode.getChildByName('share+5');
        this.share5line.active = false;
        //        this.share5step.opacity = 0;
        //* 添加spine动画
        this.animShare5Line = cc.instantiate(this.prefabGiftAnimation);
        this.animShare5Line.getComponent('shareGiftAnimationView').init('分享到群\n减5行');
        this.animShare5Line.parent = this.share5line;

        this.animShare5Step = cc.instantiate(this.prefabGiftAnimation);
        this.animShare5Step.getComponent('shareGiftAnimationView').init('分享到群\n加5步');
        this.animShare5Step.parent = this.share5step;
        //暂停面板
        this.pause = this.pause; //this.node.getChildByName('pause');

        this.lbl_time = this.node.getChildByName('time');
        this.lbl_antiscore = this.node.getChildByName('lbl_antiscore');
        this.lbl_progress = this.node.getChildByName('lbl_progress');
        this.lbl_title = this.node.getChildByName('lbl_title');
        this.lbl_myscore = this.node.getChildByName('lbl_myscore');
        this.lbl_endless_score = this.node.getChildByName('lbl_endless_score');
        this.back = this.node.getChildByName('back');

        this.maintips = this.node.getChildByName('maintips');

        this.shadow = this.node.getChildByName('shadow');
        this.shadow.scale = 9.8 / els.HENG;
        this.mask = this.node.getChildByName('mask');
        //this.ad = this.node.getChildByName('ad');
        this.timestep = this.node.getChildByName('timestep');
        this.combo = [];
        this.combo[0] = this.node.getChildByName('combo0');
        this.combo[1] = this.node.getChildByName('combo1');
        //生成精灵
        this.node.getChildByName('back').removeAllChildren();
        this.blocks = [[], []];
        for (var n = 0; n < 2; n++) {
            for (var i = 0, il = els.ZONG; i < il; i++) {
                this.blocks[n][i] = new Array(els.HENG + 1);
                for (var j = 0, jl = els.HENG + 1; j < jl; j++) {
                    var c = cc.instantiate(this.prefabblock);
                    this.blocks[n][i][j] = c;
                    var scale = n == 0 ? 6.6 / els.HENG : 2.4 / els.HENG;
                    var bsize = 72 * scale + 2;
                    c.scale = scale;
                    c.rawscale = c.scale;
                    this.setBlkColor(c, 0, 8);
                    //自己方块区域
                    if (n == 0) {
                        c.position = cc.v2(216 + (j + 0.5) * bsize, 215 + (i + 0.5) * bsize); //自己202
                        c.rawpos = c.position;
                    }
                    if (n == 1) {
                        c.position = cc.v2(14 + (j + 0.5) * bsize, 796 + (i + 0.5) * bsize); //AI  796
                        c.rawpos = c.position;
                    }
                    c.parent = this.node.getChildByName('back');
                }
            }
        }
        this.ice_blocks = [];
        var self = this;
        cc.loader.loadRes("prefab/ice_block", function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            for (var j = 0, jl = els.HENG; j < jl; j++) {
                var c = cc.instantiate(preFabNode);
                self.ice_blocks[j] = c;
                var scale = 6.6 / els.HENG;
                var bsize = 72 * scale + 2;
                c.scale = scale;
                c.rawscale = c.scale;
                c.opacity = 0;
                c.position = cc.v2(216 + (j + .5) * bsize, 215 + .5 * bsize);
                c.rawpos = c.position;
                c.parent = self.node.getChildByName("render_effect");
            }
        });
        this.holdnext = [[], [], []];
        var by = [295, 530, 430];
        for (var n = 0; n < 3; n++) {
            for (var i = 0; i < 4; i++) {
                this.holdnext[n][i] = new Array(4);
                for (var j = 0; j < 4; j++) {
                    var c = cc.instantiate(this.prefabblock);
                    this.holdnext[n][i][j] = c;
                    c.scale = 0.18;
                    var bsize = 72 * c.scale + 2;
                    this.setBlkColor(c, 50, 10);
                    //这里是左边方块的坐标
                    c.position = cc.v2(72 + (j + 0.5) * bsize, 170 + by[n] - (i + 0.5) * bsize);
                    c.parent = this.node.getChildByName('back');
                }
            }
        }
        //attack...
        this.node.getChildByName('anim').removeAllChildren();
        this.attani = [[[], [], [], [], []], [[], [], [], [], []]];
        var scaletail = [2.0, 1.5, 1.35, 1.2, 1.05, 0.9];
        var op = [255, 255, 220, 190, 160, 130];
        for (var n = 0; n < 2; n++) {
            for (var i = 0; i < 5; i++) {
                this.attani[n][i] = new Array(6);
                for (var j = 0; j < 6; j++) {
                    var c = j == 0 ? cc.instantiate(this.prefabattack0) : cc.instantiate(this.prefabattack1);
                    this.attani[n][i][j] = c;
                    c.scale = scaletail[j];
                    c.opacity = op[j];
                    c.getComponent(cc.Sprite).setVisible(false);
                    c.parent = this.node.getChildByName('anim');
                }
            }
        }
        //! 魔法瓶特效
        this.magicAni = [];
        for (var _n = 0; _n < 40; _n++) {
            var _c = _n % 2 === 0 ? cc.instantiate(this.prefabattack0) : cc.instantiate(this.prefabattack1);
            this.magicAni.push(_c);
            _c.opacity = 180;
            _c.active = false;
            _c.parent = this.node.getChildByName('anim');
        }

        this.nodeProp1Using.active = false;
        this.nodeProp2Effect.active = false;
    },

    // 更新
    onUpdateIceBlock: function onUpdateIceBlock(step) {
        step = step > 5 ? 5 : step;
        var op = step > 0 ? step * 30 : 0;
        this.ice_blocks.forEach(function (item) {
            item.opacity = op;
        });
    },
    start: function start() {
        this.init();
        this.singleView = this.gleNode.getComponent("gameSinglemode");
        this.vsView = this.gvsNode.getComponent("gameVSmode");

        var m = new ElsModel(ElsGrid);
        var r = new ElsRender();
        var game = new ElsGame(m, r);
        var tou = new ElsTouch(game);
        this.tou = tou;
        m.tou = tou;
        game.initGame(this.node, 0, parseInt(Math.random() * 10000));

        m.setGameStatus(els.ELS_GAME_STATE.HOMEPAGE);
        this.game = game;
        tywx.UIManager.init(this.game);

        //help1st 0:show 1:hidden
        game.model.begin_help1st = -1;
        //0: 初始化 1:动画
        game.model.begin_cd = -1;
        //监控 胜利界面的例子动画
        game.model.begin_win_partical = -1;

        /// 去掉轮播
        if (parseInt(game.loadItem("ELS_HELP1ST", 0)) === 0) game.model.needhelp1st = false; //game.model.needhelp1st = true;
        else game.model.needhelp1st = false;
        game.model.pkstar = parseInt(game.loadItem("ELS_PKSTAR", 0));
        game.model.pkstar = !game.model.pkstar ? 0 : game.model.pkstar;
        game.updatePKStar(0);
        this.frametime = 0;
        nge.run(this.game);

        tywx.UIManager.showUI(els.ELS_GAME_LAYER.HOMEPAGE, null, false);

        this.getWXUserInfo();
        this.getFriendCloudStorage();

        this.magicBottle = this.nodeMaticBottle.getComponent('MagicBottleView');
        if (this.magicBottle) {
            this.magicBottle.reset();
            this.magicBottle.init(this.game);
        }

        this.refreshPropCount();
        //! init gift box
        this.gift_view = cc.instantiate(this.prefabGiftPropView);
        this.gift_view.parent = this.nodePop;
        this.gift_view.active = false;

        // init prop magic wand animation
        var ani_magic_wand = this.nodeProp2Effect.getComponent(cc.Animation);
        var self = this;
        ani_magic_wand.on('finished', function (num, string) {
            console.log('ani_magic_wand finished', num, string);
            self.nodeProp2Effect.active = false;
            self.game.model.mgrid[0].clearnBottomLinesByCount(1);
        }, this);
        // this.nodePop.getChildByName("tcp_node").getComponent("tcp_node").game_show();
        this.checkReward();
        //this.refreshSoundTag();

        cc.loader.loadRes('prefab/OpenData', function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            // preFabNode.parent = self.node;
            self.node.insertChild(preFabNode, 0);
            self.beyondOpenData = preFabNode;
        });
    },

    // 检查 奖励:: 1.悄悄话 2.每日
    checkReward: function checkReward() {
        // 每日登陆奖励
        if (!tywx.UserInfo.loginReward) return;
        if (tywx.UserInfo.loginReward.get === 1) {
            // 2
            var self = this;
            cc.loader.loadRes('prefab/els_view_daliy_login', cc.Prefab, function (err, prefab) {
                if (err) cc.error(err.message || err);else {
                    var daily_login = cc.instantiate(prefab);
                    daily_login.getComponent('els_view_daliy_login').init();
                    daily_login.parent = self.nodePop;
                }
            });
        }
    },
    showAddMagicEffect2: function showAddMagicEffect2() {
        console.log('show add magic effect ===> main');
        this.magicBottle.showAddMagicEffect();
    },
    getNextUserInfo: function getNextUserInfo() {
        tywx.next_current_stage_user = undefined;
        tywx.next_pk_user = undefined;
        var getdat = function getdat(_type, data) {
            if (!data) {
                return undefined;
            }
            var d = undefined;
            for (var i = 0; i < data.length; i++) {
                if (data[i].key == _type) {
                    d = data[i].value;
                }
            }
            return parseInt(d);
        };

        for (var i = 0; i < this.pk_star_data.length; i++) {
            var t = this.pk_star_data[i];
            if (t.nickname == tywx.WXUserInfo.nickName && t.avatarUrl == tywx.WXUserInfo.avatarUrl) {
                tywx.UserRankData = t;
            }
        }
        var next_pk_star_data = undefined;
        var next_current_stage = undefined;
        var user_data = tywx.UserRankData.KVDataList.length > 0 ? tywx.UserRankData.KVDataList : undefined;

        for (var _i = 0; _i < this.pk_star_data.length; _i++) {
            var _t = this.pk_star_data[_i];
            var data = _t.KVDataList.length > 0 ? _t.KVDataList : undefined;

            if (getdat("ELS_PKSTAR", data) > getdat("ELS_PKSTAR", user_data)) {
                if (!next_pk_star_data) {
                    next_pk_star_data = data;
                    tywx.next_pk_user = _t;
                }
                if (getdat("ELS_PKSTAR", data) < getdat("ELS_PKSTAR", next_pk_star_data)) {
                    next_pk_star_data = data;
                    tywx.next_pk_user = _t;
                }
            }

            if (getdat("ELS_CURRENT_STAGE2", data) > getdat("ELS_CURRENT_STAGE2", user_data)) {
                if (!next_current_stage) {
                    next_current_stage = data;
                    tywx.next_current_stage_user = _t;
                }
                if (next_current_stage && getdat("ELS_CURRENT_STAGE2", data) < getdat("ELS_CURRENT_STAGE2", next_current_stage)) {
                    next_current_stage = data;
                    tywx.next_current_stage_user = _t;
                }
            }
        }
        console.log("getNextUserInfo");
    },
    getFriendCloudStorage: function getFriendCloudStorage(cal) {
        try {
            var self = this;
            tywx.OpenDataContextUtil.getFriendCloudStorage(['ELS_PKSTAR', 'ELS_CURRENT_STAGE2'], function (para) {
                //console.log(JSON.stringify(para));
                self.pk_star_data = para;
                self.getNextUserInfo();
                if (cal) {
                    cal();
                }
            }, function (para) {
                console.log(JSON.stringify(para));
            });
        } catch (e) {}
    },
    getWXUserInfo: function getWXUserInfo() {
        try {
            var self = this;
            tywx.OpenDataContextUtil.getUserInfo(function (ret) {
                console.log("ret-->" + ret);
                tywx.WXUserInfo = ret[0];
                self.getFriendCloudStorage();
            }, function (ret) {
                console.log(ret);
            });
        } catch (e) {
            tywx.WXUserInfo = undefined;
        }
    },
    refreshBgAdapter: function refreshBgAdapter() {
        //if()
    },


    onStatusChange: function onStatusChange(status) {
        switch (status) {
            case els.ELS_GAME_STATE.PLAYING:
                this.refreshShow(this.game.model.mconf.mode);
                break;
            case els.ELS_GAME_STATE.RESULT_LOSE:
                this.showGameLost();
                break;
            case els.ELS_GAME_STATE.RESULT_WIN:
                this.showGameWin();
                break;
            case els.ELS_GAME_STATE.KEEPSTAR:
                this.vsView.showKeepStar();
                break;
            case els.ELS_GAME_STATE.SEARCH_AI:
                tywx.UIManager.showUI(els.ELS_GAME_LAYER.GAME_SEARCH_AI);
                break;
            case els.ELS_GAME_STATE.SHOW_REVIVE:
                this.singleView.showRevive();
                break;
        }
    },

    emergencyShare: function emergencyShare() {
        this.game.emergencyShare();
    },

    showGameLost: function showGameLost() {
        if (this.game.model.mconf.mode === els.ELS_MODE_SINGLE) {
            //this.magicBottle.reset();
            this.singleView.showLose();
        } else {
            this.vsView.showLose();
        }
    },

    showGameWin: function showGameWin() {
        if (this.game.model.mconf.mode === els.ELS_MODE_SINGLE) {
            //this.magicBottle.reset();
            this.singleView.showWin();
        } else {
            this.vsView.showWin();
        }
    },

    btnPause: function btnPause() {
        if (this.game.model.getGameStatus() === els.ELS_GAME_STATE.PLAYING) {
            this.pause.active = true;
            this.game.pauseGame();
            this.refreshSoundTag();
        }
    },

    btnContinue: function btnContinue() {
        this.pause.active = false;
        this.game.continueGame();
    },

    btnBackToHome: function btnBackToHome() {
        this.pause.active = false;
        tywx.UIManager.hideAllUI();
        this.game._backToHomePage();
        tywx.UIManager.showUI(els.ELS_GAME_LAYER.HOMEPAGE);
    },
    touchStart: function touchStart(event) {
        var t1 = event.getLocation();
        var temp = this.node.convertToNodeSpace(t1);
        this.tou.began(temp.x, temp.y);
    },
    touchMove: function touchMove(event) {
        var t1 = event.getLocation();
        var temp = this.node.convertToNodeSpace(t1);
        this.tou.moved(temp.x, temp.y);
    },
    touchEnd: function touchEnd(event) {
        var t1 = event.getLocation();
        var temp = this.node.convertToNodeSpace(t1);
        this.tou.ended(temp.x, temp.y);
    },
    update: function update(dt) {
        this.frametime += dt;
        if (this.frametime >= 0.02) {
            this.frametime = 0;
            nge.run(this.game);
        }
    },
    setBlkColor: function setBlkColor(c, op, idx, scale, r) {
        var cmap = [0, 9, 1, 2, 3, 4, 5, 6, 7, 8, 0, 0];
        if (c.rawpos) c.position = c.rawpos;
        if (c.rawscale) c.scale = c.rawscale;
        c.opacity = op;
        c.rotation = 0 || r;
        c.scale = c.scale || c.scale * scale;
        if (ElsUtils.isZhubao(idx + 100)) {
            /// 珠宝
            c.getComponent('cc.Sprite').spriteFrame = this.zhuBaoFrames[idx - 12]; //
            //let zhubao_ani = this.getZhuBaoAnimation();
            //zhubao_ani.getComponent('els_view_block').showZhuBaoAnimationByIdx(idx - 12);
        } else {
            c.getComponent('cc.Sprite').spriteFrame = this.blockimgs[cmap[idx]];
        }
    },


    refreshShow: function refreshShow(mode) {
        this.pause.active = false;
        if (mode !== els.ELS_MODE_SINGLE) {
            this.timestep.getComponent('cc.Label').string = '时间';
            this.nodeProp0.active = false;
            this.nodeProp1.active = false;
            this.nodeProp2.active = false;
            this.nodeProp3.active = false;
            this.nodeMaticBottle.active = false;
            this.onUpdateIceBlock(0);
        } else {
            this.timestep.getComponent('cc.Label').string = '剩余步数';
            this.nodeProp0.active = true;
            this.nodeProp1.active = true;
            if (this.game.model.mconf.isEndless) {
                this.nodeProp3.active = true;
                this.nodeProp2.active = false;
            } else {
                this.nodeProp2.active = true;
                this.nodeProp3.active = false;
                this.onUpdateIceBlock(0);
            }
            this.nodeMaticBottle.active = true;
        }
    },

    /**
     * 展示连击动画
     * 
     * @param {int} combo_count
     */
    showCombo: function showCombo(combo_count) {
        var combo = cc.instantiate(this.prefabCombo);
        combo.parent = this.node;
        combo.position = cc.p(400, 840);
        combo.getComponent('ComboAnimation').init(true, combo_count);
    },


    /**
     * 播放消除动画
     * 
     * @param {int} clear_count 消除的行数
     */
    showClearAnimation: function showClearAnimation(clear_count) {
        console.log('showClearAnimation', clear_count);
        var combo = cc.instantiate(this.prefabCombo);
        combo.parent = this.node;
        combo.position = cc.p(420, 840);
        combo.getComponent('ComboAnimation').init(false, clear_count);
    },
    showBeyondNode: function showBeyondNode(_type) {
        if (!_type) {
            return;
        }
        this.beyondOpenData.getComponent("OpenData").showBeyond(_type);
    },
    hidenBeyondNode: function hidenBeyondNode() {},


    //! 使用塌陷道具
    usePropSink: function usePropSink() {
        if (this.usePropByKey(ELSProfile.PROP_TYPES.PROP_0)) {
            this.refreshPropCount();
            var self = this;
            var cb = function cb() {
                self.game.sinkAllCol(0);
            };
            this.showHammerEffect(0, cb);
        } else {
            //! 使用道具失败
        }
    },

    //! 使用火箭道具
    usePorpRocket: function usePorpRocket() {
        if (this.usePropByKey(ELSProfile.PROP_TYPES.PROP_1)) {
            this.refreshPropCount();
            var datas = this.game.fillRandomBlock(0, 5);
            this.showRocketEffectByData(0, datas);
        } else {
            //! 使用道具失败
        }
    },
    showRocketEffectByData: function showRocketEffectByData(usr_idx, datas) {
        var _this2 = this;

        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_SET_MAGIC_BUSY, true);
        this.nodeProp1Using.active = true;
        var self = this;
        var ani_count = 0;
        var end_cb = function end_cb() {
            ani_count--;
            if (ani_count <= 0) {
                self.nodeProp1Using.active = false;
                self.game.clearnRow(usr_idx);
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_SET_MAGIC_BUSY, false);
            }
        };
        this.game.model.playMusic(els.ELS_VOICE.DAODAN_MUSIC, false);

        var _loop = function _loop(data) {
            console.log(data);
            var x = data[0];
            var y = parseInt((data[1] - 2 - x) / els.GRIDW);

            var nodeBlock = _this2.blocks[usr_idx][els.ZONG - y - 1][x];
            var prop_pos = _this2.arrPropPlaceHolder[1];
            var parent = _this2.node.getChildByName('back');
            //! 1.显示瞄准镜; 2. 移动动画; 3. 爆裂动画，同时显示
            var aimAt = cc.instantiate(_this2.prefabAimAtBlock);
            aimAt.parent = parent;
            aimAt.position = nodeBlock.position;

            var rocketMove = cc.instantiate(_this2.prefabRocketMoveParticle);
            rocketMove.parent = parent;
            rocketMove.position = prop_pos.position;
            var moveEndCB = function moveEndCB() {
                rocketMove.removeFromParent();
                aimAt.removeFromParent();
                var boom = cc.instantiate(_this2.prefabRocketMoveEndBoom);
                boom.parent = parent;
                boom.position = nodeBlock.position;
                boom.runAction(cc.sequence(cc.callFunc(function () {
                    self.game.fillGridByIndex(usr_idx, data[1]);
                }), cc.delayTime(0.1), cc.callFunc(end_cb), cc.removeSelf()));
            };
            rocketMove.runAction(cc.sequence(cc.moveTo(0.5, nodeBlock.position), cc.callFunc(moveEndCB)));
            ani_count++;
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = datas[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var data = _step.value;

                _loop(data);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    },
    showHammerEffect: function showHammerEffect(usr_idx, cb) {
        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_SET_MAGIC_BUSY, true);
        var effect = cc.instantiate(this.prefabProp0Effect);
        effect.parent = this.nodeProp0Effect;
        var ani = effect.getComponent(cc.Animation);
        var self = this;
        this.game.model.playMusic(els.ELS_VOICE.CHUI_MUSIC, false);
        this.showClearnTopCol(0.3);
        ani.on('finished', function (num, string) {
            console.log('hammer finished', num, string);
            //! 回调
            if (cb) cb();
            effect.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(function () {
                self.game.clearnRow(usr_idx);
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_SET_MAGIC_BUSY, false);
            }), cc.removeSelf()));
        }, this);
    },
    showGiftProp: function showGiftProp() {
        var self = this;
        setTimeout(function () {
            // if(self.game.model.getGameStatus() !== els.ELS_GAME_STATE.PLAYING){
            //     return;
            // }
            //self.game.pauseGame();
            if (!self.gift_view) {
                self.gift_view = cc.instantiate(self.prefabGiftPropView);
                self.gift_view.parent = self.nodePop;
                self.gift_view.getComponent('els_gift_prop_view').init(self.game);
                self.gift_view.getComponent('els_gift_prop_view').showGiftBox();
            } else {

                self.gift_view.getComponent('els_gift_prop_view').init(self.game);
                self.gift_view.getComponent('els_gift_prop_view').showGiftBox();
                self.gift_view.active = true;
            }
        }, 1000);
    },
    hideGiftProp: function hideGiftProp() {
        this.game.continueGame();
        this.gift_view.active = false;
    },

    //! {type:0,num:1}
    onAddProp: function onAddProp() {
        console.log('onAddProp');
        //! 更新数据
        //ELSProfile.getInstance().addPropByKey(param.type,param.num);
        // let prop_num = this.game.loadItem(`prop_${param.type}`,els.PROP_DEAFULT_VALUE);
        // this.game.saveItem(`prop_${param.type}`,parseInt(prop_num) + param.num);
        //! 刷新显示
        this.refreshPropCount();
    },
    getPropByKey: function getPropByKey(key) {
        var prop_key = "prop_" + key;
        return this.game.loadItem(prop_key, els.PROP_DEAFULT_VALUE);
    },
    usePropByKey: function usePropByKey(_, _key) {
        // this.do_consume_item(0);
        // return;
        //! 没有连接到服务器或者SDK登陆失败，不能使用道具
        if (tywx.TCPClient.connectStatus !== tywx.TCPClient.CONNECT_STATUS_OK || tywx.UserInfo.userId === 0) {
            wx.showToast({
                title: '网络异常',
                duration: 1000
            });
            return;
        }
        var key = parseInt(_key);
        if (key === 0 && tywx.UserInfo.getPropCountByKey(key) === 0) {
            // 锤子数目为0
            this.showUnlockUI();
            return;
        }
        if (tywx.MSG.consumeItem(tywx.UserInfo.local2Server(key))) {
            this.do_consume_item(key);
            this.refreshPropCount();
        }
    },
    showUnlockUI: function showUnlockUI() {
        var self = this;
        cc.loader.loadRes('prefab/unlock', function (err, prefab) {
            self.game.pauseGame();
            var preFabNode = cc.instantiate(prefab);
            preFabNode.parent = tywx.UIManager.getCurrentUI();
        });
    },


    //! 刷新道具数量
    refreshPropCount: function refreshPropCount() {
        for (var i = 0; i < this.arrPropCount.length; i++) {
            var tmp_count = this.arrPropCount[i];
            var prop_num = tywx.UserInfo.getPropCountByKey(i);
            tmp_count.string = "" + prop_num;
            console.log('refreshPropCount', "x" + prop_num);
        }
    },
    addMagic: function addMagic(value) {
        if (this.game.model.mconf.mode !== els.ELS_MODE_SINGLE) return;
        this.magicBottle.addMagic(value);
    },
    showAddMagicEffect: function showAddMagicEffect() {
        //! 闯关模式才有魔法瓶和道具
        //if(this.game.model.mconf.mode !== els.ELS_MODE_SINGLE) return;
        var end_pos = this.nodeMagicBottlePlaceHolder.position;
        var self = this;
        var count = 0;
        var animation_cb = function animation_cb(target) {
            target.active = false;
            count--;
            if (count === 0) {
                //self.magicBottle.showAddMagicEffect();
            }
        };

        var fr = this.game.model.mgrid[0].mcore.fullrows;
        for (var i = 0; i < fr.length; i++) {
            for (var j = 0; j < els.HENG; j++) {
                if (count >= this.magicAni.length) return;
                var e = this.magicAni[count];
                var b = this.blocks[0][i][j];
                e.position = b.rawpos;
                e.active = true;
                count++;
                e.runAction(cc.sequence(cc.delayTime(0.2 * Math.random()), cc.spawn(cc.rotateBy(0.5, 1800), cc.moveTo(0.5, end_pos)), cc.callFunc(animation_cb, e)));
            }
        }
    },

    /**
     * 使用魔法棒
     *
     */
    onUseMagicWand: function onUseMagicWand() {
        console.log('onUseMagicWand');
        this.nodeProp2Effect.active = true;
        var ani = this.nodeProp2Effect.getComponent(cc.Animation);
        if (ani) {
            ani.play();
        }
    },
    onUseIceB: function onUseIceB() {
        console.log("use ice bom");
        this.game.setFreezeStep();
        this.onUpdateIceBlock(5);
    },


    // 消耗道具成功
    consume_item_success: function consume_item_success(params) {
        var self = this;
        var _items = params.result.items;
        _items.forEach(function (_item) {
            var _type = tywx.UserInfo.server2local(_item.itemId);
            self.do_consume_item(_type);
        });
    },
    do_consume_item: function do_consume_item(_type) {
        if (_type === 3) {
            // 冰弹
            this.onUseIceB();
        }
        if (_type === 2) {
            // 魔法棒
            this.onUseMagicWand();
        }
        if (_type === 1) {
            // 火箭
            var datas = this.game.fillRandomBlock(0, 5);
            this.showRocketEffectByData(0, datas);
        }
        if (_type === 0) {
            // 锤子
            var self = this;
            var current_endless = this.game.model.endless_level;
            var is_endless = this.game.model.mconf.isEndless;
            var cb = function cb() {
                var t_endless = self.game.model.endless_level;
                if (is_endless && t_endless === current_endless) {
                    self.game.sinkAllCol(0);
                }
                if (!is_endless) self.game.sinkAllCol(0);
            };
            this.showHammerEffect(0, cb);
        }
    },
    showClearnTopCol: function showClearnTopCol() {
        var delay_time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;

        var pg = this.game.model.mgrid[0];
        var ct = pg.mcore.col_top;
        var parent = this.node.getChildByName('back');
        var self = this;
        var delayTime = delay_time;
        for (var i = 0; i < ct.length; i++) {
            var r = els.ZONG - ct[i];
            var idx = r * els.GRIDW + i + 2;
            if (pg.mcore.grid[idx] > 100 && pg.mcore.grid[idx] !== 200) {
                //! 1.显示瞄准镜
                var c = this.blocks[0][ct[i] - 1][i];
                var _aimAt = cc.instantiate(this.prefabAimAtBlock);
                _aimAt.parent = parent;
                _aimAt.position = c.position;
                _aimAt.runAction(cc.sequence(cc.delayTime(delayTime), cc.removeSelf()));
            }
        }

        setTimeout(function () {
            self.game.usePopMagicWand(0);
        }, delayTime * 1000 / 2);
    },


    /**
     * 帮助
     */
    onHelpHandler: function onHelpHandler() {
        tywx.UIManager.showUI(els.ELS_GAME_LAYER.HELP);
    },


    /**
     * 音量反选
     */
    unSelectSound: function unSelectSound() {
        ELSProfile.getInstance().switchMusicMute();
        this.refreshSoundTag();
    },


    /**
     *  刷新音量标识
     */
    refreshSoundTag: function refreshSoundTag() {
        if (ELSProfile.getInstance().getIsMusicMute()) {
            this.soundTag.active = true;
            this.game.model.playMusic(els.ELS_VOICE.BG_MUSIC, true, 0.4);
            this.game.model.playMusic(els.ELS_VOICE.DAODAN_MUSIC, false);
        } else {
            this.soundTag.active = false;
            this.game.model.playRandomBgMusic();
        }
    },

    /**
     * 
     * @param {Object} params params.prop_id, params.type 
     */
    onShowGiftPropAnimation: function onShowGiftPropAnimation(params) {
        var self = this;
        cc.loader.loadRes('prefab/els_view_prop_animation_display', cc.Prefab, function (err, prefab) {
            if (err) cc.error(err.message || err);else {
                var animation_display = cc.instantiate(prefab);
                animation_display.getComponent('els_view_porp_animation_display').init(params.prop_id, params.type);
                animation_display.parent = self.nodePop;
            }
        });
    },

    /**
     * 
     * @param {Object} params 回调参数
     * @param {Number} params.row 需要消除的行
     * @param {Function} params.cb 动画完成分类
     */
    onShowClearnRowEffect: function onShowClearnRowEffect(params) {
        var row = params.row;
        var cb = params.cb || null;
        this.showClearnLineEffectByRow(row, cb);
    },

    /**
     * 
     * @param {Number} row 行号
     * @param {Function} end_cb 动画结束回调
     */
    showClearnLineEffectByRow: function showClearnLineEffectByRow(row) {
        var _this3 = this;

        var end_cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var bsize = 72 * (6.6 / els.HENG) + 2;
        var pos = cc.v2(195 + (5 + 0.5) * bsize, 215 + (row + 1) * bsize - 0.5 * bsize); //* 0.5
        var self = this;
        //! 强制隐藏block
        var hide_block = function hide_block() {
            var r = els.ZONG - row - 1;
            for (var i = 0; i < els.HENG; i++) {
                self.blocks[0][row][i].opacity = 0;
                self.blocks[0][r][i].opacity = 0;
            }
        };
        cc.loader.loadRes('prefab/els_view_effect_clearn_line', cc.Prefab, function (err, prefab) {
            if (err) cc.err(err.message || err);else {

                var effect = cc.instantiate(prefab);
                effect.parent = _this3.node.getChildByName('render_effect');
                effect.position = pos;
                var animation = effect.getComponent(cc.Animation);
                animation.on("finished", function (num, string) {
                    console.log("show clearn line effect finished", num, string);
                    effect.destroy();
                    end_cb && end_cb();
                    hide_block();
                }, _this3);
                animation.play();
            }
        });
    },

    /**
     * @param {Object} params
     * @param {Number} params.x
     * @param {Number} params.y
     * @param {Number} params.type
     */
    onShowAddZhuBaoEffect: function onShowAddZhuBaoEffect(params) {
        var _this4 = this;

        // ! 重置的时候不需要特效
        if (!params) return;
        var c = this.blocks[0][params.x][params.y];
        var pos = c.position;
        cc.loader.loadRes('prefab/els_view_effect_get_zhubao', cc.Prefab, function (err, prefab) {
            if (err) cc.err(err.message || err);else {
                var effect = cc.instantiate(prefab);
                effect.getChildByName('siprite_display').getComponent(cc.Sprite).spriteFrame = _this4.zhuBaoFrames[params.type - 112];
                effect.parent = _this4.node.getChildByName('render_effect');
                effect.position = pos;
                var end_node = _this4.node.getChildByName('render_effect').getChildByName("z_" + (params.type - 112));

                var sp = pos;
                var ep = end_node.position;
                var dist = cc.pDistance(sp, ep);
                var normalPos = cc.pSub(ep, sp).normalizeSelf();
                var cfg = [cc.p(sp.x + 30, sp.y + normalPos.y * dist / 2), cc.p(sp.x + normalPos.x * dist / 4 * 3, sp.y + normalPos.y * dist / 4 * 3), ep];

                effect.runAction(cc.sequence(cc.bezierTo(0.5, cfg).easing(cc.easeSineIn()), cc.callFunc(function () {
                    effect.destroy();
                })));
            }
        });
    },

    /**
     * * 显示无尽模式过关成功 ===> 恭喜升级
     *
     */
    onShowEndlessLevelUpEffect: function onShowEndlessLevelUpEffect() {
        var self = this;
        cc.loader.loadRes('prefab/els_view_level_up', cc.Prefab, function (err, prefab) {
            if (err) cc.err(err.message || err);else {
                var effect = cc.instantiate(prefab);
                effect.parent = self.node.getChildByName('render_effect');
                var size = self.node.getChildByName('render_effect');
                effect.position = cc.p(size.width * 0.35 + size.width * 0.3, size.height * 0.7);

                effect.runAction(cc.sequence(cc.scaleTo(0.2, 1), cc.scaleTo(0.3, 0.8), cc.delayTime(1.0), cc.callFunc(function () {
                    effect.destroy();
                })));
            }
        });
        //* Add Score Effect
        //! 如果位置需要调整，那么，则需要另外一个事件,需要获取珠宝的位置
        cc.loader.loadRes('prefab/els_view_add_magic', cc.Prefab, function (err, prefab) {
            if (err) cc.err(err.message || err);else {
                var add_score = cc.instantiate(prefab);
                add_score.parent = self.node.getChildByName("render_effect");
                var size = self.node.getChildByName('render_effect');
                add_score.getComponent('els_view_add_magic').init(els.ENDLESS_VALUES.GetZhuBaoAddScore);
                add_score.position = cc.p(size.width / 2, size.height * 0.7);
            }
        });
    }
});
module.exports = MainGame;

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
        //# sourceMappingURL=main.js.map
        