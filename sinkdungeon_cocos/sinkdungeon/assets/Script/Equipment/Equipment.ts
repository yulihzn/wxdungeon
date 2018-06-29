import Logic from "../Logic";
import EquipmentDialog from "./EquipmentDialog";

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

@ccclass
export default class Equipment extends cc.Component {
    equipmetTags: string = '';
    nametag: string = '';
    postfix:string = '';
    desc: string = '';
    damageMin: number = 0;
    damageMax: number = 0;
    criticalStrikeRate: number = 0;
    defence: number = 0;
    lifeDrain: number = 0;
    moveSpeed: number = 0;
    attackSpeed: number = 0;
    dodge: number = 0;
    health: number = 0;

    anim:cc.Animation;
    @property(EquipmentDialog)
    equipmentDialog:EquipmentDialog = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        Logic.setAlias(this.node);
        this.anim = this.getComponent(cc.Animation);
    }
    onEnable(){
        this.equipmentDialog.refreshDialog(this);
    }
    onCollisionStay(other:cc.Collider,self:cc.Collider){
        if(other.tag == 3){
            this.equipmentDialog.showDialog();
        }
    }
    onCollisionExit(other:cc.Collider,self:cc.Collider){
        if(other.tag == 3){
            this.equipmentDialog.hideDialog();
        }
    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider){
        if(other.tag == 3){
            this.equipmentDialog.hideDialog();
        }
    }
    // update (dt) {}
}
