let ELSEvent = require('../core/ElsEvents.js');
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pauseFrameIdx = 0;
    },

    start () {

    },

    // update (dt) {},
    progressTo(num){
        console.log('progressTo1',num, this.pauseFrameIdx);
        if(num === 9){  
            let main = this.game.gameNode.getComponent('main');
            if(!main.yanhua.active){
                this.game.pauseGame();
                this.pauseFrameIdx = 0;
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_FULL,num);
            }
            else{
                let ani = this.node.getComponent(cc.Animation);
                ani.pause();
                //tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_MAGIC_RESET_BOTTLE,0);
            }
        }
        else if (num === this.pauseFrameIdx){    
            let ani = this.node.getComponent(cc.Animation);
            ani.pause();
            tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_ADD,num);
        }
        else if(num > this.pauseFrameIdx){
            this.pauseFrameIdx = 0;
            let ani = this.node.getComponent(cc.Animation);
            ani.pause();
            tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_MAGIC_RESET_BOTTLE,0);
        }
    },
    setEndFrame(frame_idx){
        console.log('sen end frame', frame_idx, this.pauseFrameIdx);
        if(frame_idx === this.pauseFrameIdx && this.pauseFrameIdx === 9){
            this.pauseFrameIdx = 0;
            let main = this.game.gameNode.getComponent('main');
            if(!main.yanhua.active){
                this.game.pauseGame();
                tywx.NotificationCenter.trigger(ELSEvent.ELS_EVENT_MAGIC_BOTTLE_FULL,frame_idx);
            }
            return;
        }
        if(frame_idx > this.pauseFrameIdx){
            let ani = this.node.getComponent(cc.Animation);
            ani.resume();
        }
        this.pauseFrameIdx = frame_idx;
    },
    setGame(game){
        this.game = game;
    },
});
