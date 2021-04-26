import Equipment from "./Equipment";
import Logic from "../Logic";
import EquipmentData from "../Data/EquipmentData";
import InventoryManager from "../Manager/InventoryManager";

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

@ccclass
export default class EquipmentDialog extends cc.Component {
    @property(cc.Label)
    labelTile: cc.Label = null;
    @property(cc.Label)
    infoBase: cc.Label = null;//基础属性
    @property(cc.Label)
    info1: cc.Label = null;//附加词条1
    @property(cc.Label)
    info2: cc.Label = null;//附加词条2
    @property(cc.Label)
    info3: cc.Label = null;//附加词条3
    @property(cc.Label)
    extraInfo: cc.Label = null;//附加词条4
    @property(cc.Label)
    infoSuit1: cc.Label = null;//套装附加词条1
    @property(cc.Label)
    infoSuit2: cc.Label = null;//套装附加词条2
    @property(cc.Label)
    infoSuit3: cc.Label = null;//套装附加词条3
    @property(cc.Label)
    infoDesc: cc.Label = null;//描述

    isInventory = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    }

    start() {
        // Logic.setAlias(this.node);
        this.node.opacity = 0;
    }
    refreshDialog(equipment: EquipmentData) {
        this.infoBase.node.active = true;
        this.info1.node.active = true;
        this.info2.node.active = true;
        this.info3.node.active = true;
        this.extraInfo.node.active = true;
        this.infoSuit1.node.active = true;
        this.infoSuit2.node.active = true;
        this.infoSuit3.node.active = true;
        this.labelTile.string = equipment.prefix + equipment.nameCn;
        this.labelTile.node.color = this.labelTile.node.color.fromHEX(equipment.titlecolor);
        this.infoBase.string = equipment.infobase;
        this.infoBase.node.color = this.infoBase.node.color.fromHEX(equipment.infobasecolor);
        this.info1.string = equipment.info1;
        this.info1.node.color = this.info1.node.color.fromHEX(equipment.infocolor1);
        this.info2.string = equipment.info2;
        this.info2.node.color = this.info2.node.color.fromHEX(equipment.infocolor2);
        this.info3.string = equipment.info3;
        this.info3.node.color = this.info3.node.color.fromHEX(equipment.infocolor3);
        this.extraInfo.string = equipment.extraInfo;
        this.infoSuit1.string = equipment.suit1;
        this.infoSuit2.string = equipment.suit2;
        this.infoSuit3.string = equipment.suit3;
        this.infoSuit1.node.color = this.infoSuit1.node.color.fromHEX(equipment.suitcolor1);
        this.infoSuit2.node.color = this.infoSuit2.node.color.fromHEX(equipment.suitcolor2);
        this.infoSuit3.node.color = this.infoSuit3.node.color.fromHEX(equipment.suitcolor3);
        this.infoDesc.string = equipment.desc;
        this.infoBase.node.active = this.infoBase.string.length > 0;
        this.info1.node.active = this.info1.string.length > 0;
        this.info2.node.active = this.info2.string.length > 0;
        this.info3.node.active = this.info3.string.length > 0;
        this.extraInfo.node.active = this.extraInfo.string.length > 0;
        this.infoSuit1.node.active = this.infoSuit1.string.length > 0;
        this.infoSuit2.node.active = this.infoSuit2.string.length > 0;
        this.infoSuit3.node.active = this.infoSuit3.string.length > 0;
    }
    showDialog(equipment: EquipmentData, inventoryManager?: InventoryManager) {
        this.refreshDialog(equipment);
        this.node.opacity = 255;
        if (inventoryManager) {
            let count = 0;
            if(equipment.suitType.length>0&&inventoryManager.suitMap[equipment.suitType]){
                count = inventoryManager.suitMap[equipment.suitType].count;
            }
            this.infoSuit1.node.opacity = count>1?255:80;
            this.infoSuit2.node.opacity = count>2?255:80;
            this.infoSuit2.node.opacity = count>3?255:80;
        }
    }
    hideDialog() {
        this.node.opacity = 0;
    }

    update(dt) {
        // this.node.opacity = this.lerp(this.node.opacity, this.alpha, dt * this.showSpeed);
    }
    lerp(a, b, r) {
        return a + (b - a) * r;
    }
}
