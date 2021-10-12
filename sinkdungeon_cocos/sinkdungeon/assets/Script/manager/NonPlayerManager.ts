import Dungeon from "../Dungeon";
import Logic from "../Logic";
import BaseManager from "./BaseManager";
import Utils from "../utils/Utils";
import NonPlayer from "../NonPlayer";
import NonPlayerData from "../data/NonPlayerData";
import Achievement from "../Achievement";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NonPlayerManager extends BaseManager {
    public static readonly NON_SHADOW = 'nonplayer001';
    public static readonly SHOP_KEEPER = 'nonplayer002';
    public static readonly DOG = 'nonplayer100';
    // LIFE-CYCLE CALLBACKS:

    // update (dt) {}

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Prefab)
    nonplayer: cc.Prefab = null;

    private nonplayers: NonPlayer[] = new Array();//房间npc列表
    pet: NonPlayer;
    get nonPlayerList() {
        return this.nonplayers;
    }
   
    clear(): void {
        Utils.clearComponentArray(this.nonplayers);
    }
    public addNonPlayerListFromSave(dungeon: Dungeon, list: NonPlayerData[], position: cc.Vec3) {
        for (let data of list) {
            if (data.isPet || data.lifeTime > 0) { 
                this.addNonPlayer(this.getNonPlayer(data, dungeon), position);
            }
        }
    }
    /**添加npc */
    public addNonPlayerFromData(resName: string, pos: cc.Vec3, dungeon: Dungeon) {
        let data = new NonPlayerData();
        data.valueCopy(Logic.nonplayers[resName]);
        Achievement.addNpcsAchievement(data.resName);
        this.addNonPlayer(this.getNonPlayer(data, dungeon), pos);
    }

    isPetAlive() {
        if (this.pet && this.pet.isValid && this.pet.node.active && this.pet.data.currentHealth > 0) {
            return true;
        }
        return false;
    }
    addPetFromData(data: NonPlayerData, pos: cc.Vec3, dungeon: Dungeon) {
        let hasPetCount = 0;
        for (let p of this.nonPlayerList) {
            if (p.data.isPet > 0) {
                hasPetCount++;
            }
        }
        if (this.isPetAlive()) {
            return;
        }
        Achievement.addNpcsAchievement(data.resName);
        this.addNonPlayer(this.getNonPlayer(data, dungeon), pos);
    }

    public addNonPlayerFromMap(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3) {
        if (mapDataStr == 'N0') {
            this.addNonPlayerFromData(NonPlayerManager.NON_SHADOW, Dungeon.getPosInMap(indexPos), dungeon);
        }
    }
    private getNonPlayer(nonPlayerData: NonPlayerData, dungeon: Dungeon): NonPlayer {
        let nonPlayerPrefab: cc.Node = null;
        nonPlayerPrefab = cc.instantiate(this.nonplayer);
        nonPlayerPrefab.active = false;
        nonPlayerPrefab.parent = dungeon.node;
        let nonPlayer = nonPlayerPrefab.getComponent(NonPlayer);
        let data = new NonPlayerData();
        nonPlayer.dungeon = dungeon;
        data.valueCopy(nonPlayerData);
        data.isEnemy = 0;
        nonPlayer.data = data;
        nonPlayer.sc.isDisguising = data.disguise > 0;
        if (nonPlayer.sc.isDisguising) {
            nonPlayer.changeBodyRes(data.resName, NonPlayer.RES_DISGUISE);
        } else {
            nonPlayer.changeBodyRes(data.resName, NonPlayer.RES_IDLE000);
        }
        return nonPlayer;
    }
    private addNonPlayer(nonPlayer: NonPlayer, pos: cc.Vec3) {
        //激活
        nonPlayer.node.active = true;
        nonPlayer.pos = Dungeon.getIndexInMap(pos);
        nonPlayer.node.position = pos;
        this.nonPlayerList.push(nonPlayer);
        if (nonPlayer.data.isPet > 0) {
            this.pet = nonPlayer;
        }
    }

    timeDelay = 0;
    updateLogic(dt: number) {
        Logic.nonPlayerList = [];
        for (let monster of this.nonPlayerList) {
            if (monster && monster.node.active) {
                monster.updateLogic(dt);
                let data = monster.data.clone();
                if (monster.leftLifeTime > 0) {
                    data.lifeTime = monster.leftLifeTime;
                }
                if (data.currentHealth > 0) {
                    Logic.nonPlayerList.push(data);
                }
            }
        }
    }

}
