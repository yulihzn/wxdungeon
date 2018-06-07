class Gem extends Item {
	public constructor(type: number) {
		super(type);
	}
	protected init():void{
		this.width = 64;
		this.height = 64;
		this.anchorOffsetX = 32;
		this.anchorOffsetY = 32;
		this.item = new egret.Bitmap(RES.getRes("gem0" + this.type));
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
	public changeRes(type: number): void {
		this.type = type;
		this.item.texture = RES.getRes("gem0" + this.type)
	}
	public getType(): number {
		return this.type;
	}
	public isAutoPicking(): boolean {
		return true;
	}

	public taken(): boolean {
		if (super.taken()) {
			//tile所在的dungeon发消息
			this.parent.parent.dispatchEventWith(LogicEvent.GET_GEM, false, { score: this.type * 10 });
			return true;
		}
		return false;
	}
}