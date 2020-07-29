import EquipmentData from "../Data/EquipmentData";
import DamageData from "../Data/DamageData";
import ItemData from "../Data/ItemData";

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
    remote:EquipmentData = new EquipmentData();
    helmet:EquipmentData = new EquipmentData();
    clothes:EquipmentData = new EquipmentData();
    trousers:EquipmentData = new EquipmentData();
    gloves:EquipmentData = new EquipmentData();
    shoes:EquipmentData = new EquipmentData();
    cloak:EquipmentData = new EquipmentData();
    shield:EquipmentData = new EquipmentData();
    //buffer效果
    buffer:EquipmentData = new EquipmentData();
    list:EquipmentData[] = [];
    itemList:ItemData[] = [];
    
   
    constructor(){
        this.list = [this.weapon,this.helmet,this.clothes,this.trousers,this.gloves,this.shoes,this.cloak,this.shield,this.buffer,this.remote];
        this.itemList.push(new ItemData());
        this.itemList.push(new ItemData());
        this.itemList.push(new ItemData());
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
    //初始延迟是300,最低延迟为0 最大3000
    getRemoteSpeed():number{
        let speed = 0;
        for(let data of this.list){
            speed += data.Common.remoteSpeed;
        }
        return speed;
    }
    //获取最大最小攻击力
    getAttackPoint():cc.Vec3{
        let attackPoint = cc.v3(0,0);
        for(let data of this.list){
            attackPoint.x += data.Common.damageMin;
            attackPoint.y += data.Common.damageMax;
        }
        return attackPoint;
    }
    //获取远程攻击
    getRemoteDamage():number{
        let d = 0;
        for (let data of this.list) {
            d += data.Common.remoteDamage;
        }
        return d;
    }
    //获取远程暴击率
    getRemoteCritRate(): number {
        let rate = 1;
        for(let data of this.list){
            rate *= (1-data.Common.remoteCritRate/100);
        }
        return (1-rate)*100;
    }
    //获取暴击率
    getCriticalStrikeRate():number{
        let rate = 1;
        for(let data of this.list){
            rate *= (1-data.Common.criticalStrikeRate/100);
        }
        return (1-rate)*100;
    }
    
    //闪避
    getDodge():number{
        let rate = 1;
        for(let data of this.list){
            rate *= (1-data.Common.dodge/100);
        }
        return (1-rate)*100;
    }
    //防御,可以为负数
    getDefence():number{
        let defence = 0;
        for(let data of this.list){
            defence += data.Common.defence;
        }
        return defence;
    }
    getMagicDefence():number{
        let defence = 0;
        for(let data of this.list){
            defence += data.Common.magicDefence;
        }
        return defence;
    }
    getBlockPhysical(): number {
        let block = 0;
        for (let data of this.list) {
            block += data.Common.blockPhysical;
        }
        return block;
    }
    getBlockMagic(): number {
        let block = 0;
        for (let data of this.list) {
            block += data.Common.blockMagic;
        }
        return block;
    }
    getBlockDamage(): number {
        let block = 0;
        for (let data of this.list) {
            block += data.Common.blockDamage;
        }
        return block;
    }
    getRealDamage():number{
        let damage = 0;
        for(let data of this.list){
            damage += data.Common.realDamage;
        }
        return damage;
    }
    getMagicDamage():number{
        let damage = 0;
        for(let data of this.list){
            damage += data.Common.magicDamage;
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
    //背刺伤害
    getDamageBack():number{
        let damageBack = 0;
        for(let data of this.list){
            damageBack += data.Common.damageBack;
        }
        return damageBack;
    }
    getLifeDrainRate():number{
        let rate = 1;
        for(let data of this.list){
            rate *= (1-data.Common.lifeDrain/100);
        }
        return (1-rate)*100;
        
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
        e.Common.damageBack = this.getDamageBack();
        e.Common.moveSpeed = this.getMoveSpeed();
        e.Common.attackSpeed = this.getAttackSpeed();
        e.Common.remoteSpeed = this.getRemoteSpeed();
        e.Common.remoteDamage = this.getRemoteDamage();
        e.Common.remoteCritRate = this.getRemoteCritRate();
        e.Common.dodge = this.getDodge();
        e.Common.maxHealth = this.getHealth();
        e.Common.realDamage = this.getRealDamage();
        e.Common.realRate = this.getRealRate();
        e.Common.magicDamage = this.getMagicDamage();
        e.Common.magicDefence = this.getMagicDefence();
        e.Common.iceRate = this.getIceRate();
        e.Common.fireRate = this.getFireRate();
        e.Common.lighteningRate = this.getLighteningRate();
        e.Common.toxicRate = this.getToxicRate();
        e.Common.curseRate = this.getCurseRate();
        e.Common.blockDamage = this.getBlockDamage();
        e.Common.blockMagic = this.getBlockMagic();
        e.Common.blockPhysical = this.getBlockPhysical();
        return e;
    }
}
