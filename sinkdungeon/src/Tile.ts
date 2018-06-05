class Tile extends egret.DisplayObjectContainer {
	public static readonly WIDTH:number = 64;
	public static readonly HEIGHT:number = 64;
	public floor: egret.Bitmap;
	public building: Building;
	public item: Item;
	public posIndex: egret.Point;
	private isLooping = false;
	public constructor(x: number, y: number) {
		super()
		this.posIndex = new egret.Point(x, y);
		this.init();
	}
	private init(): void {
		let t = new egret.Bitmap(RES.getRes("tile"));
		this.width = Tile.WIDTH;
		this.height = Tile.WIDTH;
		t.anchorOffsetX = Tile.WIDTH / 2;
		t.anchorOffsetY = Tile.WIDTH / 2;
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

	public showTile(isLooping:boolean): void {
		this.isLooping = isLooping;
		this.floor.alpha = 0;
		this.floor.scaleX = 1;
		this.floor.scaleY = 1;
		this.floor.x = 0;
		this.floor.y = 0;
		this.floor.visible = true;
		egret.Tween.get(this.floor).to({ alpha: 1 }, 200).wait(1000).call(() => {
			if (this.isLooping) {
				this.breakTile(this.isLooping);
			}
		})
	}

	public breakTile(isLooping:boolean): Promise<egret.Point> {
		this.isLooping = isLooping;
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
				this.parent.dispatchEventWith(LogicEvent.DUNGEON_BREAKTILE,false,this.posIndex)
			}).wait(1000).call(() => {
				if (this.isLooping) {
					this.showTile(this.isLooping);
				}
			})
		});

	}
}