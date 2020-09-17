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
export default class BuildingManager extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // update (dt) {}

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Prefab)
    wall: cc.Prefab = null;
    @property(cc.Prefab)
    corner: cc.Prefab = null;
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
    footboards: FootBoard[] = new Array();//踏板列表
    exitdoors: ExitDoor[] = new Array();
    portals: Portal[] = new Array();
    doors: Door[] = new Array();
    airExits: AirExit[] = new Array();
    coastColliderList = ['128,128,0,0', '128,64,0,32', '128,128,0,0', '64,128,-32,0', '64,128,32,0', '128,128,0,0'
        , '128,64,0,-32', '128,128,0,0', '64,64,-32,32', '64,64,32,-32', '64,64,-32,-32', '64,64,32,32'];

    private isThe(mapStr: string, typeStr: string): boolean {
        let isequal = mapStr.indexOf(typeStr) != -1;
        return isequal;
    }
    private addBuilding(prefab: cc.Prefab, indexPos: cc.Vec3): cc.Node {
        let building = cc.instantiate(prefab);
        building.parent = this.node;
        building.position = Dungeon.getPosInMap(indexPos);
        building.zIndex = IndexZ.getActorZIndex(building.position);
        return building;
    }
    public addBuildingsFromMap(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3, levelData: LevelData) {
        if (this.isThe(mapDataStr, '#')) {
            //生成墙
            // this.addWalls(mapData, i, j);
            this.addDirWalls(mapDataStr, indexPos, levelData);
        } else if (this.isThe(mapDataStr, '-')) {
            let dn = this.addBuilding(this.darkness, indexPos);
            dn.zIndex = IndexZ.WALL;
        } else if (this.isThe(mapDataStr, '~')) {
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
                co.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrames[`coast00${fint}`];
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
        } else if (this.isThe(mapDataStr, 'G')) {
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
        } else if (this.isThe(mapDataStr, '+')) {
            //生成装饰
            if (this.isThe(mapDataStr, '+0')) {
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
            } else if (this.isThe(mapDataStr, '+1')) {
                if (Logic.level == 0) {
                    let bed = this.addBuilding(this.bed, indexPos);
                    bed.scale = 6;
                    bed.zIndex = IndexZ.OVERHEAD;
                }
            } else if (this.isThe(mapDataStr, '+2')) {
                if (Logic.level == 0) {
                    let arrow = this.addBuilding(this.floorDecoration, indexPos);
                    arrow.zIndex = IndexZ.FLOOR;
                    arrow.getComponent(DecorationFloor).changeRes('exitarrow');
                }
            } else if (this.isThe(mapDataStr, '+3')) {
                let arrow = this.addBuilding(this.airTranspotModel, indexPos);
                arrow.zIndex = IndexZ.OVERHEAD;
            } else {
                let fd = this.addBuilding(this.floorDecoration, indexPos);
                fd.zIndex = IndexZ.FLOOR;
                let df = fd.getComponent(DecorationFloor);
                if (this.isThe(mapDataStr, '++')) {
                    df.changeRes('exitarrow');
                } else {
                    df.changeRes('dev');
                }
            }
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
        } else if (this.isThe(mapDataStr, 'B')) {
            //生成木盒子 并且根据之前记录的位置放置
            let box = this.addBuilding(this.box, indexPos);
            let b = box.getComponent(Box)
            b.setDefaultPos(indexPos);
            //生成植物
            if (this.isThe(mapDataStr, 'B1')) {
                b.boxType = Box.PLANT;
            }
            //设置对应存档盒子的位置
            let saveBox = Logic.mapManager.getCurrentMapBuilding(b.data.defaultPos);
            if (saveBox) {
                b.node.position = saveBox.position.clone();
            } else {
                Logic.mapManager.setCurrentBuildingData(b.data);
            }
        } else if (this.isThe(mapDataStr, 'D')) {
            //生成可破坏装饰 并且根据之前记录的位置放置
            let decorate = this.addBuilding(this.decorate, indexPos);
            let d = decorate.getComponent(Decorate);
            d.setDefaultPos(indexPos);
            d.decorateType = parseInt(mapDataStr[1]);
            //设置对应存档盒子的位置
            let saveBox = Logic.mapManager.getCurrentMapBuilding(d.data.defaultPos);
            if (saveBox) {
                d.node.position = saveBox.position.clone();
                if (saveBox.currentHealth < 1) {
                    d.reset();
                }
            } else {
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
        } else if (this.isThe(mapDataStr, 'P')) {
            this.addDoor(parseInt(mapDataStr[1]), indexPos);
        } else if (this.isThe(mapDataStr, 'E')) {
            let p = this.addBuilding(this.exitdoorPrefab, indexPos);
            let exitdoor = p.getComponent(ExitDoor);
            let i = parseInt(mapDataStr[1]);
            exitdoor.init(indexPos, i == 1 || i == 3 || i == 5, i > 1, i == 4 || i == 5);
            this.exitdoors.push(exitdoor);
        } else if (this.isThe(mapDataStr, 'W')) {
            //生成传送门
            let p = this.addBuilding(this.portal, indexPos);
            let i = parseInt(mapDataStr[1]);
            let portal = p.getComponent(Portal);
            portal.isBackDream = i > 0;
            this.portals.push(portal);
        } else if (this.isThe(mapDataStr, 'Z')) {
            if (parseInt(mapDataStr[1]) == 0) {
                let p = this.addBuilding(this.roomBed, indexPos);
                let rb = p.getComponent(RoomBed);
                rb.init(dungeon);
            } else {
                //生成可打击建筑
                this.addHitBuilding(dungeon, mapDataStr, indexPos);
            }

        } else if (this.isThe(mapDataStr, 'H')) {
            //生成可打击建筑
            this.addHitBuilding(dungeon, mapDataStr, indexPos)
        }
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
        switch (mapDataStrIndex) {
            case 0: door.node.angle = 0; break;
            case 1: door.node.angle = 180; break;
            case 2: door.node.angle = 90; break;
            case 3: door.node.angle = -90; break;
        }
        door.dir = mapDataStrIndex;
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
        if (isOpen && !immediately) {
            Logic.mapManager.setRoomClear(Logic.mapManager.rectDungeon.currentPos.x, Logic.mapManager.rectDungeon.currentPos.y);
        }
    }
    private addDirWalls(mapDataStr: string, indexPos: cc.Vec3, levelData: LevelData) {
        let mapDataStrIndex = parseInt(mapDataStr[1]);
        let node: cc.Node = null;
        if (mapDataStrIndex > 3 && mapDataStrIndex < 8 || mapDataStrIndex > parseInt('A')) {
            node = this.addBuilding(this.corner, indexPos);
            node.getComponent(Wall).isCorner = true;
        } else {
            node = this.addBuilding(this.wall, indexPos);
        }
        let wall = node.getComponent(Wall);
        wall.dir = mapDataStrIndex;
        wall.mapStr = mapDataStr;
        wall.resName = levelData.wallRes;
        if (mapDataStrIndex > parseInt('A')) {
            wall.isBottom = true;
        } else {
            switch (mapDataStrIndex) {
                case 0: break;
                case 1: node.angle = 180; wall.isBottom = true; break;
                case 2: node.angle = 90; break;
                case 3: node.angle = -90; break;
                case 4: node.angle = -90; break;
                case 5: node.angle = 180; break;
                case 6: wall.isBottom = true; break;
                case 7: wall.isBottom = true; node.scaleX = -1;
                    node.getComponent(cc.PhysicsBoxCollider).offset.x = 64;
                    node.getComponent(cc.PhysicsBoxCollider).apply();
                    break;
            }
        }
    }
    /**生成可打击建筑 */
    private addHitBuilding(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3) {
        let hitBuilding = this.addBuilding(this.hitBuilding, indexPos);
        let h = hitBuilding.getComponent(HitBuilding);
        h.setDefaultPos(indexPos);
        let resName = 'car';
        let equipmentName = 'shield001';
        let itemName = '';
        let maxhealth = 5;
        switch (mapDataStr) {
            case 'H0': resName = 'car'; equipmentName = 'shield001'; itemName = ''; maxhealth = 5; break;
            case 'Z1': resName = 'roomcupboard'; equipmentName = 'weapon007'; itemName = ''; maxhealth = 200; break;
            default: break;
        }
        h.init(dungeon, resName, itemName, equipmentName, maxhealth, maxhealth);
        let saveHit = Logic.mapManager.getCurrentMapBuilding(h.data.defaultPos);
        if (saveHit) {
            h.init(dungeon, resName, itemName, equipmentName, maxhealth, saveHit.currentHealth);
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

}
