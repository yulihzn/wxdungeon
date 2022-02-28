import Dungeon from "../logic/Dungeon";
import Shooter from "../logic/Shooter";
import Logic from "../logic/Logic";
import Building from "./Building";
import FromData from "../data/FromData";
import IndexZ from "../utils/IndexZ";


// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Emplacement extends Building {

    @property(Shooter)
    shooterTop: Shooter = null;
    @property(Shooter)
    shooterBottom: Shooter = null;
    @property(Shooter)
    shooterLeft: Shooter = null;
    @property(Shooter)
    shooterRight: Shooter = null;
    isOpen: boolean = false;
    pos: cc.Vec3 = cc.v3(0, 0);
    private sprite: cc.Node;
    private timeDelay = 0;
    dungeon: Dungeon;
    anim: cc.Animation;
    static readonly ALL = 0;//G0
    static readonly TOP = 1;//G1
    static readonly BOTTOM = 2;//G2
    static readonly LEFT = 3;//G3
    static readonly RIGHT = 4;//G4
    static readonly TOPBOTTOM = 5;//G5
    static readonly TOPLEFT = 6;//G6
    static readonly TOPRIGHT = 7;//G7
    static readonly BOTTOMLEFT = 8;//G8
    static readonly BOTTOMRIGHT = 9;//G9
    static readonly LEFTRIGHT = 10;//Ga
    dirType = 0;//方向类型
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.setShooterHv(this.shooterTop, cc.v2(0, 1));
        this.setShooterHv(this.shooterBottom, cc.v2(0, -1));
        this.setShooterHv(this.shooterLeft, cc.v2(-1, 0));
        this.setShooterHv(this.shooterRight, cc.v2(1, 0));
        let from = FromData.getClone('炮台','emplacement');
        this.shooterTop.from.valueCopy(from);
        this.shooterBottom.from.valueCopy(from);
        this.shooterLeft.from.valueCopy(from);
        this.shooterRight.from.valueCopy(from);
    }
    setDirType(mapStr:string){
        switch(mapStr){
            case 'G0':this.dirType =Emplacement.ALL;this.hideOrShowShooter(1,1,1,1);break;
            case 'G1':this.dirType =Emplacement.TOP;this.hideOrShowShooter(1,0,0,0);break;
            case 'G2':this.dirType =Emplacement.BOTTOM;this.hideOrShowShooter(0,1,0,0);break;
            case 'G3':this.dirType =Emplacement.LEFT;this.hideOrShowShooter(0,0,1,0);break;
            case 'G4':this.dirType =Emplacement.RIGHT;this.hideOrShowShooter(0,0,0,1);break;
            case 'G5':this.dirType =Emplacement.TOPBOTTOM;this.hideOrShowShooter(1,1,0,0);break;
            case 'G6':this.dirType =Emplacement.TOPLEFT;this.hideOrShowShooter(1,0,1,0);break;
            case 'G7':this.dirType =Emplacement.TOPRIGHT;this.hideOrShowShooter(1,0,0,1);break;
            case 'G8':this.dirType =Emplacement.BOTTOMLEFT;this.hideOrShowShooter(0,1,1,0);break;
            case 'G9':this.dirType =Emplacement.BOTTOMRIGHT;this.hideOrShowShooter(0,1,0,1);break;
            case 'Ga':this.dirType =Emplacement.LEFTRIGHT;this.hideOrShowShooter(0,0,1,1);break;
        }
    }
    hideOrShowShooter(top:number,bottom:number,left:number,right:number){
        this.shooterTop.node.active = top>0;
        this.shooterBottom.node.active = bottom>0;
        this.shooterLeft.node.active = left>0;
        this.shooterRight.node.active = right>0;
    }
    start() {
        this.anim = this.getComponent(cc.Animation);
        this.scheduleOnce(() => { this.fire() }, 1);
    }

    setPos(pos: cc.Vec3) {
        this.pos = pos;
        this.entity.Transform.position = Dungeon.getPosInMap(pos);
        this.node.position = this.entity.Transform.position.clone();
        this.node.zIndex = IndexZ.getActorZIndex(this.entity.Transform.position);
    }
    //Animation
    OpenFire() {
        if (!this.dungeon) {
            return;
        }
        switch (this.dirType) {
            case Emplacement.ALL:
                this.fireShooter(this.shooterTop);
                this.fireShooter(this.shooterBottom);
                this.fireShooter(this.shooterLeft);
                this.fireShooter(this.shooterRight);
                break;
            case Emplacement.TOP:
                this.fireShooter(this.shooterTop);
                break;
            case Emplacement.BOTTOM:
                this.fireShooter(this.shooterBottom);
                break;
            case Emplacement.LEFT:
                this.fireShooter(this.shooterLeft);
                break;
            case Emplacement.RIGHT:
                this.fireShooter(this.shooterRight);
                break;
            case Emplacement.TOPBOTTOM:
                this.fireShooter(this.shooterTop);
                this.fireShooter(this.shooterBottom);
                break;
            case Emplacement.TOPLEFT:
                this.fireShooter(this.shooterTop);
                this.fireShooter(this.shooterLeft);
                break;
            case Emplacement.TOPRIGHT:
                this.fireShooter(this.shooterTop);
                this.fireShooter(this.shooterRight);
                break;
            case Emplacement.BOTTOMLEFT:
                this.fireShooter(this.shooterBottom);
                this.fireShooter(this.shooterLeft);
                break;
            case Emplacement.BOTTOMRIGHT:
                this.fireShooter(this.shooterBottom);
                this.fireShooter(this.shooterRight);
                break;
            case Emplacement.LEFTRIGHT:
                this.fireShooter(this.shooterLeft);
                this.fireShooter(this.shooterRight);
                break;
            default:
                this.fireShooter(this.shooterTop);
                this.fireShooter(this.shooterBottom);
                this.fireShooter(this.shooterLeft);
                this.fireShooter(this.shooterRight);
                break;
        }
    }
    fire() {
        if (this.anim) {
            this.anim.play();
        }
    }
    fireShooter(shooter: Shooter) {
        if (!shooter.dungeon) {
            shooter.dungeon = this.dungeon;
            shooter.data.bulletType = "bullet010";
            shooter.data.bulletLineExNum = 0;
            shooter.data.bulletLineInterval = 0.5;
            shooter.data.img = 'emplacement';
            shooter.isBuilding = true;

            switch (Logic.chapterIndex) {
                case Logic.CHAPTER00: shooter.data.bulletLineExNum = 0; shooter.data.bulletType = "laser001"; break;
                case Logic.CHAPTER01: shooter.data.bulletType = "bullet010"; break;
                case Logic.CHAPTER02: shooter.data.bulletType = "bullet013"; break;
                case Logic.CHAPTER03: shooter.data.bulletType = "bullet006"; shooter.data.bulletLineExNum = 1; break;
                case Logic.CHAPTER04: shooter.data.bulletType = "bullet024"; shooter.data.bulletLineExNum = 1; break;
                case Logic.CHAPTER05: shooter.data.bulletType = "bullet024"; shooter.data.bulletLineExNum = 1; break;
                case Logic.CHAPTER099: shooter.data.bulletType = "bullet010"; break;
            }
        }
        shooter.fireBullet(0,cc.v3(64,0));
    }
    setShooterHv(shooter: Shooter, hv: cc.Vec2) {
        shooter.setHv(hv);
    }
    update(dt) {
        if(Logic.isGamePause){
            return;
        }
        this.timeDelay += dt;
        if (this.timeDelay > 3) {
            this.timeDelay = 0;
            this.fire();
        }
    }

}
