import Logic from "../Logic";
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
export default class FlyWheel extends cc.Component {
    rigidBody:cc.RigidBody;
    dungeon:Dungeon;
    hv:cc.Vec2 = cc.v2(1,0);

    isFlyOut = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.rigidBody = this.getComponent(cc.RigidBody);
    }
    onEnable(){
    }
    
    start () {

    }
   
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.016) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    getPlayerPosition():cc.Vec2{
        return this.dungeon.player.node.position.clone().addSelf(cc.v2(8,48));
    }
    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistance(this.node.position, this.getPlayerPosition());
        return dis;
    }
    show(){
        this.node.active = true;
        this.node.parent = this.dungeon.node;
        this.node.setPosition(this.getPlayerPosition());
        let isRight = this.dungeon.player.isFaceRight;
        let speed = 1000;
        this.rigidBody.linearDamping = 3;
        this.rigidBody.linearVelocity = this.hv.mul(isRight?speed:-speed);
        this.isFlyOut = true;
        this.node.zIndex = 4000;
        this.scheduleOnce(()=>{
            this.isFlyOut = false;
        },0.5)
    }
    hide(){
        this.node.active = false;
        this.rigidBody.linearVelocity = cc.Vec2.ZERO;
    }
    onBeginContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        // this.attacking(otherCollider);
    }
    setHv(hv: cc.Vec2) {
        if(hv.equals(cc.Vec2.ZERO)){
            this.hv = cc.v2(1,0);
        }else{
            this.hv = hv;
        }
    }
    update (dt) { 
        if(this.isCheckTimeDelay(dt)){
            if (this.dungeon.player&&this.node.active && !this.isFlyOut) {
                let p = this.getPlayerPosition();
                p.y+=10;
                let pos = p.sub(this.node.position);
                if (!pos.equals(cc.Vec2.ZERO)) {
                    pos = pos.normalizeSelf();
                    pos = pos.mul(2000);
                    this.rigidBody.linearVelocity = pos;
                    this.rigidBody.linearDamping = 1;
                }
            }
            
        }
        if (this.dungeon&&this.dungeon.player&&this.getNearPlayerDistance(this.dungeon.player.node)<32&&this.node.active&&!this.isFlyOut) {
            this.hide();
        }
    }
}
