import { EventHelper } from "../EventHelper";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChunkLookCamera extends cc.Component {
    camera:cc.Camera;
    @property(cc.Node)
    target:cc.Node = null;

    targetPosition:cc.Vec3;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.camera = this.getComponent(cc.Camera);
        cc.director.on(EventHelper.CAMERA_LOOK, (event) => {
            this.lookAt(event.detail.position);
        })
    }
    lookAt(position){
        this.targetPosition = position;
    }
    lateUpdate(){
        if(this.targetPosition){
        }
        this.node.position = this.lerp(this.node.position,this.node.parent.convertToNodeSpaceAR(this.target.convertToWorldSpaceAR(cc.Vec3.ZERO)),0.1);
    }
    lerp(self:cc.Vec3,to:cc.Vec3, ratio:number):cc.Vec3 {
        let out = cc.v3(0,0);
        let x = self.x;
        let y = self.y;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        return out;
    }
}
