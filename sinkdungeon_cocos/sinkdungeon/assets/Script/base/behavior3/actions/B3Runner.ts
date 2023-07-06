import { EnumStatus } from '../Constants'
import { B3Action } from '../core/B3Action'
import { IB3NodeProp } from '../core/B3INodeProperties'
import { B3Tick } from '../core/B3Tick'

export class B3Runner extends B3Action {
    constructor(d?: IB3NodeProp) {
        super(d || { name: 'Runner' })
    }

    tick(tick: B3Tick) {
        return EnumStatus.RUNNING
    }
}
