import { EventHelper } from "./../logic/EventHelper"
import Dungeon from "../logic/Dungeon"
import Logic from "../logic/Logic"
import Building from "./Building"
import LevelData from "../data/LevelData"
import CCollider from "../collider/CCollider"
import Utils from "../utils/Utils"

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
    static readonly TYPE_NORMAL = 0 //普通
    static readonly TYPE_CORNER = 1 //外角
    static readonly TYPE_INNER = 2 //内角
    static readonly TYPE_CONVEX = 3 //凸角
    static readonly TYPE_CONCAVE = 4 //凹角
    static readonly TYPE_INNER_CORNER = 5 //内外角
    static readonly TYPE_TWO_SIDES = 6 //横竖
    static readonly TYPE_ALONE = 7 //单独
    static readonly TYPE_ROOF = 8 //房顶

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
    mapStr: string = "##"
    wallName: string = "" //wall***anim000 roof***anim000
    roofName: string = ""
    resNameSecond: string = ""
    type: number = Wall.TYPE_EMPTY
    dir = 0
    combineWall: Wall

    isFence = false //是否是围栏，围栏和自定义墙体一样无屋顶，但是贴图需要按顺序读取

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.wallsprite = this.node.getChildByName("sprite").getChildByName("wallsprite").getComponent(cc.Sprite)
        this.roofsprite = this.node.getChildByName("sprite").getChildByName("roofsprite").getComponent(cc.Sprite)
        this.shadowsprite = this.node.getChildByName("sprite").getChildByName("shadow").getComponent(cc.Sprite)
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
            return
        }
        if (Utils.hasThe(wallName, "fence")) {
            this.roofsprite.node.opacity = 0
            this.wallsprite.spriteFrame = null
            switch (this.type) {
                case Wall.TYPE_INNER_CORNER_BOTTOM_RIGHT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`wallNameanim10`)
                    break
                case Wall.TYPE_BOTTOM:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`wallNameanim1`)
                    break
                case Wall.TYPE_INNER_CORNER_BOTTOM_LEFT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`wallNameanim11`)
                    break
                case Wall.TYPE__RIGHT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`wallNameanim3`)
                    break
                case Wall.TYPE_CENTER:
                    break
                case Wall.TYPE_LEFT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`wallNameanim2`)
                    break
                case Wall.TYPE_INNER_CORNER_TOP_RIGHT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`wallNameanim9`)
                    break
                case Wall.TYPE_TOP:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`wallNameanim8`)
                    break
                case Wall.TYPE_INNER_CORNER_TOP_LEFT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`wallNameanim5`)
                    break
                case Wall.TYPE_CORNER_TOP_LEFT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`wallNameanim0`)
                    break
                case Wall.TYPE_CORNER_TOP_RIGHT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`wallNameanim6`)
                    break
                case Wall.TYPE_CORNER_BOTTOM_LEFT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`wallNameanim7`)
                    break
                case Wall.TYPE_CORNER_BOTTOM_RIGHT:
                    this.wallsprite.spriteFrame = Logic.spriteFrameRes(`wallNameanim6`)
                    break
                case Wall.TYPE_INNER_CORNER_TOP_RIGHT_BOTTOM_LEFT:
                    break
                case Wall.TYPE_INNER_CORNER_TOP_LEFT_BOTTOM_RIGHT:
                    break
            }
            return
        }
        spriteframe.setRect(cc.rect(0, 0, 8, 8))
        this.roofsprite.spriteFrame = spriteframe
        spriteframe.setRect(cc.rect(0, 24, 8, 16))
        this.wallsprite.spriteFrame = spriteframe
        switch (this.type) {
            case Wall.TYPE_INNER_CORNER_BOTTOM_RIGHT:
                spriteframe.setRect(cc.rect(0, 0, 8, 8))
                this.roofsprite.spriteFrame = spriteframe
                spriteframe.setRect(cc.rect(0, 24, 8, 16))
                this.wallsprite.spriteFrame = spriteframe
                break
            case Wall.TYPE_BOTTOM:
                break
            case Wall.TYPE_INNER_CORNER_BOTTOM_LEFT:
                break
            case Wall.TYPE__RIGHT:
                break
            case Wall.TYPE_CENTER:
                break
            case Wall.TYPE_LEFT:
                break
            case Wall.TYPE_INNER_CORNER_TOP_RIGHT:
                break
            case Wall.TYPE_TOP:
                break
            case Wall.TYPE_INNER_CORNER_TOP_LEFT:
                break
            case Wall.TYPE_CORNER_TOP_LEFT:
                break
            case Wall.TYPE_CORNER_TOP_RIGHT:
                break
            case Wall.TYPE_CORNER_BOTTOM_LEFT:
                break
            case Wall.TYPE_CORNER_BOTTOM_RIGHT:
                break
            case Wall.TYPE_INNER_CORNER_TOP_RIGHT_BOTTOM_LEFT:
                break
            case Wall.TYPE_INNER_CORNER_TOP_LEFT_BOTTOM_RIGHT:
                break
        }
    }
    setPos(pos: cc.Vec3) {
        this.pos = pos
        this.entity.Transform.position = Dungeon.getPosInMap(pos)
        this.node.position = this.entity.Transform.position.clone()
    }
    start() {}
    private ajustSpriteShow(isShowShadow: boolean, roofAngle: number, flipWall: boolean, flipRoof: cc.Vec3) {
        if (!this.wallsprite) {
            this.wallsprite = this.node.getChildByName("sprite").getChildByName("wallsprite").getComponent(cc.Sprite)
            this.roofsprite = this.node.getChildByName("sprite").getChildByName("roofsprite").getComponent(cc.Sprite)
            this.shadowsprite = this.node.getChildByName("sprite").getChildByName("shadow").getComponent(cc.Sprite)
        }
        this.shadowsprite.node.opacity = isShowShadow ? 80 : 0
        this.roofsprite.node.angle = roofAngle
        this.wallsprite.node.scaleX = flipWall ? -1 : 1
        this.roofsprite.node.scaleX = flipRoof.x
        this.roofsprite.node.scaleY = flipRoof.y
    }
    public isTop(): boolean {
        return (
            (this.type == Wall.TYPE_NORMAL && this.dir == 0) ||
            (this.type == Wall.TYPE_CORNER && this.dir < 2) ||
            (this.type == Wall.TYPE_INNER && this.dir < 2) ||
            (this.type == Wall.TYPE_INNER_CORNER && this.dir < 2) ||
            (this.type == Wall.TYPE_CONVEX && this.dir == 0) ||
            (this.type == Wall.TYPE_CONCAVE && this.dir == 0)
        )
    }
    public isSide(): boolean {
        return this.type == Wall.TYPE_NORMAL && this.dir > 1
    }
    init(mapStr: string, leveldata: LevelData, onlyShow: boolean, combineCountX: number, combineCountY: number) {
        this.node.opacity = 255
        this.mapStr = mapStr
        if (Utils.hasThe(mapStr, "###")) {
            this.type = Wall.TYPE_EMPTY
        } else if (Utils.hasThe(mapStr, "##")) {
            this.type = Wall.TYPE_OTHER
            let resIndex = parseInt(mapStr.substring(1))
            this.wallName = leveldata.getWallRes(resIndex, true)
        } else {
            let index = parseInt(mapStr.substring(3))
            this.type = index
            let resIndex = parseInt(mapStr.substring(1, 3))
            this.wallName = leveldata.getWallRes(resIndex)
        }
        this.changeRes(this.wallName)

        // if (this.isTop()) {
        //     for (let c of this.ccolliders) {
        //         c.tag = CCollider.TAG.WALL_TOP
        //     }
        // }
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
            EventHelper.on(EventHelper.DUNGEON_WALL_COLLIDER, (detail) => {
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
    private isInnerOrCorner(type: number): boolean {
        return type == Wall.TYPE_INNER || type == Wall.TYPE_CORNER || type == Wall.TYPE_INNER_CORNER
    }
    onColliderEnter(other: CCollider, self: CCollider): void {
        if (!self.sensor) {
            return
        }
        if (this.type != Wall.TYPE_EMPTY && (other.tag == CCollider.TAG.PLAYER || other.tag == CCollider.TAG.NONPLAYER)) {
            if (!this.combineWall) EventHelper.emit(EventHelper.DUNGEON_WALL_COLLIDER, { type: 0, other: other, self: self })
            if (this.type == Wall.TYPE_OTHER) {
                this.wallsprite.node.opacity = 180
            } else {
                this.roofsprite.node.opacity = 180
            }
        }
    }
    onColliderStay(other: CCollider, self: CCollider): void {
        if (!self.sensor) {
            return
        }
        if (this.type != Wall.TYPE_EMPTY && (other.tag == CCollider.TAG.PLAYER || other.tag == CCollider.TAG.NONPLAYER)) {
            if (!this.combineWall) EventHelper.emit(EventHelper.DUNGEON_WALL_COLLIDER, { type: 1, other: other, self: self })
            this.wallsprite.node.opacity = 255
        }
    }
    onColliderExit(other: CCollider, self: CCollider): void {
        if (!self.sensor) {
            return
        }
        if (this.type != Wall.TYPE_EMPTY && (other.tag == CCollider.TAG.PLAYER || other.tag == CCollider.TAG.NONPLAYER)) {
            if (!this.combineWall) EventHelper.emit(EventHelper.DUNGEON_WALL_COLLIDER, { type: 2, other: other, self: self })
            this.wallsprite.node.opacity = 255
        }
    }

    // update (dt) {}
}
