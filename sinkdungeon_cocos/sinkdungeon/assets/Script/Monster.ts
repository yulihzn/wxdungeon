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
import MonsterManager from './Manager/MonsterManager';
import Shooter from './Shooter';
import Player from './Player';
import StatusManager from './Manager/StatusManager';
import DamageData from './Data/DamageData';
import FloatinglabelManager from './Manager/FloatingLabelManager';
import Random from './Utils/Random';
import Skill from './Utils/Skill';

@ccclass
export default class Monster extends cc.Component {
    public static readonly RES_DISGUISE = 'disguise';//图片资源 伪装
    public static readonly RES_WALK01 = 'anim001';//图片资源 行走1
    public static readonly RES_WALK02 = 'anim002';//图片资源 行走2
    public static readonly RES_WALK03 = 'anim003';//图片资源 行走3
    public static readonly RES_ATTACK = 'anim004';//图片资源 攻击

    static readonly SCALE_NUM = 1.5;
    @property(cc.Vec2)
    pos: cc.Vec2 = cc.v2(0, 0);

    @property(HealthBar)
    healthBar: HealthBar = null;
    @property(StatusManager)
    statusManager: StatusManager = null;
    @property(FloatinglabelManager)
    floatinglabelManager: FloatinglabelManager = null;
    private sprite: cc.Node;
    private shadow: cc.Node;
    private dashlight: cc.Node;
    private anim: cc.Animation;
    rigidbody: cc.RigidBody;
    isFaceRight = true;
    isMoving = false;
    // isAttacking = false;
    isDied = false;
    isFall = false;
    isShow = false;
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

    remoteSkill = new Skill();
    meleeSkill = new Skill();
    dashSkill = new Skill();
    isAttackAnimExcuting = false;

    onLoad() {
        this.meleeSkill.IsExcuting = false;
        this.isShow = false;
        this.isDied = false;
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');

        if (this.isVariation) {
            this.node.scale = Monster.SCALE_NUM;
        }
        this.dashlight = this.sprite.getChildByName('dashlight');
        this.dashlight.opacity = 0;
        this.shadow = this.sprite.getChildByName('shadow');
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter);
        this.particleIce = this.node.getChildByName('Effect').getChildByName('ice').getComponent(cc.ParticleSystem);
        this.particleFire = this.node.getChildByName('Effect').getChildByName('fire').getComponent(cc.ParticleSystem);
        this.particleLightening = this.node.getChildByName('Effect').getChildByName('lightening').getComponent(cc.ParticleSystem);
        this.particleToxic = this.node.getChildByName('Effect').getChildByName('toxic').getComponent(cc.ParticleSystem);
        this.particleCurse = this.node.getChildByName('Effect').getChildByName('curse').getComponent(cc.ParticleSystem);
        this.updatePlayerPos();
        this.actionSpriteFrameIdle();
        this.scheduleOnce(() => { this.isShow = true; }, 1.5);
    }

    changeBodyRes(resName: string, suffix?: string) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite');
        }
        let body = this.sprite.getChildByName('body');
        let spriteFrame = this.getSpriteFrameByName(resName, suffix);
        body.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        body.width = spriteFrame.getRect().width;
        body.height = spriteFrame.getRect().height;
        let scaleNum = this.data.sizeType && this.data.sizeType > 0 ? this.data.sizeType : 1;
        body.width = body.width * scaleNum;
        body.height = body.height * scaleNum;
    }
    private getSpriteFrameByName(resName: string, suffix?: string): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrames[resName + suffix];
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrames[resName];
        }
        return spriteFrame;
    }
    updatePlayerPos() {
        this.node.x = this.pos.x * 64 + 32;
        this.node.y = this.pos.y * 64 + 32;
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
            this.shooter.dungeon = this.dungeon;
            this.shooter.data.bulletArcExNum = this.data.bulletArcExNum;
            this.shooter.data.bulletLineExNum = this.data.bulletLineExNum;
            this.shooter.data.bulletLineInterval = this.data.bulletLineInterval;
            this.shooter.data.bulletType = this.data.bulletType ? this.data.bulletType : "bullet001";
            this.shooter.fireBullet(Logic.getRandomNum(0, 5) - 5);
        }
    }
    showAttackAnim(finish: Function) {
        if(this.isAttackAnimExcuting){
            return;
        }
        this.isAttackAnimExcuting = true;
        let pos = this.dungeon.player.getCenterPosition().sub(this.node.position);
        if (!pos.equals(cc.Vec2.ZERO)) {
            pos = pos.normalizeSelf();
        }
        this.anim.pause();
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = cc.v2(1, 0);
        }
        pos = pos.normalizeSelf().mul(32);
        this.sprite.stopAllActions();
        this.idleAction = null;
        let action = cc.sequence(cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK01) }),
            cc.moveBy(0.2, -pos.x / 2, -pos.y / 2),
            cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_ATTACK) }),
            cc.moveBy(0.2, pos.x, pos.y),
            cc.callFunc(() => {
                this.changeBodyRes(this.data.resName, Monster.RES_WALK03)
                this.anim.resume();
                if (finish) { finish(); }
            }), cc.moveTo(0.2, 0, 0),cc.callFunc(()=>{this.isAttackAnimExcuting = false;}));
        this.sprite.runAction(action);
    }
    actionSpriteFrameIdle() {
        if (!this.sprite || this.meleeSkill.IsExcuting || this.remoteSkill.IsExcuting || this.isDied || this.isHurt || this.isDisguising) {
            return;
        }
        if (!this.idleAction) {
            this.idleAction = cc.repeatForever(cc.sequence(
                cc.moveBy(0.2, 0, 0), cc.callFunc(() => { this.changeBodyRes(this.data.resName) }),
                cc.moveBy(0.2, 0, 0), cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK01) }),
                cc.moveBy(0.2, 0, 0), cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK02) }),
                cc.moveBy(0.2, 0, 0), cc.callFunc(() => { this.changeBodyRes(this.data.resName, Monster.RES_WALK03) })));
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
        if (this.isMoving) {
            this.isFaceRight = h > 0;
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
        // let ss = this.node.getComponentsInChildren(cc.Sprite);
        // for (let i = 0; i < ss.length; i++) {
        //     if (ss[i].spriteFrame) {
        //         ss[i].spriteFrame.getTexture().setAliasTexParameters();
        //     }
        // }
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
        if (this.data.invisible && this.sprite.opacity < 200 && Logic.getRandomNum(1, 10) > 2) {
            this.showFloatFont(this.dungeon.node, 0, true, false);
            return false;
        }
        let dd = this.data.getDamage(damageData);
        let dodge = this.data.getDodge();
        let isDodge = Random.rand() <= dodge && dd.getTotalDamage() > 0;
        dd = isDodge ? new DamageData() : dd;
        if (isDodge) {
            this.showFloatFont(this.dungeon.node, 0, true, false);
            return;
        }
        this.isHurt = true;
        if (this.isDisguising) {
            this.changeBodyRes(this.data.resName);
        }
        this.isDisguising = false;
        this.meleeSkill.IsExcuting = false;
        this.sprite.stopAllActions();
        this.idleAction = null;
        //200ms后修改受伤
        this.scheduleOnce(() => { if (this.node) { this.isHurt = false; } }, 0.2);
        this.sprite.opacity = 255;
        this.data.currentHealth -= dd.getTotalDamage();
        if (this.data.currentHealth > this.data.getHealth().y) {
            this.data.currentHealth = this.data.getHealth().y;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.getHealth().y);
        this.showFloatFont(this.dungeon.node, dd.getTotalDamage(), false, false);
        return true;
    }
    addStatus(statusType: string) {
        this.statusManager.addStatus(statusType);
    }
    showAttackEffect() {
        if (!this.particleIce) {
            return;
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
        if (rand < 0.9) {
            cc.director.emit(EventConstant.DUNGEON_ADD_COIN, { detail: { pos: this.node.position, count: Logic.getRandomNum(1, 10) } });
        } else if (rand >= 0.9 && rand < 0.98) {
            cc.director.emit(EventConstant.DUNGEON_ADD_HEART, { detail: { pos: this.node.position } });
        } else {
            cc.director.emit(EventConstant.DUNGEON_ADD_AMMO, { detail: { pos: this.node.position } });
        }
        this.scheduleOnce(() => { if (this.node) { this.node.active = false; } }, 2);

    }
    /**获取中心位置 */
    getCenterPosition(): cc.Vec2 {
        return this.node.position.clone().addSelf(cc.v2(0, 32 * this.node.scaleY));
    }
    monsterAction() {
        if (this.isDied || !this.dungeon || this.isHurt || !this.isShow) {
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
        if (playerDis < 80 && !this.dungeon.player.isDied && this.data.melee > 0 && !this.dashSkill.IsExcuting && !this.isDisguising) {
            this.meleeSkill.next(() => {
                this.meleeSkill.IsExcuting = true;
                this.showAttackEffect();
                let isMiss = Logic.getRandomNum(0, 100) < this.data.StatusTotalData.missRate;
                if (isMiss) {
                    this.showFloatFont(this.dungeon.node, 0, false, true)
                }
                this.showAttackAnim(() => {
                    this.meleeSkill.IsExcuting = false;
                    this.stopAttackEffect();
                    let newdis = this.getNearPlayerDistance(this.dungeon.player.node);
                    if (newdis < 80 && !isMiss) { 
                        this.addPlayerStatus(this.dungeon.player);
                         this.dungeon.player.takeDamage(this.data.getAttackPoint());
                         }
                })
                
                this.sprite.opacity = 255;
            }, this.data.melee);
        }

        if (this.data.melee > 0) {
            pos = this.dungeon.player.getCenterPosition().sub(this.node.position);
        }
        //远程
        if (playerDis < 600 && this.data.remote > 0 && this.shooter && !this.isDisguising && !this.meleeSkill.IsExcuting) {
            this.remoteSkill.next(() => {
                this.remoteSkill.IsExcuting = true;
                this.showAttackAnim(() => { this.remoteAttack() });
            }, this.data.remote, true);
        }

        //冲刺
        let speed = this.data.getMoveSpeed();
        if (playerDis < 600 && playerDis > 100 && !this.dungeon.player.isDied && this.data.dash > 0
            && !this.dashSkill.IsExcuting && !this.isDisguising) {
            this.dashSkill.next(() => {
                pos = this.dungeon.player.getCenterPosition().sub(this.node.position);
                this.showAttackEffect();
                this.move(pos, speed * 1.2);
                this.dashSkill.IsExcuting = true;
                this.scheduleOnce(() => { if (this.node) { this.dashSkill.IsExcuting = false; this.stopAttackEffect(); } }, 3);
            }, this.data.dash);

        }
        if (this.data.disguise > 0 && playerDis < this.data.disguise && !this.dungeon.player.isDied && this.isDisguising) {
            this.changeBodyRes(this.data.resName);
            this.isDisguising = false;
        }
        if (Logic.getHalfChance()) {
            this.move(pos, speed);
        }

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
            this.dungeon.player.takeDamage(this.data.getAttackPoint());
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
        let sn = this.isVariation ? Monster.SCALE_NUM : 1;
        this.node.scaleX = this.isFaceRight ? sn : -sn;
        this.node.scaleY = sn;

        this.healthBar.node.scaleX = this.node.scaleX > 0 ? 1 : -1;
        //防止错位
        this.healthBar.node.x = -30 * this.node.scaleX;
        //变异为紫色
        this.healthBar.progressBar.barSprite.node.color = this.isVariation ? cc.color(128, 0, 128) : cc.color(194, 0, 0);
        this.dashlight.color = this.isVariation ? cc.color(0, 0, 0) : cc.color(255, 255, 255);
    }
}
