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
    list:EquipmentData[] = [];
   
    constructor(){
        this.list = [this.weapon,this.helmet,this.clothes,this.trousers,this.gloves,this.shoes,this.cloak,this.buffer];
    }
    //初始速度300,最大速度600 最小速度为10
    getMoveSpeed():number{
        let speed = 0;
        for(let data of this.list){
            speed += data.Common.moveSpeed;
        }
        return speed;
    }
    //初始延迟是300,最低延迟为0 最大3000
    getAttackSpeed():number{
        let speed = 0;
        for(let data of this.list){
            speed += data.Common.attackSpeed;
        }
        return speed;
    }
    //获取最大最小攻击力
    getAttackPoint():cc.Vec2{
        let attackPoint = cc.v2(0,0);
        for(let data of this.list){
            attackPoint.x += data.Common.damageMin;
            attackPoint.y += data.Common.damageMax;
        }
        return attackPoint;
    }
    
    //获取暴击率
    getCriticalStrikeRate():number{
        let rate = 1;
        for(let data of this.list){
            rate *= (1-data.Common.criticalStrikeRate/100);
        }
        return 1-rate;
    }
    
    //闪避
    getDodge():number{
        let rate = 1;
        for(let data of this.list){
            rate *= (1-data.Common.dodge/100);
        }
        return 1-rate;
    }
    //防御,可以为负数
    getDefence():number{
        let defence = 0;
        for(let data of this.list){
            defence += data.Common.defence;
        }
        return defence;
    }
    getIceDefence():number{
        let defence = 0;
        for(let data of this.list){
            defence += data.Common.iceDefence;
        }
        return defence;
    }
    getFireDefence():number{
        let defence = 0;
        for(let data of this.list){
            defence += data.Common.fireDefence;
        }
        return defence;
    }
    getLighteningDefence():number{
        let defence = 0;
        for(let data of this.list){
            defence += data.Common.lighteningDefence;
        }
        return defence;
    }
    getToxicDefence():number{
        let defence = 0;
        for(let data of this.list){
            defence += data.Common.toxicDefence;
        }
        return defence;
    }
    getCurseDefence():number{
        let defence = 0;
        for(let data of this.list){
            defence += data.Common.curseDefence;
        }
        return defence;
    }
    getRealDamage():number{
        let damage = 0;
        for(let data of this.list){
            damage += data.Common.realDamage;
        }
        return damage;
    }
    getIceDamage():number{
        let damage = 0;
        for(let data of this.list){
            damage += data.Common.iceDamage;
        }
        return damage;
    }
    getFireDamage():number{
        let damage = 0;
        for(let data of this.list){
            damage += data.Common.fireDamage;
        }
        return damage;
    }
    getLighteningDamage():number{
        let damage = 0;
        for(let data of this.list){
            damage += data.Common.lighteningDamage;
        }
        return damage;
    }
    getToxicDamage():number{
        let damage = 0;
        for(let data of this.list){
            damage += data.Common.toxicDamage;
        }
        return damage;
    }
    getCurseDamage():number{
        let damage = 0;
        for(let data of this.list){
            damage += data.Common.curseDamage;
        }
        return damage;
    }
    getRealRate():number{
        let rate = 0;
        for(let data of this.list){
            rate += data.Common.realRate;
        }
        return rate;
    }
    getIceRate():number{
        let rate = 0;
        for(let data of this.list){
            rate += data.Common.iceRate;
        }
        return rate;
    }
    getFireRate():number{
        let rate = 0;
        for(let data of this.list){
            rate += data.Common.fireRate;
        }
        return rate;
    }
    getLighteningRate():number{
        let rate = 0;
        for(let data of this.list){
            rate += data.Common.lighteningRate;
        }
        return rate;
    }
    getToxicRate():number{
        let rate = 0;
        for(let data of this.list){
            rate += data.Common.toxicRate;
        }
        return rate;
    }
    getCurseRate():number{
        let rate = 0;
        for(let data of this.list){
            rate += data.Common.curseRate;
        }
        return rate;
    }
    //30s生命恢复不可以为负数(加入状态以后考虑拿掉)
    getLifeRecovery():number{
        let lifeRecovery = 0;
        for(let data of this.list){
            lifeRecovery += data.Common.lifeRecovery;
        }
        return lifeRecovery;
    }
    getLifeDrainRate():number{
        let rate = 1;
        for(let data of this.list){
            rate *= (1-data.Common.lifeDrain/100);
        }
        return 1-rate;
        
    }

    //生命值
    getHealth():number{
        let health = 0;
        for(let data of this.list){
            health += data.Common.maxHealth;
        }
        return health;
    }

    getTotalEquipmentData():EquipmentData{
        let e = new EquipmentData();
        e.Common.damageMin = this.getAttackPoint().x;
        e.Common.damageMax = this.getAttackPoint().y;
        e.Common.criticalStrikeRate = this.getCriticalStrikeRate();
        e.Common.defence = this.getDefence();
        e.Common.lifeDrain = this.getLifeDrainRate();
        e.Common.lifeRecovery = this.getLifeRecovery();
        e.Common.moveSpeed = this.getMoveSpeed();
        e.Common.attackSpeed = this.getAttackSpeed();
        e.Common.dodge = this.getDodge();
        e.Common.maxHealth = this.getHealth();
        e.Common.realDamage = this.getRealDamage();
        e.Common.realRate = this.getRealRate();
        e.Common.iceDamage = this.getIceDamage();
        e.Common.iceDefence = this.getIceDefence();
        e.Common.iceRate = this.getIceRate();
        e.Common.fireDamage = this.getFireDamage();
        e.Common.fireDefence = this.getFireDefence();
        e.Common.fireRate = this.getFireRate();
        e.Common.lighteningDamage = this.getLighteningDamage();
        e.Common.lighteningDefence = this.getLighteningDefence();
        e.Common.lighteningRate = this.getLighteningRate();
        e.Common.toxicDamage = this.getToxicDamage();
        e.Common.toxicDefence = this.getToxicDefence();
        e.Common.toxicRate = this.getToxicRate();
        e.Common.curseDamage = this.getCurseDamage();
        e.Common.curseDefence = this.getCurseDefence();
        e.Common.curseRate = this.getCurseRate();
        return e;
    }
}
