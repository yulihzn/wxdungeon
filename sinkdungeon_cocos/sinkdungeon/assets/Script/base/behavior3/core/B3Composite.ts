import { EnumCategory } from '../Constants'
import { B3BaseNode } from './B3BaseNode'
import { IB3CompositeProp } from './B3INodeProperties'

export abstract class B3Composite extends B3BaseNode {
    children: B3BaseNode[]
    constructor(d: IB3CompositeProp) {
        d.category = EnumCategory.COMPOSITE
        super(d)
        this.children = []
    }
}
