import AffixData from '../data/AffixData'
import AffixMapData from '../data/AffixMapData'
import EquipmentData from '../data/EquipmentData'
import Logic from '../logic/Logic'
import Random4Save from '../utils/Random4Save'
import EquipmentManager from './EquipmentManager'
import InventoryManager from './InventoryManager'

/**
 * 词缀管理器
 */
export default class AffixManager {
    static readonly QUALITY_COLORS = ['#ffffff', '#00ff00', '#4169E1', '#8B008B', '#FFFF00', '#ffa500', '#ff0000']
    //白色（普通0）→绿色（精良1）→蓝色（优秀2）→紫色（史诗3）→金色（传说4）→橙色（神话5）
    static readonly QUALITY_NAMES = ['普通的', '精良的', '优秀的', '史诗的', '传说的', '神话的', '诅咒的']
    static readonly BASE_UPGRADE = [0, 1, 4, 5, 6, 7, 12, 13, 14, 15] //可以跟随等级提升的类型
    static getAffixMapCollection(equipmentType: string): [number[], number[], number[]] {
        const EQUIP: Map<string, number[]> = new Map() // //装备对应属性
        EQUIP.set(InventoryManager.WEAPON, [1, 4, 5, 6, 9, 13, 14, 17, 20])
        EQUIP.set(InventoryManager.REMOTE, [1, 2, 3, 12, 16, 22, 23, 24])
        EQUIP.set(InventoryManager.SHIELD, [0, 1, 7, 15, 18, 19, 21])
        EQUIP.set(InventoryManager.HELMET, [0, 1, 7, 14, 17, 20, 22])
        EQUIP.set(InventoryManager.CLOTHES, [0, 1, 7, 21, 15])
        EQUIP.set(InventoryManager.TROUSERS, [0, 1, 7, 8, 21])
        EQUIP.set(InventoryManager.SHOES, [0, 1, 7, 8, 21])
        EQUIP.set(InventoryManager.GLOVES, [0, 1, 2, 3, 7, 9, 13, 14, 15, 16, 17, 22, 23, 24])
        EQUIP.set(InventoryManager.CLOAK, [0, 1, 7, 8, 21])
        const ELEMENT = [25, 26, 27, 28, 29, 30, 31] //元素几率
        const TOTAL = [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 44, 45, 46] //总额提升
        const GROUP = EQUIP.get(equipmentType)
        return [GROUP, ELEMENT, TOTAL]
    }
    static buildEquipmentAffixs(data: EquipmentData, level: number, rand4save: Random4Save) {
        const [GROUP, ELEMENT, TOTAL] = AffixManager.getAffixMapCollection(data.equipmentType)
        data.requireLevel = level
        data.affixs = []
        data.titlecolor = this.QUALITY_COLORS[data.quality]
        for (let i = 0; i < data.quality; i++) {
            data.affixs.push(AffixManager.getRandomAffix(GROUP, ELEMENT, TOTAL, data.requireLevel, rand4save, -1))
        }

        // if (desc.color != '#ffffff') {
        //     data.color = desc.color
        //     if (data.lightcolor != '#ffffff') {
        //         data.lightcolor = EquipmentManager.getMixColor(desc.color, data.lightcolor)
        //     } else {
        //         data.lightcolor = desc.color
        //     }
        // }
    }

    /**
     * 重铸词缀
     * @param data
     * @param oldAffixIndex
     * @param rand4save
     */
    static recastEquipmentAffixs(data: EquipmentData, oldAffixIndex: number, rand4save: Random4Save) {
        const [GROUP, ELEMENT, TOTAL] = AffixManager.getAffixMapCollection(data.equipmentType)
        //移除已有词缀
        for (let affix of data.affixs) {
            AffixManager.removeHaveAffix(GROUP, ELEMENT, TOTAL, affix)
        }
        data.affixs[oldAffixIndex] = AffixManager.getRandomAffix(GROUP, ELEMENT, TOTAL, data.requireLevel, rand4save, data.affixs[oldAffixIndex].index)
        EquipmentManager.updateUpgradeEquipment(data)
    }
    static removeHaveAffix(groups: number[], elements: number[], totals: number[], oldAffix: AffixData) {
        let arr = []
        if (oldAffix.type == 0) {
            arr = groups
        } else if (oldAffix.type == 1) {
            arr = elements
        } else if (oldAffix.type == 2) {
            arr = totals
        }
        for (let i = arr.length - 1; i >= 0; i--) {
            if (oldAffix.groupId == arr[i]) {
                arr.splice(i, 1)
                break
            }
        }
    }

    /**
     * 强化词缀
     * @param data
     * @param oldAffixIndex
     */
    static strengthenEquipmentAffixs(data: EquipmentData, oldAffixIndex: number) {
        let oldAffix = data.affixs[oldAffixIndex]
        if (oldAffix.index >= 9) {
            return
        }
        oldAffix.index++
        let map = new AffixMapData().valueCopy(Logic.affixs[oldAffix.groupId]) //获取表数据
        AffixManager.buildAffixNameAndCommon(oldAffix, map, data.requireLevel)
        EquipmentManager.updateUpgradeEquipment(data)
    }

    /**
     * 生成随机词缀
     * 总额提升概率10%元素几率20%普通几率70%
     * @param groups 指定装备类型的词缀下标列表,多个词缀生成的时候要剔除重复部分
     * @param elements
     * @param totals
     * @param level 装备当前等级
     */
    static getRandomAffix(groups: number[], elements: number[], totals: number[], level: number, rand4save: Random4Save, keepIndex: number) {
        let rand = rand4save.rand()
        let arr = groups
        let type = 0
        if (rand > 0.9) {
            arr = totals
            type = 2
        } else if (rand > 0.7) {
            arr = elements
            type = 1
        }
        let i = rand4save.getRandomNum(0, arr.length - 1)
        let index = arr[i]
        arr.splice(i, 1)
        let map = new AffixMapData().valueCopy(Logic.affixs[index]) //获取表数据
        let data = new AffixData()
        data.groupId = map.id //下标是用来防止重复
        data.factor = map.factor //装备等级增加系数
        data.type = type //属性类别 基础 元素 总额
        if (keepIndex == -1) {
            let r = rand4save.rand()
            //词缀强度80% 15% 4% 1%
            if (r < 0.8) {
                data.index = 0
            } else if (r >= 0.8 && r < 0.95) {
                data.index = 1
            } else if (r >= 0.95 && r < 0.99) {
                data.index = 2
            } else {
                data.index = 3
            }
        } else {
            data.index = keepIndex
        }
        AffixManager.buildAffixNameAndCommon(data, map, level)
        return data
    }
    static buildAffixNameAndCommon(data: AffixData, map: AffixMapData, level: number) {
        //词缀强度下标为369的时候拥有名字
        if (data.index == 3) {
            data.name = map.affixs[0]
        } else if (data.index == 6) {
            data.name = map.affixs[1]
        } else if (data.index == 9) {
            data.name = map.affixs[2]
        }
        data.common[map.common] = map.levels[data.index] + map.levels[data.index] * data.factor * level
        data.desc = map.desc.replace('@', data.common[map.common])
    }
}
