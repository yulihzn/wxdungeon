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
    attackPoint:number=0;//攻击力
    invisible:number=0;//是否隐身，发起攻击或者冲刺的时候现形,攻击结束以后1s再次隐身,隐身状态下可以被攻击而且现形
    remote:number=0;//是否远程大于0 远程会远离目标到一定范围
    melee:number=0;//是否近战大于0 近战会接近目标
    dash:number=0;//是否冲刺大于0 当距离够的时候会发起冲刺，往目标地点冲刺进行撞击
    disguise:number=0;//是否伪装大于0,数值为距离 伪装状态下不能移动和攻击，当接近的时候会恢复
    pos:cc.Vec2 = cc.v2(0,0);
    currentHealth:number=0;

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
        this.movespeed = data.movespeed;
        this.maxHealth = data.maxHealth;
        this.currentHealth = data.currentHealth;
        this.attackPoint = data.attackPoint;
        this.invisible = data.invisible;
        this.remote = data.remote;
        this.melee = data.melee;
        this.dash = data.dash;
        this.pos = data.pos;
        this.disguise = data.disguise;

        this.iceDamage = data.iceDamage;
        this.iceDefence = data.iceDefence;
        this.iceRate = data.iceRate;
        this.fireDamage = data.fireDamage;
        this.fireDefence = data.fireDefence;
        this.fireRate = data.fireRate;
        this.lighteningDamage = data.lighteningDamage;
        this.lighteningDefence = data.lighteningDefence;
        this.lighteningRate = data.lighteningRate;
        this.toxicDamage = data.toxicDamage;
        this.toxicDefence = data.toxicDefence;
        this.toxicRate = data.toxicRate;
        this.curseDamage = data.curseDamage;
        this.curseDefence = data.curseDefence;
        this.curseRate = data.curseRate;
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
        e.invisible = this.invisible;
        e.remote = this.remote;
        e.melee = this.melee;
        e.dash = this.dash;
        e.pos = this.pos;
        e.disguise = this.disguise;

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
}
