import PlayerData from "./PlayerData";
import RectDungeon from "../Rect/RectDungeon";
import EquipmentData from "./EquipmentData";
import ItemData from "./ItemData";
import TalentData from "./TalentData";

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
    rectDungeons: { [key: string]: RectDungeon }  = {};
    chapterIndex:number = 0;//当前章节
    playerData:PlayerData = new PlayerData();
    //玩家装备列表
    playerEquipList:EquipmentData[] = new Array();
    //玩家物品列表
    playerItemList:ItemData[] = new Array();
    talentList:TalentData[] = new Array();
    level = 0;//当前层级
    realLevel = 0;//真实世界层级
    lastLevel = 0;//上次层级
    lastChapterIndex = 0;//上次章节
}