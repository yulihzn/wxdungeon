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
import { EventConstant } from './EventConstant';
import Logic from './Logic';
import EquipmentData from './Data/EquipmentData';
import Player from './Player';
import EquipmentDialog from './Equipment/EquipmentDialog';
import InventoryManager from './Manager/InventoryManager';
import Dungeon from './Dungeon';
import FromData from './Data/FromData';
import ItemData from './Data/ItemData';
import Item from './Item/Item';
@ccclass
export default class Inventory extends cc.Component {

    @property(cc.Node)
    tabselect: cc.Node = null;
    @property(Dungeon)
    dungeon: Dungeon = null;
    private selectIndex = 0;

    @property(cc.Sprite)
    weapon: cc.Sprite = null;
    @property(cc.Sprite)
    remote: cc.Sprite = null;
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
    item1: cc.Sprite = null;
    @property(cc.Sprite)
    item2: cc.Sprite = null;
    @property(cc.Sprite)
    item3: cc.Sprite = null;

    @property(EquipmentDialog)
    equipmentDialog: EquipmentDialog = null;
    @property(EquipmentDialog)
    equipmentGroundDialog: EquipmentDialog = null;

    inventoryManager: InventoryManager;

    weaponTimeDelay = 0;
    remoteTimeDelay = 0;
    helmetTimeDelay = 0;
    clothesTimeDelay = 0;
    trousersTimeDelay = 0;
    glovesTimeDelay = 0;
    shoesTimeDelay = 0;
    cloakTimeDelay = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.inventoryManager = Logic.inventoryManager;
        cc.director.on(EventConstant.PLAYER_CHANGEEQUIPMENT
            , (event) => { this.refreshEquipment(event.detail.equipData, true) });
        if (this.equipmentGroundDialog) { this.equipmentGroundDialog.hideDialog(); }
        cc.director.on(EventConstant.PLAYER_CHANGEITEM
            , (event) => { this.refreshItem(event.detail.itemData) });
        cc.director.on(EventConstant.HUD_GROUND_EQUIPMENT_INFO_SHOW
            , (event) => {
                if (this.equipmentGroundDialog) {
                    this.equipmentGroundDialog.refreshDialog(event.detail.equipData);
                    this.equipmentGroundDialog.showDialog();
                }
            });
        cc.director.on(EventConstant.HUD_GROUND_EQUIPMENT_INFO_HIDE
            , (event) => {
                if (this.equipmentGroundDialog) {
                    this.equipmentGroundDialog.hideDialog();
                }
            });
    }

    start() {
        // Logic.setAlias(this.node);
        this.tabselect.x = 0;
        this.weapon.spriteFrame = null;
        this.remote.spriteFrame = null;
        this.helmet.spriteFrame = null;
        this.clothes.spriteFrame = null;
        this.trousers.spriteFrame = null;
        this.gloves.spriteFrame = null;
        this.shoes.spriteFrame = null;
        this.cloak.spriteFrame = null;
        this.addSpriteTouchEvent(this.weapon, 'weapon');
        this.addSpriteTouchEvent(this.remote, 'remote');
        this.addSpriteTouchEvent(this.helmet, 'helmet');
        this.addSpriteTouchEvent(this.clothes, 'clothes');
        this.addSpriteTouchEvent(this.trousers, 'trousers');
        this.addSpriteTouchEvent(this.gloves, 'gloves');
        this.addSpriteTouchEvent(this.shoes, 'shoes');
        this.addSpriteTouchEvent(this.cloak, 'cloak');
        this.refreshEquipment(this.inventoryManager.weapon, false);
        this.refreshEquipment(this.inventoryManager.remote, false);
        this.refreshEquipment(this.inventoryManager.helmet, false);
        this.refreshEquipment(this.inventoryManager.clothes, false);
        this.refreshEquipment(this.inventoryManager.trousers, false);
        this.refreshEquipment(this.inventoryManager.gloves, false);
        this.refreshEquipment(this.inventoryManager.shoes, false);
        this.refreshEquipment(this.inventoryManager.cloak, false);
        this.refreshItemRes();
    }

    addSpriteTouchEvent(sprite: cc.Sprite, equipmetType: string) {
        sprite.node.parent.on(cc.Node.EventType.TOUCH_START, () => {
            if (sprite.spriteFrame == null) {
                return;
            }
            let equipData = new EquipmentData();
            switch (equipmetType) {
                case 'weapon': equipData = this.inventoryManager.weapon.clone(); break;
                case 'remote': equipData = this.inventoryManager.remote.clone(); break;
                case 'helmet': equipData = this.inventoryManager.helmet.clone(); break;
                case 'clothes': equipData = this.inventoryManager.clothes.clone(); break;
                case 'trousers': equipData = this.inventoryManager.trousers.clone(); break;
                case 'gloves': equipData = this.inventoryManager.gloves.clone(); break;
                case 'shoes': equipData = this.inventoryManager.shoes.clone(); break;
                case 'cloak': equipData = this.inventoryManager.cloak.clone(); break;
            }
            this.equipmentDialog.refreshDialog(equipData)
            this.equipmentDialog.showDialog();
        })
        sprite.node.parent.on(cc.Node.EventType.TOUCH_END, () => {
            this.equipmentDialog.hideDialog();
        })
        sprite.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.equipmentDialog.hideDialog();
        })
    }
    select(event, customEventData) {
        let index = parseInt(customEventData);
        this.tabselect.y = index * 64;
        let tab: cc.Node = event.currentTarget;
        // cc.director.emit(EventConstant.INVENTORY_CHANGEITEM
        //     , { detail: { spriteFrame: tab.getComponentInChildren(cc.Sprite).spriteFrame } })

    }
    setEquipment(equipDataNew: EquipmentData, equipmentData: EquipmentData, isChange: boolean) {
        if (equipmentData.equipmetType == equipDataNew.equipmetType) {
            let p = this.dungeon.player.getComponent(Player).pos.clone();
            if (p.y < 1) {
                p.y += 1;
            } else {
                p.y -= 1;
            }
            if (isChange) {
                cc.director.emit(EventConstant.DUNGEON_SETEQUIPMENT
                    , { detail: { pos: p, equipmentData: equipmentData } })
            }
        }
    }
    refreshEquipment(equipmentDataNew: EquipmentData, isChange: boolean) {
        if (!equipmentDataNew || !this.weapon) {
            return;
        }
        let color = cc.color(255, 255, 255).fromHEX(equipmentDataNew.color);
        let spriteFrame = Logic.spriteFrames[equipmentDataNew.img];
        switch (equipmentDataNew.equipmetType) {
            case 'weapon': this.weapon.spriteFrame = spriteFrame;
                this.weapon.node.color = color;
                this.setEquipment(equipmentDataNew, this.inventoryManager.weapon, isChange);
                this.inventoryManager.weapon.valueCopy(equipmentDataNew);
                break;
            case 'remote': this.remote.spriteFrame = spriteFrame;
                this.remote.node.color = color;
                this.setEquipment(equipmentDataNew, this.inventoryManager.remote, isChange);
                this.inventoryManager.remote.valueCopy(equipmentDataNew);
                break;
            case 'helmet': this.helmet.spriteFrame = spriteFrame;
                this.helmet.node.color = color;
                this.setEquipment(equipmentDataNew, this.inventoryManager.helmet, isChange);
                this.inventoryManager.helmet.valueCopy(equipmentDataNew);
                break;
            case 'clothes': this.clothes.spriteFrame = spriteFrame;
                this.clothes.node.color = color;
                this.setEquipment(equipmentDataNew, this.inventoryManager.clothes, isChange);
                this.inventoryManager.clothes.valueCopy(equipmentDataNew);
                break;
            case 'trousers':
                this.trousers.spriteFrame = equipmentDataNew.trouserslong == 1 ? Logic.spriteFrames['trousers000'] : spriteFrame;
                this.trousers.node.color = color;
                this.setEquipment(equipmentDataNew, this.inventoryManager.trousers, isChange);
                this.inventoryManager.trousers.valueCopy(equipmentDataNew);
                break;
            case 'gloves': this.gloves.spriteFrame = spriteFrame;
                this.gloves.node.color = color;
                this.setEquipment(equipmentDataNew, this.inventoryManager.gloves, isChange);
                this.inventoryManager.gloves.valueCopy(equipmentDataNew);
                break;
            case 'shoes': this.shoes.spriteFrame = spriteFrame;
                this.shoes.node.color = color;
                this.setEquipment(equipmentDataNew, this.inventoryManager.shoes, isChange);
                this.inventoryManager.shoes.valueCopy(equipmentDataNew);
                break;
            case 'cloak': this.cloak.spriteFrame = spriteFrame;
                this.cloak.node.color = color;
                this.setEquipment(equipmentDataNew, this.inventoryManager.cloak, isChange);
                this.inventoryManager.cloak.valueCopy(equipmentDataNew);
                break;
        }
        if (this.dungeon.player) {
            this.dungeon.player.getComponent(Player).inventoryManager = this.inventoryManager;
            this.dungeon.player.getComponent(Player).changeEquipment(equipmentDataNew, spriteFrame);
            if (equipmentDataNew.statusInterval > 0 && equipmentDataNew.statusName.length > 0) {
                this.dungeon.player.addStatus(equipmentDataNew.statusName, FromData.getClone(equipmentDataNew.nameCn, equipmentDataNew.img));
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
    secondTimeDelay = 0;
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
        switch (equipmentData.equipmetType) {
            case 'weapon': this.weaponTimeDelay = this.getTimeDelay(this.weaponTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.weaponTimeDelay; break;
            case 'remote': this.remoteTimeDelay = this.getTimeDelay(this.remoteTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.remoteTimeDelay; break;
            case 'helmet': this.helmetTimeDelay = this.getTimeDelay(this.helmetTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.helmetTimeDelay; break;
            case 'clothes': this.clothesTimeDelay = this.getTimeDelay(this.clothesTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.clothesTimeDelay; break;
            case 'trousers': this.trousersTimeDelay = this.getTimeDelay(this.trousersTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.trousersTimeDelay; break;
            case 'gloves': this.glovesTimeDelay = this.getTimeDelay(this.glovesTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.glovesTimeDelay; break;
            case 'shoes': this.shoesTimeDelay = this.getTimeDelay(this.shoesTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.shoesTimeDelay; break;
            case 'cloak': this.cloakTimeDelay = this.getTimeDelay(this.cloakTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.cloakTimeDelay; break;
        }
        return timeDelay == 0;
    }
    update(dt) {
        if (this.isTimeDelay(dt, this.inventoryManager.weapon)) {
            this.addPlayerStatus(this.inventoryManager.weapon);
        }
        if (this.isTimeDelay(dt, this.inventoryManager.remote)) {
            this.addPlayerStatus(this.inventoryManager.remote);
        }
        if (this.isTimeDelay(dt, this.inventoryManager.helmet)) {
            this.addPlayerStatus(this.inventoryManager.helmet);
        }
        if (this.isTimeDelay(dt, this.inventoryManager.clothes)) {
            this.addPlayerStatus(this.inventoryManager.clothes);
        }
        if (this.isTimeDelay(dt, this.inventoryManager.trousers)) {
            this.addPlayerStatus(this.inventoryManager.trousers);
        }
        if (this.isTimeDelay(dt, this.inventoryManager.gloves)) {
            this.addPlayerStatus(this.inventoryManager.gloves);
        }
        if (this.isTimeDelay(dt, this.inventoryManager.shoes)) {
            this.addPlayerStatus(this.inventoryManager.shoes);
        }
        if (this.isTimeDelay(dt, this.inventoryManager.cloak)) {
            this.addPlayerStatus(this.inventoryManager.cloak);
        }
    }

    //item button
    userItem(event, itemIndex) {
        let item = this.inventoryManager.itemList[itemIndex].clone();
        this.inventoryManager.itemList[itemIndex].valueCopy(Logic.items[Item.EMPTY]);
        this.refreshItemRes();
        cc.director.emit(EventConstant.PLAYER_USEITEM, { detail: { itemData: item } });
    }
    refreshItem(itemDataNew: ItemData) {
        if (!this.node) {
            return;
        }
        let isRefreshed = false;

        //填补空缺位置
        for (let i = 0; i < this.inventoryManager.itemList.length; i++) {
            let item = this.inventoryManager.itemList[i];
            if (item.resName == Item.EMPTY) {
                item.valueCopy(itemDataNew);
                isRefreshed = true;
                break;
            }
        }
        //先进先出
        if (!isRefreshed) {
            let item0 = this.inventoryManager.itemList[0].clone();
            let item1 = this.inventoryManager.itemList[1].clone();
            let item2 = this.inventoryManager.itemList[2].clone();
            this.inventoryManager.itemList[0].valueCopy(item1);
            this.inventoryManager.itemList[1].valueCopy(item2);
            this.inventoryManager.itemList[2].valueCopy(itemDataNew);
            this.setItem(item0);
        }
        this.refreshItemRes();
    }
    private refreshItemRes() {
        let itemSpriteList = [this.item1, this.item2, this.item3];
        for (let i = 0; i < itemSpriteList.length; i++) {
            let item = this.inventoryManager.itemList[i];
            itemSpriteList[i].spriteFrame = Logic.spriteFrames[item.resName];
        }
    }
    setItem(itemData: ItemData) {
        let p = this.dungeon.player.pos.clone();
        if (p.x < 1) {
        } else {
            p.x -= 1;
        }
        if (itemData.resName != Item.EMPTY) {
            cc.director.emit(EventConstant.DUNGEON_ADD_ITEM
                , { detail: { pos: Dungeon.getPosInMap(p), res: itemData.resName } })
        }
    }
}
