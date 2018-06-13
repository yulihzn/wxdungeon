abstract class Item extends egret.DisplayObjectContainer {
	protected item: egret.Bitmap;
	protected itemSprite: egret.Sprite;
	protected shadow: egret.Bitmap;
	protected type: string = ItemConstants.EMPTY;
	protected canTaken: boolean = false;
	protected data:ItemData = new ItemData();
	
	public posIndex: egret.Point = new egret.Point();
	//使用次数是否为无限
	protected isInfinity: boolean = false;
	public constructor(type: string) {
		super();
		this.type = type;
		this.init();
	}
	protected init(): void {
		this.itemSprite = new egret.Sprite();
		this.width = 64;
		this.height = 64;
		this.anchorOffsetX = 32;
		this.anchorOffsetY = 32;
		this.item = new egret.Bitmap(RES.getRes(this.type));
		this.item.smoothing = false;
		this.itemSprite.width = this.item.width;
		this.itemSprite.height = this.item.height;
		this.itemSprite.anchorOffsetX = this.item.width/2;
		this.itemSprite.anchorOffsetY = this.item.height;
		this.shadow = new egret.Bitmap(RES.getRes("shadow"));
		this.shadow.smoothing = false;
		this.itemSprite.x = 32;
		this.itemSprite.y = 8;
		this.shadow.anchorOffsetX = this.shadow.width / 2;
		this.shadow.anchorOffsetY = this.shadow.height / 2;
		this.shadow.x = 32;
		this.shadow.y = 32;
		this.shadow.alpha = 0.3;
		this.shadow.scaleX = 1;
		this.shadow.scaleY = 1;
		this.addChild(this.shadow);
		this.addChild(this.itemSprite);
		this.itemSprite.addChild(this.item);
		let y = this.itemSprite.y;
		egret.Tween.get(this.itemSprite, { loop: true })
			.to({ scaleX: 0.5, y: y + 8 }, 1000)
			.to({ scaleX: 0, y: y }, 1000)
			.to({ scaleX: 0.5, y: y + 8 }, 1000)
			.to({ scaleX: 1, y: y }, 1000);
		this.visible = false;
	}
	public get Data():ItemData{
		return this.data;
	}
	public getType(): string {
		return this.type;
	}
	public getItem(): egret.Bitmap {
		return this.item;
	}
	public get IsInfinity(): boolean {
		return this.isInfinity;
	}
	public taken(finish): boolean {
		if (!this.visible || !this.canTaken) {
			return false;
		}
		this.canTaken = false;
		egret.Tween.removeTweens(this.itemSprite)
		this.itemSprite.scaleX = 1;
		this.itemSprite.alpha = 1;
		egret.Tween.get(this.itemSprite)
			.to({ scaleX: 2, scaleY: 2, y: this.itemSprite.y - 128 }, 500)
			.to({ alpha: 0 }, 100).call(() => {
				this.visible = false;
				if(finish){
					finish();
				}
			});
		return true;
	}
	public show(): void {
		egret.Tween.removeTweens(this.itemSprite);
		this.itemSprite.x = 32;
		this.itemSprite.y = 8;
		this.itemSprite.scaleX = 1;
		this.itemSprite.scaleY = 1;
		this.itemSprite.alpha = 1;
		this.visible = true;
		this.canTaken = true;
		let y = this.itemSprite.y;
		egret.Tween.get(this.itemSprite, { loop: true })
			.to({ scaleX: 0.5, y: y + 8 }, 1000)
			.to({ scaleX: 0, y: y }, 1000)
			.to({ scaleX: 0.5, y: y + 8 }, 1000)
			.to({ scaleX: 1, y: y }, 1000);
	}
	public hide(): void {
		this.canTaken = false;
		egret.Tween.removeTweens(this.itemSprite)
		this.visible = false;
	}
	/**主动触发 */
	public abstract use(): void;
	/**被动触发 */
	public passiveUse(): void {
	}
	public changeRes(type: string): void {
		this.type = type;
		this.item.texture = RES.getRes(this.type)
	}
	public abstract isAutoPicking(): boolean;
}