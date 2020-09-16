import Dungeon from "../Dungeon";
import { EventHelper } from "../EventHelper";
import Logic from "../Logic";
import Building from "./Building";
import AudioPlayer from "../Utils/AudioPlayer";
import { ColliderTag } from "../Actor/ColliderTag";
import IndexZ from "../Utils/IndexZ";
import EquipmentManager from "../Manager/EquipmentManager";

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
export default class Chest extends Building {

    @property(cc.SpriteFrame)
    openSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    closeSpriteFrame: cc.SpriteFrame = null;
    private sprite: cc.Node;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite');
    }

    start() {

    }

    setQuality(quality: number, isOpen: boolean) {
        this.data.quality = quality;
        this.data.isOpen = isOpen;
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite');
        }
        let name1 = 'chest001';
        let name2 = 'chestopen001';
        switch (quality) {
            case 1: name1 = 'chest001'; name2 = 'chestopen001'; break;
            case 2: name1 = 'chest003'; name2 = 'chestopen003'; break;
            case 3: name1 = 'chest002'; name2 = 'chestopen002'; break;
            case 4: name1 = 'chest002'; name2 = 'chestopen002'; break;
        }
        let openFrame = Logic.spriteFrames[name1];
        let closeFrame = Logic.spriteFrames[name2];
        this.openSpriteFrame = openFrame;
        this.closeSpriteFrame = closeFrame;
        this.sprite.getComponent(cc.Sprite).spriteFrame = this.openSpriteFrame;
        if (isOpen) {
            this.sprite.getComponent(cc.Sprite).spriteFrame = this.closeSpriteFrame;
        }
    }

    seDefaultPos(defaultPos: cc.Vec3) {
        this.data.defaultPos = defaultPos;
        this.node.position = Dungeon.getPosInMap(defaultPos);
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position);
    }

    openChest() {
        if (this.data.isOpen) {
            return;
        }
        this.data.isOpen = true;
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.PICK_UP } });
        let action = cc.sequence(cc.moveTo(0.1, 5, 16)
            , cc.moveTo(0.1, -5, 0), cc.moveTo(0.1, 5, 0)
            , cc.moveTo(0.1, -5, 0), cc.moveTo(0.1, 0, 0), cc.callFunc(() => {
                this.sprite.getComponent(cc.Sprite).spriteFrame = this.closeSpriteFrame;
                if (this.node.parent) {
                    let dungeon = this.node.parent.getComponent(Dungeon);
                    if (dungeon) {
                        let rand4save = Logic.mapManager.getCurrentRoomRandom4Save();
                        // dungeon.addEquipment(EquipmentManager.SHIELD_CIRCLE, this.data.pos, null, this.data.quality);
                        // dungeon.addEquipment(EquipmentManager.WEAPON_PITCHFORK, this.data.pos, null, this.data.quality);
                        // dungeon.addEquipment(EquipmentManager.REMOTE_SHURIKEN, this.data.pos, null, this.data.quality);
                        // dungeon.addEquipment(EquipmentManager.SHIELD_POLICE, this.data.pos, null, this.data.quality);
                        // dungeon.addEquipment(EquipmentManager.SHIELD_CARDOOR, this.data.pos, null, this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.REMOTE_CROSSBOW, this.data.pos, null, this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.WEAPON_SHADOW, this.data.pos, null, this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.WEAPON_JUNGLEFORK, this.data.pos,null,this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.WEAPON_HUGEBLADE, this.data.pos,null,this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.WEAPON_OLDROOTDAGGER, this.data.pos,null,this.data.quality);
                        dungeon.addEquipment(Logic.getRandomEquipType(rand4save), this.data.defaultPos, null, this.data.quality);
                    }
                }
            }));
        this.sprite.runAction(action);
        let saveChest = Logic.mapManager.getCurrentMapBuilding(this.data.defaultPos);
        let newlist = new Array();
        let needNew = true;
        if (saveChest) {
            saveChest.isOpen = this.data.isOpen;
            saveChest.quality = this.data.quality;
            needNew = false;
        }
        if (needNew) {
            newlist.push(this.data)
            Logic.mapManager.setCurrentBuildingData(this.data);
        }
    }

    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (other.tag == ColliderTag.PLAYER) {
            if (!this.data.isOpen) {
                this.openChest();
            }
        }
    }

    update(dt) {

    }
}
