import Dungeon from "../Dungeon";
import { EventConstant } from "../EventConstant";
import Player from "../Player";
import EquipmentManager from "../Manager/EquipmentManager";
import Logic from "../Logic";


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
export default class Chest extends cc.Component {

    @property(cc.SpriteFrame)
    openSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    closeSpriteFrame: cc.SpriteFrame = null;
    isOpen: boolean = false;
    pos: cc.Vec2 = cc.v2(0, 0);
    private sprite: cc.Node;
    private timeDelay = 0;
    quality = 1;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite');
    }

    start() {

    }
    setQuality(quality: number,isOpen:boolean) {
        this.quality = quality;
        this.isOpen = isOpen;
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite');
        }
        let name1 = 'chest001';
        let name2 = 'chestopen001';
        switch (quality) {
            case 1: name1 = 'chest001'; name2 = 'chestopen001'; break;
            case 2: name1 = 'chest003'; name2 = 'chestopen003'; break;
            case 3: name1 = 'chest002'; name2 = 'chestopen002'; break;
        }
        let openFrame = Logic.spriteFrames[name1];
        let closeFrame = Logic.spriteFrames[name2];
        this.openSpriteFrame = openFrame;
        this.closeSpriteFrame = closeFrame;
        this.sprite.getComponent(cc.Sprite).spriteFrame = this.openSpriteFrame;
        if(isOpen){
            this.sprite.getComponent(cc.Sprite).spriteFrame = this.closeSpriteFrame;
        }
    }

    setPos(pos: cc.Vec2) {
        this.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - pos.y) * 100 + 1;
    }

    openChest() {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        let action = cc.sequence(cc.moveTo(0.1, 5, 16)
            , cc.moveTo(0.1, -5, 0), cc.moveTo(0.1, 5, 0)
            , cc.moveTo(0.1, -5, 0), cc.moveTo(0.1, 0, 0), cc.callFunc(() => {
                this.sprite.getComponent(cc.Sprite).spriteFrame = this.closeSpriteFrame;
                if (this.node.parent) {
                    let dungeon = this.node.parent.getComponent(Dungeon);
                    if (dungeon) {
                        // dungeon.addEquipment(EquipmentManager.WEAPON_CHOPPER, this.pos,null,this.quality);
                        // dungeon.addEquipment(EquipmentManager.WEAPON_KNIFE, this.pos,null,this.quality);
                        // dungeon.addEquipment(EquipmentManager.WEAPON_HUGEBLADE, this.pos,null,this.quality);
                        // dungeon.addEquipment(EquipmentManager.WEAPON_PITCHFORK, this.pos,null,this.quality);
                        dungeon.addEquipment(EquipmentManager.WEAPON_FRUITKNIFE, this.pos,null,this.quality);
                        dungeon.addEquipment(EquipmentManager.WEAPON_CROWBAR, this.pos,null,this.quality);
                        dungeon.addEquipment(EquipmentManager.WEAPON_KATANA, this.pos,null,this.quality);
                        // dungeon.addEquipment(EquipmentManager.equipments[Logic.getRandomNum(0,EquipmentManager.equipments.length-1)], this.pos,null,this.quality);
                    }
                }
            }));
        this.sprite.runAction(action);

    }

    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (other.tag == 3) {
            if (!this.isOpen) {
                this.openChest();
            }
        }
    }

    update(dt) {

    }
}
