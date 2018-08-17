import Logic from "./Logic";
import MapData from "./Data/MapData";
import EquipmentData from "./Data/EquipmentData";
import RectDungeon from "./Rect/RectDungeon";
import MapManager from "./Manager/MapManager";
import Dungeon from "./Dungeon";

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
export default class Loading extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    private timeDelay = 0;
    private isEquipmentLoaded = false;
    private isLevelLoaded = false;
    private isSpriteFramesLoaded = false;
    // LIFE-CYCLE CALLBACKS:


    // onLoad () {}

    start() {
        this.label.string = `Level ${Logic.level}`
        this.isLevelLoaded = false;
        this.isEquipmentLoaded = false;

        this.loadMap();
        this.loadEquipment();
        this.loadSpriteFrames();
    }
    loadMap() {
        Logic.mapManger.isloaded = false;
        Logic.mapManger.loadMap();
    }
    loadEquipment() {
        if (Logic.equipments) {
            this.isEquipmentLoaded = true;
            return;
        }
        cc.loader.loadRes('Data/Equipment/equipment', (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.equipments = resource.json;
                this.isEquipmentLoaded = true;
            }
        })
    }
    loadSpriteFrames() {
        if (Logic.spriteFrames) {
            this.isSpriteFramesLoaded = true;
            return;
        }
        cc.loader.loadResDir('Texture', cc.SpriteFrame, (err: Error, assert: cc.SpriteFrame[]) => {
            Logic.spriteFrames = {};
            for (let frame of assert) {
                // frame.getTexture().setAliasTexParameters();
                Logic.spriteFrames[frame.name] = frame;
            }
            this.isSpriteFramesLoaded = true;
        })
    }

    update(dt) {
        this.timeDelay += dt;
        this.isLevelLoaded = Logic.mapManger.isloaded;
        if (this.timeDelay > 0.16 && this.isLevelLoaded && this.isEquipmentLoaded && this.isSpriteFramesLoaded) {
            this.timeDelay = 0;
            this.isLevelLoaded = false;
            this.isEquipmentLoaded = false;
            this.isSpriteFramesLoaded = false;
            Logic.changeDungeonSize();
            cc.director.loadScene('game');
        }
    }
}
