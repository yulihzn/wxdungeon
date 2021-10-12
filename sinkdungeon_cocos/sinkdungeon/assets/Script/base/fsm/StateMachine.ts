
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import FsmEvent from "./FsmEvent";
import State from "./State";

export default interface StateMachine<E, S extends State<E>> {
    update(): void;
    changeState(newState: S): void;
    revertToPreviousState(): boolean;
    setInitialState(state: S): void;
    setGlobalState(state: S): void;
    getCurrentState(): S;
    getGlobalState(): S;
    getPreviousState(): S;
    isInState(state: S): boolean;
    handleEvent(event: FsmEvent): boolean;
}
