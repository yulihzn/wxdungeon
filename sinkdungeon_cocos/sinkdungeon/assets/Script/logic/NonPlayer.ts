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
import { EventHelper } from './EventHelper'
import HealthBar from './HealthBar'
import Logic from './Logic'
import Dungeon from './Dungeon'
import Shooter from './Shooter'
import StatusManager from '../manager/StatusManager'
import DamageData from '../data/DamageData'
import Random from '../utils/Random'
import NextStep from '../utils/NextStep'
import Item from '../item/Item'
import Actor from '../base/Actor'
import Achievement from './Achievement'
import AudioPlayer from '../utils/AudioPlayer'
import SpecialManager from '../manager/SpecialManager'
import FromData from '../data/FromData'
import IndexZ from '../utils/IndexZ'
import AreaOfEffect from '../actor/AreaOfEffect'
import AreaOfEffectData from '../data/AreaOfEffectData'
import ActorAttackBox from '../actor/ActorAttackBox'
import StateMachine from '../base/fsm/StateMachine'
import State from '../base/fsm/State'
import DefaultStateMachine from '../base/fsm/DefaultStateMachine'
import NonPlayerActorState from '../actor/NonPlayerActorState'
import NonPlayerData from '../data/NonPlayerData'
import StatusData from '../data/StatusData'
import ActorUtils from '../utils/ActorUtils'
import CCollider from '../collider/CCollider'
import AreaDetector from '../actor/AreaDetector'
import ActorBottomDir from '../actor/ActorBottomDir'
import JumpingAbility from '../actor/JumpingAbility'
import TriggerData from '../data/TriggerData'
import PlayActor from '../base/PlayActor'
import PlayerAvatar from './PlayerAvatar'
import BaseAvatar from '../base/BaseAvatar'
import FrameAvatar from './FrameAvatar'
import Tips from '../ui/Tips'
import ActorIcon from '../ui/ActorIcon'
import EquipmentManager from '../manager/EquipmentManager'
import MapManager from '../manager/MapManager'

@ccclass
export default class NonPlayer extends PlayActor {
    public static readonly RES_DISGUISE = 'disguise' //图片资源 伪装
    public static readonly RES_IDLE000 = 'anim000' //图片资源 等待0
    public static readonly RES_IDLE001 = 'anim001' //图片资源 等待1
    public static readonly RES_WALK00 = 'anim002' //图片资源 行走0
    public static readonly RES_WALK01 = 'anim003' //图片资源 行走1
    public static readonly RES_WALK02 = 'anim004' //图片资源 行走2
    public static readonly RES_WALK03 = 'anim005' //图片资源 行走3
    public static readonly RES_HIT001 = 'anim006' //图片资源 受击1
    public static readonly RES_HIT002 = 'anim007' //图片资源 受击2
    public static readonly RES_HIT003 = 'anim008' //图片资源 受击3
    public static readonly RES_ATTACK01 = 'anim009' //图片资源 准备攻击后续动画由参数配置

    static readonly SCALE_NUM = 1.5
    static readonly ANIM_NONE = -1
    static readonly ANIM_IDLE = 0
    static readonly ANIM_WALK = 1
    static readonly ANIM_ATTACK = 2
    static readonly ANIM_HIT = 3
    static readonly ANIM_DIED = 4
    @property(cc.Vec3)
    pos: cc.Vec3 = cc.v3(0, 0)
    defautPos: cc.Vec3 = cc.v3(0, 0)
    posZ = 0
    @property(cc.Node)
    root: cc.Node = null
    @property(cc.Node)
    shadow: cc.Node = null
    @property(HealthBar)
    healthBar: HealthBar = null
    @property(StatusManager)
    statusManager: StatusManager = null
    @property(SpecialManager)
    specialManager: SpecialManager = null
    @property(cc.Prefab)
    boom: cc.Prefab = null
    @property(cc.Node)
    dangerBoxNode: cc.Node = null
    dangerBox: ActorAttackBox = null
    @property(cc.Node)
    dangerTips: cc.Node = null
    @property(cc.Prefab)
    attrPrefab: cc.Prefab = null
    @property(ActorBottomDir)
    bottomDir: ActorBottomDir = null
    @property(cc.Prefab)
    waterSpark: cc.Prefab = null
    @property(cc.Prefab)
    avatarPrefab: cc.Prefab = null
    @property(cc.Prefab)
    frameAvatarPrefab: cc.Prefab = null
    @property(Tips)
    tips: Tips = null
    private attrNode: cc.Node
    private sprite: cc.Node
    private bodySprite: cc.Sprite
    private dashlight: cc.Node
    private anim: cc.Animation
    private boxCollider: CCollider
    private areaDetector: AreaDetector
    graphics: cc.Graphics
    isFaceRight = true
    dungeon: Dungeon
    shooter: Shooter = null
    currentlinearVelocitySpeed: cc.Vec2 = cc.Vec2.ZERO //当前最大速度
    isVariation: boolean = false //是否变异
    isSummon = false //是否召唤出来的，召唤生物无法掉落装备
    killPlayerCount = 0 //杀死玩家次数

    particleBlood: cc.ParticleSystem
    effectNode: cc.Node
    hitLightSprite: cc.Sprite
    moveStep = new NextStep()
    remoteStep = new NextStep()
    meleeStep = new NextStep()
    specialStep = new NextStep()
    dashStep = new NextStep()
    blinkStep = new NextStep()
    trackStep = new NextStep()
    swimmingAudioStep = new NextStep()
    attrmap: { [key: string]: number } = {}
    mat: cc.MaterialVariant
    animStatus = NonPlayer.ANIM_NONE
    data: NonPlayerData = new NonPlayerData()
    leftLifeTime = 0
    parentNonPlayer: NonPlayer //父类npc
    childNonPlayerList: NonPlayer[] = [] //子类
    isInWaterTile = false
    lastWaterPos = cc.v3(0, 0)
    attackRect = []
    bodyRect = []
    waterY = 0
    lastTimeInWater = false
    jumpAbility: JumpingAbility
    statusPos: cc.Vec3 = cc.v3(0, 0)
    public stateMachine: StateMachine<NonPlayer, State<NonPlayer>>
    icon: ActorIcon

    private currentTarget: Actor
    get IsVariation() {
        return this.isVariation || this.data.StatusTotalData.variation > 0
    }
    init(): void {
        this.triggerShooter = this.shooter
        // this.handLeft = this.weaponLeft
        // this.handRight = this.weaponRight
        this.statusMgr = this.statusManager
        this.nonPlayerData = this.data
        this.jumpAbility = this.addComponent(JumpingAbility)
        this.jumpAbility.init(this, 1, 0, (group: number, type: number) => {
            if (TriggerData.TYPE_JUMP_END == type) {
                if (this.sc.isMoving) {
                    this.playerAnim(BaseAvatar.STATE_WALK, this.currentDir)
                } else {
                    this.playerAnim(BaseAvatar.STATE_IDLE, this.currentDir)
                }
            }
            this.exTrigger(group, type, null, null)
        })
        if (this.data.AvatarData.isAnimFrame) {
            this.frameAvatar = FrameAvatar.create(this.frameAvatarPrefab, this.root, Logic.playerData.AvatarData.clone(), this.data.resName)
        } else {
            this.avatar = PlayerAvatar.create(this.avatarPrefab, this.root, Logic.playerData.AvatarData.clone(), this.node.group)
        }
    }
    get Root(): cc.Node {
        return this.root
    }
    playerAnim(status: number, dir: number): void {}
    getWalkSmoke(parentNode: cc.Node, pos: cc.Vec3): void {}
    onLoad() {
        this.init()
        this.initCollider()
        this.dangerBox = this.dangerBoxNode.getComponent(ActorAttackBox)
        this.graphics = this.getComponent(cc.Graphics)
        this.anim = this.getComponent(cc.Animation)
        this.sprite = this.root.getChildByName('sprite')
        this.bodySprite = this.sprite.getChildByName('body').getComponent(cc.Sprite)
        this.mat = this.bodySprite.getComponent(cc.Sprite).getMaterial(0)
        this.boxCollider = this.getComponent(CCollider)
        this.node.scale = this.getScaleSize()
        this.dashlight = this.sprite.getChildByName('dashlight')
        this.dashlight.opacity = 0
        this.shooter = this.root.getChildByName('Shooter').getComponent(Shooter)
        this.effectNode = this.root.getChildByName('Effect')
        this.hitLightSprite = this.root.getChildByName('Effect').getChildByName('hitlight').getComponent(cc.Sprite)
        this.hitLightSprite.node.opacity = 0
        this.particleBlood = this.root.getChildByName('Effect').getChildByName('blood').getComponent(cc.ParticleSystem)
        this.particleBlood.stopSystem()
        this.attrNode = this.root.getChildByName('attr')
        this.areaDetector = this.getComponentInChildren(AreaDetector)
        this.resetBodyColor()
        this.statusPos = this.statusManager.node.position.clone()
        if (this.data.isStatic > 0) {
            this.entity.Collider.colliders[0].isStatic = true
            this.node.width = this.entity.Collider.colliders[0].w
            this.node.height = this.entity.Collider.colliders[0].h
        }
        if (this.bottomDir) {
            this.bottomDir.init(this, this.data.isEnemy > 0 ? cc.Color.RED : cc.Color.YELLOW)
        }
        this.initSize()
        this.dangerBox.init(this, this.data)
        this.dangerTips.opacity = 0
        this.specialStep.init()

        this.stateMachine = new DefaultStateMachine(this, NonPlayerActorState.PRPARE, NonPlayerActorState.GLOBAL)
    }

    start() {
        this.changeZIndex()
        this.healthBar.refreshHealth(this.data.getHealth().x, this.data.getHealth().y)
        this.healthBar.hideWhenFull = true
        if (this.data.lifeTime > 0) {
            let lifeTimeStep = new NextStep()
            this.leftLifeTime = this.data.lifeTime
            lifeTimeStep.next(
                () => {},
                this.data.lifeTime,
                true,
                () => {
                    this.leftLifeTime--
                    if (this.leftLifeTime <= 0 && this.data) {
                        this.data.currentHealth = 0
                    }
                },
                1
            )
        }
        this.addSaveStatusList()
        this.entity.Move.damping = 3
        this.entity.Move.linearVelocity = cc.v2(0, 0)
        let attackArr = this.data.attackRect.split(',')
        let bodyArr = this.data.bodyRect.split(',')
        for (let num of attackArr) {
            this.attackRect.push(parseInt(num))
        }
        for (let num of bodyArr) {
            this.bodyRect.push(parseInt(num))
        }
    }

    jump() {
        if (this.jumpAbility) {
            this.jumpAbility.jump(6, 3)
        }
    }
    jumpCancel() {
        if (this.jumpAbility) {
            this.jumpAbility.cancel()
        }
    }
    fly() {
        if (this.jumpAbility && this.data.fly > 0) {
            this.jumpAbility.fly(1, this.data.fly)
        }
    }
    flyCancel() {
        if (this.jumpAbility && this.data.fly > 0) {
            this.jumpAbility.flyCancel(1)
        }
    }
    /**挨打光效 */
    private hitLightS(damage: DamageData) {
        let show = true
        let resName = 'hitlight1'
        let scale = 4
        let punchNames = [AudioPlayer.PUNCH, AudioPlayer.PUNCH1, AudioPlayer.PUNCH2]
        let swordhitNames = [AudioPlayer.SWORD_HIT, AudioPlayer.SWORD_HIT1, AudioPlayer.SWORD_HIT2]
        let hitNames = [AudioPlayer.MONSTER_HIT, AudioPlayer.MONSTER_HIT1, AudioPlayer.MONSTER_HIT2]
        if (damage.isFist) {
            resName = Logic.getHalfChance() ? 'hitlight1' : 'hitlight2'
            AudioPlayer.play(punchNames[Logic.getRandomNum(0, 2)])
        } else if (damage.isRemote) {
            resName = Logic.getHalfChance() ? 'hitlight9' : 'hitlight10'
            AudioPlayer.play(hitNames[Logic.getRandomNum(0, 2)])
        } else if (damage.isBlunt) {
            resName = Logic.getHalfChance() ? 'hitlight3' : 'hitlight4'
            scale = damage.isFar ? 5 : 4
            AudioPlayer.play(swordhitNames[Logic.getRandomNum(0, 2)])
        } else if (damage.isMelee) {
            AudioPlayer.play(swordhitNames[Logic.getRandomNum(0, 2)])
            if (damage.isStab) {
                resName = Logic.getHalfChance() ? 'hitlight5' : 'hitlight6'
                scale = damage.isFar ? 5 : 4
            } else {
                resName = Logic.getHalfChance() ? 'hitlight7' : 'hitlight8'
                scale = damage.isFar ? 5 : 4
            }
        } else {
            AudioPlayer.play(hitNames[Logic.getRandomNum(0, 2)])
            show = false
        }
        if (show) {
            this.hitLightSprite.node.stopAllActions()
            this.hitLightSprite.spriteFrame = Logic.spriteFrameRes(resName)
            this.hitLightSprite.node.opacity = 255
            this.hitLightSprite.node.color = cc.Color.WHITE
            this.hitLightSprite.node.scale = damage.isCriticalStrike ? scale : scale + 2
            cc.tween(this.hitLightSprite.node).delay(0.2).to(0.2, { opacity: 0, color: cc.Color.RED }).start()
        }
    }
    /**加载保存的状态 */
    private addSaveStatusList() {
        if (this.statusManager) {
            this.statusManager.addStatusListFromSave(this.data.StatusList)
        }
    }
    /**高亮 */
    private hitLight(isHit: boolean) {
        if (!this.mat) {
            this.mat = this.root.getChildByName('sprite').getChildByName('body').getComponent(cc.Sprite).getMaterial(0)
        }
        this.mat.setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    }
    /**添加随机属性图标 */
    public addAttrIcon() {
        if (!this.attrNode) {
            this.attrNode = this.root.getChildByName('attr')
        }
        this.attrNode.removeAllChildren()
        for (let key in this.attrmap) {
            let attr = cc.instantiate(this.attrPrefab)
            attr.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes(key)
            this.attrNode.addChild(attr)
        }
    }
    /**
     * 显示攻击叹号
     */
    private showDangerTips() {
        this.dangerTips.opacity = 255
        this.scheduleOnce(() => {
            this.dangerTips.opacity = 0
        }, 1)
    }

    private getCurrentBodyRes(): string {
        if (!this.sprite) {
            this.sprite = this.root.getChildByName('sprite')
            this.bodySprite = this.sprite.getChildByName('body').getComponent(cc.Sprite)
        }
        return this.bodySprite.spriteFrame.name
    }
    public initSize() {
        let bodyRect = this.data.bodyRect.split(',')
        if (!this.boxCollider) {
            this.boxCollider = this.getComponent(CCollider)
        }
        this.boxCollider.offset = cc.v2(parseInt(bodyRect[0]), parseInt(bodyRect[1]))
        this.boxCollider.w = parseInt(bodyRect[2])
        this.boxCollider.h = parseInt(bodyRect[3])
        this.boxCollider.zHeight = parseInt(bodyRect[4])
        this.boxCollider.tag = this.data.isEnemy > 0 ? CCollider.TAG.NONPLAYER : CCollider.TAG.GOODNONPLAYER
        if (this.data.blink > 0) {
            this.boxCollider.setIgnoreTags([CCollider.TAG.WALL])
            this.boxCollider.setIgnoreTags([CCollider.TAG.WALL_TOP])
            this.boxCollider.setIgnoreTags([CCollider.TAG.BUILDING])
            this.boxCollider.setIgnoreTags([CCollider.TAG.WARTER])
        }
        this.shadow.width = this.boxCollider.w
        this.shadow.height = this.boxCollider.h
    }
    public changeBodyRes(resName: string, suffix?: string) {
        if (!this.sprite) {
            this.sprite = this.root.getChildByName('sprite')
            this.bodySprite = this.sprite.getChildByName('body').getComponent(cc.Sprite)
        }
        if (this.hv.y > 0 && suffix && suffix.indexOf('anim0') > -1) {
            let temp = suffix.replace('anim0', 'anim1')
            if (this.getSpriteFrameByName(resName, temp)) {
                suffix = temp
            }
        }
        let spriteFrame = this.getSpriteFrameByName(resName, suffix)
        if (spriteFrame) {
            this.bodySprite.spriteFrame = spriteFrame
            this.bodySprite.node.width = spriteFrame.getOriginalSize().width
            this.bodySprite.node.height = spriteFrame.getOriginalSize().height
            this.setInWaterMat(this.bodySprite, this.data.water < 1 && this.isInWater())
        } else {
            this.bodySprite.spriteFrame = null
        }
    }
    showWaterSpark() {
        if (!this.lastTimeInWater && this.isInWater()) {
            let light = cc.instantiate(this.waterSpark)
            light.parent = this.node
            light.position = cc.v3(0, 0)
            AudioPlayer.play(AudioPlayer.JUMP_WATER)
        }
        this.lastTimeInWater = this.isInWater()
    }
    isInWater() {
        return this.isInWaterTile && this.entity.Transform.z < 32
    }
    private getSpriteFrameByName(resName: string, suffix?: string): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrameRes(resName + suffix)
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrameRes(resName)
        }
        return spriteFrame
    }
    public updatePlayerPos() {
        this.entity.Transform.position = Dungeon.getPosInMap(this.pos)
        this.node.position = this.entity.Transform.position.clone()
    }
    private transportPlayer(x: number, y: number) {
        this.sprite.angle = 0
        this.sprite.scaleX = this.isFaceRight ? 1 : -1
        this.sprite.opacity = 255
        this.sprite.x = 0
        this.sprite.y = 0
        this.pos.x = x
        this.pos.y = y
        this.changeZIndex()
        this.updatePlayerPos()
    }
    changeZIndex() {
        let offsetY = this.entity.Transform.base
        if (offsetY > 0) {
            offsetY += 500
        }
        this.node.zIndex = IndexZ.getActorZIndex(cc.v3(this.node.position.x, this.node.position.y - offsetY))
    }

    private remoteAttack(target: Actor, isSpecial: boolean) {
        this.remoteStep.IsExcuting = false
        this.hv = cc.v2(target.getCenterPosition().sub(this.node.position)).normalize()
        if (!this.hv.equals(cc.Vec2.ZERO)) {
            this.shooter.setHv(this.hv.clone())
            this.shooter.from.valueCopy(FromData.getClone(this.data.nameCn, this.data.resName + 'anim000', this.seed))
            if (this.IsVariation) {
                this.shooter.data.bulletSize = 0.5
            }
            this.shooter.dungeon = this.dungeon
            this.shooter.actor = this
            this.shooter.data.remoteAudio = this.data.remoteAudio
            this.shooter.isFromPlayer = this.data.isEnemy < 1
            this.shooter.data.bulletArcExNum = this.data.bulletArcExNum
            this.shooter.data.bulletLineExNum = this.data.bulletLineExNum
            this.shooter.data.bulletLineInterval = this.data.bulletLineInterval
            if (isSpecial) {
                this.shooter.data.bulletLineExNum = this.data.specialBulletLineExNum
                this.shooter.data.bulletArcExNum = this.data.specialBulletArcExNum
            }
            this.shooter.data.isLineAim = this.data.isLineAim
            this.shooter.data.bulletType = this.data.bulletType ? this.data.bulletType : 'bullet001'
            this.shooter.data.bulletExSpeed = this.data.bulletExSpeed
            this.shooter.node.position = cc.v3(this.isFaceRight ? this.data.shooterOffsetX : -this.data.shooterOffsetX, this.data.shooterOffsetY)
            this.shooter.fireBullet(this.data.Common.remoteAngle)
        }
    }
    private bodyStopAllActions() {
        this.bodySprite.node.stopAllActions()
        this.sc.isBlinking = false
        this.bodySprite.node.opacity = 255
    }
    private showAttackAnim(before: Function, attacking: Function, finish: Function, target: Actor, isSpecial: boolean, isMelee: boolean, isMiss: boolean) {
        let speedScale = 1 - this.data.FinalCommon.AttackSpeed / 10
        if (speedScale < 0.5) {
            speedScale = 0.5
        }
        if (speedScale > 2) {
            speedScale = 2
        }
        let pos = cc.v2(target.node.position.clone().sub(this.node.position))
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = cc.v2(1, 0)
        }
        pos = pos.normalize().mul(this.isFaceRight ? 32 : -32)
        if (!this.isFaceRight) {
            pos.y = -pos.y
        }
        this.anim.pause()
        this.bodyStopAllActions()
        this.sprite.stopAllActions()
        let stabDelay = 0
        if (((!isSpecial && this.data.meleeDash > 0) || (isSpecial && this.data.specialDash > 0)) && isMelee) {
            stabDelay = 0.4 * speedScale
        }
        const beforetween = cc
            .tween()
            .delay(0.5 * speedScale)
            .call(() => {
                if (before) {
                    before(isSpecial)
                }
            })

        //摇晃
        const shaketween = cc
            .tween()
            .by(0.02, { position: cc.v3(5, 0) })
            .by(0.02, { position: cc.v3(-5, 0) })
            .by(0.02, { position: cc.v3(5, 0) })
            .by(0.02, { position: cc.v3(-5, 0) })
            .by(0.02, { position: cc.v3(5, 0) })
            .by(0.02, { position: cc.v3(-5, 0) })
            .by(0.02, { position: cc.v3(5, 0) })
            .by(0.02, { position: cc.v3(-5, 0) })

        const arrattack: string[] = [`anim009`]
        const arrspecial: string[] = []
        let frameIndex = 0
        const attackKeyStart = isSpecial ? this.data.specialFrameKeyStart : this.data.attackFrameKeyStart
        const attackKeyEnd = isSpecial ? this.data.specialFrameKeyEnd : this.data.attackFrameKeyEnd
        while (frameIndex < this.data.attackFrames - 1) {
            arrattack.push(`anim0${10 + frameIndex++}`)
        }
        for (let i = 0; i < this.data.specialFrames; i++) {
            arrspecial.push(`anim0${10 + frameIndex++}`)
        }
        const arr = isSpecial ? arrspecial : arrattack
        //攻击准备动画
        const _attacktweenprepare = cc.tween().delay(0)
        for (let i = 0; i < attackKeyStart; i++) {
            _attacktweenprepare.then(
                cc
                    .tween()
                    .delay(0.2 * speedScale)
                    .call(() => {
                        this.changeBodyRes(this.data.resName, arr[i])
                        AudioPlayer.play(AudioPlayer.MELEE)
                    })
            )
        }
        //攻击开始动画
        const _attacktweenstart = cc.tween().delay(0)
        for (let i = attackKeyStart; i < attackKeyEnd; i++) {
            _attacktweenstart.then(
                cc
                    .tween()
                    .delay(0.2 * speedScale)
                    .call(() => {
                        this.flyCancel()
                        this.changeBodyRes(this.data.resName, arr[i])
                    })
            )
        }
        //攻击结束动画
        const _attacktweenend = cc.tween().delay(0)
        for (let i = attackKeyEnd; i < arr.length; i++) {
            _attacktweenend.then(
                cc
                    .tween()
                    .delay(0.2 * speedScale)
                    .call(() => {
                        this.fly()
                        this.changeBodyRes(this.data.resName, arr[i])
                    })
            )
        }
        //退后
        const backofftween = cc
            .tween()
            .to(0.2 * speedScale, { position: cc.v3(-pos.x, -pos.y) })
            .delay(stabDelay)
        //前进
        const forwardtween = cc
            .tween()
            .to(0.2 * speedScale, { position: this.data.fly > 0 ? cc.v3(0, 0) : cc.v3(pos.x, pos.y) })
            .delay(stabDelay)
        const specialTypeCanMelee = this.data.specialType.length <= 0 || this.data.specialType == SpecialManager.AFTER_ASH
        const attackpreparetween = cc.tween().call(() => {
            //展示近战提示框
            if ((isMelee && !isSpecial) || (isSpecial && isMelee && specialTypeCanMelee) || (isSpecial && this.data.specialDash > 0)) {
                this.dangerBox.show(
                    this.data.attackRect,
                    isSpecial,
                    ActorUtils.getDashDistance(this, isSpecial ? this.data.specialDash : this.data.meleeDash, 0.4 * speedScale),
                    this.hv,
                    false
                )
            }
            if (isSpecial) {
                //延迟添加特殊物体
                this.scheduleOnce(() => {
                    if (!this.sc.isDied) {
                        this.specialManager.dungeon = this.dungeon
                        this.specialManager.addEffect(
                            this.data.specialType,
                            this.data.specialDistance,
                            this.isFaceRight,
                            FromData.getClone(this.data.nameCn, this.data.resName + 'anim000', this.seed),
                            this.IsVariation
                        )
                    }
                }, this.data.specialDelay)
            }
        })
        const attackingtween = cc.tween().call(() => {
            //隐藏近战提示
            this.dangerBox.hide(isMiss)
            //冲刺
            if ((!isSpecial && this.data.meleeDash > 0) || (isSpecial && this.data.specialDash > 0)) {
                this.move(cc.v3(this.hv), isSpecial ? this.data.specialDash : this.data.meleeDash)
                if (this.data.dashJump > 0) {
                    this.jumpAbility.jump(this.data.dashJump, 0)
                }
            }
            if (isSpecial) {
                //延迟添加特殊物体
                this.scheduleOnce(() => {
                    if (!this.sc.isDied) {
                        this.specialManager.dungeon = this.dungeon
                        this.specialManager.addPlacement(
                            this.data.specialType,
                            this.data.specialDistance,
                            this.isFaceRight,
                            FromData.getClone(this.data.nameCn, this.data.resName + 'anim000', this.seed),
                            this.IsVariation
                        )
                    }
                }, this.data.specialDelay)
            }
            if (attacking) {
                attacking(isSpecial)
            }
        })
        const attackback = cc.tween().call(() => {
            this.dangerBox.finish()
        })
        const attackfinish = cc
            .tween()
            .delay(0.2 * speedScale)
            .call(() => {
                this.dangerBox.finish()
                this.changeBodyRes(this.data.resName, NonPlayer.RES_IDLE000)
                this.setLinearVelocity(cc.Vec2.ZERO)
            })
        const aftertween = cc
            .tween()
            .to(0.2 * speedScale, { position: cc.v3(0, 0) })
            .delay(0.2 * speedScale)
            .call(() => {
                if (finish) {
                    finish(isSpecial)
                }
            })
        //普通近战 准备 退后且帧动画 出击前进且帧动画 回招且帧动画 结束
        const normalMelee = cc
            .tween()
            .then(attackpreparetween)
            .then(_attacktweenprepare)
            .then(backofftween)
            .parallel(attackingtween, _attacktweenstart, forwardtween)
            .parallel(attackback, _attacktweenend)
            .then(attackfinish)
        //普通远程 准备 帧动画 延迟出击 回招且帧动画 结束
        const normalRemote = cc
            .tween()
            .then(attackpreparetween)
            .then(_attacktweenprepare)
            .parallel(attackingtween, _attacktweenstart)
            .parallel(attackback, _attacktweenend)
            .then(attackfinish)
        //特殊近战 准备 退后 摇晃 出击 前进 回招 结束
        const specialMelee = cc
            .tween()
            .then(attackpreparetween)
            .then(_attacktweenprepare)
            .then(backofftween)
            .then(shaketween)
            .parallel(attackingtween, _attacktweenstart, forwardtween)
            .parallel(attackback, _attacktweenend)
            .then(attackfinish)
        //特殊远程 准备 摇晃 出击 回招 结束
        const specialRemote = cc
            .tween()
            .then(attackpreparetween)
            .parallel(shaketween, _attacktweenprepare)
            .parallel(attackingtween, _attacktweenstart)
            .parallel(attackback, _attacktweenend)
            .then(attackfinish)

        let allAction = cc
            .tween()
            .then(beforetween)
            .then(isMelee ? normalMelee : normalRemote)
            .then(aftertween)
        if (isSpecial) {
            this.showDangerTips()
            AudioPlayer.play(this.data.specialAudio)
            allAction = cc.tween().then(beforetween).then(specialRemote).then(aftertween)
            if (isMelee && specialTypeCanMelee) {
                allAction = cc.tween().then(beforetween).then(specialMelee).then(aftertween)
            }
        }
        cc.tween(this.bodySprite.node).then(allAction).start()
    }

    //移动，返回速度
    private move(pos: cc.Vec3, speed: number) {
        if (pos.equals(cc.Vec3.ZERO)) {
            this.hv = cc.v2(0, 0)
            return
        }
        pos = pos.normalize()
        this.hv = cc.v2(pos)

        this.pos = Dungeon.getIndexInMap(this.node.position)

        let h = pos.x
        let v = pos.y
        let absh = Math.abs(h)
        let absv = Math.abs(v)
        let mul = absh > absv ? absh : absv
        mul = mul == 0 ? 1 : mul

        let movement = cc.v2(h, v)
        if (speed < 0) {
            speed = 0
        }
        movement = movement.mul(speed)
        if (this.data.water > 0 && this.isInWater()) {
            movement = movement.mul(0.5)
            this.swimmingAudioStep.next(() => {
                AudioPlayer.play(AudioPlayer.SWIMMING)
            }, 2.5)
        }
        this.setLinearVelocity(movement)
        this.changeZIndex()
    }
    setLinearVelocity(movement: cc.Vec2) {
        this.currentlinearVelocitySpeed = movement
        this.entity.Move.linearVelocity = this.currentlinearVelocitySpeed.clone()
    }

    private fall() {
        AudioPlayer.play(AudioPlayer.ATTACK_BLEEDING)
        if (this.data.isStatic > 0 || this.data.isHeavy > 0 || this.IsVariation) {
            return
        }
        this.sc.isFalling = true
        this.bodySprite.node.angle = ActorUtils.isBehindTarget(this.dungeon.player, this) ? -75 : 105
        if (this.jumpAbility) {
            this.jumpAbility.airPause(4, 0.3, JumpingAbility.CALLBACK_AIR_PAUSE, (group: number, type: number) => {
                if (type == TriggerData.TYPE_JUMP_END) {
                    this.jumpAbility.removeCallback(JumpingAbility.CALLBACK_AIR_PAUSE)
                    this.fallFinish()
                }
            })
        }
    }
    fallFinish() {
        this.sc.isFalling = false
        this.bodySprite.node.angle = 0
        this.sprite.x = 0
    }
    public takeDamage(damageData: DamageData, from?: FromData, actor?: Actor): boolean {
        if (!this.sc.isShow || this.sc.isDied) {
            return false
        }
        //隐身中
        if (this.data.invisible > 0 && Logic.getRandomNum(1, 10) > 4) {
            this.showFloatFont(0, true, false, damageData.isCriticalStrike, false, false, false)
            return false
        }
        //闪烁中
        if (this.sc.isBlinking) {
            this.showFloatFont(0, true, false, damageData.isCriticalStrike, false, false, false)
            return false
        }
        let dd = this.data.getDamage(damageData)
        let dodge = this.data.FinalCommon.dodgeRate / 100
        let isDodge = Random.rand() <= dodge && dd.getTotalDamage() > 0
        dd = isDodge ? new DamageData() : dd
        if (isDodge) {
            this.showFloatFont(0, true, false, damageData.isCriticalStrike, false, false, false)
            return false
        }
        let isHurting = dd.getTotalDamage() > 0
        //处于特殊攻击状态和非近战伤害情况下不改变状态
        this.sc.isHurting = isHurting && !this.specialStep.IsExcuting && damageData.isMelee
        if (this.sc.isHurting) {
            //停止伪装打断攻击
            this.sc.isDisguising = false
            this.sc.isAttacking = false
            this.flyCancel()
            this.meleeStep.refreshCoolDown(this.data.melee)
            this.remoteStep.refreshCoolDown(this.data.remote)
            if (damageData.isCriticalStrike) {
                this.fall()
            }
            this.sprite.stopAllActions()
            this.bodyStopAllActions()
            this.changeBodyRes(this.data.resName, Logic.getHalfChance() ? NonPlayer.RES_HIT001 : NonPlayer.RES_HIT002)
            if (this.anim.getAnimationState('MonsterIdle').isPlaying) {
                this.anim.pause()
            }
            this.dangerBox.finish()
        }
        //展示受伤动画
        if (isHurting) {
            this.hitLight(true)
            this.hitLightS(damageData)
            if (damageData.isBackAttack || damageData.isCriticalStrike) {
                let pos = this.node.position.clone()
                if (actor) {
                    pos = actor.node.position.clone()
                }
                this.showBloodEffect(pos)
            }

            //150ms后恢复状态
            this.unschedule(this.hurtReset)
            this.scheduleOnce(this.hurtReset, 0.15)
        }
        //打破隐形
        this.sprite.opacity = 255
        //计算并展示伤害
        this.data.currentHealth -= dd.getTotalDamage()
        if (this.data.currentHealth > this.data.getHealth().y) {
            this.data.currentHealth = this.data.getHealth().y
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.getHealth().y)
        this.showFloatFont(dd.getTotalDamage(), false, false, damageData.isCriticalStrike, false, damageData.isBackAttack, false)
        //挨打回血
        if (this.data.isRecovery > 0 && isHurting) {
            this.addStatus(StatusManager.RECOVERY, new FromData())
        }
        return isHurting
    }
    /**受伤状态重置 */
    private hurtReset = () => {
        if (this.node) {
            this.fly()
            this.hitLight(false)
            this.resetBodyColor()
            if (this.sc.isHurting) {
                this.sc.isHurting = false
                this.anim.resume()
            }
        }
    }
    private resetBodyColor(): void {
        if (!this.data) {
            return
        }
        this.bodySprite.node.color = cc.Color.WHITE.fromHEX(this.data.StatusTotalData.color)
    }
    private getMixColor(color1: string, color2: string): string {
        let c1 = cc.color().fromHEX(color1)
        let c2 = cc.color().fromHEX(color2)
        let c3 = cc.color()
        let r = c1.getR() + c2.getR()
        let g = c1.getG() + c2.getG()
        let b = c1.getB() + c2.getB()

        c3.setR(r > 255 ? 255 : r)
        c3.setG(g > 255 ? 255 : g)
        c3.setB(b > 255 ? 255 : b)
        return '#' + c3.toHEX('#rrggbb')
    }
    addStatus(statusType: string, from: FromData) {
        if (!this.node || this.sc.isDied) {
            return
        }
        this.statusManager.addStatus(statusType, from)
    }
    addCustomStatus(data: StatusData, from: FromData) {
        if (!this.node || this.sc.isDied) {
            return
        }
        this.statusManager.addCustomStatus(data, from)
    }
    stopAllDebuffs() {
        if (!this.node) {
            return
        }
        this.statusManager.stopAllDebuffs()
    }
    private showAttackEffect(isDashing: boolean) {
        this.effectNode.setPosition(cc.v3(0, 32))
        if (!isDashing) {
            cc.tween(this.effectNode)
                .to(0.2, { position: cc.v3(32, 32) })
                .to(0.2, { position: cc.v3(0, 16) })
                .start()
        }
    }

    private showBloodEffect(pos: cc.Vec3) {
        AudioPlayer.play(AudioPlayer.ATTACK_BLEEDING)
        this.dungeon.addHitBlood(pos, this.node.position, Logic.getRandomNum(3, 6))
        this.particleBlood.resetSystem()
        this.scheduleOnce(() => {
            this.particleBlood.stopSystem()
        }, 0.5)
    }

    killed() {
        if (this.sc.isDied) {
            return
        }
        this.sc.isDied = true
        this.sc.isDisguising = false
        this.dashStep.IsExcuting = false
        this.sprite.stopAllActions()
        this.bodyStopAllActions()
        this.dangerBox.finish()
        this.statusManager.stopAllBuffs()
        this.anim.play('MonsterDie')
        this.changeBodyRes(this.data.resName, NonPlayer.RES_HIT003)
        let collider: CCollider = this.getComponent(CCollider)
        collider.sensor = true
        if (this.data.isEnemy > 0 && this.data.noLoot < 1) {
            this.getLoot()
        }
        Achievement.addMonsterKillAchievement(this.data.resName)
        Logic.setKillPlayerCounts(FromData.getClone(this.actorName(), this.data.resName + 'anim000', this.seed), false)
        this.scheduleOnce(() => {
            if (this.node) {
                this.setLinearVelocity(cc.Vec2.ZERO)
                if (this.data.isBoom > 0) {
                    let boom = cc.instantiate(this.boom).getComponent(AreaOfEffect)
                    if (boom) {
                        boom.show(
                            this.node.parent,
                            this.node.position,
                            cc.v2(1, 0),
                            0,
                            new AreaOfEffectData().init(
                                1,
                                0.2,
                                0,
                                0,
                                IndexZ.OVERHEAD,
                                this.data.isEnemy > 0,
                                true,
                                true,
                                false,
                                false,
                                new DamageData(2),
                                FromData.getClone('爆炸', 'boom000anim004'),
                                []
                            )
                        )
                        AudioPlayer.play(AudioPlayer.BOOM)
                        EventHelper.emit(EventHelper.CAMERA_SHAKE, { isHeavyShaking: true })
                    }
                }
                this.scheduleOnce(
                    () => {
                        this.destroyEntityNode()
                    },
                    this.data.isPet ? 0 : 5
                )
            }
        }, 2)
    }
    public getLoot() {
        let rand4save = Logic.mapManager.getRandom4Save(Logic.mapManager.getRebornSeed(this.seed), MapManager.RANDOM_NONPLAYER)
        let rand = rand4save.rand()
        let equipPercent = 0.1
        let percent = 0.75
        if (this.IsVariation) {
            percent = 0.6
            equipPercent = 0.3
        }
        equipPercent = equipPercent + this.killPlayerCount / 10
        percent = percent - this.killPlayerCount / 10
        if (percent < 0.3) {
            percent = 0.3
        }
        let offset = (1 - percent) / 10
        let quality = 1 + this.killPlayerCount / 2
        quality = Math.floor(quality)
        if (quality > EquipmentManager.QUALITY_ORANGE) {
            quality = EquipmentManager.QUALITY_ORANGE
        }

        if (this.dungeon) {
            let count = 1
            if (this.IsVariation) {
                count = 2
            }
            if (this.killPlayerCount > 0) {
                count = 5
            }
            if (this.dungeon.player.data.StatusTotalData.exOilGold > 0) {
                count += this.dungeon.player.data.StatusTotalData.exOilGold
            }
            EventHelper.emit(EventHelper.DUNGEON_ADD_OILGOLD, { pos: this.node.position, count: count })
            if (rand < equipPercent && !this.isSummon) {
                this.dungeon.addEquipment(Logic.getRandomEquipType(rand4save), Dungeon.getPosInMap(this.pos), null, quality)
            }
            if (rand < percent) {
                EventHelper.emit(EventHelper.DUNGEON_ADD_COIN, { pos: this.node.position, count: rand4save.getRandomNum(1, 10) })
            } else if (rand >= percent && rand < percent + offset) {
                this.addLootSaveItem(Item.HEART, true)
            } else if (rand >= percent + offset && rand < percent + offset * 2) {
                this.addLootSaveItem(Item.HEART, true)
            } else if (rand >= percent + offset * 2 && rand < percent + offset * 3) {
                this.addLootSaveItem(Item.BOTTLE_ATTACK)
            } else if (rand >= percent + offset * 3 && rand < percent + offset * 4) {
                this.addLootSaveItem(Item.BOTTLE_MOVESPEED)
            } else if (rand >= percent + offset * 4 && rand < percent + offset * 5) {
                this.addLootSaveItem(Item.BOTTLE_HEALING)
            } else if (rand >= percent + offset * 5 && rand < percent + offset * 6) {
                this.addLootSaveItem(Item.BOTTLE_DREAM)
            } else if (rand >= percent + offset * 6 && rand < percent + offset * 7) {
                this.addLootSaveItem(Item.BOTTLE_REMOTE)
            } else if (rand >= percent + offset * 7 && rand < percent + offset * 8) {
                this.addLootSaveItem(Item.BOTTLE_JUMP)
            } else if (rand >= percent + offset * 8 && rand < 1) {
            }
        }
    }
    private addLootSaveItem(resName: string, isAuto?: boolean) {
        if (isAuto || !this.isSummon) {
            this.dungeon.addItem(this.node.position.clone(), resName)
        }
    }

    /**获取中心位置 */
    getCenterPosition(): cc.Vec3 {
        return this.node.position.clone()
    }
    get isPassive() {
        return (
            !this.dungeon ||
            this.sc.isDied ||
            this.sc.isHurting ||
            this.sc.isFalling ||
            this.sc.isAttacking ||
            !this.sc.isShow ||
            this.sc.isDizzing ||
            this.sc.isDisguising ||
            this.sc.isDodging ||
            this.sc.isDashing
        )
    }
    private getNearestEnemyActor(needRefresh?: boolean) {
        if (!ActorUtils.isTargetCanTrack(this.currentTarget) || needRefresh) {
            this.currentTarget = ActorUtils.getNearestEnemyActor(this.node.position, this.data.isEnemy > 0, this.dungeon)
        }
        return this.currentTarget
    }

    updateAttack() {
        if (this.isPassive) {
            return
        }
        let target = this.getNearestEnemyActor()
        let targetDis = ActorUtils.getTargetDistance(this, target)
        //目标不存在、死亡或者隐身直接返回
        if (!ActorUtils.isTargetAlive(target)) {
            return
        }
        //特殊攻击
        if (this.data.specialAttack > 0) {
            this.specialStep.next(
                () => {
                    this.specialStep.IsExcuting = true
                },
                this.data.specialAttack,
                true
            )
        }
        let range = parseInt(this.attackRect[0]) + parseInt(this.attackRect[2])
        if (this.specialStep.IsExcuting && this.data.specialType.length > 0) {
            range += 100
        }
        if (this.data.meleeDash > 0) {
            let speedScale = 1 - this.data.FinalCommon.AttackSpeed / 10
            range = ActorUtils.getDashDistance(this, this.specialStep.IsExcuting ? this.data.specialDash : this.data.meleeDash, 0.8 * speedScale)
        }
        //&& Math.abs(this.node.position.y - target.node.y) < this.bodyRect[3] * this.node.scaleY
        let canMelee = this.data.melee > 0 && targetDis < range * this.node.scaleY
        let canRemote = this.data.remote > 0 && targetDis < 600 * this.node.scaleY
        if (canMelee && !this.meleeStep.IsInCooling) {
            this.meleeStep.next(() => {
                this.changeFaceRight(target)
                this.setLinearVelocity(cc.Vec2.ZERO)
                this.sc.isAttacking = true
                this.sprite.opacity = 255
                this.showAttackEffect(false)
                let isMiss = Logic.getRandomNum(0, 100) < this.data.StatusTotalData.missRate
                if (isMiss) {
                    this.showFloatFont(0, false, true, false, false, false, false)
                }
                this.showAttackAnim(
                    () => {},
                    () => {},
                    () => {
                        this.sc.isAttacking = false
                        this.specialStep.IsExcuting = false
                    },
                    target,
                    this.specialStep.IsExcuting,
                    true,
                    isMiss
                )
            }, this.data.melee)
        } else if (canRemote) {
            this.remoteStep.next(
                () => {
                    this.sc.isAttacking = true
                    this.sprite.opacity = 255
                    this.changeFaceRight(target)
                    let isLaser = Logic.bullets[this.data.bulletType] && Logic.bullets[this.data.bulletType].isLaser > 0
                    this.showAttackAnim(
                        (isSpecial: boolean) => {
                            if (isLaser && isSpecial) {
                                this.remoteAttack(target, isSpecial)
                            }
                        },
                        (isSpecial: boolean) => {
                            if (isLaser && isSpecial) {
                                return
                            }
                            this.remoteAttack(target, isSpecial)
                        },
                        () => {
                            this.specialStep.IsExcuting = false
                            if (isLaser) {
                                this.scheduleOnce(() => {
                                    this.sc.isAttacking = false
                                }, 1)
                            } else {
                                this.sc.isAttacking = false
                            }
                        },
                        target,
                        this.specialStep.IsExcuting,
                        false,
                        false
                    )
                },
                this.data.remote,
                true
            )
        }
    }
    public dodge(pos: cc.Vec3) {
        if (this.isPassive) {
            return
        }
        this.sc.isDodging = true
        let speed = this.data.FinalCommon.MoveSpeed
        this.move(pos, speed * 2.5)
        this.scheduleOnce(() => {
            this.sc.isDodging = false
        }, 0.1)
    }
    private stopMove = () => {
        this.sc.isMoving = false
    }
    updateLogic(dt: number) {
        if (!this.dungeon) {
            return
        }
        this.stateMachine.update()
        //修正位置
        this.entity.Move.isStatic = false
        this.entity.Transform.position = Dungeon.fixOuterMap(this.entity.Transform.position)
        this.pos = Dungeon.getIndexInMap(this.entity.Transform.position)
        this.isInWaterTile = this.dungeon.isActorPosInWater(this)
        if (this.isInWaterTile) {
            this.lastWaterPos = Dungeon.getIndexInMap(this.entity.Transform.position)
        }
        this.changeZIndex()
        this.trackStep.next(() => {
            this.getNearestEnemyActor(true)
        }, 10)
        let target = this.getNearestEnemyActor()
        this.updateAttack()
        let targetDis = ActorUtils.getTargetDistance(this, target)
        //靠近取消伪装
        if (this.data.disguise > 0 && targetDis < this.data.disguise && this.sc.isDisguising) {
            this.sc.isDisguising = false
        }
        //闪烁
        if (this.data.blink > 0 && !this.sc.isBlinking && !this.sc.isAttacking) {
            this.blinkStep.next(
                () => {
                    this.sc.isBlinking = true
                    this.sc.isAttacking = false
                },
                this.data.blink,
                true
            )
        }
        //冲刺
        let speed = this.data.FinalCommon.MoveSpeed
        if (this.data.dash > 0 && !this.isPassive && ActorUtils.isTargetAlive(target) && targetDis < 600 && targetDis > 100) {
            this.dashStep.next(() => {
                this.sc.isDashing = true
                this.dangerBox.show(this.data.attackRect, false, 500, this.hv, true)
                this.dangerBox.hide(false)
                this.enterWalk()
                AudioPlayer.play(AudioPlayer.MELEE)
                this.showAttackEffect(true)
                this.move(this.getMovePosFromTarget(target), speed)
                this.scheduleOnce(() => {
                    if (this.node) {
                        this.sc.isDashing = false
                        this.dangerBox.finish()
                    }
                }, 2)
            }, this.data.dash)
        }

        //是否追踪目标
        let isTracking = targetDis < 500 && this.data.melee > 0
        if (targetDis < 500 && targetDis > 300 && this.data.remote > 0) {
            isTracking = true
        }
        if (!ActorUtils.isTargetAlive(target)) {
            isTracking = false
        }

        //npc移动在没有敌对目标的时候转变目标为玩家
        if (!isTracking && this.data.isFollow > 0 && this.data.isEnemy < 1) {
            target = this.dungeon.player
            targetDis = ActorUtils.getTargetDistance(this, this.dungeon.player)
            isTracking = true
        }

        //相隔指定长度的时候需要停下来，否则执行移动操作
        if (!this.isPassive) {
            let needStop = (this.data.melee > 0 && targetDis < 64) || (this.data.remote > 0 && this.data.melee <= 0 && targetDis < 300) || this.shooter.isAiming || speed <= 0
            if (needStop) {
                this.sc.isMoving = false
            } else if (isTracking) {
                //追踪状态每0.2s重新设置移动目标点
                this.sc.isMoving = true
                this.moveStep.next(
                    () => {
                        let pos = this.getMovePosFromTarget(target, false)
                        if (this.data.flee > 0) {
                            pos = this.getMovePosFromTarget(target, true)
                            pos = cc.v3(-pos.x, -pos.y)
                            this.move(pos, speed * 2)
                        } else {
                            this.move(pos, speed)
                        }
                    },
                    0.2,
                    true
                )
            } else {
                //非追踪状态每8秒设置一个随机目标移动并在2s后或者速度为0时停下来
                this.moveStep.next(
                    () => {
                        this.move(this.getMovePosFromTarget(), speed)
                        this.sc.isMoving = true
                        this.unschedule(this.stopMove)
                        this.scheduleOnce(this.stopMove, 2)
                    },
                    8,
                    true
                )
                if (this.entity.Move.linearVelocity.equals(cc.Vec2.ZERO)) {
                    this.sc.isMoving = false
                    this.unschedule(this.stopMove)
                }
            }
        }

        //隐匿
        if (this.data.invisible > 0 && this.sprite.opacity > 20) {
            this.sprite.opacity = this.lerp(this.sprite.opacity, 19, dt * 3)
        }

        this.entity.Move.damping = this.sc.isDashing ? 0 : 10
        this.dashlight.opacity = this.sc.isDashing ? 200 : 0

        this.healthBar.node.opacity = this.sc.isDisguising ? 0 : 255
        if (this.shadow) {
            this.shadow.opacity = this.sc.isDisguising || this.data.water > 0 || this.isInWater() ? 0 : 128
        }
        if (this.sc.isDisguising && this.anim) {
            this.anim.pause()
        }
        if (this.data.invisible > 0) {
            this.healthBar.node.opacity = this.sprite.opacity > 20 ? 255 : 9
        }
        this.healthBar.node.active = !this.sc.isDied
        this.node.scale = this.getScaleSize()

        //防止错位
        this.healthBar.node.x = -30 * this.node.scale
        this.healthBar.node.y = this.data.boxType == 3 || this.data.boxType == 5 ? 150 : 120
        this.tips.node.y = this.data.boxType == 3 || this.data.boxType == 5 ? 180 : 150
        //变异为紫色
        this.healthBar.progressBar.barSprite.node.color = this.IsVariation ? cc.color(128, 0, 128) : cc.color(194, 0, 0)
        this.healthBar.progressBar.barSprite.node.color = this.killPlayerCount > 0 ? cc.color(255, 215, 0) : this.healthBar.progressBar.barSprite.node.color

        this.dashlight.color = this.IsVariation ? cc.color(255, 0, 0) : cc.color(255, 255, 255)
        if (this.attrNode) {
            this.attrNode.opacity = this.healthBar.node.opacity
        }
        if (this.data.isTest > 0 && this.isTestResetTimeDelay(dt) && !this.isPassive) {
            this.pos = this.defautPos.clone()
            this.updatePlayerPos()
        }
        if (this.data.water > 0 && !this.isInWaterTile) {
            this.pos = this.lastWaterPos.clone()
            this.updatePlayerPos()
        }
        if (this.parentNonPlayer && this.parentNonPlayer.data) {
            this.graphics.clear()
            this.graphics.strokeColor = cc.color(0, 255, 0, 60)
            this.graphics.lineWidth = 5
            if (this.parentNonPlayer.data.childMode == 0 && this.parentNonPlayer.sc.isDied) {
                this.data.currentHealth = 0
            } else {
                this.graphics.moveTo(0, 32)
                let pos = this.node.convertToNodeSpaceAR(this.parentNonPlayer.node.convertToWorldSpaceAR(cc.v3(0, 32)))
                // let pos = cc.v3(this.parentNonPlayer.node.position.x - this.node.position.x, this.parentNonPlayer.node.position.y - this.node.position.y)
                this.graphics.lineTo(pos.x, pos.y + 32)
                this.graphics.stroke()
            }
        }
        if (this.data.childMode == 1 && this.childNonPlayerList.length > 0) {
            let count = 0
            for (let n of this.childNonPlayerList) {
                if (n.sc.isDied) {
                    count++
                }
            }
            if (count == this.childNonPlayerList.length) {
                this.data.currentHealth = 0
            }
        }

        let y = this.root.y - this.entity.Transform.base
        if (y < 0) {
            y = 0
        }
        let scale = 1 - y / 64
        this.shadow.scale = scale < 0.5 ? 0.5 : scale
        this.shadow.y = this.bodySprite.node.y + this.entity.Transform.base
        this.shadow.x = this.isFaceRight ? this.bodySprite.node.x : -this.bodySprite.node.x
        this.bottomDir.node.y = this.entity.Transform.base
        this.bottomDir.node.opacity = this.isInWater() ? 128 : 255
        if (this.sc.isDied || this.sc.isDisguising) {
            this.bottomDir.node.opacity = 0
        }
        this.setInWaterMat(this.bodySprite, this.data.water < 1 && this.isInWater())
        this.waterY = this.isInWaterTile && this.data.water < 1 ? -32 : 0
        this.sprite.y = Logic.lerp(this.sprite.y, this.waterY, 0.2)
        this.showWaterSpark()
        if (this.jumpAbility) {
            this.jumpAbility.updateLogic()
        }
        this.statusManager.node.position = this.statusPos.clone().add(cc.v3(0, this.root.y))
        if (this.icon) {
            this.icon.updateLogic(this.data)
        }
    }
    private setInWaterMat(sprite: cc.Sprite, inWater: boolean) {
        if (!sprite || !sprite.spriteFrame) {
            return
        }
        let offset = sprite.spriteFrame.getOffset()
        let rect = sprite.spriteFrame.getRect()
        let texture = sprite.spriteFrame.getTexture()
        sprite.getMaterial(0).setProperty('rect', [rect.x / texture.width, rect.y / texture.height, rect.width / texture.width, rect.height / texture.height])
        sprite.getMaterial(0).setProperty('hidebottom', inWater ? 1.0 : 0.0)
        sprite.getMaterial(0).setProperty('isRotated', sprite.spriteFrame.isRotated() ? 1.0 : 0.0)
    }
    /**
     * 返回移动的方向
     * @param target
     * @param isFlee
     * @param justForSameY 仅限追踪的时候保持和目标同一y
     * @returns
     */
    private getMovePosFromTarget(target?: Actor, isFlee?: boolean, justForSameY?: boolean): cc.Vec3 {
        let newPos = cc.v3(0, 0)
        newPos.x += Logic.getRandomNum(0, 400) - 200
        newPos.y += Logic.getRandomNum(0, 400) - 200
        if (!ActorUtils.isTargetAlive(target)) {
            return newPos
        }
        newPos = target.node.position.clone()
        if (isFlee) {
            //保证逃跑的时候不碰到死角
            if (newPos.y > this.node.position.y) {
                newPos = newPos.addSelf(cc.v3(0, -128))
            } else {
                newPos = newPos.addSelf(cc.v3(0, 128))
            }
            if (newPos.x > this.node.position.x) {
                newPos = newPos.addSelf(cc.v3(-64, 0))
            } else {
                newPos = newPos.addSelf(cc.v3(64, 0))
            }
        } else if (justForSameY && Math.abs(newPos.y - this.node.position.y) > this.bodyRect[3] * this.node.scaleY + this.attackRect[2]) {
            newPos = cc.v3(this.node.position.x, newPos.y)
        }
        if (newPos.x > this.node.position.x) {
            newPos = newPos.addSelf(cc.v3(32, 0))
        } else {
            newPos = newPos.addSelf(cc.v3(-32, 0))
        }

        let pos = newPos.sub(this.node.position)
        if (!this.sc.isAttacking && !this.sc.isDisguising && this.data.isStatic < 1) {
            this.changeFaceRight(target)
        }
        return pos
    }
    private changeFaceRight(target: Actor) {
        let pos = target.node.position.clone()
        pos = pos.sub(this.node.position)
        let h = pos.x
        this.isFaceRight = h >= 0
        this.sprite.scaleX = this.isFaceRight ? 1 : -1
    }
    private lerp(a: number, b: number, r: number) {
        return a + (b - a) * r
    }
    onColliderEnter(other: CCollider, self: CCollider) {
        if (self.tag == CCollider.TAG.NONPLAYER || self.tag == CCollider.TAG.GOODNONPLAYER) {
            if (this.dungeon && this.sc.isDashing && !other.sensor) {
                this.sc.isDashing = false
                this.dangerBox.finish()
            }
            if (!other.sensor && other.z < 9999 && self.z + CCollider.MIN_HEIGHT < other.z + other.zHeight && !this.sc.isHurting) {
                this.jump()
            }
        } else if (self.tag == CCollider.TAG.DEFAULT) {
            this.areaDetector.onColliderEnter(other, self)
        }
    }
    onColliderStay(other: CCollider, self: CCollider) {
        if (self.tag == CCollider.TAG.NONPLAYER_HIT || self.tag == CCollider.TAG.GOODNONPLAYER_HIT) {
            this.dangerBox.onColliderStay(other, self)
        }
    }
    takeDizz(dizzDuration: number) {
        if (dizzDuration > 0) {
            this.sc.isDizzing = true
            this.scheduleOnce(() => {
                this.sc.isDizzing = false
            }, dizzDuration)
        }
    }

    private getScaleSize(): number {
        let scaleNum = this.data.scale && this.data.scale > 0 ? this.data.scale : 1
        let sn = this.IsVariation ? NonPlayer.SCALE_NUM * scaleNum : scaleNum
        return sn
    }

    actorName() {
        return this.data.nameCn
    }

    /**出场动作 */
    public enterShow() {
        this.sprite.stopAllActions()
        this.bodyStopAllActions()
        this.bodySprite.node.color = cc.Color.BLACK
        cc.tween(this.bodySprite.node)
            .to(1, { color: cc.Color.WHITE.fromHEX(this.data.StatusTotalData.color) })
            .call(() => {
                this.sc.isShow = true
            })
            .start()
    }
    /**伪装 */
    public enterDisguise() {
        this.sc.isShow = true
        this.sprite.stopAllActions()
        this.bodyStopAllActions()
        if (this.anim.getAnimationState('MonsterIdle').isPlaying) {
            this.anim.pause()
        }
        this.changeBodyRes(this.data.resName, NonPlayer.RES_DISGUISE)
    }

    /**等待 */
    public enterIdle() {
        //ecs关联节点
        this.sc.isMoving = false
        this.sc.isAttacking = false
        this.setLinearVelocity(cc.Vec2.ZERO)
        this.entity.NodeRender.node = this.node
        this.entity.NodeRender.root = this.root
        if (this.posZ != 0) {
            this.entity.Transform.z = this.posZ
            this.posZ = 0
        }
        this.fly()
        let action = cc
            .tween()
            .delay(0.2)
            .call(() => {
                this.changeBodyRes(this.data.resName, NonPlayer.RES_IDLE000)
            })
            .delay(0.2)
            .call(() => {
                this.changeBodyRes(this.data.resName, NonPlayer.RES_IDLE001)
            })
        this.sprite.stopAllActions()
        cc.tween(this.sprite).repeatForever(action).start()
        if (!this.anim.getAnimationState('MonsterIdle').isPlaying) {
            this.anim.play('MonsterIdle')
        }
        this.dangerBox.finish()
    }
    /** 移动*/
    public enterWalk() {
        this.sc.isAttacking = false
        let action = cc
            .tween()
            .delay(0.2)
            .call(() => {
                this.changeBodyRes(this.data.resName, NonPlayer.RES_WALK00)
            })
            .delay(0.2)
            .call(() => {
                this.changeBodyRes(this.data.resName, NonPlayer.RES_WALK01)
            })
            .delay(0.2)
            .call(() => {
                this.changeBodyRes(this.data.resName, NonPlayer.RES_WALK02)
            })
            .delay(0.2)
            .call(() => {
                this.changeBodyRes(this.data.resName, NonPlayer.RES_WALK03)
            })
        this.sprite.stopAllActions()
        cc.tween(this.sprite).repeatForever(action).start()
        if (!this.anim.getAnimationState('MonsterIdle').isPlaying) {
            this.anim.play('MonsterIdle')
        }
    }
    /**眩晕 */
    public enterDizz() {
        this.sc.isAttacking = false
        this.bodyStopAllActions()
        this.sprite.stopAllActions()
    }
    /**闪烁 */
    public enterBlink() {
        this.setLinearVelocity(cc.Vec2.ZERO)
        this.sc.isMoving = false
        AudioPlayer.play(AudioPlayer.BLINK)
        let body = this.bodySprite.node
        cc.tween(body)
            .to(0.2, { opacity: 0 })
            .call(() => {
                let newPos = ActorUtils.getTargetPosition(this.node.position, this.getNearestEnemyActor(), true)
                newPos = Dungeon.getIndexInMap(newPos)
                if (newPos.x > this.pos.x) {
                    newPos = newPos.addSelf(cc.v3(1, 0))
                } else {
                    newPos = newPos.addSelf(cc.v3(-1, 0))
                }
                let pos = Dungeon.getPosInMap(newPos)
                let r = cc.v3(Logic.getRandomNum(-Dungeon.TILE_SIZE / 2, Dungeon.TILE_SIZE / 2), Logic.getRandomNum(-Dungeon.TILE_SIZE / 2, Dungeon.TILE_SIZE / 2))
                this.entity.Transform.position = pos.add(r)
                this.node.setPosition(pos)
            })
            .to(0.2, { opacity: 255 })
            .call(() => {
                this.sc.isBlinking = false
            })
            .start()
    }
    moveTimeDelay = 0
    isTestResetTimeDelay(dt: number): boolean {
        this.moveTimeDelay += dt
        if (this.moveTimeDelay > 30) {
            this.moveTimeDelay = 0
            return true
        }
        return false
    }

    updateStatus(statusList: StatusData[], totalStatusData: StatusData): void {
        this.data.StatusTotalData.valueCopy(totalStatusData)
        this.data.StatusList = statusList
        if (!this.sc.isHurting) {
            this.resetBodyColor()
        }
    }
    hideSelf(hideDuration: number): void {}
    updateDream(offset: number): number {
        return 0
    }
    updateLife(sanity: number, solid: number, liquid: number): void {}
    onColliderExit(other: CCollider, self: CCollider): void {}
}
