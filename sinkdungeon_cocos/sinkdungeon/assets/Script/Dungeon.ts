import Player from "./Player";
import Tile from "./Tile";
import Monster from "./Monster";
import Logic from "./Logic";
import { EventConstant } from "./EventConstant";
import MonsterManager from "./Manager/MonsterManager";
import Portal from "./Building/Portal";
import Wall from "./Building/Wall";
import Trap from "./Building/Trap";
import MapData from "./Data/MapData";
import Item from "./Item/Item";
import EquipmentManager from "./Manager/EquipmentManager";
import EquipmentData from "./Data/EquipmentData";
import DungeonStyleManager from "./Manager/DungeonStyleManager";
import RectDoor from "./Rect/RectDoor";
import RectRoom from "./Rect/RectRoom";
import RectDungeon from "./Rect/RectDungeon";
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
import TarotTable from "./Building/TarotTable";
import ChestData from "./Data/ChestData";
import ItemData from "./Data/ItemData";

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
    emplacement: cc.Prefab = null;
    @property(cc.Prefab)
    footboard: cc.Prefab = null;
    @property(cc.Prefab)
    chest: cc.Prefab = null;
    @property(cc.Prefab)
    box: cc.Prefab = null;
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
    @property(cc.Node)
    fog: cc.Node = null;
    @property(HealthBar)
    bossHealthBar: HealthBar = null;

    map: Tile[][] = new Array();//地图列表
    wallmap: Wall[][] = new Array();//墙列表
    trapmap: Trap[][] = new Array();//陷阱列表
    footboards: FootBoard[] = new Array();//踏板列表
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

    bosses: Boss[] = [];
    bossIndex: cc.Vec2;

    onLoad() {
        //初始化动画
        this.anim = this.getComponent(cc.Animation);
        //初始化监听
        cc.director.on(EventConstant.PLAYER_MOVE, (event) => { this.playerAction(event.detail.dir, event.detail.pos, event.detail.dt) });
        cc.director.on(EventConstant.DUNGEON_SETEQUIPMENT, (event) => {
            this.addEquipment(event.detail.equipmentData.img, event.detail.pos, event.detail.equipmentData);
        });
        cc.director.on(EventConstant.DUNGEON_ADD_COIN, (event) => {
            this.addCoin(event.detail.pos, event.detail.count);
        })
        cc.director.on(EventConstant.DUNGEON_ADD_HEART, (event) => {
            this.addItem(event.detail.pos, Item.HEART);
        })
        cc.director.on(EventConstant.DUNGEON_ADD_FALLSTONE, (event) => {
            this.addFallStone(event.detail.pos, event.detail.isAuto);
        })
        cc.director.on(EventConstant.DUNGEON_ADD_AMMO, (event) => {
            this.addItem(event.detail.pos, Item.AMMO);
        })
        cc.director.on(EventConstant.DUNGEON_SHAKEONCE, (event) => {
            if (this.anim) {
                this.anim.play('DungeonShakeOnce');
            }
        });
        cc.director.on(EventConstant.BOSS_ADDSLIME, (event) => {
            this.addBossSlime(event.detail.slimeType, event.detail.posIndex);
        })
        //设置雾气层级
        this.fog.zIndex = 9000;
        let mapData: string[][] = Logic.mapManager.getCurrentMapData().map;
        this.monsterManager = this.getComponent(MonsterManager);
        this.equipmentManager = this.getComponent(EquipmentManager);
        this.coinManager = this.getComponent(CoinManger);
        this.dungeonStyleManager = this.getComponent(DungeonStyleManager);
        this.dungeonStyleManager.addDecorations();
        this.player = cc.instantiate(this.playerPrefab).getComponent(Player);
        this.player.node.parent = this.node;

        this.bosses = new Array();
        this.monsters = new Array();
        this.map = new Array();
        this.wallmap = new Array();
        this.trapmap = new Array();
        this.footboards = new Array();
        let boxes: BoxData[] = new Array();
        let shopTables: ShopTableData[] = new Array();
        let chests: ChestData[] = new Array();
        this.addItemListOnGround();
        for (let i = 0; i < Dungeon.WIDTH_SIZE; i++) {
            this.map[i] = new Array(i);
            this.wallmap[i] = new Array(i);
            this.trapmap[i] = new Array(i);
            for (let j = 0; j < Dungeon.HEIGHT_SIZE; j++) {
                let t = cc.instantiate(this.tile);
                t.parent = this.node;
                t.position = Dungeon.getPosInMap(cc.v2(i, j));
                //越往下层级越高，j是行，i是列
                t.zIndex = 1000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                this.map[i][j] = t.getComponent(Tile);
                //默认关闭踩踏掉落
                this.map[i][j].isAutoShow = false;
                if (mapData[i][j] == '#') {
                    //开启踩踏掉落
                    this.map[i][j].isAutoShow = true;
                }
                //生成墙
                if (mapData[i][j] == 'W') {
                    let w = cc.instantiate(this.wall);
                    w.parent = this.node;
                    w.position = Dungeon.getPosInMap(cc.v2(i, j));
                    w.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                    w.opacity = 255;
                    this.wallmap[i][j] = w.getComponent(Wall);
                }
                //生成陷阱
                if (mapData[i][j] == 'T') {
                    let trap = cc.instantiate(this.trap);
                    trap.parent = this.node;
                    trap.position = Dungeon.getPosInMap(cc.v2(i, j));
                    trap.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                    this.trapmap[i][j] = trap.getComponent(Trap);
                }
                //生成炮台
                if (mapData[i][j] == 'E') {
                    let emplacement = cc.instantiate(this.emplacement);
                    emplacement.parent = this.node;
                    emplacement.position = Dungeon.getPosInMap(cc.v2(i, j));
                    emplacement.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                    let em = emplacement.getComponent(Emplacement);
                    em.dungeon = this;
                }
                //生成落石
                if (mapData[i][j] == 'D') {
                    this.addFallStone(Dungeon.getPosInMap(cc.v2(i, j)), false);
                }
                //生成装饰
                if (mapData[i][j] == '+') {
                    let fd = cc.instantiate(this.floorDecoration);
                    fd.parent = this.node;
                    fd.position = Dungeon.getPosInMap(cc.v2(i, j));
                    fd.zIndex = 2000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                }
                //生成营火
                if (mapData[i][j] == '-' && Logic.chapterName == Logic.CHAPTER02) {
                    let camp = cc.instantiate(this.campFire);
                    camp.parent = this.node;
                    camp.position = Dungeon.getPosInMap(cc.v2(i, j));
                    camp.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100 - 2;
                    let shadow = camp.getChildByName('sprite').getChildByName('shadow');
                    shadow.position = Dungeon.getPosInMap(cc.v2(i, j));
                    shadow.position = cc.v2(shadow.position.x, shadow.position.y + 40);
                    shadow.parent = this.node;
                    shadow.zIndex = 3000;
                }
                //生成踏板
                if (mapData[i][j] == 'F') {
                    let foot = cc.instantiate(this.footboard);
                    foot.parent = this.node;
                    foot.position = Dungeon.getPosInMap(cc.v2(i, j));
                    foot.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                    this.footboards.push(foot.getComponent(FootBoard));
                }
                //生成毒液
                if (mapData[i][j] == 'V') {
                    let venom = cc.instantiate(this.venom);
                    venom.getComponent(SlimeVenom).player = this.player;
                    venom.getComponent(SlimeVenom).isForever = true;
                    venom.parent = this.node;
                    venom.position = Dungeon.getPosInMap(cc.v2(i, j));
                    venom.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                }
                //生成塔罗
                if (mapData[i][j] == 'O') {
                    let tarottable = cc.instantiate(this.tarotTable);
                    tarottable.parent = this.node;
                    tarottable.position = Dungeon.getPosInMap(cc.v2(i, j));
                    tarottable.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                }
                //生成宝箱 房间清理的情况下箱子是打开的
                if (mapData[i][j] == 'C') {
                    let chest = cc.instantiate(this.chest);
                    chest.parent = this.node;
                    let c = chest.getComponent(Chest)
                    c.setPos(cc.v2(i, j));
                    c.setQuality(Logic.getRandomNum(1, 3), false);
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
                if (mapData[i][j] == 'B') {
                    let box = cc.instantiate(this.box);
                    box.parent = this.node;
                    let b = box.getComponent(Box)
                    b.data.defaultPos = cc.v2(i, j);
                    b.setPos(cc.v2(i, j));
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
                //生成植物
                if (mapData[i][j] == 'G') {
                    let box = cc.instantiate(this.box);
                    box.parent = this.node;
                    let b: Box = box.getComponent(Box);
                    b.data.defaultPos = cc.v2(i, j);
                    b.setPos(cc.v2(i, j));
                    b.boxType = Box.PLANT;
                }
                //房间未清理时加载物品
                if (!Logic.mapManager.isCurrentRoomStateClear()) {
                    //生成心
                    if (mapData[i][j] == 'H') {
                        this.addItem(Dungeon.getPosInMap(cc.v2(i, j)), Item.HEART);
                    }
                    //生成弹药
                    if (mapData[i][j] == 'A') {
                        this.addItem(Dungeon.getPosInMap(cc.v2(i, j)), Item.AMMO);
                    }
                    //生成红色药丸
                    if (mapData[i][j] == 'R') {
                        this.addItem(Dungeon.getPosInMap(cc.v2(i, j)), Item.REDCAPSULE);
                    }
                    //生成蓝色药丸
                    if (mapData[i][j] == 'Q') {
                        this.addItem(Dungeon.getPosInMap(cc.v2(i, j)), Item.BLUECAPSULE);
                    }
                    //生成无敌盾
                    if (mapData[i][j] == 'I') {
                        this.addItem(Dungeon.getPosInMap(cc.v2(i, j)), Item.SHIELD);
                    }
                }
                //生成商店
                if (mapData[i][j] == 'M') {
                    let table = cc.instantiate(this.shoptable);
                    table.parent = this.node;
                    let ta = table.getComponent(ShopTable);
                    ta.setPos(cc.v2(i, j));
                    let currshoptables = Logic.mapManager.getCurrentMapShopTables();
                    if (currshoptables) {
                        for (let temptable of currshoptables) {
                            if (temptable.pos.equals(ta.data.pos)) {
                                ta.data.equipdata = temptable.equipdata.clone();
                                ta.data.isSaled = temptable.isSaled;
                                ta.data.price = temptable.price;
                            }
                        }
                    } else {
                        shopTables.push(ta.data);
                    }
                    ta.showItem();
                }
                //生成下一层传送门(暂时废弃)
                if (mapData[i][j] == 'P') {
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
                            this.portal.setPos(cc.v2(i, j));
                        }
                    }
                }
                //生成店主
                if (mapData[i][j] == 'S') {
                    let shop = cc.instantiate(this.shop);
                    shop.parent = this.node;
                    shop.position = Dungeon.getPosInMap(cc.v2(i, j));
                    shop.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100 + 1;
                }
                //房间未清理时加载怪物
                if (!Logic.mapManager.isCurrentRoomStateClear()) {
                    if (mapData[i][j] == 's') {
                        let sailor = Logic.getHalfChance() ? MonsterManager.MONSTER_SAILOR : MonsterManager.MONSTER_STRONGSAILOR;
                        this.addMonsterFromData(sailor, i, j);
                    }
                    if (mapData[i][j] == 'p') {
                        this.addMonsterFromData(MonsterManager.MONSTER_PIRATE, i, j);
                    }
                    if (mapData[i][j] == 'o') {
                        this.addMonsterFromData(MonsterManager.MONSTER_OCTOPUS, i, j);
                    }
                    if (mapData[i][j] == 'a') {
                        this.addMonsterFromData(MonsterManager.MONSTER_SLIME, i, j);
                    }
                    if (mapData[i][j] == 'c') {
                        this.addMonsterFromData(MonsterManager.MONSTER_CHEST, i, j);
                    }
                    if (mapData[i][j] == 'd') {
                        this.addMonsterFromData(MonsterManager.MONSTER_ANUBIS, i, j);
                    }
                    if (mapData[i][j] == 'e') {
                        this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, i, j);
                        this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, i, j);
                        this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, i, j);
                        this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, i, j);
                        this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, i, j);
                    }
                    if (mapData[i][j] == 'g') {
                        this.addMonsterFromData(MonsterManager.MONSTER_GOBLIN, i, j);
                    }
                    if (mapData[i][j] == 'm') {
                        this.addMonsterFromData(MonsterManager.MONSTER_MUMMY, i, j);
                    }
                    if (mapData[i][j] == 'j') {
                        this.addMonsterFromData(MonsterManager.MONSTER_CHICKEN, i, j);
                    }
                    if (mapData[i][j] == 'k') {
                        this.addMonsterFromData(MonsterManager.MONSTER_KILLER, i, j);
                    }
                    if (mapData[i][j] == 'y') {
                        this.addMonsterFromData(MonsterManager.MONSTER_GARGOYLE, i, j);
                    }
                    if (mapData[i][j] == 'b') {
                        this.bossIndex = cc.v2(i, j);

                    }
                }

            }
        }
        //保存当前盒子位置
        let currbs = Logic.mapManager.getCurrentMapBoxes();
        if (!currbs && boxes.length > 0) {
            Logic.mapManager.setCurrentBoxesArr(boxes);
        }
        //保存当前商店状态
        let currts = Logic.mapManager.getCurrentMapShopTables();
        if (!currts && shopTables.length > 0) {
            Logic.mapManager.setCurrentShopTableArr(shopTables);
        }
        //保存当前宝箱状态
        let currcs = Logic.mapManager.getCurrentMapChests();
        if (!currcs && chests.length > 0) {
            Logic.mapManager.setCurrentChestsArr(chests);
        }
        this.addBoss();
        this.addEquipmentListOnGround();
    }
    addItem(pos: cc.Vec2, resName: string,noSave?:boolean) {
        if (!this.item) {
            return;
        }
        let item = cc.instantiate(this.item);
        item.parent = this.node;
        item.position = pos;
        let indexpos = Dungeon.getIndexInMap(pos);
        item.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - indexpos.y) * 100 + 3;
        item.getComponent(Item).init(resName,indexpos.clone());
        if(noSave){
            return;
        }
        let data = item.getComponent(Item).data;
        let curritems = Logic.mapManager.getCurrentMapItems();
            if (curritems) {
                curritems.push(data);
            }else{
                curritems = new Array();
                curritems.push(data);
                Logic.mapManager.setCurrentItemsArr(curritems);
            }

    }

    /**掉落石头 */
    addFallStone(pos: cc.Vec2, isAuto: boolean) {
        if (!this.fallStone) {
            return;
        }
        let stone = cc.instantiate(this.fallStone);
        let stoneScript = stone.getComponent(FallStone);
        stoneScript.isAuto = isAuto;
        stone.parent = this.node;
        stone.position = pos;
        let indexpos = Dungeon.getIndexInMap(pos);
        stone.zIndex = 2000 + (Dungeon.HEIGHT_SIZE - indexpos.y) * 100 + 3;
        if (stoneScript.isAuto) {
            stoneScript.fall();
        }

    }

    /**掉落金币 */
    addCoin(pos: cc.Vec2, count: number) {
        if (this.coinManager) {
            this.coinManager.getValueCoin(count, pos, this.node);
        }
    }
    addEquipmentListOnGround() {
        let currequipments = Logic.mapManager.getCurrentMapEquipments();
        if (currequipments) {
            for (let tempequip of currequipments) {
                if (this.equipmentManager) {
                    this.equipmentManager.getEquipment(tempequip.img, tempequip.pos, this.node, tempequip, null, null).data;
                }
            }
        }
        
    }
    addItemListOnGround() {
        let curritems = Logic.mapManager.getCurrentMapItems();
        Logic.mapManager.setCurrentItemsArr(new Array());
        if (curritems) {
            for (let tempeitem of curritems) {
                if (!tempeitem.isTaken) {
                    this.addItem(Dungeon.getPosInMap(tempeitem.pos),tempeitem.resName,true);
                }
            }
        }
        
    }
    /**添加装备 */
    addEquipment(equipType: string, pos: cc.Vec2, equipData?: EquipmentData, chestQuality?: number, shopTable?: ShopTable) {
        if (this.equipmentManager) {
            let data = this.equipmentManager.getEquipment(equipType, pos, this.node, equipData, chestQuality, shopTable).data;
            let currequipments = Logic.mapManager.getCurrentMapEquipments();
            if (currequipments) {
                currequipments.push(data);
            }else{
                currequipments = new Array();
                currequipments.push(data);
                Logic.mapManager.setCurrentEquipmentsArr(currequipments);
            }
        }
    }
    /**添加怪物 */
    addMonsterFromData(resName: string, i: number, j: number) {
        this.addMonster(this.monsterManager.getMonster(resName, this)
            , cc.v2(i, j));
    }

    private breakHalfTiles(): void {
        for (let i = 1; i < Dungeon.WIDTH_SIZE - 1; i++) {
            for (let j = 6; j < Dungeon.HEIGHT_SIZE - 1; j++) {
                this.map[i][j].isAutoShow = false;
                this.breakTile(cc.v2(i, j));
                setTimeout(() => {
                    this.breakTile(cc.v2(i, j));
                }, 100 * Math.random())
            }
        }
    }
    private addBoss() {
        if (!this.bossIndex) {
            return;
        }
        if (Logic.mapManager.getCurrentRoomType() == RectDungeon.BOSS_ROOM) {
            this.addBossKraken();
        } else {
            if (Logic.chapterName == Logic.CHAPTER02) {
                this.addBossSlime(0, this.bossIndex);
            } else {
                this.addBossCaptain();
            }
        }
    }
    addBossSlime(type: number, index: cc.Vec2) {
        if (!this.bosses) {
            return;
        }
        let posIndex = cc.v2(index.x, index.y);
        this.bosses.push(this.monsterManager.getSlime(this, posIndex, type));
    }
    private addBossCaptain() {
        if (!this.bosses) {
            return;
        }
        this.bosses.push(this.monsterManager.getCaptain(this, this.bossIndex));
    }
    private addBossKraken() {
        if (!this.bosses) {
            return;
        }
        let boss = this.monsterManager.getKraken(this, this.bossIndex);
        this.bosses.push(boss);
        this.anim.playAdditive('DungeonShakeOnce');
        setTimeout(() => { this.anim.playAdditive('DungeonShakeOnce'); }, 1000);
        setTimeout(() => { this.anim.playAdditive('DungeonShakeOnce'); }, 2000);
        this.breakHalfTiles();
        setTimeout(() => {
            boss.showBoss();
            // this.anim.play('DungeonWave');
        }, 3500);
    }
    private addMonster(monster: Monster, pos: cc.Vec2) {
        //激活
        monster.node.active = true;
        monster.pos = pos;
        monster.node.position = Dungeon.getPosInMap(pos);
        this.monsters.push(monster);
    }
    //获取地图里下标的坐标
    static getPosInMap(pos: cc.Vec2) {
        let x = Dungeon.MAPX + pos.x * Dungeon.TILE_SIZE;
        let y = Dungeon.MAPY + pos.y * Dungeon.TILE_SIZE;
        return cc.v2(x, y);
    }
    //获取坐标在地图里的下标,canOuter:是否可以超出
    static getIndexInMap(pos: cc.Vec2, canOuter?: boolean) {
        let x = (pos.x - Dungeon.MAPX) / Dungeon.TILE_SIZE;
        let y = (pos.y - Dungeon.MAPY) / Dungeon.TILE_SIZE;
        x = Math.round(x);
        y = Math.round(y);
        if (!canOuter) {
            if (x < 0) { x = 0 }; if (x >= Dungeon.WIDTH_SIZE) { x = Dungeon.WIDTH_SIZE - 1 };
            if (y < 0) { y = 0 }; if (y >= Dungeon.HEIGHT_SIZE) { y = Dungeon.HEIGHT_SIZE - 1 };
        }
        return cc.v2(x, y);
    }
    //获取不超出地图的坐标
    static fixOuterMap(pos: cc.Vec2): cc.Vec2 {
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
            return Dungeon.getPosInMap(cc.v2(x, y));
        } else {
            return pos;
        }
    }

    start() {
        // let ss = this.node.getComponentsInChildren(cc.Sprite);
        // for (let i = 0; i < ss.length; i++) {
        //     if (ss[i].spriteFrame) {
        //         ss[i].spriteFrame.getTexture().setAliasTexParameters();
        //     }
        // }
        cc.director.emit(EventConstant.CHANGE_MINIMAP, { detail: { x: Logic.mapManager.currentPos.x, y: Logic.mapManager.currentPos.y } });
        for (let door of Logic.mapManager.getCurrentRoom().doors) {
            this.dungeonStyleManager.setDoor(door.dir, door.isDoor, false);
        }
    }
    breakTile(pos: cc.Vec2) {
        let tile = this.map[pos.x][pos.y];
        if (!tile.isBroken) {
            tile.breakTile();
        }
    }
    /** 玩家在地牢移动 */
    playerAction(dir: number, pos: cc.Vec2, dt: number) {
        if (this.player) {
            this.player.playerAction(dir, pos, dt, this)
        }
    }
    /**检查房间是否清理 */
    checkRoomClear() {
        let isClear = false;
        //检查怪物是否清理
        let count = 0;
        for (let monster of this.monsters) {
            if (monster.isDied) {
                count++;
            }
        }
        isClear = count >= this.monsters.length;
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
        if (Logic.mapManager.getCurrentRoomType() == RectDungeon.TEST_ROOM) {
            isClear = true;
        }
        if (isClear) {
            if (this.portal) {
                this.portal.openGate();
            }
            if (this.dungeonStyleManager && this.dungeonStyleManager.exitdoor
                && this.dungeonStyleManager.exitdoor
                && !RectDungeon.isRoomEqual(Logic.mapManager.getCurrentRoom(), Logic.mapManager.rectDungeon.startRoom)) {
                this.dungeonStyleManager.exitdoor.openGate();
            }
            this.openDoors();
        }

    }
    /**开门 */
    openDoors() {
        for (let door of Logic.mapManager.getCurrentRoom().doors) {
            Logic.mapManager.setRoomClear(Logic.mapManager.currentPos.x, Logic.mapManager.currentPos.y);
            let needClose = false;
            if (RectDungeon.isRoomEqual(Logic.mapManager.getCurrentRoom(), Logic.mapManager.rectDungeon.startRoom)) {
                if (Logic.mapManager.rectDungeon.endRoom.state != RectRoom.STATE_CLEAR) {
                    let t = Logic.mapManager.rectDungeon.getNeighborRoomType(Logic.mapManager.currentPos.x, Logic.mapManager.currentPos.y, door.dir);
                    if (t && t.roomType == RectDungeon.END_ROOM && Logic.level != RectDungeon.LEVEL_5 && Logic.level != RectDungeon.LEVEL_3) {
                        needClose = true;
                    }
                }
            }
            if (Logic.level <= 1) {
                needClose = false;
            }
            if (!needClose) {
                this.dungeonStyleManager.setDoor(door.dir, door.isDoor, true);
            }
        }
    }
    checkPlayerPos(dt: number) {
        this.fog.setPosition(this.lerp(this.fog.position, this.player.node.position, dt * 3));
        let pos = Dungeon.getIndexInMap(this.player.node.position);
        let tile = this.map[pos.x][pos.y];
        if (tile.isBroken) {
            this.player.fall();
        }
        if (tile.isAutoShow) {
            this.breakTile(pos);
        }
    }
    lerp(self: cc.Vec2, to: cc.Vec2, ratio: number): cc.Vec2 {
        let out = cc.v2(0, 0);
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
            let tile = this.map[monster.pos.x][monster.pos.y];
            if (tile.isBroken) {
                monster.fall();
            }
            // if (tile.isBroken && !monster.isMoving) {
            //     monster.fall();
            // }
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
