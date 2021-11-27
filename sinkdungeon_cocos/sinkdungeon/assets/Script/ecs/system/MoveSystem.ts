import { MoveComponent } from "../component/MoveComponent";
import { TransformComponent } from "../component/TransformComponent";
import { ecs } from "../ECS";
import ActorEntity from "../entity/ActorEntity";

export default class MoveSystem extends ecs.ComblockSystem<ActorEntity>{


    filter(): ecs.IMatcher {
        return ecs.allOf(MoveComponent, TransformComponent);
    }

    update(entities: ActorEntity[]): void {
        for (let e of entities) {
            let move = e.Move;
            let transform = e.Transform;
            if (move.linearDamping < 0) {
                move.linearDamping = 0;
            }
            let temp = move.linearVelocity.mul(this.dt);
            transform.position.x += temp.x;
            transform.position.y += temp.y;
            let damp = move.linearDamping * this.dt;
            move.linearVelocity = this.lerpPos(move.linearVelocity,cc.v2(0,0),damp>1?1:damp);
            if (e.NodeRender.node) {
                e.NodeRender.node.setPosition(transform.position);
            }
        }
    }
    private lerpPos(self: cc.Vec2, to: cc.Vec2, ratio: number): cc.Vec2 {
        let out = cc.v2(0, 0);
        let x = self.x;
        let y = self.y;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        return out;
    }

    private lerp(a: number, b: number, r: number): number {
        return a + (b - a) * r;
    }
}