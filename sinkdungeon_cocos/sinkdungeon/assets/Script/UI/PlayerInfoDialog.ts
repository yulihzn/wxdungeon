import PlayerData from "../Data/PlayerData";
import EquipmentData from "../Data/EquipmentData";
import StatusData from "../Data/StatusData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerInfoDialog extends cc.Component {
    attack: cc.Label = null;
    criticalStrikeRate: cc.Label = null;
    defence: cc.Label = null;
    lifeDrain: cc.Label = null;
    lifeRecovery: cc.Label = null;
    moveSpeed: cc.Label = null;
    attackSpeed: cc.Label = null;
    dodge: cc.Label = null;
    health: cc.Label = null;
    realDamage: cc.Label = null;
    realRate: cc.Label = null
    iceDamage: cc.Label = null;
    iceDefence: cc.Label = null;
    iceRate: cc.Label = null;
    fireDamage: cc.Label = null;
    fireDefence: cc.Label = null;
    fireRate: cc.Label = null;
    lighteningDamage: cc.Label = null;
    lighteningDefence: cc.Label = null;
    lighteningRate: cc.Label = null;
    toxicDamage: cc.Label = null;
    toxicDefence: cc.Label = null;
    toxicRate: cc.Label = null;
    curseDamage: cc.Label = null;
    curseDefence: cc.Label = null;
    curseRate: cc.Label = null;
    
    isShow = false;
    layout:cc.Node=null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.attack = this.node.getChildByName('layout').getChildByName('attack').getChildByName('label').getComponent(cc.Label);
        this.criticalStrikeRate = this.node.getChildByName('layout').getChildByName('criticalStrikeRate').getChildByName('label').getComponent(cc.Label);
        this.defence = this.node.getChildByName('layout').getChildByName('defence').getChildByName('label').getComponent(cc.Label);
        this.lifeDrain = this.node.getChildByName('layout').getChildByName('lifeDrain').getChildByName('label').getComponent(cc.Label);
        this.lifeRecovery = this.node.getChildByName('layout').getChildByName('lifeRecovery').getChildByName('label').getComponent(cc.Label);
        this.moveSpeed = this.node.getChildByName('layout').getChildByName('moveSpeed').getChildByName('label').getComponent(cc.Label);
        this.attackSpeed = this.node.getChildByName('layout').getChildByName('attackSpeed').getChildByName('label').getComponent(cc.Label);
        this.dodge = this.node.getChildByName('layout').getChildByName('dodge').getChildByName('label').getComponent(cc.Label);
        this.health = this.node.getChildByName('layout').getChildByName('health').getChildByName('label').getComponent(cc.Label);
        this.realDamage = this.node.getChildByName('layout').getChildByName('realDamage').getChildByName('label').getComponent(cc.Label);
        this.realRate = this.node.getChildByName('layout').getChildByName('realRate').getChildByName('label').getComponent(cc.Label);
        this.iceDamage = this.node.getChildByName('layout').getChildByName('iceDamage').getChildByName('label').getComponent(cc.Label);
        this.iceDefence = this.node.getChildByName('layout').getChildByName('iceDefence').getChildByName('label').getComponent(cc.Label);
        this.iceRate = this.node.getChildByName('layout').getChildByName('iceRate').getChildByName('label').getComponent(cc.Label);
        this.fireDamage = this.node.getChildByName('layout').getChildByName('fireDamage').getChildByName('label').getComponent(cc.Label);
        this.fireDefence = this.node.getChildByName('layout').getChildByName('fireDefence').getChildByName('label').getComponent(cc.Label);
        this.fireRate = this.node.getChildByName('layout').getChildByName('fireRate').getChildByName('label').getComponent(cc.Label);
        this.lighteningDamage = this.node.getChildByName('layout').getChildByName('lighteningDamage').getChildByName('label').getComponent(cc.Label);
        this.lighteningDefence = this.node.getChildByName('layout').getChildByName('lighteningDefence').getChildByName('label').getComponent(cc.Label);
        this.lighteningRate = this.node.getChildByName('layout').getChildByName('lighteningRate').getChildByName('label').getComponent(cc.Label);
        this.toxicDamage = this.node.getChildByName('layout').getChildByName('toxicDamage').getChildByName('label').getComponent(cc.Label);
        this.toxicDefence = this.node.getChildByName('layout').getChildByName('toxicDefence').getChildByName('label').getComponent(cc.Label);
        this.toxicRate = this.node.getChildByName('layout').getChildByName('toxicRate').getChildByName('label').getComponent(cc.Label);
        this.curseDamage = this.node.getChildByName('layout').getChildByName('curseDamage').getChildByName('label').getComponent(cc.Label);
        this.curseDefence = this.node.getChildByName('layout').getChildByName('curseDefence').getChildByName('label').getComponent(cc.Label);
        this.curseRate = this.node.getChildByName('layout').getChildByName('curseRate').getChildByName('label').getComponent(cc.Label);
        this.layout =  this.node.getChildByName('layout');
        this.addSpriteTouchEvent();
    }

    start() {

    }
    refreshDialog(playerData: PlayerData, equipmentData: EquipmentData,statusData:StatusData) {
        if(!this.attack){return;}
        this.attack.string = this.getInfo(playerData.Common.damageMin,equipmentData.Common.damageMin,statusData.Common.damageMin)+'->'+this.getInfo(playerData.Common.damageMax,equipmentData.Common.damageMax,statusData.Common.damageMax);
        this.criticalStrikeRate.string = this.getInfo(playerData.Common.criticalStrikeRate,equipmentData.Common.criticalStrikeRate,statusData.Common.criticalStrikeRate,true);
        this.defence.string = this.getInfo(playerData.Common.defence,equipmentData.Common.defence,statusData.Common.defence);
        this.lifeDrain.string = this.getInfo(playerData.Common.lifeDrain,equipmentData.Common.lifeDrain,statusData.Common.lifeDrain,true);
        this.lifeRecovery.string = this.getInfo(playerData.Common.lifeRecovery,equipmentData.Common.lifeRecovery,statusData.Common.lifeRecovery);
        this.moveSpeed.string = this.getInfo(playerData.Common.moveSpeed,equipmentData.Common.moveSpeed,statusData.Common.moveSpeed);
        this.attackSpeed.string = this.getInfo(playerData.Common.attackSpeed,equipmentData.Common.attackSpeed,statusData.Common.attackSpeed,true);
        this.dodge.string = this.getInfo(playerData.Common.dodge,equipmentData.Common.dodge,statusData.Common.dodge,true);
        this.health.string = playerData.currentHealth.toFixed(1).replace('.0','')+'/'+this.getInfo(playerData.Common.maxHealth,equipmentData.Common.maxHealth,statusData.Common.maxHealth);
        this.realDamage.string = this.getInfo(playerData.Common.realDamage,equipmentData.Common.realDamage,statusData.Common.realDamage);
        this.realRate.string = this.getInfo(playerData.Common.realRate,equipmentData.Common.realRate,statusData.Common.realRate,true);
        this.iceDamage.string = this.getInfo(playerData.Common.iceDamage,equipmentData.Common.iceDamage,statusData.Common.iceDamage);
        this.iceDefence.string = this.getInfo(playerData.Common.iceDefence,equipmentData.Common.iceDefence,statusData.Common.iceDefence,true);
        this.iceRate.string = this.getInfo(playerData.Common.iceRate,equipmentData.Common.iceRate,statusData.Common.iceRate,true);
        this.fireDamage.string = this.getInfo(playerData.Common.fireDamage,equipmentData.Common.fireDamage,statusData.Common.fireDamage);
        this.fireDefence.string = this.getInfo(playerData.Common.fireDefence,equipmentData.Common.fireDefence,statusData.Common.fireDefence,true);
        this.fireRate.string = this.getInfo(playerData.Common.fireRate,equipmentData.Common.fireRate,statusData.Common.fireRate,true);
        this.lighteningDamage.string = this.getInfo(playerData.Common.lighteningDamage,equipmentData.Common.lighteningDamage,statusData.Common.lighteningDamage);
        this.lighteningDefence.string = this.getInfo(playerData.Common.lighteningDefence,equipmentData.Common.lighteningDefence,statusData.Common.lighteningDefence,true);
        this.lighteningRate.string = this.getInfo(playerData.Common.lighteningRate,equipmentData.Common.lighteningRate,statusData.Common.lighteningRate,true);
        this.toxicDamage.string = this.getInfo(playerData.Common.toxicDamage,equipmentData.Common.toxicDamage,statusData.Common.toxicDamage);
        this.toxicDefence.string = this.getInfo(playerData.Common.toxicDefence,equipmentData.Common.toxicDefence,statusData.Common.toxicDefence,true);
        this.toxicRate.string = this.getInfo(playerData.Common.toxicRate,equipmentData.Common.toxicRate,statusData.Common.toxicRate,true);
        this.curseDamage.string = this.getInfo(playerData.Common.curseDamage,equipmentData.Common.curseDamage,statusData.Common.curseDamage);
        this.curseDefence.string = this.getInfo(playerData.Common.curseDefence,equipmentData.Common.curseDefence,statusData.Common.curseDefence,true);
        this.curseRate.string = this.getInfo(playerData.Common.curseRate,equipmentData.Common.curseRate,statusData.Common.curseRate,true);
    }
    private getInfo(base:number,equip:number,status:number,isPercent?:boolean):string{
        let s = `${(base+equip+status).toFixed(1).replace('.0','')}`;
        if(isPercent){
            s+='%';
        }
        if(equip>0){
            s+=' E:+'+ equip.toFixed(1).replace('.0','');
            if(isPercent){s+='%';}
        }else if(equip < 0){
            s+=' E:'+ equip.toFixed(1).replace('.0','');
            if(isPercent){s+='%';}
        }
        if(status>0){
            s+=' S:+'+ status.toFixed(1).replace('.0','');
            if(isPercent){s+='%';}
        }else if(status < 0){
            s+=' S:'+ status.toFixed(1).replace('.0','');
            if(isPercent){s+='%';}
        }
        return s;
    }
    addSpriteTouchEvent(){
        this.node.on(cc.Node.EventType.TOUCH_START,()=>{
            this.isShow = true;
        })
        this.node.on(cc.Node.EventType.TOUCH_END,()=>{
            this.isShow = false;
        })
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,()=>{
            this.isShow = false;
        })
    }
    update (dt) {
        this.layout.active = this.isShow;
    }
}
