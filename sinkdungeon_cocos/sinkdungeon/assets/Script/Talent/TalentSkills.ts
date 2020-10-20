import Actor from "../Base/Actor";
import DamageData from "../Data/DamageData";
import FromData from "../Data/FromData";
import { EventHelper } from "../EventHelper";
import Logic from "../Logic";
import Shooter from "../Shooter";
import FireBall from "./FireBall";
import FireGhost from "./FireGhost";
import IceThron from "./IceThron";
import Talent from "./Talent";
import AudioPlayer from "../Utils/AudioPlayer";
import IndexZ from "../Utils/IndexZ";
import StatusManager from "../Manager/StatusManager";
import PlayerAvatar from "../PlayerAvatar";
import FrontHitArea from "./FrontHitArea";
import Monster from "../Monster";
import Boss from "../Boss/Boss";
import CircleHitArea from "./CircleHitArea";

/**
 * 技能管理器
 * 上班族
 * 投掷手雷：雇佣兵扔出一颗手雷d
 * 治疗针:回复2点生命d
 * 厨神附体：厨师掏出勺子造成一点真实伤害被干掉的怪物会变成食物，不同怪物变成的食物不一样，食物可以拾取
 * 研究员
 * 疯狂射击：海盗10s内子弹数目变多 可以提高子弹数目d
 * 闪瞎狗眼：记者用随时携带的照相机亮瞎对面，造成一定时间眩晕同时提高100的移动速度5s 可以提高眩晕时间和速度持续时间d
 * 疯狗剑法：剑术大师能快速出招使用剑花造成连续3次伤害，拿剑的时候效果不一样 可以提高次数伤害和附带冰火雷伤害d
 * 潜伏闷棍：杀手进入隐身状态10s，破隐一击 可以提高隐身持续时间和破隐一击伤害d
 * 妙手摘星：伸出手偷取对方一件物品或者金币，造成1点伤害一个怪物只能掉落一次，进入房间只有第一只会掉落装备或者道具，可以提高伤害，金币数量和装备品质
 * 商人
 * 精准点射：警长用枪10s内远程暴击100%伤害+2 可以提高持续时间和暴击伤害附带冰火雷伤害d
 * 扫帚轮舞：清洁工挥舞一圈扫帚造成伤害并清空范围内所有远程攻击 可以反弹子弹和附带冰火雷伤害d
 * 消防员
 * 奥术飞弹：魔法师使用奥术飞弹，可以附带冰火雷替换为冰柱火球雷电d
 * 迅捷冲刺：运动员可以快速冲刺一段距离躲避伤害 提高冲刺距离和附带冰火雷路径d
 * 程序员
 * 醉酒乌云：调酒师扔出多个酒瓶制造一片酒云，范围内所有怪物60%miss持续3s 提高miss几率和酒云持续时间附带冰火雷状态
 * 分身之术：忍者分出两个分身杀敌，分身有1点攻击，被攻击就消失 可以提高分身伤害和数量，附带冰火雷爆炸
 * 武僧
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class TalentSkills extends Talent {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(cc.Prefab)
    fireball: cc.Prefab = null;
    @property(cc.Prefab)
    icethron: cc.Prefab = null;
    @property(cc.Prefab)
    fireGhost: cc.Prefab = null;
    @property(cc.Prefab)
    healingLight: cc.Prefab = null;
    @property(cc.Prefab)
    rageLight: cc.Prefab = null;
    @property(cc.Prefab)
    broomPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    cookingPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    swordLightPrefab: cc.Prefab = null;
    fireGhostNum = 0;
    ghostPool: cc.NodePool;
    hv: cc.Vec3;
    onLoad() {
        this.ghostPool = new cc.NodePool(FireGhost);
        cc.director.on('destoryfireghost', (event) => {
            this.destroyGhost(event.detail.coinNode);
        })
    }
    destroyGhost(ghostNode: cc.Node) {
        if (!ghostNode) {
            return;
        }
        ghostNode.active = false;
        if (this.ghostPool) {
            this.ghostPool.put(ghostNode);
            this.fireGhostNum--;
            cc.log('destroyGhost');
        }
    }
    init() {
        super.init();
        this.scheduleOnce(() => {
            //被动技能加载
        }, 0.2)
    }

    useSKill() {
        if (!this.talentSkill) {
            return;
        }
        if (this.talentSkill.IsExcuting) {
            return;
        }
        let cooldown = this.activeTalentData.cooldown;
        this.talentSkill.next(() => {
            this.talentSkill.IsExcuting = true;
            cc.director.emit(EventHelper.HUD_CONTROLLER_COOLDOWN, { detail: { cooldown: cooldown } });
            this.doSkill();
        }, cooldown, true);
    }

    private doSkill() {
        switch (this.activeTalentData.resName) {
            case Talent.TALENT_000: break;
            case Talent.TALENT_001:
                AudioPlayer.play(AudioPlayer.MELEE_PARRY);
                this.shoot(this.player.shooterEx, 0, 0, 'bullet040'); break;
            case Talent.TALENT_002: this.healing(); break;
            case Talent.TALENT_003: this.cooking();break;
            case Talent.TALENT_004: break;
            case Talent.TALENT_005: this.rageShoot(); break;
            case Talent.TALENT_006: this.flash(); break;
            case Talent.TALENT_007: this.addSwordLight(); break;
            case Talent.TALENT_008: this.player.addStatus(StatusManager.TALENT_INVISIBLE, new FromData()); break;
            case Talent.TALENT_009: this.steal();break;
            case Talent.TALENT_010: break;
            case Talent.TALENT_011: this.aimedShoot(); break;
            case Talent.TALENT_012: this.addBroom(); break;
            case Talent.TALENT_013: break;
            case Talent.TALENT_014:
                AudioPlayer.play(AudioPlayer.SKILL_MAGICBALL);
                this.shoot(this.player.shooterEx, Shooter.ARC_EX_NUM_8, 0, 'bullet035');
                break;
            case Talent.TALENT_015: this.dash(); break;
            case Talent.TALENT_016: break;
            case Talent.TALENT_017: break;
            case Talent.TALENT_018: break;
            case Talent.TALENT_019: break;
        }
    }
    private healing() {
        AudioPlayer.play(AudioPlayer.PICK_ITEM);
        let light = cc.instantiate(this.healingLight);
        light.parent = this.player.node;
        light.position = cc.v3(0, 64);
        light.zIndex = IndexZ.OVERHEAD;
        this.player.addStatus(StatusManager.HEALING, new FromData());
    }

    private rageShoot() {
        AudioPlayer.play(AudioPlayer.PICK_ITEM);
        let light = cc.instantiate(this.rageLight);
        light.parent = this.player.node;
        light.position = cc.v3(0, 64);
        light.zIndex = IndexZ.OVERHEAD;
        this.scheduleOnce(() => {
            this.talentSkill.IsExcuting = false;
            if (light && cc.isValid(light)) {
                light.destroy();
            }
        }, 3);
    }
    private flash() {
        AudioPlayer.play(AudioPlayer.MELEE_PARRY);
        cc.tween(this.sprite.node).call(() => {
            this.player.addStatus(StatusManager.TALENT_FLASH_SPEED, new FromData());
            this.sprite.spriteFrame = Logic.spriteFrames['flash'];
            this.sprite.node.width = 128;
            this.sprite.node.height = 128;
            this.sprite.node.opacity = 255;
            this.sprite.node.position = cc.v3(0, 32);
        }).to(0.1, { opacity: 0 }).call(() => {
            this.sprite.spriteFrame = Logic.spriteFrames['singleColor'];
            this.sprite.node.width = 2000;
            this.sprite.node.height = 2000;
            this.sprite.node.opacity = 255;
        }).to(0.1, { opacity: 0 }).call(() => {
            this.addStatus2NearEnemy(StatusManager.TALENT_FLASH_DIZZ, 400);
            this.sprite.spriteFrame = null;
        }).start();

    }
    private aimedShoot() {
        AudioPlayer.play(AudioPlayer.MELEE_PARRY);
        cc.tween(this.sprite.node).call(() => {
            this.player.addStatus(StatusManager.TALENT_AIMED, new FromData());
            this.sprite.spriteFrame = Logic.spriteFrames['talentshoot'];
            this.sprite.node.width = 64;
            this.sprite.node.height = 64;
            this.sprite.node.opacity = 255;
            this.sprite.node.scale = 1;
            this.sprite.node.position = cc.v3(0, 128);
        }).repeat(5, cc.tween().to(1, { scale: 1.5 }).to(1, { scale: 1 }))
            .call(() => {
                this.sprite.spriteFrame = null;
            }).start();

    }
    private dash() {
        let speed = 1500;
        AudioPlayer.play(AudioPlayer.DASH);
        this.schedule(() => {
            this.player.getWalkSmoke(this.node.parent, this.node.position);
        }, 0.05, 4, 0);
        let pos = this.player.rigidbody.linearVelocity.clone();
        this.player.isMoving = false;
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
            this.player.rigidbody.linearVelocity = cc.Vec2.ZERO;
            this.player.playerAnim(PlayerAvatar.STATE_IDLE, this.player.currentDir);
            this.IsExcuting = false;
        }, 0.5)
    }
    private steal() {
        AudioPlayer.play(AudioPlayer.MELEE_PARRY);
        this.sprite.node.width = 128;
        this.sprite.node.height = 128;
        this.sprite.node.opacity = 255;
        this.sprite.node.scale = 1;
        this.sprite.node.position = cc.v3(0, 128);
        let node = this.getNearestEnmeyNode();
        if(!node){
            return;
        }
        let monster = node.getComponent(Monster);
        let boss = node.getComponent(Boss);
        if(monster){
            monster.getLoot();
        }
        if(boss){
            boss.getLoot();
        }
        cc.tween(this.sprite.node).call(() => {this.sprite.spriteFrame = Logic.spriteFrames['talenthand01'];})
            .delay(0.2).call(() => { this.sprite.spriteFrame = Logic.spriteFrames['talenthand02']; })
            .delay(0.2).call(() => { this.sprite.spriteFrame = Logic.spriteFrames['talenthand03']; })
            .delay(0.2).call(() => { this.sprite.spriteFrame = Logic.spriteFrames['talenthand04']; })
            .delay(0.2).call(() => {
                this.sprite.spriteFrame = null;
            }).start();
    }
 
    showFireBall() {
        AudioPlayer.play(AudioPlayer.SKILL_FIREBALL);
        cc.instantiate(this.fireball).getComponent(FireBall).show(this.player, 0);
        if (this.hashTalent(Talent.MAGIC_02)) {
            cc.instantiate(this.fireball).getComponent(FireBall).show(this.player, 30);
            cc.instantiate(this.fireball).getComponent(FireBall).show(this.player, -30);
        }
    }

    showIceThron() {
        this.scheduleOnce(() => { AudioPlayer.play(AudioPlayer.SKILL_ICETHRON); }, 1);
        const angles1 = [0, 45, 90, 135, 180, 225, 270, 315];
        const angles2 = [15, 60, 105, 150, 195, 240, 285, 330];
        let distance1 = [100];
        let distance2 = [100, 150];
        let distance3 = [100, 150, 200];
        let scale1 = [3];
        let scale2 = [3, 4];
        let scale3 = [3, 4, 5];
        let scale4 = [3, 5];
        let a1 = [angles1];
        let a2 = [angles1, angles2];
        let a3 = [angles1, angles2, angles1];
        let a = a1;
        let scale = scale1;
        let distance = distance1;
        if (this.hashTalent(Talent.MAGIC_02)) {
            a = a2;
            scale = scale2;
            distance = distance2;
        }
        if (this.hashTalent(Talent.MAGIC_12)) {
            a = a2;
            scale = scale4;
            distance = distance2;
            if (this.hashTalent(Talent.MAGIC_02)) {
                a = a3;
                scale = scale3;
                distance = distance3;
            }
        }
        let index = 0;
        this.schedule(() => {
            for (let i = 0; i < a[index].length; i++) {
                cc.instantiate(this.icethron).getComponent(IceThron).show(this.player, a[index][i], distance[index], scale[index]);
            }
            index++;
        }, 0.5, a.length - 1);
    }
    private shoot(shooter: Shooter, bulletArcExNum: number, bulletLineExNum: number, bulletType: string) {
        shooter.data.bulletType = bulletType;
        shooter.data.bulletArcExNum = bulletArcExNum;
        shooter.data.bulletLineExNum = bulletLineExNum;
        shooter.fireBullet(0);
    }

    changePerformance() {

    }

    takeDamage(damageData: DamageData, actor?: Actor) {

    }
    addLighteningFall(isArea: boolean, damagePoint: number) {
        EventHelper.emit(EventHelper.DUNGEON_ADD_LIGHTENINGFALL, { pos: this.getNearestEnemyPosition(), showArea: isArea, damage: damagePoint })
    }
    private addBroom() {
        AudioPlayer.play(AudioPlayer.PICK_UP);
        let b = cc.instantiate(this.broomPrefab);
        if (b) {
            b.getComponent(CircleHitArea).show(this.player,1,0.2,this.activeTalentData.resName,cc.v3(0,32));
        }
    }
    private cooking() {
        AudioPlayer.play(AudioPlayer.MELEE_PARRY);
        let b = cc.instantiate(this.cookingPrefab);
        if (b) {
            b.getComponent(CircleHitArea).show(this.player,1,0.2,this.activeTalentData.resName,cc.v3(0,128));
        }
    }
    private addSwordLight() {
        AudioPlayer.play(AudioPlayer.MELEE_PARRY);
        let b = cc.instantiate(this.swordLightPrefab);
        let d = 1;
        if (this.player.weaponRight.meleeWeapon.IsSword) {
            d = 2;
            b.getChildByName('sprite').color = cc.Color.RED;
        }
        if (b) {
            b.getComponent(FrontHitArea).show(this.player, 0, d, 0.2);
        }
        this.scheduleOnce(() => {
            this.talentSkill.IsExcuting = false;
        }, 1)
    }
    getNearestEnmeyNode():cc.Node{
        let shortdis = 99999;
        let targetNode: cc.Node;
        for (let monster of this.player.weaponRight.meleeWeapon.dungeon.monsterManager.monsterList) {
            if (!monster.isDied) {
                let dis = Logic.getDistance(this.node.position, monster.node.position);
                if (dis < shortdis) {
                    shortdis = dis;
                    targetNode = monster.node;
                }
            }
        }
        for (let boss of this.player.weaponRight.meleeWeapon.dungeon.monsterManager.bossList) {
            if (!boss.isDied) {
                let dis = Logic.getDistance(this.node.position, boss.node.position);
                if (dis < shortdis) {
                    shortdis = dis;
                    targetNode = boss.node;
                }
            }
        }
        if (targetNode) {
            return targetNode;
        }
        return null;
    }
    getNearestEnemyPosition(): cc.Vec3 {
        let targetNode: cc.Node = this.getNearestEnmeyNode();
        if (targetNode) {
            return targetNode.position;
        }
        return this.node.position.addSelf(cc.v3(Logic.getRandomNum(0, 600) - 300, Logic.getRandomNum(0, 600) - 300));
    }

    initFireGhosts() {
        let length = 5;
        let count = this.fireGhostNum;
        for (let i = 0; i < length - count; i++) {
            let ghostNode: cc.Node = null;
            if (this.ghostPool.size() > 0) {
                ghostNode = this.ghostPool.get();
            }
            if (!ghostNode || ghostNode.active) {
                ghostNode = cc.instantiate(this.fireGhost);
            }
            this.fireGhostNum++;
            ghostNode.active = true;
            let fg = ghostNode.getComponent(FireGhost);
            this.player.node.parent.addChild(fg.node);
            fg.init(this.player, i * 72);
        }
    }

    private addStatus2NearEnemy(statusName: string, range: number) {
        if (!this.player) {
            return cc.Vec3.ZERO;
        }
        for (let monster of this.player.weaponRight.meleeWeapon.dungeon.monsterManager.monsterList) {
            let dis = Logic.getDistance(this.node.position, monster.node.position);
            if (dis < range && !monster.isDied && !monster.isDisguising) {
                monster.addStatus(statusName, new FromData());
            }
        }
        for (let boss of this.player.weaponRight.meleeWeapon.dungeon.monsterManager.bossList) {
            let dis = Logic.getDistance(this.node.position, boss.node.position);
            if (dis < range && !boss.isDied) {
                boss.addStatus(statusName, new FromData());
            }
        }
    }
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 10) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt) {
        if (this.isCheckTimeDelay(dt)) {
            this.init();
        }
    }
}