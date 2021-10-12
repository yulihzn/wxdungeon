// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dungeon from "../Dungeon";
import Logic from "../Logic";
import AudioPlayer from "../utils/AudioPlayer";
import MonsterGenerator from "./MonsterGenerator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MgCrack extends MonsterGenerator {
    sprite:cc.Sprite;
    frames:string[]=['crack000','crack001','crack002','crack003'];
    init(dungeon:Dungeon,generatorInterval:number,generatorCount:number,generatorList:string[]){
        super.init(dungeon,generatorInterval,generatorCount,generatorList);
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
    }
    setFrames(frames:string[]){
        this.frames = frames;
    }
    open() {
        if (super.open()) {
            AudioPlayer.play(AudioPlayer.SCARABCRAWL);
            let tween = cc.tween(this.sprite);
            for(let frame of this.frames){
                tween.then(cc.tween(this.sprite).delay(0.2).call(()=>{
                    this.sprite.spriteFrame = Logic.spriteFrameRes(frame);
                }));
            }
            tween.call(()=>{
                this.showMonster();
            }).start();
        }
        return true;
    }
   
    addMonster() {
        if(super.addMonster()){
            AudioPlayer.play(AudioPlayer.SCARABCRAWL);
            this.showMonster();
        }
        return true;
    }

}
