
tywx.StarControl = {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init : function () {
        this.nodepool = new cc.NodePool();
        var self = this;
        this.curNodeArray = [];
        console.log("--------init--------------------");
        this.isAniPlay = false;
        this.prefabStar = null;
        
        cc.loader.loadRes("prefab/starnode", cc.Prefab, function (err, prefab) {
            console.log("load prefab sucess ++++++++++++++++ ");
        	if (prefab instanceof cc.Prefab) {
                for (var i =10; i >= 0; --i) {
                    var newNode = cc.instantiate(prefab);
                    self.nodepool.put(newNode);
                }
                self.prefabStar = prefab;
        	}
        });
    },


    createStars : function (node, starnum, getnum, startype) {
        if(!node)
            return;
        if(node.getChildrenCount() > 0)
            return;
        if(!starnum || starnum > 1000)
            return;
        if(!getnum)
            getnum = 0;

        if(this.nodepool.size() === 0)
            return;
        this.isAniPlay = false;
        console.log("fengbing", " *-*-*- create stars *-*-*- "+starnum+'  getnum  '+getnum);

        this.clearNodes();
        this.getnum = getnum;
        var width = startype === 0 ? 10 : 46 + 32 ;
        var totalwidth = (starnum-0.5)*(width+14);
        
        for(var i=0; i<starnum; i++){
            var star = this.nodepool.get();
            //var star = cc.instantiate(this.prefabStar);
            var jsstar = star.getComponent("star");
            jsstar.init(startype, getnum>i ? 1: 0);
            star.setPosition(cc.p(-totalwidth*0.5+i*(width+14), 0));
            this.curNodeArray.push(star);
            node.addChild(star);
        }
        console.log("fengbing", " *-*-*- create stars *-*-*- end");

    },


    playAddStarAni : function () {
        if(this.isAniPlay || this.curNodeArray.length==0)
            return;

        if(this.getnum<=0)
            return;
        this.isAniPlay = true;
        var node = this.curNodeArray[this.getnum-1];
        var jsstar = node.getComponent("star");
        // console.log("fengbing", " -*-*-*- play add star ani *-*-*-*-");
        jsstar.playAniAdd();
    },

    playDelStarAni : function () {
        if(this.isAniPlay || this.curNodeArray.length==0)
            return;

        if(this.getnum>=this.curNodeArray.length)
            return;
        this.isAniPlay = true;
        var node = this.curNodeArray[this.getnum];
        if(node) {
            console.log("fengbing", " -*-*-*- play del star ani *-*-*-*-");
            var jsstar = node.getComponent("star");
            jsstar.playAnidel();
        }
    },

    clearNodes : function () {
        var self = this;
        this.getnum = -1;
        this.isAniPlay = false;
        while (this.curNodeArray.length>0){
            var node = this.curNodeArray.shift();
            node.removeFromParent();
            self.nodepool.put(node);
        }
    },

    // update (dt) {},
};
