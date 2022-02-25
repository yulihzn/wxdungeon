import BaseNonPlayerActorState from "../base/BaseNonPlayerActorState";
import FsmEvent from "../base/fsm/FsmEvent";
import NonPlayer from "../logic/NonPlayer";
import Utils from "../utils/Utils";

/**待机：移动，攻击，特殊攻击，受伤，冲刺，对话，格挡，伪装，闪避 */
export class IDLE extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}${entity.node.uuid}(IDLE):enter`);
        entity.enterIdle();
    }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (entity.sc.isDashing) {
            entity.stateMachine.changeState(NonPlayerActorState.DASH);
        }else if (entity.sc.isBlinking) {
            entity.stateMachine.changeState(NonPlayerActorState.BLINK);
        } else if (entity.sc.isDodging) {
            entity.stateMachine.changeState(NonPlayerActorState.DODGE);
        } else if (entity.sc.isAttacking) {
            entity.stateMachine.changeState(NonPlayerActorState.ATTACK);
        }  else if (entity.sc.isTalking) {
            entity.stateMachine.changeState(NonPlayerActorState.TALK);
        }else if (entity.sc.isMoving) {
            entity.stateMachine.changeState(NonPlayerActorState.WALK);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(IDLE):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(IDLE):event`); return true; }
};
/**移动：待机，攻击，特殊攻击，冲刺，对话，格挡，闪避 */
export class WALK extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void {
        super.enter(entity);
        entity.enterWalk(); Utils.log(`${entity.actorName()}${entity.node.uuid}(WALK):enter`);
    }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (!entity.sc.isMoving) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        } else if (entity.sc.isAttacking) {
            entity.stateMachine.changeState(NonPlayerActorState.ATTACK);
        } else if (entity.sc.isDodging) {
            entity.stateMachine.changeState(NonPlayerActorState.DODGE);
        } else if (entity.sc.isBlinking) {
            entity.stateMachine.changeState(NonPlayerActorState.BLINK);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(WALK):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(WALK):event`); return true; }
};
/**攻击：待机*/
export class ATTACK extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void { super.enter(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(ATTACK):enter`); }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (!entity.sc.isAttacking) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(ATTACK):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(ATTACK):event`); return true; }
};

/**准备： 待机，伪装, 展现*/
export class PRPARE extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}${entity.node.uuid}(PRPARE):enter`);
    }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (entity.sc.isDisguising) {
            entity.stateMachine.changeState(NonPlayerActorState.DISGUISE);
        } else {
            entity.stateMachine.changeState(NonPlayerActorState.SHOW);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(PRPARE):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(PRPARE):event`); return true; }
};
/**展现： 待机*/
export class SHOW extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void {
        super.enter(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(SHOW):enter`);
        entity.enterShow();
    }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (entity.sc.isShow) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(SHOW):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(SHOW):event`); return true; }
};
/** 死亡： */
export class DIED extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DIE):enter`);
        entity.killed();
    }
    update(entity: NonPlayer): void { super.update(entity); }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(DIE):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(DIE):event`); return true; }
};
/**受伤：待机，格挡 */
export class HURT extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void {
        super.enter(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(HURT):enter`);
    }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (!entity.sc.isHurting) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        } else if (entity.sc.isFalling) {
            entity.stateMachine.changeState(NonPlayerActorState.FALL);
        } else if (entity.sc.isBlinking) {
            entity.stateMachine.changeState(NonPlayerActorState.BLINK);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(TAKEDAMAGE):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(TAKEDAMAGE):event`); return true; }
};
/**对话（暂无）： */
export class TALK extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void { super.enter(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(TALK):enter`); }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (!entity.sc.isTalking) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(TALK):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(TALK):event`); return true; }
};
/**格挡：待机，攻击 */
export class BLOCK extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void { super.enter(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(BLOCK):enter`); }
    update(entity: NonPlayer): void { super.update(entity); }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(BLOCK):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(BLOCK):event`); return true; }
};
/** 伪装：待机*/
export class DISGUISE extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DISGUISE):enter`);
        entity.enterDisguise();
    }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (!entity.sc.isDisguising) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(DISGUISE):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(DISGUISE):event`); return true; }
};
/** 冲刺：待机*/
export class DASH extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void { super.enter(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(DASH):enter`); }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (!entity.sc.isDashing) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(DASH):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(DASH):event`); return true; }
};
/**闪避：待机 */
export class DODGE extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void { super.enter(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(DODGE):enter`); }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (!entity.sc.isDodging) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(DODGE):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(DODGE):event`); return true; }
};
/**眩晕：待机 */
export class DIZZ extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}${entity.node.uuid}(DIZZ):enter`);
        entity.enterDizz();
    }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (!entity.sc.isDizzing) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(DIZZ):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(DIZZ):event`); return true; }
};
/**闪烁：待机 */
export class BLINK extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}${entity.node.uuid}(BLINK):enter`);
        entity.enterBlink();
    }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (!entity.sc.isBlinking) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(BLINK):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(BLINK):event`); return true; }
};
/**摔倒：待机 */
export class FALL extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void {
        super.enter(entity);
        Utils.log(`${entity.actorName()}${entity.node.uuid}(FALL):enter`);
    }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (!entity.sc.isFalling) {
            entity.stateMachine.changeState(NonPlayerActorState.IDLE);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(FALL):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(FALL):event`); return true; }
};
/** 全局：死亡 受伤*/
export class GLOBAL extends BaseNonPlayerActorState {
    enter(entity: NonPlayer): void { super.enter(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(GLOBAL):enter`); }
    update(entity: NonPlayer): void {
        super.update(entity);
        if (entity.sc.isDied) {
            return;
        }
        if (entity.data.currentHealth <= 0) {
            entity.stateMachine.changeState(NonPlayerActorState.DIED);
        } else if (!NonPlayerActorState.HURT.isRunnig && entity.sc.isHurting) {
            entity.stateMachine.changeState(NonPlayerActorState.HURT);
        }
    }
    exit(entity: NonPlayer): void { super.exit(entity); Utils.log(`${entity.actorName()}${entity.node.uuid}(GLOBAL):exit`); }
    event(entity: NonPlayer, event: FsmEvent): boolean { super.event(entity, event); Utils.log(`${entity.actorName()}${entity.node.uuid}(GLOBAL):event`); return true; }
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
    static TALK = new TALK();
    static DASH = new DASH();
}


