// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class RectDoor {
    /// The dir 0:top 1:bottom 2:left 3:right
    dir: number;
    isDoor: boolean = false;
    isHidden: boolean = false;
    constructor(dir: number,isDoor: boolean,isHidden:boolean) {
        this.dir = dir;
        this.isDoor = isDoor;
        this.isHidden = isHidden;
    }
}
