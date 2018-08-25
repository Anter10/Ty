"use strict";
cc._RF.push(module, '7c2dbJUdiZLmIzaqT+PBih/', 'AddOneConfig');
// Script/models/AddOneConfig.js

"use strict";

/*
   游戏配置文件:
   主要配置游戏逻辑和界面上的一些常量。
   created by gyc on 2018-08-01.
*/
var config = {
	// 每个格子的大小（宽 高）
	gezi_size: 132,
	// 每个格子+间隙的大小 
	gezi_pitch: 140,
	// 格子移动一个的时间
	move_time: 0.3,
	// 宽
	swidth: 720,
	//高
	sheight: 1280,
	// 玩家最大体力
	maxphy_value: 5,
	// 公共格子数量 5 * 5
	geziNumber: 25,
	// 最少连接多少个可以消除
	minCanRemoveNumber: 3,
	//玩家得分基数
	baseScore: 10,
	// 最大复活次数
	maxrnum: 2,
	//格子距离底部多远
	marginbottom: 358,
	// 即将超越对手多少分显示相应图标
	thanfriendScore: 300,
	// 提示用户点击轮播时间
	letUserClickTime: 3,
	// 初始化给玩家的道具数量
	initGivePlayerItemNumber: 3,
	// 初始化格子的最大数限制
	initGameMaxNum: 5,
	// 连接数在不同的值需要展示特定的效果
	lianjiEffects: {
		sgood: 3, // cool 
		cgood: 4, // good
		bgood: 5, // awesome
		maxgood: 6 // unbelive
	},
	// 体力显示的属性
	showphy_pros: {
		width: 130,
		height: 40,
		radius: 6,
		phy_num: 5,
		// 赤橙黄绿青蓝紫
		colors: [[255, 0, 0], [255, 165, 0], [255, 255, 0], [0, 255, 0], [0, 127, 255], [0, 0, 255], [139, 0, 255]]
	},

	// 格子颜色值(RGB) 现在没用
	color_list: [[233, 85, 56], // 砖红色
	[255, 128, 64], // 浅砖红色
	[44, 175, 219], // 蓝色
	[165, 198, 31], // 草绿色
	[23, 177, 167], // 青色
	[0, 128, 0], // 深绿色
	[0, 0, 128], // 深蓝色
	[128, 0, 0], // 深红色
	[128, 64, 32], // 咖啡色
	[128, 0, 128], // 紫色
	[32, 32, 32] // 深黑色
	],

	// 当前的游戏状态
	gameState: {
		checkclick: 1, // 玩家点击格子的状态
		domove: 2, // 格子移动状态
		dodrop: 3, // 各自处于掉落状态
		waitclick: 4, // 等待点击状态
		gameover: 5, // 游戏结束状态
		usingitem: 6
	},

	// 游戏中用到的道具数据
	allitem: [{
		id: 1,
		name: "数字-1道具",
		png: "",
		num: 0,
		value: -1
	}, {
		id: 2,
		name: "数字+2道具",
		png: "",
		num: 0,
		value: 2
	},
	//    {
	// 		id:4,
	// 		name:"复活",
	// 		png:"",
	// 		num:0,
	// 		value:0,
	//    },
	{
		id: 5,
		name: "+1血道具",
		png: "",
		num: 0,
		value: 0
	}, {
		id: 6,
		name: "锤子道具",
		png: "",
		num: 0,
		value: 0
	}],
	// 格子中数字的颜色值
	celltilenumColors: [[154, 91, 1], // 1
	[51, 112, 0], // 2
	[161, 62, 3], // 3
	[165, 14, 14], // 4
	[1, 107, 98], // 5
	[151, 0, 103], // 6
	[0, 107, 160], // 7
	[15, 84, 105], // 8
	[107, 33, 207], // 9
	[131, 0, 155], // 10
	[15, 84, 195]],
	// 版本控制的配置

	// 审核通过后 将版本号v101修改成对应的版本 auditing 设置成false即可
	VCTR: {
		v101: {
			auditing: true
		},
		default: {
			auditing: false
		}
	},
	//! 音效
	SOUNDS: {
		AWESOME: 'sounds/awesome.mp3',
		COOL: 'sounds/cool.mp3',
		GOOD: 'sounds/good.mp3',
		MUSIC_LOGO: 'sounds/music_logo.mp3',
		POPUPCLOSE: 'sounds/PopupClose.mp3',
		UNBLIEVEABLE: 'sounds/unblieveable.mp3',
		COMBO: ['sounds/combo3.mp3', 'sounds/combo4.mp3', 'sounds/combo5.mp3', 'sounds/combo6.mp3', 'sounds/combo7.mp3', 'sounds/combo8.mp3', 'sounds/combo9.mp3', 'sounds/combo10.mp3', 'sounds/combo11.mp3', 'sounds/combo12.mp3', 'sounds/combo13.mp3', 'sounds/combo14.mp3']
	},
	//! 背景音乐
	MUSICS: {
		BG_MUSIC: 'https://marketqn.nalrer.cn/teris/m/3.mp3'
	},
	// 幸运块的概率
	xykRandNumber: 0.2,
	box_rate: { sub1: 0.5, add2: 0.2, heart: 0.2, chui: 0.1 },
	luck_block: {
		score: [0, 10000, 20000, 25000, 30000, 35000, 100000000],
		rate: [0.8, 0.7, 0.6, 0.3, 0.2, 0.1]
	}
};

module.exports = config;

cc._RF.pop();