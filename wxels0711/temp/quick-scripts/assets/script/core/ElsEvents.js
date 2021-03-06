(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/core/ElsEvents.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0a84bJBEyVK/a6/J2XshjdD', 'ElsEvents', __filename);
// script/core/ElsEvents.js

'use strict';

var ELS_EVENTS = {
    ELS_EVENT_MAGIC_BOTTLE_ADD: 'els_event_magic_bottle_add',
    ELS_EVENT_MAGIC_BOTTLE_FULL: 'els_event_magic_bottle_full',
    ELS_EVENT_MAGIC_RESET_BOTTLE: 'els_event_reset_bottle',
    ELS_EVENT_MAGIC_GIFT_PROP: 'els_event_magic_gift_prop',
    ELS_EVENT_ADD_PROP: 'els_event_add_prop',
    ELS_EVENT_HIDE_GIFT_PROP: 'els_event_hide_gift_prop',
    ELS_EVENT_ADD_MAGIC: 'els_event_add_magic',
    ELS_EVENT_SET_MAGIC_BUSY: 'els_event_set_magic_busy',
    ELS_EVENT_SHOW_MAGIC_ADD_EFFECT: 'els_event_show_magic_add_effect',
    ELS_EVENT_GIFT_PROP: 'ELS_EVENT_GIFT_PROP',

    ELS_EVENT_UPDATE_BAG: 'els_event_update_bag', // 背包数据变化
    ELS_EVENT_CUNSOME_ITEM_SUCCESS: 'els_event_consume_item_success', // 道具消耗成功 数量做前置判断
    ELS_EVENT_ADD_ITEM_SUCCESS: 'els_event_add_item_success', // 道具添加成功 显示开宝箱动画
    ELS_EVENT_UPDATE_ITEMS: 'els_event_update_items', // 皮肤选中 刷新pageview
    ELS_EVENT_DAILY_LOGIN_GIFT_SUCCESS: 'els_event_daily_login_gift_success', // 每日登陆领取成功
    ELS_EVENT_SELECT_GIFT: 'els_event_select_gift', // 选中道具 发送悄悄话时用
    ELS_EVENT_REFRESH_LOCAL_SKIN: 'els_event_refresh_local_skin', // 更新本地皮肤

    ELS_EVENT_SHOW_GIFT_PROP_ANIMATION: 'els_event_show_gift_prop_animation', // 显示赠送道具动画
    ELS_EVENT_CLEARN_GIFT_PROP_ANIMATION: 'els_event_clearn_gift_prop_animation', // 清除所有赠送道具动画
    ELS_EVENT_CLEARN_GIFT: 'els_event_clearn_gift', // 主动清除道具动画
    ELS_EVENT_CLEARN_MALL: 'els_event_clearn_mall', // 移除商城
    ELS_EVENT_WHISPER_START: 'els_event_whisper_start', // 悄悄话添加道具成功

    ELS_EVENT_REFRESH_ZHUBAO_COUNT: 'els_event_refresh_zhubao_count', // 珠宝显示刷新
    ELS_EVENT_SHOW_CLEARN_ROW_EFFECT: 'els_event_show_clearn_row_effect', // 展示消行动画

    ELS_EVENT_SHOW_ICE_EFFECT: 'els_event_show_ice_effect', // 展示冰冻效果

    ELS_EVENT_ON_SHOW_ENDLESS_LEVEL_UP: 'els_event_on_show_endless_level_up', // 无尽模式==>恭喜升级
    ELS_EVENT_REFRESH_ZHUBAO_ANIMATION_POS: 'els_event_refresh_zhubao_animation_pos', //! 刷新珠宝动画坐标
    ELS_EVENT_DELETE_ZHUBAO_ANIMATION: 'els_event_delete_zhubao_animation', //! 删除珠宝动画
    ELS_EVENT_RESET_ZHUBAO_ANIMATION_POOL: 'els_event_reset_zhubao_animation_pool', //! 重置珠宝动画缓存池
    ELS_EVENT_ADD_ZHUBAO_ANIMATION: 'els_event_add_zhubao_animation', //! 添加珠宝动画
    ELS_EVENT_ENDLESS_SHOW_LEVEL_END: 'els_event_endless_show_level_end', //! 无尽模式，关卡展示结束
    ELS_EVENT_ENDLESS_ON_ZHUBAO_CHANGE: 'els_event_endless_on_zhubao_change' //! 整合删除和刷新
};

module.exports = ELS_EVENTS;

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
        //# sourceMappingURL=ElsEvents.js.map
        