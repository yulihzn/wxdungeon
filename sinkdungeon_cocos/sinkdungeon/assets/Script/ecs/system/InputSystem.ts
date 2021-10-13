import { EventHelper } from "../../logic/EventHelper";
import { InputComponent } from "../component/InputComponent";
import { ecs } from "../ECS";

export default class InputSystem extends ecs.ComblockSystem{

    init(){
        EventHelper.on(EventHelper.PLAYER_MOVE, (detail) => { this.playerAction(detail.dir, detail.pos, detail.dt) });
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(InputComponent);
    }
    
    update(entities: ecs.Entity[]): void {
        
    }
    playerAction(dir: number, pos: cc.Vec3, dt: number) {
    }
   
}