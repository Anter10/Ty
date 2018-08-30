"use strict";
cc._RF.push(module, '7c2dbJUdiZLmIzaqT+PBih/', 'AddOneConfig');
// Script/models/AddOneConfig.js

'use strict';

/*
   游戏配置文件:
   主要配置游戏逻辑和界面上的一些常量。
   created by gyc on 2018-08-01.
*/
var config = {
	// 审核通过后 将版本号v102修改成对应的版本 auditing 设置成false即可
	v102: {
		auditing: true
	},
	default: {
		auditing: false,
		//! 背景音乐
		MUSICS: {
			BG_MUSIC: 'https://marketqn.nalrer.cn/teris/m/3.mp3'
		},
		// 开宝箱的概率
		box_rate: {
			sub1: 0.5,
			add2: 0.2,
			heart: 0.2,
			chui: 0.1
		},
		// 不同分数级别对应的新运块的概率
		luck_block: {
			score: [0, 10000, 20000, 25000, 30000, 35000, 100000000],
			rate: [0.8, 0.7, 0.6, 0.3, 0.2, 0.1]
		}
	}

};

module.exports = config;

cc._RF.pop();