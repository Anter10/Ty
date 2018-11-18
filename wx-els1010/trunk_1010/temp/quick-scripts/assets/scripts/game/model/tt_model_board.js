(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/model/tt_model_board.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b8a1e8xjhVIGZcStiglucBP', 'tt_model_board', __filename);
// scripts/game/model/tt_model_board.js

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TAG = '[tt.model.board]';
var ModelBoard = function () {
    function ModelBoard() {
        _classCallCheck(this, ModelBoard);

        this.board = [];
        this.w = tywx.tt.constants.BoardWidth;
        this.h = tywx.tt.constants.BoardHeight;
        this.score = 0;
        this.willFillBlocks = [];
        this.previewConfigs = []; // * 预览配置
        this.previewIndex = [];
        this.previewStat = [];
        this.clearRows = [];
        this.clearCols = [];
        this.emptyBlocks = new Map();
        this.evaluate = tywx.tt.boadrEvaluate.getInstance(); // * 棋盘评分实例
    }

    _createClass(ModelBoard, [{
        key: 'reset',
        value: function reset() {
            this.score = 0;
            this.resetBoard();
            this.resetPreviewConfigs();
        }
    }, {
        key: 'resetBoard',
        value: function resetBoard() {
            this.board = [];
            this.emptyBlocks.clear();
            for (var i = 0; i < this.h; ++i) {
                this.board[i] = [];
                for (var j = 0; j < this.w; ++j) {
                    this.board[i][j] = 0;
                    this.emptyBlocks.set(i + '_' + j, 0);
                }
            }
        }
    }, {
        key: 'resetPreviewConfigs',
        value: function resetPreviewConfigs() {
            var is_use_prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var checkpreviewnumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            // * reset preview config
            this.previewConfigs = [];
            this.previewStat = [];
            var checkgameover = true;
            console.log("checkpreviewnumber  = ", checkpreviewnumber);
            if (checkpreviewnumber) {
                if (tywx.tt.BoardView.checkPreviewActives() == 0) {
                    checkgameover = false;
                }
            }
            var block_values = this.evaluate.evaluateByBoard(this.board);
            tywx.tt.log(TAG, 'block_values', block_values.entries());

            var Constants = tywx.tt.constants;
            var block_configs = Constants.Blocks;
            if (is_use_prop) {
                block_configs = [];
                Constants.ForceRestBlocks.forEach(function (e) {
                    block_configs.push(Constants.Blocks[e]);
                });
            }
            for (var i = 0; i < 3; ++i) {
                var config_idx = parseInt(block_configs.length * Math.random());
                this.previewConfigs[i] = block_configs[config_idx];
                if (!is_use_prop) {
                    var block_dis = Constants.BlockDis[config_idx];
                    var is_can_fill = this.isPreviewCanFill(block_dis);
                    this.previewStat[i] = is_can_fill ? 1 : 0;
                } else {
                    //TODO: 特殊的默认都能填充，有需要再修改
                    this.previewStat[i] = 1;
                    config_idx = Constants.ForceRestBlocks[i];
                    var _block_dis = Constants.BlockDis[config_idx];
                    var _is_can_fill = this.isPreviewCanFill(_block_dis);
                    this.previewStat[i] = _is_can_fill ? 1 : 0;
                }
                this.previewIndex[i] = config_idx;
            }
            tywx.tt.log("出发了gameover 检测事件 tt_ model_bord 69 行 是否需要检测 = ", checkgameover);
            if (checkgameover && !checkpreviewnumber) {
                tywx.NotificationCenter.trigger(tywx.tt.events.TT_REFRESH_PREVIEW_STAT, null);
            }
        }
    }, {
        key: 'refreshPreviewStat',
        value: function refreshPreviewStat(refresh) {
            tywx.tt.log(TAG, 'refreshPreviewStat');
            var Constants = tywx.tt.constants;
            for (var i = 0; i < this.previewIndex.length; ++i) {
                var config_dis = Constants.BlockDis[this.previewIndex[i]];
                var is_can_fill = this.isPreviewCanFill(config_dis);
                if (!this.previewConfigs[i]) is_can_fill = false;
                this.previewStat[i] = is_can_fill ? 1 : 0;
                tywx.tt.log(TAG, 'refreshPreviewStat', 'idx:' + i + ',stat:' + this.previewStat[i]);
            }
            tywx.tt.log("出发了gameover 检测事件 tt_ model_bord 79 行" + refresh);
            if (!refresh) {
                tywx.NotificationCenter.trigger(tywx.tt.events.TT_REFRESH_PREVIEW_STAT, null);
            }
        }
    }, {
        key: 'isPreviewCanFill',
        value: function isPreviewCanFill(block_dis) {
            for (var r = 0; r < this.board.length; ++r) {
                var line = this.board[r];
                for (var c = 0; c < line.length; ++c) {
                    var tmp_fill_length = 0;
                    var fill_blocks = [];
                    for (var i = 0; i < block_dis.length; i++) {
                        var tmp_data = block_dis[i];
                        var rr = r + tmp_data[0],
                            cc = c + tmp_data[1];

                        if (rr >= 0 && rr < this.h && cc >= 0 && cc < this.w && this.board[rr][cc] <= 0) {
                            tmp_fill_length++;
                            fill_blocks.push([rr, cc]);
                        }
                    }
                    if (tmp_fill_length === block_dis.length) {
                        tywx.tt.log(TAG, 'isPreviewCanFill');
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        key: 'isCanFill',
        value: function isCanFill(center_row, center_col, config) {
            var ret = false;
            var c_r = center_row,
                c_c = center_col;
            var _ref = [tywx.tt.constants.BoardHeight, tywx.tt.constants.BoardWidth],
                m_r = _ref[0],
                m_c = _ref[1];

            var BlockMap = tywx.tt.constants.BlockMap;
            var fill_blocks = [];
            var need_fill_num = 0;
            for (var r = 0; r < config.length; ++r) {
                var line = config[r];
                for (var c = 0; c < line.length; ++c) {
                    var dis = BlockMap[r][c];
                    if (config[r][c] !== 0) {
                        var b_r = c_r + dis[1],
                            b_c = c_c + dis[0];

                        if (b_r >= 0 && b_r < m_r && b_c >= 0 && b_c < m_c && this.board[b_r][b_c] === 0) {
                            fill_blocks.push([b_r, b_c, config[r][c]]);
                        }
                        need_fill_num++;
                    }
                }
            }
            ret = fill_blocks.length === need_fill_num;
            if (ret) this.willFillBlocks = fill_blocks;else this.willFillBlocks = [];
            tywx.tt.warn(TAG, 'isCanFill ', ret ? 'can fill' : 'can not fill');
            return ret;
        }
    }, {
        key: 'fillBaordByConfig',
        value: function fillBaordByConfig(center_row, center_col, config, touch_idx) {
            var _this = this;

            tywx.tt.warn(TAG, 'start to fillBaord' + touch_idx);
            if (!this.willFillBlocks || this.willFillBlocks.length === 0) {
                tywx.tt.warn(TAG, 'fillBoard error, this.willFillBlocks=' + this.willFillBlocks);
                return;
            }
            this.willFillBlocks.forEach(function (e) {
                var _ref2 = [e[0], e[1]],
                    r = _ref2[0],
                    c = _ref2[1];

                if (_this.board[r][c] === 0) {
                    _this.board[r][c] = e[2];
                    _this.emptyBlocks.delete(r + '_' + c);
                } else {
                    tywx.tt.warn(TAG, 'fillBoardByConfig error r=' + r + ' c=' + c);
                }
            });
            tywx.NotificationCenter.trigger(tywx.tt.events.TT_FILL_BOARD, this.willFillBlocks);
            this.willFillBlocks = [];
            tywx.NotificationCenter.trigger(tywx.tt.events.HELP_ADD, null);
            this.previewConfigs[touch_idx] = null;
            // this.refreshPreviewStat(true);
            this.outPutBoard();
            tywx.tt.warn(TAG, 'fillBaord end');
        }

        // 填充给定的格子

    }, {
        key: 'fillBord',
        value: function fillBord(alle) {
            var _this2 = this;

            this.willFillBlocks = alle;
            this.willFillBlocks.forEach(function (e) {
                var _ref3 = [e[0], e[1]],
                    r = _ref3[0],
                    c = _ref3[1];

                if (_this2.board[r][c] === 0) {
                    _this2.board[r][c] = e[2];
                    _this2.emptyBlocks.delete(r + '_' + c);
                } else {
                    tywx.tt.warn(TAG, 'fillBoardByConfig error r=' + r + ' c=' + c);
                }
            });
            tywx.NotificationCenter.trigger(tywx.tt.events.TT_FILL_BOARD, this.willFillBlocks);
            this.willFillBlocks = [];
        }
    }, {
        key: 'outPutBoard',
        value: function outPutBoard() {
            for (var r = this.h - 1; r >= 0; --r) {
                var line = 'Row:' + r + '===>';
                for (var c = 0; c < this.w; ++c) {
                    line += this.board[r][c] + ',';
                }
                tywx.tt.log(TAG, line);
            }
        }
    }, {
        key: 'resetPreviews',
        value: function resetPreviews(checkpreviewnumber) {
            if (this.previewConfigs.every(function (e) {
                return e === null;
            })) {
                // * reset preview
                tywx.tt.log(TAG, 'reset previews');
                this.resetPreviewConfigs(false, checkpreviewnumber);
                tywx.NotificationCenter.trigger(tywx.tt.events.TT_RESET_PREVIEWS, null);
            } else {
                tywx.tt.log(TAG, '当前前置设置为空了');
            }
        }
    }, {
        key: 'forseResetPreviews',
        value: function forseResetPreviews() {
            tywx.tt.log(TAG, 'forseResetPreviews');
            this.resetPreviewConfigs(true);
            tywx.NotificationCenter.trigger(tywx.tt.events.TT_RESET_PREVIEWS, null);
        }
    }, {
        key: 'checkClear',
        value: function checkClear() {
            this.clearRows = [];
            this.clearCols = [];
            var tmp_col_fill = [];
            for (var i = 0; i < this.w; ++i) {
                tmp_col_fill.push(0);
            }for (var r = 0; r < this.board.length; ++r) {
                var line = this.board[r];
                var fill_num = 0;
                for (var c = 0; c < line.length; ++c) {
                    if (this.board[r][c] >= 1) {
                        tmp_col_fill[c]++;
                        fill_num++;
                    }
                }
                if (fill_num === this.w) {
                    this.clearRows.push(r);
                }
                tywx.tt.log(TAG, 'row:' + r + ',file_num=' + fill_num);
            }
            for (var _i = 0; _i < tmp_col_fill.length; ++_i) {
                if (tmp_col_fill[_i] === this.h) this.clearCols.push(_i);
            }
            if (this.clearCols.length > 0 || this.clearRows.length > 0) {
                this.hasclear = true;
                tywx.NotificationCenter.trigger(tywx.tt.events.TT_CLEAR_ROW, null);
            } else {
                this.hasclear = false;
                this.refreshPreviewStat();
            }

            tywx.tt.log(TAG, 'clearRow:' + this.clearRows + ',\nclearCols:' + this.clearCols);
        }
    }, {
        key: 'getAddScoreByClear',
        value: function getAddScoreByClear(rows, cols) {
            var add_score = 0;
            var self = this;
            rows.forEach(function (e) {
                for (var c = 0; c < self.w; ++c) {
                    add_score += tywx.tt.constants.AddScore;
                }
            });
            cols.forEach(function (e) {
                for (var r = 0; r < self.h; ++r) {
                    add_score += tywx.tt.constants.AddScore;
                }
            });
            return add_score;
        }
    }, {
        key: 'clearBlocks',
        value: function clearBlocks() {
            //this.clearRows, this.clearCols
            var self = this;
            var add_score = 0;
            this.clearRows.forEach(function (e) {
                for (var c = 0; c < self.w; ++c) {
                    self.board[e][c] = 0;
                    add_score += tywx.tt.constants.AddScore;
                    self.emptyBlocks.set(e + '_' + c, 0);
                }
            });
            this.clearCols.forEach(function (e) {
                for (var r = 0; r < self.h; ++r) {
                    self.board[r][e] = 0;
                    self.emptyBlocks.set(r + '_' + e, 0);
                    add_score += tywx.tt.constants.AddScore;
                }
            });

            var cleardata = {};
            cleardata.rows = this.clearRows;
            cleardata.cols = this.clearCols;
            // console.log("方块清空数据 = "+JSON.stringify(cleardata));
            tywx.NotificationCenter.trigger(tywx.tt.events.HELP_ADD, null);
            this.score += add_score;
            this.clearCols = [];
            this.clearRows = [];
            this.outPutBoard();
            this.refreshPreviewStat();
            tywx.tt.log(TAG, 'clearBlocks end');
            tywx.NotificationCenter.trigger(tywx.tt.events.TT_REFRESH_SCORE, cleardata);
        }
    }, {
        key: 'hammerClearByRowAndCol',
        value: function hammerClearByRowAndCol(row, col) {
            var shadow_blocks = [[[-1, 1], [0, 1], [1, 1]], [[-1, 0], [0, 0], [1, 0]], [[-1, -1], [0, -1], [1, -1]]];
            var clear_blocks = [];
            for (var r = 0; r < 3; ++r) {
                for (var c = 0; c < 3; ++c) {
                    var data = shadow_blocks[r][c];
                    var tmp_col = col + data[0];
                    var tmp_row = row + data[1];
                    if (tmp_col >= 0 && tmp_row >= 0 && tmp_col < this.w && tmp_row < this.h) {
                        if (this.board[tmp_row][tmp_col] > 0) {
                            this.board[tmp_row][tmp_col] = 0;
                            this.emptyBlocks.set(tmp_row + '_' + tmp_col, 0);
                            clear_blocks.push([tmp_row, tmp_col]);
                        }
                    }
                }
            }
            if (clear_blocks.length > 0) {
                tywx.tt.log(TAG, 'hammerClearByRowAndCol:' + clear_blocks.length);
                tywx.NotificationCenter.trigger(tywx.tt.events.TT_CLEAR_HAMMER, clear_blocks);
            }
        }
    }, {
        key: 'getPreviewConfigs',
        value: function getPreviewConfigs() {
            return this.previewConfigs;
        }

        /**
         * 设置玩家的分数
         * @param {Number} score 玩家的分数
         */

    }, {
        key: 'setScore',
        value: function setScore(score) {
            this.score = score;
            tywx.NotificationCenter.trigger(tywx.tt.events.TT_REFRESH_SCORE, null);
        }
    }]);

    return ModelBoard;
}();

module.exports = ModelBoard;

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
        //# sourceMappingURL=tt_model_board.js.map
        