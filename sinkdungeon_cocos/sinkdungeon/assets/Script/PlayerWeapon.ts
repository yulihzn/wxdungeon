// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";
import MeleeWeapon from "./MeleeWeapon";
import Shooter from "./Shooter";
import EquipmentData from "./Data/EquipmentData";
import InventoryManager from "./Manager/InventoryManager";
import PlayerData from "./Data/PlayerData";
import PlayerAvatar from "./PlayerAvatar";
import MeleeShadowWeapon from "./MeleeShadowWeapon";

const { ccclass, property } = cc._decorator;
/**
 * 武器：包含近战和远程两种
 */
@ccclass
export default class PlayerWeapon extends cc.Component {

    player: Player = null;
    meleeWeapon: MeleeWeapon = null;
    shadowWeapon:MeleeShadowWeapon = null;
    shooter: Shooter = null;
    isLeftHand:boolean = false;//是否左手
    isHeavyRemotoAttacking = false;//是否是重型远程武器,比如激光
    isShadow = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(player: Player,isLeftHand:boolean,isShadow:boolean) {
        this.isShadow = isShadow;
        this.isLeftHand = isLeftHand;
        this.player = player;
        this.initMelee();
        this.initShooter();
    }
    private initMelee() {
        if(this.isShadow){
            this.shadowWeapon = this.getComponentInChildren(MeleeShadowWeapon);
            this.shadowWeapon.init(this.player,this.isLeftHand?this.player.weaponLeft.meleeWeapon:this.player.weaponRight.meleeWeapon);
        }else{
            this.meleeWeapon = this.getComponentInChildren(MeleeWeapon);
            this.meleeWeapon.IsSecond = this.isLeftHand;
        }
    }
    private initShooter() {
        this.shooter = this.getComponentInChildren(Shooter);
        this.shooter.player = this.player;
        this.shooter.parentNode = this.player.node;
    }
    
    changeZIndexByDir(avatarZindex:number,dir: number) {
        switch(dir){
            case PlayerAvatar.DIR_UP:
                this.node.zIndex = avatarZindex-1;
                break;
            case PlayerAvatar.DIR_DOWN:
                this.node.zIndex = avatarZindex+1;
                break;
            case PlayerAvatar.DIR_LEFT:
            case PlayerAvatar.DIR_RIGHT:
                this.node.zIndex = this.isLeftHand?avatarZindex-1:avatarZindex+1;
                break;
        }
    }
    changeWeapon(equipData: EquipmentData, spriteFrame: cc.SpriteFrame, inventoryManager: InventoryManager) {
        switch (equipData.equipmetType) {
            case InventoryManager.WEAPON:
                this.meleeWeapon.changeEquipment(equipData,spriteFrame,inventoryManager);
                break;
            case InventoryManager.REMOTE: this.shooter.data = equipData.clone();
                this.shooter.changeRes(this.shooter.data.img);
                let c = cc.color(255, 255, 255).fromHEX(this.shooter.data.color);
                this.shooter.changeResColor(c);
                break;
        }
    }

    meleeAttack(data: PlayerData,fistCombo:number) {
        if (!this.meleeWeapon || this.meleeWeapon.IsAttacking) {
            return;
        }
        this.meleeWeapon.attack(data,fistCombo);
        
    }
    remoteIntervalTime = 0;
    remoteAttack(data: PlayerData,cooldownNode:cc.Node,bulletArcExNum:number,bulletLineExNum:number):boolean {
        let canFire = false;
        let cooldown = data.FinalCommon.remoteCooldown;
        if(cooldown<100){
            cooldown = 100;
        }
        let currentTime = Date.now();
        if (currentTime - this.remoteIntervalTime > cooldown) {
            this.remoteIntervalTime = currentTime;
            canFire = true;
        }
        if (!canFire) {
            return false;
        }
        this.isHeavyRemotoAttacking = this.shooter.data.isHeavy == 1;
        this.scheduleOnce(() => { this.isHeavyRemotoAttacking = false }, 0.2);
        if (this.shooter) {
            this.shooter.remoteDamagePlayer = data.getFinalRemoteDamage();
            this.shooter.fireBullet(0,null,bulletArcExNum,bulletLineExNum);
        }
        if(cooldownNode&&cooldown>500){
            cooldownNode.width = 80;
            cooldownNode.stopAllActions();
            cc.tween(cooldownNode).to(cooldown/1000,{width:0}).start();
        }
        return true;
    }

    updateLogic(dt:number){
        if(this.meleeWeapon){
            this.meleeWeapon.updateLogic(dt);
        }
    }
}
