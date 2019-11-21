import { EventConstant } from "../EventConstant";
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class TalentMagic extends Talent {

    @property(MagicCircle)
    magiccircle: MagicCircle = null;
    @property(MagicIce)
    magicice: MagicIce = null;
    @property(cc.Prefab)
    magicball: cc.Prefab = null;
    hv: cc.Vec2;

    onLoad() {
    }
    init() {
        super.init();
        this.scheduleOnce(() => {
            if (this.hashTalent(Talent.MAGIC_07)) {
                this.player.addStatus(this.hashTalent(TalentMagic.MAGIC_06) ? StatusManager.MAGIC_WEAPON_STRONG : StatusManager.MAGIC_WEAPON, new FromData());
            }
            if (this.hashTalent(Talent.MAGIC_13)) {
                this.magicice.showIce();
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
            cc.director.emit(EventConstant.HUD_CONTROLLER_COOLDOWN, { detail: { cooldown: cooldown, talentType: 3 } });
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
    takeIce(actor): boolean {
        if (actor) {
            if (this.hashTalent(Talent.SHIELD_13) && this.magicice.isShow) {
                let monster = actor.node.getComponent(Monster);
                let boss = actor.node.getComponent(Boss);
                if (monster) {
                    monster.addStatus(StatusManager.FROZEN, new FromData());
                }
                if (boss) {
                    boss.addStatus(StatusManager.FROZEN, new FromData());
                }
                return true;
            }
        }
        return false;
    }
    takeDamage(damageData: DamageData, actor?: Actor) {

    }
}