(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/view/tt_view_play_board.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b9179QA0FJBCLk4RWOLvbD5', 'tt_view_play_board', __filename);
// scripts/game/view/tt_view_play_board.js

'use strict';

var TAG = '[tt_view_play_board]';
var Board = require('../model/tt_model_board.js');
var friend = require('../rank/friend.js');
cc.Class({
    extends: cc.Component,

    properties: {
        prefabBlock: cc.Prefab,
        prefabPreview: cc.Prefab,
        labelScore: cc.Label,
        czNumberLabel: cc.Label,
        repNumberLabel: cc.Label,
        friendnode: cc.Node,
        maxScoreLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
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
        this.previewsPos = [];
        this.touchIdx = -1;
        this.touchHeight = 240;
        this.isTouchLocked = false; // *  点击是否被锁住
        this.isUsingHammer = false; // * 是否在使用 锤子道具
        this.board.reset();
        tywx.tt.BoardView = this;
        tywx.tt.Board = this.board;
        friend.addIcon(this.friendnode, this.score);
        tywx.tt.friend = friend;
        this.initLayout();
        this.initBoardView();
        this.initPreviewBlocks();
        this.initTouch();
        this.initHammerTouch();
        this.initChuiZiAndRepeate();
        this.onRefreshScore();

        this.storescorevalue = tywx.tt.Utils.loadItem(tywx.tt.constants.TT_SCORE, 0);
        this.flushMaxScore();
        // this.addCZCallBack(1);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_FILL_BOARD, this.onFillBoard, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_RESET_PREVIEWS, this.onResetPreviews, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_CLEAR_ROW, this.onClearRow, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_REFRESH_SCORE, this.onRefreshScore, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_CLEAR_HAMMER, this.onClearHammer, this);
        tywx.NotificationCenter.listen(tywx.tt.events.TT_REFRESH_PREVIEW_STAT, this.doGameOver, this);
    },


    /**
     * @description 刷新最高分
     */
    flushMaxScore: function flushMaxScore() {
        if (parseInt(this.storescorevalue) < this.board.score) {
            this.maxScoreLabel.string = "历史最佳:" + this.board.score;
        } else {
            this.maxScoreLabel.string = "历史最佳:" + this.storescorevalue;
        }
    },

    start: function start() {},
    onDestroy: function onDestroy() {
        tywx.NotificationCenter.ignoreScope(this);
    },


    // update (dt) {},
    initLayout: function initLayout() {
        this.layout = this.root.getChildByName('layout');
        this.nodeTop = this.layout.getChildByName('node_top');
        this.nodeBoard = this.layout.getChildByName('node_board');
        this.nodeBoardBottom = this.layout.getChildByName('node_board_bottom');
        this.nodeBottom = this.layout.getChildByName('node_bottom');
        var _ref = [cc.game.canvas.width, cc.game.canvas.height],
            cw = _ref[0],
            ch = _ref[1];

        var is_ipx = ch / cw >= 1.9; // *
        if (is_ipx) {
            this.nodeTop.getChildByName("toproot").y = this.nodeTop.getChildByName("toproot").y - 80;
            this.nodeBoard.y = this.nodeBoard.y - 90;
            this.nodeBoard.getChildByName("bg").y = this.nodeBoard.getChildByName("bg").y - 90;
        }
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
        // new cc.Node().

        var tpos = this.root.getChildByName("layout").convertToWorldSpaceAR(bpos);

        var _ref3 = [cc.game.canvas.width, cc.game.canvas.height],
            cw = _ref3[0],
            ch = _ref3[1];

        var is_ipx = ch / cw >= 1.9; // *
        if (is_ipx) {
            padding_bottom = tpos.y - 195 - this.nodeBoard.height / 2;
        }

        // tywx.tt.log(TAG, `initBaordView==${w},${h},${c_s},${size},${padding_left},${padding_bottom}`);
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
                tmp_block.getComponent('tt_view_block').setBgColor(idx ? cc.color('#092D41') : cc.color('#FFFFFF'));
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
        var tpos = this.nodeBoardBottom.parent.convertToWorldSpaceAR(bpos);
        var _ref5 = [cc.game.canvas.width, cc.game.canvas.height],
            cw = _ref5[0],
            ch = _ref5[1];

        var is_ipx = ch / cw >= 1.9; // *
        if (is_ipx) {
            padding_bottom = tpos.y - 261 - this.nodeBoardBottom.height * 2 - 60;
        } else {
            padding_bottom = padding_bottom + this.nodeBoardBottom.height / 2;
        }
        console.log(is_ipx + tpos + "theight = " + "bpos = " + bpos + "padding_bottom position = " + padding_bottom);
        var previewConfigs = this.board.getPreviewConfigs();
        for (var i = 0; i < previewConfigs.length; i++) {
            var tmp_preview = cc.instantiate(this.prefabPreview);
            tmp_preview.parent = this.root;
            tmp_preview.getComponent('tt_view_priview_blocks').init(previewConfigs[i]);
            self.previews.push(tmp_preview);
            x = (i + 1) * 144 + 144 / 2;
            tmp_preview.position = cc.v2(x, padding_bottom);
            this.previewsPos.push(cc.v2(x, padding_bottom));
        }
    },
    initTouch: function initTouch() {
        var _this = this;

        var self = this;
        this.root.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (self.isTouchLocked) return;
            tywx.tt.log(TAG, 'touch start');
            var pos = event.getLocation();
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
                    self.touchIdx = i;
                    preview.position = cc.v2(pos.x, pos.y);
                    preview.getComponent('tt_view_priview_blocks').touch();
                    tywx.tt.log(TAG, 'x[' + lb_x + ',' + pos.x + ',' + rt_x + '],y[' + lb_y + ',' + pos.y + ',' + rt_y + ']');
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
                        self.board.resetPreviews();
                        self.board.checkClear();
                    } else {
                        preview_sc.touchCancle();
                    }
                } else {
                    preview_sc.touchCancle();
                    console.log("getConfig2 = " + preview_sc.getConfig());
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

                    tmp_block_sc.setStat(-1);
                } else {
                    tmp_block_sc.setStat(-2);
                }
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
    onClearRow: function onClearRow() {
        var clear_rows = this.board.clearRows;
        var clear_cols = this.board.clearCols;
        var clear_blocks = [];
        var _ref11 = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth],
            w = _ref11[0],
            h = _ref11[1];

        var self = this;
        clear_rows.forEach(function (e) {
            tywx.tt.log(TAG, 'onClearRow:==' + e);
            for (var c = 0; c < w; ++c) {
                var tmp_block_view = self.blockViews[e][c];
                if (clear_blocks.indexOf(tmp_block_view) < 0) {
                    clear_blocks.push(tmp_block_view);
                }
            }
        });
        clear_cols.forEach(function (e) {
            tywx.tt.log(TAG, 'onClearRow:==' + e);
            for (var r = 0; r < h; ++r) {
                var tmp_block_view = self.blockViews[r][e];
                if (clear_blocks.indexOf(tmp_block_view) < 0) {
                    clear_blocks.push(tmp_block_view);
                }
            }
        });
        var ani_time = 0.2;
        var delay_time = 0.05;
        if (clear_blocks.length > 0) {
            this.isTouchLocked = true;

            var _loop = function _loop(i) {
                var tmp_block_view = clear_blocks[i];
                var is_last = i === clear_blocks.length - 1;
                var display = tmp_block_view.getChildByName('display');
                display.runAction(cc.sequence(cc.delayTime(i * delay_time), cc.spawn(cc.scaleTo(ani_time, 0.1), cc.fadeOut(ani_time)), cc.callFunc(function () {
                    if (is_last) {
                        self.board.clearBlocks();
                        self.isTouchLocked = false;
                    }
                    display.scale = 1.0;
                    display.opacity = 255;
                    tmp_block_view.getComponent('tt_view_block').setStat(0);
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
        if (this.repeatNumber > 0) {
            this.useRepeateCall();
            this.board.forseResetPreviews();
        } else {
            var share_control = tywx.tt.configManager.share_control.gethuanyihuan;
            var calltype = tywx.tt.Utils.shareVideoCtr(share_control);
            var self = this;
            tywx.tt.Utils.hideWXBanner();
            tywx.tt.tipview.show({
                success: function success() {
                    self.repeateRepeatNumberCall();
                },
                tip: "免费获得3次换一换！",
                config: calltype == 1 ? tywx.tt.constants.ShareConfig.GET_HUNAYIHUAN_NUMBER_SHARE : tywx.tt.constants.ShareConfig.GET_HUNAYIHUAN_NUMBER_VIEDO,
                calltype: calltype
            });
        }
    },
    onBtnUseHammer: function onBtnUseHammer() {
        if (this.isTouchLocked) return;
        tywx.tt.log(TAG, 'onBtnUseHammer');
        if (this.czInitNumber > 0) {
            this.hammerTouch.active = true;
        } else {
            var self = this;
            var share_control = tywx.tt.configManager.share_control.getchuizi;
            var calltype = tywx.tt.Utils.shareVideoCtr(share_control);
            tywx.tt.Utils.hideWXBanner();
            tywx.tt.tipview.show({
                success: function success() {
                    self.addCZCallBack(1);
                },
                tip: "免费获得1个锤子！",
                config: calltype == 1 ? tywx.tt.constants.ShareConfig.GET_CHUIZI_NUMBER_SHARE : tywx.tt.constants.ShareConfig.GET_CHUIZI_NUMBER_VIEDO,
                calltype: calltype
            });
        }
    },
    hideAllBlockFrames: function hideAllBlockFrames() {
        var _ref12 = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth],
            w = _ref12[0],
            h = _ref12[1];

        for (var r = 0; r < h; ++r) {
            for (var c = 0; c < w; ++c) {
                var tmp_view = this.blockViews[r][c];
                var tmp_block_sc = tmp_view.getComponent('tt_view_block');
                tmp_block_sc.setStat(-2);
            }
        }
    },
    onRefreshScore: function onRefreshScore() {
        if (this.board.score > 70) {}
        friend.setScore(this.board.score);
        this.labelScore.string = '' + this.board.score;
    },
    showHammerSelectFrameByPosition: function showHammerSelectFrameByPosition(pos) {
        var _ref13 = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth],
            w = _ref13[0],
            h = _ref13[1];

        for (var r = 0; r < h; ++r) {
            for (var c = 0; c < w; ++c) {
                var _tmp_block_view2 = this.blockViews[r][c];
                var _ref14 = [_tmp_block_view2.x, _tmp_block_view2.y, _tmp_block_view2.width, _tmp_block_view2.height],
                    x = _ref14[0],
                    y = _ref14[1],
                    b_w = _ref14[2],
                    b_h = _ref14[3];
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
        var _ref15 = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth],
            w = _ref15[0],
            h = _ref15[1];

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
        var _this2 = this;

        if (blocks.length > 0) this.isTouchLocked = true;else return;
        var self = this;
        var delay_time = 0.05;
        var ani_time = 0.2;

        var _loop2 = function _loop2(i) {
            var is_last = i === blocks.length - 1;
            var tmp_row = blocks[i][0];
            var tmp_col = blocks[i][1];
            var tmp_block_view = _this2.blockViews[tmp_row][tmp_col];
            var display = tmp_block_view.getChildByName('display');
            display.runAction(cc.sequence(cc.delayTime(i * delay_time), cc.spawn(cc.scaleTo(ani_time, 0.1), cc.fadeOut(ani_time)), cc.callFunc(function () {
                if (is_last) {
                    self.isTouchLocked = false;
                }
                display.scale = 1.0;
                display.opacity = 255;
                tmp_block_view.getComponent('tt_view_block').setStat(0);
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
        this.czNumberLabel.string = czNumber + "";
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
        this.czNumberLabel.string = czNumber + "";
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
    repeateRepeatNumberCall: function repeateRepeatNumberCall() {
        this.repeatNumber = this.repeatNumber + 3;
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
        this.czNumberLabel.string = czNumber + "";
    },

    /** 
     * @description 处理游戏是否结束
    */
    doGameOver: function doGameOver() {
        // console.log(this.board.previewStat.length + "this.bord = " + JSON.stringify(this.board.previewStat));
        var stats = this.board.previewStat;
        tywx.tt.log(TAG, stats.length + "this.bord = " + stats);
        var gameover = true;
        for (var ti = 0; stats.length; ti++) {
            if (stats[ti] != 0) {
                gameover = false;
                break;
            }
        }

        var tgameover = gameover && this.repeatNumber == 0;
        tywx.tt.log(TAG, "gameover " + tgameover);
        if (gameover && this.repeatNumber == 0) {
            // 停止刷新即将超越的好友
            friend.setStop(true);
            // 显示复活界面
            tywx.tt.fuhuo.show({
                score: this.board.score
            });
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
        //# sourceMappingURL=tt_view_play_board.js.map
        