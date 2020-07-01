// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from "./Logic";
import AudioPlayer from "./Utils/AudioPlayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PickAvatar extends cc.Component {

    isSpirteLoaded = false;
    //图片资源
    spriteFrames: { [key: string]: cc.SpriteFrame } = null;

    onLoad() {
        this.loadSpriteFrames();
    }
    loadSpriteFrames() {
        if (this.spriteFrames) {
            this.isSpirteLoaded = true;
            return;
        }
        cc.resources.load('Texture/texures', cc.SpriteAtlas, (err: Error, atlas: cc.SpriteAtlas) => {
            this.spriteFrames = {};
            for (let frame of atlas.getSpriteFrames()) {
                this.spriteFrames[frame.name] = frame;
            }
            this.isSpirteLoaded = true;
            cc.log('texures spriteatlas loaded');
        })
    }
    
    start() {

    }
    startGame(){
        //清除存档
        Logic.profileManager.clearData();
        //重置数据
        Logic.resetData();
        //加载资源
        AudioPlayer.play(AudioPlayer.SELECT);
        cc.director.loadScene('loading');
    }
    backToHome() {
        cc.director.loadScene('start');
    }
    show(){

    }
    update(dt) {
        if (this.isSpirteLoaded) {
            this.isSpirteLoaded = false;
            this.show();
        }
    }
}
