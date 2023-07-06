import { EnumStatus } from '../Constants'
import { B3Decorator } from '../core/B3Decorator'
import { IB3DecoratorProp } from '../core/B3INodeProperties'
import { B3Tick } from '../core/B3Tick'

export class B3Inverter extends B3Decorator {
    constructor(d: IB3DecoratorProp) {
        d.name = 'Inverter'
        super(d)
    }

    tick(tick: B3Tick) {
        if (!this.child) {
            return EnumStatus.ERROR
        }

        var status = this.child.execute(tick)

        if (status == EnumStatus.SUCCESS) {
            status = EnumStatus.FAILURE
        } else if (status == EnumStatus.FAILURE) {
            status = EnumStatus.SUCCESS
        }

        return status
    }
}
