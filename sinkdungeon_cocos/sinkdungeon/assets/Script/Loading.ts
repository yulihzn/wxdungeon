import Logic from "./Logic";
import TalentTree from "./UI/TalentTree";
import CutScene from "./UI/CutScene";
import { EventHelper } from "./EventHelper";
import AudioPlayer from "./Utils/AudioPlayer";
import ProfessionData from "./Data/ProfessionData";

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
    @property(cc.Node)
    loadingIcon:cc.Node = null;
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
    private static readonly KEY_AUTO = 'auto';
    private static readonly KEY_TEXURES = 'texures';
    private spriteFrameNames: { [key: string]: boolean } = null;
    private timeDelay = 0;
    private isEquipmentLoaded = false;
    private isMonsterLoaded = false;
    private isWorldLoaded = false;
    private isDebuffsLoaded = false;
    private isBulletsLoaded = false;
    private isProfessionLoaded = false;
    private isItemsLoaded = false;
    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        this.setAllSpriteFramesUnload();
        if(!Logic.spriteFrames){
            Logic.spriteFrames = {};
        }
        //关闭技能树
        this.simpleTree.node.active = false;
        this.shieldTree.node.active = false;
        this.dashTree.node.active = false;
        this.magicTree.node.active = false;
        this.talentInfo.active = false;
        this.label.node.setPosition(cc.v3(0, 0));
        this.loadingIcon.active = true;
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
        AudioPlayer.play(AudioPlayer.SELECT);
    }

    showTalentPick() {
        if(!this.isAllSpriteFramesLoaded()){
            return;
        }
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
        this.loadingIcon.active = false;
        if (Logic.talentList.length > 9) {
            this.simpleTree.node.active = false;
            this.shieldTree.node.active = false;
            this.dashTree.node.active = false;
            this.magicTree.node.active = false;
            Logic.isPickedTalent = true;
        }

    }
    isTalentLevel(): boolean {
        // return Logic.level > 0;
        return false;
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
            this.label.string = ``
            
        }
        //加载地图，装备，贴图，敌人，状态，子弹，物品资源
        this.isWorldLoaded = false;
        this.isEquipmentLoaded = false;
        this.isMonsterLoaded = false;
        this.isDebuffsLoaded = false;
        this.loadWorld();
        this.loadEquipment();
        this.loadAutoSpriteFrames();
        this.loadSpriteAtlas('texures','monster000');
        this.loadMonsters();
        this.loadDebuffs();
        this.loadBullets();
        this.loadItems();
        this.loadProfession();
        this.showLoadingLabel();
        //显示过场
        if (Logic.isFirst == 1) {
            this.cutScene.isSkip = true;
            this.cutScene.unregisterClick();
        }
    }
    isAllSpriteFramesLoaded(){
        for(let loadedName in this.spriteFrameNames){
            if(!this.spriteFrameNames[loadedName]){
                return false;
            }
        }
        return true;
    }
    setAllSpriteFramesUnload(){
        this.spriteFrameNames = {};
        this.spriteFrameNames[Loading.KEY_AUTO] = false;
        this.spriteFrameNames[Loading.KEY_TEXURES] = false;
    }
    showLoadingLabel(){
        if (this.isAllSpriteFramesLoaded()) {
            return;
        }
        this.label.string = ``;
        this.loadingIcon.active = true;
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
        cc.resources.load('Data/equipment', (err: Error, resource:cc.JsonAsset) => {
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
    loadProfession() {
        if (Logic.professionList&&Logic.professionList.length>0) {
            this.isProfessionLoaded = true;
            return;
        }
        cc.resources.load('Data/profession', (err: Error, resource:cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.professionList = new Array();
                let arr:ProfessionData[] = resource.json;
                for(let i =0;i<arr.length;i++){
                    let data = new ProfessionData();
                    data.valueCopy(arr[i])
                    data.id = i;
                    Logic.professionList.push(data);
                }
                
                this.isProfessionLoaded = true;
                cc.log('professionList loaded');
            }
        })
    }
    loadDebuffs() {
        if (Logic.debuffs) {
            this.isDebuffsLoaded = true;
            return;
        }
        cc.resources.load('Data/status', (err: Error, resource:cc.JsonAsset) => {
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
        cc.resources.load('Data/bullet', (err: Error, resource:cc.JsonAsset) => {
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
        cc.resources.load('Data/monsters', (err: Error, resource:cc.JsonAsset) => {
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
        cc.resources.load('Data/item', (err: Error, resource:cc.JsonAsset) => {
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
    private loadAutoSpriteFrames() {
        if (Logic.spriteFrames&&Logic.spriteFrames['singleColor']) {
            this.spriteFrameNames[Loading.KEY_AUTO] = true;
            this.showTalentPick();
            return;
        }
        cc.resources.loadDir('Texture/Auto', cc.SpriteFrame, (err: Error, assert: cc.SpriteFrame[]) => {
            for (let frame of assert) {
                Logic.spriteFrames[frame.name] = frame;
            }
            this.spriteFrameNames[Loading.KEY_AUTO] = true;
            if(this.isAllSpriteFramesLoaded()){
                this.showTalentPick();
            }
            cc.log('auto texture loaded');
        })
    }
    private loadSpriteAtlas(typeKey:string,hasKey:string){
        if (Logic.spriteFrames&&Logic.spriteFrames[hasKey]) {
            this.spriteFrameNames[typeKey] = true;
            this.showTalentPick();
            return;
        }
        cc.resources.load(`Texture/${typeKey}`, cc.SpriteAtlas, (err: Error, atlas: cc.SpriteAtlas) => {
            for (let frame of atlas.getSpriteFrames()) {
                Logic.spriteFrames[frame.name] = frame;
            }
            this.spriteFrameNames[typeKey] = true;
            this.showTalentPick();
            cc.log(`${typeKey} loaded`);
        })
    }
    showCut(): void {
        if (this.isAllSpriteFramesLoaded() && Logic.isFirst != 1) {
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
            && this.isAllSpriteFramesLoaded()
            && this.isMonsterLoaded
            && this.isDebuffsLoaded
            && this.isProfessionLoaded
            && this.isBulletsLoaded
            && this.isItemsLoaded
            && this.isWorldLoaded
            && this.isPickedTalent()
            && this.cutScene.isSkip) {
            this.timeDelay = 0;
            this.cutScene.unregisterClick();
            this.isWorldLoaded = false;
            this.isEquipmentLoaded = false;
            this.setAllSpriteFramesUnload();
            this.isDebuffsLoaded = false;
            this.isProfessionLoaded = false;
            this.isBulletsLoaded = false;
            this.isItemsLoaded = false;
            Logic.mapManager.loadMap();
            cc.director.loadScene('game');
        }

    }
}
