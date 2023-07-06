import { EnumStatus } from "../Constants";
import { B3Decorator } from "../core/B3Decorator";
import { B3Tick } from "../core/B3Tick";
import { IB3RepeaterProp } from "./B3Repeater";

//重复n次，或者直到遇到不是成功的状态为止
export class B3RepeatUntilFailure extends B3Decorator {
    maxLoop: number;
    constructor(d: IB3RepeaterProp) {
        super(d);
    }

    protected _parseProp(d: any) {
        this.maxLoop = this.maxLoop || -1;
    }

    open(tick) {
        tick.blackboard.set('i', 0, tick.tree.id, this.id);
    }


    tick(tick: B3Tick) {
        if (!this.child) {
            return EnumStatus.ERROR;
        }

        var i = tick.blackboard.get('i', tick.tree.id, this.id);
        var status = EnumStatus.ERROR;

        while (this.maxLoop < 0 || i < this.maxLoop) {
            status = this.child.execute(tick);

            if (status == EnumStatus.SUCCESS) {
                i++;
            } else {
                break;
            }
        }

        i = tick.blackboard.set('i', i, tick.tree.id, this.id);
        return status;
    }
}