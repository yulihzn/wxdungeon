class ItemManager extends egret.DisplayObjectContainer {
	public itemMap: { [key: string]: Item } = {};
	public constructor() {
		super()
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage(): void {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	public static getItem(resName: string):Item{
		let item: Item;
		switch (resName) {
			case ItemConstants.GEM_GREEN:
			case ItemConstants.GEM_YELLOW:
			case ItemConstants.GEM_PURPLE:
			case ItemConstants.GEM_RED: item = new Gem(resName); break;
			case ItemConstants.CAPSULE_RED: item = new Capsule(resName); break;
			case ItemConstants.CAPSULE_BLUE: item = new Capsule(resName); break;
		}
		return item;
	}
	public addItem(resName: string, posIndex: egret.Point): Item {
		let item: Item = ItemManager.getItem(resName);
		if(!item){
			return item;
		}
		item.posIndex = new egret.Point(posIndex.x, posIndex.y);
		item.x = Logic.mapX + posIndex.x * Tile.WIDTH;
		item.y = Logic.mapY + posIndex.y * Tile.HEIGHT;
		let old = this.itemMap[`x=${posIndex.x}y=${posIndex.y}`];
		if (old) {
			this.removeChild(old);
			old = null;
		}
		this.itemMap[`x=${posIndex.x}y=${posIndex.y}`] = item;
		this.addChild(item);
		return item;
	}
	public getItem(posIndex: egret.Point):Item{
		return this.itemMap[`x=${posIndex.x}y=${posIndex.y}`];
	}

	public removeAllItems():void{
		for(let key in this.itemMap){
			let item = this.itemMap[key];
			if(item){this.removeChild(item);}
			this.itemMap[key] = null;
		}
	}


}