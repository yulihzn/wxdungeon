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
            transform.position.x += this.dt * move.linearVelocity.x;
            transform.position.y += this.dt * move.linearVelocity.y;
            move.linearVelocity.x = this.lerp(move.linearVelocity.x, 0, move.linearDamping * this.dt);
            move.linearVelocity.y = this.lerp(move.linearVelocity.y, 0, move.linearDamping * this.dt);
            if (e.NodeRender.node) {
                e.NodeRender.node.setPosition(transform.position);
            }
            if(e.Collider){
                for (let c of e.Collider.colliders) {
                    c.pos = transform.position.clone();
                }
            }
            
        }
    }

    private lerp(a: number, b: number, r: number): number {
        return a + (b - a) * r;
    }
}