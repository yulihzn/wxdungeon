
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import DefaultStateMachine from "./DefaultStateMachine";
import State from "./State";

export default class StackStateMachine<E, S extends State<E>> extends DefaultStateMachine<E, S> {

	private stateStack:S[];
	public constructor( owner:E, initialState:S, globalState:S) {
		super(owner, initialState, globalState);
	}

	public setInitialState (state:S):void {
		this.stateStack = new Array<S>();
		this.currentState = state;
	}

	public getCurrentState ():S {
		return this.currentState;
	}

	public getPreviousState ():S {
		if (this.stateStack.length == 0) {
			return null;
		} else {
			return this.stateStack[this.stateStack.length-1];
		}
	}

	public changeState (newState:S):void {
		this._changeState(newState, true);
	}

	
	public  revertToPreviousState ():boolean {
		if (this.stateStack.length == 0) {
			return false;
		}

		let previousState = this.stateStack.pop();
		this._changeState(previousState, false);
		return true;
	}

	private _changeState (newState:S, pushCurrentStateToStack:boolean ):void {
		if (pushCurrentStateToStack && this.currentState) {
			this.stateStack.push(this.currentState);
		}
		if (this.currentState) this.currentState.exit(this.owner);
		this.currentState = newState;
		this.currentState.enter(this.owner);
	}

}