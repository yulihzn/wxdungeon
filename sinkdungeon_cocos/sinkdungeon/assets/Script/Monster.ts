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
import { EventConstant } from './EventConstant';
import HealthBar from './HealthBar';
import Logic from './Logic';
import MonsterData from './Data/MonsterData';
import Dungeon from './Dungeon';
import Shooter from './Shooter';
import Player from './Player';
import StatusManager from './Manager/StatusManager';
import DamageData from './Data/DamageData';
import FloatinglabelManager from './Manager/FloatingLabelManager';
import Random from './Utils/Random';
import Skill from './Utils/Skill';
import Item from './Item/Item';
import Actor from './Base/Actor';
import Achievements from './Achievement';
import EquipmentManager from './Manager/EquipmentManager';
import Boom from './Item/Boom';
import AudioPlayer from './Utils/AudioPlayer';

@ccclass
export default class Monster extends Actor {
    public static readonly RES_DISGUISE = 'disguise';//图片资源 伪装
    public static readonly RES_WALK01 = 'anim001';//图片资源 行走1
    public static readonly RES_WALK02 = 'anim002';//图片资源 行走2
    public static readonly RES_WALK03 = 'anim003';//图片资源 行走3
    public static readonly RES_ATTACK01 = 'anim004';//图片资源 准备攻击
    public static readonly RES_ATTACK02 = 'anim005';//图片资源 攻击

    static readonly SCALE_NUM = 1.5;
    @property(cc.Vec2)
    pos: cc.Vec2 = cc.v2(0, 0);

    @property(HealthBar)
    healthBar: HealthBar = null;
    @property(StatusManager)
    statusManager: StatusManager = null;
    @property(FloatinglabelManager)
    floatinglabelManager: FloatinglabelManager = null;
    @property(cc.Prefab)
    boom:cc.Prefab = null;
    @property(cc.Node)
    dangerZone:cc.Node = null;
    private sprite: cc.Node;
    private body: cc.Node;
    private shadow: cc.Node;
    private dashlight: cc.Node;
    private anim: cc.Animation;
    rigidbody: cc.RigidBody;
    graphics: cc.Graphics;
    isFaceRight = true;
    isMoving = false;
    // isAttacking = false;
    isDied = false;
    isFall = false;
    isShow = false;
    isDizz = false;
    private timeDelay = 0;
    data: MonsterData = new MonsterData();
    dungeon: Dungeon;
    shooter: Shooter = null;
    isHurt = false;//是否受到伤害
    // isDashing = false;//是否正在冲刺
    isDisguising = false;//是否正在伪装
    idleAction: cc.ActionInterval;
    attackAction: cc.ActionInterval;
    currentlinearVelocitySpeed: cc.Vec2 = cc.Vec2.ZERO;//当前最大速度
    isVariation: boolean = false;//是否变异

    particleIce: cc.ParticleSystem;
    particleFire: cc.ParticleSystem;
    particleLightening: cc.ParticleSystem;
    particleToxic: cc.ParticleSystem;
    particleCurse: cc.ParticleSystem;
    effectNode: cc.Node;

    remoteSkill = new Skill();
    meleeSkill = new Skill();
    dashSkill = new Skill();
    blinkSkill = new Skill();
    isAttackAnimExcuting = false;

    onLoad() {
        this.graphics = this.getComponent(cc.Graphics);
        this.meleeSkill.IsExcuting = false;
        this.isShow = false;
        this.isDied = false;
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
        this.body = this.sprite.getChildByName('body');
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
        this.particleIce = this.node.getChildByName('Effect').getChildByName('ice').getComponent(cc.ParticleSystem);
        this.particleFire = this.node.getChildByName('Effect').getChildByName('fire').getComponent(cc.ParticleSystem);
        this.particleLightening = this.node.getChildByName('Effect').getChildByName('lightening').getComponent(cc.ParticleSystem);
        this.particleToxic = this.node.getChildByName('Effect').getChildByName('toxic').getComponent(cc.ParticleSystem);
        this.particleCurse = this.node.getChildByName('Effect').getChildByName('curse').getComponent(cc.ParticleSystem);
        this.updatePlayerPos();
        this.actionSpriteFrameIdle();
        this.scheduleOnce(() => { this.isShow = true; }, 0.5);
        this.changeBodyColor();
        // this.graphics.strokeColor = cc.Color.ORANGE;
        // this.graphics.circle(0,0,100);
        // this.graphics.stroke();
        // this.graphics.strokeColor = cc.Color.RED;
        // this.graphics.circle(0,0,80);
        // this.graphics.stroke();
    }

    showCircle(){
        let r = 0;
        this.schedule(()=>{
            this.graphics.clear();
            this.graphics.strokeColor = cc.Color.RED;
            this.graphics.circle(0,0,r);
            r+=2;
            this.graphics.stroke();
            if(r>80){
                this.graphics.clear();
            }
        },0.016,40);
    }
    changeBodyRes(resName: string, suffix?: string) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite');
            this.body = this.sprite.getChildByName('body');
        }
        let spriteFrame = this.getSpriteFrameByName(resName, suffix);
        this.body.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        // body.width = spriteFrame.getRect().width;
        // body.height = spriteFrame.getRect().height;
        let scaleNum = this.data.sizeType && this.data.sizeType > 0 ? this.data.sizeType : 1;
        // body.width = body.width * scaleNum;
        // body.height = body.height * scaleNum;
    }
    private getSpriteFrameByName(resName: string, suffix?: string): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrames[resName + suffix];
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrames[resName];
        }
        return spriteFrame;
    }
    updatePlayerPos() {
        // this.node.x = this.pos.x * 64 + 32;
        // this.node.y = this.pos.y * 64 + 32;
        this.node.position = Dungeon.getPosInMap(this.pos);
    }
    transportPlayer(x: number, y: number) {
        this.sprite.rotation = 0;
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
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - this.pos.y) * 10 + 2;
    }
    showFloatFont(dungeonNode: cc.Node, d: number, isDodge: boolean, isMiss: boolean) {
        if (!this.floatinglabelManager) {
            return;
        }
        let flabel = this.floatinglabelManager.getFloaingLabel(dungeonNode);
        if (isDodge) {
            flabel.showDoge();
        } else if (isMiss) {
            flabel.showMiss();
        } else if (d != 0) {
            flabel.showDamage(-d);
        } else {
            flabel.hideLabel();
        }
    }

    remoteAttack() {
        this.remoteSkill.IsExcuting = false;
        let p = this.shooter.node.position.clone();
        p.x = this.shooter.node.scaleX > 0 ? p.x + 30 : -p.x - 30;
        let hv = this.dungeon.player.getCenterPosition().sub(this.node.position.add(p));
        if (!hv.equals(cc.Vec2.ZERO)) {
            hv = hv.normalizeSelf();
            this.shooter.setHv(hv);
            if(this.isVariation){
                this.shooter.data.bulletSize = 0.5;
            }
            this.shooter.dungeon = this.dungeon;
            this.shooter.data.bulletArcExNum = this.data.bulletArcExNum;
            this.shooter.data.bulletLineExNum = this.data.bulletLineExNum;
            this.shooter.data.bulletLineInterval = this.data.bulletLineInterval;
            this.shooter.data.isArcAim = this.data.isArcAim;
            this.shooter.data.isLineAim = this.data.isLineAim;
            this.shooter.data.bulletType = this.data.bulletType ? this.data.bulletType : "bullet001";
            this.shooter.data.bulletExSpeed = this.data.bulletExSpeed;
            this.shooter.fireBullet(Logic.getRandomNum(0, 5) - 5);
        }
    }
    showAttackAnim(finish: Function) {
        if (this.isAttackAnimExcuting) {
            return;
        }
        this.isAttackAnimExcuting = true;
        let pos = this.dungeon.player.node.position.clone().sub(this.node.position);
        if (!pos.equals(cc.Vec2.ZERO)) {
            pos = pos.normalizeSelf();
        }
        this.anim.pause();
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = cc.v2(1, 0);
        }
        pos = pos.normalizeSelf().mul(this.node.scaleX > 0 ? 32 : -32);
        this.sprite.stopAllActions();
        this.idleAction = null;
        let action = cc.sequence(cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_ATTACK01) }),
            cc.moveBy(0.4, -pos.x / 2, -pos.y / 2),
            cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_ATTACK02); }),
            cc.moveBy(0.2, pos.x, pos.y),
            cc.callFunc(() => {
                this.anim.resume();
                if (finish) { finish(); }
            }), cc.moveTo(0.2, 0, 0), cc.callFunc(() => { 
                this.changeBodyRes(this.data.resName, Monster.RES_WALK01);
                //这里防止不转向
                this.changeFaceRight();
                this.isAttackAnimExcuting = false;
             }));
        this.sprite.runAction(action);
    }
    actionSpriteFrameIdle() {
        if (!this.sprite || this.meleeSkill.IsExcuting || this.remoteSkill.IsExcuting || this.isDied || this.isHurt || this.isDisguising) {
            return;
        }
        let spriteframe1 = Logic.spriteFrames[this.data.resName + Monster.RES_WALK01];
        let spriteframe2 = Logic.spriteFrames[this.data.resName + Monster.RES_WALK02];
        let spriteframe3 = Logic.spriteFrames[this.data.resName + Monster.RES_WALK03];
        let isOne = spriteframe2 ? false : true;
        let isTwo = spriteframe2 ? true : false;
        let isThree = spriteframe3 ? true : false;
        if (isThree) { isOne = false; isTwo = false; }
        if (!this.idleAction) {
            if (isOne) {
                this.idleAction = cc.repeatForever(cc.sequence(
                    cc.moveBy(0.2, 0, 0), cc.callFunc(() => { this.changeBodyRes(this.data.resName) }),
                    cc.moveBy(0.2, 0, 0), cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK01) })));
            } else if (isTwo) {
                this.idleAction = cc.repeatForever(cc.sequence(
                    cc.moveBy(0.2, 0, 0), cc.callFunc(() => { this.changeBodyRes(this.data.resName) }),
                    cc.moveBy(0.2, 0, 0), cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK01) }),
                    cc.moveBy(0.2, 0, 0), cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK02) })));
            } else if (isThree) {
                this.idleAction = cc.repeatForever(cc.sequence(
                    cc.moveBy(0.2, 0, 0), cc.callFunc(() => { this.changeBodyRes(this.data.resName) }),
                    cc.moveBy(0.2, 0, 0), cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK01) }),
                    cc.moveBy(0.2, 0, 0), cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK02) }),
                    cc.moveBy(0.2, 0, 0), cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK03) })));
            }
            this.sprite.runAction(this.idleAction);
        }
        if (!this.idleAction.isDone()) {
            return;
        }
        this.sprite.runAction(this.idleAction);
    }
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistance(this.node.position, playerNode.position);
        return dis;
    }
    //移动，返回速度
    move(pos: cc.Vec2, speed: number) {
        if (this.isDied || this.isFall || this.isHurt || this.dashSkill.IsExcuting || this.isDisguising) {
            return;
        }
        if (pos.equals(cc.Vec2.ZERO)) {
            return;
        }
        pos = pos.normalizeSelf();
        if (this.meleeSkill.IsExcuting && !pos.equals(cc.Vec2.ZERO)) {
            pos = pos.mul(0.5);
        }

        if (!pos.equals(cc.Vec2.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.node.position);
        }
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);

        let mul = absh > absv ? absh : absv;
        mul = mul == 0 ? 1 : mul;
        let movement = cc.v2(h, v);
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement.clone();
        this.currentlinearVelocitySpeed = movement.clone();
        this.isMoving = h != 0 || v != 0;
        if (this.isMoving&&!this.isAttackAnimExcuting) {
            this.isFaceRight = h >= 0;
        }
        // if (this.isMoving) {
        //     if (!this.anim.getAnimationState('MonsterMove').isPlaying) {
        //         this.anim.play('MonsterMove');
        //     }
        // } else {
        //     if (this.anim.getAnimationState('MonsterIdle').isPlaying) {
        //         this.anim.play('MonsterIdle');
        //     }
        // }
        this.changeZIndex();
    }

    start() {
        this.changeZIndex();
        this.healthBar.refreshHealth(this.data.getHealth().x, this.data.getHealth().y);
    }
    fall() {
        if (this.isFall) {
            return;
        }
        this.isFall = true;
        this.isDied = true;
        let collider: cc.PhysicsCollider = this.getComponent('cc.PhysicsCollider');
        collider.sensor = true;
        this.anim.play('PlayerFall');
    }
    takeDamage(damageData: DamageData): boolean {
        if (!this.isShow) {
            return false;
        }
        if (this.data.invisible > 0 && this.sprite.opacity < 200 && Logic.getRandomNum(1, 10) > 4) {
            this.showFloatFont(this.dungeon.node, 0, true, false);
            return false;
        }
        if(this.blinkSkill.IsExcuting){
            this.showFloatFont(this.dungeon.node, 0, true, false);
            return false;
        }
        let dd = this.data.getDamage(damageData);
        let dodge = this.data.getDodge();
        let isDodge = Random.rand() <= dodge && dd.getTotalDamage() > 0;
        dd = isDodge ? new DamageData() : dd;
        if (isDodge) {
            this.showFloatFont(this.dungeon.node, 0, true, false);
            return false;
        }
        this.isHurt = dd.getTotalDamage() > 0;
        if (this.isDisguising) {
            this.changeBodyRes(this.data.resName);
        }
        this.isDisguising = false;
        this.meleeSkill.IsExcuting = false;
        this.remoteSkill.IsExcuting = false;
        this.isAttackAnimExcuting = false;
        this.sprite.stopAllActions();
        this.idleAction = null;
        //100ms后修改受伤
        if(dd.getTotalDamage()>0){
            this.body.color = cc.color(255, 0, 0);
        }
        this.scheduleOnce(() => {
            if (this.node) {
                this.isHurt = false;
                this.changeBodyColor();
            }
        }, 0.1);
        this.sprite.opacity = 255;
        this.data.currentHealth -= dd.getTotalDamage();
        if (this.data.currentHealth > this.data.getHealth().y) {
            this.data.currentHealth = this.data.getHealth().y;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.getHealth().y);
        this.showFloatFont(this.dungeon.node, dd.getTotalDamage(), false, false);
        if (this.data.Common.lifeRecovery > 0 && this.isHurt) {
            this.addStatus(StatusManager.RECOVERY);
        }
        let h = this.isHurt?true:false;
        //20%几率无视
        this.isHurt = Random.getRandomNum(0,100)<80;
        cc.director.emit(EventConstant.PLAY_AUDIO,{detail:{name:AudioPlayer.MONSTER_HIT}})
        return h;
    }
    changeBodyColor():void{
        if(!this.data){
            return;
        }
        let c = '#000000';
        c = this.getMixColor(c,this.data.getIceDefence()+this.data.getIceDamage()>0?'#CCFFFF':'#000000');
        c = this.getMixColor(c,this.data.getFireDefence()+this.data.getFireDamage()>0?'#FF6633':'#000000');
        c = this.getMixColor(c,this.data.getLighteningDefence()+this.data.getLighteningDamage()>0?'#0099FF':'#000000');
        c = this.getMixColor(c,this.data.getToxicDefence()+this.data.getToxicDamage()>0?'#66CC00':'#000000');
        c = this.getMixColor(c,this.data.getCurseDefence()+this.data.getCurseDamage()>0?'#660099':'#000000');
        c = c == '#000000' ? '#ffffff' : c;
        this.body.color = cc.color(255,255,255).fromHEX(c);
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
    addStatus(statusType: string) {
        this.statusManager.addStatus(statusType);
    }
    showAttackEffect(isDashing: boolean) {
        if (!this.particleIce) {
            return;
        }
        this.effectNode.setPosition(cc.v2(0, 16));
        if (!isDashing) {
            this.effectNode.runAction(cc.sequence(cc.moveTo(0.2, 32, 32), cc.moveTo(0.2, 0, 16)));
        }
        this.data.getIceDamage() > 0 ? this.particleIce.resetSystem() : this.particleIce.stopSystem();
        this.data.getFireDamage() > 0 ? this.particleFire.resetSystem() : this.particleFire.stopSystem();
        this.data.getLighteningDamage() > 0 ? this.particleLightening.resetSystem() : this.particleLightening.stopSystem();
        this.data.getToxicDamage() > 0 ? this.particleToxic.resetSystem() : this.particleToxic.stopSystem();
        this.data.getCurseDamage() > 0 ? this.particleCurse.resetSystem() : this.particleCurse.stopSystem();
    }
    stopAttackEffect() {
        if (!this.particleIce) {
            return;
        }
        this.particleIce.stopSystem();
        this.particleFire.stopSystem();
        this.particleLightening.stopSystem();
        this.particleToxic.stopSystem();
        this.particleCurse.stopSystem();
    }
    addPlayerStatus(player: Player) {
        if (Logic.getRandomNum(0, 100) < this.data.getIceRate()) { player.addStatus(StatusManager.FROZEN); }
        if (Logic.getRandomNum(0, 100) < this.data.getFireRate()) { player.addStatus(StatusManager.BURNING); }
        if (Logic.getRandomNum(0, 100) < this.data.getLighteningRate()) { player.addStatus(StatusManager.DIZZ); }
        if (Logic.getRandomNum(0, 100) < this.data.getToxicRate()) { player.addStatus(StatusManager.TOXICOSIS); }
        if (Logic.getRandomNum(0, 100) < this.data.getCurseRate()) { player.addStatus(StatusManager.CURSING); }
        if (Logic.getRandomNum(0, 100) < this.data.getRealRate()) { player.addStatus(StatusManager.BLEEDING); }
    }
    killed() {
        if (this.isDied) {
            return;
        }
        this.isDied = true;
        if (this.isDisguising) {
            this.changeBodyRes(this.data.resName);
        }
        this.isDisguising = false;
        this.dashSkill.IsExcuting = false;
        this.anim.play('MonsterDie');
        this.idleAction = null;
        this.sprite.stopAllActions();
        let collider: cc.PhysicsCollider = this.getComponent('cc.PhysicsCollider');
        collider.sensor = true;
        let rand = Random.rand();
        if (this.dungeon) {
            if (rand < 0.8) {
                cc.director.emit(EventConstant.DUNGEON_ADD_COIN, { detail: { pos: this.node.position, count: Logic.getRandomNum(1, 10) } });
            } else if (rand >= 0.8 && rand < 0.825) {
                this.dungeon.addItem(this.node.position.clone(), Item.HEART);
            } else if (rand >= 0.825 && rand < 0.85) {
                this.dungeon.addItem(this.node.position.clone(), Item.AMMO);
            } else if (rand >= 0.85 && rand < 0.875) {
                this.dungeon.addItem(this.node.position.clone(), Item.REDCAPSULE);
            } else if (rand >= 0.875 && rand < 0.9) {
                this.dungeon.addItem(this.node.position.clone(), Item.BLUECAPSULE);
            } else if (rand >= 0.9 && rand < 0.925) {
                this.dungeon.addItem(this.node.position.clone(), Item.SHIELD);
            } else if(rand >= 0.925 && rand < 1){
                this.dungeon.addEquipment(EquipmentManager.equipments[Logic.getRandomNum(0,EquipmentManager.equipments.length-1)], this.pos,null,1);
            }
        }
        Achievements.addMonsterKillAchievement(this.data.resName);
        this.scheduleOnce(() => { if (this.node) { 
            if (this.data.isBoom == 1) {
                let boom = cc.instantiate(this.boom);
                boom.parent = this.node.parent;
                boom.setPosition(this.node.position);
                boom.zIndex = 4100;
            }
            this.node.active = false;
         } }, 2);

    }
  
    /**获取中心位置 */
    getCenterPosition(): cc.Vec2 {
        return this.node.position.clone().addSelf(cc.v2(0, 32 * this.node.scaleY));
    }
    blink() {
        if (this.data.blink > 0) {
            this.blinkSkill.next(() => {
                this.blinkSkill.IsExcuting = true;
                let body = this.sprite.getChildByName('body');
                let action = cc.sequence(cc.fadeOut(0.5)
                    , cc.callFunc(() => {
                        let newPos = this.dungeon.player.pos.clone();
                        if (this.dungeon.player.pos.x > this.pos.x) {
                            newPos = newPos.addSelf(cc.v2(1, 0));
                        } else {
                            newPos = newPos.addSelf(cc.v2(-1, 0));
                        }
                        let pos = Dungeon.getPosInMap(newPos);
                        this.node.setPosition(pos);
                    })
                    , cc.fadeIn(0.5));
                body.runAction(action);
                this.scheduleOnce(() => { this.blinkSkill.IsExcuting = false; },1)
            }, this.data.blink, true)
        }
    }
    monsterAction() {
        if (this.isDied || !this.dungeon || this.isHurt || !this.isShow || this.isDizz) {
            return;
        }
        this.node.position = Dungeon.fixOuterMap(this.node.position);
        this.pos = Dungeon.getIndexInMap(this.node.position);
        this.changeZIndex();
        let newPos = cc.v2(0, 0);
        newPos.x += Logic.getRandomNum(0, 200) - 100;
        newPos.y += Logic.getRandomNum(0, 200) - 100;
        let playerDis = this.getNearPlayerDistance(this.dungeon.player.node);
        let pos = newPos.clone();

        //近战
        if (playerDis < 100 * this.node.scaleY && !this.dungeon.player.isDied && this.data.melee > 0 && !this.dashSkill.IsExcuting && !this.blinkSkill.IsExcuting && !this.isDisguising) {
            this.meleeSkill.next(() => {
                this.meleeSkill.IsExcuting = true;
                this.showAttackEffect(false);
                let isMiss = Logic.getRandomNum(0, 100) < this.data.StatusTotalData.missRate;
                if (isMiss) {
                    this.showFloatFont(this.dungeon.node, 0, false, true)
                }
                // this.showCircle();
                this.showAttackAnim(() => {
                    this.meleeSkill.IsExcuting = false;
                    this.stopAttackEffect();
                    let isPlayerAtRight = this.dungeon.player.node.position.x>this.node.x;
                    let isBehind = this.isFaceRight?!isPlayerAtRight:isPlayerAtRight;
                    let newdis = this.getNearPlayerDistance(this.dungeon.player.node);
                    if (newdis < 80 * this.node.scaleY && !isMiss && !isBehind) {
                        this.addPlayerStatus(this.dungeon.player);
                        this.dungeon.player.takeDamage(this.data.getAttackPoint(), this);
                    }
                })

                this.sprite.opacity = 255;
            }, this.data.melee);

        }
        this.blink();
        if (this.data.melee > 0) {
            pos = this.getMovePosFromPlayer();
        }
        //远程
        if (playerDis < 600 && this.data.remote > 0 && this.shooter && !this.isDisguising && !this.meleeSkill.IsExcuting) {
            this.remoteSkill.next(() => {
                this.remoteSkill.IsExcuting = true;
                this.showAttackAnim(() => {
                    this.remoteAttack();
                });
                this.sprite.opacity = 255;
            }, this.data.remote, true);
        }

        //冲刺
        let speed = this.data.getMoveSpeed();
        if (playerDis < 600 && playerDis > 100 && !this.dungeon.player.isDied && this.data.dash > 0
            && !this.dashSkill.IsExcuting && !this.isDisguising) {
            this.dashSkill.next(() => {
                pos = this.getMovePosFromPlayer();
                this.showAttackEffect(true);
                this.move(pos, speed * 1.2);
                this.dashSkill.IsExcuting = true;
                this.scheduleOnce(() => { if (this.node) { this.dashSkill.IsExcuting = false; this.stopAttackEffect(); } }, 3);
            }, this.data.dash);

        }
        if (this.data.disguise > 0 && playerDis < this.data.disguise && !this.dungeon.player.isDied && this.isDisguising) {
            this.changeBodyRes(this.data.resName);
            this.isDisguising = false;
        }
        if (Logic.getHalfChance() && !this.shooter.isAiming && playerDis > 64 * this.node.scaleY && !this.isAttackAnimExcuting) {
            this.move(pos, speed);
        }

    }
    getMovePosFromPlayer(): cc.Vec2 {
        let newPos = this.dungeon.player.pos.clone();
        if (this.dungeon.player.pos.x > this.pos.x) {
            newPos = newPos.addSelf(cc.v2(1, 0));
        } else {
            newPos = newPos.addSelf(cc.v2(-1, 0));
        }
        let pos = Dungeon.getPosInMap(newPos);
        pos = pos.sub(this.node.position);
        if(!this.isAttackAnimExcuting){
            this.changeFaceRight();
        }
        return pos;
    }
    changeFaceRight(){
        let pos = this.dungeon.player.node.position.clone();
        pos = pos.sub(this.node.position);
        let h = pos.x;
        this.isFaceRight = h >= 0;
    }
    lerp(a, b, r) {
        return a + (b - a) * r;
    };
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.getComponent(Player);
        if (player && this.dashSkill.IsExcuting && this.dungeon && !this.isHurt && !this.isDied) {
            this.dashSkill.IsExcuting = false;
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
            this.addPlayerStatus(this.dungeon.player);
            this.stopAttackEffect();
            this.dungeon.player.takeDamage(this.data.getAttackPoint(), this);
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

    // getPosDir(oldPos: cc.Vec2, newPos: cc.Vec2): number {
    //     let dir = 4;
    //     if (newPos.x == oldPos.x) {
    //         dir = newPos.y > oldPos.y ? 0 : 1;
    //     }
    //     if (newPos.y == oldPos.y) {
    //         dir = newPos.x > oldPos.x ? 3 : 2;
    //     }
    //     if (newPos.equals(oldPos)) {
    //         dir = 4;
    //     }
    //     return dir;
    // }
    // getMonsterBestDir(pos: cc.Vec2, dungeon: Dungeon): number {
    //     let bestPos = cc.v2(pos.x, pos.y);
    //     //获取9个点并打乱顺序
    //     let dirArr = new Array();
    //     if (pos.y + 1 < Dungeon.HEIGHT_SIZE) {
    //         dirArr.push(cc.v2(pos.x, pos.y + 1));
    //     }
    //     if (pos.y - 1 >= 0) {
    //         dirArr.push(cc.v2(pos.x, pos.y - 1));
    //     }
    //     if (pos.x - 1 >= 0) {
    //         dirArr.push(cc.v2(pos.x - 1, pos.y));
    //     }
    //     if (pos.x + 1 < Dungeon.WIDTH_SIZE) {
    //         dirArr.push(cc.v2(pos.x + 1, pos.y));
    //     }

    //     dirArr.sort(() => {
    //         return 0.5 - Random.rand();
    //     })
    //     //获取没有塌陷且没有其他怪物的tile
    //     let goodArr = new Array();
    //     for (let i = 0; i < dirArr.length; i++) {
    //         let newPos = dirArr[i];
    //         let tile = dungeon.map[newPos.x][newPos.y];
    //         if (!tile.isBroken) {
    //             let hasOther = false;
    //             // for (let other of dungeon.monsters) {
    //             //     if (other.pos.equals(newPos)) {
    //             //         hasOther = true;
    //             //         break;
    //             //     }
    //             // }
    //             let w = dungeon.wallmap[newPos.x][newPos.y]
    //             if (w && w.node.active) {
    //                 hasOther = true;
    //             }
    //             // let trap = dungeon.trapmap[newPos.x][newPos.y]
    //             // if (trap && trap.node.active) {
    //             //     hasOther = true;
    //             // }
    //             if (!hasOther) {
    //                 goodArr.push(newPos);
    //             }
    //         }
    //     }
    //     for (let i = 0; i < goodArr.length; i++) {
    //         let newPos = goodArr[i];
    //         // if (newPos.equals(dungeon.player.pos)) {
    //         //     bestPos = newPos;
    //         //     break;
    //         // }
    //         let tile = dungeon.map[newPos.x][newPos.y];
    //         if (!tile.isBreakingNow) {
    //             bestPos = newPos;
    //             break;
    //         }

    //     }
    //     let dir = this.getPosDir(pos, bestPos);
    //     return dir;
    // }


    getScaleSize():number{
        let scaleNum = this.data.sizeType && this.data.sizeType > 0 ? this.data.sizeType : 1;
        let sn = this.isVariation ? Monster.SCALE_NUM * scaleNum : scaleNum;
        return sn;
    }

    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.2) {
            this.timeDelay = 0;
            this.monsterAction();
            this.actionSpriteFrameIdle();
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
            this.shadow.opacity = this.isDisguising ? 0 : 255;
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
        //变异为紫色
        this.healthBar.progressBar.barSprite.node.color = this.isVariation ? cc.color(128, 0, 128) : cc.color(194, 0, 0);
        this.dashlight.color = this.isVariation ? cc.color(0, 0, 0) : cc.color(255, 255, 255);
    }
    actorName(){
        return this.data.nameCn;
    }
}
