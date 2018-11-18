(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/model/tt_model_evaluate.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7a69dsjZ/BBoY8H4OU1JyP+', 'tt_model_evaluate', __filename);
// scripts/game/model/tt_model_evaluate.js

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 棋盘评分
 */
var TAG = '[tt.model.evaluate]';

var Evaluate = function () {
    function Evaluate() {
        _classCallCheck(this, Evaluate);

        this.board = [];
        this.blocks = tywx.tt.constants.Blocks;
        this.blockDis = tywx.tt.constants.BlockDis;
        this.maxDeep = 1;
        this.deepAddScore = 10;
        this.stepAddScore = 5;
        this.row = tywx.tt.constants.BoardHeight;
        this.col = tywx.tt.constants.BoardWidth;
    }

    _createClass(Evaluate, [{
        key: 'initBoard',
        value: function initBoard() {
            this.board = [];
            for (var r = 0; r < this.row; ++r) {
                var tmp_row = [];
                for (var c = 0; c < this.col; ++c) {
                    tmp_row.push(0);
                }
            }
        }
    }, {
        key: 'outPutBoard',
        value: function outPutBoard() {
            for (var r = this.row - 1; r >= 0; --r) {
                tywx.tt.log(TAG, this.board[r]);
            }
        }
    }, {
        key: 'setMaxDeep',
        value: function setMaxDeep(deep) {
            this.maxDeep = deep;
        }
    }, {
        key: 'getFillPosArray',
        value: function getFillPosArray(tmp_board, block_idx) {
            var _this = this;

            var ret = [];

            var _loop = function _loop(r) {
                var tmp_row = tmp_board[r];

                var _loop2 = function _loop2(c) {
                    var block_dis = _this.blockDis[block_idx];
                    var fill_num = 0;
                    block_dis.forEach(function (e) {
                        var tr = r + e[0],
                            tc = c + e[1];

                        if (tr >= 0 && tr < _this.row && tc >= 0 && tc < _this.col && tmp_board[tr][tc] <= 0) {
                            fill_num++;
                        }
                    });
                    if (fill_num === block_dis.length) ret.push([r, c]);
                };

                for (var c = 0; c < tmp_row.length; ++c) {
                    _loop2(c);
                }
            };

            for (var r = 0; r < tmp_board.length; ++r) {
                _loop(r);
            }
            return ret;
        }
    }, {
        key: 'tmpFill',
        value: function tmpFill(tmp_board, tr, tc, block_idx) {
            var block_dis = this.blockDis[block_idx];
            block_dis.forEach(function (e) {
                var r = tr + e[0],
                    c = tc + e[1];
                //tywx.tt.log(TAG,'tmpFill', r, c, tmp_board);

                tmp_board[r][c] = 1;
            });
            return tmp_board;
        }
    }, {
        key: 'deepCount',
        value: function deepCount(tmp_board, block_idx, deep, score) {
            var s = score;
            var arr_pos = this.getFillPosArray(tmp_board, block_idx);
            var self = this;
            if (arr_pos.length > 0 && deep < this.maxDeep) {
                arr_pos.forEach(function (e) {
                    var ret = self.tmpFill(tmp_board, e[0], e[1], block_idx);
                    s += self.stepAddScore;
                    for (var i = 0; i < self.blocks.length; ++i) {
                        var b1 = self.cloneBoard(ret);
                        s += self.deepCount(b1, i, deep + 1, s);
                    }
                });
                return s;
            }

            return 0;
        }
    }, {
        key: 'formatArray',
        value: function formatArray(arr) {
            var info = '';
            arr.forEach(function (e) {
                info += '{' + e[0] + ',' + e[1] + '}';
            });
            return info;
        }
    }, {
        key: 'cloneBoard',
        value: function cloneBoard(board) {
            var ret = [];
            for (var r = 0; r < board.length; ++r) {
                var row = board[r];
                var new_row = [];
                for (var c = 0; c < row.length; ++c) {
                    new_row[c] = row[c];
                }
                ret.push(new_row);
            }
            return ret;
        }
    }, {
        key: 'evaluateByBoard',
        value: function evaluateByBoard(board) {
            var ret = new Map();
            for (var i = 0; i < this.blocks.length; ++i) {
                var b1 = this.cloneBoard(board);
                var score = this.deepCount(b1, i, 0, 0);
                ret.set(i, score);
            }
            return ret;
        }
    }], [{
        key: 'getInstance',
        value: function getInstance() {
            if (!Evaluate._instance) Evaluate._instance = new Evaluate();
            return Evaluate._instance;
        }
    }]);

    return Evaluate;
}();

Evaluate._instance = null;
module.exports = Evaluate;

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
        //# sourceMappingURL=tt_model_evaluate.js.map
        