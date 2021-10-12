// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomCollider extends cc.Component {
    static readonly TYPE = cc.Enum({
        CIRCLE: 0,
        RECT: 1
    })
    @property
    tag:number = 0;
    
    @property(cc.Vec2)
    offset: cc.Vec2 = cc.Vec2.ZERO;

    @property({ type: CustomCollider.TYPE, displayName: '组件类型' })
    type: number = CustomCollider.TYPE.CIRCLE;
    @property({
        visible: function () {
            return this.type == CustomCollider.TYPE.CIRCLE
        }
    })
    radius: number = 64;

    @property({
        visible: function () {
            return this.type == CustomCollider.TYPE.RECT
        }
    })
    size: cc.Size = cc.size(128, 128);




    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}
}
