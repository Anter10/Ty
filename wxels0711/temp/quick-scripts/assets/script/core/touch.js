(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/core/touch.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '368d3x2jRxNqYVo5ISmma5b', 'touch', __filename);
// script/core/touch.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var nge = require("./engine.js");
var els = require("./els.js");
var Class = nge.Class;
var ElsTouch = nge.Model.extend({
    ctor: function ctor(game) {
        this.game = game;
        //手触摸屏幕的第一个触摸位置,在touchBegan时赋值
        //用于判断是否为点击（旋转）动作
        this._firstTouchPoint = { x: 0, y: 0 };
        //手触摸屏幕的上一个触摸位置
        //touchBegan时赋值，touchMove时更新,用于计算dx,dy
        this._lastTouchPoint = { x: 0, y: 0 };
        //上一次更新drag数值的位置
        this._lastPointDrag = { x: 0, y: 0 };
        this._isNeedDrop = false;
        this._isNeedHold = false;
        //控制产生左右移动数量
        this._maxRLAct = 0;
        //控制产生向下移动数量
        this._maxDAct = 0;
        this._firstTouchTime = 0;
        this._lastMoveTime = 0; //用于计算滑动中连续两个点的间隔时间
        this._moveDX = 0; //一次触摸抬起之前，手指移动的x方向最大距离
        this._moveDY = 0; //一次触摸抬起之前，手指移动的y方向最大距离
        this._idenSizeX = 0; //识别动作阈值
        this._idenSizeY = 0; //识别动作阈值
        this._idenSizeDrop = 0;

        this._btn_scope = {
            'btn_fightAI': cc.rect(300, 640, 320, 110), //对战
            'btn_classic': cc.rect(300, 500, 320, 110), //经典
            'btn_pause': cc.rect(15, 1220, 45, 45), //暂停
            'btn_help': cc.rect(430, 190, 70, 70), //帮助
            'btn_rank': cc.rect(620, 190, 70, 70), //排行
            'btn_share': cc.rect(520, 190, 70, 70), //主页分享
            'btn_continue': cc.rect(180, 700, 370, 140), //继续
            'btn_back_pause': cc.rect(180, 550, 370, 140), //暂停返回主页
            'btn_reStart': cc.rect(180, 500, 360, 150), //重新开始
            'btn_back_lose': cc.rect(280, 450, 160, 100), //失败:返回主页
            'btn_nextStage': cc.rect(300, 440, 210, 120), //下一关
            'btn_ShareFlaunt': cc.rect(180, 520, 340, 100), //分享炫耀
            'btn_back_win': cc.rect(280, 470, 160, 60), //返回主页
            'btn_help_back': cc.rect(570, 915, 60, 60), //帮助关闭
            'btn_emergencyShare': cc.rect(600, 1020, 100, 121), //减5行
            'btn_emergencyShareS': cc.rect(600, 800, 100, 121), //加5步
            'btn_keepstar_share': cc.rect(210, 530, 300, 100), //失败保护: 分享到群
            'btn_keepstar_cancel': cc.rect(290, 420, 180, 90), //失败保护: 取消
            'btn_rank_close': cc.rect(565, 1018, 50, 50),
            'btn_rank_challenge': cc.rect(93, 990, 257, 85),
            'btn_rank_classic': cc.rect(350, 990, 257, 85)
        };
    },

    triggerPutUserAction: function triggerPutUserAction(a) {
        //console.log("PUTACT...."+a);
        this.game.useract[this.game.useract.length] = a;
    },

    began: function began(x, y) {
        return this._beganGesture(x, y);
    },

    moved: function moved(x, y) {
        this._movedGesture(x, y);
    },

    ended: function ended(x, y) {
        this._endedGesture(x, y);
    },

    _setTouchKeyThreshold: function _setTouchKeyThreshold(dx, dt) {
        this._idenSizeX = 48;
        this._idenSizeY = 40;
        this._idenSizeDrop = 35;
    },

    _beganGesture: function _beganGesture(x, y) {
        var now = new Date().getTime();
        this._lastMoveTime = now;
        this._firstTouchTime = now;
        this._firstTouchPoint.x = x;
        this._firstTouchPoint.y = y;
        this._lastTouchPoint.x = x;
        this._lastTouchPoint.y = y;
        this._lastPointDrag.x = x;
        this._lastPointDrag.y = y;
        this._isNeedDrop = false;
        this._isNeedHold = false;
        this._moveDX = 0;
        this._moveDY = 0;
        this._maxRLAct = this.game.model.mgrid[0].mcore.cur_x - 5;
        return true;
    },

    _movedGesture: function _movedGesture(x, y) {
        var currenttime = new Date().getTime();

        //旋转触摸条件
        if (Math.abs(this._firstTouchPoint.x - x) > this._moveDX) this._moveDX = Math.abs(this._firstTouchPoint.x - x);
        if (Math.abs(this._firstTouchPoint.y - y) > this._moveDY) this._moveDY = Math.abs(this._firstTouchPoint.y - y);

        //计算dx，dy，dx_drag, dy_drag
        var dx = x - this._lastTouchPoint.x;
        var dy = y - this._lastTouchPoint.y;
        this._lastTouchPoint.x = x;
        this._lastTouchPoint.y = y;
        var dx_drag = x - this._lastPointDrag.x;
        var dy_drag = y - this._lastPointDrag.y;

        var dt = currenttime - this._lastMoveTime;
        this._setTouchKeyThreshold(dx, dt);

        if (dx == 0 && dy == 0) return;

        //console.log("TOUCHMOVE...dx="+dx+" dy="+dy+" dxdrag="+dx_drag+" dydrag="+dy_drag);

        //下扫直落
        if (dy < -this._idenSizeDrop) {
            if (dx <= this._idenSizeX * 0.6 && dx >= -this._idenSizeX * 0.6) this._isNeedDrop = true;
        }

        //上扫暂存
        if (dy > this._idenSizeDrop) {
            if (dx <= this._idenSizeX * 1.1 && dx >= -this._idenSizeX * 1.1) this._isNeedHold = true;
            this._lastPointDrag.y = y;
        }

        //左右拖动
        if (dy >= -this._idenSizeDrop && dy <= this._idenSizeDrop) {
            var horizontalMove = false;
            if (dy >= 0) horizontalMove = true;else if (Math.abs(dx) / Math.abs(dy) > 1.0) horizontalMove = true;else this._lastPointDrag.x = x;

            //右移动作
            if (dx_drag > this._idenSizeX && horizontalMove) {
                var actCount = parseInt(dx_drag / this._idenSizeX);

                for (var i = 0; i < actCount; i++) {
                    if (this._maxRLAct <= 5) {
                        this.triggerPutUserAction('R');
                        this._maxRLAct++;
                    }
                }
                this._lastPointDrag.x += this._idenSizeX * actCount;
                this._lastPointDrag.y = y;

                this._isNeedDrop = false;
                this._isNeedHold = false;
            }
            //左移动作
            if (dx_drag < -this._idenSizeX && horizontalMove) {
                var actCount = parseInt(Math.abs(dx_drag) / this._idenSizeX);
                for (var i = 0; i < actCount; i++) {
                    if (this._maxRLAct >= -5) {
                        this.triggerPutUserAction('L');
                        this._maxRLAct--;
                    }
                }
                this._lastPointDrag.x -= this._idenSizeX * actCount;
                this._lastPointDrag.y = y;

                this._isNeedDrop = false;
                this._isNeedHold = false;
            }

            //下移动作
            if (dy_drag < -this._idenSizeY) {
                var actCount = parseInt(Math.abs(dy_drag) / this._idenSizeY);
                for (var i = 0; i < actCount; i++) {
                    if (this._maxDAct <= 20) {
                        this.triggerPutUserAction('D');
                        this._maxDAct++;
                    }
                }
                this._lastPointDrag.x = x;
                this._lastPointDrag.y -= this._idenSizeY * actCount;
            }
        }

        this._lastMoveTime = currenttime;
    },

    _endedGesture: function _endedGesture(x, y) {

        if (!this._checkTriggerBtnClick(x, y)) {
            if (this._isNeedDrop) {
                this.triggerPutUserAction('W');
                this._isNeedDrop = false;
            }
            if (this._isNeedHold) {
                this.triggerPutUserAction('S');
                this._isNeedHold = false;
            }
            //旋转动作检测
            if (this._moveDX <= 25.0 && this._moveDY <= 25.0) {
                this.triggerPutUserAction('T');
            }
        }
    },

    _checkTriggerBtnClick: function _checkTriggerBtnClick(_x, _y) {
        //return this.game.checkTriggerBtnClick(this._btn_scope,  new cc.Vec2(_x, _y));
        return false; //永久不成立
    }
});
(function (window, factory) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.ElsTouch = factory();
    }
})(undefined, function () {
    return ElsTouch;
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
        //# sourceMappingURL=touch.js.map
        