import Dungeon from "./Dungeon";
import Player from "./Player";
import Bullet from "./Item/Bullet";
import Monster from "./Monster";
import Logic from "./Logic";


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

    @property(cc.Prefab)
    bullet: cc.Prefab = null;
    @property
    auto: boolean = false;
    @property
    isAI: boolean = false;
    @property
    frequency: number = 1;
    @property(Dungeon)
    dungeon: Dungeon = null;
    @property(Player)
    player: Player = null;
    
    private bulletPool: cc.NodePool;
    private timeDelay = 0;
    private anim:cc.Animation;
    isAutoAim = true;
    bulletName:string = '';


    private hv: cc.Vec2 = cc.v2(1, 0);

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.bulletPool = new cc.NodePool();
        cc.director.on('destorybullet', (event) => {
            this.destroyBullet(event.detail.bulletNode);
        })
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
    fireBullet(){
        if(this.anim){
            this.anim.play();
        }
        this.fire(this.bullet,this.bulletPool);
    }

    private fire(prefab:cc.Prefab,pool:cc.NodePool) {
        if(!this.dungeon){
            return;
        }
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
        this.bulletName = bullet.name;
        bullet.node.rotation = this.node.scaleX == -1 ? -this.node.rotation : this.node.rotation;
        bullet.node.scaleY = this.node.scaleX;
        bullet.node.zIndex = 4000;
        bullet.isFromPlayer = !this.isAI;
        if (bullet.isFromPlayer && bullet.isMelee && this.player) {
            bullet.damage = this.player.inventoryData.getFinalAttackPoint(this.player.baseAttackPoint);
        }
        bullet.showBullet(this.hv);
    }
    destroyBullet(bulletNode: cc.Node) {
        // enemy 应该是一个 cc.Node
        bulletNode.active = false;
        let bullet = bulletNode.getComponent(Bullet);
        if (this.bulletPool && bullet.name==this.bulletName) {
            this.bulletPool.put(bulletNode); 
        }
    }

    start() {
    }

    getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(Math.random() * (max - min));
    }

    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > this.frequency && this.auto) {
            this.timeDelay = 0;
            this.fireBullet();
        }
        
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
        if(!this.isAutoAim){
            return cc.Vec2.ZERO;
        }
        let olddis = 1000;
        let pos = cc.v2(0, 0);
        if (this.isAI) {
        } else if(this.dungeon) {
            for (let monster of this.dungeon.monsters) {
                let dis = Logic.getDistance(this.node.parent.position, monster.node.position);
                if (dis < 500 && dis < olddis && !monster.isDied) {
                    olddis = dis;
                    pos = monster.node.position.sub(this.node.parent.position.add(this.node.position));
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
        angle += offsetAngle;
        // 将当前物体的角度设置为对应角度
        this.node.rotation = this.node.scaleX == -1 ? angle : -angle;

    }
}
