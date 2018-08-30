 /*
     展示微信好友的排行榜
     created by gyc on 2018-08-06.
     final changed by gyc on 2018-08-09;
 */

 // 当前是否发布微信游戏
 var CC_WECHATGAME = true;
 var MAIN_MENU_NUM = "x1";
 // 一个玩家只显示一次
 var prePersonIconUrl = "";
 
 
 //  玩家发送给子域的数据类型
 var PTypes = {
     // 得到微信好友的信息
     friends: 1,
     // 得到某个群的信息
     group: 2,
     // 得到玩家的基础信息
     userinfo: 3,
     // 提交当前的得分
     submitscore: 4,
     // 存储好友数据
     storefris: 5,
     // 隐藏UI
     hideUi: 6,
 };

 cc.Class({
     extends: cc.Component,
     properties: {
         // 排行榜的滚动scrollview
         gameranklist: cc.ScrollView,
         // 显示loading的文本label
         showloading: cc.Label,
         // 每个scrollview的Item
         rankItem: cc.Prefab,
         // scrollview的父节点
         gamerank: cc.Node,
         // 标签
         titleLabel: cc.Label,
         // scrollview的容器layout
         content: cc.Node,
         // 超逾玩家的信息
         friendmsd: cc.Node,
         // 名字
         nameLabel: cc.Label,
         // 分数
         scoreLabel: cc.Label,
         // 头像
         iconSprite: cc.Sprite,
     },


     /*
         调用: 游戏界面开始
         功能: 监听主域发送的数据并处理
         参数: [
            无
         ]
         返回值:[
            无
         ]
         思路: 游戏逻辑需要
     */
     start() {
         let self = this;

         wx.onMessage(data => {
              
             self.showloading.node.active = true;
             console.log("当前玩家给子域的数据 = " + JSON.stringify(data));
             if (data.method == PTypes.friends) {
                 self.titleLabel.string = "  好友排行榜";
                 self.getFriendData();
             } else if (data.method == PTypes.group) {
                 self.titleLabel.string = "群组排行榜";
                 self.getGroupFriendData(data.shareTicket);
             } else if (data.method == PTypes.userinfo) {
                 self.getUserInfoData();
             } else if (data.method == PTypes.submitscore) {
                 self.submitScore(data.score);
             } else if (data.method == PTypes.storefris) {
                 self.storeFriends(data.score, data.isrestart,data);
                 
             } else if (data.method == PTypes.hideUi) {
                 self.hideUi(data.rank, data.friendicon);
             }
        });
     },

     /*
         调用:隐藏好友头像的时候
         功能: 隐藏当前界面的UI
         参数: [
            rank: 隐藏排行榜UI type: Boolean
            friendicon: 隐藏好友头像UI type: Boolean
         ]
         返回值:[
            无
         ]
         思路: 游戏逻辑需要
     */
     hideUi: function (rank, friendicon) {
        //  this.gamerank.active = rank;
        //  this.friendmsd.active = friendicon;
     },

     /*
         调用: 游戏结束的时候调用
         功能: 提交玩家的当前得分
         参数: [
            score: 玩家此次游戏的得分数
         ]
         返回值:[
            无
         ]
         思路: 游戏逻辑需要
     */
     submitScore: function (score) {
         var self = this;
         if (CC_WECHATGAME) {
             wx.getUserCloudStorage({
                 // 以key/value形式存储
                 keyList: [MAIN_MENU_NUM],

                 success: function (getres) {
                    //  Log('setUserCloudStorage', 'success', getres)
                     self.showloading.node.active = false;
                     if (getres.KVDataList.length != 0) {
                         if (getres.KVDataList[0].value > score) {
                             return;
                         }
                     }
                     // 对用户托管数据进行写数据操作
                     window.wx.setUserCloudStorage({
                         KVDataList: [{
                             key: MAIN_MENU_NUM,
                             value: "" + score
                         }],
                         success: function (res) {
                            //  Log('setUserCloudStorage', 'success', res)
                         },
                         fail: function (res) {
                            //  Log('setUserCloudStorage', 'fail')
                         },
                         complete: function (res) {
                            //  Log('setUserCloudStorage', 'ok')
                         }
                     });
                 },
                 fail: function (res) {
                    //  Log('getUserCloudStorage', 'fail')
                 },
                 complete: function (res) {
                    //  Log('getUserCloudStorage', 'ok')
                 }
             });
         } else {
            //  Log("提交得分:" + MAIN_MENU_NUM + " : " + score)
         }
     },

     /*
         调用: 想要使用玩家的数据的时候调用
         功能: 得到玩家的基本信息
         参数: [
            store: 是否存储玩家的好友数据
         ]
         返回值:[
            无
         ]
         思路: 游戏逻辑需要
     */
     getUserInfoData: function () {
         wx.getUserInfo({
             openIdList: ['selfOpenId'],
             lang: 'zh_CN',
             success: function (params) {
                //  Log(JSON.stringify(params));
                 var sharedCanvas = wx.getSharedCanvas();
                 var context = sharedCanvas.getContext("2d");

             },
             fail: function (params) {
                //  Log(JSON.stringify(arguments));
                 var sharedCanvas = wx.getSharedCanvas();
                 var context = sharedCanvas.getContext("2d");

             }
         });
     },

     /*
         调用: 获得玩家的微信好友的数据
         功能: 存储当前好友的数据 方便主域取出使用
         参数: [
            tstore: 是否存储玩家的好友数据
         ]
         返回值:[
            无
         ]
         思路: 游戏逻辑需要
     */
     getFriendData: function (tstore, tscore, data) {
         var score = tscore;
         var self = this;
         var store = tstore;
         if (store == true) {
             self.gamerank.active = false;
            //  self.friendmsd.active = false;
            self.friendmsd.active = true;
         } else {
             self.friendmsd.active = false;
         }
         if (CC_WECHATGAME) {
             wx.getUserInfo({
                 openIdList: ['selfOpenId'],
                 success: (userRes) => {
                     this.showloading.node.active = false;

                     let userData = userRes.data[0];

                     //取出所有好友数据
                     wx.getFriendCloudStorage({
                         keyList: [MAIN_MENU_NUM],
                         success: res => {
                             let data = res.data;
                            //  Log("当前所有好友的数据userData = " + JSON.stringify(data))
                             if (store == true) {
                                 //    this.setDataToLocalStorage("friends",JSON.stringify(data)); 
                             }
                             data.sort((a, b) => {
                                 if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                     return 0;
                                 }
                                 if (a.KVDataList.length == 0) {
                                     return 1;
                                 }
                                 if (b.KVDataList.length == 0) {
                                     return -1;
                                 }
                                 return b.KVDataList[0].value - a.KVDataList[0].value;
                             });

                             if (store != true) {
                                //  Log("当前是否存储1 " + store);
                                 self.gamerank.active = true;
                                 self.friendmsd.active = false;

                                 self.gameranklist.content.removeAllChildren();
                                 var pto = 20;
                                 for (let i = 0; i < data.length; i++) {
                                     var playerInfo = data[i];
                                     playerInfo.pm = i;
                                     if (i == 0) {
                                         pto = 55;
                                     }
                                     var item = cc.instantiate(this.rankItem);
                                     item.getComponent('rankitem').updateData(playerInfo);
                                     item.setPosition(0, -80 * i - pto);
                                     this.gameranklist.content.addChild(item, 122);
                                 }

                                 if (data.length <= 8) {
                                     let layout = this.content.getComponent(cc.Layout);
                                     layout.resizeMode = cc.Layout.ResizeMode.NONE;
                                 }
                             } else if (store == true) {

                                 // 得出和自己分数最进的好友
                                 var frdata = null;

                                 for (let i = data.length - 1; i >= 0; i--) {
                                     var tdata = data[i];
                                     var fscore = tdata.KVDataList[0] == null ? 0 : tdata.KVDataList[0].value;
                                     var chazhi = fscore - score;

                                     if (chazhi > 0 ) {
                                             frdata = tdata;
                                             frdata.score = fscore;
                                             prePersonIconUrl = tdata.avatarUrl;
                                             break;
                                     }
                                 }
                                //  Log("当前是否存储2 " + store); // prePersonIconUrl != tdata.avatarUrl &&
                                 // 如果有玩家的分数大于自己的 则显示
                                 if (frdata != null) {
                                     self.friendmsd.active = true;
                                    //  self.friendmsd.y = 1280-70;
                                     self.nameLabel.string = frdata.nickname;
                                     self.scoreLabel.string = frdata.score;
                                     self.createIcon(self.iconSprite, frdata.avatarUrl);
                                    //  Log("刷新成功");
                                 } else {
                                     self.friendmsd.active = false;
                                 }
                             }
                         },
                         fail: res => {
                            //  Log("wx.getFriendCloudStorage fail", res);
                             self.showloading.string = "数据加载失败，请检测网络，谢谢。";
                         },
                     });
                 },
                 fail: (res) => {
                     self.showloading.string = "数据加载失败，请检测网络，谢谢。";
                 }
             });
         }
     },

     /*
         调用: 获得好友数据的时候调用
         功能: 存储当前好友的数据 方便主域取出使用
         参数: [
            keyStr:获得好友数据的KEY type: string
            ValueStr:好友的数据 type: string
         ]
         返回值:[
            无
         ]
         思路: 游戏逻辑需要
     */
     setDataToLocalStorage: function (keyStr, ValueStr) {
         try {
            //  Log("wx setStorage = " + wx.setStorage);
             if (wx && wx.setStorage) {
                 window.wx.setStorage({
                     key: keyStr,
                     data: ValueStr + ''
                 });
                //  Log("存储数据成功" + ValueStr);
             }
         } catch (e) {
             // cc.sys.localStorage.setItem(keyStr, ValueStr+"");

            //  Log("存储数据失败", "setItemToLocalStorage fail");
         }
     },

     /*
         调用: 游戏界面显示即将超越的时候使用
         功能: 存储玩家好友的数据
         参数: [
            score:玩家当前分数
            isrestart: 当前游戏是否为重新开始的游戏
         ]
         返回值:[
            无
         ]
         思路: 游戏逻辑需要
     */
     storeFriends: function (score, isrestart, data) {
         if (isrestart == true) {
             prePersonIconUrl = "";
         }
         this.getFriendData(true, score, data)
     },

     /*
          调用: 主域手动显示群组排行榜的时候调用
          功能: 得到玩家微信群组的数据
          参数: [
             tshareTicket: 得到群组的ID
          ]
          返回值:[
             无
          ]
          思路: 游戏逻辑需要
      */
     getGroupFriendData: function (tshareTicket) {
         var self = this;
         var shareTicket = tshareTicket;
         self.friendmsd.active = false;
         if (CC_WECHATGAME) {
             wx.getUserInfo({
                 openIdList: ['selfOpenId'],
                 success: (userRes) => {
                    //  Log('success', userRes.data)
                     let userData = userRes.data[0];
                     //取出所有好友数据
                     wx.getGroupCloudStorage({
                         shareTicket: shareTicket,
                         keyList: [MAIN_MENU_NUM],
                         success: res => {
                            //  Log("群组数据 = ", res);

                             let data = res.data;
                             data.sort((a, b) => {
                                 if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                     return 0;
                                 }
                                 if (a.KVDataList.length == 0) {
                                     return 1;
                                 }
                                 if (b.KVDataList.length == 0) {
                                     return -1;
                                 }
                                 return b.KVDataList[0].value - a.KVDataList[0].value;
                             });
                             this.showloading.node.active = false;
                             self.gameranklist.content.removeAllChildren();
                             var pto = 35;
                             for (let i = 0; i < data.length; i++) {
                                 var playerInfo = data[i];
                                 playerInfo.pm = i;
                                 var item = cc.instantiate(this.rankItem);
                                 item.getComponent('rankitem').updateData(playerInfo);
                                 if (i == 0) {
                                     pto = 55;
                                 }
                                 item.setPosition(0, -80 * i - pto);
                                 this.gameranklist.content.addChild(item, 122);
                             }
                             if (data.length <= 8) {
                                 let layout = this.content.getComponent(cc.Layout);
                                 layout.resizeMode = cc.Layout.ResizeMode.NONE;
                             }

                         },
                         fail: res => {
                            //  Log("得到群组数据失败", res);
                             // this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                         },
                     });
                 },
                 fail: (res) => {
                     // this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                 }
             });
         }
     },

     onLoad: function () {
        //  Log("Hvj");
     },
     /*
            调用: 显示玩家微信好友排行榜的时候显示
            功能: 创建玩家的微信头像
            参数: [
               avatarUrl: 玩家微信头像的url
            ]
            返回值:[
               无
            ]
            思路: 游戏逻辑需要
        */
     createIcon: function (sprite, avatarUrl) {
         var self = this;
         var tsp = sprite;
         try {
             var image = wx.createImage();
             image.src = avatarUrl;
             image.onload = (event) => {
                 try {
                     let texture = new cc.Texture2D();
                     texture.initWithElement(image);
                     texture.handleLoadedTexture();
                     tsp.spriteFrame = new cc.SpriteFrame(texture);
                    //  Log(avatarUrl + " ni/ " + sprite.node.width + " == " + texture.width + " " + sprite.node.y)
                 } catch (e) {
                    //  Log("图片加载失败");
                 }
             };


         } catch (e) {

         }
     }

 });
