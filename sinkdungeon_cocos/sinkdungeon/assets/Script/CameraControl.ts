import Dungeon from "./Dungeon";
import { EventHelper } from "./EventHelper";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraControl extends cc.Component {

    @property(Dungeon)
    dungeon: Dungeon = null;
    
    camera:cc.Camera;
    isShaking = false;
    isHeavyShaking = false;
    offsetIndex = 0;
    offsetArr = [cc.v3(0,2),cc.v3(0,2),cc.v3(0,-3),cc.v3(0,-3),cc.v3(1,2),cc.v3(1,2),cc.v3(-1,-1),cc.v3(-1,-1)];
    offsetArr1 = [cc.v3(0,3),cc.v3(0,3),cc.v3(0,-6),cc.v3(0,-6),cc.v3(3,6),cc.v3(3,6),cc.v3(-3,-3),cc.v3(-3,-3)];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.camera = this.getComponent(cc.Camera);
        cc.director.on(EventHelper.CAMERA_SHAKE, (event) => {
            this.shakeCamera(event.detail.isHeavyShaking);
        })
    }
    onEnable(){
        // cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
    }
    onDisable(){
        // cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    }

    start () {

    }
    lateUpdate(){
        if(!this.dungeon.player){
            return;
        }
        let targetPos = this.dungeon.player.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        this.node.position = this.lerp(this.node.position,this.node.parent.convertToNodeSpaceAR(targetPos),0.1);
        if(this.isShaking){
            if(this.offsetIndex>this.offsetArr.length-1){
                this.offsetIndex = 0;
            }
            this.node.position = this.node.position.addSelf(this.isHeavyShaking?this.offsetArr1[this.offsetIndex]:this.offsetArr[this.offsetIndex]);
            this.offsetIndex++;
        }
        this.camera.zoomRatio = this.lerpNumber(this.camera.zoomRatio,this.dungeon.isZoomCamera?0.7:1,0.05);
        // this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
        // let ratio = targetPos.y / cc.winSize.height;
        // this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
    }
    shakeCamera(isHeavyShaking:boolean){
        if(!this.node){
            return;
        }
        this.isHeavyShaking = isHeavyShaking;
        this.isShaking = true;
        this.scheduleOnce(()=>{this.isShaking = false;},0.2);
    }
    lerpNumber(a, b, r) {
        return a + (b - a) * r;
    }
    lerp(self:cc.Vec3,to:cc.Vec3, ratio:number):cc.Vec3 {
        let out = cc.v3(0,0);
        let x = self.x;
        let y = self.y;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        return out;
    }
    // update (dt) {}
}
