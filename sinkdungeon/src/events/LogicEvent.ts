class LogicEvent extends egret.Event{
	public static readonly LOGIC:string = "LOGIC";
	
	public static readonly GAMEOVER:string = "LOGIC_GAMEOVER"
	public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
		super(LogicEvent.LOGIC, bubbles, cancelable, data);
	}
}