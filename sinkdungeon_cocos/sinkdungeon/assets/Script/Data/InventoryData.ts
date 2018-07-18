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

const {ccclass, property} = cc._decorator;

@ccclass
export default class InventoryData {
    weapon:EquipmentData = new EquipmentData();
    helmet:EquipmentData = new EquipmentData();
    clothes:EquipmentData = new EquipmentData();
    trousers:EquipmentData = new EquipmentData();
    gloves:EquipmentData = new EquipmentData();
    shoes:EquipmentData = new EquipmentData();
    //初始速度300,最大速度600 跨度300
    getMoveSpeed(baseSpeed:number):number{
        let speed = 0;
        speed = this.weapon.moveSpeed+this.helmet.moveSpeed+this.clothes.moveSpeed
        +this.trousers.moveSpeed+this.gloves.moveSpeed+this.shoes.moveSpeed;
        if(speed>300){speed = 300}
        return baseSpeed+speed;
    }
    //初始延迟是500,最低延迟为100 最大400
    getAttackSpeed():number{
        let speed = 0;
        speed = this.weapon.attackSpeed+this.helmet.attackSpeed+this.clothes.attackSpeed
        +this.trousers.attackSpeed+this.gloves.attackSpeed+this.shoes.attackSpeed;
        if(speed>400){speed = 400}
        return 500-speed;
    }
    //获取最大最小攻击力
    getAttackPoint(baseAttackPoint:number):cc.Vec2{
        let attackPoint = cc.v2(baseAttackPoint,baseAttackPoint);
        attackPoint.x += this.weapon.damageMin+this.helmet.damageMin+this.clothes.damageMin
        +this.trousers.damageMin+this.gloves.damageMin+this.shoes.damageMin;
        attackPoint.y += this.weapon.damageMax+this.helmet.damageMax+this.clothes.damageMax
        +this.trousers.damageMax+this.gloves.damageMax+this.shoes.damageMax;
        return attackPoint;
    }
    //计算攻击的最终结果  
    //5% 6% 20% 1-0.95x0.94X0.8 = 0.16951
    getFinalAttackPoint(baseAttackPoint:number):number{
        let attackPoint = this.getAttackPoint(baseAttackPoint);
        let chance = this.getCriticalStrikeRate();
        return Math.random()>chance?attackPoint.x:attackPoint.y;
    }
    //获取暴击率
    getCriticalStrikeRate():number{
        let chance = 1-(1-this.weapon.criticalStrikeRate/100)*(1-this.helmet.criticalStrikeRate/100)
        *(1-this.clothes.criticalStrikeRate/100)*(1-this.trousers.criticalStrikeRate/100)
        *(1-this.gloves.criticalStrikeRate/100)*(1-this.shoes.criticalStrikeRate/100);
        return chance;
    }
    //伤害减免
    getDamage(damage:number):number{
        let finalDamage = damage;
        let defence = this.getDefence();
        //伤害=攻击*(1-(护甲*0.06)/(护甲*0.06+1))
        if(defence>0){
            finalDamage = finalDamage*(1-defence*0.06/(defence*0.06+1));
        }
        return finalDamage;
    }
    //闪避
    getDodge():number{
        let chance = 1-(1-this.weapon.dodge/100)*(1-this.helmet.dodge/100)
        *(1-this.clothes.dodge/100)*(1-this.trousers.dodge/100)
        *(1-this.gloves.dodge/100)*(1-this.shoes.dodge/100);
        return chance;
    }
    //防御
    getDefence():number{
        let defence = this.weapon.defence+this.helmet.defence+this.clothes.defence
        +this.trousers.defence+this.gloves.defence+this.shoes.defence;
        return defence;
    }
    //生命恢复
    getRecovery():number{
        let recovery = this.weapon.lifeRecovery+this.helmet.lifeRecovery+this.clothes.lifeRecovery
        +this.trousers.lifeRecovery+this.gloves.lifeRecovery+this.shoes.lifeRecovery;
        return recovery;
    }
    //暴击时取最大攻击
    getLifeDrain(baseAttackPoint):number{
        let attackPoint = this.getAttackPoint(baseAttackPoint);
        let chance = this.getCriticalStrikeRate();
        let drainRate = 1-(1-this.weapon.lifeDrain/100)*(1-this.helmet.lifeDrain/100)
        *(1-this.clothes.lifeDrain/100)*(1-this.trousers.lifeDrain/100)
        *(1-this.gloves.lifeDrain/100)*(1-this.shoes.lifeDrain/100);
        return Math.random()>chance?attackPoint.x*drainRate:attackPoint.y*drainRate;
    }

    //生命值
    getHealth(health:cc.Vec2,baseMaxHealth:number):cc.Vec2{
        let rate = 1;
        if(health.y>0){
            rate = health.x/health.y;
        }
        let maxHealth = baseMaxHealth + this.weapon.health+this.helmet.health+this.clothes.health
        +this.trousers.health+this.gloves.health+this.shoes.health;
        return cc.v2(maxHealth*rate,maxHealth);
    }
}
