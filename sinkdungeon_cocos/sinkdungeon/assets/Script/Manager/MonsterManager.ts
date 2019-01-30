import Monster from "../Monster";
import MonsterData from "../Data/MonsterData";
import Kraken from "../Boss/Kraken";
import Dungeon from "../Dungeon";
import Captain from "../Boss/Captain";
import Logic from "../Logic";
import Slime from "../Boss/Slime";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

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
    onLoad () {
    }
    /**
     * 
     * @param resName 图片
     * @param monsterNode Monster prefab的结点
     * @param parent 父节点
     */
    getMonster(resName:string,dungeon:Dungeon):Monster{
        let monsterPrefab:cc.Node = null;
        monsterPrefab = cc.instantiate(this.monster);
        monsterPrefab.active = false;
        monsterPrefab.parent = dungeon.node;
        let monster = monsterPrefab.getComponent(Monster);
        let data = new MonsterData();
        monster.dungeon = dungeon;
        data.valueCopy(Logic.monsters[resName]);
        monster.isDisguising = data.disguise > 0;
        if(monster.isDisguising){
            monster.changeBodyRes(data.resName,Monster.RES_DISGUISE);
        }else{
            monster.changeBodyRes(resName);
        }
        //5%的几率变异
        let variationRate = 5;
        //1%几率添加元素
        let rate = 0.01;
        variationRate = variationRate+Logic.chapterName*5+Logic.level*2;
        rate = rate+Logic.chapterName*0.05+Logic.level*0.02;
        
        monster.isVariation =  Logic.getRandomNum(0,100)<variationRate;
        if(monster.isVariation){
            data.Common.maxHealth=data.Common.maxHealth*2;
            data.Common.damageMin=data.Common.damageMin*2;
            data.currentHealth=data.currentHealth*2;
            data.melee = data.melee>0?data.melee+20:0;
            data.remote = data.remote>0?data.remote+20:0;
            data.dash = data.dash>0?data.dash+20:0;
            data.Common.moveSpeed = data.Common.moveSpeed>0?(data.Common.moveSpeed + 100):0;
        }
        data.Common.iceDamage = Math.random()<rate?data.Common.iceDamage:Logic.getRandomNum(0,1);
        data.Common.fireDamage = Math.random()<rate?data.Common.iceDamage:Logic.getRandomNum(0,1);
        data.Common.lighteningDamage = Math.random()<rate?data.Common.lighteningDamage:Logic.getRandomNum(0,1);
        data.Common.toxicDamage = Math.random()<rate?data.Common.toxicDamage:Logic.getRandomNum(0,1);
        data.Common.curseDamage = Math.random()<rate?data.Common.curseDamage:Logic.getRandomNum(0,1);
        data.Common.iceDefence = Math.random()<rate?data.Common.iceDefence:Logic.getRandomNum(0,100);
        data.Common.fireDefence = Math.random()<rate?data.Common.fireDefence:Logic.getRandomNum(0,100);
        data.Common.lighteningDefence = Math.random()<rate?data.Common.lighteningDefence:Logic.getRandomNum(0,100);
        data.Common.toxicDefence= Logic.getRandomNum(0,100)<rate?data.Common.toxicDefence:Logic.getRandomNum(0,100);
        data.Common.curseDefence = Math.random()<rate?data.Common.curseDefence:Logic.getRandomNum(0,100);
        data.Common.iceRate = Math.random()<rate?data.Common.iceRate:Logic.getRandomNum(0,100);
        data.Common.fireRate = Math.random()<rate?data.Common.fireRate:Logic.getRandomNum(0,100);
        data.Common.lighteningRate = Math.random()<rate?data.Common.lighteningRate:Logic.getRandomNum(0,100);
        data.Common.toxicRate= Logic.getRandomNum(0,100)<rate?data.Common.toxicRate:Logic.getRandomNum(0,100);
        data.Common.curseRate = Math.random()<rate?data.Common.curseRate:Logic.getRandomNum(0,100);
        monster.data = data;
        return monster;
    }
   
    getKraken(dungeon:Dungeon,posIndex:cc.Vec2):Kraken{
        let krakenPrefab:cc.Node = null;
        krakenPrefab = cc.instantiate(this.kraken);
        krakenPrefab.active = false;
        krakenPrefab.parent = dungeon.node;
        let kraken = krakenPrefab.getComponent(Kraken);
        kraken.dungeon = dungeon;
        let data = new MonsterData();
        data.updateHA(800,800,2);
        kraken.data = data;
        kraken.transportBoss(posIndex.x,posIndex.y);
        kraken.healthBar = dungeon.bossHealthBar;
        kraken.node.active = true;
        return kraken;
    }
    getCaptain(dungeon:Dungeon,posIndex:cc.Vec2):Captain{
        let captainPrefab:cc.Node = null;
        captainPrefab = cc.instantiate(this.captain);
        captainPrefab.active = false;
        captainPrefab.parent = dungeon.node;
        let captain = captainPrefab.getComponent(Captain);
        captain.dungeon = dungeon;
        let data = new MonsterData();
        data.updateHA(400,400,2);
        captain.data = data;
        captain.transportBoss(posIndex.x,posIndex.y);
        captain.healthBar = dungeon.bossHealthBar;
        captain.node.active = true;
        return captain;
    }
    getSlime(dungeon:Dungeon,posIndex:cc.Vec2,type:number):Slime{
        let slimePrefab:cc.Node = null;
        slimePrefab = cc.instantiate(this.slime);
        slimePrefab.active = false;
        slimePrefab.parent = dungeon.node;
        let slime = slimePrefab.getComponent(Slime);
        slime.dungeon = dungeon;
        let data = new MonsterData();
        data.Common.moveSpeed = 200;
        switch(type){
            case 0:data.updateHA(400,400,2);slime.scaleSize=2;break;
            case 1:data.updateHA(200,200,2);slime.scaleSize=1.5;break;
            case 2:data.updateHA(100,100,2);slime.scaleSize=1;break;
            case 3:data.updateHA(50,50,2);slime.scaleSize=0.5;break;
            case 4:data.updateHA(25,25,2);slime.scaleSize=0.3;break;
            case 5:data.updateHA(10,10,1);slime.scaleSize=0.2;break;
            default:data.updateHA(5,5,1);slime.scaleSize=0.2;break;
        }
        slime.slimeType = type;
        slime.node.scaleY = slime.scaleSize;
        slime.node.scaleX = slime.scaleSize;
        slime.data = data;
        slime.transportBoss(posIndex.x,posIndex.y);
        slime.healthBar = dungeon.bossHealthBar;
        slime.node.active = true;
        return slime;
    }
    start () {
    }
    
}
