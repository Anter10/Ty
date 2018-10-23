(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/view/tt_view_priview_blocks.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8bc3c+IWq9KBqGt3LNJhGCp', 'tt_view_priview_blocks', __filename);
// scripts/game/view/tt_view_priview_blocks.js

'use strict';

var TAG = '[tt_view_priview_blocks]';
var SCALE_TOUCH = 1.0;
var SCALE_NORMAL = 0.34;
cc.Class({
    extends: cc.Component,

    properties: {
        prefabBlock: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.hadPut = false; // * 是否已经放置到棋盘
        this.blockViews = [];
        this.sametype = new Map();
        this.pretypenumber = 0;
        this.precount = 0;
        this.sameindex = 0;
        this.samekey = [];
    },
    start: function start() {},


    // update (dt) {},
    init: function init(config) {
        this.config = config;
        this.blockViews = [];
        tywx.tt.log(TAG, JSON.stringify(config));
        var x = 0,
            y = 0,
            w = 380,
            h = 380;

        var b_s = tywx.tt.constants.BlockSize;
        x = -w / 2;
        y = -h / 2;
        this.root = this.node.getChildByName('root');
        var max = config.length - 1;
        for (var i = config.length - 1; i >= 0; --i) {
            y = b_s.height * (max - i) + -h / 2;
            this.blockViews[i] = [];
            for (var j = 0; j < config[i].length; ++j) {
                x = b_s.width * j + -w / 2;
                var stat = config[i][j];
                var tmp_block = cc.instantiate(this.prefabBlock);
                tmp_block.parent = this.root;
                tmp_block.position = cc.v2(x, y);
                tmp_block.getComponent('tt_view_block').setStat(stat);
                tmp_block.getComponent('tt_view_block').hideBg();
                this.blockViews[i].push(tmp_block);
            }
            tywx.tt.log(TAG, 'y=' + y);
        }
        this.root.scale = 0.8;
    },
    touch: function touch() {
        tywx.tt.log(TAG, 'touch');
        this.node.runAction(cc.scaleTo(0.2, SCALE_TOUCH));
    },
    touchCancle: function touchCancle() {
        tywx.tt.log(TAG, 'touch cancle');
        this.node.runAction(cc.scaleTo(0.2, SCALE_NORMAL));
        // 在这里处理变形
        this.changeType();
    },
    put: function put() {
        this.root.active = false;
        this.node.runAction(cc.scaleTo(0.2, SCALE_NORMAL));
        this.hadPut = true;
    },
    getConfig: function getConfig() {
        if (!this.config) {
            tywx.tt.error(TAG, 'getConfig error, config=' + this.config);
            return null;
        }
        return this.config;
    },
    isCanPut: function isCanPut() {
        return this.hadPut;
    },
    resetByConfig: function resetByConfig(config) {
        tywx.tt.log(TAG, 'resetByConfig===>' + config);
        this.config = config;

        this.root.active = true;
        this.hadPut = false;
        for (var i = config.length - 1; i >= 0; --i) {
            //this.blockViews[i] = [];
            for (var j = 0; j < config[i].length; ++j) {
                var stat = config[i][j];
                var tmp_block = this.blockViews[i][j];
                tmp_block.getComponent('tt_view_block').setStat(stat);
                tmp_block.getComponent('tt_view_block').hideBg();
            }
        }
        this.setSameTypeConfig();
    },


    getCongifTypeNumber: function getCongifTypeNumber() {
        var tconfig = this.getConfig();
        console.log("tconfig -= " + tconfig);
        var findit = false;
        var findnumber = null;
        var findcount = 0;
        var indexcount = 0;
        var row = 0;
        var column = 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = tconfig[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var c = _step.value;

                row++;
                column = 0;
                c.forEach(function (number) {
                    row++;
                    column++;
                    if (number != 0) {
                        findit = true;
                        findnumber = number;
                        findcount++;
                        indexcount = row * (indexcount + row) + column;
                    }
                });
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return {
            number: findnumber,
            count: findcount,
            index: indexcount
        };
    },

    setSameTypeConfig: function setSameTypeConfig() {
        var _this = this;

        var info = this.getCongifTypeNumber();
        if (this.pretypenumber == info.number && this.precount == info.count) {
            return;
        }
        this.sametype = new Map();
        this.samekey = [];
        this.pretypenumber = info.number;
        this.precount = info.count;
        console.log("typenumber = " + JSON.stringify(info));
        var blocks = tywx.tt.constants.Blocks;
        var blockindex = 0;

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = blocks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var block = _step2.value;

                var findcount = 0;
                var indexcount = 0;
                var row = 0;
                var column = 0;
                blockindex++;
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = block[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var ele = _step3.value;

                        row++;
                        ele.forEach(function (number) {
                            row++;
                            column++;
                            if (number == _this.pretypenumber) {
                                findcount++;
                                indexcount = row * (indexcount + row) + column;
                            }
                        });
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                if (findcount == info.count) {
                    // console.log(blockindex + "indexcount = " + indexcount);
                    this.samekey[this.samekey.length] = indexcount;
                    this.sametype[indexcount + ""] = block;
                }
                for (var ti = 0; ti < this.samekey.length; ti++) {
                    if (this.pretypenumber == this.samekey[ti]) {
                        this.sameindex = ti + 1;
                        break;
                    }
                }

                if (this.sameindex >= this.samekey.length) {
                    this.sameindex = 0;
                }

                blockindex++;
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    },

    changeType: function changeType() {
        if (this.sameindex >= this.samekey.length) {
            this.sameindex = 0;
        }
        var tconfig = this.sametype[this.samekey[this.sameindex + ""]];
        if (tconfig) {
            this.resetByConfig(tconfig);
        }
        console.log("index = " + this.sameindex);
        console.log("当前= " + JSON.stringify(tconfig) + " 全部" + this.samekey.length + "changeType sametype = " + JSON.stringify(this.sametype));

        this.sameindex = this.sameindex + 1;
        if (this.sameindex > this.samekey.length) {
            this.sameindex = 0;
        }
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
        //# sourceMappingURL=tt_view_priview_blocks.js.map
        