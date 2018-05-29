class Portal extends Building {
	private gate: egret.Bitmap;
	private light: egret.Bitmap;
	private type:number;
	private isOpen:boolean = false;
	public posIndex:egret.Point;
	public constructor(x:number,y:number) {
		super()
		this.posIndex = new egret.Point(x,y);
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
		this.light.y = 0;
		this.light.alpha = 0.75;
		this.light.scaleX = 1;
		this.light.scaleY = 1;
		this.addChild(this.gate);
		this.addChild(this.light);
		this.isOpen = false;
		this.visible = false;
		egret.Tween.get(this.light, { loop: true })
			.to({ skewX: 5,skewY:-2}, 1000)
			.to({ skewX: 0,skewY:0}, 1000)
			.to({ skewX: -5,skewY:2}, 1000)
			.to({ skewX: 0,skewY:0}, 1000);
	}
	public show(): void {
		this.alpha = 0;
		this.scaleX = 0.1;
		this.scaleY = 0.1;
		this.light.scaleX = 0.1;
		this.light.scaleY = 0.1;
		this.visible = true;
		this.isOpen = false;
		egret.Tween.get(this)
			.to({alpha: 1,scaleX:1,scaleY:1}, 500).call(() => {
				
			});
	}
	public closeGate():void{
		if(!this.visible||!this.isOpen){
			return;
		}
		this.isOpen = false;
		egret.Tween.get(this.light)
			.to({scaleY:0.1}, 500).to({scaleX:0.1}, 200).call(() => {
				
			});
	}
	public openGate(): void {
		if(!this.visible||this.isOpen){
			return;
		}
		this.isOpen = true;
		egret.Tween.get(this.light).to({scaleX:1},500).to({scaleY:1},200).call(()=>{

		});
	}
	public isGateOpen():boolean{
		return this.isOpen;
	}
}