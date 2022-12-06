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

    static buildEquipmentAffixs(data: EquipmentData, rand4save: Random4Save) {
        const EQUIP: Map<string, number[]> = new Map() // //装备对应属性
        EQUIP.clear()
        EQUIP.set(InventoryManager.WEAPON, [1, 4, 5, 6, 9, 13, 14, 16, 17, 20])
        EQUIP.set(InventoryManager.REMOTE, [1, 2, 3, 12, 22, 23, 24])
        EQUIP.set(InventoryManager.SHIELD, [0, 1, 7, 15, 18, 19, 21])
        EQUIP.set(InventoryManager.HELMET, [0, 1, 7, 14, 17, 20, 22])
        EQUIP.set(InventoryManager.CLOTHES, [0, 1, 7, 21, 15])
        EQUIP.set(InventoryManager.TROUSERS, [0, 1, 7, 8, 21])
        EQUIP.set(InventoryManager.SHOES, [0, 1, 7, 8, 21])
        EQUIP.set(InventoryManager.GLOVES, [0, 1, 2, 3, 7, 9, 13, 14, 15, 16, 17, 22, 23, 24])
        EQUIP.set(InventoryManager.CLOAK, [0, 1, 7, 8, 21])
        const ELEMENT = [25, 26, 27, 28, 29, 30, 31] //元素几率
        const TOTAL = [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 44, 45, 46] //总额提升
        const GROUP = EQUIP.get(data.equipmetType)
        data.affixs = []
        data.prefix = this.QUALITY_NAMES[data.quality]
        for (let i = 0; i < data.quality; i++) {
            data.affixs.push(AffixManager.getRandomAffix(GROUP, ELEMENT, TOTAL, data.quality, rand4save))
        }
        for (let affix of data.affixs) {
            data.prefix += affix.name
        }
        data.titlecolor = this.QUALITY_COLORS[data.quality]
        // if (desc.color != '#ffffff') {
        //     data.color = desc.color
        //     if (data.lightcolor != '#ffffff') {
        //         data.lightcolor = EquipmentManager.getMixColor(desc.color, data.lightcolor)
        //     } else {
        //         data.lightcolor = desc.color
        //     }
        // }
        data.requireLevel = Logic.playerData.OilGoldData.level
        data.updateFinalCommon()
        data.price += EquipmentManager.getPrice(data)
    }

    /**
     * 生成随机词缀
     * 总额提升概率10%元素几率20%普通几率70%
     * @param groups 指定装备类型的词缀下标列表,多个词缀生成的时候要剔除重复部分
     * @param elements
     * @param totals
     * @param quality 装备等级
     */
    static getRandomAffix(groups: number[], elements: number[], totals: number[], quality: number, rand4save: Random4Save) {
        let rand = rand4save.rand()
        let arr = groups
        if (rand > 0.9) {
            arr = totals
        } else if (rand > 0.7) {
            arr = elements
        }
        let i = rand4save.getRandomNum(0, arr.length - 1)
        let index = arr[i]
        arr.splice(i, 1)
        let map = new AffixMapData().valueCopy(Logic.affixs[index]) //获取表数据
        let data = new AffixData()
        data.groupId = map.id //下标是用来防止重复
        data.factor = map.factor //装备等级增加系数
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
        if (data.index == 3) {
            data.name = map.affixs[0] //词缀为4的时候拥有名字
        }
        data.common[map.common] = map.levels[data.index] + data.factor * quality
        data.desc = map.desc.replace('@', data.common[map.common])
        return data
    }
}
