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
import NonPlayerData from '../data/NonPlayerData'
/**
 * 技能管理器
 * 通用技能点：cd减短 范围变大 持续时间增加 伤害增加 数量变多
 * 猴子猴孙:召唤一个猴子
 *
 */
const { ccclass, property } = cc._decorator
@ccclass
export default class EquipItemTalent extends Talent {
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
    hv: cc.Vec2
    onLoad() {}

    init(data: TalentData) {
        super.init(data)
        this.coolDownId = CoolDownView.EQUIPITEM
        let storePointMax = 1
        // if (this.data.resName == Talent.TALENT_014) {
        //     storePointMax = 3
        // }
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
            case Talent.TALENT_200:
                this.addMonkey(shadowPlayer)
                break
            case Talent.TALENT_201:
                this.addLighteningFall(true, this.player.data.getFinalAttackPoint().getTotalDamage() * 5)
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
    private addMonkey(shadowPlayer: ShadowPlayer) {
        for (let i = 0; i < 3; i++) {
            let data = new NonPlayerData()
            AudioPlayer.play(AudioPlayer.SMOKE_BALL)
            data.valueCopy(Logic.nonplayers[NonPlayerManager.SHOP_MONKEY])
            let fc = this.player.data.FinalCommon
            data.Common.remoteDamage = this.player.data.getFinalRemoteDamage().getTotalDamage()
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
        AudioPlayer.play(AudioPlayer.JUMP)
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
            pos: ActorUtils.getNearestEnemyPosition(this.player.node.position, false, this.player.weaponRight.meleeWeapon.dungeon, false),
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
}
