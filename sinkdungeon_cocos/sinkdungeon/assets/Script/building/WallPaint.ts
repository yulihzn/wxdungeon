import Building from "./Building";
import Logic from "../logic/Logic";

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
export default class WallPaint extends Building {
    readonly RANGE = 3;
    readonly RANGE_PlAYER = 300;
    @property(cc.Sprite)
    frame:cc.Sprite = null;
    @property(cc.Sprite)
    paint:cc.Sprite = null;
    mapStr:string;

    init(mapStr:string){
        this.mapStr = mapStr;
        let letter = mapStr[2];
        let resName = `wallpaint24x32_000`;
        switch(letter){
            case '0':resName = `wallpaint24x32_000`;break;
            case '1':resName = `wallpaint24x32_001`;break;
            case '2':resName = `wallpaint24x32_002`;break;
            case '3':resName = `wallpaint24x32_003`;break;
            case '4':resName = `wallpaint32x16_000`;break;
            case '5':resName = `wallpaint24x32_005`;break;
            case '6':resName = `wallpaint24x32_000`;break;
            case '7':resName = `wallpaint24x32_000`;break;
            case '8':resName = `wallpaint24x32_000`;break;
            case '9':resName = `wallpaint24x32_000`;break;
        }
        let spriteframe = Logic.spriteFrameRes(resName);
        if(spriteframe){
            this.paint.spriteFrame = spriteframe;
            this.paint.node.width = spriteframe.getRect().width;
            this.paint.node.height = spriteframe.getRect().height;
            this.frame.node.width = this.paint.node.width+this.RANGE;
            this.frame.node.height = this.paint.node.height+this.RANGE;
        }
    }
}
