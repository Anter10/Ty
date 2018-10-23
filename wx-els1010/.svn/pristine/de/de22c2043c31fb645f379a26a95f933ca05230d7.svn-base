let TAG = '[game/lottery/lottery_manager.js]]';
let lotery_view_path = "prefabs/lottery_view";
let lottery_button_path = "prefabs/lottery_button";

const lottery_manager = cc.Class({
    statics: {
        lotterynode: null,
        data: null,

        /**
         * @description 得到当前类型的抽奖数据
         * @param {String} lot_type  抽奖数据
         */
        getLotteryDataByType: function (lot_type) {
             if (lottery_manager.data[lot_type]){
                 return lottery_manager.data[lot_type];
             }else{
                 tywx.tt.error(TAG, "没有你给" + lot_type+"类型的红包数据");
             }
             return null;
        },

        /**
         * @description 删除抽奖界面
         */
        removeLotteryView:function(){
             lottery_manager.lotterynode.removeFromParent(false);
             lottery_manager.lotterynode = null;
        },

        /**
         * @description 设置游戏的抽奖数据
         * @param {Object} data 抽奖的所有数据
         */
        setData: function (data) {
            lottery_manager.data = data.default.turning_disc;
            tywx.tt.log("当前的抽奖数据 = "+JSON.stringify(lottery_manager.data));
        },
 
        /**
         * @description 添加转盘按钮
         * @param {String} tlot_type 
         * @param {cc.Node} tparent 
         * @param {cc.v2} tpos 
         */
        addZPIcon:function(tlot_type,tparent,tpos){
            const pos = tpos;
            const parent = tparent;
            const lot_type = tlot_type;
            cc.loader.loadRes(lottery_button_path, (err, prefab) => {
                if (!err) {
                    let adsnode = cc.instantiate(prefab);
                    let ads_script = adsnode.getComponent('lottery_button');
                    ads_script.setType(lot_type);
                    adsnode.position = pos;
                    parent.addChild(adsnode);
                }
            });
        },

        /**
         * @description 监听config的CDN数据
         */
        listenCDNConfigData: function () {
            tywx.NotificationCenter.listen(tywx.tt.events.TT_GET_CONFIG_SUCCESS, lottery_manager.setData, lottery_manager);
        },

        /**
         * @description 展示抽奖界面
         * @param {String} lot_type 抽奖类型
         */
        showLottery: function (lot_type) {
            if (lottery_manager.data) {
                let tlot_type = lot_type;
                cc.loader.loadRes(lotery_view_path, (err, prefab) => {
                    if (!err) {
                        let lotterynode = cc.instantiate(prefab);
                        let ads_script = lotterynode.getComponent('lottery_view');
                        ads_script.setData(lottery_manager.getLotteryDataByType(tlot_type));
                        lottery_manager.lotterynode = lotterynode;
                        cc.director.getScene().addChild(lotterynode);
                    }
                });
            }else{
                tywx.tt.warn("没有抽奖数据");
            }
        }
    },
});



module.exports = lottery_manager;