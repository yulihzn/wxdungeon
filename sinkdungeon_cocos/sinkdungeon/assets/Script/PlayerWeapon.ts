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
import Logic from "./Logic";
import InventoryManager from "./Manager/InventoryManager";
import PlayerData from "./Data/PlayerData";
import AudioPlayer from "./Utils/AudioPlayer";
import PlayerAvatar from "./PlayerAvatar";
import Equipment from "./Equipment/Equipment";

const { ccclass, property } = cc._decorator;
/**
 * 武器：包含近战和远程两种
 */
@ccclass
export default class PlayerWeapon extends cc.Component {

    player: Player = null;
    meleeWeapon: MeleeWeapon = null;
    shooter: Shooter = null;
    isLeftHand:boolean = false;//是否左手
    isHeavyRemotoAttacking = false;//是否是重型远程武器,比如激光
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(player: Player,isLeftHand:boolean) {
        this.isLeftHand = isLeftHand;
        this.player = player;
        this.initMelee();
        this.initShooter();
    }
    private initMelee() {
        this.meleeWeapon = this.getComponentInChildren(MeleeWeapon);
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
            case Equipment.WEAPON:
                this.meleeWeapon.changeEquipment(equipData,spriteFrame,inventoryManager);
                break;
            case Equipment.REMOTE: this.shooter.data = equipData.clone();
                this.shooter.changeRes(this.shooter.data.img);
                let c = cc.color(255, 255, 255).fromHEX(this.shooter.data.color);
                this.shooter.changeResColor(c);
                break;
        }
    }

    meleeAttack(data: PlayerData, isMiss: boolean) {
        if (!this.meleeWeapon || this.meleeWeapon.IsAttacking) {
            return;
        }
        this.meleeWeapon.attack(data, isMiss);
        
    }
    remoteRate = 0;
    remoteAttack(data: PlayerData) {
        let canFire = false;
        let speed = PlayerData.DefAULT_SPEED - data.getRemoteSpeed();
        if (speed < 10) { speed = 10 }
        if (speed > Shooter.DefAULT_SPEED * 10) { speed = Shooter.DefAULT_SPEED * 10; }
        let currentTime = Date.now();
        if (currentTime - this.remoteRate > speed) {
            this.remoteRate = currentTime;
            canFire = true;
        }
        if (!canFire) {
            return;
        }
        this.isHeavyRemotoAttacking = this.shooter.data.isHeavy == 1;
        this.scheduleOnce(() => { this.isHeavyRemotoAttacking = false }, 0.2);
        if (this.shooter) {
            this.shooter.remoteDamagePlayer = data.getFinalRemoteDamage();
            this.shooter.fireBullet(0);
        }
    }
}
