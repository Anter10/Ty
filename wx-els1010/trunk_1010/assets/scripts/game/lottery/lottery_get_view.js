 const lotery_get_view_path = "prefabs/lottery_get_view";
 let LOCAL_STOREITEM_KEY = "tt-items";

 const lottery_get_view = cc.Class({
     extends: cc.Component,

     properties: {
         nameLabel: cc.Label,
         icon: cc.Sprite,
         mfjbBtnNode: cc.Node,
         background: cc.Node,
     },


     close: function () {
         if (this.closeing) {
             return;
         }
         this.closeing = true;
         lottery_get_view.get_view_node.removeFromParent(true);
         lottery_get_view.get_view_node = null;
     },


     // 加倍领取奖励
     addDoubleJL: function () {
         var self = this;
         tywx.tt.log("加倍奖励哦" + JSON.stringify(this.data));
         if (this.data.gift_id == 2 || this.data.gift_id == 4 || this.data.gift_id == 6) {
             var items = JSON.parse(tywx.tt.Utils.loadItem(LOCAL_STOREITEM_KEY, "[]"));
             var allitems = [];
             if (items.length > 0) {
                 var findit = false;
                 for (var itIndex = 0; itIndex < items.length; itIndex++) {
                     const item = items[itIndex];
                     if (item.id == this.data.gift_id) {
                         findit = true;
                         item.num = item.num + 1;
                     }
                     allitems.push(item);
                 }
                 if (!findit) {
                     const titem = this.getAddItem();
                     allitems[allitems.length] = titem;
                 }
             } else {
                 var titem = this.getAddItem();
                 allitems[0] = titem;
             }
             tywx.tt.Utils.saveItem(LOCAL_STOREITEM_KEY, JSON.stringify(allitems), false);
             this.close();
         } else {
             tywx.tt.Utils.requestAddRedPacket({
                 success: function (res) {
                     self.close();
                     tywx.tt.Utils.showWXToast("恭喜获得");
                 },
                 fail: function () {
                     self.close();
                     tywx.tt.Utils.showWXToast("请求失败");
                 }
             });
         }

     },

     getAddItem: function () {
         var titem = {};
         titem.id = this.data.gift_id;
         titem.num = this.data.number || 1;
         titem.name = this.data.name;
         titem.icon = this.data.icon;
         return titem;
     },

     onLoad() {
         var self = this;
         // 视频抽奖
         const videoBtnScript = this.mfjbBtnNode.getComponent("ShareButton");
         const share_control = tywx.tt.configManager.getInstance().share_control ? tywx.tt.configManager.getInstance().share_control.recovergame : ["share", 50];
         const calltype = tywx.tt.Utils.shareVideoCtr(share_control);
         videoBtnScript.setButtonCallType(calltype);
         const config = calltype == 1 ? tywx.tt.constants.ShareConfig.ZPADDDOUBLE_SHARE : tywx.tt.constants.ShareConfig.ZPADDDOUBLE_VIDEO;
         videoBtnScript.setShareConfig(config);
         videoBtnScript.setSuccessCall(function () {
             self.addDoubleJL();
         });
         this.background.getComponent("background").setTouchEndCall(function () {
             self.close();
         });
     },

     start() {

     },

     setData: function (data) {
         this.data = data;
         tywx.tt.log("this = data = " + JSON.stringify(this.data));
         this.flushNameLabel();
         this.flushIconLabel();
     },

     flushNameLabel: function () {
         this.nameLabel.string = this.data.name;
     },

     flushIconLabel: function () {
         var self = this;
         cc.loader.load(
             'https://elsfkws.nalrer.cn/teris/lottery/' + this.data.icon,
             (err, texture) => {
                 if (!err) {
                     let new_sprite_frame = new cc.SpriteFrame(texture);
                     self.icon.spriteFrame = new_sprite_frame;
                     self.icon.node.setContentSize(cc.size(90, 90));
                 } else {

                 }
             });
     },

     statics: {
         get_view_node: null,
         show: function (tdata) {
             const data = tdata;
             cc.loader.loadRes(lotery_get_view_path, (err, prefab) => {
                 if (!err) {
                     let getlotterynode = cc.instantiate(prefab);
                     let ads_script = getlotterynode.getComponent('lottery_get_view');
                     getlotterynode.x = 360;
                     getlotterynode.y = 640;
                     ads_script.setData(data);
                     lottery_get_view.get_view_node = getlotterynode;
                     cc.director.getScene().addChild(getlotterynode);
                 }
             });
         }
     }

     // update (dt) {},
 });


 module.exports = lottery_get_view;