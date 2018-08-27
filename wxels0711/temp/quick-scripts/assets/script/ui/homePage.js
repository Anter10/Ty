(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/homePage.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7d97cFLbn1PSod8aaBcVnnw', 'homePage', __filename);
// script/ui/homePage.js

"use strict";

var els = require("../core/els.js");
var ElsProfile = require("../core/ELSProfile.js");
var ElsUtils = require("../core/ElsUtils.js");
cc.Class({
    extends: cc.Component,

    // LIFE-CYCLE CALLBACKS:
    properties: {
        animLogo: cc.Animation, //! logo动画
        spriteBtnSoundDisplay: cc.Sprite, //! 按钮显示精灵
        spriteFrameSoundDisable: cc.SpriteFrame, //!  声音按钮 disable
        spriteFrameSoundEnable: cc.SpriteFrame, //!  声音 enable
        nodeAdapterBgHome: cc.Node,
        nodeAdapterGame: cc.Node,
        label_content: cc.Prefab, // 展示字体
        whisper_tips: cc.Node, // 悄悄话提示 界面
        whisper_tips_content: cc.Label, // 悄悄话提示 内容
        whisper_tips_icon: cc.Sprite, // 悄悄话提示 头像
        whisper_win_single: cc.Node,
        label_current_level: {
            default: null,
            type: cc.Label,
            displayName: '闯关当前关卡'
        },
        label_current_diamond: {
            default: null,
            type: cc.Label,
            displayName: '持有钻石数量'
        },
        labelEndlessScore: {
            default: null,
            type: cc.Label,
            displayName: '无尽模式分数'
        },
        whisper_optional_nodes: [cc.Node]
    },

    onLoad: function onLoad() {
        tywx.NotificationCenter.listen(tywx.EventType.GET_SECRET_LANGUAGE_IMAGE_SUCCESS, this.get_image_success, this);
        tywx.NotificationCenter.listen(tywx.EventType.SECRET_LANGUAGE_TO_GAME, this.secret_language_to_game, this);
        // tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_SELECT_GIFT, this.sendQQH, this);

        this.menu = this.node.getChildByName("menu");

        this.make_share = this.node.getChildByName("make_share");
        this.submit_btn = this.make_share.getChildByName("submit_btn");
        this.plaintext = this.make_share.getChildByName("plaintext");
        this.ciphertext = this.make_share.getChildByName("ciphertext");
        this.show_share = this.node.getChildByName("show_share");
        this.share_img = this.show_share.getChildByName("share_img");
        this.show_share_loading = this.show_share.getChildByName("show_share_loading");
        this.show_data = {};
        this.share_tips = tywx.UIManager.getUI(els.ELS_GAME_LAYER.GAME_SINGLE).node.getChildByName("sl_bg").getChildByName("sl_tips");
        this.share_tips_img = tywx.UIManager.getUI(els.ELS_GAME_LAYER.GAME_SINGLE).node.getChildByName("sl_bg").getChildByName("sl_icon");

        this.show_share.getChildByName("reset_editing_btn").on("click", this.reset_editing_btn_click, this);
        this.show_share.getChildByName("back_home_btn").on("click", this.back_home_btn_click, this);
        this.plaintext.on("editing-did-began", this.editingDidBegan_plaintext, this);
        this.plaintext.on("editing-did-ended", this.editingDidEnded_plaintext, this);
        this.ciphertext.on("editing-did-began", this.editingDidBegan_ciphertext, this);
        this.ciphertext.on("editing-did-ended", this.editingDidEnded_ciphertext, this);
        this.text_tip_p = this.make_share.getChildByName("text_tip_plaint");
        this.text_tip_w = this.make_share.getChildByName("text_tip_whisper");
        this.whisper_tips.getChildByName("tips_btn").on("click", this.whisper_btn_click, this);
        this.whisper_tips.getChildByName("back_btn").on("click", this.whisper_back_btn_click, this);
    },


    start: function start() {
        this.game = tywx.UIManager.game;
        this.model = this.game.model;

        this.check_secret_language_data();

        this.playLogoAnimationRandom();

        //! 刷新声音状态
        this.model.checkPlayMusic();
        this.refreshSoundBtnState();
        //this.model.playMusic(els.ELS_VOICE.BG_MUSIC, true, 0.4);
        this.refreshStar();
    },

    editingDidBegan_plaintext: function editingDidBegan_plaintext(ret) {
        console.log(ret);
        this.text_tip_p.active = false;
    },

    editingDidEnded_plaintext: function editingDidEnded_plaintext(ret) {
        console.log(ret);
        var plaintext = this.plaintext.getComponent('cc.EditBox').string;
        if (plaintext.length === 0) {
            this.text_tip_p.active = true;
        } else {
            var ciphertext = this.ciphertext.getComponent('cc.EditBox').string;
            if (ciphertext.length === 0) {
                this.text_tip_w.active = true;
            }
        }
    },
    editingDidBegan_ciphertext: function editingDidBegan_ciphertext(ret) {
        this.text_tip_w.active = false;
    },

    editingDidEnded_ciphertext: function editingDidEnded_ciphertext(ret) {
        var ciphertext = this.ciphertext.getComponent('cc.EditBox').string;
        var plaintext = this.plaintext.getComponent('cc.EditBox').string;
        if (ciphertext.length == 0 && plaintext.length > 0) {
            this.text_tip_w.active = true;
        }
    },

    showMe: function showMe() {
        console.log('homepage showMe');
        this.nodeAdapterBgHome.active = true;
        this.nodeAdapterGame.active = false;
        this.whisper_win_single.active = false;
        this.refresh();
        if (this.model) {
            this.model.playMusic(els.ELS_VOICE.BG_MUSIC, true, 0.4);
        }
    },

    onEnable: function onEnable() {
        this.whisper_tips.active = false;
        this.text_tip_p.active = true;
        this.text_tip_w.active = false;
        this.plaintext.getComponent('cc.EditBox').string = "";
        this.ciphertext.getComponent('cc.EditBox').string = "";
    },


    hideMe: function hideMe() {},

    refresh: function refresh() {
        this.refreshDiamond();
        this.refreshSingleLevel();
        this.refreshStar();
        this.refreshEndlessScore();
    },
    refreshStar: function refreshStar() {
        //FIXME: 使用setTimeout,破坏的游戏的逻辑，因为，这个时候星星的资源还没加载进来
        //所以，创建星星失败了，这里需要处理下
        //加星
        var self = this;
        setTimeout(function () {
            var node = self.menu.getChildByName("starcontainer");
            var starNum = els.ELS_PLAYER_TITLE2[self.model.pkstar_level][0];
            tywx.StarControl.createStars(node, starNum, self.model.pkstar_level_get, 0);
            var bc = self.menu.getChildByName('starlevel');
            bc.getComponent('cc.Label').string = els.ELS_PLAYER_TITLE2[self.model.pkstar_level][1];
        }, 1000);
    },
    refreshDiamond: function refreshDiamond() {
        this.label_current_diamond.string = String(tywx.UserInfo.diamond);
    },
    refreshSingleLevel: function refreshSingleLevel() {
        var currentStage = parseInt(ElsUtils.loadItem('ELS_CURRENT_STAGE2', 0));
        this.label_current_level.string = "" + (currentStage + 1);
    },
    refreshEndlessScore: function refreshEndlessScore() {
        var endlessScore = parseInt(ElsUtils.loadItem('ELS_CURRENT_STAGE_ENDLESS', 0));
        this.labelEndlessScore.string = "\u5386\u53F2\u6700\u4F73:" + endlessScore;
    },


    /**
     * 对战
     * @param eve
     */
    onVsHandler: function onVsHandler(eve) {
        console.log("fengbing", "--------------- vs handle --------------");
        var tmp_current_stage = parseInt(this.game.loadItem('ELS_CURRENT_STAGE2', 0));
        if (tmp_current_stage < 5) {
            //if(true){    
            wx.showToast({
                title: '闯到5关后解锁',
                duration: 2000,
                icon: null
            });
            return;
        }
        tywx.UIManager.hideAllUI();
        tywx.UIManager.showUI(els.ELS_GAME_LAYER.GAME_SINGLE);
        this.game.fightAI_fun();
    },
    /**
     * 帮助
     * @param eve
     */
    onHelpHandler: function onHelpHandler(eve) {
        tywx.UIManager.showUI(els.ELS_GAME_LAYER.HELP);
    },
    /**
     * 看视频接口
     */
    onWatchVedioHandler: function onWatchVedioHandler() {
        tywx.AdManager.showVidelAd();
    },

    showUnlockUI: function showUnlockUI() {
        var self = this;
        cc.loader.loadRes('prefab/unlock', function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            preFabNode.getComponent("unlock").fromHome = true;
            preFabNode.parent = tywx.UIManager.getCurrentUI();
        });
    },
    showMall: function showMall() {
        var self = this;
        cc.loader.loadRes('prefab/mall/mall', function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            preFabNode.parent = tywx.UIManager.getCurrentUI();
        });
    },
    showSelectGift: function showSelectGift(showData) {
        var self = this;
        cc.loader.loadRes('prefab/select_gift', function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            preFabNode.getComponent("select_gift").init(showData);
            preFabNode.parent = tywx.UIManager.getCurrentUI();
        });
    },
    showAward: function showAward() {
        var self = this;
        cc.loader.loadRes('prefab/diamond_award/award', function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            preFabNode.parent = tywx.UIManager.getCurrentUI();
        });
    },
    showRank: function showRank() {
        var self = this;
        cc.loader.loadRes('prefab/els_rank', function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            preFabNode.parent = tywx.UIManager.getCurrentUI();
        });
    },


    /**
     * 休闲闯关
     * @param eve
     */
    onSingleHandler: function onSingleHandler(eve) {
        this.game.startClassicGame();
        tywx.UIManager.hideAllUI();
        tywx.UIManager.showUI(els.ELS_GAME_LAYER.GAME_SINGLE);
    },
    /**
     * 无尽模式
     */
    onEndlessHandler: function onEndlessHandler() {
        this.game.startEndlessGame();
        tywx.UIManager.hideAllUI();
        tywx.UIManager.showUI(els.ELS_GAME_LAYER.GAME_SINGLE);
    },
    /**
     * 排行榜
     * @param eve
     */
    onPmHandler: function onPmHandler(eve) {

        //! 临时定义，下个版本统一处理,暂时定义下，方便统计数据
        var self = this;
        tywx.ShareInterface.shareMsg({
            type: els.ELS_SHRAE_TYPE.HOMEPAGE_GROUP_RANK,
            successCallback: function successCallback(err) {
                console.log("share success ==> " + err);
                // tywx.UIManager.showUI(els.ELS_GAME_LAYER.RANK);
                self.showRank();
                ElsProfile.getInstance().setShareTimeStamp();
            },
            failCallback: function failCallback(err) {
                console.log("share fialed ==> " + err);
            }
        });
    },

    /**
     * 分享
     * @param eve
     */
    onShareHandler: function onShareHandler(eve) {
        tywx.ShareInterface.shareMsg({
            type: els.ELS_SHRAE_TYPE.HOMEPAGE
        });
    },

    editBoxTextDidEnd: function editBoxTextDidEnd(event) {
        console.log(event);
        var text = event.string;
        var reg = new RegExp("^[\\u4E00-\\u9FFF]+$", "g");
        if (!reg.test(text)) {
            wx.showToast({
                title: '请输入中文',
                duration: 2000,
                icon: null
            });
            event.getComponent('cc.EditBox').string = "";
            return;
        }
        if (text.length > 6) {
            text = text.slice(0, 6);
        }
        event.getComponent('cc.EditBox').string = text;
    },

    // 生成悄悄话
    create_btn_click: function create_btn_click(event) {
        console.log('create_btn_click');
        // 悄悄话生成界面
        // this.make_share.active = true;
        var self = this;
        if (!els.CONFIG.qiaoqiao) {
            els.CONFIG.qiaoqiao = ["浪漫七夕", "心相系爱相随", "情浓一生", "么么哒谢谢你", "对不起亲爱的", "老地方见", "爱你朝朝暮暮"];
        }
        this.whisper_optional_nodes.forEach(function (item, i) {
            if (i < els.CONFIG.qiaoqiao.length) {
                item.getChildByName("New Label").getComponent("cc.Label").string = els.CONFIG.qiaoqiao[i];
            } else {
                item.active = false;
            }
        });
        this.showSelectGift();
    },

    option_node_click: function option_node_click(_, data) {
        console.log("chenxi:: option_node_click:: ", data);
        if (!els.CONFIG.qiaoqiao) {
            els.CONFIG.qiaoqiao = ["浪漫七夕", "心相系爱相随", "情浓一生", "么么哒谢谢你", "对不起亲爱的", "老地方见", "爱你朝朝暮暮"];
        }
        this.ciphertext.getComponent('cc.EditBox').string = els.CONFIG.qiaoqiao[data];
    },

    // 提交悄悄话
    submit_btn_click: function submit_btn_click(event) {
        console.log('submit_btn_click');

        var reg = new RegExp("^[\\u4E00-\\u9FFF]+$", "g");
        var plaintext = this.plaintext.getComponent('cc.EditBox').string;
        var ciphertext = this.ciphertext.getComponent('cc.EditBox').string;

        if (!reg.test(plaintext) || plaintext.length > 6 || plaintext.length < 2) {
            wx.showToast({
                title: '至少2个汉字',
                duration: 2000,
                icon: null
            });
            return;
        }

        var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        if (!reg.test(ciphertext) || ciphertext.length > 6 || ciphertext.length < 2) {
            wx.showToast({
                title: '至少2个汉字',
                duration: 2000,
                icon: null
            });
            return;
        }
        if (!tywx.StateInfo.networkConnected) {
            wx.showToast({
                title: '网络异常..',
                duration: 1000
            });
            return;
        }

        tywx.SecretLanguage.get_wxtetris_makeimage(plaintext, ciphertext, 'send');
        this.make_share.active = !this.make_share.active;
        this.show_share.active = true;
    },
    // 展示悄悄话图片
    show_btn_click: function show_btn_click(event) {
        console.log(this.show_data);
        // TODO: 发布悄悄话
        console.log("show_btn_click");
        this.share_whisper_data(this.show_data);
    },

    share_whisper_data: function share_whisper_data(showData) {
        var _imageUrl = showData['imgUrl'];
        var inviteName = tywx.UserInfo.userName;
        var avatarUrl = tywx.UserInfo.userPic;
        var openId = tywx.UserInfo.openId;
        if (!openId) {
            wx.showToast({
                title: '请先登录~',
                duration: 1000
            });
            tywx.TuyooSDK.login();
            return;
        }
        var plaintext = showData["plainText"];
        var ciphertext = showData["cipherText"];
        var _uuid = tywx.Util.createUUID();
        var _query = "inviteCode=" + tywx.UserInfo.userId + "&openId=" + openId + "&sourceCode=" + els.ELS_SHRAE_TYPE.GAME_QQH_MAKE + "&plaintext=" + plaintext + "&ciphertext=" + ciphertext + "&inviteName=" + inviteName + "&avatarUrl=" + avatarUrl + "&randomKey=" + _uuid;
        console.log("share::uuid::", _uuid);
        if (tywx.UserInfo.select_gift_item) {
            tywx.UserInfo.select_gift_item.uuid = _uuid;
        }
        var _item = tywx.UserInfo.select_gift_item ? tywx.UserInfo.select_gift_item.content.items[0].itemId.substr(-4) : "";
        var _amount = 1;

        var self = this;
        tywx.ShareInterface.shareMsg({
            type: els.ELS_SHRAE_TYPE.GAME_QQH_MAKE,
            imageUrl: _imageUrl,
            query: _query,
            successCallback: function successCallback(_) {
                // TODO: 分享成功 
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeSendQQH);

                if (!tywx.UserInfo.select_gift_item || tywx.TCPClient.connectStatus != tywx.TCPClient.CONNECT_STATUS_OK) {
                    // self.back_btn_click();
                    self.make_share.active = false;
                    self.show_share.active = false;
                    return;
                }
                tywx.MSG.whisperStart(_uuid, _item, _amount);
                tywx.UserInfo.select_gift_item = undefined;
                // self.back_btn_click();
                self.make_share.active = false;
                self.show_share.active = false;
            },
            failCallback: function failCallback() {
                console.log("分享失败");
                wx.showToast({
                    title: '分享失败啦',
                    duration: 1000
                });
            }
        });
    },


    //秘语进入
    secret_language_to_game: function secret_language_to_game(ret) {
        tywx.SECRETLANGUAGEDATA = ret;
        this.check_secret_language_data();
    },

    // TODO: 选中道具:发送悄悄话
    sendQQH: function sendQQH(itemId) {},


    check_secret_language_data: function check_secret_language_data() {
        var query = tywx.SECRETLANGUAGEDATA;

        if (!query) {
            return;
        }
        query["curIndex"] = 0;
        var _query_key = "SECRETLANGUAGEDATA";
        // this.game.delItem(_query_key);
        var querys_str = this.game.loadItem(_query_key, "");
        var inLoc = false;
        var querys;
        if (querys_str) {
            querys = JSON.parse(querys_str);
            for (var i = 0; i < querys.length; i++) {
                var _tq = querys[i];
                if (_tq["randomKey"] == query["randomKey"]) {
                    query = _tq;
                    inLoc = true;
                }
            }
        }
        if (!querys) {
            querys = new Array();
        }

        if (!inLoc) {
            querys.push(query);
            this.game.saveItem(_query_key, JSON.stringify(querys), true);
        }

        this._query = query;
        // tywx.SECRETLANGUAGEDATA = null;
        console.log(JSON.stringify(tywx.SECRETLANGUAGEDATA));

        var plaintext = query.plaintext;
        var ciphertext = query.ciphertext;
        tywx.SecretLanguage.get_wxtetris_makeimage(plaintext, ciphertext, 'get');
    },

    handle_whisper_data: function handle_whisper_data(ret) {
        this.show_share_loading.active = false;
        var gleNode = tywx.UIManager.getUI(els.ELS_GAME_LAYER.GAME_SINGLE);
        gleNode.node.getChildByName('sl_bg').active = true;

        var _query = this._query;
        this.game.win_content = ret.plainText + "\n" + ret.cipherText;
        this.game.win_contetn_avatarUrl = this._query.avatarUrl;

        var plainData = ret['plainData'];
        var cipherData = ret['cipherData'];

        var _s = ret.plainText;
        gleNode.node.getChildByName('sl_bg').getChildByName('sl_content').getChildByName("data_p").getComponent("cc.Label").string = _s;
        var _s0, _s1, _s2, _ss, _st;
        if (ret.cipherText.length <= 3) {
            _s0 = ret.cipherText;
            if (_s0.length == 1) _s = _s0;
            if (_s0.length == 2) _s = _s0[0] + '  ' + _s0[1];
            if (_s0.length == 3) _s = _s0[0] + '  ' + _s0[1] + '  ' + _s0[2];
        } else {
            _s1 = ret.cipherText.slice(0, 3);
            if (_s1.length == 1) _ss = _s1;
            if (_s1.length == 2) _ss = _s1[0] + '  ' + _s1[1];
            if (_s1.length == 3) _ss = _s1[0] + '  ' + _s1[1] + '  ' + _s1[2];
            _s2 = ret.cipherText.slice(3);
            if (_s2.length == 1) _st = _s2;
            if (_s2.length == 2) _st = _s2[0] + '  ' + _s2[1];
            if (_s2.length == 3) _st = _s2[0] + '  ' + _s2[1] + '  ' + _s2[2];
            _s = _ss + '\n' + _st;
        }
        gleNode.node.getChildByName('sl_bg').getChildByName('sl_content').getChildByName("data").getComponent("cc.Label").string = _s;

        var that = this;
        this.share_tips_img.active = true;
        this.share_tips.getComponent('cc.Label').string = "";

        this.game.btn_secret_language(cipherData, _query.curIndex, _query["randomKey"]);
        var openId = this._query.openId;
        cc.loader.loadRes('prefab/OpenData', function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            preFabNode.parent = tywx.UIManager.getCurrentUI();
            tywx.UIManager.getCurrentUI().openData = preFabNode;
            preFabNode.getComponent("OpenData").showQQHIn(openId, cc.v2(-111, 510), cc.size(64, 64), 0, 24);
        });
        this._query = null;
    },

    get_image_success: function get_image_success(ret) {
        this.show_data = ret;
        if (ret.type == 'get') {
            if (ret.cipherData.length <= this._query.curIndex) {
                this.whisper_win_single.getComponent("whisper_win_single").showWithData({
                    data: ret.plainText + "\n" + ret.cipherText,
                    openId: this._query.openId
                });
                return;
            } else {
                this.whisper_tips_content.getComponent("cc.Label").string = "";
                var self = this;
                this.whisper_tips.active = true;
                if (this.whisper_tips.openData) {
                    this.whisper_tips.openData.getComponent("OpenData").showQQHIn(self._query.openId, cc.v2(-141.6, 218), cc.size(70, 70), 0, 32);
                } else {
                    cc.loader.loadRes('prefab/OpenData', function (err, prefab) {
                        var preFabNode = cc.instantiate(prefab);
                        preFabNode.parent = self.whisper_tips;
                        self.whisper_tips.openData = preFabNode;
                        preFabNode.getComponent("OpenData").showQQHIn(self._query.openId, cc.v2(-141.6, 218), cc.size(70, 70), 0, 32);
                    });
                }
            }
            return;
        }

        var _s = ret.plainText;
        this.show_share.getChildByName("sl_content").getChildByName("data1").getComponent("cc.Label").string = _s;
        var _s = ret.cipherText.length <= 3 ? ret.cipherText : ret.cipherText.slice(0, 3) + "\n" + ret.cipherText.slice(3);
        this.show_share.getChildByName("sl_content").getChildByName("data").getComponent("cc.Label").string = _s;

        this._drawWithData(ret, this.show_share.getChildByName("sl_content"));
    },

    back_btn_1_click: function back_btn_1_click() {
        this.make_share.active = false;
        this.onEnable();
    },

    back_btn_2_click: function back_btn_2_click() {
        this.show_share.active = false;
        this.onEnable();
    },
    // 重新编辑
    reset_editing_btn_click: function reset_editing_btn_click() {
        this.show_share.active = false;
        this.make_share.active = true;
    },
    // 回到主页
    back_home_btn_click: function back_home_btn_click() {
        this.show_share.active = false;
    },
    // 悄悄话 提示界面按钮点击
    whisper_btn_click: function whisper_btn_click() {
        this.whisper_tips.active = false;
        this.handle_whisper_data(this.show_data);
    },

    whisper_back_btn_click: function whisper_back_btn_click() {
        this.whisper_tips.active = false;
    },

    _drawWithData: function _drawWithData(data, _node) {
        // _node.removeAllChildren();
        this.show_share.getChildByName("show_share_bg").removeAllChildren();
        var plainData = data['plainData'];
        var cipherData = data['cipherData'];

        for (var n = 0; n < 6; n++) {
            var data = cipherData.length > n ? cipherData[n] : undefined;
            this._draw_one_data(data, n);
            if (!data) {
                continue;
            }
        }
    },

    _draw_one_data: function _draw_one_data(data, i) {
        var dx = -this.node.width / 2 + 20;
        var dy = 437;
        var _w = 215;
        var _h = 316;
        var _offset_x = (this.node.width - _w * 3) / 4;
        var _offset_y = 12;
        var _x = dx + i % 3 * _offset_x + i % 3 * _w;
        var _y = dy - (i >= 3 ? 1 : 0) * (_h + _offset_y);
        var _node = cc.instantiate(this.label_content);
        _node.position = cc.v2(_x, _y);
        _node.parent = this.show_share.getChildByName("show_share_bg");

        var length = 11;
        var _toffset = 1;
        var _tw = (_w - (length + 1) * _toffset) / 11;
        var _tdy = -_h + _w;

        if (!data) {
            return;
        }
        var s_x = 0;
        for (var i = 0, il = data.length; i < il; i++) {
            var c_id = 1 + parseInt(parseInt(Math.random() * 10000) % 10);
            var sf = this.game.gameNode.getComponent("main").blockimgs[c_id];
            for (var j = 0, jl = data[i].length; j < jl; j++) {
                if (data[i][j]) {
                    var c = cc.instantiate(this.game.gameNode.getComponent("main").prefabblock);
                    c.getComponent("cc.Sprite").spriteFrame = sf;
                    c.scale = _tw / 72;
                    var _tx = _toffset + (j + 0.5) * (_tw + _toffset);
                    var _ty = _tdy - _toffset - (i + 0.5) * (_toffset + _tw);
                    c.position = cc.v2(_tx, _ty);
                    c.parent = _node;
                }
            }
        }
    },

    // update (dt) {},

    /**
     * * 函数描述
     * 随机播放logo动画
     * @author lu ning
     * @date 17:07 2018/6/28
     * @return {void} 返回值描述
     */
    playLogoAnimationRandom: function playLogoAnimationRandom() {
        console.log('playLogoAnimationRandom');
        var self = this;
        this.animLogo.on('finished', function (param) {
            var delay = Math.random() * 20000 + 10000;
            console.log("LogoAnimationEnd params = " + param + "," + delay);
            setTimeout(function () {
                self.animLogo.play('logo');
            }, delay);
        }, this);

        this.animLogo.play('logo');
    },

    /**
     * * 函数描述
     * 音乐按钮点击回调
     * @author lu ning
     * @date 18:20 2018/6/28
     * @return {void} 返回值描述
     */
    onBtnMusicClickCallback: function onBtnMusicClickCallback() {
        console.log('onBtnMusicClickCallback');
        ElsProfile.getInstance().switchMusicMute();
        this.model.playMusic(els.ELS_VOICE.BG_MUSIC, true, 0.4);
        this.refreshSoundBtnState();
    },
    refreshSoundBtnState: function refreshSoundBtnState() {
        //! refresh button display.
        this.spriteBtnSoundDisplay.spriteFrame = ElsProfile.getInstance().getIsMusicMute() ? this.spriteFrameSoundDisable : this.spriteFrameSoundEnable;
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=homePage.js.map
        