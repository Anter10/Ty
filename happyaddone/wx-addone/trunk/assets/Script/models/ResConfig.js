let PrefabConfig = { // ! 预制件配置文件[预制件名字,是否调用init,绑定的脚本名字]
    PREFAB_LOADING: ['loading',false,''],
    // 帮助界面
    PREFAB_UIHelpView: ['UIHelpView', false, 'UIHelpView'],
    // 排行榜界面
    PREFAB_UIPhbView: ['UIPhbView', false, 'UIPhbView'],
    // 游戏完成的界面
    PREFAB_UIGameOverView: ['UIGameOverView', true, 'UIGameOverView'],
    // 游戏中 免费领取宝箱的时候展示的界面
    PREFAB_UIOpenBoxView: ['UIOpenBoxView', true, 'UIOpenBoxView'],
    // 突破记录的时候展示的界面
    PREFAB_UIPoJiLuView: ['UIPoJiLuView', true, 'UIPoJiLuView'],
    // 点击暂停按钮展示的界面
    PREFAB_UIStopView: ['UIStopView', true, 'UIStopView'],
    // 邀请领奖的界面
    PREFAB_UIGiftView: ['UIGiftView', false, 'UIGiftView'],
};

module.exports = {
    PrefabConfig
};