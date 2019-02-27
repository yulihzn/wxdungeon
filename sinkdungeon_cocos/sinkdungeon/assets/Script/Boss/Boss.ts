import HealthBar from "../HealthBar";
import DamageData from "../Data/DamageData";
import Logic from "../Logic";
import MonsterData from "../Data/MonsterData";
import Dungeon from "../Dungeon";
import StatusManager from "../Manager/StatusManager";
import { EventConstant } from "../EventConstant";
import EquipmentManager from "../Manager/EquipmentManager";

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
export default abstract class Boss extends cc.Component {
    @property(StatusManager)
    statusManager: StatusManager = null;
    healthBar: HealthBar = null;
    dungeon: Dungeon;
    pos: cc.Vec2 = cc.v2(0, 0);
    data: MonsterData = new MonsterData();
    isDied = false;
    isShow = false;
    abstract takeDamage(damage: DamageData): boolean;
    abstract killed();
    abstract bossAction(): void;
    /**添加状态 */
    addStatus(statusType: string) {
        if (this.statusManager) {
            this.statusManager.addStatus(statusType);
        }
    }
    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node,offset?:cc.Vec2): number {
        let p = this.node.position.clone();
        if(offset){
            p.addSelf(offset);
        }
        let dis = Logic.getDistance(this.node.position, playerNode.position);
        return dis;
    }
    /**获取中心位置 */
    getCenterPosition(): cc.Vec2 {
        return this.node.position.clone().addSelf(cc.v2(0, 32 * this.node.scaleY));
    }
    updatePlayerPos() {
        this.node.x = this.pos.x * 64 + 32;
        this.node.y = this.pos.y * 64 + 32;
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
            cc.director.emit(EventConstant.DUNGEON_ADD_COIN, { detail: { pos: this.node.position, count: 19 } });
            cc.director.emit(EventConstant.DUNGEON_ADD_HEART, { detail: { pos: this.node.position } });
            cc.director.emit(EventConstant.DUNGEON_ADD_AMMO, { detail: { pos: this.node.position } });
            this.dungeon.addEquipment(EquipmentManager.equipments[Logic.getRandomNum(0,EquipmentManager.equipments.length-1)], this.pos,null,3);
        }
    }
    showBoss() {
    }
}
