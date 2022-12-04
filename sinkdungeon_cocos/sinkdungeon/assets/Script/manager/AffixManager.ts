import AffixData from '../data/AffixData'
import AffixMapData from '../data/AffixMapData'
import EquipmentData from '../data/EquipmentData'
import Logic from '../logic/Logic'
import Random4Save from '../utils/Random4Save'
import InventoryManager from './InventoryManager'

/**
 * 词缀管理器
 */
export default class AffixManger {
    static buildEquipmentAffixs(equip: EquipmentData, rand4save: Random4Save) {
        const EQUIP_GROUP: Map<string, number[]> = new Map() // //装备对应属性
        EQUIP_GROUP.clear()
        EQUIP_GROUP.set(InventoryManager.WEAPON, [1, 4, 5, 6, 9, 13, 14, 16, 17, 20])
        EQUIP_GROUP.set(InventoryManager.REMOTE, [1, 2, 3, 12, 22, 23, 24])
        EQUIP_GROUP.set(InventoryManager.SHIELD, [0, 1, 7, 15, 18, 19, 21])
        EQUIP_GROUP.set(InventoryManager.HELMET, [0, 1, 7, 14, 17, 20, 22])
        EQUIP_GROUP.set(InventoryManager.CLOTHES, [0, 1, 7, 21, 15])
        EQUIP_GROUP.set(InventoryManager.TROUSERS, [0, 1, 7, 8, 21])
        EQUIP_GROUP.set(InventoryManager.SHOES, [0, 1, 7, 8, 21])
        EQUIP_GROUP.set(InventoryManager.GLOVES, [0, 1, 2, 3, 7, 9, 13, 14, 15, 16, 17, 22, 23, 24])
        EQUIP_GROUP.set(InventoryManager.CLOAK, [0, 1, 7, 8, 21])
        const ELEMENT = [25, 26, 27, 28, 29, 30, 31] //元素几率
        const TOTAL = [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 44, 45, 46] //总额提升
        const GROUP = EQUIP_GROUP.get(equip.equipmetType)
        AffixManger.getRandomAffix(GROUP, ELEMENT, TOTAL, equip.level)
    }

    /**
     * 生成随机词缀
     * 总额提升概率10%元素几率20%普通几率70%
     * @param groups 指定装备类型的词缀下标列表,多个词缀生成的时候要剔除重复部分
     * @param elements
     * @param totals
     * @param level 装备等级
     */
    static getRandomAffix(groups: number[], elements: number[], totals: number[], level: number) {
        let rand4save = Logic.mapManager.getCurrentRoomRandom4Save()
        let rand = rand4save.rand()
        let arr = groups
        if (rand > 0.9) {
            arr = totals
        } else if (rand > 0.7) {
            arr = elements
        }
        let index = arr[rand4save.getRandomNum(0, arr.length - 1)]
        let map = new AffixMapData().valueCopy(Logic.affixs[index]) //获取表数据
        let data = new AffixData()
        data.groupId = map.id //下标是用来防止重复
        data.factor = map.factor //装备等级增加系数
        data.index = rand4save.getRandomNum(0, 3) //词缀强度
        if (data.index == 3) {
            data.name = map.affixs[0] //词缀为4的时候拥有名字
        }
        data.common[map.common] = map.levels[data.index] + data.factor * level
        data.desc = map.desc.replace('@', data.common[map.common])
        return data
    }
}
