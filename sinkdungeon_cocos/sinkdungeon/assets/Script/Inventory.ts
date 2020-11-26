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
import EquipmentData from './Data/EquipmentData';
import Player from './Player';
import EquipmentDialog from './Equipment/EquipmentDialog';
import InventoryManager from './Manager/InventoryManager';
import Dungeon from './Dungeon';
import FromData from './Data/FromData';
import ItemData from './Data/ItemData';
import Item from './Item/Item';
import Equipment from './Equipment/Equipment';
import ItemDialog from './Item/ItemDialog';
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
    item1: cc.Sprite = null;
    @property(cc.Sprite)
    item2: cc.Sprite = null;
    @property(cc.Sprite)
    item3: cc.Sprite = null;

    @property(EquipmentDialog)
    equipmentDialog: EquipmentDialog = null;
    @property(ItemDialog)
    itemDialog: ItemDialog = null;
    @property(EquipmentDialog)
    equipmentGroundDialog: EquipmentDialog = null;
    @property(ItemDialog)
    itemGroundDialog: ItemDialog = null;

    inventoryManager: InventoryManager;
    graphics: cc.Graphics = null;

    weaponTimeDelay = 0;
    remoteTimeDelay = 0;
    shieldTimeDelay = 0;
    helmetTimeDelay = 0;
    clothesTimeDelay = 0;
    trousersTimeDelay = 0;
    glovesTimeDelay = 0;
    shoesTimeDelay = 0;
    cloakTimeDelay = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.graphics = this.getComponent(cc.Graphics);
        this.inventoryManager = Logic.inventoryManager;
        cc.director.on(EventHelper.PLAYER_CHANGEEQUIPMENT
            , (event) => { this.refreshEquipment(event.detail.equipData, true) });
        if (this.equipmentGroundDialog) { this.equipmentGroundDialog.hideDialog(); }
        if (this.itemGroundDialog) { this.itemGroundDialog.hideDialog(); }
        cc.director.on(EventHelper.PLAYER_CHANGEITEM
            , (event) => { this.refreshItem(event.detail.itemData) });
        cc.director.on(EventHelper.HUD_GROUND_EQUIPMENT_INFO_SHOW
            , (event) => {
                if (this.equipmentGroundDialog) {
                    this.equipmentGroundDialog.refreshDialog(event.detail.equipData);
                    this.equipmentGroundDialog.showDialog();
                }
            });
        cc.director.on(EventHelper.HUD_GROUND_EQUIPMENT_INFO_HIDE
            , (event) => {
                if (this.equipmentGroundDialog) {
                    this.equipmentGroundDialog.hideDialog();
                }
            });
        cc.director.on(EventHelper.HUD_GROUND_ITEM_INFO_SHOW
            , (event) => {
                if (this.itemGroundDialog) {
                    this.itemGroundDialog.refreshDialog(event.detail.itemData);
                    this.itemGroundDialog.showDialog();
                }
            });
        cc.director.on(EventHelper.HUD_GROUND_ITEM_INFO_HIDE
            , (event) => {
                if (this.itemGroundDialog) {
                    this.itemGroundDialog.hideDialog();
                }
            });
        cc.director.on(EventHelper.USEITEM_KEYBOARD, (event) => {
            this.userItem(null, event.detail.index);
        });
        this.remote.node.parent.active = true;
        this.shield.node.parent.active = false;
    }

    start() {
        this.weapon.spriteFrame = null;
        this.remote.spriteFrame = null;
        this.shield.spriteFrame = null;
        this.helmet.spriteFrame = null;
        this.clothes.spriteFrame = null;
        this.trousers.spriteFrame = null;
        this.gloves.spriteFrame = null;
        this.shoes.spriteFrame = null;
        this.cloak.spriteFrame = null;
        this.addEquipSpriteTouchEvent(this.weapon, Equipment.WEAPON);
        this.addEquipSpriteTouchEvent(this.remote, Equipment.REMOTE);
        this.addEquipSpriteTouchEvent(this.shield, Equipment.SHIELD);
        this.addEquipSpriteTouchEvent(this.helmet, Equipment.HELMET);
        this.addEquipSpriteTouchEvent(this.clothes, Equipment.CLOTHES);
        this.addEquipSpriteTouchEvent(this.trousers, Equipment.TROUSERS);
        this.addEquipSpriteTouchEvent(this.gloves, Equipment.GLOVES);
        this.addEquipSpriteTouchEvent(this.shoes, Equipment.SHOES);
        this.addEquipSpriteTouchEvent(this.cloak, Equipment.CLOAK);
        this.refreshEquipment(this.inventoryManager.weapon, false);
        this.refreshEquipment(this.inventoryManager.remote, false);
        this.refreshEquipment(this.inventoryManager.shield, false);
        this.refreshEquipment(this.inventoryManager.helmet, false);
        this.refreshEquipment(this.inventoryManager.clothes, false);
        this.refreshEquipment(this.inventoryManager.trousers, false);
        this.refreshEquipment(this.inventoryManager.gloves, false);
        this.refreshEquipment(this.inventoryManager.shoes, false);
        this.refreshEquipment(this.inventoryManager.cloak, false);
        this.refreshItemRes();
        let itemSpriteList = [this.item1, this.item2, this.item3];
        for(let i =0;i<itemSpriteList.length;i++){
            this.addItemSpriteTouchEvent(itemSpriteList[i],i);
        }
    }

    private addEquipSpriteTouchEvent(sprite: cc.Sprite, equipmetType: string) {
        sprite.node.parent.on(cc.Node.EventType.TOUCH_START, () => {
            if (sprite.spriteFrame == null) {
                return;
            }
            let equipData = new EquipmentData();
            switch (equipmetType) {
                case Equipment.WEAPON: equipData = this.inventoryManager.weapon.clone(); break;
                case Equipment.REMOTE: equipData = this.inventoryManager.remote.clone(); break;
                case Equipment.SHIELD: equipData = this.inventoryManager.shield.clone(); break;
                case Equipment.HELMET: equipData = this.inventoryManager.helmet.clone(); break;
                case Equipment.CLOTHES: equipData = this.inventoryManager.clothes.clone(); break;
                case Equipment.TROUSERS: equipData = this.inventoryManager.trousers.clone(); break;
                case Equipment.GLOVES: equipData = this.inventoryManager.gloves.clone(); break;
                case Equipment.SHOES: equipData = this.inventoryManager.shoes.clone(); break;
                case Equipment.CLOAK: equipData = this.inventoryManager.cloak.clone(); break;
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
    private addItemSpriteTouchEvent(sprite:cc.Sprite,itemIndex:number){
        let isLongPress = false;
        let touchStart = false;
        sprite.node.parent.parent.on(cc.Node.EventType.TOUCH_START, () => {
            if (sprite.spriteFrame == null) {
                return;
            }
            touchStart = true;
            this.scheduleOnce(()=>{
                if (!touchStart||!this.inventoryManager || !this.inventoryManager.itemList || itemIndex > this.inventoryManager.itemList.length - 1) {
                    return;
                }
                isLongPress = true;
                let item = this.inventoryManager.itemList[itemIndex].clone();
                if(item.resName == Item.EMPTY){
                    return;
                }
                this.itemDialog.refreshDialog(item);
                this.itemDialog.showDialog();
            },0.3)
            
        })
        sprite.node.parent.parent.on(cc.Node.EventType.TOUCH_END, () => {
            this.itemDialog.hideDialog();
            if(!isLongPress){
                this.userItem(sprite.node,itemIndex);
            }
            touchStart = false;
            isLongPress = false;
        })
        sprite.node.parent.parent.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.itemDialog.hideDialog();
            touchStart = false;
            isLongPress = false;
        })
    }
   
    private setEquipment(equipmentData: EquipmentData, isChange: boolean) {
        if (isChange && equipmentData.equipmetType != Equipment.EMPTY) {
            let p = this.dungeon.player.getComponent(Player).pos.clone();
            this.dungeon.addEquipment(equipmentData.img, p, equipmentData);
        }
    }
    refreshEquipment(equipmentDataNew: EquipmentData, isChange: boolean) {
        if (!equipmentDataNew || !this.weapon) {
            return;
        }
        let color = cc.color(255, 255, 255).fromHEX(equipmentDataNew.color);
        let spriteFrame = Logic.spriteFrames[equipmentDataNew.img];
        if (equipmentDataNew.equipmetType == 'clothes') {
            spriteFrame = Logic.spriteFrames[equipmentDataNew.img+'anim0'];
        }else if (equipmentDataNew.equipmetType == 'helmet') {
            spriteFrame = Logic.spriteFrames[equipmentDataNew.img+'anim0'];
        }else if (equipmentDataNew.equipmetType == 'remote') {
            spriteFrame = Logic.spriteFrames[equipmentDataNew.img+'anim0'];
        }
        switch (equipmentDataNew.equipmetType) {
            case Equipment.WEAPON: this.weapon.spriteFrame = spriteFrame;
                this.weapon.node.color = color;
                this.setEquipment(this.inventoryManager.weapon, isChange);
                this.inventoryManager.weapon.valueCopy(equipmentDataNew);
                break;
            case Equipment.REMOTE:
                this.remote.node.parent.active = true;
                this.shield.node.parent.active = true;
                this.remote.spriteFrame = spriteFrame;
                this.remote.node.color = color;
                this.setEquipment(this.inventoryManager.remote, isChange);
                this.setEquipment(this.inventoryManager.shield, isChange);
                this.inventoryManager.remote.valueCopy(equipmentDataNew);
                this.inventoryManager.shield.valueCopy(new EquipmentData());
                this.shield.spriteFrame = Logic.spriteFrames[this.inventoryManager.shield.img];
                this.shield.node.parent.active = false;
                break;
            case Equipment.SHIELD:
                this.remote.node.parent.active = true;
                this.shield.node.parent.active = true;
                this.shield.spriteFrame = spriteFrame;
                this.shield.node.color = color;
                this.setEquipment(this.inventoryManager.shield, isChange);
                this.setEquipment(this.inventoryManager.remote, isChange);
                this.inventoryManager.shield.valueCopy(equipmentDataNew);
                if (this.inventoryManager.shield.equipmetType != Equipment.EMPTY) {
                    this.inventoryManager.remote.valueCopy(new EquipmentData());
                    this.remote.spriteFrame = Logic.spriteFrames[this.inventoryManager.remote.img];
                    this.remote.node.parent.active = false;
                    this.shield.node.parent.active = true;
                } else {
                    this.remote.node.parent.active = true;
                    this.shield.node.parent.active = false;
                }
                break;
            case Equipment.HELMET: this.helmet.spriteFrame = spriteFrame;
                this.helmet.node.color = color;
                this.setEquipment(this.inventoryManager.helmet, isChange);
                this.inventoryManager.helmet.valueCopy(equipmentDataNew);
                break;
            case Equipment.CLOTHES: this.clothes.spriteFrame = spriteFrame;
                this.clothes.node.color = color;
                this.setEquipment(this.inventoryManager.clothes, isChange);
                this.inventoryManager.clothes.valueCopy(equipmentDataNew);
                break;
            case Equipment.TROUSERS:
                this.trousers.spriteFrame = equipmentDataNew.trouserslong == 1 ? Logic.spriteFrames['trousers000'] : spriteFrame;
                this.trousers.node.color = color;
                this.setEquipment(this.inventoryManager.trousers, isChange);
                this.inventoryManager.trousers.valueCopy(equipmentDataNew);
                break;
            case Equipment.GLOVES: this.gloves.spriteFrame = spriteFrame;
                this.gloves.node.color = color;
                this.setEquipment(this.inventoryManager.gloves, isChange);
                this.inventoryManager.gloves.valueCopy(equipmentDataNew);
                break;
            case Equipment.SHOES: this.shoes.spriteFrame = spriteFrame;
                this.shoes.node.color = color;
                this.setEquipment(this.inventoryManager.shoes, isChange);
                this.inventoryManager.shoes.valueCopy(equipmentDataNew);
                break;
            case Equipment.CLOAK: this.cloak.spriteFrame = spriteFrame;
                this.cloak.node.color = color;
                this.setEquipment(this.inventoryManager.cloak, isChange);
                this.inventoryManager.cloak.valueCopy(equipmentDataNew);
                break;
        }
        if (this.dungeon.player) {
            this.dungeon.player.inventoryManager = this.inventoryManager;
            this.dungeon.player.changeEquipment(equipmentDataNew, spriteFrame);
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
            case Equipment.WEAPON: this.weaponTimeDelay = this.getTimeDelay(this.weaponTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.weaponTimeDelay; break;
            case Equipment.REMOTE: this.remoteTimeDelay = this.getTimeDelay(this.remoteTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.remoteTimeDelay; break;
            case Equipment.SHIELD: this.shieldTimeDelay = this.getTimeDelay(this.shieldTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.shieldTimeDelay; break;
            case Equipment.HELMET: this.helmetTimeDelay = this.getTimeDelay(this.helmetTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.helmetTimeDelay; break;
            case Equipment.CLOTHES: this.clothesTimeDelay = this.getTimeDelay(this.clothesTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.clothesTimeDelay; break;
            case Equipment.TROUSERS: this.trousersTimeDelay = this.getTimeDelay(this.trousersTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.trousersTimeDelay; break;
            case Equipment.GLOVES: this.glovesTimeDelay = this.getTimeDelay(this.glovesTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.glovesTimeDelay; break;
            case Equipment.SHOES: this.shoesTimeDelay = this.getTimeDelay(this.shoesTimeDelay, equipmentData.statusInterval, dt);
                timeDelay = this.shoesTimeDelay; break;
            case Equipment.CLOAK: this.cloakTimeDelay = this.getTimeDelay(this.cloakTimeDelay, equipmentData.statusInterval, dt);
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
        if (this.isTimeDelay(dt, this.inventoryManager.shield)) {
            this.addPlayerStatus(this.inventoryManager.shield);
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

    userItem(node:cc.Node, itemIndex:number) {
        if (!this.inventoryManager || !this.inventoryManager.itemList || itemIndex > this.inventoryManager.itemList.length - 1) {
            return;
        }
        let item = this.inventoryManager.itemList[itemIndex].clone();
        if(item.resName == Item.EMPTY){
            return;
        }
        this.inventoryManager.itemCoolDownList[itemIndex].next(()=>{
            this.drawItemCoolDown(item.cooldown,node.convertToWorldSpaceAR(cc.Vec3.ZERO));
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
        },item.cooldown,true)
        
    }
    refreshItem(itemDataNew: ItemData) {
        if (!this.node) {
            return;
        }
        let isRefreshed = false;
        //填补相同可叠加
        for (let i = 0; i < this.inventoryManager.itemList.length; i++) {
            let item = this.inventoryManager.itemList[i];
            if (item.resName != Item.EMPTY && item.resName == itemDataNew.resName
                && item.count > 0 && itemDataNew.count > 0) {
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
            itemSpriteList[i].node.parent.parent.getComponentInChildren(cc.Label).string = `${item.count > 0 ? ('x' + item.count) : ''}`;
        }
    }
    setItem(itemData: ItemData) {
        let p = this.dungeon.player.pos.clone();
        let pos = Dungeon.getPosInMap(p);
        pos.y += Logic.getHalfChance() ? 2 : -2;
        pos.x += Logic.getHalfChance() ? 2 : -2;
        if (itemData.resName != Item.EMPTY) {
            cc.director.emit(EventHelper.DUNGEON_ADD_ITEM
                , { detail: { pos: Dungeon.getPosInMap(p), res: itemData.resName, count: itemData.count } })
        }
    }

    private drawItemCoolDown(coolDown: number,position:cc.Vec3) {
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
