import Player from "./Player";
import Tile from "./Tile";
import Monster from "./Monster";
import Logic from "./Logic";
import { EventConstant } from "./EventConstant";
import MonsterManager from "./Manager/MonsterManager";
import Kraken from "./Boss/Kraken";
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
import Captain from "./Boss/Captain";
import FallStone from "./Building/FallStone";
import Emplacement from "./Building/Emplacement";

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
    heart: cc.Prefab = null;
    @property(cc.Prefab)
    ammo: cc.Prefab = null;
    @property(cc.Prefab)
    shop: cc.Prefab = null;
    @property(cc.Prefab)
    shoptable: cc.Prefab = null;
    @property(cc.Prefab)
    floorDecoration: cc.Prefab = null;
    @property(Player)
    player: Player = null;
    @property(cc.Prefab)
    portalPrefab: cc.Prefab = null;
    portal: Portal = null;
    @property(cc.Prefab)
    bed:cc.Prefab = null;
    @property(cc.Node)
    fog: cc.Node = null;
    @property(HealthBar)
    bossHealthBar:HealthBar = null;

    map: Tile[][] = new Array();
    wallmap: Wall[][] = new Array();
    trapmap: Trap[][] = new Array();
    footboards:FootBoard[] = new Array();
    static WIDTH_SIZE: number = 15;
    static HEIGHT_SIZE: number = 9;
    static readonly MAPX: number = 32;
    static readonly MAPY: number = 32;
    static readonly TILE_SIZE: number = 64;
    private timeDelay = 0;
    private npcTimeDelay = 0;

    monsters: Monster[];
    public monsterReswpanPoints: { [key: string]: string } = {};
    monsterManager: MonsterManager = null;
    equipmentManager: EquipmentManager = null;
    dungeonStyleManager: DungeonStyleManager = null;
    coinManager: CoinManger = null;
    anim: cc.Animation;

    bossKraken: Kraken;
    bossIndex: cc.Vec2;
    bossCaptain:Captain;

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        cc.director.on(EventConstant.PLAYER_MOVE, (event) => { this.playerAction(event.detail.dir, event.detail.pos, event.detail.dt) });
        cc.director.on(EventConstant.DUNGEON_SETEQUIPMENT, (event) => {
            this.addEquipment(event.detail.equipmentData.img, event.detail.pos, event.detail.equipmentData);
        });
        cc.director.on(EventConstant.DUNGEON_ADD_COIN, (event) => {
            this.addCoin(event.detail.pos, event.detail.count);
        })
        cc.director.on(EventConstant.DUNGEON_ADD_HEART, (event) => {
            this.addHeart(event.detail.pos);
        })
        cc.director.on(EventConstant.DUNGEON_ADD_FALLSTONE, (event) => {
            this.addFallStone(event.detail.pos,event.detail.isAuto);
        })
        cc.director.on(EventConstant.DUNGEON_ADD_AMMO, (event) => {
            this.addAmmo(event.detail.pos);
        })
        cc.director.on(EventConstant.DUNGEON_SHAKEONCE, (event) => {
            if (this.anim) {
                this.anim.play('DungeonShakeOnce');
            }
        });

        this.fog.zIndex = 9000;
        let mapData: string[][] = Logic.getCurrentMapData().map;
        this.monsterManager = this.getComponent(MonsterManager);
        this.equipmentManager = this.getComponent(EquipmentManager);
        this.coinManager = this.getComponent(CoinManger);
        this.dungeonStyleManager = this.getComponent(DungeonStyleManager);
        this.dungeonStyleManager.addDecorations();
        this.player.node.parent = this.node;

        this.monsters = new Array();
        this.map = new Array();
        this.wallmap = new Array();
        this.trapmap = new Array();
        this.footboards = new Array();
        let boxes:BoxData[] = new Array();
        let shopTables:ShopTableData[] = new Array();
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
                    this.addFallStone(Dungeon.getPosInMap(cc.v2(i, j)),false);
                }
                //生成装饰
                if (mapData[i][j] == '+') {
                    let fd = cc.instantiate(this.floorDecoration);
                    fd.parent = this.node;
                    fd.position = Dungeon.getPosInMap(cc.v2(i, j));
                    fd.zIndex = 2000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                }
                //生成床
                if (mapData[i][j] == '-') {
                    let bed = cc.instantiate(this.bed);
                    bed.parent = this.node;
                    bed.position = Dungeon.getPosInMap(cc.v2(i, j));
                    bed.zIndex = 2000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                    let front = bed.getChildByName('front');
                    front.position = Dungeon.getPosInMap(cc.v2(i, j));
                    front.position = cc.v2(front.position.x,front.position.y+40);
                    front.parent = this.node;
                    front.zIndex = 5000;
                }
                //生成踏板
                if (mapData[i][j] == 'F') {
                    let foot = cc.instantiate(this.footboard);
                    foot.parent = this.node;
                    foot.position = Dungeon.getPosInMap(cc.v2(i, j));
                    foot.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                    this.footboards.push(foot.getComponent(FootBoard));
                }
                //生成宝箱
                if (mapData[i][j] == 'C') {
                    let chest = cc.instantiate(this.chest);
                    chest.parent = this.node;
                    let c = chest.getComponent(Chest)
                    c.setPos(cc.v2(i, j));
                    c.setQuality(Logic.getRandomNum(1, 3), Logic.mapManger.currentRectRoom.state == RectRoom.STATE_CLEAR);

                }
                //生成普通箱子
                if (mapData[i][j] == 'B') {
                    let box = cc.instantiate(this.box);
                    box.parent = this.node;
                    let b = box.getComponent(Box)
                    b.data.defaultPos = cc.v2(i, j);
                    b.setPos(cc.v2(i, j));
                    let currboxes =  Logic.getCurrentMapBoxes();
                    if(currboxes){
                       for(let tempbox of currboxes){
                           if(tempbox.defaultPos.equals(b.data.defaultPos)){
                               b.setPos(tempbox.pos);
                               b.node.position = tempbox.position.clone();
                           }
                       } 
                    }else{
                        boxes.push(b.data);
                    }
                }
                //生成植物
                if (mapData[i][j] == 'G') {
                    let box = cc.instantiate(this.box);
                    box.parent = this.node;
                    let b:Box = box.getComponent(Box);
                    b.data.defaultPos = cc.v2(i, j);
                    b.setPos(cc.v2(i, j));
                    b.changeRes('plant');
                }
                //生成心
                if (mapData[i][j] == 'H') {
                    let heart = cc.instantiate(this.heart);
                    heart.parent = this.node;
                    heart.position = Dungeon.getPosInMap(cc.v2(i, j));
                    heart.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100 + 3;
                }
                //生成弹药
                if (mapData[i][j] == 'A') {
                    let ammo = cc.instantiate(this.ammo);
                    ammo.parent = this.node;
                    ammo.position = Dungeon.getPosInMap(cc.v2(i, j));
                    ammo.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100 + 3;
                }
                //生成商店
                if (mapData[i][j] == 'M') {
                    let table = cc.instantiate(this.shoptable);
                    table.parent = this.node;
                    let ta = table.getComponent(ShopTable);
                    ta.setPos(cc.v2(i, j));
                    let currshoptables =  Logic.getCurrentMapShopTables();
                    if(currshoptables){
                       for(let temptable of currshoptables){
                           if(temptable.pos.equals(ta.data.pos)){
                               ta.data.equipdata = temptable.equipdata.clone();
                               ta.data.isSaled = temptable.isSaled;
                               ta.data.price = temptable.price;
                           }
                       } 
                    }else{
                        shopTables.push(ta.data);
                    }
                    ta.showItem();
                }
                if (mapData[i][j] == 'S') {
                    let shop = cc.instantiate(this.shop);
                    shop.parent = this.node;
                    shop.position = Dungeon.getPosInMap(cc.v2(i, j));
                    shop.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100 + 1;
                }
                if (Logic.mapManger.currentRectRoom.state != RectRoom.STATE_CLEAR) {
                    if (mapData[i][j] == 's') {
                        let sailor = Logic.getHalfChance()?MonsterManager.MONSTER_SAILOR:MonsterManager.MONSTER_STRONGSAILOR;
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
                    if (mapData[i][j] == 'g') {
                        this.addMonsterFromData(MonsterManager.MONSTER_GOBLIN, i, j);
                    }
                    if (mapData[i][j] == 'd') {
                        this.addMonsterFromData(MonsterManager.MONSTER_ANUBIS, i, j);
                    }
                    if (mapData[i][j] == 'm') {
                        this.addMonsterFromData(MonsterManager.MONSTER_MUMMY, i, j);
                    }
                    if (mapData[i][j] == 'k') {
                        this.addMonsterFromData(MonsterManager.MONSTER_KILLER, i, j);
                    }
                    if (mapData[i][j] == 'c') {
                        this.addMonsterFromData(MonsterManager.MONSTER_CHEST, i, j);
                    }
                    if (mapData[i][j] == 'y') {
                        this.addMonsterFromData(MonsterManager.MONSTER_GARGOYLE, i, j);
                    }
                    if (mapData[i][j] == 'b') {
                        this.bossIndex = cc.v2(i, j);

                    }
                }
                if (mapData[i][j] == 'P') {
                    let needAdd = true;
                    if((Logic.level==RectDungeon.LEVEL_5||Logic.level==RectDungeon.LEVEL_3)&&Logic.mapManger.currentRectRoom.roomType == RectDungeon.END_ROOM){
                        needAdd = false;
                    }
                    
                    if(needAdd){
                        let portalP = cc.instantiate(this.portalPrefab);
                        portalP.parent = this.node;
                        this.portal = portalP.getComponent(Portal);
                        if (this.portal) {
                            this.portal.setPos(cc.v2(i, j));
                        }
                    }
                }
            }
        }
        let currbs =  Logic.getCurrentMapBoxes();
        if(!currbs && boxes.length>0){
            Logic.mapManger.setCurrentBoxesArr(boxes);
        }
        let currts =  Logic.getCurrentMapShopTables();
        if(!currts && shopTables.length>0){
            Logic.mapManger.setCurrentShopTableArr(shopTables);
        }
        this.addBoss();
    }
    /**掉落心 */
    addHeart(pos: cc.Vec2) {
        if(!this.heart){
            return;
        }
        let heart = cc.instantiate(this.heart);
        heart.parent = this.node;
        heart.position = pos;
        let indexpos = Dungeon.getIndexInMap(pos);
        heart.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - indexpos.y) * 100 + 3;
        
    }
    /**掉落石头 */
    addFallStone(pos: cc.Vec2,isAuto:boolean) {
        if(!this.fallStone){
            return;
        }
        let stone = cc.instantiate(this.fallStone);
        let stoneScript = stone.getComponent(FallStone);
        stoneScript.isAuto = isAuto;
        stone.parent = this.node;
        stone.position = pos;
        let indexpos = Dungeon.getIndexInMap(pos);
        stone.zIndex = 2000 + (Dungeon.HEIGHT_SIZE - indexpos.y) * 100 + 3;
        if(stoneScript.isAuto){
            stoneScript.fall();
        }
        
    }
    /**掉落弹药 */
    addAmmo(pos: cc.Vec2) {
        if(!this.ammo){
            return;
        }
        let ammo = cc.instantiate(this.ammo);
        ammo.parent = this.node;
        ammo.position = pos;
        let indexpos = Dungeon.getIndexInMap(pos);
        ammo.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - indexpos.y) * 100 + 3;
        
    }
    /**掉落金币 */
    addCoin(pos: cc.Vec2, count: number) {
        if (this.coinManager) {
            this.coinManager.getValueCoin(count, pos, this.node);
        }
    }
    addEquipment(equipType: string, pos: cc.Vec2, equipData?: EquipmentData, chestQuality?: number,shopTable?:ShopTable) {
        if (this.equipmentManager) {
            this.equipmentManager.getEquipment(equipType, pos, this.node, equipData, chestQuality ,shopTable);
        }
    }
    /**添加怪物 */
    addMonsterFromData(resName: string, i: number, j: number) {
        this.addMonster(this.monsterManager.getMonster(resName, this)
            , cc.v2(i, j));
    }

    private breakHalfTiles(): void {
        for (let i = 0; i < Dungeon.WIDTH_SIZE; i++) {
            for (let j = 6; j < Dungeon.HEIGHT_SIZE; j++) {
                this.map[i][j].isAutoShow = false;
                this.breakTile(cc.v2(i, j));
                setTimeout(() => {
                    this.breakTile(cc.v2(i, j));
                }, 100*Math.random())
            }
        }
    }
    private addBoss() {
        if (!this.bossIndex) {
            return;
        }
        if(Logic.mapManger.currentRectRoom.roomType == RectDungeon.BOSS_ROOM){
            this.addBossKraken();
        }else{
            this.addBossCaptain();
        }
    }
    private addBossCaptain(){
        this.bossCaptain = this.monsterManager.getCaptain(this, this.bossIndex);
    }
    private addBossKraken(){
        this.bossKraken = this.monsterManager.getKraken(this, this.bossIndex);
        this.anim.playAdditive('DungeonShakeOnce');
        setTimeout(()=>{this.anim.playAdditive('DungeonShakeOnce');},1000);
        setTimeout(()=>{this.anim.playAdditive('DungeonShakeOnce');},2000);
        this.breakHalfTiles();
        setTimeout(() => {
            this.bossKraken.showBoss();
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
    static getIndexInMap(pos: cc.Vec2,canOuter?:boolean) {
        let x = (pos.x - Dungeon.MAPX) / Dungeon.TILE_SIZE;
        let y = (pos.y - Dungeon.MAPY) / Dungeon.TILE_SIZE;
        x = Math.round(x);
        y = Math.round(y);
        if(!canOuter){
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
        cc.director.emit(EventConstant.CHANGE_MIMIMAP, {detail:{ x: Logic.mapManger.currentRectRoom.x, y: Logic.mapManger.currentRectRoom.y }});
        for (let door of Logic.mapManger.currentRectRoom.doors) {
            this.dungeonStyleManager.setDoor(door.dir, door.isDoor, false);
        }
    }
    breakTile(pos: cc.Vec2) {
        let tile = this.map[pos.x][pos.y];
        if (!tile.isBroken) {
            tile.breakTile();
        }
    }
    playerAction(dir: number, pos: cc.Vec2, dt: number) {
        if (this.player) {
            this.player.playerAction(dir, pos, dt, this)
        }
    }
    monstersAction() {
        let isClear = false;
        let count = 0;
        for (let monster of this.monsters) {
            if (monster.isDied) {
                count++;
            }
        }
        isClear = count >= this.monsters.length;
        if (this.bossKraken && !this.bossKraken.isDied) {
            isClear = false;
        }
        if (this.bossCaptain && !this.bossCaptain.isDied) {
            isClear = false;
        }
        for (let footboard of this.footboards) {
            if (!footboard.isOpen) {
                isClear = false;
            }
        }
        if (isClear) {
            if (this.portal) {
                this.portal.openGate();
            }
            this.openDoors();
        }

    }
    openDoors() {
        for (let door of Logic.mapManger.currentRectRoom.doors) {
            Logic.mapManger.currentRectRoom.state = RectRoom.STATE_CLEAR;
            let needClose = false;
            if (RectDungeon.isRoomEqual(Logic.mapManger.currentRectRoom, Logic.mapManger.rectDungeon.startRoom)) {
                if (Logic.mapManger.rectDungeon.endRoom.state != RectRoom.STATE_CLEAR) {
                    let t = Logic.mapManger.rectDungeon.getNeighborRoomType(Logic.mapManger.currentRectRoom.x, Logic.mapManger.currentRectRoom.y, door.dir);
                    if (t.roomType == RectDungeon.END_ROOM&&Logic.level!=RectDungeon.LEVEL_5&&Logic.level!=RectDungeon.LEVEL_3) {
                        needClose = true;
                    }
                }
            }
            if (Logic.level == 1) {
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
    lerp(self:cc.Vec2,to:cc.Vec2, ratio:number):cc.Vec2 {
        let out = cc.v2(0,0);
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
    isNpcTimeDelay(dt: number): boolean {
        this.npcTimeDelay += dt;
        if (this.npcTimeDelay > 1) {
            this.npcTimeDelay = 0;
            return true;
        }
        return false;
    }

    update(dt) {
        if (this.isTimeDelay(dt)) {
            this.checkPlayerPos(dt);
            // this.checkMonstersPos();
        }
        if (this.isNpcTimeDelay(dt)) {
            this.monstersAction();
            if(this.bossKraken){
                this.bossKraken.bossAction(this);
            }
        }
    }
}
