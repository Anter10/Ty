
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.active = false;
        tywx.NotificationCenter.listen(tywx.EventType.GET_ADMANAGER_ICON_INFO_SUCCESS, this.onGetCrossAdInfoSuccess, this);
        if(tywx.AdManager.rawAdInfoList.length > 0 ){
            this.onGetCrossAdInfoSuccess();
        }
    },
    onDestroy(){
        tywx.NotificationCenter.ignoreScope(this);
    },

    start () {

    },

    // update (dt) {},

    onGetCrossAdInfoSuccess(){
        // ! 审核状态不显示
        if(tywx.ado.Configs.auditing || !tywx.ado.Configs.cross_ad_more_game) {
            this.node.active = false;
            return;
        }

        let ad_list = tywx.ado.Configs.cross_ad_more_game;
        let root = this.node.getChildByName('root');
        this.node.active = true;
        for(let i = 0; i < 5; i++){
            let adNode = root.getChildByName(`adNode_${i}`);
            let adConfig = ad_list[i];
            if(adConfig && adNode){
                var adButton = adNode.getChildByName('adButton');
                adButton.on('click', function () {
                    tywx.ado.Utils.jump2MiniProgramByConfig(tywx.ado.Utils.getCrossAdConfigByAppId(adConfig.appid));
                });
                let spriteIco = adNode.getChildByName('adIcon').getComponent(cc.Sprite);
                cc.loader.load(
                    tywx.SystemInfo.cdnPath + 'share_image/jiayi/daoliu/' + adConfig.icon_url,
                    (err,texture)=>{
                    if(!err){
                        let new_sprite_frame = new cc.SpriteFrame(texture);
                        spriteIco.spriteFrame = new_sprite_frame;
                        spriteIco.node.setContentSize(cc.size(120,120));
                        console.log("刷新CDN图片成功");
                    }
                });
                let nodeName = adNode.getChildByName('label_name');
                let label_name = nodeName.getComponent(cc.Label);
                if(label_name){
                    label_name.string = adConfig.name;
                }
            }
        }
    }
});
