import BasePlayerActorState from '../base/BasePlayerActorState'
import FsmEvent from '../base/fsm/FsmEvent'
import Player from '../logic/Player'

/**待机：移动，攻击，射击，冲刺，格挡 */
export class IDLE extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        // entity.enterIdle()
    }
    update(entity: Player): void {
        super.update(entity)
        if (entity.sc.isDashing) {
            entity.stateMachine.changeState(PlayerActorState.DASH)
        } else if (entity.sc.isAttacking) {
            entity.stateMachine.changeState(PlayerActorState.ATTACK)
        } else if (entity.sc.isShooting) {
            entity.stateMachine.changeState(PlayerActorState.SHOOT)
        } else if (entity.sc.isBlocking) {
            entity.stateMachine.changeState(PlayerActorState.BLOCK)
        } else if (entity.sc.isOtherAniming) {
            entity.stateMachine.changeState(PlayerActorState.OTHER)
        } else if (entity.sc.isMoving) {
            entity.stateMachine.changeState(PlayerActorState.MOVE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        return true
    }
}
/**移动：待机，攻击，射击，冲刺，格挡 */
export class MOVE extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        // entity.enterMove()
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isMoving) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        } else if (entity.sc.isAttacking) {
            entity.stateMachine.changeState(PlayerActorState.ATTACK)
        } else if (entity.sc.isShooting) {
            entity.stateMachine.changeState(PlayerActorState.SHOOT)
        } else if (entity.sc.isDashing) {
            entity.stateMachine.changeState(PlayerActorState.DASH)
        } else if (entity.sc.isBlocking) {
            entity.stateMachine.changeState(PlayerActorState.BLOCK)
        } else if (entity.sc.isOtherAniming) {
            entity.stateMachine.changeState(PlayerActorState.OTHER)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        return true
    }
}

/**攻击：待机*/
export class ATTACK extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        // entity.enterAttack()
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isAttacking) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        return true
    }
}

/**准备：  展现*/
export class PRPARE extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
    }
    update(entity: Player): void {
        super.update(entity)
        entity.stateMachine.changeState(PlayerActorState.SHOW)
    }
    exit(entity: Player): void {
        super.exit(entity)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        return true
    }
}
/**展现： 待机*/
export class SHOW extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        // entity.enterShow();
    }
    update(entity: Player): void {
        super.update(entity)
        if (entity.sc.isShow) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        return true
    }
}
/** 死亡： */
export class DIED extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        entity.killed()
    }
    update(entity: Player): void {
        super.update(entity)
    }
    exit(entity: Player): void {
        super.exit(entity)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        return true
    }
}
/**受伤：待机 */
export class HURT extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isHurting) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        return true
    }
}

/** 冲刺：待机*/
export class DASH extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        // entity.enterDash()
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isDashing) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        return true
    }
}

/**防御： */
export class BLOCK extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        // entity.enterDefend()
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isBlocking) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        return true
    }
}

/**射击： */
export class SHOOT extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        // entity.enterShoot()
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isShooting) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        return true
    }
}

/**杂项动作： */
export class OTHER extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        // entity.enterOther()
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isOtherAniming) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        return true
    }
}
export class JUMP extends BasePlayerActorState {}
export class JUMP_SHOOT extends BasePlayerActorState {}
export class JUMP_BLOCK extends BasePlayerActorState {}
export class JUMP_HOLD extends BasePlayerActorState {}
/** 全局：死亡 受伤*/
export class GLOBAL extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
    }
    update(entity: Player): void {
        super.update(entity)
        if (entity.sc.isDied) {
            return
        }
        if (entity.data.currentHealth <= 0) {
            entity.stateMachine.changeState(PlayerActorState.DIED)
        } else if (!PlayerActorState.HURT.isRunnig && entity.sc.isHurting) {
            entity.stateMachine.changeState(PlayerActorState.HURT)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        return true
    }
}
export default class PlayerActorState {
    static GLOBAL = new GLOBAL('GLOBAL')
    static MOVE = new MOVE('MOVE')
    static ATTACK = new ATTACK('ATTACK')
    static IDLE = new IDLE('IDLE')
    static DIED = new DIED('DIED')
    static HURT = new HURT('HURT')
    static PRPARE = new PRPARE('PRPARE')
    static SHOW = new SHOW('SHOW')
    static DASH = new DASH('DASH')
    static SHOOT = new SHOOT('SHOOT')
    static BLOCK = new BLOCK('BLOCK')
    static OTHER = new OTHER('OTHER')
}
