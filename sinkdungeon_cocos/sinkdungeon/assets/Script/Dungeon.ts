import Player from "./Player";
import Tile from "./Tile";
import Monster from "./Monster";
import Logic from "./Logic";
import { EventHelper } from "./EventHelper";
import MonsterManager from "./Manager/MonsterManager";
import Portal from "./Building/Portal";
import Wall from "./Building/Wall";
import Trap from "./Building/Trap";
import Item from "./Item/Item";
import EquipmentManager from "./Manager/EquipmentManager";
import EquipmentData from "./Data/EquipmentData";
import DungeonStyleManager from "./Manager/DungeonStyleManager";
import Chest from "./Building/Chest";
import ShopTable from "./Building/ShopTable";
import CoinManger from "./Manager/CoinManager";
import Box from "./Building/Box";
import FootBoard from "./Building/FootBoard";
import BoxData from "./Data/BoxData";
import ShopTableData from "./Data/ShopTableData";
import HealthBar from "./HealthBar";
import FallStone from "./Building/FallStone";
import Emplacement from "./Building/Emplacement";
import Boss from "./Boss/Boss";
import SlimeVenom from "./Boss/SlimeVenom";
import ChestData from "./Data/ChestData";
import Random from "./Utils/Random";
import IceDemonThron from "./Boss/IceDemonThron";
import DryadGrass from "./Boss/DryadGrass";
import DecorationFloor from "./Building/DecorationFloor";
import Saw from "./Building/Saw";
import AudioPlayer from "./Utils/AudioPlayer";
import Decorate from "./Building/Decorate";
import RoomType from "./Rect/RoomType";
import MagicLightening from "./Building/MagicLightening";
import IndexZ from "./Utils/IndexZ";

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
    item: cc.Prefab = null;
    @property(cc.Prefab)
    shop: cc.Prefab = null;
    @property(cc.Prefab)
    shoptable: cc.Prefab = null;
    @property(cc.Prefab)
    floorDecoration: cc.Prefab = null;
    @property(cc.Prefab)
    playerPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    portalPrefab: cc.Prefab = null;
    portal: Portal = null;
    @property(cc.Prefab)
    bed: cc.Prefab = null;
    @property(cc.Prefab)
    campFire: cc.Prefab = null;
    @property(cc.Prefab)
    tarotTable: cc.Prefab = null;
    @property(cc.Prefab)
    venom: cc.Prefab = null;
    @property(cc.Prefab)
    iceThron: cc.Prefab = null;
    @property(cc.Prefab)
    dryadGrass: cc.Prefab = null;
    @property(cc.Prefab)
    saw: cc.Prefab = null;
    @property(cc.Node)
    fog: cc.Node = null;
    @property(HealthBar)
    bossHealthBar: HealthBar = null;

    map: Tile[][] = new Array();//地图列表
    wallmap: Wall[][] = new Array();//墙列表
    trapmap: Trap[][] = new Array();//陷阱列表
    footboards: FootBoard[] = new Array();//踏板列表
    floorIndexmap: cc.Vec3[] = new Array();//地板下标列表
    static WIDTH_SIZE: number = 15;
    static HEIGHT_SIZE: number = 9;
    static readonly MAPX: number = 32;
    static readonly MAPY: number = 32;
    static readonly TILE_SIZE: number = 64;
    private timeDelay = 0;
    private checkTimeDelay = 0;

    player: Player = null;
    monsters: Monster[];//房间怪物列表
    // public monsterReswpanPoints: { [key: string]: string } = {};//怪物重生点
    monsterManager: MonsterManager = null;//怪物管理
    equipmentManager: EquipmentManager = null;//装备管理
    dungeonStyleManager: DungeonStyleManager = null;//装饰管理
    coinManager: CoinManger = null;//金币管理
    anim: cc.Animation;
    isZoomCamera = false;

    bosses: Boss[] = [];

    onLoad() {
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.PLAY_BG } });
        //初始化动画
        this.anim = this.getComponent(cc.Animation);
        //初始化监听
        cc.director.on(EventHelper.PLAYER_MOVE, (event) => { this.playerAction(event.detail.dir, event.detail.pos, event.detail.dt) });
        cc.director.on(EventHelper.DUNGEON_SETEQUIPMENT, (event) => {
            this.addEquipment(event.detail.equipmentData.img, event.detail.pos, event.detail.equipmentData);
        });
        cc.director.on(EventHelper.DUNGEON_ADD_COIN, (event) => {
            this.addCoin(event.detail.pos, event.detail.count);
        })
        cc.director.on(EventHelper.DUNGEON_ADD_OILGOLD, (event) => {
            //暂时屏蔽
            // this.addOilGold(event.detail.pos, event.detail.count);
        })
        cc.director.on(EventHelper.DUNGEON_ADD_ITEM, (event) => {
            this.addItem(event.detail.pos, event.detail.res);
        })
        cc.director.on(EventHelper.DUNGEON_ADD_FALLSTONE, (event) => {
            this.addFallStone(event.detail.pos, event.detail.isAuto);
        })
        EventHelper.on(EventHelper.DUNGEON_ADD_LIGHTENINGFALL,(detail)=>{
            this.addLighteningFall(detail.pos, false,false,detail.showArea,detail.damage);
        })
        cc.director.on(EventHelper.DUNGEON_SHAKEONCE, (event) => {
            if (this.anim) {
                this.anim.play('DungeonShakeOnce');
            }
        });
        cc.director.on(EventHelper.BOSS_ADDSLIME, (event) => {
            this.addBossSlime(event.detail.slimeType, event.detail.posIndex);
        })
        this.monsterManager = this.getComponent(MonsterManager);
        this.equipmentManager = this.getComponent(EquipmentManager);
        this.coinManager = this.getComponent(CoinManger);
        this.dungeonStyleManager = this.getComponent(DungeonStyleManager);
        this.init();
    }
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
    init(): void {
        //设置雾气层级
        this.fog.zIndex = IndexZ.FOG;
        this.fog.scale = 1.2;
        let mapData: string[][] = Logic.mapManager.getCurrentMapStringArray();
        Logic.changeDungeonSize();
        this.dungeonStyleManager.addDecorations();
        //初始化玩家
        this.player = cc.instantiate(this.playerPrefab).getComponent(Player);
        this.player.node.parent = this.node;

        this.bosses = new Array();
        this.monsters = new Array();
        this.map = new Array();
        this.wallmap = new Array();
        this.trapmap = new Array();
        this.footboards = new Array();
        this.floorIndexmap = new Array();
        let boxes: BoxData[] = new Array();
        let shopTables: ShopTableData[] = new Array();
        let chests: ChestData[] = new Array();
        //放置之前留在地上的物品和装备
        this.addItemListOnGround();
        this.addEquipmentListOnGround();
        for (let i = 0; i < Dungeon.WIDTH_SIZE; i++) {
            this.map[i] = new Array(i);
            this.wallmap[i] = new Array(i);
            this.trapmap[i] = new Array(i);
            for (let j = 0; j < Dungeon.HEIGHT_SIZE; j++) {

                if (mapData[i][j] == '--') {
                    let t = cc.instantiate(this.tile);
                    t.parent = this.node;
                    t.position = Dungeon.getPosInMap(cc.v3(i, j));
                    //越往下层级越高，j是行，i是列
                    t.zIndex = IndexZ.BASE + (Dungeon.HEIGHT_SIZE - j) * 10;
                    this.map[i][j] = t.getComponent(Tile);
                    //开启踩踏掉落
                    this.map[i][j].isAutoShow = true;
                    this.floorIndexmap.push(cc.v3(i, j));
                }
                if (this.isThe(mapData[i][j], "*") && mapData[i][j] != '**') {
                    let t = cc.instantiate(this.tile);
                    t.parent = this.node;
                    t.position = Dungeon.getPosInMap(cc.v3(i, j));
                    t.zIndex = IndexZ.BASE + (Dungeon.HEIGHT_SIZE - j) * 10;
                    this.map[i][j] = t.getComponent(Tile);
                    this.map[i][j].isAutoShow = false;
                    this.map[i][j].tileType = mapData[i][j];
                    this.floorIndexmap.push(cc.v3(i, j));
                }
                //生成墙
                if (this.isThe(mapData[i][j], '#')) {
                    let w = cc.instantiate(this.wall);
                    w.parent = this.node;
                    w.position = Dungeon.getPosInMap(cc.v3(i, j));
                    w.zIndex = IndexZ.getActorZIndex(w.position);
                    w.opacity = 255;
                    this.wallmap[i][j] = w.getComponent(Wall);
                    this.wallmap[i][j].mapStr = mapData[i][j];
                }
                //生成陷阱
                if (mapData[i][j] == 'T0') {
                    let trap = cc.instantiate(this.trap);
                    trap.parent = this.node;
                    trap.position = Dungeon.getPosInMap(cc.v3(i, j));
                    trap.zIndex = IndexZ.getActorZIndex(trap.position);
                    this.trapmap[i][j] = trap.getComponent(Trap);
                }
                //生成电锯,占据5个格子
                if (mapData[i][j] == 'X0') {
                    let saw = cc.instantiate(this.saw);
                    saw.parent = this.node;
                    saw.getComponent(Saw).setPos(cc.v3(i, j));
                }
                //生成炮台
                if (this.isThe(mapData[i][j], 'E')) {
                    let emplacement = cc.instantiate(this.emplacement);
                    emplacement.parent = this.node;
                    emplacement.position = Dungeon.getPosInMap(cc.v3(i, j));
                    emplacement.zIndex = IndexZ.getActorZIndex(emplacement.position);
                    let em = emplacement.getComponent(Emplacement);
                    em.setDirType(mapData[i][j]);
                    em.dungeon = this;
                }
                //生成落石
                if (mapData[i][j] == 'F0') {
                    this.addFallStone(Dungeon.getPosInMap(cc.v3(i, j)), false);
                }
                //生成落雷
                if (mapData[i][j] == 'F1') {
                    this.addLighteningFall(Dungeon.getPosInMap(cc.v3(i, j)),true, true,true);
                }
                //生成装饰
                if (this.isThe(mapData[i][j], '+')) {
                    //生成营火
                    if (this.isThe(mapData[i][j], '+0')) {
                        let camp = cc.instantiate(this.campFire);
                        camp.parent = this.node;
                        camp.position = Dungeon.getPosInMap(cc.v3(i, j));
                        camp.zIndex = IndexZ.getActorZIndex(camp.position);
                        let shadow = camp.getChildByName('sprite').getChildByName('shadow');
                        shadow.position = Dungeon.getPosInMap(cc.v3(i, j));
                        shadow.position = cc.v3(shadow.position.x, shadow.position.y + 40);
                        shadow.parent = this.node;
                        shadow.zIndex = IndexZ.FLOOR;
                        let fallentree = camp.getChildByName('sprite').getChildByName('fallentree');
                        fallentree.position = Dungeon.getPosInMap(cc.v3(i, j));
                        fallentree.position = cc.v3(shadow.position.x, shadow.position.y + 40);
                        fallentree.parent = this.node;
                        fallentree.zIndex = IndexZ.getActorZIndex(fallentree.position);
                        fallentree.setScale(6,4);
                    } else if (this.isThe(mapData[i][j], '+1')) {
                        if (Logic.level == 0) {
                            let bed = cc.instantiate(this.bed);
                            bed.parent = this.node;
                            bed.scale = 6;
                            bed.position = Dungeon.getPosInMap(cc.v3(i, j));
                            bed.zIndex = IndexZ.OVERHEAD;
                        }
                    } else if (this.isThe(mapData[i][j], '+2')) {
                        if (Logic.level == 0) {
                            let arrow = cc.instantiate(this.floorDecoration);
                            arrow.parent = this.node;
                            arrow.position = Dungeon.getPosInMap(cc.v3(i, j));
                            arrow.zIndex = IndexZ.FLOOR;
                            arrow.getComponent(DecorationFloor).changeRes('exitarrow');
                        }
                    } else {
                        let fd = cc.instantiate(this.floorDecoration);
                        fd.parent = this.node;
                        fd.position = Dungeon.getPosInMap(cc.v3(i, j));
                        fd.zIndex = IndexZ.FLOOR;
                        let df = fd.getComponent(DecorationFloor);
                        if (this.isThe(mapData[i][j], '++')) {
                            df.changeRes('exitarrow');
                        } else {
                            df.changeRes('dev');
                        }
                    }
                }
                //生成踏板
                if (mapData[i][j] == '@@') {
                    let foot = cc.instantiate(this.footboard);
                    foot.parent = this.node;
                    foot.position = Dungeon.getPosInMap(cc.v3(i, j));
                    foot.zIndex = IndexZ.FLOOR;
                    this.footboards.push(foot.getComponent(FootBoard));
                }
                //生成毒液
                if (mapData[i][j] == 'V0') {
                    this.addVenom(Dungeon.getPosInMap(cc.v3(i, j)));

                }
                //生成塔罗
                if (mapData[i][j] == 'Q0') {
                    let tarottable = cc.instantiate(this.tarotTable);
                    tarottable.parent = this.node;
                    tarottable.position = Dungeon.getPosInMap(cc.v3(i, j));
                    tarottable.zIndex = IndexZ.getActorZIndex(tarottable.position);
                }
                //生成宝箱 房间清理的情况下箱子是打开的
                if (mapData[i][j] == 'C0') {
                    let chest = cc.instantiate(this.chest);
                    chest.parent = this.node;
                    let c = chest.getComponent(Chest)
                    c.setPos(cc.v3(i, j));
                    let rand = Random.rand();
                    let quality = 1;
                    if(rand>0.5&&rand<0.7){
                        quality = 2;
                    }else if(rand>0.7&&rand<0.8){
                        quality = 3;
                    }else if(rand>0.8&&rand<0.85){
                        quality = 4;
                    }
                    c.setQuality(quality, false);
                    let currchests = Logic.mapManager.getCurrentMapChests();
                    if (currchests) {
                        for (let tempchest of currchests) {
                            if (tempchest.pos.equals(c.data.pos)) {
                                c.setQuality(tempchest.quality, tempchest.isOpen);
                            }
                        }
                    } else {
                        chests.push(c.data);
                    }
                }
                //生成木盒子 并且根据之前记录的位置放置
                if (this.isThe(mapData[i][j], 'B')) {
                    let box = cc.instantiate(this.box);
                    box.parent = this.node;
                    let b = box.getComponent(Box)
                    b.data.defaultPos = cc.v3(i, j);
                    b.setPos(cc.v3(i, j));
                    //生成植物
                    if (this.isThe(mapData[i][j], 'B1')) {
                        b.boxType = Box.PLANT;
                    }
                    //设置对应存档盒子的位置
                    let currboxes = Logic.mapManager.getCurrentMapBoxes();
                    if (currboxes) {
                        for (let tempbox of currboxes) {
                            if (tempbox.defaultPos.equals(b.data.defaultPos)) {
                                b.setPos(tempbox.pos);
                                b.node.position = tempbox.position.clone();
                            }
                        }
                    } else {
                        boxes.push(b.data);
                    }
                }
                //生成可破坏装饰 并且根据之前记录的位置放置
                if (this.isThe(mapData[i][j], 'D')) {
                    let decorate = cc.instantiate(this.decorate);
                    decorate.parent = this.node;
                    let d = decorate.getComponent(Decorate);
                    d.data.defaultPos = cc.v3(i, j);
                    d.setPos(cc.v3(i, j));
                    d.decorateType = parseInt(mapData[i][j][1]);
                    //设置对应存档盒子的位置
                    let currboxes = Logic.mapManager.getCurrentMapBoxes();
                    if (currboxes) {
                        for (let tempbox of currboxes) {
                            if (tempbox.defaultPos.equals(d.data.defaultPos)) {
                                d.setPos(tempbox.pos);
                                d.node.position = tempbox.position.clone();
                                if(tempbox.status==1){
                                    d.reset();
                                }
                            }
                        }
                    } else {
                        boxes.push(d.data);
                    }
                }
                //房间未清理时加载物品
                if (!Logic.mapManager.isCurrentRoomStateClear() || Logic.mapManager.getCurrentRoomType().isEqual(RoomType.TEST_ROOM)) {
                    //生成心
                    if (mapData[i][j] == 'A0') {
                        this.addItem(Dungeon.getPosInMap(cc.v3(i, j)), Item.HEART);
                    }
                    //生成红色药丸
                    if (mapData[i][j] == 'A3') {
                        this.addItem(Dungeon.getPosInMap(cc.v3(i, j)), Item.REDCAPSULE);
                    }
                    //生成蓝色药丸
                    if (mapData[i][j] == 'A1') {
                        this.addItem(Dungeon.getPosInMap(cc.v3(i, j)), Item.BLUECAPSULE);
                    }
                    //生成无敌盾
                    if (mapData[i][j] == 'A4') {
                        this.addItem(Dungeon.getPosInMap(cc.v3(i, j)), Item.SHIELD);
                    }
                    //生成金苹果
                    if (mapData[i][j] == 'A5') {
                        this.addItem(Dungeon.getPosInMap(cc.v3(i, j)), Item.GOLDAPPLE);
                    }
                    //治疗瓶
                    if (mapData[i][j] == 'Aa') {
                        this.addItem(Dungeon.getPosInMap(cc.v3(i, j)), Item.BOTTLE_HEALING);
                    }
                    //移速瓶
                    if (mapData[i][j] == 'Ab') {
                        this.addItem(Dungeon.getPosInMap(cc.v3(i, j)), Item.BOTTLE_MOVESPEED);
                    }
                    //攻速瓶
                    if (mapData[i][j] == 'Ac') {
                        this.addItem(Dungeon.getPosInMap(cc.v3(i, j)), Item.BOTTLE_ATTACKSPEED);
                    }
                    //隐身瓶
                    if (mapData[i][j] == 'Ad') {
                        this.addItem(Dungeon.getPosInMap(cc.v3(i, j)), Item.BOTTLE_INVISIBLE);
                    }
                }
                //生成商店
                if (mapData[i][j] == 'S0') {
                    let table = cc.instantiate(this.shoptable);
                    table.parent = this.node;
                    let ta = table.getComponent(ShopTable);
                    ta.setPos(cc.v3(i, j));
                    ta.data.shopType = Random.rand() > 0.1 ? ShopTable.EQUIPMENT : ShopTable.ITEM;
                    let currshoptables = Logic.mapManager.getCurrentMapShopTables();
                    if (currshoptables) {
                        for (let temptable of currshoptables) {
                            if (temptable.pos.equals(ta.data.pos)) {
                                if (temptable.equipdata) {
                                    ta.data.equipdata = temptable.equipdata.clone();
                                }
                                if (temptable.itemdata) {
                                    ta.data.itemdata = temptable.itemdata.clone();
                                }
                                ta.data.isSaled = temptable.isSaled;
                                ta.data.shopType = temptable.shopType;
                                ta.data.price = temptable.price;
                            }
                        }
                        ta.showItem();
                    } else {
                        ta.showItem();
                        shopTables.push(ta.data);
                    }
                }
                //生成下一层传送门(暂时废弃)
                if (mapData[i][j] == 'P0') {
                    let needAdd = false;
                    // if((Logic.level==RectDungeon.LEVEL_5||Logic.level==RectDungeon.LEVEL_3||
                    // Logic.chapterName=='chapter00')&&Logic.mapManager.getCurrentRoomType() == RectDungeon.END_ROOM){
                    //     needAdd = false;
                    // }

                    if (needAdd) {
                        let portalP = cc.instantiate(this.portalPrefab);
                        portalP.parent = this.node;
                        this.portal = portalP.getComponent(Portal);
                        if (this.portal) {
                            this.portal.setPos(cc.v3(i, j));
                        }
                    }
                }
                //生成店主
                if (mapData[i][j] == 'S1') {
                    let shop = cc.instantiate(this.shop);
                    shop.parent = this.node;
                    shop.position = Dungeon.getPosInMap(cc.v3(i, j));
                    shop.zIndex = IndexZ.getActorZIndex(shop.position);
                }
                //房间未清理时加载怪物
                if (!Logic.mapManager.isCurrentRoomStateClear() || Logic.mapManager.getCurrentRoomType().isEqual(RoomType.TEST_ROOM)) {
                    if (mapData[i][j] == 'a0') {
                        this.addMonsterFromData(MonsterManager.MONSTER_ZEBRA, i, j);
                    }
                    if (mapData[i][j] == 'a1') {
                        this.addMonsterFromData(MonsterManager.MONSTER_TERRORDRONE, i, j);
                    }
                    if (mapData[i][j] == 'a2') {
                        this.addMonsterFromData(MonsterManager.MONSTER_KILLER, i, j);
                    }
                    if (mapData[i][j] == 'a3') {
                        this.addMonsterFromData(MonsterManager.MONSTER_ZOOMBIE, i, j);
                    }
                    if (mapData[i][j] == 'a4') {
                        this.addMonsterFromData(MonsterManager.MONSTER_ELECTRICEYE, i, j);
                    }
                    if (mapData[i][j] == 'a5') {
                        this.addMonsterFromData(MonsterManager.MONSTER_GIRAFFE, i, j);
                    }
                    if (mapData[i][j] == 'b0') {
                        this.addMonsterFromData(MonsterManager.MONSTER_PIRATE, i, j);
                    }
                    if (mapData[i][j] == 'b1') {
                        this.addMonsterFromData(MonsterManager.MONSTER_SAILOR, i, j);
                    }
                    if (mapData[i][j] == 'b2') {
                        this.addMonsterFromData(MonsterManager.MONSTER_OCTOPUS, i, j);
                    }
                    if (mapData[i][j] == 'b3') {
                        this.addMonsterFromData(MonsterManager.MONSTER_FISH, i, j);
                    }
                    if (mapData[i][j] == 'b4') {
                        this.addMonsterFromData(MonsterManager.MONSTER_BOOMER, i, j);
                    }
                    if (mapData[i][j] == 'b5') {
                        this.addMonsterFromData(MonsterManager.MONSTER_STRONGSAILOR, i, j);
                    }
                    if (mapData[i][j] == 'c0') {
                        this.addMonsterFromData(MonsterManager.MONSTER_SLIME, i, j);
                    }
                    if (mapData[i][j] == 'c1') {
                        this.addMonsterFromData(MonsterManager.MONSTER_GOBLIN, i, j);
                    }
                    if (mapData[i][j] == 'c2') {
                        this.addMonsterFromData(MonsterManager.MONSTER_GOBLIN_ARCHER, i, j);
                    }
                    if (mapData[i][j] == 'c3') {
                        this.addMonsterFromData(MonsterManager.MONSTER_SNAKE, i, j);
                    }
                    if (mapData[i][j] == 'c4') {
                        this.addMonsterFromData(MonsterManager.MONSTER_WEREWOLF, i, j);
                    }
                    if (mapData[i][j] == 'c5') {
                        this.addMonsterFromData(MonsterManager.MONSTER_CHICKEN, i, j);
                    }
                    if (mapData[i][j] == 'c6') {
                        this.addMonsterFromData(MonsterManager.MONSTER_HIPPO, i, j);
                    }
                    if (mapData[i][j] == 'd0') {
                        this.addMonsterFromData(MonsterManager.MONSTER_MUMMY, i, j);
                    }
                    if (mapData[i][j] == 'd1') {
                        this.addMonsterFromData(MonsterManager.MONSTER_ANUBIS, i, j);
                    }
                    if (mapData[i][j] == 'd2') {
                        this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, i, j);
                        this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, i, j);
                        this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, i, j);
                        this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, i, j);
                        this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, i, j);
                    }
                    if (mapData[i][j] == 'd3') {
                        this.addMonsterFromData(MonsterManager.MONSTER_CROCODILE, i, j);
                    }
                    if (mapData[i][j] == 'd4') {
                        this.addMonsterFromData(MonsterManager.MONSTER_SANDSTATUE, i, j);
                    }
                    if (mapData[i][j] == 'e0') {
                        this.addMonsterFromData(MonsterManager.MONSTER_ELECTRICEYE, i, j);
                    }
                    if (mapData[i][j] == 'e1') {
                        this.addMonsterFromData(MonsterManager.MONSTER_DEMON, i, j);
                    }
                    if (mapData[i][j] == 'e2') {
                        this.addMonsterFromData(MonsterManager.MONSTER_WARLOCK, i, j);
                    }
                    if (mapData[i][j] == 'e3') {
                        this.addMonsterFromData(MonsterManager.MONSTER_SPIDER, i, j);
                    }
                    if (mapData[i][j] == 'e4') {
                        this.addMonsterFromData(MonsterManager.MONSTER_GARGOYLE, i, j);
                    }
                    if (mapData[i][j] == 'f0') {
                        this.addMonsterFromData(MonsterManager.MONSTER_CHEST, i, j);
                    }
                    if (mapData[i][j] == 'g0') {
                        this.addMonsterFromData(MonsterManager.MONSTER_DUMMY, i, j);
                    }
                    if (mapData[i][j] == 'z0') {
                        this.addBossIceDemon(cc.v3(i, j));
                    }
                    if (mapData[i][j] == 'z1') {
                        this.addBossWarMachine(cc.v3(i, j));
                    }
                    if (mapData[i][j] == 'z2') {
                        this.addBossCaptain(cc.v3(i, j));
                    }
                    if (mapData[i][j] == 'z3') {
                        this.addBossKraken(cc.v3(i, j));
                    }
                    if (mapData[i][j] == 'z4') {
                        this.addBossSlime(0, cc.v3(i, j));
                    }
                    if (mapData[i][j] == 'z5') {
                        this.addBossDryad(cc.v3(i, j));
                    }
                    if (mapData[i][j] == 'z6') {
                        this.addBossRah(cc.v3(i, j));
                    }
                    if (mapData[i][j] == 'z7') {
                        this.addBossSphinx(cc.v3(i, j));
                    }
                    if (mapData[i][j] == 'z8') {
                        this.addBossEvilEye(cc.v3(i, j));
                    }
                    if (mapData[i][j] == 'z9') {
                        this.addBossDragon(cc.v3(i, j));
                    }
                }

            }
        }
        if (!Logic.mapManager.isCurrentRoomStateClear() && RoomType.isMonsterGenerateRoom(Logic.mapManager.getCurrentRoomType())) {
            this.monsterManager.addRandomMonsters(this);
        }
        //存档的盒子为空，保存当前盒子位置
        let currbs = Logic.mapManager.getCurrentMapBoxes();
        if (!currbs && boxes.length > 0) {
            Logic.mapManager.setCurrentBoxesArr(boxes);
        }
        //存档的商店为空，保存当前商店状态
        let currts = Logic.mapManager.getCurrentMapShopTables();
        if (!currts && shopTables.length > 0) {
            Logic.mapManager.setCurrentShopTableArr(shopTables);
        }
        //存档的宝箱为空，保存当前宝箱状态
        let currcs = Logic.mapManager.getCurrentMapChests();
        if (!currcs && chests.length > 0) {
            Logic.mapManager.setCurrentChestsArr(chests);
        }
        
        cc.log('load finished');
    }
    isThe(mapStr: string, typeStr: string): boolean {
        let isequal = mapStr.indexOf(typeStr) != -1;
        return isequal;
    }

    addItem(pos: cc.Vec3, resName: string, shopTable?: ShopTable) {
        if (!this.item) {
            return;
        }
        let item = cc.instantiate(this.item);
        item.parent = this.node;
        item.position = pos;
        let indexpos = Dungeon.getIndexInMap(pos);
        item.zIndex = IndexZ.OVERHEAD;
        item.getComponent(Item).init(resName, indexpos.clone(), shopTable);
        let data = item.getComponent(Item).data;
        let curritems = Logic.mapManager.getCurrentMapItems();
        if (curritems) {
            curritems.push(data);
        } else {
            curritems = new Array();
            curritems.push(data);
            Logic.mapManager.setCurrentItemsArr(curritems);
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
    addLighteningFall(pos: cc.Vec3,isTrigger: boolean,needPrepare: boolean, showArea: boolean,damagePoint?:number) {
        if (!this.lighteningFall) {
            return;
        }
        let fall = cc.instantiate(this.lighteningFall);
        let fallScript = fall.getComponent(MagicLightening);
        fall.parent = this.node;
        fall.position = pos;
        fall.zIndex = IndexZ.FLOOR;
        fallScript.isTrigger = isTrigger;
        if(!fallScript.isTrigger){
            fallScript.fall(needPrepare,showArea,damagePoint);
        }
    }
    private addVenom(pos: cc.Vec3) {
        let venom = cc.instantiate(this.venom);
        venom.getComponent(SlimeVenom).player = this.player;
        venom.getComponent(SlimeVenom).isForever = true;
        venom.parent = this.node;
        venom.position = pos;
        venom.zIndex = IndexZ.ACTOR;
    }
    /**冰刺 */
    addIceThron(pos: cc.Vec3, isAuto: boolean) {
        if (!this.iceThron) {
            return;
        }
        let thron = cc.instantiate(this.iceThron);
        let stoneScript = thron.getComponent(IceDemonThron);
        stoneScript.isAuto = isAuto;
        thron.parent = this.node;
        thron.position = pos;
        thron.zIndex = IndexZ.getActorZIndex(pos);
        if (stoneScript.isAuto) {
            stoneScript.fall();
        }

    }
    /**树根缠绕 */
    addTwineGrass(pos: cc.Vec3, isAuto: boolean) {
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

    /**掉落金币 */
    private addCoin(pos: cc.Vec3, count: number) {
        if (this.coinManager) {
            this.coinManager.getValueCoin(count, pos, this.node);
        }
    }
    /**掉落油金 */
    private addOilGold(pos: cc.Vec3, count: number) {
        if (this.coinManager) {
            this.coinManager.getValueOilGold(count, pos, this.node);
        }
    }
    /**放置地上的装备 */
    private addEquipmentListOnGround() {
        let currequipments = Logic.mapManager.getCurrentMapEquipments();
        if (currequipments) {
            for (let tempequip of currequipments) {
                if (this.equipmentManager) {
                    this.equipmentManager.getEquipment(tempequip.img, tempequip.pos, this.node, tempequip, null, null).data;
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
                    this.addItem(Dungeon.getPosInMap(tempeitem.pos), tempeitem.resName);
                }
            }
        }

    }
    /**添加装备 */
    addEquipment(equipType: string, pos: cc.Vec3, equipData?: EquipmentData, chestQuality?: number, shopTable?: ShopTable) {
        if (this.equipmentManager) {
            let data = this.equipmentManager.getEquipment(equipType, pos, this.node, equipData, chestQuality, shopTable).data;
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
    /**添加怪物 */
    addMonsterFromData(resName: string, i: number, j: number) {
        this.addMonster(this.monsterManager.getMonster(resName, this)
            , cc.v3(i, j));
    }

    private addBossSlime(type: number, index: cc.Vec3) {
        if (!this.bosses) {
            return;
        }
        this.bosses.push(this.monsterManager.getSlime(this, index.clone(), type));
    }
    private addBossCaptain(index: cc.Vec3) {
        if (!this.bosses) {
            return;
        }
        this.bosses.push(this.monsterManager.getCaptain(this, index.clone()));
    }
    private addBossWarMachine(index: cc.Vec3) {
        if (!this.bosses) {
            return;
        }
        let boss = this.monsterManager.getWarMachine(this, index.clone());
        this.bosses.push(boss);
        this.scheduleOnce(() => {
            boss.showBoss();
        }, 3.5);
    }
    private addBossDryad(index: cc.Vec3) {
        if (!this.bosses) {
            return;
        }
        let boss = this.monsterManager.getDryad(this, index.clone());
        this.bosses.push(boss);
        this.scheduleOnce(() => {
            boss.showBoss();
        }, 2);
    }
    private addBossDragon(index: cc.Vec3) {
        if (!this.bosses) {
            return;
        }
        let boss = this.monsterManager.getDragon(this, index.clone());
        this.bosses.push(boss);
        this.scheduleOnce(() => {
            boss.showBoss();
        }, 2);
    }
    private addBossSphinx(index: cc.Vec3) {
        if (!this.bosses) {
            return;
        }
        let boss = this.monsterManager.getSphinx(this, index.clone());
        this.bosses.push(boss);
        this.scheduleOnce(() => {
            boss.showBoss();
        }, 2);
    }
    private addBossRah(index: cc.Vec3) {
        if (!this.bosses) {
            return;
        }
        let boss = this.monsterManager.getRah(this, index.clone());
        this.bosses.push(boss);
        this.scheduleOnce(() => {
            boss.showBoss();
        }, 2);
    }
    private addBossIceDemon(index: cc.Vec3) {
        if (!this.bosses) {
            return;
        }
        let boss = this.monsterManager.getIceDemon(this, index.clone());
        this.bosses.push(boss);
        this.scheduleOnce(() => {
            boss.showBoss();
        }, 2);
    }
    private addBossEvilEye(index: cc.Vec3) {
        if (!this.bosses) {
            return;
        }
        let boss = this.monsterManager.getEvilEye(this, index.clone());
        this.bosses.push(boss);
        this.scheduleOnce(() => {
            boss.showBoss();
        }, 2);
    }
    private addBossKraken(index: cc.Vec3) {
        if (!this.bosses) {
            return;
        }
        this.dungeonStyleManager.changeTopWalls(false);
        this.isZoomCamera = true;
        let boss = this.monsterManager.getKraken(this, index.clone());
        this.bosses.push(boss);
        this.anim.playAdditive('DungeonShakeOnce');
        this.scheduleOnce(() => { this.anim.playAdditive('DungeonShakeOnce'); }, 1);
        this.scheduleOnce(() => { this.anim.playAdditive('DungeonShakeOnce'); }, 2);

        this.scheduleOnce(() => {
            boss.showBoss();
            // this.anim.play('DungeonWave');
        }, 3.5);
    }
    private addMonster(monster: Monster, pos: cc.Vec3) {
        //激活
        monster.node.active = true;
        monster.pos = pos;
        monster.node.position = Dungeon.getPosInMap(pos);
        this.monsters.push(monster);
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
        this.scheduleOnce(()=>{
            cc.director.emit(EventHelper.CHANGE_MINIMAP, { detail: { x: Logic.mapManager.currentPos.x, y: Logic.mapManager.currentPos.y } });
        },0.1)
        for (let door of Logic.mapManager.getCurrentRoom().doors) {
            this.dungeonStyleManager.setDoor(door.dir, door.isDoor, false, door.isHidden);
        }
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
            this.player.playerAction(dir, pos, dt, this)
        }
    }
    getMonsterAliveNum(): number {
        let count = 0;
        for (let monster of this.monsters) {
            if (monster.isDied) {
                count++;
            }
        }
        return this.monsters.length - count;
    }
    /**检查房间是否清理 */
    checkRoomClear() {
        let isClear = false;
        //检查怪物是否清理
        let count = this.getMonsterAliveNum();
        isClear = count <= 0;
        if (this.bosses.length > 0) {
            count = 0;
            for (let boss of this.bosses) {
                if (boss.isDied) {
                    count++;
                }
            }
            isClear = count >= this.bosses.length;
        }
        //检查踏板是否触发
        for (let footboard of this.footboards) {
            if (!footboard.isOpen) {
                isClear = false;
            }
        }
        //检查是否是测试房间，测试房间默认不关门
        if (Logic.mapManager.getCurrentRoomType().isEqual(RoomType.TEST_ROOM)) {
            isClear = true;
        }
        if (isClear) {
            if (this.portal) {
                this.portal.openGate();
            }
            //第一层的开始房间出口不开放
            let isStartRoom = Logic.mapManager.getCurrentRoom().roomType.isEqual(RoomType.START_ROOM);
            if (this.dungeonStyleManager && this.dungeonStyleManager.exitdoor
                && this.dungeonStyleManager.exitdoor
                && !isStartRoom) {
                this.dungeonStyleManager.changeTopWalls(true);
                this.dungeonStyleManager.exitdoor.openGate();
            }
            this.openDoors();
        }

    }
    /**开门 */
    openDoors() {
        for (let door of Logic.mapManager.getCurrentRoom().doors) {
            Logic.mapManager.setRoomClear(Logic.mapManager.currentPos.x, Logic.mapManager.currentPos.y);
            this.dungeonStyleManager.setDoor(door.dir, door.isDoor, true, door.isHidden);
        }
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
        for (let monster of this.monsters) {
            if (monster.isDied) {
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
        if (this.isTimeDelay(dt)) {
            this.checkPlayerPos(dt);
            // this.checkMonstersPos();
        }
        if (this.isCheckTimeDelay(dt)) {
            this.checkRoomClear();
        }

    }
}
