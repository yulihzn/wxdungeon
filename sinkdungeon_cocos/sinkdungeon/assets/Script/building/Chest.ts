import Dungeon from "../logic/Dungeon";
import { EventHelper } from "../logic/EventHelper";
import Logic from "../logic/Logic";
import Building from "./Building";
import AudioPlayer from "../utils/AudioPlayer";
import IndexZ from "../utils/IndexZ";
import EquipmentManager from "../manager/EquipmentManager";
import CCollider from "../collider/CCollider";

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
        let openFrame = Logic.spriteFrameRes(name1);
        let closeFrame = Logic.spriteFrameRes(name2);
        this.openSpriteFrame = openFrame;
        this.closeSpriteFrame = closeFrame;
        this.sprite.getComponent(cc.Sprite).spriteFrame = this.openSpriteFrame;
        if (isOpen) {
            this.sprite.getComponent(cc.Sprite).spriteFrame = this.closeSpriteFrame;
        }
    }

    seDefaultPos(defaultPos: cc.Vec3) {
        this.data.defaultPos = defaultPos;
        this.entity.Transform.position = Dungeon.getPosInMap(defaultPos);
        this.node.position = this.entity.Transform.position.clone();
        this.node.zIndex = IndexZ.getActorZIndex(this.entity.Transform.position);
    }

    openChest() {
        if (this.data.isOpen) {
            return;
        }
        this.data.isOpen = true;
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.PICK_UP } });
        cc.tween(this.sprite).to(0.1, { position: cc.v3(5, 16) }).to(0.1, { position: cc.v3(-5, 0) }).to(0.1, { position: cc.v3(5, 0) })
            .to(0.1, { position: cc.v3(-5, 0) }).to(0.1, { position: cc.v3(0, 0) }).call(() => {
                this.sprite.getComponent(cc.Sprite).spriteFrame = this.closeSpriteFrame;
                if (this.node.parent) {
                    let dungeon = this.node.parent.getComponent(Dungeon);
                    if (dungeon) {
                        let rand4save = Logic.mapManager.getRandom4Save(this.seed);
                        if(Logic.isCheatMode){
                            dungeon.addEquipment(EquipmentManager.CLOAK_WARRIOR, Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality);
                            dungeon.addEquipment(EquipmentManager.REMOTE_BASKETBALL, Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality);

                        }
                        // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.HEART);
                        // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.DREAM);
                        // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.BOTTLE_DREAM);
                        // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.BOTTLE_HEALING);
                        // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.BOTTLE_MOVESPEED);
                        // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.BOTTLE_REMOTE);
                        // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.BOTTLE_ATTACK);
                        // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), "food000");
                        // dungeon.addEquipment(EquipmentManager.WEAPON_BLOOD, Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality);
                        // dungeon.addEquipment(EquipmentManager.WEAPON_CHOPPER, Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality);
                        // dungeon.addEquipment(EquipmentManager.SHIELD_CARDOOR, Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality);
                        // dungeon.addEquipment(EquipmentManager.SHIELD_CIRCLE, Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality);
                        // dungeon.addEquipment(EquipmentManager.REMOTE_CROSSBOW, Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality);
                        // dungeon.addEquipment(EquipmentManager.REMOTE_RPG, Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality);
                        dungeon.addEquipment(Logic.getRandomEquipType(rand4save), Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality);
                    }
                }
            }).start();
        let saveChest = Logic.mapManager.getCurrentMapBuilding(this.data.defaultPos);
        if (saveChest) {
            saveChest.isOpen = this.data.isOpen;
            saveChest.quality = this.data.quality;
        }else{
            Logic.mapManager.setCurrentBuildingData(this.data.clone());
        }
    }

    onColliderStay(other: CCollider, self: CCollider) {
        if (other.tag == CCollider.TAG.PLAYER) {
            if (!this.data.isOpen) {
                this.openChest();
            }
        }
    }
}
