class Tile extends egret.DisplayObjectContainer {
	public floor: egret.Bitmap;
	public building: Building;
	public item: Item;
	public posIndex: egret.Point;
	public constructor(x: number, y: number) {
		super()
		this.posIndex = new egret.Point(x, y);
		this.init();
	}
	private init(): void {
		let t = new egret.Bitmap(RES.getRes("tile_png"));
		this.width = t.width;
		this.height = t.height;
		t.anchorOffsetX = t.width / 2;
		t.anchorOffsetY = t.height / 2;
		t.scaleX = 1;
		t.scaleY = 1;
		this.floor = t;
		this.addChild(this.floor);
	}
	public addItem(item: Item): Tile {
		this.item = item;
		this.addChildAt(this.item, 1000);
		return this;
	}
	public addBuilding(building: Building): Tile {
		this.building = building;
		this.addChild(this.building);
		return this;
	}

	public showTile(): void {
		this.floor.alpha = 0;
		this.floor.scaleX = 1;
		this.floor.scaleY = 1;
		this.floor.x = 0;
		this.floor.y = 0;
		this.floor.visible = true;
		egret.Tween.get(this.floor).to({ alpha: 1}, 100).call(() => {
		})
	}

	public breakTile(finish): void {
		//发送breaktile消息
		let y = this.floor.y;
		if (this.posIndex.x == Math.floor(Logic.SIZE / 2) && this.posIndex.y == Math.floor(Logic.SIZE / 2)) {
			return;
		}
		
		egret.Tween.get(this.floor, { loop: true })
			.to({ y: y + 5 }, 25)
			.to({ y: y }, 25)
			.to({ y: y - 5 }, 25)
			.to({ y: y }, 25);
		egret.Tween.get(this.floor).wait(2000).call(() => {
			egret.Tween.removeTweens(this.floor);
			egret.Tween.get(this.floor).to({ scaleX: 0.7, scaleY: 0.7 }, 700).to({ alpha: 0 }, 300).call(() => {
				this.floor.visible = false;
				if (finish) {
					finish();
				}
			})
		});


	}
}