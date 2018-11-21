import HealthBar from "../HealthBar";
import DamageData from "../Data/DamageData";
import Logic from "../Logic";
import MonsterData from "../Data/MonsterData";
import Dungeon from "../Dungeon";
import StatusManager from "../Manager/StatusManager";

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
    abstract bossAction(): void;
    /**添加状态 */
    addStatus(statusType: string) {
        if (this.statusManager) {
            this.statusManager.addStatus(statusType);
        }
    }
    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistance(this.node.position, playerNode.position);
        return dis;
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
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - this.pos.y - 1) * 100 + 2;
    }

    start() {
        this.changeZIndex();
        setTimeout(() => {
            if (this.healthBar) {
                this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
            }
        }, 100);
    }
    showBoss() {
    }
}
