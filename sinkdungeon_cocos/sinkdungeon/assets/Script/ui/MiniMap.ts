import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'
import MiniTile from './MiniTile'

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
export default class MiniMap extends cc.Component {
    @property(cc.Prefab)
    miniTile: cc.Prefab = null
    @property(cc.Node)
    cover: cc.Node = null
    @property(cc.Node)
    layer: cc.Node = null
    @property(cc.Node)
    dialog: cc.Node = null
    @property(cc.Node)
    closeButton: cc.Node = null
    static readonly ColorLevel = {
        EMPTY: -1,
        HIDE: 0,
        NORMAL: 1,
        PLAYER: 2,
        CLEAR: 3,
        NORMAL_BOSS: 4,
        CLEAR_PUZZLE: 5,
        CLEAR_END: 6,
        CLEAR_BOSS: 7,
        NORMAL_LOOT: 8,
        CLEAR_LOOT: 9,
        NORMAL_START: 10,
        NORMAL_END: 11,
        NORMAL_REST: 12,
        NORMAL_PREPARE: 13,
        NORMAL_TEST: 14,
        NORMAL_PUZZLE: 15,
        NORMAL_MERCHANT: 16,
        CLEAR_MERCHANT: 17
    }
    width: number = 0
    height: number = 0
    map: MiniTile[][]
    tileSize = 0
    startPos = cc.v3(0, 0)
    touchPos = cc.v2(0, 0)
    isAniming = false
    currentTile: MiniTile
    isDrag = false
    lastPlayerPos = cc.v2(-1, -1)

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.closeButton.active = false
        EventHelper.on(EventHelper.CHANGE_MINIMAP, detail => {
            if (this.node) {
                this.changeMap(detail.x, detail.y)
            }
        })
        EventHelper.on(EventHelper.OPEN_MINIMAP, detail => {
            if (this.node) {
                this.openMap()
            }
        })

        this.cover.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.openMap()
        })

        this.layer.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.touchPos = event.getLocation()
            this.startPos = this.layer.position.clone()
            this.unscheduleAllCallbacks()
            this.isDrag = true
        })
        this.layer.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let offset = event.getLocation().sub(this.touchPos).mul(0.5)
            this.layer.setPosition(this.startPos.x + offset.x, this.startPos.y + offset.y)
        })
        this.layer.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.scheduleOnce(() => {
                this.isDrag = false
            }, 5)
        })
        this.layer.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.scheduleOnce(() => {
                this.isDrag = false
            }, 5)
        })
        this.width = Logic.mapManager.rectDungeon.map.length
        this.height = Logic.mapManager.rectDungeon.map[0].length
        let currentPos = cc.v3(Logic.mapManager.getCurrentRoom().x, Logic.mapManager.getCurrentRoom().y)
        this.map = new Array()
        this.layer.removeAllChildren()
        this.layer.width = this.width * 100
        this.layer.height = this.height * 100
        for (let i = 0; i < this.width; i++) {
            this.map[i] = new Array()
            for (let j = 0; j < this.height; j++) {
                let node = cc.instantiate(this.miniTile)
                node.group = 'ui'
                this.tileSize = node.width
                this.map[i][j] = node.getComponent(MiniTile)
                this.layer.addChild(this.map[i][j].node)
                this.map[i][j].init(i, j, i == currentPos.x && j == currentPos.y)
                if (this.map[i][j].isCurrentRoom) {
                    this.currentTile = this.map[i][j]
                }
            }
        }
    }
    changeMap(x: number, y: number) {
        if (x == this.lastPlayerPos.x && y == this.lastPlayerPos.y) {
            return
        }
        if (this.currentTile) {
            this.lastPlayerPos.x = x
            this.lastPlayerPos.y = y
            this.currentTile.updateMap(x, y)
        }
    }
    openMap() {
        if (this.isAniming) {
            return
        }
        this.isAniming = true
        if (this.dialog.position.equals(cc.Vec3.ZERO)) {
            this.closeButton.active = true
            cc.tween(this.dialog)
                .to(0.3, { position: cc.v3(335, -210), width: 300, height: 300, scale: 1.5 })
                .call(() => {
                    this.cover.active = false
                    this.isAniming = false
                })
                .start()
        } else {
            this.closeButton.active = false
            this.cover.active = true
            cc.tween(this.dialog)
                .to(0.3, { position: cc.v3(0, 0), width: 300, height: 300, scale: 0.5 })
                .call(() => {
                    this.isAniming = false
                })
                .start()
        }
    }

    update(dt) {
        if (!this.isDrag && this.currentTile) {
            this.layer.position = Logic.lerpPos(this.layer.position, cc.v3(-this.currentTile.node.position.x, -this.currentTile.node.position.y), dt * 1)
        }
    }
}
