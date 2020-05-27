import Bullet from "./Item/Bullet";
import Dungeon from "./Dungeon";
import Player from "./Player";
import Monster from "./Monster";
import { EventHelper } from "./EventHelper";
import Box from "./Building/Box";
import Logic from "./Logic";
import MeleeWeaponChild from "./MeleeWeaponChild";
import EquipmentData from "./Data/EquipmentData";
import DamageData from "./Data/DamageData";
import StatusManager from "./Manager/StatusManager";
import PlayerData from "./Data/PlayerData";
import Boss from "./Boss/Boss";
import Random from "./Utils/Random";
import Skill from "./Utils/Skill";
import FromData from "./Data/FromData";
import Decorate from "./Building/Decorate";
import AudioPlayer from "./Utils/AudioPlayer";

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

    handStab:cc.Node = null;
    handWave:cc.Node = null;
    glovesStabSprite:cc.Sprite = null;
    glovesWaveSprite:cc.Sprite = null;


    private anim: cc.Animation;
    isAttacking: boolean = false;
    private hv: cc.Vec3 = cc.v3(1, 0);
    isStab = true;//刺
    isFar = false;//近程
    isFist = true;//空手 
    dungeon: Dungeon;
    weaponFirePoint: cc.Node;//剑尖
    isMiss = false;
    drainSkill = new Skill();
    isReflect = false;//子弹偏转
    static readonly COMBO1:number = 1;
    static readonly COMBO2:number = 2;
    static readonly COMBO3:number = 3;
    comboType = 0;
    isComboing = false;
    hasTargetMap: { [key: string]: number } = {};
    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.player = this.playerNode.getComponent(Player);
        this.weaponFirePoint = this.node.getChildByName('firepoint');
        this.handStab = this.stabWeapon.node.getChildByName('hand');
        this.handWave = this.waveWeapon.node.getChildByName('hand');
        this.glovesStabSprite = this.handStab.getChildByName('gloves').getComponent(cc.Sprite);
        this.glovesWaveSprite= this.handWave .getChildByName('gloves').getComponent(cc.Sprite);

        // this.stabWeapon.meleeWeapon = this;
        // this.waveWeapon.meleeWeapon = this;
    }
    setHands(){
        if(this.isStab){
            this.handStab.opacity = 255;
            this.handWave.opacity = 0;
        }else{
            this.handStab.opacity = 0;
            this.handWave.opacity = 255;
        }
    }
    setHv(hv: cc.Vec3) {
        let pos = this.hasNearEnemy();
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.rotateColliderManager(cc.v3(this.node.position.x + pos.x, this.node.position.y + pos.y));
            this.hv = pos;
        } else {
            this.hv = hv.normalizeSelf();
        }
    }
    getHv(): cc.Vec3 {
        return this.hv;
    }

    updateCombo(){
        if(this.comboType == MeleeWeapon.COMBO1){
            this.comboType = MeleeWeapon.COMBO2;
            if(this.isFist){
                this.comboType = MeleeWeapon.COMBO1;
            }
        }else if(this.comboType == MeleeWeapon.COMBO2){
            this.comboType = MeleeWeapon.COMBO3;
        }else if(this.comboType == MeleeWeapon.COMBO3){
            this.comboType = MeleeWeapon.COMBO1;
        }else{
            this.comboType = MeleeWeapon.COMBO1; 
        }
        if(!this.isComboing){
            this.comboType = MeleeWeapon.COMBO1;
            this.isComboing = true;
        }
    }
    attack(data: PlayerData, isMiss: boolean): boolean {
        if (this.isAttacking) {
            return false;
        }
        this.hasTargetMap = {};
        this.updateCombo();
        
        this.isMiss = isMiss;
        this.isAttacking = true;
        let animSpeed = 1 + data.getAttackSpeed() / 1000;
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
        let waves = [data.getIceDamage() > 0 && ran < data.getIceRate() ? MeleeWeapon.ELEMENT_TYPE_ICE : 0
            , data.getFireDamage() > 0 && ran < data.getFireRate() ? MeleeWeapon.ELEMENT_TYPE_FIRE : 0
            , data.getLighteningDamage() > 0 && ran < data.getLighteningRate() ? MeleeWeapon.ELEMENT_TYPE_LIGHTENING : 0
            , data.getToxicDamage() > 0 && ran < data.getToxicRate() ? MeleeWeapon.ELEMENT_TYPE_TOXIC : 0
            , data.getCurseDamage() > 0 && ran < data.getCurseRate() ? MeleeWeapon.ELEMENT_TYPE_CURSE : 0];
        for (let w of waves) {
            this.getWaveLight(this.dungeon.node, p, w, this.isStab, this.isFar);
        }
        return true;

    }
    private getAttackAnimName(): string {
        let name = "MeleeAttackStab";
        if (!this.isFar && this.isStab) {
            name = "MeleeAttackStab";
        } else if (this.isFar && this.isStab) {
            name = "MeleeAttackStabFar";
        } else if (this.isFar && !this.isStab) {
            name = "MeleeAttackFar";
        } else {
            name = "MeleeAttack";
        }
        return name+this.getComboSuffix();
    }
    private getComboSuffix():string{
        if(this.comboType == MeleeWeapon.COMBO1){
            return '1';
        }else if(this.comboType == MeleeWeapon.COMBO2){
            return '2';
        }else if(this.comboType == MeleeWeapon.COMBO3){
            return '3';
        }else{
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
        firePrefab.zIndex = 4000;
        firePrefab.opacity = 255;
        firePrefab.active = true;
        let action = cc.sequence(cc.moveTo(0.025, cc.v2(ps[1])), cc.moveTo(0.05, cc.v2(ps[2])), cc.moveTo(0.075, cc.v2(ps[3])), cc.moveTo(0.1, cc.v2(ps[4])));
        firePrefab.runAction(action);

    }
    //Anim
    MeleeAttackFinish() {
        this.scheduleOnce(()=>{
            this.isAttacking = false;
        },0.05);
        this.scheduleOnce(()=>{
            if(!this.isAttacking){
                this.isComboing = false;
            }
        },0.6);
    }
    //Anim
    ExAttackTime(){
        this.player.remoteExAttack(this.comboType);
    }
    /**Anim 清空攻击列表*/
    RefreshTime(){
        this.hasTargetMap = {};
    }
    /**Anim 冲刺*/
    DashTime(){
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.DASH } });
        let speed = 800;
        this.schedule(() => {
            this.player.getWalkSmoke(this.node.parent, this.node.position);
        }, 0.05, 4, 0);
        let pos = cc.v2(this.hv.x,this.hv.y);
        this.player.isMoving = false;
        this.player.isWeaponDashing = true;
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = this.player.isFaceRight ? cc.v2(1, 0) : cc.v2(-1, 0);
        } else {
            pos = pos.normalizeSelf();
        }
        let posv3 = cc.v3(pos.x,pos.y);
        this.hv = posv3.clone();
        pos = pos.mul(speed);
        this.player.rigidbody.linearVelocity = pos;
        this.scheduleOnce(() => {
            this.player.isWeaponDashing = false;
            this.player.rigidbody.linearVelocity = cc.Vec2.ZERO;
            this.player.playerAnim(Player.STATE_IDLE,this.player.currentDir);
            this.player.resetFoot();
        }, 0.2)
    }
    start() {
    }

    getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(Random.rand() * (max - min));
    }

    update(dt) {

        let pos = this.hasNearEnemy();
        if (!pos.equals(cc.Vec3.ZERO)) {
            if(!this.isAttacking){
                this.rotateColliderManager(cc.v3(this.node.position.x + pos.x, this.node.position.y + pos.y));
            }
            this.hv = pos;
        } else if ((this.hv.x != 0 || this.hv.y != 0) && !this.isAttacking) {
            let olderTarget = cc.v3(this.node.position.x + this.hv.x, this.node.position.y + this.hv.y);
            this.rotateColliderManager(olderTarget);
        }
    }
    hasNearEnemy() {

        let olddis = 1000;
        let pos = cc.v3(0, 0);
        if (this.dungeon) {
            for (let monster of this.dungeon.monsters) {
                let dis = Logic.getDistance(this.node.parent.position, monster.node.position);
                if (dis < 200 && dis < olddis && !monster.isDied) {
                    olddis = dis;
                    let p = this.node.position.clone();
                    p.x = this.node.scaleX > 0 ? p.x : -p.x;
                    pos = monster.getCenterPosition().sub(this.node.parent.position.add(p));
                }
            }

            if (pos.equals(cc.Vec3.ZERO)) {
                for (let boss of this.dungeon.bosses) {
                    let dis = Logic.getDistance(this.node.parent.position, boss.node.position);
                    if (dis < 200 && dis < olddis && !boss.isDied) {
                        olddis = dis;
                        let p = this.node.position.clone();
                        p.x = this.node.scaleX > 0 ? p.x : -p.x;
                        pos = boss.getCenterPosition().sub(this.node.parent.position.add(p));
                    }
                }

            }
            if (olddis != 1000) {
                pos = pos.normalizeSelf();
            }
        }
        return pos;
    }

    rotateColliderManager(target: cc.Vec3) {
        // 鼠标坐标默认是屏幕坐标，首先要转换到世界坐标
        // 物体坐标默认就是世界坐标
        // 两者取差得到方向向量
        let direction = target.sub(this.node.position);
        // 方向向量转换为角度值
        let Rad2Deg = 360 / (Math.PI * 2);
        let angle: number = 360 - Math.atan2(direction.x, direction.y) * Rad2Deg;
        let offsetAngle = 90;
        this.node.scaleX = this.node.parent.scaleX;
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
        this.node.angle = this.node.scaleX < 0 ? -angle : angle;

    }
    // onBeginContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
    // }
    // onCollisionEnter(other: cc.Collider, self: cc.CircleCollider) {
    //     if(self.radius>0){
    //         this.attacking(other);
    //     }
    // }
    onCollisionStay(other: cc.Collider, self: cc.CircleCollider) {
        if(self.radius>0){
            if(this.hasTargetMap[other.node.uuid]&&this.hasTargetMap[other.node.uuid]>0){
                this.hasTargetMap[other.node.uuid]++;
            }else{
                this.hasTargetMap[other.node.uuid] = 1;
                this.attacking(other);
            }
        }
    }
    beatBack(node: cc.Node) {
        let rigidBody: cc.RigidBody = node.getComponent(cc.RigidBody);
        let pos = this.getHv().clone();
        if (pos.equals(cc.Vec3.ZERO)) {
            pos = cc.v3(1, 0);
        }
        let power = 50;
        if (!this.isFar && this.isStab) {
            power = 50;
        } else if (this.isFar && this.isStab) {
            power = 300;
        } else if (!this.isFar && !this.isStab) {
            power = 200;
        } else {
            power = 50;
        }
        if(this.comboType == MeleeWeapon.COMBO3){
            power+=50;
        }
        pos = pos.normalizeSelf().mul(power);
        rigidBody.applyLinearImpulse(cc.v2(pos.x,pos.y), rigidBody.getLocalCenter(), true);
    }
    attacking(attackTarget: cc.Collider) {
        if (!attackTarget || !this.isAttacking) {
            return;
        }
        // this.waveWeapon.isAttacking = true;
        // this.stabWeapon.isAttacking = true;
        let damage = new DamageData();
        if (this.player) {
            damage = this.player.data.getFinalAttackPoint();
        }
        let damageSuccess = false;
        let attackSuccess = false;
        let monster = attackTarget.node.getComponent(Monster);
        if (monster && !monster.isDied && !this.isMiss) {
            damage.isBackAttack = monster.isPlayerBehindAttack()&&this.player.data.getDamageBack()>0;
            if(damage.isBackAttack){
                damage.realDamage += this.player.data.getDamageBack();
            }
            damageSuccess = monster.takeDamage(damage);
            if (damageSuccess) {
                this.beatBack(monster.node);
                this.addMonsterAllStatus(monster);
            }
        }

        let boss = attackTarget.node.getComponent(Boss);
        if (boss && !boss.isDied && !this.isMiss) {
            damageSuccess = boss.takeDamage(damage);
            if (damageSuccess) {
                this.addBossAllStatus(boss);
            }
        }

        let box = attackTarget.node.getComponent(Box);
        if (box) {
            attackSuccess = true;
            box.breakBox();
        }
        let decorate = attackTarget.node.getComponent(Decorate);
        if(decorate&&decorate.data.status==0){
            attackSuccess = true;
            decorate.breakBox();
        }
        //生命汲取,内置1s cd
        if(damageSuccess){
            this.drainSkill.next(() => {
                let drain = this.player.data.getLifeDrain();
                if (drain > 0) {
                    this.player.takeDamage(new DamageData(-drain));
                }
            }, 1, true);
        }
        
        this.isMiss = false;
        //停顿
        if(damageSuccess||attackSuccess){
            this.anim.pause();
            cc.director.emit(EventHelper.CAMERA_SHAKE,{detail:{isHeavyShaking:this.comboType==MeleeWeapon.COMBO3}});
            this.scheduleOnce(()=>{this.anim.resume()},0.1);
        }
    }
    addMonsterAllStatus(monster: Monster) {
        this.addMonsterStatus(this.player.data.getIceRate(), monster, StatusManager.FROZEN);
        this.addMonsterStatus(this.player.data.getFireRate(), monster, StatusManager.BURNING);
        this.addMonsterStatus(this.player.data.getLighteningRate(), monster, StatusManager.DIZZ);
        this.addMonsterStatus(this.player.data.getToxicRate(), monster, StatusManager.TOXICOSIS);
        this.addMonsterStatus(this.player.data.getCurseRate(), monster, StatusManager.CURSING);
        this.addMonsterStatus(this.player.data.getRealRate(), monster, StatusManager.BLEEDING);
    }
    addBossAllStatus(boss: Boss) {
        this.addBossStatus(this.player.data.getIceRate(), boss, StatusManager.FROZEN);
        this.addBossStatus(this.player.data.getFireRate(), boss, StatusManager.BURNING);
        this.addBossStatus(this.player.data.getLighteningRate(), boss, StatusManager.DIZZ);
        this.addBossStatus(this.player.data.getToxicRate(), boss, StatusManager.TOXICOSIS);
        this.addBossStatus(this.player.data.getCurseRate(), boss, StatusManager.CURSING);
        this.addBossStatus(this.player.data.getRealRate(), boss, StatusManager.BLEEDING);
    }
    addMonsterStatus(rate: number, monster: Monster, statusType) {
        if (Logic.getRandomNum(0, 100) < rate) { monster.addStatus(statusType,new FromData()); }
    }
    addBossStatus(rate: number, boss: Boss, statusType) {
        if (Logic.getRandomNum(0, 100) < rate) { boss.addStatus(statusType,new FromData()); }
    }

}
