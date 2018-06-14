class LogicEvent extends egret.Event{
	public static readonly LOGIC:string = "LOGIC";
	public static readonly GAMEOVER:string = "LOGIC_GAMEOVER";
	public static readonly DUNGEON_NEXTLEVEL:string = "DUNGEON_NEXTLEVEL";
	public static readonly DUNGEON_BREAKTILE:string = "DUNGEON_BREAKTILE";
	public static readonly UI_REFRESHTEXT:string = "UI_REFRESHTEXT";
	public static readonly GET_GEM:string = "GET_GEM";
	public static readonly PLAYER_MOVE:string = "PLAYER_MOVE";
	public static readonly GET_ITEM:string = "GET_ITEM";
	public static readonly DAMAGE_PLAYER:string = "DAMAGE_PLAYER";
	public static readonly OPEN_GATE:string = "OPEN_GATE";
	public static readonly ADD_MONSTER:string = "ADD_MONSTER";
	public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
		super(type, bubbles, cancelable, data);
	}
}