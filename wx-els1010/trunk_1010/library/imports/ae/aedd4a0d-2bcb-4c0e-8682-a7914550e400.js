"use strict";
cc._RF.push(module, 'aedd4oNK8tMDoaCp5FFUOQA', 'help_view');
// scripts/game/help/help_view.js

"use strict";

var help_view_path = "prefabs/help_view";

var helpview = cc.Class({
    extends: cc.Component,

    properties: {},

    /**
     * @description 关闭当前的界面
     */
    closeCall: function closeCall() {
        helpview.curnode.removeFromParent(true);
        helpview.curnode = null;
    },

    onLoad: function onLoad() {},
    start: function start() {},


    statics: {
        curnode: null,
        /**
         * @description 显示当前的帮助界面
         */
        show: function show() {
            cc.loader.loadRes(help_view_path, function (err, prefab) {
                if (!err) {
                    var helpnode = cc.instantiate(prefab);
                    var ads_script = helpnode.getComponent('help_view');
                    helpview.curnode = helpnode;
                    cc.director.getScene().addChild(helpnode);
                }
            });
        }
    }

});

module.exports = helpview;

cc._RF.pop();