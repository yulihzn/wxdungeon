class InventoryBar extends egret.DisplayObjectContainer {
	private readonly SIZE: number = 4;
	private items: egret.Bitmap[] = new Array();
	private currentIndex: number = 0;
	private tabselect: egret.Bitmap;
	private itemStrs: string[] = new Array();

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
			this.items.push(item);
			this.addChild(item);
		}
		this.tabselect = new egret.Bitmap(RES.getRes("tabselect"));
		this.tabselect.smoothing = false;
		this.tabselect.anchorOffsetX = this.tabselect.width / 2;
		this.tabselect.anchorOffsetY = this.tabselect.height / 2;
		this.tabselect.y = this.tabselect.height * this.currentIndex + 10;
		this.addChild(this.tabselect);
		this.itemStrs = [ItemConstants.CAPSULE_BLUE, ItemConstants.CAPSULE_RED, ItemConstants.CAPSULE_BLUE, ItemConstants.EMPTY];
		for (let i = 0; i < this.itemStrs.length; i++) {
			this.items[i].texture = RES.getRes(this.itemStrs[i]);
			this.items[i].scaleX = 0.25;
			this.items[i].scaleY = 0.25;
		}
	}
	public changeItem(index?: number, resStr?: string): void {
		if (!resStr) {
			resStr = "ItemConstants.EMPTY";
		}
		if (!index || index < 0 || index >= this.SIZE) {
			return;
		}
		this.itemStrs[index] = resStr;
		this.items[index].texture = RES.getRes(resStr);
		this.items[index].scaleX = 0.25;
		this.items[index].scaleY = 0.25;
	}
	private tapTab(index: number) {
		this.currentIndex = index;
		this.tabselect.y = this.tabselect.height * this.currentIndex + 10;
		let inventoryEvent = new InventoryEvent(InventoryEvent.TABTAP);
		inventoryEvent.index = index;
		inventoryEvent.resStr = this.itemStrs[index];
		this.dispatchEvent(inventoryEvent);
	}
	public get CurrentStrRes(): string {
		return this.itemStrs[this.currentIndex];
	}
	public get CurrentIndex(): number {
		return this.currentIndex;
	}
}