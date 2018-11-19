import EquipmentData from "../Data/EquipmentData";
import DamageData from "../Data/DamageData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class InventoryManager {
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
    getMoveSpeed():number{
        let speed = 0;
        speed = this.weapon.moveSpeed+this.helmet.moveSpeed+this.clothes.moveSpeed
        +this.trousers.moveSpeed+this.gloves.moveSpeed+this.shoes.moveSpeed+this.cloak.moveSpeed+this.buffer.moveSpeed;
        return speed;
    }
    //初始延迟是300,最低延迟为0 最大3000
    getAttackSpeed():number{
        let speed = 0;
        speed = this.weapon.attackSpeed+this.helmet.attackSpeed+this.clothes.attackSpeed
        +this.trousers.attackSpeed+this.gloves.attackSpeed+this.shoes.attackSpeed+this.cloak.attackSpeed+this.buffer.attackSpeed;
        return speed;
    }
    //获取最大最小攻击力
    getAttackPoint():cc.Vec2{
        let attackPoint = cc.v2(0,0);
        attackPoint.x += this.weapon.damageMin+this.helmet.damageMin+this.clothes.damageMin
        +this.trousers.damageMin+this.gloves.damageMin+this.shoes.damageMin+this.cloak.damageMin+this.buffer.damageMin;
        attackPoint.y += this.weapon.damageMax+this.helmet.damageMax+this.clothes.damageMax
        +this.trousers.damageMax+this.gloves.damageMax+this.shoes.damageMax+this.cloak.damageMax+this.buffer.damageMax;
        return attackPoint;
    }
    
    //获取暴击率
    getCriticalStrikeRate():number{
        return 1-(1-this.weapon.criticalStrikeRate/100)*(1-this.helmet.criticalStrikeRate/100)
        *(1-this.clothes.criticalStrikeRate/100)*(1-this.trousers.criticalStrikeRate/100)
        *(1-this.gloves.criticalStrikeRate/100)*(1-this.shoes.criticalStrikeRate/100)*(1-this.buffer.criticalStrikeRate/100);
    }
    
    //闪避
    getDodge():number{
        return 1-(1-this.weapon.dodge/100)*(1-this.helmet.dodge/100)
        *(1-this.clothes.dodge/100)*(1-this.trousers.dodge/100)
        *(1-this.gloves.dodge/100)*(1-this.shoes.dodge/100)*(1-this.cloak.dodge/100)*(1-this.buffer.dodge/100);
    }
    //防御,可以为负数
    getDefence():number{
        let defence = this.weapon.defence+this.helmet.defence+this.clothes.defence
        +this.trousers.defence+this.gloves.defence+this.shoes.defence+this.cloak.defence+this.buffer.defence;
        return defence;
    }
    getIceDefence():number{
        return this.weapon.iceDefence+this.helmet.iceDefence+this.clothes.iceDefence
        +this.trousers.iceDefence+this.gloves.iceDefence+this.shoes.iceDefence+this.cloak.iceDefence+this.buffer.iceDefence;
    }
    getFireDefence():number{
        return this.weapon.fireDefence+this.helmet.fireDefence+this.clothes.fireDefence
        +this.trousers.fireDefence+this.gloves.fireDefence+this.shoes.fireDefence+this.cloak.fireDefence+this.buffer.fireDefence;
    }
    getLighteningDefence():number{
        return this.weapon.lighteningDefence+this.helmet.lighteningDefence+this.clothes.lighteningDefence
        +this.trousers.lighteningDefence+this.gloves.lighteningDefence+this.shoes.lighteningDefence+this.cloak.lighteningDefence+this.buffer.lighteningDefence;
    }
    getToxicDefence():number{
        return this.weapon.toxicDefence+this.helmet.toxicDefence+this.clothes.toxicDefence
        +this.trousers.toxicDefence+this.gloves.toxicDefence+this.shoes.toxicDefence+this.cloak.toxicDefence+this.buffer.toxicDefence;
    }
    getCurseDefence():number{
        return this.weapon.curseDefence+this.helmet.curseDefence+this.clothes.curseDefence
        +this.trousers.curseDefence+this.gloves.curseDefence+this.shoes.curseDefence+this.cloak.curseDefence+this.buffer.curseDefence;
    }
    getRealDamage():number{
        return this.weapon.realDamage+this.helmet.realDamage+this.clothes.realDamage
        +this.trousers.realDamage+this.gloves.realDamage+this.shoes.realDamage+this.cloak.realDamage+this.buffer.realDamage;
    }
    getIceDamage():number{
        return this.weapon.iceDamage+this.helmet.iceDamage+this.clothes.iceDamage
        +this.trousers.iceDamage+this.gloves.iceDamage+this.shoes.iceDamage+this.cloak.iceDamage+this.buffer.iceDamage;
    }
    getFireDamage():number{
        return this.weapon.fireDamage+this.helmet.fireDamage+this.clothes.fireDamage
        +this.trousers.fireDamage+this.gloves.fireDamage+this.shoes.fireDamage+this.cloak.fireDamage+this.buffer.fireDamage;
    }
    getLighteningDamage():number{
        return this.weapon.lighteningDamage+this.helmet.lighteningDamage+this.clothes.lighteningDamage
        +this.trousers.lighteningDamage+this.gloves.lighteningDamage+this.shoes.lighteningDamage+this.cloak.lighteningDamage+this.buffer.lighteningDamage;
    }
    getToxicDamage():number{
        return this.weapon.toxicDamage+this.helmet.toxicDamage+this.clothes.toxicDamage
        +this.trousers.toxicDamage+this.gloves.toxicDamage+this.shoes.toxicDamage+this.cloak.toxicDamage+this.buffer.toxicDamage;
    }
    getCurseDamage():number{
        return this.weapon.curseDamage+this.helmet.curseDamage+this.clothes.curseDamage
        +this.trousers.curseDamage+this.gloves.curseDamage+this.shoes.curseDamage+this.cloak.curseDamage+this.buffer.curseDamage;
    }
    getRealRate():number{
        return this.weapon.realRate+this.helmet.realRate+this.clothes.realRate
        +this.trousers.realRate+this.gloves.realRate+this.shoes.realRate+this.cloak.realRate+this.buffer.realRate;
    }
    getIceRate():number{
        return this.weapon.iceRate+this.helmet.iceRate+this.clothes.iceRate
        +this.trousers.iceRate+this.gloves.iceRate+this.shoes.iceRate+this.cloak.iceRate+this.buffer.iceRate;
    }
    getFireRate():number{
        return this.weapon.fireRate+this.helmet.fireRate+this.clothes.fireRate
        +this.trousers.fireRate+this.gloves.fireRate+this.shoes.fireRate+this.cloak.fireRate+this.buffer.fireRate;
    }
    getLighteningRate():number{
        return this.weapon.lighteningRate+this.helmet.lighteningRate+this.clothes.lighteningRate
        +this.trousers.lighteningRate+this.gloves.lighteningRate+this.shoes.lighteningRate+this.cloak.lighteningRate+this.buffer.lighteningRate;
    }
    getToxicRate():number{
        return this.weapon.toxicRate+this.helmet.toxicRate+this.clothes.toxicRate
        +this.trousers.toxicRate+this.gloves.toxicRate+this.shoes.toxicRate+this.cloak.toxicRate+this.buffer.toxicRate;
    }
    getCurseRate():number{
        return this.weapon.curseRate+this.helmet.curseRate+this.clothes.curseRate
        +this.trousers.curseRate+this.gloves.curseRate+this.shoes.curseRate+this.cloak.curseRate+this.buffer.curseRate;
    }
    //30s生命恢复不可以为负数(加入状态以后考虑拿掉)
    getLifeRecovery():number{
        return this.weapon.lifeRecovery+this.helmet.lifeRecovery+this.clothes.lifeRecovery
        +this.trousers.lifeRecovery+this.gloves.lifeRecovery+this.shoes.lifeRecovery+this.cloak.lifeRecovery+this.buffer.lifeRecovery;
    }
    getLifeDrainRate():number{
        return 1-(1-this.weapon.lifeDrain/100)*(1-this.helmet.lifeDrain/100)
        *(1-this.clothes.lifeDrain/100)*(1-this.trousers.lifeDrain/100)
        *(1-this.gloves.lifeDrain/100)*(1-this.shoes.lifeDrain/100)*(1-this.cloak.lifeDrain/100)*(1-this.buffer.lifeDrain/100);
        
    }

    //生命值
    getHealth():number{
        return this.weapon.health+this.helmet.health+this.clothes.health
        +this.trousers.health+this.gloves.health+this.shoes.health +this.cloak.health+this.buffer.health;;
    }

    getTotalEquipmentData():EquipmentData{
        let e = new EquipmentData();
        e.damageMin = this.getAttackPoint().x;
        e.damageMax = this.getAttackPoint().y;
        e.criticalStrikeRate = this.getCriticalStrikeRate();
        e.defence = this.getDefence();
        e.lifeDrain = this.getLifeDrainRate();
        e.lifeRecovery = this.getLifeRecovery();
        e.moveSpeed = this.getMoveSpeed();
        e.attackSpeed = this.getAttackSpeed();
        e.dodge = this.getDodge();
        e.health = this.getHealth();
        e.realDamage = this.getRealDamage();
        e.realRate = this.getRealRate();
        e.iceDamage = this.getIceDamage();
        e.iceDefence = this.getIceDefence();
        e.iceRate = this.getIceRate();
        e.fireDamage = this.getFireDamage();
        e.fireDefence = this.getFireDefence();
        e.fireRate = this.getFireRate();
        e.lighteningDamage = this.getLighteningDamage();
        e.lighteningDefence = this.getLighteningDefence();
        e.lighteningRate = this.getLighteningRate();
        e.toxicDamage = this.getToxicDamage();
        e.toxicDefence = this.getToxicDefence();
        e.toxicRate = this.getToxicRate();
        e.curseDamage = this.getCurseDamage();
        e.curseDefence = this.getCurseDefence();
        e.curseRate = this.getCurseRate();
        return e;
    }
}
