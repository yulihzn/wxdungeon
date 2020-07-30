import Logic from "../Logic";
import Dungeon from "../Dungeon";
import TalentData from "../Data/TalentData";
import Talent from "../Talent/Talent";
import TalentDash from "../Talent/TalentDash";
import Shooter from "../Shooter";
import IndexZ from "../Utils/IndexZ";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class DashShadow extends cc.Component {
    rigidBody: cc.RigidBody;
    hv: cc.Vec3 = cc.v3(1, 0);
    private motionStreak: cc.MotionStreak;
    private sprite: cc.Node;
    talentDash: TalentDash;
    @property(Shooter)
    shooter: Shooter = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.rigidBody = this.getComponent(cc.RigidBody);
        this.motionStreak = this.getComponent(cc.MotionStreak);
        this.sprite = this.node.getChildByName('sprite');
    }
    init(talentDash: TalentDash) {
        this.talentDash = talentDash;
        this.shooter.dungeon = this.talentDash.player.node.parent.getComponent(Dungeon);
    }

    changeDashPerformance(talentList: TalentData[]) {
        this.motionStreak.color = cc.Color.BLACK;
        for (let t of talentList) {
        }
    }

    onEnable() {
    }

    start() {

    }

    getPlayerPosition(): cc.Vec3 {
        return this.talentDash.player.node.position.clone().addSelf(cc.v3(8, 8));
    }
    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistance(this.node.position, this.getPlayerPosition());
        return dis;
    }
    show() {
        this.node.active = true;
        this.node.parent = this.talentDash.player.node.parent;
        let faceright = this.talentDash.player.isFaceRight;
        this.sprite.scaleX = faceright ? 1 : -1;
        this.node.setPosition(this.getPlayerPosition());
        let speed = 1200;
        this.rigidBody.linearDamping = 1;
        if (this.talentDash.hashTalent(Talent.DASH_14)) {
            speed = 2000;
            this.rigidBody.linearDamping = 1;
        }
        let hs = this.hv.mul(speed);
        this.rigidBody.linearVelocity = cc.v2(hs.x,hs.y);
        this.node.zIndex = IndexZ.OVERHEAD;
        this.fire(this.shooter);
        this.scheduleOnce(() => {
            this.hide();
        }, 0.45)
    }
    hide() {
        this.talentDash.player.node.setPosition(Dungeon.fixOuterMap(this.node.position.clone()));
        this.node.active = false;
        this.rigidBody.linearVelocity = cc.Vec2.ZERO;
    }

    onBeginContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (this.talentDash && this.talentDash.hashTalent(Talent.DASH_02)) {
            this.talentDash.attacking(otherCollider, this.node);
        }
    }
    fire(shooter: Shooter) {
        shooter.data.bulletLineExNum = 5;
        shooter.data.bulletLineInterval = 0.05;
        if (this.talentDash.hashTalent(Talent.DASH_11)) {
            shooter.data.bulletLineExNum = 10;
            shooter.data.bulletLineInterval = 0.03;
        }
        let isOpenFire = false;
        if (this.talentDash.hashTalent(Talent.DASH_09)) {
            isOpenFire = true;
            shooter.data.bulletType = "bullet025";
        } else if (this.talentDash.hashTalent(Talent.DASH_10)) {
            isOpenFire = true;
            shooter.data.bulletType = "bullet026";
        }
        if (isOpenFire) {
            shooter.fireBullet(0, cc.v3(0, 0));

        }
    }
    setHv(hv: cc.Vec3) {
        if (hv.equals(cc.Vec3.ZERO)) {
            this.hv = cc.v3(1, 0);
        } else {
            this.hv = hv;
        }
    }
}
