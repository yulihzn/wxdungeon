import Logic from "./Logic";
import PlayerData from "./Data/PlayerData";

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
export default class Chapter extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    clickChapter(event,chapter){
        if(chapter){
            Logic.chapterName = chapter;
        }
        Logic.level = 1;
        Logic.playerData = new PlayerData();
        cc.director.loadScene('loading');
    }

    // update (dt) {}
}
