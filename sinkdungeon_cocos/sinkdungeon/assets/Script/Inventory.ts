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
import EquipmentDialog from './Equipment/EquipmentDialog';
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
    @property(cc.Sprite)
    cloak:cc.Sprite = null;

    @property(EquipmentDialog)
    equipmentDialog:EquipmentDialog = null;

    inventoryData:InventoryData;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.inventoryData = Logic.inventoryData;
        cc.director.on(EventConstant.PLAYER_CHANGEEQUIPMENT
            , (event) => { this.refreshEquipment(event.detail.equipData,true) });
    }

    start () {
        // Logic.setAlias(this.node);
        this.tabselect.x = 0;
        this.weapon.spriteFrame = null;
        this.helmet.spriteFrame = null;
        this.clothes.spriteFrame = null;
        this.trousers.spriteFrame = null;
        this.gloves.spriteFrame = null;
        this.shoes.spriteFrame = null;
        this.cloak.spriteFrame = null;
        this.addSpriteTouchEvent(this.weapon,'weapon');
        this.addSpriteTouchEvent(this.helmet,'helmet');
        this.addSpriteTouchEvent(this.clothes,'clothes');
        this.addSpriteTouchEvent(this.trousers,'trousers');
        this.addSpriteTouchEvent(this.gloves,'gloves');
        this.addSpriteTouchEvent(this.shoes,'shoes');
        this.addSpriteTouchEvent(this.cloak,'cloak');
        this.refreshEquipment(this.inventoryData.weapon,false);
        this.refreshEquipment(this.inventoryData.helmet,false);
        this.refreshEquipment(this.inventoryData.clothes,false);
        this.refreshEquipment(this.inventoryData.trousers,false);
        this.refreshEquipment(this.inventoryData.gloves,false);
        this.refreshEquipment(this.inventoryData.shoes,false);
        this.refreshEquipment(this.inventoryData.cloak,false);
    }
    addSpriteTouchEvent(sprite:cc.Sprite,equipmetType:string){
        sprite.node.on(cc.Node.EventType.TOUCH_START,()=>{
            if(sprite.spriteFrame == null){
                return;
            }
            let equipData = new EquipmentData();
            switch(equipmetType){
                case 'weapon':equipData = this.inventoryData.weapon.clone();break;
                case 'helmet':equipData = this.inventoryData.helmet.clone();break;
                case 'clothes':equipData = this.inventoryData.clothes.clone();break;
                case 'trousers':equipData = this.inventoryData.trousers.clone();break;
                case 'gloves':equipData = this.inventoryData.gloves.clone();break;
                case 'shoes':equipData = this.inventoryData.shoes.clone();break;
                case 'cloak':equipData = this.inventoryData.cloak.clone();break;
            }
            this.equipmentDialog.refreshDialog(equipData)
            this.equipmentDialog.showDialog();
        })
        sprite.node.on(cc.Node.EventType.TOUCH_END,()=>{
            this.equipmentDialog.hideDialog();
        })
        sprite.node.on(cc.Node.EventType.TOUCH_CANCEL,()=>{
            this.equipmentDialog.hideDialog();
        })
    }
    select(event, customEventData){
        let index = parseInt(customEventData);
        this.tabselect.y = index*64;
        let tab:cc.Node = event.currentTarget;
        cc.director.emit(EventConstant.INVENTORY_CHANGEITEM
            ,{detail:{spriteFrame:tab.getComponentInChildren(cc.Sprite).spriteFrame}})

    }
    setEquipment(equipDataNew: EquipmentData,equipmentData:EquipmentData,isChange:boolean){
        if (equipmentData.equipmetType == equipDataNew.equipmetType) {
            let p = this.player.getComponent(Player).pos.clone();
            if(p.y<1){
                p.y += 1;
            }else{
                p.y-=1;
            }
            if(isChange){
                cc.director.emit(EventConstant.DUNGEON_SETEQUIPMENT
                    , {detail:{ pos: p, equipmentData: equipmentData }})
            }
        }
    }
    refreshEquipment(equipmentDataNew:EquipmentData,isChange:boolean){
        if(!equipmentDataNew||!this.weapon){
            return;
        }
        let color = cc.color(255,255,255).fromHEX(equipmentDataNew.color);
        let spriteFrame = Logic.spriteFrames[equipmentDataNew.img];
        switch(equipmentDataNew.equipmetType){
            case 'weapon':this.weapon.spriteFrame = spriteFrame;
            this.weapon.node.color = color;
            this.setEquipment(equipmentDataNew,this.inventoryData.weapon,isChange);
            this.inventoryData.weapon.valueCopy(equipmentDataNew);
            break;
            case 'helmet':this.helmet.spriteFrame = spriteFrame;
            this.helmet.node.color = color;
            this.setEquipment(equipmentDataNew,this.inventoryData.helmet,isChange);
            this.inventoryData.helmet.valueCopy(equipmentDataNew);
            break;
            case 'clothes':this.clothes.spriteFrame = spriteFrame;
            this.clothes.node.color = color;
            this.setEquipment(equipmentDataNew,this.inventoryData.clothes,isChange);
            this.inventoryData.clothes.valueCopy(equipmentDataNew);
            break;
            case 'trousers':
            this.trousers.spriteFrame = equipmentDataNew.trouserslong==1?Logic.spriteFrames['idle002']:Logic.spriteFrames['idle001'];
            this.trousers.node.color = color;
            this.setEquipment(equipmentDataNew,this.inventoryData.trousers,isChange);
            this.inventoryData.trousers.valueCopy(equipmentDataNew);
            break;
            case 'gloves':this.gloves.spriteFrame = spriteFrame;
            this.gloves.node.color = color;
            this.setEquipment(equipmentDataNew,this.inventoryData.gloves,isChange);
            this.inventoryData.gloves.valueCopy(equipmentDataNew);
            break;
            case 'shoes':this.shoes.spriteFrame = spriteFrame;
            this.shoes.node.color = color;
            this.setEquipment(equipmentDataNew,this.inventoryData.shoes,isChange);
            this.inventoryData.shoes.valueCopy(equipmentDataNew);
            break;
            case 'cloak':this.shoes.spriteFrame = spriteFrame;
            this.cloak.node.color = color;
            this.setEquipment(equipmentDataNew,this.inventoryData.cloak,isChange);
            this.inventoryData.cloak.valueCopy(equipmentDataNew);
            break;
        }
        if(this.player){
            this.player.getComponent(Player).inventoryData = this.inventoryData;
            this.player.getComponent(Player).changeEquipment(equipmentDataNew,spriteFrame)
        }
    }

    // update (dt) {}
}
