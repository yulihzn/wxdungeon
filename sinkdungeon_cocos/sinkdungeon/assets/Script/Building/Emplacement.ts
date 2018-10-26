import Dungeon from "../Dungeon";
import { EventConstant } from "../EventConstant";
import Player from "../Player";
import Shooter from "../Shooter";


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
export default class Emplacement extends cc.Component {

    @property(Shooter)
    shooterTop:Shooter = null;
    @property(Shooter)
    shooterBottom:Shooter = null;
    @property(Shooter)
    shooterLeft:Shooter = null;
    @property(Shooter)
    shooterRight:Shooter = null;
    isOpen:boolean = false;
    pos:cc.Vec2 = cc.v2(0,0);
    private sprite: cc.Node;
    private timeDelay = 0;
    dungeon:Dungeon;
    anim:cc.Animation;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.setShooterHv(this.shooterTop,cc.v2(0,1));
        this.setShooterHv(this.shooterBottom,cc.v2(0,-1));
        this.setShooterHv(this.shooterLeft,cc.v2(-1,0));
        this.setShooterHv(this.shooterRight,cc.v2(1,0));
    }

    start () {
        this.anim = this.getComponent(cc.Animation);
        if(this.anim){
            this.anim.play();
        }
    }
    
    setPos(pos:cc.Vec2){
        this.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - pos.y) * 100+1;
    }
    //Animation
    OpenFire(){
        if(!this.dungeon){
            return;
        }
        this.fireShooter(this.shooterTop);
        this.fireShooter(this.shooterBottom);
        this.fireShooter(this.shooterLeft);
        this.fireShooter(this.shooterRight);
    }
    fireShooter(shooter:Shooter){
        if(!shooter.dungeon){
            shooter.dungeon = this.dungeon;
        }
        shooter.fireBullet();
    }
    setShooterHv(shooter:Shooter,hv:cc.Vec2){
        shooter.setHv(hv);
    }
    
}
