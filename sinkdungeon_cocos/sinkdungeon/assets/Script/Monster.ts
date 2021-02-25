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
import { EventHelper } from './EventHelper';
import HealthBar from './HealthBar';
import Logic from './Logic';
import MonsterData from './Data/MonsterData';
import Dungeon from './Dungeon';
import Shooter from './Shooter';
import StatusManager from './Manager/StatusManager';
import DamageData from './Data/DamageData';
import FloatinglabelManager from './Manager/FloatingLabelManager';
import Random from './Utils/Random';
import Skill from './Utils/Skill';
import Item from './Item/Item';
import Actor from './Base/Actor';
import Achievements from './Achievement';
import AudioPlayer from './Utils/AudioPlayer';
import SpecialManager from './Manager/SpecialManager';
import FromData from './Data/FromData';
import IndexZ from './Utils/IndexZ';
import AreaOfEffect from './Actor/AreaOfEffect';
import AreaOfEffectData from './Data/AreaOfEffectData';
import ActorAttackBox from './Actor/ActorAttackBox';

@ccclass
export default class Monster extends Actor {
    public static readonly RES_DISGUISE = 'disguise';//图片资源 伪装
    public static readonly RES_IDLE000 = 'anim000';//图片资源 等待0
    public static readonly RES_IDLE001 = 'anim001';//图片资源 等待1
    public static readonly RES_WALK00 = 'anim002';//图片资源 行走0
    public static readonly RES_WALK01 = 'anim003';//图片资源 行走1
    public static readonly RES_WALK02 = 'anim004';//图片资源 行走2
    public static readonly RES_WALK03 = 'anim005';//图片资源 行走3
    public static readonly RES_HIT001 = 'anim006';//图片资源 受击1
    public static readonly RES_HIT002 = 'anim007';//图片资源 受击2
    public static readonly RES_HIT003 = 'anim008';//图片资源 受击3
    public static readonly RES_ATTACK01 = 'anim009';//图片资源 准备攻击
    public static readonly RES_ATTACK02 = 'anim010';//图片资源 攻击
    public static readonly RES_ATTACK03 = 'anim011';//图片资源 准备特殊攻击
    public static readonly RES_ATTACK04 = 'anim012';//图片资源 特殊攻击



    static readonly SCALE_NUM = 1.5;
    static readonly ANIM_IDLE = 0;
    static readonly ANIM_WALK = 1;
    static readonly ANIM_ATTACK = 2;
    static readonly ANIM_HIT = 3;
    static readonly ANIM_DIED = 4;
    @property(cc.Vec3)
    pos: cc.Vec3 = cc.v3(0, 0);

    @property(HealthBar)
    healthBar: HealthBar = null;
    @property(StatusManager)
    statusManager: StatusManager = null;
    @property(FloatinglabelManager)
    floatinglabelManager: FloatinglabelManager = null;
    @property(SpecialManager)
    specialManager: SpecialManager = null;
    @property(cc.Prefab)
    boom: cc.Prefab = null;
    @property(ActorAttackBox)
    dangerBox: ActorAttackBox = null;
    @property(cc.Node)
    dangerTips: cc.Node = null;
    @property(cc.Prefab)
    attrPrefab: cc.Prefab = null;
    private attrNode: cc.Node;
    private sprite: cc.Node;
    private bodySprite: cc.Sprite;
    private shadow: cc.Node;
    private dashlight: cc.Node;
    private anim: cc.Animation;
    private boxCollider: cc.BoxCollider;
    rigidbody: cc.RigidBody;
    graphics: cc.Graphics;
    isFaceRight = true;
    isMoving = false;
    isFall = false;
    isDizz = false;
    private timeDelay = 0;
    data: MonsterData = new MonsterData();
    dungeon: Dungeon;
    shooter: Shooter = null;
    isHurt = false;//是否受到伤害
    // isDashing = false;//是否正在冲刺
    isDisguising = false;//是否正在伪装
    currentlinearVelocitySpeed: cc.Vec2 = cc.Vec2.ZERO;//当前最大速度
    isVariation: boolean = false;//是否变异

    particleBlood: cc.ParticleSystem;
    effectNode: cc.Node;

    moveSkill = new Skill();
    remoteSkill = new Skill();
    meleeSkill = new Skill();
    specialSkill = new Skill();
    dashSkill = new Skill();
    blinkSkill = new Skill();
    isAttackAnimExcuting = false;
    //躲避目标位置
    moveTarget: cc.Vec3 = cc.v3(0, 0);
    attrmap: { [key: string]: number } = {};
    mat: cc.MaterialVariant;
    animStatus = Monster.ANIM_IDLE;

    onLoad() {
        this.graphics = this.getComponent(cc.Graphics);
        this.meleeSkill.IsExcuting = false;
        this.isShow = false;
        this.isDied = false;
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
        this.bodySprite = this.sprite.getChildByName('body').getComponent(cc.Sprite);
        this.mat = this.bodySprite.getComponent(cc.Sprite).getMaterial(0);
        this.boxCollider = this.getComponent(cc.BoxCollider);
        if (this.isVariation) {
            let scaleNum = this.data.sizeType && this.data.sizeType > 0 ? this.data.sizeType : 1;
            this.node.scale = Monster.SCALE_NUM * scaleNum;
        }
        this.dashlight = this.sprite.getChildByName('dashlight');
        this.dashlight.opacity = 0;
        this.shadow = this.sprite.getChildByName('shadow');
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter);
        this.effectNode = this.node.getChildByName('Effect');
        this.particleBlood = this.node.getChildByName('Effect').getChildByName('blood').getComponent(cc.ParticleSystem);
        this.particleBlood.stopSystem();
        this.attrNode = this.node.getChildByName('attr');
        this.updatePlayerPos();
        this.playAnim(Monster.ANIM_IDLE);
        this.scheduleOnce(() => { this.isShow = true; }, 1);
        this.resetBodyColor();
        if (this.data.isHeavy > 0) {
            this.rigidbody.type = cc.RigidBodyType.Static;
        }
        this.dangerBox.init(this, this.dungeon,true);
        this.dangerTips.opacity = 0;
        this.specialSkill.delay(5);
        // this.graphics.strokeColor = cc.Color.ORANGE;
        // this.graphics.circle(0,0,100);
        // this.graphics.stroke();
        // this.graphics.strokeColor = cc.Color.RED;
        // this.graphics.circle(0,0,80);
        // this.graphics.stroke();
    }
    hitLight(isHit: boolean) {
        if (!this.mat) {
            this.mat = this.node.getChildByName('sprite').getChildByName('body')
                .getComponent(cc.Sprite).getMaterial(0);
        }
        this.mat.setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
    }
    addAttrIcon() {
        if (!this.attrNode) {
            this.attrNode = this.node.getChildByName('attr');
        }
        this.attrNode.removeAllChildren();
        for (let key in this.attrmap) {
            let attr = cc.instantiate(this.attrPrefab);
            attr.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes(key);
            this.attrNode.addChild(attr);
        }
    }
    showDangerTips() {
        this.dangerTips.opacity = 255;
        this.scheduleOnce(() => { this.dangerTips.opacity = 0; }, 1)
    }
    showCircle() {
        let r = 0;
        let call = () => {
            this.graphics.clear();
            this.graphics.fillColor = cc.color(255, 0, 0, 80);
            this.graphics.arc(0, 0, r, Math.PI / 2, Math.PI + Math.PI / 2);
            r += 2;
            this.graphics.fill();
            if (r > 80 * this.node.scaleY) {
                r = 80 * this.node.scaleY;
            }
            if (this.isHurt) {
                this.unschedule(call);
                this.graphics.clear();
            }
        }
        this.schedule(call, 0.016, 40);
    }
    getCurrentBodyRes(): string {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite');
            this.bodySprite = this.sprite.getChildByName('body').getComponent(cc.Sprite);
        }
        return this.bodySprite.spriteFrame.name;
    }
    changeBodyRes(resName: string, suffix?: string) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite');
            this.bodySprite = this.sprite.getChildByName('body').getComponent(cc.Sprite);
        }
        if (!this.boxCollider) {
            this.boxCollider = this.getComponent(cc.BoxCollider);
        }
        if (!this.shadow) {
            this.shadow = this.sprite.getChildByName('shadow');
        }
        let spriteFrame = this.getSpriteFrameByName(resName, suffix);
        if(spriteFrame){
            this.bodySprite.spriteFrame = spriteFrame;
        }else{
            this.bodySprite.spriteFrame = null;
        }
        this.bodySprite.node.width = spriteFrame.getRect().width;
        this.bodySprite.node.height = spriteFrame.getRect().height;
        let y = 48, w = 80, h = 80;
        switch (this.data.boxType) {
            case 0: y = 32; w = 80; h = 64; break;
            case 1: y = 48; w = 48; h = 96; break;
            case 2: y = 48; w = 80; h = 80; break;
            case 3: y = 64; w = 80; h = 128; break;
            case 4: y = 32; w = 128; h = 48; break;
            case 5: y = 48; w = 80; h = 112; break;
            default: y = 48; w = 80; h = 80; break;
        }
        this.boxCollider.offset = cc.v2(0, y);
        this.boxCollider.size.width = w;
        this.boxCollider.size.height = h;
        if (this.data.boxType > 2) {
            this.shadow.scale = 3;
        } else {
            this.shadow.scale = 2;
        }
    }
    private getSpriteFrameByName(resName: string, suffix?: string): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrameRes(resName + suffix);
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrameRes(resName);
        }
        return spriteFrame;
    }
    updatePlayerPos() {
        // this.node.x = this.pos.x * 64 + 32;
        // this.node.y = this.pos.y * 64 + 32;
        this.node.position = Dungeon.getPosInMap(this.pos);
    }
    transportPlayer(x: number, y: number) {
        this.sprite.angle = 0;
        this.sprite.scale = 1;
        this.sprite.opacity = 255;
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.pos.x = x;
        this.pos.y = y;
        this.changeZIndex();
        this.updatePlayerPos();
    }
    changeZIndex() {
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position);
    }
    showFloatFont(dungeonNode: cc.Node, d: number, isDodge: boolean, isMiss: boolean, isCritical: boolean, isBackStab: boolean) {
        if (!this.floatinglabelManager) {
            return;
        }
        let flabel = this.floatinglabelManager.getFloaingLabel(dungeonNode);
        if (isDodge) {
            flabel.showDoge();
        } else if (isMiss) {
            flabel.showMiss();
        } else if (d != 0) {
            flabel.showDamage(-d, isCritical, isBackStab);
        } else {
            flabel.hideLabel();
        }
    }

    remoteAttack(target:Actor,isSpecial: boolean) {
        this.remoteSkill.IsExcuting = false;
        let p = this.shooter.node.position.clone();
        p.x = this.shooter.node.scaleX > 0 ? p.x + 30 : -p.x - 30;
        let hv = target.getCenterPosition().sub(this.node.position.add(p));
        if (!hv.equals(cc.Vec3.ZERO)) {
            hv = hv.normalizeSelf();
            this.shooter.setHv(hv);
            this.shooter.from.valueCopy(FromData.getClone(this.data.nameCn, this.data.resName));
            if (this.isVariation) {
                this.shooter.data.bulletSize = 0.5;
            }
            this.shooter.dungeon = this.dungeon;
            this.shooter.data.bulletArcExNum = this.data.bulletArcExNum;
            this.shooter.data.bulletLineExNum = this.data.bulletLineExNum;
            this.shooter.data.bulletLineInterval = this.data.bulletLineInterval;
            if (isSpecial) {
                this.shooter.data.bulletLineExNum = this.data.specialBulletLineExNum;
                this.shooter.data.bulletArcExNum = this.data.specialBulletArcExNum;
            }
            this.shooter.data.isLineAim = this.data.isLineAim;
            this.shooter.data.bulletType = this.data.bulletType ? this.data.bulletType : "bullet001";
            this.shooter.data.bulletExSpeed = this.data.bulletExSpeed;
            this.shooter.fireBullet(Logic.getRandomNum(0, 5) - 5, cc.v3(this.data.shooterOffsetX, this.data.shooterOffsetY));
        }
    }
    showAttackAnim(finish: Function, before: Function,target:Actor, isSpecial: boolean, isMelee: boolean, isMiss: boolean) {
        if (this.isAttackAnimExcuting) {
            return;
        }
        this.playAnim(Monster.ANIM_ATTACK);
        this.isAttackAnimExcuting = true;
        let pos = target.node.position.clone().sub(this.node.position);
        if (!pos.equals(cc.Vec3.ZERO)) {
            pos = pos.normalizeSelf();
        }
        this.anim.pause();
        if (pos.equals(cc.Vec3.ZERO)) {
            pos = cc.v3(1, 0);
        }
        pos = pos.normalizeSelf().mul(this.node.scaleX > 0 ? 48 : -48);
        this.sprite.stopAllActions();
        let stabDelay = 0;
        if (this.data.attackType == ActorAttackBox.ATTACK_STAB && isMelee) {
            stabDelay = 0.8;
        }
        let beforeAction = cc.sequence(cc.delayTime(0.5), cc.callFunc(() => { if (before) { before(isSpecial); } }));
        //普通近战
        let action1 = cc.sequence(cc.callFunc(() => {
            this.changeBodyRes(this.data.resName, Monster.RES_ATTACK01);
            if (isMelee) {
                if (!this.dangerBox.dungeon) {
                    this.dangerBox.init(this, this.dungeon,true);
                }
                this.dangerBox.show(this.data.attackType);
            }
        }),
            cc.delayTime(stabDelay),
            cc.moveBy(0.5, -pos.x / 8, -pos.y / 8),
            cc.callFunc(() => {
                this.changeBodyRes(this.data.resName, Monster.RES_ATTACK02);
                if (isMelee) {
                    this.dangerBox.hide(isMiss);
                    if (this.data.attackType == ActorAttackBox.ATTACK_STAB) {
                        this.moveTarget = this.dangerBox.hv.mul(this.dangerBox.node.width);
                        this.move(this.moveTarget, 5000);
                    }
                }
            }),
            cc.delayTime(stabDelay),
            cc.moveBy(0.2, pos.x, pos.y), cc.callFunc(() => {
                this.dangerBox.finish();
                this.moveTarget = cc.Vec3.ZERO;
            }));
        //特殊攻击
        let action2 = cc.sequence(cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_ATTACK03) }),
            cc.callFunc(() => {
                this.specialManager.dungeon = this.dungeon;
                this.specialManager.addEffect(this.data.specialType, this.data.specialDistance, this.isFaceRight, FromData.getClone(this.data.nameCn, this.data.resName));
            }),
            cc.moveBy(0.1, 5, 0), cc.moveBy(0.1, -5, 0), cc.moveBy(0.1, 5, 0), cc.moveBy(0.1, -5, 0),
            cc.moveBy(0.1, 5, 0), cc.moveBy(0.1, -5, 0), cc.moveBy(0.1, 5, 0), cc.moveBy(0.1, -5, 0),
            cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_ATTACK04); }),
            cc.callFunc(() => {
                this.specialManager.dungeon = this.dungeon;
                this.specialManager.addPlacement(this.data.specialType, this.data.specialDistance, this.isFaceRight, FromData.getClone(this.data.nameCn, this.data.resName));
            }),
            cc.delayTime(0.5));
        let afterAction = cc.sequence(cc.callFunc(() => {
            this.anim.resume();
            if (finish) { finish(isSpecial); }
        }), cc.moveTo(0.2, 0, 0), cc.callFunc(() => {
            //这里防止不转向
            this.changeFaceRight(target);
            this.isAttackAnimExcuting = false;
            this.playAnim(Monster.ANIM_IDLE);
        }));
        let allAction = cc.sequence(beforeAction, action1, afterAction);
        if (isSpecial) {
            allAction = cc.sequence(beforeAction, action2, afterAction);
            this.showDangerTips();
        }
        this.sprite.runAction(allAction);
    }
    private playAnim(status: number) {
        if (this.animStatus == status) {
            return;
        }
        this.animStatus = status;
        switch (status) {
            case Monster.ANIM_IDLE: this.playIdle(); break;
            case Monster.ANIM_WALK: this.playWalk(); break;
            case Monster.ANIM_ATTACK: break;
            case Monster.ANIM_HIT: this.playHit(); break;
            case Monster.ANIM_DIED: this.playDied(); break;
        }
    }
    private playIdle() {
        let action = cc.tween()
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, Monster.RES_IDLE000) })
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, Monster.RES_IDLE001) });
        this.sprite.stopAllActions();
        this.isAttackAnimExcuting = false;
        cc.tween(this.sprite).repeatForever(action).start();
    }
    private playWalk() {
        let action = cc.tween()
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK00) })
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK01) })
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK02) })
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK03) });
        this.sprite.stopAllActions();
        this.isAttackAnimExcuting = false;
        cc.tween(this.sprite).repeatForever(action).start();
    }
    private playHit() {
        this.changeBodyRes(this.data.resName, Logic.getHalfChance() ? Monster.RES_HIT001 : Monster.RES_HIT002);
    }
    private playDied() {
        this.sprite.stopAllActions();
        this.bodySprite.node.angle = 0;
        this.anim.play('MonsterDie');
        this.changeBodyRes(this.data.resName, Monster.RES_HIT003);
    }

    //移动，返回速度
    move(pos: cc.Vec3, speed: number) {
        if (this.isDied || this.isFall || this.isHurt || this.dashSkill.IsExcuting || this.isDisguising) {
            return;
        }
        if (pos.equals(cc.Vec3.ZERO)) {
            return;
        }
        let isDodge = false;
        if (!this.moveTarget.equals(cc.Vec3.ZERO)) {
            pos = this.moveTarget.clone();
            isDodge = true;
        }
        pos = pos.normalizeSelf();
        if (this.meleeSkill.IsExcuting && !pos.equals(cc.Vec3.ZERO)) {
            pos = pos.mul(0.1);
        }
        if (isDodge) {
            pos = pos.mul(2.5);
        }

        if (!pos.equals(cc.Vec3.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.node.position);
        }
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);

        let mul = absh > absv ? absh : absv;
        mul = mul == 0 ? 1 : mul;
        let movement = cc.v2(h, v);
        if (speed < 0) {
            speed = 0;
        }
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement.clone();
        this.currentlinearVelocitySpeed = movement.clone();
        this.isMoving = h != 0 || v != 0;
        if (this.isMoving && !this.isAttackAnimExcuting && !this.isDisguising && this.data.isHeavy < 1) {
            this.isFaceRight = h >= 0;
        }
        this.playAnim(this.isMoving ? Monster.ANIM_WALK : Monster.ANIM_IDLE)
        this.changeZIndex();
    }

    start() {
        this.changeZIndex();
        this.healthBar.refreshHealth(this.data.getHealth().x, this.data.getHealth().y);
    }
    /**
     * 是否玩家背后攻击
     */
    isPlayerBehindAttack(): boolean {
        let isPlayerRight = this.getPlayer(this.dungeon).node.position.x > this.node.position.x;
        let isSelfFaceRight = this.node.scaleX > 0;
        return (isPlayerRight && !isSelfFaceRight) || (!isPlayerRight && isSelfFaceRight);
    }
    /**
     * 攻击目标是否背面朝着怪物
     */
    isFaceTargetBehind(target:Actor): boolean {
        let isTargetRight = target.node.position.x > this.node.position.x;
        let isTargetFaceRight = target.node.scaleX > 0;
        return (isTargetRight && isTargetFaceRight) || (!isTargetRight && !isTargetFaceRight);
    }
    fall() {
        if (this.isDied) {
            return;
        }
        this.isFall = true;
        this.bodySprite.node.angle = this.isPlayerBehindAttack() ? -75 : 105;
        this.anim.play('MonsterFall');
    }
    //Anim
    FallFinish() {
        this.isFall = false;
        this.bodySprite.node.angle = 0;
        this.sprite.y = 0;
        this.sprite.x = 0;
        this.anim.play('MonsterIdle');
    }
    takeDamage(damageData: DamageData): boolean {
        if (!this.isShow) {
            return false;
        }
        if (this.data.invisible > 0 && this.sprite.opacity < 200 && Logic.getRandomNum(1, 10) > 4) {
            this.showFloatFont(this.dungeon.node, 0, true, false, damageData.isCriticalStrike, false);
            return false;
        }
        if (this.blinkSkill.IsExcuting) {
            this.showFloatFont(this.dungeon.node, 0, true, false, damageData.isCriticalStrike, false);
            return false;
        }
        let dd = this.data.getDamage(damageData);
        let dodge = this.data.FinalCommon.dodge / 100;
        let isDodge = Random.rand() <= dodge && dd.getTotalDamage() > 0;
        dd = isDodge ? new DamageData() : dd;
        if (isDodge) {
            this.showFloatFont(this.dungeon.node, 0, true, false, damageData.isCriticalStrike, false);
            return false;
        }
        this.isHurt = dd.getTotalDamage() > 0;
        this.isDisguising = false;
        if (!this.specialSkill.IsExcuting) {
            this.meleeSkill.IsExcuting = false;
            this.remoteSkill.IsExcuting = false;
            this.isAttackAnimExcuting = false;
            if (dd.getTotalDamage() > 0) {
                this.playAnim(Monster.ANIM_HIT);
            }
            this.sprite.stopAllActions();
            if (damageData.isCriticalStrike) {
                this.fall();
            }
            if (this.anim.getAnimationState("MonsterIdle").isPlaying) {
                this.anim.pause();
            }
        }
        //100ms后修改受伤
        if (dd.getTotalDamage() > 0) {
            if (!damageData.isRemote) {
                this.dangerBox.finish();
            }
            this.moveTarget = cc.Vec3.ZERO;
            this.hitLight(true);
            if (damageData.isBackAttack) {
                this.showBloodEffect();
            }
            cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MONSTER_HIT } });
            this.scheduleOnce(() => {
                if (this.node) {
                    this.isHurt = false;
                    this.hitLight(false);
                    this.resetBodyColor();
                    this.anim.resume();
                }
            }, 0.2);
        }
        this.sprite.opacity = 255;
        this.data.currentHealth -= dd.getTotalDamage();
        if (this.data.currentHealth > this.data.getHealth().y) {
            this.data.currentHealth = this.data.getHealth().y;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.getHealth().y);
        this.showFloatFont(this.dungeon.node, dd.getTotalDamage(), false, false, damageData.isCriticalStrike, damageData.isBackAttack);
        if (this.data.isRecovery > 0 && this.isHurt) {
            this.addStatus(StatusManager.RECOVERY, new FromData());
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;//停下来
        }
        return this.isHurt;
    }
    resetBodyColor(): void {
        if (!this.data) {
            return;
        }
        this.bodySprite.node.color = cc.color(255, 255, 255).fromHEX(this.data.bodyColor);
    }
    getMixColor(color1: string, color2: string): string {
        let c1 = cc.color().fromHEX(color1);
        let c2 = cc.color().fromHEX(color2);
        let c3 = cc.color();
        let r = c1.getR() + c2.getR();
        let g = c1.getG() + c2.getG();
        let b = c1.getB() + c2.getB();

        c3.setR(r > 255 ? 255 : r);
        c3.setG(g > 255 ? 255 : g);
        c3.setB(b > 255 ? 255 : b);
        return '#' + c3.toHEX('#rrggbb');
    }
    addStatus(statusType: string, from: FromData) {
        if (!this.node || this.isDied) {
            return;
        }
        this.statusManager.addStatus(statusType, from);
    }
    showAttackEffect(isDashing: boolean) {
        this.effectNode.setPosition(cc.v3(0, 32));
        if (!isDashing) {
            this.effectNode.runAction(cc.sequence(cc.moveTo(0.2, 32, 32), cc.moveTo(0.2, 0, 16)));
        }
    }

    showBloodEffect() {
        this.particleBlood.resetSystem();
        this.scheduleOnce(() => { this.particleBlood.stopSystem(); }, 0.5);
    }
    addPlayerStatus(actor: Actor, from: FromData) {
        if (Logic.getRandomNum(0, 100) < this.data.FinalCommon.iceRate) { actor.addStatus(StatusManager.FROZEN, from); }
        if (Logic.getRandomNum(0, 100) < this.data.FinalCommon.fireRate) { actor.addStatus(StatusManager.BURNING, from); }
        if (Logic.getRandomNum(0, 100) < this.data.FinalCommon.lighteningRate) { actor.addStatus(StatusManager.DIZZ, from); }
        if (Logic.getRandomNum(0, 100) < this.data.FinalCommon.toxicRate) { actor.addStatus(StatusManager.TOXICOSIS, from); }
        if (Logic.getRandomNum(0, 100) < this.data.FinalCommon.curseRate) { actor.addStatus(StatusManager.CURSING, from); }
        if (Logic.getRandomNum(0, 100) < this.data.FinalCommon.realRate) { actor.addStatus(StatusManager.BLEEDING, from); }
    }
    killed() {
        if (this.isDied) {
            return;
        }
        this.isDied = true;
        this.isDisguising = false;
        this.dashSkill.IsExcuting = false;
        this.playAnim(Monster.ANIM_DIED);
        let collider: cc.PhysicsCollider = this.getComponent(cc.PhysicsCollider);
        collider.sensor = true;
        this.getLoot();
        Achievements.addMonsterKillAchievement(this.data.resName);
        this.scheduleOnce(() => {
            if (this.node) {
                if (this.data.isBoom > 0) {
                    let boom = cc.instantiate(this.boom).getComponent(AreaOfEffect);
                    if (boom) {
                        boom.show(this.node.parent, this.node.position, cc.v3(1, 0), 0, new AreaOfEffectData().init(1, 0.2, 0, 0, IndexZ.OVERHEAD, false
                            , true, true, false, new DamageData(1), FromData.getClone('爆炸', 'boom000anim004'), []));
                        AudioPlayer.play(AudioPlayer.BOOM);
                    }
                }
                this.scheduleOnce(() => { this.node.active = false; }, 5);
            }
        }, 2);
    }
    getLoot() {
        let rand4save = Logic.mapManager.getCurrentRoomRandom4Save();
        let rand = rand4save.rand();
        let percent = 0.75;
        let offset = 0.025;
        if (this.isVariation) {
            percent = 0.6;
        }
        if (this.dungeon) {
            if (rand < percent) {
                cc.director.emit(EventHelper.DUNGEON_ADD_COIN, { detail: { pos: this.node.position, count: rand4save.getRandomNum(1, 10) } });
                cc.director.emit(EventHelper.DUNGEON_ADD_OILGOLD, { detail: { pos: this.node.position, count: rand4save.getRandomNum(1, 29) } });
            } else if (rand >= percent && rand < percent + offset) {
                this.dungeon.addItem(this.node.position.clone(), Item.HEART);
            } else if (rand >= percent + offset && rand < percent + offset * 2) {
                this.dungeon.addItem(this.node.position.clone(), Item.HEART);
            } else if (rand >= percent + offset * 2 && rand < percent + offset * 3) {
                this.dungeon.addItem(this.node.position.clone(), Item.BOTTLE_ATTACKSPEED);
            } else if (rand >= percent + offset * 3 && rand < percent + offset * 4) {
                this.dungeon.addItem(this.node.position.clone(), Item.BOTTLE_MOVESPEED);
            } else if (rand >= percent + offset * 4 && rand < percent + offset * 5) {
                this.dungeon.addItem(this.node.position.clone(), Item.BOTTLE_HEALING);
            } else if (rand >= percent + offset * 5 && rand < percent + offset * 6) {
                this.dungeon.addItem(this.node.position.clone(), Item.BOTTLE_REMOTE);
            } else if (rand >= percent + offset * 6 && rand < 1) {
                this.dungeon.addEquipment(Logic.getRandomEquipType(rand4save), this.pos, null, 1);
            }
        }
    }

    /**获取中心位置 */
    getCenterPosition(): cc.Vec3 {
        return this.node.position.clone();
    }
    blink() {
        if (this.data.blink > 0) {
            this.blinkSkill.next(() => {
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.BLINK } });
                this.blinkSkill.IsExcuting = true;
                let body = this.sprite.getChildByName('body');
                let action = cc.sequence(cc.fadeOut(0.2)
                    , cc.callFunc(() => {
                        let newPos = this.getNearestEnemyPosition(true,this.dungeon);
                        newPos = Dungeon.getIndexInMap(newPos);
                        if (newPos.x > this.pos.x) {
                            newPos = newPos.addSelf(cc.v3(1, 0));
                        } else {
                            newPos = newPos.addSelf(cc.v3(-1, 0));
                        }
                        let pos = Dungeon.getPosInMap(newPos);
                        this.node.setPosition(pos);
                    })
                    , cc.fadeIn(0.2));
                body.runAction(action);
                this.scheduleOnce(() => { this.blinkSkill.IsExcuting = false; }, 1)
            }, this.data.blink, true)
        }
    }
    monsterAction() {
        if (this.isDied || !this.dungeon || this.isHurt || this.isFall || !this.isShow || this.isDizz) {
            return;
        }
        this.node.position = Dungeon.fixOuterMap(this.node.position);
        this.pos = Dungeon.getIndexInMap(this.node.position);
        this.changeZIndex();
        let newPos = cc.v3(0, 0);
        this.moveSkill.next(() => {
            newPos.x += Logic.getRandomNum(0, 200) - 100;
            newPos.y += Logic.getRandomNum(0, 200) - 100;
        }, 2, true);
        let target = this.getNearestEnemyActor(true,this.dungeon);
        let targetDis = this.getNearestTargetDistance(target);
        let pos = newPos.clone();

        if (this.data.specialAttack > 0) {
            this.specialSkill.next(() => {
                this.specialSkill.IsExcuting = true;
            }, this.data.specialAttack, true);
        }
        //近战
        let pd = 100;
        if (this.specialSkill.IsExcuting) {
            pd = 200;
        }
        if (this.data.attackType == ActorAttackBox.ATTACK_STAB) {
            pd = 300;
        }
        let canMelee = false;
        let canRemote = false;
        canMelee = targetDis < pd * this.node.scaleY 
            && !target.isDied 
            && !target.invisible
            && target.isShow
            && this.data.melee > 0;
        canRemote = targetDis < 600 && this.data.remote > 0 
            && this.shooter
            && !target.isDied 
            && !target.invisible
            && target.isShow;
        if (canMelee && !this.dashSkill.IsExcuting && !this.blinkSkill.IsExcuting && !this.isDisguising) {
            this.meleeSkill.next(() => {
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MELEE } });
                this.meleeSkill.IsExcuting = true;
                this.showAttackEffect(false);
                let isMiss = Logic.getRandomNum(0, 100) < this.data.StatusTotalData.missRate;
                if (isMiss) {
                    this.showFloatFont(this.dungeon.node, 0, false, true, false, false);
                }
                this.showAttackAnim((isSpecial: boolean) => {
                    this.meleeSkill.IsExcuting = false;
                    if (this.graphics) {
                        this.graphics.clear();
                    }
                    this.specialSkill.IsExcuting = false;

                }, () => { },target, this.specialSkill.IsExcuting, true, isMiss)

                this.sprite.opacity = 255;
            }, this.data.melee);

        }
        this.blink();
        if (targetDis < 500 && this.data.melee > 0 && !target.invisible) {
            pos = this.getMovePosFromTarget(target);
        }
        //远程
        if (canRemote && !this.isDisguising && !this.meleeSkill.IsExcuting) {
            this.remoteSkill.next(() => {
                this.remoteSkill.IsExcuting = true;
                this.changeFaceRight(target);
                this.showAttackAnim((isSpecial: boolean) => {
                    if (Logic.bullets[this.data.bulletType] && Logic.bullets[this.data.bulletType].isLaser > 0 && isSpecial) {
                        return;
                    }
                    this.remoteAttack(target,isSpecial);
                    this.specialSkill.IsExcuting = false;
                }, (isSpecial: boolean) => {
                    if (Logic.bullets[this.data.bulletType] && Logic.bullets[this.data.bulletType].isLaser > 0 && isSpecial) {
                        this.remoteAttack(target,isSpecial);
                        this.specialSkill.IsExcuting = false;
                    }
                },target, this.specialSkill.IsExcuting, false, false);
                this.sprite.opacity = 255;
            }, this.data.remote, true);
        }

        //冲刺
        let speed = this.data.FinalCommon.moveSpeed;
        if (targetDis < 600 && targetDis > 100 && !target.isDied && !target.invisible && this.data.dash > 0
            && !this.dashSkill.IsExcuting && !this.isDisguising) {
            this.dashSkill.next(() => {
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MELEE } });
                pos = this.getMovePosFromTarget(target);
                this.showAttackEffect(true);
                this.move(pos, speed * 1.2);
                this.dashSkill.IsExcuting = true;
                this.scheduleOnce(() => { if (this.node) { this.dashSkill.IsExcuting = false; } }, 2);
            }, this.data.dash);

        }
        if (this.data.disguise > 0 && targetDis < this.data.disguise && !target.isDied && !target.invisible && this.isDisguising) {
            this.playAnim(Monster.ANIM_IDLE);
            this.isDisguising = false;
        }

        if (Logic.getHalfChance() && !this.shooter.isAiming && targetDis > 64 * this.node.scaleY && !this.isAttackAnimExcuting) {
            this.move(pos, speed);
        }

    }
    getMovePosFromTarget(target:Actor): cc.Vec3 {
        let newPos = target.node.position.clone();
        newPos = Dungeon.getIndexInMap(newPos);
        if (newPos.x > this.pos.x) {
            newPos = newPos.addSelf(cc.v3(1, 0));
        } else {
            newPos = newPos.addSelf(cc.v3(-1, 0));
        }
        let pos = Dungeon.getPosInMap(newPos);
        pos = pos.sub(this.node.position);
        if (!this.isAttackAnimExcuting && !this.isAttackAnimExcuting && !this.isDisguising && this.data.isHeavy < 1) {
            this.changeFaceRight(target);
        }
        return pos;
    }
    changeFaceRight(target:Actor) {
        let pos = target.node.position.clone();
        pos = pos.sub(this.node.position);
        let h = pos.x;
        this.isFaceRight = h >= 0;
    }
    lerp(a, b, r) {
        return a + (b - a) * r;
    };
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let target = Actor.getCollisionTarget(other);
        if (target && this.dashSkill.IsExcuting && this.dungeon && !this.isHurt && !this.isDied) {
            this.dashSkill.IsExcuting = false;
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
            let from = FromData.getClone(this.data.nameCn, this.data.resName + 'anim000');
            if (target.takeDamage(this.data.getAttackPoint(), from, this)) {
                this.addPlayerStatus(target, from);
            }
        }
    }

    dizzCharacter(dizzDuration: number) {
        if (dizzDuration > 0) {
            this.isDizz = true;
            this.scheduleOnce(() => {
                this.isDizz = false;
            }, dizzDuration)
        }
    }

    getScaleSize(): number {
        let scaleNum = this.data.sizeType && this.data.sizeType > 0 ? this.data.sizeType : 1;
        let sn = this.isVariation ? Monster.SCALE_NUM * scaleNum : scaleNum;
        return sn;
    }

    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.2) {
            this.timeDelay = 0;
            this.monsterAction();
        }
        //隐匿
        if (this.data.invisible > 0 && this.sprite.opacity > 10) {
            this.sprite.opacity = this.lerp(this.sprite.opacity, 9, dt * 3);
        }
        this.dashlight.opacity = 0;
        if (this.dungeon && this.dashSkill.IsExcuting) {
            this.dashlight.opacity = 128;
            this.rigidbody.linearVelocity = this.currentlinearVelocitySpeed.clone();
        }
        if (this.isDied) {
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
        }
        this.healthBar.node.opacity = this.isDisguising ? 0 : 255;
        if (this.shadow) {
            this.shadow.opacity = this.isDisguising ? 0 : 128;
        }
        if (this.isDisguising && this.anim) { this.anim.pause(); }
        if (this.data.invisible > 0) {
            this.healthBar.node.opacity = this.sprite.opacity > 20 ? 255 : 9;
        }
        this.healthBar.node.active = !this.isDied;
        if (this.data.currentHealth < 1) {
            this.killed();
        }
        let sn = this.getScaleSize();
        this.node.scaleX = this.isFaceRight ? sn : -sn;
        this.node.scaleY = sn;

        this.healthBar.node.scaleX = this.node.scaleX > 0 ? 1 : -1;
        //防止错位
        this.healthBar.node.x = -30 * this.node.scaleX;
        this.healthBar.node.y = this.data.boxType == 3 || this.data.boxType == 5 ? 150 : 120;
        //变异为紫色
        this.healthBar.progressBar.barSprite.node.color = this.isVariation ? cc.color(128, 0, 128) : cc.color(194, 0, 0);
        this.dashlight.color = this.isVariation ? cc.color(0, 0, 0) : cc.color(255, 255, 255);
        if (this.attrNode) {
            this.attrNode.opacity = this.healthBar.node.opacity;
        }
    }
    actorName() {
        return this.data.nameCn;
    }
}
