import { EventHelper } from "../EventHelper";
import Talent from "./Talent";
import DashShadow from "../Item/DashShadow";
import Player from "../Player";
import DamageData from "../Data/DamageData";
import Monster from "../Monster";
import Boss from "../Boss/Boss";
import StatusManager from "../Manager/StatusManager";
import AudioPlayer from "../Utils/AudioPlayer";
import FromData from "../Data/FromData";
import Shooter from "../Shooter";
import MagicCircle from "./MagicCircle";
import MagicIce from "./MagicIce";
import Actor from "../Base/Actor";
import MagicBall from "./MagicBall";
import FireGhost from "./FireGhost";
import Logic from "../Logic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TalentMagic extends Talent {

    @property(MagicCircle)
    magiccircle: MagicCircle = null;
    @property(MagicIce)
    magicice: MagicIce = null;
    @property(cc.Prefab)
    magicball: cc.Prefab = null;
    @property(cc.Prefab)
    fireGhost: cc.Prefab = null;
    @property(cc.Node)
    magicLightening: cc.Node = null;
    fireGhostNum = 0;
    ghostPool: cc.NodePool;
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
        this.magicLightening.opacity = 0;
        super.init();
        this.scheduleOnce(() => {
            if (this.hashTalent(Talent.MAGIC_07)) {
                this.player.addStatus(this.hashTalent(TalentMagic.MAGIC_06) ? StatusManager.MAGIC_WEAPON_STRONG : StatusManager.MAGIC_WEAPON, new FromData());
            }
            if (this.hashTalent(Talent.MAGIC_13) && !this.magicice.isShow) {
                this.magicice.showIce();
            }
            if (this.hashTalent(Talent.MAGIC_10)) {
                this.initFireGhosts();
            }
            if (this.hashTalent(TalentMagic.MAGIC_16)) {
                this.showLightening();
            }
        }, 0.2)
    }

    useSKill() {
        this.useMagic();
    }
    useMagic() {
        if (!this.talentSkill) {
            return;
        }
        if (this.talentSkill.IsExcuting) {
            return;
        }
        let cooldown = 7;
        if (this.hashTalent(Talent.MAGIC_04)) {
            cooldown = 3;
        }

        this.talentSkill.next(() => {
            this.talentSkill.IsExcuting = true;
            this.magiccircle.talentMaigc = this;
            this.magiccircle.playMagic(this.hashTalent(Talent.MAGIC_03) ? 2 : 1);
            // cc.director.emit(EventConstant.PLAY_AUDIO, { detail: { name: AudioPlayer.DASH } });
            cc.director.emit(EventHelper.HUD_CONTROLLER_COOLDOWN, { detail: { cooldown: cooldown, talentType: 3 } });
        }, cooldown, true);
    }
    //anim
    MagicFinish() {
        if (this.hashTalent(Talent.MAGIC_09)) {
            this.showMagicBall(MagicBall.FIRE, true);
        } else if (this.hashTalent(Talent.MAGIC_08)) {
            this.showMagicBall(MagicBall.FIRE, false);
        } else if (this.hashTalent(Talent.MAGIC_12)) {
            this.shoot(this.player.shooterEx, this.hashTalent(Talent.MAGIC_06) ? 'bullet137' : 'bullet037');
        } else if (this.hashTalent(Talent.MAGIC_11)) {
            this.shoot(this.player.shooterEx, this.hashTalent(Talent.MAGIC_06) ? 'bullet136' : 'bullet036');
        } else if (this.hashTalent(Talent.MAGIC_15)) {
            this.showMagicBall(MagicBall.LIGHTENING, true);
        } else if (this.hashTalent(Talent.MAGIC_14)) {
            this.showMagicBall(MagicBall.LIGHTENING, false);
        } else if (this.hashTalent(Talent.MAGIC_01)) {
            this.shoot(this.player.shooterEx, this.hashTalent(Talent.MAGIC_06) ? 'bullet135' : 'bullet035');
        }
    }
    showMagicBall(ballType: number, isBig: boolean) {
        cc.instantiate(this.magicball).getComponent(MagicBall).show(this.player, ballType, isBig, 0);
        if (this.hashTalent(Talent.MAGIC_02)) {
            cc.instantiate(this.magicball).getComponent(MagicBall).show(this.player, ballType, isBig, 30);
            cc.instantiate(this.magicball).getComponent(MagicBall).show(this.player, ballType, isBig, -30);
        }
    }
    private shoot(shooter: Shooter, bulletType: string) {
        shooter.data.bulletType = bulletType;
        shooter.data.bulletArcExNum = 0;
        if (this.hashTalent(Talent.MAGIC_02)) {
            shooter.data.bulletArcExNum = 2;
        }
        shooter.data.bulletLineExNum = 0;
        shooter.fireBullet(0);
    }

    changePerformance() {

    }
    takeIce(): boolean {
        if (this.hashTalent(Talent.MAGIC_13) && this.magicice.isShow) {
            this.addStatus2NearEnemy(StatusManager.FROZEN, 300);
            this.magicice.breakIce();
            return true;
        }
        return false;
    }
    takeDamage(damageData: DamageData, actor?: Actor) {

    }
    showLightening() {
        this.magicLightening.opacity = 128;
        this.magicLightening.scale = 1;
        this.magicLightening.runAction(cc.sequence(cc.scaleTo(1, 10), cc.callFunc(() => {
            this.addStatus2NearEnemy(StatusManager.DIZZ, 300);
            this.magicLightening.opacity = 0;
            this.magicLightening.scale = 1;
        })));
    }
    initFireGhosts() {
        let length = 5;
        let count = this.fireGhostNum;
        for (let i = 0; i < length-count; i++) {
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

    addStatus2NearEnemy(statusName: string, range: number) {
        if (!this.player) {
            return cc.Vec3.ZERO;
        }
        for (let monster of this.player.meleeWeapon.dungeon.monsters) {
            let dis = Logic.getDistance(this.node.position, monster.node.position);
            if (dis < range && !monster.isDied && !monster.isDisguising) {
                monster.addStatus(statusName, new FromData());
            }
        }
        for (let boss of this.player.meleeWeapon.dungeon.bosses) {
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