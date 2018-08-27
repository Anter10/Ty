
cc.Class({
    extends: cc.Component,

    properties: {
        nodeContent: cc.Node,
        nodeHeard: cc.Node,
        labelContent: cc.Label,
        nodeStartTag: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {
        console.log('wisper animation start');
        this.play();
    },

    // update (dt) {},

    init(str_content, cb, move_star){
        console.log('wisper animation init');
        this.labelContent.string = str_content;
        //this.playIdx = idx;
        this.cb = cb;
        this.move_star = move_star;
        //this.play();
        
    },
    play(){
        let aniHeart = this.nodeHeard.getComponent(cc.Animation);
        let aniContent = this.nodeContent.getComponent(cc.Animation);
        let self = this;

        aniHeart.on('play',(num, string)=>{
            console.log('heart play',num, string);
        }, this);
        aniHeart.on('finished', (num, string)=>{
            console.log('heart finished',num, string);
            self.nodeContent.active = true;
            self.nodeHeard.active = false;
            aniContent.play();
        }, this);

        aniContent.on('play',(num, string)=>{
            console.log('content play',num, string);
        }, this);
        aniContent.on('finished', (num, string)=>{
            console.log('content finished',num, string);
            self.cb();
            self.node.removeFromParent();
        }, this);


        let star_pos = this.move_star.parent.convertToWorldSpace(this.move_star.position);
        let start_pos = this.nodeStartTag.parent.convertToWorldSpace(this.nodeStartTag.position);
        let move_dis = cc.p(start_pos.x - star_pos.x + 50,start_pos.y - star_pos.y - 375);
        console.log('play wisper start animation ====>',move_dis, star_pos, start_pos);
        let star_pos_cache = this.move_star.position;
        this.move_star.runAction(
            cc.sequence(
                cc.moveBy(0.2,move_dis),
                cc.callFunc(()=>{
                    self.nodeHeard.active = true;
                    self.move_star.opacity = 255;
                    self.move_star.active = false;
                    //aniHeart.play(`tanshe0${this.playIdx}`);
                    aniHeart.play('tanshe02');
                    self.move_star.position = star_pos_cache;
                })
            )
        );
    },
    
});
