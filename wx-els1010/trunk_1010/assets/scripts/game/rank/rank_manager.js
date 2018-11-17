 let rankview_path = "prefabs/rank_view";

 const rank_manager = cc.Class({
     extends: cc.Component,

     properties: {

     },

     statics: {
         friendsRankView: null,
         showRank: function () {
             if (!rank_manager.friendsRankView) {
                 cc.loader.loadRes(rankview_path, (err, prefab) => {
                     if (!err) {
                         let ranknode = cc.instantiate(prefab);
                         let ani = ranknode.getComponent(cc.Animation);
                         ani.play("show_hide");
                         let ads_script = ranknode.getComponent('rank_view');
                         rank_manager.friendsRankView = ranknode;
                         tywx.tt.Utils.commonScaleIn(ranknode.getChildByName("rank_view"));
                         cc.director.getScene().addChild(ranknode);
                     }
                 });
             }
         }
     },

     // LIFE-CYCLE CALLBACKS:

     onLoad() {},

     start() {

     },

     // update (dt) {},
 });


 module.exports = rank_manager;