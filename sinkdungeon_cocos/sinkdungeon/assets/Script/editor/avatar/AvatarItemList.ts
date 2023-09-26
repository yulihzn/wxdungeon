// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from '../../logic/Logic'
import LoadingManager from '../../manager/LoadingManager'
import AvatarItem from './AvatarItem'

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
        this.loadingManager.init()
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_TEXTURES, 'singleColor')
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_EQUIPMENT, 'emptyequipment')
        this.loadingManager.loadProfession()
        this.loadingManager.loadEquipment()
        this.loadingManager.loadTalents()
        this.loadingManager.loadItems()
        this.loadingManager.loadSuits()
        this.loadingManager.loadAffixs()
        this.loadingManager.loadPlayer()
    }
    update(dt) {
        if (
            this.loadingManager.isSpriteFramesLoaded(LoadingManager.KEY_TEXTURES) &&
            this.loadingManager.isSpriteFramesLoaded(LoadingManager.KEY_EQUIPMENT) &&
            this.loadingManager.isProfessionLoaded &&
            this.loadingManager.isEquipmentLoaded &&
            this.loadingManager.isSkillsLoaded &&
            this.loadingManager.isItemsLoaded &&
            this.loadingManager.isSuitsLoaded &&
            this.loadingManager.isPlayerLoaded &&
            this.loadingManager.isAffixsLoaded
        ) {
            this.loadingManager.reset()
            this.show()
        }
    }
    show() {
        this.content.removeAllChildren()
        for (let key in Logic.players) {
            AvatarItem.create(this.avatarPrefab, this.content, Logic.players[key])
        }
    }
}
