import Dungeon from "../Dungeon";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Wall extends cc.Component {

    pos:cc.Vec2;
    half = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let ss = this.node.getComponentsInChildren(cc.Sprite);
            for (let i = 0; i < ss.length; i++) {
                if (ss[i].spriteFrame) {
                    ss[i].spriteFrame.getTexture().setAliasTexParameters();
                }
            }
    }
    setPos(pos:cc.Vec2){
        this.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
    }
    start () {
        this.node.opacity = 255;
    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider) {
        this.node.opacity = 255;
    }
    onCollisionStay(other:cc.Collider,self:cc.Collider) {
        if(other.tag == 3||other.tag == 4){
            this.node.opacity = 128;
        }
    }
    onCollisionExit(other:cc.Collider,self:cc.Collider) {
        this.node.opacity = 255;
    }
    // update (dt) {}
}
