import Player from "../Player";
import DamageData from "../Data/DamageData";
import StatusManager from "../Manager/StatusManager";
import FromData from "../Data/FromData";
import Logic from "../Logic";
import IndexZ from "../Utils/IndexZ";
import Actor from "../Base/Actor";
import ActorUtils from "../Utils/ActorUtils";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class FireGhost extends cc.Component {

    isRotating = false;
    isAttacking = false;
    player: Player;
    angleOffset = 0;
    angle = 0;
    rigidBody: cc.RigidBody;
    isDied = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.rigidBody = this.getComponent(cc.RigidBody);
    }

    start() {

    }
    init(player: Player, angleOffset: number) {
        this.player = player;
        this.node.setPosition(player.node.position.clone());
        this.node.zIndex = IndexZ.OVERHEAD;
        this.angleOffset = angleOffset;
        this.scheduleOnce(() => {
            this.node.setPosition(this.getPlayerFarPosition(this.player, 50, this.angle + this.angleOffset));
            this.isRotating = true;
        }, 0.2);
    }
    getPlayerFarPosition(player: Player, distance: number, angleOffset: number): cc.Vec3 {
        let hv = player.Hv.clone();
        let pos = cc.v3(cc.v2(hv).rotateSelf(angleOffset * Math.PI / 180).mul(distance));
        return player.node.position.clone().addSelf(cc.v3(8, 48).addSelf(pos));
    }

    onCollisionEnter(other: cc.Collider, self: cc.CircleCollider) {
        if (self.radius > 0 && this.isAttacking && this.isRotating) {
            let target = ActorUtils.getEnemyCollisionTarget(other, true);
            if (target) {
                this.isAttacking = false;
                this.attacking(other.node);
            }
        }
    }
    attacking(attackTarget: cc.Node) {
        if (!attackTarget) {
            return;
        }
        let damage = new DamageData();
        let status = StatusManager.BURNING;
        let d = 1;
        damage.magicDamage = d;
        let target = ActorUtils.getEnemyActorByNode(attackTarget, true);
        if (target && !target.sc.isDied) {
            target.takeDamage(damage);
            target.addStatus(status, new FromData());
        }
        this.isDied = true;
        cc.director.emit('destoryfireghost', { detail: { coinNode: this.node } });
    }
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.2) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt) {
        if(Logic.isGamePause){
            return;
        }
        if (this.isCheckTimeDelay(dt)) {
            let pos = this.hasNearEnemy();
            if (!pos.equals(cc.Vec3.ZERO)) {
                this.isAttacking = true;
                let ps = pos.normalizeSelf().mulSelf(400);
                this.rigidBody.linearVelocity = cc.v2(ps.x, ps.y);
            } else if (this.isRotating && this.player) {
                this.angle += 5;
                if (this.angle > 360) {
                    this.angle = 0;
                }
                pos = this.getPlayerFarPosition(this.player, 50, this.angle + this.angleOffset);
                let ps = pos.sub(this.node.position).normalizeSelf().mulSelf(200);
                this.rigidBody.linearVelocity = cc.v2(ps.x, ps.y);
            }
        }
    }

    hasNearEnemy() {
        if (!this.player || !this.isRotating) {
            return cc.Vec3.ZERO;
        }
        let olddis = 1000;
        let pos = cc.v3(0, 0);
        let enemy = ActorUtils.getNearestEnemyActor(this.player,false, this.player.weaponRight.meleeWeapon.dungeon);
        if(enemy){                
            let dis = Logic.getDistance(this.node.position, enemy.node.position);
            if (dis < 400 && dis < olddis && !enemy.sc.isDied && !enemy.sc.isDisguising) {
                olddis = dis;
                let p = this.node.position.clone();
                p.x = this.node.scaleX > 0 ? p.x : -p.x;
                pos = enemy.node.position.sub(p);
            }
        }
        if (olddis != 1000) {
            pos = pos.normalizeSelf();
        }
        return pos;
    }
}
