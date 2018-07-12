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
    heart: cc.Prefab = null;
    @property(Player)
    player: Player = null;
    @property(cc.Prefab)
    portalPrefab: cc.Prefab = null;
    portal: Portal = null;
    @property(cc.Node)
    fog:cc.Node = null;

    map: Tile[][] = new Array();
    wallmap: Wall[][] = new Array();
    trapmap: Trap[][] = new Array();
    itemmap: Item[][] = new Array();
    static readonly WIDTH_SIZE: number = 15;
    static readonly HEIGHT_SIZE: number = 9;
    static readonly MAPX: number = 32;
    static readonly MAPY: number = 32;
    static readonly TILE_SIZE: number = 64;
    private timeDelay = 0;
    private npcTimeDelay = 0;

    monsters: Monster[];
    public monsterReswpanPoints: { [key: string]: string } = {};
    monsterManager: MonsterManager = null;
    equipmentManager: EquipmentManager = null;
    dungeonStyleManager:DungeonStyleManager = null;
    anim: cc.Animation;

    bossKraken: Kraken;

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        cc.director.on(EventConstant.PLAYER_MOVE, (event) => { this.playerAction(event.detail.dir,event.detail.pos,event.detail.dt) });
        cc.director.on(EventConstant.DUNGEON_SETEQUIPMENT, (event) => {
            this.addEquipment(event.detail.equipmentData.img, event.detail.pos, event.detail.equipmentData);
        });
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        this.fog.zIndex = 9000;
        this.monsterManager = this.getComponent(MonsterManager);
        this.equipmentManager = this.getComponent(EquipmentManager);
        this.dungeonStyleManager = this.getComponent(DungeonStyleManager);
        this.player.node.parent = this.node;
        let mapData: string[][] = Logic.getCurrentMapData().map;
        
        this.monsters = new Array();
        this.map = new Array();
        this.wallmap = new Array();
        this.trapmap = new Array();
        this.itemmap = new Array();
        for (let i = 0; i < Dungeon.WIDTH_SIZE; i++) {
            this.map[i] = new Array(i);
            this.wallmap[i] = new Array(i);
            this.trapmap[i] = new Array(i);
            this.itemmap[i] = new Array(i);
            for (let j = 0; j < Dungeon.HEIGHT_SIZE; j++) {
                let t = cc.instantiate(this.tile);
                t.parent = this.node;
                t.position = Dungeon.getPosInMap(cc.v2(i, j));
                //越往下层级越高，j是行，i是列
                t.zIndex = 1000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                this.map[i][j] = t.getComponent(Tile);
                if (mapData[i][j] == '*') {
                    //关闭踩踏掉落
                    this.map[i][j].isAutoShow = false;
                }
                //生成墙
                // if (!(i == 4 && j == 4) && Math.random() < 0.1 && !Logic.isBossLevel(Logic.level)
                //     && !this.monsterReswpanPoints[`${i},${j}`])
                if (mapData[i][j] == 'W') {
                    let w = cc.instantiate(this.wall);
                    w.parent = this.node;
                    w.position = Dungeon.getPosInMap(cc.v2(i, j));
                    w.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                    w.opacity = 255;
                    this.wallmap[i][j] = w.getComponent(Wall);
                    //关闭踩踏掉落
                    this.map[i][j].isAutoShow = false;
                }
                //生成陷阱
                // if (!(i == 4 && j == 4) && Math.random() < 0.1 && !Logic.isBossLevel(Logic.level)
                //     && !this.wallmap[i][j] && !this.monsterReswpanPoints[`${i},${j}`])
                if (mapData[i][j] == 'T') {
                    let trap = cc.instantiate(this.trap);
                    trap.parent = this.node;
                    trap.position = Dungeon.getPosInMap(cc.v2(i, j));
                    trap.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100;
                    this.trapmap[i][j] = trap.getComponent(Trap);
                    //关闭踩踏掉落
                    this.map[i][j].isAutoShow = false;
                }
                //生成心
                if (mapData[i][j] == 'H') {
                    let heart = cc.instantiate(this.heart);
                    heart.parent = this.node;
                    heart.position = Dungeon.getPosInMap(cc.v2(i, j));
                    heart.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - j) * 100 + 3;
                    this.itemmap[i][j] = heart.getComponent(Item);
                }
                if (mapData[i][j] == 's') {
                    this.addMonsterFromData(MonsterManager.MONSTER_SAILOR, i, j);
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
                if (mapData[i][j] == 'P') {
                    let portalP = cc.instantiate(this.portalPrefab);
                    portalP.parent = this.node;
                    this.portal = portalP.getComponent(Portal);
                    //关闭踩踏掉落
                    this.map[i][j].isAutoShow = false;
                    if(this.portal){
                        this.portal.setPos(cc.v2(i, j));
                    }
                }
            }
        }
        if (Logic.chapterName == 'chapter00') {
            this.addEquipment(EquipmentManager.WEAPON_KNIFE, cc.v2(4, 6));
            this.addEquipment(EquipmentManager.CLOTHES_SHIRT, cc.v2(5, 6));
            this.addEquipment(EquipmentManager.CLOTHES_VEST, cc.v2(6, 6));
            this.addEquipment(EquipmentManager.HELMET_BUCKETHAT, cc.v2(7, 6));
        }

        // this.addMonsters();
        this.addkraken();
    }
    addEquipment(equipType: string, pos: cc.Vec2, equipData?: EquipmentData) {
        if(this.equipmentManager){
            this.equipmentManager.getEquipment(equipType, pos, this.node, equipData);
        }
    }
    addMonsterFromData(resName: string, i: number, j: number) {
        this.addMonster(this.monsterManager.getMonster(resName, this.node)
            , cc.v2(i, j));
    }
    // //随机用
    // addMonsters(): void {
    //     let levelcount = 1;
    //     this.monsterReswpanPoints['0,0'] = MonsterManager.MONSTER_SAILOR;
    //     this.monsterReswpanPoints['0,8'] = MonsterManager.MONSTER_SAILOR;
    //     this.monsterReswpanPoints['8,0'] = MonsterManager.MONSTER_SAILOR;
    //     this.monsterReswpanPoints['8,8'] = MonsterManager.MONSTER_PIRATE;
    //     this.monsterReswpanPoints['0,4'] = MonsterManager.MONSTER_SAILOR;
    //     this.monsterReswpanPoints['4,0'] = MonsterManager.MONSTER_PIRATE;
    //     this.monsterReswpanPoints['8,4'] = MonsterManager.MONSTER_SAILOR;
    //     this.monsterReswpanPoints['4,8'] = MonsterManager.MONSTER_PIRATE;;
    //     for (let p in this.monsterReswpanPoints) {
    //         if (levelcount++ > Logic.level || Logic.isBossLevel(Logic.level)) {
    //             break;
    //         }
    //         let arr = p.split(',');
    //         this.addMonster(this.monsterManager.getMonster(this.monsterReswpanPoints[p], this.node)
    //             , cc.v2(parseInt(arr[0]), parseInt(arr[1])));
    //     }
    // }
    private breakHalfTiles(): void {
        for (let i = 0; i < Dungeon.WIDTH_SIZE; i++) {
            for (let j = 6; j < Dungeon.HEIGHT_SIZE; j++) {
                this.map[i][j].isAutoShow = false;
                this.breakTile(cc.v2(i, j));
            }
        }
    }
    private addkraken() {
        if (Logic.isBossLevel(Logic.level)) {
            this.anim.playAdditive('DungeonShake');
            this.breakHalfTiles();
            setTimeout(() => {
                this.bossKraken = this.monsterManager.getKraken(this.node);
                this.bossKraken.showBoss();
                this.anim.play('DungeonWave');
            }, 4000)

        }
    }
    private addMonster(monster: Monster, pos: cc.Vec2) {
        //激活
        monster.node.active = true;
        monster.pos = pos;
        this.monsters.push(monster);
    }
    //获取地图里下标的坐标
    static getPosInMap(pos: cc.Vec2) {
        let x = Dungeon.MAPX + pos.x * Dungeon.TILE_SIZE;
        let y = Dungeon.MAPY + pos.y * Dungeon.TILE_SIZE;
        return cc.v2(x,y);
    }
    //获取坐标在地图里的下标
    static getIndexInMap(pos: cc.Vec2) {
        let x = (pos.x-Dungeon.MAPX)/Dungeon.TILE_SIZE;
        let y = (pos.y-Dungeon.MAPY)/Dungeon.TILE_SIZE;
        x = Math.round(x);
        y = Math.round(y);
        if(x<0){x = 0};if(x>=Dungeon.WIDTH_SIZE){x = Dungeon.WIDTH_SIZE-1};
        if(y<0){y = 0};if(y>=Dungeon.HEIGHT_SIZE){y = Dungeon.HEIGHT_SIZE-1};
        return cc.v2(x,y);
    }

    start() {
        let ss = this.node.getComponentsInChildren(cc.Sprite);
        for (let i = 0; i < ss.length; i++) {
            if (ss[i].spriteFrame) {
                ss[i].spriteFrame.getTexture().setAliasTexParameters();
            }
        }
        cc.director.emit(EventConstant.CHANGE_MIMIMAP,{x:Logic.currentRectRoom.x,y:Logic.currentRectRoom.y});
        for(let door of Logic.currentRectRoom.doors){
            this.dungeonStyleManager.setDoor(door.dir,door.isDoor,false);
        }
    }
    breakTile(pos: cc.Vec2) {
        let tile = this.map[pos.x][pos.y];
        if (!tile.isBroken) {
            tile.breakTile();
        }
    }
    playerAction(dir:number,pos: cc.Vec2,dt:number) {
        if (this.player) {
            this.player.playerAction(dir,pos,dt, this)
        }
    }
    monstersAction() {
        let count = 0;
        for (let monster of this.monsters) {
            if (monster.isDied) {
                count++;
            }
            monster.monsterAction(this);
        }
        if (!Logic.isBossLevel(Logic.level) && count >= this.monsters.length) {
            if(this.portal){
                this.portal.openGate();
            }
            for(let door of Logic.currentRectRoom.doors){
                this.dungeonStyleManager.setDoor(door.dir,door.isDoor,true);
            }
        }
        if (Logic.isBossLevel(Logic.level) && this.bossKraken && this.bossKraken.isDied && this.portal) {
            this.portal.openGate();
        }
    }
    checkPlayerPos(dt:number) {
        this.fog.setPosition(cc.pLerp(this.fog.position,this.player.node.position,dt*3));
        let pos = Dungeon.getIndexInMap(this.player.node.position);
        let tile = this.map[pos.x][pos.y];
        if (tile.isBroken) {
            if (!this.player.isMoving) {
                this.player.fall();
            }
        }
        if (tile.isAutoShow) {
            this.breakTile(pos);
        }
    }
    checkMonstersPos() {
        for (let monster of this.monsters) {
            if (monster.isDied) {
                return;
            }
            let tile = this.map[monster.pos.x][monster.pos.y];
            if (tile.isBroken && !monster.isMoving) {
                monster.fall();
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
            this.checkMonstersPos();
        }
        if (this.isNpcTimeDelay(dt)) {
            this.monstersAction();
        }
    }
}
