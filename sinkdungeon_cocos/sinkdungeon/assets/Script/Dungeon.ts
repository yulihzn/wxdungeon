import Player from "./Player";
import Tile from "./Tile";
import Logic from "./Logic";
import { EventHelper } from "./EventHelper";
import MonsterManager from "./manager/MonsterManager";
import EquipmentManager from "./manager/EquipmentManager";
import EquipmentData from "./data/EquipmentData";
import DungeonStyleManager from "./manager/DungeonStyleManager";
import ShopTable from "./building/ShopTable";
import AudioPlayer from "./utils/AudioPlayer";
import RoomType from "./rect/RoomType";
import IndexZ from "./utils/IndexZ";
import BuildingManager from "./manager/BuildingManager";
import LevelData from "./data/LevelData";
import NonPlayerManager from "./manager/NonPlayerManager";
import ItemManager from "./manager/ItemManager";
import Utils from "./utils/Utils";
import LightManager from "./manager/LightManager";
import DamageData from "./data/DamageData";

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
export default class Dungeon extends cc.Component {

    @property(cc.Prefab)
    tile: cc.Prefab = null;
    @property(cc.Prefab)
    playerPrefab: cc.Prefab = null;
    @property(cc.Node)
    fog: cc.Node = null;

    map: Tile[][] = new Array();//地图列表
    floorIndexmap: cc.Vec3[] = new Array();//地板下标列表
    static WIDTH_SIZE: number = 7;
    static HEIGHT_SIZE: number = 7;
    static readonly MAPX: number = 64;
    static readonly MAPY: number = 64;
    static readonly TILE_SIZE: number = 128;
    static readonly DEFAULT_ZOOM_MAX = 2;
    static readonly DEFAULT_ZOOM_MIN = 0.6;
    static readonly DEFAULT_ZOOM = 0.9;
    private timeDelay = 0;
    private checkTimeDelay = 0;

    player: Player = null;
    monsterManager: MonsterManager = null;//怪物管理
    nonPlayerManager: NonPlayerManager = null;//npc管理
    equipmentManager: EquipmentManager = null;//装备管理
    dungeonStyleManager: DungeonStyleManager = null;//装饰管理
    itemManager: ItemManager = null;//金币和物品管理
    buildingManager: BuildingManager = null;//建筑管理
    lightManager: LightManager = null;//光线管理
    anim: cc.Animation;
    CameraZoom = Dungeon.DEFAULT_ZOOM;
    needZoomIn = false;
    isInitFinish = false;
    isClear = false;
    isComplete = false;
    currentPos = cc.v3(0, 0);

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
        this.anim = this.getComponent(cc.Animation);
        //初始化监听
        EventHelper.on(EventHelper.PLAYER_MOVE, (detail) => { this.playerAction(detail.dir, detail.pos, detail.dt) });
        EventHelper.on(EventHelper.DUNGEON_SETEQUIPMENT, (detail) => {
            if (this.node) this.addEquipment(detail.equipmentData.img, detail.pos, detail.equipmentData);
        });
        EventHelper.on(EventHelper.DUNGEON_ADD_COIN, (detail) => {
            this.addCoin(detail.pos, detail.count);
        })
        EventHelper.on(EventHelper.DUNGEON_ADD_OILGOLD, (detail) => {
            this.addOilGold(detail.pos, detail.count);
        })
        EventHelper.on(EventHelper.DUNGEON_ADD_ITEM, (detail) => {
            if (this.node) this.addItem(detail.pos, detail.res, detail.count);
        })
        EventHelper.on(EventHelper.DUNGEON_ADD_FALLSTONE, (detail) => {
            this.addFallStone(detail.pos, detail.isAuto);
        })
        EventHelper.on(EventHelper.DUNGEON_ADD_LIGHTENINGFALL, (detail) => {
            this.addLighteningFall(detail.pos, false, false, detail.showArea, detail.damage);
        })
        EventHelper.on(EventHelper.DUNGEON_SHAKEONCE, (detail) => {
            if (this.anim) {
                this.anim.play('DungeonShakeOnce');
            }
        });
        EventHelper.on(EventHelper.BOSS_ADDSLIME, (detail) => {
            this.addBossSlime(detail.slimeType, detail.posIndex);
        })
        EventHelper.on(EventHelper.TEST_SHOW_NODE_COUNT, (detail) => {
            this.logNodeCount();
        });
        this.monsterManager = this.getComponent(MonsterManager);
        this.nonPlayerManager = this.getComponent(NonPlayerManager);
        this.equipmentManager = this.getComponent(EquipmentManager);
        this.itemManager = this.getComponent(ItemManager);
        this.dungeonStyleManager = this.getComponent(DungeonStyleManager);
        this.buildingManager = this.getComponent(BuildingManager);
        this.lightManager = this.getComponent(LightManager);
        this.reset();
    }
    reset() {
        Logic.lastBgmIndex = Logic.chapterIndex == Logic.CHAPTER099 ? 1 : 0;
        AudioPlayer.play(AudioPlayer.PLAY_BG, true);
        this.monsterManager.clear();
        this.nonPlayerManager.clear();
        this.equipmentManager.clear();
        this.itemManager.clear();
        this.dungeonStyleManager.clear();
        this.buildingManager.clear();
        this.lightManager.clear();
        //设置雾气层级
        this.fog.zIndex = IndexZ.FOG;
        this.fog.scale = 0.6;
        this.fog.opacity = 255;
        this.lightManager.shadow.node.zIndex = IndexZ.SHADOW;
        this.lightManager.shadowRay.node.zIndex = IndexZ.SHADOW + 10;
        this.currentPos = cc.v3(Logic.mapManager.getCurrentRoom().x, Logic.mapManager.getCurrentRoom().y);
        let mapData: string[][] = Logic.mapManager.getCurrentMapStringArray();
        let leveldata: LevelData = Logic.worldLoader.getCurrentLevelData();
        let exits = leveldata.getExitList();
        Logic.changeDungeonSize();
        this.dungeonStyleManager.addDecorations();
        for (let arr of this.map) {
            Utils.clearComponentArray(arr);
        }
        this.map = new Array();
        this.floorIndexmap = new Array();
        //放置之前留在地上的物品和装备
        this.addItemListOnGround();
        this.addEquipmentListOnGround();
        this.buildingManager.addAirExit(mapData);
        for (let i = 0; i < Dungeon.WIDTH_SIZE; i++) {
            this.map[i] = new Array(i);
            for (let j = 0; j < Dungeon.HEIGHT_SIZE; j++) {
                //越往下层级越高，j是行，i是列
                this.addTiles(mapData[i][j], cc.v3(i, j), leveldata, false);
                //加载建筑
                this.buildingManager.addBuildingsFromMap(this, mapData[i][j], cc.v3(i, j), leveldata, exits);
                //房间未清理时加载物品
                if (!Logic.mapManager.isCurrentRoomStateClear() || Logic.mapManager.getCurrentRoomType().isEqual(RoomType.TEST_ROOM)) {
                    this.itemManager.addItemFromMap(mapData[i][j], cc.v3(i, j));
                }
                //房间未清理时加载怪物
                if (!Logic.mapManager.isCurrentRoomStateClear() || Logic.mapManager.getCurrentRoomType().isEqual(RoomType.TEST_ROOM)
                    || Logic.mapManager.getCurrentRoomType().isEqual(RoomType.START_ROOM)) {
                        this.monsterManager.addMonstersAndBossFromMap(this, mapData[i][j], cc.v3(i, j));
                }
                //加载npc
                this.nonPlayerManager.addNonPlayerFromMap(this, mapData[i][j], cc.v3(i, j));
            }
        }
        let offsets = [cc.v3(-1, -1, 4), cc.v3(-1, 0, 2), cc.v3(-1, 1, 6), cc.v3(0, -1, 0), cc.v3(0, 1, 1), cc.v3(1, -1, 5), cc.v3(1, 0, 3), cc.v3(1, 1, 7)];
        for (let offset of offsets) {
            this.addBuildingsFromSideMap(offset);
        }

        //初始化玩家
        this.player = cc.instantiate(this.playerPrefab).getComponent(Player);
        this.player.node.parent = this.node;

        //加载随机怪物
        if ((!Logic.mapManager.isCurrentRoomStateClear() || Logic.mapManager.getCurrentRoom().isReborn)
            && RoomType.isMonsterGenerateRoom(Logic.mapManager.getCurrentRoomType()) && !Logic.isTour) {
            this.monsterManager.addRandomMonsters(this, Logic.mapManager.getCurrentRoom().reborn);
        }
        //加载跟随npc
        let list = new Array().concat(Logic.nonPlayerList);
        this.scheduleOnce(() => {
            this.nonPlayerManager.addNonPlayerListFromSave(this, list, this.player.node.position);
        }, 1)
        //设置门开关
        this.setDoors(true, true);
        cc.log('load finished');
        this.scheduleOnce(() => {
            this.isInitFinish = true;
            cc.tween(this.fog).to(3, { scale: 5 }).start();
            let blackcenter = this.fog.getChildByName('sprite').getChildByName('blackcenter');
            cc.tween(blackcenter).delay(0.1).to(0.5, { opacity: 0 }).start();
            this.logNodeCount();
            this.addOilGoldOnGround();
        }, 0.5)
    }
    private addTiles(mapDataStr: string, indexPos: cc.Vec3, leveldata: LevelData, onlyShow: boolean) {
        if (Dungeon.isFirstEqual(mapDataStr, "*") && mapDataStr != '**') {
            let t = cc.instantiate(this.tile);
            t.parent = this.node;
            t.position = Dungeon.getPosInMap(indexPos.clone());
            t.zIndex = IndexZ.BASE + (Dungeon.HEIGHT_SIZE - indexPos.y) * 10;
            let tile = t.getComponent(Tile);
            tile.isAutoShow = false;
            tile.tileType = mapDataStr;
            tile.coverPrefix = leveldata.floorCoverRes;
            tile.cover1 = leveldata.floorCoverRes1;
            tile.cover2 = leveldata.floorCoverRes2;
            tile.cover3 = leveldata.floorCoverRes3;
            tile.cover4 = leveldata.floorCoverRes4;
            tile.cover5 = leveldata.floorCoverRes5;
            tile.floorPrefix = leveldata.floorRes;
            if (!onlyShow) {
                this.map[indexPos.x][indexPos.y] = tile;
            }
        }
        if (!onlyShow && Dungeon.isFirstEqual(mapDataStr, "*")) {
            this.floorIndexmap.push(indexPos.clone());
        }
    }
    private logNodeCount() {
        if (!this.node) {
            return;
        }
        let names: { [key: string]: number } = {};
        let log = `childrenCount:${this.node.childrenCount} children:\n`;
        for (let child of this.node.children) {
            if (names[child.name]) {
                names[child.name]++;
            } else {
                names[child.name] = 1;
            }
        }
        for (let key in names) {
            log += `${key}(${names[key]})\n`;
        }
        console.log(log);
    }
    private addBuildingsFromSideMap(offset: cc.Vec3) {
        let mapData: string[][] = Logic.mapManager.getCurrentSideMapStringArray(offset);
        let leveldata: LevelData = Logic.worldLoader.getCurrentLevelData();
        if (!mapData[0]) {
            return;
        }
        for (let i = 0; i < Dungeon.WIDTH_SIZE; i++) {
            for (let j = 0; j < Dungeon.HEIGHT_SIZE; j++) {
                let needAdd = false;
                let length = 4;
                switch (offset.z) {
                    case 0: needAdd = j > Dungeon.HEIGHT_SIZE - length; break;
                    case 1: needAdd = j < length; break;
                    case 2: needAdd = i > Dungeon.WIDTH_SIZE - length; break;
                    case 3: needAdd = i < length; break;
                    case 4: needAdd = i > Dungeon.WIDTH_SIZE - length && j > Dungeon.HEIGHT_SIZE - length; break;
                    case 5: needAdd = i < length && j > Dungeon.HEIGHT_SIZE - length; break;
                    case 6: needAdd = i > Dungeon.WIDTH_SIZE - length && j < length; break;
                    case 7: needAdd = i < length && j < length; break;
                }
                if (needAdd) {
                    let indexPos = cc.v3(i + Dungeon.WIDTH_SIZE * offset.x, j + Dungeon.HEIGHT_SIZE * offset.y);
                    this.addTiles(mapData[i][j], indexPos.clone(), leveldata, true);
                    this.buildingManager.addBuildingsFromSideMap(mapData[i][j], indexPos.clone(), leveldata);
                }
            }
        }
    }

    public darkAfterKill() {
        cc.tween(this.fog).to(1, { scale: 0.6 }).start();
        let blackcenter = this.fog.getChildByName('sprite').getChildByName('blackcenter');
        cc.tween(blackcenter).delay(0.2).to(1, { opacity: 255 }).start();
    }

    static isFirstEqual(mapStr: string, typeStr: string) {
        let isequal = mapStr[0] == typeStr;
        return isequal;
    }
    addItem(pos: cc.Vec3, resName: string, count?: number, shopTable?: ShopTable) {
        if (this.itemManager) {
            if (!pos) {
                pos = this.player.node.position.clone();
            }
            this.itemManager.addItem(pos, resName, count, shopTable);
        }
    }

    /**掉落石头 */
    public addFallStone(pos: cc.Vec3, isAuto: boolean, withFire?: boolean) {
        this.buildingManager.addFallStone(pos, isAuto, withFire);
    }
    /**落雷 */
    private addLighteningFall(pos: cc.Vec3, isTrigger: boolean, needPrepare: boolean, showArea: boolean, damagePoint?: number) {
        if (!this.buildingManager) {
            return;
        }
        this.buildingManager.addLighteningFall(pos, isTrigger, needPrepare, showArea, damagePoint);
    }



    /**掉落金币 */
    private addCoin(pos: cc.Vec3, count: number) {
        if (this.itemManager) {
            this.itemManager.getValueCoin(count, pos, this.node);
        }
    }
    /**掉落油金 */
    private addOilGold(pos: cc.Vec3, count: number) {
        if (this.itemManager) {
            this.itemManager.getValueOilGold(count, pos, this.node);
        }
    }
    /**放置地上的装备 */
    private addEquipmentListOnGround() {
        let currequipments = Logic.mapManager.getCurrentMapEquipments();
        if (currequipments) {
            for (let tempequip of currequipments) {
                if (tempequip.test > 0 && Logic.chapterIndex == Logic.CHAPTER099) {
                    continue;
                }
                if (this.equipmentManager) {
                    this.equipmentManager.getEquipment(tempequip.img, Dungeon.getPosInMap(tempequip.pos), this.node, tempequip, null, null).data;
                }
            }
        }

    }
    /**放置地上物品 */
    private addItemListOnGround() {
        let curritems = Logic.mapManager.getCurrentMapItems();
        Logic.mapManager.setCurrentItemsArr(new Array());
        if (curritems) {
            for (let tempeitem of curritems) {
                if (!tempeitem.isTaken) {
                    this.addItem(Dungeon.getPosInMap(tempeitem.pos), tempeitem.resName, tempeitem.count);
                }
            }
        }

    }
    /**回复掉落的翠金 */
    private addOilGoldOnGround() {
        this.scheduleOnce(() => {
            let data = Logic.groundOilGoldData.clone();
            if (data.chapter == Logic.chapterIndex && data.level == Logic.level
                && data.x == Logic.mapManager.rectDungeon.currentPos.x
                && data.y == Logic.mapManager.rectDungeon.currentPos.y && data.value > 0) {
                EventHelper.emit(EventHelper.HUD_ADD_OILGOLD, { count: data.value });
                Logic.saveGroundOilGold(0);
                cc.director.emit(EventHelper.HUD_OILGOLD_RECOVERY_SHOW);
            }
        }, 1)

    }
    /**添加装备 */
    addEquipment(equipType: string, pos: cc.Vec3, equipData?: EquipmentData, chestQuality?: number, shopTable?: ShopTable) {
        if (this.equipmentManager) {
            if (!pos) {
                pos = this.player.node.position.clone();
            }
            let data = this.equipmentManager.getEquipment(equipType, pos, this.node, equipData, chestQuality, shopTable).data;
            if (shopTable) {
                return;
            }
            let currequipments = Logic.mapManager.getCurrentMapEquipments();
            if (currequipments) {
                currequipments.push(data);
            } else {
                currequipments = new Array();
                currequipments.push(data);
                Logic.mapManager.setCurrentEquipmentsArr(currequipments);
            }
        }
    }

    private addBossSlime(type: number, index: cc.Vec3) {
        if (this.monsterManager) {
            this.monsterManager.addBossSlime(type, index, this);
        }
    }

    public shakeForKraken() {
        this.CameraZoom = Dungeon.DEFAULT_ZOOM_MIN;
        this.needZoomIn = true;
        this.anim.playAdditive('DungeonShakeOnce');
        this.scheduleOnce(() => { this.anim.playAdditive('DungeonShakeOnce'); }, 1);
        this.scheduleOnce(() => { this.anim.playAdditive('DungeonShakeOnce'); }, 2);
    }

    //获取地图里下标的坐标
    static getPosInMap(pos: cc.Vec3) {
        let x = Dungeon.MAPX + pos.x * Dungeon.TILE_SIZE;
        let y = Dungeon.MAPY + pos.y * Dungeon.TILE_SIZE;
        return cc.v3(x, y);
    }
    //获取坐标在地图里的下标,canOuter:是否可以超出
    static getIndexInMap(pos: cc.Vec3, canOuter?: boolean) {
        let x = (pos.x - Dungeon.MAPX) / Dungeon.TILE_SIZE;
        let y = (pos.y - Dungeon.MAPY) / Dungeon.TILE_SIZE;
        x = Math.round(x);
        y = Math.round(y);
        if (!canOuter) {
            if (x < 0) { x = 0 }; if (x >= Dungeon.WIDTH_SIZE) { x = Dungeon.WIDTH_SIZE - 1 };
            if (y < 0) { y = 0 }; if (y >= Dungeon.HEIGHT_SIZE) { y = Dungeon.HEIGHT_SIZE - 1 };
        }
        return cc.v3(x, y);
    }
    //获取不超出地图的坐标
    static fixOuterMap(pos: cc.Vec3): cc.Vec3 {
        let x = (pos.x - Dungeon.MAPX) / Dungeon.TILE_SIZE;
        let y = (pos.y - Dungeon.MAPY) / Dungeon.TILE_SIZE;
        x = Math.round(x);
        y = Math.round(y);
        let isOuter = false;
        if (x < 0) { x = 0; isOuter = true; }
        if (x >= Dungeon.WIDTH_SIZE) { x = Dungeon.WIDTH_SIZE - 1; isOuter = true; }
        if (y < 0) { y = 0; isOuter = true; }
        if (y >= Dungeon.HEIGHT_SIZE) { y = Dungeon.HEIGHT_SIZE - 1; isOuter = true; }
        if (isOuter) {
            return Dungeon.getPosInMap(cc.v3(x, y));
        } else {
            return pos;
        }
    }

    start() {
        this.scheduleOnce(() => {
            cc.director.emit(EventHelper.CHANGE_MINIMAP, { detail: { x: this.currentPos.x, y: this.currentPos.y } });
            this.checkRoomClear();
        }, 0.1)
    }
    breakTile(pos: cc.Vec3) {
        let tile = this.map[pos.x][pos.y];
        if (tile && !tile.isBroken) {
            tile.breakTile();
        }
    }
    /** 玩家在地牢移动 */
    playerAction(dir: number, pos: cc.Vec3, dt: number) {
        if (this.player) {
            this.player.playerAction(dir, pos, dt, this);
        }
    }
    getMonsterAliveNum(): number {
        let count = 0;
        for (let monster of this.monsterManager.monsterList) {
            if (monster.sc.isDied || monster.data.isTest > 0) {
                count++;
            }
        }
        return this.monsterManager.monsterList.length - count;
    }
    /**检查房间是否清理 */
    private checkRoomClear() {
        //检查怪物是否清理
        let count = this.getMonsterAliveNum();
        this.isClear = count <= 0;
        if (this.isClear && this.monsterManager.bossList.length > 0) {
            for (let boss of this.monsterManager.bossList) {
                if (boss.sc.isDied) {
                    count++;
                }
            }
            this.isClear = count >= this.monsterManager.bossList.length;
        }
        //检查踏板是否触发过
        for (let footboard of this.buildingManager.footboards) {
            if (!footboard.isOpen && !footboard.hasActive) {
                this.isClear = false;
            }
        }
        //检查是否怪物生成建筑生成完毕
        for (let monsterGenerator of this.buildingManager.monsterGeneratorList) {
            if (!monsterGenerator.addFinish) {
                this.isClear = false;
            }
        }
        //检查是否是测试房间，测试房间默认不关门
        if (Logic.mapManager.getCurrentRoomType().isEqual(RoomType.TEST_ROOM)) {
            this.isClear = true;
        }

        this.setDoors(this.isClear);
        if (this.isClear) {
            if (this.monsterManager.isRoomInitWithEnemy && Logic.mapManager.getCurrentRoomType().isNotEqual(RoomType.TEST_ROOM)) {
                cc.director.emit(EventHelper.HUD_COMPLETE_SHOW);
                if (!this.isComplete && this.player && this.player.data && this.player.data.StatusTotalData.clearHealth > 0) {
                    this.isComplete = true;
                    this.player.takeDamage(new DamageData(-this.player.data.StatusTotalData.clearHealth));
                }
            }
            if (this.buildingManager.savePointS) {
                this.buildingManager.savePointS.open();
            }
            Logic.mapManager.setRoomClear(this.currentPos.x, this.currentPos.y);
        }
    }
    private setDoors(isClear: boolean, immediately?: boolean) {
        if (!this.buildingManager) {
            return;
        }
        this.buildingManager.setDoors(isClear, immediately);
    }
    checkPlayerPos(dt: number) {
        if (!this.map || !this.player || !this.node) {
            return;
        }
        this.fog.setPosition(this.lerp(this.fog.position, this.player.node.position, dt * 3));
        let pos = Dungeon.getIndexInMap(this.player.node.position);
        if (!this.map[pos.x] || !this.map[pos.x][pos.y]) {
            return;
        }
        let tile = this.map[pos.x][pos.y];
        if (tile && tile.isBroken) {
            this.player.fall();
        }
        if (tile && tile.isAutoShow) {
            this.breakTile(pos);
        }
    }
    lerp(self: cc.Vec3, to: cc.Vec3, ratio: number): cc.Vec3 {
        let out = cc.v3(0, 0);
        let x = self.x;
        let y = self.y;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        return out;
    }
    checkMonstersPos() {
        for (let monster of this.monsterManager.monsterList) {
            if (monster.sc.isDied) {
                return;
            }
        }

    }
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            return true;
        }
        return false;
    }
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 1) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }

    update(dt) {
        if (this.isInitFinish && !Logic.isGamePause) {
            if (this.isTimeDelay(dt)) {
                this.checkPlayerPos(dt);
                this.monsterManager.updateLogic(dt);
                this.nonPlayerManager.updateLogic(dt);
                this.buildingManager.updateLogic(dt, this.player);
                this.equipmentManager.updateLogic(dt, this.player);
                this.itemManager.updateLogic(dt, this.player);
            }
            if (this.isCheckTimeDelay(dt)) {
                this.checkRoomClear();
            }
        }
    }
}
