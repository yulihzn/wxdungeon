import { MoveComponent } from './../ecs/component/MoveComponent'
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
import Shooter from './Shooter'
import Logic from './Logic'
import Dungeon from './Dungeon'

import Achievement from './Achievement'

import PlayerAvatar from './PlayerAvatar'
import PlayerWeapon from './PlayerWeapon'
import { EventHelper } from './EventHelper'

import ShadowPlayer from '../actor/ShadowPlayer'
import Actor from '../base/Actor'
import InteractBuilding from '../building/InteractBuilding'
import AvatarData from '../data/AvatarData'
import DamageData from '../data/DamageData'
import EquipmentData from '../data/EquipmentData'
import FromData from '../data/FromData'
import ItemData from '../data/ItemData'
import PlayerData from '../data/PlayerData'
import StatusData from '../data/StatusData'
import TalentData from '../data/TalentData'
import ShadowOfSight from '../effect/ShadowOfSight'
import Equipment from '../equipment/Equipment'
import Item from '../item/Item'
import InventoryManager from '../manager/InventoryManager'
import LightManager from '../manager/LightManager'
import StatusManager from '../manager/StatusManager'
import OrganizationTalent from '../talent/OrganizationTalent'
import ProfessionTalent from '../talent/ProfessionTalent'
import Talent from '../talent/Talent'
import Tips from '../ui/Tips'
import AudioPlayer from '../utils/AudioPlayer'
import IndexZ from '../utils/IndexZ'
import Random from '../utils/Random'
import MeleeWeapon from './MeleeWeapon'
import Shield from './Shield'
import CCollider from '../collider/CCollider'
import StatusIconList from '../ui/StatusIconList'
import Utils from '../utils/Utils'
import NextStep from '../utils/NextStep'
import LifeData from '../data/LifeData'
import TriggerData from '../data/TriggerData'
import ActorBottomDir from '../actor/ActorBottomDir'
import JumpingAbility from '../actor/JumpingAbility'
import Controller from './Controller'
import ActorUtils from '../utils/ActorUtils'
import AreaOfEffectData from '../data/AreaOfEffectData'
import StateMachine from '../base/fsm/StateMachine'
import State from '../base/fsm/State'
import PlayActor from '../base/PlayActor'
import BaseAvatar from '../base/BaseAvatar'
import Dialogue from '../ui/Dialogue'
import EquipItemTalent from '../talent/EquipItemTalent'
import OilGoldMetal from '../talent/OilGoldMetal'
import ExitData from '../data/ExitData'
import BaseController from './BaseController'
import WalkSmoke from './WalkSmoke'
@ccclass
export default class Player extends PlayActor {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Vec3)
    pos: cc.Vec3 = null
    @property(cc.Node)
    root: cc.Node = null
    @property(cc.Node)
    shadow: cc.Node = null
    @property(cc.Prefab)
    walksmoke: cc.Prefab = null
    private smokePool: cc.NodePool = null
    @property(PlayerWeapon)
    weaponLeft: PlayerWeapon = null
    @property(PlayerWeapon)
    weaponRight: PlayerWeapon = null
    @property(Shooter)
    shooterEx: Shooter = null
    @property(StatusManager)
    statusManager: StatusManager = null
    @property(cc.Prefab)
    avatarPrefab: cc.Prefab = null
    @property(cc.Node)
    remoteCooldown: cc.Node = null
    @property(cc.Node)
    shieldNode: cc.Node = null
    shield: Shield = null
    @property(cc.Camera)
    shadowCamera: cc.Camera = null
    @property(cc.Prefab)
    shadowPrefab: cc.Prefab = null
    @property(ActorBottomDir)
    bottomDir: ActorBottomDir = null
    @property(cc.Prefab)
    waterSpark: cc.Prefab = null
    @property(cc.Prefab)
    aoe: cc.Prefab = null
    @property(cc.Prefab)
    metalPrefab: cc.Prefab = null
    metal: OilGoldMetal = null
    professionTalent: ProfessionTalent = null
    equipmentTalent: EquipItemTalent = null
    organizationTalent: OrganizationTalent = null
    //触碰到的提示
    touchedTips: Tips
    private touchDelay = false
    get data(): PlayerData {
        return Logic.getPlayerDataById(this.dataId)
    }

    defaultPos = cc.v3(0, 0)

    fistCombo = 0
    interactBuilding: InteractBuilding

    isAvoidDeathed = false

    public shadowList: ShadowPlayer[] = []
    private playerSpriteTexture: cc.RenderTexture
    private playerSpriteframe: cc.SpriteFrame
    isInWaterTile = false
    statusIconList: StatusIconList
    lastConsumeTime = 0
    solidStep: NextStep = new NextStep()
    liquidStep: NextStep = new NextStep()
    pooStep: NextStep = new NextStep()
    peeStep: NextStep = new NextStep()
    lastTimeInWater = false
    swimmingAudioStep: NextStep = new NextStep()
    lastLinearVelocityZ = 0 //上次向上的速度
    statusPos: cc.Vec3 = cc.v3(0, 0)
    dashCooling = false
    stateMachine: StateMachine<Player, State<Player>>
    controller: BaseController
    // LIFE-CYCLE CALLBACKS:
    get Root(): cc.Node {
        return this.root
    }
    init(): void {
        this.sc.isDied = false
        this.sc.isShow = false
        this.inventoryMgr = Logic.getInventoryMgr(this.data.id)
        this.triggerShooter = this.shooterEx
        this.handLeft = this.weaponLeft
        this.handRight = this.weaponRight
        this.statusMgr = this.statusManager
        this.jumpAbility = this.addComponent(JumpingAbility)
        this.jumpAbility.init(this, 2, 0, (group: number, type: number) => {
            if (TriggerData.TYPE_JUMP_END == type) {
                if (this.sc.isMoving) {
                    this.playerAnim(BaseAvatar.STATE_WALK, this.currentDir)
                } else {
                    this.playerAnim(BaseAvatar.STATE_IDLE, this.currentDir)
                }
            }
            this.exTrigger(group, type, null, null)
        })
        this.avatar = PlayerAvatar.create(this.avatarPrefab, this.root, this.data.AvatarData.clone(), this.node.group)
        this.shield = this.shieldNode.getComponent(Shield)
        this.lastConsumeTime = Logic.data.realTime
        this.entity.Move.damping = 3
        this.entity.Move.linearVelocity = cc.v2(0, 0)
        this.statusManager.statusIconList = this.statusIconList
        this.statusPos = this.statusManager.node.position.clone()
        this.pos = cc.v3(0, 0)
        this.initTalent()
        this.initCollider()
        this.weaponLeft.init(this, true, false)
        this.weaponRight.init(this, false, false)
        this.scheduleOnce(() => {
            if (this.data.id == Logic.data.lastPlayerId) {
                EventHelper.emit(EventHelper.PLAYER_EQUIPMENT_REFRESH_ALL)
            } else {
                for (let key in this.inventoryMgr.equips) {
                    this.refreshEquipment(key, this.inventoryMgr.equips[key].clone(), true, false)
                }
                this.inventoryMgr.refreshSuits()
                this.inventoryMgr.updateTotalEquipData()
            }
        })
        this.remoteCooldown.width = 0
        this.remoteCooldown.opacity = 200
        if (this.data.pos.y == Logic.ROOM_HEIGHT - 1) {
            this.data.pos.y = Logic.ROOM_HEIGHT - 2
        }
        this.pos = this.data.pos.clone()
        this.defaultPos = this.data.pos.clone()
        this.updatePlayerPos()
        this.entity.NodeRender.node = this.node
        this.entity.NodeRender.root = this.root
        this.shooterEx.player = this
        this.shooterEx.isEx = true
        this.shooterEx.dungeon = this.dungeon
        this.shooterEx.actor = this
        this.smokePool = new cc.NodePool()
        this.playerAnim(BaseAvatar.STATE_IDLE, this.currentDir)

        this.lights = this.getComponentsInChildren(ShadowOfSight)
        LightManager.registerLight(this.lights, this.node)
        if (this.bottomDir) {
            this.bottomDir.init(this, this.data.id == Logic.data.lastPlayerId ? cc.Color.GREEN : cc.Color.YELLOW)
        }

        if (!this.playerSpriteTexture) {
            let width = 800
            this.playerSpriteTexture = new cc.RenderTexture()
            this.playerSpriteTexture.initWithSize(width, width)
            this.playerSpriteTexture.setFilters(cc.Texture2D.Filter.NEAREST, cc.Texture2D.Filter.NEAREST)
            this.shadowCamera.targetTexture = this.playerSpriteTexture
            this.shadowCamera.zoomRatio = cc.winSize.height / width
            this.shadowCamera.enabled = false
            this.playerSpriteframe = new cc.SpriteFrame(this.playerSpriteTexture)
            this.sprite.spriteFrame = this.playerSpriteframe
        }
        if (this.data.id == Logic.data.lastPlayerId) {
            this.metal = cc.instantiate(this.metalPrefab).getComponent(OilGoldMetal)
            this.metal.init(this)
        }
    }
    start() {
        if (!this.node) {
            return
        }
        this.updateStatus(this.data.StatusList, this.data.StatusTotalData)
        this.addSaveStatusList()
        ActorUtils.changeZIndex(this)
        this.updateInfoUi()
        this.playWakeUpInit()
    }
    onLoad() {
        this.init()

        EventHelper.on(EventHelper.PLAYER_UPDATE_OILGOLD_DATA, detail => {
            if (this.node && this.data.id == Logic.data.lastPlayerId) {
                this.updateData()
            }
        })
        EventHelper.on(EventHelper.PLAYER_USEDREAM, detail => {
            if (this.node && this.data.id == Logic.data.lastPlayerId && this.data.AvatarData.organizationIndex == AvatarData.HUNTER) this.updateDream(detail.value)
        })
        EventHelper.on(EventHelper.HUD_TIME_TICK, detail => {
            if (this.node && Logic.data.chapterIndex == Logic.CHAPTER099) {
                this.timeConsumeLife()
            }
        })
        if (Logic.isCheatMode) {
            this.addStatus(StatusManager.PERFECTDEFENCE, new FromData())
        }
        this.sc.isShow = true
    }
    private refreshEquipment(equipmentType: string, equipDataNew: EquipmentData, isInit: boolean, isReplace: boolean) {
        if (!equipDataNew || !equipmentType) {
            return
        }
        this.inventoryMgr.refreshEquipment(equipmentType, equipDataNew, isInit, isReplace, type => {
            this.changeEquipment(type)
        })
    }
    ctrlRemoteCancel() {
        if (this.shield && this.shield.data.equipmentType == InventoryManager.SHIELD) {
            this.shield.cancel()
        } else if (this.sc) {
            this.sc.isShooting = false
        }
    }

    public initShadowList(isFromSave: boolean, count: number, lifeTime: number) {
        if (count > 5) {
            count = 5
        }
        for (let s of this.shadowList) {
            if (s.isValid || s.enabled) {
                s.stop()
            }
        }
        this.shadowList = []
        if (isFromSave) {
            let currentTime = Date.now()
            for (let i = 0; i < count; i++) {
                if (this.data.ShadowList[i] && currentTime - this.data.ShadowList[i] < lifeTime * 1000) {
                    let shadow = cc.instantiate(this.shadowPrefab).getComponent(ShadowPlayer)
                    shadow.init(this, this.playerSpriteframe, i, lifeTime)
                    this.shadowList.push(shadow)
                }
            }
        } else {
            for (let i = 0; i < count; i++) {
                let shadow = cc.instantiate(this.shadowPrefab).getComponent(ShadowPlayer)
                shadow.init(this, this.playerSpriteframe, i, lifeTime)
                this.shadowList.push(shadow)
            }
        }
    }
    private addSaveStatusList() {
        this.statusManager.addStatusListFromSave(this.data.StatusList)
    }
    private initTalent() {
        let o = new TalentData()
        let p = new TalentData()
        o.valueCopy(Logic.talents[`talent10${this.data.AvatarData.organizationIndex}`])
        p.valueCopy(Logic.talents[this.data.AvatarData.professionData.talent])
        if (o.resName == this.data.OrganizationTalentData.resName) {
            o.valueCopy(this.data.OrganizationTalentData)
        }
        if (p.resName == this.data.ProfessionTalentData.resName) {
            p.valueCopy(this.data.ProfessionTalentData)
        }
        this.data.OrganizationTalentData.valueCopy(o)
        this.data.ProfessionTalentData.valueCopy(p)
        this.professionTalent = this.getComponent(ProfessionTalent)
        this.organizationTalent = this.getComponent(OrganizationTalent)
        this.professionTalent.init(this.data.ProfessionTalentData)
        this.organizationTalent.init(this.data.OrganizationTalentData)
        this.equipmentTalent = this.getComponent(EquipItemTalent)
        this.equipmentTalent.init(new TalentData())
    }

    private updateFlashLight() {
        if (this.lights) {
            for (let light of this.lights) {
                light.updateRender(Logic.settings.isFlashLightOpen)
            }
        }
    }

    actorName(): string {
        return 'Player'
    }

    public changeLight(color: cc.Color) {
        this.sprite.node.color = color
    }
    highLight(isHigh: boolean) {
        this.sprite.getMaterial(0).setProperty('openOutline', isHigh ? 1 : 0)
        this.sprite.getMaterial(0).setProperty('outlineSize', 0.2)
        this.sprite.getMaterial(0).setProperty('outlineColor', cc.color(255, 215, 0))
    }
    private updateFistCombo() {
        if (!this.weaponRight.meleeWeapon.IsFist) {
            this.fistCombo = MeleeWeapon.COMBO1
            return
        }
        if (this.fistCombo == MeleeWeapon.COMBO1) {
            this.fistCombo = MeleeWeapon.COMBO2
        } else if (this.fistCombo == MeleeWeapon.COMBO2) {
            this.fistCombo = MeleeWeapon.COMBO3
        } else if (this.fistCombo == MeleeWeapon.COMBO3) {
            this.fistCombo = MeleeWeapon.COMBO1
        } else {
            this.fistCombo = MeleeWeapon.COMBO1
        }
        if (!this.weaponLeft.meleeWeapon.IsComboing && !this.weaponRight.meleeWeapon.IsComboing) {
            this.fistCombo = MeleeWeapon.COMBO1
        }
    }
    takeDizz(dizzDuration: number): void {
        if (dizzDuration > 0 && !this.sc.isJumping) {
            this.sc.isDizzing = true
            this.entity.Move.linearVelocity = cc.Vec2.ZERO
            this.playerAnim(BaseAvatar.STATE_IDLE, this.currentDir)
            this.scheduleOnce(() => {
                this.sc.isDizzing = false
            }, dizzDuration)
        }
    }

    public updateStatus(statusList: StatusData[], totalStatusData: StatusData) {
        if (!this.inventoryMgr) {
            return
        }
        this.data.StatusTotalData.valueCopy(totalStatusData)
        this.data.StatusList = statusList
        this.changeLight(cc.Color.WHITE.fromHEX(this.data.StatusTotalData.color))
        this.updateInfoUi()
    }
    getWalkSmoke(parentNode: cc.Node, pos: cc.Vec3) {
        let smoke: cc.Node = null
        if (this.smokePool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            smoke = this.smokePool.get()
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!smoke || smoke.active) {
            smoke = cc.instantiate(this.walksmoke)
        }
        if (this.isInWater()) {
            pos = pos.add(cc.v3(0, 32))
        }
        smoke.getComponent(WalkSmoke).player = this
        smoke.parent = parentNode
        smoke.position = pos
        smoke.zIndex = IndexZ.ACTOR
        smoke.opacity = 255
        smoke.active = true
    }

    destroySmoke(smokeNode: cc.Node) {
        if (!smokeNode) {
            return
        }
        smokeNode.active = false
        if (this.smokePool) {
            this.smokePool.put(smokeNode)
        }
    }

    public changeEquipment(equipmentType: string) {
        if (!equipmentType) {
            return
        }
        let equipData = Logic.getInventoryMgr(this.data.id).equips[equipmentType]
        let spriteFrame = Logic.equipmentSpriteFrameRes(equipData)
        switch (equipmentType) {
            case InventoryManager.WEAPON:
                this.weaponRight.meleeWeapon.changeEquipment(equipData, spriteFrame)
                break
            case InventoryManager.REMOTE:
                this.weaponLeft.shooter.data = equipData.clone()
                let finalData = this.data.FinalCommon
                if (this.data.currentAmmo > finalData.MaxAmmo || this.data.currentAmmo <= 0) {
                    this.data.currentAmmo = finalData.MaxAmmo
                    if (this.data.id == Logic.data.lastPlayerId) {
                        EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_AMMO, { x: this.data.currentAmmo, y: finalData.MaxAmmo })
                    }
                }
                this.weaponLeft.shooter.changeRes(this.weaponLeft.shooter.data.img)
                let c = cc.color(255, 255, 255).fromHEX(this.weaponLeft.shooter.data.color)
                this.weaponLeft.shooter.changeResColor(c)
                if (equipData.equipmentType != InventoryManager.EMPTY) {
                    this.shield.data = new EquipmentData()
                    this.updateEquipment(
                        this.shield.sprite,
                        this.inventoryMgr.equips[InventoryManager.SHIELD].color,
                        Logic.spriteFrameRes(InventoryManager.EMPTY),
                        this.shield.data.isHeavy == 1 ? 80 : 64
                    )
                    EventHelper.emit(EventHelper.HUD_CHANGE_CONTROLLER_SHIELD, { isShield: false })
                } else {
                    EventHelper.emit(EventHelper.HUD_CHANGE_CONTROLLER_SHIELD, { isShield: true })
                }
                break
            case InventoryManager.SHIELD:
                this.shield.data = equipData.clone()
                this.shield.node.color = cc.Color.WHITE.fromHEX(equipData.color)
                this.updateEquipment(this.shield.sprite, equipData.color, spriteFrame, this.shield.data.isHeavy == 1 ? 80 : 64)
                if (equipData.equipmentType != InventoryManager.EMPTY) {
                    this.weaponLeft.shooter.data = new EquipmentData()
                    this.weaponLeft.shooter.changeRes(this.weaponLeft.shooter.data.img)
                    if (this.data.id == Logic.data.lastPlayerId) {
                        EventHelper.emit(EventHelper.HUD_CHANGE_CONTROLLER_SHIELD, { isShield: true })
                    }
                } else {
                    if (this.data.id == Logic.data.lastPlayerId) {
                        EventHelper.emit(EventHelper.HUD_CHANGE_CONTROLLER_SHIELD, { isShield: false })
                    }
                }
                break
            case InventoryManager.HELMET:
                this.avatar.hairSprite.node.opacity = equipData.hideHair == 1 ? 0 : 255
                this.updateEquipment(this.avatar.helmetSprite, equipData.color, spriteFrame)
                break
            case InventoryManager.CLOTHES:
                this.updateEquipment(this.avatar.clothesSprite, equipData.color, spriteFrame)
                break
            case InventoryManager.TROUSERS:
                let isLong = equipData.trouserslong == 1
                this.avatar.changeLegColor(isLong, equipData.color)
                this.updateEquipment(this.avatar.pantsSprite, equipData.color, spriteFrame)
                break
            case InventoryManager.GLOVES:
                this.updateEquipment(this.weaponRight.meleeWeapon.GlovesSprite, equipData.color, spriteFrame)
                this.updateEquipment(this.weaponLeft.meleeWeapon.GlovesSprite, equipData.color, spriteFrame)
                this.updateEquipment(this.avatar.glovesLeftSprite, equipData.color, spriteFrame)
                this.updateEquipment(this.avatar.glovesRightSprite, equipData.color, spriteFrame)
                break
            case InventoryManager.SHOES:
                this.updateEquipment(this.avatar.shoesLeftSprite, equipData.color, spriteFrame)
                this.updateEquipment(this.avatar.shoesRightSprite, equipData.color, spriteFrame)
                break
            case InventoryManager.CLOAK:
                this.updateEquipment(this.avatar.cloakSprite, equipData.color, spriteFrame)
                break
        }
        this.avatar.changeEquipDirSpriteFrame(this.inventoryMgr, this.currentDir)
        this.shield.changeZIndexByDir(this.avatar.node.zIndex, this.currentDir)
        this.updateInfoUi()
    }
    private updateEquipment(sprite: cc.Sprite, color: string, spriteFrame: cc.SpriteFrame, size?: number): void {
        sprite.spriteFrame = spriteFrame
        if (size && size > 0) {
            sprite.node.width = size
            sprite.node.height = size
        }
        let c = cc.color(255, 255, 255).fromHEX(color)
        sprite.node.color = c
    }
    private updateInfoUi() {
        let finalData = this.data.FinalCommon
        let health = this.data.getHealth(finalData)
        let dream = this.data.getDream(finalData)
        let life = this.data.LifeData
        if (this.data.id == Logic.data.lastPlayerId) {
            EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_HEALTHBAR, { x: health.x, y: health.y })
            EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_DREAMBAR, { x: dream.x, y: dream.y })
            EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_LIFE_BAR, { sanity: life.sanity, solid: life.solidSatiety, poo: life.poo, liquid: life.liquidSatiety, pee: life.pee })
        }
        this.inventoryMgr.updateTotalEquipData()
        this.data.EquipmentTotalData.valueCopy(this.inventoryMgr.TotalEquipData)
        this.updateData()
        if (this.data.id == Logic.data.lastPlayerId) {
            EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_INFODIALOG, { dataId: this.dataId })
        }
    }
    /**获取中心位置 */
    getCenterPosition(): cc.Vec3 {
        return this.entity.Transform.position.clone()
    }
    updatePlayerPos() {
        this.entity.Transform.position = Dungeon.getPosInMap(this.pos)
        this.entity.Transform.z = this.data.posZ
        this.node.position = this.entity.Transform.position.clone()
    }
    transportPlayer(pos: cc.Vec3) {
        if (!this.avatar.spriteNode) {
            return
        }
        this.avatar.spriteNode.angle = 0
        this.avatar.spriteNode.scale = 5
        this.avatar.spriteNode.opacity = 255
        this.avatar.spriteNode.x = 0
        this.avatar.spriteNode.y = 0
        this.pos = pos
        ActorUtils.changeZIndex(this)
        this.updatePlayerPos()
    }

    addStatus(statusType: string, from: FromData, isFromSave?: boolean) {
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
    get IsVariation() {
        return this.data.StatusTotalData.variation > 0
    }
    stopAllDebuffs() {
        if (!this.node) {
            return
        }
        this.statusManager.stopAllDebuffs()
    }
    get isInteractBuildingAniming() {
        return this.interactBuilding && this.interactBuilding.isTaken && this.interactBuilding.isAniming
    }
    ctrlMeleeAttack() {
        if (
            !this.weaponRight ||
            this.sc.isDizzing ||
            this.sc.isDied ||
            this.sc.isFalling ||
            this.sc.isVanishing ||
            this.avatar?.isAniming ||
            this.isInteractBuildingAniming ||
            (this.weaponLeft.meleeWeapon.IsAttacking && this.weaponLeft.meleeWeapon.IsFist) ||
            (this.weaponRight.meleeWeapon.IsAttacking && this.weaponRight.meleeWeapon.IsFist) ||
            this.shield.isDefendOrParrying ||
            this.useInteractBuilding(true)
        ) {
            return
        }
        this.updateFistCombo()
        let isAttackDo = false
        if (this.fistCombo == MeleeWeapon.COMBO1) {
            isAttackDo = this.weaponRight.meleeWeapon.attack(this.data, this.fistCombo)
            this.weaponLeft.meleeWeapon.attackIdle(false)
            if (isAttackDo) {
                for (let s of this.shadowList) {
                    s.attack(this.data, this.fistCombo, this.weaponRight.meleeWeapon.Hv, false)
                }
            }
        } else if (this.fistCombo == MeleeWeapon.COMBO2) {
            this.weaponRight.meleeWeapon.attackIdle(true)
            isAttackDo = this.weaponLeft.meleeWeapon.attack(this.data, this.fistCombo)
            if (isAttackDo) {
                for (let s of this.shadowList) {
                    s.attack(this.data, this.fistCombo, this.weaponLeft.meleeWeapon.Hv, true)
                }
            }
        } else if (this.fistCombo == MeleeWeapon.COMBO3) {
            isAttackDo = this.weaponRight.meleeWeapon.attack(this.data, this.fistCombo)
            this.weaponRight.meleeWeapon.DashTime(4)
            if (isAttackDo) {
                for (let s of this.shadowList) {
                    s.attack(this.data, this.fistCombo, this.weaponRight.meleeWeapon.Hv, false)
                }
            }
            this.scheduleOnce(() => {
                let isDo = this.weaponLeft.meleeWeapon.attack(this.data, this.fistCombo)
                if (isDo) {
                    for (let s of this.shadowList) {
                        s.attack(this.data, this.fistCombo, this.weaponLeft.meleeWeapon.Hv, true)
                    }
                }
            }, 0.15)
        }
        if (isAttackDo) {
            // let pos = this.weaponRight.meleeWeapon.Hv.clone()
            // if (!this.shield.isAniming && !this.shield.isDefendOrParrying) {
            //     this.isFaceRight = pos.x > 0
            // }
            // this.isFaceUp = pos.y > 0
            this.playerAnim(this.sc.isJumping ? BaseAvatar.STATE_AIRKICK : BaseAvatar.STATE_ATTACK, this.currentDir)
            this.stopHiding()
        }
    }
    useShield() {
        if (
            !this.weaponRight ||
            this.sc.isDizzing ||
            this.sc.isDied ||
            this.sc.isFalling ||
            this.avatar?.isAniming ||
            this.sc.isVanishing ||
            this.weaponRight.meleeWeapon.IsAttacking ||
            this.weaponLeft.meleeWeapon.IsAttacking ||
            this.isInteractBuildingAniming
        ) {
            return
        }
        if (this.shield.Status == Shield.STATUS_PARRY || this.shield.Status == Shield.STATUS_PUTDOWN) {
            return
        }
    }
    useInteractBuilding(isMelee: boolean) {
        if (!this.interactBuilding) {
            return false
        }
        if (!this.interactBuilding.isTaken) {
            return false
        }
        if (this.sc.isJumping && isMelee) {
            return false
        }
        if (!this.interactBuilding.isAniming) {
            this.stopHiding()
            this.playerAnim(BaseAvatar.STATE_ATTACK, this.currentDir)
            return this.interactBuilding.interact(this, false, isMelee, !isMelee)
        }
        return true
    }
    ctrlRemoteAttack() {
        if (this.useInteractBuilding(false) || this.avatar?.isAniming) {
            return
        }
        if (this.shield && this.shield.data.equipmentType == InventoryManager.SHIELD) {
            this.shield.use(this)
            return
        }
        if (!this.data || this.sc.isDizzing || this.sc.isDied || this.sc.isFalling || this.sc.isVanishing || !this.weaponLeft.shooter || this.avatar.isAniming) {
            return
        }
        let arcEx = 0
        let lineEx = 0
        if (this.professionTalent && this.professionTalent.hashTalent(Talent.TALENT_005) && this.professionTalent.IsExcuting) {
            arcEx = 2
            lineEx = 1
        }
        if (this.sc) {
            this.sc.isShooting = true
        }
        this.shooterEx.setHv(this.Hv.clone())
        this.weaponLeft.shooter.setHv(this.Hv.clone())
        this.weaponRight.shooter.setHv(this.Hv.clone())
        this.weaponLeft.shooter.data.bulletSize = this.IsVariation ? 0.5 : 0
        let fireSuccess = this.weaponLeft.remoteAttack(this.data, this.remoteCooldown, arcEx, lineEx)
        if (fireSuccess) {
            for (let s of this.shadowList) {
                s.remoteAttack(true, this.weaponLeft.shooter.data, this.weaponLeft.shooter.Hv, this.data.getFinalRemoteDamage(), arcEx, lineEx)
            }
            this.stopHiding()
            this.exTrigger(TriggerData.GROUP_ATTACK, TriggerData.TYPE_ATTTACK_REMOTE, null, null)
        }
    }

    move(dir: number, pos: cc.Vec3, dt: number) {
        if (this.sc.isDied || this.sc.isFalling || this.sc.isDizzing || !this.sc.isShow || this.sc.isVanishing) {
            return
        }

        if (!pos.equals(cc.Vec3.ZERO)) {
            pos = pos.mul(this.weaponRight.meleeWeapon.getMeleeSlowRatio())
            pos = pos.mul(this.weaponLeft.meleeWeapon.getMeleeSlowRatio())
            if (this.weaponLeft.isHeavyRemotoAttacking) {
                pos = pos.mul(0.01)
            }
            if (this.shield.data.isHeavy == 1 && this.shield.Status > Shield.STATUS_IDLE) {
                pos = pos.mul(0.5)
            }
            if (this.interactBuilding && this.interactBuilding.isTaken) {
                pos = pos.mul(0.5)
            }
            if (this.professionTalent.IsExcuting && this.professionTalent.hashTalent(Talent.TALENT_007)) {
                pos = pos.mul(0.01)
            }
            if (this.isInWater()) {
                pos = pos.mul(0.5)
                this.swimmingAudioStep.next(() => {
                    AudioPlayer.play(AudioPlayer.SWIMMING)
                }, 2.5)
            }
            this.pos = Dungeon.getIndexInMap(this.entity.Transform.position)
            this.data.pos = this.pos.clone()
            this.data.posZ = this.entity.Transform.z
            this.updateHv(cc.v2(pos).normalize())
            this.shooterEx.setHv(this.Hv.clone())
            this.weaponLeft.shooter.setHv(this.Hv.clone())
            this.weaponRight.shooter.setHv(this.Hv.clone())
        }
        let h = pos.x
        let v = pos.y
        let movement = cc.v2(h, v)
        let speed = this.data.getMoveSpeed()
        if (speed < 0) {
            speed = 0
        }
        movement = movement.mul(speed)
        this.entity.Move.linearVelocity = movement
        this.sc.isMoving = h != 0 || v != 0

        if (this.sc.isMoving) {
            this.playerAnim(BaseAvatar.STATE_WALK, dir)
        } else {
            this.playerAnim(BaseAvatar.STATE_IDLE, dir)
        }
        this.updateAvatarFace(dir)
    }
    private updateAvatarFace(dir: number) {
        if (
            dir != 4 &&
            !this.shield.isAniming &&
            !this.shield.isDefendOrParrying &&
            !this.avatar?.isAniming &&
            this.weaponLeft.meleeWeapon.CanMove &&
            this.weaponRight.meleeWeapon.CanMove &&
            !this.sc.isDashing
        ) {
            this.isFaceRight = this.hv.x > 0
            this.isFaceUp = this.hv.y > 0
            this.currentDir = dir
            if (dir == BaseAvatar.DIR_DOWN && this.isFaceUp) {
                dir = BaseAvatar.DIR_UP
            } else if (dir == BaseAvatar.DIR_UP && !this.isFaceUp) {
                dir = BaseAvatar.DIR_DOWN
            }
            this.weaponLeft.changeZIndexByDir(this.avatar.node.zIndex, dir)
            this.weaponRight.changeZIndexByDir(this.avatar.node.zIndex, dir)
            this.shield.changeZIndexByDir(this.avatar.node.zIndex, dir)
            this.avatar.changeAvatarByDir(dir)
        }
    }
    private currentTarget: Actor
    private getNearestEnemyActor(needRefresh: boolean, distance: number) {
        if (ActorUtils.getTargetDistance(this, this.currentTarget) > distance) {
            this.currentTarget = null
        }
        if (!ActorUtils.isTargetCanTrack(this.currentTarget) || needRefresh) {
            this.currentTarget = ActorUtils.getNearestEnemyActor(this.node.position, false, this.dungeon, distance)
        }
        return this.currentTarget
    }

    updateHv(hv?: cc.Vec2) {
        if (Controller.isMouseMode() && Controller.mousePos && this.dungeon && this.data.id == Logic.data.lastPlayerId) {
            let p = cc.v2(this.dungeon.node.convertToWorldSpaceAR(this.node.position))
            this.hv = Controller.mousePos.add(cc.v2(this.dungeon.cameraControl.node.position)).sub(p).normalize()
            let dir = Utils.getDirByHv(this.hv)
            this.updateAvatarFace(dir)
            return
        }
        let pos = ActorUtils.getTargetDirection(this.node.position, this.getNearestEnemyActor(false, this.sc.isShooting ? 800 : 300), false)
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.hv = cc.v2(pos).normalize()
        } else if (hv && !hv.equals(cc.Vec2.ZERO)) {
            this.hv = hv.normalize()
        }
        let dir = Utils.getDirByHv(this.hv)
        this.updateAvatarFace(dir)
    }

    playerAnim(status: number, dir: number): void {
        if (status == BaseAvatar.STATE_IDLE && this.avatar.status != BaseAvatar.STATE_IDLE) {
            this.weaponLeft.shooter.playWalk(false)
            this.weaponRight.shooter.playWalk(false)
        }
        switch (status) {
            case BaseAvatar.STATE_IDLE:
                if (this.avatar.status != BaseAvatar.STATE_IDLE) {
                    this.weaponLeft.shooter.playWalk(false)
                    this.weaponRight.shooter.playWalk(false)
                }
                break
            case BaseAvatar.STATE_WALK:
                if (this.avatar.status != BaseAvatar.STATE_ATTACK && this.avatar.status != BaseAvatar.STATE_AIRKICK) {
                    this.weaponLeft.shooter.playWalk(true)
                    this.weaponRight.shooter.playWalk(true)
                }
                break
            case BaseAvatar.STATE_ATTACK:
            case BaseAvatar.STATE_AIRKICK:
                this.weaponLeft.shooter.playWalk(true)
                this.weaponRight.shooter.playWalk(true)
                break
            case BaseAvatar.STATE_FALL:
                break
            case BaseAvatar.STATE_DIE:
                break
        }
        this.avatar.playAnim(status, dir)
    }

    fall() {
        if (this.sc.isFalling || this.sc.isJumping || this.sc.isVanishing) {
            return
        }
        this.sc.isFalling = true
        this.avatar.playAnim(BaseAvatar.STATE_FALL, this.currentDir)
        this.scheduleOnce(() => {
            this.transportPlayer(this.defaultPos)
            this.playerAnim(BaseAvatar.STATE_IDLE, 1)
            let dd = new DamageData()
            dd.realDamage = 1
            this.takeDamage(dd, FromData.getClone('跌落', '', this.node.position))
            this.sc.isFalling = false
        }, 2)
    }
    get CanJump() {
        if (
            this.sc.isDied ||
            this.sc.isFalling ||
            this.sc.isDizzing ||
            !this.sc.isShow ||
            this.sc.isVanishing ||
            this.avatar?.isAniming ||
            this.weaponRight.meleeWeapon.IsAttacking ||
            this.weaponLeft.meleeWeapon.IsAttacking ||
            this.isInteractBuildingAniming
        ) {
            return false
        }
        return true
    }
    vanish(duration: number) {
        if (this.sc.isVanishing) {
            return
        }
        this.sc.isVanishing = true
        if (duration > 0) {
            this.scheduleOnce(() => {
                this.sc.isVanishing = false
            }, duration)
        }
    }
    ctrlDash() {
        if (this.dashCooling || this.avatar?.isAniming) {
            return
        }
        this.sc.isDashing = true
        this.dashCooling = true
        let speed = 30
        if (this.IsVariation) {
            speed = 60
        }
        if (this.professionTalent && this.professionTalent.hashTalent(Talent.TALENT_015)) {
            speed += 15
        }
        this.schedule(
            () => {
                this.addDashGhost(this.shooterEx)
            },
            0.05,
            3
        )
        let pos = this.entity.Move.linearVelocity.clone()
        this.sc.isMoving = false
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = cc.v2(this.Hv.clone())
        } else {
            pos = pos.normalizeSelf()
        }
        let d = this.hv.dot(pos)
        let isBack = d < 0

        this.hv = pos.clone()
        pos = pos.mul(speed)
        this.entity.Move.linearVelocity = pos
        this.entity.Move.damping = 80
        this.playerAnim(isBack ? BaseAvatar.STATE_DASH1 : BaseAvatar.STATE_DASH, this.currentDir)
        this.highLight(true)
        this.scheduleOnce(() => {
            this.entity.Move.damping = 3
            this.entity.Move.linearVelocity = cc.Vec2.ZERO
            this.playerAnim(BaseAvatar.STATE_IDLE, this.currentDir)
            this.sc.isDashing = false
            this.highLight(false)
            this.exTrigger(TriggerData.GROUP_DASH, TriggerData.TYPE_DASH_END)
            this.scheduleOnce(() => {
                this.dashCooling = false
            }, 0.5)
        }, 0.3)
    }
    private addDashGhost(shooterEx: Shooter) {
        let aoe = shooterEx.fireAoe(
            this.aoe,
            new AreaOfEffectData().init(0.4, 2, 0, 1, IndexZ.ACTOR, false, false, false, false, false, new DamageData(0), new FromData(), []),
            shooterEx.node.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3(0, this.entity.Transform.z))),
            0,
            null,
            true
        )
        shooterEx.updateCustomAoe(aoe, [this.sprite.spriteFrame], false, true, 1, cc.color(189, 183, 107), 200, true, true, 48, 32)
    }
    updateData(): void {
        this.data.updateFinalCommon()
    }
    ctrlJump() {
        if (!this.CanJump) {
            return
        }
        if (this.jumpAbility) {
            this.jumpAbility.jump(this.data.getJumpSpeed(), this.data.getJumpHeight())
        }
    }
    ctrlJumpCancel() {
        if (this.jumpAbility) {
            this.jumpAbility.cancel()
        }
    }
    airPause(speed: number, duration: number, callbackKey?: number, callback?: Function) {
        if (this.jumpAbility) {
            this.jumpAbility.airPause(speed, duration, callbackKey, callback)
        }
    }
    talentJump(callback: Function) {
        if (!this.CanJump) {
            return
        }
        if (this.jumpAbility) {
            this.jumpAbility.jump(this.data.getJumpSpeed() * 3, PlayerData.DEFAULT_JUMP_HEIGHT * 3, JumpingAbility.CALLBACK_JUMP, (group: number, type: number) => {
                if (type == TriggerData.TYPE_JUMP_END) {
                    this.jumpAbility.removeCallback(JumpingAbility.CALLBACK_JUMP)
                    callback()
                } else if (type == TriggerData.TYPE_JUMP_HIGHEST) {
                    this.jumpAbility.acceleratedFall(2)
                }
            })
        }
    }
    /**
     * 挨打
     * @param damageData 伤害
     * @param from 来源信息
     * @param actor 来源单位(目前只有monster和boss)
     */
    takeDamage(damageData: DamageData, from: FromData, actor?: Actor): boolean {
        if (!this.data || this.sc.isDied || this.sc.isVanishing) {
            return false
        }

        let finalData = this.data.FinalCommon
        //盾牌
        let blockLevel = this.shield.blockDamage(this, damageData, from, actor)
        let dd = this.data.getDamage(damageData, blockLevel)
        let dodge = finalData.dodgeRate / 100
        let isDodge = Random.rand() <= dodge && dd.getTotalDamage() > 0
        //无敌冲刺
        if (this.sc.isDashing && dd.getTotalDamage() > 0) {
            isDodge = true
        }
        //幽光护盾
        let isBlock = false
        if (dd.getTotalDamage() > 0 && this.organizationTalent.takeDamage(dd, from, actor)) {
            dd = new DamageData()
            isBlock = true
        }
        // let isIceTaken = false;
        // if (dd.getTotalDamage() > 0) {
        //     isIceTaken = this.talentMagic.takeIce();
        // }
        // if (isIceTaken) {
        //     isDodge = true;
        // }
        dd = isDodge ? new DamageData() : dd
        let health = this.data.getHealth(finalData)
        let totalD = dd.getTotalDamage()
        if (totalD > 0 && this.data.AvatarData.organizationIndex == AvatarData.GURAD) {
            let t = this.updateDream(totalD)
            if (t < totalD) {
                this.exTrigger(TriggerData.GROUP_HURT, TriggerData.TYPE_HURT_DREAM, from, actor)
            }
            totalD = t
        }

        health.x -= totalD
        if (health.x > health.y) {
            health.x = health.y
        }
        this.data.currentHealth = health.x
        let isAvoidDeath = false
        if (this.data.currentHealth <= 0) {
            if (!this.isAvoidDeathed && this.data.StatusTotalData.avoidDeath > 0) {
                this.isAvoidDeathed = true
                isAvoidDeath = true
                this.data.currentHealth = 0
            } else {
                this.killed(from)
            }
        }
        if (this.data.id == Logic.data.lastPlayerId) {
            EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_HEALTHBAR, { x: health.x, y: health.y })
        }
        this.showFloatFont(dd.getTotalDamage(), isDodge, false, false, isBlock, damageData.isBackAttack, isAvoidDeath)
        if (isDodge) {
            this.exTrigger(TriggerData.GROUP_HURT, TriggerData.TYPE_HURT_DODGE, from, actor)
        }
        let valid = !isDodge && dd.getTotalDamage() > 0
        if (valid) {
            this.exTrigger(TriggerData.GROUP_HURT, TriggerData.TYPE_HURT, from, actor)
            this.changeLight(cc.color(255, 0, 0))
            this.scheduleOnce(() => {
                this.changeLight(cc.Color.WHITE.fromHEX(this.data.StatusTotalData.color))
            }, 0.2)
        }
        if (valid || blockLevel == Shield.BLOCK_PARRY) {
            this.showDamageEffect(blockLevel, from, actor)
        }
        return valid
    }
    public updateDream(offset: number): number {
        let dream = this.data.getDream(this.data.FinalCommon)
        dream.x -= offset
        let overflow = -dream.x
        if (dream.x > dream.y) {
            dream.x = dream.y
        }
        if (dream.x < 0) {
            dream.x = 0
        }
        this.data.currentDream = dream.x
        if (this.data.id == Logic.data.lastPlayerId) {
            EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_DREAMBAR, { x: dream.x, y: dream.y })
        }
        return overflow < 0 ? 0 : overflow
    }
    private showDamageEffect(blockLevel: number, from: FromData, actor: Actor) {
        if (this.data.id == Logic.data.lastPlayerId) {
            EventHelper.emit(EventHelper.CAMERA_SHAKE, { isHeavyShaking: false })
        }
        if (blockLevel == Shield.BLOCK_NORMAL) {
            AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_HIT)
            if (this.data.id == Logic.data.lastPlayerId) {
                EventHelper.emit(EventHelper.HUD_DAMAGE_CORNER_SHOW)
            }
        } else if (blockLevel == Shield.BLOCK_PARRY) {
            AudioPlayer.play(AudioPlayer.MELEE_PARRY)
        } else {
            AudioPlayer.play(AudioPlayer.PLAYER_HIT)
            if (this.data.id == Logic.data.lastPlayerId) {
                EventHelper.emit(EventHelper.HUD_DAMAGE_CORNER_SHOW)
            }
        }
    }

    killed(from?: FromData) {
        if (this.sc.isDied) {
            return
        }
        this.sc.isDied = true
        this.avatar.playAnim(BaseAvatar.STATE_DIE, this.currentDir)
        if (this.data.id == Logic.data.lastPlayerId) {
            EventHelper.emit(EventHelper.HUD_STOP_COUNTTIME)
        }
        this.scheduleOnce(() => {
            if (this.data.id == Logic.data.lastPlayerId) {
                EventHelper.emit(EventHelper.HUD_FADE_OUT)
            }
        }, 1.5)
        AudioPlayer.play(AudioPlayer.DIE)
        if (this.data.id == Logic.data.lastPlayerId) {
            EventHelper.emit(EventHelper.HUD_LOSE_OILGOLD)
            EventHelper.emit(EventHelper.DUNGEON_DISAPPEAR)
            EventHelper.emit(EventHelper.HUD_OILGOLD_LOSE_SHOW)
            Achievement.addPlayerDiedLifesAchievement()
            Logic.dieFrom.valueCopy(from)
            this.scheduleOnce(() => {
                cc.audioEngine.stopMusic()
                cc.director.loadScene('gameover')
            }, 3)
            this.dungeon.darkAfterKill()
        }
        this.weaponRight.node.opacity = 0
        this.weaponLeft.node.opacity = 0
    }
    //玩家行动
    ctrlMove(dir: number, pos: cc.Vec3, dt: number) {
        if (!this.sc.isShow) {
            return
        }
        if (this.professionTalent && !this.isWeaponDashing && !this.avatar?.isAniming && !this.sc.isDashing) {
            this.move(dir, pos, dt)
        }
    }

    smokeTimeDelay = 0
    isSmokeTimeDelay(dt: number): boolean {
        this.smokeTimeDelay += dt
        if (this.smokeTimeDelay > 0.3) {
            this.smokeTimeDelay = 0
            return true
        }
        return false
    }
    dreamTimeDelay = 0
    dreamLongTimeDelay = 0
    dreamShortTimeDelay = 0
    isDreamTimeDelay(dt: number): boolean {
        this.dreamTimeDelay += dt
        if (this.dreamTimeDelay > 5) {
            this.dreamTimeDelay = 0
            return true
        }
        return false
    }
    isDreamShortTimeDelay(dt: number): boolean {
        this.dreamShortTimeDelay += dt
        if (this.dreamShortTimeDelay > 1) {
            this.dreamShortTimeDelay = 0
            return true
        }
        return false
    }
    isDreamLongTimeDelay(dt: number): boolean {
        this.dreamLongTimeDelay += dt
        if (this.dreamLongTimeDelay > 10) {
            this.dreamLongTimeDelay = 0
            return true
        }
        return false
    }
    updateLogic(dt: number) {
        this.statusManager.updateLogic(dt)
        if (this.shadowCamera) {
            this.shadowCamera.render(this.node)
        }
        if (this.metal) {
            this.metal.updateLogic(dt)
        }
        if (this.isSmokeTimeDelay(dt) && this.sc.isMoving && !this.sc.isJumping) {
            this.getWalkSmoke(this.node.parent, this.entity.Transform.position)
        }
        //房间清理状态每秒回复1点梦境
        if (this.dungeon && this.dungeon.isClear && this.isDreamShortTimeDelay(dt)) {
            this.updateDream(-1)
        }
        //战斗时10s恢复一点梦境
        if (this.dungeon && !this.dungeon.isClear && this.isDreamLongTimeDelay(dt)) {
            this.updateDream(-1)
        }
        //科技派5s失去一点梦境
        if (this.dungeon && !this.dungeon.isClear && this.isDreamTimeDelay(dt)) {
            if (this.data.AvatarData.organizationIndex == AvatarData.TECH) {
                this.updateDream(1)
            }
        }
        this.node.scaleX = this.getScaleSize()
        this.avatar.node.scaleX = this.isFaceRight ? 1 : -1
        this.node.scaleY = this.getScaleSize()
        this.sprite.node.scaleX = 1 / this.getScaleSize()
        this.sprite.node.scaleY = -1 / this.getScaleSize()
        this.sprite.node.opacity = this.invisible ? 80 : 255
        if (this.sc.isVanishing) {
            this.sprite.node.opacity = 0
        }
        this.updateHv()
        let showHands = this.interactBuilding && this.interactBuilding.isTaken && !this.interactBuilding.isThrowing
        let isLift = this.interactBuilding && this.interactBuilding.isTaken && this.interactBuilding.isLift
        if (this.weaponLeft) {
            this.weaponLeft.updateLogic(dt)
            this.weaponLeft.handsUp(showHands, isLift, this.interactBuilding && this.interactBuilding.isAttacking)
        }
        if (this.weaponRight) {
            this.weaponRight.updateLogic(dt)
            this.weaponRight.handsUp(showHands, isLift, this.interactBuilding && this.interactBuilding.isAttacking)
        }
        if (this.shooterEx) {
            this.shooterEx.updateLogic(dt)
        }
        if (this.avatar) {
            this.avatar.showLegsWithWater(this.isInWater(), this.isInWaterTile)
            this.shadow.opacity = this.isInWater() ? 0 : 128
        }
        this.showUiButton()
        for (let s of this.shadowList) {
            if (s.node) {
                s.updateLogic(dt)
            }
        }
        let y = this.root.y - this.entity.Transform.base
        if (y < 0) {
            y = 0
        }
        let scale = 1 - y / (PlayerData.DEFAULT_JUMP_HEIGHT * MoveComponent.PIXELS_PER_UNIT) / 2
        this.shadow.scale = scale < 0.5 ? 0.5 : scale
        this.shadow.y = this.entity.Transform.base
        this.bottomDir.node.y = this.entity.Transform.base
        this.bottomDir.node.opacity = this.isInWater() ? 128 : 255
        ActorUtils.changeZIndex(this)
        this.showWaterSpark()
        if (this.jumpAbility) {
            this.jumpAbility.updateLogic()
        }
        this.statusManager.node.position = this.statusPos.clone().add(cc.v3(0, this.root.y))
        if ((this.sc.isJumping || this.entity.Transform.z - this.entity.Transform.base > 0) && this.CanJump) {
            this.playerAnim(this.entity.Move.linearVelocityZ > 0 ? BaseAvatar.STATE_JUMP_UP : BaseAvatar.STATE_JUMP_DOWN, this.currentDir)
        }
        this.updateFlashLight()
        if (this.inventoryMgr) {
            this.inventoryMgr.updateLogic(dt, this)
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
    getScaleSize(): number {
        let sn = this.IsVariation ? 1.5 : 1
        return sn
    }
    ctrlUseSkill(): void {
        if (this.professionTalent && !this.sc.isAttacking && !this.sc.isVanishing && !this.avatar?.isAniming) {
            this.professionTalent.useSKill()
        }
    }
    ctrlUseSkill1(): void {
        if (this.organizationTalent && !this.sc.isAttacking && !this.sc.isVanishing && !this.avatar?.isAniming) {
            this.organizationTalent.useSKill()
        }
    }
    protected exTriggerTalent(data: TriggerData, from: FromData, actor: Actor) {
        if (super.exTriggerTalent(data, from, actor)) {
            if (this.equipmentTalent) {
                this.equipmentTalent.data = Logic.talents[data.res]
                this.equipmentTalent.useSKill()
            }
        }
        return true
    }

    ctrlTriggerThings(isLongPress: boolean) {
        if (this.sc.isJumping || !this.dungeon || this.avatar.isAniming || Logic.data.lastPlayerId != this.data.id) {
            return
        }
        if (this.dungeon.equipmentManager.lastGroundEquip && this.dungeon.equipmentManager.lastGroundEquip.taken(isLongPress)) {
            this.dungeon.equipmentManager.lastGroundEquip = null
        }
        if (this.dungeon.itemManager.lastGroundItem && this.dungeon.itemManager.lastGroundItem.taken(this, isLongPress)) {
            this.dungeon.itemManager.lastGroundItem = null
        }
        if (this.interactBuilding && this.interactBuilding.isTaken) {
            this.interactBuilding.interact(this, isLongPress, false, false)
        } else if (this.dungeon.buildingManager.lastInteractBuilding && this.dungeon.buildingManager.lastInteractBuilding.taken(this, isLongPress)) {
            this.interactBuilding = this.dungeon.buildingManager.lastInteractBuilding
            this.dungeon.buildingManager.lastInteractBuilding = null
        }
        if (this.touchedTips) {
            this.touchedTips.next(isLongPress, this)
        }
    }
    private showUiButton() {
        if (!this.dungeon || this.data.id != Logic.data.lastPlayerId) {
            return
        }
        if (
            this.dungeon.equipmentManager.lastGroundEquip ||
            this.dungeon.itemManager.lastGroundItem ||
            this.dungeon.buildingManager.lastInteractBuilding ||
            (this.interactBuilding && this.interactBuilding.isTaken) ||
            this.touchedTips
        ) {
            EventHelper.emit(EventHelper.HUD_CONTROLLER_INTERACT_SHOW, { isShow: true })
        } else {
            EventHelper.emit(EventHelper.HUD_CONTROLLER_INTERACT_SHOW, { isShow: false })
        }
        if (
            (this.shield && this.shield.data.equipmentType == InventoryManager.SHIELD) ||
            (this.interactBuilding && this.interactBuilding.isTaken) ||
            this.weaponLeft.shooter.data.equipmentType == InventoryManager.REMOTE
        ) {
            EventHelper.emit(EventHelper.HUD_CONTROLLER_REMOTE_SHOW, { isShow: true })
        } else {
            EventHelper.emit(EventHelper.HUD_CONTROLLER_REMOTE_SHOW, { isShow: false })
        }
    }
    onColliderEnter(other: CCollider, self: CCollider): void {
        if (self.tag == CCollider.TAG.PLAYER_INTERACT) {
            this.touchedTips = null
        }
    }
    onColliderStay(other: CCollider, self: CCollider): void {
        if (self.tag == CCollider.TAG.PLAYER_INTERACT) {
            if (this.touchDelay) {
                return
            }
            let isInteract = false
            let equipment = other.node.getComponent(Equipment)
            if (equipment) {
                isInteract = true
            }
            let item = other.node.getComponent(Item)
            if (item) {
                isInteract = true
            }
            let tips = other.node.getComponent(Tips)
            if (tips) {
                isInteract = true
                this.touchedTips = tips
            }
            if (isInteract) {
                this.touchDelay = true
                this.scheduleOnce(() => {
                    this.touchDelay = false
                }, 0.1)
            }
        }
    }
    onColliderExit(other: CCollider, self: CCollider): void {
        if (self.tag == CCollider.TAG.PLAYER_INTERACT) {
            this.touchedTips = null
        }
    }
    onColliderPreSolve(other: CCollider, self: CCollider): void {
        if (other.tag == CCollider.TAG.NONPLAYER || other.tag == CCollider.TAG.GOODNONPLAYER) {
            self.disabledOnce = true
        }
    }

    ctrlUseItem(data: ItemData) {
        if (this.avatar?.isAniming) {
            return
        }
        Item.userIt(data, this)
        this.exTrigger(TriggerData.GROUP_USE, TriggerData.TYPE_USE_ITEM, null, null, true)
    }

    setLinearVelocity(movement: cc.Vec2) {}
    timeConsumeLife() {
        if (Logic.isDreaming()) {
            return
        }
        let time = Logic.data.realTime - this.lastConsumeTime
        this.lastConsumeTime = Logic.data.realTime
        let life = this.data.LifeData
        let solidLoss = (LifeData.SOLID_LOSS * life.timeScale * time) / 1000
        let liquidLoss = (LifeData.LIQUID_LOSS * life.timeScale * time) / 1000
        let canAddPoo = life.solidSatiety > 0
        let canAddPee = life.liquidSatiety > 0
        if (canAddPoo) {
            life.poo += solidLoss * LifeData.POO_RATE
            if (life.poo > 100) {
                life.poo = 100
                this.pooStep.next(() => {
                    this.sanityChange(-1)
                    Utils.toast('你的肚子一阵翻腾。', false, true)
                }, 120)
            }
        }
        if (canAddPee) {
            life.pee += liquidLoss * LifeData.PEERATE
            if (life.pee > 100) {
                life.pee = 100
                this.peeStep.next(() => {
                    this.sanityChange(-1)
                    Utils.toast('你的膀胱快要炸了。', false, true)
                }, 120)
            }
        }
        if (this.data.LifeData.solidSatiety <= 0) {
            this.solidStep.next(() => {
                this.sanityChange(-1)
                Utils.toast('你快要饿死了。', false, true)
            }, 120)
        }
        if (this.data.LifeData.liquidSatiety <= 0) {
            this.liquidStep.next(() => {
                this.sanityChange(-1)
                Utils.toast('你快要渴死了。', false, true)
            }, 120)
        }
        this.updateLife(0, -solidLoss, -liquidLoss)
    }
    updateLife(sanity: number, solid: number, liquid: number) {
        this.data.LifeData.sanity += sanity
        this.data.LifeData.solidSatiety += solid
        this.data.LifeData.liquidSatiety += liquid
        if (this.data.LifeData.sanity > 100) {
            this.data.LifeData.sanity = 100
        } else if (this.data.LifeData.sanity <= 0) {
            this.data.LifeData.sanity = 0
            if (sanity != 0) {
                Utils.toast('精神崩溃了。。。', false, true)
                let sd = new StatusData()
                sd.valueCopy(Logic.status[StatusManager.INSANE])
                sd.Common.damageMin += this.data.getFinalAttackPoint().physicalDamage
                this.addCustomStatus(sd, new FromData())
            }
        } else {
            this.statusManager.stopStatus(StatusManager.INSANE)
        }
        if (this.data.LifeData.solidSatiety > 100) {
            this.data.LifeData.solidSatiety = 100
        } else if (this.data.LifeData.solidSatiety < 0) {
            this.data.LifeData.solidSatiety = 0
        }
        if (this.data.LifeData.liquidSatiety > 100) {
            this.data.LifeData.liquidSatiety = 100
        } else if (this.data.LifeData.liquidSatiety < 0) {
            this.data.LifeData.liquidSatiety = 0
        }
        this.updateInfoUi()
    }
    sanityChange(sanity: number) {
        if (sanity == 0) {
            return
        }
        let data = new StatusData()
        if (sanity > 0) {
            data.valueCopy(Logic.status[StatusManager.SANITY_UP])
        } else if (sanity < 0) {
            data.valueCopy(Logic.status[StatusManager.SANITY_DOWN])
        }
        data.sanityDirect = sanity
        this.addCustomStatus(data, new FromData())
    }
    sleep() {
        this.avatar.playSleep()
    }
    drive() {
        this.avatar.playDrive()
        this.node.opacity = 0
    }
    driveOff() {
        this.avatar.playDriveOff()
        this.node.opacity = 255
    }
    toilet() {
        this.avatar.playToilet()
        cc.tween(this.data.LifeData)
            .to(3, { poo: 0, pee: 0 })
            .call(() => {
                Utils.toast('你感觉一身轻松。', false, true)
            })
            .start()
        let total = this.data.LifeData.pee + this.data.LifeData.poo
        if (total > 100) {
            this.sanityChange(2)
        } else {
            this.sanityChange(1)
        }
    }
    read() {
        this.avatar.playRead()
        if (Random.getRandomNum(0, 100) > 90) {
            Utils.toast('你用量子波动速读看完了一本书,书里的内容让你不寒而栗。', false, true)
            this.sanityChange(-10)
        } else {
            Utils.toast('你用量子波动速读看完了一本书,奇怪的知识又增加了。', false, true)
            this.sanityChange(5)
        }
    }
    cooking() {
        this.avatar.playCooking()
        Utils.toast(`你炒了两个鸡蛋又用昨晚剩下的米饭拌了拌。`, false, true)
    }
    playWakeUpInit() {
        if (this.data.isWakeUp) {
            this.data.isWakeUp = false
            this.avatar.playSleep()
            if (this.data.id == Logic.data.lastPlayerId) {
                this.scheduleOnce(() => {
                    Dialogue.play(Dialogue.DAILY_WAKE_UP, (index: number) => {
                        if (index == 0) {
                            this.avatar.playWakeUp()
                        } else if (index == 1) {
                            EventHelper.emit(EventHelper.HUD_CAMERA_ZOOM_IN)
                            this.scheduleOnce(() => {
                                AudioPlayer.play(AudioPlayer.EXIT)
                                //休息8小时
                                Logic.data.dreamCostTime = 60000 * 60 * 8
                                this.dungeon.isInitFinish = false
                                Logic.loadingNextLevel(ExitData.getDreamExitDataFromReal())
                            }, 1)
                        }
                    })
                })
            }
        }
    }
    drink() {
        this.avatar.playDrink()
        this.addStatus(StatusManager.HEALING, new FromData())
        this.addStatus(StatusManager.DRINK, new FromData())
        this.avatar.changeAvatarByDir(BaseAvatar.DIR_RIGHT)
    }
    canEatOrDrink(data: ItemData): boolean {
        let life = this.data.LifeData
        let str = '你觉得'
        let can = true
        if (data.solidSatiety > 0) {
            if (life.solidSatiety > 99) {
                can = false
                str += '太饱了'
                if (life.poo > 90) {
                    str += '，而且要憋不住'
                }
                str += '，完全吃不下了。'
            } else if (life.poo > 99) {
                can = false
                str += '要憋不住了,完全吃不下了。'
            }
        } else if (data.liquidSatiety > 0) {
            if (life.liquidSatiety > 99) {
                can = false
                str += '太胀了'
                if (life.pee > 99) {
                    str += '，而且要憋不住'
                }
                str += '，完全喝不下了。'
            } else if (life.poo > 99) {
                can = false
                str += '要憋不住了,完全喝不下了。'
            }
        }
        if (!can) {
            Utils.toast(str, false, true)
            AudioPlayer.play(AudioPlayer.SELECT_FAIL)
        }
        return can
    }
}
