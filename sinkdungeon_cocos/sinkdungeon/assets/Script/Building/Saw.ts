import Dungeon from "../Dungeon";
import { EventConstant } from "../EventConstant";
import Player from "../Player";
import DamageData from "../Data/DamageData";
import Building from "./Building";
import StatusManager from "../Manager/StatusManager";
import Random from "../Utils/Random";


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
export default class Saw extends Building {

    @property(cc.SpriteFrame)
    normalSpriteFrame:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    bloodSpriteFrame:cc.SpriteFrame = null;
    pos:cc.Vec2 = cc.v2(0,0);
    private sprite: cc.Sprite;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        this.sprite.spriteFrame = this.normalSpriteFrame;
    }

    start () {
        
    }
    
    setPos(pos:cc.Vec2){
        this.pos = pos;
        let p = Dungeon.getPosInMap(pos);
        this.node.position = cc.v2(p.x,p.y);
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - pos.y) * 10+1;
    }
    
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
            player.takeDamage(new DamageData(1));
            //1/10几率流血
            if(Random.rand()<0.1){
                player.addStatus(StatusManager.BLEEDING);
            }
            this.sprite.spriteFrame = this.bloodSpriteFrame;
        }
    }

    update (dt) {
    }
    actorName(){
        return '锯齿轮';
    }
}
