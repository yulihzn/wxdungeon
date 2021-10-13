import { ecs } from "../ECS";
import MoveSystem from "./MoveSystem";

export default class  GameWorldSystem extends ecs.RootSystem{
    constructor(){
        super();
        this.add(new MoveSystem());
    }
}