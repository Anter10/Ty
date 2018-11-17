
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initRoot();
        if(cc.director.getScene()._name === 'gamestart'){
            tywx.ado.Utils.hideGameClub();
            let an = tywx.AdManager.getAdNodeByTag('GAME_START');
            if(an) an.hideAdNode();
        } else if (cc.director.getScene()._name === 'gamemain') {
            tywx.ado.Utils.hideWXBanner();
        }
    },
    onDestroy(){
        if(cc.director.getScene()._name === 'gamestart'){
            tywx.ado.Utils.showGameClub();
            let an = tywx.AdManager.getAdNodeByTag('GAME_START');
            if(an) an.showAdNode();
            tywx.ado.Utils.hideWXBanner();
        } else if (cc.director.getScene()._name === 'gamemain') {
            tywx.ado.Utils.showWXBanner();
        }
    },

    start () {
        if(this.root){
            tywx.ado.Utils.commonScaleIn(this.root);
        }
    },

    //update (dt) {},
    btnInviteClick(){
        console.log('btnInviteClick');
        let shareConfig = tywx.ado.Constants.ShareConfig.INVITE_FIREND_SHARE;
        let msg = tywx.ado.Utils.getRandomShareConfigByShareTag(shareConfig[0]);
        if(!msg){
           msg = tywx.ado.Constants.DefaultShareConfig;
        }
        if(msg){
            tywx.ShareInterface.share(
                msg.shareContent,
                msg.sharePicUrl,
                msg.sharePointId,
                msg.shareSchemeId,
                (res) => {
                    console.log("分享成功后的数据"+JSON.stringify(res));
                },
                function(data){
                    console.log("分享成功后的数2据"+JSON.stringify(data));
                }
            );
        }  
    },
    motai(){
         wx.postMessage({
             method: 9,
         });
        this.node.destroy();
    },
    btnCloseClick(){
         wx.postMessage({
             method: 9,
         });
        this.node.destroy();
    },
    btnGetRewardClick(){
        console.log('btnGetRewardClick');
        if(this.info.reward){
            tywx.ado.Utils.showWXModal(
                '已经领取过奖励',
                '提示',
                false);
        }
        else{
            tywx.ado.Utils.requestInviteReward();
        }
    },
    init(){
        this.initRoot();
        let info = tywx.ado.InviteInfo;
        this.info = info;
        let wait_time = 1000;
        for(let i = 0; i < 5; ++i){
            let tmp_item_name = `node_invite_${i}`;
            let tmp_item = this.root.getChildByName(tmp_item_name);
            let is_invited = info.invite_users[i] ? true : false;
            //is_invited = true;
            if(tmp_item){
                let node_head = tmp_item.getChildByName('head_icon');
                let btn_invite = tmp_item.getChildByName('btn_invite');
                let btn_invite2 = tmp_item.getChildByName('head_bg');
                let node_nick_name = tmp_item.getChildByName('nick_name');
                let invite_mask = tmp_item.getChildByName('invite_mask');
                //let label_nick_name = node_nick_name.getComponent(cc.Label);
                if(!is_invited){
                    node_nick_name.active = false;
                }
                else{
                    let usr_info = info.invite_users[i];
                    let sp_head = node_head.getComponent(cc.Sprite);
                    let tmp_texture = new cc.Texture2D();
                    btn_invite.active = false;
                    btn_invite2.active = false;
                    let btn_invite_com = btn_invite2.getComponent(cc.Button);
                    invite_mask.active = true;
                    if(btn_invite_com){
                        btn_invite_com.interactable = false;
                    }
                    setTimeout(()=>{
                        window.sharedCanvas.width = 160;
                        window.sharedCanvas.height = 200;
                        wx.postMessage({
                            method: 'render_invite_usr_info',
                            openId: usr_info.wxOpenId
                        });
                    },i * wait_time);
                    setTimeout(()=>{
                        var openDataContext = wx.getOpenDataContext();
                        var sharedCanvas = openDataContext.canvas;
                        tmp_texture.initWithElement(sharedCanvas);
                        tmp_texture.handleLoadedTexture();
                        sp_head.spriteFrame = new cc.SpriteFrame(tmp_texture);
                        invite_mask.active = false;
                    },i * wait_time + 800);
                }
            }
        }
    },
    initRoot(){
        if(!this.root) this.root = this.node.getChildByName('root');
    },
});
