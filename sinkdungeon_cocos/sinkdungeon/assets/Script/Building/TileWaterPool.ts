import Dungeon from "../Dungeon";
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

@ccclass
export default class TileWaterPool extends Building {

    resName:string = 'tilewater_1_1';
    islight = false;
    changeRes(resName: string) {
        let sprite = this.getComponent(cc.Sprite);
        this.resName =resName];
        this.node.width = sprite.spriteFrame.getRect().width;
        this.node.height = sprite.spriteFrame.getRect().height;

    }
    changeWaterLight(){
        let sprite = this.getComponentInChildren(cc.Sprite);
            this.islight = !this.islight;
            sprite.spriteFrame =Logic.spriteFrames[this.islight?this.resName:'light'+this.resName];
    }
 
    setTiles(i: number, j: number, mapData: string[][]) {
        let sprite = this.getComponentInChildren(cc.Sprite);
        this.resName ='tilewater_1_1';
        let top = this.isWater(mapData[i][j + 1]);
        let bottom = this.isWater(mapData[i][j - 1]);
        let left = this.isWater(mapData[i - 1][j]);
        let right = this.isWater(mapData[i + 1][j]);
        if (!top&&bottom&&!left&&right) {
            this.resName ='tilewater_0_0';
        }
        if (!top&&bottom&&left&&right) {
            this.resName ='tilewater_0_1';
        }
        if (!top&&bottom&&left&&!right) {
            this.resName ='tilewater_0_2';
        }
        if (top&&bottom&&!left&&right) {
            this.resName ='tilewater_1_0';
        }
        if (top&&bottom&&left&&right) {
            this.resName ='tilewater_1_1';
        }
        if (top&&bottom&&left&&!right) {
            this.resName ='tilewater_1_2';
        }
        if (top&&!bottom&&!left&&right) {
            this.resName ='tilewater_2_0';
        }
        if (top&&!bottom&&left&&right) {
            this.resName ='tilewater_2_1';
        }
        if (top&&!bottom&&left&&!right) {
            this.resName ='tilewater_2_2';
        }
        sprite.spriteFrame = Logic[this.resName];
    }
    isWater(str: string) {
        return str == '~';
    }
}
