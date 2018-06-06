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
	protected init(): void {
		this.width = 64;
		this.height = 64;
		this.anchorOffsetX = 32;
		this.anchorOffsetY = 32;
		this.item = new egret.Bitmap(RES.getRes("gem0" + this.type));
		this.shadow = new egret.Bitmap(RES.getRes("shadow"));
		let index = 0
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