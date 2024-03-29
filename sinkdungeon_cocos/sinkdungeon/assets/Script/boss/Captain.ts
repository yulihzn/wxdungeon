import CaptainSword from './CaptainSword'
import HealthBar from '../logic/HealthBar'
import Dungeon from '../logic/Dungeon'
import Shooter from '../logic/Shooter'
import DamageData from '../data/DamageData'
import Boss from './Boss'
import NextStep from '../utils/NextStep'
import AudioPlayer from '../utils/AudioPlayer'
import FromData from '../data/FromData'
import Achievement from '../logic/Achievement'
import ActorUtils from '../utils/ActorUtils'
import Logic from '../logic/Logic'
import CCollider from '../collider/CCollider'

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
export default class Captain extends Boss {
    init(type: number): void {}

    @property(CaptainSword)
    sword: CaptainSword = null

    healthBar: HealthBar = null
    private anim: cc.Animation
    isFaceRight = true
    isMoving = false
    private timeDelay = 0
    isFall = false
    shooter: Shooter = null
    exshooter: Shooter = null
    attackSkill = new NextStep()
    fireSkill = new NextStep()
    jumpSkill = new NextStep()
    onLoad() {
        this.attackSkill.IsExcuting = false
        this.sc.isDied = false
        this.anim = this.getComponent(cc.Animation)
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter)
        this.exshooter = this.node.getChildByName('ExShooter').getComponent(Shooter)
        this.shooter.from.valueCopy(FromData.getClone(this.actorName(), 'captain_head', this.node.position))
        this.exshooter.from.valueCopy(FromData.getClone(this.actorName(), 'captain_head', this.node.position))
        this.updatePlayerPos()
        this.entity.NodeRender.node = this.node
        this.entity.Move.damping = 1
    }

    start() {
        super.start()
    }
    //Animation
    AttackDamageStart() {
        this.sword.isShow = true
    }
    //Animation
    AttackDamageFinish() {
        this.sword.isShow = false
    }
    //Animation
    AttackStart() {
        this.attackSkill.IsExcuting = true
        AudioPlayer.play(AudioPlayer.MELEE)
    }
    //Animation
    AttackFinish() {
        this.attackSkill.IsExcuting = false
    }
    //Animation
    JumpStart() {
        this.jumpSkill.IsExcuting = true
        this.getComponent(CCollider).sensor = true
    }
    //Animation
    FireSwordLight() {
        this.shooter.setHv(cc.v2(this.isFaceRight ? 1 : -1, 0))
        this.shooter.dungeon = this.dungeon
        this.shooter.actor = this
        this.shooter.data.bulletType = 'bullet043'
        this.shooter.fireBullet(0, cc.v3(16, 0))
    }
    //Animation
    JumpFinish() {
        this.jumpSkill.IsExcuting = false
        this.isFall = true
        this.scheduleOnce(() => {
            this.isFall = false
        }, 0.1)
        this.getComponent(CCollider).sensor = false
        if (!this.dungeon || !this.exshooter) {
            return
        }
        let hv = this.dungeon.player.getCenterPosition().sub(this.node.position)
        if (!hv.equals(cc.Vec3.ZERO)) {
            hv = hv.normalizeSelf()
            this.exshooter.setHv(cc.v2(hv))
            this.exshooter.dungeon = this.dungeon
            this.exshooter.actor = this
            this.exshooter.data.bulletType = 'bullet033'
            this.exshooter.data.bulletArcOffsetX = 64
            this.exshooter.data.bulletArcExNum = 99
            this.exshooter.data.bulletArcOffsetX = 32
            this.exshooter.data.bulletLineInterval = 1
            if (this.data.currentHealth < this.data.Common.MaxHealth / 2) {
                this.exshooter.data.bulletLineExNum = 1
            }
            this.exshooter.fireBullet(0, cc.v3(16, 0))
        }
    }
    fireWithGun() {
        if (!this.dungeon || !this.shooter) {
            return
        }
        let hv = this.dungeon.player.getCenterPosition().sub(this.entity.Transform.position)
        if (!hv.equals(cc.Vec3.ZERO)) {
            this.shooter.setHv(cc.v2(hv).normalize())
            this.shooter.dungeon = this.dungeon
            this.shooter.actor = this
            this.shooter.data.bulletType = 'bullet102'
            this.shooter.fireBullet(0, cc.v3(16, 0))
        }
    }
    //Animation
    OpenFire() {
        if (!this.dungeon || !this.shooter) {
            return
        }
        this.shooter.data.bulletArcExNum = 0
        this.fireWithGun()
        if (this.data.currentHealth < this.data.Common.MaxHealth / 2) {
            this.scheduleOnce(() => {
                this.fireWithGun()
            }, 0.5)
        }
    }

    onColliderStay(other: CCollider, self: CCollider) {
        if (self.tag == CCollider.TAG.BOSS_HIT) {
            let target = ActorUtils.getEnemyCollisionTarget(other)
            if (target) {
                if (this.isFall && !this.sc.isDied) {
                    this.isFall = false
                    let dd = new DamageData()
                    dd.physicalDamage = 10
                    target.takeDamage(dd, FromData.getClone(this.actorName(), 'captain_head', this.node.position), this)
                }
            }
        }
    }

    updateLogic(dt: number) {
        this.statusManager.updateLogic(dt)
        this.healthBar.node.active = !this.sc.isDied
        this.timeDelay += dt
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0
            this.bossAction()
            this.JumpMove()
        }
        if (this.dungeon) {
            let playerDis = this.getNearPlayerDistance(this.dungeon.player.node)
            if (playerDis < 96) {
                this.entity.Move.linearVelocity = cc.Vec2.ZERO
            }
        }
        if (this.sc.isDied) {
            this.entity.Move.linearVelocity = cc.Vec2.ZERO
        }
        this.healthBar.node.active = !this.sc.isDied
        if (this.data.currentHealth < 1) {
            this.killed()
        }
        this.node.scaleX = this.isFaceRight ? 1 : -1
    }
    takeDamage(damage: DamageData): boolean {
        let isPlayJump = this.anim.getAnimationState('CaptainJump').isPlaying
        if (this.sc.isDied || isPlayJump) {
            return false
        }
        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage()
        if (this.data.currentHealth > this.data.Common.MaxHealth) {
            this.data.currentHealth = this.data.Common.MaxHealth
        }

        // this.anim.playAdditive('CaptainHit');
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.MaxHealth)
        let hitNames = [AudioPlayer.MONSTER_HIT, AudioPlayer.MONSTER_HIT1, AudioPlayer.MONSTER_HIT2]
        AudioPlayer.play(hitNames[Logic.getRandomNum(0, 2)])
        return true
    }

    killed() {
        if (this.sc.isDied) {
            return
        }
        Achievement.addMonsterKillAchievement(this.data.resName)
        this.sc.isDied = true
        this.anim.play('CaptainDie')
        let collider: CCollider = this.getComponent(CCollider)
        collider.sensor = true
        this.scheduleOnce(() => {
            if (this.node) {
                this.node.active = false
            }
        }, 5)
        this.getLoot()
    }
    bossAction() {
        if (this.sc.isDied || !this.dungeon) {
            return
        }
        this.entity.Transform.position = Dungeon.fixOuterMap(this.entity.Transform.position)
        this.pos = Dungeon.getIndexInMap(this.entity.Transform.position)
        this.changeZIndex()
        let newPos = this.dungeon.player.pos.clone()
        let pos = Dungeon.getPosInMap(newPos).sub(this.entity.Transform.position)
        let playerDis = this.getNearPlayerDistance(this.dungeon.player.node)
        let isPlayJump = this.anim.getAnimationState('CaptainJump').isPlaying
        let isPlayFire = this.anim.getAnimationState('CaptainFire').isPlaying
        let h = pos.x
        let v = pos.y
        let absh = Math.abs(h)
        let absv = Math.abs(v)
        this.isFaceRight = h > 0
        if (isPlayJump || isPlayFire) {
            return
        }
        let speed = 4
        if (!isPlayJump) {
            this.fireSkill.next(() => {
                speed = 1
                this.anim.play('CaptainFire')
            }, 5)
        }
        if (playerDis < 140 && !this.dungeon.player.sc.isDied) {
            this.attackSkill.next(() => {
                this.attackSkill.IsExcuting = true
                this.anim.play('CaptainAttack')
            }, 1)
        } else {
            if (playerDis > 300) {
                this.jumpSkill.next(() => {
                    this.anim.play('CaptainJump')
                    isPlayJump = true
                }, 8)
            }

            if (!pos.equals(cc.Vec3.ZERO) && !isPlayJump && !this.attackSkill.IsExcuting) {
                pos = pos.normalizeSelf()
                this.move(pos, speed)
            }
        }
    }

    JumpMove() {
        if (!this.dungeon || !this.jumpSkill.IsExcuting) {
            return
        }
        let newPos = this.dungeon.player.pos.clone()
        let pos = Dungeon.getPosInMap(newPos).sub(this.entity.Transform.position)
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.entity.Transform.position)
        }
        let h = pos.x
        let v = pos.y
        let absh = Math.abs(h)
        let absv = Math.abs(v)

        let movement = cc.v2(h, v)
        let speed = 4
        if (this.data.currentHealth < this.data.Common.MaxHealth / 2) {
            speed = 5
        }
        movement = movement.normalize().mul(speed)
        this.entity.Move.linearVelocity = movement
        this.isMoving = h != 0 || v != 0
    }
    move(pos: cc.Vec3, speed: number) {
        if (this.sc.isDied) {
            return
        }
        if (this.attackSkill.IsExcuting && !pos.equals(cc.Vec3.ZERO)) {
            pos = pos.mul(0.5)
        }

        if (!pos.equals(cc.Vec3.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.entity.Transform.position)
        }
        let h = pos.x
        let v = pos.y
        let absh = Math.abs(h)
        let absv = Math.abs(v)

        let movement = cc.v2(h, v)
        movement = movement.normalize().mul(speed)
        this.entity.Move.linearVelocity = movement
        this.isMoving = h != 0 || v != 0
        if (this.isMoving) {
            this.isFaceRight = h > 0
        }
        if (this.isMoving) {
            if (!this.anim.getAnimationState('CaptainMove').isPlaying) {
                this.anim.playAdditive('CaptainMove')
            }
        } else {
            if (this.anim.getAnimationState('CaptainMove').isPlaying) {
                this.anim.play('CaptainIdle')
            }
        }
        this.changeZIndex()
    }
    actorName() {
        return '邪恶船长'
    }
}
