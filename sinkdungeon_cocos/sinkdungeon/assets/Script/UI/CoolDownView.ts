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
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.graphics = this.getComponent(cc.Graphics);
        this.label = this.getComponentInChildren(cc.Label);
        this.skillIcon = this.node.getChildByName('mask').getChildByName('sprite').getComponent(cc.Sprite);
        EventHelper.on(EventHelper.HUD_CONTROLLER_COOLDOWN, (detail) => {
            if (this.node && detail.id == this.id) { this.drawSkillCoolDown(detail.cooldown, detail.currentCooldown, this.graphics, this.coolDownFuc, this.node, this.skillIcon, this.label) };
        })
        EventHelper.on(EventHelper.HUD_CONTROLLER_COOLDOWN_LABEL, (detail) => {
            if (this.node && detail.id == this.id) {
                this.label.string = detail.count > 0 ? `${detail.count}` : ``;
            }
        })
    }
    init(id: number) {
        this.id = id;
        if (id == CoolDownView.PROFESSION) {
            this.setSkillIcon(Logic.playerData.AvatarData.professionData.talent);
        } else if (id == CoolDownView.ORGANIZATION) {
            this.setSkillIcon(`talent10${Logic.playerData.AvatarData.organizationIndex}`);
        }
    }
    private setSkillIcon(resName: string) {
        this.skillIcon.spriteFrame = Logic.spriteFrameRes(resName);
    }

    private drawSkillCoolDown(coolDown: number, currentCooldown: number, graphics: cc.Graphics, coolDownFuc: Function, coolDownNode: cc.Node, skillIcon: cc.Sprite, label: cc.Label) {
        if (!coolDownNode) {
            return;
        }
        if (coolDown - currentCooldown < 0) {
            return;
        }

        if (coolDownFuc) {
            this.unschedule(coolDownFuc);
        }
        if (coolDown - currentCooldown == 0) {
            if (graphics) {
                graphics.clear();
            }
        }
        let p = cc.Vec3.ZERO;
        let percent = 100;
        let delta = 0.1;
        //0.5为误差补偿
        let offset = 100 / (coolDown - currentCooldown) * delta;
        coolDownFuc = () => {
            percent -= offset;
            if (graphics) {
                graphics.clear();
            }
            this.drawArc(360 * percent / 100, p, graphics);
            skillIcon.node.opacity = 200;
            if (percent < 0) {
                skillIcon.node.opacity = 0;
                if (graphics) {
                    graphics.clear();
                }
                this.unschedule(coolDownFuc);
            }
        }
        this.schedule(coolDownFuc, delta, cc.macro.REPEAT_FOREVER);
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
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            return true;
        }
        return false;
    }
    start() {

    }

    // update (dt) {}
}
