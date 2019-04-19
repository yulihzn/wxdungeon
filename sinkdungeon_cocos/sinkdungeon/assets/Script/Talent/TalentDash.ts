import Skill from "../Utils/Skill";
import Player from "../Player";
import StatusManager from "../Manager/StatusManager";
import { EventConstant } from "../EventConstant";
import Logic from "../Logic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TalentDash extends cc.Component{
    public static readonly DASH_01 = 1000001;//普通
    public static readonly DASH_02 = 1000002;//突刺冲撞 2伤害
    public static readonly DASH_03 = 1000003;//鱼肠刺僚 流血
    public static readonly DASH_04 = 1000004;//螳臂当车 击退
    public static readonly DASH_05 = 1000005;//醉舞矛戈 减速
    public static readonly DASH_06 = 1000006;//野蛮冲撞 眩晕
    public static readonly DASH_07 = 1000007;//突刺鹰击 5伤害
    public static readonly DASH_08 = 1000008;//飞燕如梭 冲刺速度提高距离变远
    public static readonly DASH_09 = 1000009;//火焰舞者 划过路径留下一道3秒的火焰
    public static readonly DASH_10 = 1000010;//冰霜之城 划过路径留下一道3秒的冰墙
    public static readonly DASH_11 = 1000011;//元素湍流 扩大路径面积
    public static readonly DASH_12 = 1000012;//灵姿鬼步 冲刺期间无敌
    public static readonly DASH_13 = 1000013;//坚韧意志 缩短冲刺冷却
    public static readonly DASH_14 = 1000014;//移形换影 本体不冲刺而是幻影替代随后瞬移到幻影的位置
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