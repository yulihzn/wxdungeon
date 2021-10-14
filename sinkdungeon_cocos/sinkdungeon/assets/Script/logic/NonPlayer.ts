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
import StatusManager from '../manager/StatusManager';
import DamageData from '../data/DamageData';
import FloatinglabelManager from '../manager/FloatingLabelManager';
import Random from '../utils/Random';
import NextStep from '../utils/NextStep';
import Item from '../item/Item';
import Actor from '../base/Actor';
import Achievement from './Achievement';
import AudioPlayer from '../utils/AudioPlayer';
import SpecialManager from '../manager/SpecialManager';
import FromData from '../data/FromData';
import IndexZ from '../utils/IndexZ';
import AreaOfEffect from '../actor/AreaOfEffect';
import AreaOfEffectData from '../data/AreaOfEffectData';
import ActorAttackBox from '../actor/ActorAttackBox';
import StateMachine from '../base/fsm/StateMachine';
import State from '../base/fsm/State';
import DefaultStateMachine from '../base/fsm/DefaultStateMachine';
import NonPlayerActorState from '../actor/NonPlayerActorState';
import StateContext from '../base/StateContext';
import NonPlayerData from '../data/NonPlayerData';
import { ColliderTag } from '../actor/ColliderTag';
import StatusData from '../data/StatusData';
import ActorUtils from '../utils/ActorUtils';
import CCollider from '../collider/CCollider';
import { MoveComponent } from '../ecs/component/MoveComponent';

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
    defautPos: cc.Vec3 = cc.v3(0, 0);

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
    @property(cc.Node)
    boxcover:cc.Node = null;
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
    leftLifeTime = 0;
    parentNonPlayer: NonPlayer;//父类npc
    childNonPlayerList: NonPlayer[] = [];//子类

    public stateMachine: StateMachine<NonPlayer, State<NonPlayer>>;
    get IsVariation() {
        return this.isVariation || this.data.StatusTotalData.variation > 0;
    }
    onLoad() {
        
        this.initCollider();
        this.graphics = this.getComponent(cc.Graphics);
        this.sc.isAttacking = false;
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
        this.bodySprite = this.sprite.getChildByName('body').getComponent(cc.Sprite);
        this.mat = this.bodySprite.getComponent(cc.Sprite).getMaterial(0);
        this.boxCollider = this.getComponent(cc.BoxCollider);
        this.node.scale = this.getScaleSize();
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
        if (this.data.isStatic > 0) {
            this.rigidbody.type = cc.RigidBodyType.Static;
            this.entity.remove(MoveComponent);
        }
        this.dangerBox.init(this, this.dungeon, this.data.isEnemy > 0);
        this.dangerTips.opacity = 0;
        this.specialStep.init();
        this.stateMachine = new DefaultStateMachine(this, NonPlayerActorState.PRPARE, NonPlayerActorState.GLOBAL);
        // this.graphics.strokeColor = cc.Color.ORANGE;
        // this.graphics.circle(0,0,100);
        // this.graphics.stroke();
        // this.graphics.strokeColor = cc.Color.RED;
        // this.graphics.circle(0,0,80);
        // this.graphics.stroke();
        
    }
   
    start() {
        this.changeZIndex();
        this.healthBar.refreshHealth(this.data.getHealth().x, this.data.getHealth().y);
        if (this.data.lifeTime > 0) {
            let lifeTimeStep = new NextStep();
            this.leftLifeTime = this.data.lifeTime;
            lifeTimeStep.next(() => { }, this.data.lifeTime, true, () => {
                this.leftLifeTime--;
                if (this.leftLifeTime <= 0 && this.data) {
                    this.data.currentHealth = 0;
                }
            })
        }
        this.addSaveStatusList();
        this.entity.Transform.position = this.node.position;
        this.entity.NodeRender.node = this.node;
        this.entity.Move.linearDamping = 2;
        this.entity.Move.linearVelocity = cc.v2(0,0);
    }
    /**挨打光效 */
    private hitLightS(damage: DamageData) {
        let show = true;
        let resName = 'hitlight1';
        let scale = 8;
        let punchNames = [AudioPlayer.PUNCH, AudioPlayer.PUNCH1, AudioPlayer.PUNCH2];
        let swordhitNames = [AudioPlayer.SWORD_HIT, AudioPlayer.SWORD_HIT1, AudioPlayer.SWORD_HIT2];
        if (damage.isFist) {
            resName = Logic.getHalfChance() ? 'hitlight1' : 'hitlight2';
            AudioPlayer.play(punchNames[Logic.getRandomNum(0, 2)]);
        } else if (damage.isRemote) {
            resName = Logic.getHalfChance() ? 'hitlight9' : 'hitlight10';
        } else if (damage.isBlunt) {
            resName = Logic.getHalfChance() ? 'hitlight3' : 'hitlight4';
            scale = damage.isFar ? 10 : 8;
            AudioPlayer.play(swordhitNames[Logic.getRandomNum(0, 2)]);
        } else if (damage.isMelee) {
            AudioPlayer.play(swordhitNames[Logic.getRandomNum(0, 2)]);
            if (damage.isStab) {
                resName = Logic.getHalfChance() ? 'hitlight5' : 'hitlight6';
                scale = damage.isFar ? 10 : 8;
            } else {
                resName = Logic.getHalfChance() ? 'hitlight7' : 'hitlight8';
                scale = damage.isFar ? 10 : 8;
            }
        } else {
            show = false;
        }
        if (show) {
            this.hitLightSprite.node.stopAllActions();
            this.hitLightSprite.spriteFrame = Logic.spriteFrameRes(resName);
            this.hitLightSprite.node.opacity = 220;
            this.hitLightSprite.node.color = cc.Color.WHITE;
            this.hitLightSprite.node.scale = damage.isCriticalStrike ? scale : scale + 3;
            cc.tween(this.hitLightSprite.node).delay(0.2).to(0.3, { opacity: 0, color: cc.Color.BLACK }).to(0.3, { opacity: 0 }).start();
        }

    }
    /**加载保存的状态 */
    private addSaveStatusList() {
        if (this.statusManager) {
            this.statusManager.addStatusListFromSave(this.data.StatusList);
        }
    }
    /**高亮 */
    private hitLight(isHit: boolean) {
        if (!this.mat) {
            this.mat = this.node.getChildByName('sprite').getChildByName('body')
                .getComponent(cc.Sprite).getMaterial(0);
        }
        this.mat.setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
    }
    /**添加随机属性图标 */
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
    /**
     * 显示攻击叹号
     */
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
            this.bodySprite.node.width = spriteFrame.getOriginalSize().width;
            this.bodySprite.node.height = spriteFrame.getOriginalSize().height;
        } else {
            this.bodySprite.spriteFrame = null;
        }
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
        this.entity.Transform.position = this.node.position;
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
            if (this.IsVariation) {
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
        let speedScale = 1 - this.data.FinalCommon.attackSpeed / 1000;
        if (speedScale < 0.5) {
            speedScale = 0.5;
        }
        if (speedScale > 2) {
            speedScale = 2;
        }
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
            stabDelay = 0.8 * speedScale;
        }
        const beforetween = cc.tween().delay(0.5 * speedScale).call(() => { if (before) { before(isSpecial); } })

        //摇晃
        const shaketween = cc.tween().by(0.1, { position: cc.v3(5, 0) }).by(0.1, { position: cc.v3(-5, 0) })
            .by(0.1, { position: cc.v3(5, 0) }).by(0.1, { position: cc.v3(-5, 0) })
            .by(0.1, { position: cc.v3(5, 0) }).by(0.1, { position: cc.v3(-5, 0) })
            .by(0.1, { position: cc.v3(5, 0) }).by(0.1, { position: cc.v3(-5, 0) });

        const arrattack: string[] = [`anim009`];
        const arrspecial: string[] = [];
        let frameIndex = 0;
        const attackKeyStart = isSpecial ? this.data.specialFrameKeyStart : this.data.attackFrameKeyStart;
        const attackKeyEnd = isSpecial ? this.data.specialFrameKeyEnd : this.data.attackFrameKeyEnd;
        while (frameIndex < this.data.attackFrames - 1) {
            arrattack.push(`anim0${10 + frameIndex++}`);
        }
        for (let i = 0; i < this.data.specialFrames; i++) {
            arrspecial.push(`anim0${10 + frameIndex++}`);
        }
        const arr = isSpecial ? arrspecial : arrattack;
        //攻击准备动画
        const _attacktweenprepare = cc.tween().delay(0);
        for (let i = 0; i < attackKeyStart; i++) {
            _attacktweenprepare.then(cc.tween().delay(0.2 * speedScale).call(() => { this.changeBodyRes(this.data.resName, arr[i]); }));
        }
        //攻击开始动画
        const _attacktweenstart = cc.tween().delay(0);
        for (let i = attackKeyStart; i < attackKeyEnd; i++) {
            _attacktweenstart.then(cc.tween().delay(0.2 * speedScale).call(() => { this.changeBodyRes(this.data.resName, arr[i]); }));
        }
        //攻击结束动画
        const _attacktweenend = cc.tween().delay(0);
        for (let i = attackKeyEnd; i < arr.length; i++) {
            _attacktweenend.then(cc.tween().delay(0.2 * speedScale).call(() => { this.changeBodyRes(this.data.resName, arr[i]); }));
        }
        //退后
        const backofftween = cc.tween().by(0.5 * speedScale, { position: cc.v3(-pos.x / 8, -pos.y / 8) }).delay(stabDelay);
        //前进
        const forwardtween = cc.tween().by(0.2 * speedScale, { position: cc.v3(pos.x, pos.y) }).delay(stabDelay);
        const specialTypeCanMelee = this.data.specialType.length <= 0
            || this.data.specialType == SpecialManager.AFTER_ASH;
        const attackpreparetween = cc.tween().call(() => {
            //展示近战提示框
            if (isMelee && !isSpecial || (isSpecial && isMelee && specialTypeCanMelee)) {
                this.dangerBox.show(this.data.attackType, isSpecial, this.data.boxType == 5, pos);
            }
            if (isSpecial) {
                //展示特殊冲刺提示框
                if (this.data.specialDash > 0) {
                    this.dangerBox.show(ActorAttackBox.ATTACK_STAB, false, false, pos);
                }
                //延迟添加特殊物体
                this.scheduleOnce(() => {
                    if (!this.sc.isDied) {
                        this.specialManager.dungeon = this.dungeon;
                        this.specialManager.addEffect(this.data.specialType, this.data.specialDistance, this.isFaceRight, FromData.getClone(this.data.nameCn, this.data.resName + 'anim000', this.seed), this.IsVariation);
                    }
                }, this.data.specialDelay);
            }
        });
        const attackingtween = cc.tween().call(() => {
            //隐藏近战提示
            this.dangerBox.hide(isMiss);
            //普通冲刺
            if (isMelee && !isSpecial || isSpecial && this.data.specialType.length <= 0) {
                if (this.data.attackType == ActorAttackBox.ATTACK_STAB) {
                    this.move(cc.v3(this.isFaceRight ? this.dangerBox.hv.x : -this.dangerBox.hv.x, this.dangerBox.hv.y), isSpecial ? 600 : 300);
                }
            }
            if (isSpecial) {
                //特殊冲刺
                if (this.data.specialDash > 0) {
                    this.move(cc.v3(this.isFaceRight ? this.dangerBox.hv.x : -this.dangerBox.hv.x, this.dangerBox.hv.y), this.data.specialDash);
                }
                //延迟添加特殊物体
                this.scheduleOnce(() => {
                    this.specialManager.dungeon = this.dungeon;
                    this.specialManager.addPlacement(this.data.specialType, this.data.specialDistance, this.isFaceRight, FromData.getClone(this.data.nameCn, this.data.resName + 'anim000', this.seed), this.IsVariation);
                }, this.data.specialDelay);
            }
            if (attacking) {
                attacking(isSpecial);
            }
        });
        const attackback = cc.tween().call(() => {
            this.dangerBox.finish();
        });
        const attackfinish = cc.tween().delay(0.2 * speedScale).call(() => {
            this.dangerBox.finish();
            this.changeBodyRes(this.data.resName, NonPlayer.RES_IDLE000);
            this.setLinearVelocity(cc.Vec2.ZERO);
        });
        const aftertween = cc.tween().to(0.2 * speedScale, { position: cc.v3(0, 0) }).delay(0.2 * speedScale).call(() => {
            if (finish) { finish(isSpecial); }
        })
        //普通近战 准备 退后且帧动画 出击前进且帧动画 回招且帧动画 结束
        const normalMelee = cc.tween().then(attackpreparetween).then(_attacktweenprepare).then(backofftween)
            .parallel(attackingtween, _attacktweenstart, forwardtween)
            .parallel(attackback, _attacktweenend).then(attackfinish);
        //普通远程 准备 帧动画 延迟出击 回招且帧动画 结束
        const normalRemote = cc.tween().then(attackpreparetween).then(_attacktweenprepare)
            .parallel(attackingtween, _attacktweenstart)
            .parallel(attackback, _attacktweenend).then(attackfinish);
        //特殊近战 准备 退后 摇晃 出击 前进 回招 结束
        const specialMelee = cc.tween().then(attackpreparetween).then(_attacktweenprepare).then(backofftween).then(shaketween)
            .parallel(attackingtween, _attacktweenstart, forwardtween)
            .parallel(attackback, _attacktweenend).then(attackfinish);
        //特殊远程 准备 摇晃 出击 回招 结束
        const specialRemote = cc.tween().then(attackpreparetween).parallel(shaketween, _attacktweenprepare)
            .parallel(attackingtween, _attacktweenstart).parallel(attackback, _attacktweenend).then(attackfinish);

        let allAction = cc.tween().then(beforetween).then(isMelee ? normalMelee : normalRemote).then(aftertween);
        if (isSpecial) {
            this.showDangerTips();
            AudioPlayer.play(this.data.specialAudio);
            allAction = cc.tween().then(beforetween).then(specialRemote).then(aftertween);
            if (isMelee && specialTypeCanMelee) {
                allAction = cc.tween().then(beforetween).then(specialMelee).then(aftertween);
            }
        }
        cc.tween(this.sprite).then(allAction).start();
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
        this.entity.Move.linearVelocity = this.currentlinearVelocitySpeed.clone();
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
        AudioPlayer.play(AudioPlayer.BLEEDING);
        if (this.data.isStatic > 0 || this.data.isHeavy > 0 || this.IsVariation) {
            return;
        }
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
        //处于特殊攻击状态和非近战伤害情况下不改变状态
        this.sc.isHurting = isHurting && !this.specialStep.IsExcuting && damageData.isMelee;
        if (this.sc.isHurting) {
            this.sc.isDisguising = false;
            this.sc.isAttacking = false;
            this.setLinearVelocity(cc.Vec2.ZERO);
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
            let hitNames = [AudioPlayer.MONSTER_HIT, AudioPlayer.MONSTER_HIT1, AudioPlayer.MONSTER_HIT2];
            AudioPlayer.play(hitNames[Logic.getRandomNum(0, 2)]);
            this.hitLight(true);
            this.hitLightS(damageData);
            if (damageData.isBackAttack) {
                this.showBloodEffect();
            }
            //150ms后恢复状态
            this.scheduleOnce(() => {
                if (this.node) {
                    this.hitLight(false);
                    this.resetBodyColor();
                    if (this.sc.isHurting) {
                        this.sc.isHurting = false;
                        this.anim.resume();
                    }
                }
            }, 0.15);
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
    addCustomStatus(data: StatusData, from: FromData) {
        if (!this.node || this.sc.isDied) {
            return;
        }
        this.statusManager.addCustomStatus(data, from);
    }
    stopAllDebuffs() {
        if (!this.node) {
            return;
        }
        this.statusManager.stopAllDebuffs();
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
        if (this.data.isEnemy > 0 && this.data.noLoot < 1) {
            this.getLoot();
        }
        Achievement.addMonsterKillAchievement(this.data.resName);
        Logic.setKillPlayerCounts(FromData.getClone(this.actorName(), this.data.resName + 'anim000', this.seed), false);
        this.scheduleOnce(() => {
            if (this.node) {
                if (this.data.isBoom > 0) {
                    let boom = cc.instantiate(this.boom).getComponent(AreaOfEffect);
                    if (boom) {
                        boom.show(this.node.parent, this.node.position, cc.v3(1, 0), 0, new AreaOfEffectData().init(1, 0.2, 0, 0, IndexZ.OVERHEAD, this.data.isEnemy > 0
                            , true, true, false, false, new DamageData(2), FromData.getClone('爆炸', 'boom000anim004'), []));
                        AudioPlayer.play(AudioPlayer.BOOM);
                        cc.director.emit(EventHelper.CAMERA_SHAKE, { detail: { isHeavyShaking: true } });
                    }
                }
                this.scheduleOnce(() => { this.node.active = false; }, this.data.isPet ? 0 : 5);
            }
        }, 2);
    }
    getLoot() {
        let rand4save = Logic.mapManager.getRandom4Save(Logic.mapManager.getRebornSeed(this.seed));
        let rand = rand4save.rand();
        let percent = 0.75;
        if (this.IsVariation) {
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
            let count = 1;
            if (this.IsVariation) {
                count = 2;
            }
            if (this.killPlayerCount > 0) {
                count = 5;
            }
            if (this.dungeon.player.data.StatusTotalData.exOilGold > 0) {
                count += this.dungeon.player.data.StatusTotalData.exOilGold;
            }
            EventHelper.emit(EventHelper.DUNGEON_ADD_OILGOLD, { pos: this.node.position, count: count });
            if (rand < percent) {
                EventHelper.emit(EventHelper.DUNGEON_ADD_COIN, { pos: this.node.position, count: rand4save.getRandomNum(1, 10) });
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
        let target = ActorUtils.getNearestEnemyActor(this.node.position, this.data.isEnemy > 0, this.dungeon);
        let targetDis = ActorUtils.getTargetDistance(this, target);
        //目标不存在、死亡或者隐身直接返回
        if (!ActorUtils.isTargetAlive(target)) {
            return;
        }
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
        let canMelee = this.data.melee > 0 && targetDis < range * this.node.scaleY;
        let canRemote = this.data.remote > 0 && targetDis < 600 * this.node.scaleY;
        if (canMelee && !this.meleeStep.IsInCooling) {
            this.meleeStep.next(() => {
                this.changeFaceRight(target);
                this.setLinearVelocity(cc.Vec2.ZERO);
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
        } else if (canRemote) {
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
        this.entity.Transform.position = this.node.position;
        this.pos = Dungeon.getIndexInMap(this.node.position);
        this.changeZIndex();
        this.updateAttack();
        let target = ActorUtils.getNearestEnemyActor(this.node.position, this.data.isEnemy > 0, this.dungeon);
        let targetDis = ActorUtils.getTargetDistance(this, target);
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
        if (this.data.dash > 0 && !this.isPassive && ActorUtils.isTargetAlive(target) && targetDis < 600 && targetDis > 100) {
            this.dashStep.next(() => {
                this.sc.isDashing = true;
                this.enterWalk();
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MELEE } });
                this.showAttackEffect(true);
                this.move(this.getMovePosFromTarget(target), speed);
                this.scheduleOnce(() => { if (this.node) { this.sc.isDashing = false; } }, 2);
            }, this.data.dash);
        }

        //是否追踪目标
        let isTracking = targetDis < 500 && this.data.melee > 0;
        if (targetDis < 500 && targetDis > 300 && this.data.remote > 0) {
            isTracking = true;
        }
        if (!ActorUtils.isTargetAlive(target)) {
            isTracking = false;
        }

        //npc移动在没有敌对目标的时候转变目标为玩家
        if (!isTracking && this.data.isFollow > 0 && this.data.isEnemy < 1) {
            target = this.dungeon.player;
            targetDis = ActorUtils.getTargetDistance(this, this.dungeon.player);
            isTracking = true;
        }

        //相隔指定长度的时候需要停下来，否则执行移动操作

        if (!this.isPassive) {
            let needStop = (this.data.melee > 0 && targetDis < 64)
                || (this.data.remote > 0 && this.data.melee <= 0 && targetDis < 300)
                || this.shooter.isAiming;
            if (needStop) {
                this.sc.isMoving = false;
            } else {
                this.moveStep.next(() => {
                    this.sc.isMoving = true;
                    //随机选取位置，如果在追踪选择目标位置
                    let pos = cc.v3(0, 0);
                    pos.x += Logic.getRandomNum(0, 400) - 200;
                    pos.y += Logic.getRandomNum(0, 400) - 200;
                    if (isTracking) {
                        pos = this.getMovePosFromTarget(target);
                    }
                    if (this.data.flee > 0) {
                        pos = this.getMovePosFromTarget(target, true);
                        pos = cc.v3(-pos.x, -pos.y);
                    }
                    this.move(pos, isTracking ? speed * 0.5 : speed);
                }, isTracking ? 0.5 : 2, true);
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
        if (this.rigidbody.linearVelocity.equals(cc.Vec2.ZERO) && !this.isPassive) {
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
        this.healthBar.progressBar.barSprite.node.color = this.IsVariation ? cc.color(128, 0, 128) : cc.color(194, 0, 0);
        this.healthBar.progressBar.barSprite.node.color = this.killPlayerCount > 0 ? cc.color(255, 215, 0) : this.healthBar.progressBar.barSprite.node.color;

        this.dashlight.color = this.IsVariation ? cc.color(0, 0, 0) : cc.color(255, 255, 255);
        if (this.attrNode) {
            this.attrNode.opacity = this.healthBar.node.opacity;
        }
        if (this.data.isTest > 0 && this.isTestResetTimeDelay(dt) && !this.isPassive) {
            this.pos = this.defautPos.clone();
            this.updatePlayerPos();
        }
        if (this.parentNonPlayer) {
            this.graphics.clear();
            this.graphics.strokeColor = cc.color(0, 255, 0, 128);
            this.graphics.lineWidth = 5;
            if (this.parentNonPlayer.data.childMode == 0 && this.parentNonPlayer.sc.isDied) {
                this.data.currentHealth = 0;
            } else {
                this.graphics.moveTo(0, 32);
                let pos = cc.v3(this.parentNonPlayer.node.position.x - this.node.position.x, this.parentNonPlayer.node.position.y - this.node.position.y);
                this.graphics.lineTo(this.node.scaleX > 0 ? pos.x : -pos.x, pos.y + 32);
                this.graphics.stroke();
            }
        }
        if (this.data.childMode == 1 && this.childNonPlayerList.length > 0) {
            let count = 0;
            for (let n of this.childNonPlayerList) {
                if (n.sc.isDied) {
                    count++;
                }
            }
            if (count == this.childNonPlayerList.length) {
                this.data.currentHealth = 0;
            }
        }

    }
    getMovePosFromTarget(target: Actor, isFlee?: boolean): cc.Vec3 {
        let newPos = cc.v3(0, 0);
        newPos.x += Logic.getRandomNum(0, 400) - 200;
        newPos.y += Logic.getRandomNum(0, 400) - 200;
        if (!ActorUtils.isTargetAlive(target)) {
            return newPos;
        }
        newPos = target.node.position.clone();
        if (isFlee) {//保证逃跑的时候不碰到死角
            if (newPos.y > this.node.position.y) {
                newPos = newPos.addSelf(cc.v3(0, -128));
            } else {
                newPos = newPos.addSelf(cc.v3(0, 128));
            }
            if (newPos.x > this.node.position.x) {
                newPos = newPos.addSelf(cc.v3(-64, 0));
            } else {
                newPos = newPos.addSelf(cc.v3(64, 0));
            }
        }
        if (newPos.x > this.node.position.x) {
            newPos = newPos.addSelf(cc.v3(32, 0));
        } else {
            newPos = newPos.addSelf(cc.v3(-32, 0));
        }

        let pos = newPos.sub(this.node.position);
        if (!this.sc.isAttacking && !this.sc.isDisguising && this.data.isStatic < 1) {
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
        let scaleNum = this.data.scale && this.data.scale > 0 ? this.data.scale : 1;
        let sn = this.IsVariation ? NonPlayer.SCALE_NUM * scaleNum : scaleNum;
        return sn;
    }

    actorName() {
        return this.data.nameCn;
    }


    /**出场动作 */
    public enterShow() {
        this.sprite.stopAllActions();
        this.bodySprite.node.color = cc.Color.BLACK;
        cc.tween(this.bodySprite.node).to(1, { color: cc.color(255, 255, 255).fromHEX(this.data.bodyColor) }).call(() => {
            this.sc.isShow = true;

        }).start();
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
            let newPos = ActorUtils.getNearestEnemyPosition(this.node.position, true, this.dungeon, true);
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
    isTestResetTimeDelay(dt: number): boolean {
        this.moveTimeDelay += dt;
        if (this.moveTimeDelay > 10) {
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


    updateStatus(statusList: StatusData[], totalStatusData: StatusData): void {
        this.data.StatusTotalData.valueCopy(totalStatusData);
        this.data.StatusList = statusList;
    }
    hideSelf(hideDuration: number): void {
    }
    updateDream(offset: number): number {
        return 0;
    }

    onColliderEnter(other: CCollider, self: CCollider): void {
        this.boxcover.color = cc.Color.RED;
        this.boxcover.opacity = 128;
        cc.log(`nonplayer enter`);
    }
    onColliderStay(other: CCollider, self: CCollider): void {
        this.boxcover.color = cc.Color.GREEN;
        this.boxcover.opacity = 128;
    }
    onColliderExit(other: CCollider, self: CCollider): void {
        this.boxcover.color = cc.Color.WHITE;
        this.boxcover.opacity = 128;
        cc.log(`nonplayer exit`);
    }
}
