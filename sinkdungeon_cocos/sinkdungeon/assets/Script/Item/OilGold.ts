import Player from "../Player";
import Logic from "../Logic";
import { EventHelper } from "../EventHelper";
import Random from "../Utils/Random";
import AudioPlayer from "../Utils/AudioPlayer";

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
export default class OilGold extends cc.Component {
    static readonly FACE_VALUE = 100;
    rigidBody: cc.RigidBody;
    value: number = 0;
    isReady = false;
    player: Player;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    }
    onEnable() {
        this.rigidBody = this.getComponent(cc.RigidBody);
        let speed = 1200;
        let x = Random.rand() * (Logic.getHalfChance() ? 1 : -1) * speed;
        let y = Random.rand() * (Logic.getHalfChance() ? 1 : -1) * speed;
        this.rigidBody.linearVelocity = cc.v2(x, y);
        this.rigidBody.linearDamping = 10;
        this.isReady = false;
        this.scheduleOnce(() => { this.isReady = true; }, 1.5);
    }
    changeValue(value: number) {
        //目前只有1和10
        this.value = value;
        if (this.value >= OilGold.FACE_VALUE) {
            this.node.scale = 2;
        } else {
            this.node.scale = 1;
        }
    }
    private getFinalValue() {
        let value = this.value;
        switch (Logic.chapterIndex) {
            case Logic.CHAPTER00:
                break;
            case Logic.CHAPTER01:
                value = value * 10;
                break;
            case Logic.CHAPTER02:
                value = value * 100;
                break;
            case Logic.CHAPTER03:
                value = value * 1000;
                break;
            case Logic.CHAPTER04:
                value = value * 10000;
                break;
            case Logic.CHAPTER05:
                value = value * 10000;
                break;
            default:
                break;
        }
        return value;
    }
    start() {

    }

    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.2) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistance(this.node.position, playerNode.position.clone().addSelf(cc.v3(0, 32)));
        return dis;
    }
    update(dt) {
        if (this.isCheckTimeDelay(dt)) {
            if (this.player && this.getNearPlayerDistance(this.player.node) < 400 && this.node.active && this.isReady) {
                let p = this.player.node.position.clone();
                p.y += 10;
                let pos = p.sub(this.node.position);
                if (!pos.equals(cc.Vec3.ZERO)) {
                    pos = pos.normalizeSelf();
                    pos = pos.mul(800);
                    this.rigidBody.linearVelocity = cc.v2(pos);
                    this.rigidBody.linearDamping = 1;
                }
            }

        }
        if (this.player && this.getNearPlayerDistance(this.player.node) < 64 && this.node.active && this.isReady) {
            this.isReady = false;
            AudioPlayer.play(AudioPlayer.OILGOLD);
            EventHelper.emit(EventHelper.HUD_ADD_OILGOLD, { count: this.getFinalValue() });
            EventHelper.emit('destoryoilgold', { oilGoldNode: this.node });
        }
    }
}
