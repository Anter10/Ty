"use strict";
cc._RF.push(module, '40f06+P+vtNEpBScY06wfar', 'lottery_get_view');
// scripts/game/lottery/lottery_get_view.js

"use strict";

var lotery_get_view_path = "prefabs/lottery_get_view";
var LOCAL_STOREITEM_KEY = "tt-items";

var lottery_get_view = cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        icon: cc.Sprite,
        mfjbBtnNode: cc.Node
    },

    close: function close() {
        lottery_get_view.get_view_node.removeFromParent(true);
        lottery_get_view.get_view_node = null;
    },

    // 加倍领取奖励
    addDoubleJL: function addDoubleJL() {
        var self = this;
        tywx.tt.log("加倍奖励哦" + JSON.stringify(this.data));
        if (this.data.gift_id == 2 || this.data.gift_id == 4 || this.data.gift_id == 6) {
            var items = JSON.parse(tywx.tt.Utils.loadItem(LOCAL_STOREITEM_KEY, "[]"));
            var allitems = [];
            if (items.length > 0) {
                var findit = false;
                for (var itIndex = 0; itIndex < items.length; itIndex++) {
                    var item = items[itIndex];
                    if (item.id == this.data.gift_id) {
                        findit = true;
                        item.num = item.num + 1;
                    }
                    allitems.push(item);
                }
                if (!findit) {
                    var _titem = this.getAddItem();
                    allitems[allitems.length] = _titem;
                }
            } else {
                var titem = this.getAddItem();
                allitems[0] = titem;
            }
            tywx.tt.Utils.saveItem(LOCAL_STOREITEM_KEY, JSON.stringify(allitems), false);
            this.close();
            console.log("关闭了 close 吗");
        } else {
            tywx.tt.Utils.requestAddRedPacket({
                success: function success(res) {
                    self.close();
                    tywx.tt.Utils.showWXToast("恭喜获得");
                },
                fail: function fail() {
                    self.close();
                    tywx.tt.Utils.showWXToast("请求失败");
                }
            });
        }
    },

    getAddItem: function getAddItem() {
        var titem = {};
        titem.id = this.data.gift_id;
        titem.num = this.data.number || 1;
        titem.name = this.data.name;
        titem.icon = this.data.icon;
        return titem;
    },

    onLoad: function onLoad() {
        var self = this;
        // 视频抽奖
        var videoBtnScript = this.mfjbBtnNode.getComponent("ShareButton");
        var share_control = tywx.tt.configManager.share_control.recovergame;
        var calltype = tywx.tt.Utils.shareVideoCtr(share_control);
        console.log("calltype = " + calltype);
        videoBtnScript.setButtonCallType(calltype);
        var config = calltype == 1 ? tywx.tt.constants.ShareConfig.ZPADDDOUBLE_SHARE : tywx.tt.constants.ShareConfig.ZPADDDOUBLE_VIDEO;
        videoBtnScript.setShareConfig(config);
        videoBtnScript.setSuccessCall(function () {
            self.addDoubleJL();
        });
    },
    start: function start() {},


    setData: function setData(data) {
        this.data = data;
        tywx.tt.log("this = data = " + JSON.stringify(this.data));
        this.flushNameLabel();
        this.flushIconLabel();
    },

    flushNameLabel: function flushNameLabel() {
        this.nameLabel.string = this.data.name;
    },

    flushIconLabel: function flushIconLabel() {
        var self = this;
        cc.loader.load('https://elsfkws.nalrer.cn/teris/lottery/' + this.data.icon, function (err, texture) {
            if (!err) {
                var new_sprite_frame = new cc.SpriteFrame(texture);
                self.icon.spriteFrame = new_sprite_frame;
                self.icon.node.setContentSize(cc.size(90, 90));
            } else {}
        });
    },

    statics: {
        get_view_node: null,
        show: function show(tdata) {
            var data = tdata;
            cc.loader.loadRes(lotery_get_view_path, function (err, prefab) {
                if (!err) {
                    var getlotterynode = cc.instantiate(prefab);
                    var ads_script = getlotterynode.getComponent('lottery_get_view');
                    getlotterynode.x = 360;
                    getlotterynode.y = 640;
                    ads_script.setData(data);
                    lottery_get_view.get_view_node = getlotterynode;
                    cc.director.getScene().addChild(getlotterynode);
                }
            });
        }

        // update (dt) {},
    } });

module.exports = lottery_get_view;

cc._RF.pop();