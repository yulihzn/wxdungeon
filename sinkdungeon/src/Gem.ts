class Gem extends egret.DisplayObjectContainer{
	private item:egret.Bitmap;
	private shadow:egret.Bitmap;
	private id:string;
	public constructor(id:string) {
		super()
		this.id = id;
		this.init();
	}
	public setId(id:string):void{
		this.id = id;
		this.item.texture = RES.getRes("gem"+this.id+"_png")
	}
	private init(): void {
		this.item = new egret.Bitmap(RES.getRes("gem"+this.id+"_png"));
		this.shadow = new egret.Bitmap(RES.getRes("shadow_png"));
		let index = 0
		this.item.anchorOffsetX = this.item.width/2;
		this.item.anchorOffsetY = this.item.height/2;
		this.item.x = 0;
		this.item.y = 0;
		this.item.scaleX=0.5;
		this.item.scaleY=0.5;
		this.shadow.anchorOffsetX = this.shadow.width/2;
		this.shadow.anchorOffsetY = this.shadow.height/2;
		this.shadow.x = 0;
		this.shadow.y = 0;
		this.shadow.alpha = 0.3;
		this.shadow.scaleX=2;
		this.shadow.scaleY=2;
		this.addChild(this.shadow);
		this.addChild(this.item);
	}
}