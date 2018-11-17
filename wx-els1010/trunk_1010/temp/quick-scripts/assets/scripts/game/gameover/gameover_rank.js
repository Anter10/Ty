(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/gameover/gameover_rank.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ca80fQh3UdG5Y3GWJGDJQKm', 'gameover_rank', __filename);
// scripts/game/gameover/gameover_rank.js

"use strict";

var friend_path = "prefabs/gameover_rank";
var self = null;

var gameover_rank = cc.Class({
    extends: cc.Component,

    properties: {
        phbSprite: cc.Sprite

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.tex = new cc.Texture2D();
        window.sharedCanvas.width = 640;
        window.sharedCanvas.height = 200;
        this.updatetime = 5;
        this.score = 0;
        self = this;
        tywx.tt.Utils.sendWXMsg({
            method: 7
        });
        tywx.tt.Utils.sendWXMsg({
            method: 9
        });
        wx.postMessage({
            method: 8
        });

        tywx.Timer.setTimer(self, function () {
            this.updateFriendCanvas();
        }, 0.5, 0, 0);
    },


    /**
     * @description: 刷新子域即将超越的玩家Canvas
     */
    updateFriendCanvas: function updateFriendCanvas() {
        //return;
        if (!this.tex || !wx) {
            return;
        }

        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.phbSprite.spriteFrame = new cc.SpriteFrame(this.tex);
        this.phbSprite.node.active = true;
    },

    /**
     * 设置当前玩家的分数 
     * @param {Number} score 设置当前玩家的分数刷新当前显示的好友分数
     */
    setScoreFlush: function setScoreFlush(score) {
        this.score = score || 0;
        this.updateFriendCanvas();
    },

    start: function start() {},


    //  update(dt) {
    //      this.updatetime = this.updatetime - dt;
    //      if (this.updatetime > 0) {
    //          this.updateFriendCanvas();
    //      }
    //  },

    statics: {
        gamoverranknode: null,
        gameover_rank_script: null,
        addIcon: function addIcon(node) {
            cc.loader.loadRes(friend_path, function (err, prefab) {
                if (!err) {
                    var gamoverranknode = cc.instantiate(prefab);
                    var gameover_rank_script = gamoverranknode.getComponent('gameover_rank');
                    gameover_rank.gameover_rank_script = gameover_rank_script;
                    gameover_rank.gamoverranknode = gamoverranknode;
                    node.addChild(gamoverranknode);
                }
            });
        }
    }
});

module.exports = gameover_rank;

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
        //# sourceMappingURL=gameover_rank.js.map
        