(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/lottery/lottery_manager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7aa56LhTUNNFJ4jn+Bg6kN8', 'lottery_manager', __filename);
// scripts/game/lottery/lottery_manager.js

"use strict";

var TAG = '[game/lottery/lottery_manager.js]]';
var lotery_view_path = "prefabs/lottery_view";
var lottery_button_path = "prefabs/lottery_button";

var lottery_manager = cc.Class({
    statics: {
        lotterynode: null,
        data: null,

        /**
         * @description 得到当前类型的抽奖数据
         * @param {String} lot_type  抽奖数据
         */
        getLotteryDataByType: function getLotteryDataByType(lot_type) {
            if (lottery_manager.data[lot_type]) {
                return lottery_manager.data[lot_type];
            } else {
                tywx.tt.error(TAG, "没有你给" + lot_type + "类型的红包数据");
            }
            return null;
        },

        /**
         * @description 删除抽奖界面
         */
        removeLotteryView: function removeLotteryView() {
            lottery_manager.lotterynode.removeFromParent(false);
            lottery_manager.lotterynode = null;
        },

        /**
         * @description 设置游戏的抽奖数据
         * @param {Object} data 抽奖的所有数据
         */
        setData: function setData(data) {
            lottery_manager.data = data.default.turning_disc;
            tywx.tt.log("当前的抽奖数据 = " + JSON.stringify(lottery_manager.data));
        },

        /**
         * @description 添加转盘按钮
         * @param {String} tlot_type 
         * @param {cc.Node} tparent 
         * @param {cc.v2} tpos 
         */
        addZPIcon: function addZPIcon(tlot_type, tparent, tpos) {
            var pos = tpos;
            var parent = tparent;
            var lot_type = tlot_type;
            cc.loader.loadRes(lottery_button_path, function (err, prefab) {
                if (!err) {
                    var adsnode = cc.instantiate(prefab);
                    var ads_script = adsnode.getComponent('lottery_button');
                    ads_script.setType(lot_type);
                    adsnode.position = pos;
                    parent.addChild(adsnode);
                }
            });
        },

        /**
         * @description 监听config的CDN数据
         */
        listenCDNConfigData: function listenCDNConfigData() {
            tywx.NotificationCenter.listen(tywx.tt.events.TT_GET_CONFIG_SUCCESS, lottery_manager.setData, lottery_manager);
        },

        /**
         * @description 展示抽奖界面
         * @param {String} lot_type 抽奖类型
         */
        showLottery: function showLottery(lot_type) {
            if (lottery_manager.data) {
                var tlot_type = lot_type;
                cc.loader.loadRes(lotery_view_path, function (err, prefab) {
                    if (!err) {
                        var lotterynode = cc.instantiate(prefab);
                        var ads_script = lotterynode.getComponent('lottery_view');
                        ads_script.setData(lottery_manager.getLotteryDataByType(tlot_type));
                        lottery_manager.lotterynode = lotterynode;
                        cc.director.getScene().addChild(lotterynode);
                    }
                });
            } else {
                tywx.tt.warn("没有抽奖数据");
            }
        }
    }
});

module.exports = lottery_manager;

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
        //# sourceMappingURL=lottery_manager.js.map
        