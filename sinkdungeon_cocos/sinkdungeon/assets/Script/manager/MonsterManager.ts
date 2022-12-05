import NonPlayer from '../logic/NonPlayer'
import Dungeon from '../logic/Dungeon'
import Logic from '../logic/Logic'
import RoomType from '../rect/RoomType'
import Boss from '../boss/Boss'
import BaseManager from './BaseManager'
import GameHud from '../ui/GameHud'
import MonsterRandomAttr from './MonsterRandomAttr'
import Random4Save from '../utils/Random4Save'
import NonPlayerData from '../data/NonPlayerData'
import LoadingManager from './LoadingManager'
import Utils from '../utils/Utils'
import AudioPlayer from '../utils/AudioPlayer'
import ActorIconList from '../ui/ActorIconList'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class MonsterManager extends BaseManager {
    public static readonly BOSS_KRAKEN = 'BOSS_KRAKEN'
    public static readonly MONSTER_SLIME = 'monster000'
    public static readonly MONSTER_GOBLIN = 'monster001'
    public static readonly MONSTER_MUMMY = 'monster002'
    public static readonly MONSTER_ANUBIS = 'monster003'
    public static readonly MONSTER_PIRATE = 'monster004'
    public static readonly MONSTER_SAILOR = 'monster005'
    public static readonly MONSTER_OCTOPUS = 'monster006'
    public static readonly MONSTER_KILLER = 'monster007'
    public static readonly MONSTER_STRONGSAILOR = 'monster008'
    public static readonly MONSTER_CHEST = 'monster009'
    public static readonly MONSTER_GARGOYLE = 'monster010'
    public static readonly MONSTER_CHICKEN = 'monster011'
    public static readonly MONSTER_SCARAB = 'monster012'
    public static readonly MONSTER_GOBLIN_ARCHER = 'monster013'
    public static readonly MONSTER_TERRORDRONE = 'monster014'
    public static readonly MONSTER_WEREWOLF = 'monster015'
    public static readonly MONSTER_DUMMY = 'monster016'
    public static readonly MONSTER_ZEBRA = 'monster017'
    public static readonly MONSTER_GIRAFFE = 'monster018'
    public static readonly MONSTER_ZOOMBIE = 'monster019'
    public static readonly MONSTER_ELECTRICEYE = 'monster020'
    public static readonly MONSTER_FISHMAN = 'monster021'
    public static readonly MONSTER_CROCODILE = 'monster022'
    public static readonly MONSTER_SNAKE = 'monster023'
    public static readonly MONSTER_DEMON = 'monster024'
    public static readonly MONSTER_WARLOCK = 'monster025'
    public static readonly MONSTER_SPIDER = 'monster026'
    public static readonly MONSTER_BOOMER = 'monster027'
    public static readonly MONSTER_SANDSTATUE = 'monster028'
    public static readonly MONSTER_HIPPO = 'monster029'
    public static readonly MONSTER_CYCLOPS = 'monster030'
    public static readonly MONSTER_ICEDEMON = 'monster031'
    public static readonly MONSTER_BITE_ZOMBIE = 'monster032'
    public static readonly MONSTER_BANANA = 'monster033'
    public static readonly MONSTER_HOLO_DEVICE = 'monster034'
    public static readonly MONSTER_HOLO = 'monster035'
    public static readonly MONSTER_LASRERDRONE = 'monster036'
    public static readonly MONSTER_GHOST = 'monster037'
    public static readonly MONSTER_FISH = 'monster038'
    public static readonly MONSTER_MICE = 'monster039'
    public static readonly MONSTERS_LAB = [
        MonsterManager.MONSTER_ZEBRA,
        MonsterManager.MONSTER_TERRORDRONE,
        MonsterManager.MONSTER_KILLER,
        MonsterManager.MONSTER_ZOOMBIE,
        MonsterManager.MONSTER_ELECTRICEYE,
        MonsterManager.MONSTER_GIRAFFE,
        MonsterManager.MONSTER_ICEDEMON,
        MonsterManager.MONSTER_BITE_ZOMBIE,
        MonsterManager.MONSTER_HOLO_DEVICE,
        MonsterManager.MONSTER_LASRERDRONE
    ]
    public static readonly MONSTERS_SHIP = [
        MonsterManager.MONSTER_PIRATE,
        MonsterManager.MONSTER_SAILOR,
        MonsterManager.MONSTER_OCTOPUS,
        MonsterManager.MONSTER_STRONGSAILOR,
        MonsterManager.MONSTER_FISHMAN,
        MonsterManager.MONSTER_BOOMER,
        MonsterManager.MONSTER_GHOST
    ]
    public static readonly MONSTERS_FOREST = [
        MonsterManager.MONSTER_SLIME,
        MonsterManager.MONSTER_GOBLIN,
        MonsterManager.MONSTER_GOBLIN_ARCHER,
        MonsterManager.MONSTER_WEREWOLF,
        MonsterManager.MONSTER_SNAKE,
        MonsterManager.MONSTER_CHICKEN,
        MonsterManager.MONSTER_HIPPO,
        MonsterManager.MONSTER_BANANA
    ]
    public static readonly MONSTERS_PYRAMID = [
        MonsterManager.MONSTER_MUMMY,
        MonsterManager.MONSTER_ANUBIS,
        MonsterManager.MONSTER_SCARAB,
        MonsterManager.MONSTER_CROCODILE,
        MonsterManager.MONSTER_SANDSTATUE
    ]
    public static readonly MONSTERS_DUNGEON = [
        MonsterManager.MONSTER_GARGOYLE,
        MonsterManager.MONSTER_WARLOCK,
        MonsterManager.MONSTER_DEMON,
        MonsterManager.MONSTER_CYCLOPS,
        MonsterManager.MONSTER_SPIDER,
        MonsterManager.MONSTER_CYCLOPS
    ]
    public static readonly MONSTERS_SPECIAL = [MonsterManager.MONSTER_DUMMY, MonsterManager.MONSTER_CHEST, MonsterManager.MONSTER_FISH, MonsterManager.MONSTER_MICE]
    // LIFE-CYCLE CALLBACKS:

    // update (dt) {}

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Prefab)
    monster: cc.Prefab = null
    @property(cc.Prefab)
    kraken: cc.Prefab = null
    @property(cc.Prefab)
    captain: cc.Prefab = null
    @property(cc.Prefab)
    slime: cc.Prefab = null
    @property(cc.Prefab)
    warmachine = null
    @property(cc.Prefab)
    rah = null
    @property(cc.Prefab)
    iceDemon = null
    @property(cc.Prefab)
    evilEye = null
    @property(cc.Prefab)
    dryad = null
    @property(cc.Prefab)
    sphinx = null
    @property(cc.Prefab)
    dragon = null
    @property(ActorIconList)
    actorIconList: ActorIconList = null
    readonly maxHealth00 = 200
    readonly maxHealth01 = 400
    readonly maxHealth02 = 600
    readonly maxHealth03 = 800
    readonly maxHealth04 = 1000
    readonly maxHealth05 = 1200
    readonly maxHealth06 = 1400
    readonly maxHealth07 = 1600
    readonly maxHealth08 = 1800
    readonly maxHealth09 = 2000

    private monsters: NonPlayer[] = new Array() //房间怪物列表
    private bosses: Boss[] = new Array()
    isRoomInitWithEnemy = false //初始化是否生成怪物
    private loadingManager: LoadingManager = new LoadingManager()
    private seed = 0
    get monsterList() {
        return this.monsters
    }
    get bossList() {
        return this.bosses
    }
    private monsterRandomAttr: MonsterRandomAttr = new MonsterRandomAttr()
    clear(): void {
        for (let m of this.monsters) {
            if (m && m.isValid) {
                m.destroyEntityNode()
            }
        }
        for (let b of this.bosses) {
            if (b && b.isValid) {
                b.destroyEntityNode()
            }
        }
        this.monsters = new Array()
        this.bosses = new Array()
    }
    /**添加怪物 */
    public addMonsterFromData(resName: string, indexPos: cc.Vec3, dungeon: Dungeon, isSummon: boolean) {
        this.getMonster(resName, dungeon, isSummon, (nonplayer: NonPlayer) => {
            nonplayer = this.addMonster(nonplayer, indexPos, null)
            if (nonplayer.data.childCount > 0 && nonplayer.data.childResName.length > 0) {
                for (let i = 0; i < nonplayer.data.childCount; i++) {
                    this.getMonster(nonplayer.data.childResName, dungeon, isSummon, (childPlayer: NonPlayer) => {
                        nonplayer.childNonPlayerList.push(this.addMonster(childPlayer, indexPos, nonplayer))
                    })
                }
            }
        })
    }

    public addMonstersAndBossFromMap(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3) {
        if (Dungeon.isFirstEqual(mapDataStr, 'm')) {
            this.addMonsterFromData(`monster${mapDataStr.substring(1)}`, indexPos, dungeon, false)
            return
        }
        if (Utils.isFirstEqual(mapDataStr, 'z')) {
            Logic.lastBgmIndex = 2
            AudioPlayer.stopAllEffect()
            AudioPlayer.play(AudioPlayer.PLAY_BG, true)
        }
        if (mapDataStr == 'z0') {
            this.addBoss(this.iceDemon, 'iconboss000', this.maxHealth00, 0, 2, indexPos, dungeon)
        } else if (mapDataStr == 'z1') {
            this.addBoss(this.warmachine, 'iconboss001', this.maxHealth01, 2, 3.5, indexPos, dungeon)
        } else if (mapDataStr == 'z2') {
            this.addBoss(this.captain, 'iconboss002', this.maxHealth02, 2, 0, indexPos, dungeon)
        } else if (mapDataStr == 'z3') {
            dungeon.shakeForKraken()
            this.addBoss(this.kraken, 'iconboss003', this.maxHealth03, 2, 3.5, indexPos, dungeon)
        } else if (mapDataStr == 'z4') {
            this.addBossSlime(0, indexPos, dungeon)
        } else if (mapDataStr == 'z5') {
            this.addBoss(this.dryad, 'iconboss005', this.maxHealth05, 2, 2, indexPos, dungeon)
        } else if (mapDataStr == 'z6') {
            this.addBoss(this.rah, 'iconboss006', this.maxHealth06, 2, 2, indexPos, dungeon)
        } else if (mapDataStr == 'z7') {
            this.addBoss(this.sphinx, 'iconboss007', this.maxHealth07, 2, 2, indexPos, dungeon)
        } else if (mapDataStr == 'z8') {
            this.addBoss(this.evilEye, 'iconboss008', this.maxHealth08, 2, 2, indexPos, dungeon)
        } else if (mapDataStr == 'z9') {
            this.addBoss(this.dragon, 'iconboss009', this.maxHealth09, 5, 2, indexPos, dungeon)
        }
    }
    private getRandomMonsterSeed(): number {
        return Logic.mapManager.getCurrentRoom().seed + this.seed++
    }
    /**
     *
     * @param resName 图片
     * @param monsterNode Monster prefab的结点
     * @param parent 父节点
     */
    private getMonster(resName: string, dungeon: Dungeon, isSummon: boolean, callBack: Function) {
        LoadingManager.loadNpcSpriteAtlas(resName, status => {
            if (status == LoadingManager.LOAD_FAIL) {
                return
            }
            let monsterPrefab: cc.Node = null
            monsterPrefab = cc.instantiate(this.monster)
            monsterPrefab.active = false
            monsterPrefab.parent = dungeon.node
            let monster = monsterPrefab.getComponent(NonPlayer)
            let data = new NonPlayerData()
            monster.seed = this.getRandomMonsterSeed()
            monster.killPlayerCount = Logic.getKillPlayerCount(monster.seed)
            let rand4save = Logic.mapManager.getRandom4Save(monster.seed)
            monster.dungeon = dungeon
            data.valueCopy(Logic.monsters[resName])
            let reborn = Logic.mapManager.getCurrentRoom().reborn
            data.reborn = reborn ? reborn : 0
            monster.isSummon = isSummon
            //10%几率随机属性
            if (rand4save.rand() < 0.1 + monster.killPlayerCount / 10) {
                this.monsterRandomAttr.addRandomAttrs(2, rand4save)
                data = this.monsterRandomAttr.updateMonsterData(data)
                monster.attrmap = this.monsterRandomAttr.attrmap
            }
            //5%加击杀次数的几率变异
            let variationRate = 5 + monster.killPlayerCount * 2
            let up = 0
            if (Logic.mapManager.getCurrentRoomType().isEqual(RoomType.DANGER_ROOM)) {
                up = 10
            }
            if (Logic.mapManager.getCurrentRoomType().isEqual(RoomType.INSANE_ROOM)) {
                up = 30
            }

            variationRate = variationRate + Logic.chapterIndex * 2 + Logic.level * 2 + up
            monster.isVariation = rand4save.getRandomNum(0, 100) < variationRate && data.isTest < 1
            if (monster.isVariation) {
                data.Common.maxHealth = data.Common.maxHealth * 2
                data.Common.maxDream = data.Common.maxDream * 2
                data.Common.damageMin = data.Common.damageMin * 2
                data.currentHealth = data.Common.maxHealth

                if (data.melee > 0) {
                    data.melee = data.melee > 1 ? data.melee - 1 : 1
                }
                if (data.remote > 0) {
                    data.remote = data.remote > 1 ? data.remote - 1 : 1
                }
                if (data.dash > 0) {
                    data.dash = data.dash > 1 ? data.dash - 1 : 1
                }

                data.Common.moveSpeed = data.Common.moveSpeed > 0 ? data.Common.moveSpeed + 0.5 + 0.1 * monster.killPlayerCount : 0
            }
            data.Common.maxDream += data.Common.maxDream * 0.25 * monster.killPlayerCount
            data.Common.damageMin += data.Common.damageMin * 0.25 * monster.killPlayerCount
            data.Common.maxHealth += data.Common.maxHealth * 0.25 * monster.killPlayerCount
            data.Common.attackSpeed += monster.killPlayerCount * 10
            data.Common.defence += monster.killPlayerCount
            data.currentHealth = data.Common.maxHealth
            if (data.melee - monster.killPlayerCount > 1) {
                data.melee -= monster.killPlayerCount
            }
            if (data.remote - monster.killPlayerCount > 1) {
                data.remote -= monster.killPlayerCount
            }
            if (data.dash - monster.killPlayerCount > 1) {
                data.dash -= monster.killPlayerCount
            }
            //5%几率添加元素
            let rand = rand4save.getRandomNum(0, 100)
            let df = rand4save.getRandomNum(80, 100)
            let er = rand4save.getRandomNum(80, 100)
            let isAddElement = rand <= 5 + monster.killPlayerCount * 3
            rand = rand4save.getRandomNum(0, 4)
            if (isAddElement) {
                data.Common.magicDamage += 1
                data.Common.magicDefenceRate = data.Common.magicDefenceRate + df > 100 ? 100 : data.Common.magicDefenceRate + df
                switch (rand) {
                    case 0:
                        data.Common.iceRate = data.Common.iceRate + er > 100 ? 100 : data.Common.iceRate + er
                        data.bodyColor = '#CCFFFF'
                        break
                    case 1:
                        data.Common.fireRate = data.Common.fireRate + er > 100 ? 100 : data.Common.fireRate + er
                        data.bodyColor = '#FF6633'
                        break
                    case 2:
                        data.Common.lighteningRate = data.Common.lighteningRate + er > 100 ? 100 : data.Common.lighteningRate + er
                        data.bodyColor = '#0099FF'
                        break
                    case 3:
                        data.Common.toxicRate = data.Common.toxicRate + er > 100 ? 100 : data.Common.toxicRate + er
                        data.bodyColor = '#66CC00'
                        break
                    case 4:
                        data.Common.curseRate = data.Common.curseRate + er > 100 ? 100 : data.Common.curseRate + er
                        data.bodyColor = '#660099'
                        break
                }
            }
            data.isEnemy = 1
            monster.data = data
            monster.sc.isDisguising = data.disguise > 0
            if (monster.sc.isDisguising) {
                monster.changeBodyRes(data.resName, NonPlayer.RES_DISGUISE)
            } else {
                monster.changeBodyRes(resName, NonPlayer.RES_IDLE000)
            }
            monster.addAttrIcon()
            monster.icon = this.actorIconList.getIcon(data.resName)
            callBack(monster)
        })
    }
    private addMonster(monster: NonPlayer, pos: cc.Vec3, parent: NonPlayer): NonPlayer {
        //激活
        monster.node.active = true
        monster.pos = pos
        monster.defautPos = pos
        monster.lastWaterPos = pos
        monster.updatePlayerPos()
        monster.parentNonPlayer = parent
        this.isRoomInitWithEnemy = monster.data.isTest < 1
        this.monsterList.push(monster)
        return monster
    }
    public addBossSlime(type: number, index: cc.Vec3, dungeon: Dungeon) {
        if (!this.bosses) {
            return
        }
        this.isRoomInitWithEnemy = true
        this.bosses.push(this.getSlime(dungeon, index.clone(), type))
    }

    private addBoss(prefabAsset: cc.Prefab, resName: string, maxHealth: number, attackPoint: number, delayTime: number, indexPos: cc.Vec3, dungeon: Dungeon) {
        let prefab = cc.instantiate(prefabAsset)
        prefab.active = false
        prefab.parent = dungeon.node
        let boss = prefab.getComponent(Boss)
        boss.initCollider()
        boss.dungeon = dungeon
        let data = new NonPlayerData()
        data.resName = resName
        data.updateHA(maxHealth, maxHealth, attackPoint)
        boss.data = data
        boss.defaultPos = indexPos.clone()
        boss.transportBoss(indexPos.x, indexPos.y)
        boss.healthBar = this.node.parent.getComponentInChildren(GameHud).bossHealthBar
        boss.node.active = true
        this.bosses.push(boss)
        this.isRoomInitWithEnemy = true
        this.scheduleOnce(() => {
            boss.showBoss()
        }, delayTime)
    }

    private getSlime(dungeon: Dungeon, posIndex: cc.Vec3, type: number): Boss {
        let prefab: cc.Node = null
        prefab = cc.instantiate(this.slime)
        prefab.active = false
        prefab.parent = dungeon.node
        let slime = prefab.getComponent(Boss)
        slime.initCollider()
        slime.dungeon = dungeon
        let data = new NonPlayerData()
        data.resName = 'iconboss004'
        data.Common.moveSpeed = 2
        switch (type) {
            case 0:
                data.updateHA(this.maxHealth04, this.maxHealth04, 9)
                break
            case 1:
                data.updateHA(200, 200, 7)
                break
            case 2:
                data.updateHA(100, 100, 7)
                break
            case 3:
                data.updateHA(50, 50, 5)
                break
            case 4:
                data.updateHA(25, 25, 3)
                break
            case 5:
                data.updateHA(10, 10, 2)
                break
            default:
                data.updateHA(5, 5, 1)
                break
        }
        slime.data = data
        slime.init(type)
        slime.transportBoss(posIndex.x, posIndex.y)
        slime.healthBar = this.node.parent.getComponentInChildren(GameHud).bossHealthBar
        slime.node.active = true
        this.bosses.push(slime)
        return slime
    }
    addRandomMonsters(dungeon: Dungeon, reborn: number) {
        let arr = new Array()
        let rand4save = new Random4Save(Logic.mapManager.getCurrentRoom().seed)
        let num = rand4save.getRandomNum(1, 3)
        let up = 0
        if (Logic.mapManager.getCurrentRoomType().isEqual(RoomType.DANGER_ROOM)) {
            up = 2
        }
        if (Logic.mapManager.getCurrentRoomType().isEqual(RoomType.INSANE_ROOM)) {
            up = 5
        }
        switch (Logic.chapterIndex) {
            case Logic.CHAPTER00:
                arr = MonsterManager.MONSTERS_LAB
                num = rand4save.getRandomNum(3, 6)
                break
            case Logic.CHAPTER01:
                arr = MonsterManager.MONSTERS_SHIP
                num = rand4save.getRandomNum(3, 7)
                break
            case Logic.CHAPTER02:
                arr = MonsterManager.MONSTERS_FOREST
                num = rand4save.getRandomNum(4, 8)
                break
            case Logic.CHAPTER03:
                arr = MonsterManager.MONSTERS_PYRAMID
                num = rand4save.getRandomNum(4, 9)
                break
            case Logic.CHAPTER04:
                arr = MonsterManager.MONSTERS_DUNGEON
                num = rand4save.getRandomNum(5, 10)
                break
            case Logic.CHAPTER05:
                arr = MonsterManager.MONSTERS_DUNGEON
                num = rand4save.getRandomNum(5, 11)
                break
            case Logic.CHAPTER099:
                arr = MonsterManager.MONSTERS_LAB
                num = rand4save.getRandomNum(3, 6)
                break
        }
        if (Logic.mapManager.getCurrentRoomType().isEqual(RoomType.VERTICAL_ROOM) || Logic.mapManager.getCurrentRoomType().isEqual(RoomType.HORIZONTAL_ROOM)) {
            num = Math.floor(num / 2)
        }
        let indexmap = []
        let waterindexmap = []
        for (let i = 0; i < dungeon.floorIndexMap.length; i++) {
            let pos = dungeon.floorIndexMap[i]
            if (dungeon.buildingManager.emptyMap.has(`x=${pos.x}y=${pos.y}`)) {
                indexmap.push(pos)
            }
        }
        for (let i = 0; i < dungeon.waterIndexMap.length; i++) {
            let pos = dungeon.waterIndexMap[i]
            if (dungeon.buildingManager.emptyMap.has(`x=${pos.x}y=${pos.y}`)) {
                waterindexmap.push(pos)
            }
        }
        let groundmonstercount = 0
        //地上的
        for (let i = 0; i <= num + up; i++) {
            if (indexmap.length < 1) {
                continue
            }
            let randindex = rand4save.getRandomNum(0, indexmap.length - 1)
            let pos = indexmap[randindex]
            indexmap.splice(randindex, 1)
            groundmonstercount++
            this.addMonsterFromData(arr[rand4save.getRandomNum(0, arr.length - 1)], cc.v3(pos.x, pos.y), dungeon, false)
        }
        //水里的
        for (let i = 0; i <= num + up - groundmonstercount; i++) {
            if (waterindexmap.length < 1) {
                continue
            }
            let randindex = rand4save.getRandomNum(0, waterindexmap.length - 1)
            let pos = waterindexmap[randindex]
            waterindexmap.splice(randindex, 1)
            this.addMonsterFromData(MonsterManager.MONSTER_FISH, cc.v3(pos.x, pos.y), dungeon, false)
        }
    }
    updateLogic(dt: number) {
        for (let i = this.monsters.length - 1; i >= 0; i--) {
            let monster = this.monsters[i]
            if (monster && monster.node) {
                if (monster.node.active) {
                    monster.updateLogic(dt)
                }
            } else {
                this.monsters.splice(i, 1)
            }
        }
        for (let i = this.bosses.length - 1; i >= 0; i--) {
            let boss = this.bosses[i]
            if (boss && boss.node) {
                if (boss.node.active) {
                    boss.updateLogic(dt)
                }
            } else {
                this.bosses.splice(i, 1)
            }
        }
    }
}
