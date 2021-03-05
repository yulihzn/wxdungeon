// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MartShelves from "../../Building/MartShelves";
import GoodsData from "../../Data/GoodsData";
import Goods from "../../Item/Goods";
import Logic from "../../Logic";
import BaseDialog from "./BaseDialog";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MartShelvesDialog extends BaseDialog {
    static readonly SIZE = 21;
    static readonly TYPE_NORMAL = 'Sa';
    static readonly TYPE_WOOD = 'Sb';
    static readonly TYPE_FRIDGE = 'Sc';
    @property(cc.Prefab)
    goods: cc.Prefab = null;
    @property(cc.Node)
    layer: cc.Node = null;
    type: string = MartShelvesDialog.TYPE_NORMAL;
    goodsList: Goods[] = [];
    onLoad() {
    }
    // update (dt) {}

    updateUI(type: string,goodsNameList:string[]) {
        this.type = type;
        if (type == MartShelvesDialog.TYPE_WOOD) {
            this.node.getChildByName('sprite').getChildByName('martshelves').color = cc.color().fromHEX('#DF8143');
            this.node.getChildByName('sprite').getChildByName('martshelvesside0').color = cc.color().fromHEX('#DF8143');
            this.node.getChildByName('sprite').getChildByName('martshelvesside1').color = cc.color().fromHEX('#DF8143');
            this.node.getChildByName('sprite').getChildByName('martshelvesside2').color = cc.color().fromHEX('#DF8143');
            this.node.getChildByName('sprite').getChildByName('martshelvesside3').color = cc.color().fromHEX('#DF8143');
        }
        this.addGoods(goodsNameList);
    }
    addGoods(goodsNameList: string[]) {
        for (let i = 0; i < MartShelvesDialog.SIZE; i++) {
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
}
