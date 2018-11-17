/*
    游戏中的邀请领取界面:
    created by gyc on 2018-08-014.
    final changed by gyc on 2018-08-15.
*/
cc.Class({
    extends: cc.Component,

    properties: {
        pagePrefab:{
            default: null,
            type: cc.Prefab,
        },
        userItem:{
            default: null,
            type: cc.Prefab,
        },
        pageView:{
            default: null,
            type: cc.PageView,
        },
        nextBut:{
            default: null,
            type: cc.Sprite,
        },
        upBut:{
            default: null,
            type: cc.Sprite,
        },
    },
 
    /*
        调用: 节点渲染完成后调用
        功能: 完成部分逻辑的初始化
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    onLoad:function(){
       for(var pageIndex = 0; pageIndex < 5; pageIndex ++){
           var page = cc.instantiate(this.pagePrefab);
           ty.LOGE("添加了新的view ");
         
           for(var hindex = 0; hindex < 6; hindex ++ ){
                var item = cc.instantiate(this.userItem);
                if(hindex < 3){
                   item.y = -120;
                   item.x = hindex * 215  - 215;
                }else{
                   item.y = 190;
                   item.x = (hindex - 3) * 215 - 215;
                }
                page.addChild(item);
           }
           this.pageView.addPage(page);
       }

       this.upBut.node.active = false;
    },

   
    /*
        调用: 点击下一页按钮的时候调用
        功能: 跳转到一页
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */ 
    nextPage:function(){
        var totalpage = this.pageView.getPages().length;
        var curindex = this.pageView.getCurrentPageIndex()
        if(curindex < totalpage){
           this.upBut.node.active = true;
           if(curindex == totalpage - 2){
              this.nextBut.node.active = false;
           }else{
              this.nextBut.node.active = true;
           }
           this.pageView.scrollToPage(curindex + 1, 0.2);
        }else{
           this.nextBut.node.active = false;
        }
    },

    /*
        调用: 点击上一页按钮的时候调用
        功能: 跳转到上一页
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */ 
    upPage:function(){
        var totalpage = this.pageView.getPages().length;
        var curindex = this.pageView.getCurrentPageIndex()
        ty.LOGE("当前页面 = "+curindex);
        if(curindex > 0){
           this.nextBut.node.active = true;
           if(curindex == 1){
              this.upBut.node.active = false;
           }else{
              this.upBut.node.active = true;
           }
           this.pageView.scrollToPage(curindex - 1, 0.2);
        }else{
           this.upBut.node.active = false;
           this.nextBut.node.active = true;
        }
    },

    /*
        调用: 每帧调用
        功能: 完成及时性的一些逻辑
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */ 
    update:function(){
        if(this.pageView.getCurrentPageIndex() == 0){
           this.upBut.node.active = false;
        }else if(this.pageView.getCurrentPageIndex() == this.pageView.getPages().length - 1){
           this.nextBut.node.active = false;
        }else{
           this.upBut.node.active = true;
           this.nextBut.node.active = true;
        }
    }

});
