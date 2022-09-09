import { EventHelper } from './../logic/EventHelper'
import Achievement from '../logic/Achievement'
import FurnitureData from '../data/FurnitureData'
import Dungeon from '../logic/Dungeon'
import Logic from '../logic/Logic'
import Tips from '../ui/Tips'
import AudioPlayer from '../utils/AudioPlayer'
import LocalStorage from '../utils/LocalStorage'
import Utils from '../utils/Utils'
import Building from './Building'
import RoomFishtank from './RoomFishtank'
import RoomStool from './RoomStool'
import RoomTv from './RoomTv'
import CCollider from '../collider/CCollider'
import NextStep from '../utils/NextStep'
import InventoryData from '../data/InventoryData'
import RoomWaterDispenser from './RoomWaterDispenser'
import Player from '../logic/Player'
import RoomTrashCan from './RoomTrashCan'
import RoomKitchen from './RoomKitchen'
import IndexZ from '../utils/IndexZ'
import EquipmentManager from '../manager/EquipmentManager'
import InventoryManager from '../manager/InventoryManager'

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
/**
 * 家具 家具在初次出现的时候会显示成快递盒子的样子，靠近出现交互提示，可以打开盒子显示该建筑并激活改建筑的效果
 */
@ccclass
export default class Furniture extends Building {
    static readonly SOFA = 'furniture001'
    static readonly BATH = 'furniture002'
    static readonly DINNER_TABLE = 'furniture003'
    static readonly WASHING_MACHINE = 'furniture004'
    static readonly COOKING_BENCH = 'furniture005'
    static readonly DOLL_MACHINE = 'furniture006'
    static readonly COOKING_BENCH_2 = 'furniture007'
    static readonly COOKING_BENCH_3 = 'furniture008'
    static readonly FRIDGE = 'furniture009'
    static readonly DESK = 'furniture010'
    static readonly CUPBOARD = 'furniture011'
    static readonly LITTLE_TABLE = 'furniture012'
    static readonly LITTLE_TABLE_1 = 'furniture013'
    static readonly LITTLE_TABLE_2 = 'furniture014'
    static readonly STOOL = 'furniture015'
    static readonly TV = 'furniture016'
    static readonly FISHTANK = 'furniture017'
    static readonly BOOKSHELF = 'furniture018'
    static readonly WATERDISPENER = 'furniture019'
    static readonly TRASHCAN = 'furniture020'
    sprite: cc.Sprite
    boxcover: cc.Sprite
    boxback: cc.Sprite
    lock: cc.Sprite
    tips: Tips
    isOpening = false
    anim: cc.Animation
    furnitureData: FurnitureData
    isNormal = false
    unlockStep: NextStep = new NextStep()
    bookStep: NextStep = new NextStep()

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.getComponent(cc.Animation)
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite)
        this.boxcover = this.node.getChildByName('boxcover').getComponent(cc.Sprite)
        this.boxback = this.node.getChildByName('boxback').getComponent(cc.Sprite)
        this.lock = this.node.getChildByName('lock').getComponent(cc.Sprite)
        this.tips = this.getComponentInChildren(Tips)
        this.tips.onInteract((isLongPress: boolean, player: Player) => {
            if (this.furnitureData) {
                if (this.furnitureData.purchased) {
                    if (this.furnitureData.isOpen) {
                        this.interact(player)
                    } else {
                        this.openBox()
                    }
                } else {
                    this.unlockStep.next(
                        () => {
                            this.getComponent(cc.Animation).play('FurnitureUnlock')
                            AudioPlayer.play(AudioPlayer.SELECT_FAIL)
                            Utils.toast(`暂未解锁，请下单购买:-D`, true, true)
                            EventHelper.emit(EventHelper.HUD_CELLPHONE_SHOW)
                        },
                        3,
                        true
                    )
                }
            }
        })
        this.tips.onEnter(() => {
            if (this.furnitureData) {
                if (this.furnitureData.purchased && this.furnitureData.isOpen) {
                    this.onTipsEnter(true)
                }
            }
        })
        this.tips.onExit(() => {
            if (this.furnitureData) {
                if (this.furnitureData.purchased && this.furnitureData.isOpen) {
                    this.onTipsExit(true)
                }
            }
        })
        EventHelper.on(EventHelper.HUD_FURNITURE_REFRESH, detail => {
            if (this.node && detail.id == this.furnitureData.id) {
                this.init(this.furnitureData, this.isNormal)
            }
        })
    }
    interact(player: Player) {
        switch (this.furnitureData.id) {
            case Furniture.TV:
                let tv = this.getComponent(RoomTv)
                if (tv) {
                    tv.interact(player)
                }
                break
            case Furniture.STOOL:
                let stool = this.getComponent(RoomStool)
                if (stool) {
                    stool.open()
                }
                break
            case Furniture.FISHTANK:
                let fishtank = this.getComponent(RoomFishtank)
                if (fishtank) {
                    fishtank.feed(player)
                }
                break
            case Furniture.WATERDISPENER:
                let waterdispenser = this.getComponent(RoomWaterDispenser)
                if (waterdispenser) {
                    waterdispenser.getWater(player)
                }
                break
            case Furniture.CUPBOARD:
                let equips = [
                    EquipmentManager.getNewEquipData(EquipmentManager.CLOTHES_VEST),
                    EquipmentManager.getNewEquipData(EquipmentManager.TROUSERS_LONG),
                    EquipmentManager.getNewEquipData(EquipmentManager.TROUSERS_SHORT),
                    EquipmentManager.getNewEquipData(EquipmentManager.CLOTHES_SHIRT),
                    EquipmentManager.getNewEquipData(EquipmentManager.SHOES_SKATEBOARD)
                ]
                if (this.furnitureData.storageList.length < 1) {
                    for (let i = 0; i < this.furnitureData.storage; i++) {
                        let data = new InventoryData()
                        if (i < equips.length && !this.data.isOpen) {
                            data = InventoryManager.buildEquipInventoryData(equips[i])
                        }
                        this.furnitureData.storageList.push(data)
                    }
                    LocalStorage.saveFurnitureData(this.furnitureData)
                }
                this.data.isOpen = true
                Logic.mapManager.setCurrentBuildingData(this.data.clone())
                EventHelper.emit(EventHelper.HUD_INVENTORY_SHOW, { id: this.furnitureData.id })
                break
            case Furniture.LITTLE_TABLE_2:
                Utils.toast(`现在是${Utils.getYear(Logic.realTime)}${Utils.getDay(Logic.realTime)}${Utils.getHour(Logic.realTime)}`, false, true)
                break
            case Furniture.TRASHCAN:
                let trashCan = this.getComponent(RoomTrashCan)
                if (trashCan) {
                    trashCan.getTrash()
                }
                break
            case Furniture.BOOKSHELF:
                this.bookStep.next(() => {
                    player.read()
                }, 5)
                break
            case Furniture.COOKING_BENCH:
                let kitchen = this.getComponent(RoomKitchen)
                if (kitchen) {
                    kitchen.getFood(player)
                }
                break
            case Furniture.DOLL_MACHINE:
                EventHelper.emit(EventHelper.HUD_DOLL_MACHINE_DIALOG)
                break
            default:
                AudioPlayer.play(AudioPlayer.SELECT_FAIL)
                Utils.toast('梦境开发中,无法使用。')
                break
        }
    }
    onTipsEnter(isTips: boolean) {
        switch (this.furnitureData.id) {
            case Furniture.FISHTANK:
                let fishtank = this.getComponent(RoomFishtank)
                if (fishtank) {
                    fishtank.zoomCamera(true)
                }
                break
            case Furniture.LITTLE_TABLE_2:
                this.zoomCamera(true)
                break
            case Furniture.WATERDISPENER:
                this.zoomCamera(true)
                break
            case Furniture.TRASHCAN:
                this.zoomCamera(true)
                break
        }
    }
    onTipsExit(isTips: boolean) {
        switch (this.furnitureData.id) {
            case Furniture.FISHTANK:
                let fishtank = this.getComponent(RoomFishtank)
                if (fishtank) {
                    fishtank.zoomCamera(false)
                }
                break
            case Furniture.TV:
                let tv = this.getComponent(RoomTv)
                if (tv) {
                    tv.close()
                }
                break
            case Furniture.LITTLE_TABLE_2:
                this.zoomCamera(false)
                break
            case Furniture.WATERDISPENER:
                this.zoomCamera(false)
                break
            case Furniture.TRASHCAN:
                this.zoomCamera(false)
                break
        }
    }
    init(furnitureData: FurnitureData, isNormal: boolean) {
        this.isNormal = isNormal
        let save = LocalStorage.getFurnitureData(furnitureData.id)
        if (save) {
            furnitureData.isOpen = save.isOpen
            furnitureData.purchased = save.purchased
            furnitureData.storage = save.storage ? save.storage : furnitureData.storage
            furnitureData.storageList = []
            if (save.storageList && save.storageList.length > 0) {
                for (let s of save.storageList) {
                    if (s.itemData) {
                        furnitureData.storageList.push(InventoryManager.buildItemInventoryData(s.itemData))
                    } else if (s.equipmentData) {
                        furnitureData.storageList.push(InventoryManager.buildEquipInventoryData(s.equipmentData))
                    }
                }
            }
        }
        if (furnitureData.price <= 0) {
            furnitureData.isOpen = true
            furnitureData.purchased = true
        }
        this.furnitureData = new FurnitureData()
        this.furnitureData.valueCopy(furnitureData)
        Logic.inventoryManager.furnitureMap.set(furnitureData.id, this.furnitureData)
        if (this.furnitureData.purchased) {
            this.sprite.node.color = cc.color(255, 255, 255, 255)
            this.sprite.node.opacity = 255
            this.lock.node.active = false
            if (this.furnitureData.isOpen) {
                this.boxcover.node.active = false
                this.boxback.node.active = false
            } else {
                this.boxcover.node.active = true
                this.boxback.node.active = true
            }
        } else {
            this.sprite.node.color = cc.color(128, 128, 128, 255)
            this.sprite.node.opacity = 128
            this.boxcover.node.active = false
            this.boxback.node.active = false
            this.lock.node.active = true
        }
        this.changeRes(this.furnitureData.resName, isNormal)
        let pcollider = this.getComponent(CCollider)
        if (isNormal) {
            if (this.furnitureData.collider.length > 0) {
                let arr = this.furnitureData.collider.split(',')
                pcollider.offset = cc.v2(parseInt(arr[0]), parseInt(arr[1]))
                pcollider.setSize(cc.size(parseInt(arr[2]), parseInt(arr[3])), parseInt(arr[4]))
            }
            if (this.furnitureData.spritePos.length > 0) {
                let arr = this.furnitureData.spritePos.split(',')
                this.sprite.node.x = parseInt(arr[0])
                this.sprite.node.y = parseInt(arr[1])
            }
        }
        LocalStorage.saveFurnitureData(this.furnitureData)
        Achievement.addFurnituresAchievement(this.furnitureData.id)
        this.node.zIndex = IndexZ.getActorZIndex(cc.v3(this.node.position.x, this.node.position.y + pcollider.offset.y))
    }
    // private isNormal() {
    //     if (
    //         this.furnitureData.id != Furniture.STOOL &&
    //         this.furnitureData.id != Furniture.TV &&
    //         this.furnitureData.id != Furniture.SOFA &&
    //         this.furnitureData.id != Furniture.COOKING_BENCH &&
    //         this.furnitureData.id != Furniture.FISHTANK
    //     ) {
    //         return true
    //     }
    //     return false
    // }
    changeRes(resName: string, isNormal: boolean) {
        let spriteFrame = Logic.spriteFrameRes(resName)
        if (spriteFrame) {
            if (isNormal) {
                this.sprite.spriteFrame = spriteFrame
                this.sprite.node.width = spriteFrame.getOriginalSize().width
                this.sprite.node.height = spriteFrame.getOriginalSize().height
                this.boxback.node.width = spriteFrame.getOriginalSize().width
                this.boxback.node.height = spriteFrame.getOriginalSize().height
                this.boxcover.node.width = spriteFrame.getOriginalSize().width
                this.boxcover.node.height = spriteFrame.getOriginalSize().height
                this.sprite.node.scale = this.furnitureData.scale
                this.tips.node.scale = 2
                this.boxback.node.scale = this.furnitureData.scale
                this.boxcover.node.scale = this.furnitureData.scale
                this.boxback.node.y = this.sprite.node.y
                this.boxcover.node.y = this.sprite.node.y
                let width = this.sprite.node.width * this.sprite.node.scale
                let height = this.sprite.node.height * this.sprite.node.scale
                this.tips.node.position = cc.v3(width / 2 - Dungeon.TILE_SIZE / 2, Dungeon.TILE_SIZE)
                this.lock.node.position = cc.v3(width / 2 - Dungeon.TILE_SIZE / 2, height / 2 - Dungeon.TILE_SIZE / 2)
                let collider = this.tips.node.getComponent(CCollider)
                collider.radius = width > height ? height / 4 : width / 4
                if (width > height) {
                    collider.radius = height / 4
                    collider.offset = cc.v2(0, -Dungeon.TILE_SIZE / 2)
                } else {
                    collider.radius = width / 4
                    collider.offset = cc.v2(0, -Dungeon.TILE_SIZE / 2)
                }
            }
        }
    }
    zoomCamera(zoomIn: boolean) {
        EventHelper.emit(zoomIn ? EventHelper.HUD_CAMERA_ZOOM_IN : EventHelper.HUD_CAMERA_ZOOM_OUT)
    }
    openBox() {
        if (this.furnitureData.isOpen) {
            return
        }
        this.furnitureData.isOpen = true
        LocalStorage.saveFurnitureData(this.furnitureData)
        this.anim.play('FurnitureOpen')
    }

    start() {
        this.changeRes(this.furnitureData.resName, this.isNormal)
    }

    onColliderEnter(other: CCollider, self: CCollider): void {}
    onColliderStay(other: CCollider, self: CCollider): void {}
    onColliderExit(other: CCollider, self: CCollider): void {}
    onColliderPreSolve(other: CCollider, self: CCollider): void {}
}
