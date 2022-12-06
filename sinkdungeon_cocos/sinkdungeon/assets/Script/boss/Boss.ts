import HealthBar from '../logic/HealthBar'
import Logic from '../logic/Logic'
import Dungeon from '../logic/Dungeon'
import StatusManager from '../manager/StatusManager'
import { EventHelper } from '../logic/EventHelper'
import Actor from '../base/Actor'
import FromData from '../data/FromData'
import Item from '../item/Item'
import IndexZ from '../utils/IndexZ'
import NonPlayerData from '../data/NonPlayerData'
import StatusData from '../data/StatusData'
import Shooter from '../logic/Shooter'
import EquipmentManager from '../manager/EquipmentManager'
import MapManager from '../manager/MapManager'

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
export default abstract class Boss extends Actor {
    @property(StatusManager)
    statusManager: StatusManager = null
    healthBar: HealthBar = null
    dungeon: Dungeon
    pos: cc.Vec3 = cc.v3(0, 0)
    defaultPos: cc.Vec3 = cc.v3(0, 0)
    data: NonPlayerData = new NonPlayerData()
    abstract init(type: number): void
    abstract killed(): void
    abstract bossAction(): void
    abstract updateLogic(dt: number): void
    /**添加状态 */
    addStatus(statusType: string, from: FromData) {
        if (!this.node || this.sc.isDied) {
            return
        }
        if (this.statusManager) {
            this.statusManager.addStatus(statusType, from)
        }
    }
    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node, offset?: cc.Vec3): number {
        let p = this.node.position.clone()
        if (offset) {
            p.addSelf(offset)
        }
        let dis = Logic.getDistanceNoSqrt(this.node.position, playerNode.position)
        return dis
    }
    /**获取中心位置 */
    getCenterPosition(): cc.Vec3 {
        return this.node.position.clone().addSelf(cc.v3(0, 32 * this.node.scaleY))
    }
    playHit(sprite: cc.Node) {
        if (sprite) {
            sprite.stopAllActions()
            sprite.position = cc.v3(0, 0)
            cc.tween(sprite)
                .to(0.1, { position: cc.v3(2, 0) })
                .to(0.1, { position: cc.v3(-2, 0) })
                .to(0.1, { position: cc.v3(2, 0) })
                .to(0.1, { position: cc.v3(-2, 0) })
                .to(0.1, { position: cc.v3(2, 0) })
                .to(0.1, { position: cc.v3(-2, 0) })
                .to(0.1, { position: cc.v3(2, 0) })
                .to(0.1, { position: cc.v3(0, 0) })
                .start()
        }
    }
    updatePlayerPos() {
        // this.node.x = this.pos.x * 64 + 32;
        // this.node.y = this.pos.y * 64 + 32;
        this.entity.Transform.position = Dungeon.getPosInMap(this.pos)
        this.node.position = this.entity.Transform.position.clone()
    }
    transportBoss(x: number, y: number) {
        this.pos.x = x
        this.pos.y = y
        this.changeZIndex()
        this.updatePlayerPos()
    }
    changeZIndex() {
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position)
    }

    start() {
        this.changeZIndex()
        this.scheduleOnce(() => {
            if (this.healthBar) {
                this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.MaxHealth)
            }
        }, 0.1)
    }
    getLoot(isSteal?: boolean) {
        if (this.dungeon) {
            let rand4save = Logic.mapManager.getRandom4Save(this.seed, MapManager.RANDOM_BOSS)
            EventHelper.emit(EventHelper.DUNGEON_ADD_COIN, { pos: this.node.position, count: isSteal ? 9 : 19 })
            if (!isSteal) {
                EventHelper.emit(EventHelper.DUNGEON_ADD_OILGOLD, { pos: this.node.position, count: 100 })
            }
            let chance = (Logic.getHalfChance() && isSteal) || !isSteal
            if (chance) {
                EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM, { res: Item.HEART })
                EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM, { res: Item.DREAM })
            }
            this.dungeon.addEquipment(Logic.getRandomEquipType(rand4save), null, null, isSteal ? 0 : EquipmentManager.QUALITY_ORANGE)
        }
    }
    showBoss() {}
    fireShooter(shooter: Shooter, bulletType: string, bulletArcExNum: number, bulletLineExNum: number, angle?: number): void {
        shooter.dungeon = this.dungeon
        shooter.actor = this
        shooter.data.bulletType = bulletType
        shooter.data.bulletArcExNum = bulletArcExNum
        shooter.data.bulletLineExNum = bulletLineExNum
        shooter.fireBullet(angle)
    }
    takeDizz(dizzDuration: number): void {}
    updateStatus(statusList: StatusData[], totalStatusData: StatusData): void {
        this.data.StatusTotalData.valueCopy(totalStatusData)
    }
    hideSelf(hideDuration: number): void {}
    updateDream(offset: number): number {
        return 0
    }
    updateLife(sanity: number, solid: number, liquid: number): void {}
    setLinearVelocity(movement: cc.Vec2) {}
}
