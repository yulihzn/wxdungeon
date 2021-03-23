import BaseNonPlayerActorState from "../Base/BaseNonPlayerActorState";
import FsmEvent from "../Base/fsm/FsmEvent";
import Monster from "../Monster";
import Utils from "../Utils/Utils";

/**待机：移动，攻击，特殊攻击，受伤，冲刺，对话，格挡，伪装，闪避 */
export class IDLE extends BaseNonPlayerActorState {
    enter(entity: Monster): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}(IDLE):enter`);
        entity.enterIdle();
    }
    update(entity: Monster): void {
        super.update(entity);
        if (entity.sc.isMoving) {
            entity.stateMachine.changeState(NonPlayerActorState.WALK);
        } else if (entity.sc.isAttacking) {
            entity.stateMachine.changeState(NonPlayerActorState.ATTACK);
        }
    }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(IDLE):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(IDLE):event`); return true; }
};
/**移动：待机，攻击，特殊攻击，冲刺，对话，格挡，闪避 */
export class WALK extends BaseNonPlayerActorState {
    enter(entity: Monster): void {
        super.enter(entity);
        entity.enterWalk(); Utils.log(`${entity.actorName()}(WALK):enter`);
    }
    update(entity: Monster): void {
        super.update(entity);
        if (!entity.sc.isMoving) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        } else if (entity.sc.isAttacking) {
            entity.stateMachine.changeState(NonPlayerActorState.ATTACK);
        } else if (entity.sc.isDodging) {
            entity.stateMachine.changeState(NonPlayerActorState.DODGE);
        }
    }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(WALK):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(WALK):event`); return true; }
};
/**攻击：待机*/
export class ATTACK extends BaseNonPlayerActorState {
    enter(entity: Monster): void { super.enter(entity); Utils.log(`${entity.actorName()}(ATTACK):enter`); }
    update(entity: Monster): void {
        super.update(entity);
        if (!entity.sc.isAttacking) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(ATTACK):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(ATTACK):event`); return true; }
};

/**准备： 待机，伪装, 展现*/
export class PRPARE extends BaseNonPlayerActorState {
    enter(entity: Monster): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}(PRPARE):enter`);
    }
    update(entity: Monster): void {
        super.update(entity);
        if (entity.sc.isDisguising) {
            entity.stateMachine.changeState(NonPlayerActorState.DISGUISE);
        } else {
            entity.stateMachine.changeState(NonPlayerActorState.SHOW);
        }
    }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(PRPARE):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(PRPARE):event`); return true; }
};
/**展现： 待机*/
export class SHOW extends BaseNonPlayerActorState {
    enter(entity: Monster): void {
        super.enter(entity); Utils.log(`${entity.actorName()}(SHOW):enter`);
        entity.enterShow();
    }
    update(entity: Monster): void {
        super.update(entity);
        if (entity.sc.isShow) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(SHOW):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(SHOW):event`); return true; }
};
/** 死亡： */
export class DIED extends BaseNonPlayerActorState {
    enter(entity: Monster): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}(DIE):enter`);
        entity.killed();
    }
    update(entity: Monster): void { super.update(entity); }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(DIE):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(DIE):event`); return true; }
};
/**受伤：待机，格挡 */
export class HURT extends BaseNonPlayerActorState {
    enter(entity: Monster): void {
        super.enter(entity); Utils.log(`${entity.actorName()}(HURT):enter`);
    }
    update(entity: Monster): void {
        super.update(entity);
        if (!entity.sc.isHurting) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        } else if (entity.sc.isFalling) {
            entity.stateMachine.changeState(NonPlayerActorState.FALL);
        }
    }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(TAKEDAMAGE):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(TAKEDAMAGE):event`); return true; }
};
/**对话（暂无）： */
export class TALK extends BaseNonPlayerActorState {
    enter(entity: Monster): void { super.enter(entity); Utils.log(`${entity.actorName()}(TALK):enter`); }
    update(entity: Monster): void { super.update(entity); }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(TALK):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(TALK):event`); return true; }
};
/**格挡：待机，攻击 */
export class BLOCK extends BaseNonPlayerActorState {
    enter(entity: Monster): void { super.enter(entity); Utils.log(`${entity.actorName()}(BLOCK):enter`); }
    update(entity: Monster): void { super.update(entity); }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(BLOCK):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(BLOCK):event`); return true; }
};
/** 伪装：待机*/
export class DISGUISE extends BaseNonPlayerActorState {
    enter(entity: Monster): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}(DISGUISE):enter`);
        entity.enterDisguise();
    }
    update(entity: Monster): void {
        super.update(entity);
        if (!entity.sc.isDisguising) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(DISGUISE):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(DISGUISE):event`); return true; }
};
/** 冲刺：待机*/
export class DASH extends BaseNonPlayerActorState {
    enter(entity: Monster): void { super.enter(entity); Utils.log(`${entity.actorName()}(DASH):enter`); }
    update(entity: Monster): void {
        super.update(entity);
        if (!entity.sc.isDashing) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(DASH):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(DASH):event`); return true; }
};
/**闪避：待机 */
export class DODGE extends BaseNonPlayerActorState {
    enter(entity: Monster): void { super.enter(entity); Utils.log(`${entity.actorName()}(DODGE):enter`); }
    update(entity: Monster): void {
        super.update(entity);
        if (!entity.sc.isDodging) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(DODGE):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(DODGE):event`); return true; }
};
/**眩晕：待机 */
export class DIZZ extends BaseNonPlayerActorState {
    enter(entity: Monster): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}(DIZZ):enter`);
        entity.enterDizz();
    }
    update(entity: Monster): void {
        super.update(entity);
        if (!entity.sc.isDizzing) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(DIZZ):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(DIZZ):event`); return true; }
};
/**闪烁：待机 */
export class BLINK extends BaseNonPlayerActorState {
    enter(entity: Monster): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}(BLINK):enter`);
        entity.enterBlink();
    }
    update(entity: Monster): void {
        super.update(entity);
        if (!entity.sc.isBlinking) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(BLINK):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(BLINK):event`); return true; }
};
/**摔倒：待机 */
export class FALL extends BaseNonPlayerActorState {
    enter(entity: Monster): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}(FALL):enter`);
        entity.enterBlink();
    }
    update(entity: Monster): void {
        super.update(entity);
        if (!entity.sc.isFalling) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(FALL):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(FALL):event`); return true; }
};
/** 全局：死亡 受伤*/
export class GLOBAL extends BaseNonPlayerActorState {
    enter(entity: Monster): void { super.enter(entity); Utils.log(`${entity.actorName()}(GLOBAL):enter`); }
    update(entity: Monster): void {
        super.update(entity);
        if (entity.data.currentHealth <= 0) {
            entity.stateMachine.changeState(NonPlayerActorState.DIED);
        } else if (entity.sc.isHurting) {
            entity.stateMachine.changeState(NonPlayerActorState.HURT);
        }
    }
    exit(entity: Monster): void { super.exit(entity); Utils.log(`${entity.actorName()}(GLOBAL):exit`); }
    event(entity: Monster, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}(GLOBAL):event`); return true; }
};
export default class NonPlayerActorState {
    static GLOBAL = new GLOBAL();
    static WALK = new WALK();
    static ATTACK = new ATTACK();
    static IDLE = new IDLE();
    static DISGUISE = new DISGUISE();
    static DIED = new DIED();
    static DODGE = new DODGE();
    static HURT = new HURT();
    static PRPARE = new PRPARE();
    static SHOW = new SHOW();
    static BLINK = new BLINK();
    static FALL = new FALL();
}


