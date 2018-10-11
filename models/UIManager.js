/**
 * @file: UIManager.js
 * @description: UI管理器,传入prefab名字，自动加载并显示，第一次会比较慢，需要加载资源
 * @author: lu ning
 * @email: luning@tuyoogame.com
 * @date: 2018-08-25
*/
let _instance = null;
let LOADING_PREFAB = tywx.ado.ResConfig.PrefabConfig.PREFAB_LOADING;
let UIManager = class{
    static getInstance(){
        if(!_instance) _instance = new UIManager();
        return _instance;
    }

    constructor(){
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
    showUIByConfig(config, args = null){
        this.showUIByName(config[0],config[1],config[2],args);
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
    showUIByName(prefab_name, is_init = false, script_name = '', args = null){
        let root_node = cc.director.getScene().getChildByName('Canvas');
        let self = this;
        if(!this.prefabCache.has(prefab_name)){
            cc.loader.loadRes(`prefabs/${prefab_name}`,(err,prefab)=>{
                if(!err){
                    self.prefabCache.set(prefab_name, prefab);
                    self.instantiatePrefab2Parent(prefab, root_node, is_init, script_name, args);
                }
                else{
                    cc.error(`load prefab failed ${prefab_name} ${err}`);
                }
            });
        }
        else{
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
    instantiatePrefab2Parent(prefab, parent, is_init = false, script_name = '', args = null){
        // this.showLoading();
        let tmp_node = cc.instantiate(prefab);
        tmp_node.parent = parent;
        console.log("root_node parent  "+parent);
        if(is_init){
            let tmp_script = tmp_node.getComponent(script_name);
            if(tmp_script && tmp_script.init){
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
    resetLoading(){
        if(this.loadingInstance){
            this.loadingInstance.destroy();
            this.loadingInstance = null;
        }
        let root_node = cc.director.getScene().getChildByName('Canvas');
        let self = this;
        if(!this.prefabCache.has(LOADING_PREFAB)){
            cc.loader.loadRes(`prefabs/${LOADING_PREFAB}`,(err,prefab)=>{
                if(!err){
                    self.prefabCache.set(LOADING_PREFAB, prefab);
                    self.loadingInstance = cc.instantiate(prefab);
                    self.loadingInstance.parent = root_node;
                }
                else{
                    cc.error(`load prefab failed ${LOADING_PREFAB} ${err}`);
                }
            });
        }
        else{
            this.loadingInstance = cc.instantiate(this.prefabCache.get(LOADING_PREFAB));
            this.loadingInstance.parent = root_node;
        }
    }
    /**
     * @description 显示loading控件
     * @author lu ning
     * @date 2018-08-25
     */
    showLoading(){
        if(this.loadingInstance){
            this.loadingInstance.active = true;
        }
        else{
            this.resetLoading();
        }
    }
    /**
     * @description 隐藏loading控件
     * @author lu ning
     * @date 2018-08-25
     */
    hideLoading(){
        if(this.loadingInstance){
            this.loadingInstance.active = false;
        }
        else{
            this.resetLoading();
        }
    }
};

module.exports = UIManager.getInstance();