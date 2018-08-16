// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class DungeonStyleData {
    background: string;
    topwall: string;
    sidewall: string;
    door: string;
    d1: string;
    d2: string;
    constructor(background: string, topwall: string, sidewall: string, door: string, d1: string, d2: string) {
        this.background = background;
        this.topwall = topwall;
        this.sidewall = sidewall;
        this.door = door;
        this.d1 = d1;
        this.d2 = d2;
    }
}
