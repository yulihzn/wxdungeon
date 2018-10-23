import EquipmentData from "./EquipmentData";

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
        if(speed>300){speed = 300}
        if(speed<-300){speed = -300}
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
    getFinalAttackPoint(baseAttackPoint:number):number{
        let attackPoint = this.getAttackPoint(baseAttackPoint);
        let chance = this.getCriticalStrikeRate();
        let attack = Math.random()>chance?attackPoint.x:attackPoint.x+attackPoint.y;
        if(attack < 0){
            attack = 0;
        }
        return attack;
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
    getDamage(damage:number):number{
        let finalDamage = damage;
        let defence = this.getDefence();
        //伤害=攻击*(1-(护甲*0.06)/(护甲*0.06+1))可以为负
        finalDamage = finalDamage*(1-defence*0.06/(defence*0.06+1));
        return finalDamage;
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
    //30s生命恢复可以为负数
    getRecovery():number{
        let recovery = this.weapon.lifeRecovery+this.helmet.lifeRecovery+this.clothes.lifeRecovery
        +this.trousers.lifeRecovery+this.gloves.lifeRecovery+this.shoes.lifeRecovery+this.cloak.lifeRecovery+this.buffer.lifeRecovery;
        return recovery;
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
