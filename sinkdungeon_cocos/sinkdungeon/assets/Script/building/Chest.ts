import Dungeon from '../logic/Dungeon'
import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'
import Building from './Building'
import AudioPlayer from '../utils/AudioPlayer'
import IndexZ from '../utils/IndexZ'
import EquipmentManager from '../manager/EquipmentManager'
import CCollider from '../collider/CCollider'
import Item from '../item/Item'
import AffixManager from '../manager/AffixManager'
import MapManager from '../manager/MapManager'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class Chest extends Building {
    @property(cc.SpriteFrame)
    openSpriteFrame: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    closeSpriteFrame: cc.SpriteFrame = null
    private sprite: cc.Node
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite')
    }

    start() {}

    setQuality(quality: number, triggerCount: number) {
        this.data.quality = quality
        this.data.triggerCount = triggerCount
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite')
        }
        if (quality > 0) {
            this.sprite.color = cc.Color.WHITE.fromHEX(AffixManager.QUALITY_COLORS[quality])
        }
        this.sprite.getComponent(cc.Sprite).spriteFrame = triggerCount < 1 ? this.closeSpriteFrame : this.openSpriteFrame
    }

    seDefaultPos(defaultPos: cc.Vec3) {
        this.data.defaultPos = defaultPos
        this.entity.Transform.position = Dungeon.getPosInMap(defaultPos)
        this.node.position = this.entity.Transform.position.clone()
        this.node.zIndex = IndexZ.getActorZIndex(this.entity.Transform.position)
    }

    openChest() {
        if (this.data.triggerCount > 0) {
            return
        }
        AudioPlayer.play(AudioPlayer.OPEN_CHEST)
        this.data.triggerCount = 1
        cc.tween(this.sprite)
            .to(0.1, { position: cc.v3(5, 16) })
            .to(0.1, { position: cc.v3(-5, 0) })
            .to(0.1, { position: cc.v3(5, 0) })
            .to(0.1, { position: cc.v3(-5, 0) })
            .to(0.1, { position: cc.v3(0, 0) })
            .call(() => {
                this.sprite.getComponent(cc.Sprite).spriteFrame = this.openSpriteFrame
                if (this.node.parent) {
                    let dungeon = this.node.parent.getComponent(Dungeon)
                    if (dungeon) {
                        let rand4save = Logic.mapManager.getRandom4Save(this.seed, MapManager.RANDOM_BUILDING)
                        if (Logic.isCheatMode) {
                            // dungeon.addEquipment(EquipmentManager.CLOTHES_JUNGLE, Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality)
                            // dungeon.addEquipment(EquipmentManager.SHOES_JUNGLE, Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality)
                            // dungeon.addEquipment('shoes011', Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality)
                            // dungeon.addEquipment('clothes028', Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality)
                            // dungeon.addEquipment('trousers013', Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality)
                            // dungeon.addEquipment('helmet031', Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality)
                            dungeon.addEquipment('shield002', Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality)
                            // dungeon.addEquipment(EquipmentManager.REMOTE_ALIENGUN, Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality)
                            // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.BOTTLE_DREAM);
                            // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.BOTTLE_HEALING)
                            // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.BOTTLE_JUMP)
                            // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.BOTTLE_MOVESPEED)
                            // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.BOTTLE_REMOTE)
                            // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.BOTTLE_ATTACK)
                            // dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos), Item.BOTTLE_DREAM)
                        }
                        dungeon.addEquipment(Logic.getRandomEquipType(rand4save), Dungeon.getPosInMap(this.data.defaultPos), null, this.data.quality)
                    }
                }
            })
            .start()
        let saveChest = Logic.mapManager.getCurrentMapBuilding(this.data.defaultPos)
        if (saveChest) {
            saveChest.triggerCount = this.data.triggerCount
            saveChest.quality = this.data.quality
        } else {
            Logic.mapManager.setCurrentBuildingData(this.data.clone())
        }
    }

    onColliderStay(other: CCollider, self: CCollider) {
        if (other.tag == CCollider.TAG.PLAYER) {
            if (this.data.triggerCount < 1) {
                this.openChest()
            }
        }
    }
}
