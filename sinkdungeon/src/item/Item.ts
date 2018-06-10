abstract class Item extends egret.DisplayObjectContainer {
	protected item: egret.Bitmap;
	protected shadow: egret.Bitmap;
	protected type: string = ItemConstants.EMPTY;
	protected canTaken: boolean = false;
	public posIndex: egret.Point = new egret.Point();
	//使用次数为-1代表无限
	protected useCount:number = -1;
	public constructor(type: string) {
		super();
		this.type = type;
		this.init();
	}
	protected init(): void {
		this.width = 64;
		this.height = 64;
		this.anchorOffsetX = 32;
		this.anchorOffsetY = 32;
		this.item = new egret.Bitmap(RES.getRes(this.type));
		this.item.smoothing = false;
		this.shadow = new egret.Bitmap(RES.getRes("shadow"));
		this.shadow.smoothing = false;
		this.item.anchorOffsetX = this.item.width / 2;
		this.item.anchorOffsetY = this.item.height / 2;
		this.item.x = 32;
		this.item.y = 16;
		this.shadow.anchorOffsetX = this.shadow.width / 2;
		this.shadow.anchorOffsetY = this.shadow.height / 2;
		this.shadow.x = 32;
		this.shadow.y = 32;
		this.shadow.alpha = 0.3;
		this.shadow.scaleX = 1;
		this.shadow.scaleY = 1;
		this.addChild(this.shadow);
		this.addChild(this.item);
		let y = this.item.y;
		egret.Tween.get(this.item, { loop: true })
			.to({ scaleX: 0.5, y: y + 8 }, 1000)
			.to({ scaleX: 0, y: y }, 1000)
			.to({ scaleX: 0.5, y: y + 8 }, 1000)
			.to({ scaleX: 1, y: y }, 1000);
		this.visible = false;
	}
	public getType(): string {
		return this.type;
	}
	public getItem(): egret.Bitmap {
		return this.item;
	}
	public taken(): boolean {
		if (!this.visible || !this.canTaken) {
			return false;
		}
		this.canTaken = false;
		egret.Tween.removeTweens(this.item)
		this.item.scaleX = 1;
		this.item.alpha = 1;
		egret.Tween.get(this.item)
			.to({ scaleX: 2, scaleY: 2, y: this.item.y - 128 }, 500)
			.to({ alpha: 0 }, 100).call(() => {
				this.visible = false;
			});
		return true;
	}
	public show(): void {
		egret.Tween.removeTweens(this.item);
		this.item.x = 32;
		this.item.y = 16;
		this.item.scaleX = 1;
		this.item.scaleY = 1;
		this.item.alpha = 1;
		this.visible = true;
		this.canTaken = true;
		let y = this.item.y;
		egret.Tween.get(this.item, { loop: true })
			.to({ scaleX: 0.5, y: y + 8 }, 1000)
			.to({ scaleX: 0, y: y }, 1000)
			.to({ scaleX: 0.5, y: y + 8 }, 1000)
			.to({ scaleX: 1, y: y }, 1000);
	}
	public hide(): void {
		this.canTaken = false;
		egret.Tween.removeTweens(this.item)
		this.item.scaleX = 1;
		this.visible = false;
	}
	public use(): boolean {
		if(this.useCount == -1){

		}else if (this.useCount > 1) {
			this.useCount--;
		}
		if(this.useCount == 0){
			return false;
		}
		return true;
	}
	public changeRes(type: string): void {
		this.type = type;
		this.item.texture = RES.getRes(this.type)
	}
	public abstract isAutoPicking(): boolean;
}