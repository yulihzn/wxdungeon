import Dungeon from "../Dungeon";
import Logic from "../Logic";
import FootBoard from "../Building/FootBoard";
import IndexZ from "../Utils/IndexZ";
import Saw from "../Building/Saw";
import Emplacement from "../Building/Emplacement";
import DecorationFloor from "../Building/DecorationFloor";
import Chest from "../Building/Chest";
import Box from "../Building/Box";
import ShopTable from "../Building/ShopTable";
import FallStone from "../Building/FallStone";
import MagicLightening from "../Building/MagicLightening";
import HitBuilding from "../Building/HitBuilding";
import ExitDoor from "../Building/ExitDoor";
import Door from "../Building/Door";
import Wall from "../Building/Wall";
import AirExit from "../Building/AirExit";
import LevelData from "../Data/LevelData";
import Portal from "../Building/Portal";
import RoomBed from "../Building/RoomBed";
import Building from "../Building/Building";
import ExitData from "../Data/ExitData";
import BaseManager from "./BaseManager";
import DryadGrass from "../Boss/DryadGrass";
import Utils from "../Utils/Utils";
import ShadowOfSight from "../Effect/ShadowOfSight";
import LightManager from "./LightManager";
import SavePoint from "../Building/SavePoint";
import MartShelves from "../Building/MartShelves";
import NonPlayerManager from "./NonPlayerManager";
import MonsterManager from "./MonsterManager";
import MonsterGenerator from "../Building/MonsterGenerator";
import MgWentLine from "../Building/MgWentLine";
import RoomStool from "../Building/RoomStool";
import MgCrack from "../Building/MgCrack";
import InteractBuilding from "../Building/InteractBuilding";
import Player from "../Player";
import EnergyShield from "../Building/EnergyShield";
import EquipmentManager from "./EquipmentManager";


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
export default class BuildingManager extends BaseManager {
    static readonly AIREXIT = 'AirExit';
    static readonly AIRTRANSPORT = 'AirTransport';
    static readonly AIRTRANSPORTMODEL = 'AirTransportModel';
    static readonly BED = 'Bed';
    static readonly BOX = 'Box';
    static readonly CAMPFIRE = 'CampFire';
    static readonly CHEST = 'Chest';
    static readonly COAST = 'Coast';
    static readonly DARKNESS = 'Darkness';
    static readonly INTERACTBUILDING = 'InteractBuilding';
    static readonly DECORATIONFLOOR = 'DecorationFloor';
    static readonly DECORATIONOVERHEAD = 'DecorationOverHead';
    static readonly DOOR = 'Door';
    static readonly DRYADTWINE = 'DryadTwine';
    static readonly EMPLACEMENT = 'Emplacement';
    static readonly EXITDOOR = 'ExitDoor';
    static readonly FALLSTONE = 'FallStone';
    static readonly FOOTBOARD = 'FootBoard';
    static readonly HITBUILDING = 'HitBuilding';
    static readonly ICEDEMONTHRON = 'IceDemonThron';
    static readonly LIGHTENINGFALL = 'LighteningFall';
    static readonly MARTCASHIER = 'MartCashier';
    static readonly MARTFRIDGE = 'MartFridge';
    static readonly MARTSHELVES = 'MartShelves';
    static readonly MARTTABLE = 'MartTable';
    static readonly MIST = 'Mist';
    static readonly PORTAL = 'Portal';
    static readonly ROOMBED = 'RoomBed';
    static readonly ROOMTV = 'RoomTv';
    static readonly ROOMSTOOL = 'RoomStool';
    static readonly SAVEPOINT = 'SavePoint';
    static readonly SAW = 'Saw';
    static readonly SHIPSTAIRS = 'Shipstairs';
    static readonly SHOP = 'Shop';
    static readonly SHOPMART = 'ShopMart';
    static readonly SHOPTABLE = 'ShopTable';
    static readonly TAROTTABLE = 'TarotTable';
    static readonly TRAP = 'Trap';
    static readonly WALL = 'Wall';
    static readonly WATER = 'Water';
    static readonly LAMPLIGHT = 'LampLight';
    static readonly LAMPSUN = 'LampSun';
    static readonly LAMPSHIP = 'LampShip';
    static readonly LAMPSEARCH = 'LampSearch';
    static readonly LAMPFIREPAN = 'LampFirePan';
    static readonly LAMPTORCH = 'LampTorch';
    static readonly LAMPROAD = 'LampRoad';
    static readonly LAMPFIREFLY = 'LampFireFly';
    static readonly MUSHROOM01 = 'MushRoom01';
    static readonly MUSHROOM02 = 'MushRoom02';
    static readonly MUSHROOM03 = 'MushRoom03';
    static readonly MUSHROOM04 = 'MushRoom04';
    static readonly GRASS01 = 'Grass01';
    static readonly GRASS02 = 'Grass02';
    static readonly GRASS03 = 'Grass03';
    static readonly GRASS04 = 'Grass04';
    static readonly WENTLINE = 'WentLine';
    static readonly CRACK = 'Crack';
    static readonly WATERCOLLIDER = 'WaterCollider';
    static readonly ENERGYSHIELD = 'EnergyShield';

    // LIFE-CYCLE CALLBACKS:
    footboards: FootBoard[] = new Array();
    exitdoors: ExitDoor[] = new Array();
    portals: Portal[] = new Array();
    doors: Door[] = new Array();
    airExits: AirExit[] = new Array();
    monsterGeneratorList: MonsterGenerator[] = new Array();
    savePointS: SavePoint;
    coastColliderList = ['128,128,0,0', '128,128,0,0', '128,128,0,0', '128,128,0,0', '128,64,0,-32', '128,64,0,32'
        , '64,128,32,0', '64,128,-32,0', '64,64,-32,32', '64,64,32,32', '64,64,-32,-32', '64,64,32,-32'];

    private shelvesFoodIndex = 0;
    private shelvesDrinkIndex = 0;
    private drinkList: string[] = [];
    private foodList: string[] = [];
    private interactBuildings: InteractBuilding[] = [];
    public lastInteractBuilding: InteractBuilding;

    clear(): void {
        Utils.clearComponentArray(this.footboards);
        Utils.clearComponentArray(this.exitdoors);
        Utils.clearComponentArray(this.portals);
        Utils.clearComponentArray(this.doors);
        Utils.clearComponentArray(this.airExits);
        Utils.clearComponentArray(this.interactBuildings);
        this.footboards = new Array();
        this.exitdoors = new Array();
        this.portals = new Array();
        this.doors = new Array();
        this.airExits = new Array();
        this.drinkList = new Array();
        this.foodList = new Array();
        this.interactBuildings = new Array();
        this.shelvesFoodIndex = 0;
        this.shelvesDrinkIndex = 0;
    }

    private isThe(mapStr: string, typeStr: string): boolean {
        let isequal = mapStr.indexOf(typeStr) != -1;
        return isequal;
    }
    private isFirstEqual(mapStr: string, typeStr: string) {
        let isequal = mapStr[0] == typeStr;
        return isequal;
    }
    private addBuilding(prefab: cc.Prefab, indexPos: cc.Vec3): cc.Node {
        let building = cc.instantiate(prefab);
        building.parent = this.node;
        building.position = Dungeon.getPosInMap(indexPos);
        building.zIndex = IndexZ.getActorZIndex(building.position);
        let b = building.getComponent(Building);
        if (b) {
            b.seed = Logic.mapManager.getSeedFromRoom();
            b.data.defaultPos = indexPos.clone();
            b.lights = b.getComponentsInChildren(ShadowOfSight);
            if (b.lights) {
                LightManager.registerLight(b.lights, b.node);
            }
        }
        return building;
    }
    public addBuildingsFromMap(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3, levelData: LevelData, exits: ExitData[]) {
        if (this.isFirstEqual(mapDataStr, '*')) {
        } else if (this.isFirstEqual(mapDataStr, '#')) {
            //生成墙
            this.addDirWalls(mapDataStr, indexPos, levelData, false);
        } else if (this.isFirstEqual(mapDataStr, '-')) {
            let dn = this.addBuilding(Logic.getBuildings(BuildingManager.DARKNESS), indexPos);
            dn.zIndex = IndexZ.DARKNESS;
            if (mapDataStr == '-0') {
                dn.zIndex = IndexZ.ROOF;
            }
        } else if (this.isFirstEqual(mapDataStr, '~')) {
            this.addWater(mapDataStr, indexPos);
        } else if (this.isFirstEqual(mapDataStr, '+')) {
            //生成装饰
            this.addDecorate(dungeon, mapDataStr, indexPos);
        } else if (mapDataStr == '@@') {
            //生成踏板
            let foot = this.addBuilding(Logic.getBuildings(BuildingManager.FOOTBOARD), indexPos);
            foot.zIndex = IndexZ.FLOOR;
            this.footboards.push(foot.getComponent(FootBoard));
        } else if (mapDataStr == '@S') {
            //生成存档点
            let save = this.addBuilding(Logic.getBuildings(BuildingManager.SAVEPOINT), indexPos);
            this.savePointS = save.getComponent(SavePoint);
        } else if (this.isFirstEqual(mapDataStr, 'B')) {
            //生成木盒子 并且根据之前记录的位置放置
            this.addBox(mapDataStr, indexPos);
        } else if (mapDataStr == 'C0') {
            //生成宝箱 房间清理的情况下箱子是打开的
            this.addChest(indexPos);
        } else if (this.isFirstEqual(mapDataStr, 'D')) {
            //生成门
            this.addDoor(mapDataStr, indexPos, false);
        } else if (this.isFirstEqual(mapDataStr, 'E')) {
            //生成出口
            this.addExitDoor(mapDataStr, indexPos, exits);
        } else if (mapDataStr == 'F0') {
            //生成落石
            this.addFallStone(Dungeon.getPosInMap(indexPos), false);
        } else if (mapDataStr == 'F1') {
            //生成落雷
            this.addLighteningFall(Dungeon.getPosInMap(indexPos), true, true, true);
        } else if (this.isFirstEqual(mapDataStr, 'G')) {
            //生成炮台
            let em = this.addBuilding(Logic.getBuildings(BuildingManager.EMPLACEMENT), indexPos).getComponent(Emplacement);
            em.setDirType(mapDataStr);
            em.dungeon = dungeon;
        } else if (this.isFirstEqual(mapDataStr, 'H')) {
            //生成可打击建筑
            this.addHitBuilding(dungeon, mapDataStr, indexPos)
        } else if (mapDataStr == 'I0') {
            //生成通风管
            let p = this.addBuilding(Logic.getBuildings(BuildingManager.WENTLINE), indexPos).getComponent(MgWentLine);
            p.init(dungeon, 5, 3, [MonsterManager.MONSTER_ZOOMBIE, MonsterManager.MONSTER_BITE_ZOMBIE]);
            this.monsterGeneratorList.push(p);
        } else if (mapDataStr == 'I6') {
            //生成墙缝
            let p = this.addBuilding(Logic.getBuildings(BuildingManager.CRACK), indexPos).getComponent(MgCrack);
            p.init(dungeon, 0.5, 15, [MonsterManager.MONSTER_SCARAB]);
            this.monsterGeneratorList.push(p);
        } else if (this.isFirstEqual(mapDataStr, 'J')) {

        } else if (this.isFirstEqual(mapDataStr, 'K')) {

        } else if (this.isFirstEqual(mapDataStr, 'L')) {
            //生成灯
            this.addLamp(mapDataStr, indexPos)
        } else if (this.isFirstEqual(mapDataStr, 'O')) {
            //生成顶部栏
            let head = this.addBuilding(Logic.getBuildings(BuildingManager.DECORATIONOVERHEAD), indexPos);
            if (mapDataStr == 'O1') {
                head.angle = 90;
            }
            head.opacity = 80;
            head.zIndex = IndexZ.ROOF;
        } else if (this.isFirstEqual(mapDataStr, 'P')) {
            //生成传送门
            let p = this.addBuilding(Logic.getBuildings(BuildingManager.PORTAL), indexPos);
            let i = parseInt(mapDataStr[1]);
            let portal = p.getComponent(Portal);
            portal.isBackDream = i > 0;
            this.portals.push(portal);
        } else if (mapDataStr == 'Q0') {
            //生成塔罗
            this.addBuilding(Logic.getBuildings(BuildingManager.TAROTTABLE), indexPos);
        } else if (mapDataStr == 'R0') {
            let node = this.addBuilding(Logic.getBuildings(BuildingManager.SHIPSTAIRS), indexPos);
            node.setScale(16);
            node.zIndex = IndexZ.WALLINTERNAL;
        }
        else if (mapDataStr == 'R1') {
            //生成楼梯
            let node = this.addBuilding(Logic.getBuildings(BuildingManager.SHIPSTAIRS), indexPos);
            node.setScale(-16, 16);
            node.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(-8, 0);
            node.getComponent(cc.PhysicsBoxCollider).apply();
            node.zIndex = IndexZ.WALLINTERNAL;
        } else if (mapDataStr == 'S0') {
            //生成商店
            this.addShopTable(indexPos);
        } else if (mapDataStr == 'S1') {
            //生成店主
            this.addBuilding(Logic.getBuildings(BuildingManager.SHOP), indexPos);
        } else if (mapDataStr == 'S2') {
            //生成有家
            let mart = this.addBuilding(Logic.getBuildings(BuildingManager.SHOPMART), indexPos);
            mart.zIndex += 10;
        } else if (mapDataStr == 'Sa' || mapDataStr == 'Sb' || mapDataStr == 'Sc') {
            //生成货架
            this.addMartShelves(mapDataStr, indexPos);
        } else if (mapDataStr == 'Sd') {
            //生成收银台
            this.addBuilding(Logic.getBuildings(BuildingManager.MARTCASHIER), indexPos);
            let pos = Dungeon.getPosInMap(indexPos);
            dungeon.nonPlayerManager.addNonPlayerFromData(NonPlayerManager.SHOP_KEEPER, cc.v3(pos.x - 60, pos.y + 180), dungeon);
        } else if (mapDataStr == 'Se') {
            //生成餐桌
            this.addBuilding(Logic.getBuildings(BuildingManager.MARTTABLE), indexPos);
        } else if (mapDataStr == 'T0') {
            //生成陷阱
            this.addBuilding(Logic.getBuildings(BuildingManager.TRAP), indexPos);
        } else if (this.isFirstEqual(mapDataStr, 'W')) {
            //生成可破坏装饰 并且根据之前记录的位置放置
            this.addInteractBuilding(mapDataStr, indexPos);
        } else if (mapDataStr == 'X0') {
            //生成电锯,占据5个格子
            let saw = this.addBuilding(Logic.getBuildings(BuildingManager.SAW), indexPos);
            saw.getComponent(Saw).setPos(indexPos);
        } else if (this.isFirstEqual(mapDataStr, 'Z')) {
            if (parseInt(mapDataStr[1]) == 0 || parseInt(mapDataStr[1]) == 1) {
                let p = this.addBuilding(Logic.getBuildings(BuildingManager.ROOMBED), indexPos);
                let rb = p.getComponent(RoomBed);
                rb.init(dungeon, parseInt(mapDataStr[1]) == 1);
            } else {
                //生成可打击建筑
                this.addHitBuilding(dungeon, mapDataStr, indexPos);
            }

        }
    }
    public addBuildingsFromSideMap(mapDataStr: string, indexPos: cc.Vec3, levelData: LevelData) {
        if (this.isFirstEqual(mapDataStr, '#')) {
            //生成墙
            this.addDirWalls(mapDataStr, indexPos, levelData, true);
        } else if (this.isFirstEqual(mapDataStr, '-')) {
            //生成黑暗
            let dn = this.addBuilding(Logic.getBuildings(BuildingManager.DARKNESS), indexPos);
            dn.zIndex = IndexZ.DARKNESS;
            if (mapDataStr == '-0') {
                dn.zIndex = IndexZ.ROOF;
            }
        } else if (this.isFirstEqual(mapDataStr, '~')) {
            //生成水
            this.addWater(mapDataStr, indexPos);
        } else if (mapDataStr == '+3') {
            //生成汽艇
            this.addBuilding(Logic.getBuildings(BuildingManager.AIRTRANSPORTMODEL), indexPos);
        } else if (this.isFirstEqual(mapDataStr, 'D')) {
            //生成门
            this.addDoor(mapDataStr, indexPos, true);
        }
    }
    private addInteractBuilding(mapDataStr: string, indexPos: cc.Vec3) {
        let saveBox = Logic.mapManager.getCurrentMapBuilding(indexPos);
        let isReborn = Logic.mapManager.getCurrentRoom().isReborn;
        if (saveBox) {
            //生命值大于0才生成
            if (saveBox.currentHealth > 0 || isReborn) {
                let interactBuilding = this.addBuilding(Logic.getBuildings(BuildingManager.INTERACTBUILDING), indexPos);
                let d = interactBuilding.getComponent(InteractBuilding);
                d.node.position = saveBox.position.clone();
                d.data.valueCopy(saveBox);
                if (isReborn) {
                    d.node.position = Dungeon.getPosInMap(d.data.defaultPos);
                    d.data.currentHealth = d.data.maxHealth;
                }
                d.init(true, parseInt(mapDataStr[1]));
                this.interactBuildings.push(d);
            }
        } else {
            let interactBuilding = this.addBuilding(Logic.getBuildings(BuildingManager.INTERACTBUILDING), indexPos);
            let d = interactBuilding.getComponent(InteractBuilding);
            d.data.currentHealth = 5;
            Logic.mapManager.setCurrentBuildingData(d.data.clone());
            d.init(true, parseInt(mapDataStr[1]));
            this.interactBuildings.push(d);
        }
    }
    private addBox(mapDataStr: string, indexPos: cc.Vec3) {
        let box = this.addBuilding(Logic.getBuildings(BuildingManager.BOX), indexPos);
        let b = box.getComponent(Box)
        b.setDefaultPos(indexPos);
        //生成植物
        if (mapDataStr == 'B1') {
            b.boxType = Box.PLANT;
        }
        //设置对应存档盒子的位置
        let saveBox = Logic.mapManager.getCurrentMapBuilding(b.data.defaultPos);
        if (saveBox) {
            b.node.position = saveBox.position.clone();
        } else {
            Logic.mapManager.setCurrentBuildingData(b.data.clone());
        }
    }
    private addShopTable(indexPos: cc.Vec3) {
        let table = this.addBuilding(Logic.getBuildings(BuildingManager.SHOPTABLE), indexPos);
        let ta = table.getComponent(ShopTable);
        ta.setDefaultPos(indexPos);
        let isReborn = Logic.mapManager.getCurrentRoom().isReborn;
        let rand4save = Logic.mapManager.getRandom4Save(ta.seed);
        ta.data.shopType = rand4save.getRandomNum(0, 100) > 10 ? ShopTable.EQUIPMENT : ShopTable.ITEM;
        let saveTable = Logic.mapManager.getCurrentMapBuilding(ta.data.defaultPos);
        if (saveTable) {
            if (isReborn && saveTable.isSaled) {
                saveTable.isSaled = false;
                saveTable.equipdata = null;
                saveTable.itemdata = null;
                rand4save = Logic.mapManager.getRandom4Save(Logic.mapManager.getRebornSeed(ta.seed));
                saveTable.shopType = rand4save.getRandomNum(0, 100) > 10 ? ShopTable.EQUIPMENT : ShopTable.ITEM;
            }
            ta.data.valueCopy(saveTable);
        } else {
            Logic.mapManager.setCurrentBuildingData(ta.data.clone());
        }
        ta.showItem();
    }
    private addChest(indexPos: cc.Vec3) {
        let chest = this.addBuilding(Logic.getBuildings(BuildingManager.CHEST), indexPos);
        let c = chest.getComponent(Chest)
        c.seDefaultPos(indexPos);
        let rand4save = Logic.mapManager.getRandom4Save(c.seed);
        let rand = rand4save.rand();
        let quality = 1;
        if (rand > 0.5 && rand < 0.7) {
            quality = 2;
        } else if (rand > 0.7 && rand < 0.8) {
            quality = 3;
        } else if (rand > 0.8 && rand < 0.85) {
            quality = 4;
        }
        c.setQuality(quality, false);
        let saveChest = Logic.mapManager.getCurrentMapBuilding(c.data.defaultPos);
        if (saveChest) {
            c.setQuality(saveChest.quality, saveChest.isOpen);
        } else {
            Logic.mapManager.setCurrentBuildingData(c.data.clone());
        }
    }
    private addDecorate(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3) {
        if (mapDataStr == '+0') {
            //生成营火
            let camp = this.addBuilding(Logic.getBuildings(BuildingManager.CAMPFIRE), indexPos);
            camp.parent = this.node;
            let shadow = camp.getChildByName('sprite').getChildByName('shadow');
            shadow.position = Dungeon.getPosInMap(indexPos);
            shadow.position = cc.v3(shadow.position.x, shadow.position.y + 40);
            shadow.parent = this.node;
            shadow.zIndex = IndexZ.FLOOR;
            let fallentree = camp.getChildByName('sprite').getChildByName('fallentree');
            fallentree.position = Dungeon.getPosInMap(indexPos);
            fallentree.position = cc.v3(shadow.position.x, shadow.position.y + 40);
            fallentree.parent = this.node;
            fallentree.zIndex = IndexZ.getActorZIndex(fallentree.position);
            fallentree.setScale(6, 4);
        } else if (mapDataStr == '+1') {

        } else if (mapDataStr == '+2') {
            let arrow = this.addBuilding(Logic.getBuildings(BuildingManager.DECORATIONFLOOR), indexPos);
            arrow.zIndex = IndexZ.FLOOR;
            arrow.getComponent(DecorationFloor).changeRes('exitarrow');
        } else if (mapDataStr == '+3') {
            this.addBuilding(Logic.getBuildings(BuildingManager.AIRTRANSPORTMODEL), indexPos);
        } else if (mapDataStr == '+4') {
            this.addPracticeEquipItem(dungeon, indexPos);
        } else if (mapDataStr == '+a') {
            this.addBuilding(Logic.getBuildings(BuildingManager.GRASS01), indexPos);
        } else if (mapDataStr == '+b') {
            this.addBuilding(Logic.getBuildings(BuildingManager.GRASS02), indexPos);
        } else if (mapDataStr == '+c') {
            this.addBuilding(Logic.getBuildings(BuildingManager.GRASS03), indexPos);
        } else if (mapDataStr == '+d') {
            this.addBuilding(Logic.getBuildings(BuildingManager.GRASS04), indexPos);
        } else {
            let fd = this.addBuilding(Logic.getBuildings(BuildingManager.DECORATIONFLOOR), indexPos);
            fd.zIndex = IndexZ.FLOOR;
            let df = fd.getComponent(DecorationFloor);
            if (mapDataStr == '++') {
                df.changeRes('exitarrow');
            } else {
                df.changeRes('dev');
            }
        }
    }
    private addWater(mapDataStr: string, indexPos: cc.Vec3) {
        let pint = parseInt(mapDataStr[1]);
        if (pint >= 0 && pint <= 9 || mapDataStr == '~a' || mapDataStr == '~b') {
            let co = this.addBuilding(Logic.getBuildings(BuildingManager.COAST), indexPos);
            let pbc = co.getComponent(cc.PhysicsBoxCollider);
            let fint = pint;
            if (mapDataStr == '~a') {
                fint = 10;
            } else if (mapDataStr == '~b') {
                fint = 11;
            }
            co.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes(`coast00${fint}`);
            let arr = this.coastColliderList[fint].split(',');
            pbc.size = cc.size(parseInt(arr[0]), parseInt(arr[1]));
            pbc.offset = cc.v2(parseInt(arr[2]), parseInt(arr[3]));
            pbc.apply();
            co.zIndex = IndexZ.WATER;
        } else {
            let dn = this.addBuilding(Logic.getBuildings(mapDataStr == '~#' ? BuildingManager.WATERCOLLIDER : BuildingManager.WATER), indexPos);
            dn.zIndex = IndexZ.WATER;
        }
    }
    private addLamp(mapDataStr: string, indexPos: cc.Vec3) {
        let prefabName = BuildingManager.LAMPLIGHT;
        let isOverHead = false;
        switch (mapDataStr) {
            case 'L0': prefabName = BuildingManager.LAMPLIGHT; break;
            case 'L1': prefabName = BuildingManager.LAMPSUN; isOverHead = true; break;
            case 'L2': prefabName = BuildingManager.LAMPSHIP; isOverHead = true; break;
            case 'L3': prefabName = BuildingManager.MUSHROOM01; break;
            case 'L4': prefabName = BuildingManager.MUSHROOM02; break;
            case 'L5': prefabName = BuildingManager.MUSHROOM03; break;
            case 'L6': prefabName = BuildingManager.MUSHROOM04; break;
            case 'L7': prefabName = BuildingManager.LAMPSEARCH; isOverHead = true; break;
            case 'L8': prefabName = BuildingManager.LAMPTORCH; isOverHead = true; break;
            case 'L9': prefabName = BuildingManager.LAMPFIREPAN; break;
            case 'La': prefabName = BuildingManager.LAMPROAD; break;
            case 'Lb': prefabName = BuildingManager.LAMPFIREFLY; break;
        }
        let node = this.addBuilding(Logic.getBuildings(prefabName), indexPos);
        if (isOverHead) {
            node.zIndex = IndexZ.OVERHEAD + 100;
        }
    }
    private getGoodsList(type: string): string[] {
        if (this.foodList.length < 1 && this.drinkList.length < 1) {
            let prefix = 'goods';
            for (let goods of Logic.goodsNameList) {
                let index = goods.substring(prefix.length, prefix.length + 1);
                if (index == '0') {
                    this.drinkList.push(goods);
                } else if (index == '1') {
                    this.foodList.push(goods);
                }
            }
        }
        if (type == MartShelves.TYPE_FRIDGE) {
            let tempdrinks: string[] = [];
            for (let i = this.shelvesDrinkIndex % MartShelves.SIZE_FRIDGE; i < MartShelves.SIZE_FRIDGE; i++) {
                if (this.shelvesDrinkIndex < this.drinkList.length) {
                    tempdrinks.push(this.drinkList[this.shelvesDrinkIndex++]);
                }
            }
            return tempdrinks;
        } else {
            let tempfoods: string[] = [];
            for (let i = this.shelvesFoodIndex % MartShelves.SIZE_NORMAL; i < MartShelves.SIZE_NORMAL; i++) {
                if (this.shelvesFoodIndex < this.foodList.length) {
                    tempfoods.push(this.foodList[this.shelvesFoodIndex++]);
                }
            }
            return tempfoods;
        }
    }
    private addMartShelves(mapDataStr: string, indexPos: cc.Vec3) {
        //生成货架
        let ms = this.addBuilding(mapDataStr == MartShelves.TYPE_FRIDGE ? Logic.getBuildings(BuildingManager.MARTFRIDGE) : Logic.getBuildings(BuildingManager.MARTSHELVES), indexPos).getComponent(MartShelves);
        ms.init(mapDataStr, this.getGoodsList(mapDataStr));
    }
    private addExitDoor(mapDataStr: string, indexPos: cc.Vec3, exits: ExitData[]) {
        let dir = parseInt(mapDataStr[1]);
        if (isNaN(dir)) {
            if (mapDataStr == 'Ea') {
                dir = 10;
            } else if (mapDataStr == 'Eb') {
                dir = 11;
            }
        }
        let d = ExitData.getRealWorldExitDataFromDream(Logic.chapterIndex, Logic.level);
        for (let e of exits) {
            if (e.fromPos.equals(indexPos) && e.fromRoomPos.equals(cc.v3(Logic.mapManager.getCurrentRoom().x, Logic.mapManager.getCurrentRoom().y))) {
                d.valueCopy(e);
                break;
            }
        }
        let p = this.addBuilding(Logic.getBuildings(BuildingManager.EXITDOOR), indexPos);
        let exitdoor = p.getComponent(ExitDoor);
        exitdoor.init(dir, d);
        this.exitdoors.push(exitdoor);
    }
    /**添加空气墙 */
    public addAirExit(mapData: string[][]) {
        let top = this.addBuilding(Logic.getBuildings(BuildingManager.AIREXIT), cc.v3(Math.floor(mapData.length / 2), mapData[0].length)).getComponent(AirExit);
        let bottom = this.addBuilding(Logic.getBuildings(BuildingManager.AIREXIT), cc.v3(Math.floor(mapData.length / 2), -1)).getComponent(AirExit);
        let left = this.addBuilding(Logic.getBuildings(BuildingManager.AIREXIT), cc.v3(-1, Math.floor(mapData[0].length / 2))).getComponent(AirExit);
        let right = this.addBuilding(Logic.getBuildings(BuildingManager.AIREXIT), cc.v3(mapData.length, Math.floor(mapData[0].length / 2))).getComponent(AirExit);
        this.airExits.push(top);
        this.airExits.push(bottom);
        this.airExits.push(left);
        this.airExits.push(right);
        for (let i = 0; i < this.airExits.length; i++) {
            this.airExits[i].init(i, i < 2 ? mapData.length + 2 : mapData[0].length + 2);
        }
    }
    private addDoor(mapDataStr: string, indexPos: cc.Vec3, isDecorate: boolean) {
        let dir = parseInt(mapDataStr[1]);
        if (isNaN(dir)) {
            if (mapDataStr == 'Da') {
                dir = 8;
            } else if (mapDataStr == 'Db') {
                dir = 9;
            } else if (mapDataStr == 'Dc') {
                dir = 10;
            } else if (mapDataStr == 'Dd') {
                dir = 11;
            }
        }
        let door = this.addBuilding(Logic.getBuildings(BuildingManager.DOOR), indexPos).getComponent(Door);
        door.isDoor = true;
        door.dir = dir % 4;
        door.isEmpty = dir > 3 && dir < 8;
        door.isLock = dir > 7;
        door.isDecorate = isDecorate;
        this.doors.push(door);
    }
    public setDoors(isOpen: boolean, immediately?: boolean) {
        for (let door of this.doors) {
            door.setOpen(isOpen, immediately);
        }
        for (let air of this.airExits) {
            air.changeStatus(isOpen ? AirExit.STATUS_OPEN : AirExit.STATUS_CLOSE);
        }
        if (this.exitdoors.length > 0) {
            for (let ed of this.exitdoors) {
                isOpen ? ed.openGate() : ed.closeGate();
            }
        }
        if (this.portals.length > 0) {
            for (let ed of this.portals) {
                isOpen ? ed.openGate() : ed.closeGate();
            }
        }
    }
    private addDirWalls(mapDataStr: string, indexPos: cc.Vec3, levelData: LevelData, onlyShow: boolean) {
        let node: cc.Node = this.addBuilding(Logic.getBuildings(BuildingManager.WALL), indexPos);
        let wall = node.getComponent(Wall);
        wall.init(mapDataStr, levelData, onlyShow);
    }
    /**生成可打击建筑 */
    private addHitBuilding(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3) {
        let hitBuilding: cc.Node;
        let isCustom = false;
        if (mapDataStr == 'Z3') {
            hitBuilding = this.addBuilding(Logic.getBuildings(BuildingManager.ROOMTV), indexPos);
            isCustom = true;
        } else if (mapDataStr == 'Z9') {
            hitBuilding = this.addBuilding(Logic.getBuildings(BuildingManager.ROOMSTOOL), indexPos);
            hitBuilding.getComponent(RoomStool).init(indexPos, dungeon);
            isCustom = true;
        } else {
            hitBuilding = this.addBuilding(Logic.getBuildings(BuildingManager.HITBUILDING), indexPos);
        }
        let h = hitBuilding.getComponent(HitBuilding);
        h.setDefaultPos(indexPos);
        let resName = 'car';
        let equipmentNames = [];
        let itemNames = [];
        let maxhealth = 9999;
        let scale = 4;
        let colliderExtrude = 0;
        switch (mapDataStr) {
            case 'H0': resName = 'car'; equipmentNames = ['shield001']; itemNames = []; maxhealth = 5; scale = 8; colliderExtrude = 3; break;
            case 'Z2': resName = 'roomdesk'; scale = 6; break;
            case 'Z3': resName = 'roomtv'; scale = 6; break;
            case 'Z4': resName = 'roomsofa'; scale = 10; colliderExtrude = 2; break;
            case 'Z5': resName = 'roomtable'; scale = 10; colliderExtrude = 4; break;
            case 'Z6': resName = 'roomfridge'; scale = 6; colliderExtrude = 7; break;
            case 'Z7': resName = 'roomwash'; colliderExtrude = 1; break;
            case 'Z8': resName = 'roomcupboard'; equipmentNames = ['weapon007']; itemNames = []; maxhealth = 20; scale = 6; colliderExtrude = 2; break;
            case 'Z9': resName = 'roomstool'; break;
            case 'Za': resName = 'roomkitchentable'; scale = 6; colliderExtrude = 2; break;
            case 'Zb': resName = 'roomkitchentable1'; colliderExtrude = 2; break;
            case 'Zc': resName = 'roomkitchentable2'; colliderExtrude = 2; break;
            case 'Zd': resName = 'roomkitchentable3'; colliderExtrude = 2; break;
            case 'Ze': resName = 'roombath'; colliderExtrude = 2; break;
            case 'Zf': resName = 'roomlittletable'; colliderExtrude = 6; break;
            case 'Zg': resName = 'roomlittletable1'; colliderExtrude = 6; break;
            case 'Zh': resName = 'roomlittletable2'; colliderExtrude = 6; break;

            default: break;
        }
        h.init(dungeon, resName, itemNames, equipmentNames, maxhealth, maxhealth, scale, isCustom, colliderExtrude);
        let saveHit = Logic.mapManager.getCurrentMapBuilding(h.data.defaultPos);
        if (saveHit) {
            h.init(dungeon, resName, itemNames, equipmentNames, maxhealth, saveHit.currentHealth, scale, isCustom, colliderExtrude);
        } else {
            Logic.mapManager.setCurrentBuildingData(h.data.clone());
        }
    }

    /**掉落石头 */
    addFallStone(pos: cc.Vec3, isAuto: boolean, withFire?: boolean) {
        if (!this.node) {
            return;
        }
        let stone = cc.instantiate(Logic.getBuildings(BuildingManager.FALLSTONE));
        let stoneScript = stone.getComponent(FallStone);
        stoneScript.isAuto = isAuto;
        stone.parent = this.node;
        stone.position = pos;
        stone.zIndex = IndexZ.FLOOR;
        if (stoneScript.isAuto) {
            stoneScript.fall(withFire);
        }

    }
    /**落雷 */
    addLighteningFall(pos: cc.Vec3, isTrigger: boolean, needPrepare: boolean, showArea: boolean, damagePoint?: number) {
        if (!this.node) {
            return;
        }
        let fall = cc.instantiate(Logic.getBuildings(BuildingManager.LIGHTENINGFALL));
        let fallScript = fall.getComponent(MagicLightening);
        fall.parent = this.node;
        fall.position = pos;
        fall.zIndex = IndexZ.FLOOR;
        fallScript.isTrigger = isTrigger;
        if (!fallScript.isTrigger) {
            fallScript.fall(needPrepare, showArea, damagePoint);
        }
    }
    /**树根缠绕 */
    public addTwineGrass(pos: cc.Vec3, isAuto: boolean) {
        if (!this.node) {
            return;
        }
        let grass = cc.instantiate(Logic.getBuildings(BuildingManager.DRYADTWINE));
        let dryadGrassScript = grass.getComponent(DryadGrass);
        dryadGrassScript.isAuto = isAuto;
        grass.parent = this.node;
        grass.position = pos;
        grass.zIndex = IndexZ.getActorZIndex(pos);
        if (dryadGrassScript.isAuto) {
            dryadGrassScript.fall();
        }
    }
    /**幽光护盾 */
    public addEnergyShield(player: Player): EnergyShield {
        if (!this.node) {
            return null;
        }
        let shield = this.addBuilding(Logic.getBuildings(BuildingManager.ENERGYSHIELD), player.pos);
        shield.position = player.node.position.clone();
        let script = shield.getComponent(EnergyShield);
        let scale = 8 + Math.floor(Logic.playerData.OilGoldData.level / 5);
        script.init(player, 20 + Logic.playerData.OilGoldData.level * 5, scale);
        return script;
    }
    private addPracticeEquipItem(dungeon: Dungeon, indexPos: cc.Vec3) {
        if (dungeon) {
            dungeon.addEquipment(EquipmentManager.WEAPON_WOOD_SWORD, Dungeon.getPosInMap(indexPos.add(cc.v3(-2, 0))));
            dungeon.addEquipment(EquipmentManager.WEAPON_WOOD_SPEAR, Dungeon.getPosInMap(indexPos.add(cc.v3(-1, 0))));
            dungeon.addEquipment(EquipmentManager.WEAPON_WOOD_DAGGER, Dungeon.getPosInMap(indexPos));
            dungeon.addEquipment(EquipmentManager.WEAPON_WOOD_HAMMER, Dungeon.getPosInMap(indexPos.add(cc.v3(1, 0))));
            dungeon.addEquipment(EquipmentManager.WEAPON_WOOD_LONG_CROSS, Dungeon.getPosInMap(indexPos.add(cc.v3(2, 0))));
            dungeon.addEquipment(EquipmentManager.WEAPON_WOOD_LONG_STICK, Dungeon.getPosInMap(indexPos.add(cc.v3(-3, 0))));
        }
    }
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.2) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    updateLogic(dt: number, player: Player) {
        if (this.isCheckTimeDelay(dt)) {
            let distance = 200;
            let building: InteractBuilding = null;
            for (let i = this.interactBuildings.length - 1; i >= 0; i--) {
                let b = this.interactBuildings[i];
                b.highLight(false);
                if (b.isTaken || !b.isValid || b.data.currentHealth <= 0) {
                    continue;
                }
                let d = Logic.getDistance(b.node.position, player.node.position);
                if (d < distance) {
                    distance = d;
                    building = b;
                }
            }
            if (distance < 96 && building) {
                building.highLight(true);
                this.lastInteractBuilding = building;
            } else {
                this.lastInteractBuilding = null;
            }
        }
    }
}
