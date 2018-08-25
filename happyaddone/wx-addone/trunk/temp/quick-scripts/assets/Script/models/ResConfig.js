(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/models/ResConfig.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'eefa9pPtFRLroy+L0QHJnjD', 'ResConfig', __filename);
// Script/models/ResConfig.js

'use strict';

var PrefabConfig = { // ! 预制件配置文件[预制件名字,是否调用init,绑定的脚本名字]
    PREFAB_LOADING: ['loading', false, ''],
    PREFAB_UiHelpView: ['UIHelpView', false, 'UIHelpView']
};

module.exports = {
    PrefabConfig: PrefabConfig
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
        //# sourceMappingURL=ResConfig.js.map
        