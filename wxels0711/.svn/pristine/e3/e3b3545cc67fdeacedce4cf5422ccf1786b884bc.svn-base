/**
 * 简易UI管理
 * @type {{}}
 */
tywx.UIManager = {
    //ui 容器
    _container : {},
    //ui 当前显示堆栈
    uistack : [],

    init : function (game) {
        this.game = game;
    },

    registerUI : function (uikey, uinode, jsname) {
        this._container[uikey] = this._container[uikey] || [];
        this._container[uikey] = {
            node: uinode,
            jsname: jsname
        };
    },

    getUI : function(uikey) {
        let layer = this._container[uikey];
        return layer;
    },

    showUI :function(uikey, params, withaction, closepre){
        if(closepre===true){
            this.popCurrentUI();
        }

        let layer = this._container[uikey];
        if(layer&&layer.node) {
            this._curLayer = layer.node;
            var node = layer.node;
            node.active = true;
            if(layer.jsname){
                var js = node.getComponent(layer.jsname);
                if(js&&js.showMe)
                    js.showMe(params);
            }
            //是否是bool。并且为true
            console.log("-----withaction 类型:----"+typeof(withaction) );
            if( typeof(withaction) === "boolean" &&  withaction !== false)
                this._doAction(node);
            this.pushCurrentUI(node);
        }else{
            console.log("fengbing", "error:  "+uikey+'  not in ui manager');
        }

    },

    _doAction : function (node) {
        if(!node)
            return;

        node.setScale(0);
        node.runAction(cc.sequence(
            cc.scaleTo(0.2, 1.1, 1.1),
            cc.scaleTo(0.1, 1, 1)
        ));
    },

    hideUI : function (uikey) {
        let layer = this._container[uikey];
        if(layer&&layer.node) {
            var node = layer.node;
            node.active = false;
            var js = node.getComponent(layer.jsname);
            if(js&&js.hideMe){
                js.hideMe();
            }
            this.popCurrentUI();
        }
    },

    getCurrentUI : function () {
        if(this.uistack.length> 0){
            return this.uistack[this.uistack.length-1];
        }
        return undefined;
    },

    pushCurrentUI : function (layer) {
        if(layer){
            this.uistack.push(layer);
        }
    },

    popCurrentUI : function () {
        if(this.uistack.length > 0){
            this.uistack.pop();
        }
    },

    hideAllUI : function () {
      while (this.uistack.length>0){
          var node = this.uistack.pop();
          if(node)
              node.active = false;
      }
    }

};
