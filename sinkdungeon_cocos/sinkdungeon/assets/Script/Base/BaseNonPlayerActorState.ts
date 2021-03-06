
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import NonPlayer from "../NonPlayer";
import FsmEvent from "./fsm/FsmEvent";
import State from "./fsm/State";

const { ccclass, property } = cc._decorator;


@ccclass
export default class BaseNonPlayerActorState implements State<NonPlayer>{
    private _isRunnig = false;
    public get isRunnig(){
        return this._isRunnig;
    }
    enter(entity: NonPlayer): void {
        this._isRunnig = true;
    }
    update(entity: NonPlayer): void {
    }
    exit(entity: NonPlayer): void {
        this._isRunnig = false;
    }
    event(entity: NonPlayer, event: FsmEvent): boolean {
        this._isRunnig = true;
        return true;
    }
    showLog = true;
    log(msg: String): void {
        if (this.showLog) {
            cc.log(msg);
        }
    }
}


