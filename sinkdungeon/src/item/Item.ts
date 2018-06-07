abstract class Item extends egret.DisplayObjectContainer {
	protected item: egret.Bitmap;
	protected shadow: egret.Bitmap;
	protected type: number;
	protected canTaken: boolean = false;
	public constructor(type: number) {
		super();
		this.type = type;
		this.init();
	}
	protected abstract init(): void;
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
	public abstract changeRes(type: number): void;
	public abstract isAutoPicking(): boolean;
}