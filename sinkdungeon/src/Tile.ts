class Tile extends egret.DisplayObjectContainer {
	public floor: egret.Bitmap;
	public building: Building;
	public item: Item;
	public constructor() {
		super()
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
	public addItem(item:Item):Tile{
		this.item = item;
		this.addChild(this.item);
		return this;
	}
	public addBuilding(building:Building):Tile{
		this.building = building;
		this.addChild(this.building);
		return this;
	}
}