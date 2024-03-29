import Player from '../logic/Player'
import Logic from '../logic/Logic'
import Building from './Building'
import AudioPlayer from '../utils/AudioPlayer'
import IndexZ from '../utils/IndexZ'
import ExitData from '../data/ExitData'
import Dungeon from '../logic/Dungeon'
import CCollider from '../collider/CCollider'
import Random from '../utils/Random'
import Vehicle from './Vehicle'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class ExitDoor extends Building {
    @property(cc.Node)
    root: cc.Node = null
    isOpen: boolean = false
    isDoor: boolean = true
    bgSprite: cc.Sprite = null
    closeSprite: cc.Sprite = null
    openSprite: cc.Sprite = null
    spriteNode: cc.Node = null
    roof: cc.Sprite = null
    isBackToUpLevel = false
    dir = 0
    exitData: ExitData = new ExitData()
    type = 0
    // LIFE-CYCLE CALLBACKS:

    init(type: number, dir: number, exitData: ExitData) {
        this.dir = dir
        this.type = type
        this.exitData.valueCopy(exitData)
        this.isBackToUpLevel = type == 2 || type == 3
        let collider = this.node.getComponent(CCollider)
        //单数代表是箭头提示的出口
        if (this.type % 2 == 1) {
            this.node.opacity = 0
            this.roof.node.opacity = 0
            let indexPos = this.data.defaultPos.clone()
            collider.setSize(cc.size(128, 128))
            collider.offset = cc.v2(0, 0)
            if (this.dir == 0) {
                indexPos.y += 1
            }
            if (this.dir == 1) {
                indexPos.y -= 1
            }
            if (this.dir == 2) {
                indexPos.x -= 1
            }
            if (this.dir == 3) {
                indexPos.x += 1
            }
            this.entity.Transform.position = Dungeon.getPosInMap(indexPos)
            this.node.position = this.entity.Transform.position.clone()
        }
        this.root.y = this.exitData.fromZ
        this.entity.Transform.z = this.exitData.fromZ
        let label = this.roof.getComponentInChildren(cc.Label)
        label.string = `-${Logic.worldLoader.getLevelData(this.exitData.toChapter, this.exitData.toLevel).name}`
    }
    onLoad() {
        this.spriteNode = this.root.getChildByName('sprite')
        this.bgSprite = this.root.getChildByName('sprite').getChildByName('exitbg').getComponent(cc.Sprite)
        this.closeSprite = this.root.getChildByName('sprite').getChildByName('exitopen').getComponent(cc.Sprite)
        this.openSprite = this.root.getChildByName('sprite').getChildByName('exitclose').getComponent(cc.Sprite)
        this.roof = this.root.getChildByName('roof').getComponent(cc.Sprite)
        this.openSprite.node.zIndex = IndexZ.FLOOR
        this.closeSprite.node.zIndex = IndexZ.ACTOR
    }

    start() {
        switch (Logic.data.chapterIndex) {
            case Logic.CHAPTER00:
                this.changeRes('exit000')
                break
            case Logic.CHAPTER01:
                this.changeRes('exit001')
                break
            case Logic.CHAPTER02:
                this.changeRes('exit002')
                break
            case Logic.CHAPTER03:
                this.changeRes('exit003')
                break
            case Logic.CHAPTER04:
                this.changeRes('exit004')
                break
            case Logic.CHAPTER05:
                this.changeRes('exit004')
                break
            case Logic.CHAPTER099:
                this.changeRes('exit000')
                break
        }
        if (this.exitData.res?.length > 0) {
            this.changeRes(this.exitData.res)
        }
        let subfix = 'anim000'
        let spriteframe = Logic.spriteFrameRes(`roof${Logic.worldLoader.getCurrentLevelData().wallRes1}${subfix}`)
        if (this.dir % 4 > 1 || this.dir > 7) {
            spriteframe = null
        }
        //0普通的入口 1普通的箭头 2上锁的入口 3上锁的箭头 4隐藏的入口 5隐藏的箭头
        if (this.type > 3) {
            this.roof.getComponentInChildren(cc.Label).node.parent.active = false
        }
        this.roof.spriteFrame = spriteframe
        this.roof.node.parent = this.node.parent
        let p = this.root.convertToWorldSpaceAR(cc.v3(0, 128))
        this.roof.node.position = this.roof.node.parent.convertToNodeSpaceAR(p)
        this.roof.node.zIndex = IndexZ.OVERHEAD
        this.roof.node.opacity = 255
        switch (this.dir % 4) {
            case 0:
                break
            case 1:
                // this.roof.node.angle = 180
                // this.roof.node.getChildByName('info').angle = 180
                break
            case 2:
                break
            case 3:
                break
        }
    }

    openGate(immediately?: boolean) {
        if (this.isOpen) {
            return
        }
        this.isOpen = true
        this.getComponent(CCollider).sensor = true
        cc.tween(this.closeSprite.node)
            .to(immediately ? 0 : 1, { opacity: 0 })
            .start()
    }
    closeGate(immediately?: boolean) {
        if (!this.isOpen) {
            return
        }
        this.isOpen = false
        this.getComponent(CCollider).sensor = false
        cc.tween(this.closeSprite.node)
            .to(immediately ? 0 : 1, { opacity: 255 })
            .start()
    }

    onColliderEnter(other: CCollider, self: CCollider) {
        if (self.sensor && other.tag == CCollider.TAG.PLAYER) {
            let player = other.node.getComponent(Player)
            this.loadingNextLevel(player)
        } else if (self.sensor && other.tag == CCollider.TAG.VEHICLE) {
            let v = other.node.getComponent(Vehicle)
            if (v.dungeon && v.isPlayerIn) {
                this.loadingNextLevel(v.dungeon.player)
            }
        }
    }
    loadingNextLevel(player: Player) {
        if (player && this.isOpen) {
            this.isOpen = false
            AudioPlayer.play(AudioPlayer.EXIT)
            player.dungeon.isInitFinish = false
            Logic.loadingNextLevel(this.exitData)
        }
    }
    // update (dt) {}
    changeRes(resName: string) {
        this.bgSprite.spriteFrame = Logic.spriteFrameRes(resName + 'bg')
        this.openSprite.spriteFrame = Logic.spriteFrameRes(resName + 'open')
        this.closeSprite.spriteFrame = Logic.spriteFrameRes(resName + 'close')
    }
    disappear(): void {
        super.disappear()
        cc.tween(this.roof.node)
            .to(0.5 + Random.rand(), { scaleY: 0 })
            .start()
    }
}
