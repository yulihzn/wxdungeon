import BasePlayerActorState from '../base/BasePlayerActorState'
import FsmEvent from '../base/fsm/FsmEvent'
import Player from '../logic/Player'
import Utils from '../utils/Utils'

/**待机：移动，攻击，特殊攻击，受伤，冲刺，对话，格挡，伪装，闪避 */
export class IDLE extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(IDLE):enter`)
        // entity.enterIdle()
    }
    update(entity: Player): void {
        super.update(entity)
        if (entity.sc.isDashing) {
            entity.stateMachine.changeState(PlayerActorState.DASH)
        } else if (entity.sc.isBlinking) {
            entity.stateMachine.changeState(PlayerActorState.BLINK)
        } else if (entity.sc.isDodging) {
            entity.stateMachine.changeState(PlayerActorState.DODGE)
        } else if (entity.sc.isAttacking) {
            entity.stateMachine.changeState(PlayerActorState.ATTACK)
        } else if (entity.sc.isTalking) {
            entity.stateMachine.changeState(PlayerActorState.TALK)
        } else if (entity.sc.isMoving) {
            entity.stateMachine.changeState(PlayerActorState.WALK)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(IDLE):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(IDLE):event`)
        return true
    }
}
/**移动：待机，攻击，特殊攻击，冲刺，对话，格挡，闪避 */
export class WALK extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        // entity.enterWalk()
        Utils.log(`${entity.actorName()}${entity.node.uuid}(WALK):enter`)
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isMoving) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        } else if (entity.sc.isAttacking) {
            entity.stateMachine.changeState(PlayerActorState.ATTACK)
        } else if (entity.sc.isDodging) {
            entity.stateMachine.changeState(PlayerActorState.DODGE)
        } else if (entity.sc.isBlinking) {
            entity.stateMachine.changeState(PlayerActorState.BLINK)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(WALK):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(WALK):event`)
        return true
    }
}
/**攻击：待机*/
export class ATTACK extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(ATTACK):enter`)
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isAttacking) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(ATTACK):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(ATTACK):event`)
        return true
    }
}

/**准备： 待机，伪装, 展现*/
export class PRPARE extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(PRPARE):enter`)
    }
    update(entity: Player): void {
        super.update(entity)
        entity.stateMachine.changeState(PlayerActorState.SHOW)
    }
    exit(entity: Player): void {
        super.exit(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(PRPARE):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(PRPARE):event`)
        return true
    }
}
/**展现： 待机*/
export class SHOW extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(SHOW):enter`)
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
        Utils.log(`${entity.actorName()}${entity.node.uuid}(SHOW):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(SHOW):event`)
        return true
    }
}
/** 死亡： */
export class DIED extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DIE):enter`)
        entity.killed()
    }
    update(entity: Player): void {
        super.update(entity)
    }
    exit(entity: Player): void {
        super.exit(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DIE):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DIE):event`)
        return true
    }
}
/**受伤：待机，格挡 */
export class HURT extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(HURT):enter`)
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isHurting) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        } else if (entity.sc.isFalling) {
            entity.stateMachine.changeState(PlayerActorState.FALL)
        } else if (entity.sc.isBlinking) {
            entity.stateMachine.changeState(PlayerActorState.BLINK)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(HURT):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(TAKEDAMAGE):event`)
        return true
    }
}
/**对话（暂无）： */
export class TALK extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(TALK):enter`)
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isTalking) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(TALK):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(TALK):event`)
        return true
    }
}
/**格挡：待机，攻击 */
export class BLOCK extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(BLOCK):enter`)
    }
    update(entity: Player): void {
        super.update(entity)
    }
    exit(entity: Player): void {
        super.exit(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(BLOCK):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(BLOCK):event`)
        return true
    }
}
/** 冲刺：待机*/
export class DASH extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DASH):enter`)
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isDashing) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DASH):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DASH):event`)
        return true
    }
}
/**闪避：待机 */
export class DODGE extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DODGE):enter`)
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isDodging) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DODGE):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DODGE):event`)
        return true
    }
}
/**眩晕：待机 */
export class DIZZ extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DIZZ):enter`)
        // entity.enterDizz();
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isDizzing) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DIZZ):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DIZZ):event`)
        return true
    }
}
/**闪烁：待机 */
export class BLINK extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(BLINK):enter`)
        // entity.enterBlink();
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isBlinking) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(BLINK):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(BLINK):event`)
        return true
    }
}
/**摔倒：待机 */
export class FALL extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(FALL):enter`)
    }
    update(entity: Player): void {
        super.update(entity)
        if (!entity.sc.isFalling) {
            entity.stateMachine.changeState(PlayerActorState.IDLE)
        }
    }
    exit(entity: Player): void {
        super.exit(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(FALL):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(FALL):event`)
        return true
    }
}
/** 全局：死亡 受伤*/
export class GLOBAL extends BasePlayerActorState {
    enter(entity: Player): void {
        super.enter(entity)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(GLOBAL):enter`)
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
        Utils.log(`${entity.actorName()}${entity.node.uuid}(GLOBAL):exit`)
    }
    event(entity: Player, event: FsmEvent): boolean {
        super.event(entity, event)
        Utils.log(`${entity.actorName()}${entity.node.uuid}(GLOBAL):event`)
        return true
    }
}
export default class PlayerActorState {
    static GLOBAL = new GLOBAL()
    static WALK = new WALK()
    static ATTACK = new ATTACK()
    static IDLE = new IDLE()
    static DIED = new DIED()
    static DODGE = new DODGE()
    static HURT = new HURT()
    static PRPARE = new PRPARE()
    static SHOW = new SHOW()
    static BLINK = new BLINK()
    static FALL = new FALL()
    static TALK = new TALK()
    static DASH = new DASH()
}
