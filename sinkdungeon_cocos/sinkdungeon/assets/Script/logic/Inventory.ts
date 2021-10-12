// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import { EventHelper } from './EventHelper';
import Logic from './Logic';
import EquipmentData from '../data/EquipmentData';
import InventoryManager from '../manager/InventoryManager';
import Dungeon from './Dungeon';
import FromData from '../data/FromData';
import ItemData from '../data/ItemData';
import Item from '../item/Item';
import SuitData from '../data/SuitData';
import InventoryData from '../data/InventoryData';
import InventoryItem from '../ui/InventoryItem';
import EquipmentAndItemDialog from '../ui/dialog/EquipmentAndItemDialog';
import LocalStorage from '../utils/LocalStorage';
@ccclass
export default class Inventory extends cc.Component {

    @property(Dungeon)
    dungeon: Dungeon = null;
    @property(cc.Sprite)
    weapon: cc.Sprite = null;
    @property(cc.Sprite)
    remote: cc.Sprite = null;
    @property(cc.Sprite)
    shield: cc.Sprite = null;
    @property(cc.Sprite)
    helmet: cc.Sprite = null;
    @property(cc.Sprite)
    clothes: cc.Sprite = null;
    @property(cc.Sprite)
    trousers: cc.Sprite = null;
    @property(cc.Sprite)
    gloves: cc.Sprite = null;
    @property(cc.Sprite)
    shoes: cc.Sprite = null;
    @property(cc.Sprite)
    cloak: cc.Sprite = null;
    @property(cc.Sprite)
    itemsprite1: cc.Sprite = null;
    @property(cc.Sprite)
    itemsprite2: cc.Sprite = null;
    @property(cc.Sprite)
    itemsprite3: cc.Sprite = null;
    @property(cc.Sprite)
    itemsprite4: cc.Sprite = null;
    @property(cc.Sprite)
    itemsprite5: cc.Sprite = null;
    @property(cc.Label)
    itemlabel1: cc.Label = null;
    @property(cc.Label)
    itemlabel2: cc.Label = null;
    @property(cc.Label)
    itemlabel3: cc.Label = null;
    @property(cc.Label)
    itemlabel4: cc.Label = null;
    @property(cc.Label)
    itemlabel5: cc.Label = null;

    @property(cc.Prefab)
    equipmentAndItemDialogPrefab:cc.Prefab = null;
    @property(cc.Camera)
    mainCamera:cc.Camera = null;
    @property(cc.Node)
    equipmentNode:cc.Node = null;
    @property(cc.Node)
    dialogNode:cc.Node = null;
    equipmentAndItemDialog: EquipmentAndItemDialog = null;
    equipmentGroundDialog: EquipmentAndItemDialog = null;
    itemGroundDialog: EquipmentAndItemDialog = null;

    inventoryManager: InventoryManager;
    graphics: cc.Graphics = null;

    suitTimeDelay = 0;

    equipTimeDelays: { [key: string]: number } = {};
    equipSprites: { [key: string]: cc.Sprite } = {};

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.equipmentNode.active = Logic.settings.showEquipDialog;
        this.equipmentGroundDialog=this.initDialog(true);
        this.itemGroundDialog=this.initDialog(true);
        this.equipmentAndItemDialog=this.initDialog(false);
        this.graphics = this.getComponent(cc.Graphics);
        this.inventoryManager = Logic.inventoryManager;
        cc.director.on(EventHelper.PLAYER_CHANGEEQUIPMENT
            , (event) => {
                if (this.node) {
                    this.refreshEquipment(event.detail.equipData, false, event.detail.isReplace, event.detail.index);
                    this.refreshSuits();
                }
            });
        if (this.equipmentGroundDialog) { this.equipmentGroundDialog.hideDialog(); }
        if (this.itemGroundDialog) { this.itemGroundDialog.hideDialog(); }
        EventHelper.on(EventHelper.PLAYER_CHANGEITEM
            , (detail) => {
                if (this.node) {
                    this.refreshItem(detail.itemData, detail.isReplace, detail.index);
                }
            });
        EventHelper.on(EventHelper.HUD_GROUND_EQUIPMENT_INFO_SHOW
            , (detail) => {
                if (this.equipmentGroundDialog) {
                    let worldPos = detail.worldPos;
                    let pos = this.node.convertToNodeSpaceAR(worldPos);
                    this.equipmentGroundDialog.showDialog(pos.sub(this.mainCamera.node.position),null,detail.itemData,detail.equipData,null);
                }
            });
        EventHelper.on(EventHelper.HUD_GROUND_EQUIPMENT_INFO_HIDE
            , (detail) => {
                if (this.equipmentGroundDialog) {
                    this.equipmentGroundDialog.hideDialog();
                }
            });
        EventHelper.on(EventHelper.HUD_GROUND_ITEM_INFO_SHOW
            , (detail) => {
                if (this.itemGroundDialog) {
                    let worldPos:cc.Vec3 = detail.worldPos;
                    let pos = this.node.convertToNodeSpaceAR(worldPos);
                    this.itemGroundDialog.showDialog(pos.sub(this.mainCamera.node.position),null,detail.itemData,null,null);
                }
            });
        EventHelper.on(EventHelper.HUD_GROUND_ITEM_INFO_HIDE
            , (detail) => {
                if (this.itemGroundDialog) {
                    this.itemGroundDialog.hideDialog();
                }
            });
        EventHelper.on(EventHelper.USEITEM_KEYBOARD, (detail) => {
            this.userItem(null, detail.index);
        });
        this.remote.node.parent.active = true;
        this.shield.node.parent.active = false;
        for (let name of InventoryManager.EQUIP_TAGS) {
            this.equipTimeDelays[name] = 0;
        }
        this.equipSprites[InventoryManager.WEAPON] = this.weapon;
        this.equipSprites[InventoryManager.REMOTE] = this.remote;
        this.equipSprites[InventoryManager.SHIELD] = this.shield;
        this.equipSprites[InventoryManager.HELMET] = this.helmet;
        this.equipSprites[InventoryManager.CLOTHES] = this.clothes;
        this.equipSprites[InventoryManager.TROUSERS] = this.trousers;
        this.equipSprites[InventoryManager.GLOVES] = this.gloves;
        this.equipSprites[InventoryManager.SHOES] = this.shoes;
        this.equipSprites[InventoryManager.CLOAK] = this.cloak;
    }
    private initDialog(isGround:boolean){
        let node = cc.instantiate(this.equipmentAndItemDialogPrefab);
        node.parent = this.node;
        let dialog = node.getComponent(EquipmentAndItemDialog);
        dialog.changeBgAndAnchor(isGround?EquipmentAndItemDialog.BG_TYPE_ARROW_DOWN:EquipmentAndItemDialog.BG_TYPE_ARROW_RIGHT);
        dialog.hideDialog();
        if(!isGround){
            node.parent = this.dialogNode;
        }
        return dialog;
    }

    //button
    showEquipment(){
        this.equipmentNode.active = !this.equipmentNode.active;
        Logic.settings.showEquipDialog = this.equipmentNode.active;
        LocalStorage.saveSwitch(LocalStorage.KEY_SWITCH_SHOW_EQUIPDIALOG,Logic.settings.showEquipDialog);
    }
    start() {
        for (let key in this.equipSprites) {
            this.equipSprites[key].spriteFrame = null;
            this.addEquipSpriteTouchEvent(this.equipSprites[key], key);
        }
        for (let key in this.inventoryManager.equips) {
            this.refreshEquipment(this.inventoryManager.equips[key], true);
        }
        this.refreshItemRes();
        let itemSpriteList = [this.itemsprite1, this.itemsprite2, this.itemsprite3, this.itemsprite4, this.itemsprite5];
        let itemLabelList = [this.itemlabel1, this.itemlabel2, this.itemlabel3, this.itemlabel4, this.itemlabel5];
        for (let i = 0; i < itemLabelList.length; i++) {
            this.addItemSpriteTouchEvent(itemSpriteList[i],itemLabelList[i].node.parent, i);
        }
        this.refreshSuits();
    }

    private addEquipSpriteTouchEvent(sprite: cc.Sprite, equipmetType: string) {
        sprite.node.parent.on(cc.Node.EventType.TOUCH_START, () => {
            if (sprite.spriteFrame == null) {
                return;
            }
            let equipData = new EquipmentData();
            if (this.inventoryManager.equips[equipmetType]) {
                equipData = this.inventoryManager.equips[equipmetType].clone();
            }
            let pos = this.node.convertToNodeSpaceAR(sprite.node.parent.convertToWorldSpaceAR(cc.Vec3.ZERO));
            this.equipmentAndItemDialog.showDialog(pos.add(cc.v3(-32,0)),null,null,equipData,null, this.inventoryManager,EquipmentAndItemDialog.BG_TYPE_ARROW_RIGHT);
        })
        sprite.node.parent.on(cc.Node.EventType.TOUCH_END, () => {
            this.equipmentAndItemDialog.hideDialog();
        })
        sprite.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.equipmentAndItemDialog.hideDialog();
        })
    }
    private addItemSpriteTouchEvent(sprite: cc.Sprite, node:cc.Node,itemIndex: number) {
        let isLongPress = false;
        let touchStart = false;
        node.on(cc.Node.EventType.TOUCH_START, () => {
            if (sprite.spriteFrame == null) {
                return;
            }
            touchStart = true;
            this.scheduleOnce(() => {
                if (!touchStart || !this.inventoryManager || !this.inventoryManager.itemList || itemIndex > this.inventoryManager.itemList.length - 1) {
                    return;
                }
                isLongPress = true;
                let item = this.inventoryManager.itemList[itemIndex].clone();
                if (item.resName == Item.EMPTY) {
                    return;
                }
                let pos = this.node.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.Vec3.ZERO));
                this.equipmentAndItemDialog.showDialog(pos.add(cc.v3(-32,0)),null,item,null,null,null,EquipmentAndItemDialog.BG_TYPE_ARROW_LEFT);
            }, 0.3)

        })
        node.on(cc.Node.EventType.TOUCH_END, () => {
            this.equipmentAndItemDialog.hideDialog();
            if (!isLongPress) {
                this.userItem(sprite.node, itemIndex);
            }
            touchStart = false;
            isLongPress = false;
        })
        node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.equipmentAndItemDialog.hideDialog();
            touchStart = false;
            isLongPress = false;
        })
    }
    private setItemToBag(itemData: ItemData, indexFromBag: number) {
        let list = Logic.inventoryManager.inventoryList;
        //可插入的下标,默认为列表末尾，如果已满为-1，遍历选中第一个空位
        let insertIndex = list.length < InventoryManager.INVENTORY_MAX ? list.length : -1;
        let isFromBag = indexFromBag && indexFromBag > -1 && indexFromBag < list.length;
        //遍历相同物品，如果有+1,如果是来自背包交换通知背包刷新
        for (let i = list.length - 1; i >= 0; i--) {
            let idata = list[i];
            if (idata.type == InventoryItem.TYPE_EMPTY) {
                insertIndex = i;
            } else if (idata.type == InventoryItem.TYPE_ITEM && this.isItemEqualCanAdd(idata.itemData, itemData)) {
                let count = idata.itemData.count + itemData.count;
                idata.itemData = new ItemData();
                idata.itemData.valueCopy(itemData);
                idata.itemData.count = count;
                idata.price = idata.itemData.price;
                if (isFromBag) {
                    EventHelper.emit(EventHelper.HUD_INVENTORY_ITEM_UPDATE, { index: indexFromBag });
                }
                return;
            }
        }
        let newdata = new InventoryData();
        newdata.itemData = new ItemData();
        newdata.itemData.valueCopy(itemData);
        newdata.type = InventoryItem.TYPE_ITEM;
        newdata.createTime = new Date().getTime();
        newdata.id = newdata.itemData.id;
        //如果是来自背包交换，填补交换下标的数据并通知背包刷新指定数据
        if (isFromBag) {
            list[indexFromBag] = new InventoryData();
            list[indexFromBag].valueCopy(newdata);
            EventHelper.emit(EventHelper.HUD_INVENTORY_ITEM_UPDATE, { index: indexFromBag });
        } else {
            //如果是拾取或者购买，判断插入下标是否为-1，如果为-1放在地上，否则添加到背包并通知背包全局刷新
            if (insertIndex == -1) {
                let p = this.dungeon.player.node.position.clone();
                if (itemData.resName != Item.EMPTY) {
                    EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM, { pos: p, res: itemData.resName, count: itemData.count });
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
    private setEquipmentToBag(equipmentData: EquipmentData, isInit: boolean, indexFromBag?: number) {
        //来自初始化或者空装备直接返回
        if (isInit || equipmentData.equipmetType == InventoryManager.EMPTY) {
            return;
        }
        let list = Logic.inventoryManager.inventoryList;
        //可插入的下标,默认为列表末尾，如果已满为-1，遍历选中第一个空位
        let insertIndex = list.length < InventoryManager.INVENTORY_MAX ? list.length : -1;
        let isFromBag = indexFromBag && indexFromBag > -1 && indexFromBag < list.length;
        //遍历选中第一个空位
        for (let i = 0; i < list.length; i++) {
            let idata = list[i];
            if (idata.type == InventoryItem.TYPE_EMPTY) {
                insertIndex = i;
                break;
            }
        }
        let newdata = new InventoryData();
        newdata.equipmentData = new EquipmentData();
        newdata.equipmentData.valueCopy(equipmentData);
        newdata.type = InventoryItem.TYPE_EQUIP;
        newdata.price = newdata.equipmentData.price;
        newdata.createTime = new Date().getTime();
        newdata.id = newdata.equipmentData.id;
        //如果是来自背包交换，填补交换下标的数据并通知背包刷新指定数据
        if (isFromBag) {
            list[indexFromBag] = new InventoryData();
            list[indexFromBag].valueCopy(newdata);
            EventHelper.emit(EventHelper.HUD_INVENTORY_ITEM_UPDATE, { index: indexFromBag });
        } else {
            //如果是拾取或者购买，判断插入下标是否为-1，如果为-1放在地上，否则添加到背包并通知背包全局刷新
            if (insertIndex == -1) {
                let p = this.dungeon.player.node.position.clone();
                if (equipmentData.equipmetType != InventoryManager.EMPTY) {
                    EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { pos: p, res: equipmentData.img, equipmentData: equipmentData });
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
    refreshSuits() {
        this.inventoryManager.suitMap = {};
        this.inventoryManager.suitEquipMap = {};
        //遍历列表计算相应套装集齐数
        for (let key in this.inventoryManager.equips) {
            let equip = this.inventoryManager.equips[key];
            if (equip.suitType.length < 1) {
                continue;
            }
            if (!this.inventoryManager.suitMap[equip.suitType]) {
                let data = new SuitData();
                data.valueCopy(Logic.suits[equip.suitType]);
                data.count = 1;
                this.inventoryManager.suitMap[equip.suitType] = data;
            } else {
                this.inventoryManager.suitMap[equip.suitType].count++;
            }
        }
        //遍历套装列表 添加玩家状态 生成对应装备的套装属性表
        for(let key in this.inventoryManager.suitMap){
            let suit = this.inventoryManager.suitMap[key];
            let e = new EquipmentData();
            if(suit){
                for(let i = 0;i<suit.count-1;i++){
                    if(i<suit.EquipList.length){
                        e.add(suit.EquipList[i]);//叠加套装各种几率
                        if(this.dungeon&&this.dungeon.player){
                            this.dungeon.player.addStatus(suit.EquipList[i].statusName, new FromData());
                        }
                    }
                }
                this.inventoryManager.suitEquipMap[key]=e;
            }
        }

    }
    refreshEquipment(equipDataNew: EquipmentData, isInit: boolean, isReplace?: boolean, indexFromBag?: number) {
        if (!equipDataNew || !this.weapon) {
            return;
        }
        let equip = this.inventoryManager.equips[equipDataNew.equipmetType];
        let hasEquip = equip&&equip.equipmetType != InventoryManager.EMPTY;
        if(!hasEquip){
            if(equipDataNew.equipmetType == InventoryManager.REMOTE&&this.inventoryManager.equips[InventoryManager.SHIELD].equipmetType != InventoryManager.EMPTY){
                hasEquip = true;
            }
            if(equipDataNew.equipmetType == InventoryManager.SHIELD&&this.inventoryManager.equips[InventoryManager.REMOTE].equipmetType != InventoryManager.EMPTY){
                hasEquip = true;
            }
        }
        
        //1.如果是捡起到背包或者购买（非替换非初始化），且对应位置有装备，则直接放置到背包
        if (!isReplace && !isInit&&equip&&hasEquip) {
            this.setEquipmentToBag(equipDataNew, isInit,indexFromBag);
            return;
        }
        //2.如果是长按或者来自背包装备的替换操作，替换新的，移出旧的到背包
        let color = cc.color(255, 255, 255).fromHEX(equipDataNew.color);
        let spriteFrame = Logic.spriteFrameRes(equipDataNew.img);
        if (equipDataNew.equipmetType == InventoryManager.CLOTHES) {
            spriteFrame = Logic.spriteFrameRes(equipDataNew.img + 'anim0');
        } else if (equipDataNew.equipmetType == InventoryManager.HELMET) {
            spriteFrame = Logic.spriteFrameRes(equipDataNew.img + 'anim0');
        } else if (equipDataNew.equipmetType == InventoryManager.REMOTE) {
            spriteFrame = Logic.spriteFrameRes(equipDataNew.img + 'anim0');
        }
        //更新当前装备数据
        if(equip){
            this.setEquipmentToBag(equip, isInit, indexFromBag);
            equip.valueCopy(equipDataNew);
        }
        //更新贴图和颜色
        let sprite = this.equipSprites[equipDataNew.equipmetType];
        if(sprite){
            sprite.node.color = color;
            sprite.spriteFrame = equipDataNew.trouserslong == 1 ? Logic.spriteFrameRes('trousers000') : spriteFrame;
            if (equipDataNew.equipmetType == InventoryManager.TROUSERS && equipDataNew.trouserslong == 1) {
                sprite.spriteFrame = Logic.spriteFrameRes('trousers000');
            }
        }
        switch (equipDataNew.equipmetType) {
            case InventoryManager.REMOTE:
                this.remote.node.parent.active = true;
                this.shield.node.parent.active = true;
                //替换盾牌到背包
                this.setEquipmentToBag(this.inventoryManager.equips[InventoryManager.SHIELD], isInit, indexFromBag);
                //清空盾牌和贴图
                this.inventoryManager.equips[InventoryManager.SHIELD].valueCopy(new EquipmentData());
                this.shield.spriteFrame = Logic.spriteFrameRes(this.inventoryManager.equips[InventoryManager.SHIELD].img);
                this.shield.node.parent.active = false;
                break;
            case InventoryManager.SHIELD:
                this.remote.node.parent.active = true;
                this.shield.node.parent.active = true;
                //替换远程到背包
                this.setEquipmentToBag(this.inventoryManager.equips[InventoryManager.REMOTE], isInit, indexFromBag);
                //如果当前盾牌不为空清空远程和贴图并展示盾牌栏，否则显示远程隐藏盾牌栏
                if (this.inventoryManager.equips[equipDataNew.equipmetType].equipmetType != InventoryManager.EMPTY) {
                    this.inventoryManager.equips[InventoryManager.REMOTE].valueCopy(new EquipmentData());
                    this.remote.spriteFrame = Logic.spriteFrameRes(this.inventoryManager.equips[InventoryManager.REMOTE].img);
                    this.remote.node.parent.active = false;
                    this.shield.node.parent.active = true;
                } else {
                    this.remote.node.parent.active = true;
                    this.shield.node.parent.active = false;
                }
                break;
        }
        //更新玩家装备贴图和状态
        if (this.dungeon&&this.dungeon.player) {
            this.dungeon.player.inventoryManager = this.inventoryManager;
            this.dungeon.player.changeEquipment(equipDataNew, spriteFrame);
            if (equipDataNew.statusInterval > 0 && equipDataNew.statusName.length > 0) {
                this.dungeon.player.addStatus(equipDataNew.statusName, FromData.getClone(equipDataNew.nameCn, equipDataNew.img));
            }
        }
    }
    addPlayerStatus(equipmentData: EquipmentData) {
        if (!this.dungeon || !this.dungeon.player) {
            return;
        }
        if (equipmentData.statusInterval > 0 && equipmentData.statusName.length > 0) {
            this.dungeon.player.addStatus(equipmentData.statusName, FromData.getClone(equipmentData.nameCn, equipmentData.img));
        }
    }
    getTimeDelay(timeDelay: number, interval: number, dt: number): number {
        timeDelay += dt;
        if (timeDelay > interval) {
            timeDelay = 0;
            return timeDelay;
        }
        return timeDelay;
    }
    isTimeDelay(dt: number, equipmentData: EquipmentData) {
        let timeDelay = -1;
        this.equipTimeDelays[equipmentData.equipmetType] = this.getTimeDelay(this.equipTimeDelays[equipmentData.equipmetType], equipmentData.statusInterval, dt);;
        timeDelay = this.equipTimeDelays[equipmentData.equipmetType];
        return timeDelay == 0;
    }
    update(dt) {
        if(!Logic.isGamePause){
            for (let key in this.inventoryManager.equips) {
                if (this.isTimeDelay(dt, this.inventoryManager.equips[key])) {
                    this.addPlayerStatus(this.inventoryManager.equips[key]);
                }
            }
            for(let key in this.inventoryManager.suitMap){
                let suit = this.inventoryManager.suitMap[key];
                if(suit){
                    for(let i = 0;i<suit.count-1;i++){
                        if(i<suit.EquipList.length){
                            suit.EquipList[i].equipmetType = suit.suitType;
                            if (this.isTimeDelay(dt, suit.EquipList[i])) {
                                this.addPlayerStatus(suit.EquipList[i]);
                            }
                        }
                    }
                }
            }

        }
        
    }
    
    userItem(node: cc.Node, itemIndex: number) {
        if (!this.inventoryManager || !this.inventoryManager.itemList || itemIndex > this.inventoryManager.itemList.length - 1) {
            return;
        }
        let item = this.inventoryManager.itemList[itemIndex].clone();
        if (item.resName == Item.EMPTY) {
            return;
        }
        this.inventoryManager.itemCoolDownList[itemIndex].next(() => {
            this.drawItemCoolDown(item.cooldown, node.convertToWorldSpaceAR(cc.Vec3.ZERO));
            if (item.count != -1) {
                item.count--;
            }
            if (item.count <= 0 && item.count != -1) {
                this.inventoryManager.itemList[itemIndex].valueCopy(Logic.items[Item.EMPTY]);
            } else {
                this.inventoryManager.itemList[itemIndex].valueCopy(item);
            }
            this.refreshItemRes();
            if (item.resName != Item.EMPTY) {
                cc.director.emit(EventHelper.PLAYER_USEITEM, { detail: { itemData: item } });
            }
        }, item.cooldown, true)

    }
    isItemEqualCanAdd(item1: ItemData, item2: ItemData): boolean {
        return item1.resName != Item.EMPTY && item1.resName == item2.resName
            && item1.count > 0 && item2.count > 0;
    }
    refreshItem(itemDataNew: ItemData, isReplace: boolean, indexFromBag: number) {
        if (!this.node) {
            return;
        }
        let isRefreshed = false;
        //填补相同可叠加
        for (let i = 0; i < this.inventoryManager.itemList.length; i++) {
            let item = this.inventoryManager.itemList[i];
            if (this.isItemEqualCanAdd(item, itemDataNew)) {
                let count = item.count + itemDataNew.count;
                item.valueCopy(itemDataNew);
                item.count = count;
                isRefreshed = true;
                break;
            }
        }
        //填补空缺位置
        if (!isRefreshed) {
            for (let i = 0; i < this.inventoryManager.itemList.length; i++) {
                let item = this.inventoryManager.itemList[i];
                if (item.resName == Item.EMPTY) {
                    item.valueCopy(itemDataNew);
                    isRefreshed = true;
                    break;
                }
            }
        }
        //列表已满 

        if (!isRefreshed) {
            if (isReplace) {
                //1.如果是长按或者来自背包装备的替换操作，移出第一个到背包，新的放在末尾
                let item0 = this.inventoryManager.itemList[0].clone();
                let arr = new Array();
                for (let i = 1; i < this.inventoryManager.itemList.length; i++) {
                    arr.push(this.inventoryManager.itemList[i]);
                }
                arr.push(itemDataNew);
                for (let i = 0; i < this.inventoryManager.itemList.length; i++) {
                    this.inventoryManager.itemList[i].valueCopy(arr[i]);
                }
                this.setItemToBag(item0, indexFromBag);
            } else {
                //2.如果是捡起到背包或者购买，直接放置到背包
                this.setItemToBag(itemDataNew, indexFromBag);
            }
        }
        this.refreshItemRes();
    }
    private refreshItemRes() {
        let itemSpriteList = [this.itemsprite1, this.itemsprite2, this.itemsprite3, this.itemsprite4, this.itemsprite5];
        let itemLabelList = [this.itemlabel1, this.itemlabel2, this.itemlabel3, this.itemlabel4, this.itemlabel5];
        for (let i = 0; i < itemSpriteList.length; i++) {
            let item = this.inventoryManager.itemList[i];
            itemSpriteList[i].spriteFrame = Logic.spriteFrameRes(item.resName);
            itemLabelList[i].string = `${item.count > 0 ? ('x' + item.count) : ''}`;
        }
    }


    private drawItemCoolDown(coolDown: number, position: cc.Vec3) {
        if (coolDown <= 0) {
            return;
        }
        let height = 80;
        let delta = 0.1;
        let p = this.node.convertToNodeSpaceAR(position);
        let offset = height / coolDown * delta;
        let func = () => {
            height -= offset;
            if (this.graphics) {
                this.graphics.clear();
            }
            this.drawRect(height, p);
            if (height < 0) {
                if (this.graphics) {
                    this.graphics.clear();
                }
                this.unschedule(func);
            }
        }
        this.schedule(func, delta, cc.macro.REPEAT_FOREVER);
    }
    private drawRect(height, center: cc.Vec3) {
        this.graphics.fillColor = cc.color(255, 255, 255, 150);
        this.graphics.rect(center.x - 32, center.y - 32, 64, height);
        this.graphics.fill();
    }
}
