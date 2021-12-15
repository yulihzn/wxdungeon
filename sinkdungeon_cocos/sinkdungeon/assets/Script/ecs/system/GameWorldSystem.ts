import { ecs } from "../ECS";
import ColliderSystem from "./ColliderSystem";
import MoveSystem from "./MoveSystem";

export default class  GameWorldSystem extends ecs.RootSystem{
     static colliderSystem:ColliderSystem;
    constructor(width: number, height: number,graphics:cc.Graphics){
        super();
        GameWorldSystem.colliderSystem = new ColliderSystem(width,height,graphics);
        this.add(GameWorldSystem.colliderSystem);
        this.add(new MoveSystem());
    }
}