import Dungeon from '../logic/Dungeon'
import Shooter from '../logic/Shooter'
import Logic from '../logic/Logic'
import Building from './Building'
import FromData from '../data/FromData'
import IndexZ from '../utils/IndexZ'
import DamageData from '../data/DamageData'
import AudioPlayer from '../utils/AudioPlayer'
import Actor from '../base/Actor'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class Emplacement extends Building {
    @property(cc.Node)
    shooterTopNode: cc.Node = null
    shooterTop: Shooter = null
    @property(cc.Node)
    shooterBottomNode: cc.Node = null
    shooterBottom: Shooter = null
    @property(cc.Node)
    shooterLeftNode: cc.Node = null
    shooterLeft: Shooter = null
    @property(cc.Node)
    shooterRightNode: cc.Node = null
    shooterRight: Shooter = null
    isOpen: boolean = false
    pos: cc.Vec3 = cc.v3(0, 0)
    private sprite: cc.Node
    private timeDelay = 0
    dungeon: Dungeon
    anim: cc.Animation
    static readonly BOTTOM = 0 //G0
    static readonly TOP = 1 //G1
    static readonly RIGHT = 2 //G2
    static readonly LEFT = 3 //G3
    static readonly TOPBOTTOM = 4 //G4
    static readonly LEFTRIGHT = 5 //G5
    static readonly BOTTOMRIGHT = 6 //G6
    static readonly BOTTOMLEFT = 7 //G7
    static readonly TOPLEFT = 8 //G8
    static readonly TOPRIGHT = 9 //G9
    static readonly BOTTOMLEFTRIGHT = 10 //G10
    static readonly TOPLEFTRIGHT = 11 //G11
    static readonly RIGHTTOPBOTTOM = 12 //G12
    static readonly LEFTTOPBOTTOM = 13 //G13
    static readonly ALL = 14 //G14
    dirType = 0 //方向类型
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.shooterTop = this.shooterTopNode.getComponent(Shooter)
        this.shooterBottom = this.shooterBottomNode.getComponent(Shooter)
        this.shooterLeft = this.shooterLeftNode.getComponent(Shooter)
        this.shooterRight = this.shooterRightNode.getComponent(Shooter)
        this.setShooterHv(this.shooterTop, cc.v2(0, 1))
        this.setShooterHv(this.shooterBottom, cc.v2(0, -1))
        this.setShooterHv(this.shooterLeft, cc.v2(-1, 0))
        this.setShooterHv(this.shooterRight, cc.v2(1, 0))
        let from = FromData.getClone('炮台', 'emplacement', this.node.position)
        this.shooterTop.from.valueCopy(from)
        this.shooterBottom.from.valueCopy(from)
        this.shooterLeft.from.valueCopy(from)
        this.shooterRight.from.valueCopy(from)
    }
    setDirType(mapStr: string) {
        switch (mapStr) {
            case 'G0':
                this.dirType = Emplacement.BOTTOM
                this.hideOrShowShooter(0, 1, 0, 0)
                break
            case 'G1':
                this.dirType = Emplacement.TOP
                this.hideOrShowShooter(1, 0, 0, 0)
                break
            case 'G2':
                this.dirType = Emplacement.RIGHT
                this.hideOrShowShooter(0, 0, 0, 1)
                break
            case 'G3':
                this.dirType = Emplacement.LEFT
                this.hideOrShowShooter(0, 0, 1, 0)
                break
            case 'G4':
                this.dirType = Emplacement.TOPBOTTOM
                this.hideOrShowShooter(1, 1, 0, 0)
                break
            case 'G5':
                this.dirType = Emplacement.LEFTRIGHT
                this.hideOrShowShooter(0, 0, 1, 1)
                break
            case 'G6':
                this.dirType = Emplacement.BOTTOMRIGHT
                this.hideOrShowShooter(0, 1, 0, 1)
                break
            case 'G7':
                this.dirType = Emplacement.BOTTOMLEFT
                this.hideOrShowShooter(0, 1, 1, 0)
                break
            case 'G8':
                this.dirType = Emplacement.TOPLEFT
                this.hideOrShowShooter(1, 0, 1, 0)
                break
            case 'G9':
                this.dirType = Emplacement.TOPRIGHT
                this.hideOrShowShooter(1, 0, 0, 1)
                break
            case 'G10':
                this.dirType = Emplacement.BOTTOMLEFTRIGHT
                this.hideOrShowShooter(0, 1, 1, 1)
                break
            case 'G11':
                this.dirType = Emplacement.TOPLEFTRIGHT
                this.hideOrShowShooter(1, 0, 1, 1)
                break
            case 'G12':
                this.dirType = Emplacement.RIGHTTOPBOTTOM
                this.hideOrShowShooter(1, 1, 0, 1)
                break
            case 'G13':
                this.dirType = Emplacement.LEFTTOPBOTTOM
                this.hideOrShowShooter(1, 1, 1, 0)
                break
            case 'G14':
                this.dirType = Emplacement.ALL
                this.hideOrShowShooter(1, 1, 1, 1)
                break
        }
    }
    hideOrShowShooter(top: number, bottom: number, left: number, right: number) {
        this.shooterTopNode.active = top > 0
        this.shooterBottomNode.active = bottom > 0
        this.shooterLeftNode.active = left > 0
        this.shooterRightNode.active = right > 0
    }
    start() {
        this.anim = this.getComponent(cc.Animation)
        this.scheduleOnce(() => {
            this.fire()
        }, 1)
    }

    setPos(pos: cc.Vec3) {
        this.pos = pos
        this.entity.Transform.position = Dungeon.getPosInMap(pos)
        this.node.position = this.entity.Transform.position.clone()
        this.node.zIndex = IndexZ.getActorZIndex(this.entity.Transform.position)
    }
    //Animation
    OpenFire() {
        if ((this.dungeon && this.dungeon.isClear) || this.data.currentHealth <= 0) {
            return
        }
        switch (this.dirType) {
            case Emplacement.ALL:
                this.fireShooter(this.shooterTop)
                this.fireShooter(this.shooterBottom)
                this.fireShooter(this.shooterLeft)
                this.fireShooter(this.shooterRight)
                break
            case Emplacement.TOP:
                this.fireShooter(this.shooterTop)
                break
            case Emplacement.BOTTOM:
                this.fireShooter(this.shooterBottom)
                break
            case Emplacement.LEFT:
                this.fireShooter(this.shooterLeft)
                break
            case Emplacement.RIGHT:
                this.fireShooter(this.shooterRight)
                break
            case Emplacement.TOPBOTTOM:
                this.fireShooter(this.shooterTop)
                this.fireShooter(this.shooterBottom)
                break
            case Emplacement.TOPLEFT:
                this.fireShooter(this.shooterTop)
                this.fireShooter(this.shooterLeft)
                break
            case Emplacement.TOPRIGHT:
                this.fireShooter(this.shooterTop)
                this.fireShooter(this.shooterRight)
                break
            case Emplacement.BOTTOMLEFT:
                this.fireShooter(this.shooterBottom)
                this.fireShooter(this.shooterLeft)
                break
            case Emplacement.BOTTOMRIGHT:
                this.fireShooter(this.shooterBottom)
                this.fireShooter(this.shooterRight)
                break
            case Emplacement.LEFTRIGHT:
                this.fireShooter(this.shooterLeft)
                this.fireShooter(this.shooterRight)
                break
            case Emplacement.LEFTTOPBOTTOM:
                this.fireShooter(this.shooterLeft)
                this.fireShooter(this.shooterTop)
                this.fireShooter(this.shooterBottom)
                break
            case Emplacement.RIGHTTOPBOTTOM:
                this.fireShooter(this.shooterRight)
                this.fireShooter(this.shooterTop)
                this.fireShooter(this.shooterBottom)
                break
            case Emplacement.TOPLEFTRIGHT:
                this.fireShooter(this.shooterRight)
                this.fireShooter(this.shooterTop)
                this.fireShooter(this.shooterLeft)
                break
            case Emplacement.BOTTOMLEFTRIGHT:
                this.fireShooter(this.shooterRight)
                this.fireShooter(this.shooterBottom)
                this.fireShooter(this.shooterLeft)
                break
            default:
                this.fireShooter(this.shooterTop)
                this.fireShooter(this.shooterBottom)
                this.fireShooter(this.shooterLeft)
                this.fireShooter(this.shooterRight)
                break
        }
    }
    fire() {
        if ((this.dungeon && this.dungeon.isClear) || this.data.currentHealth <= 0) {
            return
        }
        if (this.anim) {
            this.anim.play()
        }
    }
    takeDamage(damage: DamageData, from: FromData, actor?: Actor): boolean {
        if (this.data.currentHealth <= 0 || this.data.currentHealth >= 9999) {
            return false
        }
        let hitNames = [AudioPlayer.MONSTER_HIT, AudioPlayer.MONSTER_HIT1, AudioPlayer.MONSTER_HIT2]
        AudioPlayer.play(hitNames[Logic.getRandomNum(0, 2)])
        this.data.currentHealth--
        cc.tween(this.shooterTopNode).to(0.2, { scale: 1.5 }).to(0.5, { scale: 0 }).start()
        cc.tween(this.shooterBottomNode).to(0.2, { scale: 1.5 }).to(0.5, { scale: 0 }).start()
        cc.tween(this.shooterLeftNode).to(0.2, { scale: 1.5 }).to(0.5, { scale: 0 }).start()
        cc.tween(this.shooterRightNode).to(0.2, { scale: 1.5 }).to(0.5, { scale: 0 }).start()
        return true
    }
    fireShooter(shooter: Shooter) {
        if (!shooter.dungeon) {
            shooter.dungeon = this.dungeon
            shooter.actor = this
            shooter.data.bulletType = 'bullet010'
            shooter.data.bulletLineExNum = 0
            shooter.data.bulletLineInterval = 0.5
            shooter.data.img = 'emplacement'
            shooter.isBuilding = true

            switch (Logic.data.chapterIndex) {
                case Logic.CHAPTER00:
                    shooter.data.bulletLineExNum = 0
                    shooter.data.bulletType = 'laser001'
                    break
                case Logic.CHAPTER01:
                    shooter.data.bulletType = 'bullet010'
                    break
                case Logic.CHAPTER02:
                    shooter.data.bulletType = 'bullet013'
                    break
                case Logic.CHAPTER03:
                    shooter.data.bulletType = 'bullet006'
                    shooter.data.bulletLineExNum = 1
                    break
                case Logic.CHAPTER04:
                    shooter.data.bulletType = 'bullet024'
                    shooter.data.bulletLineExNum = 1
                    break
                case Logic.CHAPTER05:
                    shooter.data.bulletType = 'bullet024'
                    shooter.data.bulletLineExNum = 1
                    break
                case Logic.CHAPTER099:
                    shooter.data.bulletType = 'bullet010'
                    break
            }
        }
        shooter.fireBullet(0, cc.v3(64, 0))
    }
    setShooterHv(shooter: Shooter, hv: cc.Vec2) {
        shooter.setHv(hv)
    }
    update(dt) {
        if (Logic.isGamePause) {
            return
        }
        this.timeDelay += dt
        if (this.timeDelay > 3) {
            this.timeDelay = 0
            this.fire()
        }
    }
}
