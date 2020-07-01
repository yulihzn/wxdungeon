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
    damageBack: cc.Label = null;
    moveSpeed: cc.Label = null;
    attackSpeed: cc.Label = null;
    dodge: cc.Label = null;
    health: cc.Label = null;
    realDamage: cc.Label = null;
    realRate: cc.Label = null
    magicDamage:cc.Label = null;
    magicDefence:cc.Label = null;
    iceRate: cc.Label = null;
    fireRate: cc.Label = null;
    lighteningRate: cc.Label = null;
    toxicRate: cc.Label = null;
    curseRate: cc.Label = null;
    
    isShow = false;
    layout:cc.Node=null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.attack = this.node.getChildByName('layout').getChildByName('attack').getChildByName('label').getComponent(cc.Label);
        this.criticalStrikeRate = this.node.getChildByName('layout').getChildByName('criticalStrikeRate').getChildByName('label').getComponent(cc.Label);
        this.defence = this.node.getChildByName('layout').getChildByName('defence').getChildByName('label').getComponent(cc.Label);
        this.lifeDrain = this.node.getChildByName('layout').getChildByName('lifeDrain').getChildByName('label').getComponent(cc.Label);
        this.damageBack = this.node.getChildByName('layout').getChildByName('damageBack').getChildByName('label').getComponent(cc.Label);
        this.moveSpeed = this.node.getChildByName('layout').getChildByName('moveSpeed').getChildByName('label').getComponent(cc.Label);
        this.attackSpeed = this.node.getChildByName('layout').getChildByName('attackSpeed').getChildByName('label').getComponent(cc.Label);
        this.dodge = this.node.getChildByName('layout').getChildByName('dodge').getChildByName('label').getComponent(cc.Label);
        this.health = this.node.getChildByName('layout').getChildByName('health').getChildByName('label').getComponent(cc.Label);
        this.realDamage = this.node.getChildByName('layout').getChildByName('realDamage').getChildByName('label').getComponent(cc.Label);
        this.realRate = this.node.getChildByName('layout').getChildByName('realRate').getChildByName('label').getComponent(cc.Label);
        this.magicDamage = this.node.getChildByName('layout').getChildByName('magicDamage').getChildByName('label').getComponent(cc.Label);
        this.magicDefence = this.node.getChildByName('layout').getChildByName('magicDefence').getChildByName('label').getComponent(cc.Label);
        this.iceRate = this.node.getChildByName('layout').getChildByName('iceRate').getChildByName('label').getComponent(cc.Label);
        this.fireRate = this.node.getChildByName('layout').getChildByName('fireRate').getChildByName('label').getComponent(cc.Label);
        this.lighteningRate = this.node.getChildByName('layout').getChildByName('lighteningRate').getChildByName('label').getComponent(cc.Label);
        this.toxicRate = this.node.getChildByName('layout').getChildByName('toxicRate').getChildByName('label').getComponent(cc.Label);
        this.curseRate = this.node.getChildByName('layout').getChildByName('curseRate').getChildByName('label').getComponent(cc.Label);
        this.layout =  this.node.getChildByName('layout');
        this.addSpriteTouchEvent();
    }

    start() {

    }
    refreshDialog(playerData: PlayerData, equipmentData: EquipmentData,statusData:StatusData) {
        if(!this.attack){return;}
        this.attack.string = this.getInfo(playerData.Common.damageMin,equipmentData.Common.damageMin,statusData.Common.damageMin)+'    MAX:'+this.getInfo(playerData.Common.damageMax,equipmentData.Common.damageMax,statusData.Common.damageMax);
        this.criticalStrikeRate.string = this.getInfo(playerData.Common.criticalStrikeRate,equipmentData.Common.criticalStrikeRate,statusData.Common.criticalStrikeRate,true);
        this.defence.string = this.getInfo(playerData.Common.defence,equipmentData.Common.defence,statusData.Common.defence);
        this.lifeDrain.string = this.getInfo(playerData.Common.lifeDrain,equipmentData.Common.lifeDrain,statusData.Common.lifeDrain,true);
        this.damageBack.string = this.getInfo(playerData.Common.damageBack,equipmentData.Common.damageBack,statusData.Common.damageBack);
        this.moveSpeed.string = this.getInfo(playerData.Common.moveSpeed,equipmentData.Common.moveSpeed,statusData.Common.moveSpeed);
        this.attackSpeed.string = this.getInfo(playerData.Common.attackSpeed,equipmentData.Common.attackSpeed,statusData.Common.attackSpeed,true);
        this.dodge.string = this.getInfo(playerData.Common.dodge,equipmentData.Common.dodge,statusData.Common.dodge,true);
        this.health.string = playerData.currentHealth.toFixed(1).replace('.0','')+'/'+this.getInfo(playerData.Common.maxHealth,equipmentData.Common.maxHealth,statusData.Common.maxHealth);
        this.realDamage.string = this.getInfo(playerData.Common.realDamage,equipmentData.Common.realDamage,statusData.Common.realDamage);
        this.realRate.string = this.getInfo(playerData.Common.realRate,equipmentData.Common.realRate,statusData.Common.realRate,true);
        this.magicDamage.string = this.getInfo(playerData.Common.magicDamage,equipmentData.Common.magicDamage,statusData.Common.magicDamage);
        this.magicDefence.string = this.getInfo(playerData.Common.magicDefence,equipmentData.Common.magicDefence,statusData.Common.magicDefence,true);
        this.iceRate.string = this.getInfo(playerData.Common.iceRate,equipmentData.Common.iceRate,statusData.Common.iceRate,true);
        this.fireRate.string = this.getInfo(playerData.Common.fireRate,equipmentData.Common.fireRate,statusData.Common.fireRate,true);
        this.lighteningRate.string = this.getInfo(playerData.Common.lighteningRate,equipmentData.Common.lighteningRate,statusData.Common.lighteningRate,true);
        this.toxicRate.string = this.getInfo(playerData.Common.toxicRate,equipmentData.Common.toxicRate,statusData.Common.toxicRate,true);
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
