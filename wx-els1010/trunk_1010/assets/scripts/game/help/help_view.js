const help_view_path = "prefabs/help_view";

const helpview = cc.Class({
    extends: cc.Component,

    properties: {

    },

    /**
     * @description 关闭当前的界面
     */
    closeCall:function(){
        helpview.curnode.removeFromParent(true);
        helpview.curnode = null;
    },

    onLoad() {

    },

    start() {

    },

    statics: {
        curnode: null,
        /**
         * @description 显示当前的帮助界面
         */
        show: function () {
            cc.loader.loadRes(help_view_path, (err, prefab) => {
                if (!err) {
                    let helpnode = cc.instantiate(prefab);
                    let ads_script = helpnode.getComponent('help_view');
                    helpview.curnode = helpnode;
                    cc.director.getScene().addChild(helpnode);
                }
            });
        }
    }

});


module.exports = helpview;