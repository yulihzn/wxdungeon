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
        this.shieldBackSprite.spriteFrame = Logic.spriteFrames[resName];
        this.shieldFrontSprite.spriteFrame = Logic.spriteFrames[resName];
    }
    useSKill(){
        this.useShield();
    }
    public useShield(): void {
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
            let backAction = cc.sequence(cc.scaleTo(0.1, 0, 1), cc.moveTo(0.1, cc.v2(-16, y))
                , cc.delayTime(invulnerabilityTime), cc.moveTo(animOverTime, cc.v2(-8, y)), cc.scaleTo(animOverTime, 1, 1));
            let frontAction = cc.sequence(cc.scaleTo(0.1, 1, 1), cc.moveTo(0.1, cc.v2(8, y))
                , cc.delayTime(invulnerabilityTime), cc.moveTo(animOverTime, cc.v2(-8, y)), cc.scaleTo(animOverTime, 0, 1));
            this.shieldBackSprite.node.runAction(backAction);
            this.shieldFrontSprite.node.runAction(frontAction);
            //添加状态
            this.player.addStatus(statusName,new FromData());
            this.scheduleOnce(() => {
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MELEE } });
            }, 0.2);
            this.scheduleOnce(() => {
                this.talentSkill.IsExcuting = false;
            }, invulnerabilityTime + 0.2)
            this.scheduleOnce(() => {
                this.shieldBackSprite.node.opacity = 255;
            }, 1)
            cc.director.emit(EventHelper.HUD_CONTROLLER_COOLDOWN, { detail: { cooldown: cooldown,talentType:2 } });
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