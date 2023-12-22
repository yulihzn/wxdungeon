import { MoveComponent } from './../ecs/component/MoveComponent'
import Logic from '../logic/Logic'
import EquipmentData from '../data/EquipmentData'
import { EventHelper } from '../logic/EventHelper'
import ShopTable from '../building/ShopTable'
import Dungeon from '../logic/Dungeon'
import AudioPlayer from '../utils/AudioPlayer'
import Achievement from '../logic/Achievement'
import InventoryManager from '../manager/InventoryManager'
import BaseNodeComponent from '../base/BaseNodeComponent'
import Player from '../logic/Player'

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
export default class Equipment extends BaseNodeComponent {
    @property(cc.Node)
    root: cc.Node = null
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Sprite)
    shadow: cc.Sprite = null
    data: EquipmentData = new EquipmentData()
    anim: cc.Animation
    pos: cc.Vec3 = cc.v3(0, 0)
    isTaken = false
    shopTable: ShopTable
    mat: cc.MaterialVariant
    taketips: cc.Node
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad()
        this.isTaken = false
        this.taketips = this.sprite.node.getChildByName('taketips')
        this.entity.NodeRender.root = this.root
    }
    refresh(data: EquipmentData) {
        this.data.valueCopy(data)
        let spriteFrame = Logic.spriteFrameRes(this.data.img)
        if (data.equipmentType == InventoryManager.TROUSERS) {
            spriteFrame = data.trouserslong == 1 ? Logic.spriteFrameRes('trousers000') : spriteFrame
        }
        this.sprite.node.scale = 4
        this.shadow.node.scale = 4
        if (data.equipmentType == InventoryManager.CLOTHES) {
            spriteFrame = Logic.spriteFrameRes(this.data.img + 'anim0')
        } else if (data.equipmentType == InventoryManager.HELMET) {
            spriteFrame = Logic.spriteFrameRes(this.data.img + 'anim0')
        } else if (data.equipmentType == InventoryManager.REMOTE) {
            spriteFrame = Logic.spriteFrameRes(this.data.img + 'anim0')
        } else if (data.equipmentType == InventoryManager.WEAPON) {
            this.sprite.node.scale = 3
            this.shadow.node.scale = 3
        }
        this.sprite.spriteFrame = spriteFrame
        this.sprite.node.width = spriteFrame.getOriginalSize().width
        this.sprite.node.height = spriteFrame.getOriginalSize().height
        this.shadow.spriteFrame = this.sprite.spriteFrame
        let color = cc.color(255, 255, 255).fromHEX(this.data.color)
        this.sprite.node.color = color
        this.mat = this.sprite.getMaterial(0)
        this.mat.setProperty('textureSizeWidth', spriteFrame.getTexture().width * this.sprite.node.scaleX)
        this.mat.setProperty('textureSizeHeight', spriteFrame.getTexture().height * this.sprite.node.scaleY)
        this.mat.setProperty('outlineColor', cc.color(200, 200, 200))
        this.highLight(false)
        if (data.equipmentType == 'remote') {
            this.sprite.node.width = this.sprite.node.width / 2
            this.sprite.node.height = this.sprite.node.height / 2
        }
        this.shadow.node.width = this.sprite.node.width
        this.shadow.node.height = this.sprite.node.height
        this.data.pos = Dungeon.getIndexInMap(this.node.position.clone())
        this.entity.Move.linearVelocityZ = 6
        this.shadow.node.angle = this.sprite.node.angle
        this.entity.Transform.position = this.node.position.clone()
    }

    fly(flag: boolean) {
        if (flag) {
            this.entity.Move.gravity = 0
            if (this.entity.Transform.z <= 0) {
                this.entity.Move.linearVelocityZ = 4
            } else if (this.entity.Transform.z > 32) {
                this.entity.Move.linearVelocityZ = 0
            }
        } else {
            this.entity.Move.gravity = MoveComponent.DEFAULT_GRAVITY
        }
    }
    highLight(isHigh: boolean) {
        if (!this.mat) {
            this.mat = this.sprite.getComponent(cc.Sprite).getMaterial(0)
        }
        this.fly(isHigh)
        this.mat.setProperty('openOutline', isHigh ? 1 : 0)
    }

    start() {
        // Logic.setAlias(this.node);
        this.anim = this.getComponent(cc.Animation)
    }
    onEnable() {}
    taken(isReplace: boolean): boolean {
        if (this.isTaken) {
            return false
        }
        if (this.shopTable) {
            if (Logic.data.coins >= this.data.price) {
                EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: -this.data.price })
                let arr = [AudioPlayer.COIN, AudioPlayer.COIN1, AudioPlayer.COIN2]
                AudioPlayer.play(arr[Logic.getRandomNum(0, arr.length - 1)])
                this.shopTable.sale(true)
                this._taken(isReplace)
                return true
            }
        } else {
            this._taken(isReplace)
            return true
        }
        return false
    }
    private _taken(isReplace: boolean) {
        this.isTaken = true
        this.anim.play('EquipmentTaken')
        Achievement.addEquipsAchievement(this.data.img)
        EventHelper.emit(EventHelper.PLAYER_CHANGEEQUIPMENT, { equipmentType: this.data.equipmentType, equipData: this.data, isReplace: isReplace })
        this.node.getChildByName('shadow').active = false
        EventHelper.emit(EventHelper.HUD_GROUND_EQUIPMENT_INFO_HIDE)
        this.scheduleOnce(() => {
            if (this.node) {
                this.destroyEntityNode()
            }
        }, 1)
        let currequipments = Logic.mapManager.getCurrentMapEquipments()
        let newlist: EquipmentData[] = new Array()
        if (currequipments) {
            for (let temp of currequipments) {
                if (temp.uuid && temp.uuid != this.data.uuid) {
                    newlist.push(temp)
                }
            }
        }
        Logic.mapManager.setCurrentEquipmentsArr(newlist)
        AudioPlayer.play(AudioPlayer.PICK_UP)
    }
}
