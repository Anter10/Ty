let ELSEvent = require('../core/ElsEvents.js');
let els = require("../core/els.js");
const MAX_MAGIC = 100;
cc.Class({
    extends: cc.Component,

    properties: {
        nodeFull: cc.Node,
        nodeNormal2: cc.Node,
        nodeBoxMove: cc.Node,
        aniNormal: cc.Animation,
        aniFull: cc.Animation,
        labCurrentMagic: cc.Label,
        labAddMagic: cc.Label,
        prefabAddMagic: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.currentMagic = 0;
        this.addValue = 0;
        this.labAddMagic.node.active = false;
        this.labCurrentMagic.string = '0';
        this.addLabDefaultPos = this.labAddMagic.node.position;
        this.hide();

        this.aniFull.on('finished', (num, string)=>{
            console.log('full finished',num, string);
        }, this);

        //! 事件监听
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_ADD, this.progressTo, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_FULL, this.bottleFull, this);
        tywx.NotificationCenter.listen(ELSEvent.ELS_EVENT_MAGIC_RESET_BOTTLE, this.reset, this);

    },
    init(game){
        this.game = game;
    },

    start () {
    },
    onDestroy(){
        tywx.NotificationCenter.ignore(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_ADD, this.progressTo, this);
        tywx.NotificationCenter.ignore(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_FULL, this.bottleFull, this);
        tywx.NotificationCenter.ignore(ELSEvent.ELS_EVENT_MAGIC_RESET_BOTTLE, this.reset, this);
    },

    // update (dt) {},
    reset(){
        console.log('MagicBottleView  reset',this.nodeNormal,this.aniNormal);
        this.nodeNormal2.active = true;
        //this.aniNormal.play();
        this.nodeFull.active = false;
        this.currentMagic = 0;
        this.labCurrentMagic.string = '0';
    },
    addMagic(add){
        if (this.game.model.mconf.isWhisper) {
            return;
        }
        this.currentMagic += add;
        this.currentMagic = this.currentMagic > MAX_MAGIC ? MAX_MAGIC : this.currentMagic;
        this.addValue = add;
        console.log('show add magic', this.currentMagic);
    },
    showAddMagicEffect(){
        console.log('show add magic effect ===>bottle');
        let normalAniCtrl = this.nodeNormal2.getComponent('els_view_magic_bottle');
        if(normalAniCtrl){
            normalAniCtrl.progressTo(this.currentMagic);
        }
        if(this.addValue > 0){
            let tmpAddMagic = cc.instantiate(this.prefabAddMagic);
            let self = this;
            tmpAddMagic.parent = this.node;
            tmpAddMagic.position = this.labAddMagic.node.position;
            tmpAddMagic.getComponent('els_view_add_magic').init(this.addValue,()=>{
                self.labCurrentMagic.string = `${self.currentMagic}`;
            });
        }
        console.log('show add magic', normalAniCtrl);
    },
    animationPause(){
        //this.aniNormal.pause();
    },
    hide(){
        this.nodeFull.active = false;
        this.nodeNormal2.active = false;
        this.nodeBoxMove.active = false;
    },
    progressTo(num){
        console.log('progerssTo2',num);
        this.animationPause();
    },
    bottleFull(num){
        console.log('bottle full',num);
        //this.aniNormal.stop();
        this.nodeNormal2.active = false;
        this.nodeFull.active = true;
        this.aniFull.play();
        this.currentMagic = 0;
        this.showBoxMove();
    },
    showBoxMove(){
        this.nodeBoxMove.active = true;
        let end_pos = this.node.getChildByName('EndPos').position;
        console.log('showBoxMove', end_pos);
        let self = this;
        let move_end = ()=>{
            self.nodeBoxMove.active = false;
            self.nodeBoxMove.position = cc.p(0,0);
            self.nodeBoxMove.scale = 0.5;
            self.nodeFull.active = false;
            self.nodeNormal2.active = true;
        };
        this.nodeBoxMove.runAction(
            cc.sequence(
                cc.spawn(
                    cc.moveTo(0.5,end_pos),
                    cc.scaleTo(0.5,1)
                ),
                cc.callFunc(move_end)
            )
        );
    }
});
