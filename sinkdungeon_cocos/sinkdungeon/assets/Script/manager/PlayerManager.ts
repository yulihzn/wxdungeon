import Dungeon from '../logic/Dungeon'
import Logic from '../logic/Logic'
import BaseManager from './BaseManager'
import Utils from '../utils/Utils'
import Player from '../logic/Player'
import BaseController from '../logic/BaseController'
import AiController from '../logic/AiController'
import PlayerController from '../logic/PlayerController'

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
export default class PlayerManager extends BaseManager {
    @property(cc.Prefab)
    playerPrefab: cc.Prefab = null
    private players: Player[] = new Array() //房间player列表
    private aiControllers: AiController[] = new Array()
    private playerController: PlayerController
    player1: Player
    private controllerCount = 0

    get PlayerList() {
        return this.players
    }

    clear(): void {
        this.aiControllers = []
        Utils.clearComponentArray(this.players)
    }
    public addAiPlayerFromMap(mapDataStr: string, indexPos: cc.Vec3, posZ: number) {
        if (Dungeon.hasThe(mapDataStr, 'player')) {
            let data = Logic.getPlayerDataById(mapDataStr)
            data.pos = indexPos.clone()
            data.posZ = posZ
            data.chapterIndex = Logic.data.chapterIndex
            data.chapterLevel = Logic.data.level
            let room = Logic.mapManager.getCurrentRoom()
            data.roomPos = cc.v3(room.x, room.y)
        }
    }
    public addPlayerListFromSave(dungeon: Dungeon) {
        this.players = []
        let room = Logic.mapManager.getCurrentRoom()
        for (let key in Logic.data.playerDatas) {
            let data = Logic.getPlayerDataById(key)
            if (data.roomPos.x == room.x && data.roomPos.y == room.y && data.chapterIndex == Logic.data.chapterIndex && data.chapterLevel == Logic.data.level) {
                this.players.push(this.getPlayer(data.id, dungeon))
            }
        }
    }
    private getPlayer(dataId: string, dungeon: Dungeon): Player {
        let player = cc.instantiate(this.playerPrefab).getComponent(Player)
        player.dataId = dataId
        let controller: PlayerController | AiController
        if (Logic.playerData.id == dataId) {
            controller = player.addComponent(PlayerController)
            player.statusIconList = dungeon.statusIconList
            this.playerController = controller
            this.player1 = player
        } else {
            controller = player.addComponent(AiController)
            this.aiControllers.push(controller)
        }
        controller.player = player
        player.controller = controller
        player.dungeon = dungeon
        player.node.parent = dungeon.node
        return player
    }
    updateLogic(dt: number) {
        this.playerController.updateLogic(dt)
        if (this.aiControllers.length > 0 && this.controllerCount < this.aiControllers.length) {
            this.aiControllers[this.controllerCount++].updateLogic(dt)
        } else {
            this.controllerCount = 0
        }
    }
}
