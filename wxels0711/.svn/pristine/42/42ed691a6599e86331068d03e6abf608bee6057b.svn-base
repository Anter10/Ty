
let PropDisplay = cc.Class({
    name: 'PropDisplay',
    properties:{
        spriteFrame: cc.SpriteFrame,
        scale: 1.0,
        rotate: 0,
        serverId: 1001,
        displayName: '道具名称',
    }
});

let ELSViewDailyLoginPropIcon = cc.Class({
    extends: cc.Component,

    properties: {
        spriteDisplay: cc.Sprite,
        nodeDisplay: cc.Node,
        labelName: cc.Label,
        lableCount: cc.Label,
        propDisplays: [PropDisplay],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    /**
     * 初始化每日登陆道具展示
     * @param {Object} params {id:0,count:0}
     */
    init(params){
        let tmp_data = this.propDisplays[params.id];
        this.spriteDisplay.spriteFrame = tmp_data.spriteFrame;
        this.labelName.string = tmp_data.displayName;
        this.lableCount.string = `x${params.count}`;
        this.spriteDisplay.node.scale = tmp_data.scale;
        this.spriteDisplay.node.rotation = tmp_data.rotate;
    }
});
module.exports = ELSViewDailyLoginPropIcon;