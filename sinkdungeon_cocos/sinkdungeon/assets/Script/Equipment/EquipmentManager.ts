import Equipment from "./Equipment";
import Dungeon from "../Dungeon";
import Logic from "../Logic";

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
export default class EquipmentManager extends cc.Component {
    public static readonly EMPTY = "emptyequipment";
    public static readonly WEAPON_KNIFE = "weapon001";
    public static readonly CLOTHES_VEST = "clothes001";
    public static readonly CLOTHES_SHIRT = "clothes002";
    public static readonly HELMET_BUCKETHAT = "helmet002";

    //暴击的(15%以上的暴击)
    public static readonly DESC_CRITICALSTRIKE = "criticalstrike";
    //迅捷的(15%以上的攻击速度)
    public static readonly DESC_ATTACKSPPED = "criticalstrike";
    //灵动的(15%以上的移动速度)
    public static readonly DESC_MOVESPEED = "criticalstrike";
    //飘逸的(15%以上的闪避几率)
    public static readonly DESC_DODGE = "criticalstrike";
    //坚固的(3点以上的防御力)
    public static readonly DESC_STABLE = "criticalstrike";
    //强力的(3点以上的攻击力)
    public static readonly DESC_POWERFUL = "criticalstrike";
    //健康的(5点以上最大生命值)
    public static readonly DESC_HEALTHY = "criticalstrike";
    //邪恶的(1点以上的生命汲取)
    public static readonly DESC_LIFEDRAIN = "criticalstrike";
    @property(cc.Prefab)
    equipment: cc.Prefab = null;
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    getEquipment(equipType:string,pos:cc.Vec2,parent:cc.Node):Equipment{
        let equipmentPrefab = cc.instantiate(this.equipment);
        equipmentPrefab.parent = parent;
        equipmentPrefab.position = Dungeon.getPosInMap(pos);
        equipmentPrefab.zIndex = 3000 + (Dungeon.SIZE - pos.y) * 100+3;
        let equipment = equipmentPrefab.getComponent(Equipment);
        equipment.pos = pos;
        equipment.refresh(Logic.equipments[equipType]);
        return equipment;
        
    }
    start () {

    }

    // update (dt) {}
}
