import { EventHelper } from './EventHelper'
import PlayerData from '../data/PlayerData'
import EquipmentData from '../data/EquipmentData'
import MapManager from '../manager/MapManager'
import Dungeon from './Dungeon'
import StatusData from '../data/StatusData'
import InventoryManager from '../manager/InventoryManager'
import BulletData from '../data/BulletData'
import ItemData from '../data/ItemData'
import Random from '../utils/Random'
import TalentData from '../data/TalentData'
import ProfileManager from '../manager/ProfileManager'
import AudioPlayer from '../utils/AudioPlayer'
import FromData from '../data/FromData'
import WorldLoader from '../map/WorldLoader'
import ProfessionData from '../data/ProfessionData'
import Random4Save from '../utils/Random4Save'
import ExitData from '../data/ExitData'
import LocalStorage from '../utils/LocalStorage'
import SavePointData from '../data/SavePointData'
import NonPlayerData from '../data/NonPlayerData'
import SuitData from '../data/SuitData'
import InventoryData from '../data/InventoryData'
import GroundOilGoldData from '../data/GroundOilGoldData'
import OilGoldData from '../data/OilGoldData'
import FurnitureData from '../data/FurnitureData'
import LoadingManager from '../manager/LoadingManager'
import DialogueData from '../data/DialogueData'
import BuildingData from '../data/BuildingData'
import SettingsData from '../data/SettingsData'

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
export default class Logic extends cc.Component {
    static readonly BOSS_LEVEL_1: number = 10
    static readonly CHAPTER00: number = 0
    static readonly CHAPTER01: number = 1
    static readonly CHAPTER02: number = 2
    static readonly CHAPTER03: number = 3
    static readonly CHAPTER04: number = 4
    static readonly CHAPTER05: number = 5
    static readonly CHAPTER099: number = 99

    static readonly OIL_GOLD_LIST = [
        100, 150, 200, 300, 500, 1000, 1500, 2000, 3000, 5000, 10000, 15000, 20000, 30000, 50000, 100000, 150000, 200000, 300000, 500000, 1000000, 1500000, 2000000, 3000000,
        5000000
    ]

    static equipments: { [key: string]: EquipmentData } = null
    static equipmentNameList: string[] = []
    static itemNameList: string[] = []
    static goodsNameList: string[] = []
    static trashNameList: string[] = []
    static dollNameList: string[] = []
    //怪物json
    static monsters: { [key: string]: NonPlayerData } = null
    //npc json
    static nonplayers: { [key: string]: NonPlayerData } = null
    //图片资源
    static spriteFrames: { [key: string]: cc.SpriteFrame } = null
    //状态json
    static status: { [key: string]: StatusData } = null
    //套装json
    static suits: { [key: string]: SuitData } = null
    //子弹json
    static bullets: { [key: string]: BulletData } = null
    //物品json
    static items: { [key: string]: ItemData } = null
    //技能json
    static talents: { [key: string]: TalentData } = null
    //家具json
    static furnitures: { [key: string]: FurnitureData } = null
    //平台json
    static normalBuildings: { [key: string]: BuildingData } = null
    //职业json
    static professionList: ProfessionData[] = []
    //建筑资源
    static buildings: { [key: string]: cc.Prefab } = null
    //音频资源
    static audioClips: { [key: string]: cc.AudioClip } = {}
    static bgmClips: { [key: string]: cc.AudioClip } = {}
    //对话资源
    static dialogues: { [key: string]: DialogueData } = null
    static level = 0
    static chapterIndex = 0
    static chapterMaxIndex = 0
    static playerData: PlayerData = new PlayerData()
    static inventoryManager: InventoryManager = new InventoryManager()
    static mapManager: MapManager = new MapManager()
    static worldLoader: WorldLoader = new WorldLoader()
    static realCoins = 0 //真实货币
    static coins = 0 //金币
    static oilGolds = 0 //油金
    static killCount = 0 //杀敌数
    static coinCounts = 0 //金币累加数
    static time = '00:00:00'
    static realTime = 1559145600000
    static seed = 5
    static isFirst = 1
    static isFirstLoading = true
    static jumpChapter = 0
    static jumpSlotIndex = 0
    static shipTransportScene = 0
    static elevatorScene = 0
    static isCheatMode = false //作弊
    static isDebug = false //调试
    static isTour = false //游览
    static isGamePause = false
    static dieFrom: FromData = new FromData()
    static isMapReset = false
    static lastBgmIndex = 1
    static savePoinitData: SavePointData = new SavePointData()
    static groundOilGoldData: GroundOilGoldData = new GroundOilGoldData()
    static killPlayerCounts: { [key: number]: number } = {} //玩家怪物击杀表
    static profileManager: ProfileManager = new ProfileManager()
    static bagSortIndex = 0 //0时间,1类别,2品质,3价格
    static sortIndexs: { [key: string]: number } = {} //0时间,1类别,2品质,3价格
    static settings: SettingsData = new SettingsData()
    static nonPlayerList: NonPlayerData[] = []

    onLoad() {
        Logic.settings.valueCopy(LocalStorage.getSystemSettings())
        //关闭调试
        if (Logic.settings.lowPower) {
            cc.game.setFrameRate(45)
        } else {
            cc.game.setFrameRate(60)
        }
        cc.game.addPersistRootNode(this.node)
        EventHelper.on(EventHelper.SETTINGS_LOW_POWER, () => {
            if (Logic.settings.lowPower) {
                cc.game.setFrameRate(45)
            } else {
                cc.game.setFrameRate(60)
            }
        })
        // cc.view.enableAntiAlias(false);
        // cc.macro.DOWNLOAD_MAX_CONCURRENT = 10;
        // cc.director.getCollisionManager().enabled = true;
        // cc.director.getPhysicsManager().enabled = true;;
        // cc.director.getPhysicsManager().enabledAccumulator = true;
        // 物理步长，默认 FIXED_TIME_STEP 是 1/60
        // cc.PhysicsManager.FIXED_TIME_STEP = 1 / 45;
        // 每次更新物理系统处理速度的迭代次数，默认为 10
        // cc.PhysicsManager.VELOCITY_ITERATIONS = 8;
        // 每次更新物理系统处理位置的迭代次数，默认为 10
        // cc.PhysicsManager.POSITION_ITERATIONS = 8;

        // manager.enabledDebugDraw = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit;
    }

    start() {}
    static saveData() {
        Logic.profileManager.data.playerData = Logic.playerData.clone()
        if (Logic.chapterIndex == this.CHAPTER099) {
            Logic.profileManager.data.playerEquipsReality = Logic.inventoryManager.equips
            Logic.profileManager.data.playerItemListReality = Logic.inventoryManager.itemList
            Logic.profileManager.data.playerInventoryListReality = Logic.inventoryManager.inventoryList
        } else {
            Logic.profileManager.data.playerEquips = Logic.inventoryManager.equips
            Logic.profileManager.data.playerItemList = Logic.inventoryManager.itemList
            Logic.profileManager.data.playerInventoryList = Logic.inventoryManager.inventoryList
        }
        Logic.profileManager.data.nonPlayerList = Logic.nonPlayerList
        Logic.profileManager.data.rectDungeons[Logic.mapManager.rectDungeon.id] = Logic.mapManager.rectDungeon
        Logic.profileManager.data.level = Logic.level
        Logic.profileManager.data.chapterIndex = Logic.chapterIndex
        Logic.profileManager.data.chapterMaxIndex = Logic.chapterMaxIndex
        Logic.profileManager.data.time = Logic.time
        Logic.profileManager.data.realTime = Logic.realTime
        Logic.profileManager.data.savePointData = Logic.savePoinitData.clone()
        Logic.profileManager.data.groundOilGoldData = Logic.groundOilGoldData.clone()
        Logic.profileManager.data.killPlayerCounts = Logic.killPlayerCounts
        Logic.profileManager.data.oilGolds = Logic.oilGolds
        Logic.profileManager.data.coins = Logic.coins
        Logic.profileManager.data.coinCounts = Logic.coinCounts
        Logic.profileManager.data.lastSaveTime = new Date().getTime()
        Logic.profileManager.saveData(Logic.jumpSlotIndex)
        LocalStorage.saveData(LocalStorage.KEY_REAL_COINS, Logic.realCoins)
        LocalStorage.setLastSaveSlotKey(Logic.jumpSlotIndex)
        Logic.inventoryManager.furnitureMap.forEach(value => {
            LocalStorage.saveFurnitureData(value)
        })
    }
    static resetData(chapter?: number) {
        Logic.profileManager = new ProfileManager()
        Logic.profileManager.loadData(Logic.jumpSlotIndex)
        //重置时间
        Logic.time = Logic.profileManager.data.time
        Logic.realTime = Logic.profileManager.data.realTime
        //加载章节名
        Logic.profileManager.data.chapterIndex = chapter ? chapter : Logic.profileManager.data.chapterIndex
        if (Logic.profileManager.data.chapterIndex > Logic.profileManager.data.chapterMaxIndex && Logic.profileManager.data.chapterIndex < this.CHAPTER05) {
            Logic.profileManager.data.chapterMaxIndex = Logic.profileManager.data.chapterIndex
        }
        //加载关卡等级
        Logic.chapterIndex = Logic.profileManager.data.chapterIndex
        Logic.chapterMaxIndex = Logic.profileManager.data.chapterMaxIndex
        Logic.level = Logic.profileManager.data.level
        //加载最近使用的存档点
        Logic.savePoinitData = Logic.profileManager.data.savePointData.clone()
        //加载翠金点
        Logic.groundOilGoldData = Logic.profileManager.data.groundOilGoldData.clone()
        Logic.oilGolds = Logic.profileManager.data.oilGolds
        //加载玩家数据
        Logic.playerData = Logic.profileManager.data.playerData.clone()
        //加载保存的npc
        Logic.nonPlayerList = []
        for (let i = 0; i < Logic.profileManager.data.nonPlayerList.length; i++) {
            let data = new NonPlayerData()
            data.valueCopy(Logic.profileManager.data.nonPlayerList[i])
            Logic.nonPlayerList.push(data)
        }
        //加载背包和装备
        Logic.resetInventoryAndOtherData()
        //设置地图重置状态在loading完成处理地图
        Logic.isMapReset = true
        //重置地牢宽高
        Dungeon.WIDTH_SIZE = 15
        Dungeon.HEIGHT_SIZE = 9
        //加载金币
        Logic.coins = Logic.profileManager.data.coins
        Logic.coinCounts = Logic.profileManager.data.coinCounts
        let c = LocalStorage.getValueFromData(LocalStorage.KEY_REAL_COINS)
        Logic.realCoins = c ? parseInt(c) : 0
        //重置bgm
        Logic.lastBgmIndex = 0
        //加载怪物击杀玩家数据
        Logic.killPlayerCounts = Logic.profileManager.data.killPlayerCounts
        Logic.playerData.OilGoldData.valueCopy(Logic.getOilGoldData(Logic.oilGolds))
    }
    static resetInventoryAndOtherData() {
        Logic.inventoryManager = new InventoryManager()
        if (Logic.chapterIndex == this.CHAPTER099) {
            for (let key in Logic.profileManager.data.playerEquipsReality) {
                Logic.inventoryManager.equips[key].valueCopy(Logic.profileManager.data.playerEquipsReality[key])
            }
            for (let i = 0; i < Logic.profileManager.data.playerItemListReality.length; i++) {
                Logic.inventoryManager.itemList[i].valueCopy(Logic.profileManager.data.playerItemListReality[i])
            }
            for (let i = 0; i < Logic.profileManager.data.playerInventoryListReality.length; i++) {
                let data = new InventoryData()
                data.valueCopy(Logic.profileManager.data.playerInventoryListReality[i])
                Logic.inventoryManager.inventoryList.push(data)
            }
        } else {
            for (let key in Logic.profileManager.data.playerEquips) {
                Logic.inventoryManager.equips[key].valueCopy(Logic.profileManager.data.playerEquips[key])
            }
            for (let i = 0; i < Logic.profileManager.data.playerItemList.length; i++) {
                Logic.inventoryManager.itemList[i].valueCopy(Logic.profileManager.data.playerItemList[i])
            }
            for (let i = 0; i < Logic.profileManager.data.playerInventoryList.length; i++) {
                let data = new InventoryData()
                data.valueCopy(Logic.profileManager.data.playerInventoryList[i])
                Logic.inventoryManager.inventoryList.push(data)
            }
        }
    }
    static getOilGoldData(oilGolds: number) {
        let value = oilGolds
        let data = new OilGoldData()
        for (let i = 0; i < Logic.OIL_GOLD_LIST.length; i++) {
            let offset = value - Logic.OIL_GOLD_LIST[i]
            if (offset >= 0) {
                value = offset
                data.level++
            } else {
                data.index = i
                break
            }
        }
        data.fragments = value
        data.Common.damageMin = data.level
        data.Common.maxHealth = data.level
        data.Common.maxDream = data.level
        data.Common.remoteDamage = data.level * 0.1
        return data
    }

    static changeDungeonSize() {
        let size = Logic.mapManager.getCurrentMapSize()
        if (size) {
            Dungeon.WIDTH_SIZE = size.x
            Dungeon.HEIGHT_SIZE = size.y
        }
    }
    static posToMapPos(pos: cc.Vec3): cc.Vec3 {
        //转换当前坐标为地图坐标
        let levelData = Logic.worldLoader.getCurrentLevelData()
        let roomPos = Logic.mapManager.rectDungeon.currentPos
        let mapPos = cc.v3(0, 0)
        mapPos.x = levelData.roomWidth * roomPos.x + pos.x
        mapPos.y = levelData.height * levelData.roomHeight - 1 - levelData.roomWidth * roomPos.y - pos.y
        return mapPos
    }
    static savePonit(pos: cc.Vec3) {
        //99chapter存档点无效
        if (Logic.chapterIndex == Logic.CHAPTER099) {
            return
        }
        let savePointData = new SavePointData()
        let mapPos = Logic.posToMapPos(pos)
        savePointData.x = mapPos.x
        savePointData.y = mapPos.y
        savePointData.level = Logic.level
        savePointData.chapter = Logic.chapterIndex
        Logic.savePoinitData.valueCopy(savePointData)
        //保存数据
        Logic.saveData()
    }
    static saveGroundOilGold(value: number) {
        let groundOilGoldData = new GroundOilGoldData()
        if (value > 0) {
            let roomPos = Logic.mapManager.rectDungeon.currentPos
            groundOilGoldData.x = roomPos.x
            groundOilGoldData.y = roomPos.y
            groundOilGoldData.level = Logic.level
            groundOilGoldData.chapter = Logic.chapterIndex
            groundOilGoldData.value = value
        }
        Logic.groundOilGoldData.valueCopy(groundOilGoldData)
        //保存数据
        Logic.saveData()
    }
    static loadingNextRoom(dir: number) {
        Logic.mapManager.rand4save = null
        //保存数据
        Logic.saveData()
        AudioPlayer.play(AudioPlayer.EXIT)
        let room = Logic.mapManager.loadingNextRoom(dir)
        if (room) {
            Logic.changeDungeonSize()
            switch (dir) {
                case 0:
                    Logic.playerData.pos = cc.v3(Logic.playerData.pos.x, 1)
                    break
                case 1:
                    Logic.playerData.pos = cc.v3(Logic.playerData.pos.x, Dungeon.HEIGHT_SIZE - 2)
                    break
                case 2:
                    Logic.playerData.pos = cc.v3(Dungeon.WIDTH_SIZE - 2, Logic.playerData.pos.y)
                    break
                case 3:
                    Logic.playerData.pos = cc.v3(1, Logic.playerData.pos.y)
                    break
            }
            cc.director.loadScene('loading')
        }
    }
    static loadingNextLevel(exitData: ExitData) {
        if (!exitData) {
            return
        }
        //如果地图不存在停止加载
        let levelData = Logic.worldLoader.getLevelData(exitData.toChapter, exitData.toLevel)
        if (!levelData) {
            return
        }
        //如果是从梦境进入现实或者跨章节需要调整当前章节已经清理的房间为重生状态并保存
        if (exitData.fromChapter != Logic.CHAPTER099 && exitData.fromChapter != exitData.toChapter) {
            Logic.mapManager.rectDungeon.changeAllClearRoomsReborn()
            for (let rd in Logic.profileManager.data.rectDungeons) {
                if (Logic.profileManager.data.rectDungeons[rd]) {
                    Logic.profileManager.data.rectDungeons[rd].changeAllClearRoomsReborn()
                }
            }
        }
        Logic.saveData()
        /**************加载exitData关卡数据***************** */
        Logic.chapterIndex = exitData.toChapter
        Logic.level = exitData.toLevel
        if (Logic.chapterMaxIndex < Logic.chapterIndex && Logic.chapterIndex < Logic.CHAPTER05) {
            Logic.chapterMaxIndex = Logic.chapterIndex
        }
        //地图数据的y轴向下的
        let ty = levelData.height * levelData.roomHeight - 1 - exitData.toPos.y
        let roomX = Math.floor(exitData.toPos.x / levelData.roomWidth)
        let roomY = Math.floor(ty / levelData.roomHeight)
        Logic.playerData.pos = cc.v3(exitData.toPos.x % levelData.roomWidth, ty % levelData.roomHeight)
        Logic.playerData.posZ = exitData.toPosZ
        Logic.mapManager.reset(cc.v3(roomX, roomY))
        Logic.changeDungeonSize()
        if (exitData.fromChapter == Logic.CHAPTER00 && Logic.chapterIndex == Logic.CHAPTER01) {
            Logic.shipTransportScene = 1
        } else if (exitData.fromChapter == Logic.CHAPTER02 && Logic.chapterIndex == Logic.CHAPTER01) {
            Logic.shipTransportScene = 2
        } else if (exitData.fromChapter == Logic.CHAPTER01 && Logic.chapterIndex == Logic.CHAPTER00) {
            Logic.shipTransportScene = 2
        } else if (exitData.fromChapter == Logic.CHAPTER01 && Logic.chapterIndex == Logic.CHAPTER02) {
            Logic.shipTransportScene = 1
        }
        if (exitData.fromChapter == Logic.CHAPTER00 && Logic.chapterIndex == Logic.CHAPTER00) {
            if (!(exitData.fromLevel == 0 && exitData.toLevel == 0)) {
                Logic.elevatorScene = exitData.fromLevel > Logic.level ? 1 : 2
            }
        }
        Logic.playerData.isWakeUp = exitData.fromChapter != Logic.CHAPTER099 && exitData.toChapter == Logic.CHAPTER099
        //重置装备和跟随的npc
        Logic.resetInventoryAndOtherData()
        cc.director.loadScene('loading')
    }

    static getRandomNum(min, max): number {
        //生成一个随机数从[min,max]
        return min + Math.round(Random.rand() * (max - min))
    }
    static getHalfChance(): boolean {
        return Random.rand() > 0.5
    }
    static getChance(rate: number): boolean {
        return Logic.getRandomNum(0, 100) < rate
    }
    static getDistance(v1, v2) {
        let x = v1.x - v2.x
        let y = v1.y - v2.y
        return Math.sqrt(x * x + y * y)
    }
    static getDistanceNoSqrt(v1, v2) {
        let x = v1.x - v2.x
        let y = v1.y - v2.y
        return Math.abs(x) + Math.abs(y)
    }

    static lerp(a: number, b: number, r: number): number {
        return a + (b - a) * r
    }
    static lerpPos(self: cc.Vec3, to: cc.Vec3, ratio: number): cc.Vec3 {
        let out = cc.v3(0, 0)
        let x = self.x
        let y = self.y
        out.x = x + (to.x - x) * ratio
        out.y = y + (to.y - y) * ratio
        return out
    }
    static genNonDuplicateID(): string {
        return Number(Random.rand().toString().substr(3, 16) + Date.now()).toString(36)
    }
    /**随机装备名字 */
    static getRandomEquipType(rand4save: Random4Save): string {
        return Logic.equipmentNameList[rand4save.getRandomNum(1, Logic.equipmentNameList.length - 1)]
    }
    /**随机可拾取物品 */
    static getRandomItemType(rand4save: Random4Save): string {
        return Logic.itemNameList[rand4save.getRandomNum(1, Logic.itemNameList.length - 1)]
    }
    /**随机可拾取垃圾 */
    static getRandomTrashType(rand4save: Random4Save): string {
        return Logic.trashNameList[rand4save.getRandomNum(1, Logic.trashNameList.length - 1)]
    }
    static spriteFrameRes(spriteFrameName: string) {
        return Logic.spriteFrames[spriteFrameName] ? Logic.spriteFrames[spriteFrameName] : null
    }
    static getBuildings(name: string, callback: Function): void {
        LoadingManager.loadBuilding(name, () => {
            if (callback) {
                callback(Logic.buildings[name])
            }
        })
    }
    static getKillPlayerCount(seed: number) {
        if (Logic.killPlayerCounts[seed]) {
            return Logic.killPlayerCounts[seed]
        } else {
            return 0
        }
    }
    static setKillPlayerCounts(dieFrom: FromData, isAdd: boolean) {
        if (dieFrom && dieFrom.id) {
            Logic.killPlayerCounts[dieFrom.id] = Logic.getKillPlayerCount(dieFrom.id) + (isAdd ? 1 : -1)
            let counts = Logic.killPlayerCounts
            Logic.killPlayerCounts = {}
            for (let key in counts) {
                if (counts[key] && counts[key] > 0) {
                    Logic.killPlayerCounts[key] = counts[key]
                }
            }
        }
    }
}
