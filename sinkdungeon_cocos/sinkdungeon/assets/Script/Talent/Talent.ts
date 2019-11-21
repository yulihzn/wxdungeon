import Skill from "../Utils/Skill";
import Player from "../Player";
import TalentData from "../Data/TalentData";
import DamageData from "../Data/DamageData";
import Actor from "../Base/Actor";
import Logic from "../Logic";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class Talent extends cc.Component {
    public static readonly DASH = 1000000;
    public static readonly SHIELD = 2000000;
    public static readonly MAGIC = 3000000;
    public static readonly ARCHER = 4000000;
    public static readonly DASH_01 = Talent.DASH + 1;//普通
    public static readonly DASH_02 = Talent.DASH + 2;//突刺冲撞 1伤害 1
    public static readonly DASH_03 = Talent.DASH + 3;//鱼肠刺僚 流血 1
    public static readonly DASH_04 = Talent.DASH + 4;//螳臂当车 击退 1
    public static readonly DASH_05 = Talent.DASH + 5;//醉舞矛戈 减速 1
    public static readonly DASH_06 = Talent.DASH + 6;//野蛮冲撞 眩晕 1
    public static readonly DASH_07 = Talent.DASH + 7;//突刺鹰击 5伤害 1
    public static readonly DASH_08 = Talent.DASH + 8;//移形换影 本体不冲刺而是幻影替代随后瞬移到幻影的位置 1
    public static readonly DASH_09 = Talent.DASH + 9;//火焰舞者 划过路径留下一道3秒的火焰 1
    public static readonly DASH_10 = Talent.DASH + 10;//冰霜之城 划过路径留下一道3秒的冰墙 1
    public static readonly DASH_11 = Talent.DASH + 11;//元素湍流 扩大路径面积
    public static readonly DASH_12 = Talent.DASH + 12;//灵姿鬼步 冲刺期间无敌 1
    public static readonly DASH_13 = Talent.DASH + 13;//坚韧意志 缩短冲刺冷却 1
    public static readonly DASH_14 = Talent.DASH + 14;//飞燕如梭 冲刺速度提高距离变远 1

    public static readonly SHIELD_01 = Talent.SHIELD + 1;//普通 1
    public static readonly SHIELD_02 = Talent.SHIELD + 2;//迅捷反击 1
    public static readonly SHIELD_03 = Talent.SHIELD + 3;//镜面偏转 1
    public static readonly SHIELD_04 = Talent.SHIELD + 4;//元素晶盾 1
    public static readonly SHIELD_05 = Talent.SHIELD + 5;//强力盾反 1
    public static readonly SHIELD_06 = Talent.SHIELD + 6;//乾坤一掷 1
    public static readonly SHIELD_07 = Talent.SHIELD + 7;//九转回旋（减速）1
    public static readonly SHIELD_08 = Talent.SHIELD + 8;//平地惊雷（眩晕）1
    public static readonly SHIELD_09 = Talent.SHIELD + 9;//四两千斤（击退）1
    public static readonly SHIELD_10 = Talent.SHIELD + 10;//见血封喉（流血）1
    public static readonly SHIELD_11 = Talent.SHIELD + 11;//阴阳遁形（距离）1
    public static readonly SHIELD_12 = Talent.SHIELD + 12;//敏捷身法（移除减速损耗）1 
    public static readonly SHIELD_13 = Talent.SHIELD + 13;//坚韧不屈（缩短cd）1
    public static readonly SHIELD_14 = Talent.SHIELD + 14;//龟甲铜墙（举盾时间变长，非乾坤一掷）1

    public static readonly MAGIC_01 = Talent.MAGIC + 1;//元素飞弹 1
    public static readonly MAGIC_02 = Talent.MAGIC + 2;//多重施法 1
    public static readonly MAGIC_03 = Talent.MAGIC + 3;//快速吟唱 1
    public static readonly MAGIC_04 = Talent.MAGIC + 4;//冷静冥想 1
    public static readonly MAGIC_05 = Talent.MAGIC + 5;//灵活移动 1
    public static readonly MAGIC_06 = Talent.MAGIC + 6;//法力增强 1
    public static readonly MAGIC_07 = Talent.MAGIC + 7;//武器附魔 1
    public static readonly MAGIC_08 = Talent.MAGIC + 8;//火球术 1
    public static readonly MAGIC_09 = Talent.MAGIC + 9;//惊天陨石 1
    public static readonly MAGIC_10 = Talent.MAGIC + 10;//火焰精灵
    public static readonly MAGIC_11 = Talent.MAGIC + 11;//冰晶锥 1
    public static readonly MAGIC_12 = Talent.MAGIC + 12;//大冰晶柱 2
    public static readonly MAGIC_13 = Talent.MAGIC + 13;//冰晶护盾 1
    public static readonly MAGIC_14 = Talent.MAGIC + 14;//雷电球 1
    public static readonly MAGIC_15 = Talent.MAGIC + 15;//高压雷暴 1
    public static readonly MAGIC_16 = Talent.MAGIC + 16;//雷暴线圈

    public static readonly DASH_DESC = ['冲刺;向前冲刺一段距离', '突刺冲撞;冲刺并造成1点伤害', '鱼肠刺僚;冲刺造成流血效果'
        , '螳臂当车;冲刺造成击退效果', '醉舞矛戈;冲刺造成减速效果', '野蛮冲撞;冲刺造成眩晕效果'
        , '突刺鹰击;冲刺并造成5点伤害', '移形换影;本体不冲刺而是幻影替代随后瞬移到幻影的位置', '火焰舞者;划过路径留下一道3秒的火焰'
        , '冰霜之城;划过路径留下一道3秒的冰墙', '元素湍流;扩大路径面积', '灵姿鬼步;冲刺期间无敌'
        , '坚韧意志;缩短冲刺冷却', '飞燕如梭;冲刺速度提高距离变远']
    public static readonly SHIELD_DESC = ['举盾;举起盾牌防御', '迅捷反击;盾牌反击1点伤害', '镜面偏转;反弹子弹'
        , '元素晶盾;受到的元素效果无效', '强力盾反;盾牌反击5点伤害', '乾坤一掷;盾牌可以飞掷'
        , '九转回旋;盾牌飞掷造成减速效果', '平地惊雷;盾牌飞掷造成眩晕效果', '四两千斤;盾牌飞掷造成击退效果'
        , '见血封喉;盾牌飞掷造成流血效果', '阴阳遁形;盾牌飞掷距离变远', '敏捷身法;移除减速损耗'
        , '坚韧不屈;缩短举盾冷却', '龟甲铜墙;举盾时间变长']
    public static readonly MAGIC_DESC = ['元素飞弹;发射一枚普通的元素飞弹', '多重施法;火球变多，扇形冰锥，双重雷暴', '快速吟唱;施法吟唱时间变短'
        , '冷静冥想;缩短施法间隔', '灵活移动;移动速度提高，施法可以移动', '法力增强;提高法术伤害', '武器附魔;给武器附加元素伤害'
        , '火球术;施放一个火球', '炎爆术;施放一个大火球', '火焰精灵;产生火焰精灵漂浮在身边对敌人发起进攻'
        , '冰晶锥;发射一个能减速的冰锥', '大冰晶柱;发射一个能冻结的冰柱', '冰晶护盾;生成一个冰甲抵消一次伤害并减速周围'
        , '雷电球;在前方生成一个延迟爆炸的电球并眩晕周围敌人', '高压雷暴;雷电球范围变大，延迟变低', '雷暴线圈;定时爆发出雷环眩晕周围敌人']


    //技能互斥表
    public static readonly SHIELD_CAN_OPEN_MAP = [
        `1;;`, `2;1;`, `3;2;4`, `4;2;3`, `5;3,4;`,
        `6;1;`, `7;6;8,9,10`, `8;6;7,9,10`, `9;6;7,8,10`,
        `10;6;7,8,9`, `11;7,8,9,10;`
        , `12;1;`, `13;12;`, `14;13;`];
    public static readonly DASH_CAN_OPEN_MAP = [
        `1;;`, `2;1;`, `3;2;4,5,6`, `4;2;3,5,6`, `5;2;3,4,6;`,
        `6;2;3,4,5`, `7;3,4,5,6;`, `8;1;`, `9;8;10`,
        `10;8;9`, `11;9,10;`, `12;1;`, `13;12;`, `14;13;`];
    public static readonly MAGIC_CAN_OPEN_MAP = [
        `1;;`, `2;13,10,16;`, `3;1;`, `4;3;`, `5;1;`,
        `6;7;`, `7;5;`, `8;1;11,14`, `9;8;`,
        `10;9;`, `11;1;8,14;`
        , `12;11;`, `13;12;`, `14;1;8,11`, `15;14;`, `16;15;`];

    talentSkill = new Skill();
    player: Player;
    talentList: TalentData[];
    hasTalentMap: { [key: number]: boolean } = {};
    get IsExcuting() {
        return this.talentSkill.IsExcuting;
    }
    set IsExcuting(flag: boolean) {
        this.talentSkill.IsExcuting = flag;
    }
    onLoad() {

    }
    init() {
        this.player = this.getComponent(Player);
    }
    loadList(talentList: TalentData[]) {
        this.talentList = new Array();
        this.hasTalentMap = {};
        for (let t of talentList) {
            let temp = new TalentData();
            temp.valueCopy(t);
            this.talentList.push(temp);
            this.hasTalentMap[temp.id] = true;
        }
        this.changePerformance();
    }
    addTalent(id: number) {
        let data = new TalentData();
        data.id = id;
        let hasit = false;
        for (let t of this.talentList) {
            if (id == t.id) {
                hasit = true;
            }
        }
        if (!hasit) {
            this.talentList.push(data);
            this.hasTalentMap[data.id] = true;
            this.changePerformance();
            Logic.addTalent(data.id);
        }
    }
    abstract changePerformance(): void
    abstract useSKill(): void


    getSpriteChildSprite(childNames: string[]): cc.Sprite {
        let node = this.node;
        for (let name of childNames) {
            node = node.getChildByName(name);
        }
        return node.getComponent(cc.Sprite);
    }
    hashTalent(id: number): boolean {
        return this.hasTalentMap[id] && this.hasTalentMap[id] == true;
    }

    abstract takeDamage(damageData: DamageData, actor?: Actor): void
}