import { ecs } from '../ECS'

@ecs.register('Transform')
export class TransformComponent extends ecs.IComponent {
    private _position: cc.Vec3 = cc.Vec3.ZERO
    private _lastPosition: cc.Vec3 = cc.Vec3.ZERO
    z = 0
    base = 0
    fixBase = 0 //默认为0，爬梯子的时候需会变更，这样碰撞系统就不会置0
    set position(pos) {
        this._position = pos
    }
    get position() {
        return this._position
    }
    get lastPosition() {
        return this._lastPosition
    }
    reset(): void {
        this.position = cc.Vec3.ZERO
        this.z = 0
    }
}
