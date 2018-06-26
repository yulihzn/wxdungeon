import Player from "./Player";
import Tile from "./Tile";
import Monster from "./Monster";
import Logic from "./Logic";
import { EventConstant } from "./EventConstant";
import MonsterManager from "./Manager/MonsterManager";
import Kraken from "./Boss/Kraken";
import Portal from "./Building/Portal";

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
    @property(Player)
    player: Player = null;
    @property(Portal)
    portal: Portal = null;

    private map: Tile[][] = new Array();
    static readonly SIZE: number = 9;
    static readonly MAPX: number = 32;
    static readonly MAPY: number = 32;
    static readonly TILE_SIZE: number = 64;
    private timeDelay = 0;
    private npcTimeDelay = 0;

    private monsters: Monster[];
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
        for (let i = 0; i < Dungeon.SIZE; i++) {
            this.map[i] = new Array(i);
            for (let j = 0; j < Dungeon.SIZE; j++) {
                let t = cc.instantiate(this.tile);
                t.parent = this.node;
                t.position = Dungeon.getPosInMap(cc.v2(i, j));
                //越往下层级越高，i是行，j是列
                t.zIndex = 1000 + (Dungeon.SIZE - j) * 100;
                this.map[i][j] = t.getComponent('Tile');
                // let index = Math.floor(Dungeon.SIZE / 2)
                // if (index == i && index == j) {
                // 	this.portal = new Portal(i, j);
                // 	t.addBuilding(this.portal);
                // 	this.portal.show();
                // }
                // if (!(index == i && index == j)) {
                // 	this.addItem(new egret.Point(i, j));
                // }
                // this.randomArr[i * Logic.SIZE + j] = new egret.Point(i, j);
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
        this.monsterReswpanPoints['0,0'] = MonsterManager.MONSTER_GOBLIN;
        this.monsterReswpanPoints['0,8'] = MonsterManager.MONSTER_GOBLIN;
        this.monsterReswpanPoints['8,0'] = MonsterManager.MONSTER_MUMMY;
        this.monsterReswpanPoints['8,8'] = MonsterManager.MONSTER_ANUBIS;
        this.monsterReswpanPoints['0,4'] = MonsterManager.MONSTER_GOBLIN;
        this.monsterReswpanPoints['4,0'] = MonsterManager.MONSTER_GOBLIN;
        this.monsterReswpanPoints['8,4'] = MonsterManager.MONSTER_MUMMY;
        this.monsterReswpanPoints['4,8'] = MonsterManager.MONSTER_ANUBIS;
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
            }, 5000)

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
        if (tile.isBroken) {
            if (this.player.pos.equals(pos) && !this.player.isMoving) {
                this.player.fall();
            }

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
                this.bossKraken.takeDamage(damage,newPos);
            });
        }
        if (!isAttack && !isBossAttack) {
            this.player.move(dir);
        }
    }
    checkPlayerPos() {
        this.breakTile(this.player.pos);
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
    monstersAction(monster: Monster) {
        if (!monster || monster.isDied) {
            return;
        }
        let dir = this.getMonsterBestDir(monster.pos);
        let newPos = cc.v2(monster.pos.x, monster.pos.y);
        switch (dir) {
            case 0: if (newPos.y + 1 < 9) { newPos.y++; } break;
            case 1: if (newPos.y - 1 >= 0) { newPos.y--; } break;
            case 2: if (newPos.x - 1 >= 0) { newPos.x--; } break;
            case 3: if (newPos.x + 1 < 9) { newPos.x++; } break;
        }
        if (newPos.equals(this.player.pos) && !this.player.isDied) {
            monster.attack(dir, (damage: number) => {
                this.player.takeDamage(damage);
            });
        } else {
            monster.move(dir);
        }

    }
    getPosDir(oldPos: cc.Vec2, newPos: cc.Vec2): number {
        let dir = 4;
        if (newPos.x == oldPos.x) {
            dir = newPos.y > oldPos.y ? 0 : 1;
        }
        if (newPos.y == oldPos.y) {
            dir = newPos.x > oldPos.x ? 3 : 2;
        }
        if (newPos.equals(oldPos)) {
            dir = 4;
        }
        return dir;
    }
    getMonsterBestDir(pos: cc.Vec2): number {
        let bestPos = cc.v2(pos.x, pos.y);
        //获取9个点并打乱顺序
        let dirArr = new Array();
        if (pos.y + 1 < 9) {
            dirArr.push(cc.v2(pos.x, pos.y + 1));
        }
        if (pos.y - 1 >= 0) {
            dirArr.push(cc.v2(pos.x, pos.y - 1));
        }
        if (pos.x - 1 >= 0) {
            dirArr.push(cc.v2(pos.x - 1, pos.y));
        }
        if (pos.x + 1 < 9) {
            dirArr.push(cc.v2(pos.x + 1, pos.y));
        }

        dirArr.sort(() => {
            return 0.5 - Math.random();
        })
        //获取没有塌陷的tile
        let goodArr = new Array();
        for (let i = 0; i < dirArr.length; i++) {
            let newPos = dirArr[i];
            let tile = this.map[newPos.x][newPos.y];
            if (!tile.isBroken) {
                goodArr.push(newPos);
            }
        }
        for (let i = 0; i < goodArr.length; i++) {
            let newPos = goodArr[i];
            if (newPos.equals(this.player.pos)) {
                bestPos = newPos;
                break;
            }
            let tile = this.map[newPos.x][newPos.y];
            if (!tile.isBreakingNow) {
                bestPos = newPos;
            }

        }
        let dir = this.getPosDir(pos, bestPos);
        return dir;
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
                this.monstersAction(monster);
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
