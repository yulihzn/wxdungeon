class Player extends egret.DisplayObjectContainer{
	private player: egret.Bitmap;
	private playerShadow:egret.Bitmap;
	private walking:boolean = false;
	private isdead:boolean = false;
	public pos: egret.Point = new egret.Point();
	public constructor() {
		super();
		this.init();
	}

	private init(): void {
		this.player = new egret.Bitmap(RES.getRes("player"));
		this.playerShadow = new egret.Bitmap(RES.getRes("shadow"));
		let index = 0
		this.player.anchorOffsetX = this.player.width/2;
		this.player.anchorOffsetY = this.player.height;
		this.player.x = 0;
		this.player.y = 0;
		this.playerShadow.anchorOffsetX = this.playerShadow.width/2;
		this.playerShadow.anchorOffsetY = this.playerShadow.height/2;
		this.playerShadow.x = 0;
		this.playerShadow.y = 0;
		this.playerShadow.alpha = 0.3;
		this.playerShadow.scaleX=2;
		this.playerShadow.scaleY=2;
		this.addChild(this.player);
		this.addChild(this.playerShadow);
	}
	public isWalking():boolean{
		return this.walking;
	}
	public isDying():boolean{
		return this.isdead;
	}
	public resetPlayer():void{
		egret.Tween.removeTweens(this.player);
		egret.Tween.removeTweens(this);
		this.parent.setChildIndex(this,100);
		this.player.scaleX = 1;
		this.player.scaleY = 1;
		this.player.visible = true;
		this.player.alpha = 1;
		this.player.x = 0;
		this.player.y = 0;
		this.playerShadow.visible = true;
		this.isdead = false;
		this.walking = false;
	}
	public die():void{
		if(this.isdead){
			return;
		}
		this.isdead = true;
		this.playerShadow.visible = false;
		egret.Tween.get(this.player).to({y:32,scaleX:0.5,scaleY:0.5},200).call(()=>{
			this.parent.setChildIndex(this,0);
		}).to({scaleX:0.2,scaleY:0.2,y:100},100).call(()=>{this.player.alpha=0;});
	}
	public walk(px:number,py:number,dir:number,reachable:boolean):void{
		if(this.walking){
			console.log("cant")
			return;
		}
		this.walking = true;
		let offsetY = 10;
		let ro = 10;
		if(dir==1||dir==3){
			offsetY = -offsetY;
			ro = -ro;
		}
		egret.Tween.get(this.player,{loop:true})
		.to({rotation:ro,y:this.player.y+offsetY},25)
		.to({rotation:0,y:0},25)
		.to({rotation:-ro,y:this.player.y-offsetY},25)
		.to({rotation:0,y:0},25);
		egret.Tween.get(this,{onChange:()=>{}}).to({x:
			px,y:py},200).call(()=>{
				egret.Tween.removeTweens(this.player);
				this.player.rotation = 0;
				this.player.y = 0;
				this.walking = false;
				if(!reachable){
					this.die();
				}
			});
	}
}