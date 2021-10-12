// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GoodsData from "../data/GoodsData";
import { EventHelper } from "../logic/EventHelper";
import Goods from "../item/Goods";
import Logic from "../logic/Logic";
import Tips from "../ui/Tips";
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
    goodsNameList:string [] = [];
    tips:Tips;
    martshelvesbg:cc.Node;
    martshelvesside0:cc.Node;
    martshelvesside1:cc.Node;
    martshelvesside2:cc.Node;
    martshelvesside3:cc.Node;
    onLoad() {
        this.tips = this.getComponentInChildren(Tips);
        this.tips.onInteract(()=>{
            if (this.node) {
                EventHelper.emit(EventHelper.HUD_MART_SHELVES_DIALOG,{type:this.type,goodsNameList:this.goodsNameList});
            }
        });
    }
    // update (dt) {}

    init(type: string,goodsNameList:string[]) {
        this.goodsNameList = goodsNameList;
        this.type = type;
        this.changeBg(type);
        this.addGoods(goodsNameList);
    }
    changeBg(type:string){
        if(!this.martshelvesbg){
            this.martshelvesbg = this.node.getChildByName('sprite').getChildByName('martshelves');
            this.martshelvesside0 = this.node.getChildByName('sprite').getChildByName('martshelvesside0');
            this.martshelvesside1 = this.node.getChildByName('sprite').getChildByName('martshelvesside1');
            this.martshelvesside2 = this.node.getChildByName('sprite').getChildByName('martshelvesside2');
            this.martshelvesside3 = this.node.getChildByName('sprite').getChildByName('martshelvesside3');
        }
        let color = type == MartShelves.TYPE_WOOD?'#DF8143':'#FFFFFF';
        this.martshelvesbg.color = cc.color().fromHEX(color);
        if(type != MartShelves.TYPE_FRIDGE){
            this.martshelvesside0.color = cc.color().fromHEX(color);
        }
        this.martshelvesside1.color = cc.color().fromHEX(color);
        this.martshelvesside2.color = cc.color().fromHEX(color);
        this.martshelvesside3.color = cc.color().fromHEX(color);
    }
    addGoods(goodsNameList: string[]) {
        this.layer.removeAllChildren();
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
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
    }
}
