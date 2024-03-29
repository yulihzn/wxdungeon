// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Building from './Building'
import Logic from '../logic/Logic'
import CCollider from '../collider/CCollider'
import DamageData from '../data/DamageData'
import AudioPlayer from '../utils/AudioPlayer'
import Dungeon from '../logic/Dungeon'
import InventoryManager from '../manager/InventoryManager'
import IndexZ from '../utils/IndexZ'
import FromData from '../data/FromData'
import Actor from '../base/Actor'
import Tips from '../ui/Tips'
import Player from '../logic/Player'
import MapManager from '../manager/MapManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class NormalBuilding extends Building {
    @property(cc.Node)
    root: cc.Node = null
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Node)
    shadow: cc.Node = null
    @property(Tips)
    tips: Tips = null
    resLength = 1
    dungeon: Dungeon
    private mat: cc.MaterialVariant
    // LIFE-CYCLE CALLBACKS:
    private _breakable = false
    static readonly PREFIX_PLATFORM = 'platform'
    static readonly PREFIX_HITBUILDING = 'hitbuilding'
    static readonly PREFIX_STAIRS = 'stairs'
    static readonly PREFIX_FURNITURE = 'furniture'
    private _tipsInteract: (isLongPress: boolean, player: Player) => void
    private _tipsEnter: () => void
    private _tipsExit: () => void

    onLoad() {
        this.tips.onInteract((isLongPress: boolean, player: Player) => {
            this.tipsInteract(isLongPress, player)
        })
        this.tips.onEnter(() => {
            this.tipsEnter()
        })
        this.tips.onExit(() => {
            this.tipsExit()
        })
    }
    tipsInteract(isLongPress: boolean, player: Player): void {
        if (this._tipsInteract) {
            this._tipsInteract(isLongPress, player)
        }
    }
    tipsEnter(): void {
        if (this._tipsEnter) {
            this._tipsEnter()
        }
    }
    tipsExit(): void {
        if (this._tipsExit) {
            this._tipsExit()
        }
    }
    get breakable() {
        return this._breakable && this.data.currentHealth > 0 && this.data.currentHealth < 9999
    }

    init(dungeon: Dungeon, tipsInteract?: (isLongPress: boolean, player: Player) => void, tipsEnter?: () => void, tipsExit?: () => void) {
        this.dungeon = dungeon
        this._tipsInteract = tipsInteract
        this._tipsEnter = tipsEnter
        this._tipsExit = tipsExit
        this._breakable = this.data.id.indexOf('hitbuilding') > -1
        if (this.data.custom) {
            return
        }
        let pcollider = this.getComponent(CCollider)
        if (this.data.collider.length > 0) {
            let arr = this.data.collider.split(',')
            pcollider.offset = cc.v2(parseInt(arr[0]), parseInt(arr[1]))
            pcollider.setSize(cc.size(parseInt(arr[2]), parseInt(arr[3])), parseInt(arr[4]))
            this.shadow.width = pcollider.w
            this.shadow.height = pcollider.h
            this.shadow.x = pcollider.offsetX
            this.shadow.y = pcollider.offsetY
        }
        this.sprite.node.scale = this.data.scale
        if (this.data.spritePos.length > 0) {
            let arr = this.data.spritePos.split(',')
            this.sprite.node.x = parseInt(arr[0])
            this.sprite.node.y = parseInt(arr[1])
        }

        this.root.y = this.data.z
        this.entity.Transform.z = this.data.z
        this.entity.Move.gravity = 0
        if (this._breakable) {
            let index = 0
            while (Logic.spriteFrameRes(this.data.id + `anim${index++}`)) {}
            this.resLength = index - 1
        }
        let resIndex = this.getResIndex()
        this.changeRes(resIndex)
        if (resIndex > 0 && resIndex >= this.resLength - 1) {
            pcollider.zHeight = this.data.breakZ
        }
        if (this.data.indexZ) {
            this.node.zIndex = IndexZ.getActorZIndex(this.node.position.add(cc.v3(0, this.data.indexZ)))
        }
    }
    private getResIndex() {
        //根据贴图长度等分
        let percent = this.data.maxHealth / this.resLength
        //损失的血量除以等分取整得到贴图下标
        let index = Math.abs(Math.floor((this.data.maxHealth - this.data.currentHealth) / percent))
        return index - 1 > 0 ? index - 1 : 0
    }
    private changeRes(index: number) {
        if (this.data.custom) {
            return
        }
        let spriteFrame = Logic.spriteFrameRes(`${this.data.id}anim${index < 0 ? 0 : index}`)
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrameRes(`${this.data.id}`)
        }
        if (spriteFrame) {
            this.sprite.spriteFrame = spriteFrame
            this.sprite.node.width = spriteFrame.getOriginalSize().width
            this.sprite.node.height = spriteFrame.getOriginalSize().height
        }
    }
    takeDamage(damage: DamageData, from: FromData, actor?: Actor): boolean {
        if (!this.breakable) {
            return false
        }
        let hitNames = [AudioPlayer.MONSTER_HIT, AudioPlayer.MONSTER_HIT1, AudioPlayer.MONSTER_HIT2]
        AudioPlayer.play(hitNames[Logic.getRandomNum(0, 2)])
        this.data.currentHealth -= damage.getTotalDamage()

        this.changeRes(this.getResIndex())
        this.hitLight(true)
        this.scheduleOnce(() => {
            this.hitLight(false)
        }, 0.15)
        if (this.data.currentHealth <= 0) {
            let rand4save = Logic.mapManager.getRandom4Save(Logic.mapManager.getRebornSeed(this.seed), MapManager.RANDOM_BUILDING)
            let arr = this.data.breakEquipItems.split('#')
            for (let name of arr) {
                let temp = name.split(',')
                if (temp.length > 1 && rand4save.rand() > 1 - parseInt(temp[1])) {
                    if (InventoryManager.isEquipTag(temp[0])) {
                        this.dungeon.addEquipment(temp[0], Dungeon.getPosInMap(this.data.defaultPos), null, 1)
                    } else {
                        this.dungeon.addItem(this.entity.Transform.position.clone(), temp[0])
                    }
                }
            }
            this.getComponent(CCollider).zHeight = 16
        }
        Logic.mapManager.setCurrentBuildingData(this.data.clone())
        return true
    }
    hitLight(isHit: boolean) {
        if (!this.mat) {
            this.mat = this.sprite.node.getComponent(cc.Sprite).getMaterial(0)
        }
        this.mat.setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    }
    // update (dt) {}
}
