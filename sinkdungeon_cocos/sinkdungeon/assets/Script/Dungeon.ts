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
    @property(Player)
    player: Player = null;
    @property(Portal)
    portal: Portal = null;

    map: Tile[][] = new Array();
    wallmap: Wall[][] = new Array();
    trapmap: Trap[][] = new Array();
    static readonly SIZE: number = 9;
    static readonly MAPX: number = 32;
    static readonly MAPY: number = 32;
    static readonly TILE_SIZE: number = 64;
    private timeDelay = 0;
    private npcTimeDelay = 0;

    monsters: Monster[];
    public monsterReswpanPoints: { [key: string]: string } = {};
    monsterManager: MonsterManager = null;
    anim: cc.Animation;

    bossKraken: Kraken;

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        cc.director.on(EventConstant.PLAYER_MOVE, (event) => { this.playerAction(event.detail.dir) });
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        
        this.map = new Array();
        this.wallmap = new Array();
        this.trapmap = new Array();
        for (let i = 0; i < Dungeon.SIZE; i++) {
            this.map[i] = new Array(i);
            this.wallmap[i] = new Array(i);
            this.trapmap[i] = new Array(i);
            for (let j = 0; j < Dungeon.SIZE; j++) {
                let t = cc.instantiate(this.tile);
                t.parent = this.node;
                t.position = Dungeon.getPosInMap(cc.v2(i, j));
                //越往下层级越高，i是行，j是列
                t.zIndex = 1000 + (Dungeon.SIZE - j) * 100;
                this.map[i][j] = t.getComponent(Tile);
                //生成墙
                if (!(i == 4 && j == 4) && Math.random() < 0.1 && !Logic.isBossLevel(Logic.level)
                    && !this.monsterReswpanPoints[`${i},${j}`]) {
                    let w = cc.instantiate(this.wall);
                    w.parent = this.node;
                    w.position = Dungeon.getPosInMap(cc.v2(i, j));
                    w.zIndex = 3000 + (Dungeon.SIZE - j) * 100;
                    w.opacity = 255;
                    this.wallmap[i][j] = w.getComponent(Wall);
                }
                //生成陷阱
                if (!(i == 4 && j == 4) && Math.random() < 0.1 && !Logic.isBossLevel(Logic.level)
                    && !this.wallmap[i][j] && !this.monsterReswpanPoints[`${i},${j}`]) {
                    let trap = cc.instantiate(this.trap);
                    trap.parent = this.node;
                    trap.position = Dungeon.getPosInMap(cc.v2(i, j));
                    trap.zIndex = 3000 + (Dungeon.SIZE - j) * 100;
                    this.trapmap[i][j] = trap.getComponent(Trap);
                    //关闭踩踏掉落
                    this.map[i][j].isAutoShow = false;
                }
            }
        }
        this.portal.node.parent = this.node;
        this.portal.node.zIndex = 1000 + 5 * 100 + 1;
        this.portal.node.setPosition(this.map[4][4].node.position);

        this.player.node.parent = this.node;
        this.monsterManager = this.getComponent(MonsterManager);

        this.addMonsters();
    }
    addMonsters(): void {
        this.monsters = new Array();
        let levelcount = 1;
        this.monsterReswpanPoints['0,0'] = MonsterManager.MONSTER_SAILOR;
        this.monsterReswpanPoints['0,8'] = MonsterManager.MONSTER_SAILOR;
        this.monsterReswpanPoints['8,0'] = MonsterManager.MONSTER_SAILOR;
        this.monsterReswpanPoints['8,8'] = MonsterManager.MONSTER_PIRATE;
        this.monsterReswpanPoints['0,4'] = MonsterManager.MONSTER_SAILOR;
        this.monsterReswpanPoints['4,0'] = MonsterManager.MONSTER_PIRATE;
        this.monsterReswpanPoints['8,4'] = MonsterManager.MONSTER_SAILOR;
        this.monsterReswpanPoints['4,8'] = MonsterManager.MONSTER_PIRATE;;
        for (let p in this.monsterReswpanPoints) {
            if (levelcount++ > Logic.level || Logic.isBossLevel(Logic.level)) {
                break;
            }
            let arr = p.split(',');
            this.addMonster(this.monsterManager.getMonster(this.monsterReswpanPoints[p], this.node)
                , cc.v2(parseInt(arr[0]), parseInt(arr[1])));
        }
        this.addkraken();
    }
    private breakHalfTiles(): void {
        for (let i = 0; i < Dungeon.SIZE; i++) {
            for (let j = 6; j < Dungeon.SIZE; j++) {
                this.map[i][j].isAutoShow = false;
                this.breakTile(cc.v2(i, j));
            }
        }
    }
    private addkraken() {
        if (Logic.isBossLevel(Logic.level)) {
            this.anim.play('DungeonShake');
            this.breakHalfTiles();
            setTimeout(() => {
                this.bossKraken = this.monsterManager.getKraken(this.node);
                this.bossKraken.showBoss();
            }, 4000)

        }
    }
    private addMonster(monster: Monster, pos: cc.Vec2) {
        //激活
        monster.node.active = true;
        monster.pos = pos;
        this.monsters.push(monster);
    }
    static getPosInMap(pos: cc.Vec2) {
        let x = Dungeon.MAPX + pos.x * Dungeon.TILE_SIZE;
        let y = Dungeon.MAPY + pos.y * Dungeon.TILE_SIZE;
        return cc.v2(x, y);
    }

    start() {

    }
    breakTile(pos: cc.Vec2) {
        if (pos.x == 4 && pos.y == 4) {
            return;
        }
        let tile = this.map[pos.x][pos.y];
        if (!tile.isBroken) {
            tile.breakTile();
        }
    }
    playerAction(dir: number) {
        //事件执行脚本引入的对象有可能为空
        if (!this.player) {
            return;
        }
        let newPos = cc.v2(this.player.pos.x, this.player.pos.y);
        switch (dir) {
            case 0: if (newPos.y + 1 < 9) { newPos.y++; } break;
            case 1: if (newPos.y - 1 >= 0) { newPos.y--; } break;
            case 2: if (newPos.x - 1 >= 0) { newPos.x--; } break;
            case 3: if (newPos.x + 1 < 9) { newPos.x++; } break;
        }
        let isAttack = false;
        for (let monster of this.monsters) {
            if (newPos.equals(monster.pos) && !monster.isDied) {
                isAttack = true;
                this.player.attack(dir, (damage: number) => {
                    monster.takeDamage(damage);
                });
            }
        }
        let isBossAttack = false;
        isBossAttack = Logic.isBossLevel(Logic.level) && this.bossKraken && this.bossKraken.isBossZone(newPos);
        if (isBossAttack && this.bossKraken && this.bossKraken.isShow && !this.bossKraken.isDied) {
            this.player.attack(dir, (damage: number) => {
                this.bossKraken.takeDamage(damage, newPos);
            });
        }
        if (!isAttack && !isBossAttack) {
            let w = this.wallmap[newPos.x][newPos.y]
            if (w && w.node.active) {
                dir = 4;
            }
            this.player.move(dir);
        }
    }
    checkPlayerPos() {
        let tile = this.map[this.player.pos.x][this.player.pos.y];
        if (tile.isBroken) {
            if (!this.player.isMoving) {
                this.player.fall();
            }
        }
        if (tile.isAutoShow) {
            this.breakTile(this.player.pos);
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

    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            this.checkPlayerPos();
            this.checkMonstersPos();
        }
        this.npcTimeDelay += dt;
        if (this.npcTimeDelay > 1) {
            this.npcTimeDelay = 0;
            let count = 0;
            for (let monster of this.monsters) {
                if (monster.isDied) {
                    count++;
                }
                monster.monsterAction(this);
            }
            if (this.monsters.length > 0 && count >= this.monsters.length) {
                if (!Logic.isBossLevel(Logic.level)) {
                    this.portal.openGate();
                }
            }
            if (Logic.isBossLevel(Logic.level) && this.bossKraken && this.bossKraken.isDied) {
                this.portal.openGate();
            }
        }
    }
}
