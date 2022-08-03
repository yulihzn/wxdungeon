import { EventHelper } from './../logic/EventHelper'
import ProfessionData from '../data/ProfessionData'
import Logic from '../logic/Logic'
import LoadingIcon from '../ui/LoadingIcon'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class LoadingManager {
    public static readonly KEY_AUTO = 'auto'
    public static readonly KEY_TEXTURES = 'textures'
    public static readonly KEY_NPC = 'npc'
    public static readonly KEY_EQUIPMENT = 'equipment'
    public static readonly KEY_ITEM = 'item'
    public static readonly LOAD_CACHE = 0
    public static readonly LOAD_SUCCESS = 1
    public static readonly LOAD_FAIL = 2
    private static resourceLoadMap = new Map<string, Array<Function>>()
    private spriteFrameNames: { [key: number]: boolean } = null
    public isEquipmentLoaded = false
    public isMonsterLoaded = false
    public isNonplayerLoaded = false
    public isWorldLoaded = false
    public isBuffsLoaded = false
    public isSuitsLoaded = false
    public isBulletsLoaded = false
    public isProfessionLoaded = false
    public isItemsLoaded = false
    public isSkillsLoaded = false
    public isBuildingLoaded = false
    public isFurnituresLoaded = false
    public isPlatformLoaded = false
    public isTransportAnimFinished = true
    public isAudioLoaded = false
    // LIFE-CYCLE CALLBACKS:
    init() {
        this.setAllSpriteFramesUnload()
        if (!Logic.spriteFrames) {
            Logic.spriteFrames = {}
        }
        if (!Logic.buildings) {
            Logic.buildings = {}
        }
        this.isWorldLoaded = false
        this.isEquipmentLoaded = false
        this.isMonsterLoaded = false
        this.isBuffsLoaded = false
        this.isNonplayerLoaded = false
        this.isBuildingLoaded = false
        this.isFurnituresLoaded = false
        this.isAudioLoaded = false
        this.isPlatformLoaded = false
    }
    reset() {
        this.isWorldLoaded = false
        this.isEquipmentLoaded = false
        this.setAllSpriteFramesUnload()
        this.isBuffsLoaded = false
        this.isProfessionLoaded = false
        this.isBulletsLoaded = false
        this.isMonsterLoaded = false
        this.isNonplayerLoaded = false
        this.isItemsLoaded = false
        this.isSkillsLoaded = false
        this.isBuildingLoaded = false
        this.isTransportAnimFinished = false
        this.isSuitsLoaded = false
        this.isFurnituresLoaded = false
        this.isAudioLoaded = false
        this.isPlatformLoaded = false
    }

    isSpriteFramesLoaded(loadedName: string) {
        if (!this.spriteFrameNames[loadedName]) {
            return false
        }
        return true
    }
    isAllSpriteFramesLoaded() {
        for (let loadedName in this.spriteFrameNames) {
            if (!this.spriteFrameNames[loadedName]) {
                return false
            }
        }
        return true
    }
    setAllSpriteFramesUnload() {
        this.spriteFrameNames = {}
        this.spriteFrameNames[LoadingManager.KEY_AUTO] = false
        this.spriteFrameNames[LoadingManager.KEY_TEXTURES] = false
        this.spriteFrameNames[LoadingManager.KEY_NPC] = false
        this.spriteFrameNames[LoadingManager.KEY_EQUIPMENT] = false
        this.spriteFrameNames[LoadingManager.KEY_ITEM] = false
    }

    loadWorld() {
        Logic.worldLoader.isloaded = false
        Logic.worldLoader.loadWorld()
    }
    loadAudio() {
        if (Logic.audioClips && Logic.audioClips['silence']) {
            this.isAudioLoaded = true
            EventHelper.emit(EventHelper.LOADING_ICON, { type: LoadingIcon.TYPE_AUDIO })
            return
        }
        cc.resources.loadDir('Audio', cc.AudioClip, (err: Error, assert: cc.AudioClip[]) => {
            for (let clip of assert) {
                Logic.audioClips[clip.name] = clip
            }
            this.isAudioLoaded = true
            cc.log('加载音效完成')
            EventHelper.emit(EventHelper.LOADING_ICON, { type: LoadingIcon.TYPE_AUDIO })
        })
    }
    loadEquipment() {
        if (Logic.equipments) {
            this.isEquipmentLoaded = true
            return
        }
        cc.resources.load('Data/equipment', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err)
            } else {
                Logic.equipments = resource.json
                this.isEquipmentLoaded = true
                Logic.equipmentNameList = new Array()
                for (let key in resource.json) {
                    Logic.equipmentNameList.push(key)
                }
                cc.log(`加载装备(${Logic.equipmentNameList.length})完成`)
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
            this.isProfessionLoaded = true
            return
        }
        cc.resources.load('Data/profession', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err)
            } else {
                Logic.professionList = new Array()
                let arr: ProfessionData[] = resource.json
                for (let i = 0; i < arr.length; i++) {
                    let data = new ProfessionData()
                    data.valueCopy(arr[i])
                    data.id = i
                    Logic.professionList.push(data)
                }

                this.isProfessionLoaded = true
                cc.log(`加载职业(${Logic.professionList.length})完成`)
            }
        })
    }
    loadTalents() {
        if (Logic.talents) {
            this.isSkillsLoaded = true
            return
        }
        cc.resources.load('Data/talent', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err)
            } else {
                Logic.talents = resource.json
                this.isSkillsLoaded = true
                cc.log(`加载技能完成`)
            }
        })
    }
    loadStatus() {
        if (Logic.status) {
            this.isBuffsLoaded = true
            return
        }
        cc.resources.load('Data/status', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err)
            } else {
                Logic.status = resource.json
                this.isBuffsLoaded = true
                cc.log('加载状态完成')
            }
        })
    }
    loadSuits() {
        if (Logic.suits) {
            this.isSuitsLoaded = true
            return
        }
        cc.resources.load('Data/suits', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err)
            } else {
                Logic.suits = resource.json
                this.isSuitsLoaded = true
                cc.log('加载套装完成')
            }
        })
    }
    loadFurnitures() {
        if (Logic.furnitures) {
            this.isFurnituresLoaded = true
            return
        }
        cc.resources.load('Data/furnitures', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err)
            } else {
                Logic.furnitures = resource.json
                this.isFurnituresLoaded = true
                cc.log('加载家具完成')
            }
        })
    }
    loadPlatforms() {
        if (Logic.platforms) {
            this.isPlatformLoaded = true
            return
        }
        cc.resources.load('Data/platforms', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err)
            } else {
                Logic.platforms = resource.json
                this.isPlatformLoaded = true
                cc.log('加载平台完成')
            }
        })
    }
    loadBullets() {
        if (Logic.bullets) {
            this.isBulletsLoaded = true
            return
        }
        cc.resources.load('Data/bullet', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err)
            } else {
                Logic.bullets = resource.json
                this.isBulletsLoaded = true
                cc.log('加载子弹完成')
            }
        })
    }

    loadMonsters() {
        if (Logic.monsters) {
            this.isMonsterLoaded = true
            return
        }
        cc.resources.load('Data/monsters', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err)
            } else {
                Logic.monsters = resource.json
                this.isMonsterLoaded = true
                cc.log('加载怪物完成')
            }
        })
    }
    loadNonplayer() {
        if (Logic.nonplayers) {
            this.isNonplayerLoaded = true
            return
        }
        cc.resources.load('Data/nonplayers', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err)
            } else {
                Logic.nonplayers = resource.json
                this.isNonplayerLoaded = true
                cc.log('加载npc完成')
            }
        })
    }
    loadBuildings() {
        if (Logic.buildings && Logic.buildings['Door']) {
            this.isBuildingLoaded = true
            return
        }
        cc.resources.loadDir('Prefabs/buildings', cc.Prefab, (err: Error, assert: cc.Prefab[]) => {
            for (let prefab of assert) {
                Logic.buildings[prefab.name] = prefab
            }
            this.isBuildingLoaded = true
            cc.log('加载建筑完成')
        })
    }

    loadItems() {
        if (Logic.items) {
            this.isItemsLoaded = true
            return
        }
        cc.resources.load('Data/item', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err)
            } else {
                Logic.items = resource.json
                Logic.itemNameList = new Array()
                Logic.goodsNameList = new Array()
                Logic.trashNameList = new Array()
                Logic.dollNameList = new Array()
                for (let key in resource.json) {
                    if (Logic.items[key].canSave && key.indexOf('food') == -1 && key.indexOf('trash') == -1 && key.indexOf('doll') == -1 && key.indexOf('goods') == -1) {
                        Logic.itemNameList.push(key)
                    } else if (key.indexOf('goods') != -1) {
                        Logic.goodsNameList.push(key)
                    } else if (key.indexOf('trash') != -1) {
                        Logic.trashNameList.push(key)
                    } else if (key.indexOf('doll') != -1) {
                        Logic.dollNameList.push(key)
                    }
                }
                this.isItemsLoaded = true
                cc.log('加载物品完成')
            }
        })
    }

    loadAutoSpriteFrames() {
        if (Logic.spriteFrames && Logic.spriteFrameRes('auto')) {
            this.spriteFrameNames[LoadingManager.KEY_AUTO] = true
            EventHelper.emit(EventHelper.LOADING_ICON, { type: LoadingIcon.TYPE_TEXTURE_AUTO })
            return
        }
        cc.log('加载自动图集')
        cc.resources.loadDir('Texture/Auto', cc.SpriteFrame, (err: Error, assert: cc.SpriteFrame[]) => {
            for (let frame of assert) {
                Logic.spriteFrames[frame.name] = frame
            }
            this.spriteFrameNames[LoadingManager.KEY_AUTO] = true
            cc.log('加载自动图集完成')
            EventHelper.emit(EventHelper.LOADING_ICON, { type: LoadingIcon.TYPE_TEXTURE_AUTO })
        })
    }
    loadSpriteAtlas(typeKey: string, hasKey: string) {
        let type = 0
        switch (typeKey) {
            case LoadingManager.KEY_EQUIPMENT:
                type = LoadingIcon.TYPE_EQUIP
                break
            case LoadingManager.KEY_ITEM:
                type = LoadingIcon.TYPE_ITEM
                break
            case LoadingManager.KEY_NPC:
                type = LoadingIcon.TYPE_NPC
                break
            case LoadingManager.KEY_TEXTURES:
                type = LoadingIcon.TYPE_TEXTURE
                break
        }
        if (Logic.spriteFrames && Logic.spriteFrames[hasKey]) {
            this.spriteFrameNames[typeKey] = true
            EventHelper.emit(EventHelper.LOADING_ICON, { type: type })
            return
        }
        cc.log(`加载${typeKey}图集`)
        cc.resources.load(`Texture/${typeKey}`, cc.SpriteAtlas, (err: Error, atlas: cc.SpriteAtlas) => {
            for (let frame of atlas.getSpriteFrames()) {
                Logic.spriteFrames[frame.name] = frame
            }
            this.spriteFrameNames[typeKey] = true
            cc.log(`加载${typeKey}图集完成`)
            EventHelper.emit(EventHelper.LOADING_ICON, { type: type })
        })
    }
    static loadNpcSpriteAtlas(name: string, callback?: Function) {
        if (Logic.spriteFrames && Logic.spriteFrames[name + 'anim000']) {
            if (callback) {
                callback(0)
            }
            return
        }

        //判断是否有相同的资源正在加载，如果有等待加载完毕再执行
        if (LoadingManager.resourceLoadMap.has(name)) {
            LoadingManager.resourceLoadMap.get(name).push(callback)
        } else {
            LoadingManager.resourceLoadMap.set(name, new Array())
            cc.log(`加载${name}图集`)
            cc.resources.load(`Texture/npc/${name}`, cc.SpriteAtlas, (err: Error, atlas: cc.SpriteAtlas) => {
                if (atlas) {
                    for (let frame of atlas.getSpriteFrames()) {
                        Logic.spriteFrames[frame.name] = frame
                    }
                }
                cc.log(`加载${name}图集${atlas ? '完成' : '失败'}`)
                if (callback) {
                    callback(atlas ? 1 : 2)
                }
                if (LoadingManager.resourceLoadMap.has(name)) {
                    for (let call of LoadingManager.resourceLoadMap.get(name)) {
                        if (call) {
                            call(atlas ? 1 : 2)
                        }
                    }
                    LoadingManager.resourceLoadMap.delete(name)
                }
            })
        }
    }

    public static loadBuilding(name: string, callback?: Function) {
        if (Logic.buildings[name]) {
            if (callback) {
                callback(0)
            }
            return
        }
        //判断是否有相同的资源正在加载，如果有等待加载完毕再执行
        if (LoadingManager.resourceLoadMap.has(name)) {
            LoadingManager.resourceLoadMap.get(name).push(callback)
        } else {
            LoadingManager.resourceLoadMap.set(name, new Array())
            cc.log(`加载${name}预制`)
            cc.resources.load(`Prefabs/buildings/${name}`, cc.Prefab, (err: Error, prefab: cc.Prefab) => {
                if (prefab) {
                    Logic.buildings[name] = prefab
                }
                cc.log(`加载${name}预制${prefab ? '完成' : '失败'}`)
                if (callback) {
                    callback(prefab ? 1 : 2)
                }
                if (LoadingManager.resourceLoadMap.has(name)) {
                    for (let call of LoadingManager.resourceLoadMap.get(name)) {
                        if (call) {
                            call(prefab ? 1 : 2)
                        }
                    }
                    LoadingManager.resourceLoadMap.delete(name)
                }
            })
        }
    }
    public static allResourceDone() {
        return LoadingManager.resourceLoadMap.size < 1
    }
}
