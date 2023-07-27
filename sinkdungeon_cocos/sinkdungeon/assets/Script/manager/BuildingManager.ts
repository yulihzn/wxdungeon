import Dungeon from '../logic/Dungeon'
import Logic from '../logic/Logic'
import FootBoard from '../building/FootBoard'
import IndexZ from '../utils/IndexZ'
import Saw from '../building/Saw'
import Emplacement from '../building/Emplacement'
import DecorationFloor from '../building/DecorationFloor'
import Chest from '../building/Chest'
import Box from '../building/Box'
import ShopTable from '../building/ShopTable'
import FallStone from '../building/FallStone'
import MagicLightening from '../building/MagicLightening'
import ExitDoor from '../building/ExitDoor'
import Door from '../building/Door'
import Wall from '../building/Wall'
import AirExit from '../building/AirExit'
import LevelData from '../data/LevelData'
import Portal from '../building/Portal'
import RoomBed from '../building/RoomBed'
import Building from '../building/Building'
import ExitData from '../data/ExitData'
import BaseManager from './BaseManager'
import DryadGrass from '../boss/DryadGrass'
import Utils from '../utils/Utils'
import ShadowOfSight from '../effect/ShadowOfSight'
import LightManager from './LightManager'
import SavePoint from '../building/SavePoint'
import MartShelves from '../building/MartShelves'
import NonPlayerManager from './NonPlayerManager'
import MonsterManager from './MonsterManager'
import MonsterGenerator from '../building/MonsterGenerator'
import MgWentLine from '../building/MgWentLine'
import RoomStool from '../building/RoomStool'
import MgCrack from '../building/MgCrack'
import InteractBuilding from '../building/InteractBuilding'
import Player from '../logic/Player'
import EnergyShield from '../building/EnergyShield'
import EquipmentManager from './EquipmentManager'
import Furniture from '../building/Furniture'
import RoomFishtank from '../building/RoomFishtank'
import CCollider from '../collider/CCollider'
import WallPaint from '../building/WallPaint'
import RoomKitchen from '../building/RoomKitchen'
import AudioPlayer from '../utils/AudioPlayer'
import NonPlayerData from '../data/NonPlayerData'
import BuildingData from '../data/BuildingData'
import EquipItemMapData from '../data/EquipItemMapData'
import InventoryManager from './InventoryManager'
import NormalBuilding from '../building/NormalBuilding'
import Stairs from '../building/Stairs'
import DecorationWall from '../building/DecorationWall'
import Ladder from '../building/Ladder'
import MapManager from './MapManager'
import Vehicle from '../building/Vehicle'

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
export default class BuildingManager extends BaseManager {
    static readonly AIREXIT = 'AirExit'
    static readonly AIRTRANSPORT = 'AirTransport'
    static readonly AIRTRANSPORTMODEL = 'AirTransportModel'
    static readonly BED = 'Bed'
    static readonly BOX = 'Box'
    static readonly CAMPFIRE = 'CampFire'
    static readonly CHEST = 'Chest'
    static readonly COAST = 'Coast'
    static readonly DARKNESS = 'Darkness'
    static readonly INTERACTBUILDING = 'InteractBuilding'
    static readonly DECORATIONFLOOR = 'DecorationFloor'
    static readonly DECORATIONOVERHEAD = 'DecorationOverHead'
    static readonly DECORATIONWALL = 'DecorationWall'
    static readonly DOOR = 'Door'
    static readonly DRYADTWINE = 'DryadTwine'
    static readonly EMPLACEMENT = 'Emplacement'
    static readonly EXITDOOR = 'ExitDoor'
    static readonly FALLSTONE = 'FallStone'
    static readonly FOOTBOARD = 'FootBoard'
    static readonly HITBUILDING = 'HitBuilding'
    static readonly ICEDEMONTHRON = 'IceDemonThron'
    static readonly LIGHTENINGFALL = 'LighteningFall'
    static readonly LADDER = 'Ladder'
    static readonly MARTCASHIER = 'MartCashier'
    static readonly MARTFRIDGE = 'MartFridge'
    static readonly MARTSHELVES = 'MartShelves'
    static readonly MARTTABLE = 'MartTable'
    static readonly MIST = 'Mist'
    static readonly PORTAL = 'Portal'
    static readonly ROOMBED = 'RoomBed'
    static readonly ROOMTV = 'RoomTv'
    static readonly ROOMSTOOL = 'RoomStool'
    static readonly ROOMSOFA = 'RoomSofa'
    static readonly ROOMFISHTANK = 'RoomFishtank'
    static readonly ROOMWATERDISPENSER = 'RoomWaterDispenser'
    static readonly ROOMCLOCK = 'RoomClock'
    static readonly ROOMTRASHCAN = 'RoomTrashCan'
    static readonly ROOMKITCHEN = 'RoomKitchen'
    static readonly SAVEPOINT = 'SavePoint'
    static readonly SAW = 'Saw'
    static readonly SHIPSTAIRS = 'Shipstairs'
    static readonly SHOP = 'Shop'
    static readonly SHOPMART = 'ShopMart'
    static readonly SHOPTABLE = 'ShopTable'
    static readonly TAROTTABLE = 'TarotTable'
    static readonly TRAP = 'Trap'
    static readonly WALL = 'Wall'
    static readonly WATER = 'Water'
    static readonly LAMPLIGHT = 'LampLight'
    static readonly LAMPLIGHTOUTSIDE = 'LampLightOutside'
    static readonly LAMPOVALLIGHT = 'LampOvalLight'
    static readonly LAMPOVALLIGHTOUTSIDE = 'LampOvalLightOutside'
    static readonly LAMPSUN = 'LampSun'
    static readonly LAMPSHIP = 'LampShip'
    static readonly LAMPSEARCH = 'LampSearch'
    static readonly LAMPFIREPAN = 'LampFirePan'
    static readonly LAMPTORCH = 'LampTorch'
    static readonly LAMPROAD = 'LampRoad'
    static readonly LAMPFIREFLY = 'LampFireFly'
    static readonly LAMPEXIT = 'LampExit'
    static readonly LAMPDIRECT = 'LampDirectLight'
    static readonly MUSHROOM01 = 'MushRoom01'
    static readonly MUSHROOM02 = 'MushRoom02'
    static readonly MUSHROOM03 = 'MushRoom03'
    static readonly MUSHROOM04 = 'MushRoom04'
    static readonly GRASS01 = 'Grass01'
    static readonly GRASS02 = 'Grass02'
    static readonly GRASS03 = 'Grass03'
    static readonly GRASS04 = 'Grass04'
    static readonly WENTLINE = 'WentLine'
    static readonly CRACK = 'Crack'
    static readonly WATERFALL = 'WaterFall'
    static readonly ENERGYSHIELD = 'EnergyShield'
    static readonly FURNITURE = 'Furniture'
    static readonly WALLPAINT = 'WallPaint'
    static readonly NORMAL_BUILDING = 'NormalBuilding'
    static readonly STAIRS0 = 'Stairs0'
    static readonly STAIRS1 = 'Stairs1'
    static readonly STAIRS2 = 'Stairs2'
    static readonly STAIRS3 = 'Stairs3'
    static readonly STAIRS4 = 'Stairs4'
    static readonly VEHICLE = 'Vehicle'

    // LIFE-CYCLE CALLBACKS:
    footboards: FootBoard[] = new Array()
    exitdoors: ExitDoor[] = new Array()
    portals: Portal[] = new Array()
    doors: Door[] = new Array()
    airExits: AirExit[] = new Array()
    monsterGeneratorList: MonsterGenerator[] = new Array()
    colliderCombineMap: Map<string, Wall> = new Map()
    emptyMap: Map<string, cc.Vec3> = new Map()
    savePointS: SavePoint
    coastColliderList = [
        '128,128,0,0',
        '128,128,0,0',
        '128,128,0,0',
        '128,128,0,0',
        '128,64,0,-32',
        '128,64,0,32',
        '64,128,32,0',
        '64,128,-32,0',
        '64,64,-32,32',
        '64,64,32,32',
        '64,64,-32,-32',
        '64,64,32,-32'
    ]

    private shelvesFoodIndex = 0
    private shelvesDrinkIndex = 0
    private drinkList: string[] = []
    private foodList: string[] = []
    private interactBuildings: InteractBuilding[] = []
    public lastInteractBuilding: InteractBuilding
    public buildingList: Building[] = []

    clear(): void {
        Utils.clearComponentArray(this.footboards)
        Utils.clearComponentArray(this.exitdoors)
        Utils.clearComponentArray(this.portals)
        Utils.clearComponentArray(this.doors)
        Utils.clearComponentArray(this.airExits)
        Utils.clearComponentArray(this.interactBuildings)
        this.footboards = new Array()
        this.exitdoors = new Array()
        this.portals = new Array()
        this.doors = new Array()
        this.airExits = new Array()
        this.drinkList = new Array()
        this.foodList = new Array()
        this.interactBuildings = new Array()
        this.buildingList = new Array()
        this.monsterGeneratorList = new Array()
        this.shelvesFoodIndex = 0
        this.shelvesDrinkIndex = 0
        this.colliderCombineMap.clear()
        this.emptyMap.clear()
        this.lastInteractBuilding = null
    }

    private hasThe(mapStr: string, typeStr: string): boolean {
        if (!mapStr) {
            return false
        }
        let isequal = mapStr.indexOf(typeStr) != -1
        return isequal
    }
    private isFirstEqual(mapStr: string, typeStr: string) {
        if (!mapStr) {
            return false
        }
        let isequal = mapStr[0] == typeStr
        return isequal
    }
    private setAudioMaterial(b: Building, audioMaterial: number) {
        if (audioMaterial && b.ccolliders) {
            for (let c of b.ccolliders) {
                c.audioMaterial = audioMaterial
            }
        }
    }
    private addBuilding(prefab: cc.Prefab, indexPos: cc.Vec3, audioMaterial?: number, id?: string, moveable?: boolean): cc.Node {
        let building = cc.instantiate(prefab)
        building.parent = this.node
        building.position = Dungeon.getPosInMap(indexPos)
        building.zIndex = IndexZ.getActorZIndex(building.position)
        let b = building.getComponent(Building)
        if (b) {
            b.initCollider()
            this.setAudioMaterial(b, audioMaterial)
            b.entity.NodeRender.node = building
            b.entity.Transform.position = Dungeon.getPosInMap(indexPos)
            b.entity.Move.isStatic = !moveable
            b.seed = Logic.mapManager.getSeedFromRoom(MapManager.RANDOM_BUILDING)
            if (id && id.length > 0) {
                b.data.valueCopy(Logic.normalBuildings[id])
            } else {
                b.data.custom = true
            }
            b.data.defaultPos = indexPos.clone()
            b.lights = b.getComponentsInChildren(ShadowOfSight)
            if (b.lights) {
                LightManager.registerLight(b.lights, b.node)
            }
        }
        this.buildingList.push(b)
        return building
    }
    public addBuildingsFromMap(
        dungeon: Dungeon,
        mapData: string[][],
        mapDataStr: string,
        indexPos: cc.Vec3,
        levelData: LevelData,
        exits: ExitData[],
        equipitems: EquipItemMapData[]
    ) {
        if (!mapDataStr || mapDataStr.length < 1 || mapDataStr == 'undefined') {
            this.emptyMap.set(`x=${indexPos.x}y=${indexPos.y}`, indexPos)
        } else if (mapDataStr == '==') {
        } else if (this.isFirstEqual(mapDataStr, '*')) {
        } else if (this.isFirstEqual(mapDataStr, '#')) {
            //生成墙
            this.addDirWalls(mapDataStr, mapData, indexPos, levelData, false)
        } else if (this.isFirstEqual(mapDataStr, '-')) {
            Logic.getBuildings(BuildingManager.DARKNESS, (prefab: cc.Prefab) => {
                let dn = this.addBuilding(prefab, indexPos)
                dn.zIndex = IndexZ.DARKNESS
                if (mapDataStr == '-0') {
                    dn.zIndex = IndexZ.ROOF
                }
            })
        } else if (this.isFirstEqual(mapDataStr, '~')) {
            this.addWaterBuilding(mapDataStr, indexPos)
        } else if (this.isFirstEqual(mapDataStr, '+')) {
            //生成装饰
            this.addDecorate(dungeon, mapDataStr, indexPos)
        } else if (mapDataStr == '@@') {
            Logic.getBuildings(BuildingManager.FOOTBOARD, (prefab: cc.Prefab) => {
                //生成踏板
                let foot = this.addBuilding(prefab, indexPos)
                foot.zIndex = IndexZ.FLOOR
                this.footboards.push(foot.getComponent(FootBoard))
            })
        } else if (mapDataStr == '@S') {
            Logic.getBuildings(BuildingManager.SAVEPOINT, (prefab: cc.Prefab) => {
                //生成存档点
                let save = this.addBuilding(prefab, indexPos)
                this.savePointS = save.getComponent(SavePoint)
            })
        } else if (mapDataStr == '@a') {
            this.addEquipItemBuildings(dungeon, mapDataStr, indexPos, equipitems)
        } else if (mapDataStr == '@b') {
            this.addEquipItemBuildings(dungeon, mapDataStr, indexPos, equipitems)
        } else if (this.isFirstEqual(mapDataStr, 'B')) {
            //生成木盒子 并且根据之前记录的位置放置
            this.addBox(mapDataStr, indexPos)
        } else if (this.isFirstEqual(mapDataStr, 'C')) {
            //生成宝箱 房间清理的情况下箱子是打开的
            this.addChest(indexPos, mapDataStr)
        } else if (this.isFirstEqual(mapDataStr, 'D')) {
            //生成门
            this.addDoor(mapDataStr, indexPos, false)
        } else if (this.isFirstEqual(mapDataStr, 'E')) {
            //生成出口
            this.addExitDoor(mapDataStr, indexPos, exits)
        } else if (mapDataStr == 'F0') {
            //生成营火
            Logic.getBuildings(BuildingManager.CAMPFIRE, (prefab: cc.Prefab) => {
                let camp = this.addBuilding(prefab, indexPos)
                this.setAudioMaterial(camp.getComponent(Building), CCollider.AUDIO_MATERIAL.WOOD)
                let fallentree = camp.getChildByName('sprite').getChildByName('fallentree')
                fallentree.position = Dungeon.getPosInMap(indexPos)
                fallentree.position = cc.v3(fallentree.position.x, fallentree.position.y + 40)
                fallentree.parent = this.node
                fallentree.zIndex = IndexZ.getActorZIndex(fallentree.position)
                fallentree.setScale(6, 4)
            })
        } else if (mapDataStr == 'F1') {
            Logic.getBuildings(BuildingManager.AIRTRANSPORTMODEL, (prefab: cc.Prefab) => {
                this.addBuilding(prefab, indexPos)
            })
        } else if (this.isFirstEqual(mapDataStr, 'G')) {
            //生成炮台
            Logic.getBuildings(BuildingManager.EMPLACEMENT, (prefab: cc.Prefab) => {
                let em = this.addBuilding(prefab, indexPos).getComponent(Emplacement)
                em.setDirType(mapDataStr)
                em.dungeon = dungeon
            })
        } else if (this.isFirstEqual(mapDataStr, 'H')) {
            //生成可打击建筑
            this.addNormalBuilding(dungeon, mapDataStr, NormalBuilding.PREFIX_HITBUILDING, indexPos)
        } else if (mapDataStr == 'I0') {
            //生成通风管
            Logic.getBuildings(BuildingManager.WENTLINE, (prefab: cc.Prefab) => {
                let p = this.addBuilding(prefab, indexPos).getComponent(MgWentLine)
                p.init(dungeon, 1, 6, [MonsterManager.MONSTER_ZOOMBIE, MonsterManager.MONSTER_BITE_ZOMBIE])
                this.monsterGeneratorList.push(p)
            })
        } else if (mapDataStr == 'I6') {
            //生成墙缝
            Logic.getBuildings(BuildingManager.CRACK, (prefab: cc.Prefab) => {
                let p = this.addBuilding(prefab, indexPos).getComponent(MgCrack)
                p.init(dungeon, 0.5, 15, [MonsterManager.MONSTER_SCARAB])
                this.monsterGeneratorList.push(p)
            })
        } else if (this.isFirstEqual(mapDataStr, 'J')) {
            this.addNormalBuilding(dungeon, mapDataStr, NormalBuilding.PREFIX_PLATFORM, indexPos)
        } else if (this.isFirstEqual(mapDataStr, 'K')) {
        } else if (this.isFirstEqual(mapDataStr, 'L')) {
            //生成灯
            this.addLamp(mapDataStr, indexPos)
        } else if (this.isFirstEqual(mapDataStr, 'O')) {
            //生成顶部栏
            Logic.getBuildings(BuildingManager.DECORATIONOVERHEAD, (prefab: cc.Prefab) => {
                let head = this.addBuilding(prefab, indexPos)
                if (mapDataStr == 'O1') {
                    head.angle = 90
                }
                head.opacity = 80
                head.zIndex = IndexZ.ROOF
            })
        } else if (this.isFirstEqual(mapDataStr, 'P')) {
            //生成传送门
            Logic.getBuildings(BuildingManager.PORTAL, (prefab: cc.Prefab) => {
                if (Logic.isCheatMode) {
                    let d = ExitData.getRealWorldExitDataFromDream(Logic.chapterIndex, Logic.level)
                    for (let e of exits) {
                        if (e.fromPos.equals(indexPos) && e.fromRoomPos.equals(cc.v3(Logic.mapManager.getCurrentRoom().x, Logic.mapManager.getCurrentRoom().y))) {
                            d.valueCopy(e)
                            break
                        }
                    }
                    let p = this.addBuilding(prefab, indexPos)
                    let portal = p.getComponent(Portal)
                    portal.exitData.valueCopy(d)
                    this.portals.push(portal)
                }
            })
        } else if (mapDataStr == 'Q0') {
        } else if (this.isFirstEqual(mapDataStr, 'R')) {
            Logic.getBuildings(BuildingManager.SHIPSTAIRS, (prefab: cc.Prefab) => {
                let node = this.addBuilding(prefab, indexPos)
                node.setScale(16)
                node.zIndex = IndexZ.WALLINTERNAL
                if (parseInt(mapDataStr[1]) == 1) {
                    node.setScale(-16, 16)
                    node.getComponent(CCollider).offset = cc.v2(-8, 0)
                }
            })
        } else if (mapDataStr == 'S0') {
            //生成商店
            this.addShopTable(indexPos)
        } else if (mapDataStr == 'S1') {
            //生成店主
            Logic.getBuildings(BuildingManager.SHOP, (prefab: cc.Prefab) => {
                this.addBuilding(prefab, indexPos)
            })
        } else if (mapDataStr == 'S2') {
            //生成有家
            Logic.getBuildings(BuildingManager.SHOPMART, (prefab: cc.Prefab) => {
                let mart = this.addBuilding(prefab, indexPos)
                mart.zIndex += 10
            })
        } else if (mapDataStr == 'S3' || mapDataStr == 'S4' || mapDataStr == 'S5') {
            //生成货架
            this.addMartShelves(mapDataStr, indexPos)
        } else if (mapDataStr == 'S6') {
            //生成收银台
            Logic.getBuildings(BuildingManager.MARTCASHIER, (prefab: cc.Prefab) => {
                this.addBuilding(prefab, indexPos)
                let pos = Dungeon.getPosInMap(indexPos)
                let data = new NonPlayerData()
                data.valueCopy(Logic.nonplayers[NonPlayerManager.SHOP_KEEPER])
                dungeon.nonPlayerManager.addNonPlayerFromData(data, cc.v3(pos.x - 60, pos.y + 180), 0, dungeon)
            })
        } else if (mapDataStr == 'S7') {
            //生成餐桌
            Logic.getBuildings(BuildingManager.MARTTABLE, (prefab: cc.Prefab) => {
                this.addBuilding(prefab, indexPos)
            })
        } else if (mapDataStr == 'T000') {
            //生成陷阱
            Logic.getBuildings(BuildingManager.TRAP, (prefab: cc.Prefab) => {
                this.addBuilding(prefab, indexPos)
            })
        } else if (mapDataStr == 'T002') {
            //生成电锯,占据5个格子
            Logic.getBuildings(BuildingManager.SAW, (prefab: cc.Prefab) => {
                let saw = this.addBuilding(prefab, indexPos)
                saw.getComponent(Saw).setPos(indexPos)
            })
        } else if (mapDataStr == 'T003') {
            //生成落石
            this.addFallStone(indexPos, false)
        } else if (mapDataStr == 'T004') {
            //生成落雷
            this.addLighteningFall(Dungeon.getPosInMap(indexPos), true, true, true)
        } else if (this.isFirstEqual(mapDataStr, 'U')) {
            Logic.getBuildings(BuildingManager.WALLPAINT, (prefab: cc.Prefab) => {
                let wallpaint = this.addBuilding(prefab, indexPos).getComponent(WallPaint)
                wallpaint.node.zIndex = IndexZ.getActorZIndex(wallpaint.node.position.add(cc.v3(0, 120)))
                wallpaint.init(mapDataStr)
            })
        } else if (this.isFirstEqual(mapDataStr, 'V')) {
            this.addStairs(mapDataStr, indexPos)
        } else if (this.isFirstEqual(mapDataStr, 'W')) {
            //生成可破坏装饰 并且根据之前记录的位置放置
            this.addInteractBuilding(mapDataStr, indexPos)
        } else if (this.isFirstEqual(mapDataStr, 'X')) {
            Logic.getBuildings(BuildingManager.DECORATIONWALL, (prefab: cc.Prefab) => {
                let decorationWall = this.addBuilding(prefab, indexPos).getComponent(DecorationWall)
                decorationWall.node.zIndex = IndexZ.getActorZIndex(decorationWall.node.position.add(cc.v3(0, 120)))
                decorationWall.init(mapDataStr)
            })
        } else if (this.isFirstEqual(mapDataStr, 'Y')) {
            this.addLadder(mapDataStr, indexPos)
        } else if (this.isFirstEqual(mapDataStr, 'Z')) {
            if (mapDataStr == 'Z0' || mapDataStr == 'Z1') {
                Logic.getBuildings(BuildingManager.ROOMBED, (prefab: cc.Prefab) => {
                    let p = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
                    let rb = p.getComponent(RoomBed)
                    p.zIndex -= 40
                    rb.init(dungeon, mapDataStr == 'Z1')
                })
            } else {
                //生成家具
                this.addFurnitures(dungeon, mapDataStr, indexPos)
            }
        } else if (this.hasThe(mapDataStr, 'car')) {
            this.addVehicle(dungeon, mapDataStr, indexPos)
        }
    }
    private addLadder(mapDataStr: string, indexPos: cc.Vec3) {
        Logic.getBuildings(BuildingManager.LADDER, (prefab: cc.Prefab) => {
            let p = this.addBuilding(prefab, indexPos)
            let ladder = p.getComponent(Ladder)
            p.zIndex = IndexZ.getActorZIndex(p.position.add(cc.v3(0, 120)))
            ladder.init(mapDataStr)
        })
    }
    public addBuildingsFromSideMap(mapDataStr: string, mapData: string[][], indexPos: cc.Vec3, levelData: LevelData) {
        if (this.isFirstEqual(mapDataStr, '#')) {
            //生成墙
            this.addDirWalls(mapDataStr, mapData, indexPos, levelData, true)
        } else if (this.isFirstEqual(mapDataStr, '-')) {
            //生成黑暗
            Logic.getBuildings(BuildingManager.DARKNESS, (prefab: cc.Prefab) => {
                let dn = this.addBuilding(prefab, indexPos)
                dn.zIndex = IndexZ.DARKNESS
                if (mapDataStr == '-0') {
                    dn.zIndex = IndexZ.ROOF
                }
            })
        } else if (this.isFirstEqual(mapDataStr, '~')) {
            //生成水
            this.addWaterBuilding(mapDataStr, indexPos)
        } else if (mapDataStr == 'F1') {
            //生成汽艇
            Logic.getBuildings(BuildingManager.AIRTRANSPORTMODEL, (prefab: cc.Prefab) => {
                this.addBuilding(prefab, indexPos)
            })
        } else if (this.isFirstEqual(mapDataStr, 'D')) {
            //生成门
            this.addDoor(mapDataStr, indexPos, true)
        }
    }
    private addStairs(mapDataStr: string, indexPos: cc.Vec3) {
        let map: Map<string, string> = new Map()
        map.set(Stairs.TYPE_FRONT, BuildingManager.STAIRS0)
        map.set(Stairs.TYPE_BEHIND, BuildingManager.STAIRS1)
        map.set(Stairs.TYPE_LEFT, BuildingManager.STAIRS2)
        map.set(Stairs.TYPE_RIGHT, BuildingManager.STAIRS3)
        map.set(Stairs.TYPE_PLATFORM, BuildingManager.STAIRS4)
        map.forEach((value: string, key: string) => {
            if (this.hasThe(mapDataStr, key)) {
                Logic.getBuildings(value, (prefab: cc.Prefab) => {
                    let building = this.addBuilding(prefab, indexPos).getComponent(Stairs)
                    building.data.z = 0
                    building.init(mapDataStr)
                })
                return
            }
        })
    }
    private addNormalBuilding(dungeon: Dungeon, mapDataStr: string, prefix: string, indexPos: cc.Vec3) {
        Logic.getBuildings(BuildingManager.NORMAL_BUILDING, (prefab: cc.Prefab) => {
            let building = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.METAL, `${prefix}${mapDataStr.substring(1)}`).getComponent(NormalBuilding)
            let save = Logic.mapManager.getCurrentMapBuilding(building.data.defaultPos)
            building.data.valueCopy(save)
            building.init(dungeon)
        })
    }
    private addInteractBuilding(mapDataStr: string, indexPos: cc.Vec3) {
        Logic.getBuildings(BuildingManager.INTERACTBUILDING, (prefab: cc.Prefab) => {
            let saveBox = Logic.mapManager.getCurrentMapBuilding(indexPos)
            let isReborn = Logic.mapManager.getCurrentRoom().isReborn
            if (saveBox) {
                //生命值大于0才生成
                if (saveBox.currentHealth > 0 || isReborn) {
                    let interactBuilding = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD, '', true)
                    let d = interactBuilding.getComponent(InteractBuilding)
                    d.node.position = saveBox.position.clone()
                    d.data.valueCopy(saveBox)
                    if (isReborn) {
                        d.node.position = Dungeon.getPosInMap(d.data.defaultPos)
                        d.data.currentHealth = d.data.maxHealth
                    }
                    d.init(true, parseInt(mapDataStr[1]))
                    this.interactBuildings.push(d)
                }
            } else {
                let interactBuilding = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD, '', true)
                let d = interactBuilding.getComponent(InteractBuilding)
                d.data.currentHealth = 5
                Logic.mapManager.setCurrentBuildingData(d.data.clone())
                d.init(true, parseInt(mapDataStr[1]))
                this.interactBuildings.push(d)
            }
        })
    }
    private addBox(mapDataStr: string, indexPos: cc.Vec3) {
        Logic.getBuildings(BuildingManager.BOX, (prefab: cc.Prefab) => {
            let box = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD, '', true)
            let b = box.getComponent(Box)
            b.setDefaultPos(indexPos)
            //生成植物
            if (mapDataStr == 'B001') {
                b.boxType = Box.PLANT
            }
            //设置对应存档盒子的位置
            let saveBox = Logic.mapManager.getCurrentMapBuilding(b.data.defaultPos)
            if (saveBox) {
                b.node.position = saveBox.position.clone()
            } else {
                Logic.mapManager.setCurrentBuildingData(b.data.clone())
            }
        })
    }
    private addShopTable(indexPos: cc.Vec3) {
        Logic.getBuildings(BuildingManager.SHOPTABLE, (prefab: cc.Prefab) => {
            let table = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
            let ta = table.getComponent(ShopTable)
            ta.setDefaultPos(indexPos)
            let isReborn = Logic.mapManager.getCurrentRoom().isReborn
            let rand4save = Logic.mapManager.getRandom4Save(ta.seed, MapManager.RANDOM_BUILDING)
            ta.data.shopType = rand4save.getRandomNum(0, 100) > 10 ? ShopTable.EQUIPMENT : ShopTable.ITEM
            let saveTable = Logic.mapManager.getCurrentMapBuilding(ta.data.defaultPos)
            if (saveTable) {
                if (isReborn && saveTable.isSaled) {
                    saveTable.isSaled = false
                    saveTable.equipdata = null
                    saveTable.itemdata = null
                    rand4save = Logic.mapManager.getRandom4Save(Logic.mapManager.getRebornSeed(ta.seed), MapManager.RANDOM_BUILDING)
                    saveTable.shopType = rand4save.getRandomNum(0, 100) > 10 ? ShopTable.EQUIPMENT : ShopTable.ITEM
                }
                ta.data.valueCopy(saveTable)
            } else {
                Logic.mapManager.setCurrentBuildingData(ta.data.clone())
            }
            ta.showItem()
        })
    }
    private addChest(indexPos: cc.Vec3, mapDataStr: string) {
        Logic.getBuildings(BuildingManager.CHEST, (prefab: cc.Prefab) => {
            let chest = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
            let c = chest.getComponent(Chest)
            c.seDefaultPos(indexPos)
            let quality = mapDataStr.substring(mapDataStr.length - 1, mapDataStr.length)
            c.setQuality(parseInt(quality), 0)
            let saveChest = Logic.mapManager.getCurrentMapBuilding(c.data.defaultPos)
            if (saveChest) {
                c.setQuality(saveChest.quality, saveChest.triggerCount)
            } else {
                Logic.mapManager.setCurrentBuildingData(c.data.clone())
            }
        })
    }
    private addEquipItemBuildings(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3, equipitems: EquipItemMapData[]) {
        let data = new BuildingData()
        let repetitive = mapDataStr == '@b'
        data.defaultPos = indexPos.clone()
        data.triggerCount = 1
        if (!repetitive) {
            let savedata = Logic.mapManager.getCurrentMapBuilding(data.defaultPos)
            if (savedata && savedata.triggerCount > 0) {
                return
            }
            Logic.mapManager.setCurrentBuildingData(data.clone())
        }
        for (let d of equipitems) {
            if (d.fromPos.equals(indexPos) && d.fromRoomPos.equals(cc.v3(Logic.mapManager.getCurrentRoom().x, Logic.mapManager.getCurrentRoom().y))) {
                if (InventoryManager.isEquipTag(d.resName)) {
                    dungeon.addEquipment(d.resName, Dungeon.getPosInMap(indexPos))
                } else {
                    dungeon.addItem(Dungeon.getPosInMap(indexPos), d.resName)
                }
                break
            }
        }
    }
    private addVehicle(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3) {
        Logic.getBuildings(BuildingManager.VEHICLE, (prefab: cc.Prefab) => {
            let n = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.METAL, '', true)
            let vehicle = n.getComponent(Vehicle)
            vehicle.init(dungeon, mapDataStr)
        })
    }
    private addDecorate(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3) {
        if (mapDataStr == '+++0') {
            Logic.getBuildings(BuildingManager.GRASS01, (prefab: cc.Prefab) => {
                this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
            })
        } else if (mapDataStr == '+++1') {
            Logic.getBuildings(BuildingManager.GRASS02, (prefab: cc.Prefab) => {
                this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
            })
        } else if (mapDataStr == '+++2') {
            Logic.getBuildings(BuildingManager.GRASS03, (prefab: cc.Prefab) => {
                this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
            })
        } else if (mapDataStr == '+++3') {
            Logic.getBuildings(BuildingManager.GRASS04, (prefab: cc.Prefab) => {
                this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
            })
        } else {
            Logic.getBuildings(BuildingManager.DECORATIONFLOOR, (prefab: cc.Prefab) => {
                let fd = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
                let df = fd.getComponent(DecorationFloor)
                if (mapDataStr == '+1') {
                    df.init(dungeon, 'floor_exitarrow', 4, 0)
                } else if (mapDataStr == '+2') {
                    df.init(dungeon, 'floor_exitarrow', 4, -90)
                } else if (mapDataStr == '+3') {
                    df.init(dungeon, 'floor_exitarrow', 4, 180)
                } else if (mapDataStr == '+4') {
                    df.init(dungeon, 'floor_exitarrow', 4, 90)
                } else if (mapDataStr == '+5') {
                    df.init(dungeon, 'floor_final', 4)
                } else if (mapDataStr == '+6') {
                    df.init(dungeon, 'floor_ladder', 4)
                } else if (mapDataStr == '+7') {
                    df.init(dungeon, 'floor_whiteline', 4)
                } else if (mapDataStr == '+8') {
                    df.init(dungeon, 'floor_exitarrow1', 4, 0)
                } else if (mapDataStr == '+9') {
                    df.init(dungeon, 'floor_exitarrow1', 4, -90)
                } else if (mapDataStr == '+10') {
                    df.init(dungeon, 'floor_exitarrow1', 4, 180)
                } else if (mapDataStr == '+11') {
                    df.init(dungeon, 'floor_exitarrow1', 4, 90)
                } else if (mapDataStr == '+12') {
                    df.init(dungeon, 'floor_whiteline', 4, 90)
                } else if (mapDataStr == '++0') {
                    df.init(dungeon, 'floor_roomoutside0', 32, 0, 1, cc.v3(0.7, 0.5), 255, IndexZ.BASE)
                } else if (mapDataStr == '++1') {
                    df.init(dungeon, 'floor_roomoutside1', 32, 0, 1, cc.v3(0.7, 0.5), 255, IndexZ.BASE)
                } else if (mapDataStr == '++2') {
                    df.init(dungeon, 'floor_roomoutside2', 32, 0, 1, cc.v3(0, 0.5), 255, IndexZ.BASE)
                } else {
                    df.init(dungeon, 'floor_dev', 4)
                }
            })
        }
    }
    private addWaterBuilding(mapDataStr: string, indexPos: cc.Vec3) {
        if (this.hasThe(mapDataStr, '~#')) {
            Logic.getBuildings(BuildingManager.COAST, (prefab: cc.Prefab) => {
                let fint = parseInt(mapDataStr.substring(2))
                let co = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
                co.zIndex = IndexZ.ACTOR
                co.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes(`coast${Utils.getNumberStr3(fint)}`)
                // let pbc = co.getComponent(CCollider)
                // let arr = this.coastColliderList[fint].split(',')
                // pbc.setSize(cc.size(parseInt(arr[0]), parseInt(arr[1])))
                // pbc.offset = cc.v2(parseInt(arr[2]), parseInt(arr[3]))
                // pbc.zHeight = 128
            })
        } else if (this.hasThe(mapDataStr, '~~')) {
            Logic.getBuildings(BuildingManager.WATERFALL, (prefab: cc.Prefab) => {
                AudioPlayer.play(AudioPlayer.WATERFALL, false, true)
                let dn = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
            })
        }
    }
    private addLamp(mapDataStr: string, indexPos: cc.Vec3) {
        let prefabName = BuildingManager.LAMPLIGHT
        let isOverHead = false
        let isRect = false
        let isCustom = false
        let isOutSide = false
        let isAttachTop = false
        switch (mapDataStr) {
            case 'L0':
                prefabName = BuildingManager.LAMPOVALLIGHT
                break
            case 'L1':
                prefabName = BuildingManager.LAMPSUN
                isOverHead = true
                break
            case 'L2':
                prefabName = BuildingManager.LAMPSHIP
                isOverHead = true
                break
            case 'L3':
                prefabName = BuildingManager.MUSHROOM01
                break
            case 'L4':
                prefabName = BuildingManager.MUSHROOM02
                break
            case 'L5':
                prefabName = BuildingManager.MUSHROOM03
                break
            case 'L6':
                prefabName = BuildingManager.MUSHROOM04
                break
            case 'L7':
                prefabName = BuildingManager.LAMPSEARCH
                isOverHead = true
                break
            case 'L8':
                prefabName = BuildingManager.LAMPTORCH
                isOverHead = true
                break
            case 'L9':
                prefabName = BuildingManager.LAMPFIREPAN
                break
            case 'L10':
                prefabName = BuildingManager.LAMPROAD
                break
            case 'L11':
                prefabName = BuildingManager.LAMPFIREFLY
                break
            case 'L12':
                prefabName = BuildingManager.LAMPEXIT
                isAttachTop = true
                break
            case 'L13':
                prefabName = BuildingManager.LAMPOVALLIGHTOUTSIDE
                break
            case 'LL020':
            case 'LL021':
            case 'LL022':
            case 'LL023':
                prefabName = BuildingManager.LAMPDIRECT
                break
            case 'LL010':
            case 'LL011':
            case 'LL012':
            case 'LL013':
            case 'LL014':
            case 'LL015':
            case 'LL016':
            case 'LL017':
            case 'LL018':
            case 'LL019':
                prefabName = BuildingManager.LAMPLIGHT
                isCustom = true
                break
            case 'LL000':
            case 'LL001':
            case 'LL002':
            case 'LL003':
            case 'LL004':
            case 'LL005':
            case 'LL006':
            case 'LL007':
            case 'LL008':
            case 'LL009':
                prefabName = BuildingManager.LAMPLIGHT
                isCustom = true
                isRect = true
                break
            case 'LO010':
            case 'LO011':
            case 'LO012':
            case 'LO013':
            case 'LO014':
            case 'LO015':
            case 'LO016':
            case 'LO017':
            case 'LO018':
            case 'LO019':
                prefabName = BuildingManager.LAMPLIGHTOUTSIDE
                isCustom = true
                break
            case 'LO000':
            case 'LO001':
            case 'LO002':
            case 'LO003':
            case 'LO004':
            case 'LO005':
            case 'LO006':
            case 'LO007':
            case 'LO008':
            case 'LO009':
                prefabName = BuildingManager.LAMPLIGHTOUTSIDE
                isCustom = true
                isRect = true
                break
        }
        Logic.getBuildings(prefabName, (prefab: cc.Prefab) => {
            let node = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
            if (isOverHead) {
                node.zIndex = IndexZ.OVERHEAD + 100
            }
            if (isAttachTop) {
                node.zIndex = IndexZ.getActorZIndex(node.position.add(cc.v3(0, 120)))
            }
            if (isCustom) {
                let b = node.getComponent(Building)
                if (b.lights.length > 0) {
                    let index = parseInt(mapDataStr[4])
                    let range = Dungeon.TILE_SIZE * index
                    b.lights[0].setCustomColliderStyle(isRect, range, range, range / 2, 0, 0)
                }
            }
        })
    }
    private getGoodsList(type: string): string[] {
        if (this.foodList.length < 1 && this.drinkList.length < 1) {
            let prefix = 'goods'
            for (let goods of Logic.goodsNameList) {
                let index = goods.substring(prefix.length, prefix.length + 1)
                if (index == '0') {
                    this.drinkList.push(goods)
                } else if (index == '1') {
                    this.foodList.push(goods)
                }
            }
        }
        if (type == MartShelves.TYPE_FRIDGE) {
            let tempdrinks: string[] = []
            for (let i = this.shelvesDrinkIndex % MartShelves.SIZE_FRIDGE; i < MartShelves.SIZE_FRIDGE; i++) {
                if (this.shelvesDrinkIndex < this.drinkList.length) {
                    tempdrinks.push(this.drinkList[this.shelvesDrinkIndex++])
                }
            }
            return tempdrinks
        } else {
            let tempfoods: string[] = []
            for (let i = this.shelvesFoodIndex % MartShelves.SIZE_NORMAL; i < MartShelves.SIZE_NORMAL; i++) {
                if (this.shelvesFoodIndex < this.foodList.length) {
                    tempfoods.push(this.foodList[this.shelvesFoodIndex++])
                }
            }
            return tempfoods
        }
    }
    private addMartShelves(mapDataStr: string, indexPos: cc.Vec3) {
        //生成货架
        if (mapDataStr == MartShelves.TYPE_FRIDGE) {
            Logic.getBuildings(BuildingManager.MARTFRIDGE, (prefab: cc.Prefab) => {
                let ms = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD).getComponent(MartShelves)
                ms.init(mapDataStr, this.getGoodsList(mapDataStr))
            })
        } else {
            Logic.getBuildings(BuildingManager.MARTSHELVES, (prefab: cc.Prefab) => {
                let ms = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD).getComponent(MartShelves)
                ms.init(mapDataStr, this.getGoodsList(mapDataStr))
            })
        }
    }
    private addExitDoor(mapDataStr: string, indexPos: cc.Vec3, exits: ExitData[]) {
        Logic.getBuildings(BuildingManager.EXITDOOR, (prefab: cc.Prefab) => {
            let dir = parseInt(mapDataStr[3])
            let type = parseInt(mapDataStr.substring(1, 3))
            let d = ExitData.getRealWorldExitDataFromDream(Logic.chapterIndex, Logic.level)
            for (let e of exits) {
                if (e.fromPos.equals(indexPos) && e.fromRoomPos.equals(cc.v3(Logic.mapManager.getCurrentRoom().x, Logic.mapManager.getCurrentRoom().y))) {
                    d.valueCopy(e)
                    break
                }
            }
            let p = this.addBuilding(prefab, indexPos)
            let exitdoor = p.getComponent(ExitDoor)
            exitdoor.init(type, dir, d)
            this.exitdoors.push(exitdoor)
        })
    }
    /**添加空气墙 */
    public addAirExit(mapData: string[][]) {
        Logic.getBuildings(BuildingManager.AIREXIT, (prefab: cc.Prefab) => {
            let top = this.addBuilding(prefab, cc.v3(Math.floor(mapData.length / 2), mapData[0].length)).getComponent(AirExit)
            let bottom = this.addBuilding(prefab, cc.v3(Math.floor(mapData.length / 2), -1)).getComponent(AirExit)
            let left = this.addBuilding(prefab, cc.v3(-1, Math.floor(mapData[0].length / 2))).getComponent(AirExit)
            let right = this.addBuilding(prefab, cc.v3(mapData.length, Math.floor(mapData[0].length / 2))).getComponent(AirExit)
            this.airExits.push(top)
            this.airExits.push(bottom)
            this.airExits.push(left)
            this.airExits.push(right)
            for (let i = 0; i < this.airExits.length; i++) {
                this.airExits[i].init(i, i < 2 ? mapData.length + 2 : mapData[0].length + 2)
            }
        })
    }

    private addDoor(mapDataStr: string, indexPos: cc.Vec3, isDecorate: boolean) {
        Logic.getBuildings(BuildingManager.DOOR, (prefab: cc.Prefab) => {
            let dir = parseInt(mapDataStr[3])
            let type = parseInt(mapDataStr.substring(1, 3))
            let door = this.addBuilding(prefab, indexPos).getComponent(Door)
            door.isDoor = true
            door.dir = dir % 4
            door.isLock = type == 1 && !Logic.isCheatMode
            door.isEmpty = type == 2
            door.isTransparent = type == 3
            door.isHidden = type == 4
            door.isDecorate = isDecorate
            door.setOpen(true, true)
            this.doors.push(door)
        })
    }
    public setDoors(isOpen: boolean, immediately?: boolean) {
        for (let door of this.doors) {
            door.setOpen(isOpen, immediately)
        }
        if (immediately) {
            return
        }
        for (let air of this.airExits) {
            air.changeStatus(isOpen ? AirExit.STATUS_OPEN : AirExit.STATUS_CLOSE)
        }
        if (this.exitdoors.length > 0) {
            for (let ed of this.exitdoors) {
                isOpen ? ed.openGate() : ed.closeGate()
            }
        }
        if (this.portals.length > 0) {
            for (let ed of this.portals) {
                isOpen ? ed.openGate() : ed.closeGate()
            }
        }
    }
    public getReachDir() {
        let dirs: Map<Number, Boolean> = new Map()
        for (let door of this.doors) {
            if (!door.isLock && !door.isDecorate) {
                if (Logic.mapManager.isNeighborRoomNew(door.dir)) {
                    dirs.set(door.dir, true)
                } else if (Logic.mapManager.isNeighborRoomExist(door.dir)) {
                    dirs.set(door.dir, false)
                }
            }
        }
        for (let exit of this.exitdoors) {
            if (exit.dir < 8) {
                dirs.set(exit.dir % 4, true)
            }
        }
        return dirs
    }
    private addDirWalls(mapDataStr: string, mapData: string[][], indexPos: cc.Vec3, levelData: LevelData, onlyShow: boolean) {
        Logic.getBuildings(BuildingManager.WALL, (prefab: cc.Prefab) => {
            let node: cc.Node = this.addBuilding(prefab, indexPos)
            let wall = node.getComponent(Wall)
            let combineCountX = 0
            let combineCountY = 0

            //判断当前墙壁下标是否在合并表里，如果有设置最初合并的墙
            let isCombine = this.colliderCombineMap.has(`i${indexPos.x}j${indexPos.y}`)
            if (isCombine) {
                wall.combineWall = this.colliderCombineMap.get(`i${indexPos.x}j${indexPos.y}`)
            }
            //如果还未合并且非装饰的情况下往右遍历
            if (!isCombine && !onlyShow) {
                for (let i = indexPos.x + 1; i < mapData.length; i++) {
                    let next = mapData[i][indexPos.y]
                    if (Utils.isFirstEqual(next, '#')) {
                        this.colliderCombineMap.set(`i${i}j${indexPos.y}`, wall)
                        combineCountX++
                        // let type = Wall.getType(next)
                        // if (Wall.typeNeedTransparent(type)) {
                        //     //下一个相同元素记录下标并存储当前元素
                        // } else {
                        //     break
                        // }
                    } else {
                        break
                    }
                }
                // if (combineCountX < 1) {
                //     for (let j = indexPos.y + 1; j < mapData[indexPos.x].length; j++) {
                //         let next = mapData[indexPos.x][j]
                //         if (mapDataStr == next) {
                //             this.colliderCombineMap.set(`i${indexPos.x}j${j}`, null)
                //             combineCountY++
                //         } else {
                //             break
                //         }
                //     }
                // }
            }
            wall.init(mapDataStr, levelData, onlyShow || isCombine, combineCountX, combineCountY)
        })
    }
    private addFurnitures(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3) {
        let data = new BuildingData()
        switch (mapDataStr) {
            case 'Z2':
                data.valueCopy(Logic.furnitures[Furniture.DESK])
                break
            case 'Z3':
                data.valueCopy(Logic.furnitures[Furniture.TV])
                break
            case 'Z4':
                data.valueCopy(Logic.furnitures[Furniture.SOFA])
                break
            case 'Z5':
                data.valueCopy(Logic.furnitures[Furniture.DINNER_TABLE])
                break
            case 'Z6':
                data.valueCopy(Logic.furnitures[Furniture.FRIDGE])
                break
            case 'Z7':
                data.valueCopy(Logic.furnitures[Furniture.WASHING_MACHINE])
                break
            case 'Z8':
                data.valueCopy(Logic.furnitures[Furniture.CUPBOARD])
                break
            case 'Z9':
                data.valueCopy(Logic.furnitures[Furniture.STOOL])
                break
            case 'Z10':
                data.valueCopy(Logic.furnitures[Furniture.COOKING_BENCH])
                break
            case 'Z11':
                data.valueCopy(Logic.furnitures[Furniture.DOLL_MACHINE])
                break
            case 'Z12':
                data.valueCopy(Logic.furnitures[Furniture.COOKING_BENCH_2])
                break
            case 'Z13':
                data.valueCopy(Logic.furnitures[Furniture.COOKING_BENCH_3])
                break
            case 'Z14':
                data.valueCopy(Logic.furnitures[Furniture.BATH])
                break
            case 'Z15':
                data.valueCopy(Logic.furnitures[Furniture.LITTLE_TABLE])
                break
            case 'Z16':
                data.valueCopy(Logic.furnitures[Furniture.LITTLE_TABLE_1])
                break
            case 'Z17':
                data.valueCopy(Logic.furnitures[Furniture.LITTLE_TABLE_2])
                break
            case 'Z18':
                data.valueCopy(Logic.furnitures[Furniture.FISHTANK])
                break
            case 'Z19':
                data.valueCopy(Logic.furnitures[Furniture.BOOKSHELF])
                break
            case 'Z20':
                data.valueCopy(Logic.furnitures[Furniture.WATERDISPENER])
                break
            case 'Z21':
                data.valueCopy(Logic.furnitures[Furniture.TRASHCAN])
                break
            default:
                break
        }
        let building: cc.Node
        let script: Furniture
        if (mapDataStr == 'Z3') {
            Logic.getBuildings(BuildingManager.ROOMTV, (prefab: cc.Prefab) => {
                building = this.addBuilding(prefab, indexPos)
                script = building.getComponent(Furniture)
                script.init(data, false)
            })
        } else if (mapDataStr == 'Z4') {
            Logic.getBuildings(BuildingManager.ROOMSOFA, (prefab: cc.Prefab) => {
                building = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
                building.zIndex = IndexZ.ACTOR
                script = building.getComponent(Furniture)
                script.init(data, false)
            })
        } else if (mapDataStr == 'Z9') {
            Logic.getBuildings(BuildingManager.ROOMSTOOL, (prefab: cc.Prefab) => {
                building = this.addBuilding(prefab, indexPos)
                building.getComponent(RoomStool).init(dungeon)
                script = building.getComponent(Furniture)
                script.init(data, false)
            })
        } else if (mapDataStr == 'Z10') {
            Logic.getBuildings(BuildingManager.ROOMKITCHEN, (prefab: cc.Prefab) => {
                building = this.addBuilding(prefab, indexPos)
                building.getComponent(RoomKitchen).init(indexPos)
                script = building.getComponent(Furniture)
                script.init(data, false)
            })
        } else if (mapDataStr == 'Z17') {
            Logic.getBuildings(BuildingManager.ROOMCLOCK, (prefab: cc.Prefab) => {
                building = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
                script = building.getComponent(Furniture)
                script.init(data, false)
            })
        } else if (mapDataStr == 'Z18') {
            Logic.getBuildings(BuildingManager.ROOMFISHTANK, (prefab: cc.Prefab) => {
                building = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
                building.getComponent(RoomFishtank).init(dungeon)
                script = building.getComponent(Furniture)
                script.init(data, false)
            })
        } else if (mapDataStr == 'Z20') {
            Logic.getBuildings(BuildingManager.ROOMWATERDISPENSER, (prefab: cc.Prefab) => {
                building = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
                script = building.getComponent(Furniture)
                script.init(data, false)
            })
        } else if (mapDataStr == 'Z21') {
            Logic.getBuildings(BuildingManager.ROOMTRASHCAN, (prefab: cc.Prefab) => {
                building = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
                script = building.getComponent(Furniture)
                script.init(data, false)
            })
        } else {
            Logic.getBuildings(BuildingManager.FURNITURE, (prefab: cc.Prefab) => {
                building = this.addBuilding(prefab, indexPos, CCollider.AUDIO_MATERIAL.WOOD)
                script = building.getComponent(Furniture)
                script.init(data, true)
            })
        }
        if (script) {
            let save = Logic.mapManager.getCurrentMapBuilding(script.data.defaultPos)
            if (save) {
                script.data.triggerCount = save.triggerCount
            }
        }
    }

    /**掉落石头 */
    addFallStone(pos: cc.Vec3, isAuto: boolean, withFire?: boolean) {
        if (!this.node) {
            return
        }
        Logic.getBuildings(BuildingManager.FALLSTONE, (prefab: cc.Prefab) => {
            let stone = this.addBuilding(prefab, pos)
            let stoneScript = stone.getComponent(FallStone)
            stoneScript.isAuto = isAuto
            stone.zIndex = IndexZ.ACTOR
            if (stoneScript.isAuto) {
                stoneScript.fall(withFire)
            }
        })
    }
    /**落雷 */
    addLighteningFall(pos: cc.Vec3, isTrigger: boolean, needPrepare: boolean, showArea: boolean, damagePoint?: number) {
        if (!this.node) {
            return
        }
        Logic.getBuildings(BuildingManager.LIGHTENINGFALL, (prefab: cc.Prefab) => {
            let fall = this.addBuilding(prefab, Dungeon.getIndexInMap(pos))
            let fallScript = fall.getComponent(MagicLightening)
            fall.zIndex = IndexZ.ACTOR
            fallScript.isTrigger = isTrigger
            if (!fallScript.isTrigger) {
                fallScript.fall(needPrepare, showArea, damagePoint)
            }
        })
    }
    /**树根缠绕 */
    public addTwineGrass(pos: cc.Vec3, isAuto: boolean) {
        if (!this.node) {
            return
        }
        Logic.getBuildings(BuildingManager.DRYADTWINE, (prefab: cc.Prefab) => {
            let grass = this.addBuilding(prefab, pos)
            let dryadGrassScript = grass.getComponent(DryadGrass)
            dryadGrassScript.isAuto = isAuto
            grass.zIndex = IndexZ.getActorZIndex(pos)
            if (dryadGrassScript.isAuto) {
                dryadGrassScript.fall()
            }
        })
    }
    /**幽光护盾 */
    public addEnergyShield(player: Player, callback: (arg0: EnergyShield) => void): void {
        if (!this.node) {
            if (callback) {
                callback(null)
            }
        }
        Logic.getBuildings(BuildingManager.ENERGYSHIELD, (prefab: cc.Prefab) => {
            let shield = this.addBuilding(prefab, player.pos)
            shield.position = player.node.position.clone()
            let script = shield.getComponent(EnergyShield)
            script.entity.Transform.position = shield.position.clone()
            let scale = 8 + Math.floor(Logic.playerData.OilGoldData.level / 5)
            script.init(player, 20 + Logic.playerData.OilGoldData.level * 5, scale)
            if (callback) {
                callback(script)
            }
        })
    }
    private addPracticeEquipItem(dungeon: Dungeon, indexPos: cc.Vec3) {
        if (dungeon) {
            dungeon.addEquipment(EquipmentManager.WEAPON_WOOD_SWORD, Dungeon.getPosInMap(indexPos.add(cc.v3(-2, 0))))
            dungeon.addEquipment(EquipmentManager.WEAPON_WOOD_SPEAR, Dungeon.getPosInMap(indexPos.add(cc.v3(-1, 0))))
            dungeon.addEquipment(EquipmentManager.WEAPON_WOOD_DAGGER, Dungeon.getPosInMap(indexPos))
            dungeon.addEquipment(EquipmentManager.WEAPON_WOOD_HAMMER, Dungeon.getPosInMap(indexPos.add(cc.v3(1, 0))))
            dungeon.addEquipment(EquipmentManager.WEAPON_WOOD_LONG_CROSS, Dungeon.getPosInMap(indexPos.add(cc.v3(2, 0))))
            dungeon.addEquipment(EquipmentManager.WEAPON_WOOD_LONG_STICK, Dungeon.getPosInMap(indexPos.add(cc.v3(-3, 0))))
        }
    }
    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 0.2) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    updateLogic(dt: number, player: Player) {
        if (this.isCheckTimeDelay(dt)) {
            let distance = 200
            let building: InteractBuilding = null
            for (let i = this.interactBuildings.length - 1; i >= 0; i--) {
                let b = this.interactBuildings[i]
                b.highLight(false)
                if (b.isTaken || !b.isValid || b.data.currentHealth <= 0) {
                    continue
                }
                let d = Logic.getDistanceNoSqrt(b.node.position, player.node.position)
                if (d < distance) {
                    distance = d
                    building = b
                }
            }
            if (distance < 96 && building) {
                building.highLight(true)
                this.lastInteractBuilding = building
            } else {
                this.lastInteractBuilding = null
            }
        }
    }
}
