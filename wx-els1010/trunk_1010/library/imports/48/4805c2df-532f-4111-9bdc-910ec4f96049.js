"use strict";
cc._RF.push(module, '4805cLfUy9BEZvckQ7E+WBJ', 'tt_scene_play');
// scripts/game/view/tt_scene_play.js

'use strict';

var TAG = '[tt_scene_play]';
cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.root = this.node.getChildByName('root');
        this.pop = this.node.getChildByName('pop');
        this.loadPlayView();
        this.showBanner();
        tywx.tt.curgamescene = this;
        var canshowads = true;
        if (canshowads) {
            tywx.tt.ads.addAdsNode("list_menu", this.node, cc.v2(220, 222));
        }
    },


    // 点击暂停回调
    stopCall: function stopCall() {
        tywx.tt.stop_view.showStopView();
    },

    start: function start() {},


    /**
     * @description: 存储当前的分数
     */
    storeScore: function storeScore() {
        if (parseInt(tywx.tt.Utils.loadItem(tywx.tt.constants.TT_SCORE, 0)) < this.playviewscript.board.score) {
            tywx.tt.Utils.saveItem(tywx.tt.constants.TT_SCORE, this.playviewscript.board.score, false);
        }
    },

    onDestroy: function onDestroy() {
        tywx.tt.log("主页退出 ");
        tywx.tt.Utils.destroyWXBanner();
    },


    /**
     * @description 展示广告
     */
    showBanner: function showBanner() {

        tywx.tt.Utils.createAndcreateAndShowWXBanner();
        this.schedule(this.bannerRefresh, tywx.tt.constants.WXAdConfig.bannerRefreshTime);
    },

    /**
     * @description 刷新广告的显示
     */
    bannerRefresh: function bannerRefresh() {
        tywx.tt.Utils.createAndcreateAndShowWXBanner();
    },

    // update (dt) {},
    loadPlayView: function loadPlayView() {
        var self = this;
        cc.loader.loadRes('prefabs/tt_view_play_board', function (err, prefab) {
            if (!err) {
                self.playView = cc.instantiate(prefab);
                self.playView.parent = self.root;
                self.playviewscript = self.playView.getComponent("tt_view_play_board");
                tywx.tt.log(TAG, 'load play view success');
                //self.playView.getComponent('tt_view_play_board').init();
            } else {
                tywx.tt.error(TAG, 'load play view failed', JSON.stringify(err));
            }
        });
    }
});

cc._RF.pop();