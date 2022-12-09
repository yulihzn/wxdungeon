// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class CursorArea extends cc.Component {
    @property(cc.Node)
    cursor: cc.Node = null
    callback: Function
    static readonly CLICK_LEFT_DOWN = 0
    static readonly CLICK_LEFT_UP = 1
    static readonly CLICK_RIGHT_DOWN = 2
    static readonly CLICK_RIGHT_UP = 3
    static readonly MOUSE_LEAVE = 4
    static readonly MOUSE_MOVE = 5
    static init(prefab: cc.Prefab) {
        let cursorArea = cc.instantiate(prefab).getComponent(CursorArea)
        cc.director.getScene().addChild(cursorArea.node, 0)
        return cursorArea
    }
    onLoad() {
        this.cursor.active = false
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.mouseDown, this)
        this.node.on(cc.Node.EventType.MOUSE_UP, this.mouseUp, this)
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.mouseLeave, this)
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.mouseMove, this)
    }
    offMouseEvent(type: number) {
        switch (type) {
            case 0:
                this.node.off(cc.Node.EventType.MOUSE_DOWN, this.mouseDown, this)
                break
            case 1:
                this.node.off(cc.Node.EventType.MOUSE_UP, this.mouseUp, this)
                break
            case 2:
                this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.mouseLeave, this)
                break
            case 3:
                this.node.off(cc.Node.EventType.MOUSE_MOVE, this.mouseMove, this)
                break
        }
    }
    mouseDown(event: cc.Event.EventMouse) {
        if (event.getButton() == cc.Event.EventMouse.BUTTON_LEFT) {
            if (this.callback) {
                this.callback(CursorArea.CLICK_LEFT_DOWN, event.getLocation())
            }
        } else if (event.getButton() == cc.Event.EventMouse.BUTTON_RIGHT) {
            if (this.callback) {
                this.callback(CursorArea.CLICK_RIGHT_DOWN, event.getLocation())
            }
        }
    }
    mouseUp(event: cc.Event.EventMouse) {
        if (event.getButton() == cc.Event.EventMouse.BUTTON_LEFT) {
            if (this.callback) {
                this.callback(CursorArea.CLICK_LEFT_UP, event.getLocation())
            }
        } else if (event.getButton() == cc.Event.EventMouse.BUTTON_RIGHT) {
            if (this.callback) {
                this.callback(CursorArea.CLICK_RIGHT_UP, event.getLocation())
            }
        }
    }
    mouseLeave(event: cc.Event.EventMouse) {
        if (this.callback) {
            this.callback(CursorArea.MOUSE_LEAVE, event.getLocation())
        }
    }
    mouseMove(event: cc.Event.EventMouse) {
        this.cursor.position = cc.v3(this.cursor.parent.convertToNodeSpaceAR(event.getLocation()))
        if (this.callback) {
            this.callback(CursorArea.MOUSE_MOVE, event.getLocation())
        }
    }
    setCursorParent(node: cc.Node) {
        this.cursor.parent = node
    }
}
