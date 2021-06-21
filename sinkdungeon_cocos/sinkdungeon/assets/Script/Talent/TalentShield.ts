import StatusManager from "../Manager/StatusManager";
import { EventHelper } from "../EventHelper";
import Logic from "../Logic";
import DamageData from "../Data/DamageData";
import Actor from "../Base/Actor";
import Talent from "./Talent";
import AudioPlayer from "../Utils/AudioPlayer";
import FromData from "../Data/FromData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TalentShield extends Talent {

    private shieldBackSprite: cc.Sprite = null;
    private shieldFrontSprite: cc.Sprite = null;
    private sprites: cc.Sprite[];
    onLoad() {

    }
    init() {
        super.init();
        this.shieldBackSprite = this.getSpriteChildSprite(['shieldback']);
        this.shieldFrontSprite = this.getSpriteChildSprite(['shieldfront']);
        this.shieldBackSprite.node.opacity = 0;
        this.shieldFrontSprite.node.opacity = 0;
        this.sprites = new Array();
        let arr = [2, 3, 4, 5, 9, 12, 13, 14];
        for (let i = 0; i < arr.length; i++) {
            let sprite = this.getSpriteChildSprite(['shieldfront', `sprite${arr[i]}`]);
            sprite.node.opacity = 0;
            this.sprites.push(sprite);
        }
    }

    changePerformance() {
        //隐藏所有额外显示
        for (let sprite of this.sprites) {
            sprite.node.opacity = 0;
        }
        this.shieldFrontSprite.node.color = cc.color(255, 255, 255);
        let isThrow = false;
        this.changeRes(isThrow ? 'shield06' : 'shield01');
    }

    changeRes(resName: string) {
        if (!resName || resName.length < 1) {
            return;
        }
        this.shieldBackSprite.spriteFrame = Logic.spriteFrameRes(resName);
        this.shieldFrontSprite.spriteFrame = Logic.spriteFrameRes(resName);
    }
    useSKill() {
        this.doSkill();
    }
    protected doSkill(): void {
        if (!this.talentSkill) {
            return;
        }
        if (this.talentSkill.IsExcuting) {
            return;
        }
        let cooldown = 7;
        let invulnerabilityTime = 1;

        if (this.hashTalent(TalentShield.SHIELD_13)) {
            cooldown = 5;
        }
        this.talentSkill.next(() => {
            let statusName = StatusManager.SHIELD_NORMAL;
            let animOverTime = 0.1;
            this.talentSkill.IsExcuting = true;
            let y = this.shieldFrontSprite.node.y;
            this.shieldBackSprite.node.scaleX = 1;
            this.shieldFrontSprite.node.scaleX = 0;
            this.shieldBackSprite.node.opacity = 255;
            this.shieldFrontSprite.node.opacity = 255;
            this.shieldFrontSprite.node.x = -8;
            if (this.hashTalent(TalentShield.SHIELD_14)) {
                statusName = StatusManager.SHIELD_LONG;
                invulnerabilityTime = 2;
            }
            if (this.hashTalent(TalentShield.SHIELD_06)) {
                invulnerabilityTime = 0;
                animOverTime = 0;
            }
            cc.tween(this.shieldBackSprite.node)
                .to(0.1, { scaleX: 0, scaleY: 1 }).to(0.1, { position: cc.v3(-16, y) })
                .delay(invulnerabilityTime).to(animOverTime, { position: cc.v3(-8, y) })
                .to(animOverTime, { scale: 1 }).start();
            cc.tween(this.shieldFrontSprite.node)
                .to(0.1, { scale: 1 }).to(0.1, { position: cc.v3(8, y) })
                .delay(invulnerabilityTime).to(animOverTime, { position: cc.v3(-8, y) })
                .to(animOverTime, { scaleX: 0, scaleY: 1 }).start();
            //添加状态
            this.player.addStatus(statusName, new FromData());
            this.scheduleOnce(() => {
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MELEE } });
            }, 0.2);
            this.scheduleOnce(() => {
                this.talentSkill.IsExcuting = false;
            }, invulnerabilityTime + 0.2)
            this.scheduleOnce(() => {
                this.shieldBackSprite.node.opacity = 255;
            }, 1)
            cc.director.emit(EventHelper.HUD_CONTROLLER_COOLDOWN, { detail: { cooldown: cooldown, talentType: 2 } });
        }, cooldown, true);
    }
    hashTalent(id: string): boolean {
        return this.hasTalentMap[id] && this.hasTalentMap[id] == true;
    }
    canAddStatus(statusType: string): boolean {
        if (!this.hashTalent(TalentShield.SHIELD_04)) {
            return true;
        }
        let cant = statusType == StatusManager.FROZEN
            || statusType == StatusManager.BURNING
            || statusType == StatusManager.DIZZ
            || statusType == StatusManager.TOXICOSIS
            || statusType == StatusManager.CURSING
            || statusType == StatusManager.BLEEDING
        return !cant;
    }
    takeDamage(damageData: DamageData, actor?: Actor) {
        //反弹伤害
        if (actor && this.IsExcuting) {
            if (this.hashTalent(TalentShield.SHIELD_05)) {
                actor.takeDamage(new DamageData(5));
            } else if (this.hashTalent(TalentShield.SHIELD_02)) {
                actor.takeDamage(new DamageData(1));
            }
        }
    }
}