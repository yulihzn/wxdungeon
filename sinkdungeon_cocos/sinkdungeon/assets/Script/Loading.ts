import Logic from "./Logic";
import MapData from "./Data/MapData";
import EquipmentData from "./Data/EquipmentData";
import RectDungeon from "./Rect/RectDungeon";
import MapManager from "./Manager/MapManager";
import Dungeon from "./Dungeon";
import TalentTree from "./UI/TalentTree";
import CutScene from "./UI/CutScene";
import EquipmentStringData from "./Data/EquipmentStringData";
import { EventHelper } from "./EventHelper";

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
    @property(TalentTree)
    magicTree: TalentTree = null;
    @property(cc.Node)
    talentInfo: cc.Node = null;
    @property(cc.Button)
    confirmButton: cc.Button = null;
    @property(CutScene)
    cutScene: CutScene = null;
    private timeDelay = 0;
    private isEquipmentLoaded = false;
    private isMonsterLoaded = false;
    private isWorldLoaded = false;
    private isSpriteFramesLoaded = false;
    private isDebuffsLoaded = false;
    private isBulletsLoaded = false;
    private isItemsLoaded = false;
    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        //关闭技能树
        this.simpleTree.node.active = false;
        this.shieldTree.node.active = false;
        this.dashTree.node.active = false;
        this.magicTree.node.active = false;
        this.talentInfo.active = false;
        this.label.node.setPosition(cc.v3(0, 0));
        this.confirmButton.interactable = false;
        cc.director.on(EventHelper.TALENT_TREE_SELECT
            , (event) => { if (this.node) { this.confirmButton.interactable = true; } });
    }
    confirmTalent() {
        if (this.simpleTree.node.active) {
            this.simpleTree.talentClick();
        } else if (this.dashTree.node.active) {
            this.dashTree.talentClick();
        } else if (this.shieldTree.node.active) {
            this.shieldTree.talentClick();
        } else if (this.magicTree.node.active) {
            this.magicTree.talentClick();
        }
    }

    showTalentPick() {
        if (Logic.isPickedTalent || !this.isTalentLevel()) {
            this.simpleTree.node.active = false;
            this.shieldTree.node.active = false;
            this.dashTree.node.active = false;
            this.magicTree.node.active = false;
            this.talentInfo.active = false;
            return true;
        }
        this.talentInfo.active = true;
        if (Logic.talentList.length < 1) {
            this.simpleTree.node.active = true;
        }
        if (Logic.talentList.length >= 1) {
            this.simpleTree.node.active = false;
            if (Logic.talentList[0].id < 2000001) {
                this.dashTree.node.active = true;
            } else if (Logic.talentList[0].id < 3000001) {
                this.shieldTree.node.active = true;
            } else if (Logic.talentList[0].id < 4000001) {
                this.magicTree.node.active = true;
            }
        }
        this.label.node.setPosition(cc.v3(0, 320));
        if (Logic.talentList.length > 9) {
            this.simpleTree.node.active = false;
            this.shieldTree.node.active = false;
            this.dashTree.node.active = false;
            this.magicTree.node.active = false;
            Logic.isPickedTalent = true;
        }

    }
    isTalentLevel(): boolean {
        return Logic.level > 0;
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
            if (this.magicTree.node.active && this.magicTree.hasPicked) {
                isPicked = true;
            }
            if (!this.simpleTree.node.active && !this.dashTree.node.active && !this.shieldTree.node.active && !this.magicTree.node.active) {
                isPicked = true;
            }
            return isPicked;
        } else {
            return true;
        }
    }
    start() {
        //显示加载文字
        this.label.string = `Level ${Logic.chapterIndex + 1}-${Logic.level}`
        if (Logic.level == 0) {
            this.label.string = `Sink Dungeon`
            
        }
        //加载地图，装备，贴图，敌人，状态，子弹，物品资源
        this.isWorldLoaded = false;
        this.isEquipmentLoaded = false;
        this.isMonsterLoaded = false;
        this.isDebuffsLoaded = false;
        this.loadWorld();
        this.loadEquipment();
        this.loadSpriteFrames();
        this.loadMonsters();
        this.loadDebuffs();
        this.loadBullets();
        this.loadItems();
        this.showLoadingLabel();
        //显示过场
        if (Logic.isFirst == 1) {
            this.cutScene.isSkip = true;
            this.cutScene.unregisterClick();
        }
    }
    showLoadingLabel(){
        if (this.isSpriteFramesLoaded) {
            return;
        }
        let arr = ['...','..','.',''];
            let count = 0;
            this.schedule(()=>{
                if(count>arr.length-1){
                    count = 0;
                }
                this.label.string = `loading ${arr[count]}`;
                count++;
            },1,30,5);
    }

    loadWorld() {
        Logic.worldLoader.isloaded = false;
        Logic.worldLoader.loadWorld();
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
                for (let key in resource.json) {
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
                Logic.itemNameList = new Array();
                for (let key in resource.json) {
                    if (Logic.items[key].canSave) {
                        Logic.itemNameList.push(key);
                    }
                }
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
        this.isWorldLoaded = Logic.worldLoader.isloaded;
        this.showCut();
        if (this.timeDelay > 0.16
            && this.isEquipmentLoaded
            && this.isSpriteFramesLoaded
            && this.isMonsterLoaded
            && this.isDebuffsLoaded
            && this.isBulletsLoaded
            && this.isItemsLoaded
            && this.isWorldLoaded
            && this.isPickedTalent()
            && this.cutScene.isSkip) {
            this.timeDelay = 0;
            this.cutScene.unregisterClick();
            this.isWorldLoaded = false;
            this.isEquipmentLoaded = false;
            this.isSpriteFramesLoaded = false;
            this.isDebuffsLoaded = false;
            this.isBulletsLoaded = false;
            this.isItemsLoaded = false;
            Logic.mapManager.loadMap();
            cc.director.loadScene('game');
        }

    }
}
