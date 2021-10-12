// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from "../logic/EventHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockLight extends cc.Component {

    anim:cc.Animation;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    show(){
        if(!this.anim){
            this.anim = this.getComponent(cc.Animation);
        }
        this.anim.play();
        this.scheduleOnce(()=>{cc.director.emit(EventHelper.POOL_DESTORY_WALKSMOKE,{detail:{targetNode:this.node}});},0.5);
    }

    // update (dt) {}
}
