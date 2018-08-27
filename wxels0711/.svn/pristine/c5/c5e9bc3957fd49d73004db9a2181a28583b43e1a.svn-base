
cc.Class({
    extends: cc.Component,

    properties: {
        unlock_content: cc.Node,
        item_prefab : cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.node.active = false;
        this.addNodes();
        let self = this;
        wx.showToast({
            title: '加载中..',
            icon: 'loading',
            duration: 2000,
        });
        // 添加监听
        tywx.NotificationCenter.listen(tywx.EventType.CMD_ELSWX, this._MsgELSWX, this);
        // 获取数据
        tywx.MSG.getRewardItems();
    },

    addNodes(){
        this.items = [];
        for (let i = 0; i < 4; i ++) {// 创建 4 个
            let c = cc.instantiate(this.item_prefab);
            let _x = i % 2 === 0 ? -130 : 130;
            let _y = i >= 2 ? -178 : 190;
            c.position = cc.v2(_x, _y);
            c.getComponent("unlock_item").init(undefined, i);
            c.parent = this.unlock_content;
            this.items.push(c);
        }
    },

    _MsgELSWX(params) {
        if (params.result.action === tywx.EventType.CMD_ACTION_REWARD_ITEMS) {
            let _data = params.result.rewardItems;
            this.show_with_data(_data);
        }
        if (params.result.action === tywx.EventType.CMD_ACTION_ADD_ITEMS) {
            tywx.MSG.getRewardItems();
        }
     },

    show_with_data(_data) {
        // 获取数据
        wx.hideToast();
        // this.node.active = true;
        for (let i = 0; i < 4; i ++) {// 创建 4 个
            this.items[i].getComponent("unlock_item").init(_data[i], i);
        }
    },

    dismiss_unlock_node(){
        tywx.AdManager.destroyBannerAd();
        this.node.active = false;
        this.node.removeFromParent();
        this.node.destroyAllChildren();
        this.node.destroy();
        if (!this.fromHome) {
            this.fromHome = false;
            tywx.UIManager.game.continueGame();
        }
    },

    onDestroy(){
        tywx.NotificationCenter.ignoreScope(this);
    }

    // update (dt) {},
});
