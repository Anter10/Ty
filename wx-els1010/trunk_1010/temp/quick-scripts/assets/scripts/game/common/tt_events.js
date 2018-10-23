(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/common/tt_events.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '96ef2UKx01M/YOHQaeRMFIU', 'tt_events', __filename);
// scripts/game/common/tt_events.js

'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Events = _defineProperty({
    TT_FILL_BOARD: 'tt_fill_baord', // * 填充棋盘
    TT_GET_CONFIG_SUCCESS: 'tt_get_config_success', // * 获取配置成功
    TT_RESET_PREVIEWS: 'tt_reset_previews',
    TT_CLEAR_ROW: 'tt_clear_row',
    TT_REFRESH_SCORE: 'tt_refresh_score',
    TT_CLEAR_HAMMER: 'tt_clear_hammer',
    TT_REFRESH_PREVIEW_STAT: 'tt_refresh_preview_stat',
    TT_EVENT_RED_PACKET_CHANGE: 'tt_event_red_packet_change',
    TT_EVENT_GET_IP_SUCCESS: "tt_event_get_ip_success"
}, 'TT_EVENT_GET_IP_SUCCESS', 'tt_event_get_ip_success');

module.exports = Events;

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
        //# sourceMappingURL=tt_events.js.map
        