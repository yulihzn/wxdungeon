import Skill from "../Utils/Skill";
import Player from "../Player";
import TalentData from "../Data/TalentData";
import DamageData from "../Data/DamageData";
import Actor from "../Base/Actor";
import Logic from "../Logic";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class Talent extends cc.Component {
    public static readonly DASH = '1000000';
    public static readonly SHIELD = '2000000';
    public static readonly MAGIC = '3000000';
    public static readonly ARCHER = '4000000';
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
    public static readonly MAGIC_10 = Talent.MAGIC + 10;//火焰精灵 1
    public static readonly MAGIC_11 = Talent.MAGIC + 11;//冰晶锥 1
    public static readonly MAGIC_12 = Talent.MAGIC + 12;//大冰晶柱 2
    public static readonly MAGIC_13 = Talent.MAGIC + 13;//冰晶护盾 1
    public static readonly MAGIC_14 = Talent.MAGIC + 14;//雷电球 1
    public static readonly MAGIC_15 = Talent.MAGIC + 15;//高压雷暴 1
    public static readonly MAGIC_16 = Talent.MAGIC + 16;//雷暴线圈 1

    public static readonly TALENT_000 = 'talent000';
    public static readonly TALENT_001 = 'talent001';
    public static readonly TALENT_002 = 'talent002';
    public static readonly TALENT_003 = 'talent003';
    public static readonly TALENT_004 = 'talent004';
    public static readonly TALENT_005 = 'talent005';
    public static readonly TALENT_006 = 'talent006';
    public static readonly TALENT_007 = 'talent007';
    public static readonly TALENT_008 = 'talent008';
    public static readonly TALENT_009 = 'talent009';
    public static readonly TALENT_010 = 'talent010';
    public static readonly TALENT_011 = 'talent011';
    public static readonly TALENT_012 = 'talent012';
    public static readonly TALENT_013 = 'talent013';
    public static readonly TALENT_014 = 'talent014';
    public static readonly TALENT_015 = 'talent015';
    public static readonly TALENT_016 = 'talent016';
    public static readonly TALENT_017 = 'talent017';
    public static readonly TALENT_018 = 'talent018';
    public static readonly TALENT_019 = 'talent019';

    talentSkill = new Skill();
    player: Player;
    passiveTalentList: TalentData[];
    activeTalentData:TalentData;
    hasTalentMap: { [key: string]: boolean } = {};
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
        this.activeTalentData = new TalentData();
        this.activeTalentData.valueCopy(Logic.talents[this.player.data.AvatarData.professionData.talent]);
    }
    /**加载被动技能列表 */
    loadPassiveList(passiveTalentList: TalentData[]) {
        this.passiveTalentList = new Array();
        this.hasTalentMap = {};
        for (let t of passiveTalentList) {
            let temp = new TalentData();
            temp.valueCopy(t);
            this.passiveTalentList.push(temp);
            this.hasTalentMap[temp.resName] = true;
        }
        this.changePerformance();
    }
    /**
     * 添加被动技能
     * @param resName 技能资源名
     */
    addPassiveTalent(resName: string) {
        let data = new TalentData();
        data.resName = resName;
        let hasit = false;
        for (let t of this.passiveTalentList) {
            if (resName == t.resName) {
                hasit = true;
            }
        }
        if (!hasit) {
            this.passiveTalentList.push(data);
            this.hasTalentMap[data.resName] = true;
            this.changePerformance();
            Logic.addTalent(data.resName);
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
    hashTalent(resName: string): boolean {
        return this.hasTalentMap[resName] && this.hasTalentMap[resName] == true;
    }

    abstract takeDamage(damageData: DamageData, actor?: Actor): void
}