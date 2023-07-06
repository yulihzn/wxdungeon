import { EnumCategory } from '../Constants'
import { B3BaseNode } from './B3BaseNode'
import { IB3DecoratorProp } from './B3INodeProperties'

export abstract class B3Decorator extends B3BaseNode {
    child: B3BaseNode
    constructor(d: IB3DecoratorProp) {
        d.category = EnumCategory.DECORATOR
        super(d)
        this.child = d.child
    }
}
