import DamageData from "./DamageData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class MonsterData{
    nameCn:string = '';//名字
    nameEn:string = '';
    resName:string = '';//资源名字
    chapter:number = 0;//章节，如果为0所有章节都会出现
    stageLevel:number = 0;//关卡等级，如果为0所有level都会出现
    movespeed:number = 0;//移动速度
    maxHealth:number=0;//最大生命值
    defence:number=0;//防御力
    attackPoint:number=0;//攻击力
    invisible:number=0;//是否隐身，发起攻击或者冲刺的时候现形,攻击结束以后1s再次隐身,隐身状态下可以被攻击而且现形
    remote:number=0;//是否远程大于0 远程会远离目标到一定范围
    melee:number=0;//是否近战大于0 近战会接近目标
    dash:number=0;//是否冲刺大于0 当距离够的时候会发起冲刺，往目标地点冲刺进行撞击
    disguise:number=0;//是否伪装大于0,数值为距离 伪装状态下不能移动和攻击，当接近的时候会恢复
    pos:cc.Vec2 = cc.v2(0,0);
    currentHealth:number=0;

    realDamge = 0;//真实伤害
    iceDamage = 0;//冰元素伤害
    iceDefence = 0;//冰元素抗性
    iceRate = 0;//冰元素几率
    fireDamage = 0;//火元素伤害
    fireDefence = 0;//火元素抗性
    fireRate = 0;//火元素几率
    lighteningDamage = 0;//雷元素伤害
    lighteningDefence = 0;//雷元素抗性
    lighteningRate = 0;//雷元素几率
    toxicDamage = 0;//毒元素伤害
    toxicDefence = 0;//毒元素抗性
    toxicRate = 0;//毒元素几率
    curseDamage = 0;//诅咒元素伤害
    curseDefence = 0;//诅咒元素抗性
    curseRate = 0;//诅咒元素几率

    updateHA(currentHealth:number,maxHealth:number,attackPoint:number){
        this.currentHealth = currentHealth;
        this.maxHealth = maxHealth;
        this.attackPoint = attackPoint;
    }
    public valueCopy(data:MonsterData):void{
        this.nameCn = data.nameCn;
        this.nameEn = data.nameEn;
        this.resName = data.resName;
        this.chapter = data.chapter;
        this.stageLevel = data.stageLevel;
        this.movespeed = data.movespeed?data.movespeed:0;
        this.maxHealth = data.maxHealth?data.maxHealth:0;
        this.currentHealth = data.currentHealth?data.currentHealth:0;
        this.attackPoint = data.attackPoint?data.attackPoint:0;
        this.defence = data.defence?data.defence:0;
        this.invisible = data.invisible?data.invisible:0;
        this.remote = data.remote?data.remote:0;
        this.melee = data.melee?data.melee:0;
        this.dash = data.dash?data.dash:0;
        this.pos = data.pos;
        this.disguise = data.disguise?data.disguise:0;

        this.realDamge = data.realDamge?data.realDamge:0;
        this.iceDamage = data.iceDamage?data.iceDamage:0;
        this.iceDefence = data.iceDefence?data.iceDefence:0;
        this.iceRate = data.iceRate?data.iceRate:0;
        this.fireDamage = data.fireDamage?data.fireDamage:0;
        this.fireDefence = data.fireDefence?data.fireDefence:0;
        this.fireRate = data.fireRate?data.fireRate:0;
        this.lighteningDamage = data.lighteningDamage?data.lighteningDamage:0;
        this.lighteningDefence = data.lighteningDefence?data.lighteningDefence:0;
        this.lighteningRate = data.lighteningRate?data.lighteningRate:0;
        this.toxicDamage = data.toxicDamage?data.toxicDamage:0;
        this.toxicDefence = data.toxicDefence?data.toxicDefence:0;
        this.toxicRate = data.toxicRate?data.toxicRate:0;
        this.curseDamage = data.curseDamage?data.curseDamage:0;
        this.curseDefence = data.curseDefence?data.curseDefence:0;
        this.curseRate = data.curseRate?data.curseRate:0;
    }
    public clone():MonsterData{
        let e = new MonsterData();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.resName = this.resName;
        e.chapter = this.chapter;
        e.stageLevel = this.stageLevel;
        e.movespeed = this.movespeed;
        e.maxHealth = this.maxHealth;
        e.currentHealth = this.currentHealth;
        e.attackPoint = this.attackPoint;
        e.defence = this.defence;
        e.invisible = this.invisible;
        e.remote = this.remote;
        e.melee = this.melee;
        e.dash = this.dash;
        e.pos = this.pos;
        e.disguise = this.disguise;

        e.realDamge = this.realDamge;
        e.iceDamage = this.iceDamage;
        e.iceDefence = this.iceDefence;
        e.iceRate = this.iceRate;
        e.fireDamage = this.fireDamage;
        e.fireDefence = this.fireDefence;
        e.fireRate = this.fireRate;
        e.lighteningDamage = this.lighteningDamage;
        e.lighteningDefence = this.lighteningDefence;
        e.lighteningRate = this.lighteningRate;
        e.toxicDamage = this.toxicDamage;
        e.toxicDefence = this.toxicDefence;
        e.toxicRate = this.toxicRate;
        e.curseDamage = this.curseDamage;
        e.curseDefence = this.curseDefence;
        e.curseRate = this.curseRate;
        return e;
    }
    getAttackPoint():DamageData{
        let dd = new DamageData();
        dd.realDamge = this.realDamge;
        dd.physicalDamage = this.attackPoint;
        dd.iceDamage = this.iceDamage;
        dd.fireDamage = this.fireDamage;
        dd.lighteningDamage = this.lighteningDamage;
        dd.toxicDamage = this.toxicDamage;
        dd.curseDamage = this.curseDamage;
        return dd;
    }
    //伤害减免
    getDamage(damageData:DamageData):DamageData{
        let finalDamageData = damageData.clone();
        let defence = this.defence;
        let defenceIce = this.iceDefence;
        let defenceFire = this.fireDefence;
        let defenceLightening = this.lighteningDefence;
        let defenceToxic = this.toxicDefence;
        let defenceCurse = this.curseDefence;
        //伤害=攻击*(1-(护甲*0.06)/(护甲*0.06+1))可以为负
        finalDamageData.physicalDamage = finalDamageData.physicalDamage*(1-defence*0.06/(defence*0.06+1));
        finalDamageData.iceDamage = finalDamageData.iceDamage*(1-defenceIce/100);
        finalDamageData.fireDamage = finalDamageData.fireDamage*(1-defenceFire/100);
        finalDamageData.lighteningDamage = finalDamageData.lighteningDamage*(1-defenceLightening/100);
        finalDamageData.toxicDamage = finalDamageData.toxicDamage*(1-defenceToxic/100);
        finalDamageData.curseDamage = finalDamageData.curseDamage*(1-defenceCurse/100);
        return finalDamageData;
    }
}
