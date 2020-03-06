import Random from "../Utils/Random";
import MonsterData from "../Data/MonsterData";

export default class MonsterRandomAttr {
    public static readonly ATTR_01 = 'attr_01';//命悬一线：怪物血量为1防御+50
    public static readonly ATTR_02 = 'attr_02';//致命打击：：怪物基础攻击加5
    public static readonly ATTR_03 = 'attr_03';//皮糙肉厚：怪物血量加5
    public static readonly ATTR_04 = 'attr_04';//体弱无力：怪物基础攻击变为1
    public static readonly ATTR_05 = 'attr_05';//步履蹒跚：怪物移动速度减100
    public static readonly ATTR_06 = 'attr_06';//健步如飞：怪物移动速度加100
    public static readonly ATTR_07 = 'attr_07';//闲庭信步：怪物近战攻击间隔延长2s
    public static readonly ATTR_08 = 'attr_08';//疯狗野狼：怪物近战攻击间隔缩短至1s
    public static readonly ATTR_09 = 'attr_09';//枪林弹雨：怪物远程攻击间隔缩短至1s（非瞄准类）
    public static readonly ATTR_10 = 'attr_10';//反应迟钝：怪物远程攻击间隔延长2s
    public static readonly ATTR_11 = 'attr_11';//双枪银弹：怪物远程额外发射一次子弹
    public static readonly ATTR_12 = 'attr_12';//强弩之末：怪物远程子弹速度-100
    public static readonly ATTR_13 = 'attr_13';//狙击猎人：怪物远程子弹速度+100
    public static readonly ATTR_14 = 'attr_14';//灵活闪步：怪物增加50%闪避
    public static readonly ATTR_15 = 'attr_15';//暗箭难防：怪物背后一击伤害+5
    public static readonly ATTR_16 = 'attr_16';//恶魔之吻：恶魔之力逃逸，生物们行踪飘忽不定起来。怪物拥有一个五秒cd的瞬移，如果是已经拥有瞬移的生物，瞬移cd降低至2s
    public static readonly ATTR_17 = 'attr_17';//冰霜雪人：怪物添加冰属性攻击几率为100%
    public static readonly ATTR_18 = 'attr_18';//炙火热炎：怪物添加火属性攻击几率为100%
    public static readonly ATTR_19 = 'attr_19';//雷嗔电怒：怪物添加雷属性攻击几率为100%
    public static readonly ATTR_20 = 'attr_20';//淬毒之牙：怪物添加毒属性攻击几率为100%
    public static readonly ATTR_21 = 'attr_21';//法老凝视：怪物添加诅咒属性攻击几率为100%
    public static readonly ATTR_22 = 'attr_22';//利爪尖牙：怪物添加流血属性攻击几率为100%
    public static readonly ATTR_23 = 'attr_23';//炸弹时间：怪物死亡自爆

    attrmap: { [key: string]: number } = {};

    constructor(){
        this.attrmap = {};
    }
    hasAttr(str:string):boolean{
        return this.attrmap[str]&&this.attrmap[str]>0;
    }
    addAttr(num:number):void{
        let s = num>9?`${num}`:`0${num}`;
        this.attrmap[`attr_${s}`] = 1;
    }
    removeAttr(num:number):void{
        let s = num>9?`${num}`:`0${num}`;
        this.attrmap[`attr_${s}`] = 0;
    }
    addRandomAttrs(count:number){
        this.attrmap = {}
        for(let i = 0;i <count;i++){
            this.addAttr(Random.getRandomNum(1,23));
        }
    }

    updateMonsterData(data:MonsterData):MonsterData{
        if(this.hasAttr(MonsterRandomAttr.ATTR_01)){
            data.Common.maxHealth = 1;
            data.currentHealth = 1;
            data.Common.defence+=50;
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_02)){
            data.Common.damageMin +=5;
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_03)){
            data.Common.maxHealth += 5;
            data.currentHealth += 5;
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_04)){
            data.Common.damageMin =1;
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_05)){
            data.Common.moveSpeed -= 100;
            if(data.Common.moveSpeed<0){
                data.Common.moveSpeed = 50;
            }
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_06)){
            data.Common.moveSpeed += 100;
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_07)){
            if(data.melee>0){
                data.melee += 2;
            }
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_08)){
            if(data.melee>0){
                data.melee = 1;
            }
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_09)){
            if(data.remote>0&&data.isLineAim<=0&&data.isArcAim<=0){
                data.remote = 1;
            }
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_10)){
            if(data.remote>0){
                data.remote+=2;
            }
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_11)){
            if(data.remote>0){
                data.bulletLineExNum+=1;
            }
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_12)){
            if(data.remote>0){
                data.bulletExSpeed = -100;
            }
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_13)){
            if(data.remote>0){
                data.bulletExSpeed = 100;
            }
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_14)){
            data.Common.dodge+=50;
            if(data.Common.dodge>60){
                data.Common.dodge = 60;
            }
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_15)){
            data.Common.damageBack = 5;
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_16)){
            if(data.blink>0){
                data.blink = 2;
            }else{
                data.blink = 5;
            }
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_17)){
            data.Common.iceDamage += 1;
            data.Common.iceRate = 100;
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_18)){
            data.Common.fireDamage += 1;
            data.Common.fireRate = 100;
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_19)){
            data.Common.lighteningDamage += 1;
            data.Common.lighteningRate = 100;
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_20)){
            data.Common.toxicDamage += 1;
            data.Common.toxicRate = 100;
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_21)){
            data.Common.curseDamage += 1;
            data.Common.curseRate = 100;
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_22)){
            data.Common.realDamage += 1;
            data.Common.realRate = 100;
        }
        if(this.hasAttr(MonsterRandomAttr.ATTR_23)){
            data.isBoom = 1;
        }
        return data;
    }
}