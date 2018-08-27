
cc.Class({
    extends: cc.Component,
    properties: {
        display: cc.Sprite
    },
    start () {
        this.tex = new cc.Texture2D();
        let openDataContext = wx.getOpenDataContext();
        let openDataCanvas = openDataContext.canvas;
        openDataCanvas.width  = 720;
        openDataCanvas.height = 1280;
        this.methodName = "";
        this.showTag = 0;
    },

    // 悄悄话进入
    showQQHIn(openId, position, size, rotation, font) {
        let methodName = "drawQQHIn";
        this.methodName = methodName;
        if(!window.wx){
           //防止在浏览器中报错
           return;
        }
        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            method : methodName,
            data : {
                openId: openId,
                position: position,
                size: size,
                rotation: rotation,
                font:font,
            },
        });
    },

    // 悄悄话胜利
    showQQHWin(openId) {
        let methodName = "showQQHWin";
        this.methodName = methodName;
        if(!window.wx){
           //防止在浏览器中报错
           return;
        }
        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            method : methodName,
            data : {
                openId:openId
            }
        });
    },

    // 超越好友
    showBeyond(type) {
        let methodName = "showBeyond";
        this.methodName = methodName;
        if(!window.wx){
           return;
        }
        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            method : methodName,
            data:{
                type:type
            }
        });
    },

    cleanOpenData() {
        let methodName = "cleanOpenData";
        this.methodName = methodName;
        if(!window.wx){
           //防止在浏览器中报错
           return;
        }
        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            method : methodName
        });
    },

    // 刷新开放数据域的纹理
    _updateSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        if (!this.texF) {
            this.texF = new cc.SpriteFrame(this.tex);
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = this.texF;
    },

    update () {
        this.showTag ++;
        if (this.showTag % 30 === 0) {
            this._updateSubDomainCanvas();
        }
    },

    onDestroy() {
        this.cleanOpenData();
    }

});