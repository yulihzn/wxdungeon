import Boss from './Boss'
import DamageData from '../data/DamageData'
import Shooter from '../logic/Shooter'
import Dungeon from '../logic/Dungeon'
import StatusManager from '../manager/StatusManager'
import NextStep from '../utils/NextStep'
import MonsterManager from '../manager/MonsterManager'
import AudioPlayer from '../utils/AudioPlayer'
import { EventHelper } from '../logic/EventHelper'
import FromData from '../data/FromData'
import Achievement from '../logic/Achievement'
import Logic from '../logic/Logic'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class Sphinx extends Boss {
    init(type: number): void {
        throw new Error('Method not implemented.')
    }

    private anim: cc.Animation
    shooter01: Shooter
    private timeDelay = 0
    isMoving = false
    stormSkill = new NextStep()
    summonSkill = new NextStep()
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sc.isDied = false
        this.sc.isShow = false
        this.anim = this.getComponent(cc.Animation)
        this.shooter01 = this.node.getChildByName('Shooter01').getComponent(Shooter)
        this.statusManager = this.node.getChildByName('StatusManager').getComponent(StatusManager)
        this.shooter01.from.valueCopy(FromData.getClone(this.actorName(), 'sphinxhead', this.node.position))
    }

    start() {}
    takeDamage(damage: DamageData): boolean {
        if (this.sc.isDied || !this.sc.isShow) {
            return false
        }

        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage()
        if (this.data.currentHealth > this.data.Common.MaxHealth) {
            this.data.currentHealth = this.data.Common.MaxHealth
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.MaxHealth)
        this.playHit(this.node.getChildByName('sprite'))
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
        this.changeZIndex()
        this.fireStorm()
        this.summonMonster()
    }
    summonMonster() {
        if (this.dungeon.getMonsterAliveNum() > 1) {
            return
        }
        this.summonSkill.next(
            () => {
                AudioPlayer.play(AudioPlayer.MELEE)
                this.summonSkill.IsExcuting = true
                let pos = Dungeon.getIndexInMap(this.entity.Transform.position.clone())
                this.dungeon.monsterManager.addMonsterFromData(MonsterManager.MONSTER_SANDSTATUE, cc.v3(pos.x, pos.y - 1), this.dungeon, true)
                this.dungeon.monsterManager.addMonsterFromData(MonsterManager.MONSTER_SANDSTATUE, cc.v3(pos.x + 1, pos.y - 1), this.dungeon, true)
                this.dungeon.monsterManager.addMonsterFromData(MonsterManager.MONSTER_SANDSTATUE, cc.v3(pos.x - 1, pos.y - 1), this.dungeon, true)
                this.dungeon.monsterManager.addMonsterFromData(MonsterManager.MONSTER_ANUBIS, cc.v3(pos.x - 1, pos.y - 2), this.dungeon, true)
                this.dungeon.monsterManager.addMonsterFromData(MonsterManager.MONSTER_ANUBIS, cc.v3(pos.x + 1, pos.y - 2), this.dungeon, true)
            },
            15,
            true
        )
    }
    fireStorm() {
        this.stormSkill.next(
            () => {
                this.stormSkill.IsExcuting = true
                this.anim.play('SphinxStorm')
                this.scheduleOnce(() => {
                    let pos = this.entity.Transform.position.clone().add(this.shooter01.node.position)
                    let hv = this.dungeon.player.getCenterPosition().sub(pos)
                    if (!hv.equals(cc.Vec3.ZERO)) {
                        this.shooter01.setHv(cc.v2(hv).normalize())
                        this.fireShooter(this.shooter01, 'bullet023', 0, -20)
                        this.fireShooter(this.shooter01, 'bullet123', 0, 0, 0)
                        this.fireShooter(this.shooter01, 'bullet223', 0, 0, 20)
                    }
                }, 0.3)
                this.scheduleOnce(() => {
                    this.stormSkill.IsExcuting = false
                    this.anim.play('SphinxIdle')
                }, 2)
            },
            8,
            true
        )
    }
    fireShooter(shooter: Shooter, bulletType: string, bulletArcExNum: number, bulletLineExNum: number, angle?: number): void {
        shooter.dungeon = this.dungeon
        shooter.actor = this
        shooter.data.bulletType = bulletType
        shooter.data.bulletArcExNum = bulletArcExNum
        shooter.data.bulletLineExNum = bulletLineExNum
        shooter.fireBullet(angle, cc.Vec3.ZERO)
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
        this.entity.Move.linearVelocity = cc.Vec2.ZERO
    }
    actorName() {
        return '斯芬克斯'
    }
}
