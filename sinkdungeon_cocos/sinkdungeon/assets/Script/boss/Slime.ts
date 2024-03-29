import Boss from './Boss'
import DamageData from '../data/DamageData'
import HealthBar from '../logic/HealthBar'
import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'
import Dungeon from '../logic/Dungeon'
import SlimeVenom from './SlimeVenom'
import MonsterManager from '../manager/MonsterManager'
import NextStep from '../utils/NextStep'
import AudioPlayer from '../utils/AudioPlayer'
import FromData from '../data/FromData'
import Achievement from '../logic/Achievement'
import Item from '../item/Item'
import IndexZ from '../utils/IndexZ'
import ActorUtils from '../utils/ActorUtils'
import CCollider from '../collider/CCollider'
import EquipmentManager from '../manager/EquipmentManager'
import MapManager from '../manager/MapManager'

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
export default class Slime extends Boss {
    init(type: number): void {
        switch (type) {
            case 0:
                this.scaleSize = 2
                break
            case 1:
                this.scaleSize = 1.5
                break
            case 2:
                this.scaleSize = 1
                break
            case 3:
                this.scaleSize = 0.5
                break
            case 4:
                this.scaleSize = 0.3
                break
            case 5:
                this.scaleSize = 0.2
                break
            default:
                this.scaleSize = 0.2
                break
        }
        this.slimeType = type
        this.node.scaleY = this.scaleSize
        this.node.scaleX = this.scaleSize
    }
    static readonly DIVIDE_COUNT = 4
    @property(cc.Prefab)
    venom: cc.Prefab = null
    private venomPool: cc.NodePool
    healthBar: HealthBar = null
    private anim: cc.Animation
    isFaceRight = true
    isMoving = false
    // isAttacking = false;
    private timeDelay = 0
    isHurt = false
    isCrownFall = false
    isDashing = false //是否正在冲刺
    currentlinearVelocitySpeed: cc.Vec2 = cc.Vec2.ZERO //当前最大速度
    private dashlight: cc.Node
    private sprite: cc.Node
    private crown: cc.Node
    private decorate: cc.Node
    scaleSize = 1
    slimeType = 0
    meleeSkill = new NextStep()
    onLoad() {
        this.meleeSkill.IsExcuting = false
        this.sc.isDied = false
        this.anim = this.getComponent(cc.Animation)
        this.updatePlayerPos()
        this.venomPool = new cc.NodePool()
        this.sprite = this.node.getChildByName('sprite')
        this.crown = this.sprite.getChildByName('crown')
        this.decorate = this.node.getChildByName('sprite').getChildByName('body').getChildByName('decorate')
        this.dashlight = this.sprite.getChildByName('dashlight')
        this.dashlight.opacity = 0
        EventHelper.on('destoryvenom', detail => {
            this.destroyVenom(detail.coinNode)
        })
        this.scheduleOnce(() => {
            this.sc.isShow = true
            this.entity.NodeRender.node = this.node
            this.entity.Move.damping = 6
        }, 1)
    }

    start() {
        super.start()
        if (this.crown && this.slimeType != 0) {
            this.crown.opacity = 0
        }
        if (this.decorate && this.slimeType > 2) {
            this.decorate.opacity = 0
        }
    }
    private getVenom(parentNode: cc.Node, pos: cc.Vec3) {
        if (this.scaleSize < 1 || this.sc.isDied) {
            return
        }
        let venomPrefab: cc.Node = null
        if (this.venomPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            venomPrefab = this.venomPool.get()
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!venomPrefab || venomPrefab.active) {
            venomPrefab = cc.instantiate(this.venom)
        }
        venomPrefab.parent = parentNode
        venomPrefab.position = pos
        venomPrefab.scale = this.slimeType == 0 ? 1.5 : 1
        venomPrefab.getComponent(SlimeVenom).target = this.dungeon.player
        venomPrefab.zIndex = IndexZ.getActorZIndex(this.entity.Transform.position)
        venomPrefab.opacity = 255
        venomPrefab.active = true
    }

    destroyVenom(venomNode: cc.Node) {
        if (!venomNode) {
            return
        }
        venomNode.active = false
        if (this.venomPool) {
            this.venomPool.put(venomNode)
        }
    }

    //Animation
    AnimAttacking() {
        this.meleeSkill.IsExcuting = false
        let attackRange = 64 + 50 * this.scaleSize
        let target = ActorUtils.getNearestEnemyActor(this.entity.Transform.position, true, this.dungeon)
        let newdis = ActorUtils.getTargetDistance(this, target)
        if (newdis < attackRange && target) {
            target.takeDamage(this.data.getAttackPoint(), FromData.getClone(this.actorName(), 'bossslimehelmet', this.node.position), this)
        }
    }
    onColliderEnter(other: CCollider, self: CCollider) {
        if (self.tag == CCollider.TAG.BOSS_HIT) {
            let target = ActorUtils.getEnemyCollisionTarget(other)
            if (target && this.isDashing && this.dungeon && !this.isHurt && !this.sc.isDied) {
                this.isDashing = false
                this.entity.Move.linearVelocity = cc.Vec2.ZERO
                target.takeDamage(this.data.getAttackPoint(), FromData.getClone(this.actorName(), 'bossslimehelmet', this.node.position), this)
            }
        }
    }
    venomTimeDelay = 0
    isVenomTimeDelay(dt: number): boolean {
        this.venomTimeDelay += dt
        if (this.venomTimeDelay > 0.2) {
            this.venomTimeDelay = 0
            return true
        }
        return false
    }
    childSlimeTimeDelay = 0
    isChildSlimeTimeDelay(dt: number): boolean {
        this.childSlimeTimeDelay += dt
        if (this.childSlimeTimeDelay > 5) {
            this.childSlimeTimeDelay = 0
            return true
        }
        return false
    }
    updateLogic(dt) {
        this.statusManager.updateLogic(dt)
        this.healthBar.node.active = !this.sc.isDied
        this.timeDelay += dt
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0
            this.bossAction()
        }
        this.dashlight.opacity = 0
        if (this.dungeon && this.isDashing) {
            this.dashlight.opacity = 128
            this.entity.Move.linearVelocity = this.currentlinearVelocitySpeed.clone()
        }
        if (this.dungeon) {
            let playerDis = this.getNearPlayerDistance(this.dungeon.player.node)
            if (playerDis < 64 && !this.isHurt) {
                this.entity.Move.linearVelocity = cc.v2(0, 0)
            }
        }
        if (this.sc.isDied) {
            this.entity.Move.linearVelocity = cc.Vec2.ZERO
        }
        this.healthBar.node.active = !this.sc.isDied
        if (this.data.currentHealth < 1) {
            this.killed()
        }
        this.node.scaleY = this.scaleSize
        this.node.scaleX = this.isFaceRight ? this.scaleSize : -this.scaleSize
        if (this.isVenomTimeDelay(dt) && this.isMoving && !this.meleeSkill.IsExcuting) {
            this.getVenom(this.node.parent, this.entity.Transform.position)
        }
        if (this.isChildSlimeTimeDelay(dt) && !this.sc.isDied && this.slimeType == 0 && this.dungeon) {
            let count = 0
            for (let m of this.dungeon.monsterManager.monsterList) {
                if (!m.sc.isDied) {
                    count++
                }
            }
            if (count < 10 && this.dungeon.monsterManager.monsterList.length < 50) {
                let pos = Dungeon.getIndexInMap(this.entity.Transform.position.clone())
                this.dungeon.monsterManager.addMonsterFromData(MonsterManager.MONSTER_SLIME, pos, this.dungeon, true)
            }
        }
    }
    takeDamage(damage: DamageData): boolean {
        if (this.sc.isDied || !this.sc.isShow) {
            return false
        }
        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage()
        if (this.data.currentHealth > this.data.Common.MaxHealth) {
            this.data.currentHealth = this.data.Common.MaxHealth
        }
        this.isHurt = true
        this.isDashing = false
        //100ms后修改受伤
        this.scheduleOnce(() => {
            if (this.node) {
                this.isHurt = false
            }
        }, 0.1)
        this.anim.play('SlimeHit')
        this.meleeSkill.IsExcuting = false
        if (this.data.currentHealth < this.data.Common.MaxHealth / 2 && !this.isCrownFall && this.slimeType == 0) {
            this.isCrownFall = true
            this.sc.isShow = false
            this.scheduleOnce(() => {
                this.sc.isShow = true
                this.crown.opacity = 0
            }, 1)
            this.anim.play('SlimeCrownFall')
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.MaxHealth)
        let hitNames = [AudioPlayer.MONSTER_HIT, AudioPlayer.MONSTER_HIT1, AudioPlayer.MONSTER_HIT2]
        AudioPlayer.play(hitNames[Logic.getRandomNum(0, 2)])
        return true
    }

    killed() {
        if (this.sc.isDied) {
            return
        }
        this.sc.isDied = true
        this.isDashing = false
        this.anim.play('SlimeDie')
        let collider: CCollider = this.getComponent(CCollider)
        collider.sensor = true
        this.scheduleOnce(() => {
            if (this.node) {
                this.node.active = false
            }
        }, 5)
        if (this.dungeon) {
            if (this.slimeType == 0) {
                let rand4save = Logic.mapManager.getRandom4Save(this.seed, MapManager.RANDOM_BOSS)
                Achievement.addMonsterKillAchievement(this.data.resName)
                EventHelper.emit(EventHelper.DUNGEON_ADD_OILGOLD, { pos: this.entity.Transform.position, count: 100 })
                EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM, { pos: this.entity.Transform.position, res: Item.HEART })
                EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM, { pos: this.entity.Transform.position, res: Item.DREAM })
                this.dungeon.addEquipment(Logic.getRandomEquipType(rand4save), Dungeon.getPosInMap(this.pos), null, EquipmentManager.QUALITY_ORANGE)
            }
            if (this.slimeType < Slime.DIVIDE_COUNT) {
                EventHelper.emit(EventHelper.DUNGEON_ADD_COIN, { pos: this.entity.Transform.position, count: 5 })

                EventHelper.emit(EventHelper.BOSS_ADDSLIME, { posIndex: this.pos.clone(), slimeType: this.slimeType + 1 })
                EventHelper.emit(EventHelper.BOSS_ADDSLIME, { posIndex: this.pos.clone(), slimeType: this.slimeType + 1 })
            }
        }
    }
    bossAction() {
        if (this.sc.isDied || !this.dungeon || this.isHurt) {
            return
        }
        let newPos = cc.v3(0, 0)
        newPos.x += Logic.getRandomNum(0, 2000) - 1000
        newPos.y += Logic.getRandomNum(0, 2000) - 1000
        let playerDis = this.getNearPlayerDistance(this.dungeon.player.node)
        this.entity.Transform.position = Dungeon.fixOuterMap(this.entity.Transform.position)
        this.pos = Dungeon.getIndexInMap(this.entity.Transform.position)
        this.changeZIndex()
        let pos = newPos.clone()

        //近战
        let attackRange = 64 + 50 * this.scaleSize
        if (playerDis < attackRange && !this.dungeon.player.sc.isDied && !this.isDashing && this.sc.isShow && this.scaleSize >= 1) {
            pos = this.dungeon.player.getCenterPosition().sub(this.entity.Transform.position)
            if (!pos.equals(cc.Vec3.ZERO)) {
                pos = pos.normalizeSelf()
            }
            let isPlayAttack = this.anim.getAnimationState('SlimeAttack').isPlaying
            if (!isPlayAttack) {
                this.meleeSkill.IsExcuting = true
                this.anim.play('SlimeAttack')
            }
        }
        let speed = 6 - 1 * this.scaleSize
        if (speed < 0) {
            speed = 0.5
        }
        //冲刺
        let dashRange = 128 + 35 * this.scaleSize
        if (playerDis > dashRange && !this.dungeon.player.sc.isDied && !this.isDashing && this.sc.isShow && Logic.getHalfChance()) {
            AudioPlayer.play(AudioPlayer.MELEE)
            if (Logic.getHalfChance()) {
                pos = this.dungeon.player.getCenterPosition().sub(this.entity.Transform.position)
            }
            this.move(pos, speed * 1.5)
            this.isDashing = true
            this.scheduleOnce(() => {
                if (this.node) {
                    this.isDashing = false
                }
            }, 2)
        }
        if (Logic.getRandomNum(1, 10) < 3) {
            this.move(pos, speed)
        }
    }

    move(pos: cc.Vec3, speed: number) {
        if (this.sc.isDied || this.isHurt || this.isDashing || !this.sc.isShow || this.meleeSkill.IsExcuting) {
            return
        }
        if (pos.equals(cc.Vec3.ZERO)) {
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
        movement = movement.normalize().mul(speed)
        this.entity.Move.linearVelocity = movement.clone()
        this.currentlinearVelocitySpeed = movement.clone()
        this.isMoving = h != 0 || v != 0
        if (this.isMoving) {
            this.isFaceRight = h > 0
        }
        let isPlayAttack = this.anim.getAnimationState('SlimeAttack').isPlaying
        if (!this.anim.getAnimationState('SlimeIdle').isPlaying && !isPlayAttack) {
            this.anim.play('SlimeIdle')
        }
        this.changeZIndex()
    }
    actorName() {
        return '史莱姆之王'
    }
}
