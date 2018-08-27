var els = require("../core/els.js");

cc.Class({
    extends: cc.Component,

    properties: {
        gameNode : cc.Node,
        searchdone: cc.Node,
        searchai_msg:cc.Node,
        mogu:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {
        this.game = tywx.UIManager.game;
        this.model = this.game.model;
    },

    showMe : function () {
        this.mogu.active = true;
        this.searchai_msg.active = true;
        this.searchdone.active = false;
        this.searchai_msg.string = '正在匹配对手...';

        var that = this;
        setTimeout(function () {
            that._searchResult();
            setTimeout(function () {
                tywx.UIManager.hideAllUI();
                tywx.UIManager.showUI(els.ELS_GAME_LAYER.GAME_VS);
                that.model.setGameStatus(els.ELS_GAME_STATE.PLAYING);
                that.game.startTimerCountdown(els.ELS_TIMER_COUNT);
            }, 2000);
        }, 1500);
    },

    _searchResult: function () {
        this.mogu.active = false;
        this.searchai_msg.active = false;
        this.searchdone.active = true;

        var random = Math.floor(Math.random() * 13);

        var headSpri = this.searchdone.getChildByName("headsprite").getComponent(cc.Sprite);
        var info = this.searchdone.getChildByName("info_level_msg").getComponent(cc.Label);

        var gameview = this.gameNode.getComponent('main');
        if (gameview.headAtlas) {
            var frame = gameview.headAtlas.getSpriteFrame(random + 1);
            headSpri.spriteFrame = frame;
        };

        console.log("AILEVEL" + this.model.ailevel);
        var aipl = parseInt(Math.abs(this.model.pkstar_level+1.5-Math.random()*3));
        var maxti = els.ELS_PLAYER_TITLE2.length-1;
        if(aipl > maxti) aipl = maxti;
        info.string = els.ELS_PLAYER_TITLE2[aipl][1];
    },
    // update (dt) {},
});
