import { EnumStatus } from '../Constants'
import { B3Action } from '../core/B3Action'
import { IB3NodeProp } from '../core/B3INodeProperties'
import { B3Tick } from '../core/B3Tick'

export class B3Wait extends B3Action {
    endTime: number
    constructor(d: IB3NodeProp) {
        super(d)
    }

    protected _parseProp(d: any) {
        this.endTime = d.milliseconds || 0
    }

    open(tick: B3Tick) {
        var startTime = new Date().getTime()
        tick.blackboard.set('startTime', startTime, tick.tree.id, this.id)
    }

    tick(tick: B3Tick) {
        var currTime = new Date().getTime()
        var startTime = tick.blackboard.get('startTime', tick.tree.id, this.id)

        if (currTime - startTime > this.endTime) {
            return EnumStatus.SUCCESS
        }

        return EnumStatus.RUNNING
    }
}
