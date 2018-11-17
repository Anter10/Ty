"use strict";
cc._RF.push(module, '7aa56LhTUNNFJ4jn+Bg6kN8', 'lottery_manager');
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
         * @description 设置抽奖结束后的回调方法
         * @param {Function} call 设置抽奖结束后的回调方法
         */
        setFinishCall: function setFinishCall(call) {
            lottery_manager.lotterynode.getComponent('lottery_view').setFinishCall(call);
        },

        /**
         * @description 删除抽奖界面
         */
        removeLotteryView: function removeLotteryView() {
            var call = function call() {
                lottery_manager.lotterynode.removeFromParent(false);
                lottery_manager.lotterynode = null;
            };
            var ani = lottery_manager.lotterynode.getComponent(cc.Animation);
            ani.on("finished", call, this);
            ani.play("hide_ui");
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
        showLottery: function showLottery(lot_type, loterycall) {
            if (!lottery_manager.lotterynode && lottery_manager.data && tywx.tt.configManager.getInstance().auditing == false) {
                var tlot_type = lot_type;
                cc.loader.loadRes(lotery_view_path, function (err, prefab) {
                    if (!err) {
                        var lotterynode = cc.instantiate(prefab);
                        var ads_script = lotterynode.getComponent('lottery_view');
                        var ani = lotterynode.getComponent(cc.Animation);
                        ani.play("show_hide");
                        ads_script.setData(lottery_manager.getLotteryDataByType(tlot_type));
                        lottery_manager.lotterynode = lotterynode;
                        lottery_manager.setFinishCall(loterycall);
                        tywx.tt.Utils.commonScaleIn(lotterynode.getChildByName("centnode"));
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