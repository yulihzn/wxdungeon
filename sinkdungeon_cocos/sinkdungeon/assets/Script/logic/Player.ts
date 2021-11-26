// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import Shooter from './Shooter';
import Logic from './Logic';
import Dungeon from './Dungeon';


import Achievement from './Achievement';

import PlayerAvatar from './PlayerAvatar';
import PlayerWeapon from './PlayerWeapon';
import { EventHelper } from './EventHelper';

import ShadowPlayer from '../actor/ShadowPlayer';
import Actor from '../base/Actor';
import InteractBuilding from '../building/InteractBuilding';
import AvatarData from '../data/AvatarData';
import DamageData from '../data/DamageData';
import EquipmentData from '../data/EquipmentData';
import FromData from '../data/FromData';
import ItemData from '../data/ItemData';
import PlayerData from '../data/PlayerData';
import StatusData from '../data/StatusData';
import TalentData from '../data/TalentData';
import ShadowOfSight from '../effect/ShadowOfSight';
import Equipment from '../equipment/Equipment';
import Item from '../item/Item';
import FloatinglabelManager from '../manager/FloatingLabelManager';
import InventoryManager from '../manager/InventoryManager';
import LightManager from '../manager/LightManager';
import StatusManager from '../manager/StatusManager';
import OrganizationTalent from '../talent/OrganizationTalent';
import ProfessionTalent from '../talent/ProfessionTalent';
import Talent from '../talent/Talent';
import Tips from '../ui/Tips';
import AudioPlayer from '../utils/AudioPlayer';
import IndexZ from '../utils/IndexZ';
import Random from '../utils/Random';
import MeleeWeapon from './MeleeWeapon';
import Shield from './Shield';
import CCollider from '../collider/CCollider';
@ccclass
export default class Player extends Actor {


    @property(FloatinglabelManager)
    floatinglabelManager: FloatinglabelManager = null;
    @property(cc.Vec3)
    pos: cc.Vec3 = null;
    @property(cc.Prefab)
    walksmoke: cc.Prefab = null;
    private smokePool: cc.NodePool = null;
    @property(PlayerWeapon)
    weaponLeft: PlayerWeapon = null;
    @property(PlayerWeapon)
    weaponRight: PlayerWeapon = null;
    @property(Shooter)
    shooterEx: Shooter = null;
    @property(StatusManager)
    statusManager: StatusManager = null;
    @property(PlayerAvatar)
    avatar: PlayerAvatar = null;
    @property(Shield)
    shield: Shield = null;
    @property(cc.Node)
    remoteCooldown: cc.Node = null;
    @property(cc.Camera)
    shadowCamera: cc.Camera = null;
    @property(cc.Prefab)
    shadowPrefab: cc.Prefab = null;
    professionTalent: ProfessionTalent;
    organizationTalent: OrganizationTalent;


    isStone = false;//是否石化

    baseAttackPoint: number = 1;

    //触碰到的提示
    touchedTips: Tips;
    private touchDelay = false;
    inventoryManager: InventoryManager;
    data: PlayerData;


    currentDir = 3;

    attackTarget: CCollider;

    defaultPos = cc.v3(0, 0);

    isWeaponDashing = false;
    fistCombo = 0;
    dungeon: Dungeon;
    interactBuilding: InteractBuilding;

    isAvoidDeathed = false;

    public shadowList: ShadowPlayer[] = [];
    private shadowTexture: cc.RenderTexture;
    private shadowSpriteframe: cc.SpriteFrame;
    private isLevelWater = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.entity.Move.linearDamping = 2;
        this.entity.Move.linearVelocity = cc.v2(0, 0);
        this.inventoryManager = Logic.inventoryManager;
        this.data = Logic.playerData.clone();
        this.updateStatus(this.data.StatusList, this.data.StatusTotalData);
        this.pos = cc.v3(0, 0);
        this.sc.isDied = false;
        this.isStone = false;
        this.sc.isShow = false;
        this.isLevelWater = Logic.worldLoader.getCurrentLevelData().isWater;
        this.scheduleOnce(() => {
            this.sc.isShow = true;
            this.addSaveStatusList();
        }, 0.5)
        this.initTalent();
        this.initCollider();
        this.weaponLeft.init(this, true, false);
        this.weaponRight.init(this, false, false);
        this.remoteCooldown.width = 0;
        this.remoteCooldown.opacity = 200;
        cc.director.on(EventHelper.PLAYER_TRIGGER
            , (event) => { if (this.node) this.triggerThings(event && event.detail && event.detail.isLongPress) });
        cc.director.on(EventHelper.PLAYER_EXIT_FROM_SETTINGS
            , (event) => {
                cc.director.loadScene('start');
            });
        cc.director.on(EventHelper.PLAYER_USEITEM
            , (event) => { if (this.node) this.useItem(event.detail.itemData) });
        cc.director.on(EventHelper.PLAYER_SKILL
            , (event) => { if (this.node) this.useSkill() });
        cc.director.on(EventHelper.PLAYER_SKILL1
            , (event) => { if (this.node) this.useSkill1() });
        cc.director.on(EventHelper.PLAYER_UPDATE_OILGOLD_DATA
            , (event) => {
                if (this.node) {
                    this.data.OilGoldData.valueCopy(Logic.playerData.OilGoldData);
                }
            });
        cc.director.on(EventHelper.PLAYER_ATTACK
            , (event) => {
                if (this.useInteractBuilding(true)) {
                    return;
                }
                if (this.node) this.meleeAttack();
            });
        cc.director.on(EventHelper.PLAYER_REMOTEATTACK_CANCEL
            , (event) => {
                if (this.shield && this.shield.data.equipmetType == InventoryManager.SHIELD) {
                    this.shield.cancel(this.isFaceRight);
                }
            });
        cc.director.on(EventHelper.PLAYER_REMOTEATTACK
            , (event) => {
                if (this.useInteractBuilding(false)) {
                    return;
                }
                if (this.shield && this.shield.data.equipmetType == InventoryManager.SHIELD) {
                    this.shield.use(this.isFaceRight);
                } else {
                    if (this.node) this.remoteAttack();
                }
            });
        cc.director.on(EventHelper.PLAYER_USEDREAM
            , (event) => { if (this.node && this.data.AvatarData.organizationIndex == AvatarData.HUNTER) this.updateDream(event.detail.value) });
        if (Logic.playerData.pos.y == Dungeon.HEIGHT_SIZE - 1) {
            Logic.playerData.pos.y = Dungeon.HEIGHT_SIZE - 2;
        }
        this.pos = Logic.playerData.pos.clone();
        this.defaultPos = Logic.playerData.pos.clone();
        this.baseAttackPoint = Logic.playerData.FinalCommon.damageMin;
        this.updatePlayerPos();
        this.entity.NodeRender.node = this.node;
        cc.director.emit(EventHelper.CAMERA_LOOK);
        this.shooterEx.player = this;
        this.shooterEx.isEx = true;
        this.smokePool = new cc.NodePool();
        cc.director.on(EventHelper.POOL_DESTORY_WALKSMOKE, (event) => {
            this.destroySmoke(event.detail.coinNode);
        })
        this.playerAnim(PlayerAvatar.STATE_IDLE, this.currentDir);
        if (Logic.isCheatMode) {
            this.scheduleOnce(() => {
                this.addStatus(StatusManager.PERFECTDEFENCE, new FromData());
                this.data.Common.damageMin = 99;
                this.data.Common.moveSpeed = 999;
            }, 0.2);
        }
        this.lights = this.getComponentsInChildren(ShadowOfSight);
        LightManager.registerLight(this.lights, this.node);
        this.lights[0].radius = 0;
        if (Logic.chapterIndex == Logic.CHAPTER099) {
            this.lights[0].radius = 0;
        }
    }

    public initShadowList(isFromSave: boolean, count: number, lifeTime: number) {
        if (count > 5) {
            count = 5;
        }

        if (!this.shadowTexture) {
            this.shadowTexture = new cc.RenderTexture();
            this.shadowTexture.initWithSize(this.shadowCamera.node.width, this.shadowCamera.node.height);
            this.shadowTexture.setFilters(cc.Texture2D.Filter.NEAREST, cc.Texture2D.Filter.NEAREST);
            this.shadowCamera.targetTexture = this.shadowTexture;
            this.shadowSpriteframe = new cc.SpriteFrame(this.shadowTexture);
        }
        for (let s of this.shadowList) {
            if (!s.isValid || !s.enabled || !s.node.active) {
                s.stop();
            }
        }
        this.shadowList = [];
        if (isFromSave) {
            for (let i = 0; i < count; i++) {
                if (this.data.ShadowList[i] && this.data.ShadowList[i] > 0) {
                    let shadow = cc.instantiate(this.shadowPrefab).getComponent(ShadowPlayer);
                    shadow.init(this, this.shadowSpriteframe, i, this.data.ShadowList[i]);
                    this.shadowList.push(shadow);
                }
            }
        } else {
            for (let i = 0; i < count; i++) {
                let shadow = cc.instantiate(this.shadowPrefab).getComponent(ShadowPlayer);
                shadow.init(this, this.shadowSpriteframe, i, lifeTime);
                this.shadowList.push(shadow);
            }
        }
    }
    private addSaveStatusList() {
        if (this.statusManager) {
            this.statusManager.addStatusListFromSave(this.data.StatusList);
        }
    }
    private initTalent() {
        let o = new TalentData();
        let p = new TalentData();
        o.valueCopy(Logic.talents[`talent10${this.data.AvatarData.organizationIndex}`]);
        p.valueCopy(Logic.talents[this.data.AvatarData.professionData.talent]);
        if (o.resName == this.data.OrganizationTalentData.resName) {
            o.valueCopy(this.data.OrganizationTalentData);
        }
        if (p.resName == this.data.ProfessionTalentData.resName) {
            p.valueCopy(this.data.ProfessionTalentData);
        }
        this.data.OrganizationTalentData.valueCopy(o);
        this.data.ProfessionTalentData.valueCopy(p);
        this.professionTalent = this.getComponent(ProfessionTalent);
        this.organizationTalent = this.getComponent(OrganizationTalent);
        this.scheduleOnce(() => {
            this.professionTalent.init(this.data.ProfessionTalentData);
            this.organizationTalent.init(this.data.OrganizationTalentData);
        }, 0.1)
    }

    actorName(): string {
        return 'Player';
    }
    /**
     * 
     * @param isStone 是否是石头
     * @param stoneLevel 石头等级：0：全身，1：身子和脚，2：脚 
     */
    private turnStone(isStone: boolean, stoneLevel?: number) {
        this.avatar.hitLight(isStone);
    }
    private updateFistCombo() {
        if (!this.weaponRight.meleeWeapon.IsFist) {
            this.fistCombo = MeleeWeapon.COMBO1;
            return;
        }
        if (this.fistCombo == MeleeWeapon.COMBO1) {
            this.fistCombo = MeleeWeapon.COMBO2;
        } else if (this.fistCombo == MeleeWeapon.COMBO2) {
            this.fistCombo = MeleeWeapon.COMBO3;
        } else if (this.fistCombo == MeleeWeapon.COMBO3) {
            this.fistCombo = MeleeWeapon.COMBO1;
        } else {
            this.fistCombo = MeleeWeapon.COMBO1;
        }
        if (!this.weaponLeft.meleeWeapon.IsComboing && !this.weaponRight.meleeWeapon.IsComboing) {
            this.fistCombo = MeleeWeapon.COMBO1;
        }
    }
    takeDizz(dizzDuration: number): void {
        if (dizzDuration > 0 && !this.sc.isJumping) {
            this.sc.isDizzing = true;
            this.entity.Move.linearVelocity = cc.Vec2.ZERO;
            this.playerAnim(PlayerAvatar.STATE_IDLE, this.currentDir);
            this.scheduleOnce(() => {
                this.sc.isDizzing = false;
            }, dizzDuration)
        }
    }
    hideSelf(hideDuration: number) {
        if (hideDuration > 0) {
            this.invisible = true;
            this.scheduleOnce(() => {
                this.stopHiding();
            }, hideDuration)
        }
    }
    stopHiding() {
        this.invisible = false;
        this.statusManager.stopStatus(StatusManager.TALENT_INVISIBLE);
    }
    public updateStatus(statusList: StatusData[], totalStatusData: StatusData) {
        if (!this.inventoryManager) {
            return;
        }
        this.data.StatusTotalData.valueCopy(totalStatusData);
        this.data.StatusList = statusList;
        this.updateInfoUi();
    }
    getWalkSmoke(parentNode: cc.Node, pos: cc.Vec3) {
        let smokePrefab: cc.Node = null;
        if (this.smokePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            smokePrefab = this.smokePool.get();
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!smokePrefab || smokePrefab.active) {
            smokePrefab = cc.instantiate(this.walksmoke);
        }
        smokePrefab.parent = parentNode;
        smokePrefab.position = pos;
        smokePrefab.zIndex = IndexZ.ACTOR;
        smokePrefab.opacity = 255;
        smokePrefab.active = true;
    }

    destroySmoke(smokeNode: cc.Node) {
        if (!smokeNode) {
            return;
        }
        smokeNode.active = false;
        if (this.smokePool) {
            this.smokePool.put(smokeNode);
        }
    }

    public changeEquipment(equipData: EquipmentData, spriteFrame: cc.SpriteFrame) {
        let inventoryEquip = this.inventoryManager.equips[equipData.equipmetType];
        switch (equipData.equipmetType) {
            case InventoryManager.WEAPON:
                this.weaponRight.meleeWeapon.changeEquipment(equipData, spriteFrame, this.inventoryManager);
                break;
            case InventoryManager.REMOTE:
                this.weaponLeft.shooter.data = equipData.clone();
                this.weaponLeft.shooter.changeRes(this.weaponLeft.shooter.data.img);
                let c = cc.color(255, 255, 255).fromHEX(this.weaponLeft.shooter.data.color);
                this.weaponLeft.shooter.changeResColor(c);
                this.shield.data = new EquipmentData();
                this.updateEquipment(this.shield.sprite, this.inventoryManager.equips[InventoryManager.SHIELD].color
                    , Logic.spriteFrameRes(InventoryManager.EMPTY), this.shield.data.isHeavy == 1 ? 80 : 64);
                EventHelper.emit(EventHelper.HUD_CHANGE_CONTROLLER_SHIELD, { isShield: false });
                break;
            case InventoryManager.SHIELD:
                this.shield.data = equipData.clone();
                this.shield.node.color = cc.Color.WHITE.fromHEX(inventoryEquip.color);
                this.updateEquipment(this.shield.sprite, inventoryEquip.color
                    , spriteFrame, this.shield.data.isHeavy == 1 ? 80 : 64);

                this.weaponLeft.shooter.data = new EquipmentData();
                this.weaponLeft.shooter.changeRes(this.weaponLeft.shooter.data.img);
                EventHelper.emit(EventHelper.HUD_CHANGE_CONTROLLER_SHIELD, { isShield: true });
                break;
            case InventoryManager.HELMET:
                this.avatar.hairSprite.node.opacity = inventoryEquip.hideHair == 1 ? 0 : 255;
                this.updateEquipment(this.avatar.helmetSprite, inventoryEquip.color, spriteFrame);
                break;
            case InventoryManager.CLOTHES:
                this.updateEquipment(this.avatar.clothesSprite, inventoryEquip.color, spriteFrame);
                break;
            case InventoryManager.TROUSERS:
                let isLong = inventoryEquip.trouserslong == 1;
                this.avatar.changeLegColor(isLong, inventoryEquip.color);
                this.updateEquipment(this.avatar.pantsSprite, inventoryEquip.color, spriteFrame);
                break;
            case InventoryManager.GLOVES:
                this.updateEquipment(this.weaponRight.meleeWeapon.GlovesSprite, inventoryEquip.color, spriteFrame);
                this.updateEquipment(this.weaponLeft.meleeWeapon.GlovesSprite, inventoryEquip.color, spriteFrame);
                this.updateEquipment(this.avatar.glovesLeftSprite, inventoryEquip.color, spriteFrame);
                this.updateEquipment(this.avatar.glovesRightSprite, inventoryEquip.color, spriteFrame);
                break;
            case InventoryManager.SHOES:
                this.updateEquipment(this.avatar.shoesLeftSprite, inventoryEquip.color, spriteFrame);
                this.updateEquipment(this.avatar.shoesRightSprite, inventoryEquip.color, spriteFrame);
                break;
            case InventoryManager.CLOAK:
                this.updateEquipment(this.avatar.cloakSprite, inventoryEquip.color, spriteFrame);
                break;
        }
        this.avatar.changeEquipDirSpriteFrame(this.inventoryManager, this.currentDir);
        this.shield.changeZIndexByDir(this.avatar.node.zIndex, this.currentDir, this.isFaceRight);
        this.updateInfoUi();
    }
    private updateEquipment(sprite: cc.Sprite, color: string, spriteFrame: cc.SpriteFrame, size?: number): void {
        sprite.spriteFrame = spriteFrame;
        if (size && size > 0) {
            sprite.node.width = size;
            sprite.node.height = size;
        }
        let c = cc.color(255, 255, 255).fromHEX(color);
        sprite.node.color = c;
    }
    private updateInfoUi() {
        let health = this.data.getHealth();
        let dream = this.data.getDream();
        EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_HEALTHBAR, { x: health.x, y: health.y });
        EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_DREAMBAR, { x: dream.x, y: dream.y });
        this.data.EquipmentTotalData.valueCopy(this.inventoryManager.getTotalEquipData());
        cc.director.emit(EventHelper.HUD_UPDATE_PLAYER_INFODIALOG, { detail: { data: this.data } });
    }
    /**获取中心位置 */
    getCenterPosition(): cc.Vec3 {
        return this.entity.Transform.position.clone().addSelf(cc.v3(0, 32 * this.node.scaleY));
    }
    updatePlayerPos() {
        this.entity.Transform.position = Dungeon.getPosInMap(this.pos);
        this.node.position = this.entity.Transform.position.clone();
    }
    transportPlayer(pos: cc.Vec3) {
        if (!this.avatar.spriteNode) {
            return;
        }
        this.avatar.spriteNode.angle = 0;
        this.avatar.spriteNode.scale = 5;
        this.avatar.spriteNode.opacity = 255;
        this.avatar.spriteNode.x = 0;
        this.avatar.spriteNode.y = 0;
        this.pos = pos;
        this.changeZIndex(this.pos);
        this.updatePlayerPos();
    }
    changeZIndex(pos: cc.Vec3) {
        this.node.zIndex = IndexZ.getActorZIndex(this.entity.Transform.position);
    }
    addStatus(statusType: string, from: FromData, isFromSave?: boolean) {
        if (!this.node || this.sc.isDied) {
            return;
        }
        this.statusManager.addStatus(statusType, from);
    }
    addCustomStatus(data: StatusData, from: FromData) {
        if (!this.node || this.sc.isDied) {
            return;
        }
        this.statusManager.addCustomStatus(data, from);
    }
    get IsVariation() {
        return this.data.StatusTotalData.variation > 0;
    }
    stopAllDebuffs() {
        if (!this.node) {
            return;
        }
        this.statusManager.stopAllDebuffs();
    }
    get isInteractBuildingAniming() {
        return this.interactBuilding
            && this.interactBuilding.isTaken && this.interactBuilding.isAniming;
    }
    meleeAttack() {
        if (!this.weaponRight || this.sc.isDizzing || this.sc.isDied || this.sc.isFalling || this.sc.isJumping
            || this.isInteractBuildingAniming
            || (this.weaponLeft.meleeWeapon.IsAttacking && this.weaponLeft.meleeWeapon.IsFist)
            || (this.weaponRight.meleeWeapon.IsAttacking && this.weaponRight.meleeWeapon.IsFist)
            || this.shield.isDefendOrParrying) {
            return;
        }
        this.updateFistCombo();
        let isAttackDo = false;
        if (this.fistCombo == MeleeWeapon.COMBO1) {
            isAttackDo = this.weaponRight.meleeWeapon.attack(this.data, this.fistCombo);
            this.weaponLeft.meleeWeapon.attackIdle(false);
            if (isAttackDo) {
                for (let s of this.shadowList) {
                    s.attack(this.data, this.fistCombo, this.weaponRight.meleeWeapon.Hv, false);
                }
            }
        } else if (this.fistCombo == MeleeWeapon.COMBO2) {
            this.weaponRight.meleeWeapon.attackIdle(true);
            isAttackDo = this.weaponLeft.meleeWeapon.attack(this.data, this.fistCombo);
            if (isAttackDo) {
                for (let s of this.shadowList) {
                    s.attack(this.data, this.fistCombo, this.weaponLeft.meleeWeapon.Hv, true);
                }
            }
        } else if (this.fistCombo == MeleeWeapon.COMBO3) {
            isAttackDo = this.weaponRight.meleeWeapon.attack(this.data, this.fistCombo);
            this.weaponRight.meleeWeapon.DashTime(400);
            if (isAttackDo) {
                for (let s of this.shadowList) {
                    s.attack(this.data, this.fistCombo, this.weaponRight.meleeWeapon.Hv, false);
                }
            }
            this.scheduleOnce(() => {
                let isDo = this.weaponLeft.meleeWeapon.attack(this.data, this.fistCombo);
                if (isDo) {
                    for (let s of this.shadowList) {
                        s.attack(this.data, this.fistCombo, this.weaponLeft.meleeWeapon.Hv, true);
                    }
                }

            }, 0.15);
        }
        if (isAttackDo) {
            let pos = this.weaponRight.meleeWeapon.Hv.clone();
            if (!this.shield.isAniming && !this.shield.isDefendOrParrying) {
                let facetemp = this.isFaceRight;
                this.isFaceRight = pos.x > 0;
                if (facetemp != this.isFaceRight) {
                    this.shield.faceRightChange(this.isFaceRight);
                }
            }
            this.isFaceUp = pos.y > 0;
            this.playerAnim(PlayerAvatar.STATE_ATTACK, this.currentDir);
            this.stopHiding();
        }

    }
    useShield() {
        if (!this.weaponRight || this.sc.isDizzing || this.sc.isDied || this.sc.isFalling || this.sc.isJumping
            || this.weaponRight.meleeWeapon.IsAttacking
            || this.weaponLeft.meleeWeapon.IsAttacking
            || this.isInteractBuildingAniming) {
            return;
        }
        if (this.shield.Status == Shield.STATUS_PARRY || this.shield.Status == Shield.STATUS_PUTDOWN) {
            return;
        }
    }
    useInteractBuilding(isMelee: boolean) {
        if (!this.interactBuilding) {
            return false;
        }
        if (!this.interactBuilding.isTaken) {
            return false;
        }
        if (!this.interactBuilding.isAniming) {
            this.stopHiding();
            this.playerAnim(PlayerAvatar.STATE_ATTACK, this.currentDir);
            return this.interactBuilding.interact(this, false, isMelee, !isMelee);
        }
        return true;
    }
    remoteAttack() {
        if (!this.data || this.sc.isDizzing || this.sc.isDied || this.sc.isFalling
            || !this.weaponLeft.shooter || this.sc.isJumping) {
            return;
        }
        let arcEx = 0;
        let lineEx = 0;
        if (this.professionTalent.hashTalent(Talent.TALENT_005) && this.professionTalent.IsExcuting) {
            arcEx = 2;
            lineEx = 1;
        }
        this.weaponLeft.shooter.data.bulletSize = this.IsVariation ? 0.5 : 0;
        let fireSuccess = this.weaponLeft.remoteAttack(this.data, this.remoteCooldown, arcEx, lineEx);
        if (fireSuccess) {
            for (let s of this.shadowList) {
                s.remoteAttack(true, this.weaponLeft.shooter.data, this.weaponLeft.shooter.Hv, this.data.getFinalRemoteDamage(), arcEx, lineEx);
            }
            this.stopHiding();
        }
    }
    //特效攻击
    remoteExAttack(comboType: number): void {
        for (let key in this.inventoryManager.equips) {
            let data = this.inventoryManager.equips[key];
            this.remoteExAttackDo(data, comboType);
        }
        for (let key in this.inventoryManager.suitMap) {
            let suit = this.inventoryManager.suitMap[key];
            if (suit) {
                for (let i = 0; i < suit.count - 1; i++) {
                    if (i < suit.EquipList.length) {
                        this.remoteExAttackDo(suit.EquipList[i], comboType);
                    }
                }
            }
        }
    }
    private remoteExAttackDo(data: EquipmentData, comboType: number) {
        let canShoot = false;
        if (comboType == MeleeWeapon.COMBO1 && data.exBulletCombo1 > 0) {
            canShoot = true;
        }
        if (comboType == MeleeWeapon.COMBO2 && data.exBulletCombo2 > 0) {
            canShoot = true;
        }
        if (comboType == MeleeWeapon.COMBO3 && data.exBulletCombo3 > 0) {
            canShoot = true;
        }
        if (canShoot && data.exBulletTypeAttack.length > 0 && Random.getRandomNum(0, 100) < data.exBulletRate) {
            this.shooterEx.data.bulletType = data.exBulletTypeAttack;
            this.shooterEx.data.bulletArcExNum = data.bulletArcExNum;
            this.shooterEx.data.bulletLineExNum = data.bulletLineExNum;
            this.shooterEx.data.bulletSize = data.bulletSize;
            this.shooterEx.data.bulletSize += this.IsVariation ? 0.5 : 0;
            this.shooterEx.fireBullet(0, cc.v3(data.exBulletOffsetX, 24));
            for (let s of this.shadowList) {
                if (s.node) {
                    s.shooterEx.setHv(this.shooterEx.Hv);
                    s.shooterEx.data = this.shooterEx.data.clone();
                    s.shooterEx.fireBullet(0, cc.v3(data.exBulletOffsetX, 24));
                }
            }
        }
    }
    //特效受击
    private remoteOrStatusExHurt(blockLevel: number, from: FromData, actor: Actor): void {
        for (let key in this.inventoryManager.equips) {
            let data = this.inventoryManager.equips[key];
            this.remoteOrStatusExHurtDo(data, blockLevel, from, actor);
        }
        for (let key in this.inventoryManager.suitMap) {
            let suit = this.inventoryManager.suitMap[key];
            if (suit) {
                for (let i = 0; i < suit.count - 1; i++) {
                    if (i < suit.EquipList.length) {
                        this.remoteOrStatusExHurtDo(suit.EquipList[i], blockLevel, from, actor);
                    }
                }
            }
        }
    }
    private remoteOrStatusExHurtDo(data: EquipmentData, blockLevel: number, from: FromData, actor: Actor) {
        let needFire = false;
        if (data.exBulletTypeHurt.length > 0 && Random.getRandomNum(0, 100) < data.exBulletRate) {
            needFire = true;
            this.shooterEx.data.bulletType = data.exBulletTypeHurt;
        }
        if (blockLevel == Shield.BLOCK_PARRY && data.exBulletTypeParry.length > 0
            && Random.getRandomNum(0, 100) < data.exBulletRate) {
            needFire = true;
            this.shooterEx.data.bulletType = data.exBulletTypeParry;
        }
        if (blockLevel == Shield.BLOCK_NORMAL && data.exBulletTypeBlock.length > 0
            && Random.getRandomNum(0, 100) < data.exBulletRate) {
            needFire = true;
            this.shooterEx.data.bulletType = data.exBulletTypeBlock;
        }
        if (needFire) {
            this.shooterEx.data.bulletArcExNum = data.bulletArcExNum;
            this.shooterEx.data.bulletLineExNum = data.bulletLineExNum;
            this.shooterEx.data.bulletSize = data.bulletSize;
            this.shooterEx.fireBullet(0);
            for (let s of this.shadowList) {
                if (s.node) {
                    s.shooterEx.setHv(this.shooterEx.Hv);
                    s.shooterEx.data = this.shooterEx.data.clone();
                    s.shooterEx.fireBullet(0);
                }
            }
        }
        if (actor && data.statusNameHurtOther.length > 0 && data.statusRateHurt > Logic.getRandomNum(0, 100)) {
            actor.addStatus(data.statusNameHurtOther, new FromData());
        }
        if (data.statusNameHurtSelf.length > 0 && data.statusRateHurt > Logic.getRandomNum(0, 100)) {
            this.addStatus(data.statusNameHurtSelf, new FromData());
        }
    }


    move(dir: number, pos: cc.Vec3, dt: number) {
        if (this.sc.isDied || this.sc.isFalling || this.sc.isDizzing || !this.sc.isShow) {
            return;
        }

        if (this.weaponRight.meleeWeapon.IsAttacking && !pos.equals(cc.Vec3.ZERO)) {
            pos = pos.mul(this.weaponRight.meleeWeapon.getMeleeSlowRatio());
        }
        if (this.weaponLeft.meleeWeapon.IsAttacking && !pos.equals(cc.Vec3.ZERO)) {
            pos = pos.mul(this.weaponLeft.meleeWeapon.getMeleeSlowRatio());
        }
        if (this.weaponLeft.isHeavyRemotoAttacking && !pos.equals(cc.Vec3.ZERO)) {
            pos = pos.mul(0.01);
        }
        if (this.shield.data.isHeavy == 1 && this.shield.Status > Shield.STATUS_IDLE) {
            pos = pos.mul(0.5);
        }
        if (this.interactBuilding && this.interactBuilding.isTaken) {
            pos = pos.mul(0.5);
        }
        if (this.professionTalent.IsExcuting && this.professionTalent.hashTalent(Talent.TALENT_007) && !pos.equals(cc.Vec3.ZERO)) {
            pos = pos.mul(0.01);
        }
        if(this.isLevelWater && !this.sc.isJumping){
            pos = pos.mul(0.5);
        }

        if (!pos.equals(cc.Vec3.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.entity.Transform.position);
            this.data.pos = this.pos.clone();
        }
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.shooterEx.setHv(cc.v3(pos.x, pos.y));
            this.weaponLeft.shooter.setHv(cc.v3(pos.x, pos.y));
            this.weaponRight.shooter.setHv(cc.v3(pos.x, pos.y));
        }
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);

        let mul = absh > absv ? absh : absv;
        mul = mul == 0 ? 1 : mul;
        let movement = cc.v2(h, v);
        let speed = this.data.getMoveSpeed();
        if (speed < 0) {
            speed = 0;
        }
        movement = movement.mul(speed);
        this.entity.Move.linearVelocity = movement;
        this.sc.isMoving = h != 0 || v != 0;
        //调整武器方向
        if (this.weaponRight.meleeWeapon && !pos.equals(cc.Vec3.ZERO) && !this.weaponRight.meleeWeapon.IsAttacking) {
            this.weaponRight.meleeWeapon.Hv = cc.v3(pos.x, pos.y);
        }
        if (this.weaponLeft.meleeWeapon && !pos.equals(cc.Vec3.ZERO) && !this.weaponLeft.meleeWeapon.IsAttacking) {
            this.weaponLeft.meleeWeapon.Hv = cc.v3(pos.x, pos.y);
        }
        if (this.sc.isMoving && !this.weaponLeft.meleeWeapon.IsAttacking && !this.weaponRight.meleeWeapon.IsAttacking) {
            if (!this.shield.isAniming && !this.shield.isDefendOrParrying) {
                this.isFaceRight = this.weaponLeft.meleeWeapon.Hv.x > 0;
                let facetemp = this.isFaceRight;
                if (facetemp != this.isFaceRight) {
                    this.shield.faceRightChange(this.isFaceRight);
                }
            }
            this.isFaceUp = this.weaponLeft.meleeWeapon.Hv.y > 0;
        }

        if (!this.sc.isJumping) {
            if (this.sc.isMoving && !this.isStone) {
                this.playerAnim(PlayerAvatar.STATE_WALK, dir);
            } else {
                this.playerAnim(PlayerAvatar.STATE_IDLE, dir);
            }
        }
        if (dir != 4) {
            this.changeZIndex(this.pos);
        }
        if (dir != 4 && !this.shield.isAniming && !this.shield.isDefendOrParrying) {
            this.currentDir = dir;
            if (dir == PlayerAvatar.DIR_DOWN && this.isFaceUp) {
                dir = PlayerAvatar.DIR_UP;
            } else if (dir == PlayerAvatar.DIR_UP && !this.isFaceUp) {
                dir = PlayerAvatar.DIR_DOWN;
            }
            this.weaponLeft.changeZIndexByDir(this.avatar.node.zIndex, dir);
            this.weaponRight.changeZIndexByDir(this.avatar.node.zIndex, dir);
            this.avatar.changeEquipDirSpriteFrame(this.inventoryManager, dir);
            this.shield.changeZIndexByDir(this.avatar.node.zIndex, dir, this.isFaceRight);
            this.avatar.changeAvatarByDir(dir);
        }
    }

    playerAnim(status: number, dir: number): void {
        if (status == PlayerAvatar.STATE_IDLE && this.avatar.status != PlayerAvatar.STATE_IDLE) {
            this.weaponLeft.shooter.playWalk(false);
            this.weaponRight.shooter.playWalk(false);
        }
        switch (status) {
            case PlayerAvatar.STATE_IDLE:
                if (this.avatar.status != PlayerAvatar.STATE_IDLE) {
                    this.weaponLeft.shooter.playWalk(false);
                    this.weaponRight.shooter.playWalk(false);
                }
                break;
            case PlayerAvatar.STATE_WALK:
                if (this.avatar.status != PlayerAvatar.STATE_ATTACK) {
                    this.weaponLeft.shooter.playWalk(true);
                    this.weaponRight.shooter.playWalk(true);
                }
                break;
            case PlayerAvatar.STATE_ATTACK:
                this.weaponLeft.shooter.playWalk(true);
                this.weaponRight.shooter.playWalk(true);
                break;
            case PlayerAvatar.STATE_FALL: break;
            case PlayerAvatar.STATE_DIE:
                break;
        }
        this.avatar.playAnim(status, dir);
    }

    start() {
        if (!this.node) {
            return;
        }
        this.changeZIndex(this.pos);
        this.updateInfoUi();
    }
    fall() {
        if (this.sc.isFalling || this.sc.isJumping) {
            return;
        }
        this.sc.isFalling = true;
        this.avatar.playAnim(PlayerAvatar.STATE_FALL, this.currentDir);
        this.scheduleOnce(() => {
            this.transportPlayer(this.defaultPos);
            this.playerAnim(PlayerAvatar.STATE_IDLE, 1);
            let dd = new DamageData();
            dd.realDamage = 1;
            this.takeDamage(dd, FromData.getClone('跌落', ''));
            this.sc.isFalling = false;
        }, 2);
    }
    get CanJump() {
        if (this.sc.isDied || this.sc.isFalling || this.sc.isDizzing || !this.sc.isShow || this.sc.isJumping
            || this.weaponRight.meleeWeapon.IsAttacking
            || this.weaponLeft.meleeWeapon.IsAttacking
            || this.isInteractBuildingAniming) {
            return false;
        }
        return true;
    }
    jump() {
        if (!this.CanJump) {
            return;
        }
        this.sc.isJumping = true;
        this.scheduleOnce(() => {
            this.weaponLeft.node.opacity = 0; this.weaponRight.node.opacity = 0;
            this.shield.node.opacity = 0;
        }, 0.1);
        this.avatar.playAnim(PlayerAvatar.STATE_JUMP, this.currentDir);
        this.scheduleOnce(() => {
            this.avatar.playAnim(PlayerAvatar.STATE_IDLE, this.currentDir);
            this.sc.isJumping = false;
            this.weaponLeft.node.opacity = 255; this.weaponRight.node.opacity = 255;
            this.shield.node.opacity = 255;

        }, 1.3);
    }
    /**
     * 挨打
     * @param damageData 伤害
     * @param from 来源信息
     * @param actor 来源单位(目前只有monster和boss)
     */
    takeDamage(damageData: DamageData, from?: FromData, actor?: Actor): boolean {
        if (!this.data || this.sc.isJumping || this.sc.isDied) {
            return false;
        }
        //盾牌
        let blockLevel = this.shield.blockDamage(this, damageData, actor);
        let dd = this.data.getDamage(damageData, blockLevel);
        let dodge = this.data.FinalCommon.dodge / 100;
        let isDodge = Random.rand() <= dodge && dd.getTotalDamage() > 0;
        //无敌冲刺
        if (this.professionTalent.hashTalent(Talent.TALENT_015) && this.professionTalent.IsExcuting && dd.getTotalDamage() > 0) {
            isDodge = true;
        }
        //幽光护盾
        let isBlock = false;
        if (this.organizationTalent.takeDamage(dd, actor)) {
            dd = new DamageData();
            isBlock = true;
        }
        // let isIceTaken = false;
        // if (dd.getTotalDamage() > 0) {
        //     isIceTaken = this.talentMagic.takeIce();
        // }
        // if (isIceTaken) {
        //     isDodge = true;
        // }
        dd = isDodge ? new DamageData() : dd;
        let health = this.data.getHealth();
        let totalD = dd.getTotalDamage();
        if (totalD > 0 && this.data.AvatarData.organizationIndex == AvatarData.GURAD) {
            totalD = this.updateDream(totalD);
        }
        // if (totalD > 0 &&
        //     (this.data.AvatarData.organizationIndex == AvatarData.HUNTER
        //         || this.data.AvatarData.organizationIndex == AvatarData.TECH)
        //     || this.data.AvatarData.organizationIndex == AvatarData.FOLLOWER) {
        //     this.updateDream(1);
        // }
        health.x -= totalD;
        if (health.x > health.y) {
            health.x = health.y;
        }
        this.data.currentHealth = health.x;
        let isAvoidDeath = false;
        if (this.data.currentHealth <= 0) {
            if (!this.isAvoidDeathed && this.data.StatusTotalData.avoidDeath > 0) {
                this.isAvoidDeathed = true;
                isAvoidDeath = true;
                this.data.currentHealth = 0;
            } else {
                this.killed(from);
            }
        }
        EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_HEALTHBAR, { x: health.x, y: health.y });
        this.showFloatFont(this.node.parent, dd.getTotalDamage(), isDodge, false, false, isBlock, isAvoidDeath);
        let valid = !isDodge && dd.getTotalDamage() > 0 && blockLevel != Shield.BLOCK_PARRY;
        if (valid || blockLevel == Shield.BLOCK_PARRY) {
            this.showDamageEffect(blockLevel, from, actor);
        }
        return valid;
    }
    public updateDream(offset: number): number {
        let dream = this.data.getDream();
        dream.x -= offset;
        let overflow = -dream.x;
        if (dream.x > dream.y) {
            dream.x = dream.y;
        }
        if (dream.x < 0) {
            dream.x = 0;
        }
        this.data.currentDream = dream.x;
        EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_DREAMBAR, { x: dream.x, y: dream.y });
        return overflow < 0 ? 0 : overflow;
    }
    private showDamageEffect(blockLevel: number, from: FromData, actor: Actor) {
        this.remoteOrStatusExHurt(blockLevel, from, actor);
        cc.director.emit(EventHelper.CAMERA_SHAKE, { detail: { isHeavyShaking: false } });
        if (blockLevel == Shield.BLOCK_NORMAL) {
            AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_HIT);
            cc.director.emit(EventHelper.HUD_DAMAGE_CORNER_SHOW);
        } else if (blockLevel == Shield.BLOCK_PARRY) {
            AudioPlayer.play(AudioPlayer.MELEE_PARRY);
        } else {
            AudioPlayer.play(AudioPlayer.PLAYER_HIT);
            cc.director.emit(EventHelper.HUD_DAMAGE_CORNER_SHOW);
        }
    }

    showFloatFont(dungeonNode: cc.Node, d: number, isDodge: boolean, isMiss: boolean, isCritical: boolean, isBlock: boolean, isAvoidDeath: boolean) {
        if (!this.floatinglabelManager) {
            return;
        }
        let flabel = this.floatinglabelManager.getFloaingLabel(dungeonNode);
        if (isDodge) {
            flabel.showDoge();
        } else if (isMiss) {
            flabel.showMiss();
        } else if (isBlock) {
            flabel.showBlock();
        } else if (isAvoidDeath) {
            flabel.showAvoidDeath();
        } else if (d != 0 && d) {
            flabel.showDamage(-d, isCritical);
        } else {
            flabel.hideLabel();
        }
    }
    killed(from?: FromData) {
        if (this.sc.isDied) {
            return;
        }
        this.sc.isDied = true;
        this.avatar.playAnim(PlayerAvatar.STATE_DIE, this.currentDir);
        EventHelper.emit(EventHelper.HUD_STOP_COUNTTIME);
        this.scheduleOnce(() => {
            EventHelper.emit(EventHelper.HUD_FADE_OUT);
        }, 1.5)
        AudioPlayer.play(AudioPlayer.DIE);
        EventHelper.emit(EventHelper.HUD_LOSE_OILGOLD);
        EventHelper.emit(EventHelper.DUNGEON_DISAPPEAR);
        EventHelper.emit(EventHelper.HUD_OILGOLD_LOSE_SHOW);
        Achievement.addPlayerDiedLifesAchievement();
        this.weaponLeft.node.opacity = 0;
        this.weaponRight.node.opacity = 0;
        Logic.dieFrom.valueCopy(from);
        Logic.setKillPlayerCounts(from, true);
        Logic.saveData();
        this.scheduleOnce(() => {
            cc.audioEngine.stopMusic();
            cc.director.loadScene('gameover');
        }, 3);
        this.dungeon.darkAfterKill();
    }
    //玩家行动
    playerAction(dir: number, pos: cc.Vec3, dt: number, dungeon: Dungeon) {
        this.dungeon = dungeon;
        if (this.weaponLeft.meleeWeapon && !this.weaponLeft.meleeWeapon.dungeon) {
            this.weaponLeft.meleeWeapon.dungeon = dungeon;
            this.weaponLeft.shooter.dungeon = dungeon;
            this.weaponRight.meleeWeapon.dungeon = dungeon;
            this.weaponRight.shooter.dungeon = dungeon;
            this.shooterEx.dungeon = dungeon;
        }
        for (let s of this.shadowList) {
            if (s.node && !s.weaponLeft.shadowWeapon.dungeon) {
                s.weaponLeft.shadowWeapon.dungeon = dungeon;
                s.weaponLeft.shooter.dungeon = dungeon;
                s.weaponRight.shadowWeapon.dungeon = dungeon;
                s.weaponRight.shooter.dungeon = dungeon;
                s.shooterEx.dungeon = dungeon;
            }
        }
        if (!this.sc.isShow) {
            return;
        }
        let isDashing = this.professionTalent.hashTalent(Talent.TALENT_015) && this.professionTalent.IsExcuting;

        if (this.professionTalent && !isDashing && !this.isWeaponDashing) {
            this.move(dir, pos, dt);
        }
    }

    smokeTimeDelay = 0;
    isSmokeTimeDelay(dt: number): boolean {
        this.smokeTimeDelay += dt;
        if (this.smokeTimeDelay > 0.3) {
            this.smokeTimeDelay = 0;
            return true;
        }
        return false;
    }
    dreamTimeDelay = 0;
    dreamLongTimeDelay = 0;
    dreamShortTimeDelay = 0;
    isDreamTimeDelay(dt: number): boolean {
        this.dreamTimeDelay += dt;
        if (this.dreamTimeDelay > 5) {
            this.dreamTimeDelay = 0;
            return true;
        }
        return false;
    }
    isDreamShortTimeDelay(dt: number): boolean {
        this.dreamShortTimeDelay += dt;
        if (this.dreamShortTimeDelay > 1) {
            this.dreamShortTimeDelay = 0;
            return true;
        }
        return false;
    }
    isDreamLongTimeDelay(dt: number): boolean {
        this.dreamLongTimeDelay += dt;
        if (this.dreamLongTimeDelay > 20) {
            this.dreamLongTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt) {
        if (Logic.isGamePause) {
            return;
        }
        if (this.isSmokeTimeDelay(dt) && this.sc.isMoving && !this.sc.isJumping) {
            this.getWalkSmoke(this.node.parent, this.entity.Transform.position);
        }
        if (this.isDreamLongTimeDelay(dt)) {
            this.updateDream(-1);
        }
        if (this.dungeon && this.dungeon.isClear && this.isDreamShortTimeDelay(dt)) {
            if (this.data.AvatarData.organizationIndex == AvatarData.FOLLOWER) {
                this.updateDream(-1);
            }
        }
        if (this.isDreamTimeDelay(dt)) {
            if (this.data.AvatarData.organizationIndex == AvatarData.TECH) {
                this.updateDream(1);
            }
        }

        let stone = this.isStone;
        this.isStone = this.statusManager.hasStatus(StatusManager.STONE);
        if (stone == !this.isStone) {
            this.turnStone(this.isStone);
        }
        this.node.scaleX = this.getScaleSize();
        this.avatar.node.scaleX = this.isFaceRight ? 1 : -1;
        this.node.scaleY = this.getScaleSize();
        this.node.opacity = this.invisible ? 80 : 255;

        let showHands = this.interactBuilding && this.interactBuilding.isTaken && !this.interactBuilding.isThrowing;
        let isLift = this.interactBuilding && this.interactBuilding.isTaken && this.interactBuilding.isLift;
        if (this.weaponLeft) {
            this.weaponLeft.updateLogic(dt);
            this.weaponLeft.meleeWeapon.setHandAndWeaponInVisible(showHands);
        }
        if (this.weaponRight) {
            this.weaponRight.updateLogic(dt);
            this.weaponRight.meleeWeapon.setHandAndWeaponInVisible(showHands);
        }
        if (this.avatar) {
            this.avatar.showHandsWithInteract(showHands, isLift && !this.interactBuilding.isAttacking);
            this.avatar.showLegsWithWater(this.isLevelWater && !this.sc.isJumping);
        }
        this.showUiButton();
        for (let s of this.shadowList) {
            if (s.node) {
                s.updateLogic(dt);
            }
        }
    }
    getScaleSize(): number {
        let sn = this.IsVariation ? 1.5 : 1;
        return sn;
    }
    private useSkill(): void {
        if (this.professionTalent && !this.sc.isJumping && !this.sc.isAttacking) {
            this.professionTalent.useSKill();
        }
    }
    private useSkill1(): void {
        if (this.organizationTalent && !this.sc.isJumping && !this.sc.isAttacking) {
            this.organizationTalent.useSKill();
        }
    }

    triggerThings(isLongPress: boolean) {
        if (this.sc.isJumping || !this.dungeon) {
            return;
        }
        if (this.dungeon.equipmentManager.lastGroundEquip && this.dungeon.equipmentManager.lastGroundEquip.taken(isLongPress)) {
            this.dungeon.equipmentManager.lastGroundEquip = null;
        }
        if (this.dungeon.itemManager.lastGroundItem && this.dungeon.itemManager.lastGroundItem.taken(this, isLongPress)) {
            this.dungeon.itemManager.lastGroundItem = null;
        }
        if (this.interactBuilding && this.interactBuilding.isTaken) {
            this.interactBuilding.interact(this, isLongPress, false, false);
        } else if (this.dungeon.buildingManager.lastInteractBuilding && this.dungeon.buildingManager.lastInteractBuilding.taken(this, isLongPress)) {
            this.interactBuilding = this.dungeon.buildingManager.lastInteractBuilding;
            this.dungeon.buildingManager.lastInteractBuilding = null;
        }
        if (this.touchedTips) {
            this.touchedTips.next(isLongPress, this);
        }
    }
    private showUiButton() {
        if (!this.dungeon) {
            return;
        }
        if (this.dungeon.equipmentManager.lastGroundEquip || this.dungeon.itemManager.lastGroundItem
            || this.dungeon.buildingManager.lastInteractBuilding
            || (this.interactBuilding && this.interactBuilding.isTaken)
            || this.touchedTips) {
            EventHelper.emit(EventHelper.HUD_CONTROLLER_INTERACT_SHOW, { isShow: true });
        } else {
            EventHelper.emit(EventHelper.HUD_CONTROLLER_INTERACT_SHOW, { isShow: false });
        }
        if ((this.shield && this.shield.data.equipmetType == InventoryManager.SHIELD)
            || (this.interactBuilding && this.interactBuilding.isTaken)
            || this.weaponLeft.shooter.data.equipmetType == InventoryManager.REMOTE) {
            EventHelper.emit(EventHelper.HUD_CONTROLLER_REMOTE_SHOW, { isShow: true });
        } else {
            EventHelper.emit(EventHelper.HUD_CONTROLLER_REMOTE_SHOW, { isShow: false });
        }
    }
    onColliderEnter(other: CCollider, self: CCollider): void {
        if (self.tag == CCollider.TAG.PLAYER_INTERACT) {
            this.touchedTips = null;
        }
    }
    onColliderStay(other: CCollider, self: CCollider): void {
        if (self.tag == CCollider.TAG.PLAYER_INTERACT) {
            if (this.touchDelay) {
                return;
            }
            let isInteract = false;
            let equipment = other.node.getComponent(Equipment);
            if (equipment) {
                isInteract = true;
            }
            let item = other.node.getComponent(Item);
            if (item) {
                isInteract = true;
            }
            let tips = other.node.getComponent(Tips);
            if (tips) {
                isInteract = true;
                this.touchedTips = tips;
            }
            if (isInteract) {
                this.touchDelay = true;
                this.scheduleOnce(() => { this.touchDelay = false; }, 0.1);
            }
        }

    }
    onColliderExit(other: CCollider, self: CCollider): void {
        if (self.tag == CCollider.TAG.PLAYER_INTERACT) {
            this.touchedTips = null;

        }
    }
    onColliderPreSolve(other: CCollider, self: CCollider): void {
        if (other.tag == CCollider.TAG.NONPLAYER || other.tag == CCollider.TAG.GOODNONPLAYER) {
            self.disabledOnce = true;
        }
    }

    get Hv(): cc.Vec3 {
        return this.weaponRight.meleeWeapon.Hv;
    }
    useItem(data: ItemData) {
        Item.userIt(data, this);
    }

    setLinearVelocity(movement: cc.Vec2) {

    }

}