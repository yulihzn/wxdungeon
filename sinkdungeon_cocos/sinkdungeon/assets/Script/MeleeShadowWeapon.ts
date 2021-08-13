import Dungeon from "./Dungeon";
import Player from "./Player";
import PlayerData from "./Data/PlayerData";
import AudioPlayer from "./Utils/AudioPlayer";
import EquipmentData from "./Data/EquipmentData";
import InventoryManager from "./Manager/InventoryManager";
import MeleeWeapon from "./MeleeWeapon";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//发射器
const { ccclass, property } = cc._decorator;

@ccclass
export default class MeleeShadowWeapon extends cc.Component {

    player: Player = null;
    meleeWeapon:MeleeWeapon;
    private anim: cc.Animation;
    private isAttacking: boolean = false;
    private hv: cc.Vec3 = cc.v3(1, 0);
    dungeon: Dungeon;
    private comboType = 0;
    private hasTargetMap: { [key: string]: number } = {};

    get IsAttacking() {
        return this.isAttacking;
    }
    
    get IsReflect() {
        if(this.meleeWeapon){
            return this.meleeWeapon.IsReflect;
        }
        return false;
    }

    init(player:Player,meleeWeapon:MeleeWeapon) {
        this.anim = this.getComponent(cc.Animation);
        this.player = player;
        this.meleeWeapon = meleeWeapon;
    }

    set Hv(hv: cc.Vec3) {
        this.hv = hv.normalizeSelf();
    }
    get Hv(): cc.Vec3 {
        return this.hv;
    }
   
    attack(data: PlayerData,comboType: number,hv:cc.Vec3): boolean {
        this.updateHv(hv);
        this.comboType = comboType;
        this.hasTargetMap = {};
        this.isAttacking = true;
        let animname = this.meleeWeapon.getAttackAnimName(comboType);
        this.anim.play(animname);
        this.anim.getAnimationState(animname).speed = this.meleeWeapon.getAnimSpeed(data.FinalCommon);
        return true;

    }

    attackIdle(isReverse: boolean) {
        if (this.anim) {
            this.anim.play(isReverse ? 'MeleeAttackIdleReverse' : 'MeleeAttackIdle');
        }
    }
    //Anim
    MeleeAttackFinish() {
        this.isAttacking = false;
    }
    //Anim
    ComboStart() {
    }
    ComboFinish() {
    }
    //Anim
    ComboTime() {
    }
    //Anim
    ExAttackTime() {
        this.player.remoteExAttack(this.comboType);
    }
    //Anim
    AudioTime() {
        if(this.meleeWeapon){
            this.meleeWeapon.AudioTime();
        }
    }
    /**Anim 清空攻击列表*/
    RefreshTime() {
        this.hasTargetMap = {};
    }
    /**Anim 冲刺*/
    DashTime(speed?: number) {
        AudioPlayer.play(AudioPlayer.DASH);
    }
    //Anim
    EffectTime() {
    }

    updateHv(hv:cc.Vec3) {
        this.hv = hv.normalizeSelf();
        if ((this.hv.x != 0 || this.hv.y != 0)) {
            let olderTarget = cc.v3(this.node.position.x + this.hv.x, this.node.position.y + this.hv.y);
            this.rotateColliderManager(olderTarget);
        }
    }

    private rotateColliderManager(target: cc.Vec3) {
        // 两者取差得到方向向量
        let direction = target.sub(this.node.position);
        // 方向向量转换为角度值
        let Rad2Deg = 360 / (Math.PI * 2);
        let angle: number = 360 - Math.atan2(direction.x, direction.y) * Rad2Deg;
        let offsetAngle = 90;
        let sx = Math.abs(this.node.scaleX);
        this.node.scaleX = this.player.node.scaleX > 0 ? sx : -sx;
        let sy = Math.abs(this.node.scaleY);
        this.node.scaleY = this.node.scaleX < 0 ? -sy : sy;
        angle += offsetAngle;
        if (angle >= 360) {
            angle -= 360;
        }
        if (angle <= -360) {
            angle += 360;
        }
        // 将当前物体的角度设置为对应角度
        this.node.angle = this.node.scaleX < 0 ? -angle : angle;

    }

    onCollisionStay(other: cc.Collider, self: cc.CircleCollider) {
        if (self.radius > 0) {
            if (this.hasTargetMap[other.node.uuid] && this.hasTargetMap[other.node.uuid] > 0) {
                this.hasTargetMap[other.node.uuid]++;
                return false;
            } else {
                this.hasTargetMap[other.node.uuid] = 1;
                if(this.meleeWeapon){
                    return this.meleeWeapon.attacking(other,this.anim,true);
                }
                return false;
            }
        }
    }
}
