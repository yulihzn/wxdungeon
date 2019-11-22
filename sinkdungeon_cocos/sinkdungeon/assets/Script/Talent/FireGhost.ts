import Player from "../Player";
import Monster from "../Monster";
import Boss from "../Boss/Boss";
import DamageData from "../Data/DamageData";
import StatusManager from "../Manager/StatusManager";
import Talent from "./Talent";
import FromData from "../Data/FromData";
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
        this.node.zIndex = 5000;
        this.angleOffset = angleOffset;
        this.scheduleOnce(() => {
            this.node.setPosition(this.getPlayerFarPosition(this.player, 50, this.angle + this.angleOffset));
            this.isRotating = true;
        }, 0.2);
    }
    getPlayerFarPosition(player: Player, distance: number, angleOffset: number): cc.Vec2 {
        let hv = player.meleeWeapon.getHv().clone();
        let pos = cc.v2(hv).rotateSelf(angleOffset * Math.PI / 180).mul(distance);
        return player.node.position.clone().addSelf(cc.v2(8, 48).addSelf(pos));
    }

    onCollisionEnter(other: cc.Collider, self: cc.CircleCollider) {
        if (self.radius > 0 && this.isAttacking && this.isRotating) {
            let monster = other.node.getComponent(Monster);
            let boss = other.node.getComponent(Boss);
            if (monster || boss) {
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
        if (this.player && this.player.talentMagic.hashTalent(Talent.MAGIC_06)) {
            d = 2;
        }
        damage.fireDamage = d;
        let monster = attackTarget.getComponent(Monster);
        if (monster && !monster.isDied) {
            monster.takeDamage(damage);
            monster.addStatus(status, new FromData());
        }
        let boss = attackTarget.getComponent(Boss);
        if (boss && !boss.isDied) {
            boss.takeDamage(damage);
            boss.addStatus(status, new FromData());
        }
        this.isDied = true;
        cc.director.emit('destoryfireghost',{detail:{coinNode:this.node}});
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
        if (this.isCheckTimeDelay(dt)) {
            let pos = this.hasNearEnemy();
            if (!pos.equals(cc.Vec2.ZERO)) {
                this.isAttacking = true;
                this.rigidBody.linearVelocity = pos.normalizeSelf().mulSelf(400);
            } else if (this.isRotating && this.player) {
                this.angle += 5;
                if (this.angle > 360) {
                    this.angle = 0;
                }
                pos = this.getPlayerFarPosition(this.player, 50, this.angle + this.angleOffset);
                this.rigidBody.linearVelocity = pos.sub(this.node.position).normalizeSelf().mulSelf(200);
            }
        }
    }

    hasNearEnemy() {
        if (!this.player || !this.isRotating) {
            return cc.Vec2.ZERO;
        }
        let olddis = 1000;
        let pos = cc.v2(0, 0);
        for (let monster of this.player.meleeWeapon.dungeon.monsters) {
            let dis = Logic.getDistance(this.node.position, monster.node.position);
            if (dis < 400 && dis < olddis && !monster.isDied && !monster.isDisguising) {
                olddis = dis;
                let p = this.node.position.clone();
                p.x = this.node.scaleX > 0 ? p.x : -p.x;
                pos = monster.node.position.sub(p);
            }
        }
        if (pos.equals(cc.Vec2.ZERO)) {
            for (let boss of this.player.meleeWeapon.dungeon.bosses) {
                let dis = Logic.getDistance(this.node.position, boss.node.position);
                if (dis < 400 && dis < olddis && !boss.isDied) {
                    olddis = dis;
                    let p = this.node.position.clone();
                    p.x = this.node.scaleX > 0 ? p.x : -p.x;
                    pos = boss.node.position.sub(p);
                }
            }

        }
        if (olddis != 1000) {
            pos = pos.normalizeSelf();
        }
        return pos;
    }
}
