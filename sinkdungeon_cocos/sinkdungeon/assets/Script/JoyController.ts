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
export default class JoyController extends cc.Component {

    @property(cc.Integer)
    anglePreDirQuadrant:number = 23;//每个象限的大小
 
 
    @property(cc.Node)
    fixedPoint:cc.Node = null;
 
 
    @property(cc.Node)
    movePoint:cc.Node = null;
 
    @property
    movePointMoveRadius:number=100;
 
 
    private touchID:number;//触摸事件ID（多点触控）
    private touchArea:cc.Vec3;//触摸区域大小
 
 
    private fixedPointMoveCenterPos:cc.Vec3;//固定点移动中心
    private fixedPointMoveRadius:number;//固定点移动半径
    private movePointMoveCenterPos:cc.Vec3;//移动点移动中心
 
 
    private joystickInputDir:cc.Vec3;
 
 
    onLoad() {
        let nodeSize = this.node.getContentSize()
        this.touchArea = new cc.Vec3(nodeSize.width,nodeSize.height)
 
 
        //固定点位置范围
        this.fixedPointMoveCenterPos = cc.v3(0,0);
        this.fixedPointMoveRadius = this.touchArea.x/2 - this.movePointMoveRadius;
 
 
        this.node.on(cc.Node.EventType.TOUCH_START, function (event:cc.Event.EventTouch) {
            if (this.touchID==-1){
                //触摸位置
                let touchStartPos = event.getLocation()
                let _pos = new cc.Vec3(touchStartPos.x,touchStartPos.y)
                _pos.subSelf(this.node.position)
 
 
                //控制位置
                let pos = this.clampPos(_pos,this.fixedPointMoveCenterPos,this.fixedPointMoveRadius)
                this.movePointMoveCenterPos = pos;
                //设置固定点位置
                this.setFixedPointPos(pos)
                // this.setMovePointPos(pos)
                this.touchID = event.getID()
            }
        }, this)
 
 
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event:cc.Event.EventTouch) {
            if (this.touchID==event.getID()){
                //触摸位置
                let nowPos = event.getLocation()
                let _pos = new cc.Vec3(nowPos.x,nowPos.y)
                _pos.subSelf(this.node.position)
 
 
                //控制位置
                let pos = this.clampPos(_pos,this.movePointMoveCenterPos,this.movePointMoveRadius)
                console.log(pos);
                //设置固定点位置
                this.setMovePointPos(pos)
            }
        }, this)
 
 
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.init();
            cc.director.emit(EventHelper.PLAYER_ATTACK);
        }, this)
 
 
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.init();
            cc.director.emit(EventHelper.PLAYER_ATTACK);
        }, this)
 
 
        this.init()
    }
 
 
    /**
     * 初始化
     */
    init(){
        this.touchID = -1;
        this.joystickInputDir = new cc.Vec3()
        
        this.setFixedPointPos(this.fixedPointMoveCenterPos)
        this.setMovePointPos(this.fixedPointMoveCenterPos)
    }
 
 
    /**
     * 设置固定点位置
     */
    public setFixedPointPos(pos:cc.Vec3){
        this.fixedPoint.setPosition(cc.v3(0,0));//固定位置
    }
 
 
    /**
     * 获取固定点位置
     */
    public getFixedPointPos(){
        return this.fixedPoint.getPosition()
    }
 
 
    /**
     * 设置移动点位置
     */
    public setMovePointPos(pos:cc.Vec3){
        this.movePoint.setPosition(pos)
    }
 
 
    /**
     * 获取移动点位置
     */
    public getMovePointPos(){
        return this.movePoint.getPosition()
    }
 
 
    /**
     * 圆形限制，防止溢出
     * @param pos 需要固定位置
     * @param centerPos 限制中心位置
     * @param radius 限制半径
     */
    public clampPos(pos:cc.Vec3,centerPos:cc.Vec3,radius:number):cc.Vec3{
        let dpos = pos.sub(centerPos)
        if (dpos.mag()>radius){
            return dpos.normalize().mul(radius).add(centerPos)
        }else{
            return pos;
        }
    }
 
 
    /**
     * 获取摇杆输入方向
     */
    public getInputDir():cc.Vec2{
        let dir = this.movePoint.getPosition().sub(this.fixedPoint.getPosition())
        if (dir.mag()>0){
            dir.normalizeSelf()
        }
        return dir;
    }
 
 
    /**
     * 获取摇杆象限输入方向（轴）
     */
    public getInputQuadrantDir():cc.Vec2{
        return this.getVec2ByQuadrant(this.getDirQuadrant(this.getInputDir()))
    }
 
 
    /**
     * 获取方向所在象限
     * @param vec 方向
     */
    public getDirQuadrant(vec:cc.Vec2):number{
        let dirQuadrant:number = null;
 
 
        if (vec.mag()>0){
            //非零向量
            dirQuadrant = Math.floor(this.getAngleByVec2(vec)/this.anglePreDirQuadrant)
        }
 
 
        //console.log(this.getAngleByVec2(vec),dirQuadrant)
        return dirQuadrant;
    }
 
 
    /**
     * 二维方向获取角度
     * @param vec 方向
     */
    public getAngleByVec2(vec:cc.Vec2):number{
        return -Math.atan2(vec.y,vec.x)*180/Math.PI + this.anglePreDirQuadrant/2;//this.anglePreDirQuadrant/2 用于旋转坐标系
    }
 
 
    /**
     * 角度获取二位方向
     * @param angle 
     */
    public getVec2ByAngle(angle:number):cc.Vec2
	{
		let dir:cc.Vec2=new cc.Vec2()
		let rad:number = (this.anglePreDirQuadrant/2-angle)*(Math.PI/180)//this.anglePreDirQuadrant/2 用于旋转坐标系
		dir.x=Math.cos(rad)
		dir.y=Math.sin(rad)
		return dir.normalizeSelf()
	}
 
 
    /**
     * 根据方向象限获取角度
     * @param dirQuadrant 
     */
    public getVec2ByQuadrant(dirQuadrant:number):cc.Vec2{
        if (dirQuadrant!=null){
            let angle:number = dirQuadrant*this.anglePreDirQuadrant;
            //获取象限的中心轴向
            angle+=this.anglePreDirQuadrant/2;
 
 
            return this.getVec2ByAngle(angle)
        }else{
            return cc.Vec2.ZERO;
        }
    }

    sendMoveMessageToPlayer(dt:number){
        let v = this.getInputQuadrantDir();
        
        let dir = 4;
        if(Math.abs(v.x)<Math.abs(v.y)){
            if(v.y>0.3){
                dir = 0;
            }
            if(v.y<-0.3){
                dir = 1;
            }
            
        }
        if(Math.abs(v.x)>Math.abs(v.y)){
            if(v.x<-0.3){
                dir = 2;
            }
            if(v.x>0.3){
                dir = 3;
            }
        }
        let pos = this.getInputDir();
        cc.director.emit(EventHelper.PLAYER_ROTATE,{detail:{dir:dir,pos:pos,dt:dt}})
        
    }
    timeDelay = 0;
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt){
        if(this.isTimeDelay(dt)){
            this.sendMoveMessageToPlayer(dt);
        }
    }

}
