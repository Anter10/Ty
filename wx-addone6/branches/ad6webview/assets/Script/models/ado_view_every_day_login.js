let IsCanWatchVideo = ty.ado.isCanWatchVideo;

cc.Class({
    extends: cc.Component,

    properties: {
        nodeWatchVideoToggle: cc.Node,
        nodeShareToggle: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isWatchVideo = true;
        this.isShare = true;
        if (cc.director.getScene()._name === 'gamestart') {
            ty.ado.Utils.hideGameClub();
            let an = ty.AdManager.getAdNodeByTag('GAME_START');
            if (an) an.hideAdNode();
        } else if (cc.director.getScene()._name === 'gamemain') {
            //ty.ado.Utils.hideWXBanner();
        }
        if (!this.root) this.root = this.node.getChildByName('root');
        const share_control = ty.config.share_control_2.dailydouble;
        var random = parseInt(Math.random() * 100);
        if ((share_control[0] === "video" || ty.ado.isMinGanIP) && ty.ado.isCanWatchVideo) {
            let toggle_share = this.root.getChildByName('toggle_share').getComponent(cc.Toggle);
             // 如果没有在概率内 则直接看视频
            if ((random <= share_control[1] && toggle_share) || ty.ado.isMinGanIP) {
                toggle_share.isChecked = false;
                this.changeShareStat();
            }else{
                this.root.getChildByName('toggle_share').active = false;
                toggle_share.isChecked = true;
            }
        } else if (share_control[0] === "share"){
            this.root.getChildByName('toggle_share').active = false;
            let toggle_share = this.root.getChildByName('toggle_share').getComponent(cc.Toggle);
            toggle_share.isChecked = true;
            // 如果没有在概率内 则直接看视频
            if (random > share_control[1] && ty.ado.isCanWatchVideo) {
               this.root.getChildByName('toggle_share').active = true;
               toggle_share.isChecked = false;
               this.changeShareStat();
            }
        }
        console.log(share_control[0] + random + "当前的数据 =  " + share_control[1] + this.isShare);
   
    },

    start() {
        ty.ado.Utils.showWXBanner();
        ty.ado.Utils.commonScaleIn(this.root);
    },
    onDestroy() {
        if (cc.director.getScene()._name === 'gamestart') {
            ty.ado.Utils.showGameClub();
            let an = ty.AdManager.getAdNodeByTag('GAME_START');
            if (an) an.showAdNode();
            ty.ado.Utils.hideWXBanner();
        } else if (cc.director.getScene()._name === 'gamemain') {
            ty.ado.Utils.showWXBanner();
        }
        ty.NotificationCenter.trigger(ty.ado.Events.ADO_EVENT_DESTROY_EVERY_DAY_LOGIN, null);
    },

    // update (dt) {},
    btnClose() {
        this.node.destroy();
    },
    motai() {
        if (this.info.rewad) this.node.destroy();
    },
    itemTouched(idx) {
        console.log('itemTouched', idx);
    },
    changeWatchVideoStat() {
        this.isWatchVideo = !this.isWatchVideo;
        if (!this.isWatchVideo) {
            this.nodeShareToggle.active = true;
            this.nodeWatchVideoToggle.active = false;
            this.isShare = true;
            let btn_get_label = this.root.getChildByName('btn_reward_double').getChildByName('label_reward').getComponent(cc.Label);
            if (btn_get_label) {
                btn_get_label.string = '加倍领取';
            }
        }
    },
    changeShareStat() {
        this.isShare = !this.isShare;
        let btn_get_label = this.root.getChildByName('btn_reward_double').getChildByName('label_reward').getComponent(cc.Label);
        let btn_get_label_shadow = this.root.getChildByName('btn_reward_double').getChildByName('label_reward_shadow').getComponent(cc.Label);
        if (!this.isShare) {
            if (btn_get_label) {
                btn_get_label.string = '视频加倍';
                btn_get_label_shadow.string = '视频加倍';
            }
        } else {
            if (btn_get_label) {
                btn_get_label.string = '加倍领取';
                btn_get_label_shadow.string = '加倍领取';
            }
        }
    },
    getReward() {
        let self = this;
        if (this.info.rewad) {
            console.log('已经领取奖励');
            ty.ado.Utils.showWXModal(
                '已经领取奖励',
                '提示',
                false);
        } else {
            if (this.isShare) {
                // window.wx.showShareMenu({
                //     withShareTicket: true
                // });
                let shareConfig = ty.ado.Constants.ShareConfig.EVERY_DAY_GIFT_DOUBLE_SHARE;
                let msg = ty.ado.Utils.getRandomShareConfigByShareTag(shareConfig[0]);
                if (!msg) {
                    msg = ty.ado.Constants.DefaultShareConfig;
                }
                if (msg) {
                    ty.ShareInterface.share(
                        msg.shareContent,
                        msg.sharePicUrl,
                        msg.sharePointId,
                        msg.shareSchemeId,
                        (res) => {
                            console.log("分享成功后的数据" + JSON.stringify(res));
                            // * is share to group
                            if (shareConfig && shareConfig[1]) {
                                // * froce share to group
                                if (res.shareTickets !== undefined && res.shareTickets.length > 0) {
                                    ty.ado.Utils.share2GroupByTicket(
                                        shareConfig[0],
                                        res,
                                        () => { // * success callback
                                            self.showOpenRedPacket(true);
                                        },
                                        () => { // * failed callback
                                            ty.ado.Utils.showWXModal('请分享到不同群');
                                            //self.errorCallBack && self.errorCallBack(null);                                           
                                        }
                                    );
                                } else {
                                    // * failed
                                    ty.ado.Utils.showWXModal('请分享到群');
                                    //self.errorCallBack && self.errorCallBack(null);
                                }
                            } else {
                                // * success
                                self.showOpenRedPacket(true);
                            }

                        },
                        function (data) {
                            console.log("分享成功后的数2据" + JSON.stringify(data));
                            //self.errorCallBack && self.errorCallBack(data);
                        }
                    );
                }
            } else {
                if (!self.hadclicknumber || self.hadclicknumber == 0) {
                    self.hadclicknumber = 1;
                } else {
                    return;
                }
                ty.ado.Utils.showWXVideo({
                    success: () => {
                        self.hadclicknumber = 0;
                        self.showOpenRedPacket(true);
                    },
                    fail: () => {
                        self.hadclicknumber = 0;
                    },
                    error_callback: () => {
                        self.hadclicknumber = 0;
                        self.showOpenRedPacket(true);
                    }
                });
            }

        }
    },
    btnGetRewardWithoutShareAndVideo() {
        this.showOpenRedPacket();
    },
    showOpenRedPacket(is_double = false) {
        this.node.destroy();
        cc.loader.loadRes('prefabs/OpenRedPackView_2', function (err, prefab) {
            if (!err) {
                var prefabNode = cc.instantiate(prefab);
                cc.game.addPersistRootNode(prefabNode);
                prefabNode.x = 360;
                prefabNode.y = 720;
                ty.ado.Utils.hideWXBanner();
                prefabNode.getComponent('OpenRedPackView_2').showUI();
                prefabNode.getComponent('OpenRedPackView_2').init(is_double);
            }
        });
    },
    init() {
        let info = ty.ado.EveryDataLoginInfo;
        this.root = this.node.getChildByName('root');
        this.info = info;
        let btn_get_label = this.root.getChildByName('btn_reward_double').getChildByName('label_reward').getComponent(cc.Label);
        let btn_get_label_shadow = this.root.getChildByName('btn_reward_double').getChildByName('label_reward_shadow').getComponent(cc.Label);
        if (btn_get_label) {
            btn_get_label.string = info.rewad ? '已领取' : (this.isShare ? '加倍领取' : '视频加倍');
            btn_get_label_shadow.string = info.rewad ? '已领取' : (this.isShare ? '加倍领取' : '视频加倍');
            this.root.getChildByName('toggle_share').active = !info.rewad;
            this.root.getChildByName('btn_reward').active = !info.rewad;
            if (!ty.ado.isCanWatchVideo) {
                this.root.getChildByName('toggle_share').active = false;
            }
        }
        for (let i = 0; i < 7; i++) {
            let child_name = `node_icon_${i}`;
            let node_icon = this.root.getChildByName(child_name);
            if (node_icon) {
                let mask = node_icon.getChildByName('mask');
                let node_count = node_icon.getChildByName('label_count');
                let label_count = node_count.getComponent(cc.Label);
                let bg = node_icon.getChildByName('sprite_icon');
                let amount = info.amounts[i] >= 0 ? info.amounts[i] : -info.amounts[i];
                label_count.string = `¥${ty.ado.Utils.formatCashFen2Yuan(amount)}`;
                if (i === info.count - 1) {
                    mask.active = false;
                    node_count.active = info.rewad;
                } else {
                    mask.active = true;
                    bg.active = false;
                    if (i > info.count - 1) {
                        node_count.active = false;
                    } else {
                        node_count.active = true;
                    }
                }
            }
        }
    }
});