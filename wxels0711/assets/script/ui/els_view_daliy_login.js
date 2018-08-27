let ElsUtils = require('../core/ElsUtils.js');
let ElsEvents = require('../core/ElsEvents.js');
let PropConfig = cc.Class({
    name: 'PropConfig',
    properties:{
        id: 1014,
        count: 5
    }
});
let GiftConfig = cc.Class({
    name: 'GiftConfig',
    properties:{
        day: '第一天',
        props: [PropConfig]
    }
});

let ElsViewDailyLogin = cc.Class({
    extends: cc.Component,

    properties: {
        prefabItem: cc.Prefab,
        nodeContent: cc.Node,
        giftConfigs : [GiftConfig],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        tywx.NotificationCenter.listen(ElsEvents.ELS_EVENT_DAILY_LOGIN_GIFT_SUCCESS, this.onGiftSuccess, this);
    },

    start () {

    },

    // update (dt) {},

    onDestroy(){
        tywx.NotificationCenter.ignoreScope(this);  
    },

    init(){
        let getting_idx = tywx.UserInfo.loginReward.day;
        let canGet = tywx.UserInfo.loginReward.get;
        let configs = tywx.UserInfo.loginReward.conf;
        this.getting_idx = getting_idx;
        this.giftConfigs = [];
        this.isGettedGift = !canGet;
        this.waitingGetItem = null;
        configs.forEach((e=>{
            let tmp_config = new GiftConfig();
            tmp_config.day = ElsUtils.loginServerId2String(e.nday);
            let tmp_rewards = e.rewards;
            tmp_config.props = [];
            tmp_rewards.forEach(e=>{
                let tmp_prop = new PropConfig();
                tmp_prop.id = e.itemId;
                tmp_prop.count = e.count;
                tmp_config.props.push(tmp_prop);
            });
            this.giftConfigs.push(tmp_config);
        }));

        this.giftConfigs.forEach((element, idx) => {
            console.log('els_view_daliy_login/element',element, idx);
            let tmp_item = cc.instantiate(this.prefabItem);
            tmp_item.parent = this.nodeContent;
            tmp_item.getComponent('els_view_daily_login_item').init(element, idx < getting_idx);
            if(idx === getting_idx){
                if (canGet) {
                    tmp_item.getComponent('els_view_daily_login_item').showWaitingGet();
                    this.waitingGetItem = tmp_item;
                } else {
                    tmp_item.getComponent('els_view_daily_login_item').showGetted();
                }
            }
        });
    },
    /**
     * 模态层回调
     */
    motaiCallback(){},
    /**
     * 领取奖励
     */
    btnGetClickCallback(){
        if(this.isGettedGift) {
            tywx.Util.wechatShowModal("今天的奖励已经领取，请明天再来领取！", false, "确认");
            return;
        }
        
        let tmp_config = this.giftConfigs[this.getting_idx];
        if(tmp_config){
            tywx.MSG.requestDailyLogin();
        }
    },
    /**
     * 关闭界面
     */
    btnCloseClickCallback(){
        this.node.destroy();
    },

    onGiftSuccess(params){
        console.log('els_view_daliy_login/onGiftSuccess',params);
        
        if (params.error) {
            tywx.Util.wechatShowModal("今天的奖励已经领取，请明天再来领取！", false, "确认");
            return;
        }

        tywx.UserInfo.loginReward.get = 0;
        this.isGettedGift = true;
        if(this.waitingGetItem){
            this.waitingGetItem.getComponent('els_view_daily_login_item').showGetted();
        }
        let map = new Map([[1014,'钻石'],[1017,'导弹'],[1018,'锤子'],[1019,'魔法棒']]);
        let items = params.result.items;
        if(items){
            let content = '恭喜获得\r\n'; // \r\n 换行在真机上可以，模拟器中不行
            items.forEach(e=>{
                if(map.has(e.itemId)){
                    content += `${map.get(e.itemId)}x${e.count} `;
                }
            });
            tywx.Util.wechatShowModal(content, false, "确认");
        }

    }
});
module.exports = ElsViewDailyLogin;