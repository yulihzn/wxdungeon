// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DamageData from '../data/DamageData'
import EquipmentData from '../data/EquipmentData'
import PlayerData from '../data/PlayerData'
import Dungeon from '../logic/Dungeon'
import Logic from '../logic/Logic'
import Player from '../logic/Player'
import PlayerWeapon from '../logic/PlayerWeapon'
import Shooter from '../logic/Shooter'
import IndexZ from '../utils/IndexZ'
import NextStep from '../utils/NextStep'

const { ccclass, property } = cc._decorator

@ccclass
export default class ShadowPlayer extends cc.Component {
    @property(PlayerWeapon)
    weaponLeft: PlayerWeapon = null
    @property(PlayerWeapon)
    weaponRight: PlayerWeapon = null
    @property(Shooter)
    shooterEx: Shooter = null
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    player: Player
    mat: cc.MaterialVariant
    index = 0
    lifeNext: NextStep = new NextStep()
    isStop = false
    targetPos: cc.Vec3 = cc.v3(0, 0)
    movePos: cc.Vec3 = cc.v3(0, 0)
    playerLastPos: cc.Vec3 = cc.v3(0, 0)
    moveList: cc.Vec3[] = []
    isVanishing = false

    init(player: Player, spriteframe: cc.SpriteFrame, index: number, lifeTime: number) {
        let duration = lifeTime ? lifeTime : 30
        this.player = player
        this.index = index
        this.player.data.ShadowList[this.index] = Date.now()
        this.node.parent = this.player.node.parent
        this.weaponLeft.init(this.player, true, true)
        this.weaponRight.init(this.player, false, true)
        this.weaponLeft.node.opacity = 0
        this.weaponRight.node.opacity = 0
        this.shooterEx.player = this.player
        this.shooterEx.isEx = true
        this.shooterEx.actor = this.player
        this.shooterEx.dungeon = this.player.dungeon
        this.weaponLeft.shooter.actor = this.player
        this.weaponRight.shooter.actor = this.player
        this.mat = this.sprite.getMaterial(0)
        this.sprite.node.scaleX = 1
        this.sprite.node.scaleY = -1
        this.sprite.spriteFrame = spriteframe
        this.node.zIndex = IndexZ.getActorZIndex(Dungeon.getIndexInMap(this.node.position))
        this.sprite.node.width = this.sprite.spriteFrame.getOriginalSize().width
        this.sprite.node.height = this.sprite.spriteFrame.getOriginalSize().height
        this.node.position = this.player.node.position.clone()
        this.targetPos = this.player.node.position.clone()
        this.playerLastPos = this.player.node.position.clone()
        this.isStop = false
        this.isVanishing = false
        this.lifeNext.next(
            () => {},
            duration,
            true,
            (lastTime: number) => {
                let currentTime = Date.now()
                if (currentTime - lastTime < duration * 1000 && this.node && this.isValid && !this.isStop) {
                    this.player.data.ShadowList[this.index] = lastTime
                }
                if (currentTime - lastTime > duration * 1000) {
                    this.stop()
                }
            }
        )
    }
    attack(data: PlayerData, comboType: number, hv: cc.Vec2, isLeft: boolean): boolean {
        if (!this.node) {
            return false
        }
        if (isLeft) {
            return this.weaponLeft.shadowWeapon.attack(data, comboType, hv)
        } else {
            return this.weaponRight.shadowWeapon.attack(data, comboType, hv)
        }
    }
    remoteAttack(isLeft: boolean, data: EquipmentData, hv: cc.Vec2, damage: DamageData, bulletArcExNum: number, bulletLineExNum: number): boolean {
        if (!this.node) {
            return false
        }
        let shooter = isLeft ? this.weaponLeft.shooter : this.weaponRight.shooter
        shooter.data = data.clone()
        shooter.setHv(hv)
        shooter.remoteDamagePlayer = damage
        shooter.fireBullet(0, cc.v3(30, 0), bulletArcExNum, bulletLineExNum)
    }
    stop() {
        if (this.isValid) {
            this.isStop = true
            this.player.data.ShadowList[this.index] = 0
            this.node.active = false
            this.enabled = false
            this.destroy()
        }
    }
    /**获取中心位置 */
    getCenterPosition(): cc.Vec3 {
        return this.node.position.clone().addSelf(cc.v3(0, 32 * this.node.scaleY))
    }
    vanish(duration: number) {
        this.isVanishing = true
        this.scheduleOnce(() => {
            this.isVanishing = false
        }, duration)
    }
    updateLogic(dt: number) {
        if (this.player) {
            if (this.weaponLeft) {
                this.weaponLeft.updateLogic(dt)
            }
            if (this.weaponRight) {
                this.weaponRight.updateLogic(dt)
            }
            if (this.shooterEx) {
                this.shooterEx.updateLogic(dt)
            }
            this.movePos.x += Math.abs(this.player.node.position.x - this.playerLastPos.x)
            this.movePos.y += Math.abs(this.player.node.position.y - this.playerLastPos.y)
            this.playerLastPos = this.player.node.position.clone()
            let offset = 5
            if (this.movePos.x > offset || this.movePos.y > offset) {
                this.movePos = cc.v3(0, 0)
                let p = this.player.node.position.clone()
                p.z = this.player.isFaceRight ? 1 : -1
                this.moveList.push(p)
            }
            if (this.moveList.length > 0) {
                let x = this.moveList[0].x - this.targetPos.x
                let y = this.moveList[0].y - this.targetPos.y
                if (x * x + y * y < offset * offset) {
                    this.moveList.splice(0, 1)
                }
                if (this.moveList.length > 10 * (this.index + 1)) {
                    this.targetPos = this.moveList[0].clone()
                    // this.node.scaleX = this.targetPos.z;
                }
            }
            this.node.zIndex = IndexZ.getActorZIndex(Dungeon.getIndexInMap(this.node.position))
            this.sprite.node.opacity = 200 - this.index * 20
            if (this.isVanishing) {
                this.sprite.node.opacity = 0
            }
            this.sprite.node.y = this.player.root.y
            this.shooterEx.node.y = this.player.root.y
            this.weaponLeft.shooter.node.y = this.player.root.y
            this.weaponRight.shooter.node.y = this.player.root.y
            this.mat.setProperty('textureSizeWidth', this.sprite.spriteFrame.getTexture().width)
            this.mat.setProperty('textureSizeHeight', this.sprite.spriteFrame.getTexture().height)
            this.mat.setProperty('outlineColor', cc.color(200, 200, 200))
            this.mat.setProperty('outlineSize', 4)
            if (!this.weaponLeft.shadowWeapon.IsAttacking && !this.weaponRight.shadowWeapon.IsAttacking) {
                this.node.position = Logic.lerpPos(this.node.position, this.targetPos, dt * 3)
            }
        }
    }
}
