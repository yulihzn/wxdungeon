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
import { EventHelper } from './EventHelper'
import Logic from './Logic'
import EquipmentData from '../data/EquipmentData'
import InventoryManager from '../manager/InventoryManager'
import Dungeon from './Dungeon'
import FromData from '../data/FromData'
import ItemData from '../data/ItemData'
import Item from '../item/Item'
import SuitData from '../data/SuitData'
import EquipmentAndItemDialog from '../ui/dialog/EquipmentAndItemDialog'
import LocalStorage from '../utils/LocalStorage'
import Utils from '../utils/Utils'
import InventoryDialog from '../ui/dialog/InventoryDialog'
import TriggerData from '../data/TriggerData'
@ccclass
export default class Inventory extends cc.Component {
    @property(Dungeon)
    dungeon: Dungeon = null
    @property(cc.Sprite)
    weapon: cc.Sprite = null
    @property(cc.Sprite)
    remote: cc.Sprite = null
    @property(cc.Sprite)
    shield: cc.Sprite = null
    @property(cc.Sprite)
    helmet: cc.Sprite = null
    @property(cc.Sprite)
    clothes: cc.Sprite = null
    @property(cc.Sprite)
    trousers: cc.Sprite = null
    @property(cc.Sprite)
    gloves: cc.Sprite = null
    @property(cc.Sprite)
    shoes: cc.Sprite = null
    @property(cc.Sprite)
    cloak: cc.Sprite = null
    @property(cc.Sprite)
    itemsprite1: cc.Sprite = null
    @property(cc.Sprite)
    itemsprite2: cc.Sprite = null
    @property(cc.Sprite)
    itemsprite3: cc.Sprite = null
    @property(cc.Sprite)
    itemsprite4: cc.Sprite = null
    @property(cc.Sprite)
    itemsprite5: cc.Sprite = null
    @property(cc.Sprite)
    itemsprite6: cc.Sprite = null
    @property(cc.Label)
    itemlabel1: cc.Label = null
    @property(cc.Label)
    itemlabel2: cc.Label = null
    @property(cc.Label)
    itemlabel3: cc.Label = null
    @property(cc.Label)
    itemlabel4: cc.Label = null
    @property(cc.Label)
    itemlabel5: cc.Label = null
    @property(cc.Label)
    itemlabel6: cc.Label = null
    @property(cc.Prefab)
    equipmentAndItemDialogPrefab: cc.Prefab = null
    @property(cc.Camera)
    mainCamera: cc.Camera = null
    @property(cc.Node)
    equipmentNode: cc.Node = null
    @property(cc.Node)
    dialogNode: cc.Node = null
    equipmentAndItemDialog: EquipmentAndItemDialog = null
    equipmentGroundDialog: EquipmentAndItemDialog = null
    itemGroundDialog: EquipmentAndItemDialog = null

    inventoryManager: InventoryManager
    graphics: cc.Graphics = null

    equipAndItemTimeDelays: Map<string, number> = new Map()
    equipSprites: Map<string, cc.Sprite> = new Map()
    equipCovers: Map<string, cc.Node> = new Map()

    itemPositions: cc.Vec3[] = []
    itemCovers: cc.Node[] = []

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.equipmentNode.active = Logic.settings.showEquipDialog
        this.equipmentGroundDialog = this.initDialog(true)
        this.itemGroundDialog = this.initDialog(true)
        this.equipmentAndItemDialog = this.initDialog(false)
        this.graphics = this.getComponent(cc.Graphics)
        this.inventoryManager = Logic.inventoryManager
        EventHelper.on(EventHelper.PLAYER_CHANGEEQUIPMENT, detail => {
            if (this.node) {
                this.refreshEquipment(detail.equipmetType, detail.equipData, false, detail.isReplace)
                this.refreshSuits()
                Logic.inventoryManager.updateTotalEquipData()
            }
        })
        EventHelper.on(EventHelper.PLAYER_EQUIPMENT_REFRESH, detail => {
            if (this.node) {
                this.refreshEquipmentRes(detail.equipmetType)
                this.refreshSuits()
                Logic.inventoryManager.updateTotalEquipData()
            }
        })
        EventHelper.on(EventHelper.PLAYER_ITEM_REFRESH, detail => {
            if (this.node) {
                this.refreshItemRes()
            }
        })
        if (this.equipmentGroundDialog) {
            this.equipmentGroundDialog.hideDialog()
        }
        if (this.itemGroundDialog) {
            this.itemGroundDialog.hideDialog()
        }
        EventHelper.on(EventHelper.PLAYER_CHANGEITEM, detail => {
            if (this.node) {
                this.refreshItem(detail.itemData, detail.isReplace)
            }
        })
        EventHelper.on(EventHelper.HUD_GROUND_EQUIPMENT_INFO_SHOW, detail => {
            if (this.equipmentGroundDialog) {
                let worldPos = detail.worldPos
                let pos = this.node.convertToNodeSpaceAR(worldPos)
                this.equipmentGroundDialog.showDialog(pos.sub(this.mainCamera.node.position), null, detail.itemData, detail.equipData, null)
            }
        })
        EventHelper.on(EventHelper.HUD_GROUND_EQUIPMENT_INFO_HIDE, detail => {
            if (this.equipmentGroundDialog) {
                this.equipmentGroundDialog.hideDialog()
            }
        })
        EventHelper.on(EventHelper.HUD_GROUND_ITEM_INFO_SHOW, detail => {
            if (this.itemGroundDialog) {
                let worldPos: cc.Vec3 = detail.worldPos
                let pos = this.node.convertToNodeSpaceAR(worldPos)
                this.itemGroundDialog.showDialog(pos.sub(this.mainCamera.node.position), null, detail.itemData, null, null)
            }
        })
        EventHelper.on(EventHelper.HUD_GROUND_ITEM_INFO_HIDE, detail => {
            if (this.itemGroundDialog) {
                this.itemGroundDialog.hideDialog()
            }
        })
        EventHelper.on(EventHelper.USEITEM_KEYBOARD, detail => {
            this.userItem(detail.index)
        })
        EventHelper.on(EventHelper.HUD_FADE_IN, detail => {
            this.fadeIn()
        })
        EventHelper.on(EventHelper.HUD_FADE_OUT, detail => {
            this.fadeOut()
        })
        this.remote.node.parent.active = true
        this.shield.node.parent.active = false
        for (let name of InventoryManager.EQUIP_TAGS) {
            this.equipAndItemTimeDelays.set(name, 0)
        }
        this.equipSprites.set(InventoryManager.WEAPON, this.weapon)
        this.equipSprites.set(InventoryManager.REMOTE, this.remote)
        this.equipSprites.set(InventoryManager.SHIELD, this.shield)
        this.equipSprites.set(InventoryManager.HELMET, this.helmet)
        this.equipSprites.set(InventoryManager.CLOTHES, this.clothes)
        this.equipSprites.set(InventoryManager.TROUSERS, this.trousers)
        this.equipSprites.set(InventoryManager.GLOVES, this.gloves)
        this.equipSprites.set(InventoryManager.SHOES, this.shoes)
        this.equipSprites.set(InventoryManager.CLOAK, this.cloak)
    }
    private initDialog(isGround: boolean) {
        let node = cc.instantiate(this.equipmentAndItemDialogPrefab)
        node.parent = this.node
        let dialog = node.getComponent(EquipmentAndItemDialog)
        dialog.changeBgAndAnchor(isGround ? EquipmentAndItemDialog.BG_TYPE_ARROW_DOWN : EquipmentAndItemDialog.BG_TYPE_ARROW_RIGHT)
        dialog.hideDialog()
        if (!isGround) {
            node.parent = this.dialogNode
        }
        return dialog
    }

    //button
    showEquipment() {
        this.equipmentNode.active = !this.equipmentNode.active
        Logic.settings.showEquipDialog = this.equipmentNode.active
        LocalStorage.saveSystemSettings(Logic.settings)
    }
    private fadeOut() {
        if (!this.equipmentNode) {
            return
        }
        this.node.opacity = 255
        cc.tween(this.equipmentNode).to(0.5, { opacity: 0 }).start()
    }
    private fadeIn() {
        if (!this.equipmentNode) {
            return
        }
        this.node.opacity = 0
        cc.tween(this.equipmentNode).to(3, { opacity: 255 }).start()
    }
    start() {
        this.equipSprites.forEach((sprite, key) => {
            sprite.spriteFrame = null
            this.addEquipSpriteTouchEvent(sprite, key)
            this.equipCovers.set(key, sprite.node.parent.getChildByName('cover'))
        })

        for (let key in this.inventoryManager.equips) {
            this.refreshEquipment(key, this.inventoryManager.equips[key].clone(), true, false)
        }
        this.refreshItemRes()
        let itemSpriteList = [this.itemsprite1, this.itemsprite2, this.itemsprite3, this.itemsprite4, this.itemsprite5, this.itemsprite6]
        let itemLabelList = [this.itemlabel1, this.itemlabel2, this.itemlabel3, this.itemlabel4, this.itemlabel5, this.itemlabel6]
        for (let i = 0; i < itemLabelList.length; i++) {
            this.itemPositions[i] = itemSpriteList[i].node.convertToWorldSpaceAR(cc.Vec3.ZERO)
            this.addItemSpriteTouchEvent(itemSpriteList[i], itemLabelList[i].node.parent, i)
            this.itemCovers.push(itemLabelList[i].node.parent.getChildByName('cover'))
        }
        this.refreshSuits()
        Logic.inventoryManager.updateTotalEquipData()
    }

    private addEquipSpriteTouchEvent(sprite: cc.Sprite, equipmetType: string) {
        sprite.node.parent.on(cc.Node.EventType.TOUCH_START, () => {
            if (sprite.spriteFrame == null) {
                return
            }
            let equipData = new EquipmentData()
            if (this.inventoryManager.equips[equipmetType]) {
                equipData = this.inventoryManager.equips[equipmetType].clone()
            }
            if (equipData.equipmetType == InventoryManager.EMPTY) {
                return
            }
            let pos = this.node.convertToNodeSpaceAR(sprite.node.parent.convertToWorldSpaceAR(cc.Vec3.ZERO))
            this.equipmentAndItemDialog.showDialog(pos.add(cc.v3(-32, 0)), null, null, equipData, null, this.inventoryManager, EquipmentAndItemDialog.BG_TYPE_ARROW_RIGHT)
        })
        sprite.node.parent.on(cc.Node.EventType.TOUCH_END, () => {
            this.equipmentAndItemDialog.hideDialog()
        })
        sprite.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.equipmentAndItemDialog.hideDialog()
        })
    }
    private addItemSpriteTouchEvent(sprite: cc.Sprite, node: cc.Node, itemIndex: number) {
        let isLongPress = false
        let touchStart = false
        node.on(cc.Node.EventType.TOUCH_START, () => {
            if (sprite.spriteFrame == null) {
                return
            }
            touchStart = true
            this.scheduleOnce(() => {
                if (!touchStart || !this.inventoryManager || !this.inventoryManager.itemList || itemIndex > this.inventoryManager.itemList.length - 1) {
                    return
                }
                isLongPress = true
                let item = this.inventoryManager.itemList[itemIndex].clone()
                if (item.resName == Item.EMPTY) {
                    return
                }
                let pos = this.node.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.Vec3.ZERO))
                this.equipmentAndItemDialog.showDialog(pos.add(cc.v3(32, 0)), null, item, null, null, null, EquipmentAndItemDialog.BG_TYPE_ARROW_LEFT)
            }, 0.3)
        })
        node.on(cc.Node.EventType.TOUCH_END, () => {
            this.equipmentAndItemDialog.hideDialog()
            if (!isLongPress) {
                this.userItem(itemIndex)
            }
            touchStart = false
            isLongPress = false
        })
        node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.equipmentAndItemDialog.hideDialog()
            touchStart = false
            isLongPress = false
        })
    }

    refreshSuits() {
        this.inventoryManager.suitMap = {}
        this.inventoryManager.suitEquipMap = {}
        //遍历列表计算相应套装集齐数
        for (let key in this.inventoryManager.equips) {
            let equip = this.inventoryManager.equips[key]
            if (equip.suitType.length < 1) {
                continue
            }
            if (!this.inventoryManager.suitMap[equip.suitType]) {
                let data = new SuitData()
                data.valueCopy(Logic.suits[equip.suitType])
                data.count = 1
                this.inventoryManager.suitMap[equip.suitType] = data
            } else {
                this.inventoryManager.suitMap[equip.suitType].count++
            }
        }
        //遍历套装列表 添加玩家状态 生成对应装备的套装属性表
        for (let key in this.inventoryManager.suitMap) {
            let suit = this.inventoryManager.suitMap[key]
            let e = new EquipmentData()
            if (suit) {
                for (let i = 0; i < suit.count - 1; i++) {
                    if (i < suit.EquipList.length) {
                        e.add(suit.EquipList[i]) //叠加套装各种几率
                    }
                }
                this.inventoryManager.suitEquipMap[key] = e
            }
        }
    }
    private refreshEquipmentRes(equipmetType: string) {
        if (!equipmetType) {
            return
        }
        let equip = this.inventoryManager.equips[equipmetType]
        let color = cc.color(255, 255, 255).fromHEX(equip.color)
        let spriteFrame = Logic.spriteFrameRes(equip.img)
        if (equip.equipmetType == InventoryManager.CLOTHES) {
            spriteFrame = Logic.spriteFrameRes(equip.img + 'anim0')
        } else if (equip.equipmetType == InventoryManager.HELMET) {
            spriteFrame = Logic.spriteFrameRes(equip.img + 'anim0')
        } else if (equip.equipmetType == InventoryManager.REMOTE) {
            spriteFrame = Logic.spriteFrameRes(equip.img + 'anim0')
        }
        //更新贴图和颜色
        let sprite = this.equipSprites.get(equipmetType)
        if (sprite) {
            sprite.node.color = color
            sprite.spriteFrame = equip.trouserslong == 1 ? Logic.spriteFrameRes('trousers000') : spriteFrame
            if (equipmetType == InventoryManager.TROUSERS && equip.trouserslong == 1) {
                sprite.spriteFrame = Logic.spriteFrameRes('trousers000')
            }
        }
        switch (equipmetType) {
            case InventoryManager.REMOTE:
                this.remote.node.parent.active = true
                this.shield.node.parent.active = true
                //远程不为空隐藏盾牌栏
                if (this.inventoryManager.equips[equipmetType].equipmetType != InventoryManager.EMPTY) {
                    this.shield.node.parent.active = false
                }
                break
            case InventoryManager.SHIELD:
                this.remote.node.parent.active = true
                this.shield.node.parent.active = true
                //如果当前盾牌不为空隐藏远程栏并展示盾牌栏，否则显示远程隐藏盾牌栏
                if (this.inventoryManager.equips[equipmetType].equipmetType != InventoryManager.EMPTY) {
                    this.remote.node.parent.active = false
                    this.shield.node.parent.active = true
                } else {
                    this.remote.node.parent.active = true
                    this.shield.node.parent.active = false
                }
                break
        }
        //更新玩家装备贴图和状态
        if (this.dungeon && this.dungeon.player) {
            this.dungeon.player.changeEquipment(equipmetType, equip, spriteFrame)
            // if (equip.statusInterval > 0 && equip.statusName.length > 0) {
            //     this.dungeon.player.addStatus(equip.statusName, FromData.getClone(equip.nameCn, equip.img));
            // }
        }
    }

    refreshEquipment(equipmetType: string, equipDataNew: EquipmentData, isInit: boolean, isReplace: boolean) {
        if (!equipDataNew || !this.weapon || !equipmetType) {
            return
        }
        let equip = this.inventoryManager.equips[equipmetType]
        let hasEquip = equip && equip.equipmetType != InventoryManager.EMPTY
        if (!hasEquip) {
            if (equipmetType == InventoryManager.REMOTE && this.inventoryManager.equips[InventoryManager.SHIELD].equipmetType != InventoryManager.EMPTY) {
                hasEquip = true
            }
            if (equipmetType == InventoryManager.SHIELD && this.inventoryManager.equips[InventoryManager.REMOTE].equipmetType != InventoryManager.EMPTY) {
                hasEquip = true
            }
        }

        //1.如果是捡起到背包或者购买（非替换非初始化），且对应位置有装备，则直接放置到背包
        //2.如果当前装备等级高于玩家，则直接放置到背包
        if ((!isReplace && !isInit && equip && hasEquip) || equipDataNew.requireLevel > Logic.playerData.OilGoldData.level) {
            this.setEquipmentToBag(equipDataNew, isInit)
            return
        }
        //2.如果是长按的替换操作，替换新的，移出旧的到背包
        //更新当前装备数据
        if (equip) {
            this.setEquipmentToBag(equip, isInit)
            equip.valueCopy(equipDataNew)
            if (!isInit) {
                EventHelper.emit(EventHelper.HUD_INVENTORY_EQUIP_UPDATE)
            }
        }

        switch (equipmetType) {
            case InventoryManager.REMOTE:
                if (this.inventoryManager.equips[equipmetType].equipmetType != InventoryManager.EMPTY) {
                    //替换盾牌到背包
                    this.setEquipmentToBag(this.inventoryManager.equips[InventoryManager.SHIELD], isInit)
                    //清空盾牌数据
                    this.inventoryManager.equips[InventoryManager.SHIELD].valueCopy(new EquipmentData())
                    this.refreshEquipmentRes(InventoryManager.SHIELD)
                }
                break
            case InventoryManager.SHIELD:
                //如果当前盾牌不为空清空远程并展示盾牌栏，否则显示远程隐藏盾牌栏
                if (this.inventoryManager.equips[equipmetType].equipmetType != InventoryManager.EMPTY) {
                    //替换远程到背包
                    this.setEquipmentToBag(this.inventoryManager.equips[InventoryManager.REMOTE], isInit)
                    this.inventoryManager.equips[InventoryManager.REMOTE].valueCopy(new EquipmentData())
                    this.refreshEquipmentRes(InventoryManager.REMOTE)
                }
                break
        }
        this.refreshEquipmentRes(equipmetType)
    }

    // addPlayerStatus(equipmentData: EquipmentData) {
    //     if (!this.dungeon || !this.dungeon.player) {
    //         return;
    //     }
    //     if (equipmentData.statusInterval > 0 && equipmentData.statusName.length > 0) {
    //         this.dungeon.player.addStatus(equipmentData.statusName, FromData.getClone(equipmentData.nameCn, equipmentData.img));
    //     }
    // }
    getTimeDelay(timeDelay: number, interval: number, dt: number): number {
        if (!timeDelay) {
            timeDelay = 0
        }
        timeDelay += dt
        if (timeDelay > interval) {
            timeDelay = 0
            return timeDelay
        }
        return timeDelay
    }
    isTimeDelay(dt: number, key: string, interval: number): boolean {
        if (interval <= 0) {
            return false
        }
        let timeDelay = -1
        this.equipAndItemTimeDelays.set(key, this.getTimeDelay(this.equipAndItemTimeDelays.get(key), interval, dt))
        timeDelay = this.equipAndItemTimeDelays.get(key)
        return timeDelay == 0
    }
    update(dt) {
        if (!Logic.isGamePause) {
            let totalData = this.inventoryManager.TotalEquipData
            for (let d of totalData.exTriggers) {
                if (this.isTimeDelay(dt, d.uuid, d.autoInterval)) {
                    if (this.dungeon && this.dungeon.player) {
                        this.dungeon.player.exTriggerDo(d, TriggerData.GROUP_AUTO, TriggerData.TYPE_AUTO, FromData.getClone(totalData.nameCn, totalData.img), null)
                    }
                }
            }
            let currentTime = Date.now()
            this.equipCovers.forEach((node, key) => {
                let data = this.inventoryManager.equips[key]
                if (data) {
                    let percent = (currentTime - data.lastTime) / (data.cooldown * 1000) //当前百分比
                    if (percent > 1) {
                        percent = 1
                    }
                    node.height = node.width * (1 - percent)
                }
            })
            for (let key in this.equipCovers) {
                let data = this.inventoryManager.equips[key]
                if (data) {
                    let percent = (currentTime - data.lastTime) / (data.cooldown * 1000) //当前百分比
                    if (percent > 1) {
                        percent = 1
                    }
                    this.equipCovers.get(key).height = this.equipCovers.get(key).width * (1 - percent)
                }
            }
            for (let i = 0; i < this.inventoryManager.itemList.length; i++) {
                let data = this.inventoryManager.itemList[i]
                for (let d of data.exTriggers) {
                    if (this.isTimeDelay(dt, `itemIndex${i}`, d.autoInterval)) {
                        if (this.dungeon && this.dungeon.player) {
                            this.dungeon.player.exTriggerDo(d, TriggerData.GROUP_AUTO, TriggerData.TYPE_AUTO, FromData.getClone(data.nameCn, data.resName), null)
                        }
                    }
                }
                let percent = (currentTime - data.lastTime) / (data.cooldown * 1000) //当前百分比
                if (percent > 1) {
                    percent = 1
                }
                this.itemCovers[i].height = this.itemCovers[i].width * (1 - percent)
            }
        }
    }

    userItem(itemIndex: number) {
        if (!this.inventoryManager || !this.inventoryManager.itemList || itemIndex > this.inventoryManager.itemList.length - 1) {
            return
        }
        let item = this.inventoryManager.itemList[itemIndex].clone()
        if (item.resName == Item.EMPTY) {
            return
        }
        if (!this.dungeon.player.canEatOrDrink(item)) {
            return
        }
        let currentTime = Date.now()
        if (currentTime - item.lastTime > item.cooldown * 1000) {
            item.lastTime = currentTime
            if (item.count != -1) {
                item.count--
            }
            if (item.count <= 0 && item.count != -1) {
                this.inventoryManager.itemList[itemIndex].valueCopy(Logic.items[Item.EMPTY])
            } else {
                this.inventoryManager.itemList[itemIndex].valueCopy(item)
            }
            this.refreshItemRes()
            if (item.resName != Item.EMPTY) {
                EventHelper.emit(EventHelper.PLAYER_USEITEM, { itemData: item })
            }
        }
    }

    refreshItem(itemDataNew: ItemData, isReplace: boolean) {
        if (!this.node) {
            return
        }

        let isRefreshed = false

        //填补相同可叠加
        for (let i = 0; i < this.inventoryManager.itemList.length; i++) {
            let item = this.inventoryManager.itemList[i]
            if (InventoryManager.isItemEqualCanAdd(item, itemDataNew)) {
                let count = item.count + itemDataNew.count
                item.valueCopy(itemDataNew)
                item.count = count
                isRefreshed = true
                break
            }
        }
        //填补空缺位置
        if (!isRefreshed) {
            for (let i = 0; i < this.inventoryManager.itemList.length; i++) {
                let item = this.inventoryManager.itemList[i]
                if (item.resName == Item.EMPTY) {
                    item.valueCopy(itemDataNew)
                    isRefreshed = true
                    break
                }
            }
        }
        //列表已满
        if (!isRefreshed) {
            if (isReplace) {
                //1.如果是长按或者来自背包装备的替换操作，移出第一个到背包，新的放在末尾
                let item0 = this.inventoryManager.itemList[0].clone()
                let arr = new Array()
                for (let i = 1; i < this.inventoryManager.itemList.length; i++) {
                    arr.push(this.inventoryManager.itemList[i])
                }
                arr.push(itemDataNew)
                for (let i = 0; i < this.inventoryManager.itemList.length; i++) {
                    this.inventoryManager.itemList[i].valueCopy(arr[i])
                }
                this.setItemToBag(item0)
            } else {
                //2.如果是捡起到背包或者购买，直接放置到背包
                this.setItemToBag(itemDataNew)
            }
        }
        this.refreshItemRes()
    }
    private refreshItemRes() {
        let itemSpriteList = [this.itemsprite1, this.itemsprite2, this.itemsprite3, this.itemsprite4, this.itemsprite5, this.itemsprite6]
        let itemLabelList = [this.itemlabel1, this.itemlabel2, this.itemlabel3, this.itemlabel4, this.itemlabel5, this.itemlabel6]
        for (let i = 0; i < itemSpriteList.length; i++) {
            let item = this.inventoryManager.itemList[i]
            itemSpriteList[i].spriteFrame = Logic.spriteFrameRes(item.resName)
            itemLabelList[i].string = `${item.count > 0 ? 'x' + item.count : ''}`
        }
    }
    private setEquipmentToBag(equipData: EquipmentData, isInit: boolean) {
        //来自初始化或者空装备直接返回
        if (isInit || equipData.equipmetType == InventoryManager.EMPTY) {
            return
        }
        let list = Logic.inventoryManager.inventoryList
        let data = InventoryManager.buildEquipInventoryData(equipData)
        //添加到背包
        let isAdded = InventoryDialog.addEquipOrItemToBag(data, list, InventoryManager.MAX_BAG, false, null)
        if (!isAdded) {
            Utils.toast('物品栏已满！')
            EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { res: equipData.img, equipmentData: equipData })
        }
    }
    private setItemToBag(itemData: ItemData) {
        let list = Logic.inventoryManager.inventoryList
        let data = InventoryManager.buildItemInventoryData(itemData)
        //添加到背包
        let isAdded = InventoryDialog.addEquipOrItemToBag(data, list, InventoryManager.MAX_BAG, true, null)
        if (!isAdded) {
            Utils.toast('物品栏已满！')
            EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM, { res: itemData.resName, count: itemData.count })
        }
    }
}
