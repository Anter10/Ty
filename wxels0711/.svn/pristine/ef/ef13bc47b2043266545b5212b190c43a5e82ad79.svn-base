
cc.Class({
    extends: cc.Component,

    properties: {

        spineAnimation: {
            default: null,
            type: sp.Skeleton
        },
        lableGiftContent: cc.Label,
        nodeContent: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.nodeContent.active = false;
        this.local = this.node.position;
    },

    start () {
        this.spineAnimation.setStartListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] start.", trackEntry.trackIndex, animationName);
        });
        this.spineAnimation.setInterruptListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] interrupt.", trackEntry.trackIndex, animationName);
        });
        this.spineAnimation.setEndListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] end.", trackEntry.trackIndex, animationName);
        });
        this.spineAnimation.setDisposeListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] will be disposed.", trackEntry.trackIndex, animationName);
        });
        this.spineAnimation.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            this.showContent();
        });
        this.spineAnimation.setEventListener((trackEntry, event) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] event: %s, %s, %s, %s", trackEntry.trackIndex, animationName, event.data.name, event.intValue, event.floatValue, event.stringValue);
        });

        //this.showContent();
    },

    // update (dt) {},

    showContent(){
        this.nodeContent.active = true;
    },
    init(str_content){
        this.lableGiftContent.string = str_content;
    },
    show(){
        if(this.node.active) return;
        this.node.active = true;
        this.nodeContent.active = true;

        this.node.position = cc.pSub(this.local,cc.p(0,300));
        let self = this;
        this.node.runAction(
            cc.moveBy(
                2,
                cc.p(0,300)
            )
        );
    },
    hide(){
        this.node.active = false;
        this.nodeContent.active = false;
        this.local ? this.node.position = this.local : this.local = this.node.position;
    }
});
