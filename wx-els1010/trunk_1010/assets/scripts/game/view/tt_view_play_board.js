let TAG = '[tt_view_play_board]';
let Board = require('../model/tt_model_board.js');

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
        chuiziNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
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
    hideHarmer:function(hide){
        if (hide){
            this.chuiziNoneNode.active = true;
            this.chuiziNode.active = false;
        } else{
            this.chuiziNoneNode.active = false;
            this.chuiziNode.active = true;
        }
        
    },

    // 判断当前是否需要检测已经全部拖完preview
    checkPreviewActives:function(){
        let canputnumber = 0;
        for (let i = 0; i < this.previews.length; i++) {
            let previewscr = this.previews[i].getComponent('tt_view_priview_blocks');
            if (previewscr.isCanPut()){
               canputnumber ++;
            }
        }
        return canputnumber;
    },

    /**
     * @description 刷新最高分
     */
    flushMaxScore: function () {
        if (parseInt(this.storescorevalue) < this.board.score) {
            this.maxScoreLabel.string = "历史最佳:" + this.board.score;
            tywx.tt.curgamescene.flushMaxScore(this.board.score);
        } else {
            tywx.tt.curgamescene.flushMaxScore(this.storescorevalue)
        }
    },

    start() {

    },
    onDestroy() {
        tywx.NotificationCenter.ignoreScope(this);
    },

    // update (dt) {},
    initLayout() {
        this.layout = this.root.getChildByName('layout');
        this.nodeTop = this.layout.getChildByName('node_top'); //1085
        this.nodeBoard = this.layout.getChildByName('node_board'); //452
        this.nodeBoardBottom = this.layout.getChildByName('node_board_bottom'); //261
        this.nodeBottom = this.layout.getChildByName('node_bottom'); // 0
        let [cw, ch] = [cc.game.canvas.width, cc.game.canvas.height];


        let top_y = (1085 / 1280) * ch;
        let board_y = (410 / 1280) * ch;
        let board_bottom_y = (190 / 1280) * ch;
        let bottom_y = 0;

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



    initBoardView() {
        // * init board view
        let [w, h] = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth];
        let c_s = tywx.tt.constants.BlockSize;
        let size = this.root.getBoundingBox();
        // let block_scale = size.width / 720;
        // c_s.width = c_s.width * block_scale;
        // c_s.height = c_s.height * block_scale;

        let scalebl = 720 / this.root.width;
        let theight = 1280 / this.root.height;
        let ttheight = theight / 2;
        let padding_left = (this.root.width * scalebl - w * c_s.width) / 2;
        var bpos = this.nodeBoard.position;
        let padding_bottom = bpos.y; //size.height * 0.35; //(size.height - h * c_s.height) / 2;
        let tpos2 = this.nodeBoard.convertToWorldSpace(cc.v2(this.nodeBoard.width / 2, this.nodeBoard.height / 2));
        let tpos = this.nodeBoard.convertToWorldSpaceAR(cc.v2(this.nodeBoard.width / 2, 0));
        let tpy = tpos.y - tpos2.y;
        let [cw, ch] = [cc.game.canvas.width, cc.game.canvas.height];
        let hc = 1280 / cc.game.canvas.height;
        // let is_ipx = ch / cw >= 1.9; // *
        // if (is_ipx) {
        //     padding_bottom = tpos.y - this.nodeBoard.height / 2 - 220 + ((220 - (220 * hc)) / 2);
        // }

        this.blockViews = [];

        let [x, y] = [0, 0];
        let [lb_x, lb_y, rt_x, rt_y] = [0, 0, 0, 0];
        let idx = true;
        for (let i = 0; i < h; ++i) {
            y = padding_bottom + i * c_s.height;
            this.blockViews[i] = [];
            idx = i % 2 === 0 ? true : false;
            for (let j = 0; j < w; ++j) {
                x = padding_left + j * c_s.width;
                let tmp_block = cc.instantiate(this.prefabBlock);
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

    initPreviewBlocks() {
        this.previews = [];
        let self = this;
        let [x, y] = [0, this.nodeBoardBottom.y];
        let bpos = this.nodeBoardBottom.position;
        let padding_bottom = bpos.y; //size.height * 0.35; //(size.height - h * c_s.height) / 2;
        let tpos = this.nodeBoardBottom.convertToWorldSpaceAR(cc.v2(0, 0));
        let [cw, ch] = [cc.game.canvas.width, cc.game.canvas.height];
        let is_ipx = ch / cw >= 1.9; // *
        let ch2 = 1280 / cc.game.canvas.height;
        // if (is_ipx) {
        //     padding_bottom = tpos.y - 261 - 452 + 20;
        // } else {
        //     padding_bottom = padding_bottom + this.nodeBoardBottom.height / 2;
        // }
        padding_bottom = padding_bottom + this.nodeBoardBottom.height / 2;
        let previewConfigs = this.board.getPreviewConfigs();
        for (let i = 0; i < previewConfigs.length; i++) {
            if (previewConfigs[i]) {
                let tmp_preview = cc.instantiate(this.prefabPreview);
                tmp_preview.parent = this.root;
                tmp_preview.getComponent('tt_view_priview_blocks').init(previewConfigs[i]);
                self.previews.push(tmp_preview);
                x = (i + 1) * 144 + 144 / 2;
                tmp_preview.position = cc.v2(x, padding_bottom);
                this.previewsPos.push(cc.v2(x, padding_bottom));
            }
        }
    },
    initTouch() {
        let self = this;
        this.root.on(cc.Node.EventType.TOUCH_START, event => {
            if (self.isTouchLocked) return;
            tywx.tt.log(TAG, 'touch start');
            let pos = event.getLocation();
            tywx.tt.curgamescene.qzShowBase();
            self.pretouchpos = pos;
            self.touchIdx = -1;
            for (let i = 0; i < self.previews.length; i++) {
                let preview = self.previews[i];
                let [x, y] = [preview.x, preview.y];
                let [w, h] = [130, 130]; //[preview.width,preview.height];
                let [lb_x, lb_y] = [x - w / 2, y - h / 2];
                let [rt_x, rt_y] = [x + w / 2, y + h / 2];
                if (pos.x >= lb_x && pos.x <= rt_x && pos.y >= lb_y && pos.y <= rt_y) {
                    if (tywx.tt.Board.previewStat[i] == 1 || (this.helpindex && this.helpindex < 3 && this.helpindex != -1)) {
                        self.touchIdx = i;
                        preview.position = cc.v2(pos.x, pos.y);
                        tywx.tt.AudioManager.getInstance().playSound(tywx.tt.constants.SOUNDS.COMBO[0]);
                        preview.getComponent('tt_view_priview_blocks').touch();
                        tywx.tt.log(TAG, `x[${lb_x},${pos.x},${rt_x}],y[${lb_y},${pos.y},${rt_y}]`);
                    } else {
                        tywx.tt.Utils.showAlert("点击使用换一换");
                    }

                }
            }
        });
        this.root.on(cc.Node.EventType.TOUCH_MOVE, event => {
            if (self.isTouchLocked) return;
            let pos = event.getLocation();
            if (Math.abs(self.pretouchpos.x - pos.x) < 10 && Math.abs(self.pretouchpos.y - pos.y) < 10) {
                return;
            }
            if (self.touchIdx !== -1 && self.touchIdx < self.previews.length) {
                let preview = self.previews[self.touchIdx];
                preview.position = cc.v2(pos.x, pos.y + this.touchHeight);
                self.refreshShadowFrame();
            }
        });
        this.root.on(cc.Node.EventType.TOUCH_END, event => {
            if (self.isTouchLocked) return;
            tywx.tt.log(TAG, 'touch end');

            let pos = event.getLocation();


            if (self.touchIdx !== -1 && self.touchIdx < self.previews.length) {
                let is_put_success = false;
                if (pos.x >= self.lbPos.x &&
                    pos.x <= self.rtPos.x &&
                    pos.y + this.touchHeight >= self.lbPos.y &&
                    pos.y + this.touchHeight <= self.rtPos.y) {
                    is_put_success = true;
                }
                let preview = self.previews[self.touchIdx];

                preview.position = self.previewsPos[self.touchIdx];
                let preview_sc = preview.getComponent('tt_view_priview_blocks');
                if (Math.abs(self.pretouchpos.x - pos.x) < 10 && Math.abs(self.pretouchpos.y - pos.y) < 10) {
                    preview_sc.touchCancle();
                    return;
                }
                if (is_put_success) {
                    let config = preview_sc.config;
                    if (self.fillBoard(cc.v2(pos.x, pos.y + this.touchHeight), config)) {
                        preview_sc.put();
                        self.board.resetPreviews(true);
                        self.board.checkClear();
                    } else {
                        self.board.refreshPreviewStat();
                        preview_sc.touchCancle();
                    }
                } else {
                    preview_sc.touchCancle();
                    tywx.tt.log(TAG, "getConfig2 = " + preview_sc.getConfig())
                }
            }
            self.hideAllBlockFrames();
            self.touchIdx = -1;
        });
    },

    initHammerTouch() {
        let self = this;
        this.hammerTouch.on(cc.Node.EventType.TOUCH_START, event => {
            self.hammerIcon.active = true;
            let pos = event.getLocation();
            self.showHammerSelectFrameByPosition(pos);
        });
        this.hammerTouch.on(cc.Node.EventType.TOUCH_MOVE, event => {
            let pos = event.getLocation();
            self.showHammerSelectFrameByPosition(pos);
        });
        this.hammerTouch.on(cc.Node.EventType.TOUCH_END, event => {
            let pos = event.getLocation();
            self.hammerTouch.active = false;
            self.hammerIcon.active = false;
            self.useHammerByPosition(pos);
            self.hideAllBlockMask();
        });
    },
    refreshShadowFrame() {
        if (this.touchIdx < 0 || this.touchIdx >= this.previews.length) {
            // tywx.tt.warn(TAG, `wrong touch index when call refreshShadowFrame , touchIdx=${this.touchIdx}`);
            return;
        }
        //tywx.tt.log(TAG,`refreshShadowFrame touchIdx=${this.touchIdx}`);
        let select_preview = this.previews[this.touchIdx];
        let select_pos = select_preview.position;
        let select_config = select_preview.getComponent('tt_view_priview_blocks').getConfig();
        let [c_r, c_c] = [-1, -1];
        let [m_r, m_c] = [tywx.tt.constants.BoardHeight, tywx.tt.constants.BoardWidth];
      
        let row = this.blockViews.length;
        for (let r = 0; r < row; ++r) {
            let col = this.blockViews[r].length;
            for (let c = 0; c < col; ++c) {
                let tmp_block_view = this.blockViews[r][c];
                let tmp_block_sc = tmp_block_view.getComponent('tt_view_block');
                let [x, y, w, h] = [tmp_block_view.x, tmp_block_view.y, tmp_block_view.width, tmp_block_view.height];
                let [lb_x, lb_y, rt_x, rt_y] = [x, y, x + w, y + h];
                if (select_pos.x >= lb_x &&
                    select_pos.x <= rt_x &&
                    select_pos.y >= lb_y &&
                    select_pos.y <= rt_y) {
                    [c_r, c_c] = [r, c];
                }
                tmp_block_sc.setStat(-2);
            }
        }

        if (c_r !== -1 && c_c !== -1) {
            let BlockMap = tywx.tt.constants.BlockMap;
            let debug_infos = [];
            for (let r = 0; r < select_config.length; ++r) {
                let line = select_config[r];
                for (let c = 0; c < line.length; ++c) {
                    let dis = BlockMap[r][c];
                    if (select_config[r][c] !== 0) {
                        let [b_r, b_c] = [c_r + dis[1], c_c + dis[0]];
                        if (b_r >= 0 && b_r < m_r &&
                            b_c >= 0 && b_c < m_c) {
                            let tmp_block_view = this.blockViews[b_r][b_c];
                            let tmp_block_sc = tmp_block_view.getComponent('tt_view_block');
                            tmp_block_sc.setStat(-1);
                            debug_infos.push(`{c=${b_c},r=${b_r}}`);
                        }
                    }
                }
            }
            if (debug_infos.length < 4) {
                tywx.tt.warn(TAG, `{cr=${c_r},cc=${c_c}}`, [...debug_infos]);
            }
        }
    },
    fillBoard(pos, config) {
        let ret = false;
        let view_data = this.getBlockViewByPosition(pos);
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
    getBlockViewByPosition(pos) {
        let ret = null;
        let [m_r, m_c] = [tywx.tt.constants.BoardHeight, tywx.tt.constants.BoardWidth];
        let [c_r, c_c] = [-1, -1];
        let block_view = null;
        for (let r = 0; r < m_r; ++r) {
            for (let c = 0; c < m_c; ++c) {
                let tmp_block_view = this.blockViews[r][c];
                let [x, y, w, h] = [tmp_block_view.x, tmp_block_view.y, tmp_block_view.width, tmp_block_view.height];
                let [lb_x, lb_y, rt_x, rt_y] = [x, y, x + w, y + h];
                if (pos.x >= lb_x &&
                    pos.x <= rt_x &&
                    pos.y >= lb_y &&
                    pos.y <= rt_y) {
                    [c_r, c_c] = [r, c];
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
    onFillBoard(params) {
        this.fillblocks = params;
        tywx.tt.log(TAG, 'onFillBoard' + JSON.stringify(params));
        let self = this;
        params.forEach(e => {
            let tmp_block_view = self.blockViews[e[0]][e[1]];
            let tmp_block_sc = tmp_block_view.getComponent('tt_view_block');
            tmp_block_sc.setStat(e[2]);
        });

    },
    onResetPreviews() {
        let previewConfigs = this.board.getPreviewConfigs();
        tywx.tt.log(TAG, 'onResetPreviews==>' + previewConfigs.length);
        for (let i = 0; i < previewConfigs.length; i++) {
            let config = previewConfigs[i];
            let view = this.previews[i];
            tywx.tt.log(TAG, 'onResetPreviews==>' + i);
            view.getComponent('tt_view_priview_blocks').resetByConfig(config);
        }
    },

    reset() {
        this.board.reset();
        this.gameover = false;
        this.board.setScore(0);
        let [mr, mc] = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardHeight];
        for (let r = 0; r < mr; ++r) {
            for (let c = 0; c < mc; ++c) {
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
    onClearRow() {
        let clear_rows = this.board.clearRows;
        let clear_cols = this.board.clearCols;
        let clear_blocks = [];
        let [w, h] = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth];
        let self = this;
        this.lotteryboxs = [];
        clear_rows.forEach(e => {
            tywx.tt.log(TAG, `onClearRow:==${e}`);
            for (let c = 0; c < w; ++c) {
                let tmp_block_view = self.blockViews[e][c];
                if (this.board.board[e][c] == 12) {
                    this.lotteryboxs.push(12);
                }
                if (clear_blocks.indexOf(tmp_block_view) < 0) {
                    clear_blocks.push(tmp_block_view);
                }
            }
        });
        clear_cols.forEach(e => {
            tywx.tt.log(TAG, `onClearRow:==${e}`);
            for (let r = 0; r < h; ++r) {
                let tmp_block_view = self.blockViews[r][e];
                if (this.board.board[r][e] == 12) {
                    this.lotteryboxs.push(12);
                }
                if (clear_blocks.indexOf(tmp_block_view) < 0) {
                    clear_blocks.push(tmp_block_view);
                }
            }
        });
        let ani_time = 0.2;
        let delay_time = 0.05;
        let tcleartypes = [];
        this.showAddScore({
            rows: this.board.clearRows,
            cols: this.board.clearCols,
        }, this.board.getAddScoreByClear(this.board.clearRows, this.board.clearCols));
        if (clear_blocks.length > 0) {
            tywx.tt.AudioManager.getInstance().playSound(tywx.tt.constants.SOUNDS.SHUIXIAQIPAO);
            
            this.isTouchLocked = true;
            for (let i = 0; i < clear_blocks.length; ++i) {
                let tmp_block_view = clear_blocks[i];
                let is_last = i === (clear_blocks.length - 1);

                let display = tmp_block_view.getChildByName('display');
                display.runAction(
                    cc.sequence(
                        cc.delayTime(i * delay_time),
                        cc.spawn(
                            cc.scaleTo(ani_time, 0.1),
                            cc.fadeOut(ani_time)
                        ),
                        cc.callFunc(() => {
                            display.scale = 1.0;
                            display.opacity = 255;
                            tmp_block_view.getComponent('tt_view_block').setStat(0);
                            if (is_last) {
                                self.board.clearBlocks();
                                self.isTouchLocked = false;
                            }
                        })
                    )
                );
            }
        }


    },
    onBtnResetPreviews() {
        if (this.isTouchLocked) return;
        tywx.tt.log(TAG, 'onBtnResetPreviews');
        if (this.helpindex && this.helpindex > 0) {
            return;
        }
        if (this.repeatNumber > 0) {
            this.useRepeateCall();
            this.board.forseResetPreviews();
        } else {
            const share_control = tywx.tt.configManager.getInstance().share_control ? tywx.tt.configManager.getInstance().share_control.gethuanyihuan : ["share", 50];
            const calltype = tywx.tt.Utils.shareVideoCtr(share_control);
            const self = this;
            tywx.tt.Utils.hideWXBanner();
            tywx.tt.tipview.show({
                success: function () {
                    self.repeateRepeatNumberCall();
                },
                tip: "免费获得3次换一换！可以在危险的时候使用。",
                config: calltype == 1 ? tywx.tt.constants.ShareConfig.GET_HUNAYIHUAN_NUMBER_SHARE : tywx.tt.constants.ShareConfig.GET_HUNAYIHUAN_NUMBER_VIEDO,
                calltype: calltype,

            });

        }
    },
    onBtnUseHammer() {
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

    lqHarmmer:function(){
        const self = this;
        const share_control = tywx.tt.configManager.getInstance().share_control ? tywx.tt.configManager.getInstance().share_control.getchuizi : ["share", 50];
        const calltype = tywx.tt.Utils.shareVideoCtr(share_control);
        tywx.tt.Utils.hideWXBanner();
        tywx.tt.tipview.show({
            success: function () {
                self.addCZCallBack(1);
                self.hideHarmer(false);
            },
            tip: "免费获得1个锤子！可以用来点击消除3*3范围的方块.",
            config: calltype == 1 ? tywx.tt.constants.ShareConfig.GET_CHUIZI_NUMBER_SHARE : tywx.tt.constants.ShareConfig.GET_CHUIZI_NUMBER_VIEDO,
            calltype: calltype,
        });
    },
    
    hideAllBlockFrames() {
        let [w, h] = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth];
        for (let r = 0; r < h; ++r) {
            for (let c = 0; c < w; ++c) {
                let tmp_view = this.blockViews[r][c];
                let tmp_block_sc = tmp_view.getComponent('tt_view_block');
                tmp_block_sc.setStat(-2);
            }
        }
    },

    /**
     * @description 刷分
     * @param {Object} somedata 刷分的时候自带刷新数据
     */
    onRefreshScore(somedata) {
        console.log("当前的分数 = ", this.board.score);
        tywx.tt.curgamescene.setScore(this.board.score);
        if (somedata) {
            this.showLottery(somedata);
        }
    },
    showHammerSelectFrameByPosition(pos) {
        let [w, h] = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth];
        for (let r = 0; r < h; ++r) {
            for (let c = 0; c < w; ++c) {
                let tmp_block_view = this.blockViews[r][c];
                let [x, y, b_w, b_h] = [tmp_block_view.x, tmp_block_view.y, tmp_block_view.width, tmp_block_view.height];
                let [lb_x, lb_y, rt_x, rt_y] = [x, y, x + b_w, y + b_h];
                if (pos.x >= lb_x && pos.x <= rt_x &&
                    pos.y >= lb_y && pos.y <= rt_y) {
                    tywx.tt.log(TAG, `showHammerSelectFrameByPosition==>${r},${c}`);
                    this.showHammerShadowByRowAndCol(r, c);
                    this.hammerIcon.position = tmp_block_view.position;
                    break;
                }
            }
        }
    },
    hideAllBlockMask() {
        for (let r = 0; r < this.blockViews.length; ++r) {
            for (let c = 0; c < this.blockViews[r].length; ++c) {
                this.blockViews[r][c].getComponent('tt_view_block').hideMask();
            }
        }
    },
    showHammerShadowByRowAndCol(row, col) {
        let shadow_blocks = [
            [
                [-1, 1],
                [0, 1],
                [1, 1]
            ],
            [
                [-1, 0],
                [0, 0],
                [1, 0]
            ],
            [
                [-1, -1],
                [0, -1],
                [1, -1]
            ]
        ];
        let [w, h] = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth];
        this.hideAllBlockMask();
        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                let data = shadow_blocks[r][c];
                let tmp_col = col + data[0];
                let tmp_row = row + data[1];
                if (tmp_col >= 0 && tmp_row >= 0 && tmp_col < w && tmp_row < h) {
                    let tmp_block = this.blockViews[tmp_row][tmp_col];
                    let tmp_block_sc = tmp_block.getComponent('tt_view_block');
                    tmp_block_sc.showMask();
                }
            }
        }
    },
    useHammerByPosition(pos) {
        let data = this.getBlockViewByPosition(pos);
        tywx.tt.log(TAG, `usehammerByPosition>>>row:${data.centerRow},col:${data.centerCol}`);
        if (data.blockView) {
            this.board.hammerClearByRowAndCol(data.centerRow, data.centerCol);
            // 刷新锤子的显示
            this.useCZNumber(-1);
        }
    },
    onClearHammer(blocks) {
        if (blocks.length > 0) this.isTouchLocked = true;
        else return;
        let self = this;
        let delay_time = 0.05;
        let ani_time = 0.2;
        for (let i = 0; i < blocks.length; i++) {
            let is_last = i === (blocks.length - 1);
            let tmp_row = blocks[i][0];
            let tmp_col = blocks[i][1];
            let tmp_block_view = this.blockViews[tmp_row][tmp_col];
            let display = tmp_block_view.getChildByName('display');
            display.runAction(
                cc.sequence(
                    cc.delayTime(i * delay_time),
                    cc.spawn(
                        cc.scaleTo(ani_time, 0.1),
                        cc.fadeOut(ani_time)
                    ),
                    cc.callFunc(() => {
                        display.scale = 1.0;
                        display.opacity = 255;
                        tmp_block_view.getComponent('tt_view_block').setStat(0);
                        if (is_last) {
                            self.isTouchLocked = false;
                            tywx.tt.Board.refreshPreviewStat();
                        }
                    })
                )
            );
        }
    },

    /**
     * @description 初始化锤子数量和重置次数
     */
    initChuiZiAndRepeate: function () {
        const items = JSON.parse(tywx.tt.Utils.loadItem("tt-items", "[]"));
        var czNumber = 0;
        for (var tiIndex = 0; tiIndex < items.length; tiIndex++) {
            const titem = items[tiIndex];
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
    useCZNumber: function (add) {
        const items = JSON.parse(tywx.tt.Utils.loadItem("tt-items", "[]"));
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
    useRepeateCall: function () {
        if (this.repeatNumber > 0) {
            this.repeatNumber--;
            this.repNumberLabel.string = this.repeatNumber + "/3";
        } else {
            tywx.tt.error(TAG, "换一换的使用次数为 " + this.repeatNumber)
        }
    },

    /**
     * 重置换一换的次数
     */
    repeateRepeatNumberCall: function (repnum) {
        this.gameover = false;
        this.repeatNumber = 3;
        this.useRepeateNumber = this.useRepeateNumber + 1;
        this.repNumberLabel.string = this.repeatNumber + "/3";
    },

    /**
     * @添加锤子
     * @param {Number} num 添加锤子的数量
     */
    addCZCallBack: function (num) {
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
                if ((items[tiIndex].id == 2 || items[tiIndex].id == 4 || items[tiIndex].id == 6)) {
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
    flushPreviewStatueUI: function () {
        let stats = this.board.previewStat;
        console.log(" 设置的状态 =  " + stats[0]);
        console.log(stats.length + " 当前的所有状态 = " + stats);
        let haszeorstate = false;

        for (let ti1 = 0; ti1 < stats.length; ti1++) {
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

       refreshPreStatue: function () {
        //    if (this.hadrefresh) {
        //        return;
        //    }
           let self = this;
           this.hadrefresh = true;
           let time = tywx.tt.Board.hasclear == true? 0.5 : 0.2;
           this.doGameOver(); 
       },
    
    /** 
     * @description 处理游戏是否结束
     */
    doGameOver: function () {
        this.hadrefresh = false;
        let self = this;
        let deal = false;
        for (let tg = 0; tg < 3; tg++) {
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
        let stats = this.board.previewStat
        tywx.tt.log(TAG, stats.length + "this.bord = " + stats);
        let gameover = true;

        for (let ti1 = 0; ti1 < stats.length; ti1++) {
            if (stats[ti1] == 1) {
                gameover = false;
            }

        }

        const tgameover = gameover && this.repeatNumber == 0;
        tywx.tt.log("tgameover " + tgameover);
        if (tgameover) {
            this.alertNode.active = false;
            this.gameover = true;
            tywx.tt.Utils.hideWXBanner();
            const share_control = tywx.tt.configManager.getInstance().share_control ? tywx.tt.configManager.getInstance().share_control.gethuanyihuan : ["share", 50];
            const calltype = tywx.tt.Utils.shareVideoCtr(share_control);
            tywx.tt.tipview.show({
                success: function () {
                    self.repeateRepeatNumberCall();
                },
                tip: "免费获得3次换一换！可以复活!",
                config: calltype == 1 ? tywx.tt.constants.ShareConfig.GET_HUNAYIHUAN_NUMBER_SHARE : tywx.tt.constants.ShareConfig.GET_HUNAYIHUAN_NUMBER_VIEDO,
                calltype: calltype,
                closecall: function () {
                    // 停止刷新即将超越的好友
                    tywx.tt.friend.setStop(true);
                    // 显示复活界面
                    tywx.tt.fuhuo.show({
                        score: self.board.score,
                    })
                }
            });

        }
    },

    /**
     * @description 显示帮助界面
     */
    showHelp: function () {
        this.helpindex = 1;
        let data = [];
        for (var row = 0; row < 8; row++) {
            for (let bordI = 0; bordI < 8; bordI++) {
                var tdata = [];
                tdata[0] = row;
                tdata[1] = bordI;
                tdata[2] = 3;
                if ((row >= 3 && row < 5 && (bordI != 3 && bordI != 4))) {
                    data.push(tdata);
                } else {
                    let canadd = true;
                    if ((bordI == 3 || bordI == 4) && (row == 3 || row == 4)) {
                        canadd = false;
                    }
                    let [r, c] = [tdata[0], tdata[1]];
                    if (this.board.board[r][c] === 0 && canadd) {
                        this.board.board[r][c] = -2;
                        this.board.emptyBlocks.delete(`${r}_${c}`);
                    }
                }
            }
        }
        data.forEach(e => {
            let [r, c] = [e[0], e[1]];
            if (this.board.board[r][c] === 0) {
                this.board.board[r][c] = e[2];
                this.board.emptyBlocks.delete(`${r}_${c}`);
            }
            let tmp_block_view = this.blockViews[e[0]][e[1]];
            let tmp_block_sc = tmp_block_view.getComponent('tt_view_block');
            tmp_block_sc.setStat(e[2]);
        })
        this.board.previewStat[0] = 0;
        this.board.previewStat[1] = 1;
        this.board.previewStat[0] = 0;
        // this.blockViews[3][3].opacity = 122,
        // this.blockViews[4][3].opacity = 122,
        let p4pos = this.blockViews[4][3].position;
        this.blinkNode.position = cc.v2(p4pos.x + 38, p4pos.y);
        // this.blockViews[3][3].getComponent("tt_view_block").blockBlink();
        // this.blockViews[4][3].getComponent("tt_view_block").blockBlink();
        this.helpts.node.active = true;
        // this.helpts.node.position = this.blockViews[3][3].parent.parent.position;
        this.previews[0].active = false;
        this.previews[2].active = false;
        this.helpTip.active = true;
        let scale1 = cc.scaleTo(0.5, 1.1);
        let scale2 = cc.scaleTo(0.5, 1);
        let delay = cc.delayTime(0.2);
        let seq = cc.sequence(scale1, scale2, delay);
        this.blinkNode.zIndex = 99998;
        this.shouzhiNode.zIndex = 99999;
        this.blinkNode.runAction(cc.repeatForever(seq));
        let rep = cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.1), cc.scaleTo(0.5, 1)));
        this.helpts.node.runAction(rep);
        this.previews[1].getComponent("tt_view_priview_blocks").resetByConfig(this.getHelpPreviewBlockData());
        this.showzhiAction(this.blockViews[3][3].position);
        tywx.tt.log(TAG, "新手数据  = " + JSON.stringify(this.helpts.node.position));
    },

    showzhiAction: function (position) {
        this.shouzhiNode.stopAllActions();
        this.shouzhiNode.active = true;
        this.shouzhiNode.getComponent(cc.Animation).play("dragani");
        this.shouzhiNode.position = cc.v2(this.previews[1].position.x + 45, this.previews[1].position.y - 38);
        let move = cc.moveTo(0.5, cc.v2(position.x + 76, position.y + 38));
        let delay = cc.delayTime(0.5);
        let move2 = cc.moveTo(0.5, cc.v2(this.previews[1].position.x + 45, this.previews[1].position.y - 38));
        let seq2 = cc.sequence(move, delay, move2);
        this.shouzhiNode.runAction(cc.repeatForever(seq2));
    },

    /**
     * @description 完成第一步帮助后的回调
     */
    helpAdd: function () {
        if (this.helpindex > 0) {
            this.helpindex++;
            if (this.helpindex == 2) {
                var self = this;
                this.helpTipLabel.string = "再拖动块到目标位置,就可以消除这两行了。"
                this.previews[1].active = true;
                tywx.Timer.setTimer(this, function () {
                    this.showzhiAction(this.blockViews[3][4].position);
                    // this.blockViews[3][3].getComponent("tt_view_block").blockHide();
                    // this.blockViews[4][3].getComponent("tt_view_block").blockHide();
                    // this.blockViews[3][4].getComponent("tt_view_block").blockBlink();
                    // this.blockViews[4][4].getComponent("tt_view_block").blockBlink();
                    let p4pos = this.blockViews[4][4].position;
                    this.blinkNode.position = cc.v2(p4pos.x + 38, p4pos.y);
                    self.previews[1].getComponent("tt_view_priview_blocks").resetByConfig(self.getHelpPreviewBlockData())
                }, 1, 0, 0.3);
            } else {
                // 清空棋盘重新开始
                this.helpindex = -1;
                this.helpts.node.stopAllActions();
                this.helpts.node.active = false;
                this.helpTipLabel.string = "恭喜您，祝您玩得愉快。"
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
    getHelpPreviewBlockData: function () {
        const config = tywx.tt.constants.Blocks[1];
        return config;
    },

    /** 
     * @description 得到是否需要帮助
     */
    getHelp: function () {
        const hadhelp = tywx.tt.Utils.loadItem("hadhelp", 1);
        return hadhelp;
    },

    /**
     * @description 复活游戏
     */
    recoverGame: function () {
        this.gameover = false;
        let clears = [];
        let rows = [0, 1, 2, 3, 4, 5, 6, 7];
        let columns = [0, 1, 2, 3, 4, 5, 6, 7];
        for (let ti = 0; ti < 8; ti++) {
            let data = {};
            data.row = rows[ti];
            data.column = columns[7 - ti];
            clears.push(data);
            data = {};
            data.row = rows[7 - ti];
            data.column = columns[ti];
            clears.push(data);
        }
        tywx.tt.log(TAG, "data clear = " + JSON.stringify(clears));
        clears.forEach(data => {
            this.board.hammerClearByRowAndCol(data.row, data.column);
        });
        tywx.tt.Board.refreshPreviewStat();
    },

    /**
     * @description 显示抽奖
     * @param {Object} param 消除行列的位置信息
     */
    showLottery: function (param) {
        if (this.helpindex && this.helpindex < 3) {
            return
        }
        if (this.gameover) {
            return;
        }

        if (!tywx.tt.configManager.getInstance().lottery) {
            return;
        }
        // 产看当前是否有宝箱可以弹出
        let boxs = this.lotteryboxs;
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
        for (let scoreIndex = 0; scoreIndex < tywx.tt.configManager.getInstance().lottery.score.length; scoreIndex++) {
            if (this.board.score <= tywx.tt.configManager.getInstance().lottery.score[scoreIndex]) {
                cjIndex = scoreIndex;
                break;
            }
        }
        let rate = tywx.tt.configManager.getInstance().lottery.rate[cjIndex];
        let max = tywx.tt.configManager.getInstance().lottery.max[cjIndex];
        let random = Math.random();
        // 产生抽奖
        tywx.tt.log(TAG, "score = " + this.board.score + " max = " + max + "random = " + random + " rate =  " + rate + " cjIndex = " + cjIndex);
        if (random <= rate && this.lotteryboxnumber < max) {
            this.lotteryboxnumber++;
            // 1 row 2 col
            let tbord = [];
            for (let r = 0; r < this.board.board.length; r++) {
                let tdata = this.board.board[r];
                for (let c = 0; c < tdata.length; c++) {
                    if (this.board.board[r][c] > 0) {
                        let tgz = {};
                        tgz.row = r;
                        tgz.column = c;
                        tbord.push(tgz);
                    }
                }
            }
            let sbord = tbord[parseInt(Math.random() * tbord.length)];
            tywx.tt.log("展示的位置2  = " + JSON.stringify(sbord));
            if (sbord.row && sbord.column) {
                this.blockViews[sbord.row][sbord.column].getComponent("tt_view_block").setStat(12);
                this.board.board[sbord.row][sbord.column] = 12;
                this.board.emptyBlocks.delete(`${ sbord.row}_${sbord.column}`);
            }
        } else {

        }
    },



    /**
     * @description 添加宝箱
     * @param 添加宝箱的位置信息
     */
    addLotteryBox: function (param) {

    },

    /**
     * @description 得到玩家数据
     */
    getPlayHistoryData: function () {
        let data = tywx.tt.Utils.getPlayDataByKey(tywx.tt.constants.PlayDataKeys.ttplaydata);
        tywx.tt.log("玩家记录数据 = " + data);
        if (data != -1) {
            data = JSON.parse(data);
        }
        return data
    },

    /**
     * @description 初始化游戏进度的数据
     */
    initHistoryPlayData: function () {
        if (this.playdata != -1) {
            // 设置score
            // this.board.setScore(this.playdata.score);
            this.repeatNumber = this.playdata.huanyihuan;
            // 设置刷新次数
            this.repNumberLabel.string = this.repeatNumber + "/3";
            // 刷新棋盘数据
            let alle = [];
            for (let tr = 0; tr < this.playdata.bord.length; tr++) {
                let tdata = this.playdata.bord[tr];
                for (let tc = 0; tc < tdata.length; tc++) {
                    let cdata = [];
                    cdata[0] = tr;
                    cdata[1] = tc;
                    cdata[2] = tdata[tc];
                    alle.push(cdata);
                }
            }
            this.board.fillBord(alle);
            // 刷新拖动数据
            let previewdata = this.playdata.previewsdata;
            let previewIndex = this.playdata.previewIndex;
            tywx.tt.Board.previewConfigs = previewdata;
            tywx.tt.Board.previewIndex = previewIndex;
            console.log("borddata = " + JSON.stringify(previewIndex));
            for (let ti = 0; ti < previewdata.length; ti++) {
                let config = previewdata[ti];
                let preview_sc = this.previews[ti].getComponent("tt_view_priview_blocks");
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
    showAddScore: function (somedata, score) {
        // console.log("当前清除数据 = " + JSON.stringify(somedata));
        // console.log("当前填充数据 = " + JSON.stringify(this.fillblocks));
        if ((somedata.rows.length > 0 || somedata.cols.length > 0) && this.fillblocks.length > 0) {
            let pos = cc.v2(0, 0)
            let allcell = [];
            if (somedata.rows.length > 0) {
                for (let rowindex = 0; rowindex < somedata.rows.length; rowindex++) {
                    for (let filleindex = 0; filleindex < this.fillblocks.length; filleindex++) {
                        if (somedata.rows[rowindex] == this.fillblocks[filleindex][0]) {
                            allcell.push(this.fillblocks[filleindex]);
                        }
                    }
                }
            }
            if (somedata.cols.length > 0) {
                for (let colindex = 0; colindex < somedata.cols.length; colindex++) {
                    for (let filleindex = 0; filleindex < this.fillblocks.length; filleindex++) {
                        if (somedata.cols[colindex] == this.fillblocks[filleindex][1]) {
                            allcell.push(this.fillblocks[filleindex]);
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
                let randomshowIndex = parseInt(Math.random() * allcell.length);
                // console.log("randomshowIndex = " + randomshowIndex);
                let poscell = allcell[randomshowIndex];
                if (poscell) {
                    pos = this.blockViews[poscell[0]][poscell[1]].position;
                    pos = cc.v2(pos.x + this.blockViews[poscell[0]][poscell[1]].width / 2, pos.y + this.blockViews[poscell[0]][poscell[1]].height / 2)
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
    hideAllBlocks: function () {
        let [w, h] = [tywx.tt.constants.BoardWidth, tywx.tt.constants.BoardWidth];
        for (let r = 0; r < h; ++r) {
            for (let c = 0; c < w; ++c) {
                let tmp_view = this.blockViews[r][c];
                tmp_view.active = false;
            }
        }
    },
    /**
     * @description 动画显示底板所有的块
     */
    blocksAni: function () {
        this.isTouchLocked = true;
        this.hideAllBlocks();
        if (!this.allcellsanis) {
            let allcells = [];
            let dir = 0;
            let outnumber = 8;
            for (let row = 0; row < 4; row++) {
                if (dir == 0) {
                    for (let right = row; right < outnumber; right++) {
                        let data = {};
                        data.row = row;
                        data.column = right;
                        allcells.push(data);
                    }
                    dir = 1;
                }
                if (dir == 1) {
                    for (let up = row + 1; up < outnumber; up++) {
                        let data = {};
                        data.row = up;
                        data.column = outnumber - 1;
                        allcells.push(data);
                    }
                    dir = 2;
                }
                if (dir == 2) {
                    for (let left = outnumber - 2; left >= 0; left--) {
                        let data = {};
                        data.row = outnumber - 1;
                        data.column = left;
                        allcells.push(data);
                    }
                    dir = 3;
                }
                if (dir == 3) {
                    for (let down = outnumber - 2; down > 0; down--) {
                        let data = {};
                        data.row = down;
                        data.column = row;
                        allcells.push(data);
                    }
                    dir = 0;
                }
                outnumber--;
            }
            this.allcellsanis = allcells;
        }

        let tindex = 0;
        var self = this;
        let showcall = cc.callFunc(function () {
            let data = self.allcellsanis[tindex];
            let block = self.blockViews[data.row][data.column];
            block.active = true;
            tindex++;
            if (tindex == self.allcellsanis.length) {
                self.isTouchLocked = false;
            }
        });
        let totaltime = 1.2;
        let delay = cc.delayTime(totaltime / this.allcellsanis.length);
        let seq = cc.sequence(showcall, delay);
        let trepeate = cc.repeat(seq, this.allcellsanis.length)
        this.node.stopAllActions();
        this.node.runAction(trepeate);
        //  console.log(allcells.length + " zongchangdu  = " + JSON.stringify(allcells));
    },
});