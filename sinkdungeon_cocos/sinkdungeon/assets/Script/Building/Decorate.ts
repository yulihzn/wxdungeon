import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Building from "./Building";
import { EventHelper } from "../EventHelper";
import AudioPlayer from "../Utils/AudioPlayer";
import Item from "../Item/Item";
import IndexZ from "../Utils/IndexZ";
import DamageData from "../Data/DamageData";

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
export default class Decorate extends Building {

    static readonly BOX = 0;
    static readonly PLANT = 1;
    static readonly BOXBREAKABLE = 2;
    // LIFE-CYCLE CALLBACKS:
    private timeDelay = 0;
    decorateType = 0;
    resName = "decorate000";
    sprite: cc.Sprite;
    mat:cc.MaterialVariant;
    onLoad() {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);

    }
    start() {
        switch (Logic.chapterIndex) {
            case Logic.CHAPTER00: this.resName = `decorate000${this.decorateType}`; break;
            case Logic.CHAPTER01: this.resName = `decorate010${this.decorateType}`; break;
            case Logic.CHAPTER02: this.resName = `decorate020${this.decorateType}`; break;
            case Logic.CHAPTER03: this.resName = `decorate030${this.decorateType}`; break;
            case Logic.CHAPTER04: this.resName = `decorate040${this.decorateType}`; break;
            case Logic.CHAPTER05: this.resName = `decorate040${this.decorateType}`; break;
            case Logic.CHAPTER099: this.resName = `decorate000${this.decorateType}`; break;
        }
        this.changeRes(this.resName);
    }
    changeRes(resName: string, suffix?: string) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        }
        let spriteFrame = Logic.spriteFrames[resName];
        if (suffix && Logic.spriteFrames[resName + suffix]) {
            spriteFrame = Logic.spriteFrames[resName + suffix];
        }
        this.sprite.node.opacity = 255;
        this.sprite.spriteFrame = spriteFrame;
    }

    setDefaultPos(defaultPos: cc.Vec3) {
        this.data.defaultPos = defaultPos;
        this.node.position = Dungeon.getPosInMap(defaultPos);
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position);
    }
    //Animation
    BreakingFinish() {
        this.reset();
    }
    hitLight(isHit:boolean){
        if(!this.mat){
            this.mat = this.node.getChildByName('sprite').getComponent(cc.Sprite).getMaterial(0);
        }
        this.mat.setProperty('addColor',isHit?cc.color(200,200,200,100):cc.Color.TRANSPARENT);
    }
    takeDamage(damage: DamageData):boolean{
        if (this.data.currentHealth< 1) {
            return;
        }
        this.data.currentHealth = 0;
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MONSTER_HIT } });
        this.sprite.node.runAction(cc.sequence(
             cc.callFunc(() => {
                this.changeRes(this.resName, 'anim001');
                this.hitLight(true);
            }), cc.delayTime(0.15), cc.callFunc(() => {
                this.hitLight(false);
                this.changeRes(this.resName, 'anim002');
            }), cc.delayTime(0.15), cc.callFunc(() => {
                this.changeRes(this.resName, 'anim003');
            }), cc.delayTime(0.15), cc.callFunc(() => {
                this.changeRes(this.resName, 'anim004');
                let collider = this.getComponent(cc.PhysicsBoxCollider);
                if (collider) {
                    collider.sensor = true;
                    collider.apply();
                }
                let rand4save = Logic.mapManager.getCurrentRoomRandom4Save();
                let rand = rand4save.rand();
                if (rand > 0.6 && rand < 0.8) {
                    cc.director.emit(EventHelper.DUNGEON_ADD_COIN, { detail: { pos: this.node.position, count: rand4save.getRandomNum(1, 3) } });
                    if(rand4save.getHalfChance()){
                        cc.director.emit(EventHelper.DUNGEON_ADD_OILGOLD, { detail: { pos: this.node.position, count: rand4save.getRandomNum(1, 10) } });
                    }
                } else if (rand >= 0.8 && rand < 0.85) {
                    cc.director.emit(EventHelper.DUNGEON_ADD_ITEM, { detail: { pos: this.node.position, res: Item.HEART } });
                }
            }), cc.delayTime(10), cc.callFunc(() => {
                this.reset();
            })));
        return true;
    }
    
    reset() {
        this.node.position = Dungeon.getPosInMap(cc.v3(-10, -10));
        this.data.currentHealth = this.data.maxHealth;
    }

    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.2) {
            this.data.position = this.node.position;
            let saveDecorate = Logic.mapManager.getCurrentMapBuilding(this.data.defaultPos);
            if (saveDecorate) {
                saveDecorate.currentHealth = this.data.currentHealth;
                saveDecorate.position = this.data.position;
            }
            this.node.zIndex = IndexZ.getActorZIndex(this.node.position);
        }
    }
}
