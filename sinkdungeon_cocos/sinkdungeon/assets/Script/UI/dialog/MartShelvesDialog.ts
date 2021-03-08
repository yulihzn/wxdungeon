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
    static readonly SIZE_FRIDGE = 12;
    static readonly TYPE_NORMAL = 'Sa';
    static readonly TYPE_WOOD = 'Sb';
    static readonly TYPE_FRIDGE = 'Sc';
    @property(cc.Prefab)
    goods: cc.Prefab = null;
    @property(cc.Node)
    layer: cc.Node = null;
    @property(cc.Node)
    spriteNode:cc.Node = null;
    @property(cc.Node)
    fridgeNode:cc.Node = null;
    @property(cc.Node)
    fridgeLayer:cc.Node = null;
    @property(cc.Node)
    doorLeft:cc.Node = null;
    @property(cc.Node)
    doorRight:cc.Node = null;
    type: string = MartShelvesDialog.TYPE_NORMAL;
    goodsList: Goods[] = [];
    martshelvesbg:cc.Node;
    martshelvesside0:cc.Node;
    martshelvesside1:cc.Node;
    martshelvesside2:cc.Node;
    martshelvesside3:cc.Node;
    anim:cc.Animation;
    onLoad() {
        this.fridgeNode.active =false;
        this.spriteNode.active = false;
    }
    // update (dt) {}

    updateUI(type: string,goodsNameList:string[]) {
        this.type = type;
        this.changeBg(type);
        this.addGoods(type,goodsNameList);
    }
    changeBg(type:string){
        if(!this.martshelvesbg){
            this.martshelvesbg = this.node.getChildByName('sprite').getChildByName('martshelves');
            this.martshelvesside0 = this.node.getChildByName('sprite').getChildByName('martshelvesside0');
            this.martshelvesside1 = this.node.getChildByName('sprite').getChildByName('martshelvesside1');
            this.martshelvesside2 = this.node.getChildByName('sprite').getChildByName('martshelvesside2');
            this.martshelvesside3 = this.node.getChildByName('sprite').getChildByName('martshelvesside3');
        }
        let isFridge = type == MartShelvesDialog.TYPE_FRIDGE;
        if(isFridge){
            this.spriteNode.active = false;
            this.fridgeNode.active = true;
            this.doorLeft.scaleX = 1;
            this.doorRight.scaleX = 1;
        }else{
            this.spriteNode.active = true;
            this.fridgeNode.active = false;
        }
        let color = type == MartShelvesDialog.TYPE_WOOD?'#DF8143':'#FFFFFF';
        this.martshelvesbg.color = cc.color().fromHEX(color);
        this.martshelvesside0.color = cc.color().fromHEX(color);
        this.martshelvesside1.color = cc.color().fromHEX(color);
        this.martshelvesside2.color = cc.color().fromHEX(color);
        this.martshelvesside3.color = cc.color().fromHEX(color);
    }
    addGoods(type:string,goodsNameList: string[]) {
        this.layer.removeAllChildren();
        this.fridgeLayer.removeAllChildren();
        let isFridge = type == MartShelvesDialog.TYPE_FRIDGE;
        let layer = isFridge?this.fridgeLayer:this.layer;
        let size = isFridge?MartShelvesDialog.SIZE_FRIDGE:MartShelvesDialog.SIZE;
        for (let i = 0; i < size; i++) {
            if(i>goodsNameList.length-1){
                return;
            }
            let goods = cc.instantiate(this.goods).getComponent(Goods);
            let data = new GoodsData();
            data.count = 1;
            data.item.valueCopy(Logic.items[goodsNameList[i]]);
            goods.init(data);
            this.goodsList.push(goods);
            layer.addChild(goods.node);
        }
        if(isFridge){
            this.scheduleOnce(()=>{
                if(!this.anim){
                    this.anim = this.getComponent(cc.Animation);
                }
                this.anim.play();
            },1)
        
        }
    }
    close(){
        this.dismiss();
    }
}
