// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AvatarData from '../../data/AvatarData'
import InventoryData from '../../data/InventoryData'
import { EventHelper } from '../../logic/EventHelper'
import Item from '../../item/Item'
import Logic from '../../logic/Logic'
import InventoryManager from '../../manager/InventoryManager'
import AudioPlayer from '../../utils/AudioPlayer'
import InventoryItem from '../InventoryItem'
import BaseDialog from './BaseDialog'
import EquipmentAndItemDialog from './EquipmentAndItemDialog'
import Utils from '../../utils/Utils'
import Talent from '../../talent/Talent'
import EquipmentData from '../../data/EquipmentData'
import ItemData from '../../data/ItemData'
import GameAlertDialog from './GameAlertDialog'
import MapManager from '../../manager/MapManager'
import AffixManager from '../../manager/AffixManager'
import EquipmentManager from '../../manager/EquipmentManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class InventoryDialog extends BaseDialog {
    @property(cc.Prefab)
    item: cc.Prefab = null
    @property(cc.Node)
    layer: cc.Node = null
    @property(cc.Node)
    layout: cc.Node = null
    @property(cc.Node)
    layoutEquip: cc.Node = null
    @property(cc.Node)
    layoutItem: cc.Node = null
    @property(cc.Node)
    layoutOther: cc.Node = null
    @property(cc.Node)
    layoutCast: cc.Node = null
    @property(cc.Node)
    otherDialog: cc.Node = null
    @property(cc.Node)
    castDialog: cc.Node = null
    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null
    @property(cc.Prefab)
    equipmentAndItemDialogPrefab: cc.Prefab = null
    @property(cc.Node)
    useButton: cc.Node = null
    @property(cc.Node)
    dropButton: cc.Node = null
    @property(cc.Node)
    saleButton: cc.Node = null
    @property(cc.Node)
    castButton: cc.Node = null
    @property(cc.Node)
    strengthenButton: cc.Node = null
    @property(cc.Node)
    upgradeButton: cc.Node = null
    list: InventoryItem[] = []
    equipList: InventoryItem[] = []
    itemList: InventoryItem[] = []
    otherList: InventoryItem[] = []
    furnitureId: string = ''
    @property(cc.Node)
    select: cc.Node = null
    @property(cc.Label)
    discountLabel: cc.Label = null
    static readonly OPERATOR_CAST = 0
    static readonly OPERATOR_STRENGTHEN = 1
    static readonly OPERATOR_UPGRADE = 2
    currentSelectIndex: number
    currentAffixSelectIndex: number = -1
    discount = 0.5
    equipmentAndItemDialog: EquipmentAndItemDialog = null
    onLoad() {
        this.select.opacity = 0
        this.equipmentAndItemDialog = this.initDialog()
        this.initLayout(this.layout, this.list, InventoryManager.MAX_BAG, 0)
        this.initLayout(this.layoutEquip, this.equipList, InventoryManager.MAX_EQUIP, InventoryManager.MAX_BAG)
        this.initLayout(this.layoutItem, this.itemList, InventoryManager.MAX_ITEM, InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP)
        this.initLayout(this.layoutOther, this.otherList, 0, 0)
        this.initCastLayout()
        EventHelper.on(EventHelper.HUD_INVENTORY_ALL_UPDATE, detail => {
            if (this.node) {
                this.updateList(Logic.bagSortIndex)
                this.updateEquipList()
                this.updateItemList()
                if (this.furnitureId.length > 0) {
                    this.updateOtherList(Logic.sortIndexs[this.furnitureId])
                }
            }
        })
        EventHelper.on(EventHelper.HUD_INVENTORY_EQUIP_UPDATE, detail => {
            if (this.node) {
                this.updateEquipList()
            }
        })
        EventHelper.on(EventHelper.HUD_INVENTORY_ITEM_UPDATE, detail => {
            if (this.node) {
                this.updateItemList()
            }
        })
        EventHelper.on(EventHelper.HUD_INVENTORY_SELECT_UPDATE, detail => {
            if (this.node) {
                let data = Logic.inventoryMgr.inventoryList[detail.index]
                let furnitureId: string = detail.furnitureId
                if (furnitureId && furnitureId.length > 0) {
                    data = Logic.furnitureMap.get(furnitureId).storageList[detail.index]
                    this.otherList[detail.index].updateData(data)
                } else {
                    this.list[detail.index].updateData(data)
                }
            }
        })
        this.toggleContainer.toggleItems[Logic.bagSortIndex].isChecked = true
        if (Logic.playerData.AvatarData.organizationIndex == AvatarData.HUNTER) {
            this.discount += 0.1
        }
        if (Talent.TALENT_010 == Logic.playerData.AvatarData.professionData.talent) {
            this.discount += 0.1
        }
    }

    private initDialog() {
        let node = cc.instantiate(this.equipmentAndItemDialogPrefab)
        node.parent = this.node.getChildByName('layer')
        let dialog = node.getComponent(EquipmentAndItemDialog)
        dialog.changeBgAndAnchor(EquipmentAndItemDialog.BG_TYPE_ARROW_NONE)
        dialog.hideDialog()
        return dialog
    }
    private initLayout(layout: cc.Node, inventoryItemList: InventoryItem[], max: number, extraMax: number) {
        layout.removeAllChildren()
        for (let i = 0; i < max; i++) {
            let data = new InventoryData()
            data.createTime = new Date().getTime()
            inventoryItemList.push(this.getItem(extraMax + i, data, layout))
        }
    }

    private getItem(index: number, data: InventoryData, layout: cc.Node) {
        let prefab = cc.instantiate(this.item)
        prefab.parent = layout
        let item = prefab.getComponent(InventoryItem)
        item.init(this, index, data)
        return item
    }

    show() {
        this._show('', false)
    }
    showCast() {
        this._show('', true)
    }
    showFurniture(id: string) {
        this._show(id, false)
    }
    private _show(id: string, isCast: boolean) {
        this.layer.x = 0
        let isFuriniture = id && id.length > 0 && !isCast
        this.otherDialog.active = isFuriniture
        this.furnitureId = isFuriniture ? id : ''
        this.castDialog.active = isCast
        super.show()
        this.updateList(Logic.bagSortIndex)
        this.updateEquipList()
        this.updateItemList()
        this.updateOtherList(isFuriniture ? Logic.sortIndexs[id] : 0)
        if (isFuriniture) {
            cc.tween(this.layer).delay(0.3).to(0.5, { x: 145 }).start()
        } else if (isCast) {
            cc.tween(this.layer).delay(0.3).to(0.5, { x: -180 }).start()
        }
    }
    //toggle
    changeSort(toggle: cc.Toggle, index: number) {
        Logic.bagSortIndex = index
        this.updateList(index)
    }
    changeFurnitureSort(toggle: cc.Toggle, index: number) {
        Logic.sortIndexs[this.furnitureId] = index
        this.updateOtherList(index)
    }
    clearSelect() {
        this.currentSelectIndex = -1
        this.equipmentAndItemDialog.hideDialog()
        this.useButton.active = false
        this.dropButton.active = false
        this.saleButton.active = false
        this.hideCastInfo()
        this.select.opacity = 0
    }

    showSelect(item: InventoryItem) {
        this.currentSelectIndex = item.index
        this.select.position = this.node.convertToNodeSpaceAR(item.node.convertToWorldSpaceAR(cc.Vec3.ZERO))
        this.select.opacity = 200
        this.useButton.getComponentInChildren(cc.Label).string = this.currentSelectIndex >= InventoryManager.MAX_BAG ? '卸下' : '装备'
        if (this.furnitureId.length > 0) {
            if (this.currentSelectIndex >= InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM) {
                this.dropButton.getComponentInChildren(cc.Label).string = '取出'
                this.useButton.getComponentInChildren(cc.Label).string = '装备'
            } else {
                this.dropButton.getComponentInChildren(cc.Label).string = '存入'
            }
        } else {
            this.dropButton.getComponentInChildren(cc.Label).string = '放下'
        }
        AudioPlayer.play(AudioPlayer.SELECT)
        if (item.data.type == InventoryItem.TYPE_EQUIP) {
            this.discountLabel.string = `-${this.discount * 100}%(${Math.floor(item.data.equipmentData.price * this.discount)})`
            this.useButton.active = true
            this.dropButton.active = true
            this.saleButton.active = true
            this.showCastInfo(item.data.equipmentData)
            this.equipmentAndItemDialog.showDialog(cc.v3(420, 260), null, null, item.data.equipmentData, null)
        } else {
            this.discountLabel.string = `-${this.discount * 100}%(${Math.floor(
                item.data.itemData.count > 1 ? item.data.itemData.price * item.data.itemData.count * this.discount : item.data.itemData.price * this.discount
            )})`
            this.useButton.active = true
            this.dropButton.active = true
            this.saleButton.active = true
            this.hideCastInfo()
            this.equipmentAndItemDialog.showDialog(cc.v3(420, 160), null, item.data.itemData, null, null)
        }
    }

    private updateItemList() {
        let list: InventoryData[] = []
        for (let itemdata of Logic.inventoryMgr.itemList) {
            let data = InventoryManager.buildItemInventoryData(itemdata)
            list.push(data)
        }
        for (let i = 0; i < InventoryManager.MAX_ITEM; i++) {
            if (i < list.length && list[i].type != InventoryItem.TYPE_EMPTY) {
                let data = list[i]
                this.itemList[i].updateData(data)
            } else {
                this.itemList[i].setEmpty()
            }
        }
    }
    private updateEquipList() {
        let list: InventoryData[] = []
        for (let key in Logic.inventoryMgr.equips) {
            let equipdata = Logic.inventoryMgr.equips[key]
            let needAdd = false
            if (key != InventoryManager.REMOTE && key != InventoryManager.SHIELD) {
                needAdd = true
            } else {
                if (key == InventoryManager.REMOTE) {
                    if (equipdata.equipmetType == InventoryManager.REMOTE || Logic.inventoryMgr.equips[InventoryManager.SHIELD].equipmetType == InventoryManager.EMPTY) {
                        needAdd = true
                    }
                } else if (key == InventoryManager.SHIELD) {
                    if (equipdata.equipmetType == InventoryManager.SHIELD) {
                        needAdd = true
                    }
                }
            }
            if (needAdd) {
                let data = InventoryManager.buildEquipInventoryData(equipdata)
                list.push(data)
            }
        }
        for (let i = 0; i < InventoryManager.MAX_EQUIP; i++) {
            if (i < list.length && list[i].type != InventoryItem.TYPE_EMPTY) {
                let data = list[i]
                this.equipList[i].updateData(data)
            } else {
                this.equipList[i].setEmpty()
            }
        }
    }

    private updateOtherList(sortIndex: number) {
        this.clearSelect()
        this.otherList = []
        this.layoutOther.removeAllChildren()
        if (this.furnitureId.length < 1) {
            return
        }
        let furnitureData = Logic.furnitureMap.get(this.furnitureId)
        if (!furnitureData) {
            return
        }
        for (let i = 0; i < furnitureData.storage; i++) {
            let data = new InventoryData()
            if (i < furnitureData.storageList.length) {
                data.valueCopy(furnitureData.storageList[i])
            }
            this.otherList.push(this.getItem(InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM + i, data, this.layoutOther))
        }
        let list = this.getSortList(sortIndex, furnitureData.storageList)
        for (let i = 0; i < furnitureData.storage; i++) {
            if (i < list.length && list[i].type != InventoryItem.TYPE_EMPTY) {
                let data = list[i]
                this.otherList[i].updateData(data)
            } else {
                this.otherList[i].setEmpty()
            }
        }
        furnitureData.storageList = list
    }
    private updateList(sortIndex: number) {
        this.clearSelect()
        let list = this.getSortList(sortIndex, Logic.inventoryMgr.inventoryList)
        for (let i = 0; i < InventoryManager.MAX_BAG; i++) {
            if (i < list.length && list[i].type != InventoryItem.TYPE_EMPTY) {
                let data = list[i]
                this.list[i].updateData(data)
            } else {
                this.list[i].setEmpty()
            }
        }
        Logic.inventoryMgr.inventoryList.splice(0)
        Logic.inventoryMgr.inventoryList.push(...list)
    }
    private getSortList(sortIndex: number, inventoryList: InventoryData[]) {
        let itemlist: InventoryData[] = []
        let equiplist: InventoryData[] = []
        let list: InventoryData[] = []
        for (let i = 0; i < inventoryList.length; i++) {
            let data = inventoryList[i]
            if (data.type != InventoryItem.TYPE_EMPTY) {
                list.push(data)
                if (data.type == InventoryItem.TYPE_EQUIP) {
                    equiplist.push(data)
                } else if (data.type == InventoryItem.TYPE_ITEM) {
                    itemlist.push(data)
                }
            }
        }
        if (sortIndex == 0) {
            //时间排序
            list.sort((a, b) => {
                return a.createTime - b.createTime
            })
        } else if (sortIndex == 1) {
            //类别排序
            list.sort((a, b) => {
                return a.id - b.id
            })
        } else if (sortIndex == 2) {
            //品质排序
            itemlist.sort((a, b) => {
                return a.id - b.id
            })
            equiplist.sort((a, b) => {
                return b.equipmentData.quality - a.equipmentData.quality
            })
            list = equiplist.concat(itemlist)
        } else if (sortIndex == 3) {
            //价格排序
            list.sort((a, b) => {
                return b.price - a.price
            })
        }
        return list
    }
    static getItemInsertIndex(itemData: ItemData, list: InventoryData[], max: number): number {
        //可插入的下标,默认为列表末尾，如果已满为-1，遍历选中第一个空位
        let insertIndex = list.length < max ? list.length : -1
        //遍历选中相同item
        for (let i = 0; i < list.length; i++) {
            let idata = list[i]
            if (InventoryManager.isItemEqualCanAdd(idata.itemData, itemData)) {
                insertIndex = i
                break
            }
        }
        if (insertIndex == -1) {
            return InventoryDialog.getEmptyInsertIndex(list, max)
        }
        return insertIndex
    }
    static getEmptyInsertIndex(list: InventoryData[], max: number): number {
        //可插入的下标,默认为列表末尾，如果已满为-1，遍历选中第一个空位
        let insertIndex = list.length < max ? list.length : -1
        //遍历选中第一个空位
        for (let i = 0; i < list.length; i++) {
            let idata = list[i]
            if (idata.type == InventoryItem.TYPE_EMPTY) {
                insertIndex = i
                break
            }
        }
        return insertIndex
    }
    /**
     * 添加装备到指定背包或储物箱
     * @param data 需要添加的数据
     * @param dataList 被添加的数据列表
     * @param inventoryItemList 被添加的ui列表
     * @returns 是否添加成功
     */
    static addEquipOrItemToBag(data: InventoryData, dataList: InventoryData[], max: number, isItem: boolean, inventoryItemList: InventoryItem[]): boolean {
        let insertIndex = isItem ? this.getItemInsertIndex(data.itemData, dataList, max) : this.getEmptyInsertIndex(dataList, max)
        if (insertIndex == -1) {
            return false
        } else {
            let d = new InventoryData()
            d.valueCopy(data)
            if (insertIndex < dataList.length) {
                if (isItem) {
                    let item1 = d.itemData
                    let item2 = dataList[insertIndex].itemData
                    if (InventoryManager.isItemEqualCanAdd(item1, item2)) {
                        let count = item1.count + item2.count
                        d.itemData.valueCopy(item2)
                        d.itemData.count = count
                    }
                }
                dataList[insertIndex] = d
                if (inventoryItemList) {
                    inventoryItemList[insertIndex].updateData(d)
                }
            } else {
                dataList.push(d)
                if (inventoryItemList) {
                    inventoryItemList[dataList.length - 1].updateData(d)
                }
            }
            return true
        }
    }

    /**脱下装备 */
    private takeOffEquip(isDrop: boolean, isSale: boolean): boolean {
        let isSelectEquip = this.currentSelectIndex >= InventoryManager.MAX_BAG && this.currentSelectIndex < InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP
        if (!isSelectEquip) {
            return false
        }
        AudioPlayer.play(AudioPlayer.SELECT)
        let current = this.equipList[this.currentSelectIndex - InventoryManager.MAX_BAG]
        if (current.data.type == InventoryItem.TYPE_EMPTY) {
            return false
        }
        let equipData = new EquipmentData()
        equipData.valueCopy(current.data.equipmentData)
        let list = Logic.inventoryMgr.inventoryList
        if (isSale) {
            EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: Math.floor(equipData.price * this.discount) })
            AudioPlayer.play(AudioPlayer.COIN)
        } else {
            //添加到背包
            let isAdded = false
            //不是直接放下的情况先往背包里放
            if (!isDrop) {
                isAdded = InventoryDialog.addEquipOrItemToBag(current.data, list, this.list.length, false, this.list)
            }
            //背包已满检查是否打开储物箱，添加到储物箱
            if (!isAdded && this.furnitureId && this.furnitureId.length > 0) {
                list = Logic.furnitureMap.get(this.furnitureId).storageList
                isAdded = InventoryDialog.addEquipOrItemToBag(current.data, list, this.otherList.length, false, this.otherList)
            }
            //背包已满，或者打开的储物箱已满，直接放置到地上
            if (!isAdded) {
                if (!isDrop) {
                    Utils.toast('物品栏已满')
                }
                EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { res: equipData.img, equipmentData: equipData })
            }
        }
        //清空该装备栏并更新ui
        Logic.inventoryMgr.equips[equipData.equipmetType] = new EquipmentData()
        EventHelper.emit(EventHelper.PLAYER_EQUIPMENT_REFRESH, { equipmetType: equipData.equipmetType })
        current.setEmpty()
        this.clearSelect()
        return true
    }
    /**脱下物品 */
    private takeOffItem(isDrop: boolean, isSale: boolean): boolean {
        let isSelectItem =
            this.currentSelectIndex >= InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP &&
            this.currentSelectIndex < InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM
        if (!isSelectItem) {
            return false
        }
        AudioPlayer.play(AudioPlayer.SELECT)
        let current = this.itemList[this.currentSelectIndex - InventoryManager.MAX_BAG - InventoryManager.MAX_EQUIP]
        if (current.data.type == InventoryItem.TYPE_EMPTY) {
            return false
        }
        let itemData = new ItemData()
        itemData.valueCopy(current.data.itemData)
        let list = Logic.inventoryMgr.inventoryList
        if (isSale) {
            EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: Math.floor(itemData.count > 1 ? itemData.price * itemData.count * this.discount : itemData.price * this.discount) })
            AudioPlayer.play(AudioPlayer.COIN)
        } else {
            //添加到背包
            let isAdded = false
            //不是直接放下的情况先往背包里放
            if (!isDrop) {
                isAdded = InventoryDialog.addEquipOrItemToBag(current.data, list, this.list.length, true, this.list)
            }
            //背包已满检查是否打开储物箱，添加到储物箱
            if (!isAdded && this.furnitureId && this.furnitureId.length > 0) {
                list = Logic.furnitureMap.get(this.furnitureId).storageList
                isAdded = InventoryDialog.addEquipOrItemToBag(current.data, list, this.otherList.length, true, this.otherList)
            }
            //背包已满，或者打开的储物箱已满，直接放置到地上
            if (!isAdded) {
                if (!isDrop) {
                    Utils.toast('物品栏已满')
                }
                EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM, { res: itemData.resName, count: itemData.count })
            }
        }
        //清空该装备栏并更新ui
        Logic.inventoryMgr.itemList[this.currentSelectIndex - InventoryManager.MAX_BAG - InventoryManager.MAX_EQUIP] = new ItemData()
        EventHelper.emit(EventHelper.PLAYER_ITEM_REFRESH)
        current.setEmpty()
        this.clearSelect()
        return true
    }

    /**穿上装备或物品 */
    private takeOnEquipOrItem([selectIndex, dataList, inventoryItemList]: [number, InventoryData[], InventoryItem[]]) {
        if (inventoryItemList[selectIndex].data.type == InventoryItem.TYPE_EMPTY) {
            return
        }
        AudioPlayer.play(AudioPlayer.SELECT)
        let current = inventoryItemList[selectIndex]
        if (current.data.type == InventoryItem.TYPE_EQUIP) {
            //佩戴装备
            let equipData = new EquipmentData()
            equipData.valueCopy(current.data.equipmentData)
            if (equipData.equipmetType != InventoryManager.EMPTY) {
                if (equipData.requireLevel > Logic.playerData.OilGoldData.level) {
                    Utils.toast(`当前人物等级太低，无法装备`)
                    return
                }
                //置空当前背包需要装备的数据
                current.setEmpty()
                dataList[selectIndex].setEmpty()

                //交换当前装备

                if (equipData.equipmetType == InventoryManager.REMOTE) {
                    //替换当前远程或盾牌到背包
                    InventoryDialog.addEquipOrItemToBag(
                        InventoryManager.buildEquipInventoryData(Logic.inventoryMgr.equips[InventoryManager.REMOTE]),
                        dataList,
                        inventoryItemList.length,
                        false,
                        inventoryItemList
                    )
                    InventoryDialog.addEquipOrItemToBag(
                        InventoryManager.buildEquipInventoryData(Logic.inventoryMgr.equips[InventoryManager.SHIELD]),
                        dataList,
                        inventoryItemList.length,
                        false,
                        inventoryItemList
                    )
                    //清空盾牌数据
                    Logic.inventoryMgr.equips[InventoryManager.SHIELD].valueCopy(new EquipmentData())
                    EventHelper.emit(EventHelper.PLAYER_EQUIPMENT_REFRESH, { equipmetType: InventoryManager.SHIELD })
                } else if (equipData.equipmetType == InventoryManager.SHIELD) {
                    //替换当前远程或盾牌到背包
                    InventoryDialog.addEquipOrItemToBag(
                        InventoryManager.buildEquipInventoryData(Logic.inventoryMgr.equips[InventoryManager.REMOTE]),
                        dataList,
                        inventoryItemList.length,
                        false,
                        inventoryItemList
                    )
                    InventoryDialog.addEquipOrItemToBag(
                        InventoryManager.buildEquipInventoryData(Logic.inventoryMgr.equips[InventoryManager.SHIELD]),
                        dataList,
                        inventoryItemList.length,
                        false,
                        inventoryItemList
                    )
                    //清空远程数据
                    Logic.inventoryMgr.equips[InventoryManager.REMOTE].valueCopy(new EquipmentData())
                    EventHelper.emit(EventHelper.PLAYER_EQUIPMENT_REFRESH, { equipmetType: InventoryManager.REMOTE })
                } else {
                    InventoryDialog.addEquipOrItemToBag(
                        InventoryManager.buildEquipInventoryData(Logic.inventoryMgr.equips[equipData.equipmetType]),
                        dataList,
                        inventoryItemList.length,
                        false,
                        inventoryItemList
                    )
                }
                //设置装备栏数据并更新ui
                Logic.inventoryMgr.equips[equipData.equipmetType] = equipData
                this.updateEquipList()
                EventHelper.emit(EventHelper.PLAYER_EQUIPMENT_REFRESH, { equipmetType: equipData.equipmetType })
            }
        } else {
            let itemData = new ItemData()
            itemData.valueCopy(current.data.itemData)
            if (itemData.resName != Item.EMPTY) {
                //置空当前背包需要装备的数据
                current.setEmpty()
                dataList[selectIndex].setEmpty()
                //设置物品栏数据并更新ui
                let isRefreshed = false
                //填补相同可叠加
                for (let i = 0; i < Logic.inventoryMgr.itemList.length; i++) {
                    let item = Logic.inventoryMgr.itemList[i]
                    if (InventoryManager.isItemEqualCanAdd(item, itemData)) {
                        let count = item.count + itemData.count
                        item.valueCopy(itemData)
                        item.count = count
                        isRefreshed = true
                        break
                    }
                }
                //填补空缺位置
                if (!isRefreshed) {
                    for (let i = 0; i < Logic.inventoryMgr.itemList.length; i++) {
                        let item = Logic.inventoryMgr.itemList[i]
                        if (item.resName == Item.EMPTY) {
                            item.valueCopy(itemData)
                            isRefreshed = true
                            break
                        }
                    }
                }
                //列表已满
                if (!isRefreshed) {
                    //移出第一个到背包，新的放在末尾
                    let item0 = Logic.inventoryMgr.itemList[0].clone()
                    let arr = new Array()
                    for (let i = 1; i < Logic.inventoryMgr.itemList.length; i++) {
                        arr.push(Logic.inventoryMgr.itemList[i])
                    }
                    arr.push(itemData)
                    for (let i = 0; i < Logic.inventoryMgr.itemList.length; i++) {
                        Logic.inventoryMgr.itemList[i].valueCopy(arr[i])
                    }
                    //交换当前物品
                    InventoryDialog.addEquipOrItemToBag(InventoryManager.buildItemInventoryData(item0), dataList, inventoryItemList.length, true, inventoryItemList)
                }
                this.updateItemList()
                EventHelper.emit(EventHelper.PLAYER_ITEM_REFRESH)
            }
        }
        //清除选中
        this.clearSelect()
    }
    /**放下装备或物品 */
    private dropEquipOrItem([selectIndex, dataList, inventoryItemList]: [number, InventoryData[], InventoryItem[]], isOther: boolean, isSale: boolean) {
        if (inventoryItemList[selectIndex].data.type == InventoryItem.TYPE_EMPTY) {
            return
        }
        let isAdded = false
        AudioPlayer.play(AudioPlayer.SELECT)
        let current = inventoryItemList[selectIndex]
        if (current.data.type == InventoryItem.TYPE_EQUIP) {
            //佩戴装备
            let equipData = new EquipmentData()
            equipData.valueCopy(current.data.equipmentData)
            if (equipData.equipmetType != InventoryManager.EMPTY) {
                if (isSale) {
                    EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: Math.floor(equipData.price * this.discount) })
                    AudioPlayer.play(AudioPlayer.COIN)
                } else {
                    if (isOther) {
                        isAdded = InventoryDialog.addEquipOrItemToBag(current.data, Logic.inventoryMgr.inventoryList, this.list.length, false, this.list)
                    } else if (this.furnitureId && this.furnitureId.length > 0) {
                        isAdded = InventoryDialog.addEquipOrItemToBag(
                            current.data,
                            Logic.furnitureMap.get(this.furnitureId).storageList,
                            this.otherList.length,
                            false,
                            this.otherList
                        )
                    }
                    //放置装备到地上
                    if (!isAdded) {
                        EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { res: equipData.img, equipmentData: equipData })
                    }
                }
            }
        } else {
            let itemData = new ItemData()
            itemData.valueCopy(current.data.itemData)
            if (itemData.resName != Item.EMPTY) {
                if (isSale) {
                    EventHelper.emit(EventHelper.HUD_ADD_COIN, {
                        count: Math.floor(itemData.count > 1 ? itemData.price * itemData.count * this.discount : itemData.price * this.discount)
                    })
                    AudioPlayer.play(AudioPlayer.COIN)
                } else {
                    if (isOther) {
                        isAdded = InventoryDialog.addEquipOrItemToBag(current.data, Logic.inventoryMgr.inventoryList, this.list.length, true, this.list)
                    } else if (this.furnitureId && this.furnitureId.length > 0) {
                        isAdded = InventoryDialog.addEquipOrItemToBag(
                            current.data,
                            Logic.furnitureMap.get(this.furnitureId).storageList,
                            this.otherList.length,
                            true,
                            this.otherList
                        )
                    }
                    //放置物品到地上
                    if (!isAdded) {
                        EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM, { res: itemData.resName, count: itemData.count })
                    }
                }
            }
        }
        //置空当前背包需要装备的数据
        inventoryItemList[selectIndex].setEmpty()
        dataList[selectIndex].setEmpty()
        //清除选中
        this.clearSelect()
    }
    private getSelectInfo(): [number, InventoryData[], InventoryItem[]] {
        let inventoryItemList = this.list
        let dataList = Logic.inventoryMgr.inventoryList
        let selectIndex = this.currentSelectIndex
        let isOther = this.currentSelectIndex >= InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM
        if (isOther) {
            inventoryItemList = this.otherList
            dataList = Logic.furnitureMap.get(this.furnitureId).storageList
            selectIndex = this.currentSelectIndex - InventoryManager.MAX_BAG - InventoryManager.MAX_EQUIP - InventoryManager.MAX_ITEM
        }
        return [selectIndex, dataList, inventoryItemList]
    }
    //button 装备或者脱下
    use() {
        //未选中或者为空直接返回
        if (this.currentSelectIndex == -1) {
            return
        }
        //装备栏卸下,先放背包，放不下放打开的储物箱
        if (this.takeOffEquip(false, false)) {
            return
        }
        //物品栏卸下,先放背包，放不下放打开的储物箱
        if (this.takeOffItem(false, false)) {
            return
        }
        //背包和储物箱物品装备
        this.takeOnEquipOrItem(this.getSelectInfo())
    }

    //button 放下 存取
    drop() {
        //未选中或者为空直接返回
        if (this.currentSelectIndex == -1) {
            return
        }
        //装备栏直接放下，如果是储物箱则是存入
        if (this.takeOffEquip(true, false)) {
            return
        }
        //物品栏直接放下，如果是储物箱则是存入
        if (this.takeOffItem(true, false)) {
            return
        }
        //背包放下
        let isOther = this.currentSelectIndex >= InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM
        this.dropEquipOrItem(this.getSelectInfo(), isOther, false)
    }
    //button 出售
    sale() {
        //未选中或者为空直接返回
        if (this.currentSelectIndex == -1) {
            return
        }
        //装备栏直接售出
        if (this.takeOffEquip(false, true)) {
            return
        }
        //物品栏直接售出
        if (this.takeOffItem(false, true)) {
            return
        }
        //背包售出
        let isOther = this.currentSelectIndex >= InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM
        this.dropEquipOrItem(this.getSelectInfo(), isOther, true)
    }
    // update (dt) {}

    close() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.dismiss()
    }
    /**重铸强化升级装备 */
    private castUpgradeStrengthenEquip(operatorType: number) {
        let isSelectEquip = this.currentSelectIndex >= InventoryManager.MAX_BAG && this.currentSelectIndex < InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP
        let current: InventoryItem
        let currentData: InventoryData
        if (isSelectEquip) {
            current = this.equipList[this.currentSelectIndex - InventoryManager.MAX_BAG]
            if (current.data.type == InventoryItem.TYPE_EMPTY) {
                return
            }
        } else {
            let [selectIndex, dataList, inventoryItemList] = this.getSelectInfo()

            if (this.currentSelectIndex == -1) {
                return
            }
            current = inventoryItemList[selectIndex]
            currentData = dataList[selectIndex]
        }
        AudioPlayer.play(AudioPlayer.STRIKEIRON)
        if (current.data.type == InventoryItem.TYPE_EQUIP) {
            //佩戴装备
            let equipData = new EquipmentData()
            equipData.valueCopy(current.data.equipmentData)
            if (equipData.equipmetType != InventoryManager.EMPTY) {
                let rand4save = Logic.mapManager.getCurrentRoomRandom4Save(MapManager.RANDOM_EQUIP)
                let msg = ''
                let price = 0
                let affix = equipData.affixs[this.currentAffixSelectIndex]
                //词缀重铸的金币消耗是词缀强度*100，强化的消耗是强度*1000，装备升级的消耗是装备等级*100
                switch (operatorType) {
                    case InventoryDialog.OPERATOR_CAST:
                        price = 1000 * (affix.index + 1)
                        msg = `当前拥有${Logic.coins}金币\n是否花费${price}金币重铸该词缀`
                        break
                    case InventoryDialog.OPERATOR_STRENGTHEN:
                        price = 1000 * (affix.index + 1)
                        msg = `当前拥有${Logic.coins}金币\n是否花费${price}金币强化该词缀`
                        if (affix.index >= 9) {
                            Utils.toast('强化等级已经最高', true, true)
                            return
                        }
                        break
                    case InventoryDialog.OPERATOR_UPGRADE:
                        price = (equipData.requireLevel + 1) * 1000
                        msg = `当前拥有${Logic.coins}金币\n是否花费${price}金币升级该装备`
                        if (equipData.requireLevel >= Logic.playerData.OilGoldData.level) {
                            Utils.toast('装备等级无法高于人物等级', true, true)
                            return
                        }
                        break
                }
                GameAlertDialog.show(msg, '确定', '取消', (flag: boolean) => {
                    if (flag) {
                        if (Logic.coins < price) {
                            Utils.toast('金币不足', true, true)
                            return
                        }
                        EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: -price })
                        let arr = [AudioPlayer.COIN, AudioPlayer.COIN1, AudioPlayer.COIN2]
                        AudioPlayer.play(arr[Logic.getRandomNum(0, arr.length - 1)])
                        switch (operatorType) {
                            case InventoryDialog.OPERATOR_CAST:
                                AffixManager.recastEquipmentAffixs(equipData, this.currentAffixSelectIndex, rand4save)
                                break
                            case InventoryDialog.OPERATOR_STRENGTHEN:
                                AffixManager.strengthenEquipmentAffixs(equipData, this.currentAffixSelectIndex)
                                break
                            case InventoryDialog.OPERATOR_UPGRADE:
                                EquipmentManager.upgradeEquipment(equipData)
                                break
                        }
                        this.updateSelectChangeEquipInfo(isSelectEquip, equipData, current, currentData)
                        AudioPlayer.play(AudioPlayer.STRIKEIRON)
                        this.scheduleOnce(() => {
                            AudioPlayer.play(AudioPlayer.STRIKEIRON)
                            this.scheduleOnce(() => {
                                AudioPlayer.play(AudioPlayer.STRIKEIRON1)
                                this.scheduleOnce(() => {
                                    AudioPlayer.play(AudioPlayer.STRIKEIRON)
                                }, 0.2)
                            }, 0.2)
                        }, 0.1)
                    }
                })
            }
        }
    }
    private updateSelectChangeEquipInfo(isSelectEquip: boolean, equipmentData: EquipmentData, inventoryItem: InventoryItem, inventoryData: InventoryData) {
        if (isSelectEquip) {
            //装备栏更新ui
            inventoryItem.data.equipmentData.valueCopy(equipmentData)
            Logic.inventoryMgr.equips[equipmentData.equipmetType].valueCopy(equipmentData)
            EventHelper.emit(EventHelper.PLAYER_EQUIPMENT_REFRESH, { equipmetType: equipmentData.equipmetType })
        } else {
            inventoryItem.data.equipmentData = equipmentData.clone()
            inventoryData.equipmentData = equipmentData.clone()
        }
        this.equipmentAndItemDialog.showDialogEquipInfo(equipmentData)
        this.showCastInfo(equipmentData)
        this.selectCastAffix(this.currentAffixSelectIndex)
    }
    private initCastLayout() {
        for (let i = 0; i < this.layoutCast.children.length; i++) {
            let affix = this.layoutCast.children[i]
            affix.on(
                cc.Node.EventType.TOUCH_END,
                (event: cc.Event.EventTouch) => {
                    AudioPlayer.play(AudioPlayer.SELECT)
                    this.selectCastAffix(i)
                },
                this
            )
        }
    }
    private selectCastAffix(index: number) {
        this.currentAffixSelectIndex = index
        for (let i = 0; i < this.layoutCast.children.length; i++) {
            let affix = this.layoutCast.children[i]
            if (index == i) {
                affix.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes('itemselect')
                this.castButton.active = true
                this.strengthenButton.active = true
            } else {
                affix.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes('dialogbggray')
            }
        }
    }

    private showCastInfo(data: EquipmentData) {
        for (let affix of this.layoutCast.children) {
            affix.active = false
            affix.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes('dialogbggray')
            affix.getChildByName('label').getComponent(cc.Label).string = ''
        }
        for (let i = 0; i < data.affixs.length; i++) {
            this.layoutCast.children[i].active = true
            let affix = data.affixs[i]
            this.layoutCast.children[i].getChildByName('label').getComponent(cc.Label).string = `Lv.${affix.index == 9 ? 'MAX' : affix.index} ${affix.desc}`
        }
        this.upgradeButton.active = data.requireLevel < Logic.playerData.OilGoldData.level
        this.layoutCast.active = true
    }
    private hideCastInfo() {
        this.castButton.active = false
        this.upgradeButton.active = false
        this.strengthenButton.active = false
        this.layoutCast.active = false
        this.currentAffixSelectIndex = -1
    }
    //button重铸
    clickCast() {
        this.castUpgradeStrengthenEquip(InventoryDialog.OPERATOR_CAST)
    }

    //button强化
    clickStrengthen() {
        this.castUpgradeStrengthenEquip(InventoryDialog.OPERATOR_STRENGTHEN)
    }

    //button升级
    clickUpgrade() {
        this.castUpgradeStrengthenEquip(InventoryDialog.OPERATOR_UPGRADE)
    }
}
