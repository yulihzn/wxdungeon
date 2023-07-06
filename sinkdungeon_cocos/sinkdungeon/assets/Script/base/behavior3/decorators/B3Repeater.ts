import { EnumStatus } from "../Constants";
import { B3Decorator } from "../core/B3Decorator";
import { IB3DecoratorProp } from "../core/B3INodeProperties";
import { B3Tick } from "../core/B3Tick";

  //重复n次，或者直到遇到不是失败或者成功的状态为止
  export class B3Repeater extends B3Decorator {
    maxLoop: number;
    constructor(d: IB3RepeaterProp) {
      super(d);
    }

    protected _parseProp(d: any) {
      this.maxLoop = d.maxLoop || -1;
    }

    open(tick) {
      tick.blackboard.set('i', 0, tick.tree.id, this.id);
    }


    tick(tick: B3Tick) {
      if (!this.child) {
        return EnumStatus.ERROR;
      }

      var i = tick.blackboard.get('i', tick.tree.id, this.id);
      var status = EnumStatus.SUCCESS;

      while (this.maxLoop < 0 || i < this.maxLoop) {
        status = this.child.execute(tick);

        if (status == EnumStatus.SUCCESS || status == EnumStatus.FAILURE) {
          i++;
        } else {
          break;
        }
      }

      tick.blackboard.set('i', i, tick.tree.id, this.id);
      return status;
    }
  }

export interface IB3RepeaterProp extends IB3DecoratorProp {
  maxLoop: number
}