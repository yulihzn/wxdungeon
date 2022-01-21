import { EventHelper } from './EventHelper';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";
import MeleeWeapon from "./MeleeWeapon";
import Shooter from "./Shooter";
import EquipmentData from "../data/EquipmentData";
import InventoryManager from "../manager/InventoryManager";
import PlayerData from "../data/PlayerData";
import PlayerAvatar from "./PlayerAvatar";
import MeleeShadowWeapon from "./MeleeShadowWeapon";
import Logic from "./Logic";
import Random from '../utils/Random';

const { ccclass, property } = cc._decorator;
/**
 * 武器：包含近战和远程两种
 */
@ccclass
export default class PlayerWeapon extends cc.Component {

    player: Player = null;
    meleeWeapon: MeleeWeapon = null;
    shadowWeapon: MeleeShadowWeapon = null;
    shooter: Shooter = null;
    private isLeftHand: boolean = false;//是否左手
    isHeavyRemotoAttacking = false;//是否是重型远程武器,比如激光
    private isShadow = false;
    private selfDefaultPos = cc.v3(-15, 40);
    private otherDefaultPos = cc.v3(20, 40);
    private remoteIntervalTime = 0;//子弹间隔时间
    private isCooling = false;
    private remoteAngleOffset = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(player: Player, isLeftHand: boolean, isShadow: boolean) {
        this.isShadow = isShadow;
        this.isLeftHand = isLeftHand;
        this.player = player;
        this.initMelee();
        this.initShooter();
        if (isLeftHand) {
            this.selfDefaultPos = cc.v3(-15, 40);
            this.otherDefaultPos = cc.v3(20, 40);
        } else {
            this.otherDefaultPos = cc.v3(-15, 40);
            this.selfDefaultPos = cc.v3(20, 40);
        }
    }
    private initMelee() {
        if (this.isShadow) {
            this.shadowWeapon = this.getComponentInChildren(MeleeShadowWeapon);
            this.shadowWeapon.init(this.player, this.isLeftHand ? this.player.weaponLeft.meleeWeapon : this.player.weaponRight.meleeWeapon);
        } else {
            this.meleeWeapon = this.getComponentInChildren(MeleeWeapon);
            this.meleeWeapon.IsSecond = this.isLeftHand;
        }
    }
    private initShooter() {
        this.shooter = this.getComponentInChildren(Shooter);
        this.shooter.player = this.player;
        this.shooter.parentNode = this.player.node;
    }

    changeZIndexByDir(avatarZindex: number, dir: number) {
        switch (dir) {
            case PlayerAvatar.DIR_UP:
                this.node.zIndex = avatarZindex - 1;
                break;
            case PlayerAvatar.DIR_DOWN:
                this.node.zIndex = avatarZindex + 1;
                break;
            case PlayerAvatar.DIR_LEFT:
            case PlayerAvatar.DIR_RIGHT:
                this.node.zIndex = this.isLeftHand ? avatarZindex - 1 : avatarZindex + 1;
                break;
        }
    }
    changeWeapon(equipData: EquipmentData, spriteFrame: cc.SpriteFrame) {
        switch (equipData.equipmetType) {
            case InventoryManager.WEAPON:
                this.meleeWeapon.changeEquipment(equipData, spriteFrame);
                break;
            case InventoryManager.REMOTE: this.shooter.data = equipData.clone();
                this.shooter.changeRes(this.shooter.data.img);
                let c = cc.color(255, 255, 255).fromHEX(this.shooter.data.color);
                this.shooter.changeResColor(c);
                break;
        }
    }

    meleeAttack(data: PlayerData, fistCombo: number) {
        if (!this.meleeWeapon || this.meleeWeapon.IsAttacking) {
            return;
        }
        this.meleeWeapon.attack(data, fistCombo);

    }
    remoteAttack(data: PlayerData, cooldownNode: cc.Node, bulletArcExNum: number, bulletLineExNum: number): boolean {
        if (this.isCooling) {
            return false;
        }
        let canFire = false;
        let finalData = data.FinalCommon;
        let cooldown = finalData.remoteCooldown;
        let remoteInterval = finalData.remoteInterval;
        if (cooldown < 100) {
            cooldown = 100;
        }
        if (remoteInterval < 0) {
            remoteInterval = 0;
        }
        let currentTime = Date.now();
        let offsetTime = currentTime - this.remoteIntervalTime;
        if (offsetTime > remoteInterval) {
            if (offsetTime < remoteInterval * 2) {
                this.remoteAngleOffset+=finalData.remoteAngle/5;
                if (this.remoteAngleOffset > finalData.remoteAngle) {
                    this.remoteAngleOffset = finalData.remoteAngle;
                }
            }else{
                this.remoteAngleOffset = 0;
            }
            this.remoteIntervalTime = currentTime;
            canFire = true;
        }

        if (!canFire) {
            return false;
        }
        data.currentAmmo--;
        this.isHeavyRemotoAttacking = this.shooter.data.isHeavy == 1;
        this.scheduleOnce(() => { this.isHeavyRemotoAttacking = false }, 0.2);
        if (this.shooter) {
            this.shooter.remoteDamagePlayer = data.getFinalRemoteDamage();
            this.shooter.fireBullet(Random.getRandomNum(-this.remoteAngleOffset, this.remoteAngleOffset), cc.v3(30, 0), bulletArcExNum, bulletLineExNum);
        }
        if (data.currentAmmo <= 0 && cooldownNode) {
            this.isCooling = true;
            cooldownNode.width = 80;
            cooldownNode.stopAllActions();
            cc.tween(cooldownNode).to(cooldown / 1000, { width: 0 }).call(() => {
                data.currentAmmo = finalData.maxAmmo;
                this.isCooling = false;
            }).start();
        }
        EventHelper.emit(EventHelper.HUD_UPDATE_PLAYER_AMMO, { x: data.currentAmmo, y: finalData.maxAmmo });
        return true;
    }

    updateLogic(dt: number) {
        this.node.position = Logic.lerpPos(this.node.position, this.player.isFaceRight ? this.selfDefaultPos : this.otherDefaultPos, dt * 5);
        if (this.meleeWeapon) {
            this.meleeWeapon.updateLogic(dt);
        }
        if (this.shooter) {
            this.shooter.updateLogic(dt);
        }
    }
}
