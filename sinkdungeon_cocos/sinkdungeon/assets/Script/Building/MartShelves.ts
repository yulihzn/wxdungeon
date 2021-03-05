// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GoodsData from "../Data/GoodsData";
import Goods from "../Item/Goods";
import Logic from "../Logic";
import Player from "../Player";
import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MartShelves extends Building {
    static readonly SIZE_NORMAL = 21;
    static readonly SIZE_FRIDGE = 12;
    static readonly TYPE_NORMAL = 'Sa';
    static readonly TYPE_WOOD = 'Sb';
    static readonly TYPE_FRIDGE = 'Sc';
    @property(cc.Prefab)
    goods: cc.Prefab = null;
    @property(cc.Node)
    layer: cc.Node = null;
    type: string = MartShelves.TYPE_NORMAL;
    goodsList: Goods[] = [];
    onLoad() {
    }
    // update (dt) {}

    init(type: string) {
        this.type = type;
        if (type == MartShelves.TYPE_WOOD) {
            this.node.getChildByName('sprite').getChildByName('martshelves').color = cc.color().fromHEX('#DF8143');
            this.node.getChildByName('sprite').getChildByName('martshelvesside0').color = cc.color().fromHEX('#DF8143');
            this.node.getChildByName('sprite').getChildByName('martshelvesside1').color = cc.color().fromHEX('#DF8143');
            this.node.getChildByName('sprite').getChildByName('martshelvesside2').color = cc.color().fromHEX('#DF8143');
            this.node.getChildByName('sprite').getChildByName('martshelvesside3').color = cc.color().fromHEX('#DF8143');
        }
        let drinkList:string[] = [];
        let foodList:string[] = [];
        let prefix = 'goods';
        for(let goods of Logic.goodsNameList){
            let index = goods.substring(prefix.length,prefix.length+1);
            if(index=='0'){
                drinkList.push(goods);
            }else if(index == '1'){
                foodList.push(goods);
            }
        }
        let goodsNameList: string[] = this.type==MartShelves.TYPE_FRIDGE?drinkList:foodList;
        this.addGoods(goodsNameList);
    }
    addGoods(goodsNameList: string[]) {
        let len = this.type == MartShelves.TYPE_FRIDGE?MartShelves.SIZE_FRIDGE:MartShelves.SIZE_NORMAL;
        for (let i = 0; i < len; i++) {
            if(i>goodsNameList.length-1){
                return;
            }
            let goods = cc.instantiate(this.goods).getComponent(Goods);
            let data = new GoodsData();
            data.count = 10;
            data.item.valueCopy(Logic.items[goodsNameList[i]]);
            goods.init(data);
            this.goodsList.push(goods);
            this.layer.addChild(goods.node);
        }

    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {

        let player = other.node.getComponent(Player);
        if (player) {
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {

        let player = other.node.getComponent(Player);
        if (player) {
        }
    }
}
