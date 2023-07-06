import { EnumStatus } from '../Constants'
import { B3Composite } from '../core/B3Composite'
import { IB3CompositeProp } from '../core/B3INodeProperties'
import { B3Tick } from '../core/B3Tick'

export class B3Priority extends B3Composite {
    constructor(d: IB3CompositeProp) {
        d.name = 'Priority'
        super(d)
    }

    tick(tick: B3Tick) {
        for (var i = 0; i < this.children.length; i++) {
            var status = this.children[i].execute(tick)

            if (status !== EnumStatus.FAILURE) {
                return status
            }
        }

        return EnumStatus.FAILURE
    }
}
