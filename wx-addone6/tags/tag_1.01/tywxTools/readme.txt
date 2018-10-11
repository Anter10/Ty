使用步骤:
1.将tywxTools文件夹复制到项目工程目录下,最好上传到svn
2.进行cocos creator发布后,运行python脚本JSconfuse.py
3.查看 项目工程目录/build/wechatgame/src/project.js(debug模式下是project.dev.js), 确认混淆后的JS代码可读性
4.微信开发者工具上确定功能是否正常,若一起正常,则可用于测试和提审等操作

说明:
uglifyJS为github上的三方库工程,用于混淆js代码,保护代码安全.
JSconfuse.py内的路径都是写的相对路径,当前仅支持creator发布的微信小游戏情况,仅混淆主体JS文件project.js(debug模式下是project.dev.js)
请务必确认tywxTools的放置位置不要出错!!!
请务必确认最终提审上线的版本经过JS混淆!!!

creator以外其他开发环境的混淆脚本会陆续进行开发,小程序版本的混淆脚本涉及到一些pages等结构,和小游戏有所不同,后续会给出混淆方案和混淆脚本