import Player from './Player'
import Tile from './Tile'
import Logic from './Logic'
import { EventHelper } from './EventHelper'
import MonsterManager from '../manager/MonsterManager'
import EquipmentManager from '../manager/EquipmentManager'
import EquipmentData from '../data/EquipmentData'
import DungeonStyleManager from '../manager/DungeonStyleManager'
import ShopTable from '../building/ShopTable'
import AudioPlayer from '../utils/AudioPlayer'
import RoomType from '../rect/RoomType'
import IndexZ from '../utils/IndexZ'
import BuildingManager from '../manager/BuildingManager'
import LevelData from '../data/LevelData'
import NonPlayerManager from '../manager/NonPlayerManager'
import ItemManager from '../manager/ItemManager'
import Utils from '../utils/Utils'
import LightManager from '../manager/LightManager'
import DamageData from '../data/DamageData'
import GameWorldSystem from '../ecs/system/GameWorldSystem'
import Random from '../utils/Random'
import LoadingManager from '../manager/LoadingManager'
import StatusIconList from '../ui/StatusIconList'
import Actor from '../base/Actor'
import Dialogue from '../ui/Dialogue'
import Controller from './Controller'
import WeatherManager from '../manager/WeatherManager'
import EffectItemManager from '../manager/EffectItemManager'

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
export default class Dungeon extends cc.Component {
    @property(cc.Prefab)
    tile: cc.Prefab = null
    @property(cc.Prefab)
    playerPrefab: cc.Prefab = null
    @property(cc.Node)
    fog: cc.Node = null
    @property(StatusIconList)
    statusIconList: StatusIconList = null
    @property(cc.Camera)
    mainCamera: cc.Camera = null
    mapData: string[][] = [] //地图数据
    tilesmap: Tile[][] = new Array() //地面列表
    floorCombineMap: Map<string, Tile> = new Map()
    floorIndexMap: cc.Vec3[] = new Array() //地板下标列表
    waterIndexMap: cc.Vec3[] = new Array() //地板下标列表
    static WIDTH_SIZE: number = 7
    static HEIGHT_SIZE: number = 7
    static readonly MAPX: number = 64
    static readonly MAPY: number = 64
    static readonly TILE_SIZE: number = 128
    static readonly DEFAULT_ZOOM_MAX = 2
    static readonly DEFAULT_ZOOM_MIN = 0.6
    static readonly DEFAULT_ZOOM = 1
    private timeDelay = 0
    private checkTimeDelay = 0

    player: Player = null
    monsterManager: MonsterManager = null //怪物管理
    nonPlayerManager: NonPlayerManager = null //npc管理
    equipmentManager: EquipmentManager = null //装备管理
    dungeonStyleManager: DungeonStyleManager = null //装饰管理
    itemManager: ItemManager = null //金币和物品管理
    buildingManager: BuildingManager = null //建筑管理
    lightManager: LightManager = null //光线管理
    weatherManager: WeatherManager = null //天气管理器
    effectItemManager: EffectItemManager = null //特效物体管理器
    anim: cc.Animation
    CameraZoom = Dungeon.DEFAULT_ZOOM
    needZoomIn = false
    isInitFinish = false
    isClear = false
    isComplete = false
    currentPos = cc.v3(0, 0)
    isDisappeared = false
    cameraTargetActor: Actor = null

    rootSystem: GameWorldSystem = null

    /**
     * 初始化
     * 设置雾气层级和大小
     * 获取地图数组
     * 添加背景和周边
     * 添加玩家
     * 放置当前房间保存的物品和装备
     * 放置建筑
     * 放置地面装饰
     * 放置宝箱，读取当前房间保存的宝箱状态信息
     * 放置盒子，读取当前房间保存的盒子位置
     * 放置可破坏装饰建筑，读取当前房间保存的可破坏装饰的状态和位置
     * 放置商店，读取当前房间包的商店状态信息
     * 放置物品
     * 放置怪物
     * 放置boss
     * 保存宝箱盒子可破坏装饰商店信息
     * 加载小地图
     * 打开门
     */
    onLoad(): void {
        //初始化动画
        this.anim = this.getComponent(cc.Animation)
        //初始化监听
        EventHelper.on(EventHelper.PLAYER_MOVE, detail => {
            this.playerAction(detail.dir, detail.pos, detail.dt)
        })
        EventHelper.on(EventHelper.DUNGEON_SETEQUIPMENT, detail => {
            if (this.node) this.addEquipment(detail.res, detail.pos, detail.equipmentData)
        })
        EventHelper.on(EventHelper.DUNGEON_ADD_COIN, detail => {
            this.addCoin(detail.pos, detail.count, detail.isReal)
        })
        EventHelper.on(EventHelper.DUNGEON_ADD_OILGOLD, detail => {
            this.addOilGold(detail.pos, detail.count)
        })
        EventHelper.on(EventHelper.DUNGEON_ADD_ITEM, detail => {
            if (this.node) this.addItem(detail.pos, detail.res, detail.count)
        })
        EventHelper.on(EventHelper.DUNGEON_ADD_FALLSTONE, detail => {
            this.addFallStone(detail.pos, detail.isAuto)
        })
        EventHelper.on(EventHelper.DUNGEON_ADD_LIGHTENINGFALL, detail => {
            this.addLighteningFall(detail.pos, false, false, detail.showArea, detail.damage)
        })
        EventHelper.on(EventHelper.DUNGEON_SHAKEONCE, detail => {
            if (this.anim) {
                this.anim.play('DungeonShakeOnce')
            }
        })
        EventHelper.on(EventHelper.BOSS_ADDSLIME, detail => {
            this.addBossSlime(detail.slimeType, detail.posIndex)
        })
        EventHelper.on(EventHelper.TEST_SHOW_NODE_COUNT, detail => {
            this.logNodeCount()
        })
        EventHelper.on(EventHelper.DUNGEON_DISAPPEAR, detail => {
            if (this.node) {
                this.isDisappeared = true
                for (let b of this.buildingManager.buildingList) {
                    if (b && b.node) {
                        b.disappear()
                    }
                }
                for (let t of this.tilesmap) {
                    for (let tile of t) {
                        if (tile && tile.node) {
                            tile.disappear()
                        }
                    }
                }
                cc.tween(this.dungeonStyleManager.floor)
                    .to(0.5 + Random.rand(), { opacity: 0 })
                    .start()
            }
        })
        this.monsterManager = this.getComponent(MonsterManager)
        this.nonPlayerManager = this.getComponent(NonPlayerManager)
        this.equipmentManager = this.getComponent(EquipmentManager)
        this.itemManager = this.getComponent(ItemManager)
        this.dungeonStyleManager = this.getComponent(DungeonStyleManager)
        this.buildingManager = this.getComponent(BuildingManager)
        this.lightManager = this.getComponent(LightManager)
        this.weatherManager = this.getComponent(WeatherManager)
        this.effectItemManager = this.getComponent(EffectItemManager)
        this.reset()
    }
    reset() {
        Logic.lastBgmIndex = Logic.chapterIndex == Logic.CHAPTER099 ? 1 : 0
        AudioPlayer.stopAllEffect()
        AudioPlayer.play(AudioPlayer.PLAY_BG, true)
        this.monsterManager.clear()
        this.nonPlayerManager.clear()
        this.equipmentManager.clear()
        this.itemManager.clear()
        this.dungeonStyleManager.clear()
        this.buildingManager.clear()
        this.lightManager.clear()
        this.weatherManager.clear()
        //设置雾气层级
        this.fog.zIndex = IndexZ.FOG
        this.fog.scale = 0.6
        this.fog.opacity = 255
        this.lightManager.shadow.node.zIndex = IndexZ.SHADOW
        this.lightManager.shadow1.node.zIndex = IndexZ.SHADOW
        this.lightManager.shadowRay.node.zIndex = IndexZ.SHADOW + 10
        this.currentPos = cc.v3(Logic.mapManager.getCurrentRoom().x, Logic.mapManager.getCurrentRoom().y)
        let mapData: string[][] = Logic.mapManager.getCurrentMapStringArray()
        let floorData: string[][] = Logic.mapManager.getCurrentFloorMapStringArray()
        this.mapData = mapData
        let leveldata: LevelData = Logic.worldLoader.getCurrentLevelData()
        let exits = leveldata.getExitList()
        let equipitems = leveldata.getEquipItemList()
        Logic.changeDungeonSize()
        this.dungeonStyleManager.addDecorations()
        for (let arr of this.tilesmap) {
            Utils.clearComponentArray(arr)
        }
        let colliderdebug = this.node.getChildByName('colliderdebug')
        colliderdebug.zIndex = IndexZ.UI
        let p0 = this.node.convertToWorldSpaceAR(cc.v3(-5 * Dungeon.TILE_SIZE, -5 * Dungeon.TILE_SIZE))
        let p1 = this.node.convertToWorldSpaceAR(cc.v3((Dungeon.WIDTH_SIZE + 10) * Dungeon.TILE_SIZE, (Dungeon.WIDTH_SIZE + 10) * Dungeon.TILE_SIZE))
        let rect = cc.rect(p0.x, p0.y, p1.x - p0.x, p1.y - p0.y)
        this.rootSystem = new GameWorldSystem(rect, colliderdebug.getComponent(cc.Graphics))
        this.rootSystem.init()
        this.tilesmap = new Array()
        this.floorIndexMap = new Array()
        this.waterIndexMap = new Array()
        //放置之前留在地上的物品和装备
        this.addItemListOnGround()
        this.addEquipmentListOnGround()
        Logic.getBuildings(BuildingManager.AIREXIT, (prefab: cc.Prefab) => {
            Logic.getBuildings(BuildingManager.WALL, (prefab: cc.Prefab) => {
                Logic.getBuildings(BuildingManager.DOOR, (prefab: cc.Prefab) => {
                    this.buildingManager.addAirExit(mapData)
                    for (let i = 0; i < Dungeon.WIDTH_SIZE; i++) {
                        this.tilesmap[i] = new Array(i)
                        for (let j = 0; j < Dungeon.HEIGHT_SIZE; j++) {
                            //越往下层级越高，j是行，i是列
                            this.addTiles(floorData, cc.v3(i, j), cc.v3(i, j), leveldata, false)
                            //加载建筑
                            this.buildingManager.addBuildingsFromMap(this, mapData, mapData[i][j], cc.v3(i, j), leveldata, exits, equipitems)
                            //房间未清理时加载物品
                            if (!Logic.mapManager.isCurrentRoomStateClear() || Logic.mapManager.getCurrentRoomType().isEqual(RoomType.TEST_ROOM)) {
                                this.itemManager.addItemFromMap(mapData[i][j], cc.v3(i, j))
                            }
                            //房间未清理时加载怪物
                            if (
                                !Logic.mapManager.isCurrentRoomStateClear() ||
                                Logic.mapManager.getCurrentRoomType().isEqual(RoomType.TEST_ROOM) ||
                                Logic.mapManager.getCurrentRoomType().isEqual(RoomType.START_ROOM)
                            ) {
                                this.monsterManager.addMonstersAndBossFromMap(this, mapData[i][j], cc.v3(i, j))
                            }
                            //加载npc
                            this.nonPlayerManager.addNonPlayerFromMap(this, mapData[i][j], cc.v3(i, j), 0)
                        }
                    }
                    let offsets = [cc.v3(-1, -1, 4), cc.v3(-1, 0, 2), cc.v3(-1, 1, 6), cc.v3(0, -1, 0), cc.v3(0, 1, 1), cc.v3(1, -1, 5), cc.v3(1, 0, 3), cc.v3(1, 1, 7)]
                    for (let offset of offsets) {
                        this.addBuildingsFromSideMap(offset)
                    }
                    //加载随机怪物
                    if (
                        (!Logic.mapManager.isCurrentRoomStateClear() || Logic.mapManager.getCurrentRoom().isReborn) &&
                        RoomType.isMonsterGenerateRoom(Logic.mapManager.getCurrentRoomType()) &&
                        !Logic.isTour
                    ) {
                        this.monsterManager.addRandomMonsters(this, Logic.mapManager.getCurrentRoom().reborn)
                    }
                    //加载跟随npc
                    let list = new Array().concat(Logic.nonPlayerList)
                    this.scheduleOnce(() => {
                        this.nonPlayerManager.addNonPlayerListFromSave(this, list, this.player.node.position, this.player.entity.Transform.z)
                    }, 1)
                    //设置门开关
                    this.setDoors(true, true)
                    cc.log('load finished')
                    this.scheduleOnce(() => {
                        this.isInitFinish = true
                        cc.tween(this.fog).to(3, { scale: 5 }).start()
                        let blackcenter = this.fog.getChildByName('sprite').getChildByName('blackcenter')
                        cc.tween(blackcenter)
                            .delay(0.1)
                            .to(0.5, { opacity: 0 })
                            .call(() => {
                                if (Logic.totalTime < 5 && Logic.CHAPTER00 == Logic.chapterIndex) {
                                    Dialogue.play(Controller.isMouseMode() ? 'course000' : 'course001')
                                }
                            })
                            .start()
                        this.logNodeCount()
                        this.addOilGoldOnGround()
                    }, 0.3)
                })
            })
        })
        if ((leveldata.isOutside && !Logic.mapManager.getCurrentRoom().isOutside) || (!leveldata.isOutside && Logic.mapManager.getCurrentRoom().isOutside)) {
            this.weatherManager.addRain(cc.v3(Math.floor(Dungeon.WIDTH_SIZE / 2), Math.floor(Dungeon.WIDTH_SIZE / 2)), 0)
        }

        //初始化玩家
        this.player = cc.instantiate(this.playerPrefab).getComponent(Player)
        this.player.statusIconList = this.statusIconList
        this.player.node.parent = this.node
        this.cameraTargetActor = this.player
        this.fog.setPosition(this.player.node.position.clone())
    }
    /**
     *
     * @param floorData 地板数据
     * @param floorPos 装饰地板下标
     * @param indexPos 地图地板下标可为负数
     * @param leveldata
     * @param onlyShow
     */
    private addTiles(floorData: string[][], floorPos: cc.Vec3, indexPos: cc.Vec3, leveldata: LevelData, onlyShow: boolean) {
        let mapDataStr = floorData[floorPos.x][floorPos.y]
        let isWater = Utils.hasThe(mapDataStr, '~')
        if (Utils.hasThe(mapDataStr, '*') || Utils.hasThe(mapDataStr, '~')) {
            let index = parseInt(mapDataStr.substring(3))
            let resIndex = parseInt(mapDataStr.substring(1, 3))
            let isCombine = this.floorCombineMap.has(`i${floorPos.x}j${floorPos.y}`)
            if (!isCombine) {
                let t = cc.instantiate(this.tile)
                t.parent = this.node
                let pos = Dungeon.getPosInMap(indexPos.clone())
                t.position = cc.v3(pos.x - Dungeon.TILE_SIZE / 2, pos.y - Dungeon.TILE_SIZE / 2)
                t.zIndex = (resIndex > 0 ? IndexZ.FLOOR : IndexZ.BASE) + (Dungeon.HEIGHT_SIZE - indexPos.y) * 10
                let tile = t.getComponent(Tile)
                tile.isAutoShow = false
                tile.tileType = mapDataStr
                tile.isWater = isWater
                tile.resName = leveldata.getFloorRes(resIndex)
                if (!onlyShow) {
                    this.tilesmap[indexPos.x][indexPos.y] = tile
                }
                let combineCountX = 0
                let combineCountY = 0
                for (let i = floorPos.x + 1; i < floorData.length; i++) {
                    let next = floorData[i][floorPos.y]
                    if (mapDataStr == next) {
                        //下一个元素相同宽度++,并存储该坐标
                        this.floorCombineMap.set(`i${i}j${floorPos.y}`, tile)
                        combineCountX++
                    } else {
                        break
                    }
                }
                for (let j = floorPos.y + 1; j < floorData[floorPos.x].length; j++) {
                    let next = floorData[floorPos.x][j]
                    if (mapDataStr == next) {
                        //遍历x设置坐标
                        for (let i = 0; i < combineCountX + 2; i++) {
                            if (floorPos.x + i < floorData.length && mapDataStr == floorData[floorPos.x + i][j]) {
                                this.floorCombineMap.set(`i${floorPos.x + i}j${j}`, tile)
                            }
                        }
                        combineCountY++
                    } else {
                        break
                    }
                }
                tile.w = combineCountX + 1
                tile.h = combineCountY + 1
            } else {
                if (!onlyShow) {
                    this.tilesmap[indexPos.x][indexPos.y] = this.floorCombineMap.get(`i${floorPos.x}j${floorPos.y}`)
                }
            }
            if (!onlyShow) {
                if (isWater) {
                    this.waterIndexMap.push(indexPos.clone())
                } else {
                    this.floorIndexMap.push(indexPos.clone())
                }
            }
        }
    }
    private logNodeCount() {
        if (!this.node) {
            return
        }
        let names: { [key: string]: number } = {}
        let log = `childrenCount:${this.node.childrenCount} children:\n`
        for (let child of this.node.children) {
            if (names[child.name]) {
                names[child.name]++
            } else {
                names[child.name] = 1
            }
        }
        for (let key in names) {
            log += `${key}(${names[key]})\n`
        }
        console.log(log)
    }
    private addBuildingsFromSideMap(offset: cc.Vec3) {
        let mapData: string[][] = Logic.mapManager.getCurrentSideMapStringArray(offset)
        let floorData: string[][] = Logic.mapManager.getCurrentSideFloorMapStringArray(offset)
        let leveldata: LevelData = Logic.worldLoader.getCurrentLevelData()
        if (!mapData[0] || !floorData[0]) {
            return
        }
        this.floorCombineMap.clear()
        for (let i = 0; i < Dungeon.WIDTH_SIZE; i++) {
            for (let j = 0; j < Dungeon.HEIGHT_SIZE; j++) {
                let needAdd = false
                let length = 4
                switch (offset.z) {
                    case 0:
                        needAdd = j > Dungeon.HEIGHT_SIZE - length
                        break
                    case 1:
                        needAdd = j < length
                        break
                    case 2:
                        needAdd = i > Dungeon.WIDTH_SIZE - length
                        break
                    case 3:
                        needAdd = i < length
                        break
                    case 4:
                        needAdd = i > Dungeon.WIDTH_SIZE - length && j > Dungeon.HEIGHT_SIZE - length
                        break
                    case 5:
                        needAdd = i < length && j > Dungeon.HEIGHT_SIZE - length
                        break
                    case 6:
                        needAdd = i > Dungeon.WIDTH_SIZE - length && j < length
                        break
                    case 7:
                        needAdd = i < length && j < length
                        break
                }
                if (needAdd) {
                    let indexPos = cc.v3(i + Dungeon.WIDTH_SIZE * offset.x, j + Dungeon.HEIGHT_SIZE * offset.y)
                    this.addTiles(floorData, cc.v3(i, j), indexPos.clone(), leveldata, true)
                    this.buildingManager.addBuildingsFromSideMap(mapData[i][j], mapData, indexPos.clone(), leveldata)
                }
            }
        }
    }

    public darkAfterKill() {
        cc.tween(this.fog).to(1, { scale: 0.6 }).start()
        let blackcenter = this.fog.getChildByName('sprite').getChildByName('blackcenter')
        cc.tween(blackcenter).delay(0.2).to(1, { opacity: 255 }).start()
    }

    static isFirstEqual(mapStr: string, typeStr: string) {
        if (!mapStr) {
            return false
        }
        let isequal = mapStr[0] == typeStr
        return isequal
    }
    addItem(pos: cc.Vec3, resName: string, count?: number, shopTable?: ShopTable) {
        if (this.itemManager) {
            if (!pos) {
                pos = this.player.node.position.clone()
            }
            this.itemManager.addItem(pos, resName, count, shopTable)
        }
    }

    /**掉落石头 */
    public addFallStone(pos: cc.Vec3, isAuto: boolean, withFire?: boolean) {
        this.buildingManager.addFallStone(Dungeon.getIndexInMap(pos), isAuto, withFire)
    }
    /**落雷 */
    private addLighteningFall(pos: cc.Vec3, isTrigger: boolean, needPrepare: boolean, showArea: boolean, damagePoint?: number) {
        if (!this.buildingManager) {
            return
        }
        this.buildingManager.addLighteningFall(pos, isTrigger, needPrepare, showArea, damagePoint)
    }

    /**掉落金币 */
    private addCoin(pos: cc.Vec3, count: number, isReal: boolean) {
        if (this.itemManager) {
            this.itemManager.getValueCoin(count, pos, this.node, isReal)
        }
    }

    /**掉落油金 */
    private addOilGold(pos: cc.Vec3, count: number) {
        if (this.itemManager) {
            this.itemManager.getValueOilGold(count, pos, this.node)
        }
    }
    /**放置地上的装备 */
    private addEquipmentListOnGround() {
        let currequipments = Logic.mapManager.getCurrentMapEquipments()
        if (currequipments) {
            for (let tempequip of currequipments) {
                if (this.equipmentManager) {
                    this.equipmentManager.getEquipment(tempequip.img, Dungeon.getPosInMap(tempequip.pos), this.node, tempequip, null, null).data
                }
            }
        }
    }
    /**放置地上物品 */
    private addItemListOnGround() {
        let curritems = Logic.mapManager.getCurrentMapItems()
        Logic.mapManager.setCurrentItemsArr(new Array())
        if (curritems) {
            for (let tempeitem of curritems) {
                if (!tempeitem.isTaken) {
                    this.addItem(Dungeon.getPosInMap(tempeitem.pos), tempeitem.resName, tempeitem.count)
                }
            }
        }
    }
    /**回复掉落的翠金 */
    private addOilGoldOnGround() {
        this.scheduleOnce(() => {
            let data = Logic.groundOilGoldData.clone()
            if (
                data.chapter == Logic.chapterIndex &&
                data.level == Logic.level &&
                data.x == Logic.mapManager.rectDungeon.currentPos.x &&
                data.y == Logic.mapManager.rectDungeon.currentPos.y &&
                data.value > 0
            ) {
                EventHelper.emit(EventHelper.HUD_ADD_OILGOLD, { count: data.value })
                Logic.saveGroundOilGold(0)
                EventHelper.emit(EventHelper.HUD_OILGOLD_RECOVERY_SHOW)
            }
        }, 1)
    }
    /**添加装备 */
    addEquipment(equipType: string, pos: cc.Vec3, equipData?: EquipmentData, chestQuality?: number, shopTable?: ShopTable) {
        if (this.equipmentManager) {
            if (!pos) {
                pos = this.player.node.position.clone()
            }
            let data = this.equipmentManager.getEquipment(equipType, pos, this.node, equipData, chestQuality, shopTable).data
            if (shopTable) {
                return
            }
            let isOnlyTest = data.test > 0 && (Logic.chapterIndex == Logic.CHAPTER099 || (Logic.chapterIndex == Logic.CHAPTER00 && Logic.level == 0))
            if (!isOnlyTest) {
                let currequipments = Logic.mapManager.getCurrentMapEquipments()
                if (currequipments) {
                    currequipments.push(data)
                } else {
                    currequipments = new Array()
                    currequipments.push(data)
                    Logic.mapManager.setCurrentEquipmentsArr(currequipments)
                }
            }
        }
    }
    /**纸 */
    addFloorPaper(targetPos: cc.Vec3, pos: cc.Vec3, count: number) {
        for (let i = 0; i < count; i++) {
            if (this.effectItemManager) {
                this.effectItemManager.addPaper(targetPos, pos)
            }
        }
    }

    private addBossSlime(type: number, index: cc.Vec3) {
        if (this.monsterManager) {
            this.monsterManager.addBossSlime(type, index, this)
        }
    }

    public shakeForKraken() {
        this.CameraZoom = Dungeon.DEFAULT_ZOOM_MIN
        this.needZoomIn = true
        this.anim.playAdditive('DungeonShakeOnce')
        this.scheduleOnce(() => {
            this.anim.playAdditive('DungeonShakeOnce')
        }, 1)
        this.scheduleOnce(() => {
            this.anim.playAdditive('DungeonShakeOnce')
        }, 2)
    }

    //获取地图里下标的坐标
    static getPosInMap(pos: cc.Vec3) {
        let x = Dungeon.MAPX + pos.x * Dungeon.TILE_SIZE
        let y = Dungeon.MAPY + pos.y * Dungeon.TILE_SIZE
        return cc.v3(x, y)
    }
    //获取坐标在地图里的下标,canOuter:是否可以超出
    static getIndexInMap(pos: cc.Vec3, canOuter?: boolean) {
        let x = (pos.x - Dungeon.MAPX) / Dungeon.TILE_SIZE
        let y = (pos.y - Dungeon.MAPY) / Dungeon.TILE_SIZE
        x = Math.round(x)
        y = Math.round(y)
        if (!canOuter) {
            if (x < 0) {
                x = 0
            }
            if (x >= Dungeon.WIDTH_SIZE) {
                x = Dungeon.WIDTH_SIZE - 1
            }
            if (y < 0) {
                y = 0
            }
            if (y >= Dungeon.HEIGHT_SIZE) {
                y = Dungeon.HEIGHT_SIZE - 1
            }
        }
        return cc.v3(x, y)
    }
    //获取不超出地图的坐标
    static fixOuterMap(pos: cc.Vec3): cc.Vec3 {
        let x = (pos.x - Dungeon.MAPX) / Dungeon.TILE_SIZE
        let y = (pos.y - Dungeon.MAPY) / Dungeon.TILE_SIZE
        x = Math.round(x)
        y = Math.round(y)
        let isOuter = false
        if (x < 0) {
            x = 0
            isOuter = true
        }
        if (x >= Dungeon.WIDTH_SIZE) {
            x = Dungeon.WIDTH_SIZE - 1
            isOuter = true
        }
        if (y < 0) {
            y = 0
            isOuter = true
        }
        if (y >= Dungeon.HEIGHT_SIZE) {
            y = Dungeon.HEIGHT_SIZE - 1
            isOuter = true
        }
        if (isOuter) {
            return Dungeon.getPosInMap(cc.v3(x, y))
        } else {
            return pos
        }
    }

    start() {
        this.scheduleOnce(() => {
            EventHelper.emit(EventHelper.CHANGE_MINIMAP, { x: this.currentPos.x, y: this.currentPos.y })
            if (this.isInitFinish && !Logic.isGamePause && !this.isDisappeared && LoadingManager.allResourceDone()) {
                this.checkRoomClear()
            }
        }, 0.1)
    }
    breakTile(pos: cc.Vec3) {
        let tile = this.tilesmap[pos.x][pos.y]
        if (tile && !tile.isBroken) {
            tile.breakTile()
        }
    }

    /** 玩家在地牢移动 */
    playerAction(dir: number, pos: cc.Vec3, dt: number) {
        if (this.player) {
            this.player.playerAction(dir, pos, dt, this)
        }
    }
    getMonsterAliveNum(): number {
        let count = 0
        for (let monster of this.monsterManager.monsterList) {
            if (!monster || !monster.node || monster.sc.isDied || monster.data.isTest > 0) {
                count++
            }
        }
        return this.monsterManager.monsterList.length - count
    }
    /**检查房间是否清理 */
    private checkRoomClear() {
        //检查怪物是否清理
        let count = this.getMonsterAliveNum()
        this.isClear = count <= 0
        if (this.isClear && this.monsterManager.bossList.length > 0) {
            for (let boss of this.monsterManager.bossList) {
                if (boss.sc.isDied) {
                    count++
                }
            }
            this.isClear = count >= this.monsterManager.bossList.length
        }
        //检查是否怪物生成建筑生成完毕
        for (let monsterGenerator of this.buildingManager.monsterGeneratorList) {
            if (!monsterGenerator.addFinish) {
                if (this.isClear) {
                    monsterGenerator.open()
                }
                this.isClear = false
            }
        }
        //检查踏板是否触发过
        for (let footboard of this.buildingManager.footboards) {
            if (!footboard.isOpen && !footboard.hasActive) {
                this.isClear = false
            }
        }
        //检查是否是测试房间，测试房间默认不关门
        if (Logic.mapManager.getCurrentRoomType().isEqual(RoomType.TEST_ROOM)) {
            this.isClear = true
        }

        this.setDoors(this.isClear)
        if (this.isClear) {
            if (this.monsterManager.isRoomInitWithEnemy && Logic.mapManager.getCurrentRoomType().isNotEqual(RoomType.TEST_ROOM)) {
                EventHelper.emit(EventHelper.HUD_COMPLETE_SHOW, { map: this.buildingManager.getReachDir() })
                if (!this.isComplete && this.player && this.player.data && this.player.data.StatusTotalData.clearHealth > 0) {
                    this.isComplete = true
                    this.player.takeDamage(new DamageData(-this.player.data.StatusTotalData.clearHealth))
                }
            }
            if (this.buildingManager.savePointS) {
                this.buildingManager.savePointS.open()
            }
            Logic.mapManager.setRoomClear(this.currentPos.x, this.currentPos.y)
        }
    }
    private setDoors(isClear: boolean, immediately?: boolean) {
        if (!this.buildingManager) {
            return
        }
        this.buildingManager.setDoors(isClear, immediately)
    }
    checkPlayerPos(dt: number) {
        if (!this.tilesmap || !this.player || !this.node) {
            return
        }
        let p = this.player.node.position.clone()
        if (this.player.entity) {
            p.y += this.player.entity.Transform.z
        }
        this.fog.setPosition(this.lerp(this.fog.position, p, dt * 3))
        let pos = Dungeon.getIndexInMap(this.player.node.position)
        EventHelper.emit(EventHelper.CHANGE_MINIMAP, { x: pos.x, y: pos.y })
        if (!this.tilesmap[pos.x] || !this.tilesmap[pos.x][pos.y]) {
            return
        }
        let tile = this.tilesmap[pos.x][pos.y]
        if (tile && tile.isBroken) {
            this.player.fall()
        }
        if (tile && tile.isAutoShow) {
            this.breakTile(pos)
        }
        this.player.isInWaterTile = this.isActorPosInWater(this.player)
    }
    isActorPosInWater(actor: Actor) {
        if (this.waterIndexMap.length < 1) {
            return
        }
        if (!this.tilesmap) {
            return false
        }
        let pos = Dungeon.getIndexInMap(actor.node.position)
        if (!this.tilesmap[pos.x] || !this.tilesmap[pos.x][pos.y]) {
            return false
        }
        let tile = this.tilesmap[pos.x][pos.y]
        let pp = actor.node.position
        let w = actor.node.width
        let h = actor.node.width
        return tile.isWater && tile.containsRect(cc.rect(pp.x - w / 2, pp.y - h / 2, w, h))
    }
    lerp(self: cc.Vec3, to: cc.Vec3, ratio: number): cc.Vec3 {
        let out = cc.v3(0, 0)
        let x = self.x
        let y = self.y
        out.x = x + (to.x - x) * ratio
        out.y = y + (to.y - y) * ratio
        return out
    }
    checkMonstersPos() {
        for (let monster of this.monsterManager.monsterList) {
            if (monster && monster.node && monster.node.active && monster.sc.isDied) {
                return
            }
        }
    }
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0
            return true
        }
        return false
    }
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 1) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    update(dt) {
        if (this.isInitFinish && !Logic.isGamePause && !this.isDisappeared && LoadingManager.allResourceDone()) {
            if (this.isTimeDelay(dt)) {
                this.checkPlayerPos(dt)
                this.monsterManager.updateLogic(dt)
                this.nonPlayerManager.updateLogic(dt)
                this.buildingManager.updateLogic(dt, this.player)
                this.equipmentManager.updateLogic(dt, this.player)
                this.itemManager.updateLogic(dt, this.player)
            }
            if (this.isCheckTimeDelay(dt)) {
                this.checkRoomClear()
            }
        }
    }
    protected lateUpdate(dt: number): void {
        if (this.isInitFinish && !Logic.isGamePause && !this.isDisappeared && LoadingManager.allResourceDone()) {
            this.rootSystem.execute(dt)
        }
    }
}
