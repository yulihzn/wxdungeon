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
import LoadingManager from '../manager/LoadingManager'
import DialogueData from '../data/DialogueData'
import BuildingData from '../data/BuildingData'
import SettingsData from '../data/SettingsData'
import AffixMapData from '../data/AffixMapData'
import MetalTalentData from '../data/MetalTalentData'
import DataUtils from '../utils/DataUtils'
import ProfileData from '../data/ProfileData'
import ProfileGlobalData from '../data/ProfileGlobalData'

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
        20, 50, 75, 100, 150, 200, 300, 450, 650, 1000, 1500, 2000, 3000, 5000, 10000, 15000, 20000, 30000, 50000, 100000, 150000, 200000, 300000, 500000, 1000000, 1500000,
        2000000, 3000000, 5000000, 7000000, 10000000
    ]

    /********************************静态资源 *********************************/
    static equipments: { [key: string]: EquipmentData } = null
    static equipmentNameList: string[] = []
    static itemNameList: string[] = []
    static goodsNameList: string[] = []
    static trashNameList: string[] = []
    static dollNameList: string[] = []
    //怪物json
    static monsters: { [key: string]: NonPlayerData } = null
    //非人形npc json
    static nonplayers: { [key: string]: NonPlayerData } = null
    //人形npc json
    static players: { [key: string]: PlayerData } = null
    //boss json
    static bosses: { [key: string]: NonPlayerData } = null
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
    //翠金技能json
    static metals: { [key: string]: MetalTalentData } = null
    //家具json
    static furnitures: { [key: string]: BuildingData } = null
    //平台json
    static normalBuildings: { [key: string]: BuildingData } = null
    //职业json
    static professionList: ProfessionData[] = []
    //词缀json
    static affixs: AffixMapData[] = []
    //建筑资源
    static buildings: { [key: string]: cc.Prefab } = null
    //音频资源
    static audioClips: { [key: string]: cc.AudioClip } = {}
    static bgmClips: { [key: string]: cc.AudioClip } = {}
    //对话资源
    static dialogues: { [key: string]: DialogueData } = null
    static behaviors: { [key: string]: string } = null
    /******************************************************************************/
    static playerDatas: { [key: string]: PlayerData } = {}
    static inventoryMgrs: { [key: string]: InventoryManager } = {}
    static mapManager: MapManager = new MapManager()
    static worldLoader: WorldLoader = new WorldLoader()
    static realCoins = 0 //真实货币，真是货币无法从梦境里获得，但是会出现对应的npc会进行这样的交易
    static killCount = 0 //杀敌数
    static dialogueCounts: { [key: string]: number } = {} //对话出现次数
    static seed = 5
    static isFirst = 1
    static isFirstLoading = true
    static jumpChapter = 0 //用来跳转指定章节
    static currentSlotIndex = 0 //当前人物存档下标
    static shipTransportScene = 0
    static elevatorScene = 0
    static isCheatMode = false //作弊
    static isDebug = false //调试
    static isTour = false //游览
    static isGamePause = false
    static dieFrom: FromData = new FromData()
    static lastBgmIndex = 1
    static savePoinitData: SavePointData = new SavePointData()
    static groundOilGoldData: GroundOilGoldData = new GroundOilGoldData()
    static killPlayerCounts: { [key: number]: number } = {} //玩家怪物击杀表
    static profileManager: ProfileManager = new ProfileManager()
    static bagSortIndex = 0 //0时间,1类别,2品质,3价格
    static sortIndexs: { [key: string]: number } = {} //0时间,1类别,2品质,3价格
    static settings: SettingsData = new SettingsData()
    static nonPlayerList: NonPlayerData[] = []
    static playerMetals: { [key: string]: MetalTalentData } = {} //玩家翠金天赋点
    static metalId = ''
    static furnitureMap: Map<string, BuildingData> = new Map()
    static currentEditPlayerData = new PlayerData()
    static data: ProfileData = new ProfileData()
    static globalData: ProfileGlobalData = new ProfileGlobalData()
    static ROOM_WIDTH = 0
    static ROOM_HEIGHT = 0

    onLoad() {
        Logic.settings.valueCopy(LocalStorage.getSystemSettings())
        //关闭调试
        if (Logic.settings.lowPower) {
            cc.game.setFrameRate(45)
        } else {
            cc.game.setFrameRate(59)
        }
        cc.game.addPersistRootNode(this.node)
        EventHelper.on(EventHelper.SETTINGS_LOW_POWER, () => {
            if (Logic.settings.lowPower) {
                cc.game.setFrameRate(45)
            } else {
                cc.game.setFrameRate(59)
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
        Logic.profileManager.data.valueCopy(Logic.data)
        Logic.profileManager.data.playerDatas = DataUtils.cloneKeyValue(Logic.playerDatas, value => new PlayerData().valueCopy(value))
        Logic.profileManager.data.nonPlayerList = Logic.nonPlayerList
        Logic.profileManager.data.rectDungeons[Logic.mapManager.rectDungeon.id] = Logic.mapManager.rectDungeon
        Logic.profileManager.data.savePointData = Logic.savePoinitData.clone()
        Logic.profileManager.data.groundOilGoldData = Logic.groundOilGoldData.clone()
        Logic.profileManager.data.killPlayerCounts = DataUtils.cloneNumberKeyValue(Logic.killPlayerCounts, value => value)
        Logic.profileManager.data.dialogueCounts = DataUtils.cloneKeyValue(Logic.dialogueCounts, value => value)
        Logic.profileManager.data.playerMetals = DataUtils.cloneKeyValue(Logic.playerMetals, value => value)
        Logic.profileManager.data.lastSaveTime = new Date().getTime()
        Logic.profileManager.saveData(Logic.currentSlotIndex)
        LocalStorage.saveGlobalData(Logic.globalData)
        LocalStorage.setLastSaveSlotKey(Logic.currentSlotIndex)
        Logic.furnitureMap.forEach(value => {
            LocalStorage.saveFurnitureData(value)
        })
    }
    /**清除当前数据，从存档重置数据 */
    static resetData(chapter?: number) {
        Logic.profileManager = new ProfileManager()
        Logic.profileManager.loadData(Logic.currentSlotIndex)
        //设置最大章节
        Logic.profileManager.data.chapterIndex = chapter ? chapter : Logic.profileManager.data.chapterIndex
        if (Logic.profileManager.data.chapterIndex > Logic.profileManager.data.chapterMaxIndex && Logic.profileManager.data.chapterIndex < this.CHAPTER05) {
            Logic.profileManager.data.chapterMaxIndex = Logic.profileManager.data.chapterIndex
        }
        Logic.data.valueCopy(Logic.profileManager.data)
        //加载最近使用的存档点
        Logic.savePoinitData = Logic.profileManager.data.savePointData.clone()
        //加载地面翠金点
        Logic.groundOilGoldData = Logic.profileManager.data.groundOilGoldData.clone()
        //加载玩家数据
        Logic.playerDatas = DataUtils.cloneKeyValue(Logic.profileManager.data.playerDatas, value => new PlayerData().valueCopy(value))
        if (!Logic.playerData) {
            Logic.playerData = new PlayerData()
        }
        //加载保存的npc
        Logic.nonPlayerList = DataUtils.copyListValue(Logic.profileManager.data.nonPlayerList, value => new NonPlayerData().valueCopy(value))
        //重置全局数据
        Logic.globalData.valueCopy(LocalStorage.getGlobalData())
        //重置bgm
        Logic.lastBgmIndex = 0
        //加载怪物击杀玩家数据
        Logic.killPlayerCounts = DataUtils.cloneNumberKeyValue(Logic.profileManager.data.killPlayerCounts, value => value)
        //加载对话出现次数
        Logic.dialogueCounts = DataUtils.cloneKeyValue(Logic.profileManager.data.dialogueCounts, value => value)
        Logic.playerMetals = DataUtils.cloneKeyValue(Logic.profileManager.data.playerMetals, value => value)
        Logic.playerData.OilGoldData.valueCopy(Logic.getOilGoldData(Logic.data.oilGolds))
        //清空家具信息,家具信息在添加家具的时候会添加
        Logic.furnitureMap = new Map()
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
        data.Common.damageMin = data.level / 2
        data.Common.maxHealth = data.level / 2
        data.Common.maxDream = data.level / 2
        data.Common.remoteDamage = data.level * 0.1
        return data
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
        if (Logic.data.chapterIndex == Logic.CHAPTER099) {
            return
        }
        let savePointData = new SavePointData()
        let mapPos = Logic.posToMapPos(pos)
        savePointData.x = mapPos.x
        savePointData.y = mapPos.y
        savePointData.level = Logic.data.level
        savePointData.chapter = Logic.data.chapterIndex
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
            groundOilGoldData.level = Logic.data.level
            groundOilGoldData.chapter = Logic.data.chapterIndex
            groundOilGoldData.value = value
        }
        //先重置数据，再保存翠金数据
        Logic.groundOilGoldData.valueCopy(groundOilGoldData)
        Logic.saveData()
    }
    static loadingNextRoom(dir: number) {
        Logic.isGamePause = true
        cc.log('loadingNextRoom')
        Logic.mapManager.randMap.clear()
        //保存数据
        Logic.saveData()
        AudioPlayer.play(AudioPlayer.EXIT)
        let room = Logic.mapManager.loadingNextRoom(dir)
        if (room) {
            let data = Logic.worldLoader.getCurrentLevelData()
            Logic.ROOM_WIDTH = data.roomWidth
            Logic.ROOM_HEIGHT = data.roomHeight
            switch (dir) {
                case 0:
                    Logic.playerData.pos = cc.v3(Logic.playerData.pos.x, 1)
                    break
                case 1:
                    Logic.playerData.pos = cc.v3(Logic.playerData.pos.x, Logic.ROOM_HEIGHT - 2)
                    break
                case 2:
                    Logic.playerData.pos = cc.v3(Logic.ROOM_WIDTH - 2, Logic.playerData.pos.y)
                    break
                case 3:
                    Logic.playerData.pos = cc.v3(1, Logic.playerData.pos.y)
                    break
            }
            cc.log(`player pos = ${Logic.playerData.pos.x},${Logic.playerData.pos.y}`)
            cc.director.loadScene('loading')
        }
    }
    static loadingNextLevel(exitData: ExitData, clearMapCache?: boolean) {
        cc.log('loadingNextLevel')
        Logic.worldLoader.loadWorld(() => {
            if (!exitData) {
                return
            }
            //如果地图不存在停止加载
            let levelData = Logic.worldLoader.getLevelData(exitData.toChapter, exitData.toLevel)
            if (!levelData) {
                return
            }
            Logic.isGamePause = true
            if (clearMapCache) {
                Logic.mapManager.clear()
            }
            if (!Logic.mapManager.rectDungeon) {
                Logic.mapManager.reset()
            }
            //如果是从梦境进入现实或者跨章节需要调整当前章节已经清理的房间为重生状态并保存
            if (exitData.fromChapter != Logic.CHAPTER099 && exitData.fromChapter != exitData.toChapter) {
                Logic.mapManager.rectDungeon.changeAllClearRoomsReborn()
                for (let rd in Logic.profileManager.data.rectDungeons) {
                    if (Logic.profileManager.data.rectDungeons[rd]) {
                        Logic.profileManager.data.rectDungeons[rd].changeAllClearRoomsReborn()
                    }
                }
                //如果是从梦境进入现实，需要扣除对应的休息时间，默认八小时
                if (exitData.toChapter == Logic.CHAPTER099) {
                    Logic.data.realTime += Logic.data.dreamCostTime
                    Logic.data.dreamCostTime = 0
                }
            }
            Logic.saveData()
            /**************加载exitData关卡数据***************** */
            Logic.data.chapterIndex = exitData.toChapter
            Logic.data.level = exitData.toLevel
            if (Logic.data.chapterMaxIndex < Logic.data.chapterIndex && Logic.data.chapterIndex < Logic.CHAPTER05) {
                Logic.data.chapterMaxIndex = Logic.data.chapterIndex
            }
            //地图数据的y轴向下的
            let ty = levelData.height * levelData.roomHeight - 1 - exitData.toPos.y
            let roomX = Math.floor(exitData.toPos.x / levelData.roomWidth)
            let roomY = Math.floor(ty / levelData.roomHeight)
            Logic.playerData.pos = cc.v3(exitData.toPos.x % levelData.roomWidth, ty % levelData.roomHeight)
            Logic.playerData.posZ = exitData.toPosZ
            Logic.playerData.roomPos = cc.v3(roomX, roomY)
            Logic.playerData.chapterIndex = Logic.data.chapterIndex
            Logic.playerData.chapterLevel = Logic.data.level
            Logic.mapManager.reset()
            Logic.mapManager.changePos(cc.v3(roomX, roomY))
            Logic.ROOM_HEIGHT = levelData.roomHeight
            Logic.ROOM_WIDTH = levelData.roomWidth
            if (exitData.fromChapter == Logic.CHAPTER00 && Logic.data.chapterIndex == Logic.CHAPTER01) {
                Logic.shipTransportScene = 1
            } else if (exitData.fromChapter == Logic.CHAPTER02 && Logic.data.chapterIndex == Logic.CHAPTER01) {
                Logic.shipTransportScene = 2
            } else if (exitData.fromChapter == Logic.CHAPTER01 && Logic.data.chapterIndex == Logic.CHAPTER00) {
                Logic.shipTransportScene = 2
            } else if (exitData.fromChapter == Logic.CHAPTER01 && Logic.data.chapterIndex == Logic.CHAPTER02) {
                Logic.shipTransportScene = 1
            }
            if (exitData.fromChapter == Logic.CHAPTER00 && Logic.data.chapterIndex == Logic.CHAPTER00) {
                if (!(exitData.fromLevel == 0 && exitData.toLevel == 0)) {
                    Logic.elevatorScene = exitData.fromLevel > Logic.data.level ? 1 : 2
                }
            }
            Logic.playerData.isWakeUp = exitData.fromChapter != Logic.CHAPTER099 && exitData.toChapter == Logic.CHAPTER099
            cc.director.loadScene('loading')
        })
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
    static lerpPos2(self: cc.Vec2, to: cc.Vec2, ratio: number): cc.Vec2 {
        let out = cc.v2(0, 0)
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
    static equipmentSpriteFrameRes(equip: EquipmentData) {
        if (!equip || !equip.img) {
            return null
        }
        let spriteFrame = Logic.spriteFrameRes(equip.img)
        if (equip.equipmentType == InventoryManager.CLOTHES) {
            spriteFrame = Logic.spriteFrameRes(equip.img + 'anim0')
        } else if (equip.equipmentType == InventoryManager.HELMET) {
            spriteFrame = Logic.spriteFrameRes(equip.img + 'anim0')
        } else if (equip.equipmentType == InventoryManager.REMOTE) {
            spriteFrame = Logic.spriteFrameRes(equip.img + 'anim0')
        }
        return spriteFrame
    }
    static getBuildings(name: string): Promise<cc.Prefab> {
        return new Promise(resolve => {
            LoadingManager.loadBuilding(name, () => {
                resolve(Logic.buildings[name])
            })
        })
    }
    static loadNpcSpriteAtlasSync(name: string): Promise<number> {
        return new Promise(resolve => {
            LoadingManager.loadNpcSpriteAtlas(name, status => {
                resolve(status)
            })
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
        if (dieFrom && dieFrom.seed) {
            Logic.killPlayerCounts[dieFrom.seed] = Logic.getKillPlayerCount(dieFrom.seed) + (isAdd ? 1 : -1)
            let counts = Logic.killPlayerCounts
            Logic.killPlayerCounts = {}
            for (let key in counts) {
                if (counts[key] && counts[key] > 0) {
                    Logic.killPlayerCounts[key] = counts[key]
                }
            }
        }
    }
    static getDialogueCount(id: string) {
        if (Logic.dialogueCounts[id]) {
            return Logic.dialogueCounts[id]
        } else {
            return 0
        }
    }
    static addDialogueCount(id: string) {
        Logic.dialogueCounts[id] = Logic.dialogueCounts[id] + 1
    }
    static isDreaming() {
        return Logic.data.chapterIndex != Logic.CHAPTER099
    }
    static getTickTime() {
        return Logic.isDreaming() ? Logic.data.dreamTime : Logic.data.realTime
    }
    static getCurrentMetal() {
        return new MetalTalentData().valueCopy(Logic.metals[Logic.data.metalId]).valueCopy(Logic.playerMetals[Logic.data.metalId])
    }
    static get inventoryMgr() {
        return Logic.getInventoryMgr(Logic.data.lastPlayerId)
    }
    static getInventoryMgr(id: string) {
        if (!Logic.inventoryMgrs[id]) {
            Logic.inventoryMgrs[id] = new InventoryManager(id)
        }
        return Logic.inventoryMgrs[id]
    }
    static get playerData() {
        return Logic.playerDatas[Logic.data.lastPlayerId]
    }
    static set playerData(value: PlayerData) {
        Logic.data.lastPlayerId = value.id
        Logic.playerDatas[value.id] = value
    }
    static getPlayerDataById(id: string) {
        let data = Logic.playerDatas[id]
        if (!data) {
            data = new PlayerData()
            if (Logic.players[id]) {
                data.valueCopy(Logic.players[id])
            } else {
                data.id = id
            }
            Logic.playerDatas[id] = data
        }

        return data
    }
}
