import { EventConstant } from "../EventConstant";
import Logic from "../Logic";
import Talent from "./Talent";
import DashShadow from "../Item/DashShadow";
import Dungeon from "../Dungeon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TalentDash extends Talent {

    @property(DashShadow)
    dashShadow:DashShadow=null;

    onLoad() {
    }
    init(){
        super.init();
        this.dashShadow.dungeon = this.player.node.parent.getComponent(Dungeon);
        this.dashShadow.node.active = false;
        this.node.parent = this.dashShadow.dungeon.node;
        this.node.setPosition(this.player.node.position.add(cc.v2(8, 48)));
        this.dashShadow.init();
    }
    useSKill() {
        this.useDash();
    }
    useDash() {
        if (!this.talentSkill) {
            return;
        }
        if (this.talentSkill.IsExcuting) {
            return;
        }
        let cooldown = 2;
        let speed = 1000;
        this.talentSkill.next(() => {
            this.talentSkill.IsExcuting = true;
            this.schedule(() => { this.player.getWalkSmoke(this.node.parent, this.node.position); }, 0.05, 4, 0);
            let idleName = "idle001";
            if (this.player.inventoryManager.trousers.trouserslong == 1) {
                idleName = "idle002";
            }
            this.player.anim.play('PlayerIdle');
            let pos = this.player.rigidbody.linearVelocity.clone();
            this.player.isMoving = false;
            if (pos.equals(cc.Vec2.ZERO)) {
                pos = this.player.isFaceRight ? cc.v2(1, 0) : cc.v2(-1, 0);
            } else {
                pos = pos.normalizeSelf();
            }
            if(this.hashTalent(Talent.DASH_08)){
                speed = 0;
                if(this.dashShadow){
                    this.dashShadow.setHv(pos.clone());
                    this.dashShadow.show();
                }
            }
            pos = pos.mul(speed);
            this.player.rigidbody.linearVelocity = pos;
            this.scheduleOnce(() => {
                this.player.rigidbody.linearVelocity = cc.Vec2.ZERO;
                this.player.trousersSprite.spriteFrame = Logic.spriteFrames[idleName];
                this.IsExcuting = false;
            }, 0.5)
            cc.director.emit(EventConstant.HUD_CONTROLLER_COOLDOWN, { detail: { cooldown: cooldown } });
        }, cooldown, true);
    }
    changePerformance() {
        for (let t of this.talentList) {
            if (t.id == Talent.DASH_01) {
            } else if (t.id == Talent.DASH_02) {
            } else if (t.id == Talent.DASH_03) {
            } else if (t.id == Talent.DASH_04) {
            } else if (t.id == Talent.DASH_05) {
            } else if (t.id == Talent.DASH_06) {
            } else if (t.id == Talent.DASH_07) {
            } else if (t.id == Talent.DASH_08) {
            } else if (t.id == Talent.DASH_09) {
            } else if (t.id == Talent.DASH_10) {
            } else if (t.id == Talent.DASH_11) {
            } else if (t.id == Talent.DASH_12) {
            } else if (t.id == Talent.DASH_13) {
            } else if (t.id == Talent.DASH_14) {
            }
        }
    }
    takeDamage() {

    }
}