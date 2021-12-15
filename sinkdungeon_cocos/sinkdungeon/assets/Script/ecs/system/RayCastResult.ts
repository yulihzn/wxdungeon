import CCollider from "../../collider/CCollider";

export default class RayCastResult {
    collider: CCollider;
    point: cc.Vec2;
    constructor(collider:CCollider,point:cc.Vec2){
        this.collider = collider;
        this.point = point;
    }
}