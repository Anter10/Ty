"use strict";
cc._RF.push(module, '485511GDnhK1Yf0jEHvbueo', 'tt_model_config_manager');
// scripts/game/model/tt_model_config_manager.js

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TAG = '[tt.model.ConfigManager]';
var _instance = Symbol(TAG);
var _configUrl = 'https://elsfkws.nalrer.cn/teris/config/els1010.json';

var ConfigManager = function () {
    function ConfigManager() {
        _classCallCheck(this, ConfigManager);

        for (var att in tywx.tt.Configs.default) {
            this[att] = tywx.tt.Configs.default[att];
        }
    }

    _createClass(ConfigManager, [{
        key: 'requestConfig',
        value: function requestConfig() {
            tywx.tt.log(TAG, 'requestConfig');
            // * 成功通知
            tywx.tt.ads.listenCDNData();
            tywx.tt.lottery.listenCDNConfigData();
            tywx.tt.ads.listenADManagerData();
            var self = this;
            var xhr = cc.loader.getXMLHttpRequest();
            //TODO: 添加审核判断
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
                    var response = JSON.parse(xhr.responseText);
                    for (var att in response.default) {
                        self[att] = response.default[att];
                    }
                    tywx.tt.constants.WXAdConfig.bannerId = self.WXAd.banner;
                    tywx.tt.constants.WXAdConfig.vedioId = self.WXAd.video;
                    if (tywx.tt.constants.WXAdConfig.vedioId === '') {
                        tywx.tt.isCanWatchVideo = false;
                    } else {
                        tywx.tt.isCanWatchVideo = true;
                    }

                    tywx.tt.log(TAG, 'request config success' + JSON.stringify(response));
                    tywx.NotificationCenter.trigger(tywx.tt.events.TT_GET_CONFIG_SUCCESS, response);
                } else {
                    tywx.NotificationCenter.trigger(tywx.tt.events.TT_GET_CONFIG_FAIL, null);
                }
            };
            xhr.open("GET", _configUrl, true);
            xhr.send();
        }
    }], [{
        key: 'getInstance',
        value: function getInstance() {
            if (!ConfigManager[_instance]) ConfigManager[_instance] = new ConfigManager();
            return ConfigManager[_instance];
        }
    }]);

    return ConfigManager;
}();

ConfigManager[_instance] = null;
module.exports = ConfigManager;

cc._RF.pop();