import Boss from "../Boss/Boss";
import DamageData from "../Data/DamageData";
import FromData from "../Data/FromData";
import Dungeon from "../Dungeon";
import ShadowOfSight from "../Effect/ShadowOfSight";
import Logic from "../Logic";
import Monster from "../Monster";
import NonPlayer from "../NonPlayer";
import Player from "../Player";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// 地图里的所有建筑生物道具都是由Actor组成的
const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class Actor extends cc.Component {
    static readonly TARGET_PLAYER = 0;
    static readonly TARGET_MONSTER = 1;
    static readonly TARGET_BOSS = 2;
    static readonly TARGET_NONPLAYER = 3;
    static readonly TARGET_NONPLAYER_ENEMY = 4;
    abstract takeDamage(damage: DamageData, from?: FromData, actor?: Actor): boolean;
    abstract actorName(): string;
    abstract addStatus(statusType: string, from: FromData);
    abstract getCenterPosition(): cc.Vec3;
    isShow = false;
    isDied = false;
    invisible = false;//是否隐身
    light:ShadowOfSight;//光源

    /**
     * 获取最近的玩家
     * @param dungeon 
     * @param distance 
     */
    getPlayerPosition(dungeon: Dungeon, distance?: number) {
        return this.getNearestTargetPosition([Actor.TARGET_PLAYER], dungeon, distance);
    }
    /**
     * 获取最近的敌人
     * @param isEnemy 自身是否的玩家的对立面
     * @param dungeon 
     * @param distance 
     */
    getNearestEnemyPosition(isEnemy: boolean, dungeon: Dungeon, distance?: number) {
        return this.getNearestTargetPosition(isEnemy ? [Actor.TARGET_PLAYER, Actor.TARGET_NONPLAYER]
            : [Actor.TARGET_MONSTER, Actor.TARGET_NONPLAYER_ENEMY, Actor.TARGET_BOSS], dungeon, distance);
    }
    /**
     * 获取最近的目标
     * @param targetTypes 
     * @param dungeon 
     * @param distance 
     */
    getNearestTargetPosition(targetTypes: number[], dungeon: Dungeon, distance?: number): cc.Vec3 {
        let targetActor: Actor = this.getNearestTargetActor(targetTypes, dungeon, distance ? distance : 999999);
        if (targetActor) {
            return targetActor.node.position;
        }
        return this.node.position.addSelf(cc.v3(Logic.getRandomNum(0, 600) - 300, Logic.getRandomNum(0, 600) - 300));
    }
    /**
     * 获取玩家的节点
     */
    getPlayer(dungeon: Dungeon): Player {
        return dungeon.player;
    }
    /**
     * 获取最近的敌人节点
     * @param isEnemy 
     * @param dungeon 
     * @param distance 
     */
    getNearestEnemyActor(isEnemy: boolean, dungeon: Dungeon) {
        return this.getNearestTargetActor(isEnemy ? [Actor.TARGET_PLAYER, Actor.TARGET_NONPLAYER]
            : [Actor.TARGET_MONSTER, Actor.TARGET_NONPLAYER_ENEMY, Actor.TARGET_BOSS], dungeon);
    }

    /**
     * 获取最近目标节点
     * @param targetTypes 
     * @param dungeon 
     * @param distance 
     */
    getNearestTargetActor(targetTypes: number[], dungeon: Dungeon, distance?: number): Actor {
        let shortdis = distance ? distance : 999999;
        let targetActor: Actor;
        let targetList: Actor[] = [];
        for (let targetType of targetTypes) {
            if (targetType == Actor.TARGET_PLAYER) {
                targetList.push(dungeon.player);
            } else if (targetType == Actor.TARGET_MONSTER) {
                for (let monster of dungeon.monsterManager.monsterList) {
                    targetList.push(monster);
                }
            } else if (targetType == Actor.TARGET_BOSS) {
                for (let boss of dungeon.monsterManager.bossList) {
                    targetList.push(boss);
                }
            } else if (targetType == Actor.TARGET_NONPLAYER) {
                for (let non of dungeon.nonPlayerManager.nonPlayerList) {
                    if (!non.isEnemy) {
                        targetList.push(non);
                    }
                }
            } else if (targetType == Actor.TARGET_NONPLAYER_ENEMY) {
                for (let non of dungeon.nonPlayerManager.nonPlayerList) {
                    if (non.isEnemy) {
                        targetList.push(non);
                    }
                }
            }
        }
        for (let target of targetList) {
            if (target.isValid && !target.isDied && target.isShow) {
                let dis = Logic.getDistance(this.node.position, target.getCenterPosition());
                if (dis < shortdis) {
                    shortdis = dis;
                    targetActor = target;
                }
            }
        }
        if (targetActor) {
            return targetActor;
        }
        return null;
    }
    /**
     * 获取最近目标节点距离
     * @param playerNode 
     */
    getNearestTargetDistance(actor: Actor): number {
        if (!actor) {
            return 999999;
        }
        let dis = Logic.getDistance(this.node.position, actor.node.position);
        return dis;
    }
    static getCollisionTarget(other: cc.Collider, isPlayer?: boolean) {
        return Actor.getEnemyActorByNode(other.node,isPlayer);
    }
    static getEnemyActorByNode(other: cc.Node, isPlayer?: boolean) {
        if (isPlayer) {
            let monster = other.getComponent(Monster);
            if (monster) {
                return monster;
            }
            let boss = other.getComponent(Boss);
            if (boss) {
                return boss;
            }
            let non = other.getComponent(NonPlayer);
            if (non && non.isEnemy) {
                return non;
            }
        } else {
            let player = other.getComponent(Player);
            if (player) {
                return player;
            }
            let non = other.getComponent(NonPlayer);
            if (non && !non.isEnemy) {
                return non;
            }
        }
        return null;
    }
}
