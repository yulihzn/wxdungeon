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
export default class PlayerCameraControl extends cc.Component {

    @property(Dungeon)
    dungeon: Dungeon = null;
    @property(cc.Sprite)
    sprite1:cc.Sprite = null;
    @property(cc.Sprite)
    sprite2:cc.Sprite = null;
    @property(cc.Sprite)
    sprite3:cc.Sprite = null;
    camera:cc.Camera;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.camera = this.getComponent(cc.Camera);
        const texture = new cc.RenderTexture();
        const visibleSize = cc.view.getVisibleSize();
        texture.initWithSize(visibleSize.width,visibleSize.height);
        const spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);
        this.camera.targetTexture = texture;
        this.sprite1.node.parent = this.node.parent;
        this.sprite2.node.parent = this.node.parent;
        this.sprite3.node.parent = this.node.parent;
        this.sprite1.node.opacity = 100;
        this.sprite2.node.opacity = 50;
        this.sprite3.node.opacity = 10;
        this.sprite1.spriteFrame = spriteFrame;
        this.sprite2.spriteFrame = spriteFrame;
        this.sprite3.spriteFrame = spriteFrame;
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
        let targetPos = this.dungeon.player.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        this.sprite1.node.position = this.lerp(this.node.position,this.node.parent.convertToNodeSpaceAR(targetPos),0.075);
        this.sprite2.node.position = this.lerp(this.node.position,this.node.parent.convertToNodeSpaceAR(targetPos),0.05);
        this.sprite3.node.position = this.lerp(this.node.position,this.node.parent.convertToNodeSpaceAR(targetPos),0.025);
        this.camera.zoomRatio = this.lerpNumber(this.camera.zoomRatio,this.dungeon.isZoomCamera?0.7:1,0.05);
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
