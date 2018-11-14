import EquipmentData from "./EquipmentData";
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


export default class InventoryData {
    weapon:EquipmentData = new EquipmentData();
    helmet:EquipmentData = new EquipmentData();
    clothes:EquipmentData = new EquipmentData();
    trousers:EquipmentData = new EquipmentData();
    gloves:EquipmentData = new EquipmentData();
    shoes:EquipmentData = new EquipmentData();
    cloak:EquipmentData = new EquipmentData();
    //buffer效果
    buffer:EquipmentData = new EquipmentData();
    //初始速度300,最大速度600 最小速度为10
    getMoveSpeed(baseSpeed:number):number{
        let speed = 0;
        speed = this.weapon.moveSpeed+this.helmet.moveSpeed+this.clothes.moveSpeed
        +this.trousers.moveSpeed+this.gloves.moveSpeed+this.shoes.moveSpeed+this.cloak.moveSpeed+this.buffer.moveSpeed;
        if(speed>300){speed = 300}
        if(speed<-290){speed = -290}
        return baseSpeed+speed;
    }
    //初始延迟是300,最低延迟为0 最大400
    getAttackSpeed():number{
        let speed = 0;
        speed = this.weapon.attackSpeed+this.helmet.attackSpeed+this.clothes.attackSpeed
        +this.trousers.attackSpeed+this.gloves.attackSpeed+this.shoes.attackSpeed+this.cloak.attackSpeed+this.buffer.attackSpeed;
        return speed;
    }
    //获取最大最小攻击力
    getAttackPoint(baseAttackPoint:number):cc.Vec2{
        let attackPoint = cc.v2(baseAttackPoint,baseAttackPoint);
        attackPoint.x += this.weapon.damageMin+this.helmet.damageMin+this.clothes.damageMin
        +this.trousers.damageMin+this.gloves.damageMin+this.shoes.damageMin+this.cloak.damageMin+this.buffer.damageMin;
        attackPoint.y += this.weapon.damageMax+this.helmet.damageMax+this.clothes.damageMax
        +this.trousers.damageMax+this.gloves.damageMax+this.shoes.damageMax+this.cloak.damageMax+this.buffer.damageMax;
        return attackPoint;
    }
    //计算攻击的最终结果  
    //5% 6% 20% 1-0.95x0.94X0.8 = 0.16951
    getFinalAttackPoint(baseAttackPoint:number):DamageData{
        let dd = new DamageData();
        let attackPoint = this.getAttackPoint(baseAttackPoint);
        let chance = this.getCriticalStrikeRate();
        let attack = Math.random()>chance?attackPoint.x:attackPoint.x+attackPoint.y;
        if(attack < 0){
            attack = 0;
        }
        dd.physicalDamage = attack;
        dd.realDamge = this.getRealDamge();
        dd.iceDamage = this.getIceDamge();
        dd.fireDamage = this.getFireDamge();
        dd.lighteningDamage = this.getLighteningDamge();
        dd.toxicDamage = this.getToxicDamge();
        dd.curseDamage = this.getCurseDamge();
        return dd;
    }
    //获取暴击率
    getCriticalStrikeRate():number{
        let chance = 1-(1-this.weapon.criticalStrikeRate/100)*(1-this.helmet.criticalStrikeRate/100)
        *(1-this.clothes.criticalStrikeRate/100)*(1-this.trousers.criticalStrikeRate/100)
        *(1-this.gloves.criticalStrikeRate/100)*(1-this.shoes.criticalStrikeRate/100)*(1-this.buffer.criticalStrikeRate/100);
        if(chance<0){
            chance = 0;
        }
        return chance;
    }
    //伤害减免
    getDamage(damageData:DamageData):DamageData{
        let finalDamageData = damageData.clone();
        let defence = this.getDefence();
        let defenceIce = this.getIceDefence();
        let defenceFire = this.getFireDefence();
        let defenceLightening = this.getLighteningDefence();
        let defenceToxic = this.getToxicDefence();
        let defenceCurse = this.getCurseDefence();
        //伤害=攻击*(1-(护甲*0.06)/(护甲*0.06+1))可以为负
        finalDamageData.physicalDamage = finalDamageData.physicalDamage*(1-defence*0.06/(defence*0.06+1));
        finalDamageData.iceDamage = finalDamageData.iceDamage*(1-defenceIce/100);
        finalDamageData.fireDamage = finalDamageData.fireDamage*(1-defenceFire/100);
        finalDamageData.lighteningDamage = finalDamageData.lighteningDamage*(1-defenceLightening/100);
        finalDamageData.toxicDamage = finalDamageData.toxicDamage*(1-defenceToxic/100);
        finalDamageData.curseDamage = finalDamageData.curseDamage*(1-defenceCurse/100);
        return finalDamageData;
    }
    //闪避
    getDodge():number{
        let chance = 1-(1-this.weapon.dodge/100)*(1-this.helmet.dodge/100)
        *(1-this.clothes.dodge/100)*(1-this.trousers.dodge/100)
        *(1-this.gloves.dodge/100)*(1-this.shoes.dodge/100)*(1-this.cloak.dodge/100)*(1-this.buffer.dodge/100);
        if(chance < 0){
            chance = 0;
        }
        return chance;
    }
    //防御,可以为负数
    getDefence():number{
        let defence = this.weapon.defence+this.helmet.defence+this.clothes.defence
        +this.trousers.defence+this.gloves.defence+this.shoes.defence+this.cloak.defence+this.buffer.lifeRecovery;
        return defence;
    }
    getIceDefence():number{
        let defence = this.weapon.iceDefence+this.helmet.iceDefence+this.clothes.iceDefence
        +this.trousers.iceDefence+this.gloves.iceDefence+this.shoes.iceDefence+this.cloak.iceDefence+this.buffer.iceDefence;
        if(defence>100){
            defence = 100;
        }
        return defence;
    }
    getFireDefence():number{
        let defence = this.weapon.fireDefence+this.helmet.fireDefence+this.clothes.fireDefence
        +this.trousers.fireDefence+this.gloves.fireDefence+this.shoes.fireDefence+this.cloak.fireDefence+this.buffer.fireDefence;
        if(defence>100){
            defence = 100;
        }
        return defence;
    }
    getLighteningDefence():number{
        let defence = this.weapon.lighteningDefence+this.helmet.lighteningDefence+this.clothes.lighteningDefence
        +this.trousers.lighteningDefence+this.gloves.lighteningDefence+this.shoes.lighteningDefence+this.cloak.lighteningDefence+this.buffer.lighteningDefence;
        if(defence>100){
            defence = 100;
        }
        return defence;
    }
    getToxicDefence():number{
        let defence = this.weapon.toxicDefence+this.helmet.toxicDefence+this.clothes.toxicDefence
        +this.trousers.toxicDefence+this.gloves.toxicDefence+this.shoes.toxicDefence+this.cloak.toxicDefence+this.buffer.toxicDefence;
        if(defence>100){
            defence = 100;
        }
        return defence;
    }
    getCurseDefence():number{
        let defence = this.weapon.curseDefence+this.helmet.curseDefence+this.clothes.curseDefence
        +this.trousers.curseDefence+this.gloves.curseDefence+this.shoes.curseDefence+this.cloak.curseDefence+this.buffer.curseDefence;
        if(defence>100){
            defence = 100;
        }
        return defence;
    }
    getRealDamge():number{
        let damge = this.weapon.realDamge+this.helmet.realDamge+this.clothes.realDamge
        +this.trousers.realDamge+this.gloves.realDamge+this.shoes.realDamge+this.cloak.realDamge+this.buffer.realDamge;
        if(damge < 0){
            damge = 0;
        }
        return damge;
    }
    getIceDamge():number{
        let damge = this.weapon.iceDamage+this.helmet.iceDamage+this.clothes.iceDamage
        +this.trousers.iceDamage+this.gloves.iceDamage+this.shoes.iceDamage+this.cloak.iceDamage+this.buffer.iceDamage;
        if(damge < 0){
            damge = 0;
        }
        return damge;
    }
    getFireDamge():number{
        let damge = this.weapon.fireDamage+this.helmet.fireDamage+this.clothes.fireDamage
        +this.trousers.fireDamage+this.gloves.fireDamage+this.shoes.fireDamage+this.cloak.fireDamage+this.buffer.fireDamage;
        if(damge < 0){
            damge = 0;
        }
        return damge;
    }
    getLighteningDamge():number{
        let damge = this.weapon.lighteningDamage+this.helmet.lighteningDamage+this.clothes.lighteningDamage
        +this.trousers.lighteningDamage+this.gloves.lighteningDamage+this.shoes.lighteningDamage+this.cloak.lighteningDamage+this.buffer.lighteningDamage;
        if(damge < 0){
            damge = 0;
        }
        return damge;
    }
    getToxicDamge():number{
        let damge = this.weapon.toxicDamage+this.helmet.toxicDamage+this.clothes.toxicDamage
        +this.trousers.toxicDamage+this.gloves.toxicDamage+this.shoes.toxicDamage+this.cloak.toxicDamage+this.buffer.toxicDamage;
        if(damge < 0){
            damge = 0;
        }
        return damge;
    }
    getCurseDamge():number{
        let damge = this.weapon.curseDamage+this.helmet.curseDamage+this.clothes.curseDamage
        +this.trousers.curseDamage+this.gloves.curseDamage+this.shoes.curseDamage+this.cloak.curseDamage+this.buffer.curseDamage;
        if(damge < 0){
            damge = 0;
        }
        return damge;
    }
    getRealRate():number{
        let rate = this.weapon.realRate+this.helmet.realRate+this.clothes.realRate
        +this.trousers.realRate+this.gloves.realRate+this.shoes.realRate+this.cloak.realRate+this.buffer.realRate;
        rate = rate < 0?0:rate;
        rate = rate > 100?100:rate;
        return rate;
    }
    getIceRate():number{
        let rate = this.weapon.iceRate+this.helmet.iceRate+this.clothes.iceRate
        +this.trousers.iceRate+this.gloves.iceRate+this.shoes.iceRate+this.cloak.iceRate+this.buffer.iceRate;
        rate = rate < 0?0:rate;
        rate = rate > 100?100:rate;
        return rate;
    }
    getFireRate():number{
        let rate = this.weapon.fireRate+this.helmet.fireRate+this.clothes.fireRate
        +this.trousers.fireRate+this.gloves.fireRate+this.shoes.fireRate+this.cloak.fireRate+this.buffer.fireRate;
        rate = rate < 0?0:rate;
        rate = rate > 100?100:rate;
        return rate;
    }
    getLighteningRate():number{
        let rate = this.weapon.lighteningRate+this.helmet.lighteningRate+this.clothes.lighteningRate
        +this.trousers.lighteningRate+this.gloves.lighteningRate+this.shoes.lighteningRate+this.cloak.lighteningRate+this.buffer.lighteningRate;
        rate = rate < 0?0:rate;
        rate = rate > 100?100:rate;
        return rate;
    }
    getToxicRate():number{
        let rate = this.weapon.toxicRate+this.helmet.toxicRate+this.clothes.toxicRate
        +this.trousers.toxicRate+this.gloves.toxicRate+this.shoes.toxicRate+this.cloak.toxicRate+this.buffer.toxicRate;
        rate = rate < 0?0:rate;
        rate = rate > 100?100:rate;
        return rate;
    }
    getCurseRate():number{
        let rate = this.weapon.curseRate+this.helmet.curseRate+this.clothes.curseRate
        +this.trousers.curseRate+this.gloves.curseRate+this.shoes.curseRate+this.cloak.curseRate+this.buffer.curseRate;
        rate = rate < 0?0:rate;
        rate = rate > 100?100:rate;
        return rate;
    }
    //30s生命恢复不可以为负数(加入状态以后考虑拿掉)
    getRecovery():number{
        let recovery = this.weapon.lifeRecovery+this.helmet.lifeRecovery+this.clothes.lifeRecovery
        +this.trousers.lifeRecovery+this.gloves.lifeRecovery+this.shoes.lifeRecovery+this.cloak.lifeRecovery+this.buffer.lifeRecovery;
        return recovery>0?recovery:0;
    }
    //吸血默认是1暴击时吸血翻倍
    getLifeDrain():number{
        let chance = this.getCriticalStrikeRate();
        let drainRate = 1-(1-this.weapon.lifeDrain/100)*(1-this.helmet.lifeDrain/100)
        *(1-this.clothes.lifeDrain/100)*(1-this.trousers.lifeDrain/100)
        *(1-this.gloves.lifeDrain/100)*(1-this.shoes.lifeDrain/100)*(1-this.cloak.lifeDrain/100)*(1-this.buffer.lifeDrain/100);
        let drain = 0;
        if(Math.random()<drainRate){
            drain = 1;
            if(Math.random()<chance){
                drain = 2;
            }
        }
        return drain;
    }

    //生命值
    getHealth(health:cc.Vec2,baseMaxHealth:number):cc.Vec2{
        let rate = 1;
        let maxHealth = baseMaxHealth + this.weapon.health+this.helmet.health+this.clothes.health
        +this.trousers.health+this.gloves.health+this.shoes.health +this.cloak.health+this.buffer.health;
        if(maxHealth>0){
            rate = health.x/maxHealth;
        }else{
            return cc.v2(1,1);
        }
        return cc.v2(maxHealth*rate,maxHealth);
    }

}
