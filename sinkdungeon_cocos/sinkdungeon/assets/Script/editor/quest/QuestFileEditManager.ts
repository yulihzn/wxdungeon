import { EventHelper } from '../../logic/EventHelper'
import LoadingManager from '../../manager/LoadingManager'
import QuestData from '../data/QuestData'
import QuestTargetData from '../data/QuestTargetData'
import QuestTreeData from '../data/QuestTreeData'
import FileOperator from '../utils/FileOperator'
import RevokeHelper from '../utils/RevokeHelper'
import QuestAlertDialog from './QuestAlertDialog'
import QuestCard from './QuestCard'
import QuestFileEditor from './QuestFileEditor'
import QuestSpriteInfoDialog from './QuestSpriteInfoDialog'
import QuestSpritePickDialog from './QuestSpritePickDialog'

const { ccclass, property } = cc._decorator

@ccclass
export default class QuestFileEditManager extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null
    @property(cc.EditBox)
    editBox: cc.EditBox = null
    @property(cc.Node)
    layout: cc.Node = null
    @property(cc.Node)
    zoomUp: cc.Node = null
    @property(cc.Node)
    zoomDown: cc.Node = null
    @property(cc.Prefab)
    questCard: cc.Prefab = null
    @property(cc.Node)
    revokeButton: cc.Node = null
    @property(cc.Node)
    revokeCancelButton: cc.Node = null
    @property(QuestFileEditor)
    editor: QuestFileEditor = null
    @property(QuestAlertDialog)
    alertDialog: QuestAlertDialog = null
    @property(QuestSpritePickDialog)
    spritePickDialog: QuestSpritePickDialog = null
    @property(QuestSpriteInfoDialog)
    questSpriteInfoDialog: QuestSpriteInfoDialog = null

    //图片资源
    bossSpriteFrames: { [key: string]: cc.SpriteFrame } = null
    // LIFE-CYCLE CALLBACKS:
    isBossLoaded = false
    private loadingManager: LoadingManager = new LoadingManager()

    private startPos = cc.v3(0, 0)
    private touchPos = cc.v2(0, 0)
    private cardList: QuestCard[] = []
    private currentSelectData: QuestData
    zoomOffset = 0
    private isCtrlPressing = false
    private isShiftPressing = false
    private fileOperator: FileOperator = new FileOperator()
    private revokeHelper: RevokeHelper<QuestTreeData> = new RevokeHelper<QuestTreeData>(new QuestTreeData())

    protected onLoad(): void {
        this.loadingManager.init()
        this.layout.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.touchPos = event.getLocation()
            this.startPos = this.layout.position.clone()
        })
        this.layout.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let offset = event.getLocation().sub(this.touchPos).mul(0.5)
            this.layout.setPosition(this.startPos.x + offset.x, this.startPos.y + offset.y)
        })
        this.layout.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.startPos.sub(this.layout.position).mag() < 5) {
                this.selectNone()
            }
        })
        this.layout.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {})

        this.zoomUp.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.zoomOffset = 0.025
        })
        this.zoomUp.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.zoomOffset = 0
        })
        this.zoomUp.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.zoomOffset = 0
        })
        this.zoomDown.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.zoomOffset = -0.025
        })
        this.zoomDown.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.zoomOffset = 0
        })
        this.zoomDown.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.zoomOffset = 0
        })
        this.layout.on(cc.Node.EventType.MOUSE_WHEEL, (event: cc.Event.EventMouse) => {
            this.zoom(event.getScrollY() > 0 ? 0.05 : -0.05)
        })
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
        EventHelper.on(EventHelper.EDITOR_SHOW_SPRITE_INFO, detail => {
            if (detail.isShow) {
                this.questSpriteInfoDialog.show(detail.text, detail.wpos)
            } else {
                this.questSpriteInfoDialog.hide()
            }
        })
        this.editor.editManager = this
        this.editor.node.scaleX = 0
        this.alertDialog.node.active = false
        this.spritePickDialog.node.active = false
        this.questSpriteInfoDialog.node.opacity = 0
    }
    start() {
        this.loadingManager.loadEquipment()
        this.loadingManager.loadAutoSpriteFrames()
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_TEXTURES, 'singleColor')
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_ITEM, 'ammo')
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_EQUIPMENT, 'emptyequipment')
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_BOSS, 'iconboss000')
        this.loadingManager.loadBosses()
        this.loadingManager.loadMonsters()
        this.loadingManager.loadItems()
        this.loadingManager.loadNonplayer()
        this.loadingManager.loadSuits()
        this.loadingManager.loadFurnitures()
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.ctrl:
                this.isCtrlPressing = true
                break
            case cc.macro.KEY.shift:
                this.isShiftPressing = true
                break
            case cc.macro.KEY.z:
                break
        }
    }
    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.ctrl:
                this.isCtrlPressing = false
                break
            case cc.macro.KEY.shift:
                this.isShiftPressing = false
                break
            case cc.macro.KEY.z:
                if (this.isCtrlPressing) {
                    if (this.isShiftPressing) {
                        this.revokeCancel()
                    } else {
                        this.revoke()
                    }
                }
                break
            case cc.macro.KEY.s:
                if (this.isCtrlPressing) {
                    this.buttonSave()
                }
                break
            case cc.macro.KEY.escape:
                this.selectNone()
                break
        }
    }
    protected update(dt: number): void {
        if (
            this.loadingManager.isBossLoaded &&
            this.loadingManager.isEquipmentLoaded &&
            this.loadingManager.isAllSpriteFramesLoaded() &&
            this.loadingManager.isMonsterLoaded &&
            this.loadingManager.isNonplayerLoaded &&
            this.loadingManager.isItemsLoaded &&
            this.loadingManager.isFurnituresLoaded &&
            this.loadingManager.isSuitsLoaded
        ) {
            this.isBossLoaded = true
            this.loadingManager.reset()
        }
        if (this.zoomOffset != 0) {
            this.zoom(this.zoomOffset)
        }
        this.revokeButton.active = this.revokeHelper.RevokeLength > 0
        this.revokeCancelButton.active = this.revokeHelper.RevokeCancelLength > 0
        this.editBox.enabled = !this.fileOperator.getFileHandle()
        if (this.fileOperator.getFileHandle()) {
            let name = this.fileOperator.getFileHandle().name as string
            if (name.indexOf('.') != -1) {
                this.editBox.string = name.split('.')[0]
            }
        }
    }
    private zoom(offset: number) {
        this.layout.scale += offset
        if (this.layout.scale < 0) {
            this.layout.scale = 0.1
        }
    }
    private addQuestNode(parentCard: QuestCard, data: QuestData) {
        let cardNode = cc.instantiate(this.questCard)
        let card = cardNode.getComponent(QuestCard)
        card.editManager = this
        card.updateData(data)
        cardNode.parent = this.layout
        this.cardList.push(card)
        let pos = cc.v3(-300, -200)
        if (this.currentSelectData) {
            let mixId1 = `${this.currentSelectData.parentId},${this.currentSelectData.indexId}`
            let mixId2 = `${data.parentId},${data.indexId}`
            if (mixId1 == mixId2) {
                card.isSelected = true
                card.select.active = true
            }
        }
        if (parentCard) {
            parentCard.cardList.push(card)
            let y = 0
            if (data.isSuccessType) {
                y = QuestCard.SIZE * 0.75
            } else {
                y = -QuestCard.SIZE * 0.75
            }
            y += this.getRandomNum(-50, 50)
            pos = parentCard.node.position.add(cc.v3(QuestCard.SIZE * 1.5, y))
        }
        if (!cc.Vec3.ZERO.equals(data.editPos)) {
            pos = data.editPos.clone()
        }
        card.node.setPosition(pos.clone())
        // cc.log(`NEW:${card.data.parentId + card.data.indexId},x=${card.node.position.x},y=${card.node.position.y}`)
        this.revokeHelper.Data.updateTreeNodePos(data.indexId, data.parentId, pos)
        for (let i = 0; i < data.successList.length; i++) {
            let c = data.successList[i]
            QuestTreeData.updateIndexId(c, data, true, i)
            this.addQuestNode(card, c)
        }
        for (let i = 0; i < data.failList.length; i++) {
            let c = data.failList[i]
            QuestTreeData.updateIndexId(c, data, false, i)
            this.addQuestNode(card, c)
        }
    }
    private getRandomNum(min: number, max: number): number {
        //生成一个随机数从[min,max]
        return min + Math.round(Math.random() * (max - min))
    }
    selectNone(callback?: Function) {
        if (!this.editor.canHide()) {
            this.alertDialog.show('数据发生变化，是否放弃更改', '是', '否', (flag: boolean) => {
                if (flag) {
                    this.editor.hide()
                    for (let c of this.cardList) {
                        c.isSelected = false
                    }
                    this.currentSelectData = null
                    if (callback) {
                        callback()
                    }
                }
            })
        } else {
            for (let c of this.cardList) {
                c.isSelected = false
            }
            this.currentSelectData = null
            this.editor.hide()
            if (callback) {
                callback()
            }
        }
    }
    selectCard(card: QuestCard) {
        if (card.isSelected) {
            return
        }
        this.selectNone(() => {
            for (let c of this.cardList) {
                c.isSelected = false
            }
            this.currentSelectData = card.data
            card.isSelected = true
            this.editor.show(this.getTreeNode(card.data.indexId, card.data.parentId))
        })
    }
    private updateRevokTreeList(newTree: QuestTreeData) {
        this.revokeHelper.addNode(newTree).then(() => {
            this.updateTree()
        })
    }
    updateTreeNodePos(indexId: string, parentId: string, pos: cc.Vec3) {
        let newTree = new QuestTreeData()
        newTree.valueCopy(this.revokeHelper.Data)
        newTree.updateTreeNodePos(indexId, parentId, pos)
        this.updateRevokTreeList(newTree)
    }
    updateTreeNodeData(indexId: string, parentId: string, data: QuestData) {
        let newTree = new QuestTreeData()
        newTree.valueCopy(this.revokeHelper.Data)
        newTree.updateTreeNodeData(indexId, parentId, data)
        this.updateRevokTreeList(newTree)
    }
    addTreeNode(indexId: string, parentId: string, isSuccessType: boolean, newdata: QuestData) {
        let newTree = new QuestTreeData()
        newTree.valueCopy(this.revokeHelper.Data)
        newTree.addTreeNode(indexId, parentId, isSuccessType, newdata)
        this.updateRevokTreeList(newTree)
    }
    removeTreeNode(indexId: string, parentId: string) {
        let newTree = new QuestTreeData()
        newTree.valueCopy(this.revokeHelper.Data)
        newTree.removeTreeNode(indexId, parentId)
        this.updateRevokTreeList(newTree)
    }
    getTreeNode(indexId: string, parentId: string) {
        let mixId = `${parentId},${indexId}`
        return this.revokeHelper.Data.getTreeNode(mixId)
    }
    //button
    revoke() {
        this.selectNone(() => {
            this.revokeHelper.revoke().then(() => {
                this.updateTree()
            })
        })
    }
    //button
    revokeCancel() {
        this.selectNone(() => {
            this.revokeHelper.revokeCancel().then(() => {
                this.updateTree()
            })
        })
    }
    updateTree() {
        this.layout.removeAllChildren()
        this.cardList = []
        this.addQuestNode(null, this.revokeHelper.Data.root)
    }

    //button
    buttonUpload() {
        this.selectNone(() => {
            this.fileOperator
                .openJsonFile()
                .then(value => {
                    this.loadFileTreeFinish(value)
                })
                .catch(err => {
                    this.showLog(`${err}`)
                })
        })
    }
    //button
    buttonSave() {
        this.selectNone(() => {
            let name = this.editBox.string
            if (name.length < 1) {
                this.showLog('need a name!')
                return
            }
            this.fileOperator
                .saveJsonFile(JSON.stringify(this.revokeHelper.Data), this.editBox.string)
                .then(value => {
                    this.showLog(value)
                })
                .catch(err => {
                    this.showLog(`${err}`)
                })
        })
    }
    showLog(msg: string) {
        this.label.string = msg
        this.unscheduleAllCallbacks()
        this.scheduleOnce(() => {
            this.label.string = ''
        }, 10)
    }
    //button
    newQuestTree() {
        this.selectNone(() => {
            let questTree = new QuestTreeData()
            questTree.id = 'quest000'
            questTree.name = '测试树'
            questTree.root.name = '序章'
            questTree.root.content = '开始卷'
            this.editBox.string = questTree.id
            this.label.string = questTree.name
            this.revokeHelper.reset(questTree)
            this.updateTree()
            this.fileOperator.clear()
        })
    }
    public showSpritePickDialog(targetData: QuestTargetData, callback: (flag: boolean, data: QuestTargetData) => void) {
        this.spritePickDialog.show(targetData, callback)
    }
    private loadFileTreeFinish(jsonText: string) {
        let data = new QuestTreeData()
        data.valueCopy(JSON.parse(jsonText))
        this.revokeHelper.reset(data)
        this.editBox.string = this.revokeHelper.Data.id
        this.label.string = this.revokeHelper.Data.name
        cc.log(`加载任务列表完成`)
        this.updateTree()
    }
}
