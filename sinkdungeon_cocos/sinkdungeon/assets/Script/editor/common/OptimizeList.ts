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
export default class OptimizeList extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    scrollview: cc.ScrollView

    onLoad() {
        if (!this.getScrollview()) {
            cc.error('不存在ScrollView组件！')
            return
        }
        // ------------------事件监听
        this.node.on('scrolling', this._event_update_opacity, this)
        this.getScrollview().content.on(cc.Node.EventType.CHILD_REMOVED, this._event_update_opacity, this)
        this.getScrollview().content.on(cc.Node.EventType.CHILD_REORDER, this._event_update_opacity, this)
    }
    private getScrollview() {
        if (!this.scrollview) {
            this.scrollview = this.node.getComponent(cc.ScrollView)
        }
        return this.scrollview
    }
    private _get_bounding_box_to_world(node_o_: any): cc.Rect {
        let w_n: number = node_o_._contentSize.width
        let h_n: number = node_o_._contentSize.height
        let rect_o = cc.rect(-node_o_._anchorPoint.x * w_n, -node_o_._anchorPoint.y * h_n, w_n, h_n)
        node_o_._calculWorldMatrix()
        rect_o.transformMat4(rect_o, node_o_._worldMatrix)
        return rect_o
    }
    /**检测碰撞 */
    private _check_collision(node_o_: cc.Node): boolean {
        let rect1_o = this._get_bounding_box_to_world(this.getScrollview().content.parent)
        let rect2_o = this._get_bounding_box_to_world(node_o_)
        // ------------------保险范围
        rect1_o.width += rect1_o.width * 0.5
        rect1_o.height += rect1_o.height * 0.5
        rect1_o.x -= rect1_o.width * 0.25
        rect1_o.y -= rect1_o.height * 0.25
        return rect1_o.intersects(rect2_o)
    }
    /* ***************自定义事件*************** */
    private _event_update_opacity(): void {
        this.getScrollview().content.children.forEach(v1_o => {
            v1_o.opacity = this._check_collision(v1_o) ? 255 : 0
        })
    }
}
