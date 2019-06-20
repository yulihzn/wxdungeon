import Dungeon from "../Dungeon";
import { EventConstant } from "../EventConstant";
import Player from "../Player";
import DamageData from "../Data/DamageData";
import Building from "./Building";


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
export default class Trap extends Building {

    @property(cc.SpriteFrame)
    openSpriteFrame:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    closeSpriteFrame:cc.SpriteFrame = null;
    isOpen:boolean = false;
    pos:cc.Vec2 = cc.v2(0,0);
    private sprite: cc.Node;
    private timeDelay = 0;
    isPlayerIn = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sprite = this.node.getChildByName('sprite');
    }

    start () {
        
    }
    
    setPos(pos:cc.Vec2){
        this.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - pos.y) * 10+1;
    }
    
    openTrap(){
        if(this.isOpen){
            return;
        }
        this.isOpen = true;
        // this.openSpriteFrame.getTexture().setAliasTexParameters();
        this.sprite.getComponent(cc.Sprite).spriteFrame = this.openSpriteFrame;
        this.scheduleOnce(() => {
            if(this.closeSpriteFrame){
                // this.closeSpriteFrame.getTexture().setAliasTexParameters();
                this.sprite.getComponent(cc.Sprite).spriteFrame = this.closeSpriteFrame;
                this.isOpen = false;
            }
        }, 0.5);
    }
    
    onCollisionStay(other:cc.Collider,self:cc.Collider){
        if(other.tag == 3){
            if(this.isOpen && this.isPlayerIn){
                this.isOpen = false;
                cc.director.emit(EventConstant.PLAYER_TAKEDAMAGE,{detail:{damage:new DamageData(1)}});
            }
        }
    }
    onBeginContact(contact, selfCollider:cc.PhysicsCollider, otherCollider:cc.PhysicsCollider){
        let player = otherCollider.body.node.getComponent(Player);
        if(player){
            this.isPlayerIn = true;
        }
    }
    onEndContact(contact, selfCollider:cc.PhysicsCollider, otherCollider:cc.PhysicsCollider){
        let player = otherCollider.body.node.getComponent(Player);
        if(player){
            this.isPlayerIn = false;
        }
    }

    update (dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 2) {
            this.openTrap();
            this.timeDelay = 0;
        }
    }
    actorName(){
        return '尖刺';
    }
}
