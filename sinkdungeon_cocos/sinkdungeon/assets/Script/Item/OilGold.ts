import Player from "../logic/Player";
import Logic from "../logic/Logic";
import { EventHelper } from "../logic/EventHelper";
import Random from "../utils/Random";
import AudioPlayer from "../utils/AudioPlayer";
import Actor from "../base/Actor";
import DamageData from "../data/DamageData";
import FromData from "../data/FromData";
import StatusData from "../data/StatusData";

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
export default class OilGold extends Actor {
    takeDamage(damage: DamageData, from?: FromData, actor?: Actor): boolean {
        return false;
    }
    actorName(): string {
        return '';
    }
    addStatus(statusType: string, from: FromData): void {
    }
    getCenterPosition(): cc.Vec3 {
        return this.node.position;
    }
    takeDizz(dizzDuration: number): void {
    }
    updateStatus(statusList: StatusData[], totalStatusData: StatusData): void {
    }
    hideSelf(hideDuration: number): void {
    }
    updateDream(offset: number): number {
        return 0;
    }
    static readonly FACE_VALUE = 100;
    value: number = 0;
    isReady = false;
    player: Player;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initCollider();
    }
    onEnable() {
        let speed = 1200;
        let x = Random.rand() * (Logic.getHalfChance() ? 1 : -1) * speed;
        let y = Random.rand() * (Logic.getHalfChance() ? 1 : -1) * speed;
        this.entity.Move.linearVelocity = cc.v2(x, y);
        this.entity.Move.linearDamping = 10;
        this.isReady = false;
        this.scheduleOnce(() => { this.isReady = true; }, 1);
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
        let dis = Logic.getDistanceNoSqrt(this.node.position, playerNode.position.clone().addSelf(cc.v3(0, 32)));
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
                    this.entity.Move.linearVelocity = cc.v2(pos);
                    this.entity.Move.linearDamping = 1;
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
