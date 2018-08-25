
var gezi_size=132; //每个格子的大小
var gezi_pitch=140; //每个格子+间隙的大小
var move_time=0.3;//格子一栋/掉落所需的时间
var color_list=[  //各自颜色，RGB
    233,85,56,
    255,128,64,
    44,175,219,
    165,198,31,
    23,177,167,
    0,128,0,
    0,0,128,
    128,0,0,
    128,64,32,
    128,0,128,
    32,32,32
];

var block=function(){  //格子的色块属性（颜色，移动，数字）
    this.color=null;
    this.num=0;

    this.posx=0;
    this.posy=0;

    this.destx=0;
    this.desty=0;

    this.actiontime_keep=0;
    this.speed_keep=0;
    this.id_keep=-1;
    this.id_dest=-1;

    this.speedx=0;
    this.speedy=0;
    this.actiontime=0;

    this.effectid=-1;
    this.effecttime=0;

    this.setinfo=function(c,n){
        this.color=c;
        this.num=n;
    }

    this.setpos=function(x,y){
        this.posx=x;
        this.posy=y;
    }

    this.setspeed=function(spx,spy,t){
        this.speedx=spx;
        this.speedy=spy;
        this.actiontime=t;
    }

    this.setdest=function(x,y){
        this.destx=x;
        this.desty=y;
    }

    this.adjustmove=function(){
        if(this.id_dest==-1)
            return;

        this.actiontime = this.actiontime_keep;
        var alp = this.id_dest - this.id_keep;
        if(alp==1){
            this.speedx = this.speed_keep;
            this.speedy = 0;
        }else if(alp==5){
            this.speedx = 0;
            this.speedy = this.speed_keep;
        }else if(alp==-1){
            this.speedx = -this.speed_keep;
            this.speedy = 0;
        }else if(alp==-5){
            this.speedx = 0;
            this.speedy = -this.speed_keep;
        }

        this.destx=g_gezi[this.id_dest].posx;
        this.desty=g_gezi[this.id_dest].posy;
    }

    this.adjustdrop=function(){
        if(this.id_dest==-1)
            return;

        this.actiontime=move_time;
        this.speedx = 0;
        this.speedy = -this.speed_keep;

        this.destx=g_gezi[this.id_dest].posx;
        this.desty=g_gezi[this.id_dest].posy;
    }

    this.tickmove=function(dt){
        if(this.actiontime>0){
            this.actiontime -= dt;

            this.posx += this.speedx*dt;
            this.posy += this.speedy*dt;

            if(this.actiontime<=0){
                this.posx = this.destx;
                this.posy = this.desty;
                this.speedx = 0;
                this.speedy = 0;
                this.id_keep = this.id_dest;
                this.id_dest = g_mask[this.id_dest].from;
                this.adjustmove();
            }
        }
    }

    this.tickeffect=function(dt,spr0,spr1){
        if(this.effectid >= 0 && this.effecttime>0){
            if(this.effectid==0){
                spr0.node.x=this.posx+gezi_size/2;
                spr0.node.y=this.posy+gezi_size/2;

                spr0.node.setRotation(this.effecttime*720) ;
                if(spr0.node.active == false)
                    spr0.node.active = true;
            }
            else if(this.effectid==1){
                spr1.node.x=this.posx+gezi_size/2;
                spr1.node.y=this.posy+gezi_size/2;

                spr1.node.setScale(1 - this.effecttime);
                if(spr1.node.active == false)
                    spr1.node.active = true;
            }

            this.effecttime -= dt;

            if(this.effecttime<=0){
                this.effecttime=0;

                if(spr0.node.active == true && this.effectid==0)
                    spr0.node.active = false;
                if(spr1.node.active == true && this.effectid==1)
                    spr1.node.active = false;

                this.effectid=-1;
            }
        }
    }
}


var gezi=function(id){ //真实的格子，定义他的数字和颜色，色块的所有者
    this.id=id;
    this.color=cc.color(0,0,0,0);
    this.num=0;

    this.posx=20+(id%5)*gezi_pitch;
    this.posy=180+parseInt(id/5)*gezi_pitch;

    this.block=new block();

    this.setnum=function(num){
        this.num=num;
        var colcnt = color_list.length/3;
        var colid = (this.num-1)%colcnt;
        this.color=cc.color(color_list[colid*3],color_list[colid*3+1],color_list[colid*3+2]);
    }

    this.settoblock=function(){
        this.block.setinfo(this.color,this.num);
        this.block.setpos(this.posx,this.posy);
    }

    this.settoblockvalue=function(){
        this.block.setinfo(this.color,this.num);
    }

    this.draw=function(ctx,lable){
        ctx.fillColor = this.block.color;
        ctx.roundRect(this.block.posx,this.block.posy,gezi_size,gezi_size,8);
        ctx.fill();

        lable.string = this.block.num;
        lable.node.x = this.block.posx-360+gezi_size/2;
        lable.node.y = this.block.posy-640+gezi_size/2;
    }
}

var g_gezi=[];

var mask=function(id){//用于路径搜索的地图mask
    this.id= id;

    var g= g_gezi[id];
    this.num = g.num;

    this.x = this.id%5;
    this.y = parseInt(this.id/5);

    this.from=-1;
    this.step=999;

    this.reset=function(){
        var g= g_gezi[this.id];
        this.num = g.num;

        this.x = this.id%5;
        this.y = parseInt(this.id/5);

        this.from=-1;
        this.step=999;
    }
}

var g_mask=[];
var g_mask_samecnt=0;
var g_clickid=-1;

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        num: {
            default: [],
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        score: 0,  //得分
        point:5,   //体力
        bg:cc.Node,
        gamestate:'null', //游戏状态-无，等待点击，移动，下落等
        gamestatetime:0, //游戏状态的计时
        maxnum:5, //当前最大值
        lianji:1, //连击数
        restart:cc.Button,
        GameOver: {
            default: null,
            type: cc.Label
        },
        star:cc.Sprite, //点击+1的动画sprite
        star1:cc.Sprite //组合+1的动画sprite
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.score;

        for(var i=0;i<25;i++)
        {
            var node =new cc.Node("node");
            var label=node.addComponent(cc.Label);
            label.string="";
            label.fontSize = 64;
            label.lineHeight=64;
            var color=new cc.color(255,255,255,255);
            node.position=cc.p(0,0);
            node.color=color;
            node.parent = this.node;
            this.num.push(label);

            var tmp_g = new gezi(i);
            g_gezi.push(tmp_g);

            var tmp_m =new mask(i);
            g_mask.push(tmp_m);
        }

        var self=this;
        /*this.node.on('mouseup', function ( event ) {
            var mpos = event.getLocation();
            self.onctrlup(mpos.x,mpos.y);
        });*/
        this.node.on('touchend', function ( event ) {
            var mpos = event.touch.getLocation();
            self.onctrlup(mpos.x,mpos.y);
        });

        this.restart.node.on('click', this.initgame, this);

        this.initgame();
    },

    onctrlup:function(x,y){
        if(this.gamestate=='waitclick'){
            for(var i=0;i<25;i++){
                if( x>g_gezi[i].posx && x<(g_gezi[i].posx+gezi_size) &&
                    y>g_gezi[i].posy && y<(g_gezi[i].posy+gezi_size)){

                    var  num = g_gezi[i].num+1;
                    g_gezi[i].setnum(num);
                    g_gezi[i].settoblock();

                    g_gezi[i].block.effectid=0;
                    g_gezi[i].block.effecttime=0.5;

                    if(num > this.maxnum)
                        this.maxnum = num;

                    g_clickid=i;

                    this.gamestate = 'checkclick'

                    break;
                }
            }
        }
    },

    // called every frame
    update: function (dt) {
        this.label.string = this.score;
        this.drawpoint();

        var ctx = this.bg.getComponent(cc.Graphics);

        if(g_gezi.length==25) {
            for (var i = 0; i < 25; i++) {
                g_gezi[i].block.tickmove(dt);
                g_gezi[i].block.tickeffect(dt,this.star,this.star1);
                g_gezi[i].draw(ctx,this.num[i]);
            }
        }

        switch (this.gamestate){
            case 'checkclick':{   //获取玩家点击的格子，+1并进入下一个状态，有组合移动或者体力-1，如果体力为0，游戏结束
                this.resetmask();
                var sc = g_gezi[g_clickid].num;
                this.lianji=1;
                this.checkmaskbyid(g_clickid, 0);
                if (g_mask_samecnt >= 3) {
                    this.gamestate = 'domove';
                    this.gamestatetime = move_time;
                    this.score += 10*(g_mask_samecnt-1)*sc;

                    for(var i=0;i<25;i++){
                        if(g_mask[i].step!=999 && g_mask[i].step!=0){
                            g_gezi[i].block.speed_keep = gezi_pitch*g_mask[i].step/move_time;
                            g_gezi[i].block.actiontime_keep = move_time/g_mask[i].step;
                            g_gezi[i].block.id_keep = i;
                            g_gezi[i].block.id_dest = g_mask[i].from;
                            g_gezi[i].block.adjustmove();
                        }
                    }

                }else{
                    this.gamestate = 'waitclick';
                    this.point--;

                    if(this.point<=0) {
                        this.gamestate = 'gameover';
                        this.restart.node.active = true;
                        this.GameOver.node.active = true;
                    }
                }
                break;
            }
            case 'domove':{//格子组合移动，进入掉落状态
                this.gamestatetime -= dt;
                if(this.gamestatetime <= 0){
                    this.star.node.active = false;
                    this.gamestate = 'dodrop';
                    this.gamestatetime = move_time;

                    var num = g_gezi[g_clickid].num+1;
                    g_gezi[g_clickid].setnum(num);
                    g_gezi[g_clickid].settoblock();

                    g_gezi[g_clickid].block.effectid=1;
                    g_gezi[g_clickid].block.effecttime=0.5;

                    if(num > this.maxnum)
                        this.maxnum = num;

                    this.refreshbymask();
                }
                break;
            }
            case 'dodrop'://格子掉落完，进入再次检查合并状态，或者等待点击状态
            {
                this.gamestatetime -= dt;
                if(this.gamestatetime <= 0){

                    var bfound = false;

                    for(var j =0;j<25;j++){
                        this.resetmask();
                        var sc =g_gezi[j].num;
                        this.checkmaskbyid(j, 0);
                        if (g_mask_samecnt >= 3) {
                            this.gamestate = 'domove';
                            this.gamestatetime = move_time;
                            this.lianji++;
                            this.score += 10*sc*(g_mask_samecnt-1);


                            for(var i=0;i<25;i++){
                                if(g_mask[i].step!=999 && g_mask[i].step!=0){
                                    g_gezi[i].block.speed_keep = gezi_pitch*g_mask[i].step/move_time;
                                    g_gezi[i].block.actiontime_keep = move_time/g_mask[i].step;
                                    g_gezi[i].block.id_keep = i;
                                    g_gezi[i].block.id_dest = g_mask[i].from;
                                    g_gezi[i].block.adjustmove();
                                }
                            }

                            bfound=true;
                            g_clickid = j;

                            if(this.point<5)
                                this.point++;
                            break;
                        }
                    }

                    if(bfound == false){
                        this.gamestate = 'waitclick';
                    }

                }
                break;
            }
        }
    },

    drawpoint:function(){
        var ctx = this.bg.getComponent(cc.Graphics);
        ctx.clear();

        ctx.fillColor = cc.color(0,255,255,255);
        for(var i=0;i<this.point;i++){
            var x = 20+gezi_pitch*i;
            var y = 980;
            var w = 130;
            var h = 40;
            ctx.roundRect(x,y,w,h,12);
            ctx.fill();
        }
    },

    initgame:function() {//开始游戏，建立棋盘
        this.score = 0;
        this.point=5;
        this.maxnum = 5;

        for (var i = 0; i < 25; i++) {
            var num = this.getrandomnum();
            g_gezi[i].setnum(num);
            g_gezi[i].settoblock();
        }

        var needcheck=true;

        while(needcheck==true) {
            needcheck=false;
            for (var i = 0; i < 25; i++) {
                this.resetmask();
                this.checkmaskbyid(i, 0);
                if (g_mask_samecnt >= 3) {
                    this.changenumbymask();
                    needcheck=true;
                }
            }
        }

        this.gamestate='waitclick';
        this.restart.node.active = false;
        this.GameOver.node.active = false;

    },

    resetmask:function(){//重置棋盘mask，为重新探路做准备
        for(var i=0;i<25;i++){
            g_mask[i].reset();
        }
        g_mask_samecnt=1;
    },

    checkmaskbyid:function(id,step){ //递归探路
        g_mask[id].step=step;

        if(this.checkmaskleft(id,step)==true){
            this.checkmaskbyid(id-1,step+1);
        }
        if(this.checkmaskdown(id,step)==true){
            this.checkmaskbyid(id-5,step+1);
        }
        if(this.checkmaskright(id,step)==true){
            this.checkmaskbyid(id+1,step+1);
        }
        if(this.checkmaskup(id,step)==true){
            this.checkmaskbyid(id+5,step+1);
        }
    },

    checkmaskleft:function(id,step){
        if(g_mask[id].x==0)
            return false;

        if(g_mask[id-1].num!=g_mask[id].num)
            return false;

        if(g_mask[id-1].step<=step)
            return false;

        if(g_mask[id-1].step==999)
            g_mask_samecnt++;

        g_mask[id - 1].step = step;
        g_mask[id - 1].from = id;

        return true;
    },

    checkmaskright:function(id,step){
        if(g_mask[id].x==4)
            return false;

        if(g_mask[id+1].num!=g_mask[id].num)
            return false;

        if(g_mask[id+1].step<=step)
            return false;

        if(g_mask[id+1].step==999)
            g_mask_samecnt++;

        g_mask[id + 1].step = step;
        g_mask[id + 1].from = id;

        return true;
    },

    checkmaskdown:function(id,step){
        if(g_mask[id].y==0)
            return false;

        if(g_mask[id-5].num!=g_mask[id].num)
            return false;

        if(g_mask[id-5].step<=step)
            return false;

        if(g_mask[id-5].step==999)
            g_mask_samecnt++;

        g_mask[id - 5].step = step;
        g_mask[id - 5].from = id;

        return true;
    },

    checkmaskup:function(id,step){
        if(g_mask[id].y==4)
            return false;

        if(g_mask[id+5].num!=g_mask[id].num)
            return false;

        if(g_mask[id+5].step<=step)
            return false;

        if(g_mask[id+5].step==999)
            g_mask_samecnt++;

        g_mask[id + 5].step = step;
        g_mask[id + 5].from = id;

        return true;
    },

    changenumbymask:function(){
        for(var i=0;i<25;i++){
            if(g_mask[i].step!=999 && g_mask[i].step!=0){
                var num = this.getrandomnum();
                g_gezi[i].setnum(num);
                g_gezi[i].settoblock();
            }
        }
    },

    getrandomnum:function(){//创建随机的新块
        var tnum = this.maxnum-2;
        if(tnum<5)
            tnum = 5;

        var num = parseInt(Math.random() * 10000) % tnum + 1;
        return num;
    },

    refreshbymask:function(){ //创建新的棋盘，为掉落做准备
        for(var i=0;i<25;i++) {
            if (g_mask[i].step != 999 && g_mask[i].step != 0) {
                g_mask[i].from=-1;

                var topid=-1;
                var tmpid = i+5;
                while(tmpid<25){
                    if(g_mask[tmpid].step == 999 || g_mask[tmpid].step==0){
                        topid = tmpid;
                        break;
                    }
                    tmpid+=5;
                }

                if(topid!=-1){
                    var dis = g_mask[topid].y-g_mask[i].y;
                    g_gezi[i].block.posx = g_gezi[topid].posx;
                    g_gezi[i].block.posy = g_gezi[topid].posy;
                    g_gezi[i].block.id_keep = topid;
                    g_gezi[i].block.id_dest = i;
                    g_gezi[i].block.speed_keep = (dis*gezi_pitch)/move_time;
                    g_gezi[i].block.adjustdrop();
                    g_mask[topid].step=888;
                    g_gezi[i].setnum(g_gezi[topid].num);
                    g_gezi[i].settoblockvalue();

                    g_gezi[i].block.effectid=g_gezi[topid].block.effectid;
                    g_gezi[i].block.effecttime=g_gezi[topid].block.effecttime;
                    g_gezi[topid].block.effectid=-1;
                    g_gezi[topid].block.effecttime=0;
                }else{
                    var dis = 5-g_mask[i].y;
                    g_gezi[i].block.posx = g_gezi[i].posx;
                    g_gezi[i].block.posy = g_gezi[i].posy+dis*gezi_pitch;
                    g_gezi[i].block.id_keep = -1;
                    g_gezi[i].block.id_dest = i;
                    g_gezi[i].block.speed_keep = (dis*gezi_pitch)/move_time;
                    g_gezi[i].block.adjustdrop();

                    var num = this.getrandomnum();
                    g_gezi[i].setnum(num);
                    g_gezi[i].settoblockvalue();
                }
            }
        }
    }
});
