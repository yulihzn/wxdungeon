import Dungeon from "../Dungeon";
import { EventHelper } from "../EventHelper";
import Player from "../Player";
import EquipmentManager from "../Manager/EquipmentManager";
import Logic from "../Logic";
import ChestData from "../Data/ChestData";
import Building from "./Building";
import RectDungeon from "../Rect/RectDungeon";
import AudioPlayer from "../Utils/AudioPlayer";
import RoomType from "../Rect/RoomType";


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
    private timeDelay = 0;
    data: ChestData = new ChestData();
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

    setPos(pos: cc.Vec3) {
        this.data.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - pos.y) * 10 + 1;
    }

    openChest() {
        if (this.data.isOpen) {
            return;
        }
        this.data.isOpen = true;
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MONSTER_HIT } });
        let action = cc.sequence(cc.moveTo(0.1, 5, 16)
            , cc.moveTo(0.1, -5, 0), cc.moveTo(0.1, 5, 0)
            , cc.moveTo(0.1, -5, 0), cc.moveTo(0.1, 5, 0)
            , cc.moveTo(0.1, -5, 0), cc.moveTo(0.1, 5, 0)
            , cc.moveTo(0.1, -5, 0), cc.moveTo(0.1, 0, 0), cc.callFunc(() => {
                this.sprite.getComponent(cc.Sprite).spriteFrame = this.closeSpriteFrame;
                if (this.node.parent) {
                    let dungeon = this.node.parent.getComponent(Dungeon);
                    if (dungeon) {
                        if (Logic.level < 1 && Logic.mapManager.getCurrentRoomType() != RoomType.TEST_ROOM) {
                            // dungeon.addEquipment(EquipmentManager.WEAPON_DEATH, this.data.pos, null, this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.REMOTE_LONGBOW, this.data.pos, null, this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.REMOTE_WAND, this.data.pos, null, this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.REMOTE_CHICKEN, this.data.pos, null, this.data.quality);
                            dungeon.addEquipment(Logic.getRandomEquipType(), this.data.pos, null, this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.WEAPON_TOXICDAGGER, this.data.pos,null,this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.WEAPON_BLOOD, this.data.pos,null,this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.WEAPON_KUNAI, this.data.pos,null,this.data.quality);
                        } else {
                            // dungeon.addEquipment(EquipmentManager.WEAPON_KUNAI, this.data.pos,null,this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.WEAPON_JUNGLEFORK, this.data.pos,null,this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.WEAPON_HUGEBLADE, this.data.pos,null,this.data.quality);
                            // dungeon.addEquipment(EquipmentManager.WEAPON_OLDROOTDAGGER, this.data.pos,null,this.data.quality);
                            dungeon.addEquipment(Logic.getRandomEquipType(), this.data.pos, null, this.data.quality);
                            if(Logic.getHalfChance()){
                                cc.director.emit(EventHelper.DUNGEON_ADD_OILGOLD, { detail: { pos: this.node.position, count: Logic.getRandomNum(1, 10) } });
                            }
                        }
                    }
                }
            }));
        this.sprite.runAction(action);
        let currchests = Logic.mapManager.getCurrentMapChests();
        let newlist = new Array();
        let needNew = true;
        if (currchests) {
            for (let tempchest of currchests) {
                if (tempchest.pos.equals(this.data.pos)) {
                    tempchest.isOpen = this.data.isOpen;
                    tempchest.quality = this.data.quality;
                    needNew = false;
                }
            }
        }
        if (needNew) {
            newlist.push(this.data)
            Logic.mapManager.setCurrentChestsArr(newlist);
        }
    }

    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (other.tag == 3) {
            if (!this.data.isOpen) {
                this.openChest();
            }
        }
    }

    update(dt) {

    }
}
