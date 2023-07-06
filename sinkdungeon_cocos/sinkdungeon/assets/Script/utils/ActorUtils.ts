import { MoveComponent } from './../ecs/component/MoveComponent'
import Actor from '../base/Actor'
import Boss from '../boss/Boss'
import CCollider from '../collider/CCollider'
import Dungeon from '../logic/Dungeon'
import Logic from '../logic/Logic'
import NonPlayer from '../logic/NonPlayer'
import Player from '../logic/Player'
import Utils from './Utils'
import IndexZ from './IndexZ'
import BaseColliderComponent from '../base/BaseColliderComponent'

export default class ActorUtils {
    static getEnemyCollisionTarget(other: CCollider, isPlayer?: boolean): Actor {
        if (isPlayer) {
            if (other.tag == CCollider.TAG.NONPLAYER || other.tag == CCollider.TAG.BOSS) {
                return other.node.getComponent(Actor)
            }
        } else {
            if (other.tag == CCollider.TAG.PLAYER || other.tag == CCollider.TAG.GOODNONPLAYER) {
                return other.node.getComponent(Actor)
            }
        }
        return null
    }
    static getEnemyActorByNode(other: cc.Node, isPlayer?: boolean) {
        if (isPlayer) {
            let non = other.getComponent(NonPlayer)
            if (non && non.data.isEnemy > 0) {
                return non
            }
            let boss = other.getComponent(Boss)
            if (boss) {
                return boss
            }
        } else {
            let player = other.getComponent(Player)
            if (player) {
                return player
            }
            let non = other.getComponent(NonPlayer)
            if (non && non.data.isEnemy < 1) {
                return non
            }
        }
        return null
    }
    /**
     * 获取最近的玩家
     * @param dungeon
     * @param distance
     */
    static getPlayerPosition(selfPosition: cc.Vec3, dungeon: Dungeon, distance?: number) {
        return ActorUtils.getNearestTargetPosition(selfPosition, [Actor.TARGET_PLAYER], dungeon, true, distance)
    }
    /**
     * 获取当前位置离最近的敌人的方向
     * @param selfIsEnemy 自身是否的玩家的对立面
     * @param dungeon
     * @param distance
     */
    static getDirectionFromNearestEnemy(selfPosition: cc.Vec3, selfIsEnemy: boolean, dungeon: Dungeon, needRandom: boolean, distance?: number) {
        let targetActor: Actor = ActorUtils.getNearestEnemyActor(selfPosition, selfIsEnemy, dungeon, distance)
        return ActorUtils.getTargetDirection(selfPosition, targetActor, needRandom)
    }
    static getTargetDirection(selfPosition: cc.Vec3, targetActor: Actor, needRandom: boolean) {
        let pos = ActorUtils.getTargetPosition(selfPosition, targetActor, needRandom)
        if (pos.equals(cc.Vec3.ZERO)) {
            return cc.Vec3.ZERO
        } else {
            return pos.subtract(selfPosition).normalize()
        }
    }
    /**
     * 获取最近的敌人位置
     * @param selfIsEnemy 自身是否的玩家的对立面
     * @param dungeon
     * @param distance
     */
    static getNearestEnemyPosition(selfPosition: cc.Vec3, selfIsEnemy: boolean, dungeon: Dungeon, needRandom: boolean, distance?: number) {
        return ActorUtils.getNearestTargetPosition(
            selfPosition,
            selfIsEnemy ? [Actor.TARGET_PLAYER, Actor.TARGET_NONPLAYER] : [Actor.TARGET_MONSTER, Actor.TARGET_NONPLAYER_ENEMY, Actor.TARGET_BOSS],
            dungeon,
            needRandom,
            distance
        )
    }
    /**
     * 获取最近的目标
     * @param targetTypes
     * @param dungeon
     * @param distance
     */
    static getNearestTargetPosition(selfPosition: cc.Vec3, targetTypes: number[], dungeon: Dungeon, needRandom: boolean, distance?: number): cc.Vec3 {
        let targetActor: Actor = ActorUtils.getNearestTargetActor(selfPosition, targetTypes, dungeon, distance ? distance : 999999)
        return ActorUtils.getTargetPosition(selfPosition, targetActor, needRandom)
    }
    static getTargetPosition(selfPosition: cc.Vec3, targetActor: Actor, needRandom: boolean) {
        if (targetActor) {
            return targetActor.getCenterPosition()
        }
        if (needRandom) {
            return selfPosition.clone().addSelf(cc.v3(Logic.getRandomNum(0, 600) - 300, Logic.getRandomNum(0, 600) - 300))
        }
        return cc.Vec3.ZERO
    }

    /**
     * 获取最近的敌人节点
     * @param selfIsEnemy
     * @param dungeon
     * @param distance
     */
    static getNearestEnemyActor(selfPosition: cc.Vec3, selfIsEnemy: boolean, dungeon: Dungeon, distance?: number) {
        return ActorUtils.getNearestTargetActor(
            selfPosition,
            selfIsEnemy ? [Actor.TARGET_PLAYER, Actor.TARGET_NONPLAYER] : [Actor.TARGET_MONSTER, Actor.TARGET_NONPLAYER_ENEMY, Actor.TARGET_BOSS],
            dungeon,
            distance
        )
    }

    /**
     * 获取最近目标节点
     * @param targetTypes
     * @param dungeon
     * @param distance
     */
    static getNearestTargetActor(selfPosition: cc.Vec3, targetTypes: number[], dungeon: Dungeon, distance?: number): Actor {
        if (!dungeon) {
            return null
        }
        let shortdis = distance ? distance : 999999
        let targetActor: Actor
        let targetList: Actor[] = []
        for (let targetType of targetTypes) {
            if (targetType == Actor.TARGET_PLAYER) {
                targetList.push(dungeon.player)
            } else if (targetType == Actor.TARGET_MONSTER) {
                targetList = targetList.concat(dungeon.monsterManager.monsterList)
            } else if (targetType == Actor.TARGET_BOSS) {
                targetList = targetList.concat(dungeon.monsterManager.bossList)
            } else if (targetType == Actor.TARGET_NONPLAYER) {
                for (let non of dungeon.nonPlayerManager.nonPlayerList) {
                    if (non && non.node && non.node.active && non.data.isEnemy < 1) {
                        targetList.push(non)
                    }
                }
            } else if (targetType == Actor.TARGET_NONPLAYER_ENEMY) {
                for (let non of dungeon.nonPlayerManager.nonPlayerList) {
                    if (non && non.node && non.node.active && non.data.isEnemy > 0) {
                        targetList.push(non)
                    }
                }
            }
        }
        for (let target of targetList) {
            if (this.isTargetCanTrack(target)) {
                let dis = Logic.getDistanceNoSqrt(selfPosition, target.getCenterPosition())
                if (dis < shortdis) {
                    shortdis = dis
                    targetActor = target
                }
            }
        }
        if (targetActor) {
            return targetActor
        }
        return null
    }
    /**
     * 获取目标节点距离
     * @param playerNode
     */
    static getTargetDistance(actor: Actor, target: Actor): number {
        if (!target) {
            return 999999
        }
        let dis = Logic.getDistanceNoSqrt(actor.node.position, target.node.position)
        return dis
    }

    /**
     * 目标是否存活
     * @param target 目标
     * @returns
     */
    static isTargetAlive(target: Actor): boolean {
        if (!target || target.invisible || target.sc.isDied || !target.sc.isShow) {
            return false
        }
        return true
    }

    /**
     * 目标是否能追踪，隐身状态下可以被追踪,未展现，跳跃都不可被追踪
     * @param target
     * @returns
     */
    static isTargetCanTrack(target: Actor): boolean {
        if (target && target.node && target.node.active && target.isValid && !target.sc.isDied && target.sc.isShow) {
            return true
        }
        return false
    }

    /**
     * 是否在目标背面
     */
    static isBehindTarget(self: Actor, target: Actor): boolean {
        let isTargetOnRight = target.node.position.x > self.node.position.x
        let isTargetFaceRight = target.isFaceRight
        return (isTargetOnRight && isTargetFaceRight) || (!isTargetOnRight && !isTargetFaceRight)
    }

    /**
     * 获取冲刺距离
     */
    static getDashDistance(actor: Actor, speed: number, second: number) {
        if (!actor || !actor.entity || !actor.entity.Move) {
            cc.log('actor或者entity不存在')
            return 0
        }
        return Utils.getDashDistanceByTime(speed, actor.entity.Move.damping, second) * MoveComponent.PIXELS_PER_UNIT
    }
    static getDashTime(actor: Actor, speed: number) {
        return Utils.getDashTime(speed, actor.entity.Move.damping)
    }

    static changeZIndex(actor: Actor | BaseColliderComponent) {
        let offsetY = actor.entity.Transform.base
        if (offsetY > 0) {
            offsetY += 500
        }
        actor.node.zIndex = IndexZ.getActorZIndex(cc.v3(actor.node.position.x, actor.node.position.y - offsetY))
    }
}
