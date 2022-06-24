import { EventHelper } from './../logic/EventHelper'
import Dungeon from '../logic/Dungeon'
import Logic from '../logic/Logic'
import Building from './Building'
import LevelData from '../data/LevelData'
import CCollider from '../collider/CCollider'
import Utils from '../utils/Utils'

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
export default class Wall extends Building {
    static readonly TYPE_EMPTY = -1 //空
    // static readonly TYPE_NORMAL = 0 //普通
    // static readonly TYPE_CORNER = 1 //外角
    // static readonly TYPE_INNER = 2 //内角
    // static readonly TYPE_CONVEX = 3 //凸角
    // static readonly TYPE_CONCAVE = 4 //凹角
    // static readonly TYPE_INNER_CORNER = 5 //内外角
    // static readonly TYPE_TWO_SIDES = 6 //横竖
    // static readonly TYPE_ALONE = 7 //单独
    // static readonly TYPE_ROOF = 8 //房顶

    static readonly TYPE_INNER_CORNER_BOTTOM_RIGHT = 0 //右下内角
    static readonly TYPE_BOTTOM = 1 //下墙 屋顶0
    static readonly TYPE_INNER_CORNER_BOTTOM_LEFT = 2 //左下内角
    static readonly TYPE__RIGHT = 3 //右墙
    static readonly TYPE_CENTER = 4 //中墙
    static readonly TYPE_LEFT = 5 //左墙
    static readonly TYPE_INNER_CORNER_TOP_RIGHT = 6 //右上内角 左边墙
    static readonly TYPE_TOP = 7 //上墙 中
    static readonly TYPE_INNER_CORNER_TOP_LEFT = 8 //左上内角 右边墙
    static readonly TYPE_CORNER_TOP_LEFT = 9 //左上角
    static readonly TYPE_CORNER_TOP_RIGHT = 10 //右上角
    static readonly TYPE_CORNER_BOTTOM_LEFT = 11 //左下角
    static readonly TYPE_CORNER_BOTTOM_RIGHT = 12 //右下角
    static readonly TYPE_INNER_CORNER_TOP_RIGHT_BOTTOM_LEFT = 13 //右上左下角
    static readonly TYPE_INNER_CORNER_TOP_LEFT_BOTTOM_RIGHT = 14 //左上右下内角
    static readonly TYPE_OTHER = 30 //其它0

    pos: cc.Vec3
    half = false
    wallsprite: cc.Sprite
    roofsprite: cc.Sprite
    shadowsprite: cc.Sprite
    mapStr: string = '##'
    wallName: string = '' //wall***anim000 roof***anim000
    roofName: string = ''
    resNameSecond: string = ''
    type: number = Wall.TYPE_EMPTY
    dir = 0
    combineWall: Wall

    isFence = false //是否是围栏，围栏和自定义墙体一样无屋顶，但是贴图需要按顺序读取

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.wallsprite = this.node.getChildByName('sprite').getChildByName('wallsprite').getComponent(cc.Sprite)
        this.roofsprite = this.node.getChildByName('sprite').getChildByName('roofsprite').getComponent(cc.Sprite)
        this.shadowsprite = this.node.getChildByName('sprite').getChildByName('shadow').getComponent(cc.Sprite)
    }
    isEmptyWall() {
        return this.type == Wall.TYPE_EMPTY
    }
    changeRes(wallName: string) {
        let rand4save = Logic.mapManager.getRandom4Save(this.seed)
        let spriteframe = Logic.spriteFrameRes(wallName)
        if (this.type == Wall.TYPE_EMPTY) {
            this.node.opacity = 0
            return
        }
        if (this.type == Wall.TYPE_OTHER) {
            this.roofsprite.node.opacity = 0
            this.wallsprite.spriteFrame = spriteframe
            this.wallsprite.node.width = 16
            this.wallsprite.node.height = 32
            return
        }
        if (Utils.hasThe(wallName, 'fence')) {
            this.isFence = true
            this.roofsprite.node.opacity = 0
            this.wallsprite.spriteFrame = null
            this.wallsprite.trim = false
            this.wallsprite.node.width = 16
            this.wallsprite.node.height = 32
            switch (this.type) {
                case Wall.TYPE_INNER_CORNER_BOTTOM_RIGHT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`${wallName}anim10`)
                    break
                case Wall.TYPE_BOTTOM:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`${wallName}anim1`)
                    break
                case Wall.TYPE_INNER_CORNER_BOTTOM_LEFT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`${wallName}anim11`)
                    break
                case Wall.TYPE__RIGHT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`${wallName}anim3`)
                    break
                case Wall.TYPE_CENTER:
                    break
                case Wall.TYPE_LEFT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`${wallName}anim2`)
                    break
                case Wall.TYPE_INNER_CORNER_TOP_RIGHT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`${wallName}anim9`)
                    break
                case Wall.TYPE_TOP:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`${wallName}anim0`)
                    break
                case Wall.TYPE_INNER_CORNER_TOP_LEFT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`${wallName}anim8`)
                    break
                case Wall.TYPE_CORNER_TOP_LEFT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`${wallName}anim4`)
                    break
                case Wall.TYPE_CORNER_TOP_RIGHT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`${wallName}anim5`)
                    break
                case Wall.TYPE_CORNER_BOTTOM_LEFT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`${wallName}anim7`)
                    break
                case Wall.TYPE_CORNER_BOTTOM_RIGHT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`${wallName}anim6`)
                    break
                case Wall.TYPE_INNER_CORNER_TOP_RIGHT_BOTTOM_LEFT:
                    break
                case Wall.TYPE_INNER_CORNER_TOP_LEFT_BOTTOM_RIGHT:
                    break
            }
            this.ajustSpriteShow(false)
            return
        }
        let rect = spriteframe.getRect()
        let sf1 = spriteframe.clone()
        let sf2 = spriteframe.clone()
        this.roofsprite.trim = true
        this.wallsprite.trim = true
        this.roofsprite.node.width = 16
        this.roofsprite.node.height = 16
        this.wallsprite.node.width = 16
        this.wallsprite.node.height = 16
        this.roofsprite.spriteFrame = sf1
        this.wallsprite.spriteFrame = sf2
        let unit = 16
        let pos1 = cc.v2(0, 0)
        let pos2 = cc.v2(0, 0)
        switch (this.type) {
            case Wall.TYPE_INNER_CORNER_BOTTOM_RIGHT:
                pos1 = cc.v2(0, 0)
                pos2 = cc.v2(1, 3)
                break
            case Wall.TYPE_BOTTOM:
                pos1 = cc.v2(1, 0)
                pos2 = cc.v2(1, 3)
                break
            case Wall.TYPE_INNER_CORNER_BOTTOM_LEFT:
                pos1 = cc.v2(2, 0)
                pos2 = cc.v2(1, 3)
                break
            case Wall.TYPE__RIGHT:
                pos1 = cc.v2(0, 1)
                pos2 = cc.v2(1, 3)
                break
            case Wall.TYPE_CENTER:
                pos1 = cc.v2(1, 1)
                pos2 = cc.v2(1, 3)
                break
            case Wall.TYPE_LEFT:
                pos1 = cc.v2(2, 1)
                pos2 = cc.v2(1, 3)
                break
            case Wall.TYPE_INNER_CORNER_TOP_RIGHT:
                pos1 = cc.v2(0, 2)
                pos2 = cc.v2(0, 3)
                break
            case Wall.TYPE_TOP:
                pos1 = cc.v2(1, 2)
                pos2 = cc.v2(1, 3)
                break
            case Wall.TYPE_INNER_CORNER_TOP_LEFT:
                pos1 = cc.v2(2, 2)
                pos2 = cc.v2(4, 3)
                break
            case Wall.TYPE_CORNER_TOP_LEFT:
                pos1 = cc.v2(3, 0)
                pos2 = cc.v2(1, 3)
                break
            case Wall.TYPE_CORNER_TOP_RIGHT:
                pos1 = cc.v2(4, 0)
                pos2 = cc.v2(1, 3)
                break
            case Wall.TYPE_CORNER_BOTTOM_LEFT:
                pos1 = cc.v2(3, 1)
                pos2 = cc.v2(1, 3)
                break
            case Wall.TYPE_CORNER_BOTTOM_RIGHT:
                pos1 = cc.v2(4, 1)
                pos2 = cc.v2(1, 3)
                break
            case Wall.TYPE_INNER_CORNER_TOP_RIGHT_BOTTOM_LEFT:
                pos1 = cc.v2(3, 2)
                pos2 = cc.v2(1, 3)
                break
            case Wall.TYPE_INNER_CORNER_TOP_LEFT_BOTTOM_RIGHT:
                pos1 = cc.v2(4, 2)
                pos2 = cc.v2(1, 3)
                break
        }
        sf1.setRect(cc.rect(rect.x + unit * pos1.x, rect.y + unit * pos1.y, unit, unit))
        sf2.setRect(cc.rect(rect.x + unit * pos2.x, rect.y + unit * pos2.y, unit, unit))
        this.roofsprite.spriteFrame = sf1
        this.wallsprite.spriteFrame = sf2
    }
    setPos(pos: cc.Vec3) {
        this.pos = pos
        this.entity.Transform.position = Dungeon.getPosInMap(pos)
        this.node.position = this.entity.Transform.position.clone()
    }
    start() {}
    private ajustSpriteShow(isShowShadow: boolean) {
        if (!this.wallsprite) {
            this.shadowsprite = this.node.getChildByName('sprite').getChildByName('shadow').getComponent(cc.Sprite)
        }
        this.shadowsprite.node.opacity = isShowShadow ? 80 : 0
    }

    public static typeNeedTransparent(type: number): boolean {
        return type == Wall.TYPE_INNER_CORNER_BOTTOM_RIGHT || type == Wall.TYPE_BOTTOM || type == Wall.TYPE_INNER_CORNER_BOTTOM_LEFT || type == Wall.TYPE_OTHER
    }
    public static getType(mapStr: string) {
        let type = Wall.TYPE_EMPTY
        if (Utils.hasThe(mapStr, '###')) {
            type = Wall.TYPE_EMPTY
        } else if (Utils.hasThe(mapStr, '##')) {
            type = Wall.TYPE_OTHER
        } else {
            let index = parseInt(mapStr.substring(3))
            type = index
        }
        return type
    }
    init(mapStr: string, leveldata: LevelData, onlyShow: boolean, combineCountX: number, combineCountY: number) {
        this.node.opacity = 255
        this.mapStr = mapStr
        this.type = Wall.getType(mapStr)
        if (this.type == Wall.TYPE_OTHER) {
            this.wallName = leveldata.getWallRes(parseInt(mapStr.substring(2)), true)
        } else {
            this.wallName = leveldata.getWallRes(parseInt(mapStr.substring(1, 3)))
        }
        this.changeRes(this.wallName)

        this.setTargetTags(CCollider.TAG.PLAYER, CCollider.TAG.NONPLAYER, CCollider.TAG.GOODNONPLAYER, CCollider.TAG.BOSS, CCollider.TAG.BUILDING, CCollider.TAG.BULLET)
        if (onlyShow) {
            this.entity.destroy()
        } else if (combineCountX > 0) {
            for (let collider of this.ccolliders) {
                let half = collider.w / 2
                collider.w += collider.w * combineCountX
                collider.offsetX = collider.w / 2 - half
            }
        } else if (combineCountY > 0) {
            for (let collider of this.ccolliders) {
                if (collider.sensor) {
                    collider.offsetY += combineCountY * collider.offsetY
                } else {
                    let half = collider.h / 2
                    collider.h += collider.h * combineCountY
                    collider.offsetY = collider.h / 2 - half
                }
            }
        }
        if (this.combineWall) {
            EventHelper.on(EventHelper.DUNGEON_WALL_COLLIDER + this.combineWall.node.uuid, detail => {
                if (this.node) {
                    if (detail.type == 0) {
                        this.onColliderEnter(detail.other, detail.self)
                    } else if (detail.type == 1) {
                        this.onColliderStay(detail.other, detail.self)
                    } else if (detail.type == 2) {
                        this.onColliderExit(detail.other, detail.self)
                    }
                }
            })
        }
    }

    onColliderEnter(other: CCollider, self: CCollider): void {
        if (!self.sensor) {
            return
        }
        if (Wall.typeNeedTransparent(this.type) && (other.tag == CCollider.TAG.PLAYER || other.tag == CCollider.TAG.NONPLAYER)) {
            if (!this.combineWall) {
                EventHelper.emit(EventHelper.DUNGEON_WALL_COLLIDER + this.node.uuid, { type: 0, other: other, self: self })
            }
            if (Wall.typeNeedTransparent(this.type)) {
                if (this.type == Wall.TYPE_OTHER || this.isFence) {
                    this.wallsprite.node.opacity = 120
                } else {
                    this.roofsprite.node.opacity = 120
                }
            }
        }
    }
    onColliderStay(other: CCollider, self: CCollider): void {
        if (!self.sensor) {
            return
        }
        if (other.tag == CCollider.TAG.PLAYER || other.tag == CCollider.TAG.NONPLAYER) {
            if (!this.combineWall) {
                EventHelper.emit(EventHelper.DUNGEON_WALL_COLLIDER + this.node.uuid, { type: 1, other: other, self: self })
            }
            if (Wall.typeNeedTransparent(this.type)) {
                if (this.type == Wall.TYPE_OTHER || this.isFence) {
                    this.wallsprite.node.opacity = 120
                } else {
                    this.roofsprite.node.opacity = 120
                }
            }
        }
    }
    onColliderExit(other: CCollider, self: CCollider): void {
        if (!self.sensor) {
            return
        }
        if (other.tag == CCollider.TAG.PLAYER || other.tag == CCollider.TAG.NONPLAYER) {
            if (!this.combineWall) {
                EventHelper.emit(EventHelper.DUNGEON_WALL_COLLIDER + this.node.uuid, { type: 2, other: other, self: self })
            }
            if (Wall.typeNeedTransparent(this.type)) {
                if (this.type == Wall.TYPE_OTHER || this.isFence) {
                    this.wallsprite.node.opacity = 255
                } else {
                    this.roofsprite.node.opacity = 255
                }
            }
        }
    }

    // update (dt) {}
}
