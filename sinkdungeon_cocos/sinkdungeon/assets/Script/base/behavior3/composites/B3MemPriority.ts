import { EnumStatus } from '../Constants'
import { B3Composite } from '../core/B3Composite'
import { IB3CompositeProp } from '../core/B3INodeProperties'
import { B3Tick } from '../core/B3Tick'

export class B3MemPriority extends B3Composite {
    constructor(d: IB3CompositeProp) {
        d.name = 'MemPriority'
        super(d)
    }

    open(tick: B3Tick) {
        tick.blackboard.set('runningChild', 0, tick.tree.id, this.id)
    }

    tick(tick: B3Tick) {
        var child = tick.blackboard.get('runningChild', tick.tree.id, this.id)
        for (var i = child; i < this.children.length; i++) {
            var status = this.children[i].execute(tick)

            if (status !== EnumStatus.FAILURE) {
                if (status === EnumStatus.RUNNING) {
                    tick.blackboard.set('runningChild', i, tick.tree.id, this.id)
                }

                return status
            }
        }

        return EnumStatus.FAILURE
    }
}
