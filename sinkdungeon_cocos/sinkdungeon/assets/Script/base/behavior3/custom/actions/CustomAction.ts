import { EnumStatus } from '../../Constants'
import { B3Action } from '../../core/B3Action'
import { B3Tick } from '../../core/B3Tick'

export default class Log extends B3Action {
    tick(tick: B3Tick<any>): EnumStatus {
        console.log('test log')
        return EnumStatus.SUCCESS
    }
}
