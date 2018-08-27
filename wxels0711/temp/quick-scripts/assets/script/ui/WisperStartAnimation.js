(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/WisperStartAnimation.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '14a62EzwjNA5ojqqH8ED9ic', 'WisperStartAnimation', __filename);
// script/ui/WisperStartAnimation.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        nodeContent: cc.Node,
        nodeHeard: cc.Node,
        labelContent: cc.Label,
        nodeStartTag: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},
    start: function start() {
        console.log('wisper animation start');
        this.play();
    },


    // update (dt) {},

    init: function init(str_content, cb, move_star) {
        console.log('wisper animation init');
        this.labelContent.string = str_content;
        //this.playIdx = idx;
        this.cb = cb;
        this.move_star = move_star;
        //this.play();
    },
    play: function play() {
        var aniHeart = this.nodeHeard.getComponent(cc.Animation);
        var aniContent = this.nodeContent.getComponent(cc.Animation);
        var self = this;

        aniHeart.on('play', function (num, string) {
            console.log('heart play', num, string);
        }, this);
        aniHeart.on('finished', function (num, string) {
            console.log('heart finished', num, string);
            self.nodeContent.active = true;
            self.nodeHeard.active = false;
            aniContent.play();
        }, this);

        aniContent.on('play', function (num, string) {
            console.log('content play', num, string);
        }, this);
        aniContent.on('finished', function (num, string) {
            console.log('content finished', num, string);
            self.cb();
            self.node.removeFromParent();
        }, this);

        var star_pos = this.move_star.parent.convertToWorldSpace(this.move_star.position);
        var start_pos = this.nodeStartTag.parent.convertToWorldSpace(this.nodeStartTag.position);
        var move_dis = cc.p(start_pos.x - star_pos.x + 50, start_pos.y - star_pos.y - 375);
        console.log('play wisper start animation ====>', move_dis, star_pos, start_pos);
        var star_pos_cache = this.move_star.position;
        this.move_star.runAction(cc.sequence(cc.moveBy(0.2, move_dis), cc.callFunc(function () {
            self.nodeHeard.active = true;
            self.move_star.opacity = 255;
            self.move_star.active = false;
            //aniHeart.play(`tanshe0${this.playIdx}`);
            aniHeart.play('tanshe02');
            self.move_star.position = star_pos_cache;
        })));
    }
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
        //# sourceMappingURL=WisperStartAnimation.js.map
        