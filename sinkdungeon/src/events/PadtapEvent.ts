/**
 * 方向键点击事件
 */
class PadtapEvent extends egret.Event{
	public static PADTAP:string = "padtap";
	public dir:number = -1;
	public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
		super(type, bubbles, cancelable, data);
	}
}