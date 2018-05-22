class LogicEvent extends egret.Event{
	public static readonly LOGIC:string = "LOGIC";
	public static readonly GAMEOVER:string = "LOGIC_GAMEOVER"
	public static readonly DUNGEON_BREAKTILE:string = "DUNGEON_BREAKTILE"
	public static readonly DUNGEON_NEXTLEVEL:string = "DUNGEON_NEXTLEVEL"
	public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
		super(type, bubbles, cancelable, data);
	}
}