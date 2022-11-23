// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dungeon from '../logic/Dungeon'
import AudioPlayer from '../utils/AudioPlayer'
import MonsterGenerator from './MonsterGenerator'

const { ccclass, property } = cc._decorator

@ccclass
export default class MgWentLine extends MonsterGenerator {
    init(dungeon: Dungeon, generatorInterval: number, generatorCount: number, generatorList: string[]) {
        super.init(dungeon, generatorInterval, generatorCount, generatorList)
        this.node.getChildByName('sprite').getChildByName('door').opacity = this.data.triggerCount > 0 ? 0 : 255
    }
    open() {
        if (super.open()) {
            this.anim.play('WentLineOpen')
            AudioPlayer.play(AudioPlayer.WENTLINE_OPEN)
        }
        return true
    }
    //Anim
    ShowFinish() {
        this.showMonster()
    }
    addMonster() {
        if (super.addMonster()) {
            this.anim.play('WentLineShow')
            AudioPlayer.play(AudioPlayer.WENTLINE_SHOW)
        }
        return true
    }
}
