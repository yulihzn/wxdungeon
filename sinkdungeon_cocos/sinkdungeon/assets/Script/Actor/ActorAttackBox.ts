import FromData from "../Data/FromData";
import Actor from "../Base/Actor";
import Dungeon from "../Dungeon";
import Monster from "../Monster";
import NonPlayer from "../NonPlayer";
import Boss from "../Boss/Boss";
import Player from "../Player";

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
export default class ActorAttackBox extends cc.Component {

    static readonly ATTACK_NORMAL = 0;
    static readonly ATTACK_STAB = 1;//位移突刺
    static readonly ATTACK_AREA = 2;
    isEnemy = false;
    attackType = 0;
    collider: cc.BoxCollider
    isAttacking = false;
    holderActor: Actor;
    dungeon: Dungeon;
    hv: cc.Vec3 = cc.v3(1, 0);
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.opacity = 0;
        this.collider = this.getComponent(cc.BoxCollider);
    }

    init(holderActor: Actor, dungeon: Dungeon,isEnemy:boolean) {
        this.isEnemy = isEnemy;
        this.holderActor = holderActor;
        this.dungeon = dungeon;
    }
    start() {

    }
    //展示
    show(attackType: number) {
        if (!this.holderActor) {
            return;
        }
        this.attackType = attackType;
        this.changeBoxSize(attackType);
        this.node.opacity = 80;
        let p = this.node.position.clone();
        let hv = this.holderActor.getNearestTargetPosition(
            this.isEnemy ? [Actor.TARGET_PLAYER, Actor.TARGET_NONPLAYER] : [Actor.TARGET_MONSTER, Actor.TARGET_NONPLAYER_ENEMY, Actor.TARGET_BOSS], this.dungeon).sub(this.holderActor.node.position.add(p));
        this.setHv(hv);
    }
    private changeBoxSize(attackType: number) {
        let length = 80;
        let offset = cc.v2(40, 0);
        this.node.anchorX = 0;
        this.node.width = length;
        this.node.height = length;
        this.node.position = cc.v3(-16, 32);
        this.collider.offset = offset;
        this.collider.size.width = length;
        this.collider.size.height = length;
        switch (attackType) {
            case ActorAttackBox.ATTACK_NORMAL:
                break;
            case ActorAttackBox.ATTACK_STAB:
                this.node.width = 300;
                this.collider.offset = cc.v2(0, 0);
                break;
            case ActorAttackBox.ATTACK_AREA:
                this.node.anchorX = 0.5;
                length = 160;
                this.node.width = length;
                this.node.height = length;
                this.node.position = cc.v3(0, 32);
                this.collider.size.width = length;
                this.collider.size.height = length;
                this.collider.offset = cc.v2(0, 0);
                break;
        }
    }
    //隐藏
    hide(isMiss: boolean) {
        this.isAttacking = !isMiss;
        this.node.opacity = 0;
    }
    //结束
    finish() {
        this.node.opacity = 0;
        this.isAttacking = false;
    }
    onCollisionStay(other: cc.Collider, self: cc.BoxCollider) {
        if (this.isAttacking && this.holderActor) {
            let a = other.getComponent(Actor);
            let m = this.holderActor.getComponent(Monster);
            let n = this.holderActor.getComponent(NonPlayer);
            let s = m?m:n;
            let target = Actor.getCollisionTarget(other);
            if(target){
                this.isAttacking = false;
                let from = FromData.getClone(s.data.nameCn, s.data.resName);
                let dd = s.data.getAttackPoint();
                dd.isBackAttack = s.isFaceTargetBehind(a) && s.data.FinalCommon.damageBack > 0;
                if (dd.isBackAttack) {
                    dd.realDamage += s.data.FinalCommon.damageBack;
                }
                if (a.takeDamage(dd, from, this.holderActor)) {
                    s.addPlayerStatus(a, from);
                }
            }
            
            
        }
    }
    setHv(hv: cc.Vec3) {
        this.hv = hv.normalizeSelf();
        if (this.hv.x != 0 || this.hv.y != 0) {
            let olderTarget = cc.v3(this.node.position.x + this.hv.x, this.node.position.y + this.hv.y);
            this.rotateColliderManager(olderTarget);
        }
    }
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.02) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    rotateColliderManager(target: cc.Vec3) {
        let direction = target.sub(this.node.position);
        let Rad2Deg = 360 / (Math.PI * 2);
        let angle: number = 360 - Math.atan2(direction.x, direction.y) * Rad2Deg;
        let offsetAngle = 90;
        this.node.scaleX = this.holderActor.node.scaleX > 0 ? 1 : -1;
        // this.node.scaleY = this.monster.node.scaleX > 0 ? 1 : -1;
        angle += offsetAngle;
        this.node.angle = this.node.scaleX == -1 ? -angle : angle;

    }
}