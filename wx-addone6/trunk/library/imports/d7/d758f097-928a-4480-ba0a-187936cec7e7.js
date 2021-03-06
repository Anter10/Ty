"use strict";
cc._RF.push(module, 'd758fCXkopEgLoKGHk2zsfn', 'ItemHelp');
// Script/models/ItemHelp.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        cells: {
            default: [],
            type: cc.Node
        },
        celltile: {
            default: null,
            type: cc.Prefab
        },
        czNode: {
            default: null,
            type: cc.Node
        },
        numNode: {
            default: null,
            type: cc.Node
        },
        showMessage: {
            default: null,
            type: cc.Label
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.initCells();
    },


    initCells: function initCells() {
        if (!this.allcells) {
            this.allcells = [];
        } else {
            return;
        }
        this.allnumbers = [2, 3, 4, 4, 3, 5];
        for (var tindex = 0; tindex < this.cells.length; tindex++) {
            var cellt = cc.instantiate(this.celltile);
            var tilescript = cellt.getComponent("celltile");
            tilescript.setCantClick(true);
            tilescript.changeShow(this.allnumbers[tindex]);
            cellt.scale = 0.95;
            cellt.y = cellt.y - 30;
            cellt.x = cellt.x + 15;
            cellt.parent = this.cells[tindex];
            this.allcells.push(cellt);
        }
        // this.cells = allcell;


        this.allcells[0].getComponent("celltile").playNewPlayerEff();
    },
    addNumber: function addNumber(num) {
        var self = this;
        var tilescript = this.allcells[0].getComponent("celltile");
        tilescript.node.stopAllActions();
        var delay1 = cc.delayTime(1.5);
        var call = cc.callFunc(function () {
            tilescript.changeShow(self.allnumbers[0] + num);
        });
        var delay2 = cc.delayTime(1.5);
        var call1 = cc.callFunc(function () {
            tilescript.changeShow(self.allnumbers[0]);
        });
        var seq = cc.sequence(delay1, call, delay2, call1);
        var rep = cc.repeatForever(seq);

        this.allcells[0].getComponent("celltile").node.runAction(rep);
    },

    start: function start() {
        //    this.initCells();
    },


    showChuiZi: function showChuiZi() {
        if (!this.allcells) {
            this.initCells();
        }
        this.allcells[0].getComponent("celltile").changeShow(2);
        this.allcells[0].getComponent("celltile").node.stopAllActions();
        this.czNode.active = true;
        this.numNode.active = false;
        var anim = this.czNode.getComponent(cc.Animation);
        anim.play("chuizi");
        this.setShowMsg("点击需要砸掉的方块");
    },

    showNum: function showNum(num) {
        if (!this.allcells) {
            this.initCells();
        }
        this.addNumber(num);
        this.czNode.active = false;
        this.numNode.active = true;
        var anim = this.czNode.getComponent(cc.Animation);
        anim.stop("chuizi");
        var fh = "+";
        if (num < 0) {
            fh = "-";
        }
        this.setShowMsg("点击让方块数字" + fh + Math.abs(num));
    },

    hideView: function hideView() {
        if (!this.allcells) {
            this.initCells();
        }

        this.allcells[0].getComponent("celltile").changeShow(2);
        var anim = this.czNode.getComponent(cc.Animation);
        anim.stop("chuizi");
        this.czNode.active = false;
        this.numNode.active = false;
    },

    setShowMsg: function setShowMsg(msg) {
        this.showMessage.string = msg;
    }

    // update (dt) {},
});

cc._RF.pop();