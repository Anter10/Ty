(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/MagicBottleView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6046cRNdZxMEbkMCe3i9yQ4', 'MagicBottleView', __filename);
// script/ui/MagicBottleView.js

'use strict';

var ELSEvent = require('../core/ElsEvents.js');
var els = require("../core/els.js");
var MAX_MAGIC = 100;
cc.Class({
    extends: cc.Component,

    properties: {
        nodeFull: cc.Node,
        nodeNormal2: cc.Node,
        nodeBoxMove: cc.Node,
        aniNormal: cc.Animation,
        aniFull: cc.Animation,
        labCurrentMagic: cc.Label,
        labAddMagic: cc.Label,
        prefabAddMagic: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.currentMagic = 0;
        this.addValue = 0;
        this.labAddMagic.node.active = false;
        this.labCurrentMagic.string = '0';
        this.addLabDefaultPos = this.labAddMagic.node.position;
        this.hide();

        this.aniFull.on('finished', function (num, string) {
            console.log('full finished', num, string);
        }, this);

        //! 事件监听
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_ADD, this.progressTo, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_FULL, this.bottleFull, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_MAGIC_RESET_BOTTLE, this.reset, this);
    },
    init: function init(game) {
        this.game = game;
    },
    start: function start() {},
    onDestroy: function onDestroy() {
        tywx.NotificationCenter.ignore(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_ADD, this.progressTo, this);
        tywx.NotificationCenter.ignore(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_FULL, this.bottleFull, this);
        tywx.NotificationCenter.ignore(ELSEvent.ELS_EVENT_MAGIC_RESET_BOTTLE, this.reset, this);
    },


    // update (dt) {},
    reset: function reset() {
        console.log('MagicBottleView  reset', this.nodeNormal, this.aniNormal);
        this.nodeNormal2.active = true;
        //this.aniNormal.play();
        this.nodeFull.active = false;
        this.currentMagic = 0;
        this.labCurrentMagic.string = '0';
    },
    addMagic: function addMagic(add) {
        if (this.game.model.mconf.isWhisper) {
            return;
        }
        this.currentMagic += add;
        this.currentMagic = this.currentMagic > MAX_MAGIC ? MAX_MAGIC : this.currentMagic;
        this.addValue = add;
        console.log('show add magic', this.currentMagic);
    },
    showAddMagicEffect: function showAddMagicEffect() {
        console.log('show add magic effect ===>bottle');
        var normalAniCtrl = this.nodeNormal2.getComponent('els_view_magic_bottle');
        if (normalAniCtrl) {
            normalAniCtrl.progressTo(this.currentMagic);
        }
        if (this.addValue > 0) {
            var tmpAddMagic = cc.instantiate(this.prefabAddMagic);
            var self = this;
            tmpAddMagic.parent = this.node;
            tmpAddMagic.position = this.labAddMagic.node.position;
            tmpAddMagic.getComponent('els_view_add_magic').init(this.addValue, function () {
                self.labCurrentMagic.string = '' + self.currentMagic;
            });
        }
        console.log('show add magic', normalAniCtrl);
    },
    animationPause: function animationPause() {
        //this.aniNormal.pause();
    },
    hide: function hide() {
        this.nodeFull.active = false;
        this.nodeNormal2.active = false;
        this.nodeBoxMove.active = false;
    },
    progressTo: function progressTo(num) {
        console.log('progerssTo2', num);
        this.animationPause();
    },
    bottleFull: function bottleFull(num) {
        console.log('bottle full', num);
        //this.aniNormal.stop();
        this.nodeNormal2.active = false;
        this.nodeFull.active = true;
        this.aniFull.play();
        this.currentMagic = 0;
        this.showBoxMove();
    },
    showBoxMove: function showBoxMove() {
        this.nodeBoxMove.active = true;
        var end_pos = this.node.getChildByName('EndPos').position;
        console.log('showBoxMove', end_pos);
        var self = this;
        var move_end = function move_end() {
            self.nodeBoxMove.active = false;
            self.nodeBoxMove.position = cc.p(0, 0);
            self.nodeBoxMove.scale = 0.5;
            self.nodeFull.active = false;
            self.nodeNormal2.active = true;
        };
        this.nodeBoxMove.runAction(cc.sequence(cc.spawn(cc.moveTo(0.5, end_pos), cc.scaleTo(0.5, 1)), cc.callFunc(move_end)));
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
        //# sourceMappingURL=MagicBottleView.js.map
        