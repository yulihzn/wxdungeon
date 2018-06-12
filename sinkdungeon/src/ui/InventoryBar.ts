class InventoryBar extends egret.DisplayObjectContainer {
	private readonly SIZE: number = 4;
	private itemBitmaps: egret.Bitmap[] = new Array();
	private currentIndex: number = 0;
	private tabselect: egret.Bitmap;
	private inventoryItems: string[] = new Array(4);


	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage(): void {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		for (let i = 0; i < this.SIZE; i++) {
			let tab = new egret.Bitmap(RES.getRes("tabbackground"));
			tab.smoothing = false;
			tab.anchorOffsetX = tab.width / 2;
			tab.anchorOffsetY = tab.height / 2;
			tab.y = tab.height * i + 10;
			tab.touchEnabled = true;
			tab.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.tapTab(i) }, this)
			this.addChild(tab);
		}
		for (let i = 0; i < this.SIZE; i++) {
			let item = new egret.Bitmap(RES.getRes("tabbackground"));
			item.smoothing = false;
			item.anchorOffsetX = item.width / 2;
			item.anchorOffsetY = item.height / 2;
			item.y = item.height * i + 10;
			this.itemBitmaps.push(item);
			this.addChild(item);
		}
		this.tabselect = new egret.Bitmap(RES.getRes("tabselect"));
		this.tabselect.smoothing = false;
		this.tabselect.anchorOffsetX = this.tabselect.width / 2;
		this.tabselect.anchorOffsetY = this.tabselect.height / 2;
		this.tabselect.y = this.tabselect.height * this.currentIndex + 10;
		this.addChild(this.tabselect);

	}
	public clearItems(): void {
		this.inventoryItems = new Array(4);
		for (let i = 0; i < this.SIZE; i++) {
			this.itemBitmaps[i].texture = null;
		}
	}
	public changeItem(itemRes?: string): void {

		let item = ItemManager.getItem(itemRes);
		let tex = null;
		if (item) {
			tex = item.getItem().texture;
		}
		let belowindex = -1;//除去当前格子，是否还有空余格子
		for (let i = 0; i < this.inventoryItems.length; i++) {
			if (i != this.currentIndex && (!this.inventoryItems[i] || this.inventoryItems[i] == ItemConstants.EMPTY)) {
				belowindex = i;
				break;
			}
		}
		if (belowindex == -1) {
			this.refreshItem(this.currentIndex, itemRes);
		} else {
			this.refreshItem(belowindex, itemRes);
		}

	}
	private refreshItem(index: number, itemRes: string): void {
		this.itemBitmaps[index].texture = RES.getRes(itemRes);
		this.itemBitmaps[index].scaleX = 0.25;
		this.itemBitmaps[index].scaleY = 0.25;
		this.inventoryItems[index] = itemRes;
	}
	private tapTab(index: number) {
		this.currentIndex = index;
		this.tabselect.y = this.tabselect.height * this.currentIndex + 10;
		let inventoryEvent = new InventoryEvent(InventoryEvent.TABTAP);
		inventoryEvent.index = index;
		this.dispatchEvent(inventoryEvent);
	}
	public get CurrentItemRes(): string {
		return this.inventoryItems[this.currentIndex];
	}
	public get CurrentIndex(): number {
		return this.currentIndex;
	}
}