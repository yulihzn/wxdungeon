import { EventHelper } from './EventHelper'
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MeleeWeapon from './MeleeWeapon'
import Shooter from './Shooter'
import EquipmentData from '../data/EquipmentData'
import InventoryManager from '../manager/InventoryManager'
import PlayerData from '../data/PlayerData'
import MeleeShadowWeapon from './MeleeShadowWeapon'
import Logic from './Logic'
import Random from '../utils/Random'
import MeleeCollideHelper from './MeleeCollideHelper'
import BaseAvatar from '../base/BaseAvatar'
import Player from './Player'
import TimeDelay from '../utils/TimeDelay'

const { ccclass, property } = cc._decorator
/**
 * 武器：包含近战和远程两种
 */
@ccclass
export default class PlayerWeapon extends cc.Component {
    @property(MeleeCollideHelper)
    meleeCollideHelper: MeleeCollideHelper = null
    player: Player = null
    meleeWeapon: MeleeWeapon = null
    shadowWeapon: MeleeShadowWeapon = null
    shooter: Shooter = null
    private isLeftHand: boolean = false //是否左手
    isHeavyRemotoAttacking = false //是否是重型远程武器,比如激光
    private isShadow = false
    private selfDefaultPos = cc.v3(-15, 40)
    private otherDefaultPos = cc.v3(20, 40)
    private readonly handsUpPosX = 32
    private readonly handsUpPosY = 32
    private handsUpPos = cc.v3(0, 0)
    private remoteIntervalTime = 0 //子弹间隔时间
    private isCooling = false
    private remoteAngleOffset = 0
    isHandsUp = false
    interactBuildingAttacking = false
    interactBuildingLift = false
    private ammoRecovery = 0
    private maxAmmo = 0
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(player: Player, isLeftHand: boolean, isShadow: boolean) {
        this.isShadow = isShadow
        this.isLeftHand = isLeftHand
        this.player = player
        this.initMelee()
        this.initShooter()
        if (isLeftHand) {
            this.selfDefaultPos = cc.v3(20, 40)
            this.otherDefaultPos = cc.v3(-15, 40)
        } else {
            this.selfDefaultPos = cc.v3(-15, 40)
            this.otherDefaultPos = cc.v3(20, 40)
        }
        this.meleeCollideHelper.init()
    }
    private initMelee() {
        if (this.isShadow) {
            this.shadowWeapon = this.getComponentInChildren(MeleeShadowWeapon)
            this.shadowWeapon.init(this.player, this.isLeftHand ? this.player.handLeft.meleeWeapon : this.player.handRight.meleeWeapon)
        } else {
            this.meleeWeapon = this.getComponentInChildren(MeleeWeapon)
            this.meleeWeapon.IsSecond = this.isLeftHand
            this.meleeWeapon.init(this.player, this.isLeftHand)
        }
    }
    private initShooter() {
        this.shooter = this.getComponentInChildren(Shooter)
        this.shooter.player = this.player
        this.shooter.actor = this.player
        this.shooter.dungeon = this.player.dungeon
        let finalData = this.player.data.FinalCommon
        this.ammoRecovery = finalData.AmmoRecovery
        this.maxAmmo = finalData.MaxAmmo
    }
    handsUp(isUp: boolean, isLift: boolean, isAttacking: boolean) {
        if (this.isHandsUp && isUp) {
            this.interactBuildingAttacking = isAttacking
            this.interactBuildingLift = isLift
        } else {
            this.interactBuildingAttacking = false
        }
        this.meleeWeapon.setWeaponInVisible(isUp)
        if (isUp && !this.isHandsUp) {
            this.isHandsUp = true
            this.handsUpPos = cc.v3(this.handsUpPosX, 0)
            if (isLift) {
                this.scheduleOnce(() => {
                    this.handsUpPos = cc.v3(0, this.handsUpPosY)
                }, 0.1)
            }
        }
        if (!isUp && this.isHandsUp) {
            this.isHandsUp = false
            this.handsUpPos = cc.v3(this.handsUpPosX, 0)
            this.scheduleOnce(() => {
                this.handsUpPos = cc.v3(0, 0)
            }, 0.1)
        }
    }
    changeZIndexByDir(avatarZindex: number, dir: number) {
        switch (dir) {
            case BaseAvatar.DIR_UP:
                this.node.zIndex = avatarZindex - 1
                break
            case BaseAvatar.DIR_DOWN:
                this.node.zIndex = avatarZindex + 1
                break
            case BaseAvatar.DIR_LEFT:
                this.node.zIndex = this.isLeftHand ? avatarZindex + 1 : avatarZindex - 1
                break
            case BaseAvatar.DIR_RIGHT:
                this.node.zIndex = this.isLeftHand ? avatarZindex - 1 : avatarZindex + 1
                break
        }
    }
    changeWeapon(equipData: EquipmentData, spriteFrame: cc.SpriteFrame) {
        switch (equipData.equipmentType) {
            case InventoryManager.WEAPON:
                this.meleeWeapon.changeEquipment(equipData, spriteFrame)
                break
            case InventoryManager.REMOTE:
                this.shooter.data = equipData.clone()
                this.shooter.changeRes(this.shooter.data.img)
                let c = cc.color(255, 255, 255).fromHEX(this.shooter.data.color)
                this.shooter.changeResColor(c)
                break
        }
    }

    meleeAttack(data: PlayerData, fistCombo: number) {
        if (!this.meleeWeapon || this.meleeWeapon.IsAttacking) {
            return
        }
        this.meleeWeapon.attack(data, fistCombo)
    }
    remoteAttack(data: PlayerData, cooldownNode: cc.Node, bulletArcExNum: number, bulletLineExNum: number): boolean {
        if (this.player.inventoryMgr.equips[InventoryManager.REMOTE].equipmentType != InventoryManager.REMOTE) {
            return false
        }
        if (this.isCooling) {
            return false
        }
        let canFire = false
        let finalData = data.FinalCommon
        this.ammoRecovery = finalData.AmmoRecovery
        this.maxAmmo = finalData.MaxAmmo
        let cooldown = finalData.remoteCooldown
        let remoteInterval = finalData.remoteInterval
        if (cooldown < 500) {
            cooldown = 500
        }
        if (remoteInterval < 0) {
            remoteInterval = 0
        }
        let currentTime = Date.now()
        let offsetTime = currentTime - this.remoteIntervalTime
        if (offsetTime > remoteInterval) {
            if (offsetTime < remoteInterval * 2) {
                this.remoteAngleOffset += finalData.remoteAngle / 5
                if (this.remoteAngleOffset > finalData.remoteAngle) {
                    this.remoteAngleOffset = finalData.remoteAngle
                }
            } else {
                this.remoteAngleOffset = 0
            }
            this.remoteIntervalTime = currentTime
            canFire = true
        }

        if (!canFire) {
            return false
        }
        data.currentAmmo--
        this.isHeavyRemotoAttacking = this.shooter.data.isHeavy == 1
        this.scheduleOnce(() => {
            this.isHeavyRemotoAttacking = false
        }, 0.2)
        if (this.shooter) {
            this.shooter.remoteDamagePlayer = data.getFinalRemoteDamage()
            this.shooter.fireBullet(Random.getRandomNum(-this.remoteAngleOffset, this.remoteAngleOffset), cc.v3(64, 0), bulletArcExNum, bulletLineExNum)
        }
        if (data.currentAmmo <= 0 && cooldownNode) {
            this.isCooling = true
            cooldownNode.width = 80
            cooldownNode.stopAllActions()
            cc.tween(cooldownNode)
                .to(cooldown / 1000, { width: 0 })
                .call(() => {
                    data.currentAmmo = finalData.MaxAmmo
                    this.isCooling = false
                    if (this.player.data.id == Logic.data.lastPlayerId) {
                        EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_AMMO, { x: this.player.data.currentAmmo, y: this.maxAmmo })
                    }
                })
                .start()
        }
        if (this.player.data.id == Logic.data.lastPlayerId) {
            EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_AMMO, { x: data.currentAmmo, y: finalData.MaxAmmo })
        }
        return true
    }
    private checkTimeDelay = new TimeDelay(0.5)
    updateLogic(dt: number) {
        let x = this.player.isFaceRight ? this.handsUpPos.x : -this.handsUpPos.x
        if (this.interactBuildingAttacking) {
            x = 0
        }
        let y = this.interactBuildingAttacking || !this.interactBuildingLift ? 0 : this.handsUpPos.y
        let offestY = this.player.isInWater() ? -24 : 0
        this.node.position = Logic.lerpPos(
            this.node.position,
            this.player.isFaceRight ? this.selfDefaultPos.add(cc.v3(x, y + offestY)) : this.otherDefaultPos.add(cc.v3(x, y + offestY)),
            dt * 5
        )
        if (this.meleeWeapon) {
            this.meleeWeapon.updateLogic(dt)
        }
        if (this.meleeCollideHelper) {
            this.meleeCollideHelper.updateLogic(cc.v3(this.node.position.x, 0), this.meleeWeapon ? this.meleeWeapon : this.shadowWeapon.meleeWeapon)
        }
        if (this.shooter) {
            this.shooter.updateLogic(dt)
        }
        if (
            !this.isCooling &&
            this.shooter.data.equipmentType == InventoryManager.REMOTE &&
            this.ammoRecovery > 0 &&
            this.player.data.currentAmmo < this.maxAmmo &&
            this.checkTimeDelay.check(dt)
        ) {
            this.player.data.currentAmmo += this.ammoRecovery
            if (this.player.data.currentAmmo > this.maxAmmo) {
                this.player.data.currentAmmo = this.maxAmmo
            }
            if (this.player.data.id == Logic.data.lastPlayerId) {
                EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_AMMO, { x: this.player.data.currentAmmo, y: this.maxAmmo })
            }
        }
    }
}
