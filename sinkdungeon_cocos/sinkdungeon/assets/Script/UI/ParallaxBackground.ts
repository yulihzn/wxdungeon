import Player from "../Player";
import Dungeon from "../Dungeon";
import Logic from "../Logic";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ParallexBackground extends cc.Component {

    @property(cc.Node)
    background:cc.Node = null;
    @property(cc.Node)
    layer1:cc.Node = null;
    @property(cc.Node)
    layer2:cc.Node = null;
    player:Player;
    init(){
        this.layer1.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrames[`chapter0${Logic.chapterIndex}layer1`];
        this.layer2.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrames[`chapter0${Logic.chapterIndex}layer2`];
    }
    getPlayer():Player{
        if(!this.player){
            this.player = this.node.parent.getComponent(Dungeon).player;
        }
        return this.player;
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    lateUpdate(){
        let targetPos = this.getPlayer().node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        this.layer1.position = this.lerp(this.layer1.position,this.node.convertToNodeSpaceAR(targetPos),0.005);
        this.layer2.position = this.lerp(this.layer2.position,this.node.convertToNodeSpaceAR(targetPos),0.015);
    }
    lerp(self:cc.Vec3,to:cc.Vec3, ratio:number):cc.Vec3 {
        let out = cc.v3(0,0);
        let x = self.x;
        let y = self.y;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        return out;
    }
}
