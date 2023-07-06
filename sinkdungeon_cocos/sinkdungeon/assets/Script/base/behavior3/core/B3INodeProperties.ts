import { B3BaseNode } from './B3BaseNode'

export interface IB3NodeProp {
    id?: string
    /**类别 */
    category?: string
    name?: string
    title?: string
    description?: string
    properties?: any
}

export interface IB3CompositeProp extends IB3NodeProp {
    children: B3BaseNode[]
}

export interface IB3DecoratorProp extends IB3NodeProp {
    child: B3BaseNode
}
