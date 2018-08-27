
let PingBiView = cc.Class({
     extends: cc.Component,

     properties: {
         backGround:{
             default: null,
             type: cc.Node,
         }
     },


     onLoad() {
         this.backGround.on('touchstart', function (event) {
             return true;
         });
     },

     start() {

     },

     // update (dt) {},
 });


 module.exports = PingBiView;