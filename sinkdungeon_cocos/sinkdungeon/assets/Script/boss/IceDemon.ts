import { MoveComponent } from './../ecs/component/MoveComponent'
import Dungeon from '../logic/Dungeon'
import Shooter from '../logic/Shooter'
import DamageData from '../data/DamageData'
import StatusManager from '../manager/StatusManager'
import Boss from './Boss'
import NextStep from '../utils/NextStep'
import AudioPlayer from '../utils/AudioPlayer'
import FromData from '../data/FromData'
import Achievement from '../logic/Achievement'
import AreaOfEffectData from '../data/AreaOfEffectData'
import IndexZ from '../utils/IndexZ'
import ActorUtils from '../utils/ActorUtils'
import MagicIce from '../talent/MagicIce'
import Logic from '../logic/Logic'
import CCollider from '../collider/CCollider'
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
export default class IceDemon extends Boss {
    init(type: number): void {}
    private anim: cc.Animation
    shooter: Shooter
    private timeDelay = 0
    isFaceRight = true
    isMoving = false
    dashSkill = new NextStep()
    thronSkill = new NextStep()
    defenceSkill = new NextStep()
    meleeSkill = new NextStep()
    @property(cc.Prefab)
    groundThron: cc.Prefab = null
    @property(cc.Prefab)
    selfThron: cc.Prefab = null
    thronPool: cc.NodePool
    @property(MagicIce)
    magicice: MagicIce = null
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sc.isDied = false
        this.sc.isShow = false
        this.anim = this.getComponent(cc.Animation)
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter)
        this.shooter.from.valueCopy(FromData.getClone(this.actorName(), 'bossicepart01'))
        this.statusManager = this.node.getChildByName('StatusManager').getComponent(StatusManager)
    }

    start() {
        super.start()
    }

    takeDamage(damage: DamageData): boolean {
        if (this.sc.isDied || !this.sc.isShow) {
            return false
        }

        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage()
        if (this.data.currentHealth > this.data.Common.MaxHealth) {
            this.data.currentHealth = this.data.Common.MaxHealth
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.MaxHealth)
        let isHalf = this.data.currentHealth < this.data.Common.MaxHealth / 2
        this.defence(isHalf)
        if (this.defenceSkill.IsExcuting) {
            AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_HIT)
        } else {
            let hitNames = [AudioPlayer.MONSTER_HIT, AudioPlayer.MONSTER_HIT1, AudioPlayer.MONSTER_HIT2]
            AudioPlayer.play(hitNames[Logic.getRandomNum(0, 2)])
        }
        return true
    }

    killed() {
        if (this.sc.isDied) {
            return
        }
        Achievement.addMonsterKillAchievement(this.data.resName)
        cc.tween(this.node).to(3, { opacity: 0 }).start()
        this.sc.isDied = true
        this.anim.play('IceDemonDefence')
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
        if (isHalf && !this.magicice.isShow && !this.defenceSkill.IsInCooling) {
            this.magicice.showIce()
        }
        if (playerDis < 200 && !this.defenceSkill.IsExcuting && !this.meleeSkill.IsExcuting && !this.thronSkill.IsExcuting && !this.dashSkill.IsExcuting) {
            this.attack()
        }
        if (!this.meleeSkill.IsExcuting && !this.defenceSkill.IsExcuting && !this.thronSkill.IsExcuting) {
            this.dash()
        }
        if (!this.meleeSkill.IsExcuting && !this.defenceSkill.IsExcuting && !this.dashSkill.IsExcuting) {
            this.thronGround(isHalf)
        }
        if (
            !pos.equals(cc.Vec3.ZERO) &&
            !this.meleeSkill.IsExcuting &&
            !this.defenceSkill.IsExcuting &&
            !this.thronSkill.IsExcuting &&
            !this.dashSkill.IsExcuting &&
            playerDis > 60
        ) {
            pos = pos.normalizeSelf()
            this.move(pos, 5)
        }
    }
    getMovePos(): cc.Vec3 {
        let newPos = this.dungeon.player.pos.clone()
        // if (this.dungeon.player.pos.x > this.pos.x) {
        //     newPos = newPos.addSelf(cc.v3(1, -1));
        // } else {
        //     newPos = newPos.addSelf(cc.v3(-1, -1));
        // }
        let pos = Dungeon.getPosInMap(newPos)
        pos.y += 32
        pos = pos.sub(this.node.position)
        let h = pos.x
        this.isFaceRight = h > 0
        return pos
    }
    thronGround(isHalf: boolean) {
        this.thronSkill.next(
            () => {
                this.thronSkill.IsExcuting = true
                if (!this.anim) {
                    this.anim = this.getComponent(cc.Animation)
                }
                this.anim.play('IceDemonThron')
                let count = 1
                this.scheduleOnce(() => {
                    AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_THRON)
                }, 1)
                this.scheduleOnce(() => {
                    AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_THRON)
                }, 2)
                this.schedule(
                    () => {
                        let p = this.pos.clone()
                        let ps = [
                            cc.v3(p.x, p.y + count),
                            cc.v3(p.x, p.y - count),
                            cc.v3(p.x + count, p.y + count),
                            cc.v3(p.x + count, p.y - count),
                            cc.v3(p.x + count, p.y),
                            cc.v3(p.x - count, p.y),
                            cc.v3(p.x - count, p.y + count),
                            cc.v3(p.x - count, p.y - count)
                        ]
                        for (let i = 0; i < ps.length; i++) {
                            // this.dungeon.addIceThron(Dungeon.getPosInMap(ps[i]), true);
                            let d = new DamageData()
                            d.physicalDamage = 3
                            this.shooter.dungeon = this.dungeon
                            this.shooter.actor = this
                            this.shooter.fireAoe(
                                this.selfThron,
                                new AreaOfEffectData().init(
                                    0,
                                    2,
                                    0.4,
                                    4,
                                    IndexZ.getActorZIndex(Dungeon.getPosInMap(ps[i])),
                                    true,
                                    true,
                                    true,
                                    false,
                                    true,
                                    d,
                                    FromData.getClone('冰刺', 'bossicethron02'),
                                    [StatusManager.FROZEN]
                                ),
                                Dungeon.getPosInMap(ps[i]).subSelf(this.getCenterPosition()),
                                0,
                                null,
                                true
                            )
                        }
                        count++
                    },
                    0.2,
                    isHalf ? 7 : 5,
                    1
                )
                if (isHalf) {
                    this.scheduleOnce(() => {
                        let p = this.pos.clone()
                        let ps = [
                            cc.v3(p.x + 2, p.y + 1),
                            cc.v3(p.x + 2, p.y - 1),
                            cc.v3(p.x - 2, p.y + 1),
                            cc.v3(p.x - 2, p.y - 1),
                            cc.v3(p.x + 4, p.y + 2),
                            cc.v3(p.x + 4, p.y - 2),
                            cc.v3(p.x - 4, p.y + 2),
                            cc.v3(p.x - 4, p.y - 2),
                            cc.v3(p.x + 5, p.y + 3),
                            cc.v3(p.x + 5, p.y - 3),
                            cc.v3(p.x - 5, p.y + 3),
                            cc.v3(p.x - 5, p.y - 3),
                            cc.v3(p.x + 6, p.y + 2),
                            cc.v3(p.x + 6, p.y - 2),
                            cc.v3(p.x - 6, p.y + 2),
                            cc.v3(p.x - 6, p.y - 2),
                            cc.v3(p.x + 6, p.y + 4),
                            cc.v3(p.x + 6, p.y - 4),
                            cc.v3(p.x - 6, p.y + 4),
                            cc.v3(p.x - 6, p.y - 4),
                            cc.v3(p.x + 1, p.y + 2),
                            cc.v3(p.x + 1, p.y - 2),
                            cc.v3(p.x - 1, p.y + 2),
                            cc.v3(p.x - 1, p.y - 2),
                            cc.v3(p.x + 2, p.y + 4),
                            cc.v3(p.x + 2, p.y - 4),
                            cc.v3(p.x - 2, p.y + 4),
                            cc.v3(p.x - 2, p.y - 4),
                            cc.v3(p.x + 3, p.y + 5),
                            cc.v3(p.x + 3, p.y - 5),
                            cc.v3(p.x - 3, p.y + 5),
                            cc.v3(p.x - 3, p.y - 5),
                            cc.v3(p.x + 2, p.y + 6),
                            cc.v3(p.x + 2, p.y - 6),
                            cc.v3(p.x - 2, p.y + 6),
                            cc.v3(p.x - 2, p.y - 6),
                            cc.v3(p.x + 4, p.y + 6),
                            cc.v3(p.x + 4, p.y - 6),
                            cc.v3(p.x - 4, p.y + 6),
                            cc.v3(p.x - 4, p.y - 6)
                        ]
                        for (let i = 0; i < ps.length; i++) {
                            // this.dungeon.addIceThron(Dungeon.getPosInMap(ps[i]), true);
                            let d = new DamageData()
                            d.physicalDamage = 3
                            this.shooter.dungeon = this.dungeon
                            this.shooter.actor = this
                            this.shooter.fireAoe(
                                this.selfThron,
                                new AreaOfEffectData().init(
                                    0,
                                    2,
                                    0.4,
                                    4,
                                    IndexZ.getActorZIndex(Dungeon.getPosInMap(ps[i])),
                                    true,
                                    true,
                                    true,
                                    false,
                                    true,
                                    d,
                                    FromData.getClone('冰刺', 'bossicethron02'),
                                    [StatusManager.FROZEN]
                                ),
                                Dungeon.getPosInMap(ps[i]).subSelf(this.getCenterPosition()),
                                0,
                                null,
                                true
                            )
                        }
                    }, 1.5)
                }

                this.scheduleOnce(() => {
                    this.thronSkill.IsExcuting = false
                }, 4)
            },
            15,
            true
        )
    }
    thronSelf() {
        this.scheduleOnce(() => {
            AudioPlayer.play(AudioPlayer.SKILL_ICETHRON)
        }, 1)
        const angles = [0, 45, 90, 135, 180, 225, 270, 315]
        const disdance = 40
        const posRight = [
            cc.v3(0, disdance),
            cc.v3(-disdance / 2, disdance / 2),
            cc.v3(-disdance, 0),
            cc.v3(-disdance / 2, -disdance / 2),
            cc.v3(0, -disdance),
            cc.v3(disdance / 2, -disdance / 2),
            cc.v3(disdance, 0),
            cc.v3(disdance / 2, disdance / 2)
        ]
        const posLeft = [
            cc.v3(0, -disdance),
            cc.v3(-disdance / 2, -disdance / 2),
            cc.v3(-disdance, 0),
            cc.v3(-disdance / 2, disdance / 2),
            cc.v3(0, disdance),
            cc.v3(disdance / 2, disdance / 2),
            cc.v3(disdance, 0),
            cc.v3(disdance / 2, -disdance / 2)
        ]
        let d = new DamageData()
        d.magicDamage = 1
        for (let i = 0; i < angles.length; i++) {
            this.shooter.dungeon = this.dungeon
            this.shooter.actor = this
            this.shooter.fireAoe(
                this.selfThron,
                new AreaOfEffectData().init(0, 2, 0.4, 3, IndexZ.OVERHEAD, true, true, true, false, true, d, FromData.getClone(this.actorName(), 'bossicepart01'), [
                    StatusManager.FROZEN
                ]),
                cc.v3(posRight[i]),
                angles[i],
                null,
                true
            )
        }
    }
    attack() {
        this.meleeSkill.next(
            () => {
                this.meleeSkill.IsExcuting = true
                AudioPlayer.play(AudioPlayer.MELEE)
                if (!this.anim) {
                    this.anim = this.getComponent(cc.Animation)
                }
                this.anim.play('IceDemonAttack001')
                this.scheduleOnce(() => {
                    AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_ATTACK)
                    let pos = this.getMovePos()
                    let h = pos.x
                    let v = pos.y
                    let movement = cc.v2(h, v)
                    movement = movement.normalize().mul(Utils.getDashSpeedByDistance(300 / MoveComponent.PIXELS_PER_UNIT, this.entity.Move.damping))
                    this.entity.Move.linearVelocity = movement
                }, 1)
                this.scheduleOnce(() => {
                    this.meleeSkill.IsExcuting = false
                }, 2)
            },
            3,
            true
        )
    }
    dash() {
        this.dashSkill.next(
            () => {
                this.dashSkill.IsExcuting = true
                if (!this.anim) {
                    this.anim = this.getComponent(cc.Animation)
                }
                this.scheduleOnce(() => {
                    AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_DASH)
                }, 2.5)
                this.anim.play('IceDemonDash')
                this.scheduleOnce(() => {
                    let pos = this.getMovePos()
                    let h = pos.x
                    let v = pos.y
                    let movement = cc.v2(h, v)
                    movement = movement.normalize().mul(Utils.getDashSpeedByDistance(1200 / MoveComponent.PIXELS_PER_UNIT, this.entity.Move.damping))
                    this.entity.Move.linearVelocity = movement
                }, 2.4)
                this.scheduleOnce(() => {
                    this.dashSkill.IsExcuting = false
                }, 3)
            },
            8,
            true
        )
    }
    defence(isHalf: boolean) {
        this.defenceSkill.next(
            () => {
                this.defenceSkill.IsExcuting = true
                if (!this.anim) {
                    this.anim = this.getComponent(cc.Animation)
                }
                this.anim.play('IceDemonDefence')
                this.data.Common.defence = 9999
                this.data.Common.magicDefence = 9999
                AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_DEFEND)
                this.scheduleOnce(() => {
                    this.defenceSkill.IsExcuting = false
                    this.data.Common.defence = 0
                    this.data.Common.magicDefence = 0
                }, 3)
                if (isHalf) {
                    if (this.magicice.isShow) {
                        this.magicice.breakIce()
                    }
                    this.thronSelf()
                }
            },
            6,
            true
        )
    }

    fireShooter(shooter: Shooter, bulletType: string, bulletArcExNum: number, bulletLineExNum: number, angle?: number): void {
        shooter.dungeon = this.dungeon
        shooter.actor = this
        shooter.data.bulletType = bulletType
        shooter.data.bulletArcExNum = bulletArcExNum
        shooter.data.bulletLineExNum = bulletLineExNum
        shooter.fireBullet(angle)
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
        this.node.scaleX = this.isFaceRight ? 1 : -1
    }

    move(pos: cc.Vec3, speed: number) {
        if (this.sc.isDied) {
            return
        }
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.node.position)
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
            if (!this.anim.getAnimationState('IceDemonWalk').isPlaying) {
                this.anim.playAdditive('IceDemonWalk')
            }
        } else {
            if (this.anim.getAnimationState('IceDemonWalk').isPlaying) {
                this.anim.play('IceDemonIdle')
            }
        }
        this.changeZIndex()
    }
    onColliderEnter(other: CCollider, self: CCollider) {
        if (self.tag == CCollider.TAG.BOSS_HIT) {
            if (other.tag == CCollider.TAG.PLAYER_HIT) {
                return
            }
            let target = ActorUtils.getEnemyCollisionTarget(other)
            if (target && (this.meleeSkill.IsExcuting || this.dashSkill.IsExcuting) && !this.sc.isDied) {
                let d = new DamageData()
                d.physicalDamage = 3
                let from = FromData.getClone(this.actorName(), 'bossicepart01')
                if (target.takeDamage(d, from, this)) {
                    target.addStatus(StatusManager.FROZEN, from)
                }
            }
        }
    }
    actorName() {
        return '冰魔'
    }
}
