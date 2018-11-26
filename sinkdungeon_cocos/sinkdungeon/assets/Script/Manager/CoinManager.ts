import Coin from "../Item/Coin";
import Dungeon from "../Dungeon";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CoinManger extends cc.Component {

    @property(cc.Prefab)
    coin: cc.Prefab = null;
    private coinPool: cc.NodePool;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.coinPool = new cc.NodePool();
        cc.director.on('destorycoin', (event) => {
            this.destroyCoin(event.detail.coinNode);
        })
    }
    getValueCoin(count:number,pos:cc.Vec2,parentNode:cc.Node){
        let updateValue = Coin.FACE_VALUE;
        let v = count%updateValue;
        for(let i = 0;i < v;i++){
            this.getCoin(1,pos,parentNode);
        }
        let v1 = (count - v)/updateValue;
        for(let i = 0;i < v1;i++){
            this.getCoin(updateValue,pos,parentNode);
        }
    }
    private getCoin(value:number,pos:cc.Vec2,parentNode:cc.Node){
        let player;
        let dungeon = parentNode.getComponent(Dungeon);
        if(dungeon){
            player = dungeon.player;
        }
        let coinPrefab:cc.Node = null;
        if (this.coinPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            coinPrefab = this.coinPool.get();
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!coinPrefab || coinPrefab.active) {
            coinPrefab = cc.instantiate(this.coin);
        }
        coinPrefab.parent = parentNode;
        coinPrefab.position = pos;
        let coin = coinPrefab.getComponent(Coin);
        coin.player = player;
        coin.changeValue(value);
        coin.node.zIndex = 4000;
        coinPrefab.active = true;
    }
    destroyCoin(coinNode: cc.Node) {
        coinNode.active = false;
        let coin = coinNode.getComponent(Coin);
        if (this.coinPool) {
            this.coinPool.put(coinNode); 
        }
    }
    start () {

    }

    // update (dt) {}
}
