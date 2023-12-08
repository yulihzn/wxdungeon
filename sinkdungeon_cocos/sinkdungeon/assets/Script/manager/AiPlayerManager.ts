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
    public addAiPlayerFromMap(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3, posZ: number) {
        if (Dungeon.hasThe(mapDataStr, 'player')) {
            Logic.getPlayerDataById(mapDataStr)
        }
    }
    public addAiPlayerListFromSave(dungeon: Dungeon, list: string[]) {
        if (!list) {
            return
        }
        let room = Logic.mapManager.getCurrentRoom()
        for (let key of list) {
            let data = Logic.getPlayerDataById(key)
            if (data.roomPos.x == room.x && data.roomPos.y == room.y && data.chapterIndex == Logic.chapterIndex && data.chapterLevel == Logic.level)
                this.getPlayer(data.id, dungeon)
        }
    }
    private getPlayer(dataId: string, dungeon: Dungeon): Player {
        let player = cc.instantiate(this.playerPrefab).getComponent(Player)
        player.dataId = dataId
        let controller = player.addComponent(AiController)
        controller.player = player
        player.controller = controller
        player.node.parent = dungeon.node
        player.dungeon = dungeon
        return player
    }
    updateLogic(dt: number) {}
}
