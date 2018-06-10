class InventoryEvent extends egret.Event{
	public static TABTAP:string = "TABTAP";
	public index:number = 0;
	public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
		super(type, bubbles, cancelable, data);
	}
}