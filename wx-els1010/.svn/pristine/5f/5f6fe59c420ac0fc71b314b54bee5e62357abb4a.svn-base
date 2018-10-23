let TAG = '[tt_view_block]';
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //tywx.tt.log(TAG,'onLoad');
        this.mask = this.node.getChildByName('mask');
        // this.node.getChildByName('frame').opacity = 144;
        this.mask.active = false;
    },
    onEnable(){
        //tywx.tt.log(TAG,'onEnable');
    },

    start () {
        //tywx.tt.log(TAG,'start');

    },

    // update (dt) {},
    refresh(){

    },
    setStat(stat){
        //tywx.tt.log(TAG,'setStat');        
        this.stat = stat;
        this.frameIdx = -1;
        this.init();

    },
    hideBg(){
        this.node.getChildByName('bg').active = false;
    },
    setBgColor(color){
        this.node.getChildByName('bg').color = color;
        this.node.getChildByName('bg').opacity = 11;
    },
    init(){
        this.display = this.node.getChildByName('display');
        this.frame = this.node.getChildByName('frame');
        this.displaySprite = this.display.getComponent(cc.Sprite);
        this.frameSprite = this.frame.getComponent(cc.Sprite);

        if(this.stat === -1){
            // * 显示选中框
            this.frame.active = true;
        }
        else if(this.stat === -2){
            // * 隐藏选中框
            this.frame.active = false;
        }
        else if(this.stat === 0){
            this.frame.active = false;
            this.display.active = false;
        }
        else{
            this.frame.active = false;
            this.display.active = true;
            this.frameIdx = this.stat;
            let self = this;
            cc.loader.loadRes(`images/tt_blocks/b${this.stat}`,cc.SpriteFrame,(err, sprite_frame)=>{
                if(!err){
                    self.displaySprite.spriteFrame = sprite_frame;
                }
            });
        }
    },
    showMask(){
        this.mask.active = true;
    },
    hideMask(){
        this.mask.active = false;
    }
});
