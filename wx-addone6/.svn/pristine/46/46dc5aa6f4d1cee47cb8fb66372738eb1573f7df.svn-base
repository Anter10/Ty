/**
 * @description 抽奖界面
 * @description created by gyc on 2018-09-17
 */
cc.Class({
    extends: cc.Component,

    properties: {
        cjItem:{
           default: null,
           type:cc.Prefab,
        },
         scrollView: {
             default: null,
             type: cc.ScrollView
         },
        // 当前的抽奖状态 0 免费抽奖 1 观看视频抽奖
        jlData:[],
    },

    close:function(){
        this.node.destroy();
    },
    
    /**
     * @description 组件加载完成
     */
    onLoad:function() {
        this.content = this.scrollView.content;
        this.jlData = [{time:"2018-09-17",item:{name:"1元"}},{time:"2018-09-17",item:{name:"锤子"}}];
        this.setData(this.jlData);
    },
    /**
     * @description 设置并刷新数据
     * @param {Object} data 请求到的记录数据
     */
    setData:function(data){
        this.jlData = data;
        for (let i = 0; i < this.jlData.length; ++i) { // spawn items, we only need to do this once
            let item = cc.instantiate(this.cjItem);
            this.content.addChild(item);
            item.setPosition(0, -item.height * (0.5 + i) - 10 * (i + 1));
            item.getComponent('JiLuItem').setData(this.jlData[i]);
        }
    },
    /** 
     * @description 刷新视图
    */
   flushView: function(){
        
   },
    
    
 


 
    
});
