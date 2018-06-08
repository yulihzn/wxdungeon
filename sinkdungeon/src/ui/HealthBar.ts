class HealthBar extends egret.DisplayObjectContainer {
	private currentHealth: number = 3;
	private maxHealth: number = 3;
	private hearts: egret.Bitmap[] = new Array();
	public constructor() {
		super()
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage(): void {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.refreshHealth(this.currentHealth,this.maxHealth);

	}
	public refreshHealth(currentHealth:number,maxHealth:number): void {
		this.currentHealth = currentHealth;
		this.maxHealth = maxHealth;
		this.removeChildren();
		this.hearts = new Array();
		for (let i = 0; i < this.maxHealth; i++) {
			let heart = new egret.Bitmap(RES.getRes("heart"));
			heart.smoothing = false;
			heart.anchorOffsetX = heart.width/2;
			heart.anchorOffsetY = heart.height/2;
			heart.x = heart.width*i
			if(i>=this.currentHealth){
				heart.texture = RES.getRes("heartempty")
			}
			this.hearts.push(heart);
			this.addChild(heart);
		}
	}
}