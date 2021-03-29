import EquipmentData from "./EquipmentData";
import DamageData from "./DamageData";
import StatusData from "./StatusData";
import CommonData from "./CommonData";
import Random from "../Utils/Random";
import AvatarData from "./AvatarData";
import Shield from "../Shield";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class PlayerData {
    static DEFAULT_HEALTH = 10;
    static DEFAULT_SPEED = 300;
    static DEFAULT_ATTACK = 1;
    static DEFAULT_BACK_ATTACK = 0;
    static DEFAULT_DREAM = 5;
    name: string = '';
    pos: cc.Vec3 = cc.v3(5, 5);

    currentHealth: number = PlayerData.DEFAULT_HEALTH;
    currentDream:number = PlayerData.DEFAULT_DREAM;

    private common: CommonData;
    private equipmentTotalData: EquipmentData;
    private statusTotalData: StatusData;
    private avatarData:AvatarData;

    constructor() {
        this.equipmentTotalData = new EquipmentData();
        this.statusTotalData = new StatusData();
        this.avatarData = new AvatarData();
        this.common = new CommonData();
        this.common.maxHealth = PlayerData.DEFAULT_HEALTH;
        this.common.moveSpeed = PlayerData.DEFAULT_SPEED;
        this.common.damageMin = PlayerData.DEFAULT_ATTACK;
        this.common.damageBack = PlayerData.DEFAULT_BACK_ATTACK;
        this.common.maxDream = PlayerData.DEFAULT_DREAM;
    }
    get EquipmentTotalData() {
        return this.equipmentTotalData;
    }
    get StatusTotalData() {
        return this.statusTotalData;
    }
    get AvatarData(){
        return this.avatarData;
    }
    set AvatarData(data:AvatarData){
        this.avatarData = data;
    }
    get Common() {
        return this.common;
    }
    get FinalCommon(){
        let data = new CommonData().add(this.common).add(this.statusTotalData.Common)
        .add(this.equipmentTotalData.Common).add(this.avatarData.professionData.Common);
        return data;
    }

    public valueCopy(data: PlayerData): void {
        this.common.valueCopy(data.common);
        this.pos = data.pos ? cc.v3(data.pos.x,data.pos.y) : cc.v3(4, 7);
        this.name = data.name ? data.name : '';
        this.equipmentTotalData.valueCopy(data.equipmentTotalData);
        this.statusTotalData.valueCopy(data.statusTotalData);
        this.avatarData.valueCopy(data.avatarData);
        this.currentHealth = data.currentHealth ? data.currentHealth : PlayerData.DEFAULT_HEALTH;
        this.currentDream = data.currentDream ? data.currentDream : PlayerData.DEFAULT_DREAM;
        this.common.maxHealth = data.common.maxHealth ? data.common.maxHealth : PlayerData.DEFAULT_HEALTH;
        this.common.moveSpeed = data.common.moveSpeed ? data.common.moveSpeed : PlayerData.DEFAULT_SPEED;
    }

    public clone(): PlayerData {
        let e = new PlayerData();
        e.common = this.common.clone();
        e.pos = this.pos;
        e.name = this.name;
        e.currentHealth = this.currentHealth;
        e.currentDream = this.currentDream;
        e.equipmentTotalData = this.equipmentTotalData;
        e.statusTotalData = this.statusTotalData;
        e.avatarData = this.avatarData;
        return e;
    }

    //计算攻击的最终结果  
    //5% 6% 20% 1-0.95x0.94X0.8 = 0.16951
    public getFinalAttackPoint(): DamageData {
        let data = this.FinalCommon;
        let dd = new DamageData();
        let damageMin = data.damageMin;
        let damageMax = data.damageMax;
        let chance = data.criticalStrikeRate/100;
        let isCritical = Random.rand() < chance;
        let attack = isCritical ? damageMin + damageMax : damageMin;
        if (attack < 0) {
            attack = 0;
        }
        dd.isCriticalStrike = isCritical;
        dd.physicalDamage = attack;
        dd.realDamage = data.realDamage;
        dd.magicDamage = data.magicDamage;
        if(this.avatarData.organizationIndex == AvatarData.FOLLOWER){
            dd.physicalDamage+=this.currentDream*0.25;
        }
        return dd;
    }
    //获取最终远程伤害
    public getFinalRemoteDamage(): DamageData {
        let data = this.FinalCommon;
        let dd = new DamageData();
        let remoteDamage = data.remoteDamage;
        if(this.avatarData.organizationIndex == AvatarData.HUNTER ){
            remoteDamage += this.currentDream*0.25;
        }
        let chance = data.remoteCritRate/100;
        let isCritical = Random.rand() < chance;
        let attack = isCritical ? remoteDamage+remoteDamage : remoteDamage;
        if (attack < 0) {
            attack = 0;
        }
        dd.physicalDamage = attack;
        dd.isCriticalStrike = isCritical;
        return dd;
    }
    //伤害减免
    public getDamage(damageData: DamageData,blockLevel:number): DamageData {
        let data = this.FinalCommon;
        let finalDamageData = damageData.clone();
        let defence = data.defence;
        let defenceMagic = data.magicDefence/100;
        let blockPhysical = data.blockPhysical/100;
        let blockMagic = data.blockMagic/100;
        //伤害=攻击*(1-(护甲*0.06)/(护甲*0.06+1))
        //伤害 = 攻击 + 2-0.94^(-护甲)
        if(defence>=0){
            finalDamageData.physicalDamage = finalDamageData.physicalDamage*(1-defence*0.06/(defence*0.06+1));
        }else{
            finalDamageData.physicalDamage = finalDamageData.physicalDamage * (2-Math.pow(0.94,-defence));
        }
        finalDamageData.magicDamage = finalDamageData.magicDamage * (1 - defenceMagic);
        if(finalDamageData.physicalDamage>0||finalDamageData.magicDamage>0){
            if(blockLevel == Shield.BLOCK_NORMAL){
                finalDamageData.physicalDamage = finalDamageData.physicalDamage * (1 - blockPhysical);
                finalDamageData.magicDamage = finalDamageData.magicDamage * (1 - blockMagic);
            }else if(blockLevel == Shield.BLOCK_PARRY){
                finalDamageData.physicalDamage = 0;
                finalDamageData.magicDamage = 0;
                finalDamageData.realDamage = 0;
            }
        }
        
        return finalDamageData;
    }

    //吸血默认是1暴击时吸血翻倍
    public getLifeDrain(): number {
        let data = this.FinalCommon;
        let chance = data.criticalStrikeRate/100;
        let drainRate = data.lifeDrain/100;
        let drain = 0;
        if (Random.rand() < drainRate) {
            drain = 0.1;
            if (Random.rand() < chance) {
                drain = 0.5;
            }
        }
        return drain;
    }

    //初始速度300,最大速度600 最小速度为0
    public getMoveSpeed(): number {
        let data = this.FinalCommon;
        let speed = data.moveSpeed;
        if (speed > PlayerData.DEFAULT_SPEED * 2) { speed = PlayerData.DEFAULT_SPEED * 2 }
        if (speed < -PlayerData.DEFAULT_SPEED * 2) { speed = -PlayerData.DEFAULT_SPEED * 2; }
        return speed;
    }

    //生命值
    public getHealth(): cc.Vec3 {
        let data = this.FinalCommon;
        let rate = 1;
        let maxHealth = data.maxHealth;
        if (maxHealth > 0) {
            rate = this.currentHealth / maxHealth;
        } else {
            return cc.v3(1, 1);
        }
        return cc.v3(maxHealth * rate, maxHealth);
    }
    
    //梦境值
    public getDream(): cc.Vec3 {
        let data = this.FinalCommon;
        let rate = 1;
        let maxDream = data.maxDream;
        if (maxDream > 0) {
            rate = this.currentDream / maxDream;
        } else {
            return cc.v3(1, 1);
        }
        return cc.v3(maxDream * rate, maxDream);
    }

}
