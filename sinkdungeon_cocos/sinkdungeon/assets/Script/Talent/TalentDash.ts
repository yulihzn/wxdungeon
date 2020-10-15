import { EventHelper } from "../EventHelper";
import Talent from "./Talent";
import DashShadow from "../Item/DashShadow";
import DamageData from "../Data/DamageData";
import Monster from "../Monster";
import Boss from "../Boss/Boss";
import StatusManager from "../Manager/StatusManager";
import AudioPlayer from "../Utils/AudioPlayer";
import FromData from "../Data/FromData";
import PlayerAvatar from "../PlayerAvatar";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TalentDash extends Talent {

    @property(DashShadow)
    dashShadow: DashShadow = null;
    
    hv: cc.Vec3;

    onLoad() {
    }
    init() {
        super.init();
        this.dashShadow.node.active = false;
        this.node.parent = this.player.node.parent;
        this.dashShadow.init(this);
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
        let cooldown = 3;
        if (this.hashTalent(Talent.DASH_13)) {
            cooldown = 2;
        }
        let speed = 1200;
        if (this.hashTalent(Talent.DASH_14)) {
            speed = 2400;
        }
        this.talentSkill.next(() => {
            this.talentSkill.IsExcuting = true;
            cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.DASH } });
            this.schedule(() => {
                this.player.getWalkSmoke(this.node.parent, this.node.position);
            }, 0.05, 4, 0);
            let pos = this.player.rigidbody.linearVelocity.clone();
            this.player.isMoving = false;
            if (pos.equals(cc.Vec2.ZERO)) {
                pos = this.player.isFaceRight ? cc.v2(1, 0) : cc.v2(-1, 0);
            } else {
                pos = pos.normalizeSelf();
            }
            let posv3 = cc.v3(pos.x,pos.y);
            if (this.hashTalent(Talent.DASH_08)) {
                speed = 100;
                this.showShadow(posv3);
            }
            this.hv = posv3.clone();
            pos = pos.mul(speed);
            this.player.rigidbody.linearVelocity = pos;
            this.scheduleOnce(() => {
                this.player.rigidbody.linearVelocity = cc.Vec2.ZERO;
                this.player.playerAnim(PlayerAvatar.STATE_IDLE,this.player.currentDir);
                this.IsExcuting = false;
            }, 0.5)
            cc.director.emit(EventHelper.HUD_CONTROLLER_COOLDOWN, { detail: { cooldown: cooldown, talentType: 1 } });
        }, cooldown, true);
    }

    showShadow(pos: cc.Vec3) {
        if (this.dashShadow) {
            this.dashShadow.setHv(pos.clone());
            this.dashShadow.show();
        }
    }
    changePerformance() {
        
    }
    onBeginContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (this.hashTalent(Talent.DASH_02) && !this.hashTalent(Talent.DASH_08)) {
            this.attacking(otherCollider, this.node);
        }
    }
    attacking(attackTarget: cc.PhysicsCollider, currentNode: cc.Node) {
        if (!attackTarget || !currentNode.active) {
            return;
        }
        let damage = new DamageData(1);
        if (this.hashTalent(Talent.DASH_07)) {
            damage.realDamage = 5;
        }

        let damageSuccess = false;
        let monster = attackTarget.node.getComponent(Monster);
        if (monster && !monster.isDied) {
            damageSuccess = monster.takeDamage(damage);
            if (damageSuccess) {
                this.beatBack(monster.node);
                this.addMonsterAllStatus(monster);
            }
        }

        let boss = attackTarget.node.getComponent(Boss);
        if (boss && !boss.isDied) {
            damageSuccess = boss.takeDamage(damage);
            if (damageSuccess) {
                this.addBossAllStatus(boss);
            }
        }

    }
    beatBack(node: cc.Node) {
        if (!this.hashTalent(Talent.DASH_04)) {
            return;
        }
        let rigidBody: cc.RigidBody = node.getComponent(cc.RigidBody);
        let pos = this.hv.clone();
        let power = 1000;
        pos = pos.normalizeSelf().mul(power);
        rigidBody.applyLinearImpulse(cc.v2(pos.x,pos.y), rigidBody.getLocalCenter(), true);
    }

    addMonsterAllStatus(monster: Monster) {
        this.addMonsterStatus(Talent.DASH_05, monster, StatusManager.FROZEN);
        this.addMonsterStatus(Talent.DASH_06, monster, StatusManager.DIZZ);
        this.addMonsterStatus(Talent.DASH_03, monster, StatusManager.BLEEDING);
    }
    addBossAllStatus(boss: Boss) {
        this.addBossStatus(Talent.DASH_05, boss, StatusManager.FROZEN);
        this.addBossStatus(Talent.DASH_06, boss, StatusManager.DIZZ);
        this.addBossStatus(Talent.DASH_03, boss, StatusManager.BLEEDING);
    }
    addMonsterStatus(talentType: string, monster: Monster, statusType) {
        if (this.hashTalent(talentType)) { monster.addStatus(statusType,new FromData()); }
    }
    addBossStatus(talentType: string, boss: Boss, statusType) {
        if (this.hashTalent(talentType)) { boss.addStatus(statusType,new FromData()); }
    }
    takeDamage() {

    }
}