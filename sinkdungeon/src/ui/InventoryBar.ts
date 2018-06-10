class InventoryBar extends egret.DisplayObjectContainer {
	private readonly SIZE: number = 4;
	private items: egret.Bitmap[] = new Array();
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
			this.items.push(item);
			this.addChild(item);
		}
		this.tabselect = new egret.Bitmap(RES.getRes("tabselect"));
		this.tabselect.smoothing = false;
		this.tabselect.anchorOffsetX = this.tabselect.width / 2;
		this.tabselect.anchorOffsetY = this.tabselect.height / 2;
		this.tabselect.y = this.tabselect.height * this.currentIndex + 10;
		this.addChild(this.tabselect);

	}
	public clearItems():void{
		this.inventoryItems = new Array(4);
		for(let i=0;i<this.SIZE;i++){
			this.items[i].texture = null;
		}
	}
	public changeItem(itemRes?: string): void {
		this.inventoryItems[this.currentIndex] = itemRes;
		let item = ItemManager.getItem(itemRes);
		let tex = null;
		if (item) {
			tex = item.getItem().texture;
		}
		this.items[this.currentIndex].texture = tex;
		this.items[this.currentIndex].scaleX = 0.25;
		this.items[this.currentIndex].scaleY = 0.25;

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