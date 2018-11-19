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
        this.attack.string = this.getInfo(playerData.damageMin,equipmentData.damageMin,statusData.physicalDamage)+'->'+this.getInfo(playerData.damageMax,equipmentData.damageMax,0);
        this.criticalStrikeRate.string = this.getInfo(playerData.criticalStrikeRate*100,equipmentData.criticalStrikeRate*100,statusData.criticalStrikeRate*100,true);
        this.defence.string = this.getInfo(playerData.defence,equipmentData.defence,statusData.defence);
        this.lifeDrain.string = this.getInfo(playerData.lifeDrain*100,equipmentData.lifeDrain*100,statusData.lifeDrain*100,true);
        this.lifeRecovery.string = this.getInfo(playerData.lifeRecovery,equipmentData.lifeRecovery,statusData.lifeRecovery);
        this.moveSpeed.string = this.getInfo(playerData.moveSpeed,equipmentData.moveSpeed,statusData.moveSpeed);
        this.attackSpeed.string = this.getInfo(playerData.attackSpeed,equipmentData.attackSpeed,statusData.attackSpeed,true);
        this.dodge.string = this.getInfo(playerData.dodge*100,equipmentData.dodge*100,statusData.dodge*100,true);
        this.health.string = playerData.currentHealth+'/'+this.getInfo(playerData.maxHealth,equipmentData.health,statusData.maxHealth);
        this.realDamage.string = this.getInfo(playerData.realDamage,equipmentData.realDamage,statusData.realDamage);
        this.realRate.string = this.getInfo(playerData.realRate,equipmentData.realRate,statusData.realRate,true);
        this.iceDamage.string = this.getInfo(playerData.iceDamage,equipmentData.iceDamage,statusData.iceDamage);
        this.iceDefence.string = this.getInfo(playerData.iceDefence,equipmentData.iceDefence,statusData.iceDefence,true);
        this.iceRate.string = this.getInfo(playerData.iceRate,equipmentData.iceRate,statusData.iceRate,true);
        this.fireDamage.string = this.getInfo(playerData.fireDamage,equipmentData.fireDamage,statusData.fireDamage);
        this.fireDefence.string = this.getInfo(playerData.fireDefence,equipmentData.fireDefence,statusData.fireDefence,true);
        this.fireRate.string = this.getInfo(playerData.fireRate,equipmentData.fireRate,statusData.fireRate,true);
        this.lighteningDamage.string = this.getInfo(playerData.lighteningDamage,equipmentData.lighteningDamage,statusData.lighteningDamage);
        this.lighteningDefence.string = this.getInfo(playerData.lighteningDefence,equipmentData.lighteningDefence,statusData.lighteningDefence,true);
        this.lighteningRate.string = this.getInfo(playerData.lighteningRate,equipmentData.lighteningRate,statusData.lighteningRate,true);
        this.toxicDamage.string = this.getInfo(playerData.toxicDamage,equipmentData.toxicDamage,statusData.toxicDamage);
        this.toxicDefence.string = this.getInfo(playerData.toxicDefence,equipmentData.toxicDefence,statusData.toxicDefence,true);
        this.toxicRate.string = this.getInfo(playerData.toxicRate,equipmentData.toxicRate,statusData.toxicRate,true);
        this.curseDamage.string = this.getInfo(playerData.curseDamage,equipmentData.curseDamage,statusData.curseDamage);
        this.curseDefence.string = this.getInfo(playerData.curseDefence,equipmentData.curseDefence,statusData.curseDefence,true);
        this.curseRate.string = this.getInfo(playerData.curseRate,equipmentData.curseRate,statusData.curseRate,true);
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
        this.layout.opacity = this.isShow?255:0;
    }
}
