// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        icon:cc.Sprite,
        name_Label:cc.Label,
        score_Label:cc.Label
    },

    onLoad () {
        this.node.active = false;
    },

    dismissBeyond() {
        this.node.active = false;
    },

    showBeyond(_data) {
        if (!_data){
            return;
        }
        this.node.active = true;

        // let _name = _data.nickname;
        // _name = _name.length > 5 ? _name.slice(0,4) + "..." : _name;
        // this.name_Label.string =  _name;
        //
        // let _iconUrl = _data.avatarUrl + "?aaa=aa.png";
        // this.setImage(this.icon, _iconUrl);
        //
        // let score = _data["score"];
        // this.score_Label.string = score;

    },

    setImage(_node, _imageUrl) {
        cc.loader.load(_imageUrl, function (err, texture) {
            if (!err) {
                _node.getComponent('cc.Sprite').spriteFrame = new cc.SpriteFrame(texture);
            }
        });
    },

});
