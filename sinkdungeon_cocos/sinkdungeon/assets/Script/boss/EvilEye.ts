import Dungeon from '../logic/Dungeon'
import Shooter from '../logic/Shooter'
import DamageData from '../data/DamageData'
import StatusManager from '../manager/StatusManager'
import Boss from './Boss'
import NextStep from '../utils/NextStep'
import AudioPlayer from '../utils/AudioPlayer'
import FromData from '../data/FromData'
import Achievement from '../logic/Achievement'
import ActorUtils from '../utils/ActorUtils'
import Logic from '../logic/Logic'
import CCollider from '../collider/CCollider'
import { MoveComponent } from '../ecs/component/MoveComponent'
import Utils from '../utils/Utils'

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
export default class EvilEye extends Boss {
    init(type: number): void {
        throw new Error('Method not implemented.')
    }

    private graphics: cc.Graphics
    private anim: cc.Animation
    shooter: Shooter
    private timeDelay = 0
    isMoving = false
    viceEyes: cc.Node[] //1-6个副眼
    viceShooters: Shooter[] //1-6个副炮

    viceEyesFireSkill = new NextStep()
    mainEyesFireSkill = new NextStep()
    dashSkill = new NextStep()
    isHalfBlood = false

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sc.isDied = false
        this.sc.isShow = false
        this.graphics = this.getComponent(cc.Graphics)
        this.anim = this.getComponent(cc.Animation)
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter)
        this.statusManager = this.node.getChildByName('StatusManager').getComponent(StatusManager)
        this.viceEyes = new Array()
        this.viceEyes.push(
            this.node.getChildByName('sprite').getChildByName('limb1').getChildByName('tentacle1').getChildByName('tentacle2').getChildByName('tentacle3').getChildByName('eye')
        )
        this.viceEyes.push(
            this.node.getChildByName('sprite').getChildByName('limb2').getChildByName('tentacle1').getChildByName('tentacle2').getChildByName('tentacle3').getChildByName('eye')
        )
        this.viceEyes.push(
            this.node.getChildByName('sprite').getChildByName('limb3').getChildByName('tentacle1').getChildByName('tentacle2').getChildByName('tentacle3').getChildByName('eye')
        )
        this.viceEyes.push(
            this.node.getChildByName('sprite').getChildByName('limb4').getChildByName('tentacle1').getChildByName('tentacle2').getChildByName('tentacle3').getChildByName('eye')
        )
        this.viceEyes.push(
            this.node.getChildByName('sprite').getChildByName('limb5').getChildByName('tentacle1').getChildByName('tentacle2').getChildByName('tentacle3').getChildByName('eye')
        )
        this.viceEyes.push(
            this.node.getChildByName('sprite').getChildByName('limb6').getChildByName('tentacle1').getChildByName('tentacle2').getChildByName('tentacle3').getChildByName('eye')
        )
        this.viceShooters = new Array()
        this.viceShooters.push(this.node.getChildByName('Shooter1').getComponent(Shooter))
        this.viceShooters.push(this.node.getChildByName('Shooter2').getComponent(Shooter))
        this.viceShooters.push(this.node.getChildByName('Shooter3').getComponent(Shooter))
        this.viceShooters.push(this.node.getChildByName('Shooter4').getComponent(Shooter))
        this.viceShooters.push(this.node.getChildByName('Shooter5').getComponent(Shooter))
        this.viceShooters.push(this.node.getChildByName('Shooter6').getComponent(Shooter))
        let from = FromData.getClone(this.actorName(), 'evileyeeye', this.node.position)
        this.shooter.from.valueCopy(from)
        for (let vice of this.viceShooters) {
            vice.from.valueCopy(from)
        }
    }

    start() {
        super.start()
    }

    takeDamage(damage: DamageData): boolean {
        if (this.sc.isDied || !this.sc.isShow || this.anim.getAnimationState('EvilEyeHurt').isPlaying) {
            return false
        }

        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage()
        if (this.data.currentHealth > this.data.Common.MaxHealth) {
            this.data.currentHealth = this.data.Common.MaxHealth
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.MaxHealth)
        let isHalf = this.data.currentHealth < this.data.Common.MaxHealth / 2
        if (isHalf && !this.isHalfBlood) {
            this.isHalfBlood = true
            this.anim.play('EvilEyeHurt')
            this.scheduleOnce(() => {
                this.anim.play('EvilEyeBite')
            }, 2.5)
        }
        let hitNames = [AudioPlayer.MONSTER_HIT, AudioPlayer.MONSTER_HIT1, AudioPlayer.MONSTER_HIT2]
        AudioPlayer.play(hitNames[Logic.getRandomNum(0, 2)])
        return true
    }

    killed() {
        if (this.sc.isDied) {
            return
        }
        Achievement.addMonsterKillAchievement(this.data.resName)
        cc.tween(this.node).to(3, { opacity: 0 }).start()
        this.sc.isDied = true
        this.scheduleOnce(() => {
            if (this.node) {
                this.node.active = false
            }
        }, 5)
        this.getLoot()
    }
    bossAction(): void {
        if (this.sc.isDied || !this.sc.isShow || !this.dungeon) {
            return
        }
        this.entity.Transform.position = Dungeon.fixOuterMap(this.entity.Transform.position)
        this.pos = Dungeon.getIndexInMap(this.entity.Transform.position)
        this.changeZIndex()
        let pos = this.getMovePos()
        let playerDis = this.getNearPlayerDistance(this.dungeon.player.node)
        let isHalf = this.data.currentHealth < this.data.Common.MaxHealth / 2
        if (playerDis < 100) {
            this.entity.Move.linearVelocity = cc.Vec2.ZERO
        }

        if (!this.mainEyesFireSkill.IsExcuting && isHalf && !this.anim.getAnimationState('EvilEyeHurt').isPlaying) {
            this.dash()
        }
        this.fireWithViceEyes(isHalf)
        if (!this.dashSkill.IsExcuting) {
            this.fireWithMainEye()
        }
        if (!pos.equals(cc.Vec3.ZERO) && playerDis > 100 && !this.shooter.isAiming && !this.dashSkill.IsExcuting) {
            pos = pos.normalizeSelf()
            this.move(pos, 1)
        }
    }
    getMovePos(): cc.Vec3 {
        let newPos = this.dungeon.player.pos.clone()
        // if (this.dungeon.player.pos.x > this.pos.x) {
        //     newPos = newPos.addSelf(cc.v3(1, 1));
        // } else {
        //     newPos = newPos.addSelf(cc.v3(-1, 1));
        // }
        let pos = Dungeon.getPosInMap(newPos)
        pos.y += 32
        pos = pos.sub(this.entity.Transform.position)
        let h = pos.x
        return pos
    }

    fireWithViceEyes(isHalf: boolean) {
        this.viceEyesFireSkill.next(() => {
            this.viceEyesFireSkill.IsExcuting = true
            this.scheduleOnce(() => {
                this.viceEyesFireSkill.IsExcuting = false
            }, 2)
            if (isHalf) {
                this.schedule(
                    () => {
                        this.fireViceBullet()
                    },
                    0.5,
                    2,
                    0
                )
            } else {
                this.fireViceBullet()
            }
        }, 2)
    }
    fireViceBullet() {
        for (let i = 0; i < this.viceShooters.length; i++) {
            let p = this.viceEyes[i].convertToWorldSpaceAR(cc.v3(0, 0))
            p = this.node.convertToNodeSpaceAR(p)
            this.viceShooters[i].node.setPosition(p)
            let pos = this.entity.Transform.position.clone().add(p)
            let hv = this.dungeon.player.getCenterPosition().sub(pos)
            if (!hv.equals(cc.Vec3.ZERO)) {
                this.viceShooters[i].setHv(cc.v2(hv).normalize())
                this.fireShooter(this.viceShooters[i], 'bullet101', 0, 0, 0, cc.v3(0, 0))
            }
        }
    }
    fireWithMainEye() {
        this.mainEyesFireSkill.next(() => {
            this.mainEyesFireSkill.IsExcuting = true
            this.scheduleOnce(() => {
                this.mainEyesFireSkill.IsExcuting = false
            }, 3)
            let p = this.shooter.node.convertToWorldSpaceAR(cc.v3(0, 0))
            p = this.node.convertToNodeSpaceAR(p)
            this.shooter.node.setPosition(p)
            let pos = this.entity.Transform.position.clone().add(p)
            let hv = this.dungeon.player.getCenterPosition().sub(pos)
            if (!hv.equals(cc.Vec3.ZERO)) {
                this.shooter.setHv(cc.v2(hv).normalize())
                this.shooter.data.isLineAim = 1
                this.fireShooter(this.shooter, 'laser003', 0, 3, 0, cc.v3(0, 0))
                this.anim.playAdditive('EvilEyeStone')
            }
        }, 7)
    }
    dash() {
        this.dashSkill.next(
            () => {
                AudioPlayer.play(AudioPlayer.MELEE)
                this.dashSkill.IsExcuting = true
                if (!this.anim) {
                    this.anim = this.getComponent(cc.Animation)
                }
                this.anim.play('EvilEyeBite')
                let pos = this.getMovePos()
                let h = pos.x
                let v = pos.y
                let movement = cc.v2(h, v)
                movement = movement.normalize().mul(Utils.getDashSpeedByDistance(1500 / MoveComponent.PIXELS_PER_UNIT, this.entity.Move.damping))
                this.entity.Move.linearVelocity = movement
                this.scheduleOnce(() => {
                    this.dashSkill.IsExcuting = false
                }, 2)
            },
            3,
            true
        )
    }
    fireShooter(shooter: Shooter, bulletType: string, bulletArcExNum: number, bulletLineExNum: number, angle?: number, defaultPos?: cc.Vec3): void {
        shooter.dungeon = this.dungeon
        shooter.actor = this
        shooter.data.bulletType = bulletType
        shooter.data.bulletArcExNum = bulletArcExNum
        shooter.data.bulletLineExNum = bulletLineExNum
        shooter.shootBaseHeight = 32
        shooter.fireBullet(angle, defaultPos)
    }
    showBoss() {
        this.sc.isShow = true
        this.entity.NodeRender.node = this.node
        this.entity.Move.damping = 6
        if (this.healthBar) {
            this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.MaxHealth)
            this.healthBar.node.active = !this.sc.isDied
        }
    }
    actionTimeDelay = 0
    isActionTimeDelay(dt: number): boolean {
        this.actionTimeDelay += dt
        if (this.actionTimeDelay > 0.2) {
            this.actionTimeDelay = 0
            return true
        }
        return false
    }
    updateLogic(dt: number) {
        this.statusManager.updateLogic(dt)
        this.timeDelay += dt
        if (this.timeDelay > 1) {
            this.timeDelay = 0
        }
        if (this.isActionTimeDelay(dt)) {
            this.bossAction()
        }
        if (this.data.currentHealth < 1) {
            this.killed()
        }
        this.healthBar.node.active = !this.sc.isDied
        if (this.sc.isDied) {
            this.entity.Move.linearVelocity = cc.Vec2.ZERO
        }
    }

    move(pos: cc.Vec3, speed: number) {
        if (this.sc.isDied) {
            return
        }
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.entity.Transform.position)
        }
        let h = pos.x
        let v = pos.y
        let absh = Math.abs(h)
        let absv = Math.abs(v)

        let movement = cc.v2(h, v)
        movement = movement.mul(speed)
        this.entity.Move.linearVelocity = movement
        this.isMoving = h != 0 || v != 0

        this.changeZIndex()
    }
    onColliderEnter(other: CCollider, self: CCollider) {
        if (self.tag == CCollider.TAG.BOSS_HIT) {
            let target = ActorUtils.getEnemyCollisionTarget(other)
            if (target && this.dashSkill.IsExcuting) {
                let d = new DamageData()
                d.physicalDamage = 15
                let from = FromData.getClone(this.actorName(), 'evileyeeye', this.node.position)
                if (target.takeDamage(d, from, this)) {
                    target.addStatus(StatusManager.BLEEDING, from)
                }
            }
        }
    }
    actorName() {
        return '邪眼'
    }
}
