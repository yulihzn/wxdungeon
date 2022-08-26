// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import AchievementData from '../data/AchievementData'
import FurnitureData from '../data/FurnitureData'
import SettingsData from '../data/SettingsData'

const { ccclass, property } = cc._decorator

@ccclass
export default class LocalStorage {
    public static SAVE_NAME = 'SINKDUNGEON_SAVE'
    public static SAVE_DUNGEON = 'SAVE_DUNGEON'
    public static KEY_ACHIEVEMENT = 'KEY_ACHIEVEMENT'
    public static KEY_SYSTEM_SETTINGS = 'KEY_SYSTEM_SETTINGS'
    public static KEY_COIN = 'KEY_COIN'
    public static KEY_COIN_DREAM_COUNT = 'KEY_DREAM_COIN_COUNT'
    public static KEY_FURNITURES = 'KEY_FURNITURES'
    public static VAULE_OPEN = '1'
    public static KEY_LAST_SAVE_SLOT = 'KEY_LAST_SAVE_SLOT'
    static DEFAULT_MAP = { KEY_SWITCH_SHOW_SHADOW: 1, KEY_SWITCH_SHOW_GAMEPAD: 0, KEY_SWITCH_SHOW_EQUIPDIALOG: 0, KEY_SWITCH_LOW_POWER: 0, KEY_LAST_SAVE_SLOT: 0 }

    static getValue(key: string): string {
        return cc.sys.localStorage.getItem(key)
    }

    static putValue(key: string, value: any) {
        cc.sys.localStorage.setItem(key, JSON.stringify(value))
    }

    static getData(): any {
        let str = LocalStorage.getValue(LocalStorage.SAVE_NAME)
        if (!str) {
            str = '{}'
        }
        return JSON.parse(str)
    }
    static getValueFromData(key: string): any {
        let str = LocalStorage.getValue(LocalStorage.SAVE_NAME)
        if (!str) {
            str = '{}'
        }
        return LocalStorage.getData()[key]
    }
    static saveData(key: string, value: any) {
        let data = LocalStorage.getData()
        data[key] = value
        LocalStorage.putValue(LocalStorage.SAVE_NAME, data)
    }

    static getAchievementData(): AchievementData {
        let data = new AchievementData()
        data.valueCopy(LocalStorage.getData()[LocalStorage.KEY_ACHIEVEMENT])
        return data
    }
    static saveAchievementData(data: AchievementData): void {
        LocalStorage.saveData(LocalStorage.KEY_ACHIEVEMENT, data)
    }

    static getSystemSettings(): SettingsData {
        let data = new SettingsData()
        data.valueCopy(LocalStorage.getData()[LocalStorage.KEY_SYSTEM_SETTINGS])
        return data
    }
    static saveSystemSettings(data: SettingsData): void {
        LocalStorage.saveData(LocalStorage.KEY_SYSTEM_SETTINGS, data)
    }
    static getFurnitureData(id: string) {
        let map: { [key: string]: FurnitureData } = LocalStorage.getData()[LocalStorage.KEY_FURNITURES]
        if (!map) {
            map = {}
        }
        return map[id]
    }
    static saveFurnitureData(data: FurnitureData) {
        if (!data) {
            return
        }
        let map: { [key: string]: FurnitureData } = LocalStorage.getData()[LocalStorage.KEY_FURNITURES]
        if (!map) {
            map = {}
        }
        let oldData = new FurnitureData()
        oldData.valueCopy(map[data.id])
        let purchased = oldData.purchased
        let isOpen = oldData.isOpen
        oldData.valueCopy(data)

        if (purchased) {
            oldData.purchased = purchased
        }
        if (isOpen) {
            oldData.isOpen = isOpen
        }
        map[data.id] = oldData
        LocalStorage.saveData(LocalStorage.KEY_FURNITURES, map)
    }

    static getLastSaveSlotKey() {
        let v = LocalStorage.getValueFromData(LocalStorage.KEY_LAST_SAVE_SLOT)
        let num = v || v == 0 ? parseInt(v) : LocalStorage.DEFAULT_MAP[LocalStorage.KEY_LAST_SAVE_SLOT]
        return num
    }
    static setLastSaveSlotKey(slot: number) {
        LocalStorage.saveData(LocalStorage.KEY_LAST_SAVE_SLOT, slot)
    }
}
