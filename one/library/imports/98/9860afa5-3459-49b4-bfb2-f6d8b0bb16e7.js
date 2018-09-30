"use strict";
cc._RF.push(module, '9860a+lNFlJtL+y9tiwuxbn', 'JiLuItem');
// Script/models/JiLuItem.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        timeLabel: {
            default: null,
            type: cc.Label
        },
        nameLabel: {
            default: null,
            type: cc.Label
        }
    },

    // onLoad () {},
    setData: function setData(data) {
        this.data = data;
        this.timeLabel.string = this.data.time;
        this.nameLabel.string = this.data.item.name;
    },

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();