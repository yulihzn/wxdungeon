import Coin from "../Item/Coin";
import Dungeon from "../Dungeon";
import OilGold from "../Item/OilGold";

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
    @property(cc.Prefab)
    oilGold:cc.Prefab = null;
    private coinPool: cc.NodePool;
    private oilPool: cc.NodePool;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.coinPool = new cc.NodePool();
        this.oilPool = new cc.NodePool();
        cc.director.on('destorycoin', (event) => {
            this.destroyCoin(event.detail.coinNode);
        });
        cc.director.on('destoryoilgold', (event) => {
            this.destroyOilGold(event.detail.oilGoldNode);
        });
    }
    getValueCoin(count:number,pos:cc.Vec2,parentNode:cc.Node){
        let updateValue = Coin.FACE_VALUE;
        let v = count%updateValue;
        for(let i = 0;i < v;i++){
            this.getItem(1,pos,parentNode,true);
        }
        let v1 = (count - v)/updateValue;
        for(let i = 0;i < v1;i++){
            this.getItem(updateValue,pos,parentNode,true);
        }
    }
    getValueOilGold(count:number,pos:cc.Vec2,parentNode:cc.Node){
        let updateValue = OilGold.FACE_VALUE;
        let v = count%updateValue;
        for(let i = 0;i < v;i++){
            this.getItem(1,pos,parentNode,false);
        }
        let v1 = (count - v)/updateValue;
        for(let i = 0;i < v1;i++){
            this.getItem(updateValue,pos,parentNode,false);
        }
    }
    
    private getItem(value:number,pos:cc.Vec2,parentNode:cc.Node,isCoin:boolean){
        let pool = isCoin?this.coinPool:this.oilPool;
        let prefab = isCoin?this.coin:this.oilGold;
        let player;
        let dungeon = parentNode.getComponent(Dungeon);
        if(dungeon){
            player = dungeon.player;
        }
        let itemPrefab:cc.Node = null;
        if (pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            itemPrefab = pool.get();
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!itemPrefab || itemPrefab.active) {
            itemPrefab = cc.instantiate(prefab);
        }
        itemPrefab.parent = parentNode;
        itemPrefab.position = pos;
        let item = isCoin?itemPrefab.getComponent(Coin):itemPrefab.getComponent(OilGold);
        item.player = player;
        item.changeValue(value);
        item.node.zIndex = 4000;
        itemPrefab.active = true;
    }
    destroyCoin(coinNode: cc.Node) {
        coinNode.active = false;
        if (this.coinPool) {
            this.coinPool.put(coinNode); 
        }
    }
    destroyOilGold(oilGoldNode: cc.Node) {
        oilGoldNode.active = false;
        if (this.oilPool) {
            this.oilPool.put(oilGoldNode); 
        }
    }
}
