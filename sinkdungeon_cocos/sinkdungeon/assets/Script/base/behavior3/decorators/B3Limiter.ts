import { EnumStatus } from '../Constants'
import { B3Decorator } from '../core/B3Decorator'
import { IB3DecoratorProp } from '../core/B3INodeProperties'
import { B3Tick } from '../core/B3Tick'

export class B3Limiter extends B3Decorator {
    maxLoop: number
    constructor(d: IB3LimiterProp) {
        super(d)
    }

    protected _parseProp(d: any) {
        if (!d.maxLoop) {
            throw 'maxLoop parameter in Limiter decorator is an obligatory parameter'
        }
        this.maxLoop = d.maxLoop || 1
    }

    open(tick: B3Tick) {
        tick.blackboard.set('i', 0, tick.tree.id, this.id)
    }

    tick(tick: B3Tick) {
        if (!this.child) {
            return EnumStatus.ERROR
        }

        var i = tick.blackboard.get('i', tick.tree.id, this.id)

        if (i < this.maxLoop) {
            var status = this.child.execute(tick)

            if (status == EnumStatus.SUCCESS || status == EnumStatus.FAILURE) tick.blackboard.set('i', i + 1, tick.tree.id, this.id)

            return status
        }

        return EnumStatus.FAILURE
    }
}

export interface IB3LimiterProp extends IB3DecoratorProp {
    maxLoop: number
}
