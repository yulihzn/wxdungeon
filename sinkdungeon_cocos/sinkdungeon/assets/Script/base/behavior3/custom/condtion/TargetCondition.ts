import { EnumStatus } from '../../Constants'
import { B3Condition } from '../../core/B3Condition'
import { B3Tick } from '../../core/B3Tick'

export default class TargetCondition extends B3Condition {
    target
    tick(tick: B3Tick<any>): EnumStatus {
        if (this.target == tick.blackboard.get('target')) {
            return EnumStatus.SUCCESS
        }
        EnumStatus.FAILURE
    }
}
