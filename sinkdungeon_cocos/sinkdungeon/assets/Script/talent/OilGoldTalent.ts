import Actor from '../base/Actor'
import DamageData from '../data/DamageData'
import FromData from '../data/FromData'
import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'
import Shooter from '../logic/Shooter'
import FireGhost from './FireGhost'
import Talent from './Talent'
import AudioPlayer from '../utils/AudioPlayer'
import IndexZ from '../utils/IndexZ'
import StatusManager from '../manager/StatusManager'
import NonPlayer from '../logic/NonPlayer'
import Boss from '../boss/Boss'
import AreaOfEffectData from '../data/AreaOfEffectData'
import NonPlayerManager from '../manager/NonPlayerManager'
import ActorUtils from '../utils/ActorUtils'
import CoolDownView from '../ui/CoolDownView'
import TalentData from '../data/TalentData'
import InventoryManager from '../manager/InventoryManager'
import ShadowPlayer from '../actor/ShadowPlayer'
import Utils from '../utils/Utils'
import NonPlayerData from '../data/NonPlayerData'
/**
 * 翠金技能管理器
 * 人物会跟随一个翠金石，翠金体拥有形变的能力，可以幻化为各种效果
 * 翠金石在最开始的时候很小，只能提供微弱的远程能力，随着玩家获得的翠金越多，它的能力就越强，每个等级都会提供
 * 一个技能点来解锁更强的能力，这些能力会提供一个主动技能来释放该流派的大招，翠金主动技能会消耗精神值
 * 流派大致分为，近战，防御，远程，附魔
 * 近战：翠金手臂，背部长出翠金手臂，自动攻击附近目标可以挥拳砸地，还可以起跳的时候辅助，释放时造成大范围伤害
 * 防御：翠金盾牌，可抵挡指定方向的伤害，承受不住的时候会破碎进入冷却，也可以切换为翠金甲，全方位防御但是更脆弱，释放时提供短暂无敌
 * 远程：翠金匕首，自动攻击附近目标，后期可以解锁多重射击，追踪，释放时产生大量匕首
 * 闪避：翠金和身体融合，在闪避时提供高机动能力，闪避更快，距离更远，还可以增加残影伤害，和残影爆炸等效果，释放时可以生成大量残影
 * 提供一个快速切换流派的按钮
 *
 */
const { ccclass, property } = cc._decorator
@ccclass
export default class OilGoldTalent extends Talent {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Prefab)
    aoe: cc.Prefab = null
    @property(cc.Prefab)
    fireball: cc.Prefab = null
    @property(cc.Prefab)
    icethron: cc.Prefab = null
    @property(cc.Prefab)
    fireGhost: cc.Prefab = null
    @property(cc.Prefab)
    healingLight: cc.Prefab = null
    @property(cc.Prefab)
    rageLight: cc.Prefab = null
    @property(cc.Prefab)
    broomPrefab: cc.Prefab = null
    @property(cc.Prefab)
    cookingPrefab: cc.Prefab = null
    @property(cc.Prefab)
    swordLightPrefab: cc.Prefab = null
    @property(cc.Prefab)
    smokePrefab: cc.Prefab = null
    @property(cc.Prefab)
    skyhandPrefab: cc.Prefab = null
    @property(cc.Prefab)
    daggerLightPrefab: cc.Prefab = null
    fireGhostNum = 0
    ghostPool: cc.NodePool
    hv: cc.Vec2
    onLoad() {
        this.ghostPool = new cc.NodePool(FireGhost)
        EventHelper.on(EventHelper.POOL_DESTORY_FIREGHLOST, detail => {
            this.destroyGhost(detail.targetNode)
        })
    }
    destroyGhost(ghostNode: cc.Node) {
        if (!ghostNode) {
            return
        }
        ghostNode.active = false
        if (this.ghostPool) {
            this.ghostPool.put(ghostNode)
            this.fireGhostNum--
            cc.log('destroyGhost')
        }
    }

    init(data: TalentData) {
        super.init(data)
        this.coolDownId = CoolDownView.PROFESSION
        let storePointMax = 1
        if (this.data.resName == Talent.TALENT_014) {
            storePointMax = 3
        }
        this.initCoolDown(data, storePointMax)
    }
    protected skillCanUse() {
        switch (this.data.resName) {
            case Talent.TALENT_000:
            case Talent.TALENT_010:
            case Talent.TALENT_015:
                return false
            case Talent.TALENT_009:
                return this.canSteal()
            case Talent.TALENT_019:
                return this.player.CanJump && !this.player.sc.isJumping
        }
        return true
    }
    protected doSkill() {
        this.excuteSkill(null)
        for (let s of this.player.shadowList) {
            if (s.node) {
                this.excuteSkill(s)
            }
        }
    }
    private excuteSkill(shadowPlayer: ShadowPlayer) {
        let shooterEx = shadowPlayer ? shadowPlayer.shooterEx : this.player.shooterEx
        switch (this.data.resName) {
            case Talent.TALENT_000:
                Utils.toast('梦境开发中,无法使用。')
                break
            case Talent.TALENT_001:
                AudioPlayer.play(AudioPlayer.MELEE_PARRY)
                this.shoot(shooterEx, 0, 0, 'bullet040', null, null)
                break
            case Talent.TALENT_002:
                this.healing()
                break
            case Talent.TALENT_003:
                this.cooking(shooterEx)
                break
            case Talent.TALENT_004:
                this.showIceThron(shooterEx)
                break
            case Talent.TALENT_005:
                if (!shadowPlayer) {
                    this.rageShoot()
                }
                break
            case Talent.TALENT_006:
                this.flash(shadowPlayer)
                break
            case Talent.TALENT_007:
                this.addSwordLight(shooterEx)
                break
            case Talent.TALENT_008:
                this.addDaggerLight(shooterEx, shadowPlayer)
                break
            case Talent.TALENT_009:
                this.steal(shadowPlayer)
                break
            case Talent.TALENT_010:
                break
            case Talent.TALENT_011:
                if (!shadowPlayer) {
                    this.aimedShoot()
                }
                break
            case Talent.TALENT_012:
                this.addBroom(shooterEx)
                break
            case Talent.TALENT_013:
                this.showFireBall(shooterEx)
                break
            case Talent.TALENT_014:
                AudioPlayer.play(AudioPlayer.SKILL_MAGICBALL1)
                this.shoot(shooterEx, Shooter.ARC_EX_NUM_8, 0, 'bullet035', null, null)
                this.scheduleOnce(() => {
                    this.IsExcuting = false
                }, 0.1)
                break
            case Talent.TALENT_015:
                break
            case Talent.TALENT_016:
                if (shadowPlayer) {
                    this.addClearCircle(shadowPlayer.shooterEx)
                } else {
                    this.addClearCircle(shooterEx)
                }
                break
            case Talent.TALENT_017:
                this.showSmoke(shooterEx)
                break
            case Talent.TALENT_018:
                this.addShadowFighter(shadowPlayer)
                break
            case Talent.TALENT_019:
                this.jump(shooterEx)
                break
        }
    }
    private addClearCircle(shooterEx: Shooter) {
        this.player.stopAllDebuffs()
        if (this.player.dungeon.nonPlayerManager.isPetAlive()) {
            this.player.dungeon.nonPlayerManager.pet.stopAllDebuffs()
        }
        let aoe = shooterEx.fireAoe(
            this.aoe,
            new AreaOfEffectData().init(
                2,
                0.2,
                0,
                this.player.IsVariation ? 3 : 2,
                IndexZ.getActorZIndex(this.player.getCenterPosition()),
                false,
                false,
                true,
                false,
                false,
                new DamageData(0),
                new FromData(),
                []
            ),
            cc.v3(0, 32),
            0,
            null,
            true
        )
        shooterEx.updateCustomAoe(
            aoe,
            [Logic.spriteFrameRes('clearcircle1'), Logic.spriteFrameRes('clearcircle2'), Logic.spriteFrameRes('clearcircle3'), Logic.spriteFrameRes('clearcircle4')],
            false,
            true,
            4
        )
    }
    private addShadowFighter(shadowPlayer: ShadowPlayer) {
        for (let i = 0; i < 3; i++) {
            let data = new NonPlayerData()
            data.valueCopy(Logic.nonplayers[NonPlayerManager.NON_SHADOW])
            let fc = this.player.data.FinalCommon
            data.Common.damageMin = this.player.data.getFinalAttackPoint().getTotalDamage()
            data.Common.maxHealth = fc.MaxHealth
            this.player.weaponRight.meleeWeapon.dungeon.nonPlayerManager.addNonPlayerFromData(
                data,
                shadowPlayer ? shadowPlayer.node.position : this.player.node.position,
                this.player.entity?.Transform.z,
                this.player.weaponRight.meleeWeapon.dungeon
            )
        }
    }
    private healing() {
        AudioPlayer.play(AudioPlayer.PICK_ITEM)
        let light = cc.instantiate(this.healingLight)
        light.parent = this.player.node
        light.position = cc.v3(0, 64)
        light.zIndex = IndexZ.OVERHEAD
        this.player.addStatus(StatusManager.HEALING, new FromData())
        if (this.player.dungeon.nonPlayerManager.isPetAlive()) {
            this.player.dungeon.nonPlayerManager.pet.addStatus(StatusManager.HEALING, new FromData())
        }
    }

    private rageShoot() {
        AudioPlayer.play(AudioPlayer.PICK_ITEM)
        let light = cc.instantiate(this.rageLight)
        light.parent = this.player.node
        light.position = cc.v3(0, 64)
        light.zIndex = IndexZ.OVERHEAD
        this.scheduleOnce(() => {
            this.talentSkill.IsExcuting = false
            if (light && cc.isValid(light)) {
                light.destroy()
            }
        }, 3)
    }
    private flash(shadowPlayer: ShadowPlayer) {
        AudioPlayer.play(AudioPlayer.TAKEPHOTO)
        cc.tween(this.sprite.node)
            .call(() => {
                this.player.addStatus(StatusManager.TALENT_FLASH_SPEED, new FromData())
                if (this.player.dungeon.nonPlayerManager.isPetAlive()) {
                    this.player.dungeon.nonPlayerManager.pet.addStatus(StatusManager.TALENT_FLASH_SPEED, new FromData())
                }
                this.sprite.spriteFrame = Logic.spriteFrameRes('flash')
                this.sprite.node.width = 128
                this.sprite.node.height = 128
                this.sprite.node.opacity = 255
                this.sprite.node.position = cc.v3(0, 32)
            })
            .to(0.1, { opacity: 0 })
            .call(() => {
                this.sprite.spriteFrame = Logic.spriteFrameRes('singleColor')
                this.sprite.node.width = 2000
                this.sprite.node.height = 2000
                this.sprite.node.opacity = 255
            })
            .to(0.1, { opacity: 0 })
            .call(() => {
                StatusManager.addStatus2NearEnemies(
                    this.player,
                    shadowPlayer ? shadowPlayer.node : this.player.node,
                    StatusManager.TALENT_FLASH_DIZZ,
                    this.player.IsVariation ? 500 : 400,
                    new FromData()
                )
                this.sprite.spriteFrame = null
            })
            .start()
    }
    private aimedShoot() {
        AudioPlayer.play(AudioPlayer.RELOAD)
        cc.tween(this.sprite.node)
            .call(() => {
                this.player.addStatus(StatusManager.TALENT_AIMED, new FromData())
                if (this.player.dungeon.nonPlayerManager.isPetAlive()) {
                    this.player.dungeon.nonPlayerManager.pet.addStatus(StatusManager.TALENT_AIMED, new FromData())
                }
                this.sprite.spriteFrame = Logic.spriteFrameRes('talentshoot')
                this.sprite.node.width = 64
                this.sprite.node.height = 64
                this.sprite.node.opacity = 255
                this.sprite.node.scale = 1
                this.sprite.node.position = cc.v3(0, 128)
            })
            .repeat(5, cc.tween().to(1, { scale: 1.5 }).to(1, { scale: 1 }))
            .call(() => {
                this.sprite.spriteFrame = null
            })
            .start()
    }

    private jump(shooterEx: Shooter) {
        AudioPlayer.play(AudioPlayer.JUMP_FALL)
        this.player.talentJump(() => {
            AudioPlayer.play(AudioPlayer.BOOM)
            let d = this.player.data.getFinalAttackPoint()
            d.isMelee = true
            d.isCriticalStrike = true
            let scale = 2
            if (this.player.IsVariation) {
                scale += 1
            }
            shooterEx.fireAoe(
                this.skyhandPrefab,
                new AreaOfEffectData().init(0, 0.15, 0, scale, IndexZ.OVERHEAD, false, true, true, false, false, d, new FromData(), [StatusManager.DIZZ])
            )
            this.talentSkill.IsExcuting = false
        })
    }
    private canSteal() {
        let actor = ActorUtils.getNearestEnemyActor(this.player.node.position, false, this.player.weaponRight.meleeWeapon.dungeon)
        if (!actor) {
            return false
        }
        let monster = actor.getComponent(NonPlayer)
        let boss = actor.getComponent(Boss)
        if (monster && monster.data.noLoot < 1) {
            return true
        }
        if (boss) {
            return true
        }
        return false
    }
    private steal(shadowPlayer: ShadowPlayer) {
        AudioPlayer.play(AudioPlayer.FIREBALL)

        let node = ActorUtils.getNearestEnemyActor(this.player.node.position, false, this.player.weaponRight.meleeWeapon.dungeon)
        if (!node) {
            return
        }
        let monster = node.getComponent(NonPlayer)
        let boss = node.getComponent(Boss)
        if (monster && monster.data.noLoot < 1) {
            monster.getLoot()
        }
        if (boss) {
            boss.getLoot()
        }
        if (!shadowPlayer) {
            this.sprite.node.width = 128
            this.sprite.node.height = 128
            this.sprite.node.opacity = 255
            this.sprite.node.scale = 1
            this.sprite.node.position = cc.v3(0, 128)
            cc.tween(this.sprite.node)
                .call(() => {
                    this.sprite.spriteFrame = Logic.spriteFrameRes('talenthand01')
                })
                .delay(0.2)
                .call(() => {
                    this.sprite.spriteFrame = Logic.spriteFrameRes('talenthand02')
                })
                .delay(0.2)
                .call(() => {
                    this.sprite.spriteFrame = Logic.spriteFrameRes('talenthand03')
                })
                .delay(0.2)
                .call(() => {
                    this.sprite.spriteFrame = Logic.spriteFrameRes('talenthand04')
                })
                .delay(0.2)
                .call(() => {
                    this.sprite.spriteFrame = null
                })
                .start()
        }
    }

    showSmoke(shooterEx: Shooter) {
        AudioPlayer.play(AudioPlayer.MELEE_PARRY)
        let d = new DamageData()
        d.magicDamage = 3 + Logic.playerData.OilGoldData.level
        let scale = 1
        if (this.player.IsVariation) {
            scale += 1
        }
        this.shoot(
            shooterEx,
            0,
            0,
            'bullet041',
            this.smokePrefab,
            new AreaOfEffectData().init(7, 0.1, 0, scale, IndexZ.OVERHEAD, false, false, false, false, false, new DamageData(), new FromData(), [StatusManager.WINE_CLOUD])
        )
    }
    private showFireBall(shooterEx: Shooter) {
        AudioPlayer.play(AudioPlayer.SKILL_FIREBALL)
        let d = new DamageData()
        d.magicDamage = 3 + Logic.playerData.OilGoldData.level
        d.isMelee = true
        let scale = 4
        if (this.player.IsVariation) {
            scale += 1
        }
        shooterEx.fireAoe(this.fireball, new AreaOfEffectData().init(0, 0.1, 0, scale, IndexZ.OVERHEAD, false, true, true, false, true, d, new FromData(), [StatusManager.BURNING]))
    }
    private showIceThron(shooterEx: Shooter) {
        this.scheduleOnce(() => {
            AudioPlayer.play(AudioPlayer.SKILL_ICETHRON)
        }, 1)

        let d = new DamageData()
        d.magicDamage = 3 + Logic.playerData.OilGoldData.level
        d.isMelee = true
        let offset1 = 100
        let offset2 = 60
        let scale = 3
        if (this.player.IsVariation) {
            scale += 1
            offset1 = 150
            offset2 = 90
        }
        const angles1 = [0, 45, 90, 135, 180, 225, 270, 315]
        const posRight = [
            cc.v3(0, offset1),
            cc.v3(-offset2, offset2),
            cc.v3(-offset1, 0),
            cc.v3(-offset2, -offset2),
            cc.v3(0, -offset1),
            cc.v3(offset2, -offset2),
            cc.v3(offset1, 0),
            cc.v3(offset2, offset2)
        ]
        const posLeft = [
            cc.v3(0, -offset1),
            cc.v3(-offset2, -offset2),
            cc.v3(-offset1, 0),
            cc.v3(-offset2, offset2),
            cc.v3(0, offset1),
            cc.v3(offset2, offset2),
            cc.v3(offset1, 0),
            cc.v3(offset2, -offset2)
        ]
        let a1 = [angles1]
        let a = a1
        let index = 0
        for (let i = 0; i < a[index].length; i++) {
            shooterEx.fireAoe(
                this.icethron,
                new AreaOfEffectData().init(0, 2, 0, scale, IndexZ.OVERHEAD, false, true, true, false, true, d, new FromData(), [StatusManager.FROZEN]),
                cc.v3(posRight[i]),
                angles1[i],
                null,
                true
            )
        }
    }

    changePerformance() {}

    takeDamage(damageData: DamageData, actor?: Actor) {
        return false
    }
    private addLighteningFall(isArea: boolean, damagePoint: number) {
        EventHelper.emit(EventHelper.DUNGEON_ADD_LIGHTENINGFALL, {
            pos: ActorUtils.getNearestEnemyPosition(this.player.node.position, false, this.player.weaponRight.meleeWeapon.dungeon, true),
            showArea: isArea,
            damage: damagePoint
        })
    }
    private addBroom(shooterEx: Shooter) {
        AudioPlayer.play(AudioPlayer.MELEE_PARRY)
        let d = this.player.data.getFinalAttackPoint()
        d.isMelee = true
        let scale = 1.5
        if (this.player.IsVariation) {
            scale += 1
        }

        let aoe = shooterEx.fireAoe(
            this.broomPrefab,
            new AreaOfEffectData().init(0, 0.5, 0.2, scale, IndexZ.OVERHEAD, false, true, true, true, true, d, new FromData(), [StatusManager.FROZEN]),
            cc.v3(0, 32 * this.player.node.scaleY)
        )
        this.schedule(
            () => {
                if (aoe && aoe.entity && aoe.isValid) {
                    aoe.entity.Transform.position = this.player.node.position.clone()
                }
            },
            0.02,
            100
        )
    }

    private cooking(shooterEx: Shooter) {
        AudioPlayer.play(AudioPlayer.MELEE_PARRY)
        let d = this.player.data.getFinalAttackPoint()
        d.isMelee = true
        let scale = 1
        if (this.player.IsVariation) {
            scale += 1
        }
        shooterEx.fireAoe(
            this.cookingPrefab,
            new AreaOfEffectData().init(0, 2, 0, scale, IndexZ.OVERHEAD, false, false, false, false, false, d, new FromData(), []),
            cc.v3(0, 32),
            0,
            (actor: Actor) => {
                let monster = actor.node.getComponent(NonPlayer)
                if (monster) {
                    monster.dungeon.addItem(monster.node.position.clone(), `foodmonster${monster.data.resName.replace('monster', '')}`)
                }
                let boss = actor.node.getComponent(Boss)
                if (boss) {
                    boss.dungeon.addItem(boss.node.position.clone(), `foodboss${boss.data.resName.replace('iconboss', '')}`)
                }
            }
        )
    }
    private addSwordLight(shooterEx: Shooter) {
        AudioPlayer.play(AudioPlayer.SKILL_MAGICBALL)
        AudioPlayer.play(AudioPlayer.SWORD_SHOW)
        let d = new DamageData()
        d.isMelee = true
        let scale = 5
        d.physicalDamage = 2 + Logic.playerData.OilGoldData.level
        if (this.player.weaponRight.meleeWeapon.IsSword) {
            d = this.player.data.getFinalAttackPoint()
            scale = 6
        }
        if (this.player.IsVariation) {
            scale += 1
        }
        let swordlight = shooterEx.fireAoe(
            this.swordLightPrefab,
            new AreaOfEffectData().init(0, 0.35, 0, scale, IndexZ.OVERHEAD, false, true, true, false, true, d, new FromData(), [StatusManager.FROZEN])
        )
        let color = cc.color(255, 255, 255).fromHEX(this.player.inventoryManager.equips[InventoryManager.WEAPON].lightcolor)
        swordlight.node.getChildByName('sprite').color = color
        this.scheduleOnce(() => {
            this.talentSkill.IsExcuting = false
        }, 1)
    }
    private addDaggerLight(shooterEx: Shooter, shadowPlayer: ShadowPlayer) {
        if (!this.player.weaponRight.meleeWeapon.IsDagger) {
            if (!shadowPlayer) {
                this.player.addStatus(StatusManager.TALENT_INVISIBLE, new FromData())
            }
            return
        }
        let duration = 2.4
        if (!shadowPlayer) {
            this.scheduleOnce(() => {
                this.player.addStatus(StatusManager.TALENT_INVISIBLE, new FromData())
            }, duration)
        }
        AudioPlayer.play(AudioPlayer.SKILL_MAGICBALL)
        AudioPlayer.play(AudioPlayer.SWORD_SHOW)
        let scale = 2
        let d = this.player.data.getFinalAttackPoint()
        d.isMelee = true
        d.physicalDamage = d.physicalDamage / 2
        if (this.player.IsVariation) {
            scale += 1
        }
        let swordlight = shooterEx.fireAoe(
            this.daggerLightPrefab,
            new AreaOfEffectData().init(0, duration / 10, 0, scale, IndexZ.OVERHEAD, false, true, true, false, false, d, new FromData(), [StatusManager.FROZEN]),
            cc.Vec3.ZERO
        )
        let color = cc.color(255, 255, 255).fromHEX(this.player.inventoryManager.equips[InventoryManager.WEAPON].lightcolor)
        for (let sprite of swordlight.node.getComponentsInChildren(cc.Sprite)) {
            sprite.node.color = shadowPlayer ? cc.Color.BLACK : color
            sprite.node.opacity = 200
        }
        this.player.vanish(duration)
        if (shadowPlayer) {
            shadowPlayer.vanish(duration)
        }
        this.scheduleOnce(() => {
            this.talentSkill.IsExcuting = false
        }, 3)
    }

    private initFireGhosts() {
        let length = 5
        let count = this.fireGhostNum
        for (let i = 0; i < length - count; i++) {
            let ghostNode: cc.Node = null
            if (this.ghostPool.size() > 0) {
                ghostNode = this.ghostPool.get()
            }
            if (!ghostNode || ghostNode.active) {
                ghostNode = cc.instantiate(this.fireGhost)
            }
            this.fireGhostNum++
            ghostNode.active = true
            let fg = ghostNode.getComponent(FireGhost)
            fg.initCollider()
            this.player.node.parent.addChild(fg.node)
            fg.init(this.player, i * 72)
        }
    }
    private addDashGhost(shooterEx: Shooter) {
        let aoe = shooterEx.fireAoe(
            this.aoe,
            new AreaOfEffectData().init(0.4, 2, 0, 1, IndexZ.ACTOR, false, false, false, false, false, new DamageData(0.2), new FromData(), []),
            shooterEx.node.convertToNodeSpaceAR(this.player.node.convertToWorldSpaceAR(cc.v3(0, this.player.entity.Transform.z))),
            0,
            null,
            true
        )
        shooterEx.updateCustomAoe(aoe, [this.player.sprite.spriteFrame], false, true, 1, cc.color(189, 183, 107), 200, true, true, 48, 32)
    }
}
