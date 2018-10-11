 
cc.Class({
    extends: cc.Component,

    properties: {
        timeLabel:{
            default:null,
            type: cc.Label,
        },
        nameLabel: {
            default: null,
            type: cc.Label,
        }
    },

    

    // onLoad () {},
    setData:function(data){
        this.data = data;
        this.timeLabel.string = this.data.time;
        this.nameLabel.string = this.data.item.name;
    },

    start () {

    },

    // update (dt) {},
});
