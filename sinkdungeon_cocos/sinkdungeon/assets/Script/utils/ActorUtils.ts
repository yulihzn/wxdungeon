import { ColliderTag } from "../actor/ColliderTag";
import Actor from "../base/Actor";
import Boss from "../boss/Boss";
import Dungeon from "../logic/Dungeon";
import Logic from "../logic/Logic";
import NonPlayer from "../logic/NonPlayer";
import Player from "../logic/Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ActorUtils {
    static getEnemyCollisionTarget(other: cc.Collider, isPlayer?: boolean): Actor {
        if (isPlayer) {
            if (other.tag == ColliderTag.NONPLAYER || other.tag == ColliderTag.BOSS) {
                return other.node.getComponent(Actor);
            }
        } else {
            if (other.tag == ColliderTag.PLAYER || other.tag == ColliderTag.GOODNONPLAYER) {
                return other.node.getComponent(Actor);
            }
        }
        return null;
    }
    static getEnemyActorByNode(other: cc.Node, isPlayer?: boolean) {
        if (isPlayer) {
            let non = other.getComponent(NonPlayer);
            if (non && non.data.isEnemy > 0) {
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
            if (non && non.data.isEnemy < 1) {
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
    static getPlayerPosition(selfPosition: cc.Vec3, dungeon: Dungeon, distance?: number) {
        return ActorUtils.getNearestTargetPosition(selfPosition, [Actor.TARGET_PLAYER], dungeon, true, distance);
    }
    /**
     * 获取当前位置离最近的敌人的方向
     * @param selfIsEnemy 自身是否的玩家的对立面
     * @param dungeon 
     * @param distance 
     */
     static getDirectionFromNearestEnemy(selfPosition: cc.Vec3, selfIsEnemy: boolean, dungeon: Dungeon, needRandom: boolean, distance?: number) {
        let pos = ActorUtils.getNearestTargetPosition(selfPosition, selfIsEnemy ? [Actor.TARGET_PLAYER, Actor.TARGET_NONPLAYER]
            : [Actor.TARGET_MONSTER, Actor.TARGET_NONPLAYER_ENEMY, Actor.TARGET_BOSS], dungeon, needRandom, distance);
        if(pos.equals(cc.Vec3.ZERO)){
            return cc.Vec3.ZERO;
        }else{
            return pos.subtract(selfPosition).normalize();
        }
    }
    /**
     * 获取最近的敌人位置
     * @param selfIsEnemy 自身是否的玩家的对立面
     * @param dungeon 
     * @param distance 
     */
    static getNearestEnemyPosition(selfPosition: cc.Vec3, selfIsEnemy: boolean, dungeon: Dungeon, needRandom: boolean, distance?: number) {
        return ActorUtils.getNearestTargetPosition(selfPosition, selfIsEnemy ? [Actor.TARGET_PLAYER, Actor.TARGET_NONPLAYER]
            : [Actor.TARGET_MONSTER, Actor.TARGET_NONPLAYER_ENEMY, Actor.TARGET_BOSS], dungeon, needRandom, distance);
    }
    /**
     * 获取最近的目标
     * @param targetTypes 
     * @param dungeon 
     * @param distance 
     */
    static getNearestTargetPosition(selfPosition: cc.Vec3, targetTypes: number[], dungeon: Dungeon, needRandom: boolean, distance?: number): cc.Vec3 {
        let targetActor: Actor = ActorUtils.getNearestTargetActor(selfPosition, targetTypes, dungeon, distance ? distance : 999999);
        if (targetActor) {
            return targetActor.getCenterPosition();
        }
        if (needRandom) {
            return selfPosition.clone().addSelf(cc.v3(Logic.getRandomNum(0, 600) - 300, Logic.getRandomNum(0, 600) - 300));
        }
        return cc.Vec3.ZERO;
    }

    /**
     * 获取最近的敌人节点
     * @param selfIsEnemy 
     * @param dungeon 
     * @param distance 
     */
    static getNearestEnemyActor(selfPosition: cc.Vec3, selfIsEnemy: boolean, dungeon: Dungeon) {
        return ActorUtils.getNearestTargetActor(selfPosition, selfIsEnemy ? [Actor.TARGET_PLAYER, Actor.TARGET_NONPLAYER]
            : [Actor.TARGET_MONSTER, Actor.TARGET_NONPLAYER_ENEMY, Actor.TARGET_BOSS], dungeon);
    }

    /**
     * 获取最近目标节点
     * @param targetTypes 
     * @param dungeon 
     * @param distance 
     */
    static getNearestTargetActor(selfPosition: cc.Vec3, targetTypes: number[], dungeon: Dungeon, distance?: number): Actor {
        if(!dungeon){
            return null;
        }
        let shortdis = distance ? distance : 999999;
        let targetActor: Actor;
        let targetList: Actor[] = [];
        for (let targetType of targetTypes) {
            if (targetType == Actor.TARGET_PLAYER) {
                targetList.push(dungeon.player);
            } else if (targetType == Actor.TARGET_MONSTER) {
                targetList = targetList.concat(dungeon.monsterManager.monsterList);
            } else if (targetType == Actor.TARGET_BOSS) {
                targetList = targetList.concat(dungeon.monsterManager.bossList);
            } else if (targetType == Actor.TARGET_NONPLAYER) {
                for (let non of dungeon.nonPlayerManager.nonPlayerList) {
                    if (non.data.isEnemy < 1) {
                        targetList.push(non);
                    }
                }
            } else if (targetType == Actor.TARGET_NONPLAYER_ENEMY) {
                for (let non of dungeon.nonPlayerManager.nonPlayerList) {
                    if (non.data.isEnemy > 0) {
                        targetList.push(non);
                    }
                }
            }
        }
        for (let target of targetList) {
            if (this.isTargetCanTrack(target)) {
                let dis = Logic.getDistanceNoSqrt(selfPosition, target.getCenterPosition());
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
     * 获取目标节点距离
     * @param playerNode 
     */
    static getTargetDistance(actor: Actor, target: Actor): number {
        if (!target) {
            return 999999;
        }
        let dis = Logic.getDistanceNoSqrt(actor.node.position, target.node.position);
        return dis;
    }

    /**
     * 目标是否存活
     * @param target 目标
     * @returns 
     */
    static isTargetAlive(target: Actor): boolean {
        if (!target || target.invisible || target.sc.isDied || !target.sc.isShow) {
            return false;
        }
        return true;
    }

    /**
     * 目标是否能追踪，隐身状态下可以被追踪,未展现，跳跃都不可被追踪
     * @param target 
     * @returns 
     */
    static isTargetCanTrack(target: Actor): boolean {
        if (target.isValid && !target.sc.isDied
            && target.sc.isShow  && !target.sc.isJumping) {
            return true;
        }
        return false;
    }
}