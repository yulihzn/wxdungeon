import PlayerData from "../Data/PlayerData";
import EquipmentData from "../Data/EquipmentData";

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
    refreshDialog(playerData: PlayerData, equipmentData: EquipmentData) {
        if(!this.attack){return;}
        this.attack.string = this.getInfo(playerData.damageMin,equipmentData.damageMin)+'-'+this.getInfo(playerData.damageMax,equipmentData.damageMax);
        this.criticalStrikeRate.string = this.getInfo(playerData.criticalStrikeRate,equipmentData.criticalStrikeRate);
        this.defence.string = this.getInfo(playerData.criticalStrikeRate,equipmentData.criticalStrikeRate);
        this.lifeDrain.string = this.getInfo(playerData.criticalStrikeRate,equipmentData.criticalStrikeRate);
        this.lifeRecovery.string = this.getInfo(playerData.criticalStrikeRate,equipmentData.criticalStrikeRate);
        this.moveSpeed.string = this.getInfo(playerData.criticalStrikeRate,equipmentData.criticalStrikeRate);
        this.attackSpeed.string = this.getInfo(playerData.criticalStrikeRate,equipmentData.criticalStrikeRate);
        this.dodge.string = this.getInfo(playerData.criticalStrikeRate,equipmentData.criticalStrikeRate);
        this.health.string = this.getInfo(playerData.criticalStrikeRate,equipmentData.criticalStrikeRate);
        this.realDamage.string = this.getInfo(playerData.realDamage,equipmentData.realDamage);
        this.realRate.string = this.getInfo(playerData.realRate,equipmentData.realRate);
        this.iceDamage.string = this.getInfo(playerData.iceDamage,equipmentData.iceDamage);
        this.iceDefence.string = this.getInfo(playerData.iceDefence,equipmentData.iceDefence);
        this.iceRate.string = this.getInfo(playerData.iceRate,equipmentData.iceRate);
        this.fireDamage.string = this.getInfo(playerData.fireDamage,equipmentData.fireDamage);
        this.fireDefence.string = this.getInfo(playerData.fireDefence,equipmentData.fireDefence);
        this.fireRate.string = this.getInfo(playerData.fireRate,equipmentData.fireRate);
        this.lighteningDamage.string = this.getInfo(playerData.lighteningDamage,equipmentData.lighteningDamage);
        this.lighteningDefence.string = this.getInfo(playerData.lighteningDefence,equipmentData.lighteningDefence);
        this.lighteningRate.string = this.getInfo(playerData.lighteningRate,equipmentData.lighteningRate);
        this.toxicDamage.string = this.getInfo(playerData.toxicDamage,equipmentData.toxicDamage);
        this.toxicDefence.string = this.getInfo(playerData.toxicDefence,equipmentData.toxicDefence);
        this.toxicRate.string = this.getInfo(playerData.toxicRate,equipmentData.toxicRate);
        this.curseDamage.string = this.getInfo(playerData.curseDamage,equipmentData.curseDamage);
        this.curseDefence.string = this.getInfo(playerData.curseDefence,equipmentData.curseDefence);
        this.curseRate.string = this.getInfo(playerData.curseRate,equipmentData.curseRate);
    }
    private getInfo(base:number,equip:number):string{
        return `${(base+equip).toFixed(1)}(${equip>0?'+':''}${equip.toFixed(1)})`;
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
