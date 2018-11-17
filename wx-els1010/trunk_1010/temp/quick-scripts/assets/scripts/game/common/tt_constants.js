(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/common/tt_constants.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0ee2d0SknNDR4/e+pBs/vNg', 'tt_constants', __filename);
// scripts/game/common/tt_constants.js

'use strict';

var BlockSize = cc.size(76, 76);
var BoardWidth = 8;
var BoardHeight = 8;
var AddScore = 10;

var BlockMap = [[[-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2]], [[-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1]], [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]], [[-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1]], [[-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2]]];
// * 敏感ip
var MinGanIp = [['北京', ['北京']], ['上海', ['上海']], ['广东', ['广州']], ['湖南', ['长沙']], ['天津', ['天津']], ['浙江', ['杭州']], ['四川', ['成都']]];

var Blocks = [[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 2, 0, 0], [0, 0, 2, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 2, 2, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 3, 0, 0], [0, 0, 3, 0, 0], [0, 0, 3, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 3, 3, 3, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 4, 4, 4, 4], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 4, 0, 0], [0, 0, 4, 0, 0], [0, 0, 4, 0, 0], [0, 0, 4, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 5, 0, 0], [0, 0, 5, 0, 0], [0, 0, 5, 0, 0], [0, 0, 5, 0, 0], [0, 0, 5, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [5, 5, 5, 5, 5], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 6, 0, 0], [0, 0, 6, 0, 0], [0, 6, 6, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 6, 6, 0, 0], [0, 0, 6, 0, 0], [0, 0, 6, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 0, 6, 0], [0, 6, 6, 6, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 6, 0, 0, 0], [0, 6, 6, 6, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 2, 2, 2, 0], [0, 2, 2, 2, 0], [0, 2, 2, 2, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 3, 3, 3, 0], [0, 0, 0, 3, 0], [0, 0, 0, 3, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 3, 0, 0, 0], [0, 3, 0, 0, 0], [0, 3, 3, 3, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 4, 4, 4, 0], [0, 4, 0, 0, 0], [0, 4, 0, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 0, 5, 0], [0, 0, 0, 5, 0], [0, 5, 5, 5, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 6, 0, 0, 0], [0, 6, 6, 0, 0], [0, 0, 6, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 1, 1, 0], [0, 1, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 2, 0, 0], [0, 2, 2, 2, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 2, 0, 0], [0, 2, 2, 0, 0], [0, 0, 2, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 2, 0, 0], [0, 0, 2, 2, 0], [0, 0, 2, 0, 0], [0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 2, 2, 2, 0], [0, 0, 2, 0, 0], [0, 0, 0, 0, 0]]];
var ForceRestBlocks = [0, 1, 2]; // * 重置道具
// ! BlockDis 是根据 Blocks 生成的关系图，如果修改Blocks，必须同步修改BlockDis,否则，就JJ了
var BlockDis = [[[0, 0]], [[0, 0], [-1, 0]], [[0, 0], [0, 1]], [[0, 0], [-1, 0], [-2, 0]], [[0, 0], [0, 1], [0, 2]], [[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [-1, 0], [-2, 0], [-3, 0]], [[0, 0], [-1, 0], [-2, 0], [-3, 0], [-4, 0]], [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], [[0, 0], [-1, 0], [-2, -1], [-2, 0]], [[0, 0], [0, 1], [-1, 1], [-2, 1]], [[0, 0], [-1, -2], [-1, -1], [-1, 0]], [[0, 0], [-1, 0], [-1, 1], [-1, 2]], [[0, 0], [0, 1], [-1, 0], [-1, 1]], [[0, 0], [0, 1], [0, 2], [-1, 0], [-1, 1], [-1, 2], [-2, 0], [-2, 1], [-2, 2]], [[0, 0], [0, 1], [0, 2], [-1, 2], [-2, 2]], [[0, 0], [-1, 0], [-2, 0], [-2, 1], [-2, 2]], [[0, 0], [0, 1], [0, 2], [-1, 0], [-2, 0]], [[0, 0], [-1, 0], [-2, -2], [-2, -1], [-2, 0]], [[0, 0], [-1, 0], [-1, 1], [-2, 1]], [[0, 0], [0, 1], [-1, -1], [-1, 0]], [[0, 0], [-1, -1], [-1, 0], [-1, 1]], [[0, 0], [-1, -1], [-1, 0], [-2, 0]], [[0, 0], [-1, 0], [-1, 1], [-2, 0]], [[0, 0], [0, 1], [0, 2], [-1, 1]]];

// 存储玩家分数的字段
var TT_SCORE = "TT_SCORE";

var ShareConfig = {
    HOME_ZP_GET_SHARE: ['homezpgetshare', false], // 转盘免费分享获得
    HOME_ZP_GET_VIDEO: ['homezpgetvideo', false], // 转盘免费视频获得
    HOME_ZP_FREE_SHARE: ['homezpfreeget', false], // 转盘免费获得
    HOME_RANK_SHARE: ['homerankshare', false], // 好友排行榜分享
    GET_HUNAYIHUAN_NUMBER_SHARE: ['gethuanyihuanshare', false], // 分享得到换一换
    GET_HUNAYIHUAN_NUMBER_VIEDO: ['gethuanyihuanvideo', false], // 看视频得到换一换
    GET_CHUIZI_NUMBER_SHARE: ['getchuizishare', false], // 分享得到锤子道具
    GET_CHUIZI_NUMBER_VIEDO: ['getchuizivideo', false], // 看视频得到锤子道具
    GAMEOVER_FUHUO_SHARE: ['gameoverfuhuoshare', false], // 分享复活
    GAMEOVER_FUHUO_VIDEO: ['gameoverfuhuovideo', false], // 看视频复活
    ZPADDDOUBLE_SHARE: ['zpadddouble_share', false], // 转盘分享加倍
    ZPADDDOUBLE_VIDEO: ['zpadddouble_video', false], // 转盘视频加倍
    GAMEOVER_SHARE: ['gameover_share', false], // gameover 后显示的分享
    GAMEOVER_VIDEO: ['gameover_video', false] // gameover 后显示的视频
};

// * 分享缺省配置
var DefaultShareConfig = {
    shareContent: "俄罗斯方块居然还能这么玩~",
    sharePicUrl: "https://elsfkws.nalrer.cn/teris/share_image/pintu/pt001.png",
    sharePointId: "766",
    shareSchemeId: "1155"
};
// * 微信广告参数
var WXAdConfig = {
    bannerId: 'adunit-652297ac130ea5be',
    vedioId: 'adunit-72772b75d8b17d65',
    bannerRefreshTime: 200 // * Banner刷新时间
};

var PlayDataKeys = {
    ttplaydata: "ttplaydata"

    //! 音效
};var SOUNDS = {
    AWESOME: 'sounds/awesome.mp3',
    COOL: 'sounds/cool.mp3',
    GOOD: 'sounds/good.mp3',
    MUSIC_LOGO: 'sounds/music_logo.mp3',
    POPUPCLOSE: 'sounds/PopupClose.mp3',
    UNBLIEVEABLE: 'sounds/unblieveable.mp3',
    // 水下气泡
    SHUIXIAQIPAO: 'sounds/shuixiaqipao.mp3',
    // 加钱的时候音效
    ADDMONEY: 'sounds/coin.mp3',
    // 飞红包时的音效
    FLY_REDPACKET: 'sounds/redpack.mp3',
    COMBO: ['sounds/combo3.mp3', // 0 点击拖动块的音效
    'sounds/combo4.mp3', // 1 点击结束填充格子的时候的音效
    'sounds/combo5.mp3', // 2
    'sounds/combo6.mp3', // 3
    'sounds/combo7.mp3', // 4 复活界面倒计时的音效
    'sounds/combo8.mp3', 'sounds/combo9.mp3', 'sounds/combo10.mp3', 'sounds/combo11.mp3', 'sounds/combo12.mp3', 'sounds/combo13.mp3', 'sounds/combo14.mp3']
};

module.exports = {
    BlockSize: BlockSize,
    BoardWidth: BoardWidth,
    BoardHeight: BoardHeight,
    Blocks: Blocks,
    BlockMap: BlockMap,
    ForceRestBlocks: ForceRestBlocks,
    AddScore: AddScore,
    BlockDis: BlockDis,
    TT_SCORE: TT_SCORE,
    ShareConfig: ShareConfig,
    DefaultShareConfig: DefaultShareConfig,
    WXAdConfig: WXAdConfig,
    MinGanIp: MinGanIp,
    PlayDataKeys: PlayDataKeys,
    SOUNDS: SOUNDS
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=tt_constants.js.map
        