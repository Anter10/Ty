 cc.Class({
     extends: cc.Component,

     properties: {
         showNumber: {
             type: cc.Label,
             default: null,
         },
         shareNode: {
             type: cc.Node,
             default: null,
         },
         numberBj: {
             type: cc.Node,
             default: null,
         },
         rootNode: {
             type: cc.Node,
             default: null,
         },
         yellowNumberLabel: {
             default: null,
             type: cc.Label
         },

         curhcScoreLabel: {
             default: null,
             type: cc.Label
         },

         curgzupNumberLabel: {
             default: null,
             type: cc.Label
         },

         curgzItemNameLabel: {
             default: null,
             type: cc.Label
         },

         showdbSprite: {
             type: cc.Sprite,
             default: null,
         },
         backSprite: {
             type: cc.Sprite,
             default: null,
         },

         spriteFrames: {
             default: [],
             type: cc.SpriteFrame,
         },
         jlLabel: {
             default: null,
             type: cc.Label
         },
         shareButton: {
             type: cc.Node,
             default: null,
         }

     },

     /**
      * @description 刷新当前的试图
      * @param {Number} shownum 当前合出来的偶数
      * @param {Number} score 玩家当前的得分
      * @param {String} 道具名称
      */
     setShowNumber: function (shownum, score, name) {
         this.addscore = score;
         this.showNumber.string = shownum;
         this.jlLabel.string = "奖励 " + score + "分";
         this.setDbByIndex(shownum, score, name);
     },

     /**
      * @description 保存照片
      */
     storePhoto: function () {
         if (this.hadstorephotonumber) {
             tywx.ado.Utils.showWXToast("已经保存成功", 500);
             return;
         }

         // this.hadstorephotonumber = true;
         var contentsize = {
             width: this.numberBj.width,
             height: this.numberBj.height
         }
         console.log("contentsize  + " + JSON.stringify(contentsize));
         let [cw, ch] = [cc.game.canvas.width, cc.game.canvas.height];
         let is_ipx = ch / cw >= 1.9; // * 是否是2:1屏幕
         let ds = cc.size(720, 1280);
         let dcs = cc.size(contentsize.width, contentsize.height);
         let [rate_width, rate_height] = [dcs.width / ds.width, dcs.height / ds.height];
         let [d_x, d_y] = [(ds.width - dcs.width) / 2, (ds.height - dcs.height) / 2 - 102];
         let [rate_x, rate_y] = [d_x / ds.width, d_y / ds.height];

         let w = cw * rate_width;
         let h = is_ipx ? w * (dcs.height / dcs.width) : ch * rate_height;
         let x = cw * rate_x;
         let y = is_ipx ? (ch - h) / 2 - this.showdbSprite.node.position.y : ch * rate_y;
         var self = this;
         canvas.toTempFilePath({
             x: x,
             y: y,
             width: w,
             height: h,
             destWidth: contentsize.width,
             destHeight: contentsize.height,
             quality: 1,
             fileType: "jpg",
             success: function success(res) {
                 //console.log(res);
                 tywx.ado.Utils.saveImage2PhoneByUrl(res.tempFilePath, function () {
                     //  self.hadstorephotonumber = true;
                     // 注释保存图片宋道具
                     // self.storesuccall && self.storesuccall();
                     //  tywx.ado.Utils.showWXToast("领取成功", 1000);
                     tywx.ado.Utils.showWXToast("保存图片成功", 1000);
                 }, function () {
                     self.hadstorephotonumber = false;
                     tywx.ado.Utils.showWXToast("保存图片失败");
                 });
             },
             fail: function fail(res) {
                 self.hadstorephotonumber = false;
                 tywx.ado.Utils.showWXToast("保存图片失败");
             }
         });
     },


     /**
      * @description 播放当前界面的动画
      */
     playAni: function () {
         //  this.node.getComponent(cc.Animation).play("huode1");
         this.uiAni();
     },

     /**
      * @description 关闭当前的界面
      */
     close: function () {
         tywx.ado.Utils.showWXBanner();
         this.node.active = false;
         this.hadstorephotonumber = false;
         if (this.clossc) {
             this.clossc();
         }
     },

     closeCall: function () {
         this.close();
         if (tywx.gamecenter && tywx.gamecenter.shareDoubleScore) {
             tywx.gamecenter.shareDoubleScore(this.addscore);
         }
     },

     /**
      * @description 设置关闭后的回调函数
      * @param {Function} clossc 关闭回调函数
      */
     setCloseCall: function (clossc) {
         this.clossc = clossc;
     },

     doubleScore: function () {
         if (tywx.gamecenter && tywx.gamecenter.shareDoubleScore) {
             tywx.gamecenter.shareDoubleScore(this.addscore * 2);
         }
     },

     /**
      * @description 手动初始化已经存储图片的开关
      */
     init: function () {
         this.hadstorephotonumber = false;
     },

     /**
      * @description 播放界面通用动画
      */
     uiAni: function () {
         this.doubleAddInit();
         tywx.ado.Utils.commonScaleIn(this.rootNode);
     },


     /**
      * @description 页面加载完成后的逻辑处理
      */
     onLoad() {
         this.hadstorephotonumber = false;
         this.doubleAddInit();
         this.backSprite.node.on('touchstart', function (event) {
             return true;
         });
         //  this.btnRefreshBgPhotoCallback();
     },

     /**
      * @description 得到当前界面的分享按钮的脚本组件
      */
     getShareComponent: function () {
         return this.shareNode.getComponent("ShareButton");
     },



     /** 
      * @description 判断是什么类型的加倍 视频 或者 分享
      */
     doubleAddInit: function () {
         const share_control = tywx.config.share_control_2.bigdouble;
         var random = parseInt(Math.random() * 100);
         if ((share_control[0] == "video" || tywx.ado.isMinGanIP) && tywx.ado.isCanWatchVideo) {
             this.shareButton.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.FREE_DOUBLE_SCORE_SHARE_VIDEO);
             if (random <= share_control[1] || tywx.ado.isMinGanIP) {
                 this.shareButton.getComponent("ShareButton").setButtonCallType(2);
             } else {
                 this.shareButton.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.FREE_DOUBLE_SCORE_SHARE);
                 this.shareButton.getComponent("ShareButton").setButtonCallType(1);
             }
         } else if (share_control[0] == "share" || !tywx.ado.isCanWatchVideo) {
             this.shareButton.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.FREE_DOUBLE_SCORE_SHARE);
             if (random <= share_control[1]) {
                 this.shareButton.getComponent("ShareButton").setButtonCallType(1);
             } else {
                 this.shareButton.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.FREE_DOUBLE_SCORE_SHARE_VIDEO);
                 this.shareButton.getComponent("ShareButton").setButtonCallType(2);
             }
         }

     },

     /**
      * @description 设置当前保存图片成功后的回调函数
      * @param {Function} succall 保存图片成功的回调函数
      */
     setStoreSucCallBack: function (succall) {
         this.storesuccall = succall;
     },

     /**
      * @description 刷新当前页面的显示 保罗合出的最大数 和 当前得分 以及底板的显示 和当前得到的道具名称
      * @param {Number} num 当前合出的最大数
      * @param {Number} score 当前玩家的得分
      * @param {Number} name 当前道具的名称
      */
     setDbByIndex: function (num, score, name) {
         if (num == 8) {
             this.showdbSprite.spriteFrame = this.spriteFrames[0];
         } else if (num == 9) {
             this.showdbSprite.spriteFrame = this.spriteFrames[1];
         } else {
             this.showdbSprite.spriteFrame = this.spriteFrames[2];
         }
         this.yellowNumberLabel.string = num;
         this.curhcScoreLabel.string = score;
         this.curgzupNumberLabel.string = num;
         this.curgzItemNameLabel.string = name;
     },

     btnRefreshBgPhotoCallback() {
         let photo_urls = tywx.config.PYQImg.MergeBigNumPhotos;
         if (!this.showPicIndex || this.showPicIndex > (photo_urls.length - 1)) {
             this.showPicIndex = 0;
         }
         let pngurl = tywx.SystemInfo.cdnPath + 'share_pyq/addone/' +
             photo_urls[this.showPicIndex];
         console.log("cdnpngurl = " + pngurl);
         let sprite = this.rootNode.getChildByName('numberbj1').getComponent(cc.Sprite);
         tywx.ado.Utils.refreshSpriteByUrl(sprite, pngurl);
         this.showPicIndex = this.showPicIndex + 1;
     }



 });