import FsmEvent from "../Base/fsm/FsmEvent";
import State from "../Base/fsm/State";
import Monster from "../Monster";
import Utils from "../Utils/Utils";
import NonPlayerActor from "./NonPlayerActor";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NonPlayerActorState implements State<NonPlayerActor>{
    enter(entity: NonPlayerActor): void {
        throw new Error("Method not implemented.");
    }
    update(entity: NonPlayerActor): void {
        throw new Error("Method not implemented.");
    }
    exit(entity: NonPlayerActor): void {
        throw new Error("Method not implemented.");
    }
    event(entity: NonPlayerActor, event: FsmEvent): boolean {
        throw new Error("Method not implemented.");
    }
    static showLog = true;
    static log(msg:String):void{
        if(this.showLog){
            cc.log(msg);
        }
    }
    
    static IDLE: State<NonPlayerActor> = {
        enter(entity: NonPlayerActor): void { Utils.log(`${entity.actorName()}(IDLE):enter`);},
        update(entity: NonPlayerActor): void { 
    if(entity instanceof Monster){
        if(entity.isMoving){
            entity.stateMachine.changeState(NonPlayerActorState.WALK);
        }else if(entity.isAttackAnimExcuting){
            entity.stateMachine.changeState(NonPlayerActorState.ATTACK);
        }
    }},
        exit(entity: NonPlayerActor): void {Utils.log(`${entity.actorName()}(IDLE):exit`); },
        event(entity: NonPlayerActor, event: FsmEvent): boolean {Utils.log(`${entity.actorName()}(IDLE):event`); return true; }
    };
    static WALK: State<NonPlayerActor> = {
        enter(entity: NonPlayerActor): void { Utils.log(`${entity.actorName()}(WALK):enter`);},
        update(entity: NonPlayerActor): void {
            if(entity instanceof Monster){
                if(!entity.isMoving){
                    entity.stateMachine.changeState(NonPlayerActorState.IDLE);
                }else if(entity.isAttackAnimExcuting){
                    entity.stateMachine.changeState(NonPlayerActorState.ATTACK);
                }
            }
         },
        exit(entity: NonPlayerActor): void {Utils.log(`${entity.actorName()}(WALK):exit`); },
        event(entity: NonPlayerActor, event: FsmEvent): boolean {Utils.log(`${entity.actorName()}(WALK):event`); return true; }
    };
    static ATTACK: State<NonPlayerActor> = {
        enter(entity: NonPlayerActor): void { Utils.log(`${entity.actorName()}(ATTACK):enter`);},
        update(entity: NonPlayerActor): void {
            if(entity instanceof Monster){
                if(!entity.isAttackAnimExcuting){
                    entity.stateMachine.changeState(NonPlayerActorState.IDLE);
                }
            }
        },
        exit(entity: NonPlayerActor): void {Utils.log(`${entity.actorName()}(ATTACK):exit`); },
        event(entity: NonPlayerActor, event: FsmEvent): boolean {Utils.log(`${entity.actorName()}(ATTACK):event`); return true; }
    };
    static SPECIALATTACK: State<NonPlayerActor> = {
        enter(entity: NonPlayerActor): void { Utils.log(`${entity.actorName()}(SPECIALATTACK):enter`);},
        update(entity: NonPlayerActor): void {
            if(entity instanceof Monster){
                if(!entity.isAttackAnimExcuting){
                    entity.stateMachine.changeState(NonPlayerActorState.IDLE);
                }
            }
        },
        exit(entity: NonPlayerActor): void {Utils.log(`${entity.actorName()}(SPECIALATTACK):exit`); },
        event(entity: NonPlayerActor, event: FsmEvent): boolean {Utils.log(`${entity.actorName()}(SPECIALATTACK):event`); return true; }
    };
    static DIE: State<NonPlayerActor> = {
        enter(entity: NonPlayerActor): void { Utils.log(`${entity.actorName()}(DIE):enter`);},
        update(entity: NonPlayerActor): void {},
        exit(entity: NonPlayerActor): void {Utils.log(`${entity.actorName()}(DIE):exit`); },
        event(entity: NonPlayerActor, event: FsmEvent): boolean {Utils.log(`${entity.actorName()}(DIE):event`); return true; }
    };
    static TAKEDAMAGE: State<NonPlayerActor> = {
        enter(entity: NonPlayerActor): void { Utils.log(`${entity.actorName()}(TAKEDAMAGE):enter`);},
        update(entity: NonPlayerActor): void {
            if(entity instanceof Monster){
                if(entity.isDied){
                    entity.stateMachine.changeState(NonPlayerActorState.DIE);
                }
            }
        },
        exit(entity: NonPlayerActor): void {Utils.log(`${entity.actorName()}(TAKEDAMAGE):exit`); },
        event(entity: NonPlayerActor, event: FsmEvent): boolean {Utils.log(`${entity.actorName()}(TAKEDAMAGE):event`); return true; }
    };
    static TALK: State<NonPlayerActor> = {
        enter(entity: NonPlayerActor): void { Utils.log(`${entity.actorName()}(TALK):enter`);},
        update(entity: NonPlayerActor): void {},
        exit(entity: NonPlayerActor): void {Utils.log(`${entity.actorName()}(TALK):exit`); },
        event(entity: NonPlayerActor, event: FsmEvent): boolean {Utils.log(`${entity.actorName()}(TALK):event`); return true; }
    };
    static BLOCK: State<NonPlayerActor> = {
        enter(entity: NonPlayerActor): void { Utils.log(`${entity.actorName()}(BLOCK):enter`);},
        update(entity: NonPlayerActor): void {},
        exit(entity: NonPlayerActor): void {Utils.log(`${entity.actorName()}(BLOCK):exit`); },
        event(entity: NonPlayerActor, event: FsmEvent): boolean {Utils.log(`${entity.actorName()}(BLOCK):event`); return true; }
    };
    static DISGUISE: State<NonPlayerActor> = {
        enter(entity: NonPlayerActor): void { Utils.log(`${entity.actorName()}(DISGUISE):enter`);},
        update(entity: NonPlayerActor): void {},
        exit(entity: NonPlayerActor): void {Utils.log(`${entity.actorName()}(DISGUISE):exit`); },
        event(entity: NonPlayerActor, event: FsmEvent): boolean {Utils.log(`${entity.actorName()}(DISGUISE):event`); return true; }
    };
    static DASH: State<NonPlayerActor> = {
        enter(entity: NonPlayerActor): void { Utils.log(`${entity.actorName()}(DASH):enter`);},
        update(entity: NonPlayerActor): void {},
        exit(entity: NonPlayerActor): void {Utils.log(`${entity.actorName()}(DASH):exit`); },
        event(entity: NonPlayerActor, event: FsmEvent): boolean {Utils.log(`${entity.actorName()}(DASH):event`); return true; }
    };
    static DODGE: State<NonPlayerActor> = {
        enter(entity: NonPlayerActor): void { Utils.log(`${entity.actorName()}(DODGE):enter`);},
        update(entity: NonPlayerActor): void {},
        exit(entity: NonPlayerActor): void {Utils.log(`${entity.actorName()}(DODGE):exit`); },
        event(entity: NonPlayerActor, event: FsmEvent): boolean {Utils.log(`${entity.actorName()}(DODGE):event`); return true; }
    };
    static DEFAULT: State<NonPlayerActor> = {
        enter(entity: NonPlayerActor): void { Utils.log(`${entity.actorName()}(DEFAULT):enter`);},
        update(entity: NonPlayerActor): void {},
        exit(entity: NonPlayerActor): void {Utils.log(`${entity.actorName()}(DEFAULT):exit`); },
        event(entity: NonPlayerActor, event: FsmEvent): boolean {Utils.log(`${entity.actorName()}(DEFAULT):event`); return true; }
    };
}
