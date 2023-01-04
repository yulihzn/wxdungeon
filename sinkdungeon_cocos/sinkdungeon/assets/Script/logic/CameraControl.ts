import Actor from '../base/Actor'
import Dungeon from './Dungeon'
import { EventHelper } from './EventHelper'

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
export default class CameraControl extends cc.Component {
    @property(cc.Node)
    nodeSpace: cc.Node = null
    static readonly DEFAULT_ZOOM_MAX = 2
    static readonly DEFAULT_ZOOM_MIN = 0.6
    static readonly DEFAULT_ZOOM = 1
    private camera: cc.Camera
    private isShaking = false
    private isHeavyShaking = false
    private offsetIndex = 0
    private offsetArr = [cc.v3(0, 2), cc.v3(0, 2), cc.v3(0, -3), cc.v3(0, -3), cc.v3(1, 2), cc.v3(1, 2), cc.v3(-1, -1), cc.v3(-1, -1)]
    private offsetArr1 = [cc.v3(0, 3), cc.v3(0, 3), cc.v3(0, -6), cc.v3(0, -6), cc.v3(3, 6), cc.v3(3, 6), cc.v3(-3, -3), cc.v3(-3, -3)]

    private cameraTargetActor: Actor = null
    private cameraTargetOffset = cc.Vec3.ZERO

    cameraZoom = CameraControl.DEFAULT_ZOOM
    needZoomIn = false

    get Target() {
        return this.cameraTargetActor
    }
    get TargetOffset() {
        return this.cameraTargetOffset
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.camera = this.getComponent(cc.Camera)
        EventHelper.on(EventHelper.CAMERA_SHAKE, detail => {
            this.shakeCamera(detail.isHeavyShaking)
        })
        EventHelper.on(EventHelper.CAMERA_LOOK, detail => {
            this.followTarget(true)
        })
        EventHelper.on(EventHelper.HUD_CAMERA_ZOOM_IN, detail => {
            if (this.node) {
                this.cameraZoom = CameraControl.DEFAULT_ZOOM_MAX
            }
        })
        EventHelper.on(EventHelper.HUD_CAMERA_ZOOM_IN_LOCK, detail => {
            if (this.node) {
                this.needZoomIn = !detail.unlock
                this.cameraZoom = this.needZoomIn ? CameraControl.DEFAULT_ZOOM_MIN : CameraControl.DEFAULT_ZOOM
            }
        })
        EventHelper.on(EventHelper.HUD_CAMERA_ZOOM_OUT, detail => {
            if (this.node) {
                this.cameraZoom = this.needZoomIn ? CameraControl.DEFAULT_ZOOM_MIN : CameraControl.DEFAULT_ZOOM
            }
        })
    }
    public changeCameraTarget(actor: Actor, offset?: cc.Vec3) {
        this.cameraTargetActor = actor
        this.cameraTargetOffset = offset ? offset.clone() : cc.Vec3.ZERO
    }

    start() {}
    lateUpdate() {
        if (this.cameraTargetActor) {
            this.followTarget(false)
        }
        this.camera.zoomRatio = this.lerpNumber(this.camera.zoomRatio, this.cameraZoom, 0.05)
    }
    followTarget(isDirect: boolean) {
        if (!this.nodeSpace || !this.cameraTargetActor) {
            return
        }
        // let xmax = Dungeon.getPosInMap(cc.v3(Dungeon.WIDTH_SIZE - 4, 0)).x
        // let xmin = Dungeon.getPosInMap(cc.v3(3, 0)).x
        // let ymax = Dungeon.getPosInMap(cc.v3(0, Dungeon.HEIGHT_SIZE - 3)).y
        // let ymin = Dungeon.getPosInMap(cc.v3(0, 2)).y
        let offset = cc.v3(0, 0)
        // if (this.dungeon.cameraTargetNode.x < xmin) {
        //     offset.x = xmin - this.dungeon.cameraTargetNode.x
        // }
        // if (this.dungeon.cameraTargetNode.x > xmax) {
        //     offset.x = xmax - this.dungeon.cameraTargetNode.x
        // }
        // if (this.dungeon.cameraTargetNode.y < ymin) {
        //     offset.y = ymin - this.dungeon.cameraTargetNode.y
        // }
        // if (this.dungeon.cameraTargetNode.y > ymax) {
        //     offset.y = ymax - this.dungeon.cameraTargetNode.y
        // }

        let targetPos = this.nodeSpace.convertToWorldSpaceAR(this.cameraTargetActor.node.position.clone().addSelf(offset.add(this.cameraTargetOffset)))
        let pos = this.node.parent.convertToNodeSpaceAR(targetPos)
        if (this.cameraTargetActor.entity && this.cameraTargetActor.entity.Transform.base > Dungeon.TILE_SIZE * 2) {
            pos.y += this.cameraTargetActor.entity.Transform.base
        }
        if (isDirect) {
            this.node.position = pos
            cc.log(`mainCamera pos:${this.node.position}`)
        } else {
            this.node.position = this.lerp(this.node.position, pos, 0.1)
        }
        if (this.isShaking) {
            if (this.offsetIndex > this.offsetArr.length - 1) {
                this.offsetIndex = 0
            }
            this.node.position = this.node.position.addSelf(this.isHeavyShaking ? this.offsetArr1[this.offsetIndex] : this.offsetArr[this.offsetIndex])
            this.offsetIndex++
        }
    }
    shakeCamera(isHeavyShaking: boolean) {
        if (!this.node) {
            return
        }
        this.isHeavyShaking = isHeavyShaking
        this.isShaking = true
        this.scheduleOnce(() => {
            this.isShaking = false
        }, 0.2)
    }
    lerpNumber(a, b, r) {
        return a + (b - a) * r
    }
    lerp(self: cc.Vec3, to: cc.Vec3, ratio: number): cc.Vec3 {
        let out = cc.v3(0, 0)
        let x = self.x
        let y = self.y
        out.x = x + (to.x - x) * ratio
        out.y = y + (to.y - y) * ratio
        return out
    }
    // update (dt) {}
}
