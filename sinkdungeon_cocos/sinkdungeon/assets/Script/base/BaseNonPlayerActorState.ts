// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import NonPlayer from '../logic/NonPlayer'
import Utils from '../utils/Utils'
import FsmEvent from './fsm/FsmEvent'
import State from './fsm/State'

export default class BaseNonPlayerActorState implements State<NonPlayer> {
    private _isRunnig = false
    private _Name = ''
    constructor(name: string) {
        this._Name = name
    }
    public get isRunnig() {
        return this._isRunnig
    }
    enter(entity: NonPlayer): void {
        Utils.log(`${entity.actorName()}${entity.node.uuid}(${this._Name}):enter`)
        this._isRunnig = true
    }
    update(entity: NonPlayer): void {}
    exit(entity: NonPlayer): void {
        this._isRunnig = false
        Utils.log(`${entity.actorName()}${entity.node.uuid}(${this._Name}):exit`)
    }
    event(entity: NonPlayer, event: FsmEvent): boolean {
        this._isRunnig = true
        Utils.log(`${entity.actorName()}${entity.node.uuid}(${this._Name}):event`)
        return true
    }
    showLog = true
    log(msg: String): void {
        if (this.showLog) {
            cc.log(msg)
        }
    }
}
