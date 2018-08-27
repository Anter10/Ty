// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var els = require("../core/els.js");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var game = tywx.UIManager.game;
        var model = game.model;

        /*if (model.stage % 120 == 0) {
            model.playMusic(els.ELS_VOICE.HELP_MUSIC[parseInt(Math.random() * 4)], false);
        }*/
    },

    // update (dt) {},

    btnCloseSelf : function () {
        tywx.UIManager.hideUI(els.ELS_GAME_LAYER.HELP);
    },
});
