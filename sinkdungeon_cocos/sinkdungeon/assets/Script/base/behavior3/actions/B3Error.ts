import { B3Action } from '../core/B3Action'
import { IB3NodeProp } from '../core/B3INodeProperties'
import { B3Tick } from '../core/B3Tick'
import { EnumStatus } from '../Constants'

export class B3Error extends B3Action {
    constructor(d?: IB3NodeProp) {
        super(d || { name: 'Error' })
    }

    tick(tick: B3Tick) {
        return EnumStatus.ERROR
    }
}
