// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import {EventConstant} from './EventConstant';
import Logic from './Logic';
import EquipmentData from './Data/EquipmentData';
import InventoryData from './Data/InventoryData';
import Player from './Player';
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    tabselect: cc.Node = null;
    @property(cc.Node)
    player: cc.Node = null;
    private selectIndex = 0;

    @property(cc.Sprite)
    weapon:cc.Sprite = null;
    @property(cc.Sprite)
    helmet:cc.Sprite = null;
    @property(cc.Sprite)
    clothes:cc.Sprite = null;
    @property(cc.Sprite)
    trousers:cc.Sprite = null;
    @property(cc.Sprite)
    gloves:cc.Sprite = null;
    @property(cc.Sprite)
    shoes:cc.Sprite = null;

    inventoryData:InventoryData;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.inventoryData = Logic.inventoryData;
        cc.director.on(EventConstant.PLAYER_CHANGEEQUIPMENT
            , (event) => { this.refreshEquipment(event.detail.equipData) });
    }

    start () {
        Logic.setAlias(this.node);
        this.tabselect.x = 0;
        this.weapon.spriteFrame = null;
        this.helmet.spriteFrame = null;
        this.clothes.spriteFrame = null;
        this.trousers.spriteFrame = null;
        this.gloves.spriteFrame = null;
        this.shoes.spriteFrame = null;
        this.refreshEquipment(this.inventoryData.weapon);
        this.refreshEquipment(this.inventoryData.helmet);
        this.refreshEquipment(this.inventoryData.clothes);
        this.refreshEquipment(this.inventoryData.trousers);
        this.refreshEquipment(this.inventoryData.gloves);
        this.refreshEquipment(this.inventoryData.shoes);
        
    }
    select(event, customEventData){
        let index = parseInt(customEventData);
        this.tabselect.x = index*64;
        let tab:cc.Node = event.currentTarget;
        cc.director.emit(EventConstant.INVENTORY_CHANGEITEM
            ,{spriteFrame:tab.getComponentInChildren(cc.Sprite).spriteFrame})

    }
    setEquipment(equipDataNew: EquipmentData,equipmentData:EquipmentData){
        if (equipmentData.equipmetType == equipDataNew.equipmetType) {
            cc.director.emit(EventConstant.DUNGEON_SETEQUIPMENT
                , { pos: this.player.getComponent(Player).pos, equipmentData: equipmentData })
        }
    }
    refreshEquipment(equipmentDataNew:EquipmentData){
        if(!equipmentDataNew){
            return;
        }
        cc.loader.loadRes('Texture/Equipment/'+equipmentDataNew.img,cc.SpriteFrame,(eror:Error,spriteFrame:cc.SpriteFrame)=>{
            spriteFrame.getTexture().setAliasTexParameters();
            switch(equipmentDataNew.equipmetType){
                case 'weapon':this.weapon.spriteFrame = spriteFrame;
                this.setEquipment(equipmentDataNew,this.inventoryData.weapon);
                this.inventoryData.weapon = equipmentDataNew;
                break;
                case 'helmet':this.helmet.spriteFrame = spriteFrame;
                this.setEquipment(equipmentDataNew,this.inventoryData.helmet);
                this.inventoryData.helmet = equipmentDataNew;
                break;
                case 'clothes':this.clothes.spriteFrame = spriteFrame;
                this.setEquipment(equipmentDataNew,this.inventoryData.clothes);
                this.inventoryData.clothes = equipmentDataNew;
                break;
                case 'trousers':this.trousers.spriteFrame = spriteFrame;
                this.setEquipment(equipmentDataNew,this.inventoryData.trousers);
                this.inventoryData.trousers = equipmentDataNew;
                break;
                case 'gloves':this.gloves.spriteFrame = spriteFrame;
                this.setEquipment(equipmentDataNew,this.inventoryData.gloves);
                this.inventoryData.gloves = equipmentDataNew;
                break;
                case 'shoes':this.shoes.spriteFrame = spriteFrame;
                this.setEquipment(equipmentDataNew,this.inventoryData.shoes);
                this.inventoryData.shoes = equipmentDataNew;
                break;
            }
            if(this.player){
                this.player.getComponent(Player).changeEquipment(equipmentDataNew.equipmetType,spriteFrame)
            }
        })
    }

    // update (dt) {}
}
