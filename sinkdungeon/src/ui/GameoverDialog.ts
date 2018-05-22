class GameoverDialog extends egret.DisplayObjectContainer {
	private bg:egret.Shape;
	private text:egret.TextField;
	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage(): void {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.bg = new egret.Shape();
		this.addChild(this.bg);
		this.bg.graphics.beginFill(0x000000,0)
		this.bg.graphics.drawRect(0,0,this.stage.width,this.stage.y);
		this.bg.graphics.endFill();

		this.text = new egret.TextField();
        this.addChild(this.text);
        this.text.alpha = 0;
        this.text.textAlign = egret.HorizontalAlign.CENTER;
        this.text.size = 50;
        this.text.textColor = 0xff0000;
        this.text.x = this.stage.width/2;
        this.text.y = this.stage.height/2-200;
		this.text.text = 'you die';
	}
	public show():void{
	}
}