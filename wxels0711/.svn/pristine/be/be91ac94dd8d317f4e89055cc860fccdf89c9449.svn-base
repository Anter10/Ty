let ElsUtils = require('../core/ElsUtils.js');
let ElsViewDailyLogtinItem = cc.Class({
    extends: cc.Component,

    properties: {
        prefabPropIcon: cc.Prefab,
        labelTitle: cc.Label,
        nodeContent: cc.Node,
        particleSys: cc.ParticleSystem,
        nodeMask: cc.Node,
        nodeGettedIcon: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.propDatas = null;
    },

    start () {

    },

    // update (dt) {},

    init(data, is_show_mask){
        this.labelTitle.string = data.day;
        let tmp_prop_datas = data.props;
        this.propDatas = data.props;
        if(tmp_prop_datas.length > 1){
            let tmp_data = {id: 4, count: 1};
            let tmp_prop = cc.instantiate(this.prefabPropIcon);
            tmp_prop.parent = this.nodeContent;
            tmp_prop.getComponent('els_view_daily_login_prop_icon').init(tmp_data);
        }
        else if(tmp_prop_datas.length === 1){
            let element = tmp_prop_datas[0];
            let tmp_prop = cc.instantiate(this.prefabPropIcon);
            tmp_prop.parent = this.nodeContent;
            let tmp_id = ElsUtils.formatPropServerId2LocalId(element.id);
            tmp_id = tmp_id === -1 ? 4 : tmp_id;
            let fromat_data = {id:tmp_id,count:element.count};
            tmp_prop.getComponent('els_view_daily_login_prop_icon').init(fromat_data);
        }
        else{
            console.log('els_view_daily_login_item/tmp_prop_datas','error');
        }
        this.nodeMask.active = is_show_mask;
        this.nodeGettedIcon.active = is_show_mask;
    },
    showWaitingGet(){
        this.particleSys.node.active = true;
        this.particleSys.resetSystem();
    },
    showGetted(){
        this.particleSys.node.active = true;
        this.particleSys.stopSystem();
        this.nodeMask.active = true;
        this.nodeGettedIcon.active = true;
    }
});
module.exports = ElsViewDailyLogtinItem;