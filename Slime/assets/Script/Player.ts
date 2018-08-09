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
export default class Player extends cc.Component {

    @property(cc.Camera)
    camera: cc.Camera = null;

    rigidbody:cc.RigidBody;
    anim:cc.Animation;
    isMoving:boolean;
    footNode:cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
        this.rigidbody = this.getComponent(cc.RigidBody);
        cc.director.on('playermove',(message)=>{
            this.move(message.pos,message.dt);
        })
        cc.director.on('playerattack',(message)=>{
            this.rotate(message.pos,message.dt);
        })
        this.footNode = this.node.getChildByName('sprite').getChildByName('foot');
    }

    start () {

    }

    update (dt) {
        if(this.camera){
            this.camera.node.position = this.lerp(this.camera.node.position,this.node.position,0.1);
        }
    }
    lerp(self:cc.Vec2,to:cc.Vec2, ratio:number):cc.Vec2 {
        let out = cc.v2(0,0);
        let x = self.x;
        let y = self.y;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        return out;
    };
    rotate(pos: cc.Vec2, dt: number){
        if(pos.equals(cc.Vec2.ZERO)){
            return;
        }
        this.node.rotation = this.getRotationAngle(pos);
    }
    move(pos: cc.Vec2, dt: number) {
        
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);

        let mul = absh > absv ? absh : absv;
        mul = mul == 0 ? 1 : mul;
        let movement = cc.v2(h, v);
        let speed = 200;
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement;
        this.isMoving = h != 0 || v != 0;
        
        if (this.isMoving) {
            if (!this.anim.getAnimationState('PlayerMove').isPlaying) {
                this.anim.playAdditive('PlayerMove');
            }
        } else {
            if (this.anim.getAnimationState('PlayerMove').isPlaying) {
                this.anim.play('PlayerIdle');
            }
        }
        this.footNode.rotation = this.getRotationAngle(pos)-this.node.rotation;
    }
    getRotationAngle(target: cc.Vec2):number {
        // 两者取差得到方向向量
        let direction = target;
        // 方向向量转换为角度值
        let Rad2Deg = 360 / (Math.PI * 2);
        let angle: number = 360 - Math.atan2(direction.x, direction.y) * Rad2Deg;
        let offsetAngle = 90;
        angle += offsetAngle;
        // 将当前物体的角度设置为对应角度
        return this.node.scaleX == -1 ? angle : -angle;

    }
}
