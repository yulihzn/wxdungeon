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

    public static readonly DASH_DESC = ['冲刺\n向前冲刺一段距离','突刺冲撞\n冲刺并造成1点伤害','鱼肠刺僚\n冲刺造成流血效果'
    ,'螳臂当车\n冲刺造成击退效果','醉舞矛戈\n冲刺造成减速效果','野蛮冲撞(开发中)\n冲刺造成眩晕效果'
    ,'突刺鹰击\n冲刺并造成5点伤害','移形换影\n本体不冲刺而是幻影替代随后瞬移到幻影的位置','火焰舞者(开发中)\n划过路径留下一道3秒的火焰'
    ,'冰霜之城(开发中)\n划过路径留下一道3秒的冰墙','元素湍流(开发中)\n扩大路径面积','灵姿鬼步\n冲刺期间无敌'
    ,'坚韧意志\n缩短冲刺冷却','飞燕如梭\n冲刺速度提高距离变远']
    public static readonly SHIELD_DESC = ['举盾\n举起盾牌防御','迅捷反击\n盾牌反击1点伤害','镜面偏转\n受到的元素效果无效'
    ,'元素晶盾\n','强力盾反\n盾牌反击5点伤害','乾坤一掷\n盾牌可以飞掷'
    ,'九转回旋\n盾牌飞掷造成减速效果','平地惊雷(开发中)\n盾牌飞掷造成眩晕效果','四两千斤\n盾牌飞掷造成击退效果'
    ,'见血封喉\n盾牌飞掷造成流血效果','阴阳遁形\n盾牌飞掷距离变远','敏捷身法\n移除减速损耗'
    ,'坚韧不屈\n缩短举盾冷却','龟甲铜墙\n举盾时间变长']
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