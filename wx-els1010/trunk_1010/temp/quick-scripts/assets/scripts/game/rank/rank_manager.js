(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/rank/rank_manager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7e4684S3xVHh46OkozlUNpN', 'rank_manager', __filename);
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
        //# sourceMappingURL=rank_manager.js.map
        