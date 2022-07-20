import { EventHelper } from '../logic/EventHelper'
import Player from '../logic/Player'
import Logic from '../logic/Logic'
import ItemData from '../data/ItemData'
import AudioPlayer from '../utils/AudioPlayer'
import FromData from '../data/FromData'
import ShopTable from '../building/ShopTable'
import Achievement from '../logic/Achievement'
import Status from '../status/Status'
import StatusData from '../data/StatusData'
import StatusManager from '../manager/StatusManager'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//物品
const { ccclass, property } = cc._decorator

@ccclass
export default class Item extends cc.Component {
    public static readonly EMPTY = 'emptyitem'
    public static readonly HEART = 'heart'
    public static readonly DREAM = 'dream'
    public static readonly BOTTLE_HEALING = 'bottle001'
    public static readonly BOTTLE_MOVESPEED = 'bottle002'
    public static readonly BOTTLE_ATTACK = 'bottle003'
    public static readonly BOTTLE_DREAM = 'bottle004'
    public static readonly BOTTLE_REMOTE = 'bottle005'
    public static readonly BOTTLE_JUMP = 'bottle006'
    public static readonly REDCAPSULE = 'redcapsule'
    public static readonly BLUECAPSULE = 'bluecapsule'
    public static readonly SHIELD = 'shield'
    public static readonly GOLDAPPLE = 'goldapple'
    public static readonly GOLDFINGER = 'goldfinger'
    public static readonly FRIEDRICE = 'food000'
    anim: cc.Animation
    data: ItemData = new ItemData()
    shopTable: ShopTable

    sprite: cc.Sprite
    mat: cc.MaterialVariant
    taketips: cc.Node
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.taketips = this.node.getChildByName('sprite').getChildByName('taketips')
    }

    start() {
        this.anim = this.getComponent(cc.Animation)
    }
    init(resName: string, pos: cc.Vec3, count?: number, shopTable?: ShopTable) {
        this.data.valueCopy(Logic.items[resName])
        this.data.uuid = this.data.genNonDuplicateID()
        for (let ex of this.data.exTriggers) {
            ex.uuid = this.data.genNonDuplicateID()
        }
        this.data.pos = pos
        this.data.count = count ? count : this.data.count
        if (shopTable) {
            this.shopTable = shopTable
            shopTable.data.itemdata = new ItemData()
            shopTable.data.itemdata.valueCopy(Logic.items[resName])
            shopTable.data.price = this.data.price
        }
        let spriteFrame = Logic.spriteFrameRes(this.data.resName)
        if (spriteFrame) {
            this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite)
            this.node.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = spriteFrame
            this.sprite.node.width = spriteFrame.getOriginalSize().width
            this.sprite.node.height = spriteFrame.getOriginalSize().height
            this.mat = this.sprite.getComponent(cc.Sprite).getMaterial(0)
            this.mat.setProperty('textureSizeWidth', spriteFrame.getTexture().width * this.sprite.node.scaleX)
            this.mat.setProperty('textureSizeHeight', spriteFrame.getTexture().height * this.sprite.node.scaleY)
            this.mat.setProperty('outlineColor', cc.color(200, 200, 200))
            this.highLight(false)
        }
    }

    highLight(isHigh: boolean) {
        if (!this.mat) {
            this.mat = this.sprite.getComponent(cc.Sprite).getMaterial(0)
        }
        this.mat.setProperty('openOutline', isHigh ? 1 : 0)
    }

    public taken(player: Player, isReplace: boolean): boolean {
        if (this.data.isTaken) {
            return false
        }
        if (this.data.canSave) {
            if (this.shopTable) {
                if (Logic.coins >= this.data.price) {
                    EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: -this.data.price })
                    let arr = [AudioPlayer.COIN, AudioPlayer.COIN1, AudioPlayer.COIN2]
                    AudioPlayer.play(arr[Logic.getRandomNum(0, arr.length - 1)])
                    this._taken(player, isReplace)
                    this.shopTable.sale(true)
                    return true
                }
            } else {
                this._taken(player, isReplace)
                return true
            }
        } else {
            this._taken(player, isReplace)
            return true
        }
        return false
    }
    private _taken(player: Player, isReplace: boolean) {
        if (!this.data.isTaken && this.anim) {
            this.anim.play('ItemTaken')
            Achievement.addItemAchievement(this.data.resName)
            this.data.isTaken = true
            AudioPlayer.play(AudioPlayer.PICK_ITEM)
            if (this.data.canSave < 1) {
                Item.userIt(this.data, player)
            } else {
                EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemData: this.data, isReplace: isReplace })
            }
            this.scheduleOnce(() => {
                if (this.node) {
                    this.node.active = false
                }
            }, 3)
        }
        let curritems = Logic.mapManager.getCurrentMapItems()
        let newlist: ItemData[] = new Array()
        if (curritems) {
            for (let temp of curritems) {
                if (temp.uuid && temp.uuid != this.data.uuid) {
                    newlist.push(temp)
                }
            }
        }
        Logic.mapManager.setCurrentItemsArr(newlist)
        EventHelper.emit(EventHelper.HUD_GROUND_ITEM_INFO_HIDE)
    }
    static userIt(data: ItemData, player: Player) {
        let from = FromData.getClone(data.nameCn, data.resName)
        if (data.resName != Item.EMPTY && data.canSave) {
            AudioPlayer.play(AudioPlayer.PICK_ITEM)
        }
        switch (data.resName) {
            case Item.GOLDFINGER:
                player.stopAllDebuffs()
                break
        }
        if (data.statusList.length > 0) {
            let arr = data.statusList.split(',')
            for (let status of arr) {
                player.addStatus(status, from)
                if (player.dungeon.nonPlayerManager.isPetAlive()) {
                    player.dungeon.nonPlayerManager.pet.addStatus(status, from)
                }
            }
        }
        player.sanityChange(data.sanity)
        if (data.solidSatiety > 0 || data.liquidSatiety > 0) {
            AudioPlayer.play(AudioPlayer.DRINK)
            if (data.solidSatiety) {
                let sd = new StatusData()
                sd.valueCopy(Logic.status[StatusManager.EAT])
                sd.solidDirect = data.solidSatiety
                player.addCustomStatus(sd, from)
            }
            if (data.liquidSatiety) {
                let sd = new StatusData()
                sd.valueCopy(Logic.status[StatusManager.DRINK])
                sd.liquidDirect = data.liquidSatiety
                player.addCustomStatus(sd, from)
            }
        }
    }
    // update (dt) {}
}
