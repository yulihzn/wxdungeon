import Logic from "./Logic";
import AudioPlayer from "../utils/AudioPlayer";
import Random from "../utils/Random";
import ExitData from "../data/ExitData";
import LocalStorage from "../utils/LocalStorage";
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOver extends cc.Component {

    @property(cc.Label)
    info: cc.Label = null;
    @property(cc.Sprite)
    infoIcon: cc.Sprite = null;
    @property(cc.Label)
    level: cc.Label = null;
    @property(cc.Label)
    clock: cc.Label = null;
    @property(cc.Label)
    tips: cc.Label = null;
    tipsStr = '';
    static TIPS = [`当你凝视深渊的时候,深渊也在凝视着你`, `上锁的门需要从另一面才能打开`, `梦醒可以躺在床上回到上一个翠金点`, `盾牌可以格挡子弹，甚至弹反对面`,
        `翠湖的水很冰冷`, `合理使用物品来增强自己`, `你沉沉地睡着了`, `电眼会麻痹你的思维`, `翠金点是用来自动保存进度的`, `激光有一个短暂的瞄准期，抓住机会再补一刀`
        , `冰魔的刺会阻挡你的行动`, '武士刀可以反击子弹', `你的头盖骨被做成了碗`, `幽光在呼唤着你`];
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}

    start() {
        let ach = LocalStorage.getAchievementData();
        if (this.clock) {
            this.clock.string = `用时：${Logic.time}`;
        }
        if (this.level) {
            this.level.string = ``;
        }
        let dieinfo = `死于非命`
        if (Logic.dieFrom.name.length > 0) {
            dieinfo = `第${ach.playerLifes}次死亡，在 ${Logic.worldLoader.getCurrentLevelData().name} 被 ${Logic.dieFrom.name} 击倒`
        }
        if (this.infoIcon && Logic.dieFrom.res.length > 0) {
            this.infoIcon.spriteFrame = Logic.spriteFrameRes(Logic.dieFrom.res);
            this.infoIcon.node.width = 64;
            this.infoIcon.node.height = 64/this.infoIcon.spriteFrame.getOriginalSize().width*this.infoIcon.spriteFrame.getOriginalSize().height;
        }
        if (this.info) {
            this.info.string = dieinfo;
        }
        if (this.tips) {
            let count = 0;
            this.tips.string = '';
            let str = GameOver.TIPS[Random.getRandomNum(0, GameOver.TIPS.length - 1)];
            this.schedule(() => {
                count++;
                if (count > str.length) {
                    count = str.length;
                }
                this.tips.string = str.substr(0, count);
            }, 0.05, str.length, 0.2);

        }
    }
    retry() {
        Logic.resetData();
        AudioPlayer.play(AudioPlayer.SELECT);
        Logic.loadingNextLevel(ExitData.getRealWorldExitDataFromDream(Logic.chapterIndex,Logic.level));
    }
    home() {
        AudioPlayer.play(AudioPlayer.SELECT);
        cc.director.loadScene('start');
    }
    resetWorld() {
        AudioPlayer.play(AudioPlayer.SELECT);
        cc.director.loadScene('start');
        Logic.profileManager.clearData();
    }
}
