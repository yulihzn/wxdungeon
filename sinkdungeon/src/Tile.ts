class Tile extends egret.DisplayObjectContainer {
	public static readonly WIDTH: number = 64;
	public static readonly HEIGHT: number = 64;
	public floor: egret.Bitmap;
	public building: Building;
	// public item: Item;
	public posIndex: egret.Point;
	public isBreakingNow = false;
	public isLooping = true;
	public constructor(x: number, y: number) {
		super()
		this.posIndex = new egret.Point(x, y);
		this.init();
	}
	private init(): void {
		let t = new egret.Bitmap(RES.getRes("tile"));
		t.smoothing = false;
		this.width = Tile.WIDTH;
		this.height = Tile.WIDTH;
		t.anchorOffsetX = t.width / 2;
		t.anchorOffsetY = t.height / 2;
		t.scaleX = 4;
		t.scaleY = 4;
		this.floor = t;
		this.addChild(this.floor);
	}
	// public addItem(item: Item): Tile {
	// 	if(this.item){
	// 		this.removeChild(this.item)
	// 	}
	// 	this.item = item;
	// 	this.addChildAt(this.item, 1000);
	// 	return this;
	// }
	public addBuilding(building: Building): Tile {
		this.building = building;
		this.addChild(this.building);
		return this;
	}

	public showTile(): void {
		this.floor.alpha = 0;
		this.floor.scaleX = 4;
		this.floor.scaleY = 4;
		this.floor.x = 0;
		this.floor.y = 0;
		this.floor.visible = true;

		egret.Tween.get(this.floor).to({ alpha: 1 }, 200).wait(1000).call(() => {
			this.isBreakingNow = false;
		})
	}

	public breakTile(isLooping: boolean): Promise<egret.Point> {
		//当前tile没有建筑可见，开始塌陷
		if (this.building && this.building.visible || this.isBreakingNow) {
			return;
		}
		this.isBreakingNow = true;
		let y = this.floor.y;
		egret.Tween.get(this.floor, { loop: true })
			.to({ y: y + 5 }, 25)
			.to({ y: y }, 25)
			.to({ y: y - 5 }, 25)
			.to({ y: y }, 25);
		egret.Tween.get(this.floor).wait(2000).call(() => {
			egret.Tween.removeTweens(this.floor);
			egret.Tween.get(this.floor).to({ scaleX: 3, scaleY: 3 }, 700).to({ alpha: 0 }, 300).call(() => {
				this.floor.visible = false;
				Logic.eventHandler.dispatchEventWith(LogicEvent.DUNGEON_BREAKTILE, false, this.posIndex)
			}).wait(1000).call(() => {
				if (isLooping) {
					this.showTile();
				}
			})
		});

	}
}