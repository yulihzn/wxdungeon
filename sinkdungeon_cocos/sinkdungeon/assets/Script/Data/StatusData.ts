// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 状态
 * 负面：冰冻、燃烧、减速、中毒、诅咒、流血、道具
 * 正面：祝福、道具、天赋
 */
export default class StatusData {
    statusType: number = 0;//状态类型
    nameCn: string = '';
    nameEn: string = '';
    duration: number = 0;//持续时间
    desc: string = '';

    physicalDamageDirect: number = 0;//瞬间伤害
    physicalDamageOvertime: number = 0;//持续伤害
    physicalDamageDecrease: number = 0;//攻击上限降低
    defence: number = 0;//物理防御

    missRate: number = 0;//攻击落空几率
    criticalStrikeRate: number = 0;//暴击率
    lifeDrain: number = 0;//吸血
    lifeRecovery: number = 0;//回复
    moveSpeed: number = 0;//移动速度
    attackSpeed: number = 0;//攻击速度
    dodge: number = 0;//闪避
    maxHealth: number = 0;//最大生命上限，最低扣到1

    iceDamageDirect = 0;//瞬间冰元素伤害
    iceDamageOvertime = 0;//持续冰元素伤害
    iceDamageDecrease = 0;//冰元素攻击上限降低
    iceDefence = 0;//冰元素抗性
    iceRate = 0;//冰元素释放几率

    fireDamageDirect = 0;//瞬间火元素伤害
    fireDamageOvertime = 0;//火元素伤害
    fireDamageDecrease = 0;//火元素伤害
    fireDefence = 0;//火元素抗性
    fireRate = 0;//火元素释放几率

    lighteningDamageDirect = 0;//瞬间雷元素伤害
    lighteningOvertime = 0;//雷元素伤害
    lighteningDamageDecrease = 0;//雷元素伤害
    lighteningDefence = 0;//雷元素抗性
    lighteningRate = 0;//雷元素释放几率

    toxicDamageDirect = 0;//瞬间毒元素伤害
    toxicDamageOvertime = 0;//毒元素伤害
    toxicDamageDecrease = 0;//毒元素伤害
    toxicDefence = 0;//毒元素抗性
    toxicRate = 0;//毒元素释放几率

    curseDamageDirect = 0;//瞬间诅咒元素伤害
    curseDamageOvertime = 0;//诅咒元素伤害
    curseDamageDecrease = 0;//诅咒元素伤害
    curseDefence = 0;//诅咒元素抗性
    curseRate = 0;//诅咒元素释放几率

    public valueCopy(data: StatusData): void {
        this.nameCn = data.nameCn ? data.nameCn : this.nameCn;
        this.nameEn = data.nameEn;
        this.statusType = data.statusType;
        this.duration = data.duration;
        this.desc = data.desc;
        this.physicalDamageDirect = data.physicalDamageDirect;
        this.physicalDamageOvertime = data.physicalDamageOvertime;
        this.physicalDamageDecrease = data.physicalDamageDecrease;
        this.defence = data.defence;
        this.missRate = data.missRate;
        this.criticalStrikeRate = data.criticalStrikeRate;
        this.lifeDrain = data.lifeDrain;
        this.lifeRecovery = data.lifeRecovery;
        this.moveSpeed = data.moveSpeed;
        this.attackSpeed = data.attackSpeed;
        this.dodge = data.dodge;
        this.maxHealth = data.maxHealth;
        this.iceDamageDirect = data.iceDamageDirect;
        this.iceDamageOvertime = data.iceDamageOvertime;
        this.iceDamageDecrease = data.iceDamageDecrease;
        this.iceDefence = data.iceDefence;
        this.iceRate = data.iceRate;
        this.fireDamageDirect = data.fireDamageDirect;
        this.fireDamageOvertime = data.fireDamageOvertime;
        this.fireDamageDecrease = data.fireDamageDecrease;
        this.fireDefence = data.fireDefence;
        this.fireRate = data.fireRate;
        this.lighteningDamageDirect = data.lighteningDamageDirect;
        this.lighteningOvertime = data.lighteningOvertime;
        this.lighteningDamageDecrease = data.lighteningDamageDecrease;
        this.lighteningDefence = data.lighteningDefence;
        this.lighteningRate = data.lighteningRate;
        this.toxicDamageDirect = data.toxicDamageDirect;
        this.toxicDamageOvertime = data.toxicDamageOvertime;
        this.toxicDamageDecrease = data.toxicDamageDecrease;
        this.toxicDefence = data.toxicDefence;
        this.toxicRate = data.toxicRate;
        this.curseDamageDirect = data.curseDamageDirect;
        this.curseDamageOvertime = data.curseDamageOvertime;
        this.curseDamageDecrease = data.curseDamageDecrease;
        this.curseDefence = data.curseDefence;
        this.curseRate = data.curseRate;
    }
    public clone(): StatusData {
        let e = new StatusData();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.statusType = this.statusType;
        e.duration = this.duration;
        e.desc = this.desc;
        e.physicalDamageDirect = this.physicalDamageDirect;
        e.physicalDamageOvertime = this.physicalDamageOvertime;
        e.physicalDamageDecrease = this.physicalDamageDecrease;
        e.defence = this.defence;
        e.missRate = this.missRate;
        e.criticalStrikeRate = this.criticalStrikeRate;
        e.lifeDrain = this.lifeDrain;
        e.lifeRecovery = this.lifeRecovery;
        e.moveSpeed = this.moveSpeed;
        e.attackSpeed = this.attackSpeed;
        e.dodge = this.dodge;
        e.maxHealth = this.maxHealth;
        e.iceDamageDirect = this.iceDamageDirect;
        e.iceDamageOvertime = this.iceDamageOvertime;
        e.iceDamageDecrease = this.iceDamageDecrease;
        e.iceDefence = this.iceDefence;
        e.iceRate = this.iceRate;
        e.fireDamageDirect = this.fireDamageDirect;
        e.fireDamageOvertime = this.fireDamageOvertime;
        e.fireDamageDecrease = this.fireDamageDecrease;
        e.fireDefence = this.fireDefence;
        e.fireRate = this.fireRate;
        e.lighteningDamageDirect = this.lighteningDamageDirect;
        e.lighteningOvertime = this.lighteningOvertime;
        e.lighteningDamageDecrease = this.lighteningDamageDecrease;
        e.lighteningDefence = this.lighteningDefence;
        e.lighteningRate = this.lighteningRate;
        e.toxicDamageDirect = this.toxicDamageDirect;
        e.toxicDamageOvertime = this.toxicDamageOvertime;
        e.toxicDamageDecrease = this.toxicDamageDecrease;
        e.toxicDefence = this.toxicDefence;
        e.toxicRate = this.toxicRate;
        e.curseDamageDirect = this.curseDamageDirect;
        e.curseDamageOvertime = this.curseDamageOvertime;
        e.curseDamageDecrease = this.curseDamageDecrease;
        e.curseDefence = this.curseDefence;
        e.curseRate = this.curseRate;
        return e;
    }
}