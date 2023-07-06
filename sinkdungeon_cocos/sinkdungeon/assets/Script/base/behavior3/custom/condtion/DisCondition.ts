import { EnumStatus } from '../../Constants'
import { B3Condition } from '../../core/B3Condition'
import { B3Tick } from '../../core/B3Tick'

export default class DisCondition extends B3Condition {
    target
    dis

    tick(tick: B3Tick<any>): EnumStatus {
        let myPos = tick.blackboard.get('mypos') as cc.Vec3
        let targetPos = tick.blackboard.get('targetpos') as cc.Vec3
        let dis = myPos.sub(targetPos).mag()
        if (dis < this.dis) {
            return EnumStatus.SUCCESS
        }
        return EnumStatus.FAILURE
    }

    protected _parseProp(d: any) {
        this.dis = d.dis
    }

    setTarget(v) {
        this.target = v
    }

    getTarget() {
        return this.target
    }
}
