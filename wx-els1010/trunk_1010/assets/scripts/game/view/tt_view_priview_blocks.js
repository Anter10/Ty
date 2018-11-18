let TAG = '[tt_view_priview_blocks]';
let SCALE_TOUCH = 1.0;
let SCALE_NORMAL = 0.34;
cc.Class({
    extends: cc.Component,

    properties: {
        prefabBlock: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.hadPut = false; // * 是否已经放置到棋盘
        this.blockViews = [];
        this.sametype = new Map();
        this.pretypenumber = 0;
        this.precount = 0;
        this.sameindex = 0;
        this.samekey = [];
    },

    start() {

    },

    // update (dt) {},
    init(config) {
        this.config = config;
        this.blockViews = [];
        tywx.tt.log(TAG, JSON.stringify(config));
        let [x, y, w, h] = [0, 0, 380, 380];
        let b_s = tywx.tt.constants.BlockSize;
        x = -w / 2;
        y = -h / 2;
        this.root = this.node.getChildByName('root');
        let max = config.length - 1;
        for (let i = config.length - 1; i >= 0; --i) {
            y = b_s.height * (max - i) + (-h / 2);
            this.blockViews[i] = [];
            for (let j = 0; j < config[i].length; ++j) {
                x = b_s.width * j + (-w / 2);
                let stat = config[i][j];
                let tmp_block = cc.instantiate(this.prefabBlock);
                tmp_block.parent = this.root;
                tmp_block.position = cc.v2(x, y);
                tmp_block.getComponent('tt_view_block').setStat(stat);
                tmp_block.getComponent('tt_view_block').hideBg();
                this.blockViews[i].push(tmp_block);
            }
            tywx.tt.log(TAG, `y=${y}`);
        }
        this.root.scale = 0.8;
    },
    touch() {
        tywx.tt.log(TAG, 'touch');
        this.node.runAction(
            cc.scaleTo(0.2, SCALE_TOUCH)
        );
    },
    touchCancle() {
        tywx.tt.log(TAG, 'touch cancle');
        this.node.runAction(
            cc.scaleTo(0.2, SCALE_NORMAL)
        );
        // 在这里处理变形
        // this.changeType();
    },
    put() {
        this.root.active = false;
        this.node.runAction(
            cc.scaleTo(0.2, SCALE_NORMAL)
        );
        this.hadPut = true;
    },
    getConfig() {
        if (!this.config) {
            tywx.tt.error(TAG, `getConfig error, config=${this.config}`);
            return null;
        }
        return this.config;
    },
    isCanPut() {
        return this.hadPut;
    },
    resetByConfig(config) {
        tywx.tt.log(TAG, `resetByConfig===>${config}`);
        this.config = config;

        this.root.active = true;
        this.hadPut = false;
        for (let i = config.length - 1; i >= 0; --i) {
            //this.blockViews[i] = [];
            for (let j = 0; j < config[i].length; ++j) {
                let stat = config[i][j];
                let tmp_block = this.blockViews[i][j];
                tmp_block.getComponent('tt_view_block').setStat(stat);
                tmp_block.getComponent('tt_view_block').hideBg();
            }
        }
        //this.setSameTypeConfig();
    },

    setGrey: function () {
        for (let i = 0; i < this.config.length; i ++ ) {
            //this.blockViews[i] = [];
            for (let j = 0 ; j < this.config[i].length; j++) {
                    let tmp_block = this.blockViews[i][j];
                    let script = tmp_block.getComponent('tt_view_block');
                    if (script.getStat() > 0) {
                        script.setStat(13);
                    }
            }
        }
    },

    hideGrey: function () {
         console.log("hide state -= ");
        for (let i = 0; i < this.config.length; i++) {
            for (let j = 0; j < this.config[i].length; j++) {
                 let tmp_block = this.blockViews[i][j];
                 let script = tmp_block.getComponent('tt_view_block');
                 script.setStat(this.config[i][j]);
             }
         }
     },

    getCongifTypeNumber: function () {
        let tconfig = this.getConfig();
        tywx.tt.log(TAG, "tconfig -= " + tconfig);
        var findit = false;
        var findnumber = null;
        var findcount = 0;
        var indexcount = 0;
        var row = 0;
        var column = 0;
        for (let c of tconfig) {
            row++;
            column = 0;
            c.forEach(number => {
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
        return {
            number: findnumber,
            count: findcount,
            index: indexcount
        };
    },


    setSameTypeConfig: function () {
        let info = this.getCongifTypeNumber();
        if (this.pretypenumber == info.number && this.precount == info.count) {
            return;
        }
        this.sametype = new Map();
        this.samekey = [];
        this.pretypenumber = info.number;
        this.precount = info.count;
        tywx.tt.log(TAG, "typenumber = " + JSON.stringify(info));
        let blocks = tywx.tt.constants.Blocks;
        let blockindex = 0;

        for (let block of blocks) {
            var findcount = 0;
            var indexcount = 0;
            var row = 0;
            var column = 0;
            blockindex++;
            for (let ele of block) {
                row++;
                ele.forEach(number => {
                    row++;
                    column++;
                    if (number == this.pretypenumber) {
                        findcount++;
                        indexcount = row * (indexcount + row) + column;
                    }

                });
            }
            if (findcount == info.count) {
                // console.log(blockindex + "indexcount = " + indexcount);
                this.samekey[this.samekey.length] = indexcount;
                this.sametype[indexcount + ""] = block;
            }
            for (let ti = 0; ti < this.samekey.length; ti++) {
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

    },

    changeType: function () {
        if (this.sameindex >= this.samekey.length) {
            this.sameindex = 0;
        }
        let tconfig = this.sametype[this.samekey[this.sameindex + ""]];
        if (tconfig) {
            this.resetByConfig(tconfig);
        }
        tywx.tt.log(TAG, "index = " + this.sameindex);
        tywx.tt.log(TAG, "当前= " + JSON.stringify(tconfig) +
            " 全部" + this.samekey.length + "changeType sametype = " + JSON.stringify(this.sametype));

        this.sameindex = this.sameindex + 1;
        if (this.sameindex > this.samekey.length) {
            this.sameindex = 0;
        }
    }

});