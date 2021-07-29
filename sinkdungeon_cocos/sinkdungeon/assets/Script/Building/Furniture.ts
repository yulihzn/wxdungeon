import Logic from "../Logic";
import Building from "./Building";

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
/**
 * 家具 家具在初次出现的时候会显示成快递盒子的样子，靠近出现交互提示，可以打开盒子显示该建筑并激活改建筑的效果
 */
@ccclass
export default class Furniture extends Building {

    static readonly BATH = 'furniture002';
    sprite:cc.Sprite;
    box:cc.Sprite;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        this.box = this.node.getChildByName('box').getComponent(cc.Sprite);
    }
    changeRes(resName: string) {
        this.sprite.spriteFrame = Logic.spriteFrameRes(resName);
    }
    
    start() {
    }

    // update (dt) {}
}
