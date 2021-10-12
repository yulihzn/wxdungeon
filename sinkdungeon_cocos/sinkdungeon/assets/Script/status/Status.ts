
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Actor from "../base/Actor";
import DamageData from "../data/DamageData";
import StatusData from "../data/StatusData";
import Logic from "../Logic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Status extends cc.Component {
    static readonly BUFF = 0;
    static readonly DEBUFF = 1;
    anim: cc.Animation;
    label: cc.Label;
    private stateRunning: boolean = false;
    sprite: cc.Sprite = null;
    data: StatusData = new StatusData();
    private actor: Actor;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        this.label = this.node.getChildByName('sprite').getChildByName('label').getComponent(cc.Label);
        this.anim = this.getComponent(cc.Animation);
    }

    start() {
    }
    showStatus(data: StatusData, actor: Actor,isFromSave:boolean) {
        if (!this.anim) { return; }
        this.data = data;
        this.actor = actor;
        this.sprite.spriteFrame = Logic.spriteFrameRes(data.spriteFrameName);
        this.anim.playAdditive('StatusShow');
        if(!isFromSave){
            this.doStatusDamage(true);//非数据保存状态执行瞬时效果
        }
        this.stateRunning = true;
        this.label.string = `${this.data.duration > 0 ? this.data.duration : ''}`;
        this.label.node.opacity = this.data.duration < 0 || this.data.duration > 500 ? 0 : 255;
    }
    stopStatus() {
        if(!this.node){
            return;
        }
        this.data.duration = 0;
        if (this.stateRunning) {
            this.node.destroy();
        }
    }
    isStatusRunning(): boolean {
        return this.data.duration > 0 || this.data.duration == -1;
    }

    private doStatusDamage(isDirect: boolean) {
        if (!this.data) {
            return;
        }
        let dd = isDirect ? this.getDamageDirect() : this.getDamageOverTime();
        let dizzDuration = isDirect ? this.data.dizzDurationDirect : this.data.dizzDurationOvertime;
        let dream = isDirect ? this.data.dreamDirect : this.data.dreamOvertime;
        if (this.actor) {
            if (dd.getTotalDamage() != 0) { this.actor.takeDamage(dd, this.data.From); }
            if(dizzDuration>0)this.actor.takeDizz(dizzDuration);
            if (dream&&dream != 0) this.actor.updateDream(dream);
            if(this.data.invisibleDuratonDirect>0)this.actor.hideSelf(this.data.invisibleDuratonDirect);
        }
    }

    public updateLogic() {
        this.label.string = `${this.data.duration > 0 ? this.data.duration : ''}`;
        this.label.node.opacity = this.data.duration < 0 || this.data.duration > 500 ? 0 : 255;
        if (this.data.duration > 0) {
            if (this.data.duration != -1) {
                this.data.duration--;
            }
            this.doStatusDamage(false);
        }
        if (this.data.duration == 0 && this.stateRunning) {
            this.stateRunning = false;
            this.anim.play('StatusHide');
            this.scheduleOnce(() => {
                if (this.node) {
                    this.node.destroy();
                }
            }, 0.5);
        }
    }
    private getDamageDirect(): DamageData {
        let dd = new DamageData();
        dd.realDamage = this.data.realDamageDirect ? this.data.realDamageDirect : 0;
        dd.physicalDamage = this.data.physicalDamageDirect ? this.data.physicalDamageDirect : 0;
        dd.magicDamage = this.data.magicDamageDirect ? this.data.magicDamageDirect : 0;
        return dd;
    }
    private getDamageOverTime(): DamageData {
        let dd = new DamageData();
        dd.realDamage = this.data.realDamageOvertime ? this.data.realDamageOvertime : 0;
        dd.physicalDamage = this.data.physicalDamageOvertime ? this.data.physicalDamageOvertime : 0;
        dd.magicDamage = this.data.magicDamageOvertime ? this.data.magicDamageOvertime : 0;
        return dd;
    }
}
