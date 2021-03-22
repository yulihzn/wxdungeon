
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import FsmEvent from "./FsmEvent";
import State from "./State";
import StateMachine from "./StateMachine";

export default class DefaultStateMachine<E, S extends State<E>> implements StateMachine<E, S> {

	protected owner: E;
	protected currentState: S;
	protected previousState: S;
	protected globalState: S;
	public constructor(owner?: E, initialState?: S, globalState?: S) {
		this.owner = owner;
		this.setInitialState(initialState);
		this.setGlobalState(globalState);
	}
	public getOwner(): E {
		return this.owner;
	}
	public setOwner(owner: E): void {
		this.owner = owner;
	}

	public setInitialState(state: S): void {
		this.previousState = null;
		this.currentState = state;
	}

	public setGlobalState(state: S): void {
		this.globalState = state;
	}

	public getCurrentState(): S {
		return this.currentState;
	}

	public getGlobalState(): S {
		return this.globalState;
	}

	public getPreviousState(): S {
		return this.previousState;
	}

	public update(): void {
		if (this.globalState) this.globalState.update(this.owner);
		if (this.currentState) this.currentState.update(this.owner);
	}

	public changeState(newState: S): void {
		this.previousState = this.currentState;
		if (this.currentState) this.currentState.exit(this.owner);
		this.currentState = newState;
		if (this.currentState) this.currentState.enter(this.owner);
	}

	public revertToPreviousState(): boolean {
		if (!this.previousState) {
			return false;
		}
		this.changeState(this.previousState);
		return true;
	}
	public isInState(state: S): boolean {
		return this.currentState == state;
	}

	public handleEvent(event: FsmEvent): boolean {

		if (this.currentState && this.currentState.event(this.owner, event)) {
			return true;
		}
		if (this.globalState && this.globalState.event(this.owner, event)) {
			return true;
		}

		return false;
	}
}