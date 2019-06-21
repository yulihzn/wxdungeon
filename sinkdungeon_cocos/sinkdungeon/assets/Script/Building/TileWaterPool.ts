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

    resName: string = 'tilewater_1_1';
    islight = false;
    sprite: cc.Sprite = null;
    onLoad() {
        this.sprite = this.getComponent(cc.Sprite);
    }
    changeRes(resName: string) {
        let sprite = this.getComponent(cc.Sprite);
        this.sprite.spriteFrame = Logic.spriteFrames[resName];
        this.node.width = sprite.spriteFrame.getRect().width;
        this.node.height = sprite.spriteFrame.getRect().height;

    }
    changeWaterLight() {
        if(!this.sprite){
            this.sprite = this.getComponentInChildren(cc.Sprite);
        }
        this.sprite = this.getComponentInChildren(cc.Sprite);
        this.islight = !this.islight;
        this.sprite.spriteFrame = Logic.spriteFrames[this.islight ? this.resName : 'light' + this.resName];
    }

    setTiles(i: number, j: number, mapData: string[][]) {
        let prefix = 'tilewater';
        this.resName = prefix+'_1_1';
        let top = this.isWater(mapData[i][j + 1]);
        let bottom = this.isWater(mapData[i][j - 1]);
        let left = this.isWater(mapData[i - 1][j]);
        let right = this.isWater(mapData[i + 1][j]);
        if (!top && bottom && !left && right) {
            this.resName = prefix+'_0_0';
        } else if (!top && bottom && left && right) {
            this.resName = prefix+'_0_1';
        } else if (!top && bottom && left && !right) {
            this.resName = prefix+'_0_2';
        } else if (top && bottom && !left && right) {
            this.resName = prefix+'_1_0';
        } else if (top && bottom && left && right) {
            this.resName = prefix+'_1_1';
        } else if (top && bottom && left && !right) {
            this.resName = prefix+'_1_2';
        } else if (top && !bottom && !left && right) {
            this.resName = prefix+'_2_0';
        } else if (top && !bottom && left && right) {
            this.resName = prefix+'_2_1';
        } else if (top && !bottom && left && !right) {
            this.resName = prefix+'_2_2';
        }
        if(!this.sprite){
            this.sprite = this.getComponentInChildren(cc.Sprite);
        }
        this.sprite.spriteFrame = Logic.spriteFrames[this.resName];
    }
    isWater(str: string) {
        return str == '~';
    }
}
