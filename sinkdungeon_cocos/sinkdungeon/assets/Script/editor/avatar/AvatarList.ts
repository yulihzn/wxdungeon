
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
export default class AvatarList extends cc.Component {
    @property(cc.Prefab)
    avatarPrefab:cc.Prefab=null
    @property(cc.Node)
    content: cc.Node = null
    
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
       this.content.removeAllChildren()
       for(let i =0;i<100;i++){
        this.content.addChild(cc.instantiate(this.avatarPrefab))
       }
    }
   
}
