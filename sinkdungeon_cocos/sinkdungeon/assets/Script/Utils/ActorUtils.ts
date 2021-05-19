import Actor from "../Base/Actor";
import Boss from "../Boss/Boss";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import NonPlayer from "../NonPlayer";
import Player from "../Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ActorUtils {
    static getCollisionTarget(other: cc.Collider, isPlayer?: boolean) {
        return ActorUtils.getEnemyActorByNode(other.node,isPlayer);
    }
    static getEnemyActorByNode(other: cc.Node, isPlayer?: boolean) {
        if (isPlayer) {
            let non = other.getComponent(NonPlayer);
            if (non&&non.data.isEnemy>0) {
                return non;
            }
            let boss = other.getComponent(Boss);
            if (boss) {
                return boss;
            }
        } else {
            let player = other.getComponent(Player);
            if (player) {
                return player;
            }
            let non = other.getComponent(NonPlayer);
            if (non && non.data.isEnemy<1) {
                return non;
            }
        }
        return null;
    }
    /**
     * 获取最近的玩家
     * @param dungeon 
     * @param distance 
     */
     static getPlayerPosition(actor:Actor,dungeon: Dungeon, distance?: number) {
        return ActorUtils.getNearestTargetPosition(actor,[Actor.TARGET_PLAYER], dungeon,true, distance);
    }
    /**
     * 获取最近的敌人
     * @param selfIsEnemy 自身是否的玩家的对立面
     * @param dungeon 
     * @param distance 
     */
     static getNearestEnemyPosition(actor:Actor,selfIsEnemy: boolean, dungeon: Dungeon,needRandom:boolean, distance?: number) {
        return ActorUtils.getNearestTargetPosition(actor,selfIsEnemy ? [Actor.TARGET_PLAYER, Actor.TARGET_NONPLAYER]
            : [Actor.TARGET_MONSTER, Actor.TARGET_NONPLAYER_ENEMY, Actor.TARGET_BOSS], dungeon,needRandom, distance);
    }
    /**
     * 获取最近的目标
     * @param targetTypes 
     * @param dungeon 
     * @param distance 
     */
     static getNearestTargetPosition(actor:Actor,targetTypes: number[], dungeon: Dungeon,needRandom:boolean, distance?: number): cc.Vec3 {
        let targetActor: Actor = ActorUtils.getNearestTargetActor(actor,targetTypes, dungeon, distance ? distance : 999999);
        if (targetActor) {
            return targetActor.node.position;
        }
        if(needRandom){
            return actor.node.position.addSelf(cc.v3(Logic.getRandomNum(0, 600) - 300, Logic.getRandomNum(0, 600) - 300));
        }
        return cc.Vec3.ZERO;
    }
 
    /**
     * 获取最近的敌人节点
     * @param selfIsEnemy 
     * @param dungeon 
     * @param distance 
     */
     static getNearestEnemyActor(actor:Actor,selfIsEnemy: boolean, dungeon: Dungeon) {
        return ActorUtils.getNearestTargetActor(actor,selfIsEnemy ? [Actor.TARGET_PLAYER, Actor.TARGET_NONPLAYER]
            : [Actor.TARGET_MONSTER, Actor.TARGET_NONPLAYER_ENEMY, Actor.TARGET_BOSS], dungeon);
    }

    /**
     * 获取最近目标节点
     * @param targetTypes 
     * @param dungeon 
     * @param distance 
     */
     static getNearestTargetActor(actor:Actor,targetTypes: number[], dungeon: Dungeon, distance?: number): Actor {
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
                    if (non.data.isEnemy<1) {
                        targetList.push(non);
                    }
                }
            } else if (targetType == Actor.TARGET_NONPLAYER_ENEMY) {
                for (let non of dungeon.nonPlayerManager.nonPlayerList) {
                    if (non.data.isEnemy>0) {
                        targetList.push(non);
                    }
                }
            }
        }
        for (let target of targetList) {
            if (target.isValid && !target.sc.isDied && target.sc.isShow) {
                let dis = Logic.getDistance(actor.node.position, target.getCenterPosition());
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
     static getNearestTargetDistance(actor:Actor,target: Actor): number {
        if (!target) {
            return 999999;
        }
        let dis = Logic.getDistance(actor.node.position, target.node.position);
        return dis;
    }
}