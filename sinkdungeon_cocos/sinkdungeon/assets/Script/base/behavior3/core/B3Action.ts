import { EnumCategory } from '../Constants'
import { B3BaseNode } from './B3BaseNode'
import { IB3NodeProp } from './B3INodeProperties'

export abstract class B3Action extends B3BaseNode {
    constructor(d: IB3NodeProp) {
        d.category = EnumCategory.ACTION
        super(d)
    }
}
