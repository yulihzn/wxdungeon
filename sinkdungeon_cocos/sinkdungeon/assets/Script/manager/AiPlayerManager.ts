import Dungeon from '../logic/Dungeon'
import Logic from '../logic/Logic'
import BaseManager from './BaseManager'
import Utils from '../utils/Utils'
import Player from '../logic/Player'
import PlayerController from '../logic/PlayerController'
import BaseController from '../logic/BaseController'
import PlayerData from '../data/PlayerData'
import AiController from '../logic/AiController'

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
export default class AiPlayerManager extends BaseManager {
    @property(cc.Prefab)
    playerPrefab: cc.Prefab = null
    private player1: Player
    private players: Player[] = new Array() //房间player列表
    private controllers: BaseController[] = new Array()

    get PlayerList() {
        return this.players
    }

    clear(): void {
        Utils.clearComponentArray(this.players)
    }
    public addAiPlayerListFromSave(dungeon: Dungeon, list: PlayerData[]) {
        let room = Logic.mapManager.getCurrentRoom()
        for (let data of list) {
            if (data.roomPos.x == room.x && data.roomPos.y == room.y && data.chapterIndex == Logic.chapterIndex && data.chapterLevel == Logic.level) this.getPlayer(data, dungeon)
        }
    }
    /**添加npc */
    public addNonPlayerFromData(data: PlayerData, dungeon: Dungeon) {
        this.getPlayer(data, dungeon)
    }
    private getPlayer(playerData: PlayerData, dungeon: Dungeon): Player {
        let player = cc.instantiate(this.playerPrefab).getComponent(Player)
        let data = new PlayerData()
        data.valueCopy(Logic.players[playerData.id])
        data.valueCopy(playerData)
        player.data = data
        let controller = player.addComponent(AiController)
        controller.player = player
        player.controller = controller
        player.node.parent = dungeon.node
        player.dungeon = dungeon
        return player
    }
    timeDelay = 0
    updateLogic(dt: number) {}
}
