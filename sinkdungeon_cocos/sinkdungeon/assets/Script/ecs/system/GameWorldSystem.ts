import { ecs } from '../ECS'
import ColliderSystem from './ColliderSystem'
import MoveSystem from './MoveSystem'

export default class GameWorldSystem extends ecs.RootSystem {
    static colliderSystem: ColliderSystem
    constructor(bounds: cc.Rect, graphics: cc.Graphics) {
        super()
        GameWorldSystem.colliderSystem = new ColliderSystem(bounds, graphics)
        this.add(GameWorldSystem.colliderSystem)
        this.add(new MoveSystem())
    }
}
