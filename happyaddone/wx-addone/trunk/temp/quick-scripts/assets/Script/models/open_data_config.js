(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/open_data_config.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '43706QodcNLOJjT3rj7OYyv', 'open_data_config', __filename);
// Script/models/open_data_config.js

'use strict';

/**
 * @file: open_data_config.js
 * @description: 主域，子域通信事件，主域，子域公用
 * @author: lu ning
 * @email: luning@tuyoogame.com
 * @date: 2018-08-24
*/
var events = {
    LOAD_DATA: 'load_data'
};

var CloudDataKey = {};

module.exports = {
    events: events,
    CloudDataKey: CloudDataKey
};

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
        //# sourceMappingURL=open_data_config.js.map
        