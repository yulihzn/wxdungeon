import PlayerData from './PlayerData'
import RectDungeon from '../rect/RectDungeon'
import EquipmentData from './EquipmentData'
import ItemData from './ItemData'
import SavePointData from './SavePointData'
import InventoryData from './InventoryData'
import GroundOilGoldData from './GroundOilGoldData'
import NonPlayerData from './NonPlayerData'
import MetalTalentData from './MetalTalentData'

/**存档保存数据
 * 玩家的属性 目前血量 攻防抗性等 位置
 * 玩家的装备信息
 * 玩家的物品信息
 * 玩家的状态信息 保留永久状态 长时间状态
 * 当前的关卡 章节 当前关卡的地图数据
 * 目前房间的位置 地上道具建筑的位置和属性
 * 商店的购买状态
 * 每次进入一个房间的时候进行一次存档，保存当前房间内容
 */
export default class ProfileData {
    //地图数据管理类
    rectDungeons: { [key: string]: RectDungeon } = {}
    chapterIndex: number = 0 //当前章节
    chapterMaxIndex: number = 0 //到达过的最大章节
    playerData: PlayerData = new PlayerData()
    playerDatas: { [key: string]: PlayerData } = {}
    //玩家装备列表
    playerEquips: { [key: string]: EquipmentData } = {}
    playerEquipsReality: { [key: string]: EquipmentData } = {}
    //玩家翠金天赋点
    playerMetals: { [key: string]: MetalTalentData } = {}
    //玩家物品列表
    playerItemList: ItemData[] = new Array()
    playerItemListReality: ItemData[] = new Array()
    //玩家背包列表
    playerInventoryList: InventoryData[] = new Array()
    playerInventoryListReality: InventoryData[] = new Array()
    //跟随的npc列表
    nonPlayerList: NonPlayerData[] = new Array()
    //其它npc列表
    aiPlayerList: PlayerData[] = new Array()
    level = 0 //当前层级
    //游玩时间
    totalTime = 0
    //游戏里的时间，默认从2018-05-14 12:55:46开始,现实时间和梦境时间隔开
    realTime = 1526273746000
    dreamTime = 1526273746000
    savePointData: SavePointData = new SavePointData()
    groundOilGoldData: GroundOilGoldData = new GroundOilGoldData()
    oilGolds = 0
    killPlayerCounts: { [key: number]: number } = {} //玩家怪物击杀表
    dialogueCounts: { [key: string]: number } = {} //对话出现次数
    coins = 0 //梦境里的金币
    coinCounts = 0
    lastSaveTime = 0 //最近游玩时间
    dreamCostTime = 0 //做梦需要消耗的时间
    cycle = 0 //周目
    metalId = ''

    lastPlayerId = '' //最后被控制的Player
}
