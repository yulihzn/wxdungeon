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
    remote:number=0;//是否远程 远程会远离目标到一定范围
    melee:number=0;//是否近战 近战会接近目标
    dash:number=0;//是否冲刺 当距离够的时候会发起冲刺，往目标地点冲刺进行撞击
    remoterate:number=0;//远程攻击概率0-100
    meleerate:number=0;//近战攻击概率0-100
    disguise:number=0;//是否伪装大于0,数值为距离 伪装状态下不能移动和攻击，当接近的时候会恢复
    pos:cc.Vec2 = cc.v2(0,0);
    currentHealth:number=0;
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
        this.remoterate = data.remoterate;
        this.meleerate = data.meleerate;
        this.disguise = data.disguise;
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
        e.remoterate = this.remoterate;
        e.meleerate = this.meleerate;
        e.disguise = this.disguise;
        return e;
    }
}
