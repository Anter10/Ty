
cc.Class({
    extends: cc.Component,

    properties: {
        nodeContent: cc.Node,
        labelCash: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //tywx.els.utils.hideGameClubAndAd();
    },
    onDestroy(){
        // if(tywx.UIManager.getUI(els.ELS_GAME_LAYER.HOMEPAGE).active){
        //     tywx.els.utils.showGameClubAndAd();    
        // }
    },

    start () {

    },

    // update (dt) {},

    btnClose(){
        tywx.ado.Utils.showWXBanner();
        this.node.destroy();
    },
    motai(){},

    init(){
        let self = this;
        cc.loader.loadRes('prefabs/ado_view_lottery', function(err, prefab){
            if(!err){
                let node = cc.instantiate(prefab);
                node.parent = self.nodeContent;
                node.getComponent('ado_view_lottery').init();

                // let node2 = cc.instantiate(prefab);
                // node2.parent = self.nodeContent;
                // node2.getComponent('ado_view_lottery').init();
            }
        });
    },
    btnShowRecordList(){
        cc.loader.loadRes('prefabs/CjJiLuView', function (err, prefab) {
            if(!err){
                let size = cc.winSize;
                var prefabNode = cc.instantiate(prefab);
                cc.game.addPersistRootNode(prefabNode);
                prefabNode.position = cc.v2(size.width / 2, size.height / 2);
                // prefabNode.getComponent('CjJiLuView').init(btn_sure_cb, content);
            }
        });
    },
    btnGetCash(){
         cc.loader.loadRes('prefabs/CjTiXianHelpView', function (err, prefab) {
             if (!err) {
                 let size = cc.winSize;
                 var prefabNode = cc.instantiate(prefab);
                 cc.game.addPersistRootNode(prefabNode);
                 prefabNode.position = cc.v2(size.width / 2, size.height / 2);
                 // prefabNode.getComponent('CjJiLuView').init(btn_sure_cb, content);
             }
         });
    }
});
