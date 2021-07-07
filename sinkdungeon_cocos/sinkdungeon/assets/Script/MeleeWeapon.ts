import Dungeon from "./Dungeon";
import Player from "./Player";
import NonPlayer from "./NonPlayer";
import { EventHelper } from "./EventHelper";
import Box from "./Building/Box";
import Logic from "./Logic";
import MeleeWeaponChild from "./MeleeWeaponChild";
import DamageData from "./Data/DamageData";
import StatusManager from "./Manager/StatusManager";
import PlayerData from "./Data/PlayerData";
import Boss from "./Boss/Boss";
import NextStep from "./Utils/NextStep";
import FromData from "./Data/FromData";
import AudioPlayer from "./Utils/AudioPlayer";
import IndexZ from "./Utils/IndexZ";
import PlayerAvatar from "./PlayerAvatar";
import EquipmentData from "./Data/EquipmentData";
import InventoryManager from "./Manager/InventoryManager";
import HitBuilding from "./Building/HitBuilding";
import CommonData from "./Data/CommonData";
import Actor from "./Base/Actor";
import AvatarData from "./Data/AvatarData";
import { ColliderTag } from "./Actor/ColliderTag";
import ActorUtils from "./Utils/ActorUtils";
import InteractBuilding from "./Building/InteractBuilding";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//发射器
const { ccclass, property } = cc._decorator;

@ccclass
export default class MeleeWeapon extends cc.Component {
    public static readonly ELEMENT_TYPE_ICE = 1;
    public static readonly ELEMENT_TYPE_FIRE = 2;
    public static readonly ELEMENT_TYPE_LIGHTENING = 3;
    public static readonly ELEMENT_TYPE_TOXIC = 4;
    public static readonly ELEMENT_TYPE_CURSE = 5;
    public static readonly COMBO1: number = 1;
    public static readonly COMBO2: number = 2;
    public static readonly COMBO3: number = 3;

    @property(cc.Node)
    playerNode: cc.Node = null;
    player: Player = null;

    @property(MeleeWeaponChild)
    stabWeapon: MeleeWeaponChild = null;
    @property(MeleeWeaponChild)
    waveWeapon: MeleeWeaponChild = null;

    @property(cc.Prefab)
    iceLight: cc.Prefab = null;
    @property(cc.Prefab)
    fireLight: cc.Prefab = null;
    @property(cc.Prefab)
    lighteningLight: cc.Prefab = null;
    @property(cc.Prefab)
    toxicLight: cc.Prefab = null;
    @property(cc.Prefab)
    curseLight: cc.Prefab = null;

    private meleeLightLeftPos = cc.v3(8, 0);
    private meleeLightRightPos = cc.v3(-8, 0);

    private anim: cc.Animation;
    private isAttacking: boolean = false;
    private hv: cc.Vec3 = cc.v3(1, 0);
    private isStab = true;//刺
    private isFar = false;//近程
    private isFist = true;//空手 
    private isBlunt = false;//钝器
    dungeon: Dungeon;
    private weaponFirePoint: cc.Node;//剑尖
    private isMiss = false;
    private drainSkill = new NextStep();
    private isReflect = false;//子弹偏转
    private weaponSprite: cc.Sprite = null;
    private weaponStabSprite: cc.Sprite = null;
    private weaponStabLightSprite: cc.Sprite = null;
    private weaponLightSprite: cc.Sprite = null;
    private handSprite: cc.Sprite = null;
    private glovesSprite: cc.Sprite = null;
    private comboType = 0;
    private isComboing = false;
    private hasTargetMap: { [key: string]: number } = {};
    private isSecond = false;//是否是副手
    private currentAngle = 0;
    private fistCombo = 0;
    private exBeatBack:number = 0;
    
    get IsSword() {
        return !this.isStab && !this.isFar && !this.isFist && !this.isBlunt;
    }
    set IsSecond(isSecond: boolean) {
        this.isSecond = isSecond;
    }
    get IsFist() {
        return this.isFist;
    }
    get IsComboing() {
        return this.isComboing;
    }
    get IsAttacking() {
        return this.isAttacking;
    }
    get IsReflect() {
        return this.isReflect;
    }
    get GlovesSprite() {
        return this.glovesSprite;
    }

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.player = this.playerNode.getComponent(Player);
        this.weaponFirePoint = this.node.getChildByName('firepoint');
        this.meleeLightLeftPos = this.player.node.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(this.meleeLightLeftPos));
        this.meleeLightRightPos = this.player.node.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(this.meleeLightRightPos));
        this.weaponSprite = this.getSpriteChildSprite(['sprite', InventoryManager.WEAPON]);
        this.weaponStabSprite = this.getSpriteChildSprite(['sprite', 'stabweapon']);
        this.weaponStabLightSprite = this.getSpriteChildSprite(['sprite', 'stablight']);
        this.weaponLightSprite = this.getSpriteChildSprite(['sprite', 'meleelight']);
        this.handSprite = this.getSpriteChildSprite(['sprite', 'hand']);
        this.glovesSprite = this.getSpriteChildSprite(['sprite', 'hand', 'gloves']);
        this.handSprite.node.color = cc.Color.WHITE.fromHEX(this.player.avatar.data.skinColor);

    }

    set Hv(hv: cc.Vec3) {
        let pos = this.hasNearEnemy();
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.hv = pos;
        } else {
            this.hv = hv.normalizeSelf();
        }
    }
    get Hv(): cc.Vec3 {
        return this.hv;
    }
    private getSpriteChildSprite(childNames: string[]): cc.Sprite {
        let node = this.node;
        for (let name of childNames) {
            node = node.getChildByName(name);
        }
        return node.getComponent(cc.Sprite);
    }
    changeEquipment(equipData: EquipmentData, spriteFrame: cc.SpriteFrame, inventoryManager: InventoryManager) {
        if (InventoryManager.WEAPON != equipData.equipmetType) {
            cc.log('its not a weapon');
            return;
        }
        this.isStab = equipData.stab == 1;
        this.isFar = equipData.far == 1;
        this.isReflect = equipData.isReflect == 1;
        this.isFist = false;
        this.isBlunt = equipData.blunt == 1;
        this.exBeatBack = inventoryManager.getEquipBySuit(equipData).exBeatBack;
        if (equipData.stab == 1) {
            this.weaponSprite.spriteFrame = null;
            this.weaponStabSprite.spriteFrame = spriteFrame;
            this.weaponStabLightSprite.spriteFrame = this.isFar ? Logic.spriteFrameRes('stablight') : Logic.spriteFrameRes('stablight1');
        } else {
            this.weaponSprite.spriteFrame = spriteFrame;
            this.weaponStabSprite.spriteFrame = null;
        }
        let color1 = cc.color(255, 255, 255).fromHEX(inventoryManager.equips[InventoryManager.WEAPON].color);
        let color2 = cc.color(255, 255, 255).fromHEX(inventoryManager.equips[InventoryManager.WEAPON].lightcolor);
        this.weaponSprite.node.color = color1;
        this.weaponStabSprite.node.color = color1;
        this.weaponStabLightSprite.node.color = color2;
        this.weaponLightSprite.node.color = color2;
    }
    private updateCombo() {
        if (this.comboType == MeleeWeapon.COMBO1) {
            this.comboType = MeleeWeapon.COMBO2;
        } else if (this.comboType == MeleeWeapon.COMBO2) {
            this.comboType = MeleeWeapon.COMBO3;
        } else if (this.comboType == MeleeWeapon.COMBO3) {
            this.comboType = MeleeWeapon.COMBO1;
        } else {
            this.comboType = MeleeWeapon.COMBO1;
        }
        if (!this.isComboing) {
            this.comboType = MeleeWeapon.COMBO1;
            this.isComboing = true;
        }
    }
    attack(data: PlayerData, isMiss: boolean,fistCombo:number): boolean {
        if (this.isAttacking) {
            return false;
        }
        this.hasTargetMap = {};
        let audioName = AudioPlayer.MELEE;
        this.fistCombo = fistCombo;
        let audiodelay = 0;
        //匕首
        if (this.isStab && !this.isFar) {
            audioName = AudioPlayer.FIST;
        }
        //长剑
        if (!this.isStab && !this.isFar) {
            audioName = AudioPlayer.SWORD_ATTACK;
        }
        //长枪
        if (this.isStab && this.isFar) {
            audiodelay = 0.1;
            audioName = AudioPlayer.MELEE;
        }
        //大剑
        if (!this.isStab && this.isFar) {
            audiodelay = 0.3;
            audioName = AudioPlayer.MELEE;
        }
        this.scheduleOnce(() => {
            AudioPlayer.play(audioName);
        }, audiodelay);
        this.updateCombo();

        this.isMiss = isMiss;
        this.isAttacking = true;
        let finalCommon = data.FinalCommon;
        let animSpeed = 1 + finalCommon.attackSpeed / 500;
        //最慢
        if (animSpeed < 0.2) {
            animSpeed = 0.2;
        }
        //最快
        if (animSpeed > 3) {
            animSpeed = 3;
        }

        if (this.anim) {
            let animname = this.getAttackAnimName();
            this.anim.play(animname);
            this.anim.getAnimationState(animname).speed = animSpeed;
        }
        let p = this.weaponFirePoint.position.clone();
        let ran = Logic.getRandomNum(0, 100);
        let waves = [finalCommon.magicDamage > 0 && ran < finalCommon.iceRate ? MeleeWeapon.ELEMENT_TYPE_ICE : 0
            , finalCommon.magicDamage > 0 && ran < finalCommon.fireRate ? MeleeWeapon.ELEMENT_TYPE_FIRE : 0
            , finalCommon.magicDamage > 0 && ran < finalCommon.lighteningRate ? MeleeWeapon.ELEMENT_TYPE_LIGHTENING : 0
            , finalCommon.magicDamage > 0 && ran < finalCommon.toxicRate ? MeleeWeapon.ELEMENT_TYPE_TOXIC : 0
            , finalCommon.magicDamage > 0 && ran < finalCommon.curseRate ? MeleeWeapon.ELEMENT_TYPE_CURSE : 0];
        let delay = (!this.isStab && this.isFar) ? 0.5 : 0;
        this.scheduleOnce(() => {
            for (let w of waves) {
                this.getWaveLight(this.dungeon.node, p, w, this.isStab, this.isFar);
            }
        }, delay)
        return true;

    }
    attackIdle(isReverse: boolean) {
        if (this.anim) {
            this.anim.play(isReverse ? 'MeleeAttackIdleReverse' : 'MeleeAttackIdle');
        }
    }
    getMeleeSlowRatio(): number {
        if (!this.isFar && this.isStab) {
            return 0.05;
        } else if (this.isFar && this.isStab) {
            return 0.02;
        } else if (!this.isFar && !this.isStab) {
            return 0.02;
        } else {
            return 0.01;
        }
    }

    private getAttackAnimName(): string {
        let name = "MeleeAttackStab";
        if (!this.isFar && this.isStab) {
            name = this.isFist ? "MeleeAttackFist" : "MeleeAttackStab";
        } else if (this.isFar && this.isStab) {
            name = "MeleeAttackStabFar";
        } else if (this.isFar && !this.isStab) {
            name = "MeleeAttackFar";
        } else {
            name = this.isBlunt ? "MeleeAttackBlunt" : "MeleeAttack";
        }
        return name + this.getComboSuffix();
    }
    private getComboSuffix(): string {
        if (this.isFist) {
            if (this.isSecond) {
                return '2';
            }
            return '1';
        }
        if (this.comboType == MeleeWeapon.COMBO1) {
            return '1';
        } else if (this.comboType == MeleeWeapon.COMBO2) {
            return '2';
        } else if (this.comboType == MeleeWeapon.COMBO3) {
            return '3';
        } else {
            return '1';
        }
    }
    private getWaveLight(dungeonNode: cc.Node, p: cc.Vec3, elementType: number, isStab: boolean, isFar: boolean) {
        let lights = [this.iceLight, this.fireLight, this.lighteningLight, this.toxicLight, this.curseLight];
        if (elementType < 1 || elementType > lights.length || !this.dungeon) {
            return;
        }
        let firePrefab: cc.Node = cc.instantiate(lights[elementType - 1]);
        let xoffset = 60;
        let yoffset = 60;
        if (isStab) {
            xoffset = 10;
        }
        if (isFar) {
            if (isStab) {
                xoffset += 20;
            } else {
                xoffset += 80;
            }
            yoffset += 10;
        }
        let notStab1 = [cc.v3(p.x, p.y + yoffset), cc.v3(p.x + xoffset * 0.9, p.y + yoffset / 2), cc.v3(p.x + xoffset, p.y), cc.v3(p.x + xoffset * 0.9, -p.y - yoffset / 2), cc.v3(p.x, -p.y - yoffset)];
        let ps = [cc.v3(p.x - xoffset * 2, p.y), cc.v3(p.x - xoffset * 0.5, p.y), cc.v3(p.x, p.y), cc.v3(p.x + xoffset * 0.5, p.y), cc.v3(p.x + xoffset, p.y)];
        if (!isStab) {
            ps = notStab1;
        }
        for (let i = 0; i < ps.length; i++) {
            let psp = ps[i];
            psp = this.node.convertToWorldSpaceAR(psp);
            psp = dungeonNode.convertToNodeSpaceAR(psp);
            ps[i] = psp.clone();
        }
        firePrefab.parent = dungeonNode;
        firePrefab.position = ps[0];
        firePrefab.zIndex = IndexZ.OVERHEAD;
        firePrefab.opacity = 255;
        firePrefab.setScale(0.2);
        firePrefab.active = true;
        cc.tween(firePrefab).to(0.15,{position:ps[1]}).to(0.15,{position:ps[2]}).to(0.1,{position:ps[3]}).to(0.1,{position:ps[4]}).start();
    }
    //Anim
    MeleeAttackFinish() {
        this.scheduleOnce(() => {
            this.isAttacking = false;
        }, 0.05);
        this.scheduleOnce(() => {
            if (!this.isAttacking) {
                this.isComboing = false;
            }
        }, 0.3);
    }
    //Anim
    ExAttackTime() {
        this.player.remoteExAttack(this.comboType);
    }
    //Anim
    AudioTime(){
        let audioName = AudioPlayer.MELEE;
        //匕首
        if (this.isStab && !this.isFar) {
            audioName = AudioPlayer.FIST;
        }
        //长剑
        if (!this.isStab && !this.isFar) {
            audioName = AudioPlayer.SWORD_ATTACK;
        }
        //长枪
        if (this.isStab && this.isFar) {
            audioName = AudioPlayer.MELEE;
        }
        //大剑
        if (!this.isStab && this.isFar) {
            audioName = AudioPlayer.MELEE;
        }
        AudioPlayer.play(audioName);
    }
    /**Anim 清空攻击列表*/
    RefreshTime() {
        this.hasTargetMap = {};
    }
    /**Anim 冲刺*/
    DashTime(speed?: number) {
        AudioPlayer.play(AudioPlayer.DASH);
        if (!speed) {
            speed = 600;
        }
        this.schedule(() => {
            this.player.getWalkSmoke(this.player.node, this.node.position);
        }, 0.05, 4, 0);
        let pos = cc.v2(this.hv.x, this.hv.y);
        this.player.sc.isMoving = false;
        this.player.isWeaponDashing = true;
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = this.player.isFaceRight ? cc.v2(1, 0) : cc.v2(-1, 0);
        } else {
            pos = pos.normalizeSelf();
        }
        let posv3 = cc.v3(pos.x, pos.y);
        this.hv = posv3.clone();
        pos = pos.mul(speed);
        this.player.rigidbody.linearVelocity = pos;
        this.scheduleOnce(() => {
            this.player.isWeaponDashing = false;
            this.player.rigidbody.linearVelocity = cc.Vec2.ZERO;
            this.player.playerAnim(PlayerAvatar.STATE_IDLE, this.player.currentDir);
        }, 0.2)
    }

    setHandAndWeaponInVisible(flag:boolean){
        if(flag){
            this.weaponSprite.node.opacity = 0;
            this.weaponStabSprite.node.opacity = 0;
            this.handSprite.node.opacity = 0;
        }else{
            this.weaponSprite.node.opacity = 255;
            this.weaponStabSprite.node.opacity = 255;
            this.handSprite.node.opacity = 255;
        }
    }
    updateLogic(dt: number) {
        this.node.angle = Logic.lerp(this.node.angle, this.currentAngle, dt * 5);
        let pos = this.hasNearEnemy();
        if (!pos.equals(cc.Vec3.ZERO)) {
            if (!this.isAttacking) {
                this.rotateColliderManager(cc.v3(this.node.position.x + pos.x, this.node.position.y + pos.y));
            }
            this.hv = pos;
        } else if ((this.hv.x != 0 || this.hv.y != 0) && !this.isAttacking) {
            let olderTarget = cc.v3(this.node.position.x + this.hv.x, this.node.position.y + this.hv.y);
            this.rotateColliderManager(olderTarget);
        }
        
    }
    private hasNearEnemy() {
        let olddis = 1000;
        let pos = cc.v3(0, 0);
        if (this.dungeon) {
            let enemy = ActorUtils.getNearestEnemyActor(this.player,false, this.dungeon);
            if(enemy){
                let dis = Logic.getDistance(this.player.node.position, enemy.node.position);
                if (dis < 200 && dis < olddis && !enemy.sc.isDied) {
                    olddis = dis;
                    let p = this.node.position.clone();
                    p.x = this.node.scaleX > 0 ? p.x : -p.x;
                    pos = enemy.getCenterPosition().sub(this.player.node.position.add(p));
                }
            }
            if (olddis != 1000) {
                pos = pos.normalizeSelf();
            }
        }
        return pos;
    }

    private rotateColliderManager(target: cc.Vec3) {
        // 两者取差得到方向向量
        let direction = target.sub(this.node.position);
        // 方向向量转换为角度值
        let Rad2Deg = 360 / (Math.PI * 2);
        let angle: number = 360 - Math.atan2(direction.x, direction.y) * Rad2Deg;
        let offsetAngle = 90;
        let sx = Math.abs(this.node.scaleX);
        this.node.scaleX = this.player.node.scaleX>0?sx:-sx;
        let sy = Math.abs(this.node.scaleY);
        this.node.scaleY = this.node.scaleX < 0 ? -sy : sy;
        angle += offsetAngle;
        if (angle >= 360) {
            angle -= 360;
        }
        if (angle <= -360) {
            angle += 360;
        }
        // 将当前物体的角度设置为对应角度
        let lastAngle = this.currentAngle;
        this.currentAngle = this.node.scaleX < 0 ? -angle : angle;
        if (lastAngle >= 0 && this.currentAngle < 0 || lastAngle < 0 && this.currentAngle >= 0) {
            this.node.angle = this.currentAngle;
        }

    }

    onCollisionStay(other: cc.Collider, self: cc.CircleCollider) {
        if (self.radius > 0) {
            if (this.hasTargetMap[other.node.uuid] && this.hasTargetMap[other.node.uuid] > 0) {
                this.hasTargetMap[other.node.uuid]++;
                return false;
            } else {
                this.hasTargetMap[other.node.uuid] = 1;
                return this.attacking(other);
            }
        }
    }
  
    private beatBack(actor: Actor) {
        let rigidBody: cc.RigidBody = actor.getComponent(cc.RigidBody);
        let pos = this.Hv.clone();
        if (pos.equals(cc.Vec3.ZERO)) {
            pos = cc.v3(1, 0);
        }
        let power = 20+this.exBeatBack;
        if (!this.isFar && this.isStab) {
            power = 20;
        } else if (this.isFar && this.isStab) {
            power = 100;
        } else if (!this.isFar && !this.isStab) {
            power = 60;
        } else {
            power = 20;
        }
        if (this.comboType == MeleeWeapon.COMBO3) {
            power += 20;
        }
        
        pos = pos.normalizeSelf().mul(power);
        this.scheduleOnce(() => {
            rigidBody.applyLinearImpulse(cc.v2(pos.x, pos.y), rigidBody.getLocalCenter(), true);
        }, 0.1);
    }
    private attacking(attackTarget: cc.Collider):boolean {
        if (!attackTarget || !this.isAttacking) {
            return false;
        }
        // this.waveWeapon.isAttacking = true;
        // this.stabWeapon.isAttacking = true;
        let damage = new DamageData();
        let common = new CommonData();
        if (this.player) {
            damage = this.player.data.getFinalAttackPoint();
            common = this.player.data.FinalCommon;
        }
        damage.isStab = this.isStab;
        damage.isFist = this.isFist;
        damage.isFar = this.isFar;
        damage.isBlunt = this.isBlunt;
        damage.isMelee = true;
        damage.comboType = this.comboType;
        if(this.isFist){
            damage.comboType = this.fistCombo;
        }
        let damageSuccess = false;
        let attackSuccess = false;
        if (attackTarget.tag == ColliderTag.NONPLAYER) {
            let monster = attackTarget.node.getComponent(NonPlayer);
            if (monster && !monster.sc.isDied && !this.isMiss && monster.data.isEnemy > 0) {
                damage.isBackAttack = monster.isPlayerBehindAttack() && common.damageBack > 0;
                if (damage.isBackAttack) {
                    damage.realDamage += common.damageBack;
                }
                damageSuccess = monster.takeDamage(damage);
                if (damageSuccess) {
                    this.beatBack(monster);
                    this.addTargetAllStatus(common, monster);
                }
            }
        } else if (attackTarget.tag == ColliderTag.BOSS) {
            let boss = attackTarget.node.getComponent(Boss);
            if (boss && !boss.sc.isDied && !this.isMiss) {
                damageSuccess = boss.takeDamage(damage);
                if (damageSuccess) {
                    this.addTargetAllStatus(common, boss);
                }
            }
        } else if (attackTarget.tag == ColliderTag.BUILDING || attackTarget.tag == ColliderTag.WALL) {
            let box = attackTarget.node.getComponent(Box);
            if (box) {
                attackSuccess = true;
                box.breakBox();
            }
            if(!attackSuccess){
                let interactBuilding = attackTarget.node.getComponent(InteractBuilding);
                if (interactBuilding&&interactBuilding.data.currentHealth>0) {
                    attackSuccess = true;
                    interactBuilding.takeDamage(damage)
                }
            }
            if(!attackSuccess){
                let hitBuilding = attackTarget.node.getComponent(HitBuilding);
                if (hitBuilding&&hitBuilding.data.currentHealth>0) {
                    attackSuccess = true;
                    hitBuilding.takeDamage(damage);
                }
            }
            
        } 
        //生命汲取,内置1s cd
        if (damageSuccess) {
            this.drainSkill.next(() => {
                let drain = this.player.data.getLifeDrain();
                if (drain > 0) {
                    this.player.takeDamage(new DamageData(-drain));
                }
            }, 1, true);
        }

        this.isMiss = false;
        //停顿
        if (damageSuccess || attackSuccess) {
            this.anim.pause();
            cc.director.emit(EventHelper.CAMERA_SHAKE, { detail: { isHeavyShaking: this.comboType == MeleeWeapon.COMBO3 } });
            this.scheduleOnce(() => { this.anim.resume() }, 0.1);
        }
        if (damageSuccess && this.player.data.AvatarData.organizationIndex == AvatarData.TECH) {
            this.player.updateDream(-1);
        }
        return damageSuccess || attackSuccess;
    }
    private addTargetAllStatus(data: CommonData, target: Actor) {
        this.addTargetStatus(data.iceRate, target, StatusManager.FROZEN);
        this.addTargetStatus(data.fireRate, target, StatusManager.BURNING);
        this.addTargetStatus(data.lighteningRate, target, StatusManager.DIZZ);
        this.addTargetStatus(data.toxicRate, target, StatusManager.TOXICOSIS);
        this.addTargetStatus(data.curseRate, target, StatusManager.CURSING);
        this.addTargetStatus(data.realRate, target, StatusManager.BLEEDING);
    }

    private addTargetStatus(rate: number, target: Actor, statusType) {
        if (Logic.getRandomNum(0, 100) < rate) { target.addStatus(statusType, new FromData()); }
    }
    


}
