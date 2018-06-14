class Bullet extends egret.Sprite {
	private bitmap: egret.Bitmap;
	public posIndex: egret.Point;
	public originIndex: egret.Point;
	//穿过一格需要的时间
	public speed: number = 100;
	private damage:number = 2;
	public constructor(x: number, y: number) {
		super();
		this.posIndex = new egret.Point(x, y);
		this.originIndex = new egret.Point(x, y);
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage(): void {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		let p = Logic.getInMapPos(this.originIndex);
		this.x = p.x;
		this.y = p.y;
		this.bitmap = new egret.Bitmap(RES.getRes(BulletConstants.BUBBLE));
		this.bitmap.anchorOffsetX = this.bitmap.width / 2;
		this.bitmap.anchorOffsetY = this.bitmap.height / 2;
		this.bitmap.scaleX = 1;
		this.bitmap.scaleY = 1;
		this.addChild(this.bitmap);
		this.visible = false;
	}
	public fire(dir, perMove): void {
		if (this.visible) {
			return;
		}
		//top bottom left right
		let offsetX = 0;
		let offsetY = 0;
		switch (dir) {
			case 0: offsetY = -Tile.WIDTH; break;
			case 1: offsetY = Tile.WIDTH; break;
			case 2: offsetX = -Tile.HEIGHT; break;
			case 3: offsetX = Tile.HEIGHT; break;
		}
		egret.Tween.removeTweens(this);
		egret.Tween.removeTweens(this.bitmap);
		this.visible = true;
		let p = Logic.getInMapPos(this.originIndex);
		this.x = p.x;
		this.y = p.y;
		this.posIndex.x = this.originIndex.x;
		this.posIndex.y = this.originIndex.y;
		egret.Tween.get(this.bitmap, { loop: true })
			.to({ x: 5 }, 25)
			.to({ x: 0 }, 25)
			.to({ x: - 5 }, 25)
			.to({ x: 0 }, 25);
		egret.Tween.get(this.bitmap).to({ scaleX: 2, scaleY: 2 }, 500).call(() => {
			egret.Tween.removeTweens(this.bitmap);
			egret.Tween.get(this.bitmap, { loop: true })
				.to({ scaleX: 2, scaleY: 2 }, 25)
				.to({ scaleX: 1.5, scaleY: 1.5 }, 25)
				.to({ scaleX: 2.5, scaleY: 2.5 }, 25)
				.to({ scaleX: 2, scaleY: 2 }, 25);
			this.fly(dir, offsetX, offsetY, perMove);
		})
	}
	private fly(dir: number, offsetX: number, offsetY: number, perMove): void {
		let p1 = Logic.getInMapPos(new egret.Point(0, 0));
		let p2 = Logic.getInMapPos(new egret.Point(8, 8));
		egret.Tween.get(this).to({ x: this.x + offsetX, y: this.y + offsetY }, this.speed).call(() => {
			if (this.x < p1.x || this.x > p2.x || this.y < p1.y || this.y > p2.y) {
				this.visible = false;
				return;
			}
			switch (dir) {
				case 0: this.posIndex.y -= 1; break;
				case 1: this.posIndex.y += 1; break;
				case 2: this.posIndex.x -= 1; break;
				case 3: this.posIndex.x += 1;; break;
			}
			if (perMove) {
				perMove();
			}
			this.fly(dir, offsetX, offsetY, perMove);
		})
	}
	public hit():void{
		Logic.eventHandler.dispatchEventWith(LogicEvent.DAMAGE_PLAYER, false, { damage: this.damage });
		this.visible = false;
		egret.Tween.removeTweens(this);
		egret.Tween.removeTweens(this.bitmap);
	}
}