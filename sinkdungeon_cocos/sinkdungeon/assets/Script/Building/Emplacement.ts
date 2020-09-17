import Dungeon from "../Dungeon";
import { EventHelper } from "../EventHelper";
import Player from "../Player";
import Shooter from "../Shooter";
import Logic from "../Logic";
import Building from "./Building";
import FromData from "../Data/FromData";
import IndexZ from "../Utils/IndexZ";


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
    static readonly ALL = 0;//E0
    static readonly TOP = 1;//E1
    static readonly BOTTOM = 2;//E2
    static readonly LEFT = 3;//E3
    static readonly RIGHT = 4;//E4
    static readonly TOPBOTTOM = 5;//E5
    static readonly TOPLEFT = 6;//E6
    static readonly TOPRIGHT = 7;//E7
    static readonly BOTTOMLEFT = 8;//E8
    static readonly BOTTOMRIGHT = 9;//E9
    static readonly LEFTRIGHT = 10;//EE
    dirType = 0;//方向类型
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.setShooterHv(this.shooterTop, cc.v3(0, 1));
        this.setShooterHv(this.shooterBottom, cc.v3(0, -1));
        this.setShooterHv(this.shooterLeft, cc.v3(-1, 0));
        this.setShooterHv(this.shooterRight, cc.v3(1, 0));
        let from = FromData.getClone('炮台','emplacement');
        this.shooterTop.from.valueCopy(from);
        this.shooterBottom.from.valueCopy(from);
        this.shooterLeft.from.valueCopy(from);
        this.shooterRight.from.valueCopy(from);
    }
    setDirType(mapStr:string){
        switch(mapStr){
            case 'E0':this.dirType =Emplacement.ALL;break;
            case 'E1':this.dirType =Emplacement.TOP;break;
            case 'E2':this.dirType =Emplacement.BOTTOM;break;
            case 'E3':this.dirType =Emplacement.LEFT;break;
            case 'E4':this.dirType =Emplacement.RIGHT;break;
            case 'E5':this.dirType =Emplacement.TOPBOTTOM;break;
            case 'E6':this.dirType =Emplacement.TOPLEFT;break;
            case 'E7':this.dirType =Emplacement.TOPRIGHT;break;
            case 'E8':this.dirType =Emplacement.BOTTOMLEFT;break;
            case 'E9':this.dirType =Emplacement.BOTTOMRIGHT;break;
            case 'EE':this.dirType =Emplacement.LEFTRIGHT;break;
        }
    }
    start() {
        this.anim = this.getComponent(cc.Animation);
        this.scheduleOnce(() => { this.fire() }, 1);
    }

    setPos(pos: cc.Vec3) {
        this.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position);
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

            switch (Logic.chapterIndex) {
                case Logic.CHAPTER00: shooter.data.bulletLineExNum = 3; shooter.data.bulletType = "laser001"; break;
                case Logic.CHAPTER01: shooter.data.bulletType = "bullet010"; break;
                case Logic.CHAPTER02: shooter.data.bulletType = "bullet013"; break;
                case Logic.CHAPTER03: shooter.data.bulletType = "bullet006"; shooter.data.bulletLineExNum = 1; break;
                case Logic.CHAPTER04: shooter.data.bulletType = "bullet024"; shooter.data.bulletLineExNum = 1; break;
                case Logic.CHAPTER05: shooter.data.bulletType = "bullet024"; shooter.data.bulletLineExNum = 1; break;
                case Logic.CHAPTER099: shooter.data.bulletType = "bullet010"; break;
            }
        }
        shooter.fireBullet();
    }
    setShooterHv(shooter: Shooter, hv: cc.Vec3) {
        shooter.setHv(hv);
    }
    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 3) {
            this.timeDelay = 0;
            this.fire();
        }
    }

}
