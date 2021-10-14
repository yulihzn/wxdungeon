import { ecs } from "../ECS";
import ColliderSystem from "./ColliderSystem";
import MoveSystem from "./MoveSystem";

export default class  GameWorldSystem extends ecs.RootSystem{
    constructor(width: number, height: number){
        super();
        this.add(new MoveSystem());
        this.add(new ColliderSystem(width,height));
    }
}