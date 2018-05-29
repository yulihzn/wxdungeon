abstract class Item extends egret.DisplayObjectContainer{
	public constructor() {
		super();
	}
	public abstract taken():void;
	public abstract show():void;
	public abstract hide():void;
	public abstract setId(type:number):void;
}