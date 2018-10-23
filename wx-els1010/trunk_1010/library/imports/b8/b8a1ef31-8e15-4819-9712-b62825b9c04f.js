"use strict";
cc._RF.push(module, 'b8a1e8xjhVIGZcStiglucBP', 'tt_model_board');
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

            // * reset preview config
            this.previewConfigs = [];
            this.previewStat = [];

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
                }
                this.previewIndex[i] = config_idx;
            }
            tywx.NotificationCenter.trigger(tywx.tt.events.TT_REFRESH_PREVIEW_STAT, null);
        }
    }, {
        key: 'refreshPreviewStat',
        value: function refreshPreviewStat() {
            tywx.tt.log(TAG, 'refreshPreviewStat');
            var Constants = tywx.tt.constants;
            for (var i = 0; i < this.previewIndex.length; ++i) {
                var config_dis = Constants.BlockDis[this.previewIndex[i]];
                var is_can_fill = this.isPreviewCanFill(config_dis);
                this.previewStat[i] = is_can_fill ? 1 : 0;
            }
            tywx.NotificationCenter.trigger(tywx.tt.events.TT_REFRESH_PREVIEW_STAT, null);
        }
    }, {
        key: 'isPreviewCanFill',
        value: function isPreviewCanFill(block_dis) {
            var _this = this;

            var self = this;

            var _loop = function _loop(r) {
                var line = _this.board[r];

                var _loop2 = function _loop2(c) {
                    block_dis.forEach(function (data) {
                        var rr = r + data[0],
                            cc = c + data[1];

                        if (rr >= 0 && rr < self.board.length && cc >> 0 && cc < line.length && self.board[r][c] > 0) {
                            return false;
                        }
                    });
                };

                for (var c = 0; c < line.length; ++c) {
                    _loop2(c);
                }
            };

            for (var r = 0; r < this.board.length; ++r) {
                _loop(r);
            }
            return true;
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
                var _line = config[r];
                for (var c = 0; c < _line.length; ++c) {
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
            var _this2 = this;

            tywx.tt.warn(TAG, 'start to fillBaord');
            if (!this.willFillBlocks || this.willFillBlocks.length === 0) {
                tywx.tt.warn(TAG, 'fillBoard error, this.willFillBlocks=' + this.willFillBlocks);
                return;
            }
            this.willFillBlocks.forEach(function (e) {
                var _ref2 = [e[0], e[1]],
                    r = _ref2[0],
                    c = _ref2[1];

                if (_this2.board[r][c] === 0) {
                    _this2.board[r][c] = e[2];
                    _this2.emptyBlocks.delete(r + '_' + c);
                } else {
                    tywx.tt.warn(TAG, 'fillBoardByConfig error r=' + r + ' c=' + c);
                }
            });
            tywx.NotificationCenter.trigger(tywx.tt.events.TT_FILL_BOARD, this.willFillBlocks);
            this.willFillBlocks = [];
            this.previewConfigs[touch_idx] = null;
            this.refreshPreviewStat();
            this.outPutBoard();
            tywx.tt.warn(TAG, 'fillBaord end');
        }
    }, {
        key: 'outPutBoard',
        value: function outPutBoard() {
            for (var r = this.h - 1; r >= 0; --r) {
                var _line2 = 'Row:' + r + '===>';
                for (var c = 0; c < this.w; ++c) {
                    _line2 += this.board[r][c] + ',';
                }
                tywx.tt.log(TAG, _line2);
            }
        }
    }, {
        key: 'resetPreviews',
        value: function resetPreviews() {
            if (this.previewConfigs.every(function (e) {
                return e === null;
            })) {
                // * reset preview
                tywx.tt.log(TAG, 'reset previews');
                this.resetPreviewConfigs();
                tywx.NotificationCenter.trigger(tywx.tt.events.TT_RESET_PREVIEWS, null);
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
                var _line3 = this.board[r];
                var fill_num = 0;
                for (var c = 0; c < _line3.length; ++c) {
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
                tywx.NotificationCenter.trigger(tywx.tt.events.TT_CLEAR_ROW, null);
            }
            tywx.tt.log(TAG, 'clearRow:' + this.clearRows + ',\nclearCols:' + this.clearCols);
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
            this.score += add_score;
            tywx.NotificationCenter.trigger(tywx.tt.events.TT_REFRESH_SCORE, null);
            this.clearCols = [];
            this.clearRows = [];
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
    }]);

    return ModelBoard;
}();

module.exports = ModelBoard;

cc._RF.pop();