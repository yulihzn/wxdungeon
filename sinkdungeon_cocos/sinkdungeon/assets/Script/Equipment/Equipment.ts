import Logic from "../Logic";
import EquipmentDialog from "./EquipmentDialog";
import EquipmentData from "../Data/EquipmentData";
import EquipmentManager from "../Manager/EquipmentManager";
import { EventConstant } from "../EventConstant";
import Player from "../Player";
import ShopTable from "../Building/ShopTable";
import Dungeon from "../Dungeon";
import AudioPlayer from "../Utils/AudioPlayer";

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
export default class Equipment extends cc.Component {
    data: EquipmentData = new EquipmentData();
    anim: cc.Animation;
    private sprite: cc.Node;
    @property(EquipmentDialog)
    equipmentDialog: EquipmentDialog = null;
    pos: cc.Vec2 = cc.v2(0, 0);
    isTaken = false;
    shopTable: ShopTable;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isTaken = false;
        this.sprite = this.node.getChildByName('sprite');
    }
    refresh(data: EquipmentData) {
        this.data.valueCopy(data);
        this.equipmentDialog.refreshDialog(this.data);
        let spriteFrame = Logic.spriteFrames[this.data.img];
        if (data.equipmetType == 'trousers') {
            spriteFrame = data.trouserslong==1?Logic.spriteFrames['trousers000']:spriteFrame;
        }
        this.sprite.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.sprite.width = spriteFrame.getRect().width;
        this.sprite.height = spriteFrame.getRect().height;
        let color = cc.color(255, 255, 255).fromHEX(this.data.color);
        this.sprite.color = color;
        if (data.equipmetType == 'remote') {
            this.sprite.width = this.sprite.width / 2;
            this.sprite.height = this.sprite.height / 2;
        }
        this.data.pos = Dungeon.getIndexInMap(this.node.position.clone());

    }

    start() {
        // Logic.setAlias(this.node);
        this.anim = this.getComponent(cc.Animation);
    }
    onEnable() {

    }
    taken() {
        this.isTaken = true;
        this.anim.play('EquipmentTaken');
        cc.director.emit(EventConstant.PLAYER_CHANGEEQUIPMENT, { detail: { equipData: this.data } })
        this.node.getChildByName('shadow').active = false;
        this.equipmentDialog.node.active = false;
        this.scheduleOnce(() => {
            if (this.node) {
                this.destroy();
            }
        }, 1);
        let currequipments = Logic.mapManager.getCurrentMapEquipments();
        let newlist: EquipmentData[] = new Array();
        if (currequipments) {
            for (let temp of currequipments) {
                if (temp.uuid && temp.uuid != this.data.uuid) {
                    newlist.push(temp);
                }
            }
        }
        Logic.mapManager.setCurrentEquipmentsArr(newlist);
        cc.director.emit(EventConstant.PLAY_AUDIO,{detail:{name:AudioPlayer.PICK_UP}})

    }
    // onBeginContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
    //     let player = otherCollider.body.node.getComponent(Player);
    //     if (player) {
    //         this.equipmentDialog.showDialog();
    //     }
    // }
    // onEndContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
    //     let player = otherCollider.body.node.getComponent(Player);
    //     if (player) {
    //         this.equipmentDialog.hideDialog();
    //     }
    // }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
            this.equipmentDialog.hideDialog();
        }
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
            this.equipmentDialog.showDialog();
        }
    }
    // update (dt) {}
}
