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
        this.node.on(
            cc.Node.EventType.MOUSE_DOWN,
            (event: cc.Event.EventMouse) => {
                if (event.getButton() == cc.Event.EventMouse.BUTTON_LEFT) {
                    if (this.callback) {
                        this.callback(CursorArea.CLICK_LEFT_DOWN)
                    }
                } else if (event.getButton() == cc.Event.EventMouse.BUTTON_RIGHT) {
                    if (this.callback) {
                        this.callback(CursorArea.CLICK_RIGHT_DOWN)
                    }
                }
            },
            this
        )
        this.node.on(
            cc.Node.EventType.MOUSE_UP,
            (event: cc.Event.EventMouse) => {
                if (event.getButton() == cc.Event.EventMouse.BUTTON_LEFT) {
                    if (this.callback) {
                        this.callback(CursorArea.CLICK_LEFT_UP)
                    }
                } else if (event.getButton() == cc.Event.EventMouse.BUTTON_RIGHT) {
                    if (this.callback) {
                        this.callback(CursorArea.CLICK_RIGHT_UP)
                    }
                }
            },
            this
        )
        this.node.on(
            cc.Node.EventType.MOUSE_LEAVE,
            (event: cc.Event.EventMouse) => {
                if (this.callback) {
                    this.callback(CursorArea.MOUSE_LEAVE)
                }
            },
            this
        )
        this.node.on(
            cc.Node.EventType.MOUSE_MOVE,
            (event: cc.Event.EventMouse) => {
                this.cursor.position = cc.v3(this.node.convertToNodeSpaceAR(event.getLocation()))
                if (this.callback) {
                    this.callback(CursorArea.MOUSE_MOVE, event.getLocation())
                }
            },
            this
        )
    }
}
