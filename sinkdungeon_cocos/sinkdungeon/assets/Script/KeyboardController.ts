import { EventConstant } from "./EventConstant";

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
export default class KeyboardController extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    private stopCount = 0;//当不操作的时候是否需要停止发送移动事件
    isUp = false;
    isDown = false;
    isLeft = false;
    isRight = false;
    isA = false;
    isB = false;
    isC = false;
    isD = false;
    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
    }

    start () {

    }
    onKeyDown(event:cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.w:this.isUp =true;break;
            case cc.macro.KEY.s:this.isDown =true;break;
            case cc.macro.KEY.a:this.isLeft =true;break;
            case cc.macro.KEY.d:this.isRight =true;break;

            case cc.macro.KEY.j:this.isA = true;break;
            case cc.macro.KEY.k:this.isB = true;break;
            case cc.macro.KEY.i:this.isC = true;break;
            case cc.macro.KEY.l:this.isD = true;break;
        }
    }
    onKeyUp(event:cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.w:this.isUp =false;break;
            case cc.macro.KEY.s:this.isDown =false;break;
            case cc.macro.KEY.a:this.isLeft =false;break;
            case cc.macro.KEY.d:this.isRight =false;break;

            case cc.macro.KEY.j:this.isA = false;break;
            case cc.macro.KEY.k:this.isB = false;break;
            case cc.macro.KEY.i:this.isC = false;break;
            case cc.macro.KEY.l:this.isD = false;break;
        }
    }
    update (dt) {
        if(this.isTimeDelay(dt)){
            this.sendMoveMessageToPlayer(dt);
        }
        
    }
    sendMoveMessageToPlayer(dt:number){
        
        let pos = cc.v2(0,0);
        if(this.isUp){pos.addSelf(cc.v2(0,0.9));}
        if(this.isDown){pos.addSelf(cc.v2(0,-0.9));}
        if(this.isLeft){pos.addSelf(cc.v2(-0.9,0));}
        if(this.isRight){pos.addSelf(cc.v2(0.9,0));}
        if (pos.mag()>0){
            pos.normalizeSelf();
        }
        let dir = 4;
        if(Math.abs(pos.x)<Math.abs(pos.y)){
            if(pos.y>0.3){
                dir = 0;
            }
            if(pos.y<-0.3){
                dir = 1;
            }
            
        }
        if(Math.abs(pos.x)>Math.abs(pos.y)){
            if(pos.x<-0.3){
                dir = 2;
            }
            if(pos.x>0.3){
                dir = 3;
            }
        }
        if(!pos.equals(cc.Vec2.ZERO)){
            this.stopCount = 0;
        }else{
            this.stopCount++;
        }
        if(this.stopCount<2){
            cc.director.emit(EventConstant.PLAYER_MOVE,{detail:{dir:dir,pos:pos,dt:dt}})
        }
        if(this.isA){
            cc.director.emit(EventConstant.PLAYER_ATTACK);
        }
        if(this.isB){
            cc.director.emit(EventConstant.PLAYER_REMOTEATTACK);
        }
        if(this.isC){
            cc.director.emit(EventConstant.PLAYER_USEITEM);
        }
        if(this.isD){
            cc.director.emit(EventConstant.PLAYER_SKILL);
        }
        
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
}
