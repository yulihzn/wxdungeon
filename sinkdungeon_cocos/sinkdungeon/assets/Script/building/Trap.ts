import Dungeon from '../logic/Dungeon'
import Player from '../logic/Player'
import DamageData from '../data/DamageData'
import Building from './Building'
import FromData from '../data/FromData'
import IndexZ from '../utils/IndexZ'
import InventoryManager from '../manager/InventoryManager'
import CCollider from '../collider/CCollider'

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
export default class Trap extends Building {
    @property(cc.SpriteFrame)
    openSpriteFrame: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    closeSpriteFrame: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    halfSpriteFrame: cc.SpriteFrame = null
    isOpen: boolean = false
    pos: cc.Vec3 = cc.v3(0, 0)
    private sprite: cc.Node
    private timeDelay = 0
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite')
    }

    start() {}

    setPos(pos: cc.Vec3) {
        this.pos = pos
        this.entity.Transform.position = Dungeon.getPosInMap(pos)
        this.node.position = this.entity.Transform.position.clone()
        this.node.zIndex = IndexZ.FLOOR
    }

    openTrap() {
        if (this.isOpen) {
            return
        }
        this.isOpen = true
        // this.openSpriteFrame.getTexture().setAliasTexParameters();
        this.sprite.getComponent(cc.Sprite).spriteFrame = this.openSpriteFrame
        this.scheduleOnce(() => {
            this.isOpen = false
            if (this.halfSpriteFrame) {
                this.sprite.getComponent(cc.Sprite).spriteFrame = this.halfSpriteFrame
                this.scheduleOnce(() => {
                    if (this.closeSpriteFrame) {
                        this.sprite.getComponent(cc.Sprite).spriteFrame = this.closeSpriteFrame
                    }
                }, 0.2)
            }
        }, 0.5)
    }

    onColliderStay(other: CCollider, self: CCollider) {
        if (other.tag == CCollider.TAG.PLAYER) {
            if (this.isOpen) {
                this.isOpen = false
                let player = other.getComponent(Player)
                if (player && player.inventoryMgr.getEquipBySuit(player.inventoryMgr.equips[InventoryManager.SHOES]).ignoreTrap < 1) {
                    player.takeDamage(new DamageData(1), FromData.getClone(this.actorName(), 'trap001', this.node.position), this)
                }
            }
        }
    }

    update(dt) {
        this.timeDelay += dt
        if (this.timeDelay > 3) {
            this.openTrap()
            this.timeDelay = 0
        }
    }
    actorName() {
        return '尖刺'
    }
}
