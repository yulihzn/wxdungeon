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

const { ccclass, property } = cc._decorator

@ccclass
export default class NormalBuilding extends Building {
    @property(cc.Node)
    root: cc.Node = null
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Node)
    shadow: cc.Node = null
    resLength = 1
    dungeon: Dungeon
    private mat: cc.MaterialVariant
    // LIFE-CYCLE CALLBACKS:
    private _breakable = false
    static readonly PREFIX_PLATFORM = 'platform'
    static readonly PREFIX_HITBUILDING = 'hitbuilding'
    static readonly PREFIX_STAIRS = 'stairs'
    get breakable() {
        return this._breakable && this.data.currentHealth > 0 && this.data.currentHealth < 9999
    }

    init(dungeon: Dungeon) {
        this.dungeon = dungeon
        this._breakable = this.data.id.indexOf('hitbuilding') > -1
        if (this.data.custom) {
            return
        }
        let pcollider = this.getComponent(CCollider)
        pcollider.stairsX = this.data.stairsX
        pcollider.stairsY = this.data.stairsY
        pcollider.stairsZ = this.data.stairsZ
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
    takeDamage(damage: DamageData): boolean {
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
            let rand4save = Logic.mapManager.getRandom4Save(Logic.mapManager.getRebornSeed(this.seed))
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
