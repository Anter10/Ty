"use strict";
cc._RF.push(module, '74e4bmbWUhJLq/Dqfpq4ob8', 'MoreTanNumber');
// Script/models/MoreTanNumber.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        showNumber: {
            type: cc.Label,
            default: null
        },
        shareNode: {
            type: cc.Node,
            default: null
        },
        numberBj: {
            type: cc.Node,
            default: null
        },
        rootNode: {
            type: cc.Node,
            default: null
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
            default: null
        },
        backSprite: {
            type: cc.Sprite,
            default: null
        },

        spriteFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        jlLabel: {
            default: null,
            type: cc.Label
        },
        shareButton: {
            type: cc.Node,
            default: null
        }

    },

    /**
     * @description 刷新当前的试图
     * @param {Number} shownum 当前合出来的偶数
     * @param {Number} score 玩家当前的得分
     * @param {String} 道具名称
     */
    setShowNumber: function setShowNumber(shownum, score, name) {
        this.addscore = score;
        this.showNumber.string = shownum;
        this.jlLabel.string = "奖励 " + score + "分";
        this.setDbByIndex(shownum, score, name);
    },

    /**
     * @description 保存照片
     */
    storePhoto: function storePhoto() {
        if (this.hadstorephotonumber) {
            tywx.ado.Utils.showWXToast("已经保存成功", 500);
            return;
        }

        // this.hadstorephotonumber = true;
        var contentsize = {
            width: this.numberBj.width,
            height: this.numberBj.height
        };
        console.log("contentsize  + " + JSON.stringify(contentsize));
        var _ref = [cc.game.canvas.width, cc.game.canvas.height],
            cw = _ref[0],
            ch = _ref[1];

        var is_ipx = ch / cw >= 1.9; // * 是否是2:1屏幕
        var ds = cc.size(720, 1280);
        var dcs = cc.size(contentsize.width, contentsize.height);
        var rate_width = dcs.width / ds.width,
            rate_height = dcs.height / ds.height;
        var d_x = (ds.width - dcs.width) / 2,
            d_y = (ds.height - dcs.height) / 2 - 102;
        var rate_x = d_x / ds.width,
            rate_y = d_y / ds.height;


        var w = cw * rate_width;
        var h = is_ipx ? w * (dcs.height / dcs.width) : ch * rate_height;
        var x = cw * rate_x;
        var y = is_ipx ? (ch - h) / 2 - this.showdbSprite.node.position.y : ch * rate_y;
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
    playAni: function playAni() {
        //  this.node.getComponent(cc.Animation).play("huode1");
        this.uiAni();
    },

    /**
     * @description 关闭当前的界面
     */
    close: function close() {
        tywx.ado.Utils.showWXBanner();
        this.node.active = false;
        this.hadstorephotonumber = false;
        if (this.clossc) {
            this.clossc();
        }
    },

    closeCall: function closeCall() {
        this.close();
        if (tywx.gamecenter && tywx.gamecenter.shareDoubleScore) {
            tywx.gamecenter.shareDoubleScore(this.addscore);
        }
    },

    /**
     * @description 设置关闭后的回调函数
     * @param {Function} clossc 关闭回调函数
     */
    setCloseCall: function setCloseCall(clossc) {
        this.clossc = clossc;
    },

    doubleScore: function doubleScore() {
        if (tywx.gamecenter && tywx.gamecenter.shareDoubleScore) {
            tywx.gamecenter.shareDoubleScore(this.addscore * 2);
        }
    },

    /**
     * @description 手动初始化已经存储图片的开关
     */
    init: function init() {
        this.hadstorephotonumber = false;
    },

    /**
     * @description 播放界面通用动画
     */
    uiAni: function uiAni() {
        this.doubleAddInit();
        tywx.ado.Utils.commonScaleIn(this.rootNode);
    },

    /**
     * @description 页面加载完成后的逻辑处理
     */
    onLoad: function onLoad() {
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
    getShareComponent: function getShareComponent() {
        return this.shareNode.getComponent("ShareButton");
    },

    /** 
     * @description 判断是什么类型的加倍 视频 或者 分享
     */
    doubleAddInit: function doubleAddInit() {
        if ((tywx.config.share_control.bigdouble == "video" || tywx.ado.isMinGanIP) && tywx.ado.isCanWatchVideo) {
            this.shareButton.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.FREE_DOUBLE_SCORE_SHARE_VIDEO);
            this.shareButton.getComponent("ShareButton").setButtonCallType(2);
        } else if (tywx.config.share_control.bigdouble == "share" || !tywx.ado.isCanWatchVideo) {
            this.shareButton.getComponent("ShareButton").setShareConfig(tywx.ado.Constants.ShareConfig.FREE_DOUBLE_SCORE_SHARE);
            this.shareButton.getComponent("ShareButton").setButtonCallType(1);
        }
    },

    /**
     * @description 设置当前保存图片成功后的回调函数
     * @param {Function} succall 保存图片成功的回调函数
     */
    setStoreSucCallBack: function setStoreSucCallBack(succall) {
        this.storesuccall = succall;
    },

    /**
     * @description 刷新当前页面的显示 保罗合出的最大数 和 当前得分 以及底板的显示 和当前得到的道具名称
     * @param {Number} num 当前合出的最大数
     * @param {Number} score 当前玩家的得分
     * @param {Number} name 当前道具的名称
     */
    setDbByIndex: function setDbByIndex(num, score, name) {
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

    btnRefreshBgPhotoCallback: function btnRefreshBgPhotoCallback() {
        var photo_urls = tywx.config.PYQImg.MergeBigNumPhotos;
        if (!this.showPicIndex || this.showPicIndex > photo_urls.length - 1) {
            this.showPicIndex = 0;
        }
        var pngurl = tywx.SystemInfo.cdnPath + 'share_pyq/addone/' + photo_urls[this.showPicIndex];
        console.log("cdnpngurl = " + pngurl);
        var sprite = this.rootNode.getChildByName('numberbj1').getComponent(cc.Sprite);
        tywx.ado.Utils.refreshSpriteByUrl(sprite, pngurl);
        this.showPicIndex = this.showPicIndex + 1;
    }
});

cc._RF.pop();