import Bullet from "./Item/Bullet";
import Dungeon from "./Dungeon";
import Player from "./Player";
import Monster from "./Monster";
import Kraken from "./Boss/Kraken";
import { EventConstant } from "./EventConstant";
import Box from "./Building/Box";
import Logic from "./Logic";
import MeleeWeaponChild from "./MeleeWeaponChild";
import Captain from "./Boss/Captain";
import EquipmentData from "./Data/EquipmentData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//发射器
const { ccclass, property } = cc._decorator;

@ccclass
export default class MeleeWeapon extends cc.Component {
    public static readonly ELEMENT_TYPE_ICE = 1;
    public static readonly ELEMENT_TYPE_FIRE = 2;
    public static readonly ELEMENT_TYPE_LIGHTENING = 3;
    public static readonly ELEMENT_TYPE_TOXIC = 4;
    public static readonly ELEMENT_TYPE_CURSE = 5;

    @property(cc.Node)
    playerNode: cc.Node = null;
    player: Player = null;

    @property(MeleeWeaponChild)
    stabWeapon: MeleeWeaponChild = null;
    @property(MeleeWeaponChild)
    waveWeapon: MeleeWeaponChild = null;

    @property(cc.Prefab)
    iceLight: cc.Prefab = null;
    @property(cc.Prefab)
    fireLight: cc.Prefab = null;
    @property(cc.Prefab)
    lighteningLight: cc.Prefab = null;
    @property(cc.Prefab)
    toxicLight: cc.Prefab = null;
    @property(cc.Prefab)
    curseLight: cc.Prefab = null;

    private isReverse = false;
    private anim: cc.Animation;
    isAttacking: boolean = false;
    private hv: cc.Vec2 = cc.v2(1, 0);
    isStab = true;//刺
    isFar = false;//近程
    dungeon: Dungeon;
    weaponFirePoint: cc.Node;//剑尖

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.player = this.playerNode.getComponent(Player);
        this.weaponFirePoint = this.node.getChildByName('firepoint');
        // this.stabWeapon.meleeWeapon = this;
        // this.waveWeapon.meleeWeapon = this;
    }
    setHv(hv: cc.Vec2) {
        let pos = this.hasNearEnemy();
        if (!pos.equals(cc.Vec2.ZERO)) {
            this.rotateColliderManager(cc.v2(this.node.position.x + pos.x, this.node.position.y + pos.y));
            this.hv = pos;
        } else {
            this.hv = hv;
        }
    }
    getHv(): cc.Vec2 {
        return this.hv;
    }

    attack(speed: number, data: EquipmentData) {
        if (this.isAttacking) {
            return;
        }
        this.isAttacking = true;
        let animSpeed = 1 + speed / 1000;
        if (animSpeed < 0.2) {
            animSpeed = 0.2;
        }
        if (animSpeed > 3) {
            animSpeed = 3;
        }
        if (this.anim) {
            this.anim.play(this.getAttackAnimName());
            this.anim.getAnimationState(this.getAttackAnimName()).speed = animSpeed;
        }
        let p = this.weaponFirePoint.position.clone();
        let ran = Logic.getRandomNum(0,100);
        let waves = [data.iceDamage > 0&&ran<data.iceRate ? MeleeWeapon.ELEMENT_TYPE_ICE : 0
            , data.fireDamage > 0&&ran<data.fireRate ? MeleeWeapon.ELEMENT_TYPE_FIRE : 0
            , data.lighteningDamage > 0&&ran<data.lighteningRate ? MeleeWeapon.ELEMENT_TYPE_LIGHTENING : 0
            , data.toxicDamage > 0&&ran<data.toxicRate ? MeleeWeapon.ELEMENT_TYPE_TOXIC : 0
            , data.curseDamage > 0&&ran<data.curseRate ? MeleeWeapon.ELEMENT_TYPE_CURSE : 0];
        for (let w of waves) {
            this.getWaveLight(this.dungeon.node, p, w, this.isStab, this.isFar, this.isReverse);
        }
    }
    private getAttackAnimName(): string {
        let name = "MeleeAttackStab";
        if (!this.isFar && this.isStab) {
            name = "MeleeAttackStab";
        } else if (this.isFar && this.isStab) {
            name = "MeleeAttackStabFar";
        } else if (this.isFar && !this.isStab) {
            this.isReverse ? name = "MeleeAttackFarReverse" : name = "MeleeAttackFar";
        } else {
            this.isReverse ? name = "MeleeAttackReverse" : name = "MeleeAttack";
        }
        return name;
    }
    private getWaveLight(dungeonNode: cc.Node, p: cc.Vec2, elementType: number, isStab: boolean, isFar: boolean, isReverse: boolean) {
        let lights = [this.iceLight, this.fireLight, this.lighteningLight, this.toxicLight, this.curseLight];
        if (elementType < 1 || elementType > lights.length || !this.dungeon) {
            return;
        }
        let firePrefab: cc.Node = cc.instantiate(lights[elementType - 1]);
        let xoffset = 50;
        let xoffset1 = 40;
        let yoffset = 60;
        if (isFar) {
            xoffset = 70;
            xoffset1 = 60;
            yoffset = 70;
        }
        let notStab1 = [cc.v2(p.x, -p.y - yoffset), cc.v2(p.x + xoffset1, -p.y - yoffset / 2), cc.v2(p.x + xoffset, p.y), cc.v2(p.x + xoffset1, p.y + yoffset / 2), cc.v2(p.x, p.y + yoffset)];
        let notStab2 = [cc.v2(p.x, p.y + yoffset), cc.v2(p.x + xoffset1, p.y + yoffset / 2), cc.v2(p.x + xoffset, p.y), cc.v2(p.x + xoffset1, -p.y - yoffset / 2), cc.v2(p.x, -p.y - yoffset)];
        let ps = [cc.v2(p.x + xoffset, p.y), cc.v2(p.x + xoffset, p.y), cc.v2(p.x + xoffset, p.y), cc.v2(p.x + xoffset, p.y), cc.v2(p.x + xoffset, p.y)];
        if (!isStab) {
            ps = isReverse ? notStab1 : notStab2;
        }
        for (let i = 0; i < ps.length; i++) {
            let psp = ps[i];
            psp = this.node.convertToWorldSpace(psp);
            psp = dungeonNode.convertToNodeSpace(psp);
            ps[i] = psp.clone();
        }
        firePrefab.parent = dungeonNode;
        firePrefab.position = ps[0];
        firePrefab.zIndex = 4000;
        firePrefab.opacity = 255;
        firePrefab.active = true;
        let action = cc.sequence(cc.moveTo(0.025, ps[1]), cc.moveTo(0.05, ps[2]), cc.moveTo(0.075, ps[3]), cc.moveTo(0.1, ps[4]));
        firePrefab.runAction(action);

    }
    //Anim
    MeleeAttackFinish(reverse: boolean) {
        this.isAttacking = false;
        this.isReverse = !reverse;
        // this.waveWeapon.isAttacking = false;
        // this.stabWeapon.isAttacking = false;
    }

    start() {
    }

    getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(Math.random() * (max - min));
    }

    update(dt) {

        let pos = this.hasNearEnemy();
        if (!pos.equals(cc.Vec2.ZERO)) {
            this.rotateColliderManager(cc.v2(this.node.position.x + pos.x, this.node.position.y + pos.y));
            this.hv = pos;
        } else if ((this.hv.x != 0 || this.hv.y != 0) && !this.isAttacking) {
            this.node.position = cc.v2(25, 45);
            let olderTarget = cc.v2(this.node.position.x + this.hv.x, this.node.position.y + this.hv.y);
            this.rotateColliderManager(olderTarget);
        }
    }
    hasNearEnemy() {

        let olddis = 1000;
        let pos = cc.v2(0, 0);
        if (this.dungeon) {
            for (let monster of this.dungeon.monsters) {
                let dis = Logic.getDistance(this.node.parent.position, monster.node.position);
                if (dis < 200 && dis < olddis && !monster.isDied) {
                    olddis = dis;
                    let p = this.node.position.clone();
                    p.x = this.node.scaleX > 0 ? p.x : -p.x;
                    pos = monster.node.position.sub(this.node.parent.position.add(p));
                }
            }
            if (olddis != 1000) {
                pos = pos.normalizeSelf();
            }
        }
        return pos;
    }
    rotateColliderManager(target: cc.Vec2) {
        // 鼠标坐标默认是屏幕坐标，首先要转换到世界坐标
        // 物体坐标默认就是世界坐标
        // 两者取差得到方向向量
        let direction = target.sub(this.node.position);
        // 方向向量转换为角度值
        let Rad2Deg = 360 / (Math.PI * 2);
        let angle: number = 360 - Math.atan2(direction.x, direction.y) * Rad2Deg;
        let offsetAngle = 90;
        this.node.scaleX = this.node.parent.scaleX;
        let sy = Math.abs(this.node.scaleY);
        this.node.scaleY = this.node.scaleX < 0 ? -sy : sy;
        angle += offsetAngle;
        if (angle >= 360) {
            angle -= 360;
        }
        if (angle <= -360) {
            angle += 360;
        }
        // 将当前物体的角度设置为对应角度
        // this.node.rotation = this.node.scaleX < 0 ? angle : -angle;
        this.node.rotation = this.node.scaleX < 0 ? angle : -angle;

    }
    onBeginContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        // this.attacking(otherCollider);
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        this.attacking(other);
    }
    beatBack(node: cc.Node) {
        let rigidBody: cc.RigidBody = node.getComponent(cc.RigidBody);
        let pos = this.getHv().clone();
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = cc.v2(1, 0);
        }
        let power = 640;
        if (!this.isFar && this.isStab) {
            power = 320;
        } else if (this.isFar && this.isStab) {
            power = 960;
        } else if (!this.isFar && !this.isStab) {
            power = 640;
        } else {
            power = 640;
        }
        pos = pos.normalizeSelf().mul(640);
        let action = cc.moveBy(0.1, pos.x, pos.y);
        // node.runAction(action);
        rigidBody.applyLinearImpulse(pos, rigidBody.getLocalCenter(), true);
    }
    attacking(attackTarget: cc.Collider) {
        if (!attackTarget || !this.isAttacking) {
            return;
        }
        // this.waveWeapon.isAttacking = true;
        // this.stabWeapon.isAttacking = true;
        let damage = 0;
        if (this.player) {
            damage = this.player.inventoryData.getFinalAttackPoint(this.player.baseAttackPoint);
        }
        let damageSuccess = false;
        let monster = attackTarget.node.getComponent(Monster);
        if (monster && !monster.isDied) {
            damageSuccess = monster.takeDamage(damage);
            if (damageSuccess) {
                this.beatBack(monster.node);
            }
        }

        let kraken = attackTarget.node.getComponent(Kraken);
        if (kraken && !kraken.isDied) {
            damageSuccess = kraken.takeDamage(damage);
        }
        let captain = attackTarget.node.getComponent(Captain);
        if (captain && !captain.isDied) {
            damageSuccess = captain.takeDamage(damage);
        }
        let box = attackTarget.node.getComponent(Box);
        if (box) {
            box.breakBox();
        }
        //生命汲取
        let drain = this.player.inventoryData.getLifeDrain();
        if (drain > 0 && damageSuccess) {
            this.player.takeDamage(-drain);
        }
    }
}
