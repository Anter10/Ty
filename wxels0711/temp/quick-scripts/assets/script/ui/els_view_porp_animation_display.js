(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/els_view_porp_animation_display.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fbf6f/CG+FN26HBfPqSCl/K', 'els_view_porp_animation_display', __filename);
// script/ui/els_view_porp_animation_display.js

"use strict";

var ELSEvent = require('../core/ElsEvents.js');
var prop_map = new Map([[1301, 0], [1302, 3], [1303, 2], [1304, 1], [1305, 4], [1306, 5], [1307, 6]]);
cc.Class({
    extends: cc.Component,

    properties: {
        animationNodes: [cc.Node],
        nodeMoTai: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_CLEARN_GIFT_PROP_ANIMATION, this.clearnSelf, this);
    },
    onDestroy: function onDestroy() {
        tywx.NotificationCenter.ignoreScope(this);
    },
    clearnSelf: function clearnSelf() {
        this.node.destroyAllChildren();
        this.node.removeAllChildren();
        this.node.destroy();
    },


    /**
     * 
     * @param {Number} prop_id 道具ID,服务器道具id
     * @param {Number} type 类型0:展示，1:预览
     */
    init: function init(prop_id, type) {
        var _this = this;
        this.hideAllAnimationNode();
        var scale = 0;
        var pos = cc.p(0, 0);
        var is_show_motai = false;
        var is_loop = false;
        var end_cb = null;
        if (2 === type) {
            scale = 1;
            pos = cc.p(0, 0);
            is_show_motai = true;
            is_loop = false;
            // end_cb = function end_cb() {
            //   _this.node.destroy();
            // };/Users/daichenxi/msvn/wx-els-check/branch/branch-prop-20180711/assets/script/ui/els_view_porp_animation_display.js
        } else if (1 === type) {
            scale = .5;
            pos = cc.p(0, -220);
            is_show_motai = false;
            is_loop = true;
            end_cb = null;
        } else if (0 === type) {
            scale = 1;
            pos = cc.p(0, 0);
            is_show_motai = false;
            is_loop = false;
            end_cb = function end_cb() {
                _this.node.destroy();
            };
        }
        var tmp_idx = prop_map.get(prop_id);
        this.animationNodes[tmp_idx].scale = scale;
        this.animationNodes[tmp_idx].position = pos;
        this.nodeMoTai.active = is_show_motai;
        this.animationNodes[tmp_idx].active = true;
        var tmp_animation = this.animationNodes[tmp_idx].getComponent(cc.Animation);
        tmp_animation.on("finished", function (num, string) {
            console.log("show gift box finished", num, string);
            end_cb && end_cb();
        }, this);
        var tmp_ani_state = tmp_animation.play();
        tmp_ani_state.wrapMode = is_loop ? cc.WrapMode.Loop : cc.WrapMode.Normal;
    },
    motaiCallback: function motaiCallback() {
        this.node.destroy();
        tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_CLEARN_GIFT);
    },
    hideAllAnimationNode: function hideAllAnimationNode() {
        this.animationNodes.forEach(function (e) {
            e.active = false;
        });
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
        //# sourceMappingURL=els_view_porp_animation_display.js.map
        