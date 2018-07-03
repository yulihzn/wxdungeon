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
    public static readonly MONSTER_SLIME = 'monster000';
    public static readonly MONSTER_GOBLIN = 'monster001';
	public static readonly MONSTER_MUMMY = 'monster002';
    public static readonly MONSTER_ANUBIS = 'monster003';
    public static readonly MONSTER_PIRATE = 'monster004';
    public static readonly MONSTER_SAILOR = 'monster005';
    public static readonly MONSTER_OCTOPUS = 'monster006';
    
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
            case MonsterManager.MONSTER_SLIME: data.updateHA(999,999,1); break;
			case MonsterManager.MONSTER_GOBLIN: data.updateHA(1,1,1); break;
			case MonsterManager.MONSTER_MUMMY: data.updateHA(2,2,2); break;
            case MonsterManager.MONSTER_ANUBIS: data.updateHA(3,3,3); break;
            case MonsterManager.MONSTER_PIRATE: data.updateHA(2,2,2); break;
            case MonsterManager.MONSTER_SAILOR: data.updateHA(1,1,1); break;
            case MonsterManager.MONSTER_OCTOPUS: data.updateHA(10,10,0); break;
        }
        monster.changeBodyRes(resName);
        monster.data = data;
        return monster;
        
    }
    getKraken(parent:cc.Node):Kraken{
        let krakenPrefab:cc.Node = null;
        krakenPrefab = cc.instantiate(this.kraken);
        krakenPrefab.active = false;
        krakenPrefab.parent = parent;
        let kraken = krakenPrefab.getComponent(Kraken);
        let data = new MonsterData();
        data.updateHA(20,20,2);
        kraken.data = data;
        kraken.transportPlayer(4,5);
        kraken.node.active = true;
        return kraken;
    }

    start () {
    }
    
}
