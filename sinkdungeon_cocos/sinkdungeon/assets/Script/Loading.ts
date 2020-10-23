import Logic from "./Logic";
import CutScene from "./UI/CutScene";
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

    @property(cc.Node)
    loadingIcon:cc.Node = null;
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
    private isSkillsLoaded = false;
    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        this.setAllSpriteFramesUnload();
        if(!Logic.spriteFrames){
            Logic.spriteFrames = {};
        }
        
        this.loadingIcon.active = true;
    
    }

    start() {
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
        this.loadTalents();
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
    loadTalents() {
        if (Logic.talents) {
            this.isSkillsLoaded = true;
            return;
        }
        cc.resources.load('Data/talent', (err: Error, resource:cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.talents = resource.json;
                this.isSkillsLoaded = true;
                cc.log('talent loaded');
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
                        if(key.indexOf('food')==-1){
                            Logic.itemNameList.push(key);
                        }
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
            return;
        }
        cc.resources.loadDir('Texture/Auto', cc.SpriteFrame, (err: Error, assert: cc.SpriteFrame[]) => {
            for (let frame of assert) {
                Logic.spriteFrames[frame.name] = frame;
            }
            this.spriteFrameNames[Loading.KEY_AUTO] = true;
            cc.log('auto texture loaded');
        })
    }
    private loadSpriteAtlas(typeKey:string,hasKey:string){
        if (Logic.spriteFrames&&Logic.spriteFrames[hasKey]) {
            this.spriteFrameNames[typeKey] = true;
            return;
        }
        cc.resources.load(`Texture/${typeKey}`, cc.SpriteAtlas, (err: Error, atlas: cc.SpriteAtlas) => {
            for (let frame of atlas.getSpriteFrames()) {
                Logic.spriteFrames[frame.name] = frame;
            }
            this.spriteFrameNames[typeKey] = true;
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
        if (this.timeDelay > 0.02
            && this.isEquipmentLoaded
            && this.isAllSpriteFramesLoaded()
            && this.isMonsterLoaded
            && this.isDebuffsLoaded
            && this.isProfessionLoaded
            && this.isBulletsLoaded
            && this.isItemsLoaded
            && this.isSkillsLoaded
            && this.isWorldLoaded
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
            this.isSkillsLoaded = false;
            Logic.mapManager.loadMap();
            cc.director.loadScene('game');
        }

    }
}
