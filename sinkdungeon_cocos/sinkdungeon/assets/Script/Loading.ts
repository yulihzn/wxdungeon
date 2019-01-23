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
    private isMonsterLoaded = false;
    private isLevelLoaded = false;
    private isSpriteFramesLoaded = false;
    private isDebuffsLoaded = false;
    private isBulletsLoaded = false;
    // LIFE-CYCLE CALLBACKS:


    // onLoad () {}

    start() {
        this.label.string = `Level ${Logic.chapterName+1}-${Logic.level}`
        if (Logic.level == 0) {
            this.label.string = `Sink Dungeon`
        }
        this.isLevelLoaded = false;
        this.isEquipmentLoaded = false;
        this.isMonsterLoaded = false;
        this.isDebuffsLoaded = false;
        this.loadMap();
        this.loadEquipment();
        this.loadSpriteFrames();
        this.loadMonsters();
        this.loadDebuffs();
        this.loadBullets();

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
                cc.log('equipment loaded');
            }
        })
    }
    loadDebuffs() {
        if (Logic.debuffs) {
            this.isDebuffsLoaded = true;
            return;
        }
        cc.loader.loadRes('Data/Status/status', (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.debuffs = resource.json;
                this.isDebuffsLoaded = true;
                cc.log('debuffs loaded');
            }
        })
    }
    loadBullets() {
        if (Logic.bullets) {
            this.isBulletsLoaded = true;
            return;
        }
        cc.loader.loadRes('Data/Bullet/bullet', (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.bullets = resource.json;
                this.isBulletsLoaded = true;
                cc.log('bullets loaded');
            }
        })
    }
    loadMonsters() {
        if (Logic.monsters) {
            this.isMonsterLoaded = true;
            return;
        }
        cc.loader.loadRes('Data/Monster/monsters', (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.monsters = resource.json;
                this.isMonsterLoaded = true;
                cc.log('monsters loaded');
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
            cc.log('texture loaded');
        })
    }

    update(dt) {
        this.timeDelay += dt;
        this.isLevelLoaded = Logic.mapManger.isloaded;
        if (this.timeDelay > 0.16 && this.isLevelLoaded && this.isEquipmentLoaded
            && this.isSpriteFramesLoaded && this.isMonsterLoaded && this.isDebuffsLoaded
            && this.isBulletsLoaded) {
            this.timeDelay = 0;
            this.isLevelLoaded = false;
            this.isEquipmentLoaded = false;
            this.isSpriteFramesLoaded = false;
            this.isDebuffsLoaded = false;
            this.isBulletsLoaded = false;
            cc.director.loadScene('game');
        }
    }
}
