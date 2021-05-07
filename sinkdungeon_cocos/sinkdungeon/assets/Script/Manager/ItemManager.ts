import Coin from "../Item/Coin";
import Dungeon from "../Dungeon";
import OilGold from "../Item/OilGold";
import IndexZ from "../Utils/IndexZ";
import BaseManager from "./BaseManager";
import ShopTable from "../Building/ShopTable";
import Logic from "../Logic";
import Item from "../Item/Item";
import Player from "../Player";
import { EventHelper } from "../EventHelper";

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

@ccclass
export default class ItemManager extends BaseManager {

    @property(cc.Prefab)
    coin: cc.Prefab = null;
    @property(cc.Prefab)
    oilGold: cc.Prefab = null;
    @property(cc.Prefab)
    item: cc.Prefab = null;
    private coinPool: cc.NodePool;
    private oilPool: cc.NodePool;
    // LIFE-CYCLE CALLBACKS:
    groundList: Item[] = [];
    lastGroundItem: Item;

    onLoad() {
        this.coinPool = new cc.NodePool();
        this.oilPool = new cc.NodePool();
        cc.director.on('destorycoin', (event) => {
            this.destroyCoin(event.detail.coinNode);
        });
        cc.director.on('destoryoilgold', (event) => {
            this.destroyOilGold(event.detail.oilGoldNode);
        });
    }
    clear(): void {
        if(this.coinPool){
            this.coinPool.clear();
            this.oilPool.clear();
        }
        this.groundList = [];
    }
    getValueCoin(count: number, pos: cc.Vec3, parentNode: cc.Node) {
        let updateValue = Coin.FACE_VALUE;
        let v = count % updateValue;
        for (let i = 0; i < v; i++) {
            this.getCoinItem(1, pos, parentNode, true);
        }
        let v1 = (count - v) / updateValue;
        for (let i = 0; i < v1; i++) {
            this.getCoinItem(updateValue, pos, parentNode, true);
        }
    }
    getValueOilGold(count: number, pos: cc.Vec3, parentNode: cc.Node) {
        let updateValue = OilGold.FACE_VALUE;
        let v = count % updateValue;
        for (let i = 0; i < v; i++) {
            this.getCoinItem(1, pos, parentNode, false);
        }
        let v1 = (count - v) / updateValue;
        for (let i = 0; i < v1; i++) {
            this.getCoinItem(updateValue, pos, parentNode, false);
        }
    }

    private getCoinItem(value: number, pos: cc.Vec3, parentNode: cc.Node, isCoin: boolean) {
        let pool = isCoin ? this.coinPool : this.oilPool;
        let prefab = isCoin ? this.coin : this.oilGold;
        let player;
        let dungeon = parentNode.getComponent(Dungeon);
        if (dungeon) {
            player = dungeon.player;
        }
        let itemPrefab: cc.Node = null;
        if (pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            itemPrefab = pool.get();
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!itemPrefab || itemPrefab.active) {
            itemPrefab = cc.instantiate(prefab);
        }
        itemPrefab.parent = parentNode;
        itemPrefab.position = pos;
        let item = isCoin ? itemPrefab.getComponent(Coin) : itemPrefab.getComponent(OilGold);
        item.player = player;
        item.changeValue(value);
        item.node.zIndex = IndexZ.OVERHEAD;
        itemPrefab.active = true;
    }
    private destroyCoin(coinNode: cc.Node) {
        coinNode.active = false;
        if (this.coinPool) {
            this.coinPool.put(coinNode);
        }
    }
    private destroyOilGold(oilGoldNode: cc.Node) {
        oilGoldNode.active = false;
        if (this.oilPool) {
            this.oilPool.put(oilGoldNode);
        }
    }
    public addItem(pos: cc.Vec3, resName: string, count?: number, shopTable?: ShopTable) {
        if (!this.item || !Logic.items[resName]) {
            return;
        }
        let item = cc.instantiate(this.item);
        item.parent = this.node;
        item.position = pos;
        let indexpos = Dungeon.getIndexInMap(pos);
        item.zIndex = IndexZ.OVERHEAD;
        let itemScript = item.getComponent(Item);
        itemScript.init(resName, indexpos.clone(), count, shopTable);
        let data = item.getComponent(Item).data;
        if(shopTable){
            return;
        }
        let curritems = Logic.mapManager.getCurrentMapItems();
        if (curritems) {
            curritems.push(data);
        } else {
            curritems = new Array();
            curritems.push(data);
            Logic.mapManager.setCurrentItemsArr(curritems);
        }
        this.groundList.push(itemScript);
    }
    public addItemFromMap(mapStr: string, indexPos: cc.Vec3) {
        //生成心
        if (mapStr == 'A0') {
            this.addItem(Dungeon.getPosInMap(indexPos), Item.HEART);
        }
        //生成梦境
        if (mapStr == 'A1') {
            this.addItem(Dungeon.getPosInMap(indexPos), Item.DREAM);
        }
        //生成红色药丸
        if (mapStr == 'A3') {
            this.addItem(Dungeon.getPosInMap(indexPos), Item.REDCAPSULE);
        }
        //生成蓝色药丸
        if (mapStr == 'A1') {
            this.addItem(Dungeon.getPosInMap(indexPos), Item.BLUECAPSULE);
        }
        //生成无敌盾
        if (mapStr == 'A4') {
            this.addItem(Dungeon.getPosInMap(indexPos), Item.SHIELD);
        }
        //生成金苹果
        if (mapStr == 'A5') {
            this.addItem(Dungeon.getPosInMap(indexPos), Item.GOLDAPPLE);
        }
        //治疗瓶
        if (mapStr == 'Aa') {
            this.addItem(Dungeon.getPosInMap(indexPos), Item.BOTTLE_HEALING);
        }
        //移速瓶
        if (mapStr == 'Ab') {
            this.addItem(Dungeon.getPosInMap(indexPos), Item.BOTTLE_MOVESPEED);
        }
        //攻速瓶
        if (mapStr == 'Ac') {
            this.addItem(Dungeon.getPosInMap(indexPos), Item.BOTTLE_ATTACK);
        }
        //梦境瓶
        if (mapStr == 'Ad') {
            this.addItem(Dungeon.getPosInMap(indexPos), Item.BOTTLE_DREAM);
        }

        //远程瓶
        if (mapStr == 'Ae') {
            this.addItem(Dungeon.getPosInMap(indexPos), Item.BOTTLE_REMOTE);
        }
    }

    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.2) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }

    updateLogic(dt: number, player: Player) {
        if (this.isCheckTimeDelay(dt)) {
            let distance = 200;
            let item: Item = null;
            for (let i=this.groundList.length-1;i>=0;i--) {
                let e = this.groundList[i];
                e.highLight(false);
                if(!e.isValid||e.data.isTaken){
                    this.groundList.splice(i,1);
                    continue;
                }
                let d = Logic.getDistance(e.node.position, player.node.position);
                if (d < distance) {
                    distance = d;
                    item = e;
                }
            }
            let min = item&&item.data.canSave?64:32;
            if (distance < min && item) {
                item.highLight(true);
                if (!item.taketips) {
                    item.taketips = this.node.getChildByName('sprite').getChildByName('taketips');
                }
                if (item.data.canSave) {
                    if (!this.lastGroundItem||this.lastGroundItem.uuid != item.uuid) {
                        item.taketips.runAction(cc.sequence(cc.fadeIn(0.2), cc.delayTime(1), cc.fadeOut(0.2)));
                        cc.director.emit(EventHelper.HUD_GROUND_ITEM_INFO_SHOW,{detail:{itemData:item.data}});
                    }
                    this.lastGroundItem = item;
                }else{
                    item.taken(player,false);
                    this.lastGroundItem = null;
                }
            } else {
                this.lastGroundItem = null;
                cc.director.emit(EventHelper.HUD_GROUND_ITEM_INFO_HIDE);

            }
        }
    }
}
