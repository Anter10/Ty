
cc.Class({
    extends: cc.Component,

    properties: {
        nodeGood: cc.Node,
        nodeCombo: cc.Node,
        nodeAwesome: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.comboNum = 0;
        this.playAnimationCount = 0;
        this.is_combo = false;
        this.nodeGood.active = false;
        this.nodeCombo.active = false;
        this.nodeAwesome.active = false;
    },

    start () {
        this.play();
    },

    // update (dt) {},

    init(is_combo,combo){
        console.log('combo animation init',is_combo,combo);
        this.comboNum = combo;
        this.is_combo = is_combo;
        if(is_combo){
            let tmp_node = this.nodeCombo.getChildByName('heji');
            let combo_label = tmp_node.getChildByName('label').getComponent(cc.Label);
            if(combo_label){
                combo_label.string = combo + '';
            }
        }
        
    },
    play(){
        console.log('combo animation play');
        this.playAnimationCount = 0;
        if(this.is_combo){
            if(this.comboNum >= 3){
                //! show combo
                this.showCombo();
            }
        }
        else{
            if(this.comboNum === 3){
                //! show good
                this.showGood();
            }
            else if(this.comboNum >= 4){
                //! show awesome
                this.showAwesome();
            }
            else{
                this.node.removeFromParent();
            }
        }
    },
    showGood(){
        console.log('play good');
        this.nodeGood.active = true;
        let ani = this.nodeGood.getComponent(cc.Animation);
        ani.play();
        this.playAnimationCount++;

        let self = this;
        ani.on('finished', (num, string)=>{
            console.log('good finished',num, string);
            self.animationEnd();
        }, this);
    },
    showAwesome(){
        console.log('play awesome');
        this.nodeAwesome.active = true;
        let ani = this.nodeAwesome.getComponent(cc.Animation);
        ani.play();
        this.playAnimationCount++;

        let self = this;
        ani.on('finished', (num, string)=>{
            console.log('awesome finished',num, string);
            self.animationEnd();
        }, this);
    },
    showCombo(){
        console.log('play combo');
        this.nodeCombo.active = true;
        let ani = this.nodeCombo.getComponent(cc.Animation);
        ani.play();
        this.playAnimationCount++;

        let self = this;
        ani.on('finished', (num, string)=>{
            console.log('combo finished',num, string);
            self.animationEnd();
        }, this);
    },
    animationEnd(){
        this.playAnimationCount--;
        if(this.playAnimationCount <= 0){
            this.node.removeFromParent();
        }
    }
});
