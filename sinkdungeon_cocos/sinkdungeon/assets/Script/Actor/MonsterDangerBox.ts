import Monster from "../Monster";
import MonsterData from "../Data/MonsterData";
import Dungeon from "../Dungeon";
import FromData from "../Data/FromData";
import { ColliderTag } from "./ColliderTag";

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
export default class MonsterDangerBox extends cc.Component {

    static readonly ATTACK_NORMAL = 0;
    static readonly ATTACK_STAB = 1;//位移突刺
    static readonly ATTACK_AREA = 2;
    attackType = 0;
    collider: cc.BoxCollider
    isAttacking = false;
    monster: Monster;
    hv: cc.Vec3 = cc.v3(1, 0);
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.opacity = 0;
        this.collider = this.getComponent(cc.BoxCollider);
    }

    init(monster: Monster) {
        this.monster = monster;
    }
    start() {

    }
    //展示
    show(attackType: number) {
        if (!this.monster) {
            return;
        }
        this.attackType = attackType;
        this.changeBoxSize(attackType);
        this.node.opacity = 80;
        let p = this.node.position.clone();
        let hv = this.monster.dungeon.player.getCenterPosition().sub(this.monster.node.position.add(p));
        this.setHv(hv);
    }
    private changeBoxSize(attackType: number) {
        let length = 80;
        let offset = cc.v2(40, 0);
        this.node.anchorX = 0;
        this.node.width = length;
        this.node.height = length;
        this.node.position = cc.v3(-16,32);
        this.collider.offset = offset;
        this.collider.size.width = length;
        this.collider.size.height = length;
        switch (attackType) {
            case MonsterDangerBox.ATTACK_NORMAL:
                break;
            case MonsterDangerBox.ATTACK_STAB:
                this.node.width = 300;
                this.collider.offset = cc.v2(0, 0);
                break;
            case MonsterDangerBox.ATTACK_AREA:
                this.node.anchorX = 0.5;
                length = 160;
                this.node.width = length;
                this.node.height = length;
                this.node.position = cc.v3(0,32);
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
        if (this.isAttacking && this.monster && other.tag == ColliderTag.PLAYER) {
            this.isAttacking = false;
            let from = FromData.getClone(this.monster.data.nameCn, this.monster.data.resName);
            let dd = this.monster.data.getAttackPoint();
            dd.isBackAttack = this.monster.isFacePlayerBehind()&&this.monster.data.FinalCommon.damageBack>0;
            if(dd.isBackAttack){
                dd.realDamage += this.monster.data.FinalCommon.damageBack;
            }
            if(this.monster.dungeon.player.takeDamage(dd, from, this.monster)){
                this.monster.addPlayerStatus(this.monster.dungeon.player, from);
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
        this.node.scaleX = this.monster.node.scaleX > 0 ? 1 : -1;
        // this.node.scaleY = this.monster.node.scaleX > 0 ? 1 : -1;
        angle += offsetAngle;
        this.node.angle = this.node.scaleX == -1 ? -angle : angle;

    }
}
