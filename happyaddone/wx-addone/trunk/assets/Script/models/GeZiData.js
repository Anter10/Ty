/*
    每个格子的单元数据:
    created by gyc on 2018-08-01.
*/
var config = require("AddOneConfig")

module.exports = (function(parent){
    // 格子显示的颜色
    this.color = null;
    // 格子显示的数字
    this.num  = 0;
    // 格子的X位置
    this.posx = 0;
    // 格子的Y位置
    this.posy = 0;
    // 格子的目标位置X
    this.destx=0;
    // 格子的目标位置Y
    this.desty=0;
    // 格子动作持续时间
    this.actiontime_keep=0;
    // 各自的移动速度
    this.speed_keep=0;
    this.id_keep=-1;
    this.id_dest=-1;
    this.parent= parent;
    this.speedx=0;
    this.speedy=0;
    this.actiontime=0;

    this.effectid=-1;
    this.effecttime=0;
    
    /*
        调用: GeZi中调用
        功能: 更新格子的颜色和显示数字
        参数: [
            c: 格子显示的颜色
            n: 显示的数字
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    this.setinfo=function(c,n){
        this.color=c;
        this.num=n;
    }

    /*
        调用: GeZi中调用
        功能: 更新格子x,y坐标
        参数: [
            x: 格子的x坐标
            y: 格子的y坐标
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    this.setpos=function(x,y){
        this.posx=x;
        this.posy=y;
    }

    /*
        调用: GeZi中调用
        功能: 更新格子的颜色和显示数字
        参数: [
            spx: x方向的速度
            spy: y方向的速度
            t: 持续时间
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    this.setspeed=function(spx,spy,t){
        this.speedx=spx;
        this.speedy=spy;
        this.actiontime=t;
    }
    
    /*
        调用: GeZi中调用
        功能: 更新格子的目标坐标
        参数: [
            x: 格子的x目标坐标
            y: 格子的y目标坐标
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    this.setdest=function(x,y){
        this.destx=x;
        this.desty=y;
    }
    
      /*
        调用: GeZiData, gamemain中调用
        功能: 调整格子移动
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
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

        this.destx=this.parent.getAllgz()[this.id_dest].posx;
        this.desty=this.parent.getAllgz()[this.id_dest].posy;
    }
   
    /*
        调用: gamemain中调用
        功能: 调整格子掉落
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    this.adjustdrop=function(){
        if(this.id_dest==-1)
            return;
        config = tywx.config != null?tywx.config : config;
        this.actiontime=config.move_time;
        this.speedx = 0;
        this.speedy = -this.speed_keep;
        this.destx=this.parent.getAllgz()[this.id_dest].posx;
        this.desty=this.parent.getAllgz()[this.id_dest].posy;
    }
   
   /*
        调用: gamemain中调用
        功能: 格子移动
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
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
                this.id_dest = this.parent.getAllmask()[this.id_dest].from;
                this.adjustmove();
            }
        }
    }
    
     /*
        调用: gamemain中调用
        功能: 格子移动
        参数: [
            dt: update传进来的值
            spr0:星星1的节点
            spr1:星星2的节点
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    this.tickeffect = function(dt,spr0,spr1){
        // if(this.effectid >= 0 && this.effecttime > 0){
        //    if(this.effectid==1){
        //         spr1.node.x = this.posx + config.gezi_size / 2;
        //         spr1.node.y = this.posy + config.gezi_size / 2;

        //         spr1.node.setScale(1 - this.effecttime);
        //         if(spr1.node.active == false){
        //            spr1.node.active = true;
        //         }
        //     }

        //     this.effecttime -= dt;

        //     if(this.effecttime <= 0){
        //         this.effecttime = 0;
        //         if(spr0.node.active == true && this.effectid==0){
        //             spr0.node.active = false;
        //         }
        //         if(spr1.node.active == true && this.effectid==1){
        //             spr1.node.active = false;
        //         }
        //         this.effectid = -1;
        //     }
        // }
    }
});

















