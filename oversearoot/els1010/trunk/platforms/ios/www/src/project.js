__require=function t(e,i,s){function a(r,h){if(!i[r]){if(!e[r]){var c=r.split("/");if(c=c[c.length-1],!e[c]){var n="function"==typeof __require&&__require;if(!h&&n)return n(c,!0);if(o)return o(c,!0);throw new Error("Cannot find module '"+r+"'")}}var l=i[r]={exports:{}};e[r][0].call(l.exports,function(t){return a(e[r][1][t]||t)},l,l.exports,t,e,i,s)}return i[r].exports}for(var o="function"==typeof __require&&__require,r=0;r<s.length;r++)a(s[r]);return a}({HelloWorld:[function(t,e,i){"use strict";cc._RF.push(e,"280c3rsZJJKnZ9RqbALVwtK","HelloWorld"),cc.Class({extends:cc.Component,properties:{label:{default:null,type:cc.Label},text:"Score:"},onLoad:function(){this.label.string=this.text},update:function(t){}}),cc._RF.pop()},{}],background:[function(t,e,i){"use strict";cc._RF.push(e,"f73666sDStJmIhaBMkmYLHD","background");var s=function(t){this.id=t,this.value=0,this.node=null,this.sprite=null,this.highlight=!1,this.flashtick=-1,this.px=70+50*parseInt(t%10),this.py=780-50*parseInt(t/10)},a=function(t,e,i){this.w=t,this.h=e,this.mask=new Array(t*e);for(var s=0;s<t*e;s++)this.mask[s]=i[s]},o=[new a(1,1,[1]),new a(2,1,[1,1]),new a(1,2,[1,1]),new a(2,2,[1,1,1,1]),new a(2,2,[0,1,1,1]),new a(2,2,[1,0,1,1]),new a(2,2,[1,1,0,1]),new a(2,2,[1,1,1,0]),new a(3,1,[1,1,1]),new a(1,3,[1,1,1]),new a(3,3,[1,1,1,1,1,1,1,1,1]),new a(3,3,[1,1,1,1,0,0,1,0,0]),new a(3,3,[1,0,0,1,0,0,1,1,1]),new a(3,3,[0,0,1,0,0,1,1,1,1]),new a(3,3,[1,1,1,0,0,1,0,0,1]),new a(4,1,[1,1,1,1]),new a(1,4,[1,1,1,1]),new a(5,1,[1,1,1,1,1]),new a(1,5,[1,1,1,1,1])],r=function(t,e){this.pid=t,this.cid=e,this.bclean=!1};cc.Class({extends:cc.Component,properties:{gameoverlabel:{default:null,type:cc.Label},scorelabel:{default:null,type:cc.Label},bkdata:[],framecnt:0,texturelist:{default:[],type:["String"]},texlist:{default:[],type:cc.Texture2D},blocklist:{default:[],type:cc.Node},mousestate:-1,btrysetvalue_ret:!1,score:0,lianji:0,combo:0,gameover:!1,gameoverstr:"GameOver",restartbtn:cc.Button},onLoad:function(){this.texturelist.length;for(var t=0;t<100;t++){var e=new s(t);e.node=new cc.Node("Sprite"),e.sprite=e.node.addComponent(cc.Sprite),e.sprite.spriteFrame=new cc.SpriteFrame,e.sprite.spriteFrame.setTexture(this.texlist[0]),e.node.x=e.px-this.node.width/2+25,e.node.y=e.py-this.node.height/2+25,this.node.addChild(e.node),this.bkdata.push(e)}for(t=0;t<3;t++){var i=new cc.Node("block");i.width=125,i.height=125,i.y=-360,i.x=160*t-160,i.tmpdata=new r(0,0),this.node.addChild(i),this.blocklist.push(i)}this.createblock(0),this.createblock(1),this.createblock(2);var a=this,o=(cc.EventListener.MOUSE,{event:cc.EventListener.TOUCH_ONE_BY_ONE,onTouchBegan:function(t,e){var i=t.getLocation();return a.onctrldown(i.x,i.y),!0},onTouchMoved:function(t,e){var i=t.getLocation();a.onctrlmove(i.x,i.y)},onTouchEnded:function(t,e){var i=t.getLocation();a.onctrlup(i.x,i.y)}});cc.eventManager.addListener(o,this.node),this.restartbtn.node.on("click",this.dorestart,this)},start:function(){this.gameoverlabel.string=this.gameoverstr,this.gameoverlabel.node.active=!1},onctrldown:function(t,e){e<=260&&e>=130&&(t>=100&&t<=220&&0==this.blocklist[0].tmpdata.bclean?this.mousestate=0:t>=260&&t<=380&&0==this.blocklist[1].tmpdata.bclean?this.mousestate=1:t>=420&&t<=540&&0==this.blocklist[2].tmpdata.bclean&&(this.mousestate=2),this.mousestate>=0&&(this.blocklist[this.mousestate].setScale(2),this.blocklist[this.mousestate].setPosition(t-320,e-700)))},onctrlup:function(t,e){this.mousestate>=0&&(this.trysetvalue(t,e,this.mousestate),this.blocklist[this.mousestate].setScale(1),this.blocklist[this.mousestate].setPosition(160*this.mousestate-160,-360),1==this.btrysetvalue_ret&&(this.blocklist[this.mousestate].removeAllChildren(),this.blocklist[this.mousestate].tmpdata.bclean=!0,this.score+=4,this.checkfulllines(),this.checkbuttonstate(),this.doprecheck()),this.mousestate=-1,this.cleanhighlight())},onctrlmove:function(t,e){this.mousestate>=0&&(this.blocklist[this.mousestate].setPosition(t-320,e-700),this.checkhightlight(t,e,this.mousestate))},update:function(t){this.framecnt++,this.drawgezi(),this.frashgezi(),this.scorelabel.string=this.score},drawgezi:function(){var t=this.node.getComponent(cc.Graphics);t.clear();for(var e=0;e<100;e++)1==this.bkdata[e].highlight&&t.rect(this.bkdata[e].px,this.bkdata[e].py,50,50);t.stroke()},createblock:function(t){this.blocklist[t].removeAllChildren();var e=o.length,i=parseInt(parseInt(1e4*Math.random())%e),s=this.texlist.length-1,a=1+parseInt(parseInt(1e4*Math.random())%s);this.blocklist[t].tmpdata.pid=i,this.blocklist[t].tmpdata.cid=a,this.blocklist[t].tmpdata.bclean=!1,this.createsmallblock(t,i,a)},createsmallblock:function(t,e,i){for(var s=o[e],a=0;a<s.h;a++)for(var r=0;r<s.w;r++){var h=a*s.w+r;if(1==s.mask[h]){var c=new cc.Node("Sprite"),n=c.addComponent(cc.Sprite);n.spriteFrame=new cc.SpriteFrame,n.spriteFrame.setTexture(this.texlist[i]),c.setScale(.49),c.x=25*r+12.5-50*s.w/4,c.y=125-25*a,this.blocklist[t].addChild(c)}}},cleanhighlight:function(){for(var t=0;t<100;t++)this.bkdata[t].highlight=!1},checkhightlight:function(t,e,i){this.cleanhighlight();for(var s=this.blocklist[i].tmpdata.pid,a=o[s],r=t-50*a.w/2,h=e+55,c=-1,n=0;n<100;n++)if(r>=this.bkdata[n].px&&r<this.bkdata[n].px+50&&h>=this.bkdata[n].py&&h<this.bkdata[n].py+50){c=n;break}if(-1!=c){n=parseInt(c/10);var l=parseInt(c%10),d=0,b=0;if(n+a.h<=10&&l+a.w<=10)for(var u=0;u<a.h;u++)for(var k=0;k<a.w;k++)d=u*a.w+k,b=10*(u+n)+(k+l),1==a.mask[d]&&(this.bkdata[b].highlight=!0)}},trysetvalue:function(t,e,i){for(var s=this.blocklist[i].tmpdata.pid,a=o[s],r=t-50*a.w/2,h=e+55,c=-1,n=0;n<100;n++)if(r>=this.bkdata[n].px&&r<this.bkdata[n].px+50&&h>=this.bkdata[n].py&&h<this.bkdata[n].py+50){c=n;break}if(-1==c)this.btrysetvalue_ret=!1;else{n=parseInt(c/10);var l=parseInt(c%10),d=0,b=0,u=!0;if(n+a.h<=10&&l+a.w<=10){for(var k=0;k<a.h&&0!=u;k++)for(var f=0;f<a.w;f++)if(d=k*a.w+f,b=10*(k+n)+(f+l),1==a.mask[d]&&this.bkdata[b].value>0){u=!1;break}if(0==u)this.btrysetvalue_ret=!1;else{for(k=0;k<a.h;k++)for(f=0;f<a.w;f++)d=k*a.w+f,b=10*(k+n)+(f+l),1==a.mask[d]&&(this.bkdata[b].value=this.blocklist[i].tmpdata.cid,this.bkdata[b].sprite.spriteFrame.setTexture(this.texlist[this.bkdata[b].value]));this.btrysetvalue_ret=!0}}else this.btrysetvalue_ret=!1}},checkoneline:function(t){for(var e=!0,i=0;i<10;i++)if(0==this.bkdata[10*t+i].value){e=!1;break}if(1==e){for(i=0;i<10;i++)this.bkdata[10*t+i].flashtick=this.framecnt;this.lianji++}},checkonevirtical:function(t){for(var e=!0,i=0;i<10;i++)if(0==this.bkdata[10*i+t].value){e=!1;break}if(1==e){for(i=0;i<10;i++)this.bkdata[10*i+t].flashtick=this.framecnt;this.lianji++}},checkfulllines:function(){this.lianji=0;for(var t=0;t<10;t++)this.checkoneline(t);for(t=0;t<10;t++)this.checkonevirtical(t);var e=0;if(this.lianji>0){this.combo++;for(t=0;t<this.lianji;t++)e+=10*(1+t);e*=this.combo,this.score+=e}else this.combo=0},checkbuttonstate:function(){1==this.blocklist[0].tmpdata.bclean&&1==this.blocklist[1].tmpdata.bclean&&1==this.blocklist[2].tmpdata.bclean&&(this.createblock(0),this.createblock(1),this.createblock(2))},frashgezi:function(){for(var t=0;t<100;t++)if(this.bkdata[t].flashtick>0){var e=this.framecnt-this.bkdata[t].flashtick;e>=60?(this.bkdata[t].flashtick=0,this.bkdata[t].value=0,this.bkdata[t].sprite.spriteFrame.setTexture(this.texlist[0]),this.bkdata[t].node.active=!0):e%20<10?1==this.bkdata[t].node.active&&(this.bkdata[t].node.active=!1):0==this.bkdata[t].node.active&&(this.bkdata[t].node.active=!0)}},doprecheck:function(){this.gameover=!0;for(var t=0;1==this.gameover&&t<3;)this.doprecheckoneblock(t),t++;1==this.gameover&&this.dogameover()},dogameover:function(){this.gameoverlabel.node.active=!0},doprecheckoneblock:function(t){var e=this.blocklist[t].tmpdata.pid,i=o[e],s=0,a=0,r=!0;if(0==this.blocklist[t].tmpdata.bclean)for(var h=0;h<10&&!(h+i.h>10||0==this.gameover);h++)for(var c=0;c<10&&!(c+i.w>10);c++){r=!0;for(var n=0;n<i.h;n++)for(var l=0;l<i.w;l++)s=n*i.w+l,a=10*(n+h)+(l+c),1==i.mask[s]&&this.bkdata[a].value>0&&this.bkdata[a].flashtick<=0&&(r=!1);if(1==r){this.gameover=!1;break}}},dorestart:function(t){for(var e=0;e<100;e++)this.bkdata[e].highlight=!1,this.bkdata[e].flashtick=0,this.bkdata[e].value=0,this.bkdata[e].sprite.spriteFrame.setTexture(this.texlist[0]),this.bkdata[e].node.active=!0;this.gameover=!1,this.gameoverlabel.node.active=!1,this.score=0,this.lianji=0,this.combo=0,this.createblock(0),this.createblock(1),this.createblock(2)}}),cc._RF.pop()},{}]},{},["HelloWorld","background"]);