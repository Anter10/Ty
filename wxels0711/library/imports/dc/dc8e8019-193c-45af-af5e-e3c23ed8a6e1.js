"use strict";
cc._RF.push(module, 'dc8e8AZGTxFr69e48I+2Kbh', 'els_view_daily_login_item');
// script/ui/els_view_daily_login_item.js

'use strict';

var ElsUtils = require('../core/ElsUtils.js');
var ElsViewDailyLogtinItem = cc.Class({
    extends: cc.Component,

    properties: {
        prefabPropIcon: cc.Prefab,
        labelTitle: cc.Label,
        nodeContent: cc.Node,
        particleSys: cc.ParticleSystem,
        nodeMask: cc.Node,
        nodeGettedIcon: cc.Node

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.propDatas = null;
    },
    start: function start() {},


    // update (dt) {},

    init: function init(data, is_show_mask) {
        this.labelTitle.string = data.day;
        var tmp_prop_datas = data.props;
        this.propDatas = data.props;
        if (tmp_prop_datas.length > 1) {
            var tmp_data = { id: 4, count: 1 };
            var tmp_prop = cc.instantiate(this.prefabPropIcon);
            tmp_prop.parent = this.nodeContent;
            tmp_prop.getComponent('els_view_daily_login_prop_icon').init(tmp_data);
        } else if (tmp_prop_datas.length === 1) {
            var element = tmp_prop_datas[0];
            var _tmp_prop = cc.instantiate(this.prefabPropIcon);
            _tmp_prop.parent = this.nodeContent;
            var tmp_id = ElsUtils.formatPropServerId2LocalId(element.id);
            tmp_id = tmp_id === -1 ? 4 : tmp_id;
            var fromat_data = { id: tmp_id, count: element.count };
            _tmp_prop.getComponent('els_view_daily_login_prop_icon').init(fromat_data);
        } else {
            console.log('els_view_daily_login_item/tmp_prop_datas', 'error');
        }
        this.nodeMask.active = is_show_mask;
        this.nodeGettedIcon.active = is_show_mask;
    },
    showWaitingGet: function showWaitingGet() {
        this.particleSys.node.active = true;
        this.particleSys.resetSystem();
    },
    showGetted: function showGetted() {
        this.particleSys.node.active = true;
        this.particleSys.stopSystem();
        this.nodeMask.active = true;
        this.nodeGettedIcon.active = true;
    }
});
module.exports = ElsViewDailyLogtinItem;

cc._RF.pop();