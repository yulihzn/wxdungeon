import Logic from "./Logic";
import MapData from "./Data/MapData";
import EquipmentData from "./Data/EquipmentData";
import RectDungeon from "./Rect/RectDungeon";
import MapManager from "./Manager/MapManager";
import Dungeon from "./Dungeon";
import TalentTree from "./UI/TalentTree";
import CutScene from "./UI/CutScene";
import EquipmentStringData from "./Data/EquipmentStringData";

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
    @property(TalentTree)
    simpleTree: TalentTree = null;
    @property(TalentTree)
    shieldTree: TalentTree = null;
    @property(TalentTree)
    dashTree: TalentTree = null;
    @property(CutScene)
    cutScene: CutScene = null;
    private timeDelay = 0;
    private isEquipmentLoaded = false;
    private isMonsterLoaded = false;
    private isLevelLoaded = false;
    private isSpriteFramesLoaded = false;
    private isDebuffsLoaded = false;
    private isBulletsLoaded = false;
    private isItemsLoaded = false;
    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        this.simpleTree.node.active = false;
        this.shieldTree.node.active = false;
        this.dashTree.node.active = false;
        this.label.node.setPosition(cc.v2(0, 0));

    }

    showTalentPick() {
        if (Logic.isPickedTalent || !this.isTalentLevel()) {
            this.simpleTree.node.active = false;
            this.shieldTree.node.active = false;
            this.dashTree.node.active = false;
            return true;
        }
        if (Logic.talentList.length < 1) {
            this.simpleTree.node.active = true;
        }
        if (Logic.talentList.length >= 1) {
            this.simpleTree.node.active = false
            if (Logic.talentList[0].id < 2000001) {
                this.dashTree.node.active = true;
            } else {
                this.shieldTree.node.active = true;
            }
            this.label.node.setPosition(cc.v2(-400, 0));
        }
        if (Logic.talentList.length > 9) {
            this.simpleTree.node.active = false;
            this.shieldTree.node.active = false;
            this.dashTree.node.active = false;
        }

    }
    isTalentLevel(): boolean {
        return Logic.level == 1 || Logic.level == 4;
    }
    isPickedTalent(): boolean {
        if (Logic.isPickedTalent) {
            return true;
        }
        if (this.isTalentLevel()) {
            let isPicked = false;
            if (this.simpleTree.node.active && this.simpleTree.hasPicked) {
                isPicked = true;
            }
            if (this.dashTree.node.active && this.dashTree.hasPicked) {
                isPicked = true;
            }
            if (this.shieldTree.node.active && this.shieldTree.hasPicked) {
                isPicked = true;
            }
            if (!this.simpleTree.node.active && !this.dashTree.node.active && !this.shieldTree.node.active) {
                isPicked = true;
            }
            return isPicked;
        } else {
            return true;
        }
    }
    start() {
        this.label.string = `Level ${Logic.chapterName + 1}-${Logic.level}`
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
        this.loadItems();
        if (Logic.isFirst == 1) {
            this.cutScene.isSkip = true;
            this.cutScene.unregisterClick();
        }
    }
    loadMap() {
        Logic.mapManager.isloaded = false;
        Logic.mapManager.loadMap();
    }
    loadEquipment() {
        if (Logic.equipments) {
            this.isEquipmentLoaded = true;
            return;
        }
        cc.loader.loadRes('Data/equipment', (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.equipments = resource.json;
                this.isEquipmentLoaded = true;
                cc.log('equipment loaded');
                Logic.equipmentNameList = new Array();
                for(let key in resource.json){
                    Logic.equipmentNameList.push(key);
                }
                // let stringmap = new Array();
                // for(let key in resource.json){
                //     let temp = new EquipmentStringData();
                //     let temp1 = new EquipmentData();
                //     temp1.valueCopy(resource.json[key]);
                //     temp.valueCopy(temp1);
                //     stringmap.push(temp);
                // }
                // cc.log(JSON.stringify(stringmap));
            }
        })
    }
    loadDebuffs() {
        if (Logic.debuffs) {
            this.isDebuffsLoaded = true;
            return;
        }
        cc.loader.loadRes('Data/status', (err: Error, resource) => {
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
        cc.loader.loadRes('Data/bullet', (err: Error, resource) => {
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
        cc.loader.loadRes('Data/monsters', (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.monsters = resource.json;
                this.isMonsterLoaded = true;
                cc.log('monsters loaded');
            }
        })
    }
    loadItems() {
        if (Logic.items) {
            this.isItemsLoaded = true;
            return;
        }
        cc.loader.loadRes('Data/item', (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.items = resource.json;
                this.isItemsLoaded = true;
                cc.log('items loaded');
            }
        })
    }
    loadSpriteFrames() {
        if (Logic.spriteFrames) {
            this.isSpriteFramesLoaded = true;
            this.showTalentPick();
            return;
        }
        cc.loader.loadResDir('Texture', cc.SpriteFrame, (err: Error, assert: cc.SpriteFrame[]) => {
            Logic.spriteFrames = {};
            for (let frame of assert) {
                // frame.getTexture().setAliasTexParameters();
                Logic.spriteFrames[frame.name] = frame;
            }
            this.isSpriteFramesLoaded = true;
            this.showTalentPick();
            cc.log('texture loaded');
        })
    }

    showCut(): void {
        if (this.isSpriteFramesLoaded && Logic.isFirst != 1) {
            Logic.isFirst = 1;
            this.cutScene.playShow();
        }
    }
    update(dt) {
        this.timeDelay += dt;
        this.isLevelLoaded = Logic.mapManager.isloaded;
        this.showCut();
        if (this.timeDelay > 0.16 && this.isLevelLoaded && this.isEquipmentLoaded
            && this.isSpriteFramesLoaded && this.isMonsterLoaded && this.isDebuffsLoaded
            && this.isBulletsLoaded
            && this.isItemsLoaded
            && this.isPickedTalent()
            && this.cutScene.isSkip) {
            this.timeDelay = 0;
            this.cutScene.unregisterClick();
            this.isLevelLoaded = false;
            this.isEquipmentLoaded = false;
            this.isSpriteFramesLoaded = false;
            this.isDebuffsLoaded = false;
            this.isBulletsLoaded = false;
            this.isItemsLoaded = false;
            cc.director.loadScene('game');
        }

    }
}
