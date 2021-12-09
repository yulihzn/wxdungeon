import { EventHelper } from './../logic/EventHelper';
import EquipmentData from "../data/EquipmentData";
import FurnitureData from "../data/FurnitureData";
import InventoryData from "../data/InventoryData";
import ItemData from "../data/ItemData";
import SuitData from "../data/SuitData";
import Logic from "../logic/Logic";
import InventoryItem from "../ui/InventoryItem";
import NextStep from "../utils/NextStep";
import Utils from '../utils/Utils';
import Item from '../item/Item';
import InventoryDialog from '../ui/dialog/InventoryDialog';

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class InventoryManager {
    static readonly MAX_BAG = 32;
    static readonly MAX_EQUIP = 8;
    static readonly MAX_ITEM = 5;
    public static readonly EMPTY = 'empty';//10000000
    public static readonly WEAPON = 'weapon';//10010000
    public static readonly REMOTE = 'remote';//10020000
    public static readonly SHIELD = 'shield';//10030000
    public static readonly HELMET = 'helmet';//10040000
    public static readonly CLOTHES = 'clothes';//10050000
    public static readonly TROUSERS = 'trousers';//10060000
    public static readonly GLOVES = 'gloves';//10070000
    public static readonly SHOES = 'shoes';//10080000
    public static readonly CLOAK = 'cloak';//10090000
    static readonly EQUIP_TAGS = [InventoryManager.WEAPON, InventoryManager.REMOTE, InventoryManager.SHIELD, InventoryManager.HELMET, InventoryManager.CLOTHES, InventoryManager.TROUSERS, InventoryManager.GLOVES
        , InventoryManager.SHOES, InventoryManager.CLOAK];
    static readonly TAG = cc.Enum({
        DEFAULT: 0,//默认
        EQUIP: 1,//装备区
        ITEM: 2,//物品区
        CUPBOARD: 3//衣柜
    })
    //buffer效果
    buffer: EquipmentData = new EquipmentData();
    itemList: ItemData[] = [];
    inventoryList: InventoryData[] = [];
    itemCoolDownList: NextStep[] = [];
    equips: { [key: string]: EquipmentData } = {};
    suitMap: { [key: string]: SuitData } = {};
    suitEquipMap: { [key: string]: EquipmentData } = {};
    furnitureMap: Map<String, FurnitureData> = new Map();
    emptyEquipData = new EquipmentData();
    clear(): void {
    }
    constructor() {
        for (let name of InventoryManager.EQUIP_TAGS) {
            this.equips[name] = new EquipmentData();
        }
        for (let i = 0; i < 5; i++) {
            let data = new ItemData();
            data.count = -1;
            this.itemList.push(data);
            this.itemCoolDownList.push(new NextStep());
        }
        this.suitMap = {};
        this.suitEquipMap = {};
        this.furnitureMap = new Map();
    }
    getEquipBySuit(e: EquipmentData): EquipmentData {
        if (e && this.suitEquipMap[e.suitType]) {
            return this.suitEquipMap[e.suitType];
        }
        return this.emptyEquipData;
    }
    getTotalEquipData(): EquipmentData {
        let e = new EquipmentData();
        for (let key in this.equips) {
            e.Common.add(this.equips[key].Common);
        }
        e.Common.add(this.buffer.Common);
        for (let key in this.suitEquipMap) {
            let equip = this.suitEquipMap[key];
            if (equip) {
                e.Common.add(equip.Common);
            }
        }
        return e;
    }

    static setItemToBag(itemData: ItemData, indexFromBag: number, furnitureId: string) {
        let list = Logic.inventoryManager.inventoryList;
        let max = InventoryManager.MAX_BAG;
        if (furnitureId && furnitureId.length > 0) {
            list = Logic.inventoryManager.furnitureMap.get(furnitureId).storageList;
            max = Logic.inventoryManager.furnitureMap.get(furnitureId).storage;
        }
        //可插入的下标,默认为列表末尾，如果已满为-1，遍历选中第一个空位
        let insertIndex = list.length < max ? list.length : -1;
        let isFromBag = indexFromBag && indexFromBag > -1 && indexFromBag < list.length || indexFromBag === 0;
        //遍历相同物品，如果有+1,如果是来自背包交换通知背包刷新
        for (let i = list.length - 1; i >= 0; i--) {
            let idata = list[i];
            if (idata.type == InventoryItem.TYPE_EMPTY) {
                insertIndex = i;
            } else if (idata.type == InventoryItem.TYPE_ITEM && InventoryManager.isItemEqualCanAdd(idata.itemData, itemData)) {
                let count = idata.itemData.count + itemData.count;
                idata.itemData = new ItemData();
                idata.itemData.valueCopy(itemData);
                idata.itemData.count = count;
                idata.price = idata.itemData.price;
                if (idata.itemData.count > 0) {
                    idata.price = idata.itemData.price * idata.itemData.count;
                }
                if (isFromBag) {
                    EventHelper.emit(EventHelper.HUD_INVENTORY_SELECT_UPDATE, { index: indexFromBag, furnitureId: furnitureId });
                }
                return;
            }
        }
        let newdata = InventoryManager.buildItemInventoryData(itemData);
        //如果是来自背包交换，填补交换下标的数据并通知背包刷新指定数据
        if (isFromBag) {
            list[indexFromBag] = new InventoryData();
            list[indexFromBag].valueCopy(newdata);
            EventHelper.emit(EventHelper.HUD_INVENTORY_SELECT_UPDATE, { index: indexFromBag });
        } else {
            //如果是拾取或者购买，判断插入下标是否为-1，如果为-1放在地上，否则添加到背包并通知背包全局刷新
            if (insertIndex == -1) {
                if (furnitureId && furnitureId.length > 0) {
                    Utils.toast('该物品栏已满');
                } else if (itemData.resName != Item.EMPTY) {
                    EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM, { res: itemData.resName, count: itemData.count });
                }
            } else {
                let d = new InventoryData();
                d.valueCopy(newdata);
                if (insertIndex < list.length) {
                    list[insertIndex] = d;
                } else {
                    list.push(d);
                }
                EventHelper.emit(EventHelper.HUD_INVENTORY_ALL_UPDATE);
            }
        }
    }

    static buildItemInventoryData(itemData: ItemData) {
        let newdata = new InventoryData();
        newdata.itemData = new ItemData();
        newdata.itemData.valueCopy(itemData);
        newdata.type = itemData.resName == Item.EMPTY ? InventoryItem.TYPE_EMPTY : InventoryItem.TYPE_ITEM;
        newdata.createTime = new Date().getTime();
        newdata.id = newdata.itemData.id;
        return newdata;
    }
    static bulidEquipInventoryData(equipmentData: EquipmentData) {
        let newdata = new InventoryData();
        newdata.equipmentData = new EquipmentData();
        newdata.equipmentData.valueCopy(equipmentData);
        newdata.type = equipmentData.equipmetType == InventoryManager.EMPTY ? InventoryItem.TYPE_EMPTY : InventoryItem.TYPE_EQUIP;
        newdata.price = newdata.equipmentData.price;
        newdata.createTime = new Date().getTime();
        newdata.id = newdata.equipmentData.id;
        return newdata;
    }
    static setEquipmentToBag(equipmentData: EquipmentData, isInit: boolean) {
        //来自初始化，isDrop(丢弃售出)或者空装备直接返回
        if (isInit || equipmentData.equipmetType == InventoryManager.EMPTY) {
            return;
        }
        let list = Logic.inventoryManager.inventoryList;
        let newdata = InventoryManager.bulidEquipInventoryData(equipmentData);
        //添加到背包
        let isAdded = InventoryDialog.addEquipOrItemToBag(newdata, list, this.list, true,null);
        //不是直接放下的情况先往背包里放
        if (!isDrop) {
            isAdded = InventoryDialog.addEquipOrItemToBag(current.data, list, this.list, true,null);
        }
        //背包已满检查是否打开储物箱，添加到储物箱
        if (!isAdded && this.furnitureId && this.furnitureId.length > 0) {
            list = Logic.inventoryManager.furnitureMap.get(this.furnitureId).storageList;
            isAdded = InventoryDialog.addEquipOrItemToBag(current.data, list, this.otherList, true,null);
        }
        //背包已满，或者打开的储物箱已满，直接放置到地上
        if (!isAdded) {
            if (!isDrop) {
                Utils.toast('物品栏已满');
            }
            EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM, { res: itemData.resName, count: itemData.count })
        }
        let max = InventoryManager.MAX_BAG;
        if (furnitureId && furnitureId.length > 0) {
            list = Logic.inventoryManager.furnitureMap.get(furnitureId).storageList;
            max = Logic.inventoryManager.furnitureMap.get(furnitureId).storage;
        }
        //可插入的下标,默认为列表末尾，如果已满为-1，遍历选中第一个空位
        let insertIndex = list.length < max ? list.length : -1;
        let isFromBag = indexFromBag && indexFromBag > -1 && indexFromBag < list.length || indexFromBag === 0;
        //遍历选中第一个空位
        for (let i = 0; i < list.length; i++) {
            let idata = list[i];
            if (idata.type == InventoryItem.TYPE_EMPTY) {
                insertIndex = i;
                break;
            }
        }
        let newdata = InventoryManager.bulidEquipInventoryData(equipmentData);
        //如果是来自背包交换，填补交换下标的数据并通知背包刷新指定数据
        if (isFromBag) {
            list[indexFromBag] = new InventoryData();
            list[indexFromBag].valueCopy(newdata);
            EventHelper.emit(EventHelper.HUD_INVENTORY_SELECT_UPDATE, { index: indexFromBag, furnitureId: furnitureId });
        } else {
            //如果是拾取或者购买，判断插入下标是否为-1，如果为-1放在地上，否则添加到背包并通知背包全局刷新
            if (insertIndex == -1) {
                if (furnitureId && furnitureId.length > 0) {
                    Utils.toast('该物品栏已满');
                } else if (equipmentData.equipmetType != InventoryManager.EMPTY) {
                    EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { res: equipmentData.img, equipmentData: equipmentData });
                }
            } else {
                let d = new InventoryData();
                d.valueCopy(newdata);
                if (insertIndex < list.length) {
                    list[insertIndex] = d;
                } else {
                    list.push(d);
                }
                EventHelper.emit(EventHelper.HUD_INVENTORY_ALL_UPDATE);
            }
        }
    }
    static isItemEqualCanAdd(item1: ItemData, item2: ItemData): boolean {
        return item1&&item2&&item1.resName != Item.EMPTY && item1.resName == item2.resName
            && item1.count > 0 && item2.count > 0;
    }
}
