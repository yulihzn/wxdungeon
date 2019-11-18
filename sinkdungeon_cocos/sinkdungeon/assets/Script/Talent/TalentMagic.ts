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

const { ccclass, property } = cc._decorator;

@ccclass
export default class TalentMagic extends Talent {

    hv: cc.Vec2;

    onLoad() {
    }
    init() {
        super.init();
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
        let cooldown = 3;
        if (this.hashTalent(Talent.DASH_13)) {
            cooldown = 2;
        }
        if (this.hashTalent(Talent.DASH_14)) {
        }
        this.talentSkill.next(() => {
            this.talentSkill.IsExcuting = true;
            // cc.director.emit(EventConstant.PLAY_AUDIO, { detail: { name: AudioPlayer.DASH } });
            cc.director.emit(EventConstant.HUD_CONTROLLER_COOLDOWN, { detail: { cooldown: cooldown, talentType: 3 } });
        }, cooldown, true);
    }

    changePerformance() {
        
    }

    takeDamage() {

    }
}