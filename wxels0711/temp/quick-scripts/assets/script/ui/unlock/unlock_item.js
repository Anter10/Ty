(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/unlock/unlock_item.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f8d0cm1CtZEo7psvrQfk7fj', 'unlock_item', __filename);
// script/ui/unlock/unlock_item.js

'use strict';

var els = require("../../core/els.js");

cc.Class({
    extends: cc.Component,

    properties: {
        product_icon: cc.Node,

        user_icon_l: cc.Node,
        user_name_l: cc.Label,

        user_icon_r: cc.Node,
        user_name_r: cc.Label,

        button_title: cc.Label,

        button_nodes: [cc.Node] // 0 : 已经领取 1: 可领取 2: 分享
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.user_name_l.string = '';
        this.user_name_r.string = '';
    },
    init: function init(_data, _i) {
        this._index = _i;
        this.button_state = 2;
        if (_data) {
            this._itemId = _data["itemId"];
            if (parseInt(_data["getDianmond"]) === 1) {
                // 可以领取
                this.button_state = 1;
            } else {
                // 已经领取完毕
                this.button_state = 0;
            }
            var _users = _data["users"];
            if (_users.length < 2) {
                this.button_state = 2;
            }
            var self = this;
            _users.forEach(function (_user, i) {
                var _icon = i === 0 ? self.user_icon_l : self.user_icon_r;
                var _name = i === 0 ? self.user_name_l : self.user_name_r;
                self.setUserInfo(_user, _icon, _name);
            });
        }
        this.update_button();
    },
    update_button: function update_button() {
        console.log("update_button", this.button_state);
        var self = this;
        this.button_nodes.forEach(function (_node, i) {
            _node.active = false;
            if (i === parseInt(self.button_state)) {
                _node.active = true;
            }
        });
    },
    setUserInfo: function setUserInfo(_user, _icon, _name) {
        _name.active = true;
        _name.string = _user.name;
        var _imageUrl = _user.purl;
        if (_imageUrl.indexOf("https://wx.qlogo.cn") !== -1) {
            _imageUrl = _imageUrl + "?aaa=aaa.png";
        } else {
            _imageUrl = "image/prop_icons/invited_icon.png";
            _name.string = "已邀请";
        }
        this.setImage(_icon, _imageUrl);
    },
    setImage: function setImage(_node, _imageUrl) {
        if (-1 !== _imageUrl.indexOf("https://wx.qlogo.cn")) {
            cc.loader.load(_imageUrl, function (err, texture) {
                err || (_node.getComponent("cc.Sprite").spriteFrame = new cc.SpriteFrame(texture));
            });
        } else {
            cc.loader.loadRes(_imageUrl, cc.SpriteFrame, function (err, spriteFrame) {
                if (!err) {
                    _node.getComponent('cc.Sprite').spriteFrame = spriteFrame;
                } else {
                    console.log('loadResError', err);
                }
            });
        }
    },
    button_click: function button_click() {
        var self = this;
        switch (this.button_state) {
            case 0:
                // 已经领取
                {
                    break;
                }
            case 1:
                // 可领取
                {
                    tywx.MSG.addItems(7, self._index);
                    break;
                }
            case 2:
                // 分享
                {
                    tywx.ShareInterface.shareMsg({
                        type: els.ELS_SHRAE_TYPE.UNLOCK_GIFT_PROP
                    });
                    break;
                }
            default:
                {}
        }
    }
}

// update (dt) {},
);

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
        //# sourceMappingURL=unlock_item.js.map
        