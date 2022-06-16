import Actor from '../base/Actor'
import BaseColliderComponent from '../base/BaseColliderComponent'
import Boss from '../boss/Boss'
import Box from '../building/Box'
import HitBuilding from '../building/HitBuilding'
import InteractBuilding from '../building/InteractBuilding'
import CCollider from '../collider/CCollider'
import AvatarData from '../data/AvatarData'
import CommonData from '../data/CommonData'
import DamageData from '../data/DamageData'
import EquipmentData from '../data/EquipmentData'
import FromData from '../data/FromData'
import PlayerData from '../data/PlayerData'
import TriggerData from '../data/TriggerData'
import InventoryManager from '../manager/InventoryManager'
import StatusManager from '../manager/StatusManager'
import ActorUtils from '../utils/ActorUtils'
import NextStep from '../utils/NextStep'
import Controller from './Controller'
import Dungeon from './Dungeon'
import { EventHelper } from './EventHelper'
import Logic from './Logic'
import NonPlayer from './NonPlayer'
import Player from './Player'
import PlayerAvatar from './PlayerAvatar'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default abstract class MeleeBase extends BaseColliderComponent {
    public static readonly ELEMENT_TYPE_ICE = 1
    public static readonly ELEMENT_TYPE_FIRE = 2
    public static readonly ELEMENT_TYPE_LIGHTENING = 3
    public static readonly ELEMENT_TYPE_TOXIC = 4
    public static readonly ELEMENT_TYPE_CURSE = 5
    public static readonly COMBO1: number = 1
    public static readonly COMBO2: number = 2
    public static readonly COMBO3: number = 3
    player: Player = null
    dungeon: Dungeon = null
    protected anim: cc.Animation
    protected isAttacking: boolean = false
    protected hv: cc.Vec2 = cc.v2(1, 0)
    protected isStab = true //刺
    protected isFar = false //近程
    protected isFist = true //空手
    protected isBlunt = false //钝器
    protected weaponFirePoint: cc.Node //剑尖
    protected weaponFirePoints: cc.Node[] = []
    protected isMiss = false
    protected drainSkill = new NextStep()
    protected isReflect = false //子弹偏转
    protected comboType = 0
    protected isComboing = false
    protected hasTargetMap: Map<number, number> = new Map()
    protected isSecond = false //是否是副手
    protected currentAngle = 0
    protected fistCombo = 0
    protected exBeatBack: number = 0
    protected isAttackPressed = false
    protected comboMiss = false
    protected canMove = false
    protected playerData: PlayerData

    get IsSword() {
        return !this.isStab && !this.isFar && !this.isFist && !this.isBlunt
    }
    get IsDagger() {
        return this.isStab && !this.isFar && !this.isFist && !this.isBlunt
    }
    set IsSecond(isSecond: boolean) {
        this.isSecond = isSecond
    }
    get IsFist() {
        return this.isFist
    }
    get IsComboing() {
        return this.isComboing
    }
    get IsAttacking() {
        return this.isAttacking
    }
    get IsReflect() {
        return this.isReflect
    }
    get ComboType() {
        return this.comboType
    }
    set Hv(hv: cc.Vec2) {}
    get Hv(): cc.Vec2 {
        return this.hv
    }
    onLoad(): void {
        super.onLoad()
    }

    protected updateCombo() {
        if (this.comboType == MeleeBase.COMBO1) {
            this.comboType = MeleeBase.COMBO2
        } else if (this.comboType == MeleeBase.COMBO2) {
            this.comboType = MeleeBase.COMBO3
        } else if (this.comboType == MeleeBase.COMBO3) {
            this.comboType = MeleeBase.COMBO1
        } else {
            this.comboType = MeleeBase.COMBO1
        }
        if (!this.isComboing) {
            this.comboType = MeleeBase.COMBO1
        }
    }
    public changeEquipment(equipData: EquipmentData, spriteFrame: cc.SpriteFrame) {
        this.isStab = equipData.stab == 1
        this.isFar = equipData.far == 1
        this.isReflect = equipData.isReflect == 1
        this.isFist = InventoryManager.WEAPON != equipData.equipmetType
        this.isBlunt = equipData.blunt == 1
        this.exBeatBack = Logic.inventoryManager.getEquipBySuit(equipData).exBeatBack
    }
    public attackIdle(isReverse: boolean) {
        if (this.anim) {
            this.anim.play(isReverse ? 'MeleeAttackIdleReverse' : 'MeleeAttackIdle')
        }
    }
    public attack(data: PlayerData, fistCombo: number): boolean {
        this.playerData = data.clone()
        let isMiss = Logic.getRandomNum(0, 100) < data.StatusTotalData.missRate
        if (this.isAttacking || !this.anim) {
            if (this.isComboing) {
                this.isAttackPressed = true
                this.comboMiss = isMiss
            }
            return false
        }

        if (isMiss) {
            this.player.showFloatFont(this.node.parent, 0, false, true, false, false, false)
        }
        return this.attackDo(data, isMiss, fistCombo)
    }

    protected attackDo(data: PlayerData, isMiss: boolean, fistCombo: number): boolean {
        this.node.angle = this.currentAngle
        this.hasTargetMap.clear()
        this.fistCombo = fistCombo
        this.isMiss = isMiss
        this.isAttacking = true
        this.canMove = false
        this.updateCombo()
        let animname = this.getAttackAnimName()
        this.anim.play(animname)
        this.anim.getAnimationState(animname).speed = this.getAnimSpeed(data.FinalCommon)
        return true
    }
    public getAnimSpeed(finalCommon: CommonData): number {
        let speedScaleFix = 1
        //匕首
        if (this.isStab && !this.isFar) {
            speedScaleFix = 1.8
        }
        //长剑
        if (!this.isStab && !this.isFar) {
            speedScaleFix = 1.5
        }
        //长枪
        if (this.isStab && this.isFar) {
            speedScaleFix = 1.2
        }
        //大剑
        if (!this.isStab && this.isFar) {
            speedScaleFix = 1
        }
        if (this.isFist) {
            speedScaleFix = 1
        }
        let animSpeed = 1 + finalCommon.AttackSpeed / 500
        //最慢
        if (animSpeed < 0.8) {
            animSpeed = 0.8
        }
        //最快
        if (animSpeed > 3) {
            animSpeed = 3
        }
        return animSpeed * speedScaleFix
    }
    protected getAttackAnimName(comboType?: number): string {
        let name = 'MeleeAttackStab'
        if ((!this.isFar && this.isStab) || this.isFist) {
            name = this.isFist ? 'MeleeAttackFist' : 'MeleeAttackStab'
        } else if (this.isFar && this.isStab) {
            name = 'MeleeAttackStabFar'
        } else if (this.isFar && !this.isStab) {
            name = this.isBlunt ? 'MeleeAttackBluntFar' : 'MeleeAttackFar'
        } else {
            name = this.isBlunt ? 'MeleeAttackBlunt' : 'MeleeAttack'
        }
        return name + this.getComboSuffix(comboType)
    }
    protected getComboSuffix(comboType?: number): string {
        if (this.isFist) {
            if (this.isSecond) {
                return '2'
            }
            return '1'
        }
        comboType = comboType ? comboType : this.comboType
        if (comboType == MeleeBase.COMBO1) {
            return '1'
        } else if (comboType == MeleeBase.COMBO2) {
            return '2'
        } else if (comboType == MeleeBase.COMBO3) {
            return '3'
        } else {
            return '1'
        }
    }
    public getMeleeSlowRatio(): number {
        if (this.canMove || !this.isAttacking) {
            return 1
        }
        if (!this.isFar && this.isStab) {
            return 0.1
        } else if (this.isFar && this.isStab) {
            return 0.04
        } else if (!this.isFar && !this.isStab) {
            return 0.04
        } else {
            return 0.02
        }
    }
    //Anim
    MoveAction() {
        this.canMove = true
    }
    //Anim
    MeleeAttackFinish() {
        this.isAttacking = false
        if (!this.isFist) {
            this.isComboing = false
        }
    }
    //Anim
    ComboStart() {
        this.isComboing = true
    }
    ComboFinish() {
        this.isComboing = false
    }

    //Anim
    ComboTime() {}
    //Anim
    ExAttackTime() {}

    /**Anim 清空攻击列表*/
    RefreshTime() {
        this.hasTargetMap.clear()
    }
    /**Anim 冲刺*/
    DashTime(speed?: number) {}
    //Anim
    EffectTime() {}

    public updateLogic(dt: number) {}

    protected colliderCanAttack(other: CCollider, self: CCollider) {
        if (self.w > 0 && self.h > 0) {
            if (this.hasTargetMap.has(other.id) && this.hasTargetMap.get(other.id) > 0) {
                this.hasTargetMap.set(other.id, this.hasTargetMap.get(other.id) + 1)
                return false
            } else {
                this.hasTargetMap.set(other.id, 1)
                return true
            }
        }
    }
    protected beatBack(actor: Actor) {
        let pos = this.Hv.clone()
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = cc.v2(1, 0)
        }
        let power = 100 + this.exBeatBack
        if (!this.isFar && this.isStab) {
            power = 100
        } else if (this.isFar && this.isStab) {
            power = 400
        } else if (!this.isFar && !this.isStab) {
            power = 240
        } else {
            power = 100
        }
        if (this.comboType == MeleeBase.COMBO3) {
            power += 100
        }

        pos = pos.normalize().mul(power)
        this.scheduleOnce(() => {
            // cc.log(`beat x=${pos.x},y=${pos.y}`);
            actor.entity.Move.linearVelocity = cc.v2(pos.x, pos.y)
        }, 0.05)
    }
    protected attacking(attackTarget: CCollider, anim: cc.Animation, isShadow: boolean): boolean {
        if (!attackTarget || !this.isAttacking) {
            return false
        }
        let damage = new DamageData()
        let common = new CommonData()
        if (this.player) {
            damage = this.player.data.getFinalAttackPoint()
            common = this.player.data.FinalCommon
        }
        damage.isStab = this.isStab
        damage.isFist = this.isFist
        damage.isFar = this.isFar
        damage.isBlunt = this.isBlunt
        damage.isMelee = true
        damage.comboType = this.comboType
        if (this.isFist) {
            damage.comboType = this.fistCombo
        }
        let damageSuccess = false
        let attackSuccess = false
        if (attackTarget.tag == CCollider.TAG.NONPLAYER) {
            let monster = attackTarget.node.getComponent(NonPlayer)
            if (monster && !monster.sc.isDied && !this.isMiss && monster.data.isEnemy > 0) {
                damage.isBackAttack = ActorUtils.isBehindTarget(this.player, monster) && common.DamageBack > 0
                if (damage.isBackAttack) {
                    damage.realDamage += common.DamageBack
                }
                damageSuccess = monster.takeDamage(damage)
                if (damageSuccess) {
                    this.beatBack(monster)
                    this.addTargetAllStatus(common, monster)
                    this.addHitExTrigger(damage, monster)
                }
            }
        } else if (attackTarget.tag == CCollider.TAG.BOSS) {
            let boss = attackTarget.node.getComponent(Boss)
            if (boss && !boss.sc.isDied && !this.isMiss) {
                damageSuccess = boss.takeDamage(damage)
                if (damageSuccess) {
                    this.addTargetAllStatus(common, boss)
                    this.addHitExTrigger(damage, boss)
                }
            }
        } else if (attackTarget.tag == CCollider.TAG.BUILDING || attackTarget.tag == CCollider.TAG.WALL) {
            let box = attackTarget.node.getComponent(Box)
            if (box) {
                attackSuccess = true
                box.breakBox()
            }
            if (!attackSuccess) {
                let interactBuilding = attackTarget.node.getComponent(InteractBuilding)
                if (interactBuilding && interactBuilding.data.currentHealth > 0) {
                    attackSuccess = true
                    interactBuilding.takeDamage(damage)
                }
            }
            if (!attackSuccess) {
                let hitBuilding = attackTarget.node.getComponent(HitBuilding)
                if (hitBuilding && hitBuilding.data.currentHealth > 0) {
                    attackSuccess = true
                    hitBuilding.takeDamage(damage)
                }
            }
        }
        //生命汲取,内置1s cd
        if (damageSuccess) {
            this.drainSkill.next(
                () => {
                    let drain = this.player.data.getLifeDrain()
                    if (drain > 0) {
                        this.player.takeDamage(new DamageData(-drain))
                    }
                },
                1,
                true
            )
        }

        this.isMiss = false
        //停顿
        if (damageSuccess || attackSuccess) {
            anim.pause()
            if (!isShadow) {
                EventHelper.emit(EventHelper.CAMERA_SHAKE, { isHeavyShaking: this.comboType == MeleeBase.COMBO3 })
            }
            this.scheduleOnce(() => {
                anim.resume()
            }, 0.1)
        }
        if (damageSuccess && this.player.data.AvatarData.organizationIndex == AvatarData.TECH) {
            this.player.updateDream(-1)
        }
        return damageSuccess || attackSuccess
    }
    protected addHitExTrigger(damage: DamageData, actor: Actor) {
        let isAdded = false
        if (damage.isBackAttack) {
            this.player.exTrigger(TriggerData.GROUP_HIT, TriggerData.TYPE_HIT_BACK, new FromData(), actor)
            isAdded = true
        }
        if (damage.isCriticalStrike) {
            this.player.exTrigger(TriggerData.GROUP_HIT, TriggerData.TYPE_HIT_CRIT, new FromData(), actor)
            isAdded = true
        }
        if (!isAdded) {
            this.player.exTrigger(TriggerData.GROUP_HIT, TriggerData.TYPE_HIT, new FromData(), actor)
        }
    }
    protected addTargetAllStatus(data: CommonData, target: Actor) {
        this.addTargetStatus(data.iceRate, target, StatusManager.FROZEN)
        this.addTargetStatus(data.fireRate, target, StatusManager.BURNING)
        this.addTargetStatus(data.lighteningRate, target, StatusManager.DIZZ)
        this.addTargetStatus(data.toxicRate, target, StatusManager.TOXICOSIS)
        this.addTargetStatus(data.curseRate, target, StatusManager.CURSING)
        this.addTargetStatus(data.realRate, target, StatusManager.BLEEDING)
    }

    protected addTargetStatus(rate: number, target: Actor, statusType) {
        if (Logic.getRandomNum(0, 100) < rate) {
            target.addStatus(statusType, new FromData())
        }
    }
}
