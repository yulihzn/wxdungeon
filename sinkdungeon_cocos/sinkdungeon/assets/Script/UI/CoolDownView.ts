// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from "../EventHelper";
import Logic from "../Logic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CoolDownView extends cc.Component {
    static readonly PROFESSION = 0;
    static readonly ORGANIZATION = 1;
    id = CoolDownView.PROFESSION;
    skillIcon: cc.Sprite = null;
    graphics: cc.Graphics = null;
    coolDownFuc: Function = null;
    label: cc.Label = null;
    private secondCount = 0;
    private secondCountLerp = 0;
    private duration = 0;
    private storePoint = 1;
    private storePointMax = 1;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.graphics = this.getComponent(cc.Graphics);
        this.label = this.getComponentInChildren(cc.Label);
        this.skillIcon = this.node.getChildByName('mask').getChildByName('sprite').getComponent(cc.Sprite);
        EventHelper.on(EventHelper.HUD_CONTROLLER_COOLDOWN, (detail) => {
            if (this.node && detail.id == this.id) { this.setData(detail.duration, detail.secondCount, detail.storePoint, detail.storePointMax) };
        })
    }
    init(id: number) {
        this.id = id;
        if (!this.skillIcon) {
            this.skillIcon = this.node.getChildByName('mask').getChildByName('sprite').getComponent(cc.Sprite);
        }
        if (id == CoolDownView.PROFESSION) {
            this.setSkillIcon(Logic.playerData.AvatarData.professionData.talent);
        } else if (id == CoolDownView.ORGANIZATION) {
            this.setSkillIcon(`talent10${Logic.playerData.AvatarData.organizationIndex}`);
        }
    }
    private setSkillIcon(resName: string) {
        this.skillIcon.spriteFrame = Logic.spriteFrameRes(resName);
    }

    private setData(duration: number, secondCount: number, storePoint: number, storePointMax: number) {
        if (!this.node) {
            return;
        }
        if (secondCount > duration) {
            secondCount = duration;
        }
        if (duration <= 0) {
            duration = 0;
        }
        this.storePointMax = storePointMax;
        this.duration = duration;
        this.secondCountLerp = secondCount;
        this.secondCount = secondCount;
        this.storePoint = storePoint;
        this.drawSkillCoolDown();
    }
    private drawSkillCoolDown() {
        if (this.duration <= 0) {
            return;
        }
        this.label.string = this.storePoint > 0 && this.storePointMax > 1 ? `${this.storePoint}` : ``;
        if (this.graphics) {
            this.graphics.clear();
        }
        if (this.secondCountLerp >1) {
            this.secondCount = Logic.lerp(this.secondCount, this.secondCountLerp-1, 0.1);
        }
        if (this.secondCount <= 0) {
            this.skillIcon.node.opacity = 0;
        } else {
            this.skillIcon.node.opacity = 200;
            let p = cc.Vec3.ZERO;
            let percent = this.secondCount / this.duration;//当前百分比
            this.drawArc(360 * percent, p, this.graphics);
        }

    }
    private drawArc(angle: number, center: cc.Vec3, graphics: cc.Graphics) {
        if (!graphics) {
            return;
        }
        graphics.clear();
        if (angle < 0) {
            return;
        }
        let r = 48;
        let endAngle = angle * 2 * Math.PI / 360;
        graphics.arc(center.x, center.y, r, 2 * Math.PI, 2 * Math.PI - endAngle);
        graphics.stroke();
    }
    timeDelay = 0;
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt;
        if (this.timeDelay > 0.1) {
            this.timeDelay = 0;
            return true;
        }
        return false;
    }
    start() {

    }

    update(dt) {
        if (this.isTimeDelay(dt)) {
            this.drawSkillCoolDown();
        }
    }
}
