(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/rank/rank_view.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd9952dUoz1N7ZLlJnPN+YW6', 'rank_view', __filename);
// scripts/game/rank/rank_view.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        phbSprite: cc.Sprite,
        rankShareButton: cc.Node
    },

    onLoad: function onLoad() {

        var self = this;
        this.tex = new cc.Texture2D();
        window.sharedCanvas.width = 635;
        window.sharedCanvas.height = 60 * 30;
        tywx.Timer.setTimer(this, function () {
            self._updateSubDomainCanvas();
        }, 1, 11, 0);
        wx.postMessage({
            method: 1,
            MAIN_MENU_NUM: tywx.tt.constants.TT_SCORE
        });
        var rankBtnScript = this.rankShareButton.getComponent("ShareButton");
        rankBtnScript.setButtonCallType(1);
        rankBtnScript.setShareConfig(tywx.tt.constants.ShareConfig.HOME_RANK_SHARE);
        rankBtnScript.setSuccessCall(function () {
            self.shareSuc();
        });
    },


    // 分享成功
    shareSuc: function shareSuc() {},

    closeRankView: function closeRankView() {
        tywx.tt.rank_manager.friendsRankView.removeFromParent(true);
        tywx.tt.rank_manager.friendsRankView = null;
    },

    start: function start() {},


    /**
     * 刷新子域的canvas
     */
    _updateSubDomainCanvas: function _updateSubDomainCanvas() {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.phbSprite.spriteFrame = new cc.SpriteFrame(this.tex);
    }

    // update (dt) {},
});

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
        //# sourceMappingURL=rank_view.js.map
        