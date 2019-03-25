import Monster from "../Monster";
import MonsterData from "../Data/MonsterData";
import Kraken from "../Boss/Kraken";
import Dungeon from "../Dungeon";
import Captain from "../Boss/Captain";
import Logic from "../Logic";
import Slime from "../Boss/Slime";
import WarMachine from "../Boss/WarMachine";
import Rah from "../Boss/Rah";
import Random from "../Utils/Random";
import IceDemon from "../Boss/IceDemon";
import EvilEye from "../Boss/EvilEye";

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
export default class MonsterManager extends cc.Component {
    public static readonly BOSS_KRAKEN = 'BOSS_KRAKEN';
    public static readonly MONSTER_SLIME = 'monster000';
    public static readonly MONSTER_GOBLIN = 'monster001';
    public static readonly MONSTER_MUMMY = 'monster002';
    public static readonly MONSTER_ANUBIS = 'monster003';
    public static readonly MONSTER_PIRATE = 'monster004';
    public static readonly MONSTER_SAILOR = 'monster005';
    public static readonly MONSTER_OCTOPUS = 'monster006';
    public static readonly MONSTER_KILLER = 'monster007';
    public static readonly MONSTER_STRONGSAILOR = 'monster008';
    public static readonly MONSTER_CHEST = 'monster009';
    public static readonly MONSTER_GARGOYLE = 'monster010';
    public static readonly MONSTER_CHICKEN = 'monster011';
    public static readonly MONSTER_SCARAB = 'monster012';
    public static readonly MONSTER_GOBLIN_ARCHER = 'monster013';
    public static readonly MONSTER_TERRORDRONE = 'monster014';
    public static readonly MONSTER_WEREWOLF = 'monster015';
    public static readonly MONSTER_ALTAIR = 'monster016';
    public static readonly MONSTER_CONNAR = 'monster017';
    public static readonly MONSTER_EZIO = 'monster018';
    public static readonly MONSTER_ZOOMBIE = 'monster019';
    public static readonly MONSTER_ELECTRICEYE = 'monster020';
    public static readonly MONSTER_FISH = 'monster021';

    // LIFE-CYCLE CALLBACKS:

    // update (dt) {}

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Prefab)
    monster: cc.Prefab = null;
    @property(cc.Prefab)
    kraken: cc.Prefab = null;
    @property(cc.Prefab)
    captain: cc.Prefab = null;
    @property(cc.Prefab)
    slime: cc.Prefab = null;
    @property(cc.Prefab)
    warmachine = null;
    @property(cc.Prefab)
    rah = null;
    @property(cc.Prefab)
    iceDemon = null;
    @property(cc.Prefab)
    evilEye = null;
    onLoad() {
    }
    /**
     * 
     * @param resName 图片
     * @param monsterNode Monster prefab的结点
     * @param parent 父节点
     */
    getMonster(resName: string, dungeon: Dungeon): Monster {
        let monsterPrefab: cc.Node = null;
        monsterPrefab = cc.instantiate(this.monster);
        monsterPrefab.active = false;
        monsterPrefab.parent = dungeon.node;
        let monster = monsterPrefab.getComponent(Monster);
        let data = new MonsterData();
        monster.dungeon = dungeon;
        data.valueCopy(Logic.monsters[resName]);

        //5%的几率变异
        let variationRate = 5;
        //1%几率添加元素
        let rate = 0.01;
        variationRate = variationRate + Logic.chapterName * 5 + Logic.level * 2;
        rate = rate + Logic.chapterName * 0.05 + Logic.level * 0.02;

        monster.isVariation = Logic.getRandomNum(0, 100) < variationRate;
        if (monster.isVariation) {
            data.Common.maxHealth = data.Common.maxHealth * 2;
            data.Common.damageMin = data.Common.damageMin * 2;
            data.currentHealth = data.currentHealth * 2;
            data.melee = data.melee > 0 ? data.melee - 0.5 : 0;
            data.remote = data.remote > 0 ? data.remote - 0.5 : 0;
            data.dash = data.dash > 0 ? data.dash - 0.5 : 0;
            data.Common.moveSpeed = data.Common.moveSpeed > 0 ? (data.Common.moveSpeed + 100) : 0;
        }
        let rand = Random.rand();
        let df = Logic.getRandomNum(0, 100);
        let er = Logic.getRandomNum(0, 100);
        if (rand < 0.005) {
            data.Common.iceDamage += 1;
            data.Common.iceDefence = data.Common.iceDefence + df > 100 ? 100 : data.Common.iceDefence + df;
            data.Common.iceRate = data.Common.iceRate + er > 100 ? 100 : data.Common.iceRate + er;
        } else if (rand >= 0.005 && rand < 0.01) {
            data.Common.fireDamage += 1;
            data.Common.fireDefence = data.Common.iceDefence + df > 100 ? 100 : data.Common.iceDefence + df;
            data.Common.fireRate = data.Common.iceRate + er > 100 ? 100 : data.Common.iceRate + er;
        } else if (rand >= 0.01 && rand < 0.015) {
            data.Common.fireDamage += 1;
            data.Common.fireDefence = data.Common.iceDefence + df > 100 ? 100 : data.Common.iceDefence + df;
            data.Common.fireRate = data.Common.iceRate + er > 100 ? 100 : data.Common.iceRate + er;
        } else if (rand >= 0.015 && rand < 0.02) {
            data.Common.lighteningDamage += 1;
            data.Common.lighteningDefence = data.Common.iceDefence + df > 100 ? 100 : data.Common.iceDefence + df;
            data.Common.lighteningRate = data.Common.iceRate + er > 100 ? 100 : data.Common.iceRate + er;
        } else if (rand >= 0.02 && rand < 0.025) {
            data.Common.toxicDamage += 1;
            data.Common.toxicDefence = data.Common.iceDefence + df > 100 ? 100 : data.Common.iceDefence + df;
            data.Common.toxicRate = data.Common.iceRate + er > 100 ? 100 : data.Common.iceRate + er;
        } else if (rand >= 0.025 && rand < 0.03) {
            data.Common.curseDamage += 1;
            data.Common.curseDefence = data.Common.iceDefence + df > 100 ? 100 : data.Common.iceDefence + df;
            data.Common.curseRate = data.Common.iceRate + er > 100 ? 100 : data.Common.iceRate + er;
        }

        monster.data = data;

        monster.isDisguising = data.disguise > 0;
        if (monster.isDisguising) {
            monster.changeBodyRes(data.resName, Monster.RES_DISGUISE);
        } else {
            monster.changeBodyRes(resName);
        }
        return monster;
    }
    getIceDemon(dungeon: Dungeon, posIndex: cc.Vec2): IceDemon {
        let icePrefab: cc.Node = null;
        icePrefab = cc.instantiate(this.iceDemon);
        icePrefab.active = false;
        icePrefab.parent = dungeon.node;
        let iceDemon = icePrefab.getComponent(IceDemon);
        iceDemon.dungeon = dungeon;
        let data = new MonsterData();
        data.updateHA(400, 400, 0);
        iceDemon.data = data;
        iceDemon.transportBoss(posIndex.x, posIndex.y);
        iceDemon.healthBar = dungeon.bossHealthBar;
        iceDemon.node.active = true;
        return iceDemon;
    }
    getEvilEye(dungeon: Dungeon, posIndex: cc.Vec2): EvilEye {
        let evilEyePrefab: cc.Node = null;
        evilEyePrefab = cc.instantiate(this.evilEye);
        evilEyePrefab.active = false;
        evilEyePrefab.parent = dungeon.node;
        let evil = evilEyePrefab.getComponent(EvilEye);
        evil.dungeon = dungeon;
        let data = new MonsterData();
        data.updateHA(400, 400, 0);
        evil.data = data;
        evil.transportBoss(posIndex.x, posIndex.y);
        evil.healthBar = dungeon.bossHealthBar;
        evil.node.active = true;
        return evil;
    }
    getWarMachine(dungeon: Dungeon, posIndex: cc.Vec2): WarMachine {
        let machinePrefab: cc.Node = null;
        machinePrefab = cc.instantiate(this.warmachine);
        machinePrefab.active = false;
        machinePrefab.parent = dungeon.node;
        let machine = machinePrefab.getComponent(WarMachine);
        machine.dungeon = dungeon;
        let data = new MonsterData();
        data.updateHA(800, 800, 2);
        machine.data = data;
        machine.transportBoss(posIndex.x, posIndex.y);
        machine.healthBar = dungeon.bossHealthBar;
        machine.node.active = true;
        return machine;
    }
    getRah(dungeon: Dungeon, posIndex: cc.Vec2): Rah {
        let rahPrefab: cc.Node = null;
        rahPrefab = cc.instantiate(this.rah);
        rahPrefab.active = false;
        rahPrefab.parent = dungeon.node;
        let rah = rahPrefab.getComponent(Rah);
        rah.dungeon = dungeon;
        let data = new MonsterData();
        data.updateHA(400, 400, 0);
        rah.data = data;
        rah.transportBoss(posIndex.x, posIndex.y);
        rah.healthBar = dungeon.bossHealthBar;
        rah.node.active = true;
        return rah;
    }
    getKraken(dungeon: Dungeon, posIndex: cc.Vec2): Kraken {
        let krakenPrefab: cc.Node = null;
        krakenPrefab = cc.instantiate(this.kraken);
        krakenPrefab.active = false;
        krakenPrefab.parent = dungeon.node;
        let kraken = krakenPrefab.getComponent(Kraken);
        kraken.dungeon = dungeon;
        let data = new MonsterData();
        data.updateHA(800, 800, 2);
        kraken.data = data;
        kraken.transportBoss(posIndex.x, posIndex.y);
        kraken.healthBar = dungeon.bossHealthBar;
        kraken.node.active = true;
        return kraken;
    }
    getCaptain(dungeon: Dungeon, posIndex: cc.Vec2): Captain {
        let captainPrefab: cc.Node = null;
        captainPrefab = cc.instantiate(this.captain);
        captainPrefab.active = false;
        captainPrefab.parent = dungeon.node;
        let captain = captainPrefab.getComponent(Captain);
        captain.dungeon = dungeon;
        let data = new MonsterData();
        data.updateHA(400, 400, 2);
        captain.data = data;
        captain.transportBoss(posIndex.x, posIndex.y);
        captain.healthBar = dungeon.bossHealthBar;
        captain.node.active = true;
        return captain;
    }
    getSlime(dungeon: Dungeon, posIndex: cc.Vec2, type: number): Slime {
        let slimePrefab: cc.Node = null;
        slimePrefab = cc.instantiate(this.slime);
        slimePrefab.active = false;
        slimePrefab.parent = dungeon.node;
        let slime = slimePrefab.getComponent(Slime);
        slime.dungeon = dungeon;
        let data = new MonsterData();
        data.Common.moveSpeed = 200;
        switch (type) {
            case 0: data.updateHA(400, 400, 2); slime.scaleSize = 2; break;
            case 1: data.updateHA(200, 200, 2); slime.scaleSize = 1.5; break;
            case 2: data.updateHA(100, 100, 2); slime.scaleSize = 1; break;
            case 3: data.updateHA(50, 50, 2); slime.scaleSize = 0.5; break;
            case 4: data.updateHA(25, 25, 2); slime.scaleSize = 0.3; break;
            case 5: data.updateHA(10, 10, 1); slime.scaleSize = 0.2; break;
            default: data.updateHA(5, 5, 1); slime.scaleSize = 0.2; break;
        }
        slime.slimeType = type;
        slime.node.scaleY = slime.scaleSize;
        slime.node.scaleX = slime.scaleSize;
        slime.data = data;
        slime.transportBoss(posIndex.x, posIndex.y);
        slime.healthBar = dungeon.bossHealthBar;
        slime.node.active = true;
        return slime;
    }
    addRandomMonsters(dungeon: Dungeon) {
        let arr = new Array();
        let num = Random.getRandomNum(1, 3);
        switch (Logic.chapterName) {
            case Logic.CHAPTER00: arr = [MonsterManager.MONSTER_CHICKEN, MonsterManager.MONSTER_TERRORDRONE, MonsterManager.MONSTER_KILLER
                , MonsterManager.MONSTER_ZOOMBIE, MonsterManager.MONSTER_ELECTRICEYE];
                num = Random.getRandomNum(1, 3);
                break;
            case Logic.CHAPTER01: arr = [MonsterManager.MONSTER_PIRATE, MonsterManager.MONSTER_SAILOR, MonsterManager.MONSTER_OCTOPUS
                , MonsterManager.MONSTER_ALTAIR, MonsterManager.MONSTER_EZIO, MonsterManager.MONSTER_CONNAR, MonsterManager.MONSTER_STRONGSAILOR
                , MonsterManager.MONSTER_FISH];
                num = Random.getRandomNum(2, 3); break;
            case Logic.CHAPTER02: arr = [MonsterManager.MONSTER_SLIME, MonsterManager.MONSTER_GOBLIN, MonsterManager.MONSTER_GOBLIN_ARCHER
                , MonsterManager.MONSTER_WEREWOLF];
                num = Random.getRandomNum(2, 5); break;
            case Logic.CHAPTER03: arr = [MonsterManager.MONSTER_MUMMY, MonsterManager.MONSTER_ANUBIS, MonsterManager.MONSTER_SCARAB];
                num = Random.getRandomNum(2, 7); break;
            case Logic.CHAPTER04: arr = [MonsterManager.MONSTER_GARGOYLE];
                num = Random.getRandomNum(3, 10); break;
        }
        for (let i = 0; i <= num; i++) {
            dungeon.addMonsterFromData(arr[Random.getRandomNum(0, arr.length - 1)]
                , Random.getRandomNum(0, Dungeon.WIDTH_SIZE - 1)
                , Random.getRandomNum(0, Dungeon.HEIGHT_SIZE - 1))
        }
    }

}
