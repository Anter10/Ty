(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/rank/friend.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fb6d0DiChVD1reCfXmUXE0v', 'friend', __filename);
// scripts/game/rank/friend.js

"use strict";

var friend_path = "prefabs/friend";
var self = null;
var friend = cc.Class({
    extends: cc.Component,

    properties: {
        friendIcon: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {

        this.tex = new cc.Texture2D();
        window.sharedCanvas.width = 211;
        window.sharedCanvas.height = 98;
        this.totaltime = 5;
        this.updatetime = this.totaltime;
        this.score = 0;
        self = this;
    },


    /**
     * @设置是否停止刷新好友的数据
     * @param {Boolean} stop 停止刷新的标示
     */
    setStop: function setStop(stop) {
        this.stop = stop;
        if (!stop) {
            tywx.tt.Utils.sendWXMsg({
                method: 9
            });
            window.sharedCanvas.width = 211;
            window.sharedCanvas.height = 98;
        }
    },

    /**
     * @description: 刷新子域即将超越的玩家Canvas
     */
    updateFriendCanvas: function updateFriendCanvas() {
        //return;
        if (!this.tex || !window.wx) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.friendIcon.spriteFrame = new cc.SpriteFrame(this.tex);
        this.friendIcon.node.active = true;
        tywx.tt.Utils.sendWXMsg({
            method: 5,
            isrestart: true,
            score: this.score
        });
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
    update: function update(dt) {
        if (this.stop) {
            return;
        }
        this.updatetime = this.updatetime - dt;
        if (this.updatetime < 0) {
            this.updatetime = this.totaltime;
            tywx.tt.Utils.sendWXMsg({
                method: 5,
                isrestart: true,
                score: this.score
            });
        }
        if (this.updatetime > this.totaltime - 1) {
            this.updateFriendCanvas();
        }
    },


    statics: {
        iconnode: null,
        iconscript: null,
        addIcon: function addIcon(node, score, pos) {
            cc.loader.loadRes(friend_path, function (err, prefab) {
                if (!err) {
                    var ranknode = cc.instantiate(prefab);
                    var friend_script = ranknode.getComponent('friend');
                    friend_script.setScoreFlush(friend_script);
                    friend.iconscript = friend_script;
                    friend.iconnode = ranknode;
                    node.addChild(ranknode);
                }
            });
        },
        setScore: function setScore(score) {
            if (friend.iconscript) {
                friend.iconscript.setScoreFlush(score);
            }
        },
        setStop: function setStop(stop) {
            if (friend.iconscript) {
                friend.iconscript.setStop(stop);
            }
        }

    }
});

module.exports = friend;

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
        //# sourceMappingURL=friend.js.map
        