// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import WeatherEffect from '../effect/weather/WeatherEffect'
import WeatherRain from '../effect/weather/WeatherRain'
import Dungeon from '../logic/Dungeon'
import IndexZ from '../utils/IndexZ'
import Utils from '../utils/Utils'
import BaseManager from './BaseManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class WeatherManager extends BaseManager {
    @property(cc.Prefab)
    rain: cc.Prefab = null
    public effectList: WeatherEffect[] = []

    clear(): void {
        Utils.clearComponentArray(this.effectList)
        this.effectList = new Array()
    }
    public addRain(indexPos: cc.Vec3, zHeight: number) {
        let rain = this.addWeatherEffect(this.rain, indexPos).getComponent(WeatherRain)
        rain.root.y = zHeight
    }

    private addWeatherEffect(prefab: cc.Prefab, indexPos: cc.Vec3): cc.Node {
        let effectNode = cc.instantiate(prefab)
        effectNode.parent = this.node
        effectNode.position = Dungeon.getPosInMap(indexPos)
        effectNode.zIndex = IndexZ.FOG
        let effect = effectNode.getComponent(WeatherEffect)
        if (effect) {
        }
        this.effectList.push(effect)
        return effectNode
    }

    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 0.2) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    updateLogic(dt: number) {
        if (this.isCheckTimeDelay(dt)) {
        }
    }
}
