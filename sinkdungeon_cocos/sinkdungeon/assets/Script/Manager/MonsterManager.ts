import Monster from "../Monster";
import MonsterData from "../Data/MonsterData";
import Kraken from "../Boss/Kraken";

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
    static readonly TYPE_COMBAT = 0;//近战
    static readonly TYPE_REMOTE = 1;//远程
    static readonly TYPE_DASH = 2;//冲刺
    static readonly TYPE_BOSS = 3;//Boss
    public static readonly MONSTER_SLIME = 'monster000';
    public static readonly MONSTER_GOBLIN = 'monster001';
	public static readonly MONSTER_MUMMY = 'monster002';
    public static readonly MONSTER_ANUBIS = 'monster003';
    public static readonly MONSTER_PIRATE = 'monster004';
    public static readonly MONSTER_SAILOR = 'monster005';
    public static readonly MONSTER_OCTOPUS = 'monster006';
    public static readonly MONSTER_KILLER = 'monster007';
    public static readonly MONSTER_STRONGSAILOR = 'monster008';
    
    public static readonly BOSS_KRAKEN = 'BOSS_KRAKEN';

    // LIFE-CYCLE CALLBACKS:

    // update (dt) {}

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Prefab)
    monster: cc.Prefab = null;
    @property(cc.Prefab)
    kraken: cc.Prefab = null;
    onLoad () {
    }
    /**
     * 
     * @param resName 图片
     * @param monsterNode Monster prefab的结点
     * @param parent 父节点
     */
    getMonster(resName:string,parent:cc.Node):Monster{
        let monsterPrefab:cc.Node = null;
        monsterPrefab = cc.instantiate(this.monster);
        monsterPrefab.active = false;
        monsterPrefab.parent = parent;
        let monster = monsterPrefab.getComponent(Monster);
        let data = new MonsterData();
        switch (resName) {
            case MonsterManager.MONSTER_SLIME: data.updateHAT(500,500,0,MonsterManager.TYPE_DASH); break;
			case MonsterManager.MONSTER_GOBLIN: data.updateHAT(2,2,1,MonsterManager.TYPE_COMBAT); break;
			case MonsterManager.MONSTER_MUMMY: data.updateHAT(2,2,2,MonsterManager.TYPE_COMBAT); break;
            case MonsterManager.MONSTER_ANUBIS: data.updateHAT(10,10,3,MonsterManager.TYPE_DASH); break;
            case MonsterManager.MONSTER_PIRATE: data.updateHAT(5,5,2,MonsterManager.TYPE_COMBAT); break;
            case MonsterManager.MONSTER_SAILOR: data.updateHAT(2,2,1,MonsterManager.TYPE_COMBAT); break;
            case MonsterManager.MONSTER_STRONGSAILOR: data.updateHAT(10,10,1,MonsterManager.TYPE_COMBAT); break;
            case MonsterManager.MONSTER_OCTOPUS: data.updateHAT(10,10,2,MonsterManager.TYPE_REMOTE); break;
            case MonsterManager.MONSTER_KILLER: data.updateHAT(5,5,2,MonsterManager.TYPE_REMOTE); break;
        }
        monster.changeBodyRes(resName);
        monster.data = data;
        return monster;
        
    }
    getKraken(parent:cc.Node,posIndex:cc.Vec2):Kraken{
        let krakenPrefab:cc.Node = null;
        krakenPrefab = cc.instantiate(this.kraken);
        krakenPrefab.active = false;
        krakenPrefab.parent = parent;
        let kraken = krakenPrefab.getComponent(Kraken);
        let data = new MonsterData();
        data.updateHAT(100,100,2,MonsterManager.TYPE_BOSS);
        kraken.data = data;
        kraken.transportPlayer(posIndex.x,posIndex.y);
        kraken.node.active = true;
        return kraken;
    }

    start () {
    }
    
}
