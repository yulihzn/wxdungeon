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
import Logic from '../logic/Logic'
import Player from '../logic/Player'
import IndexZ from '../utils/IndexZ'
import Utils from '../utils/Utils'
import BaseManager from './BaseManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class WeatherManager extends BaseManager {
    @property(cc.Prefab)
    rain: cc.Prefab = null
    public effectList: WeatherEffect[] = []
    weatherRain: WeatherRain

    clear(): void {
        Utils.clearComponentArray(this.effectList)
        this.effectList = new Array()
    }
    public addRain(indexPos: cc.Vec3, zHeight: number) {
        this.weatherRain = this.addWeatherEffect(this.rain, indexPos).getComponent(WeatherRain)
        this.weatherRain.root.y = zHeight
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

    updateLogic(dt: number, player: Player) {
        if (this.weatherRain) {
            let p = player.node.position.clone()
            if (player.entity) {
                p.y += player.entity.Transform.z
            }
            this.weatherRain.node.setPosition(Logic.lerpPos(this.weatherRain.node.position, p, dt * 0.05))
        }
    }
}
