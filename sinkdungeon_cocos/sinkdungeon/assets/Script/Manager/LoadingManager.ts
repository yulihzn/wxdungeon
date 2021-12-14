import ProfessionData from "../data/ProfessionData";
import Logic from "../logic/Logic";

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
export default class LoadingManager{

    public static readonly KEY_AUTO = 'auto';
    public static readonly KEY_TEXTURES = 'textures';
    public static readonly KEY_NPC = 'npc';
    public static readonly KEY_EQUIPMENT ='equipment';
    public static readonly KEY_ITEM ='item';
    private static resourceLoadMap = new Map<string,Array<Function>>();
    private spriteFrameNames: { [key: number]: boolean } = null;
    public isEquipmentLoaded = false;
    public isMonsterLoaded = false;
    public isNonplayerLoaded = false;
    public isWorldLoaded = false;
    public isBuffsLoaded = false;
    public isSuitsLoaded = false;
    public isBulletsLoaded = false;
    public isProfessionLoaded = false;
    public isItemsLoaded = false;
    public isSkillsLoaded = false;
    public isBuildingLoaded = false;
    public isFurnituresLoaded = false;
    public isTransportAnimFinished = true;
    // LIFE-CYCLE CALLBACKS:
    init() {
        this.setAllSpriteFramesUnload();
        if (!Logic.spriteFrames) {
            Logic.spriteFrames = {};
        }
        if (!Logic.buildings) {
            Logic.buildings = {};
        }
        this.isWorldLoaded = false;
        this.isEquipmentLoaded = false;
        this.isMonsterLoaded = false;
        this.isBuffsLoaded = false;
        this.isNonplayerLoaded = false;
        this.isBuildingLoaded = false;
        this.isFurnituresLoaded = false;
    }
    reset() {
        this.isWorldLoaded = false;
        this.isEquipmentLoaded = false;
        this.setAllSpriteFramesUnload();
        this.isBuffsLoaded = false;
        this.isProfessionLoaded = false;
        this.isBulletsLoaded = false;
        this.isMonsterLoaded = false;
        this.isNonplayerLoaded = false;
        this.isItemsLoaded = false;
        this.isSkillsLoaded = false;
        this.isBuildingLoaded = false;
        this.isTransportAnimFinished = false;
        this.isSuitsLoaded = false;
        this.isFurnituresLoaded = false;
    }
    isSpriteFramesLoaded(loadedName: string) {
        if (!this.spriteFrameNames[loadedName]) {
            return false;
        }
        return true;
    }
    isAllSpriteFramesLoaded() {
        for (let loadedName in this.spriteFrameNames) {
            if (!this.spriteFrameNames[loadedName]) {
                return false;
            }
        }
        return true;
    }
    setAllSpriteFramesUnload() {
        this.spriteFrameNames = {};
        this.spriteFrameNames[LoadingManager.KEY_AUTO] = false;
        this.spriteFrameNames[LoadingManager.KEY_TEXTURES] = false;
        this.spriteFrameNames[LoadingManager.KEY_NPC] = false;
        this.spriteFrameNames[LoadingManager.KEY_EQUIPMENT] = false;
        this.spriteFrameNames[LoadingManager.KEY_ITEM] = false;
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
        cc.resources.load('Data/equipment', (err: Error, resource: cc.JsonAsset) => {
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
        if (Logic.professionList && Logic.professionList.length > 0) {
            this.isProfessionLoaded = true;
            return;
        }
        cc.resources.load('Data/profession', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.professionList = new Array();
                let arr: ProfessionData[] = resource.json;
                for (let i = 0; i < arr.length; i++) {
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
        cc.resources.load('Data/talent', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.talents = resource.json;
                this.isSkillsLoaded = true;
                cc.log('talent loaded');
            }
        })
    }
    loadStatus() {
        if (Logic.status) {
            this.isBuffsLoaded = true;
            return;
        }
        cc.resources.load('Data/status', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.status = resource.json;
                this.isBuffsLoaded = true;
                cc.log('debuffs loaded');
            }
        })
    }
    loadSuits() {
        if (Logic.suits) {
            this.isSuitsLoaded = true;
            return;
        }
        cc.resources.load('Data/suits', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.suits = resource.json;
                this.isSuitsLoaded = true;
                cc.log('suits loaded');
            }
        })
    }
    loadFurnitures() {
        if (Logic.furnitures) {
            this.isFurnituresLoaded = true;
            return;
        }
        cc.resources.load('Data/furnitures', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.furnitures = resource.json;
                this.isFurnituresLoaded = true;
                cc.log('furnitures loaded');
            }
        })
    }
    loadBullets() {
        if (Logic.bullets) {
            this.isBulletsLoaded = true;
            return;
        }
        cc.resources.load('Data/bullet', (err: Error, resource: cc.JsonAsset) => {
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
        cc.resources.load('Data/monsters', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.monsters = resource.json;
                this.isMonsterLoaded = true;
                cc.log('monsters loaded');
            }
        })
    }
    loadNonplayer() {
        if (Logic.nonplayers) {
            this.isNonplayerLoaded = true;
            return;
        }
        cc.resources.load('Data/nonplayers', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.nonplayers = resource.json;
                this.isNonplayerLoaded = true;
                cc.log('nonplayers loaded');
            }
        })
    }
    loadBuildings() {
        if (Logic.buildings && Logic.buildings['Door']) {
            this.isBuildingLoaded = true;
            return;
        }
        cc.resources.loadDir('Prefabs/buildings', cc.Prefab, (err: Error, assert: cc.Prefab[]) => {
            for (let prefab of assert) {
                Logic.buildings[prefab.name] = prefab;
            }
            this.isBuildingLoaded = true;
            cc.log('buildings loaded');
        })
    }
    
    loadItems() {
        if (Logic.items) {
            this.isItemsLoaded = true;
            return;
        }
        cc.resources.load('Data/item', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.items = resource.json;
                Logic.itemNameList = new Array();
                Logic.goodsNameList = new Array();
                Logic.trashNameList = new Array();
                for (let key in resource.json) {
                    if (Logic.items[key].canSave 
                        && key.indexOf('food') == -1 
                        && key.indexOf('trash') == -1 
                        && key.indexOf('goods') == -1) {
                        Logic.itemNameList.push(key);
                    } else if (key.indexOf('goods') != -1) {
                        Logic.goodsNameList.push(key);
                    } else if (key.indexOf('trash') != -1) {
                        Logic.trashNameList.push(key);
                    }
                }
                this.isItemsLoaded = true;
                cc.log('items loaded');
            }
        })
    }
    
    loadAutoSpriteFrames() {
        if (Logic.spriteFrames && Logic.spriteFrameRes('auto')) {
            this.spriteFrameNames[LoadingManager.KEY_AUTO] = true;
            return;
        }
        cc.resources.loadDir('Texture/Auto', cc.SpriteFrame, (err: Error, assert: cc.SpriteFrame[]) => {
            for (let frame of assert) {
                Logic.spriteFrames[frame.name] = frame;
            }
            this.spriteFrameNames[LoadingManager.KEY_AUTO] = true;
            cc.log('auto texture loaded');
        })
    }
    loadSpriteAtlas(typeKey: string, hasKey: string) {
        if (Logic.spriteFrames && Logic.spriteFrames[hasKey]) {
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
    static loadNpcSpriteAtlas(name: string,callback?:Function) {
        if (Logic.spriteFrames && Logic.spriteFrames[name+'anim000']) {
            if(callback){
                callback();
            }
            return;
        }
        
        //判断是否有相同的资源正在加载，如果有等待加载完毕再执行
        if(LoadingManager.resourceLoadMap.has(name)){
            LoadingManager.resourceLoadMap.get(name).push(callback);
        }else{
            LoadingManager.resourceLoadMap.set(name,new Array());
            cc.resources.load(`Texture/npc/${name}`, cc.SpriteAtlas, (err: Error, atlas: cc.SpriteAtlas) => {
                for (let frame of atlas.getSpriteFrames()) {
                    Logic.spriteFrames[frame.name] = frame;
                }
                cc.log(`${name} loaded`);
                if(callback){
                    callback();
                }
                if(LoadingManager.resourceLoadMap.has(name)){
                    for(let call of LoadingManager.resourceLoadMap.get(name)){
                        if(call){
                            call();
                        }
                    }
                    LoadingManager.resourceLoadMap.delete(name);
                }
            })
           
        }
    }
   
    public static loadBuilding(name:string,callback?:Function){
        if(Logic.buildings[name]){
            if(callback){
                callback();
            }
            return;
        }
        //判断是否有相同的资源正在加载，如果有等待加载完毕再执行
        if(LoadingManager.resourceLoadMap.has(name)){
            LoadingManager.resourceLoadMap.get(name).push(callback);
        }else{
            LoadingManager.resourceLoadMap.set(name,new Array());
            cc.resources.load(`Prefabs/buildings/${name}`, cc.Prefab, (err: Error, prefab: cc.Prefab) => {
                Logic.buildings[name]=prefab;
                cc.log(`${name} loaded`);
                if(callback){
                    callback();
                }
                if(LoadingManager.resourceLoadMap.has(name)){
                    for(let call of LoadingManager.resourceLoadMap.get(name)){
                        if(call){
                            call();
                        }
                    }
                    LoadingManager.resourceLoadMap.delete(name);
                }
            })
        }
    }
    public static allResourceDone(){
        return LoadingManager.resourceLoadMap.size<1;
    }
}
