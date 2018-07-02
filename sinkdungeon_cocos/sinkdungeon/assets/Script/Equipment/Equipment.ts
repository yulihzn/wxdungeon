import Logic from "../Logic";
import EquipmentDialog from "./EquipmentDialog";
import EquipmentData from "../Data/EquipmentData";
import EquipmentManager from "./EquipmentManager";
import { EventConstant } from "../EventConstant";

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
    data:EquipmentData = new EquipmentData();
    anim:cc.Animation;
    private sprite: cc.Node;
    @property(EquipmentDialog)
    equipmentDialog:EquipmentDialog = null;
    pos:cc.Vec2 = cc.v2(0,0);
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sprite = this.node.getChildByName('sprite');
    }
    refresh(data:EquipmentData){
        this.data = data;
        this.equipmentDialog.refreshDialog(this.data);
        cc.loader.loadRes('Texture/Equipment/'+this.data.img,cc.SpriteFrame,(eror:Error,spriteFrame:cc.SpriteFrame)=>{
            spriteFrame.getTexture().setAliasTexParameters();
            this.sprite.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            this.sprite.width = spriteFrame.getRect().width;
            this.sprite.height = spriteFrame.getRect().height;
        })
    }

    start () {
        Logic.setAlias(this.node);
        this.anim = this.getComponent(cc.Animation);
    }
    onEnable(){
        
    }
    taken(){
        this.anim.play('EquipmentTaken');
        cc.director.emit(EventConstant.PLAYER_CHANGEEQUIPMENT,{equipData:this.data})
        this.node.getChildByName('shadow').active = false;
        this.equipmentDialog.node.active = false;
        setTimeout(()=>{
            if(this.node){
                this.destroy();
            }
        },1000);
        
    }
    
    onCollisionExit(other:cc.Collider,self:cc.Collider){
        if(other.tag == 3){
            this.equipmentDialog.hideDialog();
        }
    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider){
        if(other.tag == 3){
            this.equipmentDialog.showDialog();
        }
    }
    // update (dt) {}
}
