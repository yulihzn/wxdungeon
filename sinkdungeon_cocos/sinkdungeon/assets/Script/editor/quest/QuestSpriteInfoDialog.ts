// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//任务卡片
const { ccclass, property } = cc._decorator

@ccclass
export default class QuestSpriteInfoDialog extends cc.Component {
    @property(cc.Label)
    msg: cc.Label = null

    // LIFE-CYCLE CALLBACKS:

    onLoad() {}

    public show(msg: string, wpos: cc.Vec3) {
        this.msg.string = msg
        this.node.opacity = 255
        this.node.position = this.node.parent.convertToNodeSpaceAR(wpos)
        this.scheduleOnce(() => {
            let bg = this.node.getChildByName('bg')
            bg.width = this.msg.node.width + 10
            bg.height = this.msg.node.height + 10
        }, 0)
    }

    public hide() {
        this.node.opacity = 0
    }
}
