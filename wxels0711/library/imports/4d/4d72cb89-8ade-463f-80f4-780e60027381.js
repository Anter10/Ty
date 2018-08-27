"use strict";
cc._RF.push(module, '4d72cuJit5GP4D0eA5gAnOB', 'engine');
// script/core/engine.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function object(o) {
    function W() {}
    W.prototype = o;
    return new W();
}
function inheritPrototype(SubType, SuperType) {
    var prototype;
    if (typeof Object.create === 'function') {
        prototype = Object.create(SuperType.prototype);
    } else {
        prototype = object.create(SuperType.prototype);
    }
    prototype.constructor = SubType;
    SubType.prototype = prototype;
}

var inherit = function inherit(superCtor, prop) {
    return function () {
        var fnTest = /xyz/.test(function () {
            xyz;
        }) ? /\b_super\b/ : /.*/;

        var _super = superCtor.prototype;
        //// The base Class implementation (does nothing)
        function baseClass() {
            if (typeof baseClass.prototype.ctor === "undefined") {} else {
                var args = new Array();
                for (var k in arguments) {
                    args.push(arguments[k]);
                }
                baseClass.prototype.ctor.apply(this, args);
            }
        };
        inheritPrototype(baseClass, superCtor);
        var prototype = baseClass.prototype;
        if (typeof _super === "undefined") {} else {
            if (typeof _super["ctor"] === "undefined") {
                _super["ctor"] = superCtor;
            }
        }
        baseClass.extend = function (prop) {
            return inherit(baseClass, prop);
        };
        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? function (name, fn) {
                return function () {
                    var tmp = this._super;
                    this._super = _super[name];
                    var args = new Array();
                    for (var k in arguments) {
                        args.push(arguments[k]);
                    }
                    var ret = fn.apply(this, args);
                    this._super = tmp;
                    return ret;
                };
            }(name, prop[name]) : prop[name];
        }
        return baseClass;
    }();
};
var Class = inherit(function () {}, {});

//Node Game Engine, by zipxing...
var ngeImp = function ngeImp() {
    //   var _Canvas = canvas;
    //   var _Context = canvas.getContext('2d')
    //console.log("NGE..."+_Context+".."+_Canvas);

    var _Point = Class.extend({
        ctor: function ctor(x, y) {
            this.x = x;
            this.y = y;
        }
    });

    var _Model = Class.extend({
        ctor: function ctor() {}
    });

    var _Render = Class.extend({
        ctor: function ctor() {},
        draw: function draw() {
            //console.log("Must implement!");
        }
    });

    var _Timer = Class.extend({
        ctor: function ctor() {
            this.timers = {};
        },
        setup: function setup(name, time, cancel_cb) {
            this.timers[name] = {
                "time_init": Math.ceil(time * nge.framehz),
                "time": 0,
                "cancel_cb": cancel_cb,
                "exdata": 0,
                firstRender: false
            };
            console.log("TIMER", name, this.timers[name].time_init);
        },
        getFirstRenderFlag: function getFirstRenderFlag(name) {
            var ff = this.timers[name] && this.timers[name].firstRender;
            return ff;
        },
        resetFirstRenderFlag: function resetFirstRenderFlag(name) {
            if (this.timers[name]) this.timers[name].firstRender = false;
        },
        trigger: function trigger(name, exdata) {
            //console.log("Trigger..."+name);
            this.timers[name].firstRender = true;
            this.timers[name]["time"] = this.timers[name]["time_init"];
            this.timers[name]["exdata"] = exdata;
        },
        cancel: function cancel(name) {
            this.timers[name]["time"] = 0;
            this.timers[name].firstRender = false;
            if (this.timers[name]["cancel_cb"]) this.timers[name]["cancel_cb"]();
        },
        getstat: function getstat(name) {
            //console.error("getstat..."+name+".."+this.timers[name]["time"]);
            return this.timers[name]["time"];
        },
        getexdata: function getexdata(name) {
            return this.timers[name]["exdata"];
        },
        update: function update() {
            for (var t in this.timers) {
                if (this.timers[t]["time"] > 0) {
                    this.timers[t]["time"]--;
                    if (this.timers[t]["time"] == 0) {
                        this.cancel(t);
                    }
                }
            }
        }
    });

    var _Game = Class.extend({
        ctor: function ctor(model, render) {
            this.model = model;
            this.render = render;
            this.render.game = this;
            this.mstage = 0;
            this.timeoauto = 0.0;
            this.timeoai = 0.0;
            this.useract = [];
            this.gameover = 0;
        },
        initGame: function initGame() {
            //console.log("Must implement!");
        },
        restartGame: function restartGame() {},
        playUserAction: function playUserAction(dt) {
            //console.log("Must implement!");
        },
        playAutoAction: function playAutoAction(dt) {
            //console.log("Must implement!");
        },
        playAiAction: function playAiAction(dt) {
            //console.log("Must implement!");
        },
        playActionBase: function playActionBase(act) {
            //console.log("Must implement!");
        },
        scheduleUpdate: function scheduleUpdate(dt) {
            console.log("循环");
            this.playUserAction(dt);
            this.playAutoAction(dt);
            this.playAiAction(dt);
            this.render.draw();
        },
        regKeyAction: function regKeyAction(kd) {
            var that = this;
        }
    });

    //http://timetocode.tumblr.com/post/71512510386/an-accurate-nodejs-game-loop-inbetween-settimeout
    var _frameHz = 30;
    var _tickLengthMs = 1000.0 / _frameHz;
    var _previousTick = Date.now();
    var _actualTicks = 0;
    var _gameLoop = function _gameLoop(g) {
        var now = Date.now();
        _actualTicks++;
        if (_previousTick + _tickLengthMs <= now) {
            var delta = now - _previousTick;
            _previousTick = now;
            g.scheduleUpdate(delta);
            _actualTicks = 0;
        }
        //setTimeout(function(){_gameLoop(g);}, _tickLengthMs);
    };

    //通用clone方法，不支持function，速度较快
    var _clone2 = function _clone2(obj) {
        return JSON.parse(JSON.stringify(obj));
    };

    //通用clone方法
    var _clone = function _clone(obj) {
        var o;
        if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object") {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(_clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var j in obj) {
                        o[j] = _clone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    };

    var mNext = 0;

    var _srand = function _srand(seed) {
        mNext = seed >>> 0;
    };

    //采用Microsoft的LCG,c代码和javascript代码生成随机序列可以方便的对上
    var _rand = function _rand() {
        mNext = mNext * 214013 + 2531011 & 0x7FFFFFFF;
        return mNext >> 16 & 0x7FFF;
    };

    //废弃BSD的LCG，由于越界，javascript和c生成的序列match不上
    //var _rand = function() {
    //  mNext = ((((mNext>>>0)*(1103515245>>>0))>>>0) + (12345>>>0))>>>0;
    //  return (((mNext>>>0)/(65536>>>0)) % (32768>>>0))>>>0;
    //};
    return {
        Class: Class,
        //var
        framehz: _frameHz,

        //class
        Point: _Point,
        Render: _Render,
        Game: _Game,
        Model: _Model,
        Timer: _Timer,

        //function
        run: _gameLoop,
        clone: _clone,
        cloneByJson: _clone2,
        srand: _srand,
        rand: _rand
    };
};
var nge = ngeImp();
(function (window, factory) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.nge = factory();
    }
})(undefined, function () {
    return nge;
});

cc._RF.pop();