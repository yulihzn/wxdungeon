import Actor from "../Base/Actor";
import DamageData from "../Data/DamageData";
import FromData from "../Data/FromData";
import { EventHelper } from "../EventHelper";
import Logic from "../Logic";
import Shooter from "../Shooter";
import FireGhost from "./FireGhost";
import Talent from "./Talent";
import AudioPlayer from "../Utils/AudioPlayer";
import IndexZ from "../Utils/IndexZ";
import StatusManager from "../Manager/StatusManager";
import PlayerAvatar from "../PlayerAvatar";
import NonPlayer from "../NonPlayer";
import Boss from "../Boss/Boss";
import AreaOfEffectData from "../Data/AreaOfEffectData";
import NonPlayerManager from "../Manager/NonPlayerManager";
import ActorUtils from "../Utils/ActorUtils";
import Player from "../Player";
import CoolDownView from "../UI/CoolDownView";
import TalentData from "../Data/TalentData";

/**
 * 技能管理器
 * 通用技能点：cd减短 范围变大 持续时间增加 伤害增加 数量变多
 * 上班族
 * 投掷手雷：雇佣兵扔出一颗手雷d 数量变多3,5,8 手雷伤害提高 爆炸范围提高 cd变短 
 * 治疗针:回复2点生命d 回复3，5点 cd减短 范围治疗 
 * 厨神附体：厨师掏出勺子造成一点伤害，被干掉的怪物会有几率变成食物，不同怪物变成的食物不一样，或者变成黑暗料理，食物可以拾取d 造成当前攻击力伤害，提高食物几率
 * 研究员
 * 疯狂射击：海盗10s内子弹数目变多 可以提高子弹数目d
 * 闪瞎狗眼：记者用随时携带的照相机亮瞎对面，造成一定时间眩晕同时提高100的移动速度5s 可以提高眩晕时间和速度持续时间d
 * 疯狗剑法：剑术大师能快速出招使用剑花造成连续3次伤害，拿剑的时候效果不一样 可以提高次数伤害和附带冰火雷伤害d
 * 潜伏闷棍：杀手进入隐身状态10s，破隐一击 可以提高隐身持续时间和破隐一击伤害d
 * 妙手摘星：伸出手偷取对方一件物品或者金币，可以提高伤害，金币数量和装备品质d
 * 商人
 * 精准点射：警长用枪10s内远程暴击100%伤害+2 可以提高持续时间和暴击伤害附带冰火雷伤害d
 * 扫帚轮舞：清洁工挥舞一圈扫帚造成伤害并清空范围内所有远程攻击 可以反弹子弹和附带冰火雷伤害d
 * 消防员
 * 奥术飞弹：魔法师使用奥术飞弹，可以附带冰火雷替换为冰柱火球雷电d
 * 迅捷冲刺：运动员可以快速冲刺一段距离躲避伤害 提高冲刺距离和附带冰火雷路径d
 * 程序员
 * 醉酒乌云：调酒师扔出多个酒瓶制造一片酒云，范围内所有怪物60%miss持续3s 提高miss几率和酒云持续时间附带冰火雷状态
 * 分身之术：忍者分出两个分身杀敌，分身有1点攻击，被攻击就消失 可以提高分身伤害和数量，附带冰火雷爆炸
 * 武僧:如来神掌
 * 
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class ProfessionTalent extends Talent {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(cc.Prefab)
    aoe: cc.Prefab = null;
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
    @property(cc.Prefab)
    smokePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    skyhandPrefab: cc.Prefab = null;
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
    init(data: TalentData) {
        super.init(data);
        this.coolDownId = CoolDownView.PROFESSION;
        this.initCoolDown(data,1);
        
    }

    protected doSkill() {
        switch (this.data.resName) {
            case Talent.TALENT_000: break;
            case Talent.TALENT_001:
                AudioPlayer.play(AudioPlayer.MELEE_PARRY);
                this.shoot(this.player.shooterEx, 0, 0, 'bullet040', null, null); break;
            case Talent.TALENT_002: this.healing(); break;
            case Talent.TALENT_003: this.cooking(); break;
            case Talent.TALENT_004: this.showIceThron(); break;
            case Talent.TALENT_005: this.rageShoot(); break;
            case Talent.TALENT_006: this.flash(); break;
            case Talent.TALENT_007: this.addSwordLight(); break;
            case Talent.TALENT_008: this.player.addStatus(StatusManager.TALENT_INVISIBLE, new FromData()); break;
            case Talent.TALENT_009: this.steal(); break;
            case Talent.TALENT_010: break;
            case Talent.TALENT_011: this.aimedShoot(); break;
            case Talent.TALENT_012: this.showFireBall(); break;
            case Talent.TALENT_013: this.addBroom(); break;
            case Talent.TALENT_014:
                AudioPlayer.play(AudioPlayer.SKILL_MAGICBALL1);
                this.shoot(this.player.shooterEx, Shooter.ARC_EX_NUM_8, 0, 'bullet035', null, null);
                break;
            case Talent.TALENT_015: this.dash(); break;
            case Talent.TALENT_016: this.addClearCircle(); break;
            case Talent.TALENT_017: this.showSmoke(); break;
            case Talent.TALENT_018: this.addShadowFighter(); break;
            case Talent.TALENT_019: this.jump(); break;
        }
    }
    private addClearCircle() {
        this.player.stopAllDebuffs();
        this.addAoe(this.aoe, this.player.getCenterPosition(), new AreaOfEffectData()
            .init(2, 0.2, 0, 2, IndexZ.getActorZIndex(this.player.getCenterPosition())
                , false, false, true, false, false, new DamageData(0), new FromData(), [])
            , ['clearcircle1', 'clearcircle2', 'clearcircle3', 'clearcircle4'], false, true);
    }
    private addShadowFighter() {
        for (let i = 0; i < 3; i++) {
            this.player.weaponRight.meleeWeapon.dungeon.nonPlayerManager
                .addNonPlayerFromData(NonPlayerManager.NON_SHADOW, this.player.node.position, this.player.weaponRight.meleeWeapon.dungeon);
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
        AudioPlayer.play(AudioPlayer.TAKEPHOTO);
        cc.tween(this.sprite.node).call(() => {
            this.player.addStatus(StatusManager.TALENT_FLASH_SPEED, new FromData());
            this.sprite.spriteFrame = Logic.spriteFrameRes('flash');
            this.sprite.node.width = 128;
            this.sprite.node.height = 128;
            this.sprite.node.opacity = 255;
            this.sprite.node.position = cc.v3(0, 32);
        }).to(0.1, { opacity: 0 }).call(() => {
            this.sprite.spriteFrame = Logic.spriteFrameRes('singleColor');
            this.sprite.node.width = 2000;
            this.sprite.node.height = 2000;
            this.sprite.node.opacity = 255;
        }).to(0.1, { opacity: 0 }).call(() => {
            this.addStatus2NearEnemy(StatusManager.TALENT_FLASH_DIZZ, 400);
            this.sprite.spriteFrame = null;
        }).start();

    }
    private aimedShoot() {
        AudioPlayer.play(AudioPlayer.RELOAD);
        cc.tween(this.sprite.node).call(() => {
            this.player.addStatus(StatusManager.TALENT_AIMED, new FromData());
            this.sprite.spriteFrame = Logic.spriteFrameRes('talentshoot');
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
        this.player.sc.isMoving = false;
        if (pos.equals(cc.Vec2.ZERO)) {
            // pos = this.player.isFaceRight ? cc.v2(1, 0) : cc.v2(-1, 0);
            pos = cc.v2(this.player.Hv.clone());
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
    private jump() {
        AudioPlayer.play(AudioPlayer.DASH);
        if (!this.player.jump()) {
            this.talentSkill.IsExcuting = false;
            this.refreshCooldown();
        }
        this.scheduleOnce(() => {
            AudioPlayer.play(AudioPlayer.BOOM);
            let d = this.player.data.getFinalAttackPoint();
            d.isMelee = true;
            this.player.shooterEx.fireAoe(this.skyhandPrefab, new AreaOfEffectData()
                .init(0, 0.15, 0, 2 + Logic.chapterMaxIndex, IndexZ.OVERHEAD, false, true, true, false, false, d, new FromData(), [StatusManager.DIZZ]));
            this.talentSkill.IsExcuting = false;
        }, 0.8)
    }
    private steal() {
        AudioPlayer.play(AudioPlayer.FIREBALL);
        this.sprite.node.width = 128;
        this.sprite.node.height = 128;
        this.sprite.node.opacity = 255;
        this.sprite.node.scale = 1;
        this.sprite.node.position = cc.v3(0, 128);
        let node = ActorUtils.getNearestEnemyActor(this.player, false, this.player.weaponRight.meleeWeapon.dungeon);
        if (!node) {
            return;
        }
        let monster = node.getComponent(NonPlayer);
        let boss = node.getComponent(Boss);
        if (monster && monster.data.isTest < 1) {
            monster.getLoot();
        }
        if (boss) {
            boss.getLoot();
        }
        cc.tween(this.sprite.node).call(() => { this.sprite.spriteFrame = Logic.spriteFrameRes('talenthand01'); })
            .delay(0.2).call(() => { this.sprite.spriteFrame = Logic.spriteFrameRes('talenthand02'); })
            .delay(0.2).call(() => { this.sprite.spriteFrame = Logic.spriteFrameRes('talenthand03'); })
            .delay(0.2).call(() => { this.sprite.spriteFrame = Logic.spriteFrameRes('talenthand04'); })
            .delay(0.2).call(() => {
                this.sprite.spriteFrame = null;
            }).start();
    }

    showSmoke() {
        AudioPlayer.play(AudioPlayer.MELEE_PARRY);
        let d = new DamageData();
        d.magicDamage = 3 + Logic.chapterMaxIndex;
        this.shoot(this.player.shooterEx, 0, 0, 'bullet041', this.smokePrefab, new AreaOfEffectData().init(
            7, 0.1, 0, 1, IndexZ.OVERHEAD, false, false, false, false, false, new DamageData(), new FromData(), [StatusManager.WINE_CLOUD]
        ));
    }
    private showFireBall() {
        AudioPlayer.play(AudioPlayer.SKILL_FIREBALL);
        let d = new DamageData();
        d.magicDamage = 3 + Logic.chapterMaxIndex;
        d.isMelee = true;
        this.player.shooterEx.fireAoe(this.fireball, new AreaOfEffectData()
            .init(0, 0.1, 0, 4, IndexZ.OVERHEAD, false, true, true, false, true, d, new FromData(), [StatusManager.BURNING]));
    }
    private showIceThron() {
        this.scheduleOnce(() => { AudioPlayer.play(AudioPlayer.SKILL_ICETHRON); }, 1);
        const angles1 = [0, 45, 90, 135, 180, 225, 270, 315];
        const posRight = [cc.v3(0, 100), cc.v3(-60, 60), cc.v3(-100, 0), cc.v3(-60, -60), cc.v3(0, -100), cc.v3(60, -60), cc.v3(100, 0), cc.v3(60, 60)];
        const posLeft = [cc.v3(0, -100), cc.v3(-60, -60), cc.v3(-100, 0), cc.v3(-60, 60), cc.v3(0, 100), cc.v3(60, 60), cc.v3(100, 0), cc.v3(60, -60)];
        let a1 = [angles1];
        let a = a1;
        let d = new DamageData();
        d.magicDamage = 3 + Logic.chapterMaxIndex;
        d.isMelee = true;
        let index = 0;
        for (let i = 0; i < a[index].length; i++) {
            this.player.shooterEx.fireAoe(this.icethron, new AreaOfEffectData()
                .init(0, 2, 0, 3, IndexZ.OVERHEAD, false, true, true, false, true, d, new FromData(), [StatusManager.FROZEN]), cc.v3(this.player.isFaceRight ? posRight[i] : posLeft[i]), angles1[i], null, true);
        }
    }


    changePerformance() {

    }

    takeDamage(damageData: DamageData, actor?: Actor) {
        return false;
    }
    private addLighteningFall(isArea: boolean, damagePoint: number) {
        EventHelper.emit(EventHelper.DUNGEON_ADD_LIGHTENINGFALL, { pos: ActorUtils.getNearestEnemyPosition(this.player, false, this.player.weaponRight.meleeWeapon.dungeon, true), showArea: isArea, damage: damagePoint })
    }
    private addBroom() {
        AudioPlayer.play(AudioPlayer.MELEE_PARRY);
        let d = this.player.data.getFinalAttackPoint();
        d.isMelee = true;
        this.player.shooterEx.fireAoe(this.broomPrefab, new AreaOfEffectData()
            .init(0, 0.5, 0.2, 1.5, IndexZ.OVERHEAD, false, true, true, true, true, d, new FromData(), [StatusManager.FROZEN]), cc.v3(0, 32));
    }

    private cooking() {
        AudioPlayer.play(AudioPlayer.MELEE_PARRY);
        let d = this.player.data.getFinalAttackPoint();
        d.isMelee = true;
        this.player.shooterEx.fireAoe(this.cookingPrefab, new AreaOfEffectData()
            .init(0, 2, 0, 1, IndexZ.OVERHEAD, false, false, false, false, false, d, new FromData(), []), cc.v3(0, 32), 0, (actor: Actor) => {
                let monster = actor.node.getComponent(NonPlayer);
                if (monster) {
                    monster.dungeon.addItem(monster.node.position.clone(), `food${monster.data.resName.replace('monster', '')}`);
                }
                let boss = actor.node.getComponent(Boss);
                if (boss) {
                    boss.dungeon.addItem(boss.node.position.clone(), `foodboss${boss.data.resName.replace('iconboss', '')}`);
                }
            });
    }
    private addSwordLight() {
        AudioPlayer.play(AudioPlayer.SKILL_MAGICBALL);
        AudioPlayer.play(AudioPlayer.SWORD_SHOW);
        let d = new DamageData();
        d.isMelee = true;
        let scale = 5;
        d.physicalDamage = 2 + Logic.chapterMaxIndex;
        if (this.player.weaponRight.meleeWeapon.IsSword) {
            d = this.player.data.getFinalAttackPoint();
            scale = 6;
        }
        let swordlight = this.player.shooterEx.fireAoe(this.swordLightPrefab, new AreaOfEffectData()
            .init(0, 0.35, 0, scale, IndexZ.OVERHEAD, false, true, true, false, true, d, new FromData(), [StatusManager.FROZEN]));
        if (this.player.weaponRight.meleeWeapon.IsSword) {
            swordlight.node.getChildByName('sprite').color = cc.Color.RED;
        }
        this.scheduleOnce(() => {
            this.talentSkill.IsExcuting = false;
        }, 1)
    }

    private initFireGhosts() {
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




}