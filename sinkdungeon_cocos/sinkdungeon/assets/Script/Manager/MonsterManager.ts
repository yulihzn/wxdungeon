import Monster from "../Monster";
import MonsterData from "../Data/MonsterData";

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
    public static readonly MONSTER_GOBLIN = 'monster001';
	public static readonly MONSTER_MUMMY = 'monster002';
	public static readonly MONSTER_ANUBIS = 'monster003';

    // LIFE-CYCLE CALLBACKS:

    // update (dt) {}

    // LIFE-CYCLE CALLBACKS:
    @property(Monster)
    monster: Monster = null;

    onLoad () {
        
    }
    /**
     * 
     * @param resName 图片
     * @param monsterNode Monster prefab的结点
     * @param parent 父节点
     */
    static getMonster(resName:string,monsterNode:cc.Node,parent:cc.Node):Monster{
        let monsterPrefab:cc.Node = null;
        monsterPrefab = cc.instantiate(monsterNode);
        monsterPrefab.active = false;
        monsterPrefab.parent = parent;
        let monster = monsterPrefab.getComponent(Monster);
        let data = new MonsterData();
        switch (resName) {
			case MonsterManager.MONSTER_GOBLIN: data.updateHA(1,1,1); break;
			case MonsterManager.MONSTER_MUMMY: data.updateHA(2,2,2); break;
			case MonsterManager.MONSTER_ANUBIS: data.updateHA(3,3,3); break;
        }
        monster.changeBodyRes(resName);
        monster.data = data;
        return monster;
        
    }

    start () {
    }
    
}
