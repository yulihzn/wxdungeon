import { ecs } from "../ECS";
import ColliderSystem from "./ColliderSystem";
import MoveSystem from "./MoveSystem";

export default class  GameWorldSystem extends ecs.RootSystem{
    constructor(width: number, height: number,graphics:cc.Graphics){
        super();
        this.add(new ColliderSystem(width,height,graphics));
        this.add(new MoveSystem());
    }
}