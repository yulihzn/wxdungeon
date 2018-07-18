import Dungeon from "../Dungeon";
import Logic from "../Logic";
import EquipmentData from "../Data/EquipmentData";
import EquipmentDescData from "../Data/EquipmentDescData";
import Equipment from "../Equipment/Equipment";

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
export default class EquipmentManager extends cc.Component {
    public static readonly EMPTY = "emptyequipment";
    public static readonly WEAPON_KNIFE = "weapon001";
    public static readonly CLOTHES_VEST = "clothes001";
    public static readonly CLOTHES_SHIRT = "clothes002";
    public static readonly HELMET_BUCKETHAT = "helmet002";

    //暴击的(暴击)
    public static readonly COLOR_CRITICALSTRIKE = "#DC143C";//猩红
    //迅捷的(攻击速度)
    public static readonly COLOR_ATTACKSPPED = "#5F9EA0";//军校蓝
    //灵动的(移动速度)
    public static readonly COLOR_MOVESPEED = "#00BFFF";//深天蓝
    //飘逸的(闪避几率)
    public static readonly COLOR_DODGE = "#FFFF00";//黄色
    //坚固的(防御力)
    public static readonly COLOR_STABLE = "#DEB887";//结实的树棕色
    //强力的(攻击力)
    public static readonly COLOR_POWERFUL = "#9370DB";//适中的兰花紫
    //健康的(最大生命值)
    public static readonly COLOR_HEALTHY = "#90EE90";//淡绿色
    //邪恶的(生命汲取)
    public static readonly COLOR_LIFEDRAIN = "#FFC0CB";//粉红
    //温暖的(生命恢复)
    public static readonly COLOR_RECOVERY = "#ADFF2F";//绿黄色
    @property(cc.Prefab)
    equipment: cc.Prefab = null;



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    }
    /*灰色（粗糙）→白色（普通）→绿色（优秀）→蓝色（精良）→紫色（史诗）→橙色（传说）*/
    getRandomDesc(data: EquipmentData,chestQuality?:number): EquipmentDescData {
        let desc = new EquipmentDescData();
        let arr = ['rough', 'normal', 'good', 'excellent', 'epic', 'legend']
        let colors = ['#dcdcdc', '#ffffff', '#00ff00', '#0000ff', '#800080', '#ffa500']
        let level = 0;
        let criticalStrikeRate = this.getRandomQuality(0, 100 - data.criticalStrikeRate,chestQuality);
        level = criticalStrikeRate.y > level ? criticalStrikeRate.y : level;
        desc.prefix += criticalStrikeRate.y > 2 ? 'criticalstrike ' : '';
        desc.color = this.getMixColor('#000000'
            , criticalStrikeRate.y > 2 ? EquipmentManager.COLOR_CRITICALSTRIKE : '#000000');

        let damageMin = this.getRandomQuality(0, 10,chestQuality);
        level = damageMin.y > level ? damageMin.y : level;

        let damageMax = this.getRandomQuality(damageMin.x, damageMin.x + 10,chestQuality);
        level = damageMax.y > level ? damageMax.y : level;
        desc.prefix += damageMax.y > 2 ? 'strong ' : '';
        desc.color = this.getMixColor(desc.color
            , damageMax.y > 2 ? EquipmentManager.COLOR_POWERFUL : '#000000');

        let defence = this.getRandomQuality(0, 10,chestQuality);
        level = defence.y > level ? defence.y : level;
        desc.prefix += defence.y > 2 ? 'stable ' : '';
        desc.color = this.getMixColor(desc.color
            , defence.y > 2 ? EquipmentManager.COLOR_STABLE : '#000000');

        let lifeDrain = this.getRandomQuality(0, 100,chestQuality);
        level = lifeDrain.y > level ? lifeDrain.y : level;
        desc.prefix += lifeDrain.y > 2 ? 'drain ' : '';
        desc.color = this.getMixColor(desc.color
            , lifeDrain.y > 2 ? EquipmentManager.COLOR_LIFEDRAIN : '#000000');

        //为了防止过于imba只有1/10的可能回血
        let lifeRecovery = Math.random() < 0.1 ? this.getRandomQuality(0, 5,chestQuality) : cc.v2(0, 0);
        level = lifeRecovery.y > level ? lifeRecovery.y : level;
        desc.prefix += lifeRecovery.y > 2 ? 'recovery ' : '';
        desc.color = this.getMixColor(desc.color
            , lifeRecovery.y > 2 ? EquipmentManager.COLOR_RECOVERY : '#000000');

        let moveSpeed = this.getRandomQuality(0, 300 - data.moveSpeed,chestQuality);
        level = moveSpeed.y > level ? moveSpeed.y : level;
        desc.prefix += moveSpeed.y > 2 ? 'fast ' : '';
        desc.color = this.getMixColor(desc.color
            , moveSpeed.y > 2 ? EquipmentManager.COLOR_MOVESPEED : '#000000');

        let attackSpeed = this.getRandomQuality(0, 400 - data.attackSpeed,chestQuality);
        level = attackSpeed.y > level ? attackSpeed.y : level;
        desc.prefix += attackSpeed.y > 2 ? 'quick ' : '';
        desc.color = this.getMixColor(desc.color
            , attackSpeed.y > 2 ? EquipmentManager.COLOR_ATTACKSPPED : '#000000');

        let dodge = this.getRandomQuality(0, 60 - data.dodge,chestQuality);
        level = dodge.y > level ? dodge.y : level;
        desc.prefix += dodge.y > 2 ? 'agile ' : '';
        desc.color = this.getMixColor(desc.color
            , dodge.y > 2 ? EquipmentManager.COLOR_DODGE : '#000000');

        let health = this.getRandomQuality(0, 50,chestQuality);
        level = health.y > level ? health.y : level;
        desc.prefix += health.y > 2 ? 'healthy ' : '';
        desc.color = this.getMixColor(desc.color
            , health.y > 2 ? EquipmentManager.COLOR_HEALTHY : '#000000');

        desc.prefix = arr[level] + ' ' + desc.prefix;
        desc.titlecolor = colors[level];
        desc.color = desc.color=='#000000'?'#ffffff':desc.color;
        

        desc.criticalStrikeRate = criticalStrikeRate.x;
        desc.damageMin = damageMin.x;
        desc.damageMax = damageMax.x;
        desc.defence = defence.x;
        desc.lifeDrain = lifeDrain.x;
        desc.lifeRecovery = lifeRecovery.x;
        desc.moveSpeed = moveSpeed.x;
        desc.attackSpeed = attackSpeed.x;
        desc.dodge = dodge.x;
        desc.health = health.x;
        return desc;
    }
    //0.5% 0.25% 0.1% 0.05% 0.01%
    //white 0-0.05 green 0.05-0.075 blue 0.075-0.085 purple 0.085-0.009 orange 0.09-0.0091
    //x:qulity y:level 
    getRandomQuality(min: number, max: number,chestQuality:number): cc.Vec2 {
        let per = (max - min) / 5;
        let quality = Math.random();
        //箱子出来的物品有10%的几率生成和箱子属性相关的优质属性
        if(chestQuality && quality>0.9){
            switch(chestQuality){
                case 1: quality=Math.random()>0.7?0.5:0.004; break;
                case 2: quality=Math.random()>0.7?0.06:0.08; break;
                case 3: quality=Math.random()>0.7?0.086:0.09; break;
            }
        }
        let data = cc.v2(0, 0);
        if (quality < 0.005) {
            data.x = Logic.getRandomNum(0, per);
            data.y = 1;
        } else if (quality >= 0.05 && quality < 0.075) {
            data.x = Logic.getRandomNum(per, per * 2);
            data.y = 2;
        } else if (quality >= 0.075 && quality < 0.085) {
            data.x = Logic.getRandomNum(per * 2, per * 3);
            data.y = 3;
        } else if (quality >= 0.085 && quality < 0.09) {
            data.x = Logic.getRandomNum(per * 3, per * 4);
            data.y = 4;
        } else if (quality >= 0.09 && quality < 0.091) {
            data.x = Logic.getRandomNum(per * 4, per * 5);
            data.y = 5;
        }
        data.x = parseFloat(data.x.toFixed(0));
        return data;
    }
    getEquipment(equipType: string, pos: cc.Vec2, parent: cc.Node, equipData?: EquipmentData,chestQuality?:number): Equipment {
        let equipmentPrefab = cc.instantiate(this.equipment);
        equipmentPrefab.parent = parent;
        equipmentPrefab.position = Dungeon.getPosInMap(pos);
        equipmentPrefab.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - pos.y) * 100 + 3;
        let equipment = equipmentPrefab.getComponent(Equipment);
        equipment.pos = pos;
        if (equipData) {
            //复制已有装备
            equipment.refresh(equipData);
        } else {
            //添加新装备
            let data = new EquipmentData();
            data.valueCopy(Logic.equipments[equipType]);
            let desc = this.getRandomDesc(data,chestQuality);
            data.criticalStrikeRate = desc.criticalStrikeRate;
            data.damageMin += desc.damageMin;
            data.damageMax += desc.damageMax;
            data.defence += desc.defence;
            data.lifeDrain += desc.lifeDrain;
            data.lifeRecovery += desc.lifeRecovery;
            data.moveSpeed += desc.moveSpeed;
            data.attackSpeed += desc.attackSpeed;
            data.dodge += desc.dodge;
            data.health += desc.health;
            data.prefix = desc.prefix;
            data.titlecolor = desc.titlecolor;
            data.color = desc.color;
            equipment.refresh(data);
        }
        return equipment;

    }
    start() {

    }

    getMixColor(color1: string, color2: string): string {
        let c1 = cc.color().fromHEX(color1);
        let c2 = cc.color().fromHEX(color2);
        let c3 = cc.color();
        let r = c1.getR() + c2.getR();
        let g = c1.getG() + c2.getG();
        let b = c1.getB() + c2.getB();

        c3.setR(r > 255 ? 255 : r);
        c3.setG(g > 255 ? 255 : g);
        c3.setB(b > 255 ? 255 : b);
        return '#'+c3.toHEX('#rrggbb');
    }

    // update (dt) {}
}
