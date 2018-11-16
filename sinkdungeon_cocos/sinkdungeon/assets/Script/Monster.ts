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

@ccclass
export default class Monster extends cc.Component {
    public static readonly RES_DISGUISE = 'disguise';//图片资源 伪装
    public static readonly RES_WALK01 = 'anim001';//图片资源 行走1
    public static readonly RES_WALK02 = 'anim002';//图片资源 行走2
    public static readonly RES_WALK03 = 'anim003';//图片资源 行走3
    public static readonly RES_ATTACK = 'anim004';//图片资源 攻击
    @property(cc.Vec2)
    pos: cc.Vec2 = cc.v2(0, 0);
    @property(cc.Label)
    label: cc.Label = null;
    @property(HealthBar)
    healthBar: HealthBar = null;
    @property(StatusManager)
    statusManager: StatusManager = null;
    private sprite: cc.Node;
    private shadow: cc.Node;
    private dashlight: cc.Node;
    private anim: cc.Animation;
    rigidbody: cc.RigidBody;
    isFaceRight = true;
    isMoving = false;
    isAttacking = false;
    isDied = false;
    isFall = false;
    private timeDelay = 0;
    data: MonsterData = new MonsterData();
    dungeon: Dungeon;
    shooter: Shooter = null;
    isHurt = false;//是否受到伤害
    isDashing = false;//是否正在冲刺
    isDisguising = false;//是否正在伪装
    idleAction: cc.ActionInterval;
    attackAction: cc.ActionInterval;
    currentlinearVelocitySpeed: cc.Vec2 = cc.Vec2.ZERO;//当前最大速度
    isVariation: boolean = false;//是否变异
    scaleNum = 1.5;

    onLoad() {
        this.isAttacking = false;
        this.isDied = false;
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
        if (this.isVariation) {
            this.node.scale = this.scaleNum;
        }
        this.dashlight = this.sprite.getChildByName('dashlight');
        this.dashlight.opacity = 0;
        this.shadow = this.sprite.getChildByName('shadow');
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter);
        this.updatePlayerPos();
        this.actionSpriteFrameIdle();
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
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - this.pos.y) * 100 + 2;
    }
    meleeAttack(pos: cc.Vec2, finish) {
        if (this.isAttacking) {
            return;
        }
        this.isAttacking = true;
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
                this.isAttacking = false;
                this.changeBodyRes(this.data.resName, Monster.RES_WALK03)
                this.anim.resume();
                if (finish) { finish(this.data.getAttackPoint()); }
            }), cc.moveTo(0.2, 0, 0));
        this.sprite.runAction(action);
    }
    actionSpriteFrameIdle() {
        if (!this.sprite || this.isAttacking || this.isDied || this.isHurt || this.isDisguising) {
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
        if (this.isDied || this.isFall || this.isHurt || this.isDashing || this.isDisguising) {
            return;
        }
        if (pos.equals(cc.Vec2.ZERO)) {
            return;
        }
        pos = pos.normalizeSelf();
        if (this.isAttacking && !pos.equals(cc.Vec2.ZERO)) {
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
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.maxHealth);
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
        if (this.data.invisible && this.sprite.opacity < 200 && Logic.getRandomNum(1, 10) > 2) {
            return false;
        }
        this.isHurt = true;
        if (this.isDisguising) {
            this.changeBodyRes(this.data.resName);
        }
        this.isDisguising = false;
        this.isAttacking = false;
        this.sprite.stopAllActions();
        this.idleAction = null;
        //100ms后修改受伤
        setTimeout(() => { if (this.node) { this.isHurt = false; } }, 200);
        this.sprite.opacity = 255;
        this.data.currentHealth -= this.data.getDamage(damageData).getTotalDamage();
        if (this.data.currentHealth > this.data.maxHealth) {
            this.data.currentHealth = this.data.maxHealth;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.maxHealth);
        return true;
    }
    addStatus(statusType:string){
        this.statusManager.addStatus(statusType);
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
        this.isDashing = false;
        this.anim.play('MonsterDie');
        this.idleAction = null;
        this.sprite.stopAllActions();
        let collider: cc.PhysicsCollider = this.getComponent('cc.PhysicsCollider');
        collider.sensor = true;
        let rand = Math.random();
        if (rand < 0.9) {
            cc.director.emit(EventConstant.DUNGEON_ADD_COIN, { detail: { pos: this.node.position, count: Logic.getRandomNum(1, 10) } });
        } else if (rand >= 0.9 && rand < 0.98) {
            cc.director.emit(EventConstant.DUNGEON_ADD_HEART, { detail: { pos: this.node.position } });
        } else {
            cc.director.emit(EventConstant.DUNGEON_ADD_AMMO, { detail: { pos: this.node.position } });
        }
        setTimeout(() => { if (this.node) { this.node.active = false; } }, 2000);

    }

    monsterAction() {
        if (this.isDied || !this.dungeon || this.isHurt) {
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
        if (playerDis < 64 && !this.dungeon.player.isDied && this.data.melee > 0 && Logic.getRandomNum(0, 100) < this.data.melee && !this.isDashing && !this.isDisguising) {
            pos = this.dungeon.player.node.position.sub(this.node.position);
            if (!pos.equals(cc.Vec2.ZERO)) {
                pos = pos.normalizeSelf();
            }
            this.meleeAttack(pos, (damage: DamageData) => {
                let newdis = this.getNearPlayerDistance(this.dungeon.player.node);
                if (newdis < 64) { this.dungeon.player.takeDamage(damage); }
            });
            this.sprite.opacity = 255;
        }
        if (this.data.melee > 0) {
            pos = this.dungeon.player.node.position.sub(this.node.position);
        }
        //远程
        if (playerDis < 600 && this.data.remote > 0 && Logic.getRandomNum(0, 100) < this.data.remote && this.shooter && !this.isDisguising) {
            let hv = this.dungeon.player.node.position.sub(this.node.position);
            if (!hv.equals(cc.Vec2.ZERO)) {
                hv = hv.normalizeSelf();
                this.shooter.setHv(hv);
                this.shooter.dungeon = this.dungeon;
                this.shooter.fireBullet();
            }
        }
        //冲刺
        let speed = this.data.movespeed;
        if (playerDis < 600 && playerDis > 100 && !this.dungeon.player.isDied && Logic.getRandomNum(0, 100) < this.data.dash && this.data.dash > 0 && !this.isDashing && !this.isDisguising) {
            pos = this.dungeon.player.node.position.sub(this.node.position);
            this.move(pos, speed * 1.2);
            this.isDashing = true;
            setTimeout(() => { if (this.node) { this.isDashing = false; } }, 3000);
        }
        if (this.data.disguise > 0 && playerDis < this.data.disguise && !this.dungeon.player.isDied && this.isDisguising) {
            this.changeBodyRes(this.data.resName);
            this.isDisguising = false;
        }
        if(Logic.getHalfChance()){
            this.move(pos, speed);
        }

    }
    lerp(a, b, r) {
        return a + (b - a) * r;
    };
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.getComponent(Player);
        if (player && this.isDashing && this.dungeon && !this.isHurt && !this.isDied) {
            this.isDashing = false;
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
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
    //         return 0.5 - Math.random();
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
        if (this.dungeon && this.isDashing) {
            this.dashlight.opacity = 128;
            this.rigidbody.linearVelocity = this.currentlinearVelocitySpeed.clone();
        }
        if (this.isDied) {
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
        }
        if (this.label) {
            this.label.string = "" + this.node.zIndex;
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
        let sn = this.isVariation ? this.scaleNum : 1;
        this.node.scaleX = this.isFaceRight ? sn : -sn;

        this.healthBar.node.scaleX = this.node.scaleX > 0 ? 1 : -1;
        //防止错位
        this.healthBar.node.x = -30 * this.node.scaleX;
        //变异为紫色
        this.healthBar.progressBar.barSprite.node.color = this.isVariation ? cc.color(128, 0, 128) : cc.color(194, 0, 0);
        this.dashlight.color = this.isVariation ? cc.color(0, 0, 0) : cc.color(255, 255, 255);
    }
}
