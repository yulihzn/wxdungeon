import Dungeon from './Dungeon'
import Player from './Player'
import NonPlayer from './NonPlayer'
import { EventHelper } from './EventHelper'
import Box from '../building/Box'
import Logic from './Logic'
import DamageData from '../data/DamageData'
import StatusManager from '../manager/StatusManager'
import PlayerData from '../data/PlayerData'
import Boss from '../boss/Boss'
import NextStep from '../utils/NextStep'
import FromData from '../data/FromData'
import AudioPlayer from '../utils/AudioPlayer'
import IndexZ from '../utils/IndexZ'
import PlayerAvatar from './PlayerAvatar'
import EquipmentData from '../data/EquipmentData'
import InventoryManager from '../manager/InventoryManager'
import HitBuilding from '../building/HitBuilding'
import CommonData from '../data/CommonData'
import Actor from '../base/Actor'
import AvatarData from '../data/AvatarData'
import ActorUtils from '../utils/ActorUtils'
import InteractBuilding from '../building/InteractBuilding'
import Utils from '../utils/Utils'
import CCollider from '../collider/CCollider'
import BaseColliderComponent from '../base/BaseColliderComponent'
import Controller from './Controller'
import TriggerData from '../data/TriggerData'

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
const { ccclass, property } = cc._decorator

@ccclass
export default class MeleeWeapon extends BaseColliderComponent {
    public static readonly ELEMENT_TYPE_ICE = 1
    public static readonly ELEMENT_TYPE_FIRE = 2
    public static readonly ELEMENT_TYPE_LIGHTENING = 3
    public static readonly ELEMENT_TYPE_TOXIC = 4
    public static readonly ELEMENT_TYPE_CURSE = 5
    public static readonly COMBO1: number = 1
    public static readonly COMBO2: number = 2
    public static readonly COMBO3: number = 3

    @property(cc.Node)
    playerNode: cc.Node = null
    player: Player = null
    @property(cc.Prefab)
    iceLight: cc.Prefab = null
    @property(cc.Prefab)
    fireLight: cc.Prefab = null
    @property(cc.Prefab)
    lighteningLight: cc.Prefab = null
    @property(cc.Prefab)
    toxicLight: cc.Prefab = null
    @property(cc.Prefab)
    curseLight: cc.Prefab = null

    protected meleeLightLeftPos = cc.v3(8, 0)
    protected meleeLightRightPos = cc.v3(-8, 0)

    protected anim: cc.Animation
    protected isAttacking: boolean = false
    protected hv: cc.Vec2 = cc.v2(1, 0)
    protected isStab = true //刺
    protected isFar = false //近程
    protected isFist = true //空手
    protected isBlunt = false //钝器
    dungeon: Dungeon
    protected weaponFirePoint: cc.Node //剑尖
    protected weaponFirePoints: cc.Node[] = []
    protected isMiss = false
    protected drainSkill = new NextStep()
    protected isReflect = false //子弹偏转
    protected spriteNode: cc.Node = null
    protected weaponSprite: cc.Sprite = null
    protected weaponLightSprite: cc.Sprite = null
    protected handSprite: cc.Sprite = null
    protected glovesSprite: cc.Sprite = null
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
    get GlovesSprite() {
        return this.glovesSprite
    }
    get ComboType() {
        return this.comboType
    }

    onLoad() {
        super.onLoad()
        this.anim = this.getComponent(cc.Animation)
        this.player = this.playerNode.getComponent(Player)
        this.meleeLightLeftPos = this.player.node.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(this.meleeLightLeftPos))
        this.meleeLightRightPos = this.player.node.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(this.meleeLightRightPos))
        this.initSprite()
    }
    protected initSprite() {
        this.weaponFirePoint = this.node.getChildByName('firepoint')
        this.spriteNode = this.node.getChildByName('sprite')
        this.weaponSprite = this.getSpriteChildSprite(['sprite', InventoryManager.WEAPON])
        this.weaponLightSprite = this.getSpriteChildSprite(['sprite', 'meleelight'])
        this.handSprite = this.getSpriteChildSprite(['sprite', 'hand'])
        this.glovesSprite = this.getSpriteChildSprite(['sprite', 'hand', 'gloves'])
        this.handSprite.node.color = cc.Color.WHITE.fromHEX(this.player.avatar.data.skinColor)
        for (let i = 0; i < 4; i++) {
            this.weaponFirePoints.push(this.weaponFirePoint.getChildByName(`point${i}`))
        }
    }

    set Hv(hv: cc.Vec2) {
        if (Controller.isMouseMode() && Controller.mousePos && this.dungeon) {
            let p = cc.v2(this.dungeon.node.convertToWorldSpaceAR(this.player.node.position))
            this.hv = Controller.mousePos.add(cc.v2(this.dungeon.mainCamera.node.position)).sub(p).normalize()
            return
        }
        let pos = ActorUtils.getDirectionFromNearestEnemy(this.player.node.position, false, this.dungeon, false, 300)
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.hv = cc.v2(pos).normalize()
        } else {
            this.hv = hv.normalize()
        }
    }
    get Hv(): cc.Vec2 {
        return this.hv
    }
    protected getSpriteChildSprite(childNames: string[]): cc.Sprite {
        let node = this.node
        for (let name of childNames) {
            node = node.getChildByName(name)
        }
        return node.getComponent(cc.Sprite)
    }
    protected changeSprite(equipData: EquipmentData, spriteFrame: cc.SpriteFrame) {
        this.weaponSprite.spriteFrame = spriteFrame
        let color1 = cc.color(255, 255, 255).fromHEX(equipData.color)
        let color2 = cc.color(255, 255, 255).fromHEX(equipData.lightcolor)
        this.weaponSprite.node.color = color1
        this.weaponLightSprite.node.color = color2
        if (this.isStab) {
            this.weaponSprite.node.angle = 15
        } else {
            this.weaponSprite.node.angle = -235
        }
        this.weaponSprite.node.width = this.weaponSprite.spriteFrame.getOriginalSize().width
        this.weaponSprite.node.height = this.weaponSprite.spriteFrame.getOriginalSize().height
    }
    public changeEquipment(equipData: EquipmentData, spriteFrame: cc.SpriteFrame) {
        this.isStab = equipData.stab == 1
        this.isFar = equipData.far == 1
        this.isReflect = equipData.isReflect == 1
        this.isFist = InventoryManager.WEAPON != equipData.equipmetType
        this.isBlunt = equipData.blunt == 1
        this.exBeatBack = Logic.inventoryManager.getEquipBySuit(equipData).exBeatBack
        this.changeSprite(equipData, spriteFrame)
    }
    protected updateCombo() {
        if (this.comboType == MeleeWeapon.COMBO1) {
            this.comboType = MeleeWeapon.COMBO2
        } else if (this.comboType == MeleeWeapon.COMBO2) {
            this.comboType = MeleeWeapon.COMBO3
        } else if (this.comboType == MeleeWeapon.COMBO3) {
            this.comboType = MeleeWeapon.COMBO1
        } else {
            this.comboType = MeleeWeapon.COMBO1
        }
        if (!this.isComboing) {
            this.comboType = MeleeWeapon.COMBO1
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

    public attackIdle(isReverse: boolean) {
        if (this.anim) {
            this.anim.play(isReverse ? 'MeleeAttackIdleReverse' : 'MeleeAttackIdle')
        }
    }
    //Anim
    MoveAction() {
        this.canMove = true
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

    public getAttackAnimName(comboType?: number): string {
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
        if (comboType == MeleeWeapon.COMBO1) {
            return '1'
        } else if (comboType == MeleeWeapon.COMBO2) {
            return '2'
        } else if (comboType == MeleeWeapon.COMBO3) {
            return '3'
        } else {
            return '1'
        }
    }
    protected getWaveLight(dungeonNode: cc.Node, p: cc.Vec3, elementType: number, isStab: boolean, isFar: boolean) {
        let lights = [this.iceLight, this.fireLight, this.lighteningLight, this.toxicLight, this.curseLight]
        let audios = [AudioPlayer.ELECTRIC_ATTACK, AudioPlayer.FIREBALL, AudioPlayer.ELECTRIC_ATTACK, AudioPlayer.ELECTRIC_ATTACK, AudioPlayer.ELECTRIC_ATTACK]
        if (elementType < 1 || elementType > lights.length || !this.dungeon) {
            return
        }
        let firePrefab: cc.Node = cc.instantiate(lights[elementType - 1])
        AudioPlayer.play(audios[elementType - 1])
        let timeScale = this.anim.getAnimationState(this.getAttackAnimName()).speed
        let ps = [p]
        for (let node of this.weaponFirePoints) {
            if (node) {
                ps.push(p.add(node.position))
            }
        }
        for (let i = 0; i < ps.length; i++) {
            let psp = ps[i]
            psp = this.node.convertToWorldSpaceAR(psp)
            psp = dungeonNode.convertToNodeSpaceAR(psp)
            ps[i] = psp.clone()
        }
        firePrefab.parent = dungeonNode
        firePrefab.position = ps[0]
        firePrefab.zIndex = IndexZ.OVERHEAD
        firePrefab.opacity = 255
        firePrefab.setScale(0.2)
        firePrefab.active = true
        cc.tween(firePrefab)
            .to(0.1 / timeScale, { position: ps[1] })
            .to(0.1 / timeScale, { position: ps[2] })
            .to(0.1 / timeScale, { position: ps[3] })
            .to(0.1 / timeScale, { position: ps[4] })
            .start()
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
    ComboTime() {
        if (this.isAttackPressed) {
            this.isAttackPressed = false
            this.anim.pause()
            if (this.comboMiss) {
                this.player.showFloatFont(this.node.parent, 0, false, true, false, false, false)
            }
            this.attackDo(this.playerData, this.comboMiss, this.fistCombo)
            this.player.playerAnim(PlayerAvatar.STATE_ATTACK)
            this.player.stopHiding()
            this.isComboing = false
        }
    }
    //Anim
    ExAttackTime() {
        this.player.exTrigger(TriggerData.GROUP_ATTACK, this.comboType, null, null)
    }
    //Anim
    AudioTime() {
        let audioName = AudioPlayer.MELEE
        let swordNames = [AudioPlayer.SWORD_ATTACK, AudioPlayer.SWORD_ATTACK1, AudioPlayer.SWORD_ATTACK2]
        let swordName = swordNames[Logic.getRandomNum(0, 2)]
        let fistNames = [AudioPlayer.FIST, AudioPlayer.FIST1, AudioPlayer.FIST2]
        let fistName = fistNames[Logic.getRandomNum(0, 2)]
        //匕首
        if (this.isStab && !this.isFar) {
            audioName = fistName
            if (this.comboType == MeleeWeapon.COMBO3) {
                audioName = swordName
            }
        }
        //长剑
        if (!this.isStab && !this.isFar) {
            audioName = swordName
            // if (this.comboType == MeleeWeapon.COMBO3) {
            //     audioName = AudioPlayer.MELEE;
            // }
        }
        //长枪
        if (this.isStab && this.isFar) {
            audioName = swordName
        }
        //大剑
        if (!this.isStab && this.isFar) {
            audioName = swordName
            // if (this.comboType == MeleeWeapon.COMBO3) {
            //     audioName = AudioPlayer.MELEE;
            // }
        }
        if (this.isFist) {
            audioName = fistName
        }
        AudioPlayer.play(audioName)
    }
    /**Anim 清空攻击列表*/
    RefreshTime() {
        this.hasTargetMap.clear()
    }
    /**Anim 冲刺*/
    DashTime(speed?: number) {
        AudioPlayer.play(AudioPlayer.DASH)
        if (!speed) {
            speed = 300
        }
        this.schedule(
            () => {
                this.player.getWalkSmoke(this.player.node, this.node.position)
            },
            0.05,
            4,
            0
        )
        let pos = this.player.hv.clone()
        this.player.sc.isMoving = false
        this.player.isWeaponDashing = true
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = this.player.isFaceRight ? cc.v2(1, 0) : cc.v2(-1, 0)
        } else {
            pos = pos.normalizeSelf()
        }
        this.hv = pos.clone()
        pos = pos.mul(speed)
        this.player.entity.Move.linearVelocity = pos
        this.scheduleOnce(() => {
            this.player.isWeaponDashing = false
            this.player.entity.Move.linearVelocity = cc.Vec2.ZERO
            this.player.playerAnim(PlayerAvatar.STATE_IDLE)
        }, 0.2)
    }
    //Anim
    EffectTime() {
        let p = this.weaponFirePoint.position.clone()
        let ran = Logic.getRandomNum(0, 100)
        let finalCommon = this.playerData.FinalCommon
        let waves = [
            finalCommon.MagicDamage > 0 && ran < finalCommon.iceRate ? MeleeWeapon.ELEMENT_TYPE_ICE : 0,
            finalCommon.MagicDamage > 0 && ran < finalCommon.fireRate ? MeleeWeapon.ELEMENT_TYPE_FIRE : 0,
            finalCommon.MagicDamage > 0 && ran < finalCommon.lighteningRate ? MeleeWeapon.ELEMENT_TYPE_LIGHTENING : 0,
            finalCommon.MagicDamage > 0 && ran < finalCommon.toxicRate ? MeleeWeapon.ELEMENT_TYPE_TOXIC : 0,
            finalCommon.MagicDamage > 0 && ran < finalCommon.curseRate ? MeleeWeapon.ELEMENT_TYPE_CURSE : 0
        ]
        this.scheduleOnce(() => {
            for (let w of waves) {
                if (this.dungeon) {
                    this.getWaveLight(this.dungeon.node, p, w, this.isStab, this.isFar)
                }
            }
        }, 0)
    }

    public setWeaponInVisible(flag: boolean) {
        if (flag) {
            this.weaponSprite.node.opacity = 0
        } else {
            this.weaponSprite.node.opacity = 255
        }
    }
    public updateLogic(dt: number) {
        if (Controller.isMouseMode() && Controller.mousePos && this.dungeon) {
            let p = cc.v2(this.dungeon.node.convertToWorldSpaceAR(this.player.node.position))
            this.hv = Controller.mousePos.add(cc.v2(this.dungeon.mainCamera.node.position)).sub(p).normalize()
        } else {
            let pos = ActorUtils.getDirectionFromNearestEnemy(this.player.node.position, false, this.dungeon, false, 400)
            if (!pos.equals(cc.Vec3.ZERO)) {
                this.hv = cc.v2(pos)
            }
        }
        if (!this.isAttacking) {
            this.rotateCollider(this.hv)
        }
        this.node.angle = Logic.lerp(this.node.angle, this.currentAngle, dt * 5)
        let z = this.player.root.y
        this.node.y = -z
        if (this.spriteNode) {
            let zpos = this.node.parent.convertToWorldSpaceAR(cc.Vec3.ZERO)
            this.spriteNode.position = this.node.convertToNodeSpaceAR(zpos)
        }
    }

    protected rotateCollider(direction: cc.Vec2) {
        if (direction.equals(cc.Vec2.ZERO)) {
            return
        }
        //设置缩放方向
        let sx = Math.abs(this.node.scaleX)
        this.node.scaleX = this.player.node.scaleX > 0 ? sx : -sx
        let sy = Math.abs(this.node.scaleY)
        this.node.scaleY = this.node.scaleX < 0 ? -sy : sy
        //设置旋转角度
        this.currentAngle = Utils.getRotateAngle(direction, this.node.scaleX < 0)
        if (this.currentAngle < 0) {
            this.currentAngle += 360
        }
        if (this.currentAngle >= 0 && this.currentAngle <= 90 && this.node.angle >= 225 && this.node.angle <= 360) {
            this.node.angle -= 360
        } else if (this.node.angle >= 0 && this.node.angle <= 90 && this.currentAngle >= 225 && this.currentAngle <= 360) {
            this.node.angle += 360
        }
    }

    onColliderStay(other: CCollider, self: CCollider) {
        if (self.w > 0 && self.h > 0) {
            if (this.hasTargetMap.has(other.id) && this.hasTargetMap.get(other.id) > 0) {
                this.hasTargetMap.set(other.id, this.hasTargetMap.get(other.id) + 1)
                return false
            } else {
                this.hasTargetMap.set(other.id, 1)
                return this.attacking(other, this.anim, false)
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
        if (this.comboType == MeleeWeapon.COMBO3) {
            power += 100
        }

        pos = pos.normalize().mul(power)
        this.scheduleOnce(() => {
            // cc.log(`beat x=${pos.x},y=${pos.y}`);
            actor.entity.Move.linearVelocity = cc.v2(pos.x, pos.y)
        }, 0.05)
    }
    public attacking(attackTarget: CCollider, anim: cc.Animation, isShadow: boolean): boolean {
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
                EventHelper.emit(EventHelper.CAMERA_SHAKE, { isHeavyShaking: this.comboType == MeleeWeapon.COMBO3 })
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
