// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
import Skill from './Utils/Skill';
import Item from './Item/Item';
import Actor from './Base/Actor';
import Achievements from './Achievement';
import AudioPlayer from './Utils/AudioPlayer';
import FromData from './Data/FromData';
import IndexZ from './Utils/IndexZ';
import NonPlayerData from './Data/NonPlayerData';
import ActorAttackBox from './Actor/ActorAttackBox';

@ccclass
export default class NonPlayer extends Actor {
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
    @property(ActorAttackBox)
    dangerBox: ActorAttackBox = null;
    private sprite: cc.Node;
    private bodySprite: cc.Sprite;
    private shadow: cc.Node;
    private anim: cc.Animation;
    private boxCollider: cc.BoxCollider;
    rigidbody: cc.RigidBody;
    isFaceRight = true;
    isMoving = false;
    isFall = false;
    isDizz = false;
    isHurt = false;
    private timeDelay = 0;
    data: NonPlayerData = new NonPlayerData();
    dungeon: Dungeon;
    shooter: Shooter = null;
    particleBlood: cc.ParticleSystem;
    effectNode: cc.Node;
    moveSkill = new Skill();
    remoteSkill = new Skill();
    meleeSkill = new Skill();
    isAttackAnimExcuting = false;
    mat: cc.MaterialVariant;
    animStatus = NonPlayer.ANIM_IDLE;
    isEnemy = false;
    isFollow = false;

    onLoad() {
        this.meleeSkill.IsExcuting = false;
        this.isShow = false;
        this.isDied = false;
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
        this.bodySprite = this.sprite.getChildByName('body').getComponent(cc.Sprite);
        this.mat = this.bodySprite.getComponent(cc.Sprite).getMaterial(0);
        this.boxCollider = this.getComponent(cc.BoxCollider);
        this.shadow = this.sprite.getChildByName('shadow');
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter);
        this.effectNode = this.node.getChildByName('Effect');
        this.particleBlood = this.node.getChildByName('Effect').getChildByName('blood').getComponent(cc.ParticleSystem);
        this.particleBlood.stopSystem();
        this.updatePlayerPos();
        this.playAnim(NonPlayer.ANIM_IDLE);
        this.scheduleOnce(() => { this.isShow = true; }, 1);
        this.resetBodyColor();
        this.dangerBox.init(this, this.dungeon,this.isEnemy);
        if (this.data.isHeavy > 0) {
            this.rigidbody.type = cc.RigidBodyType.Static;
        }
        this.isFollow = this.data.isFollow > 0;
        this.isEnemy = this.data.isEnemy > 0;
        if (this.data.lifeTime > 0) {
            this.scheduleOnce(() => { this.killed(); }, this.data.lifeTime)
        }
    }
    hitLight(isHit: boolean) {
        if (!this.mat) {
            this.mat = this.node.getChildByName('sprite').getChildByName('body')
                .getComponent(cc.Sprite).getMaterial(0);
        }
        this.mat.setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
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
        this.bodySprite.spriteFrame = spriteFrame;
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

    remoteAttack(actor: Actor) {
        if (!actor) {
            return;
        }
        this.remoteSkill.IsExcuting = false;
        let p = this.shooter.node.position.clone();
        p.x = this.shooter.node.scaleX > 0 ? p.x + 30 : -p.x - 30;
        let hv = actor.getCenterPosition().sub(this.node.position.add(p));
        if (!hv.equals(cc.Vec3.ZERO)) {
            hv = hv.normalizeSelf();
            this.shooter.setHv(hv);
            this.shooter.from.valueCopy(FromData.getClone(this.data.nameCn, this.data.resName));
            this.shooter.dungeon = this.dungeon;
            this.shooter.data.bulletArcExNum = this.data.bulletArcExNum;
            this.shooter.data.bulletLineExNum = this.data.bulletLineExNum;
            this.shooter.data.bulletLineInterval = this.data.bulletLineInterval;
            this.shooter.data.bulletType = this.data.bulletType ? this.data.bulletType : "bullet001";
            this.shooter.data.bulletExSpeed = this.data.bulletExSpeed;
            this.shooter.fireBullet(Logic.getRandomNum(0, 5) - 5, cc.v3(this.data.shooterOffsetX, this.data.shooterOffsetY));
        }
    }
    showAttackAnim(finish: Function, before: Function, actor: Actor, isMiss: boolean) {
        if (this.isAttackAnimExcuting || !actor) {
            return;
        }
        this.playAnim(NonPlayer.ANIM_ATTACK);
        this.isAttackAnimExcuting = true;
        let pos = actor.node.position.clone().sub(this.node.position);
        if (!pos.equals(cc.Vec3.ZERO)) {
            pos = pos.normalizeSelf();
        }
        this.anim.pause();
        if (pos.equals(cc.Vec3.ZERO)) {
            pos = cc.v3(1, 0);
        }
        pos = pos.normalizeSelf().mul(this.node.scaleX > 0 ? 48 : -48);
        this.sprite.stopAllActions();

        let beforeAction = cc.sequence(cc.delayTime(0.5), cc.callFunc(() => { if (before) { before(); } }));
        //普通近战
        let action1 = cc.sequence(cc.callFunc(() => {
            this.changeBodyRes(this.data.resName, NonPlayer.RES_ATTACK01);
            if (!this.dangerBox.dungeon) {
                this.dangerBox.init(this, this.dungeon,this.isEnemy);
            }
            this.dangerBox.show(this.data.attackType);
        }),
            cc.moveBy(0.5, -pos.x / 8, -pos.y / 8),
            cc.callFunc(() => {
                this.changeBodyRes(this.data.resName, NonPlayer.RES_ATTACK02);
                this.dangerBox.hide(isMiss);
                if (this.data.attackType == ActorAttackBox.ATTACK_STAB) {
                    this.move(this.dangerBox.hv.mul(this.dangerBox.node.width), 5000);
                }
            }),
            cc.moveBy(0.2, pos.x, pos.y), cc.callFunc(() => {
                this.dangerBox.finish();
            }));
        let afterAction = cc.sequence(cc.callFunc(() => {
            this.anim.resume();
            if (finish) { finish(); }
        }), cc.moveTo(0.2, 0, 0), cc.callFunc(() => {
            //这里防止不转向
            this.changeFaceRight();
            this.isAttackAnimExcuting = false;
            this.playAnim(NonPlayer.ANIM_IDLE);
        }));
        let allAction = cc.sequence(beforeAction, action1, afterAction);
        this.sprite.runAction(allAction);
    }
    private playAnim(status: number) {
        if (this.animStatus == status) {
            return;
        }
        this.animStatus = status;
        switch (status) {
            case NonPlayer.ANIM_IDLE: this.playIdle(); break;
            case NonPlayer.ANIM_WALK: this.playWalk(); break;
            case NonPlayer.ANIM_ATTACK: break;
            case NonPlayer.ANIM_HIT: this.playHit(); break;
            case NonPlayer.ANIM_DIED: this.playDied(); break;
        }
    }
    private playIdle() {
        let action = cc.tween()
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, NonPlayer.RES_IDLE000) })
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, NonPlayer.RES_IDLE001) });
        this.sprite.stopAllActions();
        this.isAttackAnimExcuting = false;
        cc.tween(this.sprite).repeatForever(action).start();
    }
    private playWalk() {
        let action = cc.tween()
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, NonPlayer.RES_WALK00) })
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, NonPlayer.RES_WALK01) })
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, NonPlayer.RES_WALK02) })
            .delay(0.2).call(() => { this.changeBodyRes(this.data.resName, NonPlayer.RES_WALK03) });
        this.sprite.stopAllActions();
        this.isAttackAnimExcuting = false;
        cc.tween(this.sprite).repeatForever(action).start();
    }
    private playHit() {
        this.changeBodyRes(this.data.resName, Logic.getHalfChance() ? NonPlayer.RES_HIT001 : NonPlayer.RES_HIT002);
    }
    private playDied() {
        this.sprite.stopAllActions();
        this.bodySprite.node.angle = 0;
        this.anim.play('MonsterDie');
        this.changeBodyRes(this.data.resName, NonPlayer.RES_HIT003);
    }

    //移动，返回速度
    move(pos: cc.Vec3, speed: number) {
        if (this.isDied || this.isFall || this.isHurt) {
            return;
        }
        if (pos.equals(cc.Vec3.ZERO)) {
            return;
        }
        let isDodge = false;
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
        this.isMoving = h != 0 || v != 0;
        if (this.isMoving && !this.isAttackAnimExcuting && this.data.isHeavy < 1) {
            this.isFaceRight = h >= 0;
        }
        this.playAnim(this.isMoving ? NonPlayer.ANIM_WALK : NonPlayer.ANIM_IDLE)
        this.changeZIndex();
    }

    start() {
        this.changeZIndex();
        this.healthBar.refreshHealth(this.data.getHealth().x, this.data.getHealth().y);
    }

    /**
     * 攻击目标是否背面朝着怪物
     */
    isFaceTargetBehind(target: Actor): boolean {
        let isPlayerRight = target.node.position.x > this.node.position.x;
        let isPlayerFaceRight = target.node.scaleX > 0;
        return (isPlayerRight && isPlayerFaceRight) || (!isPlayerRight && !isPlayerFaceRight);
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
        if (this.sprite.opacity < 200 && Logic.getRandomNum(1, 10) > 4) {
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
        this.meleeSkill.IsExcuting = false;
        this.remoteSkill.IsExcuting = false;
        this.isAttackAnimExcuting = false;
        if (dd.getTotalDamage() > 0) {
            this.playAnim(NonPlayer.ANIM_HIT);
        }
        this.sprite.stopAllActions();
        if (this.anim.getAnimationState("MonsterIdle").isPlaying) {
            this.anim.pause();
        }
        //100ms后修改受伤
        if (dd.getTotalDamage() > 0) {
            this.dangerBox.finish();
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
        this.playAnim(NonPlayer.ANIM_DIED);
        let collider: cc.PhysicsCollider = this.getComponent(cc.PhysicsCollider);
        collider.sensor = true;
        if (this.isEnemy) {
            this.getLoot();
        }
        Achievements.addMonsterKillAchievement(this.data.resName);
        this.scheduleOnce(() => { this.node.active = false; }, 5);
    }
    getLoot() {
        let rand4save = Logic.mapManager.getCurrentRoomRandom4Save();
        let rand = rand4save.rand();
        let percent = 0.8;
        let offset = 0.025;

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
        return this.node.position.clone().addSelf(cc.v3(0, 32 * this.node.scaleY));
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
        let target = this.getNearestEnemyActor(this.isEnemy, this.dungeon);
        let targetDis = this.getNearestTargetDistance(target);
        let pd = 100;
        let canMelee = false;
        let canRemote = false;
        canMelee = targetDis < pd * this.node.scaleY
            && !target.isDied
            && !target.invisible
            && target.isShow
            && this.data.melee > 0;
        canRemote = targetDis < 600 && this.data.remote > 0
            && this.shooter && !this.meleeSkill.IsExcuting && !target.invisible;
        let pos = newPos.clone();

        //近战
        if (canMelee) {
            this.meleeSkill.next(() => {
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MELEE } });
                this.meleeSkill.IsExcuting = true;
                let isMiss = Logic.getRandomNum(0, 100) < this.data.StatusTotalData.missRate;
                if (isMiss) {
                    this.showFloatFont(this.dungeon.node, 0, false, true, false, false);
                }
                this.showAttackAnim(() => {
                    this.meleeSkill.IsExcuting = false;
                }, () => { }, target, isMiss)

                this.sprite.opacity = 255;
            }, this.data.melee);

        }
        if (!canRemote && !canMelee) {
            if (this.isEnemy && !target.invisible) {
                pos = this.getMovePosFromTarget();
            } else if (!this.isEnemy && this.getNearestTargetDistance(this.dungeon.player) > 200) {
                pos = this.getMovePosFromTarget();
            }
        }
        //远程
        if (canRemote) {
            this.remoteSkill.next(() => {
                this.remoteSkill.IsExcuting = true;
                this.changeFaceRight();
                this.showAttackAnim(() => {
                    this.remoteAttack(target);
                }, () => {
                }, target, false);
                this.sprite.opacity = 255;
            }, this.data.remote, true);
        }
        let speed = this.data.FinalCommon.moveSpeed;
        if (!this.shooter.isAiming && targetDis > 64 * this.node.scaleY && !this.isAttackAnimExcuting) {
            this.move(pos, speed);
        }

    }
    getMovePosFromTarget(): cc.Vec3 {
        let pos = this.getNearestEnemyPosition(this.isEnemy, this.dungeon);
        if (this.isFollow && this.dungeon.getMonsterAliveNum() < 1) {
            pos = this.getPlayerPosition(this.dungeon);
        }
        pos = pos.sub(this.node.position);
        if (!this.isAttackAnimExcuting && !this.isAttackAnimExcuting) {
            this.changeFaceRight();
        }
        return pos;
    }
    changeFaceRight() {
        let pos = this.getNearestEnemyPosition(this.isEnemy, this.dungeon, 500);
        pos = pos.sub(this.node.position);
        let h = pos.x;
        this.isFaceRight = h >= 0;
    }
    lerp(a, b, r) {
        return a + (b - a) * r;
    };

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
        return scaleNum;
    }

    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.2) {
            this.timeDelay = 0;
            this.monsterAction();
        }
        if (this.isDied) {
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
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
    }
    actorName() {
        return this.data.nameCn;
    }
}