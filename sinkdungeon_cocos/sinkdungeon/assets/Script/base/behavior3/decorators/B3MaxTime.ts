import { EnumStatus } from '../Constants'
import { B3Decorator } from '../core/B3Decorator'
import { IB3DecoratorProp } from '../core/B3INodeProperties'
import { B3Tick } from '../core/B3Tick'

export class B3MaxTime extends B3Decorator {
    maxTime: number
    constructor(d: IMaxTimeProp) {
        super(d)
    }

    protected _parseProp(d: any) {
        if (!d.maxTime) {
            throw 'maxTime parameter in MaxTime decorator is an obligatory parameter'
        }
        this.maxTime = d.maxTime || 0
    }

    open(tick: B3Tick) {
        var startTime = new Date().getTime()
        tick.blackboard.set('startTime', startTime, tick.tree.id, this.id)
    }

    tick(tick: B3Tick) {
        if (!this.child) {
            return EnumStatus.ERROR
        }

        var currTime = new Date().getTime()
        var startTime = tick.blackboard.get('startTime', tick.tree.id, this.id)

        var status = this.child.execute(tick)
        if (currTime - startTime > this.maxTime) {
            return EnumStatus.FAILURE
        }

        return status
    }
}

export interface IMaxTimeProp extends IB3DecoratorProp {
    maxTime: number
}
