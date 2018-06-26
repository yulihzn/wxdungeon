import Bullet from "../Item/Bullet";

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
const {ccclass, property} = cc._decorator;

@ccclass
export default class Shooter extends cc.Component {

    @property(cc.Prefab)
    bullet: cc.Prefab = null;
    bulletPool:cc.NodePool;
    private timeDelay = 0;
    // LIFE-CYCLE CALLBACKS:
    @property
    dir:number = 0;

    @property
    auto:boolean = false;
    @property
    frequency:number = 1;

    onLoad () {
        this.bulletPool = new cc.NodePool();
        cc.director.on('destorybullet',(event)=>{
            this.destroyBullet(event.detail.bulletNode);
        })
    }

    fireBullet(){
        let bulletPrefab:cc.Node = null;
        if (this.bulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bulletPrefab = this.bulletPool.get();
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if(!bulletPrefab||bulletPrefab.active){
            bulletPrefab = cc.instantiate(this.bullet);
        }
        bulletPrefab.parent = this.node;
        bulletPrefab.position = cc.v2(0,0);
        bulletPrefab.scale = 1;
        bulletPrefab.active = true;
        let bullet = bulletPrefab.getComponent(Bullet);
        bullet.showBullet(this.dir)
    }
    destroyBullet(bullet:cc.Node) {
        // enemy 应该是一个 cc.Node
        bullet.active = false;
        if(this.bulletPool){
            this.bulletPool.put(bullet); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
        }
    }

    start () {
    }
    
    getRandomNum(min, max): number {//生成一个随机数从[min,max]
		return min + Math.round(Math.random() * (max - min));
	}

    update (dt) {
        this.timeDelay += dt;
        if (this.timeDelay > this.frequency && this.auto) {
            this.timeDelay = 0;
            this.fireBullet();
        }
    }
}
