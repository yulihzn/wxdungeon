import StatusData from '../data/StatusData'
import Logic from '../logic/Logic'
import FromData from '../data/FromData'
import Status from '../status/Status'
import Actor from '../base/Actor'
import StatusIcon from '../ui/StatusIcon'
import StatusIconList from '../ui/StatusIconList'
import Player from '../logic/Player'
import ActorUtils from '../utils/ActorUtils'

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
export default class StatusManager extends cc.Component {
    public static readonly FROZEN = 'status001'
    public static readonly BURNING = 'status002'
    public static readonly DIZZ = 'status003'
    public static readonly TOXICOSIS = 'status004'
    public static readonly CURSING = 'status005'
    public static readonly BLEEDING = 'status006'
    public static readonly ATTACKPLUS = 'status007'
    public static readonly FASTMOVE = 'status008'
    public static readonly FASTATTACK = 'status009'
    public static readonly PERFECTDEFENCE = 'status010'
    public static readonly HEALING = 'status011'
    public static readonly RECOVERY = 'status012'
    public static readonly STONE = 'status013'
    public static readonly TWINE = 'status014'
    public static readonly SHIELD_NORMAL = 'status015'
    public static readonly SHIELD_LONG = 'status016'
    public static readonly BOTTLE_HEALING = 'status017'
    public static readonly TALENT_AIMED = 'status018'
    public static readonly SHOES_SPEED = 'status019'
    public static readonly CLOTHES_RECOVERY = 'status020'
    public static readonly WEREWOLFDEFENCE = 'status021'
    public static readonly GOLDAPPLE = 'status022'
    public static readonly MAGIC_WEAPON = 'status023'
    public static readonly MAGIC_WEAPON_STRONG = 'status024'
    public static readonly FROZEN_STRONG = 'status025'
    public static readonly TALENT_INVISIBLE = 'status026'
    public static readonly SHIELD_PARRY = 'status027'
    public static readonly TALENT_FLASH_DIZZ = 'status028'
    public static readonly TALENT_FLASH_SPEED = 'status029'
    public static readonly BOTTLE_REMOTE = 'status030'
    public static readonly WINE_CLOUD = 'status033'
    public static readonly FALLEN_DOWN = 'status034'
    public static readonly DIZZ_LONG = 'status035'
    public static readonly PET_DOG = 'status037'
    public static readonly REAGENT = 'status038'
    public static readonly REAGENT_SIDE_EFFECT = 'status039'
    public static readonly AVOID_DEATH = 'status065'
    public static readonly CAMP_FIRE = 'status066'
    public static readonly HOLOGRAPHIC_DODGE = 'status067'
    public static readonly DRINK = 'status068'
    public static readonly SANITY_UP = 'status069'
    public static readonly SANITY_DOWN = 'status070'
    public static readonly EAT = 'status071'
    public static readonly INSANE = 'status072'

    @property(cc.Prefab)
    statusPrefab: cc.Prefab = null
    private statusMap: Map<number, Status>
    public statusIconList: StatusIconList
    private totalStatusData: StatusData = new StatusData()
    private actor: Actor
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.statusMap = new Map<number, Status>()
        this.actor = this.node.parent.getComponent(Actor)
    }

    start() {}
    addCustomStatus(data: StatusData, from: FromData) {
        if (!data) {
            return
        }
        let sd = new StatusData()
        sd.valueCopy(data)
        sd.From.valueCopy(from)
        if (this.stopOtherUniqueStatus(sd.unique)) {
            this.showStatus(sd, false)
        }
    }
    addStatus(resName: string, from: FromData, isFromSave?: boolean) {
        if (resName.length < 1) {
            return
        }
        let sd = new StatusData()
        sd.valueCopy(Logic.status[resName])
        sd.From.valueCopy(from)
        if (this.stopOtherUniqueStatus(sd.unique)) {
            this.showStatus(sd, isFromSave)
        }
    }
    addStatusListFromSave(statusList: StatusData[]) {
        if (statusList && statusList.length > 0) {
            for (let s of statusList) {
                let sd = new StatusData()
                sd.valueCopy(s)
                sd.From.valueCopy(new FromData())
                this.showStatus(sd, true)
            }
        }
    }
    hasStatus(resName: string): boolean {
        let sd = new StatusData()
        sd.valueCopy(Logic.status[resName])
        if (this.statusMap.has(sd.id)) {
            let s = this.statusMap.get(sd.id)
            if (s && s.node && s.isValid && s.isStatusRunning() && s.data.id == sd.id) {
                return true
            }
        }

        return false
    }
    stopStatus(resName: string): void {
        let sd = new StatusData()
        sd.valueCopy(Logic.status[resName])
        if (this.statusMap.has(sd.id)) {
            let s = this.statusMap.get(sd.id)
            if (s && s.node && s.isValid && s.isStatusRunning() && s.data.id == sd.id) {
                s.stopStatus()
            }
        }
    }
    stopOtherUniqueStatus(unique: number): boolean {
        if (unique < 1) {
            return true
        }
        this.statusMap.forEach(s => {
            if (s && s.data && s.data.unique == unique) {
                if (s.data.duration < 0) {
                    return false
                } else {
                    s.stopStatus()
                    return true
                }
            }
        })
        return true
    }
    stopAllStatus(): void {
        this.statusMap.forEach(s => {
            s.stopStatus()
        })
    }
    stopAllBuffs(): void {
        this.statusMap.forEach(s => {
            if (s && s.data && s.data.type == Status.BUFF) {
                s.stopStatus()
            }
        })
    }
    stopAllDebuffs(): void {
        this.statusMap.forEach(s => {
            if (s && s.data && s.data.type == Status.DEBUFF) {
                s.stopStatus()
            }
        })
    }
    private showStatus(data: StatusData, isFromSave: boolean) {
        //去除已经失效的状态
        this.statusMap.forEach((s, key) => {
            if (!s || !s.node || !s.isValid) {
                this.statusMap.delete(key)
            }
        })
        //新的状态如果存在则叠加时效且重新触发
        if (this.statusMap.has(data.id)) {
            let s = this.statusMap.get(data.id)
            if (s && s.node && s.isValid && s.isStatusRunning() && s.data.id == data.id) {
                // s.data.duration = data.duration;
                if (s.data.duration > 0 && data.duration > 0) {
                    data.duration += s.data.duration
                }
                s.showStatus(data, this.actor, isFromSave)
                return
            }
        }

        let statusNode: cc.Node = cc.instantiate(this.statusPrefab)
        statusNode.parent = this.node
        statusNode.active = true
        let status = statusNode.getComponent(Status)
        if (this.statusMap.has(data.id)) {
            let s = this.statusMap.get(data.id)
            this.statusMap.set(9999 + s.data.id, s)
        }
        this.statusMap.set(data.id, status)
        if (this.statusIconList) {
            let icon = this.statusIconList.getIcon()
            status.icon = icon
        }
        status.showStatus(data, this.actor, isFromSave)
    }

    update(dt) {
        if (Logic.isGamePause) {
            return
        }
        if (this.node.parent) {
            this.node.scaleX = this.node.parent.scaleX > 0 ? 1 : -1
        }
        if (this.isTimeDelay(dt)) {
            if (this.actor) {
                let dataList = this.updateStatus()
                this.actor.updateStatus(dataList, this.totalStatusData)
            }
        }
    }
    private timeDelay = 0
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt
        if (this.timeDelay > 1) {
            this.timeDelay = 0
            return true
        }
        return false
    }
    private updateStatus(): StatusData[] {
        this.totalStatusData = new StatusData()
        let dataList: StatusData[] = new Array()
        this.statusMap.forEach(s => {
            if (s && s.node && s.isValid) {
                s.updateLogic()
                if (s.data.duration == 0) {
                    this.addStatus(s.data.finishStatus, s.data.From)
                } else {
                    this.totalStatusData.missRate += s.data.missRate ? s.data.missRate : 0
                    this.totalStatusData.variation += s.data.variation ? s.data.variation : 0
                    this.totalStatusData.exOilGold += s.data.exOilGold ? s.data.exOilGold : 0
                    this.totalStatusData.clearHealth += s.data.clearHealth ? s.data.clearHealth : 0
                    this.totalStatusData.avoidDeath += s.data.avoidDeath ? s.data.avoidDeath : 0
                    this.totalStatusData.Common.add(s.data.Common)
                    dataList.push(s.data.clone())
                }
            }
        })
        return dataList
    }
    static addStatus2NearEnemy(player: Player, statusName: string, from: FromData) {
        if (!player) {
            return
        }
        let target = ActorUtils.getNearestEnemyActor(player.node.position, false, player.dungeon)
        if (target && target.node && target.node.active && !target.sc.isDied && !target.sc.isDisguising) {
            target.addStatus(statusName, from)
        }
    }

    static addStatus2NearEnemies(player: Player, targetNode: cc.Node, statusName: string, range: number, from: FromData) {
        if (!player) {
            return
        }
        for (let monster of player.dungeon.monsterManager.monsterList) {
            let dis = Logic.getDistanceNoSqrt(targetNode.position, monster.node.position)
            if (monster && monster.node && monster.node.active && dis < range && !monster.sc.isDied && !monster.sc.isDisguising) {
                monster.addStatus(statusName, from)
            }
        }
        for (let boss of player.dungeon.monsterManager.bossList) {
            let dis = Logic.getDistanceNoSqrt(targetNode.position, boss.node.position)
            if (dis < range && !boss.sc.isDied) {
                boss.addStatus(statusName, from)
            }
        }
    }
    static addStatus2NearAllies(player: Player, targetNode: cc.Node, statusName: string, range: number, from: FromData) {
        if (!player) {
            return
        }
        for (let ally of player.dungeon.nonPlayerManager.nonPlayerList) {
            let dis = Logic.getDistanceNoSqrt(targetNode.position, ally.node.position)
            if (ally && ally.node && ally.node.active && dis < range && !ally.sc.isDied && !ally.sc.isDisguising) {
                ally.addStatus(statusName, from)
            }
        }
    }
}
