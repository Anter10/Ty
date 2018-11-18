(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/view/tt_view_play_board.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b9179QA0FJBCLk4RWOLvbD5', 'tt_view_play_board', __filename);
// scripts/game/view/tt_view_play_board.js

'use strict';

var TAG = '[tt_view_play_board]';
var Board = require('../model/tt_model_board.js');

cc.Class({
    extends: cc.Component,

    properties: {
        prefabBlock: cc.Prefab,
        prefabPreview: cc.Prefab,
        addscoreLabelPrefab: cc.Prefab,
        labelScore: cc.Label,
        czNumberLabel: cc.Label,
        repNumberLabel: cc.Label,
        friendnode: cc.Node,
        helpTip: cc.Node,
        helpts: cc.Sprite,
        allblock: [],
        helpTipLabel: cc.Label,
        maxScoreLabel: cc.Label,
        lotteryNode: cc.Node,
        shouzhiNode: cc.Node,
        blinkNode: cc.Node,
        alertNode: cc.Node,
        chuiziNoneNode: cc.Node,
        chuiziNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.playdata = this.getPlayHistoryData();
        this.node.width = cc.game.canvas.width;
        this.node.height = cc.game.canvas.height;
        this.root = this.node.getChildByName('root');
        this.root.width = cc.game.canvas.width;
        this.root.height = cc.game.canvas.height;
        this.hammerTouch = this.node.getChildByName('hammer_touch');
        this.hammerTouch.active = false;
        this.hammerIcon = this.hammerTouch.getChildByName('hammer_icon');
        this.hammerIcon.active = false;
        this.board = new Board();
        this.previews = [];
        this.lotteryboxnumber = 0;
        this.previewsPos = [];
        this.touchIdx = -1;
        this.useRepeateNumber = 0;
        this.touchHeight = 240;
        this.isTouchLocked = false; // *  点击是否被锁住
        this.isUsingHammer = false; // * 是否在使用 锤子道具
        this.board.reset();
        tywx.tt.BoardView = this;
        tywx.tt.Board = this.board;

        this.initLayout();
        this.initBoardView();

        this.initTouch();
        this.initHammerTouch();
        this.initChuiZiAndRepeate();
        this.onRefreshScore();

        this.storescorevalue = tywx.tt.Utils.loadItem(tywx.tt.constants.TT_SCORE, 0);
        this.flushMaxScore();

        this.initPreviewBlocks();
        if (this.getHelp() == 1) {
            this.showHelp();
            this.helpTip.active = true;
        }

        // this.addCZCallBack(1);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_FILL_BOARD, this.onFillBoard, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_RESET_PREVIEWS, this.onResetPreviews, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_CLEAR_ROW, this.onClearRow, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_REFRESH_SCORE, this.onRefreshScore, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_CLEAR_HAMMER, this.onClearHammer, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_REFRESH_PREVIEW_STAT, this.refreshPreStatue, this);
        tywx.NotificationCenter.listen(tywx.tt.events.HELP_ADD, this.helpAdd, this);
        this.initHistoryPlayData();
    },


    // 初始化是否有锤子
    hideHarmer: function hideHarmer(hide) {
        if (hide) {
            this.chuiziNoneNode.active = true;
            this.chuiziNode.active = false;
        } else {
            this.chuiziNoneNode.active = false;
            this.chuiziNode.active = true;
        }
    },

    // 判断当前是否需要检测已经全部拖完preview
    checkPreviewActives: function checkPreviewActives() {
        var canputnumber = 0;
        for (var i = 0; i < this.previews.length; i++) {
            var previewscr = this.previews[i].getComponent('tt_view_priview_blocks');
            console.log(previewscr.node.active, "当前的拖动快是否能PUT = ", previewscr.isCanPut());
            if (previewscr.node.active == true) {
                canputnumber++;
            }
        }
        return canputnumber;
    },

    /**
     * @description 刷新最高分
     */
    flushMaxScore: function flushMaxScore() {
        if (parseInt(this.storescorevalue) < this.board.score) {
            this.maxScoreLabel.string = "历史最佳:" + this.board.score;
            tywx.tt.curgamescene.flushMaxScore(this.board.score);
        } else {
            tywx.tt.curgamescene.flushMaxScore(this.storescorevalue);
        }
    },

    start: function start() {},
    onDestroy: function onDestroy() {
        tywx.NotificationCenter.ignoreScope(this);
    },


    // update (dt) {},
    initLayout: function initLayout() {
        this.layout = this.root.getChildByName('layout');
        this.nodeTop = this.layout.getChildByName('node_top'); //1085
        this.nodeBoard = this.layout.getChildByName('node_board'); //452
        this.nodeBoardBottom = this.layout.getChildByName('node_board_bottom'); //261
        this.nodeBottom = this.layout.getChildByName('node_bottom'); // 0
        var _ref = [cc.game.canvas.width, cc.game.canvas.height],
            cw = _ref[0],
            ch = _ref[1];


        var top_y = 1085 / 1280 * ch;
        var board_y = 410 / 1280 * ch;
        var board_bottom_y = 190 / 1280 * ch;
        var bottom_y = 0;

        if (tywx.tt.Utils.isIpx()) {
            top_y -= 30;
            board_y += 50;
        } else if (tywx.tt.Utils.is2To1()) {
            top_y -= 150;
        }

        if (ch < 1280) {
            top_y = this.nodeBoard.getBoundingBox().height + board_y;
        }

        if (cw / ch >= 0.7) {
            // * pad
            board_bottom_y = 0;
            board_y = board_bottom_y + this.nodeBoardBottom.getBoundingBox().height;
            top_y = board_y + this.nodeBoard.getBoundingBox().height;
        }

        this.nodeTop.position = cc.v2(0, top_y);
        this.nodeBoard.position = cc.v2(0, board_y);
        this.nodeBoardBottom.position = cc.v2(0, board_bottom_y);
        this.nodeBottom.position = cc.v2(0, bottom_y);

        // let is_ipx = ch / cw >= 1.9; // *
        // if (is_ipx) {
        //     this.nodeTop.getChildByName("toproot").y = this.nodeTop.getChildByName("toproot").y - 80;
        //     this.nodeBoard.y = this.nodeBoard.y - 90;
        //     this.nodeBoard.getChildByName("bg").y = this.nodeBoard.getChildByName("bg").y - 90;
        // }
    },
    initBoardView: function initBoardView() {
        // * init board view
        var _ref2 = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth],
            w = _ref2[0],
            h = _ref2[1];

        var c_s = tywx.tt.constants.BlockSize;
        var size = this.root.getBoundingBox();
        // let block_scale = size.width / 720;
        // c_s.width = c_s.width * block_scale;
        // c_s.height = c_s.height * block_scale;

        var scalebl = 720 / this.root.width;
        var theight = 1280 / this.root.height;
        var ttheight = theight / 2;
        var padding_left = (this.root.width * scalebl - w * c_s.width) / 2;
        var bpos = this.nodeBoard.position;
        var padding_bottom = bpos.y; //size.height * 0.35; //(size.height - h * c_s.height) / 2;
        var tpos2 = this.nodeBoard.convertToWorldSpace(cc.v2(this.nodeBoard.width / 2, this.nodeBoard.height / 2));
        var tpos = this.nodeBoard.convertToWorldSpaceAR(cc.v2(this.nodeBoard.width / 2, 0));
        var tpy = tpos.y - tpos2.y;
        var _ref3 = [cc.game.canvas.width, cc.game.canvas.height],
            cw = _ref3[0],
            ch = _ref3[1];

        var hc = 1280 / cc.game.canvas.height;
        // let is_ipx = ch / cw >= 1.9; // *
        // if (is_ipx) {
        //     padding_bottom = tpos.y - this.nodeBoard.height / 2 - 220 + ((220 - (220 * hc)) / 2);
        // }

        this.blockViews = [];

        var x = 0,
            y = 0;
        var lb_x = 0,
            lb_y = 0,
            rt_x = 0,
            rt_y = 0;

        var idx = true;
        for (var i = 0; i < h; ++i) {
            y = padding_bottom + i * c_s.height;
            this.blockViews[i] = [];
            idx = i % 2 === 0 ? true : false;
            for (var j = 0; j < w; ++j) {
                x = padding_left + j * c_s.width;
                var tmp_block = cc.instantiate(this.prefabBlock);
                tmp_block.parent = this.root;
                tmp_block.getComponent('tt_view_block').setStat(-2);
                tmp_block.getComponent('tt_view_block').setBgColor(idx ? 1 : 2);
                idx = !idx;
                tmp_block.position = cc.v2(x, y);
                this.blockViews[i][j] = tmp_block;
                lb_x = x <= lb_x ? x : lb_x;
                rt_x = x >= rt_x ? x : rt_x;
            }
            lb_y = y <= lb_y ? y : lb_y;
            rt_y = y >= rt_y ? y : rt_y;
        }
        this.lbPos = cc.v2(lb_x, lb_y);
        this.rtPos = cc.v2(rt_x + c_s.width, rt_y + c_s.height);
    },
    initPreviewBlocks: function initPreviewBlocks() {
        this.previews = [];
        var self = this;
        var _ref4 = [0, this.nodeBoardBottom.y],
            x = _ref4[0],
            y = _ref4[1];

        var bpos = this.nodeBoardBottom.position;
        var padding_bottom = bpos.y; //size.height * 0.35; //(size.height - h * c_s.height) / 2;
        var tpos = this.nodeBoardBottom.convertToWorldSpaceAR(cc.v2(0, 0));
        var _ref5 = [cc.game.canvas.width, cc.game.canvas.height],
            cw = _ref5[0],
            ch = _ref5[1];

        var is_ipx = ch / cw >= 1.9; // *
        var ch2 = 1280 / cc.game.canvas.height;
        // if (is_ipx) {
        //     padding_bottom = tpos.y - 261 - 452 + 20;
        // } else {
        //     padding_bottom = padding_bottom + this.nodeBoardBottom.height / 2;
        // }
        padding_bottom = padding_bottom + this.nodeBoardBottom.height / 2;
        var previewConfigs = this.board.getPreviewConfigs();
        for (var i = 0; i < previewConfigs.length; i++) {
            if (previewConfigs[i]) {
                var tmp_preview = cc.instantiate(this.prefabPreview);
                tmp_preview.parent = this.root;
                tmp_preview.getComponent('tt_view_priview_blocks').init(previewConfigs[i]);
                self.previews.push(tmp_preview);
                x = (i + 1) * 144 + 144 / 2;
                tmp_preview.position = cc.v2(x, padding_bottom);
                this.previewsPos.push(cc.v2(x, padding_bottom));
            }
        }
    },
    initTouch: function initTouch() {
        var _this = this;

        var self = this;
        this.root.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (self.isTouchLocked) return;
            tywx.tt.log(TAG, 'touch start');
            var pos = event.getLocation();
            tywx.tt.curgamescene.qzShowBase();
            self.pretouchpos = pos;
            self.touchIdx = -1;
            for (var i = 0; i < self.previews.length; i++) {
                var preview = self.previews[i];
                var _ref6 = [preview.x, preview.y],
                    x = _ref6[0],
                    y = _ref6[1];
                var w = 130,
                    h = 130; //[preview.width,preview.height];

                var lb_x = x - w / 2,
                    lb_y = y - h / 2;
                var rt_x = x + w / 2,
                    rt_y = y + h / 2;

                if (pos.x >= lb_x && pos.x <= rt_x && pos.y >= lb_y && pos.y <= rt_y) {
                    if (tywx.tt.Board.previewStat[i] == 1 || _this.helpindex && _this.helpindex < 3 && _this.helpindex != -1) {
                        self.touchIdx = i;
                        preview.position = cc.v2(pos.x, pos.y);
                        tywx.tt.AudioManager.getInstance().playSound(tywx.tt.constants.SOUNDS.COMBO[0]);
                        preview.getComponent('tt_view_priview_blocks').touch();
                        tywx.tt.log(TAG, 'x[' + lb_x + ',' + pos.x + ',' + rt_x + '],y[' + lb_y + ',' + pos.y + ',' + rt_y + ']');
                    } else {
                        tywx.tt.Utils.showAlert("点击使用换一换");
                    }
                }
            }
        });
        this.root.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (self.isTouchLocked) return;
            var pos = event.getLocation();
            if (Math.abs(self.pretouchpos.x - pos.x) < 10 && Math.abs(self.pretouchpos.y - pos.y) < 10) {
                return;
            }
            if (self.touchIdx !== -1 && self.touchIdx < self.previews.length) {
                var preview = self.previews[self.touchIdx];
                preview.position = cc.v2(pos.x, pos.y + _this.touchHeight);
                self.refreshShadowFrame();
            }
        });
        this.root.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (self.isTouchLocked) return;
            tywx.tt.log(TAG, 'touch end');

            var pos = event.getLocation();

            if (self.touchIdx !== -1 && self.touchIdx < self.previews.length) {
                var is_put_success = false;
                if (pos.x >= self.lbPos.x && pos.x <= self.rtPos.x && pos.y + _this.touchHeight >= self.lbPos.y && pos.y + _this.touchHeight <= self.rtPos.y) {
                    is_put_success = true;
                }
                var preview = self.previews[self.touchIdx];

                preview.position = self.previewsPos[self.touchIdx];
                var preview_sc = preview.getComponent('tt_view_priview_blocks');
                if (Math.abs(self.pretouchpos.x - pos.x) < 10 && Math.abs(self.pretouchpos.y - pos.y) < 10) {
                    preview_sc.touchCancle();
                    return;
                }
                if (is_put_success) {
                    var config = preview_sc.config;
                    if (self.fillBoard(cc.v2(pos.x, pos.y + _this.touchHeight), config)) {
                        preview_sc.put();
                        console.log("当前什么情况333 refreshPreviewStat");
                        self.board.resetPreviews(true);
                        console.log("当前什么情况4444 refreshPreviewStat");
                        self.board.refreshPreviewStat(true);
                        console.log("当前什么情况5555 refreshPreviewStat");
                        self.board.checkClear();
                    } else {
                        self.board.refreshPreviewStat();
                        preview_sc.touchCancle();
                    }
                } else {
                    preview_sc.touchCancle();
                    tywx.tt.log(TAG, "getConfig2 = " + preview_sc.getConfig());
                }
            }
            self.hideAllBlockFrames();
            self.touchIdx = -1;
        });
    },
    initHammerTouch: function initHammerTouch() {
        var self = this;
        this.hammerTouch.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.hammerIcon.active = true;
            var pos = event.getLocation();
            self.showHammerSelectFrameByPosition(pos);
        });
        this.hammerTouch.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var pos = event.getLocation();
            self.showHammerSelectFrameByPosition(pos);
        });
        this.hammerTouch.on(cc.Node.EventType.TOUCH_END, function (event) {
            var pos = event.getLocation();
            self.hammerTouch.active = false;
            self.hammerIcon.active = false;
            self.useHammerByPosition(pos);
            self.hideAllBlockMask();
        });
    },
    refreshShadowFrame: function refreshShadowFrame() {
        if (this.touchIdx < 0 || this.touchIdx >= this.previews.length) {
            // tywx.tt.warn(TAG, `wrong touch index when call refreshShadowFrame , touchIdx=${this.touchIdx}`);
            return;
        }
        //tywx.tt.log(TAG,`refreshShadowFrame touchIdx=${this.touchIdx}`);
        var select_preview = this.previews[this.touchIdx];
        var select_pos = select_preview.position;
        var select_config = select_preview.getComponent('tt_view_priview_blocks').getConfig();
        var c_r = -1,
            c_c = -1;
        var _ref7 = [tywx.tt.constants.BoardHeight, tywx.tt.constants.BoardWidth],
            m_r = _ref7[0],
            m_c = _ref7[1];


        var row = this.blockViews.length;
        for (var r = 0; r < row; ++r) {
            var col = this.blockViews[r].length;
            for (var c = 0; c < col; ++c) {
                var tmp_block_view = this.blockViews[r][c];
                var tmp_block_sc = tmp_block_view.getComponent('tt_view_block');
                var _ref8 = [tmp_block_view.x, tmp_block_view.y, tmp_block_view.width, tmp_block_view.height],
                    x = _ref8[0],
                    y = _ref8[1],
                    w = _ref8[2],
                    h = _ref8[3];
                var lb_x = x,
                    lb_y = y,
                    rt_x = x + w,
                    rt_y = y + h;

                if (select_pos.x >= lb_x && select_pos.x <= rt_x && select_pos.y >= lb_y && select_pos.y <= rt_y) {
                    c_r = r;
                    c_c = c;
                }
                tmp_block_sc.setStat(-2);
            }
        }

        if (c_r !== -1 && c_c !== -1) {
            var BlockMap = tywx.tt.constants.BlockMap;
            var debug_infos = [];
            for (var _r = 0; _r < select_config.length; ++_r) {
                var line = select_config[_r];
                for (var _c = 0; _c < line.length; ++_c) {
                    var dis = BlockMap[_r][_c];
                    if (select_config[_r][_c] !== 0) {
                        var b_r = c_r + dis[1],
                            b_c = c_c + dis[0];

                        if (b_r >= 0 && b_r < m_r && b_c >= 0 && b_c < m_c) {
                            var _tmp_block_view = this.blockViews[b_r][b_c];
                            var _tmp_block_sc = _tmp_block_view.getComponent('tt_view_block');
                            _tmp_block_sc.setStat(-1);
                            debug_infos.push('{c=' + b_c + ',r=' + b_r + '}');
                        }
                    }
                }
            }
            if (debug_infos.length < 4) {
                tywx.tt.warn(TAG, '{cr=' + c_r + ',cc=' + c_c + '}', [].concat(debug_infos));
            }
        }
    },
    fillBoard: function fillBoard(pos, config) {
        var ret = false;
        var view_data = this.getBlockViewByPosition(pos);
        // console.log("viewData = " + view_data.centerRow, view_data.centerCol);
        if (view_data.blockView) {
            if (this.board.isCanFill(view_data.centerRow, view_data.centerCol, config)) {
                ret = true;
                tywx.tt.AudioManager.getInstance().playSound(tywx.tt.constants.SOUNDS.COMBO[1]);
                this.board.fillBaordByConfig(view_data.centerRow, view_data.centerCol, config, this.touchIdx);
            } else {
                ret = false;
            }
        }
        return ret;
    },

    /**
     * @description
     * @author lu ning
     * @date 2018-10-09
     * @param {cc.Vec2} pos 指定坐标
     * @returns {Object} ret 
     *    ret.blockView
     *    ret.centerRow
     *    ret.centerCol
     */
    getBlockViewByPosition: function getBlockViewByPosition(pos) {
        var ret = null;
        var _ref9 = [tywx.tt.constants.BoardHeight, tywx.tt.constants.BoardWidth],
            m_r = _ref9[0],
            m_c = _ref9[1];
        var c_r = -1,
            c_c = -1;

        var block_view = null;
        for (var r = 0; r < m_r; ++r) {
            for (var c = 0; c < m_c; ++c) {
                var tmp_block_view = this.blockViews[r][c];
                var _ref10 = [tmp_block_view.x, tmp_block_view.y, tmp_block_view.width, tmp_block_view.height],
                    x = _ref10[0],
                    y = _ref10[1],
                    w = _ref10[2],
                    h = _ref10[3];
                var lb_x = x,
                    lb_y = y,
                    rt_x = x + w,
                    rt_y = y + h;

                if (pos.x >= lb_x && pos.x <= rt_x && pos.y >= lb_y && pos.y <= rt_y) {
                    c_r = r;
                    c_c = c;

                    block_view = tmp_block_view;
                    break;
                }
            }
        }
        ret = {
            blockView: block_view,
            centerRow: c_r,
            centerCol: c_c
        };
        return ret;
    },
    onFillBoard: function onFillBoard(params) {
        this.fillblocks = params;
        tywx.tt.log(TAG, 'onFillBoard' + JSON.stringify(params));
        var self = this;
        params.forEach(function (e) {
            var tmp_block_view = self.blockViews[e[0]][e[1]];
            var tmp_block_sc = tmp_block_view.getComponent('tt_view_block');
            tmp_block_sc.setStat(e[2]);
        });
    },
    onResetPreviews: function onResetPreviews() {
        var previewConfigs = this.board.getPreviewConfigs();
        tywx.tt.log(TAG, 'onResetPreviews==>' + previewConfigs.length);
        for (var i = 0; i < previewConfigs.length; i++) {
            var config = previewConfigs[i];
            var view = this.previews[i];
            tywx.tt.log(TAG, 'onResetPreviews==>' + i);
            view.getComponent('tt_view_priview_blocks').resetByConfig(config);
        }
    },
    reset: function reset() {
        this.board.reset();
        this.gameover = false;
        this.board.setScore(0);
        var _ref11 = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardHeight],
            mr = _ref11[0],
            mc = _ref11[1];

        for (var r = 0; r < mr; ++r) {
            for (var c = 0; c < mc; ++c) {
                this.blockViews[r][c].getComponent('tt_view_block').setStat(0);
            }
        }
        this.onResetPreviews();
        this.onRefreshScore();
        this.lotteryboxnumber = 0;
        this.repeateRepeatNumberCall();
        this.storescorevalue = tywx.tt.Utils.loadItem(tywx.tt.constants.TT_SCORE, 0);
        this.flushMaxScore();
    },
    onClearRow: function onClearRow() {
        var _this2 = this;

        var clear_rows = this.board.clearRows;
        var clear_cols = this.board.clearCols;
        var clear_blocks = [];
        var _ref12 = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth],
            w = _ref12[0],
            h = _ref12[1];

        var self = this;
        this.lotteryboxs = [];
        clear_rows.forEach(function (e) {
            tywx.tt.log(TAG, 'onClearRow:==' + e);
            for (var c = 0; c < w; ++c) {
                var tmp_block_view = self.blockViews[e][c];
                if (_this2.board.board[e][c] == 12) {
                    _this2.lotteryboxs.push(12);
                }
                if (clear_blocks.indexOf(tmp_block_view) < 0) {
                    clear_blocks.push(tmp_block_view);
                }
            }
        });
        clear_cols.forEach(function (e) {
            tywx.tt.log(TAG, 'onClearRow:==' + e);
            for (var r = 0; r < h; ++r) {
                var tmp_block_view = self.blockViews[r][e];
                if (_this2.board.board[r][e] == 12) {
                    _this2.lotteryboxs.push(12);
                }
                if (clear_blocks.indexOf(tmp_block_view) < 0) {
                    clear_blocks.push(tmp_block_view);
                }
            }
        });
        var ani_time = 0.2;
        var delay_time = 0.05;
        var tcleartypes = [];
        this.showAddScore({
            rows: this.board.clearRows,
            cols: this.board.clearCols
        }, this.board.getAddScoreByClear(this.board.clearRows, this.board.clearCols));
        if (clear_blocks.length > 0) {
            tywx.tt.AudioManager.getInstance().playSound(tywx.tt.constants.SOUNDS.SHUIXIAQIPAO);

            this.isTouchLocked = true;

            var _loop = function _loop(i) {
                var tmp_block_view = clear_blocks[i];
                var is_last = i === clear_blocks.length - 1;

                var display = tmp_block_view.getChildByName('display');
                display.runAction(cc.sequence(cc.delayTime(i * delay_time), cc.spawn(cc.scaleTo(ani_time, 0.1), cc.fadeOut(ani_time)), cc.callFunc(function () {
                    display.scale = 1.0;
                    display.opacity = 255;
                    tmp_block_view.getComponent('tt_view_block').setStat(0);
                    if (is_last) {
                        self.board.clearBlocks();
                        self.isTouchLocked = false;
                    }
                })));
            };

            for (var i = 0; i < clear_blocks.length; ++i) {
                _loop(i);
            }
        }
    },
    onBtnResetPreviews: function onBtnResetPreviews() {
        if (this.isTouchLocked) return;
        tywx.tt.log(TAG, 'onBtnResetPreviews');
        if (this.helpindex && this.helpindex > 0) {
            return;
        }
        if (this.repeatNumber > 0) {
            this.useRepeateCall();
            this.board.forseResetPreviews();
        } else {
            var share_control = tywx.tt.configManager.getInstance().share_control ? tywx.tt.configManager.getInstance().share_control.gethuanyihuan : ["share", 50];
            var calltype = tywx.tt.Utils.shareVideoCtr(share_control);
            var self = this;
            tywx.tt.Utils.hideWXBanner();
            tywx.tt.tipview.show({
                success: function success() {
                    self.repeateRepeatNumberCall();
                },
                tip: "免费获得3次换一换！可以在危险的时候使用。",
                config: calltype == 1 ? tywx.tt.constants.ShareConfig.GET_HUNAYIHUAN_NUMBER_SHARE : tywx.tt.constants.ShareConfig.GET_HUNAYIHUAN_NUMBER_VIEDO,
                calltype: calltype

            });
        }
    },
    onBtnUseHammer: function onBtnUseHammer() {
        if (this.isTouchLocked) return;
        if (this.helpindex && this.helpindex > 0) {
            return;
        }
        tywx.tt.log(TAG, 'onBtnUseHammer');
        if (this.czInitNumber > 0) {
            this.hideHarmer(false);
            this.hammerTouch.active = true;
        } else {
            this.hideHarmer(true);
            this.lqHarmmer();
        }
    },


    lqHarmmer: function lqHarmmer() {
        var self = this;
        var share_control = tywx.tt.configManager.getInstance().share_control ? tywx.tt.configManager.getInstance().share_control.getchuizi : ["share", 50];
        var calltype = tywx.tt.Utils.shareVideoCtr(share_control);
        tywx.tt.Utils.hideWXBanner();
        tywx.tt.tipview.show({
            success: function success() {
                self.addCZCallBack(1);
                self.hideHarmer(false);
            },
            tip: "免费获得1个锤子！可以用来点击消除3*3范围的方块.",
            config: calltype == 1 ? tywx.tt.constants.ShareConfig.GET_CHUIZI_NUMBER_SHARE : tywx.tt.constants.ShareConfig.GET_CHUIZI_NUMBER_VIEDO,
            calltype: calltype
        });
    },

    hideAllBlockFrames: function hideAllBlockFrames() {
        var _ref13 = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth],
            w = _ref13[0],
            h = _ref13[1];

        for (var r = 0; r < h; ++r) {
            for (var c = 0; c < w; ++c) {
                var tmp_view = this.blockViews[r][c];
                var tmp_block_sc = tmp_view.getComponent('tt_view_block');
                tmp_block_sc.setStat(-2);
            }
        }
    },


    /**
     * @description 刷分
     * @param {Object} somedata 刷分的时候自带刷新数据
     */
    onRefreshScore: function onRefreshScore(somedata) {
        console.log("当前的分数 = ", this.board.score);
        tywx.tt.curgamescene.setScore(this.board.score);
        if (somedata) {
            this.showLottery(somedata);
        }
    },
    showHammerSelectFrameByPosition: function showHammerSelectFrameByPosition(pos) {
        var _ref14 = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth],
            w = _ref14[0],
            h = _ref14[1];

        for (var r = 0; r < h; ++r) {
            for (var c = 0; c < w; ++c) {
                var _tmp_block_view2 = this.blockViews[r][c];
                var _ref15 = [_tmp_block_view2.x, _tmp_block_view2.y, _tmp_block_view2.width, _tmp_block_view2.height],
                    x = _ref15[0],
                    y = _ref15[1],
                    b_w = _ref15[2],
                    b_h = _ref15[3];
                var lb_x = x,
                    lb_y = y,
                    rt_x = x + b_w,
                    rt_y = y + b_h;

                if (pos.x >= lb_x && pos.x <= rt_x && pos.y >= lb_y && pos.y <= rt_y) {
                    tywx.tt.log(TAG, 'showHammerSelectFrameByPosition==>' + r + ',' + c);
                    this.showHammerShadowByRowAndCol(r, c);
                    this.hammerIcon.position = _tmp_block_view2.position;
                    break;
                }
            }
        }
    },
    hideAllBlockMask: function hideAllBlockMask() {
        for (var r = 0; r < this.blockViews.length; ++r) {
            for (var c = 0; c < this.blockViews[r].length; ++c) {
                this.blockViews[r][c].getComponent('tt_view_block').hideMask();
            }
        }
    },
    showHammerShadowByRowAndCol: function showHammerShadowByRowAndCol(row, col) {
        var shadow_blocks = [[[-1, 1], [0, 1], [1, 1]], [[-1, 0], [0, 0], [1, 0]], [[-1, -1], [0, -1], [1, -1]]];
        var _ref16 = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth],
            w = _ref16[0],
            h = _ref16[1];

        this.hideAllBlockMask();
        for (var r = 0; r < 3; ++r) {
            for (var c = 0; c < 3; ++c) {
                var data = shadow_blocks[r][c];
                var tmp_col = col + data[0];
                var tmp_row = row + data[1];
                if (tmp_col >= 0 && tmp_row >= 0 && tmp_col < w && tmp_row < h) {
                    var tmp_block = this.blockViews[tmp_row][tmp_col];
                    var tmp_block_sc = tmp_block.getComponent('tt_view_block');
                    tmp_block_sc.showMask();
                }
            }
        }
    },
    useHammerByPosition: function useHammerByPosition(pos) {
        var data = this.getBlockViewByPosition(pos);
        tywx.tt.log(TAG, 'usehammerByPosition>>>row:' + data.centerRow + ',col:' + data.centerCol);
        if (data.blockView) {
            this.board.hammerClearByRowAndCol(data.centerRow, data.centerCol);
            // 刷新锤子的显示
            this.useCZNumber(-1);
        }
    },
    onClearHammer: function onClearHammer(blocks) {
        var _this3 = this;

        if (blocks.length > 0) this.isTouchLocked = true;else return;
        var self = this;
        var delay_time = 0.05;
        var ani_time = 0.2;

        var _loop2 = function _loop2(i) {
            var is_last = i === blocks.length - 1;
            var tmp_row = blocks[i][0];
            var tmp_col = blocks[i][1];
            var tmp_block_view = _this3.blockViews[tmp_row][tmp_col];
            var display = tmp_block_view.getChildByName('display');
            display.runAction(cc.sequence(cc.delayTime(i * delay_time), cc.spawn(cc.scaleTo(ani_time, 0.1), cc.fadeOut(ani_time)), cc.callFunc(function () {
                display.scale = 1.0;
                display.opacity = 255;
                tmp_block_view.getComponent('tt_view_block').setStat(0);
                if (is_last) {
                    self.isTouchLocked = false;
                    tywx.tt.Board.refreshPreviewStat();
                }
            })));
        };

        for (var i = 0; i < blocks.length; i++) {
            _loop2(i);
        }
    },


    /**
     * @description 初始化锤子数量和重置次数
     */
    initChuiZiAndRepeate: function initChuiZiAndRepeate() {
        var items = JSON.parse(tywx.tt.Utils.loadItem("tt-items", "[]"));
        var czNumber = 0;
        for (var tiIndex = 0; tiIndex < items.length; tiIndex++) {
            var titem = items[tiIndex];
            tywx.tt.log("cz item = " + JSON.stringify(titem));
            if (titem.id == 2 || titem.id == 4 || titem.id == 6) {
                czNumber = czNumber + titem.num;
            }
        }
        this.czInitNumber = czNumber;
        if (czNumber == 0) {
            // this.czNumberLabel.string = "点我获取";
            this.hideHarmer(true);
        } else {
            this.hideHarmer(false);
            // this.czNumberLabel.string = czNumber + "";
        }

        // 重置次数
        this.repeatNumber = 3;
        this.repNumberLabel.string = this.repeatNumber + "/3";
    },

    /**
     * @description 使用锤子回调
     * @param {Number} add 负数为减少锤子数量 正数添加锤子数量
     */
    useCZNumber: function useCZNumber(add) {
        var items = JSON.parse(tywx.tt.Utils.loadItem("tt-items", "[]"));
        var czNumber = 0;
        var hadcut = false;
        for (var tiIndex = 0; tiIndex < items.length; tiIndex++) {
            if ((items[tiIndex].id == 2 || items[tiIndex].id == 4 || items[tiIndex].id == 6) && items[tiIndex].num > 0) {
                if (!hadcut) {
                    hadcut = true;
                    items[tiIndex].num = items[tiIndex].num + add;
                }
                if (items[tiIndex].num > 0) {
                    czNumber = czNumber + items[tiIndex].num;
                }
            }
        }
        tywx.tt.Utils.saveItem("tt-items", JSON.stringify(items), false);

        this.czInitNumber = czNumber;
        if (czNumber == 0) {
            this.hideHarmer(true);
            // this.czNumberLabel.string = "点我获取";
        } else {
            this.hideHarmer(true);
            // this.czNumberLabel.string = czNumber + "";
        }
    },

    /**
     * @description 使用换一换的刷新回调
     */
    useRepeateCall: function useRepeateCall() {
        if (this.repeatNumber > 0) {
            this.repeatNumber--;
            this.repNumberLabel.string = this.repeatNumber + "/3";
        } else {
            tywx.tt.error(TAG, "换一换的使用次数为 " + this.repeatNumber);
        }
    },

    /**
     * 重置换一换的次数
     */
    repeateRepeatNumberCall: function repeateRepeatNumberCall(repnum) {
        this.gameover = false;
        this.repeatNumber = 3;
        this.useRepeateNumber = this.useRepeateNumber + 1;
        this.repNumberLabel.string = this.repeatNumber + "/3";
    },

    /**
     * @添加锤子
     * @param {Number} num 添加锤子的数量
     */
    addCZCallBack: function addCZCallBack(num) {
        var items = JSON.parse(tywx.tt.Utils.loadItem("tt-items", "[]"));
        var czNumber = 0;
        var hadadd = false;
        if (items.length == 0) {
            items = [];
            var item = {};
            item.id = 2;
            item.num = num;
            item.name = "锤子";
            items[0] = item;
            czNumber = num;
        } else {
            for (var tiIndex = 0; tiIndex < items.length; tiIndex++) {
                if (items[tiIndex].id == 2 || items[tiIndex].id == 4 || items[tiIndex].id == 6) {
                    if (!hadadd) {
                        hadadd = true;
                        items[tiIndex].num = items[tiIndex].num + num;
                    }
                    if (items[tiIndex].num > 0) {
                        czNumber = czNumber + items[tiIndex].num;
                    }
                }
            }
        }
        tywx.tt.log("锤子的数量  = " + czNumber);
        tywx.tt.Utils.saveItem("tt-items", JSON.stringify(items), false);
        this.czInitNumber = czNumber;
        // this.czNumberLabel.string = czNumber + "";
    },

    /**
     * @description 刷新显示
     */
    flushPreviewStatueUI: function flushPreviewStatueUI() {
        var stats = this.board.previewStat;
        console.log(" 设置的状态 =  " + stats[0]);
        console.log(stats.length + " 当前的所有状态 = " + stats);
        var haszeorstate = false;

        for (var ti1 = 0; ti1 < stats.length; ti1++) {
            if (stats[ti1] == 0 && tywx.tt.Board.previewConfigs[ti1] != null) {
                this.previews[ti1].getComponent("tt_view_priview_blocks").setGrey();
                haszeorstate = true;
            } else {
                this.previews[ti1].getComponent("tt_view_priview_blocks").hideGrey();
            }
        }

        if (haszeorstate == true) {
            this.alertNode.active = true;
            this.alertNode.getComponent("cc.Animation").play("dangertip");
        } else {
            this.alertNode.active = false;
        }
    },

    refreshPreStatue: function refreshPreStatue() {
        //    if (this.hadrefresh) {
        //        return;
        //    }
        var self = this;
        this.hadrefresh = true;
        var time = tywx.tt.Board.hasclear == true ? 0.5 : 0.2;
        this.doGameOver();
    },

    /** 
     * @description 处理游戏是否结束
     */
    doGameOver: function doGameOver() {
        this.hadrefresh = false;
        var self = this;
        var deal = false;
        for (var tg = 0; tg < 3; tg++) {
            if (tywx.tt.Board.previewConfigs[tg] != null) {
                deal = true;
                break;
            }
        }
        console.log("gameover p判断的preview = " + JSON.stringify(tywx.tt.Board.previewConfigs));
        // if (!deal) {
        //     return;
        // }
        this.flushPreviewStatueUI();
        // tywx.Timer.setTimer(this, self.flushPreviewStatueUI, 0.25, 0, 0);
        // console.log(this.board.previewStat.length + "this.bord = " + JSON.stringify(this.board.previewStat));
        var stats = this.board.previewStat;
        tywx.tt.log(TAG, stats.length + "this.bord = " + stats);
        var gameover = true;

        for (var ti1 = 0; ti1 < stats.length; ti1++) {
            if (stats[ti1] == 1) {
                gameover = false;
            }
        }

        var tgameover = gameover && this.repeatNumber == 0;
        tywx.tt.log("tgameover " + tgameover);
        if (tgameover) {
            this.alertNode.active = false;
            this.gameover = true;
            tywx.tt.Utils.hideWXBanner();
            var share_control = tywx.tt.configManager.getInstance().share_control ? tywx.tt.configManager.getInstance().share_control.gethuanyihuan : ["share", 50];
            var calltype = tywx.tt.Utils.shareVideoCtr(share_control);
            tywx.tt.tipview.show({
                success: function success() {
                    self.repeateRepeatNumberCall();
                },
                tip: "免费获得3次换一换！可以复活!",
                config: calltype == 1 ? tywx.tt.constants.ShareConfig.GET_HUNAYIHUAN_NUMBER_SHARE : tywx.tt.constants.ShareConfig.GET_HUNAYIHUAN_NUMBER_VIEDO,
                calltype: calltype,
                closecall: function closecall() {
                    // 停止刷新即将超越的好友
                    tywx.tt.friend.setStop(true);
                    // 显示复活界面
                    tywx.tt.fuhuo.show({
                        score: self.board.score
                    });
                }
            });
        }
    },

    /**
     * @description 显示帮助界面
     */
    showHelp: function showHelp() {
        var _this4 = this;

        this.helpindex = 1;
        var data = [];
        for (var row = 0; row < 8; row++) {
            for (var bordI = 0; bordI < 8; bordI++) {
                var tdata = [];
                tdata[0] = row;
                tdata[1] = bordI;
                tdata[2] = 3;
                if (row >= 3 && row < 5 && bordI != 3 && bordI != 4) {
                    data.push(tdata);
                } else {
                    var canadd = true;
                    if ((bordI == 3 || bordI == 4) && (row == 3 || row == 4)) {
                        canadd = false;
                    }
                    var _ref17 = [tdata[0], tdata[1]],
                        r = _ref17[0],
                        c = _ref17[1];

                    if (this.board.board[r][c] === 0 && canadd) {
                        this.board.board[r][c] = -2;
                        this.board.emptyBlocks.delete(r + '_' + c);
                    }
                }
            }
        }
        data.forEach(function (e) {
            var _ref18 = [e[0], e[1]],
                r = _ref18[0],
                c = _ref18[1];

            if (_this4.board.board[r][c] === 0) {
                _this4.board.board[r][c] = e[2];
                _this4.board.emptyBlocks.delete(r + '_' + c);
            }
            var tmp_block_view = _this4.blockViews[e[0]][e[1]];
            var tmp_block_sc = tmp_block_view.getComponent('tt_view_block');
            tmp_block_sc.setStat(e[2]);
        });
        this.board.previewStat[0] = 0;
        this.board.previewStat[1] = 1;
        this.board.previewStat[0] = 0;
        // this.blockViews[3][3].opacity = 122,
        // this.blockViews[4][3].opacity = 122,
        var p4pos = this.blockViews[4][3].position;
        this.blinkNode.position = cc.v2(p4pos.x + 38, p4pos.y);
        // this.blockViews[3][3].getComponent("tt_view_block").blockBlink();
        // this.blockViews[4][3].getComponent("tt_view_block").blockBlink();
        this.helpts.node.active = true;
        // this.helpts.node.position = this.blockViews[3][3].parent.parent.position;
        this.previews[0].active = false;
        this.previews[2].active = false;
        this.helpTip.active = true;
        var scale1 = cc.scaleTo(0.5, 1.1);
        var scale2 = cc.scaleTo(0.5, 1);
        var delay = cc.delayTime(0.2);
        var seq = cc.sequence(scale1, scale2, delay);
        this.blinkNode.zIndex = 99998;
        this.shouzhiNode.zIndex = 99999;
        this.blinkNode.runAction(cc.repeatForever(seq));
        var rep = cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.1), cc.scaleTo(0.5, 1)));
        this.helpts.node.runAction(rep);
        this.previews[1].getComponent("tt_view_priview_blocks").resetByConfig(this.getHelpPreviewBlockData());
        this.showzhiAction(this.blockViews[3][3].position);
        tywx.tt.log(TAG, "新手数据  = " + JSON.stringify(this.helpts.node.position));
    },

    showzhiAction: function showzhiAction(position) {
        this.shouzhiNode.stopAllActions();
        this.shouzhiNode.active = true;
        this.shouzhiNode.getComponent(cc.Animation).play("dragani");
        this.shouzhiNode.position = cc.v2(this.previews[1].position.x + 45, this.previews[1].position.y - 38);
        var move = cc.moveTo(0.5, cc.v2(position.x + 76, position.y + 38));
        var delay = cc.delayTime(0.5);
        var move2 = cc.moveTo(0.5, cc.v2(this.previews[1].position.x + 45, this.previews[1].position.y - 38));
        var seq2 = cc.sequence(move, delay, move2);
        this.shouzhiNode.runAction(cc.repeatForever(seq2));
    },

    /**
     * @description 完成第一步帮助后的回调
     */
    helpAdd: function helpAdd() {
        if (this.helpindex > 0) {
            this.helpindex++;
            if (this.helpindex == 2) {
                var self = this;
                this.helpTipLabel.string = "再拖动块到目标位置,就可以消除这两行了。";
                this.previews[1].active = true;
                tywx.Timer.setTimer(this, function () {
                    this.showzhiAction(this.blockViews[3][4].position);
                    // this.blockViews[3][3].getComponent("tt_view_block").blockHide();
                    // this.blockViews[4][3].getComponent("tt_view_block").blockHide();
                    // this.blockViews[3][4].getComponent("tt_view_block").blockBlink();
                    // this.blockViews[4][4].getComponent("tt_view_block").blockBlink();
                    var p4pos = this.blockViews[4][4].position;
                    this.blinkNode.position = cc.v2(p4pos.x + 38, p4pos.y);
                    self.previews[1].getComponent("tt_view_priview_blocks").resetByConfig(self.getHelpPreviewBlockData());
                }, 1, 0, 0.3);
            } else {
                // 清空棋盘重新开始
                this.helpindex = -1;
                this.helpts.node.stopAllActions();
                this.helpts.node.active = false;
                this.helpTipLabel.string = "恭喜您，祝您玩得愉快。";
                var self = this;
                // this.blockViews[3][4].getComponent("tt_view_block").blockHide();
                // this.blockViews[4][4].getComponent("tt_view_block").blockHide();
                // this.board.forseResetPreviews();
                this.shouzhiNode.active = false;
                this.blinkNode.stopAllActions();

                this.shouzhiNode.stopAllActions();
                this.blinkNode.active = false;
                tywx.Timer.setTimer(this, function () {
                    tywx.tt.log(TAG, "新手引导结束");
                    tywx.tt.Utils.saveItem("hadhelp", 2, true);
                    this.previews[0].active = true;
                    this.previews[1].active = true;
                    this.previews[2].active = true;
                    this.helpTip.active = false;
                    tywx.tt.BoardView.reset();
                }, 1, 0, 2);
            }
        }
    },

    /** 
     * @description 得到给定的帮助的格子数据
     */
    getHelpPreviewBlockData: function getHelpPreviewBlockData() {
        var config = tywx.tt.constants.Blocks[1];
        return config;
    },

    /** 
     * @description 得到是否需要帮助
     */
    getHelp: function getHelp() {
        var hadhelp = tywx.tt.Utils.loadItem("hadhelp", 1);
        return hadhelp;
    },

    /**
     * @description 复活游戏
     */
    recoverGame: function recoverGame() {
        var _this5 = this;

        this.gameover = false;
        var clears = [];
        var rows = [0, 1, 2, 3, 4, 5, 6, 7];
        var columns = [0, 1, 2, 3, 4, 5, 6, 7];
        for (var ti = 0; ti < 8; ti++) {
            var data = {};
            data.row = rows[ti];
            data.column = columns[7 - ti];
            clears.push(data);
            data = {};
            data.row = rows[7 - ti];
            data.column = columns[ti];
            clears.push(data);
        }
        tywx.tt.log(TAG, "data clear = " + JSON.stringify(clears));
        clears.forEach(function (data) {
            _this5.board.hammerClearByRowAndCol(data.row, data.column);
        });
        tywx.tt.Board.refreshPreviewStat();
    },

    /**
     * @description 显示抽奖
     * @param {Object} param 消除行列的位置信息
     */
    showLottery: function showLottery(param) {
        if (this.helpindex && this.helpindex < 3) {
            return;
        }
        if (this.gameover) {
            return;
        }

        if (!tywx.tt.configManager.getInstance().lottery) {
            return;
        }
        // 产看当前是否有宝箱可以弹出
        var boxs = this.lotteryboxs;
        this.lotteryboxs = [];
        // 显示宝箱
        var self = this;
        if (boxs.length > 0) {
            this.lotteryboxnumber = this.lotteryboxnumber - boxs.length;
            tywx.tt.lottery.showLottery("game", function () {
                self.addCZCallBack(0);
                tywx.tt.lottery.removeLotteryView();
            });
        }
        tywx.tt.log(TAG, "当前宝箱个数 = " + this.lotteryboxnumber);
        // 处理显示的宝箱
        var cjIndex = 0;
        for (var scoreIndex = 0; scoreIndex < tywx.tt.configManager.getInstance().lottery.score.length; scoreIndex++) {
            if (this.board.score <= tywx.tt.configManager.getInstance().lottery.score[scoreIndex]) {
                cjIndex = scoreIndex;
                break;
            }
        }
        var rate = tywx.tt.configManager.getInstance().lottery.rate[cjIndex];
        var max = tywx.tt.configManager.getInstance().lottery.max[cjIndex];
        var random = Math.random();
        // 产生抽奖
        tywx.tt.log(TAG, "score = " + this.board.score + " max = " + max + "random = " + random + " rate =  " + rate + " cjIndex = " + cjIndex);
        if (random <= rate && this.lotteryboxnumber < max) {
            this.lotteryboxnumber++;
            // 1 row 2 col
            var tbord = [];
            for (var r = 0; r < this.board.board.length; r++) {
                var tdata = this.board.board[r];
                for (var c = 0; c < tdata.length; c++) {
                    if (this.board.board[r][c] > 0) {
                        var tgz = {};
                        tgz.row = r;
                        tgz.column = c;
                        tbord.push(tgz);
                    }
                }
            }
            var sbord = tbord[parseInt(Math.random() * tbord.length)];
            tywx.tt.log("展示的位置2  = " + JSON.stringify(sbord));
            if (sbord.row && sbord.column) {
                this.blockViews[sbord.row][sbord.column].getComponent("tt_view_block").setStat(12);
                this.board.board[sbord.row][sbord.column] = 12;
                this.board.emptyBlocks.delete(sbord.row + '_' + sbord.column);
            }
        } else {}
    },

    /**
     * @description 添加宝箱
     * @param 添加宝箱的位置信息
     */
    addLotteryBox: function addLotteryBox(param) {},

    /**
     * @description 得到玩家数据
     */
    getPlayHistoryData: function getPlayHistoryData() {
        var data = tywx.tt.Utils.getPlayDataByKey(tywx.tt.constants.PlayDataKeys.ttplaydata);
        tywx.tt.log("玩家记录数据 = " + data);
        if (data != -1) {
            data = JSON.parse(data);
        }
        return data;
    },

    /**
     * @description 初始化游戏进度的数据
     */
    initHistoryPlayData: function initHistoryPlayData() {
        if (this.playdata != -1) {
            // 设置score
            // this.board.setScore(this.playdata.score);
            this.repeatNumber = this.playdata.huanyihuan;
            // 设置刷新次数
            this.repNumberLabel.string = this.repeatNumber + "/3";
            // 刷新棋盘数据
            var alle = [];
            for (var tr = 0; tr < this.playdata.bord.length; tr++) {
                var tdata = this.playdata.bord[tr];
                for (var tc = 0; tc < tdata.length; tc++) {
                    var cdata = [];
                    cdata[0] = tr;
                    cdata[1] = tc;
                    cdata[2] = tdata[tc];
                    alle.push(cdata);
                }
            }
            this.board.fillBord(alle);
            // 刷新拖动数据
            var previewdata = this.playdata.previewsdata;
            var previewIndex = this.playdata.previewIndex;
            tywx.tt.Board.previewConfigs = previewdata;
            tywx.tt.Board.previewIndex = previewIndex;
            console.log("borddata = " + JSON.stringify(previewIndex));
            for (var ti = 0; ti < previewdata.length; ti++) {
                var config = previewdata[ti];
                var preview_sc = this.previews[ti].getComponent("tt_view_priview_blocks");
                if (config) {
                    preview_sc.resetByConfig(config);
                } else {
                    preview_sc.put();
                }
            }
            tywx.tt.Board.refreshPreviewStat();
            tywx.tt.Utils.clearPlayDataByKey(tywx.tt.constants.PlayDataKeys.ttplaydata, -1);
        }
    },

    /**
     * @description 显示添加的分数
     * @param {Number} score 分数
     * @param {cc.v2} pos 显示的位置
     */
    showAddScore: function showAddScore(somedata, score) {
        // console.log("当前清除数据 = " + JSON.stringify(somedata));
        // console.log("当前填充数据 = " + JSON.stringify(this.fillblocks));
        if ((somedata.rows.length > 0 || somedata.cols.length > 0) && this.fillblocks.length > 0) {
            var pos = cc.v2(0, 0);
            var allcell = [];
            if (somedata.rows.length > 0) {
                for (var rowindex = 0; rowindex < somedata.rows.length; rowindex++) {
                    for (var filleindex = 0; filleindex < this.fillblocks.length; filleindex++) {
                        if (somedata.rows[rowindex] == this.fillblocks[filleindex][0]) {
                            allcell.push(this.fillblocks[filleindex]);
                        }
                    }
                }
            }
            if (somedata.cols.length > 0) {
                for (var colindex = 0; colindex < somedata.cols.length; colindex++) {
                    for (var _filleindex = 0; _filleindex < this.fillblocks.length; _filleindex++) {
                        if (somedata.cols[colindex] == this.fillblocks[_filleindex][1]) {
                            allcell.push(this.fillblocks[_filleindex]);
                        }
                    }
                }
            }
            // console.log("当前可以显示分数的位置 " + JSON.stringify(allcell));
            if (allcell.length > 0) {
                if (!this.addscoreLabel) {
                    this.addscoreLabel = cc.instantiate(this.addscoreLabelPrefab);
                    this.root.addChild(this.addscoreLabel, 120000);
                }
                var randomshowIndex = parseInt(Math.random() * allcell.length);
                // console.log("randomshowIndex = " + randomshowIndex);
                var poscell = allcell[randomshowIndex];
                if (poscell) {
                    pos = this.blockViews[poscell[0]][poscell[1]].position;
                    pos = cc.v2(pos.x + this.blockViews[poscell[0]][poscell[1]].width / 2, pos.y + this.blockViews[poscell[0]][poscell[1]].height / 2);
                    this.addscoreLabel.position = pos;
                    this.addscoreLabel.getComponent("AddScoreLabel").setScore(score);
                    this.addscoreLabel.getComponent("AddScoreLabel").show();
                }
            } else {
                tywx.tt.log(TAG, "当前没有显示分数的位置 计算可能出错了");
            }
        }
    },

    /**
     * @description 隐藏底板所有的块
     */
    hideAllBlocks: function hideAllBlocks() {
        var _ref19 = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth],
            w = _ref19[0],
            h = _ref19[1];

        for (var r = 0; r < h; ++r) {
            for (var c = 0; c < w; ++c) {
                var tmp_view = this.blockViews[r][c];
                tmp_view.active = false;
            }
        }
    },
    /**
     * @description 动画显示底板所有的块
     */
    blocksAni: function blocksAni() {
        this.isTouchLocked = true;
        this.hideAllBlocks();
        if (!this.allcellsanis) {
            var allcells = [];
            var dir = 0;
            var outnumber = 8;
            for (var row = 0; row < 4; row++) {
                if (dir == 0) {
                    for (var right = row; right < outnumber; right++) {
                        var data = {};
                        data.row = row;
                        data.column = right;
                        allcells.push(data);
                    }
                    dir = 1;
                }
                if (dir == 1) {
                    for (var up = row + 1; up < outnumber; up++) {
                        var _data = {};
                        _data.row = up;
                        _data.column = outnumber - 1;
                        allcells.push(_data);
                    }
                    dir = 2;
                }
                if (dir == 2) {
                    for (var left = outnumber - 2; left >= 0; left--) {
                        var _data2 = {};
                        _data2.row = outnumber - 1;
                        _data2.column = left;
                        allcells.push(_data2);
                    }
                    dir = 3;
                }
                if (dir == 3) {
                    for (var down = outnumber - 2; down > 0; down--) {
                        var _data3 = {};
                        _data3.row = down;
                        _data3.column = row;
                        allcells.push(_data3);
                    }
                    dir = 0;
                }
                outnumber--;
            }
            this.allcellsanis = allcells;
        }

        var tindex = 0;
        var self = this;
        var showcall = cc.callFunc(function () {
            var data = self.allcellsanis[tindex];
            var block = self.blockViews[data.row][data.column];
            block.active = true;
            tindex++;
            if (tindex == self.allcellsanis.length) {
                self.isTouchLocked = false;
            }
        });
        var totaltime = 1.2;
        var delay = cc.delayTime(totaltime / this.allcellsanis.length);
        var seq = cc.sequence(showcall, delay);
        var trepeate = cc.repeat(seq, this.allcellsanis.length);
        this.node.stopAllActions();
        this.node.runAction(trepeate);
        //  console.log(allcells.length + " zongchangdu  = " + JSON.stringify(allcells));
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
        //# sourceMappingURL=tt_view_play_board.js.map
        