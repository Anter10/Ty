// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        luckboard: {
            default: null,
            type: cc.Node,
        },
        luckitem: {
            default: null,
            type: cc.Prefab,
        },
        luckitems: {
            default: [],
            type: cc.Node,
        },
        allframe:{
            default: [],
            type: cc.SpriteFrame,
        },
        mflqBtn:{
            default: null,
            type: cc.Node,
        }

    },


    close: function () {
        this.luckitems[0].getComponent("luckitem").selected();
        tywx.ado.Utils.showWXBanner();
        this.node.active = false;
    },

    lqCall: function () {
          
    },

    onLoad() {
        // 显示当前的所有道具
        var allitem = tywx.ado.Constants.GameCenterConfig.allitem;
        var [row, column, bottom, padingleft, margin, width] = [0, 0, 120, 60, 80, 162];
        // console.log("道具数据 = "+JSON.stringify(allitem));
        for (var itemindex = 0; itemindex < allitem.length; itemindex++) {
            var item = this.luckitems[itemindex];
            let itemsceipt = item.getComponent("luckitem");
            itemsceipt.setParent(this);
            itemsceipt.setItem(allitem[itemindex],this.allframe[itemindex]);
            if(itemindex == 0){
              this.selectitem = itemsceipt;
            }
        }
        this.selectitem.selected();
        
        var self = this;
         // 设置免费领取的回调
         let mflq = this.mflqBtn.getComponent("ShareButton");
         if (tywx.config.auditing == true) {
             mflq.setReactCall(true);
         } else {
             mflq.setReactCall(false);
         }
         mflq.setSuccessCall(function () {
            tywx.gamecenter.lingQuItem(false,self.produceItem());
            self.close();
         });
         mflq.setShareGroupCall(function () {
            tywx.gamecenter.lingQuItem(false, self.produceItem());
            self.close();
         });
         mflq.setShareConfig(tywx.ado.Constants.ShareConfig.FREE_GIFT_SHARE);
    },

    hideOtherSelected: function(selectItem){
        for (var itemindex = 0; itemindex < this.luckitems.length; itemindex++) {
            var item = this.luckitems[itemindex];
            let itemsceipt = item.getComponent("luckitem");
            var tdata = itemsceipt.getData();
            // console.log("tdata = "+JSON.stringify(tdata));
            if(tdata != "undefined" && tdata.id != selectItem.getData().id){
                itemsceipt.unselected();
            }
        }
        this.selectitem = selectItem;
    },
    produceItem:function(){
        var data = this.selectitem.getData();
        var produceitem = {};
        produceitem.id = data.id;
        produceitem.name = data.name;
        produceitem.num = 1;
        return produceitem;
    }

});
