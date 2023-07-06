import Player from '../logic/Player'
import Utils from '../utils/Utils'
import FsmEvent from './fsm/FsmEvent'
import State from './fsm/State'

export default abstract class BasePlayerActorState implements State<Player> {
    private _isRunnig = false
    private _Name = ''
    public get isRunnig() {
        return this._isRunnig
    }
    constructor(name: string) {
        this._Name = name
    }
    enter(entity: Player): void {
        this._isRunnig = true
        Utils.log(`${entity.actorName()}${entity.node.uuid}(${this._Name}):enter`)
    }
    update(entity: Player): void {}
    exit(entity: Player): void {
        this._isRunnig = false
        Utils.log(`${entity.actorName()}${entity.node.uuid}(${this._Name}):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
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
