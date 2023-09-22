// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import LoadingManager from '../../manager/LoadingManager'

//任务卡片
const { ccclass, property } = cc._decorator

@ccclass
export default class AvatarItemList extends cc.Component {
    @property(cc.Prefab)
    avatarPrefab: cc.Prefab = null
    @property(cc.Node)
    content: cc.Node = null
    private loadingManager: LoadingManager = new LoadingManager()
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.content.removeAllChildren()
        for (let i = 0; i < 100; i++) {
            this.content.addChild(cc.instantiate(this.avatarPrefab))
        }
        this.loadingManager.init()
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_TEXTURES, 'singleColor')
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_EQUIPMENT, 'emptyequipment')
        this.loadingManager.loadProfession()
        this.loadingManager.loadEquipment()
        this.loadingManager.loadTalents()
        this.loadingManager.loadItems()
        this.loadingManager.loadSuits()
        this.loadingManager.loadAffixs()
    }
}
