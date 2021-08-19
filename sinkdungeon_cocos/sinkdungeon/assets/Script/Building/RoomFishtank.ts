// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from "../Logic";
import Utils from "../Utils/Utils";
import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoomFishtank extends Building {
    @property(cc.Node)
    fish: cc.Node = null;
    @property(cc.Prefab)
    food: cc.Prefab = null;
    @property(cc.Node)
    layout: cc.Node = null;
    isFeeding = false;
    foodList: cc.Node[] = [];
    fishSprite: cc.Sprite;

    onLoad() {
        this.fishSprite = this.fish.getChildByName('sprite').getComponent(cc.Sprite);
        this.fishIdle();
        this.fishMove();
    }
    init(indexPos: cc.Vec3) {
        this.data.defaultPos = indexPos;
    }

    feed() {
        if (this.isFeeding) {
            return;
        }
        if (this.foodList.length > 50) {
            Utils.toast('喂得太多了啊');
            return;
        }
        for (let i = 0; i < 5; i++) {
            this.initFood();
        }
        this.isFeeding = true;
        this.unscheduleAllCallbacks();
        this.scheduleOnce(() => { this.isFeeding = false; }, 2)
    }
    private initFood() {
        let food = cc.instantiate(this.food);
        food.parent = this.layout;
        let width = this.layout.width;
        let height = this.layout.height;
        let startPos = cc.v3(Logic.getRandomNum(food.width / 2, width - food.width / 2), Logic.getRandomNum(height, height * 1.5));
        let endPos = cc.v3(startPos.x, Logic.getRandomNum(food.height / 2, height / 2));
        food.position = startPos;
        let duration = Logic.getRandomNum(700, 1000) / 1000;
        cc.tween(food).call(()=>{
            this.scheduleOnce(()=>{
                this.foodList.push(food);
            },duration/2)
        }).to(duration, { position: endPos }).start();
    }
    private changeFishRes(resName: string, suffix?: string): void {
        let spriteFrame = Logic.spriteFrameRes(resName + suffix);
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrameRes(resName);
        }
        this.fishSprite.spriteFrame = spriteFrame;
    }
    private fishIdle() {
        let action = cc.tween()
            .delay(0.2).call(() => { this.changeFishRes('nonplayer102anim002') })
            .delay(0.2).call(() => { this.changeFishRes('nonplayer102anim003') })
            .delay(0.2).call(() => { this.changeFishRes('nonplayer102anim004') })
            .delay(0.2).call(() => { this.changeFishRes('nonplayer102anim005') });
        this.fishSprite.node.stopAllActions();
        cc.tween(this.fishSprite.node).repeatForever(action).start();
    }
    private fishEat(index: number) {
        this.fishSprite.node.stopAllActions();
        cc.tween(this.fishSprite.node)
            .delay(0.2).call(() => {
                this.changeFishRes('nonplayer102anim010');
                if (index >= 0 && index < this.foodList.length && this.foodList[index].isValid) {
                    this.foodList[index].active = false;
                    this.foodList[index].destroy();
                    this.foodList.splice(index, 1);
                }
            })
            .delay(0.2).call(() => {
                this.changeFishRes('nonplayer102anim009');
            })
            .delay(0.2).call(() => {
                this.fishIdle();
                if (this.foodList.length > 0) {
                    this.fishSearch();
                } else {
                    this.fishMove();
                }
            })
            .start();
    }
    private fishSearch() {
        let index = Logic.getRandomNum(0, this.foodList.length - 1);
        let targetPos = this.foodList[index].position.clone();
        this.fish.scaleX = targetPos.x>this.fish.position.x?1:-1;
        let distance = Logic.getDistance(this.fish.position, targetPos);
        cc.tween(this.fish).to(distance / 10, { position: targetPos }).call(() => {
            this.fishEat(index);
        }).start();
    }
    private fishMove() {
        let width = this.layout.width;
        let height = this.layout.height;
        let randomPos = cc.v3(Logic.getRandomNum(this.fish.width / 2, width - this.fish.width / 2)
            , Logic.getRandomNum(this.fish.height / 2, height - this.fish.height / 2));
        this.fish.scaleX = randomPos.x>this.fish.position.x?1:-1;
        let distance = Logic.getDistance(this.fish.position, randomPos);
        cc.tween(this.fish).to(distance / 5, { position: randomPos }).delay(0.5).call(() => {
            if (this.foodList.length > 0) {
                this.fishSearch();
            } else {
                this.fishMove();
            }
        }).start();
    }

}
