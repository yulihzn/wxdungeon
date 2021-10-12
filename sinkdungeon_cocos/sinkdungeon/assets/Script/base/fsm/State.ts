import FsmEvent from "./FsmEvent";

export default interface State<T> {
    enter(entity:T):void;
    update(entity:T):void;
    exit(entity:T):void;
    event(entity:T,event:FsmEvent):boolean;
}
