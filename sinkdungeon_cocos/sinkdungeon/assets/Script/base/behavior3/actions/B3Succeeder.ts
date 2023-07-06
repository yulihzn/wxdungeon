import { EnumStatus } from '../Constants'
import { B3Action } from '../core/B3Action'
import { IB3NodeProp } from '../core/B3INodeProperties'
import { B3Tick } from '../core/B3Tick'

export class B3Succeeder extends B3Action {
    constructor(d?: IB3NodeProp) {
        super(d || { name: 'Succeeder' })
    }

    tick(tick: B3Tick) {
        return EnumStatus.SUCCESS
    }
}
