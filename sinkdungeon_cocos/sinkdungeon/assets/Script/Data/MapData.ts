// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapData {
    map:string[][]
    constructor(str:string){
        this.init(str);
    }
    private init(str:string){
        //去掉第一个回车和最后2个回车
        str = str.substring(2,str.length-3);
        let arr = str.split('\r\n')
        this.map = new Array();
        for (let i = 0; i < arr.length; i++) {
            this.map[i] = new Array(i);
            let column = arr[i].split('');
            for (let j = 0; j < column.length; j++) {
                this.map[i][j] = column[j];
            }}
    }
}
