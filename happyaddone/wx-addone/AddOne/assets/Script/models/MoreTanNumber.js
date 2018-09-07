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
         }

     },
    
     /**
      * @description 刷新当前的试图
      * @param {Number} shownum 当前合出来的偶数
      * @param {Number} score 玩家当前的得分
      * @param {String} 道具名称
      */
     setShowNumber: function (shownum, score, name) {
         this.showNumber.string = shownum;
         this.setDbByIndex(shownum, score, name);
     },

     /**
      * @description 保存照片
      */
     storePhoto: function () {
        if(this.hadstorephotonumber){
           tywx.ado.Utils.showWXToast("已经保存成功",500);
           return;
        }
        // this.hadstorephotonumber = true;
        let [cw,ch]                  = [cc.game.canvas.width, cc.game.canvas.height];
        let is_ipx                   = ch / cw >= 1.9;                                                 // * 是否是2:1屏幕
        let ds                       = cc.size(720, 1280);
        let dcs                      = cc.size(516, 818);
        let [rate_width,rate_height] = [dcs.width / ds.width, dcs.height / ds.height];
        let [d_x, d_y]               = [(ds.width - dcs.width) / 2, (ds.height - dcs.height) / 2 - 102];
        let [rate_x,rate_y]          = [d_x / ds.width,d_y / ds.height];

        let w = cw * rate_width;
        let h = is_ipx ? w * (dcs.height / dcs.width) : ch * rate_height;
        let x = cw * rate_x;
        let y = is_ipx ?  (ch - h) / 2 - this.showdbSprite.node.position.y: ch * rate_y ;
        var self = this;
        canvas.toTempFilePath({
            x: x,
            y: y,
            width: w, 
            height: h,
            destWidth: 516,
            destHeight: 818,
            success: function success(res) {
                //console.log(res);
                tywx.ado.Utils.saveImage2PhoneByUrl(res.tempFilePath,function(){
                    self.hadstorephotonumber = true;
                    self.storesuccall && self.storesuccall();
                    tywx.ado.Utils.showWXToast("领取成功",1000);
                }, function(){
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
     
     /**
      * @description 设置关闭后的回调函数
      * @param {Function} clossc 关闭回调函数
      */
     setCloseCall: function (clossc) {
         this.clossc = clossc;
     },
    
     /**
      * @description 手动初始化已经存储图片的开关
      */
     init:function(){
        this.hadstorephotonumber = false;
     },

    /**
      * @description 页面加载完成后的逻辑处理
      */
     onLoad() {
         this.hadstorephotonumber = false;
         // 设置分享点
         this.shareNode.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.FREE_GIFT_SHARE);
         this.backSprite.node.on('touchstart', function (event) {
             return true;
         });
         
     },
    
     /**
      * @description 得到当前界面的分享按钮的脚本组件
      */
     getShareComponent: function () {
         return this.shareNode.getComponent("ShareButton");
     },
     
      
     
     /**
      * @description 设置当前保存图片成功后的回调函数
      * @param {Function} succall 保存图片成功的回调函数
      */
     setStoreSucCallBack: function(succall){
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
     }



 });