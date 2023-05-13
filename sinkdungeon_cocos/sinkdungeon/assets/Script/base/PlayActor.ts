import FromData from '../data/FromData'
import TriggerData from '../data/TriggerData'
import Random from '../utils/Random'
import StatusManager from '../manager/StatusManager'
import Dungeon from '../logic/Dungeon'
import InventoryManager from '../manager/InventoryManager'
import Shooter from '../logic/Shooter'
import Actor from './Actor'
import ShadowPlayer from '../actor/ShadowPlayer'
import PlayerWeapon from '../logic/PlayerWeapon'
import PlayerData from '../data/PlayerData'
import NonPlayerData from '../data/NonPlayerData'
import JumpingAbility from '../actor/JumpingAbility'
import PlayerAvatar from '../logic/PlayerAvatar'
import FrameAvatar from '../logic/FrameAvatar'
import { EventHelper } from '../logic/EventHelper'
import FloatingLabelData from '../data/FloatingLabelData'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// 地图里的所有建筑生物道具都是由Actor组成的
const { ccclass, property } = cc._decorator

@ccclass
export default abstract class PlayActor extends Actor {
    dungeon: Dungeon
    triggerShooter: Shooter
    inventoryManager: InventoryManager
    statusMgr: StatusManager
    shadowList: ShadowPlayer[]
    handLeft: PlayerWeapon
    handRight: PlayerWeapon
    jumpAbility: JumpingAbility
    avatar: PlayerAvatar
    frameAvatar: FrameAvatar
    currentDir = 3
    isWeaponDashing = false
    abstract init(): void
    abstract get IsVariation(): boolean
    abstract get Root(): cc.Node
    abstract isInWater(): boolean
    abstract playerAnim(status: number, dir: number): void
    abstract getWalkSmoke(parentNode: cc.Node, pos: cc.Vec3): void
    hideSelf(hideDuration: number) {
        if (hideDuration > 0) {
            this.invisible = true
            this.scheduleOnce(() => {
                this.stopHiding()
            }, hideDuration)
        }
    }
    updateData(): void {}
    stopHiding() {
        this.invisible = false
        this.statusMgr.stopStatus(StatusManager.TALENT_INVISIBLE)
    }
    showFloatFont(d: number, isDodge: boolean, isMiss: boolean, isCritical: boolean, isBlock: boolean, isBackStab: boolean, isAvoidDeath: boolean) {
        let y = 0
        if (this.Root) {
            y = this.Root.y
        }
        let worldPos = this.node.convertToWorldSpaceAR(cc.v3(0, y + 80))
        EventHelper.emit(EventHelper.HUD_SHOW_FLOATING_LABEL, {
            data: FloatingLabelData.create(worldPos, d, isDodge, isMiss, isCritical, isBlock, isBackStab, isAvoidDeath)
        })
    }
    get Hv(): cc.Vec2 {
        return this.hv
    }
    playerData: PlayerData
    nonPlayerData: NonPlayerData
    protected onLoad(): void {
        this.init()
    }
    /**
     * 额外物品装备效果触发
     * @param group 触发类别
     * @param type 触发类型
     * @param from 来源
     * @param actor 目标
     * @param onlyItem 仅物品
     */
    exTrigger(group: number, type: number, from?: FromData, actor?: Actor, onlyItem?: boolean): void {
        if (this.inventoryManager) {
            if (!onlyItem) {
                let data = this.inventoryManager.TotalEquipData
                for (let d of data.exTriggers) {
                    this.exTriggerDo(d, group, type, from, actor)
                }
            }
            for (let data of this.inventoryManager.itemList) {
                for (let d of data.exTriggers) {
                    this.exTriggerDo(d, group, type, from, actor)
                }
            }
        }
    }
    exTriggerDo(data: TriggerData, group: number, type: number, from: FromData, actor: Actor) {
        if (data.group != group || data.type != type) {
            return
        }
        switch (data.id) {
            case TriggerData.ID_STATUS:
                this.exTriggerStatus(data, from, actor)
                break
            case TriggerData.ID_BULLET:
                this.exTriggerBullet(data)
                break
            case TriggerData.ID_TALENT:
                this.exTriggerTalent(data, from, actor)
                break
        }
    }
    private exTriggerBullet(data: TriggerData) {
        let count = data.count
        let canShoot = true
        if (count < 1) {
            canShoot = Random.rand() < count
            count = 1
        } else {
            count = Math.floor(count)
        }
        if (canShoot) {
            if (count > 1) {
                for (let i = 0; i < count; i++) {
                    this.exTriggerBulletDo(data)
                }
            } else {
                this.exTriggerBulletDo(data)
            }
        }
    }
    private exTriggerBulletDo(data: TriggerData) {
        let bulletInterval = data.bulletInterval ? data.bulletInterval : 100
        let maxAmmo = data.maxAmmo ? data.maxAmmo : 0
        if (maxAmmo > 1) {
            this.schedule(
                () => {
                    this.exTriggerBulletFire(data)
                },
                bulletInterval,
                maxAmmo - 1
            )
        } else {
            this.exTriggerBulletFire(data)
        }
    }
    private exTriggerBulletFire(data: TriggerData) {
        let remoteAngleOffset = data.bulletAngle ? data.bulletAngle : 0
        this.triggerShooter.data.bulletType = data.res
        this.triggerShooter.data.bulletArcExNum = data.bulletArcExNum
        this.triggerShooter.data.bulletLineExNum = data.bulletLineExNum
        this.triggerShooter.data.bulletSize = data.bulletSize
        this.triggerShooter.data.bulletSize += this.IsVariation ? 0.5 : 0
        this.triggerShooter.data.bulletExSpeed = data.bulletSpeed
        let angle = Random.getRandomNum(-remoteAngleOffset, remoteAngleOffset)
        this.triggerShooter.fireBullet(angle, cc.v3(data.bulletOffsetX, 24))
        for (let s of this.shadowList) {
            if (s.node) {
                s.shooterEx.setHv(this.triggerShooter.Hv)
                s.shooterEx.data = this.triggerShooter.data.clone()
                s.shooterEx.fireBullet(angle, cc.v3(data.bulletOffsetX, 24))
            }
        }
    }
    protected exTriggerTalent(data: TriggerData, from: FromData, actor: Actor) {
        let count = data.count
        let canAdd = true
        if (count < 1) {
            canAdd = Random.rand() < count
            count = 1
        } else {
            count = Math.floor(count)
        }
        return canAdd
    }
    private exTriggerStatus(data: TriggerData, from: FromData, actor: Actor) {
        let count = data.count
        let canAdd = true
        if (count < 1) {
            canAdd = Random.rand() < count
            count = 1
        } else {
            count = Math.floor(count)
        }
        if (canAdd) {
            for (let i = 0; i < count; i++) {
                if (TriggerData.TARGET_OTHER == data.target && actor) {
                    actor.addStatus(data.res, new FromData())
                }
                if (TriggerData.TARGET_OTHER_NEAREST == data.target) {
                    StatusManager.addStatus2NearEnemy(this, data.res, from)
                } else if (TriggerData.TARGET_SELF == data.target) {
                    this.addStatus(data.res, new FromData())
                } else if (TriggerData.TARGET_ALL_ALLY == data.target) {
                    StatusManager.addStatus2NearAllies(this, this.node, data.res, data.range, from)
                } else if (TriggerData.TARGET_ALL_ENEMY == data.target) {
                    StatusManager.addStatus2NearEnemies(this, this.node, data.res, data.range, from)
                } else if (TriggerData.TARGET_ALL == data.target) {
                    this.addStatus(data.res, new FromData())
                    StatusManager.addStatus2NearEnemies(this, this.node, data.res, data.range, from)
                    StatusManager.addStatus2NearAllies(this, this.node, data.res, data.range, from)
                }
            }
        }
    }
}
