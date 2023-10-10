// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import AttributeData from '../data/AttributeData'
import Logic from '../logic/Logic'
import ColorPicker from './ColorPicker'

const { ccclass, property } = cc._decorator

@ccclass
export default class AttributeSelector extends cc.Component {
    @property(cc.Node)
    arrowLeft: cc.Node = null
    @property(cc.Node)
    arrowRight: cc.Node = null
    @property(cc.Label)
    label: cc.Label = null
    @property(cc.Label)
    title: cc.Label = null
    @property(cc.Node)
    palette: cc.Node = null
    nameList: AttributeData[] = []
    currentIndex = 0
    selectorCallback: (data: AttributeData, color: cc.Color) => void
    colorPicker: ColorPicker
    defaultColors: string[] = []
    onLoad() {
        this.arrowLeft.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.currentIndex--
            this.updateAttribute()
        })
        this.arrowRight.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.currentIndex++
            this.updateAttribute()
        })
        this.palette.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            if (this.colorPicker) {
                this.colorPicker.show(this.palette.color, this.defaultColors, (color: cc.Color) => {
                    this.palette.color = color
                    if (this.selectorCallback) {
                        this.selectorCallback(this.nameList[this.currentIndex], this.palette.color)
                    }
                })
            }
        })
    }
    selectRandom(colorOnlyDefault?: boolean) {
        this.currentIndex = Logic.getRandomNum(0, this.nameList.length - 1)
        if (this.colorPicker) {
            this.palette.color = ColorPicker.getRandomColor()
            if (colorOnlyDefault) {
                this.palette.color = cc.Color.WHITE.fromHEX(this.defaultColors[Logic.getRandomNum(0, this.defaultColors.length - 1)])
            }
        }
        this.updateAttribute()
    }
    selectTarget(resName: string, defaultColor?: cc.Color) {
        if (resName && resName.length > 0) {
            let index = this.nameList.findIndex(item => item.resName == resName)
            if (index > -1) {
                this.currentIndex = index
            }
        }
        if (defaultColor) {
            this.palette.color = defaultColor
        }
        this.updateAttribute()
    }
    selectNext(isLeft: boolean) {
        if (isLeft) {
            this.currentIndex--
        } else {
            this.currentIndex++
        }
        this.updateAttribute()
    }
    init(title: string, nameList: AttributeData[], defaultIndex: number, colorPicker: ColorPicker, defaultColors: string[]) {
        this.title.string = title
        this.nameList = nameList
        this.currentIndex = defaultIndex ? defaultIndex : 0
        this.colorPicker = colorPicker
        if (this.colorPicker) {
            this.node.height = 52 + 35
            this.palette.active = true
            this.defaultColors = defaultColors
        } else {
            this.node.height = 52
            this.palette.active = false
            this.defaultColors = []
        }
        this.updateAttribute()
    }
    private updateAttribute() {
        if (this.currentIndex < 0) {
            this.currentIndex = this.nameList.length - 1
        } else if (this.currentIndex > this.nameList.length - 1) {
            this.currentIndex = 0
        }
        this.label.string = this.nameList[this.currentIndex].name
        if (this.selectorCallback) {
            this.selectorCallback(this.nameList[this.currentIndex], this.palette.color)
        }
    }
    get CurrentData() {
        return this.nameList[this.currentIndex]
    }
}
