import { EnumCategory } from '../Constants'
import { B3ActionsCls } from '../register/B3ActionsClsRegister'
import { B3CompositesCls } from '../register/B3CompositesClsRegister'
import { B3CustomClsRegister } from '../register/B3CustomClsRegister'
import { B3DecoratorsCls } from '../register/B3DecoratorsClsRegister'
import { createUUID } from '../utils/B3Utils'
import { B3BaseNode } from './B3BaseNode'
import { B3Composite } from './B3Composite'
import { B3Decorator } from './B3Decorator'
import { B3Tick } from './B3Tick'

export class B3BehaviorTree {
    id: string
    title: string
    description: string
    properties: any
    root: B3BaseNode
    debug: any
    nodes: { [id: string]: B3BaseNode }
    constructor(id?: string) {
        this.id = id || createUUID()
        this.title = 'The behavior tree'
        this.description = 'Default description'
        this.properties = {}
        this.root = null
        this.debug = null
    }

    load(data, names) {
        names = names || {}
        this.id = data.id || this.id
        this.title = data.title || this.title
        this.description = data.description || this.description
        this.properties = data.properties || this.properties

        var nodes = {}
        var id, spec, node
        // Create the node list (without connection between them)
        for (id in data.nodes) {
            spec = data.nodes[id]
            let clsName = spec.name
            clsName = 'B3' + clsName
            var Cls
            if (B3CustomClsRegister[spec.name]) {
                // 自己定义的节点
                // Look for the name in custom nodes
                Cls = B3CustomClsRegister[spec.name]
            } else if (B3ActionsCls[clsName]) {
                Cls = B3ActionsCls[clsName]
            } else if (B3CompositesCls[clsName]) {
                Cls = B3CompositesCls[clsName]
            } else if (B3DecoratorsCls[clsName]) {
                Cls = B3DecoratorsCls[clsName]
            } else {
                // Invalid node name
                // throw new EvalError('BehaviorTree.load: Invalid node name + "' +
                //     spec.name + '".');

                console.error('BehaviorTree.load: Invalid node name + "' + spec.name + '".')
                continue
            }

            node = new Cls(spec)

            nodes[id] = node
        }

        // Connect the nodes
        for (id in data.nodes) {
            spec = data.nodes[id]
            node = nodes[id]

            if (node.category === EnumCategory.COMPOSITE && spec.children) {
                for (var i = 0; i < spec.children.length; i++) {
                    var cid = spec.children[i]
                    node.children.push(nodes[cid])
                }
            } else if (node.category === EnumCategory.DECORATOR && spec.child) {
                node.child = nodes[spec.child]
            }
        }
        this.nodes = nodes
        this.root = nodes[data.root]
    }

    /**
     * This method dump the current BT into a data structure.
     *
     * Note: This method does not record the current node parameters. Thus,
     * it may not be compatible with load for now.
     *
     * @method dump
     * @return {Object} A data object representing this tree.
     **/
    dump() {
        var data: any = {}
        var customNames = []

        data.title = this.title
        data.description = this.description
        data.root = this.root ? this.root.id : null
        data.properties = this.properties
        data.nodes = {}
        data.custom_nodes = []

        if (!this.root) return data

        var stack = [this.root]
        while (stack.length > 0) {
            var node: B3BaseNode = stack.pop()

            var spec: any = {}
            spec.id = node.id
            spec.name = node.name
            spec.title = node.title
            spec.description = node.description
            spec.properties = node.properties
            spec.parameters = node.parameters

            // verify custom node
            var proto = node.constructor && node.constructor.prototype
            var nodeName = (proto && proto.name) || node.name
            node.category != EnumCategory.ACTION
            if (node.category != EnumCategory.ACTION && node.category != EnumCategory.COMPOSITE && node.category != EnumCategory.DECORATOR && customNames.indexOf(nodeName) < 0) {
                var subdata: any = {}
                subdata.name = nodeName
                subdata.title = (proto && proto.title) || node.title
                subdata.category = node.category

                customNames.push(nodeName)
                data.custom_nodes.push(subdata)
            }

            // store children/child
            if (node.category === EnumCategory.COMPOSITE) {
                let composite = <B3Composite>node
                if (composite.children) {
                    var children = []
                    for (var i = composite.children.length - 1; i >= 0; i--) {
                        children.push(composite.children[i].id)
                        stack.push(composite.children[i])
                    }
                    spec.children = children
                }
            } else if (node.category === EnumCategory.DECORATOR && (<B3Decorator>node).child) {
                stack.push((<B3Decorator>node).child)
                spec.child = (<B3Decorator>node).child.id
            }

            data.nodes[node.id] = spec
        }

        return data
    }

    /**
     * Propagates the tick signal through the tree, starting from the root.
     *
     * This method receives a target object of any type (Object, Array,
     * DOMElement, whatever) and a `Blackboard` instance. The target object has
     * no use at all for all Behavior3JS components, but surely is important
     * for custom nodes. The blackboard instance is used by the tree and nodes
     * to store execution variables (e.g., last node running) and is obligatory
     * to be a `Blackboard` instance (or an object with the same interface).
     *
     * Internally, this method creates a Tick object, which will store the
     * target and the blackboard objects.
     *
     * Note: BehaviorTree stores a list of open nodes from last tick, if these
     * nodes weren't called after the current tick, this method will close them
     * automatically.
     *
     * @method tick
     * @param {Object} target A target object.
     * @param {Blackboard} blackboard An instance of blackboard object.
     * @return {Constant} The tick signal state.
     **/
    tick(target, blackboard) {
        if (!blackboard) {
            throw 'The blackboard parameter is obligatory and must be an ' + 'instance of B3Blackboard'
        }

        /* CREATE A TICK OBJECT */
        var tick = new B3Tick()
        tick.debug = this.debug
        tick.target = target
        tick.blackboard = blackboard
        tick.tree = this

        /* TICK NODE */
        var state = this.root.execute(tick)

        /* CLOSE NODES FROM LAST TICK, IF NEEDED */
        var lastOpenNodes = blackboard.get('openNodes', this.id)
        var currOpenNodes = tick.openNodes.slice(0)

        // does not close if it is still open in this tick
        var start = 0
        for (let i = 0, len = Math.min(lastOpenNodes.length, currOpenNodes.length); i < len; i++) {
            if (lastOpenNodes[i] !== currOpenNodes[i]) {
                start = i
                break
            }
            start = i + 1
        }

        // close the nodes
        for (let i = lastOpenNodes.length - 1; i >= start; i--) {
            let node: any = this.nodes[lastOpenNodes[i]]
            node && node._close(tick)
        }

        /* POPULATE BLACKBOARD */
        blackboard.set('openNodes', currOpenNodes, this.id)
        blackboard.set('nodeCount', tick.nodeCount, this.id)

        return state
    }
}
