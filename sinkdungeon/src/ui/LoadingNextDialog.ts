class LoadingNextDialog extends egret.DisplayObjectContainer {
	private bg: egret.Shape;
	private textTips: egret.TextField;
	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage(): void {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.bg = new egret.Shape();
		this.addChild(this.bg);
		this.bg.alpha = 0;
		this.bg.graphics.beginFill(0x000000, 1)
		this.bg.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
		this.bg.graphics.endFill();

		this.textTips = new egret.TextField();
		this.addChild(this.textTips);
		this.textTips.alpha = 0;
		this.textTips.textAlign = egret.HorizontalAlign.CENTER;
		this.textTips.size = 70;
		this.textTips.width = this.stage.width;
		this.textTips.textColor = 0xffffff;
		this.textTips.x = 0;
		this.textTips.y = this.stage.height / 2 - 200;
		this.textTips.text = 'Level ';

	}
	public show(level: number, finish): void {
		this.alpha = 1;
		this.bg.alpha = 0;
		this.textTips.text = 'Level ' + level;
		this.textTips.scaleX = 1;
		this.textTips.scaleY = 1;
		this.textTips.y = this.stage.height / 2 - 200;
		this.textTips.alpha = 0;
		this.visible = true;
		egret.Tween.get(this.bg).to({ alpha: 1 }, 500);
		egret.Tween.get(this.textTips).wait(200).to({ y: this.textTips.y + 20, alpha: 1 }, 500).wait(200).call(() => {
			egret.Tween.get(this).to({ alpha: 0 }, 200);
			if (finish) {
				finish();
			}
		});
	}

}