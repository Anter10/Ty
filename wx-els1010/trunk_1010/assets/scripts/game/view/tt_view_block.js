let TAG = '[tt_view_block]';
cc.Class({
    extends: cc.Component,

    properties: {
        blink: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //tywx.tt.log(TAG,'onLoad');
        this.mask = this.node.getChildByName('mask');
        // this.node.getChildByName('frame').opacity = 144;
        this.mask.active = false;
    },
    onEnable() {
        //tywx.tt.log(TAG,'onEnable');
    },

    start() {
        //tywx.tt.log(TAG,'start');

    },

    blockBlink: function () {
        this.blink.node.active = true;
        let scale1 = cc.scaleTo(0.5, 1.1);
        let scale2 = cc.scaleTo(0.5, 1);
        let seq = cc.sequence(scale1, scale2);
        let rep = cc.repeatForever(seq);
        this.blink.node.runAction(rep);
    },

    blockHide: function () {
        this.blink.node.active = false;
        this.blink.node.stopAllActions();
    },

    // update (dt) {},
    refresh() {

    },
    setStat(stat) {
        //tywx.tt.log(TAG,'setStat');        
        this.stat = stat;
        this.frameIdx = -1;
        this.init();

    },

    getStat(){
        return this.stat;
    },

    hideBg() {
        this.node.getChildByName('bg').active = false;

    },
    setBgColor(color) {
        // this.node.getChildByName('bg').color = color;
        // this.node.getChildByName('bg').opacity = 35;
        let self = this;
        if (color == 1){
           cc.loader.loadRes(`images/tt_blocks/greyblack`, cc.SpriteFrame, (err, sprite_frame) => {
                 if (!err) {
                    self.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = sprite_frame;
                 } else {
                    tywx.tt.log(TAG, "ddda error");
                 }
            });
        }else{
            cc.loader.loadRes(`images/tt_blocks/hideblack`, cc.SpriteFrame, (err, sprite_frame) => {
                if (!err) {
                    self.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = sprite_frame;
                } else {
                    tywx.tt.log(TAG, "ddda error");
                }
            });
        }
    },
    init() {
        this.display = this.node.getChildByName('display');
        this.frame = this.node.getChildByName('frame');
        this.displaySprite = this.display.getComponent(cc.Sprite);
        this.frameSprite = this.frame.getComponent(cc.Sprite);

        if (this.stat === -1) {
            // * 显示选中框
            this.frame.active = true;
        } else if (this.stat === -2) {
            // * 隐藏选中框
            this.frame.active = false;
        } else if (this.stat === 0) {
            this.frame.active = false;
            this.display.active = false;
        } else {

            this.frame.active = false;
            this.display.active = true;
            this.frameIdx = this.stat;
            let self = this;
            cc.loader.loadRes(`images/tt_blocks/b${this.stat}`, cc.SpriteFrame, (err, sprite_frame) => {
                if (!err) {
                    self.displaySprite.spriteFrame = sprite_frame;
                } else {
                   tywx.tt.log(TAG, "ddda error");
                }
            });
            this.blinkDisplay();
        }
    },
    
    blinkDisplay() {
        this.displaySprite.node.stopAllActions();
        if (this.stat == 12) {
            let scale1 = cc.scaleTo(0.6, 1.1);
            let scale2 = cc.scaleTo(0.6, 1);
            let seq = cc.sequence(scale1, scale2);
            let rep = cc.repeatForever(seq);
            this.displaySprite.node.runAction(rep);
        }else{
            this.displaySprite.node.scale = 1;
        }
    },

    showMask() {
        this.mask.active = true;
    },
    hideMask() {
        this.mask.active = false;
    }
});