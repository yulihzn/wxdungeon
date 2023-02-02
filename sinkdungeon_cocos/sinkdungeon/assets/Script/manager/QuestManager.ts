import Coin from '../item/Coin'
import Dungeon from '../logic/Dungeon'
import OilGold from '../item/OilGold'
import IndexZ from '../utils/IndexZ'
import BaseManager from './BaseManager'
import ShopTable from '../building/ShopTable'
import Logic from '../logic/Logic'
import Item from '../item/Item'
import Player from '../logic/Player'
import { EventHelper } from '../logic/EventHelper'
import QuestData from '../editor/data/QuestData'

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
export default class QuestManager extends BaseManager {
    negativeList: QuestData[] = []
    activeList: QuestData[] = []
    finishList: QuestData[] = []
    onLoad() {}
    clear(): void {}

    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 0.2) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }

    updateLogic(dt: number, player: Player) {
        if (this.isCheckTimeDelay(dt)) {
        }
    }
    /**
     * 进入房间加载已触发、已完成、已失败任务里的建筑道具和npc
     */
    checkQuestTrigger() {
        for (let q of this.negativeList) {
            for (let t of q.triggerCondition.list) {
                t.targetType
            }
        }
    }
}
