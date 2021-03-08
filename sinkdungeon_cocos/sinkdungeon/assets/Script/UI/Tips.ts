import { EventHelper } from "../EventHelper";
import Player from "../Player";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//交互作用的提示,依托于父组件不能独立放置
const {ccclass, property} = cc._decorator;

@ccclass
export default class Tips extends cc.Component {
    static readonly TAROT_TABLE = "Tips.TAROT_TABLE";
    static readonly MART_SHELVES = "Tips.MART_SHELVES";
    isUse = false;
    tipsType = '';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.opacity = 0;
    }

    start () {

    }
    next():void{
        if(this.isUse){
            return;
        }
        this.isUse = true;
        cc.director.emit(EventHelper.PLAYER_TAPTIPS,{detail:{tipsType:this.tipsType}});
        setTimeout(()=>{this.isUse = false;},0.1);
    }
    onDestroy(){
        this.isUse = false;
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if(other.getComponent(Player)){
            this.node.opacity = 255;
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if(other.getComponent(Player)){
            this.node.opacity = 0;
        }
    }
    // update (dt) {}
}
