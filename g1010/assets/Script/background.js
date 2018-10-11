// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var offx=70;
var offy=780;
var kuaisize=50;
var bgkuaiinfo=function(id){
    this.id=id;
    this.value=0;
    this.node=null;
    this.sprite=null;
    this.highlight=false;
    this.flashtick=-1;
    this.px = offx+parseInt(id%10)*kuaisize;
    this.py = offy-parseInt(id/10)*kuaisize;
}

var pieceinfo=function(w,h,v){
    this.w=w;
    this.h=h;
    this.mask=new Array(w*h);
    for(var i=0;i<w*h;i++){
        this.mask[i]=v[i];
    }
}

var piecelist=[
    new pieceinfo(1,1,[1]),
    new pieceinfo(2,1,[1,1]),
    new pieceinfo(1,2,[1,1]),
    new pieceinfo(2,2,[1,1,1,1]),
    new pieceinfo(2,2,[0,1,1,1]),
    new pieceinfo(2,2,[1,0,1,1]),
    new pieceinfo(2,2,[1,1,0,1]),
    new pieceinfo(2,2,[1,1,1,0]),
    new pieceinfo(3,1,[1,1,1]),
    new pieceinfo(1,3,[1,1,1]),
    new pieceinfo(3,3,[ 1,1,1,
                        1,1,1,
                        1,1,1 ]),
    new pieceinfo(3,3,[ 1,1,1,
                        1,0,0,
                        1,0,0 ]),
    new pieceinfo(3,3,[ 1,0,0,
                        1,0,0,
                        1,1,1 ]),
    new pieceinfo(3,3,[ 0,0,1,
                        0,0,1,
                        1,1,1 ]),
    new pieceinfo(3,3,[ 1,1,1,
                        0,0,1,
                        0,0,1 ]),
    new pieceinfo(4,1,[1,1,1,1]),
    new pieceinfo(1,4,[1,1,1,1]),
    new pieceinfo(5,1,[1,1,1,1,1]),
    new pieceinfo(1,5,[1,1,1,1,1])
];

var block=function(pid,cid){
    this.pid=pid;
    this.cid=cid;
    this.bclean=false;
};

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        gameoverlabel: {
            default: null,
            type: cc.Label
        },
        scorelabel: {
            default: null,
            type: cc.Label
        },
        bkdata: [],
        framecnt: 0,
        texturelist: {
            default: [],
            type: ["String"]
        },
        texlist:{
            default:[],
            type:cc.Texture2D
        },
        blocklist:{
            default:[],
            type:cc.Node
        },
        mousestate:-1,
        btrysetvalue_ret:false,
        score:0,
        lianji:0,
        combo:0,
        gameover:false,
        gameoverstr:'游戏结束',
        restartbtn: cc.Button
    },


     // LIFE-CYCLE CALLBACKS:
    onLoad () {
        var len =this.texturelist.length;
        for(var i=0;i<len;i++){
            var str = 'resources/'+this.texturelist[i];
            var url = cc.url.raw(str);
            var tex=cc.textureCache.addImage(url);
            this.texlist.push(tex);
        }

        for(var i=0;i<100;i++){
            var kuai = new bgkuaiinfo(i);

            kuai.node = new cc.Node('Sprite');
            kuai.sprite= kuai.node.addComponent(cc.Sprite);
            //kuai.sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/k1.png'));
            kuai.sprite.spriteFrame = new cc.SpriteFrame();
            kuai.sprite.spriteFrame.setTexture(this.texlist[0]);
            kuai.node.x=kuai.px-this.node.width/2+kuaisize/2;
            kuai.node.y=kuai.py-this.node.height/2+kuaisize/2;
            this.node.addChild(kuai.node);

            this.bkdata.push(kuai);
        }

        for(var i=0;i<3;i++){
            var blocknote = new cc.Node('block');
            blocknote.width = 125;
            blocknote.height = 125;
            blocknote.y = -360;
            blocknote.x = -160+i*160;
            blocknote.tmpdata = new block(0,0);
            this.node.addChild(blocknote);
            this.blocklist.push(blocknote);
        }
        this.createblock(0);
        this.createblock(1);
        this.createblock(2);


        var self=this;
        var listenerMouse = {
            event: cc.EventListener.MOUSE,
            onMouseDown: function (event) {
                var mpos = event.getLocation()
                //cc.log("点击全局坐标： ",mpos.x,mpos.y)
                self.onctrldown(mpos.x,mpos.y);
            },
            onMouseUp: function (event) {
                var mpos = event.getLocation();
                self.onctrlup(mpos.x,mpos.y);
            },
            onMouseMove: function (event) {
                var mpos = event.getLocation();
                self.onctrlmove(mpos.x,mpos.y);
            }
        }

        var listenerTouch = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touches, event) {
                var mpos = event.getLocation()
                self.onctrldown(mpos.x,mpos.y);
                return true;
            },
            onTouchMoved: function (touches, event) {
                var mpos = event.getLocation();
                self.onctrlmove(mpos.x,mpos.y);
            },
            onTouchEnded: function (touches, event) {
                var mpos = event.getLocation();
                self.onctrlup(mpos.x,mpos.y);
            }
        }

        if(cc.sys.isMobile==true)
            cc.eventManager.addListener(listenerTouch, this.node);
        else
            cc.eventManager.addListener(listenerMouse, this.node);

        this.restartbtn.node.on('click', this.dorestart, this);
},

    start () {
        this.gameoverlabel.string = this.gameoverstr;
        this.gameoverlabel.node.active=false;
    },

    onctrldown(x,y){
        if(y<=260 && y>=130){
            if(x>=100 && x<=220 && this.blocklist[0].tmpdata.bclean==false){
                this.mousestate=0;
            }else if(x>=260 && x<=380 && this.blocklist[1].tmpdata.bclean==false){
                this.mousestate=1;
            }else if(x>=420 && x<=540 && this.blocklist[2].tmpdata.bclean==false){
                this.mousestate=2;
            }

            if(this.mousestate>=0){
                this.blocklist[this.mousestate].setScale(2);
                this.blocklist[this.mousestate].setPosition(x-320,y-700);
            }
        }
    },

    onctrlup(x,y){
        if(this.mousestate>=0) {
            this.trysetvalue(x,y,this.mousestate);


            this.blocklist[this.mousestate].setScale(1);
            this.blocklist[this.mousestate].setPosition(-160+this.mousestate*160,-360);

            if(this.btrysetvalue_ret==true){
                this.blocklist[this.mousestate].removeAllChildren();
                this.blocklist[this.mousestate].tmpdata.bclean=true;
                this.score+=4;

                this.checkfulllines();
                this.checkbuttonstate();
                this.doprecheck();
            }else{

            }

            this.mousestate = -1;
            this.cleanhighlight();
        }
    },

    onctrlmove(x,y){
        if(this.mousestate>=0) {
            this.blocklist[this.mousestate].setPosition(x-320,y-700);
            this.checkhightlight(x,y,this.mousestate);
        }
    },

    update (dt) {
        this.framecnt++
        this.drawgezi();
        this.frashgezi();
        this.scorelabel.string = this.score;
    },

    drawgezi(){
        var ctx = this.node.getComponent(cc.Graphics);
        ctx.clear();
        for(var i=0;i<100;i++){
            if(this.bkdata[i].highlight == true)
                ctx.rect(this.bkdata[i].px,this.bkdata[i].py,kuaisize,kuaisize);
        }
        ctx.stroke();
    },

    createblock(bid){
        this.blocklist[bid].removeAllChildren();
        var p_cnt= piecelist.length;
        var p_id = parseInt(parseInt(Math.random()*10000)%p_cnt);
        var c_cnt = this.texlist.length-1;
        var c_id = 1+parseInt(parseInt(Math.random()*10000)%c_cnt);
        this.blocklist[bid].tmpdata.pid = p_id;
        this.blocklist[bid].tmpdata.cid = c_id;
        this.blocklist[bid].tmpdata.bclean = false;
        this.createsmallblock(bid,p_id,c_id);
    },

    createsmallblock(bid,pid,cid){
        var v= piecelist[pid];
        for(var i=0;i< v.h;i++){
            for(var j=0;j< v.w;j++){
                var rid = i* v.w+j;
                if(v.mask[rid]==1){
                    var node = new cc.Node('Sprite');
                    var sprite= node.addComponent(cc.Sprite);
                    sprite.spriteFrame = new cc.SpriteFrame();
                    sprite.spriteFrame.setTexture(this.texlist[cid]);
                    node.setScale(0.49);
                    node.x=j*(kuaisize/2)+12.5 - v.w*kuaisize/4;
                    node.y=125-i*(kuaisize/2);
                    this.blocklist[bid].addChild(node);
                }
            }
        }
    },

    cleanhighlight(){
        for(var i=0;i<100;i++){
            this.bkdata[i].highlight = false;
        }
    },

    checkhightlight(x,y,bid){
        this.cleanhighlight();

        var pid = this.blocklist[bid].tmpdata.pid;
        var v = piecelist[pid];
        var rx = x - kuaisize* v.w/2;
        var ry = y + 55;

        var id = -1;
        for(var i=0;i<100;i++){
            if(rx>=this.bkdata[i].px && rx<(this.bkdata[i].px+kuaisize) &&
                ry>=this.bkdata[i].py && ry<(this.bkdata[i].py+kuaisize)){
                id=i;
                break;
            }
        }

        if(id!=-1){
            var i=parseInt(id/10);
            var j=parseInt(id%10);

            var tmp_id1=0;
            var tmp_id2=0;

            if((i+ v.h)<=10 && (j+ v.w)<=10){
                for(var ti =0;ti< v.h;ti++){
                    for(var tj=0;tj< v.w;tj++){
                        tmp_id1 = ti* v.w+tj;
                        tmp_id2 = (ti+i)* 10+(tj+j);
                        if(v.mask[tmp_id1]==1)
                            this.bkdata[tmp_id2].highlight=true;
                    }
                }
            }
        }
    },

    trysetvalue(x,y,bid){
        var pid = this.blocklist[bid].tmpdata.pid;
        var v = piecelist[pid];
        var rx = x - kuaisize* v.w/2;
        var ry = y + 55;

        var id = -1;
        for(var i=0;i<100;i++){
            if(rx>=this.bkdata[i].px && rx<(this.bkdata[i].px+kuaisize) &&
                ry>=this.bkdata[i].py && ry<(this.bkdata[i].py+kuaisize)){
                id=i;
                break;
            }
        }

        if(id==-1){
            this.btrysetvalue_ret=false;
        }else{
            var i=parseInt(id/10);
            var j=parseInt(id%10);

            var tmp_id1=0;
            var tmp_id2=0;
            var canset=true;

            if((i+ v.h)<=10 && (j+ v.w)<=10){
                for(var ti =0;ti< v.h;ti++){
                    if(canset==false)
                        break;
                    for(var tj=0;tj< v.w;tj++){
                        tmp_id1 = ti* v.w+tj;
                        tmp_id2 = (ti+i)* 10+(tj+j);
                        if(v.mask[tmp_id1]==1 && this.bkdata[tmp_id2].value>0){
                            canset=false;
                            break;
                        }
                    }
                }
                if(canset == false){
                    this.btrysetvalue_ret=false;
                }else{
                    for(var ti =0;ti< v.h;ti++){
                        for(var tj=0;tj< v.w;tj++){
                            tmp_id1 = ti* v.w+tj;
                            tmp_id2 = (ti+i)* 10+(tj+j);
                            if(v.mask[tmp_id1]==1 ){
                                this.bkdata[tmp_id2].value=this.blocklist[bid].tmpdata.cid;
                                this.bkdata[tmp_id2].sprite.spriteFrame.setTexture(this.texlist[this.bkdata[tmp_id2].value]);
                            }
                        }
                    }
                    this.btrysetvalue_ret=true;
                }

            }else{
                this.btrysetvalue_ret=false;
            }
        }
    },

    checkoneline(lid){
        var ball=true;

        for(var i=0;i<10;i++){
            if(this.bkdata[lid*10+i].value==0){
                ball=false;
                break;
            }
        }

        if(ball==true){
            for(var i=0;i<10;i++){
                this.bkdata[lid*10+i].flashtick=this.framecnt;
            }
            this.lianji++;
        }
    },

    checkonevirtical(lid){
        var ball=true;

        for(var i=0;i<10;i++){
            if(this.bkdata[i*10+lid].value==0){
                ball=false;
                break;
            }
        }

        if(ball==true){
            for(var i=0;i<10;i++){
                this.bkdata[i*10+lid].flashtick=this.framecnt;
            }
            this.lianji++;
        }
    },

    checkfulllines(){
        this.lianji=0;
        for(var i=0;i<10;i++){
            this.checkoneline(i);
        }
        for(var i=0;i<10;i++){
            this.checkonevirtical(i);
        }

        var tmpscore=0;
        if(this.lianji>0){
            this.combo++;
            for(var i=0;i<this.lianji;i++){
                tmpscore += (1+i)*10;
            }

            tmpscore*=this.combo;
            this.score += tmpscore;

        }else{
            this.combo=0;
        }
    },

    checkbuttonstate(){
        if( this.blocklist[0].tmpdata.bclean == true &&
            this.blocklist[1].tmpdata.bclean == true &&
            this.blocklist[2].tmpdata.bclean == true){
            this.createblock(0);
            this.createblock(1);
            this.createblock(2);
        }
    },

    frashgezi(){
        for(var i=0;i<100;i++){
            if(this.bkdata[i].flashtick>0){
                var cha = this.framecnt - this.bkdata[i].flashtick;

                if(cha>=60){
                    this.bkdata[i].flashtick=0;
                    this.bkdata[i].value=0;
                    this.bkdata[i].sprite.spriteFrame.setTexture(this.texlist[0]);
                    this.bkdata[i].node.active=true;
                }else{
                    if(cha%20<10){
                        if(this.bkdata[i].node.active == true)
                            this.bkdata[i].node.active=false;
                    }else{
                        if(this.bkdata[i].node.active == false)
                            this.bkdata[i].node.active=true;
                    }
                }
            }
        }
    },

    doprecheck(){
        this.gameover=true;
        var tmpid=0;
        while(this.gameover==true && tmpid<3){
            this.doprecheckoneblock(tmpid);
            tmpid++;
        }
        if(this.gameover==true){
            this.dogameover();
        }
    },

    dogameover(){
        this.gameoverlabel.node.active=true;
    },

    doprecheckoneblock(bid){
        var pid = this.blocklist[bid].tmpdata.pid;
        var v = piecelist[pid];

        var tmp_id1=0;
        var tmp_id2=0;
        var canset=true;

        if(this.blocklist[bid].tmpdata.bclean == false){
            for(var i=0;i<10;i++){
                if((i+ v.h)>10 || this.gameover==false)
                    break;
                for(var j=0;j<10;j++){
                    if((j+ v.w)>10){
                        break;
                    }

                    canset=true;

                    for(var ti =0;ti< v.h;ti++){
                        for(var tj=0;tj< v.w;tj++){
                            tmp_id1 = ti* v.w+tj;
                            tmp_id2 = (ti+i)* 10+(tj+j);
                            if(v.mask[tmp_id1]==1 && this.bkdata[tmp_id2].value>0 && this.bkdata[tmp_id2].flashtick<=0){
                                canset=false;
                            }
                        }
                    }

                    if(canset==true){
                        this.gameover=false;
                        break;
                    }
                }
            }
        }
    },

    /*aa:function(){
        return 1;
    }*/
    dorestart:function (event) {

        for(var i=0;i<100;i++){
            this.bkdata[i].highlight = false;
            this.bkdata[i].flashtick = 0;
            this.bkdata[i].value=0;
            this.bkdata[i].sprite.spriteFrame.setTexture(this.texlist[0]);
            this.bkdata[i].node.active=true;
        }
        this.gameover=false;
        this.gameoverlabel.node.active=false;
        this.score=0;
        this.lianji=0;
        this.combo=0;
        this.createblock(0);
        this.createblock(1);
        this.createblock(2);
    }

});
