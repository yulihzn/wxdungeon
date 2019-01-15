import Dungeon from "./Dungeon";
import Player from "./Player";
import Bullet from "./Item/Bullet";
import Monster from "./Monster";
import Logic from "./Logic";
import EquipmentData from "./Data/EquipmentData";
import BulletData from "./Data/BulletData";
import Laser from "./Item/Laser";


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
    player: Player = null;

    private bulletPool: cc.NodePool;
    private timeDelay = 0;
    isAutoAim = true;
    bulletName: string = '';
    sprite: cc.Node;
    data: EquipmentData = new EquipmentData();

    private hv: cc.Vec2 = cc.v2(1, 0);

    onLoad() {
        this.bulletPool = new cc.NodePool();
        this.sprite = this.node.getChildByName('sprite');
        cc.director.on('destorybullet', (event) => {
            this.destroyBullet(event.detail.bulletNode);
        })
       
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
        this.sprite.width = spriteFrame.getRect().width*1.5;
        this.sprite.height = spriteFrame.getRect().height*1.5;
        this.sprite.anchorX = 0.2;
        if(this.data.far == 1){
            this.sprite.width = this.sprite.width*2;
            this.sprite.height = this.sprite.height*2;
            this.sprite.anchorX = 0.5
        }
    }
    private getSpriteFrameByName(resName: string, suffix?: string): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrames[resName + suffix];
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrames[resName];
        }
        return spriteFrame;
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
    remoteRate = 0;
    fireBullet(angleOffset?: number,speed?:number) {
        
        if (this.sprite) {
            this.sprite.stopAllActions();
            this.sprite.position = cc.Vec2.ZERO;
            this.changeRes(this.data.img);
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
        if (!this.isAI && this.player && (Logic.ammo <= 0 || this.player.inventoryManager.remote.equipmetType != 'remote')) {
            return;
        }
        if (!this.isAI && Logic.ammo > 0) {
            Logic.ammo--;
        }
        this.fire(this.bullet, this.bulletPool, angleOffset);
        this.fireArcBullet();
        this.fireLinecBullet(angleOffset);

    }
    private fireArcBullet():void{
        if(this.data.bulletArcExNum == 0){
            return;
        }
        let angles = [10,-10,20,-20,30,-30,40,-40,50,-50,60,-60,-70,-70,80,-80,90,-90]
        for(let i = 0;i < this.data.bulletArcExNum;i++){
            if(i < angles.length){
                if (!this.isAI && Logic.ammo > 0) {
                    Logic.ammo--;
                }
                this.fire(this.bullet, this.bulletPool, angles[i]);
            }
        }
    }
    private fireLinecBullet(angleOffset:number):void{
        if(this.data.bulletLineExNum == 0){
            return;
        }
        let i = 0;
        let interval = setInterval(()=>{
            i++;
            if (!this.isAI && Logic.ammo > 0) {
                Logic.ammo--;
            }
            this.fire(this.bullet, this.bulletPool, angleOffset);
            this.fireArcBullet();
            if(i>=this.data.bulletLineExNum){
                clearInterval(interval)
            }
        },100);
        
    }
   

    private fire(prefab: cc.Prefab, pool: cc.NodePool, angleOffset: number) {
        let bulletPrefab: cc.Node = null;
        if (pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bulletPrefab = pool.get();
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!bulletPrefab || bulletPrefab.active) {
            bulletPrefab = cc.instantiate(prefab);
        }
        bulletPrefab.parent = this.node;
        let pos = this.node.convertToWorldSpace(cc.v2(30, 0));
        pos = this.dungeon.node.convertToNodeSpace(pos);
        bulletPrefab.parent = this.dungeon.node;
        bulletPrefab.position = pos;
        bulletPrefab.scale = 1;
        bulletPrefab.active = true;
        let bullet = bulletPrefab.getComponent(Bullet);
        bullet.node.rotation = this.node.scaleX < 0 ? -this.node.rotation-angleOffset : this.node.rotation-angleOffset;
        bullet.node.scaleY = this.node.scaleX > 0 ? 1 : -1;
        bullet.node.zIndex = 4000;
        bullet.isFromPlayer = !this.isAI;
        bullet.dungeon = this.dungeon;
        if (bullet.isFromPlayer && this.player) {
            bullet.data.damage.physicalDamage = this.data.damageRemote;
        }
        let bd = new BulletData();
        bd.valueCopy(Logic.bullets[this.data.bulletType])
        bullet.changeBullet(bd);
        this.bulletName = bullet.name+bd.resName;
        bullet.showBullet(this.hv.clone().rotateSelf(angleOffset * Math.PI / 180));
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

    getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(Math.random() * (max - min));
    }

    update(dt) {
        let pos = this.hasNearEnemy();
        if (!pos.equals(cc.Vec2.ZERO)) {
            this.rotateColliderManager(cc.v2(this.node.position.x + pos.x, this.node.position.y + pos.y));
            this.hv = pos;
        } else if (this.hv.x != 0 || this.hv.y != 0) {
            let olderTarget = cc.v2(this.node.position.x + this.hv.x, this.node.position.y + this.hv.y);
            this.rotateColliderManager(olderTarget);
        }
    }
    hasNearEnemy() {
        if (!this.isAutoAim) {
            return cc.Vec2.ZERO;
        }
        let olddis = 1000;
        let pos = cc.v2(0, 0);
        if (this.isAI) {
        } else if (this.dungeon) {
            for (let monster of this.dungeon.monsters) {
                let dis = Logic.getDistance(this.node.parent.position, monster.node.position);
                if (dis < 500 && dis < olddis && !monster.isDied && !monster.isDisguising) {
                    olddis = dis;
                    let p = this.node.position.clone();
                    p.x = this.node.scaleX > 0 ? p.x : -p.x;
                    pos = monster.node.position.sub(this.node.parent.position.add(p));
                }
            }
            if(pos.equals(cc.Vec2.ZERO)){
                for (let boss of this.dungeon.bosses) {
                    let dis = Logic.getDistance(this.node.parent.position, boss.node.position);
                    if (dis < 500 && dis < olddis && !boss.isDied) {
                        olddis = dis;
                        let p = this.node.position.clone();
                        p.x = this.node.scaleX > 0 ? p.x : -p.x;
                        pos = boss.node.position.sub(this.node.parent.position.add(p));
                    }
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
        this.node.scaleX = this.node.parent.scaleX > 0 ? 1 : -1;
        this.node.scaleY = this.node.parent.scaleX > 0 ? 1 : -1;
        angle += offsetAngle;
        // 将当前物体的角度设置为对应角度
        this.node.rotation = this.node.scaleX == -1 ? angle : -angle;

    }
}
