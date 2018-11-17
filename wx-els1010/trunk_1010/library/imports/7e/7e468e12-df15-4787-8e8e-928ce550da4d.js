"use strict";
cc._RF.push(module, '7e4684S3xVHh46OkozlUNpN', 'rank_manager');
// scripts/game/rank/rank_manager.js

"use strict";

var rankview_path = "prefabs/rank_view";

var rank_manager = cc.Class({
    extends: cc.Component,

    properties: {},

    statics: {
        friendsRankView: null,
        showRank: function showRank() {
            if (!rank_manager.friendsRankView) {
                cc.loader.loadRes(rankview_path, function (err, prefab) {
                    if (!err) {
                        var ranknode = cc.instantiate(prefab);
                        var ani = ranknode.getComponent(cc.Animation);
                        ani.play("show_hide");
                        var ads_script = ranknode.getComponent('rank_view');
                        rank_manager.friendsRankView = ranknode;
                        tywx.tt.Utils.commonScaleIn(ranknode.getChildByName("rank_view"));
                        cc.director.getScene().addChild(ranknode);
                    }
                });
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},
    start: function start() {}
}

// update (dt) {},
);

module.exports = rank_manager;

cc._RF.pop();