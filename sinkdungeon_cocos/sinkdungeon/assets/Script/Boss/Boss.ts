import HealthBar from "../HealthBar";
import Logic from "../Logic";
import MonsterData from "../Data/MonsterData";
import Dungeon from "../Dungeon";
import StatusManager from "../Manager/StatusManager";
import { EventHelper } from "../EventHelper";
import EquipmentManager from "../Manager/EquipmentManager";
import Actor from "../Base/Actor";
import Shooter from "../Shooter";
import FromData from "../Data/FromData";
import Item from "../Item/Item";

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
export default abstract class Boss extends Actor {
    @property(StatusManager)
    statusManager: StatusManager = null;
    healthBar: HealthBar = null;
    dungeon: Dungeon;
    pos: cc.Vec3 = cc.v3(0, 0);
    data: MonsterData = new MonsterData();
    isDied = false;
    isShow = false;
    abstract killed();
    abstract bossAction(): void;
    /**添加状态 */
    addStatus(statusType: string,from:FromData) {
        if (this.statusManager) {
            this.statusManager.addStatus(statusType,from);
        }
    }
    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node,offset?:cc.Vec3): number {
        let p = this.node.position.clone();
        if(offset){
            p.addSelf(offset);
        }
        let dis = Logic.getDistance(this.node.position, playerNode.position);
        return dis;
    }
    /**获取中心位置 */
    getCenterPosition(): cc.Vec3 {
        return this.node.position.clone().addSelf(cc.v3(0, 32 * this.node.scaleY));
    }
    playHit(sprite:cc.Node){
        if(sprite){
            sprite.stopAllActions();
            sprite.position = cc.v3(0,0);
            sprite.runAction(cc.sequence(cc.moveTo(0.1,2,0),cc.moveTo(0.1,-2,0),cc.moveTo(0.1,2,0),
            cc.moveTo(0.1,-2,0),cc.moveTo(0.1,0,2),cc.moveTo(0.1,0,-2),cc.moveTo(0.1,0,2),cc.moveTo(0.1,0,0)));
        }
    }
    updatePlayerPos() {
        // this.node.x = this.pos.x * 64 + 32;
        // this.node.y = this.pos.y * 64 + 32;
        this.node.position = Dungeon.getPosInMap(this.pos);
    }
    transportBoss(x: number, y: number) {
        this.pos.x = x;
        this.pos.y = y;
        this.changeZIndex();
        this.updatePlayerPos();
    }
    changeZIndex() {
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - this.pos.y - 1) * 10 + 2;
    }

    start() {
        this.changeZIndex();
        this.scheduleOnce(() => {
            if (this.healthBar) {
                this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
            }
        }, 0.1);
    }
    getLoot(){
        if(this.dungeon){
            cc.director.emit(EventHelper.DUNGEON_ADD_COIN, { detail: { pos: this.node.position, count: 19 } });
            cc.director.emit(EventHelper.DUNGEON_ADD_OILGOLD, { detail: { pos: this.node.position, count: Logic.getRandomNum(1, 29) } });
            cc.director.emit(EventHelper.DUNGEON_ADD_ITEM, { detail: { pos: this.node.position, res:Item.HEART } });
            cc.director.emit(EventHelper.DUNGEON_ADD_ITEM, { detail: { pos: this.node.position, res:Item.AMMO } });
            this.dungeon.addEquipment(Logic.getRandomEquipType(), this.pos,null,3);
        }
    }
    showBoss() {
    }
    fireShooter(shooter: Shooter, bulletType: string, bulletArcExNum: number, bulletLineExNum: number,angle?:number): void {
        shooter.dungeon = this.dungeon;
        shooter.data.bulletType = bulletType;
        shooter.data.bulletArcExNum = bulletArcExNum;
        shooter.data.bulletLineExNum = bulletLineExNum;
        shooter.fireBullet(angle);
    }
}
