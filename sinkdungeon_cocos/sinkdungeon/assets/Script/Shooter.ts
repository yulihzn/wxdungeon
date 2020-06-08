import Dungeon from "./Dungeon";
import Player from "./Player";
import Bullet from "./Item/Bullet";
import Monster from "./Monster";
import Logic from "./Logic";
import EquipmentData from "./Data/EquipmentData";
import BulletData from "./Data/BulletData";
import Random from "./Utils/Random";
import Boss from "./Boss/Boss";
import { EventHelper } from "./EventHelper";
import AudioPlayer from "./Utils/AudioPlayer";
import FromData from "./Data/FromData";
import DamageData from "./Data/DamageData";


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
export default class Shooter extends cc.Component {
    static DefAULT_SPEED = 300;
    @property(cc.Prefab)
    bullet: cc.Prefab = null;
    @property
    isAI: boolean = false;
    dungeon: Dungeon = null;
    //只有赋值才代表是玩家真正的shooter
    player: Player = null;
    isEx = false;//是否是额外shooter，额外shooter不耗子弹，伤害也按子弹来
    private graphics: cc.Graphics;

    private bulletPool: cc.NodePool;
    isAutoAim = true;
    bulletName: string = '';
    sprite: cc.Node;
    data: EquipmentData = new EquipmentData();
    parentNode: cc.Node;//该node为dungeon下发射器的载体
    private hv: cc.Vec3 = cc.v3(1, 0);
    isAiming = false;//是否在瞄准
    //玩家远程伤害
    remoteDamagePlayer = new DamageData();
    from: FromData = new FromData();
    skipTopwall = false;
    anim:cc.Animation;

    onLoad() {
        this.graphics = this.getComponent(cc.Graphics);
        this.bulletPool = new cc.NodePool(Bullet);
        this.sprite = this.node.getChildByName('sprite');
        cc.director.on('destorybullet', (event) => {
            this.destroyBullet(event.detail.bulletNode);
        })
        this.anim = this.getComponent(cc.Animation);

    }
    playWalk(isPlay:boolean){
        if(!this.anim){
            return;
        }
        if(isPlay){
            this.anim.play('ShooterWalk')
        }else{
            this.anim.pause();
            this.sprite.y = 0;
        }
    }
    changeRes(resName: string, suffix?: string) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite');
        }
        if (!this.sprite) {
            return;
        }
        let spriteFrame = this.getSpriteFrameByName(resName, suffix);
        this.sprite.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.sprite.width = spriteFrame.getRect().width * 1.5;
        this.sprite.height = spriteFrame.getRect().height * 1.5;
        this.sprite.anchorX = 0.2;
        if (this.data.far == 1) {
            this.sprite.width = this.sprite.width * 2;
            this.sprite.height = this.sprite.height * 2;
            this.sprite.anchorX = 0.5
        }
    }
    changeResColor(color: cc.Color) {
        this.sprite.color = color;
    }
    private getSpriteFrameByName(resName: string, suffix?: string): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrames[resName + suffix];
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrames[resName];
        }
        return spriteFrame;
    }
    setHv(hv: cc.Vec3) {
        let pos = this.hasNearEnemy();
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.rotateColliderManager(cc.v3(this.node.position.x + pos.x, this.node.position.y + pos.y));
            this.hv = pos;
        } else {
            this.hv = hv.normalizeSelf();
        }
    }
    fireBullet(angleOffset?: number, defaultPos?: cc.Vec3) {
        if (this.data.isArcAim == 1 && this.graphics) {
            this.aimTargetArc(angleOffset, defaultPos);
        } else if (this.data.isLineAim == 1 && this.graphics) {
            this.aimTargetLine(angleOffset, defaultPos);
        } else {
            this.fireBulletDo(angleOffset, defaultPos);
        }
    }
    private fireBulletDo(angleOffset?: number, defaultPos?: cc.Vec3) {
        if (this.sprite) {
            this.sprite.stopAllActions();
            this.sprite.position = cc.Vec3.ZERO;
            // this.changeRes(this.data.img);
            let action = cc.sequence(cc.moveBy(0.1, 10, 0), cc.callFunc(() => { this.changeRes(this.data.img, 'anim') }, this)
                , cc.moveBy(0.05, -5, 0), cc.moveBy(0.05, 0, 0), cc.callFunc(() => { this.changeRes(this.data.img) }, this));
            this.sprite.runAction(action);
        }

        if (!angleOffset) {
            angleOffset = 0;
        }
        if (!this.dungeon) {
            return;
        }
        if (!this.isAI && this.player.inventoryManager.remote.equipmetType != 'remote') {
            return;
        }
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.SHOOT } });
        if (this.data.bulletNets > 0) {
            let bulletType = this.data.bulletType;
            // this.fireNetsBullet(0,bulletType);
            // this.fireNetsBullet(1,bulletType);
            // this.fireNetsBullet(2,bulletType);
            this.fireNetsBullet(3, bulletType);
        } else {
            this.fire(this.data.bulletType, this.bullet, this.bulletPool, angleOffset, this.hv.clone(), defaultPos);
            this.fireArcBullet(this.data.bulletType, defaultPos);
            this.fireLinecBullet(this.data.bulletType, angleOffset, defaultPos);
        }
    }
    private fireArcBullet(bulletType: string, defaultPos: cc.Vec3): void {
        if (this.data.bulletArcExNum <= 0) {
            return;
        }
        let angles = [10, -10, 20, -20, 30, -30, 40, -40, 50, -50, 60, -60, -70, -70, 80, -80, 90, -90, 100, -100, 110, -110, 120, -120, 130, -130, 140, -140, 150, -150, 160, -160, 170, -170, 180, -180]
        if (this.data.bulletArcExNum > angles.length) {
            //大于默认度数数组为16方向
            let circleAngles = [0, 20, 45, 65, 90, 110, 135, 155, 180, 200, 225, 245, 270, 290, 315, 335];
            //为80的时候是个八方向
            if (this.data.bulletArcExNum == 80) {
                circleAngles = [0, 45, 90, 135, 180, 225, 270, 315, 335];
            }
            for (let i = 0; i < circleAngles.length; i++) {
                this.fire(bulletType, this.bullet, this.bulletPool, circleAngles[i], this.hv.clone(), defaultPos);
            }
        } else {
            for (let i = 0; i < this.data.bulletArcExNum; i++) {
                if (i < angles.length) {
                    this.fire(bulletType, this.bullet, this.bulletPool, angles[i], this.hv.clone(), defaultPos);
                }
            }
        }

    }
    private fireLinecBullet(bulletType: string, angleOffset: number, defaultPos: cc.Vec3): void {
        if (this.data.bulletLineExNum == 0) {
            return;
        }
        this.schedule(() => {
            this.fire(bulletType, this.bullet, this.bulletPool, angleOffset, this.hv.clone(), defaultPos);
            this.fireArcBullet(bulletType, defaultPos);
        }, this.data.bulletLineInterval > 0 ? this.data.bulletLineInterval : 0.2, this.data.bulletLineExNum, 0);

    }
    //暂时不用，待完善
    private fireNetsBullet(dir: number, bulletType: string) {
        switch (dir) {
            case 0: this.setHv(cc.v3(0, 1)); break;
            case 1: this.setHv(cc.v3(0, -1)); break;
            case 2: this.setHv(cc.v3(-1, 0)); break;
            case 3: this.setHv(cc.v3(1, 0)); break;
        }
        let poses = [0, 128, -128, 256, -256];
        for (let i = 0; i < poses.length; i++) {
            this.fire(bulletType, this.bullet, this.bulletPool, 0, this.hv.clone(), cc.v3(64, poses[i]));
        }
    }

    /**
     * 发射子弹
     * @param prefab 预制
     * @param pool 线程池
     * @param angleOffset 角度
     * @param hv 方向向量
     * @param defaultPos 初始位置默认cc.v3(30, 0)
     */
    private fire(bulletType: string, prefab: cc.Prefab, pool: cc.NodePool, angleOffset: number, hv: cc.Vec3, defaultPos?: cc.Vec3) {
        let bulletPrefab: cc.Node = null;
        if (pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bulletPrefab = pool.get();
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!bulletPrefab || bulletPrefab.active) {
            bulletPrefab = cc.instantiate(prefab);
        }
        bulletPrefab.parent = this.node;
        let pos = this.node.convertToWorldSpaceAR(defaultPos ? defaultPos : cc.v3(30, 0));
        pos = this.dungeon.node.convertToNodeSpaceAR(pos);
        bulletPrefab.parent = this.dungeon.node;
        bulletPrefab.position = pos;
        bulletPrefab.scaleX = 1;
        bulletPrefab.scaleY = 1;
        bulletPrefab.active = true;
        let bullet = bulletPrefab.getComponent(Bullet);
        // bullet.node.rotation = this.node.scaleX < 0 ? -this.node.rotation-angleOffset : this.node.rotation-angleOffset;
        bullet.node.scaleY = this.node.scaleX > 0 ? 1 : -1;
        bullet.node.zIndex = 4000;
        bullet.isFromPlayer = !this.isAI;
        bullet.dungeon = this.dungeon;
        bullet.skipTopwall = this.skipTopwall;
        let bd = new BulletData();
        bd.valueCopy(Logic.bullets[bulletType])
        if (bullet.isFromPlayer && this.player && !this.isEx) {
            bd.damage.physicalDamage = this.remoteDamagePlayer.physicalDamage;
            bd.damage.isCriticalStrike = this.remoteDamagePlayer.isCriticalStrike;
        }
        bd.size += this.data.bulletSize;
        bd.speed += this.data.bulletExSpeed;
        if (bd.speed + this.data.bulletExSpeed > 50) {
            bd.speed += this.data.bulletExSpeed;
        }
        bd.from.valueCopy(this.from);
        bullet.changeBullet(bd);
        this.bulletName = bullet.name + bd.resName;
        bullet.enabled = true;
        bullet.showBullet(cc.v3(cc.v2(hv).rotateSelf(angleOffset * Math.PI / 180)));
    }
    destroyBullet(bulletNode: cc.Node) {
        // enemy 应该是一个 cc.Node
        bulletNode.active = false;
        let bullet = bulletNode.getComponent(Bullet);
        if (this.bulletPool && bullet.name == this.bulletName) {
            this.bulletPool.put(bulletNode);
        }
    }

    start() {
    }
    private drawLine(color: cc.Color, range: number, width: number) {
        if (!this.graphics) {
            return;
        }
        this.graphics.clear();
        this.graphics.fillColor = color;
        this.graphics.circle(0, 0, width / 2 + 1);
        this.graphics.circle(range, 0, width / 2 + 1);
        this.graphics.rect(0, -width / 2, range, width);
        this.graphics.fill();
    }
    private getRayCastPoint(range?: number, startPos?: cc.Vec3): cc.Vec3 {
        let s = startPos ? startPos : cc.v3(0, 0);
        let r = range ? range : 3000;
        let p = cc.v3(r, 0);
        let p1 = this.node.convertToWorldSpaceAR(s);
        let p2 = this.node.convertToWorldSpaceAR(p);
        let results = cc.director.getPhysicsManager().rayCast(cc.v2(p1), cc.v2(p2), cc.RayCastType.All);
        let arr: cc.Vec3[] = new Array();
        if (results.length > 0) {
            for (let result of results) {
                if (this.isValidRayCastCollider(result.collider)) {
                    p = this.node.convertToNodeSpaceAR(cc.v3(result.point));
                    arr.push(p);
                }
            }
        }
        let distance = r;
        for (let point of arr) {
            let dtemp = Logic.getDistance(point, s);
            if (distance >= dtemp) {
                distance = dtemp;
                p = point;
            }
        }
        return p;

    }
    //是否是有效碰撞体
    private isValidRayCastCollider(collider: cc.PhysicsCollider): boolean {
        let isInvalid = false;
        if (!this.isAI) {
            let player = collider.node.getComponent(Player);
            if (player) { isInvalid = true; }
        } else {
            let monster = collider.node.getComponent(Monster);
            let boss = collider.node.getComponent(Boss);
            if (monster || boss) { isInvalid = true; }
        }
        let bullet = collider.node.getComponent(Bullet);
        if (bullet) { isInvalid = true; }
        if (collider.sensor) { isInvalid = true; }
        return !isInvalid;
    }
    //线性瞄准
    private aimTargetLine(angleOffset?: number, defaultPos?: cc.Vec3) {
        if (this.isAiming) {
            return;
        }
        this.isAiming = true;
        if (!this.graphics) {
            return;
        }
        let width = 0;
        let p = this.getRayCastPoint();
        let isOver = false;
        let fun = () => {
            if (width < 1 && isOver) {
                this.fireBulletDo(angleOffset, defaultPos);
                this.unschedule(fun);
                this.graphics.clear();
                this.isAiming = false;
            } else {
                this.drawLine(cc.color(255, 0, 0, 200), p.x, width);
            }
            if (width > 10 && !isOver) {
                isOver = true;
            } else if (isOver) {
                width -= 1;
            } else {
                width += 1;
            }

        }
        this.schedule(fun, 0.02, 30);
    }
    private drawArc(angle: number) {
        if (!this.graphics) {
            return;
        }
        this.graphics.clear();
        if (angle < 0) {
            return;
        }
        let r = 1000;
        let startAngle = -angle * 2 * Math.PI / 360;
        let endAngle = angle * 2 * Math.PI / 360;
        let startPos = cc.v3(r * Math.cos(startAngle), r * Math.sin(startAngle));
        let endPos = cc.v3(r * Math.cos(endAngle), r * Math.sin(endAngle));
        this.graphics.arc(0, 0, r, 2 * Math.PI - startAngle, 2 * Math.PI - endAngle);
        this.graphics.fill();
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(startPos.x, startPos.y);
        this.graphics.lineTo(endPos.x, endPos.y);
        this.graphics.close();
        this.graphics.fill();
    }
    //圆弧瞄准
    private aimTargetArc(angleOffset?: number, defaultPos?: cc.Vec3) {
        if (this.isAiming) {
            return;
        }
        this.isAiming = true;
        let num = 45;
        let fun = () => {
            this.drawArc(--num);
            if (num < 0) {
                this.fireBulletDo(angleOffset, defaultPos);
                this.unschedule(fun);
                this.isAiming = false;
            }
        }
        this.schedule(fun, 0.025, 45);
    }
    getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(Random.rand() * (max - min));
    }

    update(dt) {
        let pos = this.hasNearEnemy();
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.rotateColliderManager(cc.v3(this.node.position.x + pos.x, this.node.position.y + pos.y));
            this.hv = pos;
        } else if (this.hv.x != 0 || this.hv.y != 0) {
            let olderTarget = cc.v3(this.node.position.x + this.hv.x, this.node.position.y + this.hv.y);
            this.rotateColliderManager(olderTarget);
        }
    }
    getParentNode(): cc.Node {
        if (this.parentNode) {
            return this.parentNode;
        } else {
            return this.node.parent;
        }
    }
    hasNearEnemy() {
        if (!this.isAutoAim) {
            return cc.Vec3.ZERO;
        }
        let olddis = 1000;
        let pos = cc.v3(0, 0);
        if (this.isAI) {
        } else if (this.dungeon) {
            for (let monster of this.dungeon.monsters) {
                let dis = Logic.getDistance(this.getParentNode().position, monster.node.position);
                if (dis < 600 && dis < olddis && !monster.isDied && !monster.isDisguising) {
                    olddis = dis;
                    let p = this.node.position.clone();
                    p.x = this.node.scaleX > 0 ? p.x : -p.x;
                    let mp = monster.node.position.clone();
                    mp.y += 32;
                    pos = mp.sub(this.getParentNode().position.add(p));
                }
            }
            if (pos.equals(cc.Vec3.ZERO)) {
                for (let boss of this.dungeon.bosses) {
                    let dis = Logic.getDistance(this.getParentNode().position, boss.node.position);
                    if (dis < 600 && dis < olddis && !boss.isDied) {
                        olddis = dis;
                        let p = this.node.position.clone();
                        p.x = this.node.scaleX > 0 ? p.x : -p.x;
                        let bp = boss.node.position.clone();
                        bp.y += 32;
                        pos = bp.sub(this.getParentNode().position.add(p));
                    }
                }

            }
            if (olddis != 1000) {
                pos = pos.normalizeSelf();
            }
        }
        return pos;
    }
    rotateColliderManager(target: cc.Vec3) {
        // 鼠标坐标默认是屏幕坐标，首先要转换到世界坐标
        // 物体坐标默认就是世界坐标
        // 两者取差得到方向向量
        let direction = target.sub(this.node.position);
        // 方向向量转换为角度值
        let Rad2Deg = 360 / (Math.PI * 2);
        let angle: number = 360 - Math.atan2(direction.x, direction.y) * Rad2Deg;
        let offsetAngle = 90;
        this.node.scaleX = this.getParentNode().scaleX > 0 ? 1 : -1;
        this.node.scaleY = this.getParentNode().scaleX > 0 ? 1 : -1;
        angle += offsetAngle;
        // 将当前物体的角度设置为对应角度
        this.node.angle = this.node.scaleX == -1 ? -angle : angle;

    }
}
