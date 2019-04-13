import Skill from "../Utils/Skill";
import Player from "../Player";
import StatusManager from "../Manager/StatusManager";
import { EventConstant } from "../EventConstant";
import Logic from "../Logic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TalentDash extends cc.Component{
    private dashSkill = new Skill();
    private player:Player;
    
    get IsExcuting(){
        return this.dashSkill.IsExcuting;
    }
    set IsExcuting(flag:boolean){
        this.dashSkill.IsExcuting = flag;
    }
    onLoad(){
        this.player = this.getComponent(Player);
    }
    useDash() {
        if (!this.dashSkill) {
            return;
        }
        if (this.dashSkill.IsExcuting) {
            return;
        }
        let cooldown = 2;
        this.dashSkill.next(() => {
            this.dashSkill.IsExcuting = true;
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
            pos = pos.mul(1000);
            this.player.rigidbody.linearVelocity = pos;
            this.scheduleOnce(() => {
                this.player.rigidbody.linearVelocity = cc.Vec2.ZERO;
                this.player.trousersSprite.spriteFrame = Logic.spriteFrames[idleName];
                this.IsExcuting = false;
            }, 0.5)
            cc.director.emit(EventConstant.HUD_CONTROLLER_COOLDOWN, { detail: { cooldown: cooldown } });
        }, cooldown, true);
    }
    private getSpriteChildSprite(childNames: string[]): cc.Sprite {
        let node = this.node;
        for (let name of childNames) {
            node = node.getChildByName(name);
        }
        return node.getComponent(cc.Sprite);
    }
}