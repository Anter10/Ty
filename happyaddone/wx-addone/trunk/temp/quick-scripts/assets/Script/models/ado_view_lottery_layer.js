(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/ado_view_lottery_layer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '64e882QjnNHsYkGHNj5PLZD', 'ado_view_lottery_layer', __filename);
// Script/models/ado_view_lottery_layer.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        nodeContent: cc.Node,
        labelCash: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        //tywx.els.utils.hideGameClubAndAd();
    },
    onDestroy: function onDestroy() {
        // if(tywx.UIManager.getUI(els.ELS_GAME_LAYER.HOMEPAGE).active){
        //     tywx.els.utils.showGameClubAndAd();    
        // }
    },
    start: function start() {},


    // update (dt) {},

    btnClose: function btnClose() {
        tywx.ado.Utils.showWXBanner();
        this.node.destroy();
    },
    motai: function motai() {},
    init: function init() {
        var self = this;
        cc.loader.loadRes('prefabs/ado_view_lottery', function (err, prefab) {
            if (!err) {
                var node = cc.instantiate(prefab);
                node.parent = self.nodeContent;
                node.getComponent('ado_view_lottery').init();

                // let node2 = cc.instantiate(prefab);
                // node2.parent = self.nodeContent;
                // node2.getComponent('ado_view_lottery').init();
            }
        });
    },
    btnShowRecordList: function btnShowRecordList() {
        cc.loader.loadRes('prefabs/CjJiLuView', function (err, prefab) {
            if (!err) {
                var size = cc.winSize;
                var prefabNode = cc.instantiate(prefab);
                cc.game.addPersistRootNode(prefabNode);
                prefabNode.position = cc.v2(size.width / 2, size.height / 2);
                // prefabNode.getComponent('CjJiLuView').init(btn_sure_cb, content);
            }
        });
    },
    btnGetCash: function btnGetCash() {
        cc.loader.loadRes('prefabs/CjTiXianHelpView', function (err, prefab) {
            if (!err) {
                var size = cc.winSize;
                var prefabNode = cc.instantiate(prefab);
                cc.game.addPersistRootNode(prefabNode);
                prefabNode.position = cc.v2(size.width / 2, size.height / 2);
                // prefabNode.getComponent('CjJiLuView').init(btn_sure_cb, content);
            }
        });
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=ado_view_lottery_layer.js.map
        