"use strict";
cc._RF.push(module, 'e424dTbX+5Pwpfz0h8wxWSo', 'UIManager');
// Script/models/UIManager.js

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @file: UIManager.js
 * @description: UI管理器,传入prefab名字，自动加载并显示，第一次会比较慢，需要加载资源
 * @author: lu ning
 * @email: luning@tuyoogame.com
 * @date: 2018-08-25
*/
var _instance = null;
var LOADING_PREFAB = tywx.ado.ResConfig.PrefabConfig.PREFAB_LOADING;
var UIManager = function () {
    _createClass(UIManager, null, [{
        key: 'getInstance',
        value: function getInstance() {
            if (!_instance) _instance = new UIManager();
            return _instance;
        }
    }]);

    function UIManager() {
        _classCallCheck(this, UIManager);

        this.prefabCache = new Map();
        this.loadingInstance = null;
    }
    /**
     * @description 根据配置文件显示UI
     * @author lu ning
     * @date 2018-08-25
     * @param {Array<any>} config ['loading',false,'']
     * @param {any} [args=null]
     */


    _createClass(UIManager, [{
        key: 'showUIByConfig',
        value: function showUIByConfig(config) {
            var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            this.showUIByName(config[0], config[1], config[2], args);
        }
        /**
         * @description 显示UI控件
         * @author lu ning
         * @date 2018-08-25
         * @param {String} prefab_name
         * @param {boolean} [is_init=false]
         * @param {string} [script_name='']
         * @param {any} [args=null]
         */

    }, {
        key: 'showUIByName',
        value: function showUIByName(prefab_name) {
            var is_init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var script_name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
            var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            var root_node = cc.director.getScene().getChildByName('Canvas');
            var self = this;
            if (!this.prefabCache.has(prefab_name)) {
                cc.loader.loadRes('prefabs/' + prefab_name, function (err, prefab) {
                    if (!err) {
                        self.prefabCache.set(prefab_name, prefab);
                        self.instantiatePrefab2Parent(prefab, root_node, is_init, script_name, args);
                    } else {
                        cc.error('load prefab failed ' + prefab_name + ' ' + err);
                    }
                });
            } else {
                this.instantiatePrefab2Parent(this.prefabCache.get(prefab_name), root_node, is_init, script_name, args);
            }
        }
        /**
        * @description 实例化控件，添加到当前场景Canvas的最上层
        * @author lu ning
        * @date 2018-08-25
        * @param {cc.Prefab} prefab
        * @param {cc.Node} parent
        * @param {boolean} [is_init=false]
        * @param {string} [script_name='']
        * @param {any} [args=null]
        * @returns {cc.Node}
        */

    }, {
        key: 'instantiatePrefab2Parent',
        value: function instantiatePrefab2Parent(prefab, parent) {
            var is_init = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var script_name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
            var args = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

            // this.showLoading();
            var tmp_node = cc.instantiate(prefab);
            tmp_node.parent = parent;
            console.log("root_node parent  " + parent);
            if (is_init) {
                var tmp_script = tmp_node.getComponent(script_name);
                if (tmp_script && tmp_script.init) {
                    tmp_script.init(args);
                }
            }
            // this.hideLoading();
            return tmp_node;
        }
        /**
         * @description 重置loading, 切换场景后需要重置
         * @author lu ning
         * @date 2018-08-25
         */

    }, {
        key: 'resetLoading',
        value: function resetLoading() {
            if (this.loadingInstance) {
                this.loadingInstance.destroy();
                this.loadingInstance = null;
            }
            var canvas = cc.director.getScene().getChildByName('Canvas');
            var root_node = canvas.node;
            var self = this;
            if (!this.prefabCache.has(LOADING_PREFAB)) {
                cc.loader.loadRes('prefabs/' + LOADING_PREFAB, function (err, prefab) {
                    if (!err) {
                        self.prefabCache.set(LOADING_PREFAB, prefab);
                        self.loadingInstance = cc.instantiate(prefab);
                        self.loadingInstance.parent = root_node;
                    } else {
                        cc.error('load prefab failed ' + LOADING_PREFAB + ' ' + err);
                    }
                });
            } else {
                this.loadingInstance = cc.instantiate(this.prefabCache.get(LOADING_PREFAB));
                this.loadingInstance.parent = root_node;
            }
        }
        /**
         * @description 显示loading控件
         * @author lu ning
         * @date 2018-08-25
         */

    }, {
        key: 'showLoading',
        value: function showLoading() {
            if (this.loadingInstance) {
                this.loadingInstance.active = true;
            } else {
                this.resetLoading();
            }
        }
        /**
         * @description 隐藏loading控件
         * @author lu ning
         * @date 2018-08-25
         */

    }, {
        key: 'hideLoading',
        value: function hideLoading() {
            if (this.loadingInstance) {
                this.loadingInstance.active = false;
            } else {
                this.resetLoading();
            }
        }
    }]);

    return UIManager;
}();

module.exports = UIManager.getInstance();

cc._RF.pop();