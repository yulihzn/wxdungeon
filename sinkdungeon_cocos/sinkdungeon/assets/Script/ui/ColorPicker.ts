// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import HighPrecisionSlider from './HighPrecisionSlider'

const { ccclass, property } = cc._decorator

@ccclass
export default class ColorPicker extends cc.Component {
    @property(cc.Node)
    colorDisplay: cc.Node = null
    @property(HighPrecisionSlider)
    hueSlider: HighPrecisionSlider = null
    @property(HighPrecisionSlider)
    saturationSlider: HighPrecisionSlider = null
    @property(HighPrecisionSlider)
    valueSlider: HighPrecisionSlider = null
    @property(cc.Node)
    defaultColorLayout: cc.Node = null
    static readonly DEFAULT_MAX = 16
    // 回调函数，用于通知 bar 的变化
    private colorChangeCallback: (color: cc.Color) => void = null
    onLoad() {
        this.node.getChildByName('bg').on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.hide()
        })
        for (let child of this.defaultColorLayout.children) {
            child.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
                const hsv: { h: number; s: number; v: number } = child.color.toHSV()
                this.hueSlider.progress = hsv.h
                this.saturationSlider.progress = hsv.s
                this.valueSlider.progress = hsv.v
                this.onSliderChange()
            })
        }
    }

    // 添加一个 show 方法，接受默认的 #RGB 字符串和回调函数作为参数
    show(defaultColor: cc.Color, defaultColors: string[], callback: (color: cc.Color) => void) {
        this.node.active = true
        this.colorChangeCallback = callback
        // 将颜色对象转换为 HSV 值，并设置 Slider 的默认值
        const hsv: { h: number; s: number; v: number } = defaultColor.toHSV()
        this.hueSlider.progress = hsv.h
        this.saturationSlider.progress = hsv.s
        this.valueSlider.progress = hsv.v
        for (let i = 0; i < this.defaultColorLayout.childrenCount; i++) {
            if (i < defaultColors.length) {
                this.defaultColorLayout.children[i].active = true
                this.defaultColorLayout.children[i].color = cc.Color.WHITE.fromHEX(defaultColors[i])
            } else {
                this.defaultColorLayout.children[i].active = false
            }
        }

        // 更新颜色显示
        this.updateColorDisplay()

        // 监听 Slider 的滑动事件
        this.hueSlider.setSelectorCallback((progress: number) => {
            this.onSliderChange()
        })
        this.saturationSlider.setSelectorCallback((progress: number) => {
            this.onSliderChange()
        })
        this.valueSlider.setSelectorCallback((progress: number) => {
            this.onSliderChange()
        })
    }
    hide() {
        this.node.active = false
    }
    randomColor() {
        const hsv: { h: number; s: number; v: number } = ColorPicker.getRandomColor().toHSV()
        this.hueSlider.progress = hsv.h
        this.saturationSlider.progress = hsv.s
        this.valueSlider.progress = hsv.v
        this.onSliderChange()
    }

    onSliderChange() {
        this.updateColorDisplay()
        if (this.node.active && this.colorChangeCallback) {
            this.colorChangeCallback(this.colorDisplay.color)
        }
    }

    updateColorDisplay() {
        // 获取当前 HSV 值
        const hue = this.hueSlider.progress
        const saturation = this.saturationSlider.progress
        const value = this.valueSlider.progress

        // 将 HSV 转换为 RGB
        const color = cc.Color.WHITE.fromHSV(hue, saturation, value)

        // 更新颜色显示
        this.colorDisplay.color = color
    }

    static getRandomColor(): cc.Color {
        const hue = Math.random()
        const saturation = Math.random()
        const value = Math.random()
        return cc.Color.WHITE.fromHSV(hue, saturation, value)
    }
}
