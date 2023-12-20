import PlayerData from './PlayerData'
import RectDungeon from '../rect/RectDungeon'
import EquipmentData from './EquipmentData'
import ItemData from './ItemData'
import SavePointData from './SavePointData'
import InventoryData from './InventoryData'
import GroundOilGoldData from './GroundOilGoldData'
import NonPlayerData from './NonPlayerData'
import MetalTalentData from './MetalTalentData'
import DataUtils from '../utils/DataUtils'

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
    chapterIndex: number = 0 //当前章节 forsave
    chapterMaxIndex: number = 0 //到达过的最大章节 forsave
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
    //跟随的非人形npc列表
    nonPlayerList: NonPlayerData[] = new Array()
    level = 0 //当前层级 forsave
    //游玩时间
    totalTime = 0 //forsave
    //游戏里的时间，默认从2018-05-14 12:55:46开始,现实时间和梦境时间隔开 也可以考虑从1559145600000开始
    realTime = 1526273746000 //forsave
    dreamTime = 1526273746000 //forsave
    dreamCostTime = 0 //做梦需要消耗的时间 forsave
    cycle = 0 //周目 forsave
    lastPlayerId = '' //最后被控制的Player forsave
    savePointData: SavePointData = new SavePointData()
    groundOilGoldData: GroundOilGoldData = new GroundOilGoldData()
    oilGolds = 0 //经验球 forsave
    killPlayerCounts: { [key: number]: number } = {} //玩家怪物击杀表
    dialogueCounts: { [key: string]: number } = {} //对话出现次数
    coins = 0 //梦境里的金币 forsave
    realCoins = 0 //现实货币，真是货币无法从梦境里获得，但是会出现对应的npc会进行这样的交易 forsave
    coinCounts = 0 //金币累加数 forsave
    lastSaveTime = 0 //最近游玩时间
    metalId = ''

    public valueCopy(data: ProfileData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data, true)
    }
    public clone(): ProfileData {
        let e = new ProfileData()
        e.valueCopy(this)
        return e
    }
}
