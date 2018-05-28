class Portal extends Building {
	private gate: egret.Bitmap;
	private light: egret.Bitmap;
	private type:number;
	private isOpen:boolean = false;
	public constructor() {
		super()
		this.init();
	}
	
	public getType():number{
		return this.type;
	}
	private init(): void {
		this.width = 64;
		this.height = 64;
		this.anchorOffsetX = 32;
		this.anchorOffsetY = 32;
		this.gate = new egret.Bitmap(RES.getRes("portal_png"));
		this.light = new egret.Bitmap(RES.getRes("portallight_png"));
		let index = 0
		this.gate.anchorOffsetX = this.gate.width / 2;
		this.gate.anchorOffsetY = this.gate.height / 2;
		this.gate.x = this.width/2;
		this.gate.y = this.height/2;
		this.light.anchorOffsetX = this.light.width / 2;
		this.light.anchorOffsetY = this.light.height / 2;
		this.light.x = this.width/2;
		this.light.y = this.width/2;
		this.light.alpha = 0.5;
		this.light.scaleX = 1;
		this.light.scaleY = 1;
		this.addChild(this.gate);
		this.addChild(this.light);
		this.isOpen = false;
		this.visible = false;
		egret.Tween.get(this.light, { loop: true })
			.to({ skewX: 2,skewY:-2}, 1000)
			.to({ skewX: 0,skewY:0}, 1000)
			.to({ skewX: -2,skewY:2}, 1000)
			.to({ skewX: 0,skewY:0}, 1000);
	}
	public show(x: number, y: number): void {
		this.alpha = 0;
		this.scaleX = 0.1;
		this.scaleY = 0.1;
		this.visible = true;
		this.x = x;
		this.y = y;
		this.isOpen = false;
		egret.Tween.get(this)
			.to({alpha: 1,scaleX:1,scaleY:1}, 500).call(() => {
				egret.Tween.get(this.light).to({scaleX:10},1000);
			});
	}
	public closeGate():void{
		this.isOpen = false;
		egret.Tween.get(this.light)
			.to({scaleY:1}, 1000).call(() => {
				
			});
	}
	public openGate(): void {
		this.isOpen = true;
		if(!this.visible){
			return;
		}
		egret.Tween.get(this.light)
			.to({ scaleY: 20}, 500).call(() => {
				
			});
	}
}