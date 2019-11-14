import Skill from "../Utils/Skill";
import Player from "../Player";
import TalentData from "../Data/TalentData";
import DamageData from "../Data/DamageData";
import Actor from "../Base/Actor";
import Logic from "../Logic";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class Talent extends cc.Component {
    public static readonly DASH_01 = 1000001;//普通
    public static readonly DASH_02 = 1000002;//突刺冲撞 1伤害 1
    public static readonly DASH_03 = 1000003;//鱼肠刺僚 流血 1
    public static readonly DASH_04 = 1000004;//螳臂当车 击退 1
    public static readonly DASH_05 = 1000005;//醉舞矛戈 减速 1
    public static readonly DASH_06 = 1000006;//野蛮冲撞 眩晕 1
    public static readonly DASH_07 = 1000007;//突刺鹰击 5伤害 1
    public static readonly DASH_08 = 1000008;//移形换影 本体不冲刺而是幻影替代随后瞬移到幻影的位置 1
    public static readonly DASH_09 = 1000009;//火焰舞者 划过路径留下一道3秒的火焰 1
    public static readonly DASH_10 = 1000010;//冰霜之城 划过路径留下一道3秒的冰墙 1
    public static readonly DASH_11 = 1000011;//元素湍流 扩大路径面积
    public static readonly DASH_12 = 1000012;//灵姿鬼步 冲刺期间无敌 1
    public static readonly DASH_13 = 1000013;//坚韧意志 缩短冲刺冷却 1
    public static readonly DASH_14 = 1000014;//飞燕如梭 冲刺速度提高距离变远 1

    public static readonly SHIELD_01 = 2000001;//普通 1
    public static readonly SHIELD_02 = 2000002;//迅捷反击 1
    public static readonly SHIELD_03 = 2000003;//镜面偏转 1
    public static readonly SHIELD_04 = 2000004;//元素晶盾 1
    public static readonly SHIELD_05 = 2000005;//强力盾反 1
    public static readonly SHIELD_06 = 2000006;//乾坤一掷 1
    public static readonly SHIELD_07 = 2000007;//九转回旋（减速）1
    public static readonly SHIELD_08 = 2000008;//平地惊雷（眩晕）1
    public static readonly SHIELD_09 = 2000009;//四两千斤（击退）1
    public static readonly SHIELD_10 = 2000010;//见血封喉（流血）1
    public static readonly SHIELD_11 = 2000011;//阴阳遁形（距离）1
    public static readonly SHIELD_12 = 2000012;//敏捷身法（移除减速损耗）1 
    public static readonly SHIELD_13 = 2000013;//坚韧不屈（缩短cd）1
    public static readonly SHIELD_14 = 2000014;//龟甲铜墙（举盾时间变长，非乾坤一掷）1

    public static readonly MAGIC_01 = 3000001;//元素飞弹
    public static readonly MAGIC_02 = 3000002;
    public static readonly MAGIC_03 = 3000003;
    public static readonly MAGIC_04 = 3000004;
    public static readonly MAGIC_05 = 3000005;
    public static readonly MAGIC_06 = 3000006;
    public static readonly MAGIC_07 = 3000007;
    public static readonly MAGIC_08 = 3000008;
    public static readonly MAGIC_09 = 3000009;
    public static readonly MAGIC_10 = 3000010;
    public static readonly MAGIC_11 = 3000011;
    public static readonly MAGIC_12 = 3000012;
    public static readonly MAGIC_13 = 3000013;
    public static readonly MAGIC_14 = 3000014;
    public static readonly MAGIC_15 = 3000015;
    public static readonly MAGIC_16 = 3000016;

    public static readonly DASH_DESC = ['冲刺;向前冲刺一段距离','突刺冲撞;冲刺并造成1点伤害','鱼肠刺僚;冲刺造成流血效果'
    ,'螳臂当车;冲刺造成击退效果','醉舞矛戈;冲刺造成减速效果','野蛮冲撞;冲刺造成眩晕效果'
    ,'突刺鹰击;冲刺并造成5点伤害','移形换影;本体不冲刺而是幻影替代随后瞬移到幻影的位置','火焰舞者;划过路径留下一道3秒的火焰'
    ,'冰霜之城;划过路径留下一道3秒的冰墙','元素湍流;扩大路径面积','灵姿鬼步;冲刺期间无敌'
    ,'坚韧意志;缩短冲刺冷却','飞燕如梭;冲刺速度提高距离变远']
    public static readonly SHIELD_DESC = ['举盾;举起盾牌防御','迅捷反击;盾牌反击1点伤害','镜面偏转;反弹子弹'
    ,'元素晶盾;受到的元素效果无效','强力盾反;盾牌反击5点伤害','乾坤一掷;盾牌可以飞掷'
    ,'九转回旋;盾牌飞掷造成减速效果','平地惊雷;盾牌飞掷造成眩晕效果','四两千斤;盾牌飞掷造成击退效果'
    ,'见血封喉;盾牌飞掷造成流血效果','阴阳遁形;盾牌飞掷距离变远','敏捷身法;移除减速损耗'
    ,'坚韧不屈;缩短举盾冷却','龟甲铜墙;举盾时间变长']
    public static readonly MAGIC_DESC = ['元素飞弹;发射一枚普通的元素飞弹','多重施法;火球变多，扇形冰锥，双重雷暴，多重飞弹','快速吟唱;施法吟唱时间变短'
    ,'冷静冥想;缩短施法间隔','灵活移动;移动速度提高，施法可以移动','武器附魔;给武器附近元素伤害'
    ,'火球术;施放一个火球砸向地面','惊天陨石;施放一个大火球砸向地面','火焰精灵;产生火焰精灵漂浮在身边对敌人发起进攻'
    ,'冰晶锥;发射一个能减速的冰锥','大冰晶柱;发射一个能冻结的冰柱','冰晶护盾;生成一个冰甲抵消一次伤害并减速周围'
    ,'雷电球;在前方生成一个延迟爆炸的电球并眩晕周围敌人','高压雷暴;雷电球范围变大，延迟变低','雷暴线圈;定时爆发出雷环眩晕周围敌人']
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
    init(){
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
            if(id == t.id){
                hasit = true;
            }
        }
        if(!hasit){
            this.talentList.push(data);
            this.hasTalentMap[data.id] = true;
            this.changePerformance();
            Logic.addTalent(data.id);
        }
    }
    abstract changePerformance():void
    abstract useSKill(): void
        
  
    getSpriteChildSprite(childNames: string[]): cc.Sprite {
        let node = this.node;
        for (let name of childNames) {
            node = node.getChildByName(name);
        }
        return node.getComponent(cc.Sprite);
    }
    hashTalent(id: number): boolean {
        return this.hasTalentMap[id]&&this.hasTalentMap[id]==true;
    }
    
    abstract takeDamage(damageData: DamageData, actor?: Actor):void
}