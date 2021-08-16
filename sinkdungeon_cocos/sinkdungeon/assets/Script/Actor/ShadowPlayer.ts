// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DamageData from "../Data/DamageData";
import EquipmentData from "../Data/EquipmentData";
import PlayerData from "../Data/PlayerData";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Player from "../Player";
import PlayerWeapon from "../PlayerWeapon";
import Shooter from "../Shooter";
import IndexZ from "../Utils/IndexZ";
import NextStep from "../Utils/NextStep";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShadowPlayer extends cc.Component {

    @property(PlayerWeapon)
    weaponLeft: PlayerWeapon = null;
    @property(PlayerWeapon)
    weaponRight: PlayerWeapon = null;
    @property(Shooter)
    shooterEx: Shooter = null;
    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    player: Player;
    mat: cc.MaterialVariant;
    index = 0;
    lifeNext: NextStep = new NextStep();
    isStop = false;
    targetPos: cc.Vec3 = cc.v3(0, 0);
    movePos: cc.Vec3 = cc.v3(0, 0);
    playerLastPos: cc.Vec3 = cc.v3(0, 0);
    moveList: cc.Vec3[] = [];
    readonly SCALE = 3;

    // LIFE-CYCLE CALLBACKS:

    init(player: Player, spriteframe: cc.SpriteFrame, index: number, lifeTime: number) {
        this.player = player;
        this.index = index;
        this.player.data.ShadowList[this.index] = lifeTime ? lifeTime : 30;
        this.node.parent = this.player.node.parent;
        this.weaponLeft.init(this.player, true, true);
        this.weaponRight.init(this.player, false, true);
        this.weaponLeft.node.opacity = 0;
        this.weaponRight.node.opacity = 0;
        this.shooterEx.player = this.player;
        this.shooterEx.isEx = true;
        this.mat = this.sprite.getMaterial(0);
        this.sprite.node.scaleX = this.SCALE;
        this.sprite.node.scaleY = -this.SCALE;
        this.sprite.spriteFrame = spriteframe;
        this.node.zIndex = IndexZ.getActorZIndex(Dungeon.getIndexInMap(this.node.position));
        this.sprite.node.width = this.sprite.spriteFrame.getRect().width;
        this.sprite.node.height = this.sprite.spriteFrame.getRect().height;
        this.node.position = this.player.node.position.clone();
        this.targetPos = this.player.node.position.clone();
        this.playerLastPos = this.player.node.position.clone();
        this.isStop = false;
        this.lifeNext.next(() => {
        }, lifeTime ? lifeTime : 30, true, (secondCount: number) => {
            if (secondCount >= 0 && this.node && this.isValid && !this.isStop) {
                this.player.data.ShadowList[this.index] = secondCount;
            }
            if (secondCount <= 0) {
                this.stop();
            }
        })
    }
    attack(data: PlayerData, comboType: number, hv: cc.Vec3, isLeft: boolean): boolean {
        if (!this.node) {
            return false;
        }
        if (isLeft) {
            return this.weaponLeft.shadowWeapon.attack(data, comboType, hv);
        } else {
            return this.weaponRight.shadowWeapon.attack(data, comboType, hv);
        }

    }
    remoteAttack(isLeft: boolean, data: EquipmentData, hv: cc.Vec3, damage: DamageData, bulletArcExNum: number, bulletLineExNum: number): boolean {
        if (!this.node) {
            return false;
        }
        let shooter = isLeft ? this.weaponLeft.shooter : this.weaponRight.shooter;
        shooter.data = data.clone();
        shooter.setHv(hv);
        shooter.remoteDamagePlayer = damage;
        shooter.fireBullet(0, null, bulletArcExNum, bulletLineExNum);
    }
    stop() {
        if (this.isValid) {
            this.isStop = true;
            this.player.data.ShadowList[this.index] = 0;
            this.node.active = false;
            this.enabled = false;
            this.destroy();
        }
    }
    /**获取中心位置 */
    getCenterPosition(): cc.Vec3 {
        return this.node.position.clone().addSelf(cc.v3(0, 32 * this.node.scaleY));
    }
    updateLogic(dt: number) {
        if (this.player) {
            this.movePos.x += Math.abs(this.player.node.position.x - this.playerLastPos.x);
            this.movePos.y += Math.abs(this.player.node.position.y - this.playerLastPos.y);
            this.playerLastPos = this.player.node.position.clone();
            let offset = 5;
            if (this.movePos.x > offset || this.movePos.y > offset) {
                this.movePos = cc.v3(0, 0);
                let p = this.player.node.position.clone();
                p.z = this.player.isFaceRight ? 1 : -1;
                this.moveList.push(p);
            }
            if (this.moveList.length > 0) {
                let x = this.moveList[0].x - this.targetPos.x;
                let y = this.moveList[0].y - this.targetPos.y;
                if (x * x + y * y < offset * offset) {
                    this.moveList.splice(0, 1);
                }
                if (this.moveList.length > 10 * (this.index + 1)) {
                    this.targetPos = this.moveList[0].clone();
                    this.node.scaleX = this.node.scaleX * this.targetPos.z;
                }
            }
            this.node.zIndex = IndexZ.getActorZIndex(Dungeon.getIndexInMap(this.node.position));
            this.sprite.node.opacity = 200 - this.index * 20;
            this.mat.setProperty('textureSizeWidth', this.sprite.spriteFrame.getTexture().width * this.SCALE);
            this.mat.setProperty('textureSizeHeight', this.sprite.spriteFrame.getTexture().height * this.SCALE);
            this.mat.setProperty('outlineColor', cc.color(200, 200, 200));
            this.mat.setProperty('outlineSize', 4);
            if (!this.weaponLeft.shadowWeapon.IsAttacking && !this.weaponRight.shadowWeapon.IsAttacking) {
                this.node.position = Logic.lerpPos(this.node.position, this.targetPos, dt * 3);
            }
        }
    }
}
