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

@ccclass
export default class Monster extends cc.Component {

    @property(cc.Vec2)
    pos: cc.Vec2 = cc.v2(0, 0);
    @property(cc.Label)
    label: cc.Label = null;
    @property(HealthBar)
    healthBar: HealthBar = null;
    private sprite: cc.Node;
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


    onLoad() {
        this.isAttacking = false;
        this.isDied = false;
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.updatePlayerPos();
    }

    changeBodyRes(resName: string) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite');
        }
        let body = this.sprite.getChildByName('body');
        let spriteFrame = Logic.spriteFrames[resName];
        body.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        body.width = spriteFrame.getRect().width;
        body.height = spriteFrame.getRect().height;
        // cc.loader.loadRes('Texture/Monster/'+resName,cc.SpriteFrame,(error:Error,spriteFrame:cc.SpriteFrame)=>{
        //     let body = this.sprite.getChildByName('body');
        //     spriteFrame.getTexture().setAliasTexParameters();
        //     body.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        //     body.width = spriteFrame.getRect().width;
        //     body.height = spriteFrame.getRect().height;
        // })
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
        this.node.zIndex = 3000 + (9 - this.pos.y) * 100 + 2;
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
        let action = cc.sequence(cc.moveBy(0.1, -pos.x/2, -pos.y/2),cc.moveBy(0.1, pos.x, pos.y), cc.callFunc(() => {
            this.isAttacking = false;
            this.anim.resume();
            if (finish) { finish(this.data.attackPoint); }
        }), cc.moveTo(0.1, 0, 0));
        this.sprite.runAction(action);
    }
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = cc.pDistance(this.node.position, playerNode.position);
        return dis;
    }
    // attack(dir, finish) {
    //     if (this.isMoving || this.isDied) {
    //         return;
    //     }
    //     let x = 0;
    //     let y = 0;
    //     switch (dir) {
    //         case 0: y += 32; break;
    //         case 1: y -= 32; break;
    //         case 2: x -= 32; break;
    //         case 3: x += 32; break;
    //         case 4: break;
    //     }
    //     let action = cc.sequence(cc.moveBy(0.1, x, y), cc.callFunc(() => {
    //         if (finish) { finish(this.data.attackPoint); }
    //     }), cc.moveTo(0.1, 0, 0));
    //     this.sprite.runAction(action);
    // }
    move(dir: number, pos: cc.Vec2) {
        if (this.isDied || this.isFall) {
            return;
        }
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
        let speed = 100;
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement;
        this.isMoving = h != 0 || v != 0;
        if (this.isMoving) {
            this.isFaceRight = h > 0;
        }
        if (this.isMoving) {
            if (!this.anim.getAnimationState('PlayerWalk').isPlaying) {
                this.anim.playAdditive('PlayerWalk');
            }
        } else {
            if (this.anim.getAnimationState('PlayerWalk').isPlaying) {
                this.anim.play('PlayerIdle');
            }
        }

        let isUpDown = dir == 1 || dir == 0;
        if (isUpDown) {
            this.changeZIndex();
        }
    }

    start() {
        let ss = this.node.getComponentsInChildren(cc.Sprite);
        for (let i = 0; i < ss.length; i++) {
            if (ss[i].spriteFrame) {
                ss[i].spriteFrame.getTexture().setAliasTexParameters();
            }
        }
        this.changeZIndex();
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.maxHealth);
        let collider: cc.PhysicsCollider = this.getComponent('cc.PhysicsCollider');
        collider.sensor = false;
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
    takeDamage(damage: number) {
        this.data.currentHealth -= damage;
        if (this.data.currentHealth > this.data.maxHealth) {
            this.data.currentHealth = this.data.maxHealth;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.maxHealth);
        if (this.data.currentHealth < 1) {
            this.killed();
        }
    }
    killed() {
        if (this.isDied) {
            return;
        }
        this.isDied = true;
        this.anim.play('PlayerDie');
        let collider: cc.PhysicsCollider = this.getComponent('cc.PhysicsCollider');
        collider.sensor = true;
    }

    monsterAction(dungeon: Dungeon) {
        if (this.isDied) {
            return;
        }
        this.node.position = Dungeon.fixOuterMap(this.node.position);
        this.dungeon = dungeon;
        this.pos = Dungeon.getIndexInMap(this.node.position);
        this.rigidbody.linearVelocity = cc.v2(0, 0);
        let dir = this.getMonsterBestDir(this.pos, dungeon);
        let newPos = cc.v2(this.pos.x, this.pos.y);
        switch (dir) {
            case 0: if (newPos.y + 1 < 9) { newPos.y++; } break;
            case 1: if (newPos.y - 1 >= 0) { newPos.y--; } break;
            case 2: if (newPos.x - 1 >= 0) { newPos.x--; } break;
            case 3: if (newPos.x + 1 < 15) { newPos.x++; } break;
        }
        let playerDis = this.getNearPlayerDistance(dungeon.player.node);
        if (playerDis < 64 && !dungeon.player.isDied) {
            let pos = dungeon.player.node.position.sub(this.node.position);
            if (!pos.equals(cc.Vec2.ZERO)) {
                pos = pos.normalizeSelf();
            }
            this.meleeAttack(pos, (damage: number) => {
                dungeon.player.takeDamage(damage);
            });
        } else {
            let pos = Dungeon.getPosInMap(newPos).sub(this.node.position);
            if (playerDis < 200) {
                pos = dungeon.player.node.position.sub(this.node.position);
            }
            if (!pos.equals(cc.Vec2.ZERO)) {
                pos = pos.normalizeSelf();
                this.move(dir, pos);
            }
        }

    }
    getPosDir(oldPos: cc.Vec2, newPos: cc.Vec2): number {
        let dir = 4;
        if (newPos.x == oldPos.x) {
            dir = newPos.y > oldPos.y ? 0 : 1;
        }
        if (newPos.y == oldPos.y) {
            dir = newPos.x > oldPos.x ? 3 : 2;
        }
        if (newPos.equals(oldPos)) {
            dir = 4;
        }
        return dir;
    }
    getMonsterBestDir(pos: cc.Vec2, dungeon: Dungeon): number {
        let bestPos = cc.v2(pos.x, pos.y);
        //获取9个点并打乱顺序
        let dirArr = new Array();
        if (pos.y + 1 < 9) {
            dirArr.push(cc.v2(pos.x, pos.y + 1));
        }
        if (pos.y - 1 >= 0) {
            dirArr.push(cc.v2(pos.x, pos.y - 1));
        }
        if (pos.x - 1 >= 0) {
            dirArr.push(cc.v2(pos.x - 1, pos.y));
        }
        if (pos.x + 1 < 9) {
            dirArr.push(cc.v2(pos.x + 1, pos.y));
        }

        dirArr.sort(() => {
            return 0.5 - Math.random();
        })
        //获取没有塌陷且没有其他怪物的tile
        let goodArr = new Array();
        for (let i = 0; i < dirArr.length; i++) {
            let newPos = dirArr[i];
            let tile = dungeon.map[newPos.x][newPos.y];
            if (!tile.isBroken) {
                let hasOther = false;
                for (let other of dungeon.monsters) {
                    if (other.pos.equals(newPos)) {
                        hasOther = true;
                        break;
                    }
                }
                let w = dungeon.wallmap[newPos.x][newPos.y]
                if (w && w.node.active) {
                    hasOther = true;
                }
                // let trap = dungeon.trapmap[newPos.x][newPos.y]
                // if (trap && trap.node.active) {
                //     hasOther = true;
                // }
                if (!hasOther) {
                    goodArr.push(newPos);
                }
            }
        }
        for (let i = 0; i < goodArr.length; i++) {
            let newPos = goodArr[i];
            if (newPos.equals(dungeon.player.pos)) {
                bestPos = newPos;
                break;
            }
            let tile = dungeon.map[newPos.x][newPos.y];
            if (!tile.isBreakingNow) {
                bestPos = newPos;
            }

        }
        let dir = this.getPosDir(pos, bestPos);
        return dir;
    }



    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 1) {
            this.timeDelay = 0;
        }
        if (this.dungeon) {
            let playerDis = this.getNearPlayerDistance(this.dungeon.player.node);
            if (playerDis < 64) {
                this.rigidbody.linearVelocity = cc.v2(0, 0);
            }
        }
        if(this.isDied){
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
        }
        if (this.label) {
            this.label.string = "" + this.node.zIndex;
        }
        this.healthBar.node.active = !this.isDied;
        if (this.data.currentHealth < 1) {
            this.killed();
        }
        this.sprite.scaleX = this.isFaceRight ? 1 : -1;
    }
}
