import Dungeon from "../Dungeon";
import Logic from "../Logic";
import FootBoard from "../Building/FootBoard";
import IndexZ from "../Utils/IndexZ";
import Saw from "../Building/Saw";
import Emplacement from "../Building/Emplacement";
import DecorationFloor from "../Building/DecorationFloor";
import Chest from "../Building/Chest";
import Box from "../Building/Box";
import Decorate from "../Building/Decorate";
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


    // LIFE-CYCLE CALLBACKS:

    // update (dt) {}

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Prefab)
    wall: cc.Prefab = null;
    @property(cc.Prefab)
    trap: cc.Prefab = null;
    @property(cc.Prefab)
    fallStone: cc.Prefab = null;
    @property(cc.Prefab)
    lighteningFall: cc.Prefab = null;
    @property(cc.Prefab)
    emplacement: cc.Prefab = null;
    @property(cc.Prefab)
    footboard: cc.Prefab = null;
    @property(cc.Prefab)
    chest: cc.Prefab = null;
    @property(cc.Prefab)
    box: cc.Prefab = null;
    @property(cc.Prefab)
    decorate: cc.Prefab = null;
    @property(cc.Prefab)
    shop: cc.Prefab = null;
    @property(cc.Prefab)
    shoptable: cc.Prefab = null;
    @property(cc.Prefab)
    portal: cc.Prefab = null;
    @property(cc.Prefab)
    hitBuilding: cc.Prefab = null;
    @property(cc.Prefab)
    bed: cc.Prefab = null;
    @property(cc.Prefab)
    campFire: cc.Prefab = null;
    @property(cc.Prefab)
    tarotTable: cc.Prefab = null;
    @property(cc.Prefab)
    saw: cc.Prefab = null;
    @property(cc.Prefab)
    floorDecoration: cc.Prefab = null;
    @property(cc.Prefab)
    overHeadDecorate: cc.Prefab = null;
    @property(cc.Prefab)
    exitdoorPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    door: cc.Prefab = null;
    @property(cc.Prefab)
    darkness: cc.Prefab = null;
    @property(cc.Prefab)
    airexit: cc.Prefab = null;
    @property(cc.Prefab)
    water: cc.Prefab = null;
    @property(cc.Prefab)
    coast: cc.Prefab = null;
    @property(cc.Prefab)
    airTranspotModel: cc.Prefab = null;
    @property(cc.Prefab)
    roomBed: cc.Prefab = null;
    @property(cc.Prefab)
    mist: cc.Prefab = null;
    @property(cc.Prefab)
    shipStairs: cc.Prefab = null;
    @property(cc.Prefab)
    dryadGrass: cc.Prefab = null;
    @property(cc.Prefab)
    roomTv:cc.Prefab = null;
    @property(cc.Prefab)
    savePoint:cc.Prefab = null;
    @property(cc.Prefab)
    shopMart:cc.Prefab = null;
    @property(cc.Prefab)
    martShelves:cc.Prefab = null;
    @property(cc.Prefab)
    martCashier:cc.Prefab = null;
    @property(cc.Prefab)
    martTable:cc.Prefab = null;
    @property(cc.Prefab)
    martFridge:cc.Prefab = null;
    footboards: FootBoard[] = new Array();
    exitdoors: ExitDoor[] = new Array();
    portals: Portal[] = new Array();
    doors: Door[] = new Array();
    airExits: AirExit[] = new Array();
    savePointS:SavePoint;
    coastColliderList = ['128,128,0,0', '128,128,0,0', '128,128,0,0', '128,128,0,0', '128,64,0,-32', '128,64,0,32'
        , '64,128,32,0', '64,128,-32,0', '64,64,-32,32', '64,64,32,32', '64,64,-32,-32', '64,64,32,-32'];

    clear(): void {
        Utils.clearComponentArray(this.footboards);
        Utils.clearComponentArray(this.exitdoors);
        Utils.clearComponentArray(this.portals);
        Utils.clearComponentArray(this.doors);
        Utils.clearComponentArray(this.airExits);
        this.footboards = new Array();
        this.exitdoors = new Array();
        this.portals = new Array();
        this.doors = new Array();
        this.airExits = new Array();
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
            b.data.defaultPos = indexPos.clone();
            b.lights = b.getComponentsInChildren(ShadowOfSight);
            if(b.lights){
                LightManager.registerLight(b.lights);
            }
        }
        return building;
    }
    public addBuildingsFromMap(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3, levelData: LevelData, exits: ExitData[]) {
        if (this.isFirstEqual(mapDataStr, '*')) {
            let offset = cc.v3(0, 0);
            if (indexPos.x == Dungeon.WIDTH_SIZE - 1) {
                offset = cc.v3(1, 0);
            } else if (indexPos.x == 0) {
                offset = cc.v3(-1, 0);
            } else if (indexPos.y == Dungeon.HEIGHT_SIZE - 1) {
                offset = cc.v3(0, 1);
            } else if (indexPos.y == 0) {
                offset = cc.v3(0, -1);
            }
            if (offset.x != 0 || offset.y != 0) {
                this.addBuilding(this.mist, cc.v3(indexPos.x + offset.x, indexPos.y + offset.y)).zIndex = IndexZ.OVERHEAD;
            }
        } else if (this.isFirstEqual(mapDataStr, '#')) {
            //生成墙
            this.addDirWalls(mapDataStr, indexPos, levelData);
        } else if (this.isFirstEqual(mapDataStr, '-')) {
            let dn = this.addBuilding(this.darkness, indexPos);
            dn.zIndex = IndexZ.DARKNESS;
            if (mapDataStr == '-0') {
                dn.zIndex = IndexZ.ROOF;
            }
        } else if (this.isFirstEqual(mapDataStr, '~')) {
            let pint = parseInt(mapDataStr[1]);
            if (pint >= 0 && pint <= 9 || mapDataStr == '~a' || mapDataStr == '~b') {
                let co = this.addBuilding(this.coast, indexPos);
                let pbc = co.getComponent(cc.PhysicsBoxCollider);
                let fint = pint;
                if (mapDataStr == '~a') {
                    fint = 10;
                } else if (mapDataStr == '~b') {
                    fint = 11;
                }
                co.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes(`coast00${fint}`);
                let arr = this.coastColliderList[fint].split(',');
                pbc.size = cc.size(parseInt(arr[0]), parseInt(arr[1]));
                pbc.offset = cc.v2(parseInt(arr[2]), parseInt(arr[3]));
                pbc.apply();
                co.zIndex = IndexZ.WALL;
            } else {
                let dn = this.addBuilding(this.water, indexPos);
                dn.zIndex = IndexZ.WALL;
            }

        } else if (mapDataStr == 'T0') {
            //生成陷阱
            this.addBuilding(this.trap, indexPos);
        } else if (mapDataStr == 'X0') {
            //生成电锯,占据5个格子
            let saw = this.addBuilding(this.saw, indexPos);
            saw.getComponent(Saw).setPos(indexPos);
        } else if (this.isFirstEqual(mapDataStr, 'G')) {
            //生成炮台
            let em = this.addBuilding(this.emplacement, indexPos).getComponent(Emplacement);
            em.setDirType(mapDataStr);
            em.dungeon = dungeon;
        } else if (mapDataStr == 'F0') {
            //生成落石
            this.addFallStone(Dungeon.getPosInMap(indexPos), false);
        } else if (mapDataStr == 'F1') {
            //生成落雷
            this.addLighteningFall(Dungeon.getPosInMap(indexPos), true, true, true);
        } else if (this.isFirstEqual(mapDataStr, '+')) {
            //生成装饰
            if (mapDataStr == '+0') {
                //生成营火
                let camp = this.addBuilding(this.campFire, indexPos);
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
                if (Logic.level == 0) {
                    let bed = this.addBuilding(this.bed, indexPos);
                    bed.scale = 6;
                    bed.zIndex = IndexZ.OVERHEAD;
                }
            } else if (mapDataStr == '+2') {
                let arrow = this.addBuilding(this.floorDecoration, indexPos);
                arrow.zIndex = IndexZ.FLOOR;
                arrow.getComponent(DecorationFloor).changeRes('exitarrow');
            } else if (mapDataStr == '+3') {
                this.addBuilding(this.airTranspotModel, indexPos);
            } else {
                let fd = this.addBuilding(this.floorDecoration, indexPos);
                fd.zIndex = IndexZ.FLOOR;
                let df = fd.getComponent(DecorationFloor);
                if (mapDataStr == '++') {
                    df.changeRes('exitarrow');
                } else {
                    df.changeRes('dev');
                }
            }
        } else if (this.isFirstEqual(mapDataStr, 'O')) {
            //生成顶部栏
            let head = this.addBuilding(this.overHeadDecorate, indexPos);
            if (mapDataStr == 'O1') {
                head.angle = 90;
            }
            head.opacity = 128;
            head.zIndex = IndexZ.ROOF;
        } else if (mapDataStr == '@@') {
            //生成踏板
            let foot = this.addBuilding(this.footboard, indexPos);
            foot.zIndex = IndexZ.FLOOR;
            this.footboards.push(foot.getComponent(FootBoard));
        } else if (mapDataStr == 'Q0') {
            //生成塔罗
            this.addBuilding(this.tarotTable, indexPos);
        } else if (mapDataStr == 'C0') {
            //生成宝箱 房间清理的情况下箱子是打开的
            let chest = this.addBuilding(this.chest, indexPos);
            let c = chest.getComponent(Chest)
            c.seDefaultPos(indexPos);
            let rand4save = Logic.mapManager.getCurrentRoomRandom4Save();
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
                Logic.mapManager.setCurrentBuildingData(c.data);
            }
        } else if (this.isFirstEqual(mapDataStr, 'B')) {
            //生成木盒子 并且根据之前记录的位置放置
            let box = this.addBuilding(this.box, indexPos);
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
                Logic.mapManager.setCurrentBuildingData(b.data);
            }
        } else if (this.isFirstEqual(mapDataStr, 'W')) {
            //生成可破坏装饰 并且根据之前记录的位置放置
            let saveBox = Logic.mapManager.getCurrentMapBuilding(indexPos);
            if (saveBox) {
                //生命值小于1不生成
                if (saveBox.currentHealth > 0) {
                    let decorate = this.addBuilding(this.decorate, indexPos);
                    let d = decorate.getComponent(Decorate);
                    d.decorateType = parseInt(mapDataStr[1]);
                    d.node.position = saveBox.position.clone();
                }
            } else {
                let decorate = this.addBuilding(this.decorate, indexPos);
                let d = decorate.getComponent(Decorate);
                d.decorateType = parseInt(mapDataStr[1]);
                Logic.mapManager.setCurrentBuildingData(d.data);
            }
        } else if (mapDataStr == 'S0') {
            //生成商店
            let table = this.addBuilding(this.shoptable, indexPos);
            let ta = table.getComponent(ShopTable);
            ta.setDefaultPos(indexPos);
            let rand4save = Logic.mapManager.getCurrentRoomRandom4Save();
            ta.data.shopType = rand4save.rand() > 0.1 ? ShopTable.EQUIPMENT : ShopTable.ITEM;
            let saveTable = Logic.mapManager.getCurrentMapBuilding(ta.data.defaultPos);
            if (saveTable) {
                if (saveTable.equipdata) {
                    ta.data.equipdata = saveTable.equipdata.clone();
                }
                if (saveTable.itemdata) {
                    ta.data.itemdata = saveTable.itemdata.clone();
                }
                ta.data.isSaled = saveTable.isSaled;
                ta.data.shopType = saveTable.shopType;
                ta.data.price = saveTable.price;
                ta.showItem();
            } else {
                ta.showItem();
                Logic.mapManager.setCurrentBuildingData(ta.data);
            }
        } else if (mapDataStr == 'S1') {
            //生成店主
            this.addBuilding(this.shop, indexPos);
        } else if (mapDataStr == 'S2') {
            //生成有家
            let mart = this.addBuilding(this.shopMart, indexPos);
            mart.zIndex+=10;
        } else if (mapDataStr == 'Sa'||mapDataStr == 'Sb'||mapDataStr == 'Sc') {
            this.addMartShelves(mapDataStr,indexPos);
        } else if (mapDataStr == 'Sd') {
            //生成收银台
            this.addBuilding(this.martCashier, indexPos);
        } else if (mapDataStr == 'Se') {
            //生成餐桌
            this.addBuilding(this.martTable, indexPos);
        }  else if (this.isFirstEqual(mapDataStr, 'D')) {
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
            this.addDoor(dir, indexPos);
        } else if (this.isFirstEqual(mapDataStr, 'E')) {
            let dir = parseInt(mapDataStr[1]);
            if (isNaN(dir)) {
                if (mapDataStr == 'Ea') {
                    dir = 10;
                } else if (mapDataStr == 'Eb') {
                    dir = 11;
                }
            }
            this.addExitDoor(dir, indexPos, exits);
        } else if (this.isFirstEqual(mapDataStr, 'P')) {
            //生成传送门
            let p = this.addBuilding(this.portal, indexPos);
            let i = parseInt(mapDataStr[1]);
            let portal = p.getComponent(Portal);
            portal.isBackDream = i > 0;
            this.portals.push(portal);
        } else if (this.isFirstEqual(mapDataStr, 'Z')) {
            if (parseInt(mapDataStr[1]) == 0 || parseInt(mapDataStr[1]) == 1) {
                let p = this.addBuilding(this.roomBed, indexPos);
                let rb = p.getComponent(RoomBed);
                rb.init(dungeon, parseInt(mapDataStr[1]) == 1);
            } else {
                //生成可打击建筑
                this.addHitBuilding(dungeon, mapDataStr, indexPos);
            }

        } else if (this.isFirstEqual(mapDataStr, 'H')) {
            //生成可打击建筑
            this.addHitBuilding(dungeon, mapDataStr, indexPos)
        } else if (mapDataStr == 'R0') {
            let node = this.addBuilding(this.shipStairs, indexPos);
            node.setScale(16);
            node.zIndex = IndexZ.WALLINTERNAL;
        }
        else if (mapDataStr == 'R1') {
            let node = this.addBuilding(this.shipStairs, indexPos);
            node.setScale(-16, 16);
            node.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(-8, 0);
            node.getComponent(cc.PhysicsBoxCollider).apply();
            node.zIndex = IndexZ.WALLINTERNAL;
        } else if (mapDataStr == '@S') {
            //生成存档点
            let save = this.addBuilding(this.savePoint, indexPos);
            this.savePointS = save.getComponent(SavePoint);
        }
    }
    private addMartShelves(mapDataStr:string,indexPos:cc.Vec3){
        //生成货架
        let ms = this.addBuilding(mapDataStr==MartShelves.TYPE_FRIDGE?this.martFridge:this.martShelves, indexPos).getComponent(MartShelves);
        ms.init(mapDataStr);
    }
    private addExitDoor(dir: number, indexPos: cc.Vec3, exits: ExitData[]) {
        let d = ExitData.getRealWorldExitDataFromDream(Logic.chapterIndex, Logic.level);
        for (let e of exits) {
            if (e.fromPos.equals(indexPos) && e.fromRoomPos.equals(cc.v3(Logic.mapManager.getCurrentRoom().x, Logic.mapManager.getCurrentRoom().y))) {
                d.valueCopy(e);
                break;
            }
        }
        let p = this.addBuilding(this.exitdoorPrefab, indexPos);
        p.zIndex = IndexZ.ACTOR;
        let exitdoor = p.getComponent(ExitDoor);
        exitdoor.init(dir, d);
        this.exitdoors.push(exitdoor);
    }
    /**添加空气墙 */
    public addAirExit(mapData: string[][]) {
        let top = this.addBuilding(this.airexit, cc.v3(Math.floor(mapData.length / 2), mapData[0].length)).getComponent(AirExit);
        let bottom = this.addBuilding(this.airexit, cc.v3(Math.floor(mapData.length / 2), -1)).getComponent(AirExit);
        let left = this.addBuilding(this.airexit, cc.v3(-1, Math.floor(mapData[0].length / 2))).getComponent(AirExit);
        let right = this.addBuilding(this.airexit, cc.v3(mapData.length, Math.floor(mapData[0].length / 2))).getComponent(AirExit);
        this.airExits.push(top);
        this.airExits.push(bottom);
        this.airExits.push(left);
        this.airExits.push(right);
        for (let i = 0; i < this.airExits.length; i++) {
            this.airExits[i].init(i, i < 2 ? mapData.length + 2 : mapData[0].length + 2);
        }
    }
    private addDoor(mapDataStrIndex: number, indexPos: cc.Vec3) {
        let door = this.addBuilding(this.door, indexPos).getComponent(Door);
        door.node.zIndex = IndexZ.FLOOR;
        door.isDoor = true;
        switch (mapDataStrIndex % 4) {
            case 0: door.node.angle = 0; break;
            case 1: door.node.angle = 180; break;
            case 2: door.node.angle = 90; break;
            case 3: door.node.angle = -90; break;
        }
        door.dir = mapDataStrIndex % 4;
        door.isEmpty = mapDataStrIndex > 3 && mapDataStrIndex < 8;
        door.isLock = mapDataStrIndex > 7;
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
    private addDirWalls(mapDataStr: string, indexPos: cc.Vec3, levelData: LevelData) {
        let node: cc.Node = this.addBuilding(this.wall, indexPos);
        let wall = node.getComponent(Wall);
        wall.init(mapDataStr, levelData);
       

    }
    /**生成可打击建筑 */
    private addHitBuilding(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3) {
        let hitBuilding;
        if(mapDataStr == 'Z3'){
            hitBuilding = this.addBuilding(this.roomTv, indexPos);
        }else{
            hitBuilding = this.addBuilding(this.hitBuilding, indexPos);
        }
        let h = hitBuilding.getComponent(HitBuilding);
        h.setDefaultPos(indexPos);
        let resName = 'car';
        let equipmentNames = [];
        let itemNames = [];
        let maxhealth = 9999;
        let scale = 4;
        let hideShadow = false;
        switch (mapDataStr) {
            case 'H0': resName = 'car'; equipmentNames = ['shield001']; itemNames = []; maxhealth = 5; scale = 8; break;
            case 'Z2': resName = 'roomdesk'; equipmentNames = []; itemNames = ['goldfinger']; maxhealth = 100; break;
            case 'Z3': resName = 'roomtv'; scale = 6;break;
            case 'Z4': resName = 'roomsofa'; scale = 10; hideShadow = true;break;
            case 'Z5': resName = 'roomtable'; scale = 10; hideShadow = true;break;
            case 'Z6': resName = 'roomfridge'; scale = 6; break;
            case 'Z7': resName = 'roomwash'; break;
            case 'Z8': resName = 'roomcupboard'; equipmentNames = ['weapon007']; itemNames = []; maxhealth = 100; scale = 6; break;
            case 'Z9': resName = 'roomstool'; break;
            case 'Za': resName = 'roomkitchentable'; scale = 6; break;
            case 'Zb': resName = 'roomkitchentable1'; break;
            case 'Zc': resName = 'roomkitchentable2'; break;
            case 'Zd': resName = 'roomkitchentable3'; break;
            case 'Ze': resName = 'roombath'; break;
            case 'Zf': resName = 'roomlittletable'; break;
            case 'Zg': resName = 'roomlittletable1'; break;
            case 'Zh': resName = 'roomlittletable2'; break;

            default: break;
        }
        h.init(dungeon, resName, itemNames, equipmentNames, maxhealth, maxhealth, scale,hideShadow);
        let saveHit = Logic.mapManager.getCurrentMapBuilding(h.data.defaultPos);
        if (saveHit) {
            h.init(dungeon, resName, itemNames, equipmentNames, maxhealth, saveHit.currentHealth, scale,hideShadow);
        } else {
            Logic.mapManager.setCurrentBuildingData(h.data);
        }
    }

    /**掉落石头 */
    addFallStone(pos: cc.Vec3, isAuto: boolean, withFire?: boolean) {
        if (!this.fallStone) {
            return;
        }
        let stone = cc.instantiate(this.fallStone);
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
        if (!this.lighteningFall) {
            return;
        }
        let fall = cc.instantiate(this.lighteningFall);
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
        if (!this.dryadGrass) {
            return;
        }
        let grass = cc.instantiate(this.dryadGrass);
        let dryadGrassScript = grass.getComponent(DryadGrass);
        dryadGrassScript.isAuto = isAuto;
        grass.parent = this.node;
        grass.position = pos;
        grass.zIndex = IndexZ.getActorZIndex(pos);
        if (dryadGrassScript.isAuto) {
            dryadGrassScript.fall();
        }
    }
}
