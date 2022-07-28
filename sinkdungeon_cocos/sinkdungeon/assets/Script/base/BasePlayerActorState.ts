import Player from '../logic/Player'
import FsmEvent from './fsm/FsmEvent'
import State from './fsm/State'

const { ccclass, property } = cc._decorator
@ccclass
export default abstract class BasePlayerActorState implements State<Player> {
    private _isRunnig = false
    public get isRunnig() {
        return this._isRunnig
    }
    enter(entity: Player): void {
        this._isRunnig = true
    }
    update(entity: Player): void {}
    exit(entity: Player): void {
        this._isRunnig = false
    }
    event(entity: Player, event: FsmEvent): boolean {
        this._isRunnig = true
        return true
    }
    showLog = true
    log(msg: String): void {
        if (this.showLog) {
            cc.log(msg)
        }
    }
}
