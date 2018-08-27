var els = require("../core/els.js");
cc.Class({
    extends: cc.Component,

    properties: {
        sprOpenDataCanvasProxy: cc.Sprite,
        sprRankChallengeSelected: cc.Node,
        sprRankClassicSelected: cc.Node,
        scrollview: cc.ScrollView,

        rank_cell: cc.Prefab,


        giftBtns: [cc.Sprite], // 0:nomal 1:select 礼物
        gameBtns: [cc.Sprite], // 0:nomal 1:select 游戏
        endlessBtns: [cc.Sprite], // 0:nomal 1:select 无尽

        gift_sub_nodes_0: [cc.Sprite], // 0: 土豪 
        gift_sub_nodes_1: [cc.Sprite], // 1: 魅力

        game_sub_nodes_0: [cc.Sprite], // 0: 无尽 
        game_sub_nodes_1: [cc.Sprite], // 1: 闯关
        game_sub_nodes_2: [cc.Sprite], // 2: 经典

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.btns = [this.giftBtns, this.gameBtns];

        this.btn_nodes = [
            [this.gift_sub_nodes_0, this.gift_sub_nodes_1],
            [this.game_sub_nodes_0, this.game_sub_nodes_1, this.game_sub_nodes_2]
        ];

        this.t_state = 0;
        this.l_state = 0;

        this.updateUI();
        let self = this;
        this.btn_nodes.forEach((items, index) => {
            items.forEach((item, _index) => {
                let _t = _index === 0;
                self._selectNode(item, _t);
            });
        });
    },

    updateUI() {
        let self = this;
        this.btns.forEach((items, index) => {
            let _t = index === self.t_state;
            self._selectNode(items, _t);
        });

        this.btn_nodes.forEach((items, index) => {
            if (index === self.t_state) {
                items.forEach((item, _index) => {
                    let _t = _index === self.l_state;
                    self._selectNode(item, _t);
                });
            }
        });
    },

    _selectNode(_list, _type) {
        _list[0].node.active = !_type;
        _list[1].node.active = _type;
    },

    top_btn_click(_btn, _data) {
        console.log(_btn, _data);
        this.t_state = parseInt(_data);
        this.l_state = 0;
        this.updateUI();
        this.updateRank();
    },

    left_btn_click(_btn, _data) {
        console.log(_btn, _data);
        this.l_state = parseInt(_data);
        this.updateUI();
        this.updateRank();
    },

    updateRank() {
        // TODO: 无尽排行 标识
        let types = [
            ["ELS_SEND_PRIVE", "ELS_RECV_PRIVE"],
            ["drawRankEndless", "drawRankChallenge", "drawRankClassic"]
        ];
        if (this._type !== types[this.t_state][this.l_state]) {
            this._type = types[this.t_state][this.l_state];
            this.scrollview.scrollToTop(0, false);
            this._drawRankContentWithOpenDataCanvas(this._type);
        }
    },

    start() {
        this.showMe();
    },

    showMe: function() {
        tywx.UIManager.game.gameNode.getComponent("main").beyondOpenData.active = false;
        this.updateUI();
        if (!tywx.isInWXChat)
            return;
        var openDataContext = wx.getOpenDataContext();
        var openDataCanvas = openDataContext.canvas;
        openDataCanvas.width = 550;
        openDataCanvas.height = 1890;

        this.tex = new cc.Texture2D();
        this.proxySpriteFrame = new cc.SpriteFrame(this.texture);
        var texture = this.tex;
        var spriteFrame = this.proxySpriteFrame;
        var sprite = this.sprOpenDataCanvasProxy;
        this.scrollview.scrollToTop(0, false);
        this.updateRank();
    },

    hideMe: function() {
        this.unscheduleAllCallbacks();
    },

    _drawRankContentWithOpenDataCanvas: function(drawCommand) {
        if (!tywx.isInWXChat)
            return;
        var self = this;

        var openDataContext = wx.getOpenDataContext();
        var openDataCanvas = openDataContext.canvas;
        openDataContext.postMessage({
            method: drawCommand,
            pageIndex: 1
        });
    },

    btnClose: function() {
        this.node.active = false;
        this._drawRankContentWithOpenDataCanvas("cleanOpenData");
        this.node.removeFromParent();
        this.node.destroyAllChildren();
        this.node.removeAllChildren();
        this.node.destroy();
        tywx.UIManager.game.gameNode.getComponent("main").beyondOpenData.active = true;
    },

    // 刷新开放数据域的纹理
    _updateSubDomainCanvas() {
        if (!this.tex || !this.proxySpriteFrame || !this.sprOpenDataCanvasProxy) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();

        var spriteFrame = this.proxySpriteFrame;
        var sprite = this.sprOpenDataCanvasProxy;
        sprite.spriteFrame = spriteFrame;
        sprite.spriteFrame._refreshTexture(this.tex);
    },

    update(dt) {
        this._updateSubDomainCanvas();
    },
});