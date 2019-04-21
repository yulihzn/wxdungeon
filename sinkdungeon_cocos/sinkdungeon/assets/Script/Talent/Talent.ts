import Skill from "../Utils/Skill";
import Player from "../Player";
import TalentData from "../Data/TalentData";
import DamageData from "../Data/DamageData";
import Actor from "../Base/Actor";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class Talent extends cc.Component {
    public static readonly DASH_01 = 1000001;//普通
    public static readonly DASH_02 = 1000002;//突刺冲撞 2伤害
    public static readonly DASH_03 = 1000003;//鱼肠刺僚 流血
    public static readonly DASH_04 = 1000004;//螳臂当车 击退
    public static readonly DASH_05 = 1000005;//醉舞矛戈 减速
    public static readonly DASH_06 = 1000006;//野蛮冲撞 眩晕
    public static readonly DASH_07 = 1000007;//突刺鹰击 5伤害
    public static readonly DASH_08 = 1000008;//飞燕如梭 冲刺速度提高距离变远
    public static readonly DASH_09 = 1000009;//火焰舞者 划过路径留下一道3秒的火焰
    public static readonly DASH_10 = 1000010;//冰霜之城 划过路径留下一道3秒的冰墙
    public static readonly DASH_11 = 1000011;//元素湍流 扩大路径面积
    public static readonly DASH_12 = 1000012;//灵姿鬼步 冲刺期间无敌
    public static readonly DASH_13 = 1000013;//坚韧意志 缩短冲刺冷却
    public static readonly DASH_14 = 1000014;//移形换影 本体不冲刺而是幻影替代随后瞬移到幻影的位置

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
        this.talentList = new Array();
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