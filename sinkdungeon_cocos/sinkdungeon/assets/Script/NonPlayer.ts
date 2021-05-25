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
import Dungeon from './Dungeon';
import Shooter from './Shooter';
import StatusManager from './Manager/StatusManager';
import DamageData from './Data/DamageData';
import FloatinglabelManager from './Manager/FloatingLabelManager';
import Random from './Utils/Random';
import NextStep from './Utils/NextStep';
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
import StateMachine from './Base/fsm/StateMachine';
import State from './Base/fsm/State';
import DefaultStateMachine from './Base/fsm/DefaultStateMachine';
import NonPlayerActorState from './Actor/NonPlayerActorState';
import StateContext from './Base/StateContext';
import NonPlayerData from './Data/NonPlayerData';
import { ColliderTag } from './Actor/ColliderTag';
import StatusData from './Data/StatusData';
import ActorUtils from './Utils/ActorUtils';
import MeleeWeapon from './MeleeWeapon';
import MonsterManager from './Manager/MonsterManager';

@ccclass
export default class NonPlayer extends Actor {
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
    public static readonly RES_ATTACK01 = 'anim009';//图片资源 准备攻击后续动画由参数配置



    static readonly SCALE_NUM = 1.5;
    static readonly ANIM_NONE = -1;
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
    dungeon: Dungeon;
    shooter: Shooter = null;
    currentlinearVelocitySpeed: cc.Vec2 = cc.Vec2.ZERO;//当前最大速度
    isVariation: boolean = false;//是否变异
    isSummon = false;//是否召唤出来的，召唤生物无法掉落装备
    killPlayerCount = 0;//杀死玩家次数 

    particleBlood: cc.ParticleSystem;
    effectNode: cc.Node;
    hitLightSprite: cc.Sprite;

    moveStep = new NextStep();
    remoteStep = new NextStep();
    meleeStep = new NextStep();
    specialStep = new NextStep();
    dashStep = new NextStep();
    blinkStep = new NextStep();
    attrmap: { [key: string]: number } = {};
    mat: cc.MaterialVariant;
    animStatus = NonPlayer.ANIM_NONE;
    data: NonPlayerData = new NonPlayerData();

    public stateMachine: StateMachine<NonPlayer, State<NonPlayer>>;

    onLoad() {
        this.graphics = this.getComponent(cc.Graphics);
        this.sc.isAttacking = false;
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
        this.bodySprite = this.sprite.getChildByName('body').getComponent(cc.Sprite);
        this.mat = this.bodySprite.getComponent(cc.Sprite).getMaterial(0);
        this.boxCollider = this.getComponent(cc.BoxCollider);
        if (this.isVariation) {
            let scaleNum = this.data.sizeType && this.data.sizeType > 0 ? this.data.sizeType : 1;
            this.node.scale = NonPlayer.SCALE_NUM * scaleNum;
        }
        this.dashlight = this.sprite.getChildByName('dashlight');
        this.dashlight.opacity = 0;
        this.shadow = this.sprite.getChildByName('shadow');
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter);
        this.effectNode = this.node.getChildByName('Effect');
        this.hitLightSprite = this.node.getChildByName('Effect').getChildByName('hitlight').getComponent(cc.Sprite);
        this.hitLightSprite.node.opacity = 0;
        this.particleBlood = this.node.getChildByName('Effect').getChildByName('blood').getComponent(cc.ParticleSystem);
        this.particleBlood.stopSystem();
        this.attrNode = this.node.getChildByName('attr');
        this.updatePlayerPos();
        this.resetBodyColor();
        if (this.data.isHeavy > 0) {
            this.rigidbody.type = cc.RigidBodyType.Static;
        }
        this.dangerBox.init(this, this.dungeon, this.data.isEnemy > 0);
        this.dangerTips.opacity = 0;
        this.specialStep.delay(5);
        this.stateMachine = new DefaultStateMachine(this, NonPlayerActorState.PRPARE, NonPlayerActorState.GLOBAL);
        // this.graphics.strokeColor = cc.Color.ORANGE;
        // this.graphics.circle(0,0,100);
        // this.graphics.stroke();
        // this.graphics.strokeColor = cc.Color.RED;
        // this.graphics.circle(0,0,80);
        // this.graphics.stroke();
        if (this.data.lifeTime > 0) {
            this.scheduleOnce(() => { this.data.currentHealth = 0; }, this.data.lifeTime)
        }
    }
    private hitLightS(damage: DamageData) {
        let show = true;
        let resName = 'hitlight1';
        let scale = 8;
        if (damage.isFist) {
            resName = Logic.getHalfChance() ? 'hitlight1' : 'hitlight2';
            AudioPlayer.play(AudioPlayer.PUNCH);
        } else if (damage.isRemote) {
            resName = Logic.getHalfChance() ? 'hitlight9' : 'hitlight10';
        } else if (damage.isBlunt) {
            resName = Logic.getHalfChance() ? 'hitlight3' : 'hitlight4';
            scale = damage.isFar ? 10 : 8;
            AudioPlayer.play(AudioPlayer.SWORD_HIT);
        } else if (damage.isMelee) {
            AudioPlayer.play(AudioPlayer.SWORD_HIT);
            if (damage.isStab) {
                resName = Logic.getHalfChance() ? 'hitlight5' : 'hitlight6';
                scale = damage.isFar ? 10 : 8;
            } else {
                resName = Logic.getHalfChance() ? 'hitlight7' : 'hitlight8';
                scale = damage.isFar ? 10 : 8;
            }
        }else{
            show = false;
        }
        if(show){
            this.hitLightSprite.node.stopAllActions();
            this.hitLightSprite.spriteFrame = Logic.spriteFrameRes(resName);
            this.hitLightSprite.node.opacity = 220;
            this.hitLightSprite.node.color = cc.Color.WHITE;
            this.hitLightSprite.node.scale = damage.isCriticalStrike ? scale : scale + 3;
            cc.tween(this.hitLightSprite.node).delay(0.2).to(0.3, { opacity: 0, color: cc.Color.BLACK }).to(0.3, { opacity: 0}).start();
        }
        
    }
    private hitLight(isHit: boolean) {
        if (!this.mat) {
            this.mat = this.node.getChildByName('sprite').getChildByName('body')
                .getComponent(cc.Sprite).getMaterial(0);
        }
        this.mat.setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
    }
    public addAttrIcon() {
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
    private showDangerTips() {
        this.dangerTips.opacity = 255;
        this.scheduleOnce(() => { this.dangerTips.opacity = 0; }, 1)
    }
    // private showCircle() {
    //     let r = 0;
    //     let call = () => {
    //         this.graphics.clear();
    //         this.graphics.fillColor = cc.color(255, 0, 0, 80);
    //         this.graphics.arc(0, 0, r, Math.PI / 2, Math.PI + Math.PI / 2);
    //         r += 2;
    //         this.graphics.fill();
    //         if (r > 80 * this.node.scaleY) {
    //             r = 80 * this.node.scaleY;
    //         }
    //         if (this.sc.isHurting) {
    //             this.unschedule(call);
    //             this.graphics.clear();
    //         }
    //     }
    //     this.schedule(call, 0.016, 40);
    // }
    private getCurrentBodyRes(): string {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite');
            this.bodySprite = this.sprite.getChildByName('body').getComponent(cc.Sprite);
        }
        return this.bodySprite.spriteFrame.name;
    }
    public changeBodyRes(resName: string, suffix?: string) {
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
        if (spriteFrame) {
            this.bodySprite.spriteFrame = spriteFrame;
        } else {
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
            case 5: y = 48; w = 128; h = 96; break;
            default: y = 48; w = 80; h = 80; break;
        }
        this.boxCollider.offset = cc.v2(0, y);
        this.boxCollider.size.width = w;
        this.boxCollider.size.height = h;
        this.boxCollider.tag = this.data.isEnemy > 0 ? ColliderTag.NONPLAYER : ColliderTag.GOODNONPLAYER;
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
    private updatePlayerPos() {
        this.node.position = Dungeon.getPosInMap(this.pos);
    }
    private transportPlayer(x: number, y: number) {
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
    private changeZIndex() {
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position);
    }
    private showFloatFont(dungeonNode: cc.Node, d: number, isDodge: boolean, isMiss: boolean, isCritical: boolean, isBackStab: boolean) {
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

    private remoteAttack(target: Actor, isSpecial: boolean) {
        this.remoteStep.IsExcuting = false;
        let p = this.shooter.node.position.clone();
        p.x = this.shooter.node.scaleX > 0 ? p.x + 30 : -p.x - 30;
        let hv = target.getCenterPosition().sub(this.node.position.add(p));
        if (!hv.equals(cc.Vec3.ZERO)) {
            hv = hv.normalizeSelf();
            this.shooter.setHv(hv);
            this.shooter.from.valueCopy(FromData.getClone(this.data.nameCn, this.data.resName + 'anim000', this.seed));
            if (this.isVariation) {
                this.shooter.data.bulletSize = 0.5;
            }
            this.shooter.dungeon = this.dungeon;
            this.shooter.data.remoteAudio = this.data.remoteAudio;
            this.shooter.isFromPlayer = this.data.isEnemy < 1;
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
    private showAttackAnim(before: Function, attacking: Function, finish: Function, target: Actor, isSpecial: boolean, isMelee: boolean, isMiss: boolean) {


        let pos = target.node.position.clone().sub(this.node.position);

        if (!pos.equals(cc.Vec3.ZERO)) {
            pos = pos.normalizeSelf();
        }
        this.anim.pause();
        if (pos.equals(cc.Vec3.ZERO)) {
            pos = cc.v3(1, 0);
        }
        pos = pos.normalizeSelf().mul(this.node.scaleX > 0 ? 48 : -48);
        if (this.node.scaleX < 0) {
            pos.y = -pos.y;
        }
        this.sprite.stopAllActions();
        let stabDelay = 0;
        if (this.data.attackType == ActorAttackBox.ATTACK_STAB && isMelee) {
            stabDelay = 0.8;
        }
        let beforetween = cc.tween().delay(0.5).call(() => { if (before) { before(isSpecial); } })

        //摇晃
        let shaketween = cc.tween().by(0.1, { position: cc.v3(5, 0) }).by(0.1, { position: cc.v3(-5, 0) })
            .by(0.1, { position: cc.v3(5, 0) }).by(0.1, { position: cc.v3(-5, 0) })
            .by(0.1, { position: cc.v3(5, 0) }).by(0.1, { position: cc.v3(-5, 0) })
            .by(0.1, { position: cc.v3(5, 0) }).by(0.1, { position: cc.v3(-5, 0) });

        let arr: string[] = [`anim009`];
        let arrspecial: string[] = [];
        let frameIndex = 0;

        while (frameIndex < this.data.attackFrame - 1) {
            arr.push(`anim01${frameIndex++}`);
        }
        for (let i = 0; i < this.data.attackFrame1; i++) {
            arrspecial.push(`anim01${frameIndex++}`);
        }
        //退后
        let backofftween = cc.tween().by(0.5, { position: cc.v3(-pos.x / 8, -pos.y / 8) }).delay(stabDelay);
        //前进
        let forwardtween = cc.tween().by(0.2, { position: cc.v3(pos.x, pos.y) }).delay(stabDelay);
        let specialTypeCanMelee = this.data.specialType.length <= 0
            || this.data.specialType == SpecialManager.AFTER_ASH;

        let attackpreparetween = cc.tween().call(() => {
            this.changeBodyRes(this.data.resName, isSpecial ? arrspecial[0] : arr[0]);
            if (isMelee && !isSpecial || (isSpecial && isMelee && specialTypeCanMelee)) {
                this.dangerBox.show(this.data.attackType, isSpecial, this.data.boxType == 5, pos);
            }
            if (isSpecial) {
                if (this.data.specialType == SpecialManager.AFTER_DOWN) {
                    this.dangerBox.show(ActorAttackBox.ATTACK_STAB, false, false, pos);
                }
                this.scheduleOnce(() => {
                    this.specialManager.dungeon = this.dungeon;
                    this.specialManager.addEffect(this.data.specialType, this.data.specialDistance, this.isFaceRight, FromData.getClone(this.data.nameCn, this.data.resName + 'anim000', this.seed));
                }, this.data.specialDelay);
            }
        });

        let attackingtween = cc.tween().call(() => {
            this.changeBodyRes(this.data.resName, isSpecial ? arrspecial[1] : arr[1]);
            this.dangerBox.hide(isMiss);
            if (isMelee && !isSpecial || isSpecial && this.data.specialType.length <= 0) {
                if (this.data.attackType == ActorAttackBox.ATTACK_STAB) {
                    this.move(cc.v3(this.isFaceRight ? this.dangerBox.hv.x : -this.dangerBox.hv.x, this.dangerBox.hv.y), isSpecial ? 2000 : 1000);
                }
            }
            if (isSpecial) {
                if (this.data.specialType == SpecialManager.AFTER_DOWN) {
                    this.move(cc.v3(this.isFaceRight ? this.dangerBox.hv.x : -this.dangerBox.hv.x, this.dangerBox.hv.y), 1000);
                }
                this.scheduleOnce(() => {
                    this.specialManager.dungeon = this.dungeon;
                    this.specialManager.addPlacement(this.data.specialType, this.data.specialDistance, this.isFaceRight, FromData.getClone(this.data.nameCn, this.data.resName + 'anim000', this.seed));
                }, this.data.specialDelay);
            }
            if (attacking) {
                attacking(isSpecial);
            }

        });
        let attackback = cc.tween();
        for (let i = 2; i < arr.length; i++) {
            attackback.then(cc.tween().delay(0.2).call(() => { this.changeBodyRes(this.data.resName, arr[i]); }));
        }
        let attackbackspecial = cc.tween();
        for (let i = 2; i < arrspecial.length; i++) {
            attackbackspecial.then(cc.tween().delay(0.2).call(() => { this.changeBodyRes(this.data.resName, arrspecial[i]); }));
        }
        let attackfinish = cc.tween().delay(0.2).call(() => {
            this.changeBodyRes(this.data.resName, NonPlayer.RES_IDLE000);
            this.dangerBox.finish();
            this.setLinearVelocity(cc.Vec2.ZERO);
        });
        let aftertween = cc.tween().to(0.2, { position: cc.v3(0, 0) }).delay(0.2).call(() => {
            if (finish) { finish(isSpecial); }
        })
        //普通近战 准备 退后 出击 前进 回招 结束
        let normalMelee = cc.tween().then(attackpreparetween).then(backofftween)
            .then(attackingtween).then(forwardtween).then(attackback).then(attackfinish);
        //普通远程 准备 出击 回招 结束
        let normalRemote = cc.tween().then(attackpreparetween).delay(0.5)
            .then(attackingtween).delay(0.2).then(attackback).then(attackfinish);
        //特殊近战 准备 退后 摇晃 出击 前进 回招 结束
        let specialMelee = cc.tween().then(attackpreparetween).then(backofftween)
            .then(shaketween).then(attackingtween).then(forwardtween).then(attackbackspecial).then(attackfinish);
        //特殊远程 准备 摇晃 出击 回招 结束
        let specialRemote = cc.tween().then(attackpreparetween).then(shaketween)
            .then(attackingtween).delay(0.5).then(attackbackspecial).then(attackfinish);

        let allAction = cc.tween().then(beforetween).then(normalRemote).then(aftertween);
        if (isMelee) {
            allAction = cc.tween().then(beforetween).then(normalMelee).then(aftertween);
        }
        if (isSpecial) {
            this.showDangerTips();
            if(this.data.resName == MonsterManager.MONSTER_CHICKEN){
                AudioPlayer.play(AudioPlayer.CHICKEN);
            }
            if(this.data.specialType == SpecialManager.AFTER_VENOM){
                AudioPlayer.play(AudioPlayer.ZOMBIE_SPITTING);
            }else if(this.data.specialType == SpecialManager.AFTER_DOWN){
                AudioPlayer.play(AudioPlayer.ZOMBIE_ATTACK);
            }
            allAction = cc.tween().then(beforetween).then(specialRemote).then(aftertween);
            if (isMelee && specialTypeCanMelee) {
                allAction = cc.tween().then(beforetween).then(specialMelee).then(aftertween);
            }
        }
        cc.tween(this.sprite).then(allAction).start();
    }

    private playDied() {
        this.sprite.stopAllActions();
        this.bodySprite.node.angle = 0;
        this.anim.play('MonsterDie');
        this.changeBodyRes(this.data.resName, NonPlayer.RES_HIT003);
    }


    //移动，返回速度
    private move(pos: cc.Vec3, speed: number) {
        if (pos.equals(cc.Vec3.ZERO)) {
            return;
        }
        pos = pos.normalizeSelf();
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
        this.setLinearVelocity(movement);
        // let isMoving = h != 0 || v != 0;
        // if (isMoving && this.data.isHeavy < 1) {
        //     this.isFaceRight = h >= 0;
        // }
        this.changeZIndex();
    }
    setLinearVelocity(movement: cc.Vec2) {
        this.currentlinearVelocitySpeed = movement;
        this.rigidbody.linearVelocity = this.currentlinearVelocitySpeed.clone();
    }

    start() {
        this.changeZIndex();
        this.healthBar.refreshHealth(this.data.getHealth().x, this.data.getHealth().y);
    }
    /**
     * 是否玩家背后攻击
     */
    isPlayerBehindAttack(): boolean {
        let isPlayerRight = this.dungeon.player.node.position.x > this.node.position.x;
        let isSelfFaceRight = this.node.scaleX > 0;
        return (isPlayerRight && !isSelfFaceRight) || (!isPlayerRight && isSelfFaceRight);
    }
    /**
     * 攻击目标是否背面朝着怪物
     */
    isFaceTargetBehind(target: Actor): boolean {
        let isTargetRight = target.node.position.x > this.node.position.x;
        let isTargetFaceRight = target.isFaceRight;
        return (isTargetRight && isTargetFaceRight) || (!isTargetRight && !isTargetFaceRight);
    }
    fall() {
        this.sc.isFalling = true;
        this.bodySprite.node.angle = this.isPlayerBehindAttack() ? -75 : 105;
        this.anim.play('MonsterFall');
    }
    //Anim
    FallFinish() {
        this.sc.isFalling = false;
        this.bodySprite.node.angle = 0;
        this.sprite.y = 0;
        this.sprite.x = 0;
    }
    takeDamage(damageData: DamageData): boolean {
        if (!this.sc.isShow || this.sc.isDied) {
            return false;
        }
        //隐身中
        if (this.data.invisible > 0 && this.sprite.opacity < 100 && Logic.getRandomNum(1, 10) > 4) {
            this.showFloatFont(this.dungeon.node, 0, true, false, damageData.isCriticalStrike, false);
            return false;
        }
        //闪烁中
        if (this.sc.isBlinking) {
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
        let isHurting = dd.getTotalDamage() > 0;
        //特殊攻击和远程伤害情况下不改变状态
        this.sc.isHurting = isHurting && !this.specialStep.IsExcuting && !damageData.isRemote;
        if (this.sc.isHurting) {
            this.sc.isDisguising = false;
            this.sc.isAttacking = false;
            if (damageData.isCriticalStrike) {
                this.fall();
            }
            this.sprite.stopAllActions();
            this.changeBodyRes(this.data.resName, Logic.getHalfChance() ? NonPlayer.RES_HIT001 : NonPlayer.RES_HIT002);
            if (this.anim.getAnimationState("MonsterIdle").isPlaying) {
                this.anim.pause();
            }
            this.dangerBox.finish();
        }
        if (isHurting) {
            cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MONSTER_HIT } });
            this.hitLight(true);
            this.hitLightS(damageData);
            this.dangerBox.finish();
            if (damageData.isBackAttack) {
                this.showBloodEffect();
            }
            this.setLinearVelocity(cc.Vec2.ZERO);
            //100ms后修改受伤
            this.scheduleOnce(() => {
                if (this.node) {
                    this.sc.isHurting = false;
                    this.hitLight(false);
                    this.resetBodyColor();
                    this.anim.resume();
                }
            }, 0.1);
        }

        this.sprite.opacity = 255;
        this.data.currentHealth -= dd.getTotalDamage();
        if (this.data.currentHealth > this.data.getHealth().y) {
            this.data.currentHealth = this.data.getHealth().y;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.getHealth().y);
        this.showFloatFont(this.dungeon.node, dd.getTotalDamage(), false, false, damageData.isCriticalStrike, damageData.isBackAttack);
        if (this.data.isRecovery > 0 && isHurting) {
            this.addStatus(StatusManager.RECOVERY, new FromData());
        }
        return isHurting;
    }
    private resetBodyColor(): void {
        if (!this.data) {
            return;
        }
        this.bodySprite.node.color = cc.color(255, 255, 255).fromHEX(this.data.bodyColor);
    }
    private getMixColor(color1: string, color2: string): string {
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
        if (!this.node || this.sc.isDied) {
            return;
        }
        this.statusManager.addStatus(statusType, from);
    }
    private showAttackEffect(isDashing: boolean) {
        this.effectNode.setPosition(cc.v3(0, 32));
        if (!isDashing) {
            cc.tween(this.effectNode).to(0.2, { position: cc.v3(32, 32) }).to(0.2, { position: cc.v3(0, 16) }).start();
        }
    }

    private showBloodEffect() {
        AudioPlayer.play(AudioPlayer.BLEEDING);
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
        if (this.sc.isDied) {
            return;
        }
        this.sc.isDied = true;
        this.sc.isDisguising = false;
        this.dashStep.IsExcuting = false;
        this.sprite.stopAllActions();
        this.dangerBox.finish();
        this.bodySprite.node.angle = 0;
        this.anim.play('MonsterDie');
        this.setLinearVelocity(cc.Vec2.ZERO);
        this.changeBodyRes(this.data.resName, NonPlayer.RES_HIT003);
        let collider: cc.PhysicsCollider = this.getComponent(cc.PhysicsCollider);
        collider.sensor = true;
        if (this.data.isEnemy > 0) {
            this.getLoot();
        }
        Achievements.addMonsterKillAchievement(this.data.resName);
        Logic.setKillPlayerCounts(FromData.getClone(this.actorName(), this.data.resName + 'anim000', this.seed), false);
        this.scheduleOnce(() => {
            if (this.node) {
                if (this.data.isBoom > 0) {
                    let boom = cc.instantiate(this.boom).getComponent(AreaOfEffect);
                    if (boom) {
                        boom.show(this.node.parent, this.node.position, cc.v3(1, 0), 0, new AreaOfEffectData().init(1, 0.2, 0, 0, IndexZ.OVERHEAD, this.data.isEnemy > 0
                            , true, true, false, false, new DamageData(1), FromData.getClone('爆炸', 'boom000anim004'), []));
                        AudioPlayer.play(AudioPlayer.BOOM);
                        cc.director.emit(EventHelper.CAMERA_SHAKE, { detail: { isHeavyShaking: true } });
                    }
                }
                this.scheduleOnce(() => { this.node.active = false; }, 5);
            }
        }, 2);
    }
    getLoot() {
        let rand4save = Logic.mapManager.getRandom4Save(Logic.mapManager.getRebornSeed(this.seed));
        let rand = rand4save.rand();
        let percent = 0.75;
        if (this.isVariation) {
            percent = 0.6;
        }
        percent = percent - this.killPlayerCount / 10;
        if (percent < 0.3) {
            percent = 0.3;
        }

        let offset = (1 - percent) / 10;
        let quality = 1 + this.killPlayerCount / 2;
        quality = Math.floor(quality);
        if (quality > 4) {
            quality = 4;
        }

        if (this.dungeon) {

            if (rand < percent) {
                cc.director.emit(EventHelper.DUNGEON_ADD_COIN, { detail: { pos: this.node.position, count: rand4save.getRandomNum(1, 10) } });
                cc.director.emit(EventHelper.DUNGEON_ADD_OILGOLD, { detail: { pos: this.node.position, count: rand4save.getRandomNum(1, 29) } });
            } else if (rand >= percent && rand < percent + offset) {
                this.addLootSaveItem(Item.HEART, true);
            } else if (rand >= percent + offset && rand < percent + offset * 2) {
                this.addLootSaveItem(Item.HEART, true);
            } else if (rand >= percent + offset * 2 && rand < percent + offset * 3) {
                this.addLootSaveItem(Item.BOTTLE_ATTACK);
            } else if (rand >= percent + offset * 3 && rand < percent + offset * 4) {
                this.addLootSaveItem(Item.BOTTLE_MOVESPEED);
            } else if (rand >= percent + offset * 4 && rand < percent + offset * 5) {
                this.addLootSaveItem(Item.BOTTLE_HEALING);
            } else if (rand >= percent + offset * 5 && rand < percent + offset * 6) {
                this.addLootSaveItem(Item.BOTTLE_DREAM);
            } else if (rand >= percent + offset * 6 && rand < percent + offset * 7) {
                this.addLootSaveItem(Item.BOTTLE_REMOTE);
            } else if (rand >= percent + offset * 7 && rand < 1) {
                if (!this.isSummon) {
                    this.dungeon.addEquipment(Logic.getRandomEquipType(rand4save), Dungeon.getPosInMap(this.pos), null, quality);
                }
            }
        }
    }
    private addLootSaveItem(resName: string, isAuto?: boolean) {
        if (isAuto || !this.isSummon) {
            this.dungeon.addItem(this.node.position.clone(), resName);
        }
    }

    /**获取中心位置 */
    getCenterPosition(): cc.Vec3 {
        return this.node.position.clone();
    }
    get isPassive() {
        return !this.dungeon || this.sc.isDied || this.sc.isHurting || this.sc.isFalling || this.sc.isAttacking
            || !this.sc.isShow || this.sc.isDizzing || this.sc.isDisguising || this.sc.isDodging || this.sc.isDashing;
    }

    updateAttack() {
        if (this.isPassive) {
            return;
        }
        let target = ActorUtils.getNearestEnemyActor(this, this.data.isEnemy > 0, this.dungeon);
        let targetDis = ActorUtils.getNearestTargetDistance(this, target);
        //特殊攻击
        if (this.data.specialAttack > 0) {
            this.specialStep.next(() => {
                this.specialStep.IsExcuting = true;
            }, this.data.specialAttack, true);
        }
        let range = 100;
        if (this.specialStep.IsExcuting) {
            range = 200;
        }
        if (this.data.attackType == ActorAttackBox.ATTACK_STAB) {
            range = 300;
            if (this.specialStep.IsExcuting) {
                range = 600;
            }
        }
        let canMelee = this.data.melee > 0;
        let canRemote = this.data.remote > 0;
        if (canMelee && targetDis < range * this.node.scaleY && !this.meleeStep.isInCooling&&target&&!target.invisible) {
            this.meleeStep.next(() => {
                this.sc.isAttacking = true;
                this.sprite.opacity = 255;
                this.showAttackEffect(false);
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MELEE } });
                let isMiss = Logic.getRandomNum(0, 100) < this.data.StatusTotalData.missRate;
                if (isMiss) {
                    this.showFloatFont(this.dungeon.node, 0, false, true, false, false);
                }
                this.showAttackAnim(() => { }, () => { }, () => {
                    this.sc.isAttacking = false;
                    this.specialStep.IsExcuting = false;
                }, target, this.specialStep.IsExcuting, true, isMiss)

            }, this.data.melee);
        } else if (canRemote && targetDis < 600 * this.node.scaleY&&target&&!target.invisible) {
            this.remoteStep.next(() => {
                this.sc.isAttacking = true;
                this.sprite.opacity = 255;
                this.changeFaceRight(target);
                let isLaser = Logic.bullets[this.data.bulletType] && Logic.bullets[this.data.bulletType].isLaser > 0;
                this.showAttackAnim((isSpecial: boolean) => {
                    if (isLaser && isSpecial) {
                        this.remoteAttack(target, isSpecial);
                    }
                }, (isSpecial: boolean) => {
                    if (isLaser && isSpecial) {
                        return;
                    }
                    this.remoteAttack(target, isSpecial);
                }, () => {
                    this.specialStep.IsExcuting = false;
                    this.sc.isAttacking = false;
                }, target, this.specialStep.IsExcuting, false, false);
            }, this.data.remote, true);
        }

    }
    dodge(pos: cc.Vec3) {
        if (this.isPassive) {
            return;
        }
        this.sc.isDodging = true;
        let speed = this.data.FinalCommon.moveSpeed;
        this.move(pos, speed * 2.5);
        this.scheduleOnce(() => { this.sc.isDodging = false; }, 0.1);

    }
    updateLogic(dt: number) {
        if (!this.dungeon) {
            return;
        }
        this.stateMachine.update();
        //修正位置
        this.node.position = Dungeon.fixOuterMap(this.node.position);
        this.pos = Dungeon.getIndexInMap(this.node.position);
        this.changeZIndex();

        this.updateAttack();
        let target = ActorUtils.getNearestEnemyActor(this, this.data.isEnemy > 0, this.dungeon);
        let targetDis = ActorUtils.getNearestTargetDistance(this, target);
        //靠近取消伪装
        if (this.data.disguise > 0 && targetDis < this.data.disguise && this.sc.isDisguising) {
            this.sc.isDisguising = false;
        }
        //闪烁
        if (this.data.blink > 0 && !this.sc.isBlinking) {
            this.blinkStep.next(() => {
                this.sc.isBlinking = true;
            }, this.data.blink, true)
        }

        //冲刺
        let speed = this.data.FinalCommon.moveSpeed;
        if (target && targetDis < 600 && targetDis > 100 && !target.sc.isDied && !target.invisible && this.data.dash > 0
            && !this.isPassive) {
            this.dashStep.next(() => {
                this.sc.isDashing = true;
                this.enterWalk();
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MELEE } });
                this.showAttackEffect(true);
                this.move(this.getMovePosFromTarget(target), speed);
                this.scheduleOnce(() => { if (this.node) { this.sc.isDashing = false; } }, 2);
            }, this.data.dash);
        }
        if (this.data.isFollow > 0 && this.data.isEnemy < 1 && this.dungeon.isClear) {
            targetDis = ActorUtils.getNearestTargetDistance(this, this.dungeon.player);
        }
        let isTracking = targetDis < 500 && targetDis > 64 && this.data.melee > 0;
        if (targetDis < 500 && targetDis > 300 && this.data.remote > 0) {
            isTracking = true;
        }
        if (target && target.invisible) {
            isTracking = false;
        }

        let needStop = (this.data.melee > 0 && targetDis < 60) || (this.data.remote > 0 && this.data.melee <= 0 && targetDis < 300);
        if (!this.shooter.isAiming && targetDis > 64 * this.node.scaleY && !this.isPassive && !needStop) {
            if (this.sc.isMoving && isTracking || !this.sc.isMoving) {
                this.moveStep.next(() => {
                    this.sc.isMoving = true;
                    let pos = cc.v3(0, 0);
                    pos.x += Logic.getRandomNum(0, 400) - 200;
                    pos.y += Logic.getRandomNum(0, 400) - 200;
                    if (isTracking) {
                        pos = this.getMovePosFromTarget(target);
                    }
                    this.move(pos, isTracking ? speed * 0.5 : speed);
                }, isTracking ? 0 : 2, true);
            }

        }

        //隐匿
        if (this.data.invisible > 0 && this.sprite.opacity > 20) {
            this.sprite.opacity = this.lerp(this.sprite.opacity, 19, dt * 3);
        }
        this.dashlight.opacity = 0;
        if (this.dungeon && this.sc.isDashing) {
            this.dashlight.opacity = 128;
        }
        if (this.sc.isDashing) {
            this.setLinearVelocity(this.currentlinearVelocitySpeed);
        }
        if (this.rigidbody.linearVelocity.equals(cc.Vec2.ZERO)) {
            this.sc.isMoving = false;
        }

        this.healthBar.node.opacity = this.sc.isDisguising ? 0 : 255;
        if (this.shadow) {
            this.shadow.opacity = this.sc.isDisguising ? 0 : 128;
        }
        if (this.sc.isDisguising && this.anim) { this.anim.pause(); }
        if (this.data.invisible > 0) {
            this.healthBar.node.opacity = this.sprite.opacity > 20 ? 255 : 9;
        }
        this.healthBar.node.active = !this.sc.isDied;
        let sn = this.getScaleSize();
        this.node.scaleX = this.isFaceRight ? sn : -sn;
        this.node.scaleY = sn;

        this.healthBar.node.scaleX = this.node.scaleX > 0 ? 1 : -1;
        //防止错位
        this.healthBar.node.x = -30 * this.node.scaleX;
        this.healthBar.node.y = this.data.boxType == 3 || this.data.boxType == 5 ? 150 : 120;
        //变异为紫色
        this.healthBar.progressBar.barSprite.node.color = this.isVariation ? cc.color(128, 0, 128) : cc.color(194, 0, 0);
        this.healthBar.progressBar.barSprite.node.color = this.killPlayerCount > 0 ? cc.color(255, 215, 0) : this.healthBar.progressBar.barSprite.node.color;

        this.dashlight.color = this.isVariation ? cc.color(0, 0, 0) : cc.color(255, 255, 255);
        if (this.attrNode) {
            this.attrNode.opacity = this.healthBar.node.opacity;
        }

    }
    getMovePosFromTarget(target: Actor): cc.Vec3 {
        let newPos = cc.v3(1, 0);
        if (target) {
            newPos = target.node.position.clone();
        }
        newPos = Dungeon.getIndexInMap(newPos);
        if (newPos.x > this.pos.x) {
            newPos = newPos.addSelf(cc.v3(1, 0));
        } else {
            newPos = newPos.addSelf(cc.v3(-1, 0));
        }
        let pos = Dungeon.getPosInMap(newPos);
        if (this.data.isFollow > 0 && this.data.isEnemy < 1 && this.dungeon.isClear) {
            pos = ActorUtils.getPlayerPosition(this, this.dungeon);
            target = this.dungeon.player;
        }
        pos = pos.sub(this.node.position);
        if (!this.sc.isAttacking && !this.sc.isDisguising && this.data.isHeavy < 1) {
            this.changeFaceRight(target);
        }
        return pos;
    }
    changeFaceRight(target: Actor) {
        let pos = target.node.position.clone();
        pos = pos.sub(this.node.position);
        let h = pos.x;
        this.isFaceRight = h >= 0;
    }
    lerp(a, b, r) {
        return a + (b - a) * r;
    };
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let target = ActorUtils.getEnemyCollisionTarget(other, this.data.isEnemy < 1);
        if (target && this.sc.isDashing && this.dungeon && !this.sc.isHurting && !this.sc.isFalling && !this.sc.isDied) {
            this.sc.isDashing = false;
            this.setLinearVelocity(cc.Vec2.ZERO);
            let from = FromData.getClone(this.data.nameCn, this.data.resName + 'anim000', this.seed);
            if (target.takeDamage(this.data.getAttackPoint(), from, this)) {
                this.addPlayerStatus(target, from);
            }
        }
    }

    takeDizz(dizzDuration: number) {
        if (dizzDuration > 0) {
            this.sc.isDizzing = true;
            this.scheduleOnce(() => {
                this.sc.isDizzing = false;
            }, dizzDuration)
        }
    }

    getScaleSize(): number {
        let scaleNum = this.data.sizeType && this.data.sizeType > 0 ? this.data.sizeType : 1;
        let sn = this.isVariation ? NonPlayer.SCALE_NUM * scaleNum : scaleNum;
        return sn;
    }

    actorName() {
        return this.data.nameCn;
    }


    /**出场动作 */
    public enterShow() {
        this.sprite.stopAllActions();
        this.bodySprite.node.color = cc.Color.BLACK;
        cc.tween(this.bodySprite.node).to(2, { color: cc.color(255, 255, 255).fromHEX(this.data.bodyColor) }).call(() => { this.sc.isShow = true; }).start();
    }
    /**伪装 */
    public enterDisguise() {
        this.sc.isShow = true;
        this.sprite.stopAllActions();
        if (this.anim.getAnimationState("MonsterIdle").isPlaying) {
            this.anim.pause();
        }
        this.changeBodyRes(this.data.resName, NonPlayer.RES_DISGUISE);
    }

    /**等待 */
    public enterIdle() {
        //重置所有状态
        this.sc = new StateContext();
        this.sc.isShow = true;
        let action = cc.tween()
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, NonPlayer.RES_IDLE000) })
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, NonPlayer.RES_IDLE001) });
        this.sprite.stopAllActions();
        this.setLinearVelocity(cc.Vec2.ZERO);
        cc.tween(this.sprite).repeatForever(action).start();
        this.anim.play('MonsterIdle');
        this.dangerBox.finish();
    }
    /** 移动*/
    public enterWalk() {
        let action = cc.tween()
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, NonPlayer.RES_WALK00) })
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, NonPlayer.RES_WALK01) })
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, NonPlayer.RES_WALK02) })
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, NonPlayer.RES_WALK03) });
        this.sprite.stopAllActions();
        cc.tween(this.sprite).repeatForever(action).start();
        this.anim.play('MonsterIdle');
    }
    /**眩晕 */
    public enterDizz() {
        this.sprite.stopAllActions();
    }
    /**闪烁 */
    public enterBlink() {
        this.setLinearVelocity(cc.Vec2.ZERO);
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.BLINK } });
        let body = this.bodySprite.node;
        cc.tween(body).to(0.2, { opacity: 0 }).call(() => {
            let newPos = ActorUtils.getNearestEnemyPosition(this, true, this.dungeon, true);
            newPos = Dungeon.getIndexInMap(newPos);
            if (newPos.x > this.pos.x) {
                newPos = newPos.addSelf(cc.v3(1, 0));
            } else {
                newPos = newPos.addSelf(cc.v3(-1, 0));
            }
            let pos = Dungeon.getPosInMap(newPos);
            this.node.setPosition(pos);
        }).to(0.2, { opacity: 255 }).call(() => { this.sc.isBlinking = false; }).start();
    }
    moveTimeDelay = 0;
    isMoveTimeDelay(dt: number, delta: number): boolean {
        this.moveTimeDelay += dt;
        if (this.moveTimeDelay > delta) {
            this.moveTimeDelay = 0;
            return true;
        }
        return false;
    }

    /**摔倒 */
    public enterFall() {
        this.bodySprite.node.angle = this.isPlayerBehindAttack() ? -75 : 105;
        this.anim.play('MonsterFall');
    }


    updateStatus(statusData: StatusData): void {
        this.data.StatusTotalData.valueCopy(statusData);
    }
    hideSelf(hideDuration: number): void {
    }
    updateDream(offset: number): number {
        return 0;
    }
}
