import AreaOfEffect from "../actor/AreaOfEffect";
import CCollider from "../collider/CCollider";
import AreaOfEffectData from "../data/AreaOfEffectData";
import BulletData from "../data/BulletData";
import DamageData from "../data/DamageData";
import EquipmentData from "../data/EquipmentData";
import FromData from "../data/FromData";
import Bullet from "../item/Bullet";
import InventoryManager from "../manager/InventoryManager";
import ActorUtils from "../utils/ActorUtils";
import AudioPlayer from "../utils/AudioPlayer";
import IndexZ from "../utils/IndexZ";
import NodeKey from "../utils/NodeKey";
import Utils from "../utils/Utils";
import Dungeon from "./Dungeon";
import Logic from "./Logic";
import Player from "./Player";



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
    static readonly ARC_EX_NUM_8 = 80;
    static readonly ARC_EX_NUM_16 = 99;
    @property(cc.Prefab)
    bullet: cc.Prefab = null;
    @property
    isAI: boolean = false;
    isFromPlayer = false;
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
    isBuilding = false;
    anim: cc.Animation;
    private aoePools: { [key: string]: cc.NodePool } = {};

    onLoad() {
        this.graphics = this.getComponent(cc.Graphics);
        this.bulletPool = new cc.NodePool(Bullet);
        this.sprite = this.node.getChildByName('sprite');
        this.anim = this.getComponent(cc.Animation);

    }
    playWalk(isPlay: boolean) {
        if (!this.anim) {
            return;
        }
        if (isPlay) {
            this.anim.play('ShooterWalk')
        } else {
            this.anim.pause();
            this.sprite.y = 0;
        }
    }
    changeRes(resName: string, subfix?: string) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite');
        }
        if (!this.sprite) {
            return;
        }
        let spriteFrame = this.getSpriteFrameByName(resName, subfix);
        this.sprite.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        if (!this.isBuilding) {
            this.sprite.width = spriteFrame.getOriginalSize().width * 1.5;
            this.sprite.height = spriteFrame.getOriginalSize().height * 1.5;
            this.sprite.anchorX = 0.2;
            if (this.data.far == 1) {
                this.sprite.width = this.sprite.width * 2;
                this.sprite.height = this.sprite.height * 2;
                this.sprite.anchorX = 0.5
            }
        }

    }
    changeResColor(color: cc.Color) {
        this.sprite.color = color;
    }
    private getSpriteFrameByName(resName: string, subfix?: string): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrameRes(resName + subfix);
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrameRes(resName + 'anim0');
        }
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrameRes(resName);
        }
        return spriteFrame;
    }
    get Hv() {
        return this.hv;
    }
    setHv(hv: cc.Vec3) {
        this.hv = hv;
        let pos = this.hasNearEnemy();
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.hv = pos;
        }
        this.rotateCollider(cc.v2(this.hv.x, this.hv.y));
    }
    getAoeNode(prefab: cc.Prefab, usePool: boolean) {
        let temp: cc.Node = null;
        if (!this.aoePools[prefab.name]) {
            this.aoePools[prefab.name] = new cc.NodePool(AreaOfEffect);
        }
        if (this.aoePools[prefab.name] && this.aoePools[prefab.name].size() > 0 && usePool) { // 通过 size 接口判断对象池中是否有空闲的对象
            temp = this.aoePools[prefab.name].get();
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!temp || temp.active) {
            temp = cc.instantiate(prefab);
        }
        temp.opacity = 255;
        temp.active = true;
        return temp;
    }

    destroyAoePrefab(nodeKey:NodeKey) {
        if(!nodeKey){
            return;
        }
        if (!this.aoePools[nodeKey.key]) {
            this.aoePools[nodeKey.key] = new cc.NodePool(AreaOfEffect);
        }
        nodeKey.node.active = false;
        if (this.aoePools[nodeKey.key]) {
            this.aoePools[nodeKey.key].put(nodeKey.node);
        }
    }
    public fireAoe(prefab: cc.Prefab, aoeData: AreaOfEffectData, defaultPos?: cc.Vec3, angleOffset?: number, killCallBack?: Function, usePool?: boolean): AreaOfEffect {
        if (!this.dungeon) {
            return null;
        }
        if (!angleOffset) {
            angleOffset = 0;
        }
        let aoe = this.getAoeNode(prefab, usePool).getComponent(AreaOfEffect);
        if (aoe) {
            let pos = this.node.convertToWorldSpaceAR(defaultPos ? defaultPos : cc.v3(30, 0));
            pos = this.dungeon.node.convertToNodeSpaceAR(pos);
            aoe.show(this.dungeon.node, pos, this.hv, angleOffset, aoeData, killCallBack, usePool, (node: cc.Node) => {
                if (usePool) {
                    node.active = false;
                    this.destroyAoePrefab(new NodeKey(prefab.name, node));
                }
            });
        }
        return aoe;
    }
    public fireBullet(angleOffset?: number, defaultPos?: cc.Vec3, bulletArcExNum?: number, bulletLineExNum?: number, prefab?: cc.Prefab, aoeData?: AreaOfEffectData) {
        if (this.data.isLineAim == 1 && this.graphics) {
            this.aimTargetLine(angleOffset, defaultPos, bulletArcExNum, bulletLineExNum, prefab, aoeData);
        } else {
            this.fireBulletDo(angleOffset, defaultPos, bulletArcExNum, bulletLineExNum, prefab, aoeData);
        }
    }
    private fireBulletDo(angleOffset: number, defaultPos: cc.Vec3, bulletArcExNum: number, bulletLineExNum: number, prefab: cc.Prefab, aoeData: AreaOfEffectData) {
        if (this.sprite) {
            this.sprite.stopAllActions();
            this.sprite.position = cc.Vec3.ZERO;
            cc.tween(this.sprite).call(() => {
                this.changeRes(this.data.img, 'anim1');
            }).by(0.1, { position: cc.v3(10, 0) }).call(() => {
                this.changeRes(this.data.img, 'anim2');
            }).by(0.05, { position: cc.v3(-5, 0) }).by(0.05, { position: cc.v3(0, 0) }).call(() => {
                this.changeRes(this.data.img, 'anim0');
            }).start();
        }

        if (!angleOffset) {
            angleOffset = 0;
        }
        if (!this.dungeon) {
            return;
        }
        if (!this.isAI && !this.isEx && this.player.inventoryManager.equips[InventoryManager.REMOTE].equipmetType != InventoryManager.REMOTE) {
            return;
        }
        if (this.data.remoteAudio && this.data.remoteAudio.length > 0) {
            AudioPlayer.play(this.data.remoteAudio);
        } else {
            AudioPlayer.play(AudioPlayer.SHOOT);
        }
        this.fire(this.data.bulletType, this.bullet, this.bulletPool, angleOffset, this.hv.clone(), defaultPos, prefab, aoeData);
        this.fireArcBullet(this.data.bulletType, defaultPos, bulletArcExNum, prefab, aoeData);
        this.fireLinecBullet(this.data.bulletType, angleOffset, defaultPos, bulletArcExNum, bulletLineExNum, prefab, aoeData);
    }
    private fireArcBullet(bulletType: string, defaultPos: cc.Vec3, bulletArcExNum: number, prefab: cc.Prefab, aoeData: AreaOfEffectData): void {
        let exNum = bulletArcExNum ? this.data.bulletArcExNum + bulletArcExNum : this.data.bulletArcExNum;
        if (exNum <= 0) {
            return;
        }
        let angles = [10, -10, 20, -20, 30, -30, 40, -40, 50, -50, 60, -60, -70, -70, 80, -80, 90, -90, 100, -100, 110, -110, 120, -120, 130, -130, 140, -140, 150, -150, 160, -160, 170, -170, 180, -180]
        if (this.data.bulletArcExNum > angles.length) {
            //大于默认度数数组为16方向
            let circleAngles = [0, 20, 45, 65, 90, 110, 135, 155, 180, 200, 225, 245, 270, 290, 315, 335];
            //为80的时候是个八方向
            if (this.data.bulletArcExNum == Shooter.ARC_EX_NUM_8) {
                circleAngles = [0, 45, 90, 135, 180, 225, 270, 315, 335];
            }
            for (let i = 0; i < circleAngles.length; i++) {
                this.fire(bulletType, this.bullet, this.bulletPool, circleAngles[i], this.hv.clone(), defaultPos, prefab, aoeData);
            }
        } else {
            for (let i = 0; i < exNum; i++) {
                if (i < angles.length) {
                    this.fire(bulletType, this.bullet, this.bulletPool, angles[i], this.hv.clone(), defaultPos, prefab, aoeData);
                }
            }
        }

    }
    private fireLinecBullet(bulletType: string, angleOffset: number, defaultPos: cc.Vec3, bulletArcExNum: number, bulletLineExNum: number, prefab: cc.Prefab, aoeData: AreaOfEffectData): void {
        let exNum = bulletLineExNum ? this.data.bulletLineExNum + bulletLineExNum : this.data.bulletLineExNum;
        if (exNum == 0) {
            return;
        }
        this.schedule(() => {
            this.fire(bulletType, this.bullet, this.bulletPool, angleOffset, this.hv.clone(), defaultPos, prefab, aoeData);
            this.fireArcBullet(bulletType, defaultPos, bulletArcExNum, prefab, aoeData);
        }, this.data.bulletLineInterval > 0 ? this.data.bulletLineInterval : 0.2, exNum, 0);

    }
    //暂时不用，待完善
    // private fireNetsBullet(dir: number, bulletType: string) {
    //     switch (dir) {
    //         case 0: this.setHv(cc.v3(0, 1)); break;
    //         case 1: this.setHv(cc.v3(0, -1)); break;
    //         case 2: this.setHv(cc.v3(-1, 0)); break;
    //         case 3: this.setHv(cc.v3(1, 0)); break;
    //     }
    //     let poses = [0, 128, -128, 256, -256];
    //     for (let i = 0; i < poses.length; i++) {
    //         this.fire(bulletType, this.bullet, this.bulletPool, 0, this.hv.clone(), cc.v3(64, poses[i]));
    //     }
    // }

    /**
     * 发射子弹
     * @param prefab 预制
     * @param pool 线程池
     * @param angleOffset 角度
     * @param hv 方向向量
     * @param defaultPos 初始位置默认cc.v3(30, 0)
     */
    private fire(bulletType: string, prefab: cc.Prefab, pool: cc.NodePool, angleOffset: number, hv: cc.Vec3, defaultPos: cc.Vec3, aoePrefab: cc.Prefab, aoeData: AreaOfEffectData) {
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
        bullet.entity.Transform.position = pos;
        bullet.shooter = this;
        // bullet.node.rotation = this.node.scaleX < 0 ? -this.node.rotation-angleOffset : this.node.rotation-angleOffset;
        bullet.node.scaleY = this.node.scaleX > 0 ? 1 : -1;
        bullet.node.zIndex = IndexZ.OVERHEAD;
        bullet.isFromPlayer = !this.isAI || this.isFromPlayer;
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
        bullet.aoeData.valueCopy(aoeData);
        bullet.aoePrefab = aoePrefab;
        bullet.showBullet(cc.v3(cc.v2(hv).rotateSelf(angleOffset * Math.PI / 180)));
    }
    public addDestroyBullet(bulletNode: cc.Node) {
        // enemy 应该是一个 cc.Node
        bulletNode.active = false;
        this.destroyBullet(bulletNode)
    }
    private destroyBullet(bulletNode: cc.Node) {
        if (this.bulletPool&&bulletNode) {
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
        // let results = cc.director.getPhysicsManager().rayCast(cc.v2(p1), cc.v2(p2), cc.RayCastType.All);
        // let arr: cc.Vec3[] = new Array();
        // if (results.length > 0) {
        //     for (let result of results) {
        //         if (this.isValidRayCastCollider(result.collider)) {
        //             p = this.node.convertToNodeSpaceAR(cc.v3(result.point));
        //             arr.push(p);
        //         }
        //     }
        // }
        // let distance = r;
        // for (let point of arr) {
        //     let dtemp = Logic.getDistanceNoSqrt(point, s);
        //     if (distance >= dtemp) {
        //         distance = dtemp;
        //         p = point;
        //     }
        // }
        return p;

    }
    //是否是有效碰撞体
    private isValidRayCastCollider(collider: CCollider): boolean {
        let isInvalid = false;
        if (!this.isAI) {
            if (collider.tag == CCollider.TAG.PLAYER) { isInvalid = true; }
        } else {
            if (collider.tag == CCollider.TAG.NONPLAYER || collider.tag == CCollider.TAG.BOSS) { isInvalid = true; }
        }
        if (collider.tag == CCollider.TAG.BULLET) { isInvalid = true; }
        if (collider.sensor) { isInvalid = true; }
        return !isInvalid;
    }
    //线性瞄准
    private aimTargetLine(angleOffset: number, defaultPos: cc.Vec3, bulletArcExNum: number, bulletLineExNum: number, prefab: cc.Prefab, aoeData: AreaOfEffectData) {
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
                this.fireBulletDo(angleOffset, defaultPos, bulletArcExNum, bulletLineExNum, prefab, aoeData);
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
    
    update(dt: number) {
       
    }
    private getParentNode(): cc.Node {
        if (this.parentNode) {
            return this.parentNode;
        } else {
            return this.node.parent;
        }
    }
    private hasNearEnemy() {
        if (!this.isAutoAim) {
            return cc.Vec3.ZERO;
        }
        //ai手动寻找目标不检测转向，这里只针对玩家
        if (!this.isAI && this.dungeon) {
            return ActorUtils.getDirectionFromNearestEnemy(this.player.node.position, this.isAI, this.dungeon, false, 600);
        }
        return cc.Vec3.ZERO;
    }
    private rotateCollider(direction: cc.Vec2) {
        if (direction.equals(cc.Vec2.ZERO)) {
            return;
        }
        //设置缩放方向
        let sx = Math.abs(this.node.scaleX);
        this.node.scaleX = this.getParentNode().scaleX > 0 ? sx : -sx;
        let sy = Math.abs(this.node.scaleY);
        this.node.scaleY = this.node.scaleX < 0 ? -sy : sy;
        //设置旋转角度
        this.node.angle = Utils.getRotateAngle(direction, this.node.scaleX < 0);
    }
}
